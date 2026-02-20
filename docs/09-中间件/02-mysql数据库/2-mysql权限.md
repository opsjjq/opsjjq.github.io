# MySQL权限管理与连接配置指南

## 一、MySQL连接方式

### 1.1 C/S架构理解

MySQL采用客户端/服务器模式，支持多种连接方式：

| 连接方式   | 适用场景          | 命令示例                            |
| :--------- | :---------------- | :---------------------------------- |
| 网络连接   | 远程/本地网络访问 | `mysql -uroot -p密码 -hIP -P端口`   |
| 套接字连接 | 本地服务器连接    | `mysql -uroot -p密码 -S socket文件` |

### 1.2 具体连接命令

```bash
# 网络连接（推荐远程）
mysql -uroot -plinux3306 -h10.0.0.52 -P3306

# 本地网络连接
mysql -uroot -plinux3306 -hlocalhost -P3306
mysql -uroot -plinux3306 -h127.0.0.1 -P3306

# 套接字连接（仅限本地）
mysql -uroot -plinux3306 -S /tmp/mysql.sock
```

---

## 二、MySQL启停管理

### 2.1 服务启停方式

```bash
# Systemd管理（推荐）
systemctl start mysqld
systemctl stop mysqld
systemctl restart mysqld
systemctl status mysqld

# 传统服务管理
service mysqld start
service mysqld stop
/etc/init.d/mysqld start

# 命令行关闭（优雅）
mysql> shutdown;
```

### 2.2 mysqld_safe与mysqld区别

| 组件            | 作用                | 使用场景                              |
| :-------------- | :------------------ | :------------------------------------ |
| **mysqld_safe** | MySQL守护进程脚本   | 监控mysqld进程，自动重启，收集日志    |
| **mysqld**      | MySQL核心服务器程序 | 数据库核心服务，管理数据文件和SQL请求 |

**现代系统中**：Systemd已承担了mysqld_safe的守护职责，通常直接启动mysqld进程。

### 2.3 自定义服务脚本

```ini
# /etc/systemd/system/mysqld.service
[Unit]
Description=mysql server by www.yuchaoit.cn
Documentation=man:mysqld(8)
After=network.target
After=syslog.target

[Service]
User=mysql
Group=mysql
ExecStart=/opt/mysql/bin/mysqld --defaults-file=/etc/my.cnf
LimitNOFILE=5000

[Install]
WantedBy=multi-user.target
```

使用步骤：

```bash
# 1. 创建服务文件
cat > /etc/systemd/system/mysqld.service <<'EOF'
[Unit]
Description=mysql server
After=network.target

[Service]
User=mysql
Group=mysql
ExecStart=/opt/mysql/bin/mysqld --defaults-file=/etc/my.cnf

[Install]
WantedBy=multi-user.target
EOF

# 2. 重载服务配置
systemctl daemon-reload

# 3. 启用服务
systemctl enable mysqld
systemctl start mysqld
```

---

## 三、MySQL配置文件

### 3.1 配置文件模板

```ini
# /etc/my.cnf 示例
[mysqld]                  # 服务端配置
port=3306                 # 端口号
server_id=1               # 服务器ID（主从复制用）
user=mysql                # 运行用户
basedir=/opt/mysql        # MySQL安装目录
datadir=/data/mysql_3306  # 数据目录
socket=/tmp/mysql.sock    # 套接字文件路径
log-error=/data/mysql_3306/logs/error.log  # 错误日志

[mysql]                   # 客户端配置
socket=/tmp/mysql.sock    # 客户端连接使用的socket文件

[mysqldump]              # 备份工具配置
max_allowed_packet=64M
```

### 3.2 配置段说明

| 配置段          | 作用对象        | 说明               |
| :-------------- | :-------------- | :----------------- |
| `[mysqld]`      | mysqld进程      | 服务器核心配置     |
| `[mysqld_safe]` | mysqld_safe脚本 | 守护进程配置       |
| `[mysql]`       | mysql客户端     | 本地客户端连接配置 |
| `[client]`      | 所有客户端      | 通用客户端配置     |
| `[mysqldump]`   | mysqldump命令   | 备份工具配置       |

---

## 四、用户与权限管理

### 4.1 用户管理基础

#### 创建用户

