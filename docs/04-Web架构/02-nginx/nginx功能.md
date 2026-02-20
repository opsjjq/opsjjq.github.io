## 一、Nginx 访客日志切割

### 1.1 手动日志切割原理

**核心思路**：

1. 备份当前日志文件
2. 让 Nginx 重新生成新日志文件

**操作步骤**：

```sh
# 1. 备份旧日志文件
cd /var/log/nginx && mv access.log access.log.$(date '+%F')

# 2. 向 Nginx 发送 USR1 信号重新生成日志
kill -USR1 $(ps -ef | grep nginx | grep master | awk '{print $2}')

# 或使用 reopen 命令
nginx -s reopen
```

**生成测试日志**：

```sh
# 使用 curl 循环请求
for i in {1..10000}; do curl http://10.0.0.8/; done

# 使用 ab 压力测试工具（支持并发）
yum install httpd-tools -y
ab -c 100 -n 10000 http://10.0.0.8/
```

---

### 1.2 Shell 脚本自动化切割

```bash
#!/bin/bash
# nginx_log_rotate.sh

# 日志目录
logs_path="/var/log/nginx"

# 备份目录（以昨天日期命名）
back_logs_path="${logs_path}/$(date -d 'yesterday' +'%F')"

# 创建备份目录
mkdir -p ${back_logs_path}

# 重命名并移动旧日志
cd ${logs_path} && find . -type f -name "*.log" | xargs -I {} mv {} {}.$(date -d 'yesterday' +'%F')
cd ${logs_path} && find . -type f -name "*.log.*" | xargs -I {} mv {} ${back_logs_path}/

# 重新生成日志
kill -USR1 $(ps -ef | grep nginx | grep master | awk '{print $2}')
```

**添加定时任务**：

```
# 每天 0 点执行
crontab -e
0 0 * * * /bin/bash /my_shell/nginx_log_rotate.sh
```

---

### 1.3 使用 logrotate 工具切割

#### 1.3.1 Yum 安装的 Nginx

```bash
# 默认配置文件
cat /etc/logrotate.d/nginx

/var/log/nginx/*.log {
    daily              # 每天切割
    missingok          # 忽略错误
    rotate 52          # 保留 52 个备份
    compress           # 压缩备份
    delaycompress      # 延迟压缩（下次切割时压缩）
    notifempty         # 空文件不切割
    create 640 nginx adm  # 新文件权限
    sharedscripts      # 共享脚本
    postrotate         # 切割后执行
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 $(cat /var/run/nginx.pid)
        fi
    endscript
}
```

#### 1.3.2 编译安装的 Tengine

```bash
cat > /etc/logrotate.d/tengine <<EOF
/opt/ngx/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 nginx adm
    sharedscripts
    postrotate
        if [ -f /opt/ngx/sbin/tengine.pid ]; then
            kill -USR1 \$(cat /opt/ngx/sbin/tengine.pid)
        fi
    endscript
}
EOF
```

**测试 logrotate**：

```
# 手动执行切割
logrotate -f /etc/logrotate.d/nginx

# 添加到定时任务
0 0 * * * logrotate -f /etc/logrotate.d/nginx
```

---

## 二、目录索引与文件下载服务

### 2.1 配置目录索引

```nginx
# /etc/nginx/conf.d/autoindex.conf
server {
    listen 11111;
    server_name _;

    location / {
        root /opt;                  # 根目录
        autoindex on;               # 开启目录索引
        autoindex_localtime on;     # 显示本地时间
        autoindex_exact_size off;   # 显示文件大小（KB/MB）
        charset utf-8;              # 支持中文文件名
    }
}
```

---

### 2.2 重启测试

```bash
# 检查端口
netstat -tunlp | grep 11111

# 测试访问
curl http://10.0.0.8:11111/

# 使用 wget 下载文件
wget http://10.0.0.8:11111/path/to/file
```

---

## 三、Nginx 连接状态监控

### 3.1 stub_status 模块配置

```nginx
# /etc/nginx/conf.d/status.conf
server {
    listen 9999;
    server_name localhost;

    stub_status on;      # 开启状态监控
    access_log off;      # 关闭访问日志

    # 可添加访问控制
    location / {
        allow 10.0.0.0/24;  # 允许内网访问
        deny all;            # 拒绝其他所有
    }
}
```

---

### 3.2 测试访问

访问 `http://10.0.0.8:9999/` 显示类似信息：

```
Active connections: 2
server accepts handled requests
 10 10 20
Reading: 0 Writing: 1 Waiting: 1
```

---

### 3.3 状态信息解释

| 项目 | 含义 |
| :--- | :--- |
| **Active connections** | 当前活动连接数 |
| **server accepts** | 已接受的总连接数 |
| **server handled** | 已处理的连接数 |
| **server requests** | 总请求数 |
| **Reading** | 正在读取请求头的连接数 |
| **Writing** | 正在写入响应的连接数 |
| **Waiting** | 空闲连接数（keep-alive） |

---

### 3.4 性能压力测试

```bash
# 使用 ab 进行压力测试
ab -c 100 -n 100000 http://10.0.0.8/

# 监控实时连接状态
watch -n 1 "curl -s http://10.0.0.8:9999/"

# 查看端口连接详情
netstat -an | grep :9999
```

---

## 四、URL 结构解析示例

```
http://www.qwe.com/test1.jpg
└─┬─┘ └────┬─────┘ └──┬──┘
 协议      域名      资源路径
```

---

## 五、实践作业要求

### 5.1 日志切割实践

1. 手动实现 Shell 脚本切割
2. 配置 logrotate 自动切割
3. 测试两种方式的切割效果

### 5.2 目录索引功能

1. 创建文件下载服务器
2. 配置支持中文文件名显示
3. 提供 Python3 RPM 包下载服务

### 5.3 状态监控配置

1. 开启 stub_status 模块
2. 进行压力测试观察连接数变化
3. 分析连接状态各个参数含义
