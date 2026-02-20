# 云服务器 MySQL 操作手册

## 一、删除旧版 MySQL

### 1.1 执行删除脚本

```bash
# 创建删除脚本
cat > remove_mysql.sh << 'EOF'
#!/bin/bash
# 停止 MySQL
echo "正在停止 MySQL 服务..."
sudo systemctl stop mysql 2>/dev/null
sudo systemctl stop mysqld 2>/dev/null
sudo /usr/local/mysql/support-files/mysql.server stop 2>/dev/null

# 杀死所有 MySQL 进程
echo "正在结束 MySQL 进程..."
sudo pkill -9 mysql
sudo pkill -9 mysqld

# 删除安装目录
echo "正在删除安装目录..."
sudo rm -rf /usr/local/mysql

# 删除数据目录
echo "正在删除数据目录..."
sudo rm -rf /usr/local/mysql/data
sudo rm -rf /var/lib/mysql

# 删除配置文件
echo "正在删除配置文件..."
sudo rm -rf /etc/my.cnf
sudo rm -rf /etc/mysql
sudo rm -rf /etc/my.cnf.d

# 删除日志文件
echo "正在删除日志文件..."
sudo rm -rf /var/log/mysql*
sudo rm -rf /var/log/mysqld.log

# 清理系统服务
echo "正在清理系统服务..."
sudo systemctl disable mysql 2>/dev/null
sudo systemctl disable mysqld 2>/dev/null
sudo rm -rf /etc/systemd/system/mysql.service
sudo rm -rf /etc/systemd/system/mysqld.service
sudo systemctl daemon-reload

# 删除用户和组
echo "正在删除用户和组..."
sudo userdel mysql 2>/dev/null
sudo groupdel mysql 2>/dev/null

echo "MySQL 已完全删除！"
EOF

# 执行删除脚本
chmod +x remove_mysql.sh
sudo ./remove_mysql.sh
```

### 1.2 清理环境变量

```bash
# 删除 /etc/profile 中的 MySQL 环境变量
sed -i '/export PATH=\$PATH:\/opt\/mysql\/bin/d' /etc/profile
source /etc/profile

# 验证是否清理成功
mysql -V
# 无输出表示已清理干净
```

---

## 二、安装 MySQL 5.7.28

### 2.1 安装步骤

```bash
# 进入安装目录
cd /opt

# 解压 MySQL 安装包
tar -xzf mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz

# 创建软链接
ln -s /opt/mysql-5.7.28-linux-glibc2.12-x86_64 /opt/mysql

# 配置环境变量
echo 'export PATH=$PATH:/opt/mysql/bin' >> /etc/profile
source /etc/profile

# 验证安装
mysql -V

# 安装依赖
yum install libaio-devel -y

# 创建 MySQL 用户
useradd -s /sbin/nologin -M mysql

# 创建数据目录
mkdir -p /linux0224/mysql_3306/

# 设置目录权限
chown -R mysql.mysql /linux0224/
chown -R mysql.mysql /linux0224/*
chown -R mysql.mysql /opt/mysql*

# 验证权限
ls -ld /linux0224 /linux0224/mysql_3306/ /opt/mysql*

# 初始化数据库
mysqld --initialize-insecure --user=mysql \
       --basedir=/opt/mysql \
       --datadir=/linux0224/mysql_3306/
```

---

## 三、MySQL 配置

### 3.1 配置文件

```bash
cat > /etc/my.cnf << 'EOF'
[mysqld]
port=3306
user=mysql
basedir=/opt/mysql
datadir=/linux0224/mysql_3306/
socket=/tmp/mysql.sock

[mysql]
socket=/tmp/mysql.sock
EOF
```

### 3.2 服务管理

#### 方式一：使用自带脚本

```bash
cp /opt/mysql/support-files/mysql.server /etc/init.d/mysqld
systemctl daemon-reload
systemctl start mysqld
```

#### 方式二：创建 Systemd 服务

```bash
cat > /etc/systemd/system/mysqld.service << 'EOF'
[Unit]
Description=mysql server by www.yuchaoit.cn
Documentation=man:mysqld(8)
Documentation=https://dev.mysql.com/doc/refman/en/using-systemd.html
After=network.target
After=syslog.target

[Install]
WantedBy=multi-user.target

[Service]
User=mysql
Group=mysql
ExecStart=/opt/mysql/bin/mysqld --defaults-file=/etc/my.cnf
LimitNOFILE=5000
EOF

# 重新加载并启动
systemctl daemon-reload
systemctl start mysqld
```

---

## 四、MySQL 密码管理

### 4.1 设置初始密码

