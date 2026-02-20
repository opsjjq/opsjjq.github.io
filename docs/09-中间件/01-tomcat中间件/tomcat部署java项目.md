# Tomcat 部署与管理指南

## 1. Tomcat 简介

### 1.1 什么是 Tomcat

Tomcat 是一个开源的轻量级 Web 应用服务器，主要用于部署和运行 Java Servlet 和 JSP 程序。它是 Apache 软件基金会的核心项目之一，在中小型系统和并发量要求不高的场景中被广泛使用。

### 1.2 Tomcat 与 Nginx 的区别

| 特性     | Tomcat                            | Nginx                       |
| :------- | :-------------------------------- | :-------------------------- |
| 主要用途 | Java Web 应用服务器               | 高性能 HTTP 服务器/反向代理 |
| 支持资源 | 动态资源（JSP/Servlet）和静态资源 | 主要处理静态资源            |
| 适用场景 | 后端应用服务处理                  | 前端负载均衡、静态资源服务  |
| 企业方案 | 通常与 Nginx 结合使用             | 作为前端代理处理静态资源    |

**典型架构**：Nginx + Tomcat，Nginx 处理静态资源并做负载均衡，Tomcat 处理动态 Java 应用。

## 2. Tomcat 安装部署

### 2.1 环境准备

- 操作系统：CentOS 7
- IP 地址：10.0.0.10
- 默认端口：8080
- 需要软件：JDK + Tomcat

### 2.2 安装 JDK

```bash
# 下载 JDK（以 8u221 为例）
cd /opt
tar -xf jdk-8u221-linux-x64.tar.gz
ln -s /opt/jdk1.8.0_221 /opt/jdk8

# 配置环境变量
cat >> /etc/profile << 'EOF'
export JAVA_HOME=/opt/jdk8
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
export CLASSPATH=.$CLASSPATH:$JAVA_HOME/lib:$JAVA_HOME/jre/lib:$JAVA_HOME/lib/tools.jar
EOF

# 使配置生效
source /etc/profile

# 验证安装
java -version
```



### 2.3 安装 Tomcat

```bash
# 下载并解压 Tomcat
cd /opt
tar -xf apache-tomcat-8.0.27.tar.gz
ln -s /opt/apache-tomcat-8.0.27 /opt/tomcat8027

# 查看目录结构
ls /opt/tomcat8027/
# bin   - 启动/关闭脚本和依赖文件（重要）
# conf  - 配置文件目录（重要）
# lib   - 运行所需的 jar 包（重要）
# logs  - 运行日志（重要）
# webapps - 站点目录（重要）
# work  - 运行时缓存文件
# temp  - 临时文件

# 验证安装
/opt/tomcat8027/bin/version.sh
```



## 3. Tomcat 基本操作

### 3.1 启动与停止

```bash
# 启动 Tomcat
/opt/tomcat8027/bin/startup.sh

# 停止 Tomcat
/opt/tomcat8027/bin/shutdown.sh

# 检查运行状态
netstat -tunlp | grep java
# 默认端口：8080（HTTP）、8009（AJP）、8005（管理）

# 查看日志
tail -f /opt/tomcat8027/logs/catalina.out
```



### 3.2 访问 Tomcat

浏览器访问：`http://10.0.0.10:8080`

### 3.3 配置管理账户

```bash
# 编辑配置文件
vim /opt/tomcat8027/conf/tomcat-users.xml

# 添加以下内容（在 </tomcat-users> 前）
<role rolename="manager-gui"/>
<role rolename="admin-gui"/>
<user username="tomcat" password="qwe123" roles="manager-gui,admin-gui"/>

# 重启 Tomcat
/opt/tomcat8027/bin/shutdown.sh
/opt/tomcat8027/bin/startup.sh
```



**访问管理界面**：

- Manager App: `http://10.0.0.10:8080/manager/html`
- Host Manager: `http://10.0.0.10:8080/host-manager/html`
- 用户名：tomcat，密码：qwe123

## 4. Tomcat 配置文件详解

### 4.1 主要配置文件

```text
/opt/tomcat8027/conf/
├── server.xml        # 主配置文件，定义端口、连接器、引擎等
├── web.xml           # 全局Web应用部署描述符
├── context.xml       # 上下文配置
├── tomcat-users.xml  # 用户认证配置
├── catalina.properties # Catalina属性配置
└── logging.properties  # 日志配置
```



### 4.2 Server.xml 核心结构

```xml
<Server>          <!-- 顶级元素，代表整个Tomcat实例 -->
    <Service>     <!-- 服务，包含连接器和引擎 -->
        <Connector/> <!-- 连接器，处理客户端请求 -->
        <Engine>    <!-- 引擎，处理请求 -->
            <Host>  <!-- 虚拟主机 -->
                <Context/> <!-- Web应用上下文 -->
            </Host>
        </Engine>
    </Service>
</Server>
```



## 5. 部署 Java 应用

### 5.1 WAR 包部署（传统方式）

```bash
# 1. 准备 WAR 包（如 jpress.war）
# 2. 放置到 webapps 目录
cp jpress.war /opt/tomcat8027/webapps/

# 3. Tomcat 会自动解压并部署
# 访问地址：http://10.0.0.10:8080/jpress

# 4. 如需手动解压
cd /opt/tomcat8027/webapps/
unzip jpress.war -d jpress/
```



### 5.2 Maven 源码部署

