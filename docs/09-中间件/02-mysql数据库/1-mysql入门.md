# MySQL数据库入门与实践指南

## 一、数据库基础概念

### 1.1 数据库（DB）与数据库管理系统（DBMS）

- **数据库**：存储数据的"仓库"，以**表**为基本单位组织数据
- **DBMS**：管理和操作数据库的软件系统

### 1.2 主流数据库类型

#### 关系型数据库（SQL）

| 特点         | 适用场景                  | 代表产品                              |
| :----------- | :------------------------ | :------------------------------------ |
| 二维表格结构 | Web 1.0网站、传统企业系统 | MySQL、Oracle、SQL Server、PostgreSQL |
| 强数据一致性 | 需要复杂查询和事务支持    |                                       |
| 使用SQL语言  |                           |                                       |

#### 非关系型数据库（NoSQL）

| 特点         | 适用场景            | 代表产品                  |
| :----------- | :------------------ | :------------------------ |
| 数据结构灵活 | Web 2.0/3.0动态网站 | Redis、MongoDB、Cassandra |
| 高并发读写   | 大规模数据存取      |                           |
| 无固定模式   | 高性能要求场景      |                           |

### 1.3 核心概念类比

| 数据库概念     | 类比理解       | 说明                             |
| :------------- | :------------- | :------------------------------- |
| **数据库**     | 文件夹         | 存放相关数据的集合               |
| **表**         | 文件夹中的文件 | 存储特定类型数据的基本结构       |
| **列（字段）** | 文件中的列     | 定义数据类型（如数字、文本）     |
| **行（记录）** | 文件中的行     | 一条具体的数据记录               |
| **主键**       | 唯一标识符     | 唯一标识每一行，不能为空或重复   |
| **外键**       | 表间连接       | 指向另一张表的主键，建立关联关系 |

### 1.4 SQL语言

- **查询语言**：`SELECT`
- **操作语言**：`INSERT`、`UPDATE`、`DELETE`
- **管理语言**：`CREATE`、`DROP`

---

## 二、MySQL特点与版本选择

### 2.1 为什么选择MySQL

- 开源免费
- 性能强大稳定
- 社区活跃
- 兼容多种编程语言
- 安装简单

### 2.2 InnoDB引擎特性

1. 支持事务（ACID特性）
2. 表级锁机制
3. 支持外键约束
4. 适合电商、用户管理等场景

### 2.3 版本选择

- **企业版**：收费，提供技术支持
- **社区版**：免费，适合学习和生产（主流：5.6、5.7、8.0）

---

## 三、MySQL单实例安装部署

### 3.1 环境准备

```bash
# 进入工作目录
cd /opt

# 下载并解压（以5.7.28为例）
tar -xzf mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz

# 创建软链接
ln -s /opt/mysql-5.7.28-linux-glibc2.12-x86_64 /opt/mysql

# 配置PATH
echo 'export PATH=$PATH:/opt/mysql/bin' >> /etc/profile
source /etc/profile
```

### 3.2 依赖处理

```bash
# 移除冲突的mariadb
yum remove mariadb-libs.x86_64 -y

# 安装MySQL依赖
yum install libaio-devel -y

# 清理默认配置
rm -f /etc/my.cnf
```

### 3.3 创建用户和目录

```bash
# 创建MySQL用户
useradd -s /sbin/nologin -M mysql

# 创建数据目录
mkdir -p /linux0224/mysql_3306/

# 设置权限
chown -R mysql.mysql /linux0224/
chown -R mysql.mysql /opt/mysql*
```

### 3.4 配置文件

```bash
cat > /etc/my.cnf <<'EOF'
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

### 3.5 初始化数据库

```bash
# 初始化数据目录
mysqld --initialize-insecure --user=mysql \
       --basedir=/opt/mysql \
       --datadir=/linux0224/mysql_3306/
