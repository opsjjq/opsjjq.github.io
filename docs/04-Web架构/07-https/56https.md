# HTTPS 实践指南

## 一、HTTPS 的必要性

### 为什么需要 HTTPS？

1. **应用商店要求**：Apple App Store 等平台强制要求 HTTPS
2. **行业标准**：主流门户网站均已采用 HTTPS
3. **数据安全**：国家政策推动网络安全建设
4. **用户信任**：浏览器对 HTTP 站点显示"不安全"警告

### 明文传输的风险

- **FTP**：账户密码明文传输
- **HTTP**：登录信息可被截取
- **SMTP**：邮箱账号密码暴露
- **Telnet**：服务器登录信息泄露

**解决方案**：在 HTTP 基础上增加 TLS/SSL 加密层

## 二、HTTPS 解决的问题

### 1. 数据机密性

防止传输数据被第三方窃取

### 2. 数据完整性

防止传输数据被篡改

### 3. 身份验证

确保通信双方身份真实可信

### 加密算法对比

| 加密类型   | 描述                 | 解决问题   | 常用算法     |
| :--------- | :------------------- | :--------- | :----------- |
| 对称加密   | 加解密使用相同密钥   | 数据机密性 | AES, DES     |
| 非对称加密 | 加解密使用不同密钥对 | 身份验证   | RSA, DSA     |
| 单向加密   | 只能加密不能解密     | 数据完整性 | MD5, SHA系列 |

## 三、HTTPS 工作原理

### HTTPS = HTTP + TLS/SSL

- SSL：Secure Sockets Layer（安全套接字层）
- TLS：Transport Layer Security（传输层安全协议）

### HTTPS 通信流程

```text
1. 客户端发起 HTTPS 请求（默认端口 443）
2. 服务端返回 CA 数字证书（包含公钥）
3. 客户端验证证书合法性
4. 客户端生成随机数（预备主密钥），用公钥加密发送
5. 服务端用私钥解密获得预备主密钥
6. 双方基于预备主密钥生成对称会话密钥
7. 后续通信使用对称加密传输数据
```



## 四、证书类型与应用

### 证书颁发机构

- **国际知名**：DigiCert、Sectigo
- **国内机构**：CFCA、沃通 CA
- **免费机构**：Let's Encrypt

### 证书验证级别

| 类型   | 验证内容      | 颁发时间      | 适用场景           |
| :----- | :------------ | :------------ | :----------------- |
| DV证书 | 域名所有权    | 几分钟-几小时 | 个人博客、测试环境 |
| OV证书 | 域名+组织信息 | 1-3个工作日   | 企业网站、电商平台 |
| EV证书 | 全面组织审查  | 3-5个工作日   | 金融机构、政府网站 |

### 证书绑定方式

