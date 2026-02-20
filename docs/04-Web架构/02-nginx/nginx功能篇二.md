## 1. 基于 IP 地址的访问限制

### 1.1 指令说明

- `allow xxxxx;` — 允许指定 IP/网段访问
- `deny xxxx;` — 拒绝指定 IP/网段访问
- **注意**：两者放置顺序会影响匹配结果；规则自上而下匹配，匹配到后不再继续。

---

### 1.2 场景一：只允许某网段访问（禁止其他）

- **需求**：只允许 `10.0.0.0 ~ 10.0.0.255` 访问。

**配置示例：**

```nginx
server {
    listen 2233;
    server_name _;
    location / {
        allow 10.0.0.0/24;
        deny all;
        root  /www/deny-allow;
        index index.html;
    }
}
```

**准备与测试：**

```bash
mkdir -p /www/deny-allow
echo 'I am web-8, test deny and allow !!!!!!!!' > /www/deny-allow/index.html
systemctl restart nginx
# 本机 10.0.0.8:2233 可访问；从 61 机器 curl 10.0.0.8:2233 可通，curl 172.16.1.8:2233 返回 403
```

**提示**：若只写 `allow` 而不写 `deny all`，限制没有实际意义，必须配合 `deny` 使用。

---

### 1.3 场景二：只允许 172.16.1.0/24 访问

```nginx
location / {
    allow 172.16.1.0/24;
    deny all;
    root  /www/deny-allow;
    index index.html;
}
```

- 仅 172 网段可访问；Windows（如 10.0.0.1）无法访问。

---

### 1.4 场景三：只允许单个 IP（如仅 Windows 主机）

```nginx
location / {
    allow 10.0.0.1;   # 仅允许该 IP
    deny all;
    root  /www/deny-allow;
    index index.html;
}
```

- 仅 `10.0.0.1` 可访问，`10.0.0.61`、`172.16.1.52` 等均被拒绝。

---

### 1.5 场景四：只拒绝某网段（允许其他）

- **需求**：拒绝 `10.0.0.0 ~ 10.0.0.255`，其他允许。
- 规则自上而下匹配，匹配后不再继续。

```nginx
location / {
    deny 10.0.0.0/24;
    root  /www/deny-allow;
    index index.html;
}
```

- 10 网段全部被拒；172 网段可访问。
- 若只拒绝 Windows：可针对其出口 IP 使用 `deny 10.0.0.1;`（通过 IP 推断是否为 Windows 有限，更准确需结合 User-Agent 等）。

---

## 2. 基于用户认证的访问限制

- 使用模块：`http_auth_basic_module`
- 通过账号密码弹窗限制访问。

### 2.1 创建密码文件

- 密码需用专用工具生成（如 htpasswd），非纯文本。

```bash
yum -y install httpd-tools
# -b 免交互；-c 指定输出文件（新建/覆盖）
htpasswd -b -c /etc/nginx/auth_passwd admin qweqwe
```

---

### 2.2 虚拟主机配置

```nginx
server {
    listen 10.0.0.8:33334;   # 可按需改为 172.16.1.8:33334 仅内网
    charset utf-8;
    server_name _;
    location / {
        auth_basic "please input your account password";
        auth_basic_user_file /etc/nginx/auth_passwd;
        root /www/auth-html;
        index index.html;
    }
}
```

---

### 2.3 测试数据与访问

```bash
mkdir -p /www/auth-html
echo '你不输入密码，别想看到我！！！' > /www/auth-html/index.html
```

- 未认证会弹出账号密码框；认证通过后可看到页面。
- 若 `listen 172.16.1.8:33334`，仅能通过 172 网段访问；学习环境可改为 `listen 10.0.0.8:33334` 便于 Windows 测试。

---

## 3. Nginx 限流模块

- **说明**：生产环境限流多在后端实现，Nginx 限流可能导致请求被拒（如 503），了解用法便于维护。
- **概念**：恶意或异常高并发会占满 TCP 连接与带宽，限流可保护服务端。

### 3.1 按 IP 与请求速率的限流

- 在 **http** 中定义共享内存与速率，在 **server/location** 中引用。

**示例：1 秒 1 个请求，允许 3 个突发（burst），且使用 nodelay**

```nginx
# 在 http 块中
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;

server {
    listen       33555;
    server_name  _;
    charset utf-8;
    access_log /var/log/nginx/limit_req.log;
    limit_req zone=one burst=3 nodelay;
    location / {
        root   /www/limit-req;
        index  index.html index.htm;
    }
}
```

```bash
mkdir -p /www/limit-req
echo '我是限速模块，你别太快，太快不好' > /www/limit-req/index.html
nginx -t && systemctl restart nginx
```

- **burst=3**：前 3 个超速请求仍可处理（可理解为"VIP"名额）；之后超速请求返回 503。
- **nodelay**：超限请求不排队，直接拒绝，避免排队导致的问题，推荐加上。

