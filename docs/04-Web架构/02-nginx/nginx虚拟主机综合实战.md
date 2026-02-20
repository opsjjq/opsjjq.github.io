# Nginx 核心功能与配置文件详解

## Nginx 配置文件基础语法

### 基本语法规则

1. **每条语句必须以分号结束**
2. **区段配置用花括号 {} 包裹**
3. **作用域不能随意嵌套**
   - `server{}` 必须放在 `http{}` 内
   - 写在 `http{}` 外层会导致语法错误
4. **include 参数用于导入外部配置**
   - 必须写在相应区段的花括号内
   - 只对当前区段生效

### 配置文件示例

```nginx
# /etc/nginx/nginx.conf 
# 导入外部虚拟主机配置
http {
    # 全局配置参数
    xxxxx;
    xxxxx;
    
    # 导入外部配置文件
    include /etc/nginx/extra/*.conf;
}
```



## Nginx 配置文件结构

### 主配置文件层次

```nginx
user www;  # 运行用户

http {
    # HTTP 核心模块参数
    
    # 虚拟主机1
    server {
        listen 80;
        server_name example.com;
        
        location / {
            root /www/site1/;
            index index.html;
        }
    }
    
    # 虚拟主机2
    server {
        listen 80;
        server_name test.com;
        
        location / {
            root /www/site2/;
            index index.html;
        }
    }
}
```



## 作业 1：多版本 Nginx 管理

### 要求

1. **编译安装 Tengine 最新版**

   

   ```
   # 安装到 /opt/ngx/
   ```

   

2. **Yum 安装官方 Nginx**

   

   ```
   yum install nginx -y
   ```

   

3. **管理多个版本**

   - Yum 安装路径：

     

     ```
     /usr/sbin/nginx               # 二进制文件
     /etc/nginx/nginx.conf         # 配置文件
     /var/log/nginx/access.log     # 访问日志
     /usr/share/nginx/html/index.html  # 默认页面
     ```

     

   - 编译安装路径：

     

     ```
     /opt/ngx/sbin/nginx           # 二进制文件
     /opt/ngx/conf/nginx.conf      # 配置文件
     /opt/ngx/logs/access.log      # 访问日志
     /opt/ngx/html/index.html      # 默认页面
     ```

     

4. **确定当前运行的 Nginx 版本**

   

   ```
   # 查看进程打开的文件
   lsof -p $(pidof nginx)
   
   # 或查看二进制路径
   ps aux | grep nginx
   ```

   

### Nginx 常用命令



```
nginx -s stop        # 快速停止
nginx -s quit        # 优雅停止
nginx -s reload      # 重新加载配置
nginx -s reopen      # 重新打开日志文件
nginx -t             # 测试配置文件语法
nginx -c /path/to/nginx.conf  # 指定配置文件
```



## 作业 2：虚拟主机配置实践

### 要求 1：单虚拟主机

- 部署 `www.linux0224.cc`
- 支持静态资源：png、txt、html
- 提供访问 URL 和效果截图

### 要求 2：多端口虚拟主机

```nginx
# 10.0.0.8:81
server {
    listen 81;
    server_name _;
    root /www/81/;
    index index.html;
}

# 10.0.0.8:82
server {
    listen 82;
    server_name _;
    root /www/82/;
    index index.html;
}
```



### 要求 3：多 IP 虚拟主机

```nginx
# 10.0.0.77
server {
    listen 10.0.0.77:80;
    server_name _;
    root /www/77/;
    index index.html;
}

# 10.0.0.78
server {
    listen 10.0.0.78:80;
    server_name _;
    root /www/78/;
    index index.html;
}
```



### 要求 4：多域名虚拟主机

```nginx
# blog.linux0224.cc
server {
    listen 80;
    server_name blog.linux0224.cc;
    root /www/blog/;
    index index.html;
}

# movie.linux0224.cc
server {
    listen 80;
    server_name movie.linux0224.cc;
    root /www/movie/;
    index index.html;
}
```



### 要求 5：配置管理

