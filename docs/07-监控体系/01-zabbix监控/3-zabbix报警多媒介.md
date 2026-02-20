## Zabbix报警多媒介配置

### 一、报警媒介类型

Zabbix支持多种报警媒介，包括：

- **邮件**：传统的邮件告警
- **企业微信**：适合企业内部通知
- **钉钉**：阿里系企业常用
- **短信**：紧急告警通知
- **Webhook**：自定义HTTP通知

---

### 二、邮件报警配置

#### 1. 配置邮件服务器

编辑 `/etc/zabbix/zabbix_server.conf`：

```ini
AlertScriptsPath=/usr/lib/zabbix/alertscripts
```

#### 2. 创建邮件脚本

```bash
cat > /usr/lib/zabbix/alertscripts/sendmail.sh <<'EOF'
#!/bin/bash
to=$1
subject=$2
body=$3

echo "$body" | mail -s "$subject" "$to"
EOF

chmod +x /usr/lib/zabbix/alertscripts/sendmail.sh
```

#### 3. 配置报警媒介类型

- 管理 → 报警媒介类型 → 创建媒介类型
- 名称：Email
- 类型：脚本
- 脚本名称：sendmail.sh
- 添加参数：
  - `{ALERT.SENDTO}`
  - `{ALERT.SUBJECT}`
  - `{ALERT.MESSAGE}`

#### 4. 配置用户报警媒介

- 管理 → 用户 → 选择用户 → 报警媒介
- 类型：Email
- 收件人：your_email@example.com
- 启用：勾选

---

### 三、企业微信报警配置

#### 1. 获取企业微信凭证

- 登录企业微信管理后台
- 创建应用，获取：
  - corpid（企业ID）
  - agentid（应用ID）
  - corpsecret（应用密钥）
  - 部门ID（toparty）

#### 2. 创建企业微信报警脚本

```bash
cat > /usr/lib/zabbix/alertscripts/wechat.sh <<'EOF'
#!/bin/bash
corpid='ww1a3ae3a70b9b398b'
agentid='1000002'
corpsecret='wUI5inVC0O6fBTUSM5S3IOfX64daDFhK2p_tiTuLv6U'

group=$1
title=$2
message=$3

token=$(curl -s -X GET "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}" | awk -F \" '{print $10}')

curl -s -H "Content-Type: application/json" -X POST \
  "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}" \
  -d'{
   "toparty": "'"${group}"'",
   "msgtype": "text",
   "agentid": "'"${agentid}"'",
   "text": {
       "content": "'"${title}\n\n${message}"'"
   },
   "safe":0
}'
EOF

chmod +x /usr/lib/zabbix/alertscripts/wechat.sh
```

#### 3. 配置报警媒介类型

- 管理 → 报警媒介类型 → 创建媒介类型
- 名称：企业微信
- 类型：脚本
- 脚本名称：wechat.sh
- 添加参数：
  - `{ALERT.SENDTO}`
  - `{ALERT.SUBJECT}`
  - `{ALERT.MESSAGE}`

#### 4. 配置用户报警媒介

- 管理 → 用户 → 选择用户 → 报警媒介
- 类型：企业微信
- 收件人：部门ID（如：1）
- 启用：勾选

---

### 四、钉钉报警配置

#### 1. 获取钉钉凭证

- 创建钉钉群
- 群设置 → 智能群助手 → 添加机器人 → 自定义
- 获取Webhook地址

#### 2. 创建钉钉报警脚本

```bash
cat > /usr/lib/zabbix/alertscripts/dingtalk.sh <<'EOF'
#!/bin/bash
webhook='https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN'

title=$1
message=$2

curl -s -H "Content-Type: application/json" -X POST \
  "$webhook" \
  -d'{
   "msgtype": "text",
   "text": {
       "content": "'"${title}\n\n${message}"'"
   }
}'
EOF

chmod +x /usr/lib/zabbix/alertscripts/dingtalk.sh
```

#### 3. 配置报警媒介类型

