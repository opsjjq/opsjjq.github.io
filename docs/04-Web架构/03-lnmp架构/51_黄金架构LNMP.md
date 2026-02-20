# 黄金架构 LNMP

静态网站只需 Nginx 即可；动态网站需要 **Nginx + 编程语言 + 数据库** 的组合。Nginx 通过不同协议将请求转发给后端处理程序（PHP 使用 FastCGI，Python 使用 uWSGI 等）。LNMP 即 Linux + Nginx + MySQL/MariaDB + PHP，是最常见的动态网站黄金架构。

---

## LNMP 协同工作流程

Nginx 负责处理静态资源请求；`.php` 等动态请求通过 **FastCGI** 协议转发给 PHP-FPM 处理，PHP 程序再连接 MySQL 数据库进行数据读写。

### 核心转发机制对比

| 协议/指令      | 用途             | 场景                       |
| :------------- | :--------------- | :------------------------- |
| `proxy_pass`   | HTTP 反向代理    | Nginx→Nginx/其他 HTTP 服务 |
| `fastcgi_pass` | FastCGI 协议转发 | Nginx→PHP                  |
| `uwsgi_pass`   | uWSGI 协议转发   | Nginx→Python               |

**参考文档**：[ngx_http_fastcgi_module](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html)

---

## 部署 Nginx + PHP 环境

### 1. 创建统一的运行用户

```bash
# 创建 www 组和用户，指定 UID/GID 为 666
groupadd www -g 666
useradd www -s /sbin/nologin -M -u 666 -g 666
```

### 2. 安装 Nginx（官方源）

```bash
# 配置 Nginx 官方 yum 源（CentOS 7）
cat > /etc/yum.repos.d/nginx.repo << 'EOF'
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
EOF

# 清理缓存并安装
yum clean all && yum install nginx -y

# 启动并设置开机自启
systemctl start nginx && systemctl enable nginx
```

### 3. 安装 PHP 7（Webtatic 源）

CentOS 7 默认仓库只有 PHP 5.4，建议使用 Webtatic 源安装 PHP 7：

```bash
# 移除旧版 PHP（如有）
yum remove php-mysql-5.4 php php-fpm php-common -y

# 添加 EPEL 和 Webtatic 源
yum install epel-release -y
rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
rpm --import https://mirror.webtatic.com/yum/RPM-GPG-KEY-webtatic-andy

# 安装 PHP 7.1 及相关扩展
yum install -y php71w-cli php71w-common php71w-fpm php71w-mysqlnd \
                php71w-gd php71w-mbstring php71w-pdo php71w-xml \
                php71w-opcache php71w-json
```

**网络受限环境解决方案**：

```bash
# 1. 下载 RPM 包到本地
yum install --downloadonly --downloaddir=/path/to/rpms 包名

# 2. 创建本地仓库
createrepo /path/to/rpms

# 3. 配置本地源
cat > /etc/yum.repos.d/local-rpm.repo << EOF
[local-rpm]
name=Local RPM Repository
baseurl=file:///path/to/rpms
enabled=1
gpgcheck=0
EOF

# 4. 从本地源安装
yum install --enablerepo=local-rpm php71w-*
```

### 4. 配置 PHP-FPM 与 Nginx 使用相同用户

```bash
# 修改 PHP-FPM 运行用户
sed -i '/^user/c user = www' /etc/php-fpm.d/www.conf
sed -i '/^group/c group = www' /etc/php-fpm.d/www.conf

# 启动 PHP-FPM
systemctl start php-fpm && systemctl enable php-fpm

# 确认监听端口（默认 127.0.0.1:9000）
netstat -tunlp | grep 9000
```

---

## 部署 MariaDB/MySQL

```bash
# 安装 MariaDB（MySQL 的替代品）
yum install mariadb-server mariadb -y

# 启动并设置开机自启
systemctl start mariadb && systemctl enable mariadb
```

### MySQL 基本操作命令

| 命令       | 用途                | 示例                                  |
| :--------- | :------------------ | :------------------------------------ |
| 修改密码   | 设置/修改 root 密码 | `mysqladmin -uroot password '新密码'` |
| 本地登录   | 通过 socket 连接    | `mysql -uroot -p密码`                 |
| 远程登录   | 通过网络连接        | `mysql -uroot -p -hIP -P3306`         |
| 查看数据库 | 列出所有数据库      | `show databases;`                     |
| 使用数据库 | 切换到指定库        | `use 数据库名;`                       |
| 查看表     | 列出当前库所有表    | `show tables;`                        |
| 查看表结构 | 显示表字段信息      | `desc 表名;`                          |
| 查询数据   | 从表中读取数据      | `select 字段 from 表名;`              |

---

## Nginx 配置 PHP 转发（FastCGI）

### 基础配置语法

```nginx
# 转发到 TCP 端口
fastcgi_pass 127.0.0.1:9000;

# 或转发到 Unix Socket（性能更好）
fastcgi_pass unix:/tmp/fastcgi.socket;
```

### 标准 PHP 站点配置

```nginx
server {
    listen 80;
    server_name www.linux0224.cc;
    root /code;                     # 网站根目录
    index index.php index.html;     # 默认索引文件

    # PHP 文件处理
    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        # 关键：指定 PHP 脚本路径
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;     # 包含其他 FastCGI 参数
    }
}
```

**测试步骤**：

```bash
# 1. 创建网站目录并设置权限
mkdir -p /code && chown -R www.www /code

# 2. 创建测试 PHP 文件
echo '<?php phpinfo(); ?>' > /code/test-phpinfo.php

# 3. 重载 Nginx 配置
nginx -s reload
```

