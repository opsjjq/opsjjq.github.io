# Nginx 基础与虚拟主机配置学习笔记

## 一、Nginx 简介与架构

### 1.1 Nginx 概述

- **高性能 Web 服务器**：采用异步非阻塞 I/O 模型
- **主要功能**：
  1. 提供静态网页服务
  2. 部署多网站、多域名服务
  3. 反向代理服务（结合动态应用）
  4. 简单资源下载服务（支持密码认证）
  5. 用户行为分析（日志功能）

### 1.2 Nginx 运行架构

```text
Master 进程（包工头）
    ↓
Worker 进程（工人）× N
```

- **Master 进程职责**：
  - 检查配置文件语法
  - 创建并监控 Worker 进程
  - 监听 Socket，分发请求
  - 接收管理信号，通知 Worker
  - 处理 reload 命令（重读配置）
- **Worker 进程职责**：
  - 实际处理客户端请求
  - 竞争获取连接
  - 处理并响应请求

### 1.3 进程管理特性

- **reload 操作**：Worker PID 变化，Master PID 不变
- **restart 操作**：所有进程 PID 都变化
- **进程数优化**：默认按 CPU 核数设置 Worker 数

---

## 二、Nginx 安装方式对比

| 安装方式     | 优点                               | 缺点               | 适用场景               |
| :----------- | :--------------------------------- | :----------------- | :--------------------- |
| **源码编译** | 版本灵活，路径自定义，模块自由选择 | 步骤繁琐，耗时较长 | 需要特定模块或最新版本 |
| **Yum安装**  | 简单快捷，版本稳定，便于管理       | 版本可能滞后       | 生产环境快速部署       |
| **RPM安装**  | 离线环境可用                       | 依赖处理复杂       | 无网络环境             |

### 2.1 推荐安装方式

1. **官网 Yum 源安装**（生产推荐）
2. **源码编译安装**（定制需求）
3. **自建 Yum 仓库**（内网环境）

```bash
cat > /etc/yum.repos.d/nginx.repo << 'EOF'
[nginx-stable]
name=nginx stable repo
baseurl=https://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
EOF

# 清空yum源，安装最新版nginx
yum clean all
yum install nginx -y

nginx -V
```

---

## 三、Nginx 配置文件详解

### 3.1 主配置文件结构（/etc/nginx/nginx.conf）

```nginx
user nginx;                    # 运行用户
worker_processes auto;         # Worker进程数（按CPU核数）
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;        # PID文件位置

# 事件模块
events {
    worker_connections 1024;    # 每个Worker最大连接数
}

# HTTP模块
http {
    include /etc/nginx/mime.types;      # 文件类型映射
    default_type application/octet-stream;  # 默认文件类型

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;  # 访问日志

    # 性能优化参数
    sendfile on;                # 高效文件传输
    keepalive_timeout 65;       # 连接超时时间

    # 包含子配置文件
    include /etc/nginx/conf.d/*.conf;
}
```

### 3.2 配置文件匹配顺序

```
nginx.conf（主配置）
    ↓
include /etc/nginx/conf.d/*.conf（加载所有子配置）
    ↓
按监听地址（IP:Port）匹配
    ↓
按 server_name 匹配
    ↓
按 location 路径匹配
```

---

## 四、虚拟主机配置实战

### 4.1 单虚拟主机配置

**场景**：部署 `huoying.linux0224.cc` 网站

```nginx
# /etc/nginx/conf.d/huoying.linux0224.conf
server {
    listen 80;
    server_name huoying.linux0224.cc;
    charset utf-8;  # 支持中文

    location / {
        root /www/huoying/;     # 网站根目录
        index index.html;       # 默认首页
    }
}
```

**部署步骤**：

```bash
# 1. 创建网站目录和内容
mkdir -p /www/huoying
echo '<meta charset=utf-8>我是火影页面' > /www/huoying/index.html

# 2. 设置权限
# 确认对应文件文件夹nginx配置的用户有读权限，否则403错误码

# 3. 检查配置并重启
nginx -t
systemctl restart nginx
```

### 4.2 基于 IP 的虚拟主机