---

### 3.2 不加 nodelay 与加 nodelay 的区别

| 写法 | 行为 |
|------|------|
| `limit_req zone=one burst=3;` | 超速请求会排队等待，可能引发问题，一般不推荐。 |
| `limit_req zone=one burst=3 nodelay;` | 超速请求不排队，超过即 503；burst 仅表示允许的突发个数。 |

---

## 4. 内置变量

以下为常用 Nginx 内置变量，可用于 `echo`、`log_format`、`if` 等场景。

| 变量名 | 说明 |
|--------|------|
| `$args` / `$query_string` | 请求参数字符串 |
| `$arg_NAME` | 指定名称的查询参数 |
| `$is_args` | 若有参数则为 `?`，否则为空 |
| `$uri` / `$document_uri` | 请求 URI（路径部分） |
| `$document_root` | 当前请求的 root 路径 |
| `$host` / `$hostname` | 主机名 |
| `$https` | 若为 HTTPS 则为 on |
| `$binary_remote_addr` | 客户端地址（二进制） |
| `$remote_addr` / `$remote_port` | 客户端 IP 与端口 |
| `$remote_user` | 认证用户名 |
| `$request` | 完整请求行 |
| `$request_uri` | 完整请求 URI（含参数） |
| `$request_method` | 请求方法 |
| `$request_time` | 请求处理耗时 |
| `$request_length` | 请求长度 |
| `$request_filename` | 当前请求映射到的本地文件路径 |
| `$scheme` | 协议（http/https） |
| `$server_addr` / `$server_name` / `$server_port` | 服务器地址、名称、端口 |
| `$server_protocol` | 协议版本 |
| `$status` | 响应状态码 |
| `$body_bytes_sent` / `$bytes_sent` | 发送的 body 字节数 / 总字节数 |
| `$content_length` / `$content_type` | 请求头中对应字段 |
| `$http_NAME` | 任意请求头，如 `$http_user_agent`、`$http_referer`、`$http_cookie` |
| `$sent_http_NAME` | 任意响应头，如 `$sent_http_content_type` |
| `$time_local` / `$time_iso8601` | 本地时间 / ISO8601 时间 |
| `$msec` | 当前时间戳（秒+毫秒） |
| `$nginx_version` / `$pid` | Nginx 版本 / 工作进程 PID |

---

## 5. Nginx 开启第三方模块

- Nginx 安装后若要新增模块，需重新编译并 `--add-module` 指定模块路径。
- 示例：**echo 模块**（openresty/echo-nginx-module），用于输出变量与字符串，便于调试。

### 5.1 编译环境与用户

```bash
yum install pcre pcre-devel openssl openssl-devel zlib zlib-devel gcc gcc-c++ make wget httpd-tools vim -y
groupadd www -g 666
useradd www -u 666 -g 666 -M -s /sbin/nologin
```

---

### 5.2 下载 echo 模块与 Nginx 源码

```bash
yum install git -y
cd /opt
git clone https://github.com/openresty/echo-nginx-module.git

wget http://nginx.org/download/nginx-1.19.0.tar.gz
tar -zxf nginx-1.19.0.tar.gz
cd nginx-1.19.0
```

---

### 5.3 编译安装（添加 echo 模块）

```bash
./configure \
  --user=www \
  --group=www \
  --prefix=/opt/nginx-1-19-0 \
  --with-http_stub_status_module \
  --with-http_ssl_module \
  --with-pcre \
  --add-module=/opt/echo-nginx-module

make && make install
```

验证是否包含 echo 模块：

```bash
/opt/nginx-1-19-0/sbin/nginx -V
# 应看到 --add-module=/opt/echo-nginx-module
```

---

### 5.4 使用 echo 输出变量

**主配置**（如 `nginx.conf`）中通过 `include` 引入子配置：

```nginx
worker_processes  1;
events { worker_connections  1024; }
http {
    include       mime.types;
    default_type  application/octet-stream;
    include /opt/nginx-1-19-0/conf/extra/*.conf;
}
```

**子配置**（如 `conf/extra/test-echo.conf`）：

```nginx
server {
    listen       11444;
    server_name  localhost;
    charset utf-8;
    location / {
        echo "yuchaoit.cn welcome you!";
        echo $uri;
        echo $document_uri;
        echo $remote_addr;
        echo $remote_port;
        echo $http_user_agent;
    }
}
```

```bash
/opt/nginx-1-19-0/sbin/nginx -t
/opt/nginx-1-19-0/sbin/nginx
# 浏览器可能触发下载，用 curl 查看更清晰：curl 10.0.0.7:11444/9.p
```

---

## 6. Location 实战

### 6.1 URL 与 URI 概念

