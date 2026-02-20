## WordPress负载均衡部署

### 一、WordPress部署核心概念

#### 部署本质

将编程语言编写的程序（如WordPress）在Linux服务器上以HTTP服务形式运行。

```text
用户访问流程：
client → HTTP服务端（绑定端口 10.0.0.7:80）→ 网站程序
```

#### 关键原则

1. 后端服务需绑定特定端口提供HTTP服务
2. 运维需确保程序正确运行并对外提供服务

---

### 二、WordPress负载均衡部署流程

#### 部署顺序

```text
1. 部署Web7（后端节点1）
2. 部署Web8（后端节点2）
3. 部署lb-5（负载均衡器）
```

---

### 三、Web7完整部署流程

#### 1. 环境准备

```bash
# 创建www用户组
groupadd www -g 666
useradd www -s /sbin/nologin -M -u 666 -g 666

# 配置统一YUM源
cat > /etc/yum.repos.d/61.repo <<EOF
[local-rpm]
name=local yum repo
baseurl=http://172.16.1.61:12345
enabled=1
gpgcheck=0
EOF

# 安装Nginx
yum install nginx -y

# 卸载旧PHP，安装PHP7.1
yum remove php-mysql-5.4 php php-fpm php-common -y
yum install -y php71w-cli php71w-common php71w-devel php71w-embedded \
php71w-gd php71w-mcrypt php71w-mbstring php71w-pdo php71w-xml \
php71w-fpm php71w-mysqlnd php71w-opcache php71w-pecl-memcached \
php71w-pecl-redis php71w-pecl-mongodb php71w-json \
php71w-pecl-apcu php71w-pecl-apcu-devel
```

#### 2. PHP-FPM配置

```bash
# 修改PHP-FPM运行用户
sed -i '/^user/c user = www' /etc/php-fpm.d/www.conf
sed -i '/^group/c group = www' /etc/php-fpm.d/www.conf

# 创建会话目录并授权
mkdir -p /var/lib/php/session
chown -R www.www /var/lib/php

# 启动PHP-FPM
systemctl start php-fpm
systemctl enable php-fpm

# 验证PHP-FPM运行（监听127.0.0.1:9000）
netstat -tunlp | grep php
```

#### 3. Nginx+PHP测试环境

```nginx
# /etc/nginx/conf.d/php.conf
server {
    listen 80;
    server_name _;

    location / {
        root /php-code/;
        # 转发到PHP-FPM
        fastcgi_pass 127.0.0.1:9000;
        # 保留请求URL格式
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        # 转换HTTP数据为FastCGI协议
        include fastcgi_params;
    }
}
```

```bash
# 创建测试PHP文件
mkdir -p /php-code/
cat > /php-code/test-info.php <<EOF
<?php
    phpinfo();
?>
EOF
chown -R www.www /php-code/
```

---

### 四、WordPress部署步骤

#### 1. 准备工作

```bash
# 创建WordPress目录
mkdir -p /code/wordpress
cd /code/wordpress

# 下载并解压WordPress（使用稳定版本）
# wordpress-5.9.3-zh_CN.zip
```

#### 2. Nginx配置

```nginx
# /etc/nginx/conf.d/wordpress.conf
server {
    listen 80;
    server_name wordpress.linux0224.cn;

    location / {
        # 静态请求处理
        root /code/wordpress/;
        index index.php index.html;
    }

    location ~* \.php$ {
        # 动态PHP请求处理
        root /code/wordpress/;
        fastcgi_index index.php;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include /etc/nginx/fastcgi_params;
    }
}
```

#### 3. 关键配置说明

1. **静态请求**（.css, .js, .jpg等）由Nginx直接处理
2. **动态请求**（.php）转发给PHP-FPM处理
3. 必须分开配置才能正常显示样式

---

### 五、数据库部署（db-51）

```bash
# 清理旧YUM源，配置统一源
rm -f /etc/yum.repos.d/*.repo
cat > /etc/yum.repos.d/61.repo <<EOF
[local-rpm]
name=local yum repo
baseurl=http://172.16.1.61:12345
enabled=1
gpgcheck=0
EOF

# 安装MariaDB
yum install mariadb-server mariadb -y
systemctl start mariadb

# 设置root密码
mysqladmin -uroot password '123123'

# 创建WordPress数据库
mysql -uroot -p123123 -e "CREATE DATABASE wordpress"

# 创建远程访问用户
mysql -uroot -p123123 -e "GRANT ALL PRIVILEGES ON *.* TO 'wordpress_user'@'%' IDENTIFIED BY '123123'"
```

---

### 六、WordPress安装注意事项

#### 1. 重要原则