```

### 3.6 启动管理

#### 方式一：使用系统自带脚本

```bash
cp /opt/mysql/support-files/mysql.server /etc/init.d/mysqld
systemctl daemon-reload
systemctl start mysqld
```

#### 方式二：创建Systemd服务

```bash
cat > /etc/systemd/system/mysqld.service <<'EOF'
[Unit]
Description=MySQL Server
After=network.target

[Service]
User=mysql
Group=mysql
ExecStart=/opt/mysql/bin/mysqld --defaults-file=/etc/my.cnf
LimitNOFILE=5000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl start mysqld
```

### 3.7 登录MySQL

```bash
# 首次登录（无密码）
mysql

# 修改root密码
mysqladmin -uroot -p -S /tmp/mysql.sock password "your_new_password"
```

---

## 四、MySQL多实例部署

### 4.1 多实例优势

- 资源利用率高
- 适合资金紧张的公司
- 用户并发量不大的业务

### 4.2 创建多实例数据目录

```bash
mkdir -p /linux0224/mysql_3307
mkdir -p /linux0224/mysql_3308
chown -R mysql.mysql /linux0224
```

### 4.3 初始化实例

```bash
# 初始化3307实例
mysqld --initialize-insecure --user=mysql \
       --basedir=/opt/mysql \
       --datadir=/linux0224/mysql_3307

# 初始化3308实例
mysqld --initialize-insecure --user=mysql \
       --basedir=/opt/mysql \
       --datadir=/linux0224/mysql_3308
```

### 4.4 配置文件

#### 3307实例配置

```bash
cat > /etc/mysql_3307.cnf <<'EOF'
[mysqld]
port=3307
user=mysql
basedir=/opt/mysql/
datadir=/linux0224/mysql_3307/
socket=/linux0224/mysql_3307/mysql.sock
log_error=/linux0224/mysql_3307/mysql.log
EOF
```

#### 3308实例配置

```bash
cat > /etc/mysql_3308.cnf <<'EOF'
[mysqld]
port=3308
user=mysql
basedir=/opt/mysql/
datadir=/linux0224/mysql_3308/
socket=/linux0224/mysql_3308/mysql.sock
log_error=/linux0224/mysql_3308/mysql.log
EOF
```

### 4.5 启动脚本模板

```bash
# 创建3307启动脚本（示例）
cat > /linux0224/3307.sh <<'EOF'
#!/bin/bash
port="3307"
Cmdpath="/opt/mysql/bin/"
mysql_sock="/linux0224/mysql_\${port}/mysql.sock"
mysqld_pid_file_path="/linux0224/mysql_\${port}/mysqld_\${port}.pid"

start(){
    if [ ! -e "\$mysql_sock" ];then
        printf "Starting MySQL...\n"
        /bin/sh \${Cmdpath}/mysqld_safe \
            --defaults-file=/etc/mysql_\${port}.cnf \
            --pid-file=\$mysqld_pid_file_path 2>&1 > /dev/null &
        sleep 3
    else
        printf "MySQL is running...\n"
        exit 1
    fi
}

stop(){
    if [ ! -e "\$mysql_sock" ];then
        printf "MySQL is stopped...\n"
        exit 1
    else
        printf "Stoping MySQL...\n"
        mysqld_pid=\$(cat "\$mysqld_pid_file_path")
        kill \$mysqld_pid
        sleep 2
    fi
}

restart(){
    printf "Restarting MySQL...\n"
    stop
    sleep 2
    start
}

case "\$1" in
    start) start ;;
    stop) stop ;;
    restart) restart ;;
    *) printf "Usage: \$0 {start|stop|restart}\n" ;;
esac
EOF

# 创建3308脚本（复制修改端口即可）
sed 's/3307/3308/g' /linux0224/3307.sh > /linux0224/3308.sh
chmod +x /linux0224/3307.sh /linux0224/3308.sh
```

### 4.6 启动多实例

```bash
# 启动3306（使用系统服务）
systemctl start mysqld

# 启动3307和3308
bash /linux0224/3307.sh start
bash /linux0224/3308.sh start

