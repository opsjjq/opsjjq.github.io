## Zabbix实践：Agent部署与自定义监控

### 一、Zabbix Agent部署

#### 1. 安装Agent

在被监控主机上安装Zabbix Agent：

```bash
# 配置Zabbix yum源
rpm -ivh https://mirrors.tuna.tsinghua.edu.cn/zabbix/zabbix/4.0/rhel/7/x86_64/zabbix-release-4.0-1.el7.noarch.rpm
sed -i 's#repo.zabbix.com#mirrors.tuna.tsinghua.edu.cn/zabbix#g' /etc/yum.repos.d/zabbix.repo

# 安装Agent
yum install -y zabbix-agent
```

#### 2. 配置Agent

编辑 `/etc/zabbix/zabbix_agentd.conf`：

```ini
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=10.0.0.71  # Zabbix Server IP
Include=/etc/zabbix/zabbix_agentd.d/*.conf
```

#### 3. 启动Agent

```bash
systemctl start zabbix-agent && systemctl enable zabbix-agent
```

---

### 二、添加监控主机

#### 1. Web界面添加主机

- 登录Zabbix Web界面
- 配置 → 主机 → 创建主机
- 填写主机名称、可见名称、IP地址
- 选择监控模板（如：Linux by Zabbix Agent）

#### 2. 验证监控状态

- 监控 → 最新数据 → 选择主机
- 查看监控项数据是否正常采集

---

### 三、自定义监控项

#### 1. 自定义TCP状态监控

创建自定义监控脚本：

```bash
# 创建监控配置文件
cat > /etc/zabbix/zabbix_agentd.d/tcp_status.conf <<'EOF'
UserParameter=tcp_status[*],netstat -ant | grep -c $1
EOF

# 重启Agent
systemctl restart zabbix-agent

# 测试监控项
zabbix_agentd -t tcp_status[ESTABLISHED]
```

#### 2. 在Zabbix Server端创建监控项

- 配置 → 主机 → 选择主机 → 监控项 → 创建监控项
- 名称：TCP ESTABLISHED连接数
- 键值：tcp_status[ESTABLISHED]
- 数据类型：数值（整数）
- 信息类型：无符号整型
- 单位：个

#### 3. 创建触发器

- 配置 → 主机 → 选择主机 → 触发器 → 创建触发器
- 名称：TCP ESTABLISHED连接数过高
- 表达式：`{主机名:tcp_status[ESTABLISHED].last()}>5000`
- 严重性：警告

---

### 四、监控项类型

| 类型 | 说明 | 适用场景 |
| :--- | :--- | :--- |
| Zabbix Agent | 通过Agent采集数据 | 服务器监控 |
| SNMP | 网络设备协议 | 交换机、路由器 |
| IPMI | 硬件监控 | 服务器硬件状态 |
| JMX | Java应用监控 | Java应用 |
| Simple check | 简单检查 | 端口、ICMP等 |

---

### 五、常用监控命令

#### 1. Agent端测试

```bash
# 测试指定监控项
zabbix_agentd -t system.cpu.util

# 测试所有监控项
zabbix_agentd -p
```

#### 2. Server端测试

```bash
# 使用zabbix_get获取Agent数据
zabbix_get -s 10.0.0.72 -p 10050 -k system.cpu.util
```

---

### 六、监控最佳实践

#### 1. 监控项命名规范

- 使用清晰的名称描述监控内容
- 包含单位信息（如：CPU使用率%、内存使用MB）
- 示例：`CPU使用率`、`磁盘使用率_根分区%`

#### 2. 触发器设计原则

- 设置合理的阈值
- 避免告警风暴
- 区分严重性级别

#### 3. 数据保留策略

- 历史数据：保留7-30天
- 趋势数据：保留365天
- 根据磁盘空间调整

---

### 七、常见问题排查

#### 1. Agent无法连接

- 检查防火墙规则：`firewall-cmd --list-all`
- 确认Agent服务状态：`systemctl status zabbix-agent`
- 查看Agent日志：`tail -f /var/log/zabbix/zabbix_agentd.log`

#### 2. 监控项无数据

- 验证监控项键值是否正确
- 检查Agent端是否支持该监控项
- 使用zabbix_get测试连接

#### 3. 触发器不触发

- 检查触发器表达式语法
- 确认监控项数据是否正常
- 查看触发器依赖关系

---

### 八、总结

通过本实践文档，我们学习了Zabbix Agent的部署、主机添加、自定义监控项的创建以及常见问题的排查。掌握这些技能后，可以构建一个完整的监控体系，实现对服务器和应用的全面监控。

> 下一步：学习Zabbix多媒介报警配置，实现邮件、微信、钉钉等多种告警方式。