```sql
-- 创建用户（无密码）
CREATE USER 'chaoge01'@'localhost';

-- 创建用户并设置密码
CREATE USER 'chaoge02'@'localhost' IDENTIFIED BY '123';

-- 使用授权语句创建用户（推荐）
GRANT ALL ON *.* TO 'yuchao01'@'localhost' IDENTIFIED BY 'yuchao666';
```

#### 查看用户

```sql
-- 查看所有用户
SELECT User, Host, authentication_string FROM mysql.user;

-- 查看当前用户
SELECT USER();
SELECT CURRENT_USER();
```

#### 修改用户

```sql
-- 修改用户密码（root操作）
ALTER USER 'chaoge01'@'localhost' IDENTIFIED BY 'new_password';

-- 修改自己密码
SET PASSWORD = PASSWORD('new_password');
```

#### 删除用户

```sql
DROP USER 'chaoge02'@'localhost';
```

### 4.2 主机白名单规则

MySQL通过`用户@主机`的形式控制访问来源：

| 主机格式      | 允许访问的客户端              | 示例                 |
| :------------ | :---------------------------- | :------------------- |
| `'localhost'` | 本地连接（socket或127.0.0.1） | `yuchao@'localhost'` |
| `'127.0.0.1'` | 仅限本机127.0.0.1连接         | `yuchao@'127.0.0.1'` |
| `'10.0.0.%'`  | 10.0.0.0/24网段               | `yuchao@'10.0.0.%'`  |
| `'10.0.0.5%'` | 10.0.0.50-59                  | `yuchao@'10.0.0.5%'` |
| `'%'`         | 任意主机                      | `yuchao@'%'`         |
| `'db-51'`     | 主机名方式                    | `yuchao@'db-51'`     |

### 4.3 授权管理

#### GRANT语法

```sql
GRANT 权限列表 ON 数据库.表 TO 用户名@主机 IDENTIFIED BY '密码';
```

#### 常用授权示例

```sql
-- 1. 授予最大权限（类似root）
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' IDENTIFIED BY 'admin666';

-- 2. 授予开发人员基本权限（限定数据库）
GRANT SELECT, INSERT, UPDATE, DELETE ON dev_db.* TO 'dev01'@'10.0.0.%' IDENTIFIED BY 'dev666';

-- 3. 授予测试人员权限（只读）
GRANT SELECT ON test_db.* TO 'tester'@'172.16.1.%' IDENTIFIED BY 'test666';

-- 4. 授予特定表权限
GRANT SELECT, UPDATE ON company.employees TO 'hr'@'localhost' IDENTIFIED BY 'hr666';
```

#### 查看权限

```sql
-- 查看当前用户权限
SHOW GRANTS;

-- 查看指定用户权限
SHOW GRANTS FOR 'dev01'@'10.0.0.%';
```

#### 权限回收

```sql
-- 回收特定权限
REVOKE DELETE ON dev_db.* FROM 'dev01'@'10.0.0.%';

-- 回收所有权限
REVOKE ALL ON dev_db.* FROM 'dev01'@'10.0.0.%';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 4.4 权限列表详解

| 权限                   | 说明           | 常用场景   |
| :--------------------- | :------------- | :--------- |
| **ALL/ALL PRIVILEGES** | 所有权限       | 管理员账户 |
| **SELECT**             | 查询数据       | 只读账户   |
| **INSERT**             | 插入数据       | 数据录入   |
| **UPDATE**             | 更新数据       | 数据维护   |
| **DELETE**             | 删除数据       | 数据清理   |
| **CREATE**             | 创建数据库/表  | 开发人员   |
| **DROP**               | 删除数据库/表  | 开发人员   |
| **ALTER**              | 修改表结构     | DBA/开发   |
| **INDEX**              | 创建/删除索引  | DBA/开发   |
| **CREATE VIEW**        | 创建视图       | 开发人员   |
| **SHOW DATABASES**     | 查看数据库列表 | 普通用户   |
| **USAGE**              | 仅连接权限     | 最低权限   |

---

## 五、密码管理

### 5.1 修改密码方法

#### mysqladmin命令

```bash
mysqladmin -uroot -p旧密码 password 新密码
```

#### SET语句

```sql
-- 修改其他用户密码（需要权限）
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('新密码');