- 使用 `include` 语法统一管理
- 配置文件放在 `/etc/nginx/extra/`
- 清楚展示请求匹配过程

## 作业 3：Nginx 模块化功能

### Nginx 官方文档

- 官网：https://nginx.org/en/docs/
- Windows 部署：https://nginx.org/en/docs/windows.html

### 核心功能模块

- **访客日志模块**：记录客户端请求信息
- **错误日志模块**：记录服务器错误信息

## 作业 4：日志处理与分析

### 生产环境日志实践



```
# 提取日志时间
awk -F '[][]' '{print $2}' /var/log/nginx/access.log
```



### 日志模块详解

- 官方文档：https://nginx.org/en/docs/http/ngx_http_log_module.html

### Nginx 内置变量

- 官方文档：https://nginx.org/en/docs/http/ngx_http_core_module.html

### 默认日志格式

```nginx
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';
access_log logs/access.log main;
```



#### 变量说明

| 变量                    | 说明                            |
| :---------------------- | :------------------------------ |
| `$remote_addr`          | 客户端 IP 地址（可能是代理 IP） |
| `$remote_user`          | 远程客户端用户名                |
| `$time_local`           | 访问时间和时区                  |
| `$request`              | HTTP 请求起始行                 |
| `$status`               | HTTP 状态码                     |
| `$body_bytes_sent`      | 响应体字节数                    |
| `$http_referer`         | 来源页面 URL                    |
| `$http_user_agent`      | 客户端浏览器信息                |
| `$http_x_forwarded_for` | 客户端真实 IP（需代理配置）     |

### 日志配置实践

#### 1. 默认日志配置

```nginx
http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
}
```



#### 2. 关闭日志功能

```nginx
http {
    access_log off;
}
```



#### 3. 自定义日志格式

```nginx
http {
    log_format detailed '$document_uri $remote_addr - $remote_user [$time_local] "$request" '
                       '$status $body_bytes_sent "$http_referer" '
                       '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log detailed;
}
```



#### 4. 虚拟主机单独日志

```nginx
# dnf.linux0224.cc 虚拟主机
log_format dnf_format '$document_uri $remote_addr - $remote_user [$time_local] "$request" '
                     '$status $body_bytes_sent "$http_referer" '
                     '"$http_user_agent" "$http_x_forwarded_for"';

server {
    access_log /var/log/nginx/dnf.linux0224.cc.access.log dnf_format;
    error_log /var/log/nginx/dnf-error.log error;
    
    listen 80;
    server_name dnf.linux0224.cc;
    
    location / {
        root /www/dnf/;
        index index.html;
    }
}
```



#### 5. 统一管理日志

- 特定虚拟主机：单独配置日志
- 其他虚拟主机：使用全局日志配置

### 错误日志配置

```nginx
# 语法
error_log file [level];

# 示例
error_log /var/log/nginx/error.log error;

# 日志级别（详细程度从高到低）
debug, info, notice, warn, error, crit, alert
```



### 错误页面优化

```nginx
# 40x 错误页面
error_page 404 /404.html;
error_page 403 /403.html;

# 50x 错误页面
error_page 500 502 503 504 /50x.html;

# 跳转到外部 URL
error_page 403 https://error.taobao.com/app/tbhome/common/error.html;
```



## 实战配置示例

### 完整虚拟主机配置

```nginx
log_format site_format '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

server {
    access_log /var/log/nginx/site.access.log site_format;
    error_log /var/log/nginx/site-error.log error;
    
    error_page 404 /my404.html;
    error_page 403 /my403.html;
    
    listen 80;
    server_name example.com;
    charset utf-8;
    
    location / {
        root /www/site/;
        index index.html;
    }
}
```



## 总结要点

1. **配置管理**：使用 `include` 优化配置文件结构
2. **版本控制**：清楚区分不同安装方式的文件路径
3. **日志管理**：根据业务需求配置不同级别的日志
4. **错误处理**：优化错误页面提升用户体验
5. **请求追踪**：理解请求匹配虚拟主机的完整过程