**场景**：同一端口，不同 IP 访问不同网站

```nginx
# /etc/nginx/conf.d/88.conf
server {
    listen 10.0.0.88:80;      # 绑定特定IP
    server_name _;            # 通配符，匹配所有域名

    location / {
        root /www/80/;
        index index.html;
    }
}
```

**临时添加 IP**：

```bash
ip addr add 10.0.0.88/24 dev eth0

# 删除指定 IP
ip addr del 10.0.0.88/24 dev eth0
```

### 4.3 基于域名的虚拟主机

**场景**：同一 IP，不同域名访问不同网站

```nginx
# DNF 网站配置
server {
    listen 80;
    server_name dnf.linux0224.cc;

    location / {
        root /www/dnf/;
        index index.html;
    }
}

server {
    listen 80;
    server_name lol.linux0224.cc;

    location / {
        root /www/lol/;
        index index.html;
    }
}
```

**客户端 Hosts 配置**：

```
C:\Windows\System32\drivers\etc\hosts

10.0.0.8  dnf.linux0224.cc lol.linux0224.cc

# 即可在浏览器中通过域名访问
```

### 4.4 基于端口的虚拟主机

**场景**：同一 IP，不同端口访问不同网站

```nginx
# /etc/nginx/conf.d/port.conf
server {
    listen 10.0.0.8:81;
    server_name _;

    location / {
        root /www/data81/;
        index index.html;
    }
}

server {
    listen 10.0.0.8:82;
    server_name _;

    location / {
        root /www/data82/;
        index index.html;
    }
}
```

---

## 五、Nginx 管理命令

### 5.1 常用命令

| 命令                      | 功能             | 说明            |
| :------------------------ | :--------------- | :-------------- |
| `nginx -t`                | 检查配置文件语法 | 部署前必做      |
| `nginx -s reload`         | 重新加载配置     | Worker PID 变化 |
| `nginx -s stop`           | 停止 Nginx       | 发送停止信号    |
| `systemctl start nginx`   | 启动服务         | Systemd 管理    |
| `systemctl restart nginx` | 重启服务         | 所有 PID 变化   |

### 5.2 注意事项

- **不要重复执行 `nginx` 命令**：会导致端口冲突
- **管理方式一致性**：
  - Yum 安装：用 `systemctl`
  - 源码安装：用 `nginx -s` 命令
- **PID 文件丢失处理**：

```bash
# 查看实际PID
ps -ef | grep nginx
# 写入PID文件
echo 3599 > /var/run/nginx.pid
```

---

## 六、文件类型与 MIME 类型

### 6.1 MIME 类型配置

- **配置文件**：`/etc/nginx/mime.types`
- **作用**：定义文件扩展名对应的 Content-Type
- **未知类型**：默认使用 `application/octet-stream`（直接下载）

### 6.2 常见文件类型处理

| 文件类型 | Nginx 处理方式 | Content-Type               |
| :------- | :------------- | :------------------------- |
| `.html`  | 直接渲染       | `text/html`                |
| `.jpg`   | 图片显示       | `image/jpeg`               |
| `.txt`   | 文本显示       | `text/plain`               |
| `.ttt`   | 直接下载       | `application/octet-stream` |

---

## 七、实践总结与最佳实践

### 7.1 虚拟主机配置原则

1. **分离配置**：每个站点单独配置文件
2. **命名规范**：`域名.conf` 格式
3. **目录规划**：`/www/站点名/` 结构
4. **权限管理**：专用用户运行，最小权限原则

### 7.2 部署流程

- 创建网站目录和内容
- 设置正确的文件权限
- 编写虚拟主机配置文件
- 检查配置文件语法
- 重启 Nginx 服务
- 配置客户端 DNS/Hosts
- 测试访问各虚拟主机

### 7.3 故障排查思路

1. **检查服务状态**：systemctl status nginx
2. **查看错误日志**：tail -f /var/log/nginx/error.log
3. **检查端口监听**：netstat -tunlp | grep nginx
4. **测试配置语法**：nginx -t
5. **检查文件权限**：ls -la /www/