- **单域名证书**：仅限一个域名（如 [www.example.com](https://www.example.com/)）
- **泛域名证书**：支持二级域名（如 *.[example.com](https://example.com/)），价格较高

## 五、HTTPS 部署实践

### 方案一：自建证书（内网环境）

```bash
# 1. 安装必要软件
yum install openssl openssl-devel nginx -y

# 2. 创建证书目录
mkdir -p /etc/nginx/ssl-cert/
cd /etc/nginx/ssl-cert/

# 3. 生成自签名证书（有效期100年）
openssl req -days 36500 -x509 -sha256 -nodes \
  -newkey rsa:2048 \
  -keyout server.key \
  -out server.crt
```



### 方案二：阿里云免费证书（公网环境）

1. 登录阿里云 SSL 证书控制台
2. 申请免费 DV 证书（单域名）
3. 提交验证信息（约需7分钟审核）
4. 下载 Nginx 格式证书

### 证书有效期检查脚本

```bash
#!/bin/bash
server_name=www.example.com

# 获取证书过期时间
ssl_time=$(echo | openssl s_client -servername ${server_name} \
  -connect ${server_name}:443 2>/dev/null | \
  openssl x509 -noout -dates | \
  awk -F '=' '/notAfter/{print $2}')

# 转换为时间戳
ssl_unix_time=$(date +%s -d "${ssl_time}")
today=$(date +%s)

# 计算剩余天数
let expr_time=($ssl_unix_time-$today)/24/3600
echo "${server_name} SSL证书剩余有效期：${expr_time}天"
```



## 六、Nginx HTTPS 配置

### 基本 HTTPS 配置

```nginx
server {
    listen 443 ssl;
    server_name www.example.com;
    
    # 证书路径
    ssl_certificate /path/to/server.crt;
    ssl_certificate_key /path/to/server.key;
    
    # SSL 参数优化
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    location / {
        root /www;
        index index.html;
    }
}
```



### HTTP 强制跳转 HTTPS

```nginx
server {
    listen 80;
    server_name www.example.com;
    
    # 301 永久重定向到 HTTPS
    return 301 https://$server_name$request_uri;
    
    # 或使用 rewrite
    # rewrite ^(.*) https://$server_name$1 redirect;
}
```



## 七、负载均衡 HTTPS 架构

### 方案一：全链路 HTTPS（加密性能要求高）

```text
客户端 HTTPS → SLB HTTPS → 后端 HTTPS
```



### 方案二：SLB HTTPS 终结（常见方案）

```text
客户端 HTTPS → SLB HTTPS → 后端 HTTP
```



### SLB HTTPS 配置示例

```nginx
# 负载均衡器配置
upstream wordpress_pools {
    server 172.16.1.7:33333;
    server 172.16.1.8:33333;
}

# HTTP 跳转 HTTPS
server {
    listen 80;
    server_name wordpress.linux0224.cn;
    rewrite ^(.*) https://$server_name$1 redirect;
}

# HTTPS 负载均衡
server {
    listen 443 ssl;
    server_name wordpress.linux0224.cn;
    
    ssl_certificate /etc/nginx/ssl-cert/server.crt;
    ssl_certificate_key /etc/nginx/ssl-cert/server.key;
    
    location / {
        proxy_pass http://wordpress_pools;
        include proxy_params;
    }
}
```



### 后端服务器配置（WordPress）

```nginx
server {
    listen 33333;
    server_name wordpress.linux0224.cn;
    
    root /code/wordpress;
    index index.php index.html;
    
    location ~ \.php$ {
        root /code/wordpress;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        
        # 关键：告知 PHP-FPM 这是 HTTPS 请求
        fastcgi_param HTTPS on;
        include fastcgi_params;
    }
}
```



## 八、阿里云 HTTPS 部署流程

### 快速部署步骤

```bash
# 1. 下载证书到服务器
cd /opt
# 解压阿里云证书包
unzip 22389562_www.example.com_nginx.zip

# 2. 安装 Nginx
cat > /etc/yum.repos.d/nginx-stable.repo << 'EOF'
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
EOF

yum install nginx -y

# 3. 配置 HTTP 跳转
cat > /etc/nginx/conf.d/80.conf << 'EOF'
server {
    listen 80;
    server_name www.example.com;
    server_tokens off;
    return 301 https://$server_name$request_uri;
}
EOF

# 4. 配置 HTTPS
cat > /etc/nginx/conf.d/443.conf << 'EOF'
server {
    listen 443 ssl;
    charset utf-8;
    server_name www.example.com;
    
    ssl_certificate /opt/www.example.com.pem;
    ssl_certificate_key /opt/www.example.com.key;
    
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    location / {
        root /myweb;
        index index.html index.htm;
    }
    
    # 请求头处理（用于后端代理）
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    server_tokens off;
}
EOF

# 5. 创建测试页面
mkdir -p /myweb
echo "HTTPS Website Test" > /myweb/index.html

# 6. 重启 Nginx
systemctl restart nginx
```



### 安全组配置

- 开放 80 端口（HTTP）
- 开放 443 端口（HTTPS）

## 九、故障排查要点

### 常见问题

1. **证书绑定域名不匹配**：确保证书域名与访问域名一致
2. **证书过期**：定期检查证书有效期
3. **端口未开放**：检查防火墙和安全组规则
4. **混合内容警告**：确保所有资源使用 HTTPS
5. **后端识别问题**：添加 `fastcgi_param HTTPS on;`

### 测试命令

```bash
# 检查证书信息
openssl s_client -connect www.example.com:443 -servername www.example.com

# 测试 HTTP 跳转
curl -I http://www.example.com

# 测试 HTTPS 访问
curl -k https://www.example.com
```



## 十、作业与实践

### 必做任务

1. 在阿里云部署 HTTPS 网站并提交访问链接
2. 在虚拟机中实现 WordPress HTTPS 负载均衡

### 推荐架构

```text
客户端 → SLB（HTTPS） → Web7/Web8（HTTP） → DB51 + NFS31
```



### 关键配置要点

1. SLB 配置 HTTPS 证书和 HTTP 跳转
2. 后端 WordPress 配置 `fastcgi_param HTTPS on;`
3. 确保数据库和文件存储共享
4. 验证全站 HTTPS 无混合内容警告

------

## 十一、最佳实践总结

### 证书管理

- 生产环境使用商业证书或 Let's Encrypt
- 内网环境可使用自签名证书
- 设置证书过期提醒

### 性能优化

- 启用 SSL session 缓存
- 使用 HTTP/2 协议
- 优化加密套件选择

### 安全加固

- 隐藏 Nginx 版本信息
- 禁用不安全的 TLS 版本
- 定期更新证书和私钥

### 监控维护

- 监控证书有效期
- 定期检查 SSL 配置安全性
- 日志分析异常访问

通过以上实践，您可以构建安全、高效的 HTTPS 网站架构，满足现代 Web 应用的安全要求。