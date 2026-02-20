## Zabbix监控核心服务实战指南

### 一、Nginx状态监控

#### 1. 启用Nginx Status页面

```nginx
# /etc/nginx/conf.d/status.conf
server {
    listen 80;
    server_name localhost;
    location /nginx_status {
        stub_status on;
        access_log off;
    }
}
```

重启Nginx：`nginx -s reload`

#### 2. 编写数据采集脚本

```bash
#!/bin/bash
# /etc/zabbix/zabbix_agentd.d/nginx_status.sh
NGINX_COMMAND=$1
CACHEFILE="/tmp/nginx_status.log"
CMD="/usr/bin/curl http://127.0.0.1/nginx_status"

# 缓存管理（60秒更新）
if [ ! -f $CACHEFILE ] || [ $(( $(date +%s) - $(stat -c %Y $CACHEFILE) )) -gt 60 ]; then
    $CMD > $CACHEFILE 2>/dev/null
fi

case $NGINX_COMMAND in
    active)    grep 'Active' $CACHEFILE | awk '{print $NF}' ;;
    reading)   grep 'Reading' $CACHEFILE | awk '{print $2}' ;;
    writing)   grep 'Writing' $CACHEFILE | awk '{print $4}' ;;
    waiting)   grep 'Waiting' $CACHEFILE | awk '{print $6}' ;;
    accepts)   awk 'NR==3' $CACHEFILE | awk '{print $1}' ;;
    handled)   awk 'NR==3' $CACHEFILE | awk '{print $2}' ;;
    requests)  awk 'NR==3' $CACHEFILE | awk '{print $3}' ;;
    *) echo "Invalid argument" && exit 2 ;;
esac
```

#### 3. Agent配置

```bash
# /etc/zabbix/zabbix_agentd.d/nginx_status.conf
UserParameter=nginx_status[*],/bin/bash /etc/zabbix/zabbix_agentd.d/nginx_status.sh $1
systemctl restart zabbix-agent
```

#### 4. Zabbix Server测试

```bash
zabbix_get -s 10.0.0.7 -k nginx_status[active]
zabbix_get -s 10.0.0.7 -k nginx_status[requests]
```

---

### 二、PHP-FPM状态监控

#### 1. 启用PHP-FPM Status

```bash
# 安装PHP-FPM
yum install php-fpm -y

# 修改配置
vim /etc/php-fpm.d/www.conf
# 取消注释并修改：
pm.status_path = /status_php
```

#### 2. Nginx代理配置

```nginx
# /etc/nginx/conf.d/status.conf 追加
location /status_php {
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

重启服务：`systemctl restart php-fpm nginx`

#### 3. 数据采集脚本

```bash
#!/bin/bash
# /etc/zabbix/zabbix_agentd.d/php_status.sh
COMMAND=$1
CACHEFILE="/tmp/php_status.txt"
URL="http://127.0.0.1/status_php"

# 缓存管理
if [ ! -f $CACHEFILE ] || [ $(( $(date +%s) - $(stat -c %Y $CACHEFILE) )) -gt 60 ]; then
    curl -s $URL > $CACHEFILE 2>/dev/null
fi

case "$COMMAND" in
    start_since)          awk '/since/{print $3}' $CACHEFILE ;;
    accepted_conn)        awk '/accepted/{print $3}' $CACHEFILE ;;
    listen_queue)         awk 'NR==6{print $3}' $CACHEFILE ;;
    idle_processes)       awk '/idle/{print $3}' $CACHEFILE ;;
    active_processes)     awk 'NR==10{print $3}' $CACHEFILE ;;
    total_processes)      awk 'NR==11{print $3}' $CACHEFILE ;;
    slow_requests)        awk 'NR==14{print $3}' $CACHEFILE ;;
    check)                ss -tunlp | grep -c php-fpm ;;
    *) echo "invalid status" && exit 2 ;;
