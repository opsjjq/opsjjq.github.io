# LAMP 编译安装

---

## 一、安装 MySQL

### 1. 安装需求

| 软件版本     | 安装目录         | 数据目录              | 端口 |
| :----------- | :--------------- | :-------------------- | :--- |
| mysql-5.6.51 | /usr/local/mysql | /usr/local/mysql/data | 3306 |

### 2. 安装步骤

#### 2.1 创建 mysql 用户

```sh
useradd -r -s /sbin/nologin mysql
```

#### 2.2 解压软件并进入解压后的目录

源码搜索地址：https://repo.huaweicloud.com/mysql/Downloads/MySQL-5.6/

```sh
cd /usr/local/
mkdir software-mysql
cd software-mysql/
yum install wget -y

# 下载源码
wget -c https://repo.huaweicloud.com/mysql/Downloads/MySQL-5.6/mysql-5.6.50.tar.gz

# 解压缩
tar -zxf mysql-5.6.50.tar.gz

# 查看解压文件夹大小
du -sh *
# 282M    mysql-5.6.50
# 31M     mysql-5.6.50.tar.gz
```

#### 2.3 创建目录

修改编译参数，如安装到指定位置。

#### 2.4 根据需求配置编译参数

创建编译脚本 `cmake.sh`，设置编译参数：

```sh
cmake . \
  -DCMAKE_INSTALL_PREFIX=/usr/local/mysql/ \
  -DMYSQL_DATADIR=/usr/local/mysql/data \
  -DENABLED_LOCAL_INFILE=1 \
  -DWITH_INNOBASE_STORAGE_ENGINE=1 \
  -DMYSQL_TCP_PORT=3306 \
  -DDEFAULT_CHARSET=utf8mb4 \
  -DDEFAULT_COLLATION=utf8mb4_general_ci \
  -DWITH_EXTRA_CHARSETS=all \
  -DMYSQL_USER=mysql
```

添加执行权限并执行：

```sh
chmod +x cmake.sh
./cmake.sh
```

#### 2.5 编译并安装（耗时较长）

安装前 `/usr/local/mysql` 尚不存在，安装结束后会自动生成。

```sh
make && make install
```

#### 2.6 配置 mysql 的 PATH 变量

```sh
echo 'export PATH=$PATH:/usr/local/mysql/bin/' >> /etc/profile
source /etc/profile
echo $PATH
# 输出应包含：/usr/local/mysql/bin/
```

#### 2.7 关于 mysql 的客户端登录命令

总结如下报错，原因是？**mysql没启动**

```sh
[lamp-server root ~]$mysql -uroot -p
Enter password:
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)
```

Linux 的软件启动后，可以有 2 种形式提供客户端去访问：

1. **IP:Port 形式**：如 0.0.0.0:3306，网络连接方式
2. **Socket 本地套接字文件形式**：本地进程套接字文件，启动 mysql，提供它的本地连接进程文件 `/tmp/mysql.sock`

只要这个文件存在，说明 mysql 是启动的。

#### 2.8 修改 mysql 文件夹属组属主

```sh
chown -R mysql:mysql /usr/local/mysql/
```

#### 2.9 数据库初始化

mysql 设置账号密码，得有一个库，数据表得存储吧。

```sh
# 检查是否有旧的 mysql 数据文件残留
# 移除当前的 mysql 配置文件，/etc/my.cnf
mv /etc/my.cnf /etc/my.cnf.bak

# 使用初始化 mysql 数据命令操作
cd /usr/local/mysql
./scripts/mysql_install_db --user=mysql
```

#### 2.10 手动创建启动脚本

```sh
# 方式一：使用 service 命令
service mysql status
service mysql start
# Starting MySQL.Logging to '/usr/local/mysql/data/xxx.err'.
# [OK]

# 方式二：查看监听端口
netstat -tunlp | grep 3306
# tcp6  0  0 :::3306  :::*  LISTEN  4177/mysqld
```

#### 2.11 修改 mysql 密码

**忘记 mysql 密码**：

```sh
service mysql stop
service mysql start --skip-grant-tables
mysql -uroot
```

```sql
-- MySQL 8.0：
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';

-- MySQL 5.7：
UPDATE mysql.user SET authentication_string = PASSWORD('新密码') WHERE user='root';
```

```sql
mysql> select version();
+-----------+
| version() |
+-----------+
| 5.6.51    |
+-----------+
1 row in set (0.00 sec)
```

---

## 二、编译安装 Apache

### 1. 安装依赖包 apr

```sh
cd /usr/local/software-apache
wget -c http://archive.apache.org/dist/apr/apr-1.5.2.tar.bz2
tar -xf apr-1.5.2.tar.bz2
cd apr-1.5.2
```

可能由于其 1.5.2 的 bug，存在一个配置错误，需要修改如下配置：

```sh
vim configure
# 修改第 29605 行
# RM='$RM -f'
```

```sh
./configure
make && make install
```

### 2. 编译安装 apr-util