```bash
# 设置 root 初始密码
mysqladmin -uroot password qwe123 -S /tmp/mysql.sock

# 登录验证
mysql -uroot -pqwe123
```

### 4.2 修改密码的多种方式

#### 4.2.1 使用 mysqladmin

```bash
# 修改当前用户密码
mysqladmin -uroot -plinux3306 -S /tmp/mysql.sock password new3306

# 交互式修改密码
mysqladmin -uroot -p -S /tmp/mysql.sock password
```

#### 4.2.2 使用 SQL 语句

##### SET 语句

```bash
# 管理员修改其他用户密码
SET PASSWORD FOR 'sql01'@'localhost' = PASSWORD('qwe123');

# 用户修改自己密码
SET PASSWORD = 'new_password';
```

##### UPDATE 语句

```sql
UPDATE mysql.user SET authentication_string = PASSWORD('qwe123')
WHERE user = 'sql01' AND host = 'localhost';
FLUSH PRIVILEGES;
```

##### ALTER USER 语句

```sql
ALTER USER 'sql02'@'localhost' IDENTIFIED BY 'qwe123';
```

---

## 五、忘记 root 密码重置

### 方法一：修改配置文件

```bash
# 1. 修改配置文件，添加跳过授权表参数
vim /etc/my.cnf
# 添加如下行：
# skip-grant-tables

# 2. 重启 MySQL
systemctl restart mysqld

# 3. 无密码登录
mysql -uroot

# 4. 重置密码
UPDATE mysql.user SET authentication_string = PASSWORD('123123')
WHERE user = 'root' AND host = 'localhost';
FLUSH PRIVILEGES;

# 5. 移除免密参数，重启服务
# 删除 skip-grant-tables
systemctl restart mysqld
```

### 方法二：命令行启动免密

```bash
# 停止当前 MySQL 服务
systemctl stop mysqld

# 以跳过授权表方式启动
/opt/mysql/bin/mysqld_safe --defaults-file=/etc/my.cnf \
    --pid-file=/linux0224/mysql_3306/yun.pid \
    --skip-grant-tables &

# 无密码登录重置
mysql -uroot
UPDATE mysql.user SET authentication_string = PASSWORD('123123')
WHERE user = 'root' AND host = 'localhost';
FLUSH PRIVILEGES;

# 停止免密实例，正常启动
pkill mysqld
systemctl start mysqld
```

---

## 六、部署 JPress 网站

### 6.1 部署步骤

```bash
# 将 jpress.war 放到 Tomcat 目录
cp jpress.war /opt/tomcat8027/webapps/

# 重启 Tomcat（会自动解压 war 包）
/opt/tomcat8027/bin/shutdown.sh
/opt/tomcat8027/bin/startup.sh
```

### 6.2 数据库配置

```bash
# 访问网站进行安装
# 地址: http://服务器IP:8080/jpress

# 数据库连接信息：
# 主机: 127.0.0.1
# 用户: root
# 密码: qwe123
# 数据库: jpress（自动创建）
```

### 6.3 远程连接配置

```sql
-- 创建远程访问用户
GRANT SELECT, UPDATE, DELETE, INSERT ON jpress.*
TO 'jpress'@'%' IDENTIFIED BY 'jpress1';

-- 刷新权限
FLUSH PRIVILEGES;
```

---

## 七、安全建议

1. **修改默认端口**：避免使用 3306 默认端口，改为非常用端口
2. **限制访问 IP**：仅允许必要的 IP 地址访问
3. **定期修改密码**：建议每 3 个月修改一次数据库密码
4. **启用防火墙**：配置防火墙规则，限制数据库端口的访问
5. **备份策略**：定期备份数据库，确保数据安全

---

## 八、常用命令速查

| 命令                      | 用途                | 示例                                      |
| :------------------------ | :------------------ | :---------------------------------------- |
| `mysql -V`                | 查看 MySQL 版本     | `mysql -V`                                |
| `systemctl status mysqld` | 查看服务状态        | `systemctl status mysqld`                 |
| `mysqladmin ping`         | 检查 MySQL 是否运行 | `mysqladmin ping -uroot -p`               |
| `mysql -e`                | 执行 SQL 语句       | `mysql -uroot -p -e "SHOW DATABASES;"`    |
| `mysqldump`               | 备份数据库          | `mysqldump -uroot -p dbname > backup.sql` |

---

**文档说明**：

- 本文档适用于 CentOS 7/8 系统
- MySQL 版本：5.7.28
- 安装方式：二进制包安装
- 数据目录：`/linux0224/mysql_3306/`
- 配置文件：`/etc/my.cnf`