- 常见说法中的 **URI** 多指：路径 + 查询字符串（即请求 URI）。
- 示例：`https://www.example.com:8080/path/to/file?query=string#fragment` 中，通常说的"URI"指 `/path/to/file?query=string` 这部分。
- HTTP 请求行：`GET /path/to/file?query=string HTTP/1.1`，其中 `/path/to/file?query=string` 即请求 URI。

| 类型 | 在 HTTP 请求中 | Nginx 变量 |
|------|----------------|------------|
| 请求 URI（路径+参数） | `GET /v1/users?id=1 HTTP/1.1` | `$request_uri` |
| URI 路径部分 | 从请求行解析出的路径 | `$uri` |

---

### 6.2 Location 语法与优先级

**语法：**

```nginx
location [ = | ~ | ~* | ^~ ] uri { ... }
location @name { ... }
```

**优先级（从高到低）：**

| 匹配符 | 规则 | 优先级 |
|--------|------|--------|
| `=` | 精确匹配 URI | 1 |
| `^~` | 前缀匹配，匹配后不检查正则（区分大小写） | 2 |
| `~` | 区分大小写的正则匹配 | 3 |
| `~*` | 不区分大小写的正则匹配 | 4 |
| 无符号 | 普通前缀匹配，作为兜底 | 最低 |

**记忆**：`=` 最精确；`^~` 前缀且不查正则；正则 `~` / `~*` 按配置顺序；无符号兜底。

**官网示例：**

```nginx
location = / { ... }           # A：仅 /
location / { ... }             # B：通用
location /documents/ { ... }   # C：/documents/ 前缀
location ^~ /images/ { ... }   # D：/images/ 前缀，不检查正则
location ~* \.(gif|jpg|jpeg)$ { ... }  # E：扩展名正则（\. 表示字面量点）
```

- `http://yuchaoit.cn/` → A
- `http://yuchaoit.cn/hello` → B
- `http://yuchaoit.cn/documents/hello` → C
- `http://yuchaoit.cn/images/葫芦娃.gif` → D
- `http://yuchaoit.cn/documents/德玛西亚.gif` → E

---

### 6.3 测试用配置与 curl 结果示例

```nginx
server {
    listen 22333;
    server_name _;

    location / {
        return 200 "location /  \n";
    }
    location = / {
        return 200 "location = /  \n";
    }
    location /documents/ {
        return 200 "location /documents/ \n";
    }
    location ^~ /images/ {
        return 200 "location ^~ /images/  \n";
    }
    location ~* \.(gif|jpg|jpeg)$ {
        return 200 "location ~* \.(gif|jpg|jpeg) \n";
    }
    access_log off;
}
```

| 请求 URL | 匹配结果 |
|----------|----------|
| `/` | `location = /` |
| `/111` | `location /` |
| `/documents/123`、`/documents/` | `location /documents/` |
| `/documents`（无尾部斜杠） | `location /` |
| `/images/`、`/images/1.png` | `location ^~ /images/` |
| `/images`（无尾部斜杠） | `location /` |
| `/1.gif`、`/Images/1.gif` | `location ~* \.(gif|jpg|jpeg)` |

---

## 7. Location 中的 root 与 alias 实战

### 7.1 基本区别

| 特性 | `root` | `alias` |
|------|--------|--------|
| 逻辑 | 将 **location 路径** 拼接到 root 路径后面 | 用 **alias 路径** 替换 location 路径 |
| 使用范围 | server、location | 仅 location |
| 尾部斜杠 | 不强制 | 一般需要（与 location 搭配时） |

---

### 7.2 root 示例

```nginx
# 请求 /images/photo.jpg → /var/www/html/images/photo.jpg
location /images/ {
    root /var/www/html;
}

# 请求 /static/css/style.css → /data/website/static/css/style.css
location /static/ {
    root /data/website;
}

# server 级 root 作为默认；location 可覆盖
server {
    root /usr/share/nginx/html;
    location / { }
    location /blog/ {
        root /var/www/blog;
        # 请求 /blog/post.html → /var/www/blog/blog/post.html
    }
}
```

---

### 7.3 alias 示例

```nginx
# 请求 /img/photo.jpg → /var/www/images/photo.jpg（路径中 /img/ 被替换为 /var/www/images/）
location /img/ {
    alias /var/www/images/;
}

location /downloads/ {
    alias /opt/files/;
    # 请求 /downloads/manual.pdf → /opt/files/manual.pdf
}

location = /favicon.ico {
    alias /var/www/icons/favicon.ico;
}
```

---

### 7.4 对比小结

```nginx
# 请求 /pics/photo.jpg
# root：文件路径 = /var/www + /pics/photo.jpg = /var/www/pics/photo.jpg
location /pics/ {
    root /var/www;
}

# alias：/pics/ 被替换为 /var/www/images/，文件路径 = /var/www/images/photo.jpg
location /pics/ {
    alias /var/www/images/;
}
```