-- 修改自己密码
SET PASSWORD = PASSWORD('新密码');
```

#### UPDATE语句（不推荐）

```sql
UPDATE mysql.user SET authentication_string = PASSWORD('新密码')
WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

### 5.2 密码策略配置

```sql
-- 查看密码策略
SHOW VARIABLES LIKE 'validate_password%';

-- 降低密码复杂度要求（测试环境）
SET GLOBAL validate_password_policy = 0;
SET GLOBAL validate_password_length = 4;
SET GLOBAL validate_password_mixed_case_count = 0;
SET GLOBAL validate_password_number_count = 0;
SET GLOBAL validate_password_special_char_count = 0;
```

### 5.3 忘记root密码处理

```bash
# 1. 停止MySQL服务
systemctl stop mysqld

# 2. 跳过权限表启动（安全模式）
mysqld_safe --skip-grant-tables --user=mysql &

# 3. 免密登录修改密码
mysql
UPDATE mysql.user SET authentication_string = PASSWORD('新密码')
WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;

# 4. 退出并重启
mysql> shutdown;
systemctl start mysqld
```

---

## 六、远程连接配置

### 6.1 配置远程访问步骤

```sql
-- 1. 创建远程访问用户
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' IDENTIFIED BY 'remote_pwd';

-- 2. 刷新权限
FLUSH PRIVILEGES;

-- 3. 检查用户创建
SELECT User, Host FROM mysql.user WHERE Host != 'localhost';
```

### 6.2 Navicat连接配置

1. **连接信息填写**：
   - 连接名：自定义
   - 主机：MySQL服务器IP
   - 端口：3306（默认）
   - 用户名：授权用户
   - 密码：对应密码
2. **测试连接**：确认网络连通和权限正确

### 6.3 连接测试命令

```bash
# 测试远程连接
mysql -uremote_user -premote_pwd -h服务器IP -P3306 -e "SELECT VERSION();"

# 查看当前连接信息
mysql> SELECT USER(), DATABASE(), CONNECTION_ID();
```

---

## 七、安全最佳实践

### 7.1 用户权限原则

1. **最小权限原则**：只授予必要的最小权限
2. **按需分配**：根据角色分配不同的权限集
3. **定期审计**：定期检查用户权限
4. **及时清理**：删除不再使用的账户

### 7.2 生产环境建议

```sql
-- 1. 避免使用root远程登录
REVOKE ALL ON *.* FROM 'root'@'%';
DROP USER 'root'@'%';

-- 2. 创建专用管理账户
GRANT ALL ON *.* TO 'dba_admin'@'10.0.0.%' IDENTIFIED BY '复杂密码';

-- 3. 应用使用专用账户
GRANT SELECT, INSERT, UPDATE, DELETE ON app_db.* TO 'app_user'@'应用服务器IP' IDENTIFIED BY '应用密码';

-- 4. 备份使用专用账户
GRANT SELECT, LOCK TABLES, RELOAD ON *.* TO 'backup_user'@'备份服务器IP' IDENTIFIED BY '备份密码';
```

---

## 八、故障排查

### 8.1 常见连接问题

| 问题           | 可能原因            | 解决方案                   |
| :------------- | :------------------ | :------------------------- |
| 连接被拒绝     | 用户不存在/密码错误 | 检查用户权限和密码         |
| 无法连接到主机 | 防火墙/网络问题     | 检查防火墙和网络连通性     |
| 权限不足       | 用户权限不足        | 重新授权或使用更高权限用户 |
| 连接数过多     | max_connections限制 | 调整配置或清理闲置连接     |

### 8.2 诊断命令

```bash
# 查看连接状态
netstat -tunlp | grep 3306

# 查看MySQL进程
ps aux | grep mysqld

# 查看错误日志
tail -f /var/log/mysql/error.log

# 查看当前连接
mysql> SHOW PROCESSLIST;
```

---

## 九、总结要点

1. **连接方式**：掌握网络连接和套接字连接的区别与使用场景
2. **权限管理**：理解GRANT/REVOKE语句，掌握最小权限原则
3. **用户管理**：熟练创建、修改、删除用户
4. **密码安全**：掌握密码修改和重置方法
5. **配置文件**：理解各配置段的作用
6. **服务管理**：掌握多种启停MySQL的方式

通过本章学习，您应该能够独立完成MySQL的用户权限配置、远程访问设置和基本的故障排查工作。
