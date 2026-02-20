# SonarQube 代码质量扫描与 Jenkins 集成部署指南

## 一、软件开发流水线概述

在 DevOps 运维流水线中，代码质量扫描是测试环节的重要组成部分：

```text
开发 → 测试 → 运维
```



**测试环节包含：**

- 开发人员：负责单元测试，验证代码逻辑
- 测试工程师：使用 Jenkins 等工具进行自动化测试、环境搭建和功能测试
- SonarQube：自动化代码质量扫描工具，减少人工代码审查时间

**参考文档：**

- 华为 DevOps 软件开发流水线：https://support.huawei.com/enterprise/zh/doc/EDOC1100370695

## 二、SonarQube 简介

SonarQube 是一个开源的代码质量管理系统，用于：

- 自动化代码质量扫描
- 检测代码漏洞、坏味道和代码规范问题
- 支持多种编程语言
- 提供详细的代码质量报告

## 三、SonarQube 部署

### 3.1 MySQL 安装（存储扫描结果）

```bash
# 下载 MySQL
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz
tar zxf mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz -C /opt/
ln -s /opt/mysql-5.7.28-linux-glibc2.12-x86_64/ /opt/mysql5.7.28

# 配置环境变量
echo 'export PATH=$PATH:/opt/mysql5.7.28/bin/' >> /etc/profile
source /etc/profile
mysql -V

# 创建配置文件
cat> /etc/my.cnf <<'EOF'
[mysqld]
user=mysql
basedir=/opt/mysql5.7.28/
datadir=/mysql_db/
socket=/tmp/mysql.sock
max_allowed_packet=100M

[mysql]
socket=/tmp/mysql.sock
EOF

# 安装依赖
yum install -y libaio-devel

# 创建用户和目录
useradd -s /sbin/nologin -M mysql
mkdir -p /mysql_db/
chown -R mysql.mysql /mysql_db/
chown -R mysql.mysql /opt/mysql*

# 初始化数据库
mysqld --initialize-insecure --user=mysql --basedir=/opt/mysql5.7.28/ --datadir=/mysql_db/

# 配置服务管理
cp /opt/mysql5.7.28/support-files/mysql.server /etc/init.d/mysqld
systemctl daemon-reload
systemctl start mysqld

# 设置 root 密码
mysqladmin -uroot -p password qwe123123
```



### 3.2 SonarQube 安装

```bash
# 创建目录并下载
mkdir /opt/sonar1
cd /opt/sonar1
wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-7.0.zip
unzip sonarqube-7.0.zip

# 创建专用用户
useradd sonar -M -s /sbin/nologin
chown -R sonar.sonar /opt/sonar1/sonarqube-7.0
ln -s /opt/sonar1/sonarqube-7.0 /opt/sonarqube

# 配置数据库连接
cat > /opt/sonarqube/conf/sonar.properties << 'EOF'
sonar.jdbc.username=root
sonar.jdbc.password=qwe123123
sonar.jdbc.url=jdbc:mysql://localhost:3306/sonar?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance&useSSL=false
EOF

# 创建数据库
mysql -uroot -pqwe123123 -e "create database sonar;"

# 修改运行用户
sed -i 's/^#RUN_AS_USER=/RUN_AS_USER=sonar/' /opt/sonarqube/bin/linux-x86-64/sonar.sh

# 创建 systemd 服务
cat >/usr/lib/systemd/system/sonar.service<<'EOF'
[Unit]
Description=sonar

[Service]
ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start
ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop
Type=forking
User=sonar
Group=sonar

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
systemctl daemon-reload
systemctl start sonar
netstat -tunlp|grep 9000
```



### 3.3 访问 SonarQube

- 地址：[http://10.0.0.101:9000](http://10.0.0.101:9000/)
- 默认账号：admin/admin

### 3.4 生成 Jenkins Token

在 SonarQube 中生成用于 Jenkins 集成的 Token，例如：

```text
jenkins: ca267bd60ccd27c779876c5a4f21db4eb3808546
```



## 四、SonarQube 客户端配置

### 4.1 安装 SonarScanner

```bash
# 下载和解压
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.0.0.1744-linux.zip
unzip sonar-scanner-cli-4.0.0.1744-linux.zip

# 配置环境变量
echo 'export PATH=$PATH:/opt/sonar1/sonar-scanner-4.0.0.1744-linux/bin' >> /etc/profile
source /etc/profile
```



### 4.2 手动代码扫描命令

```bash
sonar-scanner \
  -Dsonar.projectKey=linux0224 \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://10.0.0.101:9000 \
  -Dsonar.login=ca267bd60ccd27c779876c5a4f21db4eb3808546
```



### 4.3 安装中文插件

1. 下载中文插件（兼容版本）
2. 将插件 JAR 文件放入：`/opt/sonarqube/extensions/plugins/`
3. 重启服务：`systemctl restart sonar`
4. 查看日志：`tail -f /opt/sonarqube/logs/web.log`

## 五、SonarQube 与 Jenkins 集成

### 5.1 Jenkins 配置

1. **添加 SonarQube 服务器**
   - 系统管理 → 系统配置 → SonarQube servers
   - 添加服务器地址和 Token
2. **配置 SonarScanner**
   - 系统管理 → 全局工具配置 → SonarScanner
   - 指定 SonarScanner 安装路径

### 5.2 在 Jenkins Job 中添加构建步骤

```bash
# 在构建步骤中添加 Execute SonarQube Scanner
sonar.projectKey=${JOB_NAME}
sonar.sources=.
sonar.host.url=http://10.0.0.101:9000
sonar.login=ca267bd60ccd27c779876c5a4f21db4eb3808546
```



### 5.3 完整 DevOps 流程

```text
GitLab（代码提交）
    ↓
Jenkins（自动触发）
    ├── 代码拉取
    ├── SonarQube 代码扫描（测试环节）
    ├── 单元测试执行
    └── 构建和部署（运维环节）
```



## 六、常见问题解决

### 6.1 MySQL 数据包大小问题

**错误信息：**

```text
Packet for query is too large (14777376 > 4194304)
```



**解决方案：**
在 MySQL 配置文件中增加：

```ini
[mysqld]
max_allowed_packet=100M
```



### 6.2 Node.js 环境问题

对于 JavaScript 项目扫描，需要安装 Node.js：

```bash
cd /opt/
wget https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz
tar xf node-v12.13.0-linux-x64.tar.xz
mv node-v12.13.0-linux-x64 node
echo 'export PATH=$PATH:/opt/node/bin' >> /etc/profile
source /etc/profile
```



### 6.3 插件兼容性问题

如果插件不兼容：

1. 查看日志文件：`/opt/sonarqube/logs/web.log`
2. 删除不兼容的插件
3. 重启 SonarQube 服务

## 七、最佳实践建议

1. **定期更新**：保持 SonarQube 和插件的最新版本
2. **自定义规则**：根据团队规范调整代码质量规则
3. **集成到 CI/CD**：确保每次代码提交都进行质量扫描
4. **设置质量阈**：定义通过/失败的质量标准
5. **定期审查**：团队定期审查代码质量问题

## 八、总结

通过 SonarQube 与 Jenkins 的集成，可以实现：

- 自动化代码质量检测
- 提前发现潜在缺陷
- 统一的代码质量标准
- 持续改进开发流程

这种集成不仅提高了代码质量，还减少了人工代码审查的工作量，是现代化 DevOps 流程中不可或缺的一环。