```bash
# 1. 安装 Maven
cd /opt
tar -xf apache-maven-3.3.9-bin.tar.gz
echo 'export PATH=$PATH:/opt/apache-maven-3.3.9/bin/' >> /etc/profile
source /etc/profile
mvn -v

# 2. 配置 Maven 镜像源（加速下载）
vim /opt/apache-maven-3.3.9/conf/settings.xml
# 添加阿里云镜像：
<mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>

# 3. 下载并编译项目
cd /tmp
git clone https://gitee.com/JPressProjects/jpress.git
cd jpress
mvn clean package

# 4. 运行项目（如果项目自带启动脚本）
cd /tmp/jpress/starter/target/starter-5.0/
vim jpress.sh  # 修改端口和绑定地址
# 修改 JAVA_OPTS：
# JAVA_OPTS="-Xms256m -Xmx1024m -Dundertow.port=8080 -Dundertow.host=0.0.0.0"

./jpress.sh start
```



### 5.3 数据库配置

```sql
-- 在 MySQL 服务器上执行（如 db-51）
-- 为 Tomcat 应用创建远程访问权限
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'linux0224';
FLUSH PRIVILEGES;
```



## 6. Tomcat 多实例部署

### 6.1 创建多实例

```bash
# 1. 复制 Tomcat 实例
cd /opt
cp -r apache-tomcat-8.0.27 tomcat-instance1
cp -r apache-tomcat-8.0.27 tomcat-instance2

# 2. 修改端口配置（避免冲突）
# 实例1：8081、8006、8010
# 实例2：8082、8007、8011

# 3. 创建管理脚本目录
mkdir -p /opt/tomcat-shell
```



### 6.2 多实例配置示例

```bash
# 实例1的 server.xml 修改
sed -i 's/8005/8006/g' /opt/tomcat-instance1/conf/server.xml
sed -i 's/8080/8081/g' /opt/tomcat-instance1/conf/server.xml
sed -i 's/8009/8010/g' /opt/tomcat-instance1/conf/server.xml

# 实例2的 server.xml 修改
sed -i 's/8005/8007/g' /opt/tomcat-instance2/conf/server.xml
sed -i 's/8080/8082/g' /opt/tomcat-instance2/conf/server.xml
sed -i 's/8009/8011/g' /opt/tomcat-instance2/conf/server.xml
```



### 6.3 启动多实例

```bash
# 分别启动
/opt/tomcat-instance1/bin/startup.sh
/opt/tomcat-instance2/bin/startup.sh

# 验证端口
netstat -tunlp | grep java
```



## 7. Nginx + Tomcat 负载均衡

### 7.1 Nginx 配置

```nginx
http {
    upstream tomcat_cluster {
        server 10.0.0.10:8081 weight=1;
        server 10.0.0.10:8082 weight=1;
        # 可添加更多实例
    }
    
    server {
        listen 80;
        server_name your-domain.com;
        
        location / {
            proxy_pass http://tomcat_cluster;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        
        # 静态资源由 Nginx 直接处理
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 30d;
            # 可配置静态资源目录
        }
    }
}
```



### 7.2 部署流程

1. 在多实例上部署相同的应用
2. 配置 Nginx 负载均衡
3. 验证访问：`http://your-domain.com`

## 8. 监控与维护

### 8.1 日志管理

```bash
# 主要日志文件
/opt/tomcat8027/logs/
├── catalina.out      # 标准输出/错误日志
├── catalina.yyyy-mm-dd.log  # 每日日志
├── localhost.yyyy-mm-dd.log # 应用日志
└── localhost_access_log.yyyy-mm-dd.txt  # 访问日志

# 日志轮转配置
vim /opt/tomcat8027/conf/logging.properties
```



### 8.2 性能监控

```bash
# JVM 监控
jps -l  # 查看 Java 进程
jstat -gcutil <pid>  # 垃圾回收统计
jmap -heap <pid>     # 堆内存信息

# 系统监控
top -p $(pgrep -f java)
```



### 8.3 常见问题排查

1. **端口冲突**：修改 `server.xml` 中的端口配置
2. **内存不足**：调整 `catalina.sh` 中的 JVM 参数
3. **权限问题**：检查文件权限和 SELinux 设置
4. **应用部署失败**：检查 `webapps` 目录和 `catalina.out` 日志

## 9. 最佳实践

### 9.1 安全建议

1. 修改默认端口（8080 → 其他端口）
2. 禁用不必要的管理功能
3. 定期更新 Tomcat 和 JDK 版本
4. 配置防火墙规则，限制访问来源

### 9.2 性能优化

1. 调整 JVM 内存参数（`-Xms`、`-Xmx`）
2. 启用连接池和线程池
3. 配置静态资源缓存
4. 启用 GZIP 压缩

### 9.3 备份策略

```bash
# 备份配置文件
tar -czf tomcat-config-backup-$(date +%Y%m%d).tar.gz /opt/tomcat8027/conf/

# 备份应用数据
tar -czf webapps-backup-$(date +%Y%m%d).tar.gz /opt/tomcat8027/webapps/

# 备份日志（可选）
tar -czf logs-backup-$(date +%Y%m%d).tar.gz /opt/tomcat8027/logs/
```



## 10. 总结

Tomcat 作为传统的 Java Web 应用服务器，在现代化部署中通常与 Nginx 等工具结合使用，实现动静分离和负载均衡。掌握 Tomcat 的基本部署、配置优化和故障排查技能，对于运维 Java 应用至关重要。

**核心要点**：

1. 理解 Tomcat 与 Nginx 的协作模式
2. 掌握 WAR 包和源码两种部署方式
3. 能够配置多实例和负载均衡
4. 具备基本的监控和故障排查能力

随着 Spring Boot 等现代化框架的普及，传统的 WAR 包部署逐渐向 JAR 包部署过渡，但 Tomcat 作为 Servlet 容器的核心地位依然稳固，是 Java 运维工程师必须掌握的技能之一。