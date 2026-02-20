# LNMP 集群拆分部署指南

## 一、架构拆分总览

### 1.1 拆分目标

将单机 LNMP 架构拆分为分布式集群：

- **数据库独立**：172.16.1.51 (db-51)
- **Web 节点扩展**：172.16.1.7 (web-7) + 172.16.1.8 (web-8)
- **文件共享**：172.16.1.31 (nfs-31)

### 1.2 架构流程图

```text
客户端 → [web-7/web-8] → PHP-FPM → MySQL (db-51)
                   ↓
               NFS (nfs-31)
```

---

## 二、数据库独立部署 (db-51)

### 2.1 数据迁移步骤

**Step 1: 源服务器导出数据 (web-7)**

```bash
# 全库导出（带事务保证一致性）
mysqldump -uroot -p'123123' -A --single-transaction > /opt/alldb.sql

# 传输到新数据库服务器
scp /opt/alldb.sql root@172.16.1.51:/opt/
```

**Step 2: 目标服务器安装配置 (db-51)**

```bash
# 安装 MariaDB
yum install mariadb-server mariadb -y

# 启动并设置开机自启
systemctl start mariadb
systemctl enable mariadb

# 设置 root 密码
mysqladmin -uroot password '123123'

# 导入数据
mysql -uroot -p123123 < /opt/alldb.sql

# 重启服务
systemctl restart mariadb
```

**Step 3: 创建远程访问用户**

```sql
-- 创建远程连接用户
CREATE USER 'qq51'@'%' IDENTIFIED BY 'qweqwe';
GRANT ALL PRIVILEGES ON *.* TO 'qq51'@'%';
FLUSH PRIVILEGES;
```

**Step 4: 测试远程连接 (web-7)**

```bash
mysql -uqq51 -pqweqwe -h172.16.1.51
```

### 2.2 应用配置修改

**WordPress 配置 (/code/wordpress/wp-config.php)**

```php
define('DB_HOST', '172.16.1.51');        // 改为 db-51 IP
define('DB_USER', 'qq51');               // 远程用户名
define('DB_PASSWORD', 'qweqwe');         // 远程密码
```

**WeCenter 配置 (/code/wecenter/system/config/database.php)**

```php
'host' => '172.16.1.51',
'username' => 'qq51',
'password' => 'qweqwe',
'dbname' => 'wecenter',
```

---

## 三、增加 Web 节点 (web-8)

### 3.1 环境准备

**创建用户和组**

```bash
groupadd www -g 666
useradd www -s /sbin/nologin -M -u 666 -g 666
```

**安装基础软件**

```bash
# 配置 yum 仓库（同 web-7）
# 安装 Nginx + PHP
yum install nginx php php-fpm php-mysqlnd -y

# 创建代码目录
mkdir -p /code
chown -R www.www /code
```

### 3.2 同步配置和代码

**从 web-7 同步配置**

```bash
# 同步 Nginx 配置
scp root@172.16.1.7:/etc/nginx/nginx.conf /etc/nginx/
scp -r root@172.16.1.7:/etc/nginx/conf.d/* /etc/nginx/conf.d/

# 同步 PHP 配置
scp -r root@172.16.1.7:/etc/php-fpm.d/* /etc/php-fpm.d/
scp root@172.16.1.7:/etc/php.ini /etc/php.ini

# 同步应用代码
scp -r root@172.16.1.7:/code/* /code/
chown -R www.www /code
```

**修改 PHP-FPM 配置**

```ini
# vim /etc/php-fpm.d/www.conf 修改以下参数：
user = www
group = www
listen = 127.0.0.1:9000
```

### 3.3 启动服务

```bash
# 启动服务
systemctl start nginx
systemctl start php-fpm

# 设置开机自启
systemctl enable nginx
systemctl enable php-fpm

# 测试访问
curl http://localhost
```

---

## 四、NFS 文件共享部署

### 4.1 NFS 服务端配置 (nfs-31)

**安装和配置**