# 检查端口监听
netstat -tunlp | grep mysql
```

### 4.7 设置多实例密码

```bash
# 3306实例（socket在/tmp）
mysqladmin -uroot -p -S /tmp/mysql.sock password "linux3306"

# 3307实例
mysqladmin -uroot -p -S /linux0224/mysql_3307/mysql.sock password "linux3307"

# 3308实例
mysqladmin -uroot -p -S /linux0224/mysql_3308/mysql.sock password "linux3308"
```

### 4.8 连接多实例

#### 方式一：通过IP和端口

```bash
# 连接3306
mysql -h127.0.0.1 -P3306 -uroot -plinux3306

# 连接3307
mysql -h127.0.0.1 -P3307 -uroot -plinux3307

# 连接3308
mysql -h127.0.0.1 -P3308 -uroot -plinux3308
```

#### 方式二：通过Socket文件

```bash
# 连接3306
mysql -uroot -plinux3306 -S /tmp/mysql.sock

# 连接3307
mysql -uroot -plinux3307 -S /linux0224/mysql_3307/mysql.sock

# 连接3308
mysql -uroot -plinux3308 -S /linux0224/mysql_3308/mysql.sock
```

### 4.9 快速验证连接

```bash
# 查看实例端口
mysql -uroot -plinux3307 -h127.0.0.1 -P3307 \
      -e "show global variables like 'port';"
```

---

## 五、关键文件说明

### 5.1 重要文件路径

| 文件类型       | 3306实例                             | 3307实例                                | 3308实例                                |
| :------------- | :----------------------------------- | :-------------------------------------- | :-------------------------------------- |
| **配置文件**   | `/etc/my.cnf`                        | `/etc/mysql_3307.cnf`                   | `/etc/mysql_3308.cnf`                   |
| **数据目录**   | `/linux0224/mysql_3306/`             | `/linux0224/mysql_3307/`                | `/linux0224/mysql_3308/`                |
| **Socket文件** | `/tmp/mysql.sock`                    | `/linux0224/mysql_3307/mysql.sock`      | `/linux0224/mysql_3308/mysql.sock`      |
| **PID文件**    | `/linux0224/mysql_3306/hostname.pid` | `/linux0224/mysql_3307/mysqld_3307.pid` | `/linux0224/mysql_3308/mysqld_3308.pid` |
| **错误日志**   | 默认位置                             | `/linux0224/mysql_3307/mysql.log`       | `/linux0224/mysql_3308/mysql.log`       |

### 5.2 生产环境注意事项

1. **Socket文件**：避免放在`/tmp`目录（可能被清理）
2. **权限管理**：确保MySQL用户对目录有正确权限
3. **备份策略**：定期备份数据和配置文件
4. **监控**：监控实例运行状态和资源使用情况

---

## 六、运维学习重点

### 6.1 运维方向

- 安装部署与配置优化
- 备份恢复策略
- 主从复制与高可用
- 性能监控与调优
- 安全管理与权限控制

### 6.2 开发方向

- 数据库设计与建模
- SQL编写与优化
- 索引设计与优化
- 存储过程与函数
- 事务管理与并发控制

---

## 七、实践建议

### 7.1 学习路径

1. 掌握单实例安装部署
2. 理解多实例架构
3. 学习基本SQL操作
4. 实践备份恢复
5. 探索高可用方案

### 7.2 作业要求

1. 整理数据库基础知识笔记
2. 完成MySQL 5.7多实例搭建
3. 验证各实例独立运行
4. 掌握不同连接方式

---

## 总结

MySQL作为最流行的开源关系型数据库，掌握其部署和管理是运维人员的基本技能。通过本指南，您应该能够：

- 理解数据库基本概念
- 完成MySQL单实例部署
- 配置和管理多实例环境
- 掌握不同的连接方式
- 了解生产环境最佳实践

建议在实际操作中加深理解，为后续的数据库运维和优化打下坚实基础。