```sh
wget -c https://archive.apache.org/dist/apr/apr-util-1.5.4.tar.bz2
tar -xf apr-util-1.5.4.tar.bz2
cd apr-util-1.5.4
./configure --with-apr=/usr/local/apr/bin/apr-1-config
make
make install
```

将 apr 工具写入系统的动态库配置文件中：

```sh
echo "/usr/local/apr/lib/" >> /etc/ld.so.conf
ldconfig
```

### 3. 编译 Apache

Apache 或 Nginx 都提供了模块的概念，所有的功能都是以模块、插件的形式提供的。

```sh
wget https://archive.apache.org/dist/httpd/httpd-2.4.37.tar.bz2
tar -xf httpd-2.4.37.tar.bz2
cd httpd-2.4.37
```

创建配置脚本 `config.sh`：

```sh
cat > config.sh << 'EOF'
./configure \
--enable-modules=all \
--enable-mods-shared=all \
--enable-so \
--enable-rewrite \
--with-pcre \
--enable-ssl \
--with-mpm=prefork \
--with-apr=/usr/local/apr/bin/apr-1-config \
--with-apr-util=/usr/local/apr/bin/apu-1-config
EOF

chmod +x config.sh
./config.sh
make && make install
```

### 4. 检查 Apache 安装路径

```sh
ls /usr/local/apache2/
# bin  build  cgi-bin  conf  error  htdocs  icons  include  logs  man  manual  modules

ls /usr/local/apache2/bin/
# ab  apxs  dbmmanage  envvars-std  htcacheclean  htdigest  httpd  logresolve
# apachectl  checkgid  envvars  fcgistarter  htdbm  htpasswd  httxt2dbm  rotatelogs
```

---

## 三、安装 PHP

### 1. 安装依赖文件

```sh
yum install libxml2-devel libjpeg-devel libpng-devel freetype-devel libcurl-devel -y
```

### 2. 下载解压

```sh
wget -c https://museum.php.net/php7/php-7.2.17.tar.xz
tar -xf php-7.2.17.tar.xz
cd php-7.2.17
```

### 3. 创建编译配置脚本

```sh
cat > configure_php.sh << 'EOF'
./configure \
--with-apxs2=/usr/local/apache2/bin/apxs \
--with-mysqli \
--with-pdo-mysql \
--with-zlib \
--with-curl \
--enable-zip \
--with-gd \
--with-freetype-dir \
--with-jpeg-dir \
--with-png-dir \
--enable-sockets \
--with-xmlrpc \
--enable-soap \
--enable-opcache \
--enable-mbstring \
--enable-mbregex \
--enable-pcntl \
--enable-shmop \
--enable-sysvmsg \
--enable-sysvsem \
--enable-sysvshm \
--enable-calendar \
--enable-bcmath
EOF

chmod +x configure_php.sh
./configure_php.sh
make && make install
```

---

## 四、配置 Apache 与 PHP 整合

### 1. 修改 Apache 主配置文件 httpd.conf

```sh
vim /usr/local/apache2/conf/httpd.conf
```

1. **配置语言支持**

   ```apache
   # 159 行：LoadModule negotiation_module modules/mod_negotiation.so 去掉注释
   # 482 行：Include conf/extra/httpd-languages.conf 打开此选项
   ```

2. **加载 PHP 模块**

   ```apache
   # 166 行：LoadModule php7_module modules/libphp7.so
   # 下面添加：
   AddHandler php7-script .php
   AddType text/html .php
   ```

3. **配置默认首页**

   ```apache
   <IfModule dir_module>
       DirectoryIndex index.php index.html
   </IfModule>
   ```

4. **配置网站根目录**

   ```apache
   DocumentRoot "/usr/local/apache2/htdocs"
   <Directory "/usr/local/apache2/htdocs">
   ```

### 2. 修改 Apache 的子配置文件 httpd-languages.conf

```sh
vim /usr/local/apache2/conf/extra/httpd-languages.conf
```

```apache
# 19 行
DefaultLanguage zh-CN

# 78 行
LanguagePriority zh-CN en ca cs da de el eo es et fr he hr it ja ko ltz nl nn no pl pt pt-BR ru sv tr zh-CN zh-TW
```

### 3. 启动 Apache

```sh
# 复制启动脚本
cp /usr/local/apache2/bin/apachectl /etc/init.d/apache

# 启动服务
service apache start
```

### 4. 问题排查

使用 `/usr/local/apache2/bin/apachectl -t` 命令检查配置：

```text
AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using localhost.localdomain. Set the 'ServerName' directive globally to suppress this message
```

**解决方法**：

```sh
vim /usr/local/apache2/conf/httpd.conf
# 添加：
ServerName localhost:80

# 重新检查
/usr/local/apache2/bin/apachectl -t
# Syntax OK
```

---

## 五、实践部署 WordPress

### 1. 下载安装

```bash
wget https://cn.wordpress.org/wordpress-5.9-zh_CN.tar.gz
tar -xzf wordpress-5.9-zh_CN.tar.gz
mv wordpress /usr/local/apache2/htdocs/
```

### 2. 访问安装

浏览器访问：`http://服务器IP/wordpress`

按照向导填写数据库信息完成安装。