```bash
# 安装 NFS 服务
yum install nfs-utils rpcbind -y

# 创建共享目录
mkdir /wordpress-uploads

# 创建 www 用户（保持 UID/GID 一致）
groupadd www -g 666
useradd www -s /sbin/nologin -M -u 666 -g 666
chown -R www.www /wordpress-uploads

# 配置 exports
echo '/wordpress-uploads  172.16.1.0/24(rw,sync,all_squash,anonuid=666,anongid=666)' >> /etc/exports

# 刷新配置
exportfs -r

# 启动服务
systemctl start rpcbind nfs-server
systemctl enable rpcbind nfs-server

# 验证共享
showmount -e localhost
```

### 4.2 Web 客户端挂载 (web-7/web-8)

**安装和挂载**

```bash
# 安装客户端工具
yum install nfs-utils -y

# 创建本地挂载点
mkdir -p /code/wordpress/wp-content/uploads

# 手动挂载测试
mount -t nfs 172.16.1.31:/wordpress-uploads /code/wordpress/wp-content/uploads

# 验证挂载
df -h | grep nfs
ls -la /code/wordpress/wp-content/uploads
```

**配置开机自动挂载**

```bash
# 编辑 fstab
vim /etc/fstab

# 添加一行：
172.16.1.31:/wordpress-uploads  /code/wordpress/wp-content/uploads  nfs  defaults,_netdev  0  0

# 测试挂载
mount -a
```

---

## 五、故障排查指南

### 5.1 组件故障表现

| 组件        | 故障表现            | 解决方法                     |
| :---------- | :------------------ | :--------------------------- |
| **Nginx**   | 连接被拒绝/无法访问 | `systemctl start nginx`      |
| **PHP-FPM** | 502 Bad Gateway     | `systemctl start php-fpm`    |
| **MySQL**   | 数据库连接错误      | `systemctl start mariadb`    |
| **NFS**     | 图片 404/访问卡顿   | `systemctl start nfs-server` |

### 5.2 连接测试命令

```bash
# 测试数据库连接
mysql -uqq51 -pqweqwe -h172.16.1.51 -e "SELECT 1;"

# 测试 NFS 连接
showmount -e 172.16.1.31

# 测试网络连通性
ping 172.16.1.51
telnet 172.16.1.51 3306

# 查看当前连接
ss -an | grep 172.16.1.51
```

### 5.3 常见问题解决

**1. WeCenter 500 错误**

```bash
# 修复 Session 目录权限
mkdir -p /var/lib/php/session
chown -R www.www /var/lib/php

# 清空缓存
rm -rf /code/wecenter/cache/*
chown -R www.www /code/wecenter/cache

# 重启服务
systemctl restart php-fpm
```

**2. 文件上传失败**

```bash
# 检查权限
ls -la /code/wordpress/wp-content/uploads

# 检查 Nginx 用户
grep '^user' /etc/nginx/nginx.conf

# 检查 PHP 上传限制
grep -E '(upload_max_filesize|post_max_size)' /etc/php.ini
```

**3. NFS 挂载失败**

```bash
# 查看挂载状态
mount | grep nfs

# 重新挂载
umount /code/wordpress/wp-content/uploads
mount -t nfs 172.16.1.31:/wordpress-uploads /code/wordpress/wp-content/uploads

# 检查 NFS 服务状态
systemctl status nfs-server
```

---

## 六、性能监控建议

### 6.1 关键指标监控

```bash
# 数据库连接数
mysql -uroot -p123123 -e "SHOW STATUS LIKE 'Threads_connected';"

# Web 服务器负载
top -b -n 1 | grep -E "(nginx|php-fpm)"

# NFS 性能
nfsstat -m
```

### 6.2 日志检查位置

```bash
# Nginx 访问日志
tail -f /var/log/nginx/access.log

# PHP-FPM 错误日志
tail -f /var/log/php-fpm/error.log

# MySQL 慢查询日志
tail -f /var/log/mysql/mysql-slow.log
```

---

## 总结要点

1. **架构清晰**：业务分离，各司其职
2. **数据一致**：通过 NFS 保证文件同步
3. **配置统一**：保持多节点配置一致性
4. **故障隔离**：单点故障不影响整体服务
5. **易于扩展**：可快速增加 Web 节点

通过本次拆分，实现了：

- 数据库压力分散
- Web 服务水平扩展
- 文件存储统一管理
- 系统容错能力提升
