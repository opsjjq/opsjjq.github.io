# LAMP 架构与阿里云

---

## 一、LAMP 架构概述

### 1. 什么是 LAMP

LAMP 是一组用于搭建动态网站的开源软件组合：

- **L**：Linux 操作系统
- **A**：Apache HTTP Server
- **M**：MySQL/MariaDB 数据库
- **P**：PHP/Python/Perl 编程语言

### 2. 常见架构变体

| 架构      | 组件组合                      |
| :-------- | :---------------------------- |
| **LAMP**  | Linux + Apache + MySQL + PHP |
| **LNMP**  | Linux + Nginx + MySQL + PHP  |
| **LNMPA** | Linux + Nginx + MySQL + PHP + Apache |

### 3. 组件功能说明

| 组件       | 功能                    | 特点                     |
| :--------- | :---------------------- | :----------------------- |
| **Apache** | Web 服务器，处理 HTTP 请求 | 稳定、模块丰富、兼容性好 |
| **Nginx**  | Web 服务器/反向代理      | 高并发、内存占用小       |
| **MySQL**  | 关系型数据库              | 开源、性能好、社区活跃   |
| **PHP**    | 服务端脚本语言            | 简单易学、Web 开发首选   |
| **Python** | 通用编程语言              | 简洁优雅、全栈开发       |

---

## 二、阿里云服务器初始化

### 1. 远程连接配置

```sh
# 1. SSH 连接阿里云 ECS
ssh root@your-server-ip

# 2. 修改命令提示符
vim /etc/profile.d/env.sh
# 添加内容：
PS1="[\u@yun \W]\$ "

# 3. 使配置生效
source /etc/profile.d/env.sh
# 效果：[root@yun ~]#
```

### 2. 安全配置优化

```sh
# 1. 关闭 SELinux
getenforce                     # 查看 SELinux 状态
setenforce 0                   # 临时关闭
vim /etc/selinux/config        # 永久关闭
# 修改：SELINUX=disabled

# 2. 关闭防火墙
systemctl stop firewalld       # 停止防火墙
systemctl disable firewalld    # 禁用开机启动
iptables -F                    # 清空 iptables 规则
iptables-save                  # 保存规则

# 3. 修改 SSH 配置（可选）
vim /etc/ssh/sshd_config
# Port 2222                    # 修改默认端口
# PermitRootLogin no          # 禁止 root 登录
# PasswordAuthentication no   # 禁用密码登录（使用密钥）
systemctl restart sshd
```

---

## 三、LAMP 环境部署

### 1. Apache 安装与配置

```sh
# 1. 安装 Apache
yum install httpd -y

# 2. 修改主配置文件
vim /etc/httpd/conf/httpd.conf
# 主要修改项：
# ServerName www.example.com:80   # 取消注释并修改
# DirectoryIndex index.html index.php  # 添加 index.php

# 3. 启动 Apache 服务
systemctl start httpd
systemctl enable httpd
systemctl status httpd

# 4. 测试 Apache
curl localhost
# 或浏览器访问服务器 IP
```

### 2. MySQL 安装与配置

```sh
# 1. 下载 MySQL 官方 YUM 源
cd /etc/yum.repos.d/
wget https://repo.mysql.com//mysql-community-release-el7-5.noarch.rpm

# 2. 安装 MySQL 源
rpm -ivh mysql-community-release-el7-5.noarch.rpm

# 3. 安装 MySQL 服务器
yum install -y mysql-community-server

# 4. 启动 MySQL
systemctl start mysqld
systemctl enable mysqld

# 5. 安全初始化
mysql_secure_installation
# 按提示设置：
# - 设置 root 密码
# - 移除匿名用户 (y)
# - 禁止 root 远程登录 (n - 生产环境建议 y)
# - 移除 test 数据库 (y)
# - 重新加载权限表 (y)

# 6. 登录测试
mysql -u root -p
# 输入密码后执行：
show databases;
select version();
exit;
```

### 3. PHP 安装与配置

```sh
# 1. 安装 PHP 及常用扩展
yum install php -y
yum install php-mysql php-gd php-mbstring php-xml -y

# 2. 重启 Apache 加载 PHP 模块
systemctl restart httpd

# 3. 测试 PHP 配置
vim /var/www/html/info.php
# 内容：
<?php
phpinfo();
?>

# 4. 访问测试
# 浏览器访问：http://服务器IP/info.php
```

---

## 四、部署 Discuz 论坛

### 1. 准备工作

```sh
# 1. 创建网站目录
mkdir -p /var/www/html/discuz

# 2. 下载 Discuz
cd /tmp
wget https://foruda.gitee.com/attach_file/1684563897456560193/discuz_x3.4_sc_utf8_20230520.zip

# 3. 安装解压工具
yum install -y unzip

# 4. 解压文件
unzip discuz_x3.4_sc_utf8_20230520.zip
```

### 2. 安装 Discuz

```sh
# 1. 复制文件到网站目录
cp -r upload/* /var/www/html/

# 2. 设置目录权限
chmod -R 777 /var/www/html/

# 3. 创建数据库
mysql -u root -p
# SQL 命令：
CREATE DATABASE discuz DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES ON discuz.* TO 'discuz'@'localhost' IDENTIFIED BY '你的密码';
FLUSH PRIVILEGES;
exit;

# 4. 解决可能的问题
yum install php-mysqli -y
systemctl restart httpd
```

### 3. Web 安装向导

1. 浏览器访问：`http://服务器IP/install`
2. 同意许可协议
3. 环境检查通过后继续
4. 配置数据库信息：
   - 数据库服务器：localhost
   - 数据库名：discuz
   - 用户名：discuz
   - 密码：设置的密码
5. 管理员账号配置
6. 完成安装

### 4. 安全优化

```sh
# 1. 恢复目录权限
chmod -R 755 /var/www/html/
chmod 644 /var/www/html/config/config_global.php
chmod 644 /var/www/html/config/config_ucenter.php

# 2. 删除安装目录
rm -rf /var/www/html/install/

# 3. 删除测试文件
rm -f /var/www/html/info.php
```

---

## 五、阿里云安全组配置

### 1. 开放必要端口

需要在阿里云控制台配置安全组规则：

| 端口/协议 | 用途                   | 建议           |
| :-------- | :--------------------- | :------------- |
| 22/tcp    | SSH 远程连接           | 开放           |
| 80/tcp    | HTTP 网站访问          | 开放           |
| 443/tcp   | HTTPS 安全访问          | 可选           |
| 3306/tcp  | MySQL 远程连接         | 生产环境不建议 |
| 21/tcp    | FTP 文件传输            | 可选           |
| 6379/tcp  | Redis 数据库            | 可选           |

### 2. 安全组配置步骤

1. 登录阿里云控制台
2. 进入 ECS 实例管理
3. 选择"安全组"配置
4. 添加安全组规则：
   - 授权类型：自定义 TCP
   - 端口范围：80/80
   - 授权对象：0.0.0.0/0（或指定 IP 段）