esac
```

> **权限注意**：确保脚本能执行`ss`命令：
>
> ```bash
> chmod +s /usr/sbin/ss  # 或配置sudo权限
> ```

#### 4. Agent配置

```bash
# /etc/zabbix/zabbix_agentd.d/php_status.conf
UserParameter=php_status[*],/etc/zabbix/zabbix_agentd.d/php_status.sh $1
systemctl restart zabbix-agent
```

#### 5. 测试采集

```bash
zabbix_get -s 10.0.0.7 -k php_status[total_processes]
zabbix_get -s 10.0.0.7 -k php_status[check]
```

---

### 三、Zabbix Web界面配置

#### 1. 创建监控模板

1. **配置** → **模板** → **创建模板**

   - 名称：`Template App Nginx Status`
   - 群组：`Templates/Applications`

2. **添加监控项**（以Nginx为例）：

   | 名称                     | 键值                     | 应用集       |
   | :----------------------- | :----------------------- | :----------- |
   | Nginx Active Connections | `nginx_status[active]`   | Nginx Status |
   | Nginx Requests           | `nginx_status[requests]` | Nginx Status |
   | Nginx Reading            | `nginx_status[reading]`  | Nginx Status |

3. **创建图形**：

   - 添加多个相关监控项
   - 实时展示连接状态趋势

#### 2. 设置触发器

1. **Nginx请求数过高**：

   ```
   名称：Nginx请求数超过阈值
   表达式：{Template App Nginx Status:nginx_status[requests].last()} > 30000
   严重性：警告
   ```

2. **PHP-FPM进程异常**：

   ```
   名称：PHP-FPM进程异常
   表达式：{Template App PHP Status:php_status[check].last()} = 0
   严重性：严重
   ```

#### 3. 关联主机

- 选择目标主机（如web服务器）
- **模板**标签页 → **添加** → 选择创建的模板

---

### 四、Web可用性监控

#### 1. 配置Web场景

1. **配置** → **主机** → **Web监测** → **创建Web场景**
2. 填写：
   - 名称：`Zabbix登录页面检测`
   - 应用集：`Web Availability`
   - 步骤1：
     - 名称：`访问登录页`
     - URL：`http://10.0.0.71/zabbix/`
     - 必需状态码：200

#### 2. 设置触发器

```
名称：Web服务不可访问
表达式：{Template App Web Status:web.test.fail[Zabbix登录页面检测].last()} > 0
严重性：灾难
```

---

### 五、最佳实践建议

#### 1. 监控项优化

- **采样间隔**：关键指标30秒，常规指标1-5分钟
- **历史数据保留**：30天详细数据，1年趋势数据
- **应用集分类**：
  - `Nginx Connections`（连接相关）
  - `Nginx Performance`（性能相关）
  - `PHP-FPM Processes`（进程相关）

#### 2. 告警策略

| 指标          | 警告阈值  | 严重阈值  |
| :------------ | :-------- | :-------- |
| Nginx活跃连接 | > 1000    | > 5000    |
| Nginx请求率   | > 1000/秒 | > 5000/秒 |
| PHP空闲进程   | < 10%     | < 5%      |
| PHP慢请求     | > 10/分钟 | > 50/分钟 |

#### 3. 故障排查流程

```bash
# 1. 检查服务状态
systemctl status nginx php-fpm zabbix-agent

# 2. 手动访问状态页
curl http://127.0.0.1/nginx_status
curl http://127.0.0.1/status_php

# 3. 测试Agent采集
zabbix_get -s 客户端IP -k agent.ping
zabbix_get -s 客户端IP -k nginx_status[active]

# 4. 查看Zabbix日志
tail -f /var/log/zabbix/zabbix_server.log
tail -f /var/log/zabbix/zabbix_agentd.log
```

#### 4. 模板管理

- **导出模板**：备份配置
- **版本控制**：Git管理模板配置
- **批量操作**：使用Zabbix API管理多主机

---

### 六、扩展监控项示例

#### 1. Nginx扩展监控

```bash
# 监控Nginx错误日志
UserParameter=nginx_errors[*],tail -100 /var/log/nginx/error.log | grep -c "$1"

# 监控SSL证书过期
UserParameter=ssl_expiry[*],echo | openssl s_client -connect $1:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter
```

#### 2. PHP扩展监控

```bash
# 监控PHP内存使用
UserParameter=php_memory,ps aux | grep php-fpm | grep -v grep | awk '{sum+=$6} END {print sum}'

# 监控OPCache状态
UserParameter=php_opcache_hit,curl -s http://127.0.0.1/opcache-status | grep 'opcache_hit_rate' | awk '{print $3}'
```

---

### 七、总结

通过本实战指南，我们学习了如何监控Nginx和PHP-FPM等核心服务，包括启用状态页面、编写数据采集脚本、配置Agent、创建监控模板和触发器等。掌握这些技能后，可以构建一个完整的服务监控体系，实现对Web应用和后端服务的全面监控。

> 下一步：学习Zabbix主动/被动模式与分布式监控，构建大规模监控架构。