- 管理 → 报警媒介类型 → 创建媒介类型
- 名称：钉钉
- 类型：脚本
- 脚本名称：dingtalk.sh
- 添加参数：
  - `{ALERT.SENDTO}`
  - `{ALERT.SUBJECT}`
  - `{ALERT.MESSAGE}`

---

### 五、配置报警动作

#### 1. 创建报警动作

- 配置 → 动作 → 创建动作
- 名称：触发报警
- 条件：
  - 触发器示警度 ≥ 警告

#### 2. 配置操作

- 操作 → 新建
- 发送到用户：选择用户
- 仅发送到：选择报警媒介（如：企业微信）
- 默认消息：

```
报警：{TRIGGER.NAME}
主机：{HOSTNAME}
IP：{HOST.IP}
时间：{EVENT.DATE} {EVENT.TIME}
级别：{TRIGGER.SEVERITY}
值：{ITEM.VALUE}
事件ID：{EVENT.ID}
```

#### 3. 配置恢复操作

- 恢复操作 → 新建
- 发送到用户：选择用户
- 仅发送到：选择报警媒介
- 恢复消息：

```
恢复：{TRIGGER.NAME}
主机：{HOSTNAME}
IP：{HOST.IP}
时间：{EVENT.RECOVERY.DATE} {EVENT.RECOVERY.TIME}
事件ID：{EVENT.ID}
```

---

### 六、报警消息模板优化

#### 1. 常用宏变量

| 宏变量 | 说明 |
| :--- | :--- |
| `{TRIGGER.NAME}` | 触发器名称 |
| `{HOSTNAME}` | 主机名称 |
| `{HOST.IP}` | 主机IP地址 |
| `{EVENT.DATE}` | 事件日期 |
| `{EVENT.TIME}` | 事件时间 |
| `{TRIGGER.SEVERITY}` | 触发器严重性 |
| `{ITEM.VALUE}` | 监控项当前值 |
| `{EVENT.ID}` | 事件ID |

#### 2. 消息格式示例

```
【Zabbix告警】

告警名称：{TRIGGER.NAME}
告警主机：{HOSTNAME} ({HOST.IP})
告警时间：{EVENT.DATE} {EVENT.TIME}
告警级别：{TRIGGER.SEVERITY}
当前值：{ITEM.VALUE}
阈值：{TRIGGER.VALUE}

问题详情：
{TRIGGER.DESCRIPTION}

事件ID：{EVENT.ID}
```

---

### 七、报警测试

#### 1. 手动触发报警

- 临时降低某个监控项的阈值
- 等待触发器触发
- 检查是否收到报警消息

#### 2. 查看报警日志

- 监控 → 问题 → 查看报警历史
- 管理 → 审计 → 查看报警发送记录

---

### 八、常见问题排查

#### 1. 报警未发送

- 检查报警动作是否启用
- 验证用户报警媒介配置
- 查看Zabbix Server日志：`tail -f /var/log/zabbix/zabbix_server.log`

#### 2. 脚本执行失败

- 检查脚本权限：`ls -l /usr/lib/zabbix/alertscripts/`
- 手动测试脚本：`bash /usr/lib/zabbix/alertscripts/wechat.sh`
- 查看脚本日志输出

#### 3. 企业微信/钉钉报错

- 验证凭证是否正确
- 检查网络连接：`curl -I https://qyapi.weixin.qq.com`
- 查看API返回的错误信息

---

### 九、最佳实践

#### 1. 报警分级

- **信息**：一般性通知
- **警告**：需要关注的问题
- **一般严重**：需要及时处理
- **严重**：需要立即处理
- **灾难**：系统级故障

#### 2. 报警收敛

- 设置报警升级策略
- 配置报警依赖关系
- 避免重复报警

#### 3. 报警静默

- 维护期间设置维护模式
- 使用报警抑制规则
- 配置报警时间窗口

---

### 十、总结

通过配置多种报警媒介，可以实现灵活的告警通知机制，确保运维人员能够及时收到告警信息。建议根据实际需求选择合适的报警方式，并优化报警消息格式，提高告警的可读性和可操作性。

> 下一步：学习Zabbix核心服务监控，实现对MySQL、Nginx、Redis等服务的深度监控。