访问 `http://域名/test-phpinfo.php` 查看 PHP 信息页面。

### 动静态分离配置示例

静态资源（图片、文本）由 Nginx 直接处理，动态请求转发给 PHP-FPM。

```nginx
server {
    listen 809;
    server_name _;

    # 静态资源处理
    location ~* \.(jpg|gif|png|txt)$ {
        root /www/static/;
        expires 30d;  # 浏览器缓存30天
    }

    # 动态请求处理
    location / {
        root /code;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

**准备测试环境**：

```bash
# 创建目录结构
mkdir -p /www/static/ /code

# 准备测试文件
echo "Static file content" > /www/static/test.txt
echo '<?php echo "Dynamic content"; ?>' > /code/index.php

# 设置权限
chown -R www.www /code /www/static
```

### PHP 连接 MySQL 测试

创建测试文件 `/code/test-mysql.php`：

```php
<?php
$conn = mysqli_connect("127.0.0.1", "root", "123123");
if ($conn) {
    echo "MySQL 连接成功！";
} else {
    echo "连接失败: " . mysqli_connect_error();
}
?>
```

访问该文件，显示"MySQL 连接成功！"即表示 PHP→MySQL 连接正常。

---

## 实际产品部署示例

### 1. WeCenter 知识社区部署

WeCenter 是前后端不分离的知识问答系统。

**部署步骤**：

1. **下载并解压**

   ```bash
   # 假设下载文件为 WeCenter_3-6-1.zip
   unzip WeCenter_3-6-1.zip -d /code/wecenter
   ```

2. **Nginx 配置**

   ```nginx
   server {
       listen 80;
       server_name wecenter.linux0224.cn;
       root /code/wecenter;
       index index.php index.html;

       location ~ \.php$ {
           fastcgi_pass 127.0.0.1:9000;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           include fastcgi_params;
       }
   }
   ```

3. **设置权限**

   ```bash
   chown -R www.www /code/wecenter
   nginx -s reload
   ```

4. **创建数据库**

   ```bash
   mysql -uroot -p -e 'CREATE DATABASE wecenter DEFAULT CHARACTER SET utf8mb4;'
   ```

5. **Web 安装**

   - 访问 `http://wecenter.linux0224.cn`
   - 按照向导填写数据库信息
   - 完成安装

6. **验证数据**

   ```bash
   mysql -uroot -p -e 'USE wecenter; SELECT user_name,password FROM aws_users;'
   ```

### 2. WordPress 博客部署

**部署步骤**：

1. **解压程序**

   ```bash
   # 假设下载 wordpress-5.9.zip
   unzip wordpress-5.9.zip -d /code/wordpress
   ```

2. **Nginx 配置**

   ```nginx
   server {
       listen 80;
       server_name wordpress.linux0224.cn;
       root /code/wordpress;
       index index.php index.html;

       # WordPress 固定链接支持
       location / {
           try_files $uri $uri/ /index.php?$args;
       }

       location ~ \.php$ {
           fastcgi_pass 127.0.0.1:9000;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           include fastcgi_params;
       }
   }
   ```

3. **设置权限**

   ```bash
   chown -R www.www /code/wordpress
   nginx -s reload
   ```

4. **创建数据库**

   ```bash
   mysql -uroot -p -e 'CREATE DATABASE wordpress DEFAULT CHARACTER SET utf8mb4;'
   ```

5. **客户端配置**

   ```text
   # 修改本地 hosts 文件（客户端）
   # 添加：服务器IP wecenter.linux0224.cn wordpress.linux0224.cn
   ```

6. **Web 安装**

   - 访问 `http://wordpress.linux0224.cn`
   - 填写数据库信息
   - 设置站点信息和管理员账号

7. **查看数据**

   ```bash
   mysql -uroot -p -e 'USE wordpress; SHOW TABLES; SELECT post_content FROM wp_posts LIMIT 1;'
   ```

---

## 性能优化建议

1. **PHP-FPM 配置优化** (`/etc/php-fpm.d/www.conf`)

   ```ini
   pm = dynamic                    # 进程管理方式
   pm.max_children = 50           # 最大子进程数
   pm.start_servers = 5           # 启动时进程数
   pm.min_spare_servers = 5       # 最小空闲进程
   pm.max_spare_servers = 35      # 最大空闲进程
   ```

2. **Nginx 缓存配置**

   ```nginx
   # 静态资源缓存
   location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **OPcache 加速** (`/etc/php.d/10-opcache.ini`)

   ```ini
   opcache.enable=1
   opcache.memory_consumption=128
   opcache.interned_strings_buffer=8
   opcache.max_accelerated_files=4000
   opcache.revalidate_freq=60
   ```

4. **MySQL 基础优化**

   ```sql
   -- 创建索引提高查询速度
   CREATE INDEX idx_user_name ON aws_users(user_name);

   -- 优化表结构
   OPTIMIZE TABLE wp_posts;
   ```

---

## 故障排查指南

| 问题现象        | 可能原因                 | 解决方案                                 |
| :-------------- | :----------------------- | :--------------------------------------- |
| 502 Bad Gateway | PHP-FPM 未运行或端口错误 | `systemctl status php-fpm`，检查端口监听 |
| 403 Forbidden   | 文件权限问题             | `chown -R www.www /code`，检查文件权限   |
| 404 Not Found   | 文件不存在或路径错误     | 确认 `root` 目录和文件路径正确           |
| 数据库连接失败  | 权限或网络问题           | 检查 MySQL 用户权限、防火墙设置          |
| 中文乱码        | 字符集设置问题           | 确保数据库、PHP、Nginx 统一使用 UTF-8     |