1. **域名一致性**：安装时使用的域名（[wordpress.linux0224.cn](https://wordpress.linux0224.cn/)）必须固定
2. **数据写入数据库**：配置信息会存入数据库，不可随意更改
3. **多节点数据同步**：Web7和Web8使用同一数据库，确保数据一致

#### 2. 初始化安装步骤

1. 访问 `http://wordpress.linux0224.cn`
2. 填写数据库信息（db-51服务器）
3. 生成 `wp-config.php` 配置文件
4. 将此文件复制到Web8的相同位置

```bash
# 从Web7复制配置文件到Web8
scp /code/wordpress/wp-config.php root@172.16.1.8:/code/wordpress/
```

---

### 七、Web8部署（自动化脚本）

```bash
#!/bin/bash
# install-nginx-php.sh

# 创建用户
groupadd www -g 666
useradd www -s /sbin/nologin -M -u 666 -g 666

# 配置YUM源
cat > /etc/yum.repos.d/61.repo <<EOF
[local-rpm]
name=local yum repo
baseurl=http://172.16.1.61:12345
enabled=1
gpgcheck=0
EOF

# 安装软件
yum clean all
yum install nginx -y
yum remove php-mysql-5.4 php php-fpm php-common -y
yum install -y php71w-cli php71w-common php71w-devel php71w-embedded \
php71w-gd php71w-mcrypt php71w-mbstring php71w-pdo php71w-xml \
php71w-fpm php71w-mysqlnd php71w-opcache php71w-pecl-memcached \
php71w-pecl-redis php71w-pecl-mongodb php71w-json \
php71w-pecl-apcu php71w-pecl-apcu-devel

# 配置PHP-FPM
sed -i '/^user/c user = www' /etc/php-fpm.d/www.conf
sed -i '/^group/c group = www' /etc/php-fpm.d/www.conf
systemctl start php-fpm

# 配置Nginx
cat > /etc/nginx/conf.d/php.conf <<'EOF'
server {
    listen 80;
    server_name _;
    location / {
        root /php-code/;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include /etc/nginx/fastcgi_params;
    }
}
EOF

# 创建测试文件
mkdir -p /php-code/
cat > /php-code/test-info.php <<EOF
<?php
    phpinfo();
?>
EOF
chown -R www.www /php-code/

# 启动Nginx
mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
systemctl start nginx
```

---

### 八、负载均衡器（lb-5）部署

```bash
# 清理并配置YUM源
rm -f /etc/yum.repos.d/*.repo
cat > /etc/yum.repos.d/61.repo <<EOF
[local-rpm]
name=local yum repo
baseurl=http://172.16.1.61:12345
enabled=1
gpgcheck=0
EOF

# 安装Nginx
yum clean all
yum install nginx -y
systemctl start nginx
systemctl enable nginx
```

#### Nginx负载均衡配置

```nginx
# 定义后端服务器组
upstream my-web {
    server 172.16.1.7:80 weight=2;  # Web7，权重2
    server 172.16.1.8:80 weight=1;  # Web8，权重1
}

# 负载均衡虚拟主机
server {
    listen 80;
    server_name wordpress.linux0224.cn;

    location / {
        proxy_pass http://my-web/;
        include /etc/nginx/proxy_params;
    }
}
```

#### 代理参数文件

```nginx
# /etc/nginx/proxy_params
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_connect_timeout 30;
proxy_send_timeout 60;
proxy_read_timeout 60;
proxy_buffering on;
proxy_buffer_size 32k;
proxy_buffers 4 128k;
```

---

### 九、故障分析与处理

#### 1. 常见故障场景

| 故障点             | 现象                           | 影响                 | 解决方案           |
| :----------------- | :----------------------------- | :------------------- | :----------------- |
| lb-5负载均衡器故障 | 用户完全无法访问网站           | 整个网站瘫痪         | 部署高可用负载均衡 |
| 后端Nginx服务故障  | 部分请求失败，日志显示连接拒绝 | 请求转发到健康节点   | 修复Nginx服务      |
| PHP-FPM服务故障    | 返回502 Bad Gateway错误        | 动态内容无法访问     | 重启PHP-FPM        |
| 数据库故障         | 数据库连接错误                 | 所有动态内容无法加载 | 修复数据库服务     |

#### 2. 测试方法

```bash
# 检查后端节点连通性
curl 172.16.1.7:80

# 模拟PHP-FPM故障
pkill -9 php-fpm

# 检查服务状态
systemctl status nginx
systemctl status php-fpm
```

---

### 十、重要注意事项

#### 1. 域名管理

- 安装时使用固定域名（如[wordpress.linux0224.cn](https://wordpress.linux0224.cn/)）
- 该域名信息会写入数据库，不可随意更改
- 所有节点使用相同域名配置

#### 2. 虚拟主机配置

- 多域名虚拟主机通过不同配置文件实现
- 示例：wordpress.conf、wecenter.conf
- 所有配置使用80端口，通过server_name区分

#### 3. 数据一致性

- Web7和Web8使用同一数据库（db-51）
- 配置文件（wp-config.php）保持一致
- 上传文件需使用共享存储（如NFS）

---

### 十一、常见问题解答

#### Q: 为什么轮询时两台机器都刷新日志？

A: 一次完整的页面请求可能包含多个资源（HTML、CSS、JS、图片等），负载均衡器会对每个独立请求进行轮询分配，因此两台服务器日志都会有记录。

#### Q: 后端服务器80端口被占用怎么办？

A: 可以使用其他端口（如8080、8888等），在负载均衡器配置中相应调整端口号。

#### Q: 如何实现多网站负载均衡？

A: 基于多域名虚拟主机配置，为每个网站创建独立的upstream和server配置。

---

### 十二、总结

**核心要点总结：**

1. 部署顺序：数据库 → 后端节点 → 负载均衡器
2. 配置一致性：所有节点软件版本、配置需保持一致
3. 域名固定：安装和使用阶段使用相同域名
4. 故障排查：通过日志分析请求流向，定位故障点
5. 自动化部署：编写脚本提高部署效率

通过本实践文档，我们学习了WordPress负载均衡的完整部署流程，包括后端节点配置、数据库部署、负载均衡器配置等。掌握这些技能后，可以构建高可用的Web服务架构。

> 下一步：学习更多运维技术，构建完整的运维知识体系。
