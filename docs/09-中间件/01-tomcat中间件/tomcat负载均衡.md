# Tomcat 多实例部署与负载均衡

---

## 一、Tomcat 实例概念解析

### 1.1 单实例 vs 多实例

**单实例**：

- 一个完整的 Tomcat 软件（二进制+数据目录）运行一个或多个应用
- 通过不同的端口或虚拟目录区分不同应用

**多实例**：

- 多个独立的 Tomcat 软件实例运行在同一台服务器上
- 每个实例有独立的数据目录和配置文件
- 可以实现资源隔离、版本升级等需求

### 1.2 实例部署模式

| 模式         | 描述                       | 适用场景           |
| :----------- | :------------------------- | :----------------- |
| 单实例单应用 | 一个 Tomcat 运行一个应用   | 简单项目部署       |
| 单实例多应用 | 一个 Tomcat 运行多个应用   | 测试环境，资源共享 |
| 多实例单应用 | 多个 Tomcat 运行同一个应用 | 负载均衡、高可用   |
| 多实例多应用 | 多个 Tomcat 运行不同应用   | 生产环境，资源隔离 |

---

## 二、Tomcat 多实例部署实践

### 2.1 传统多实例部署

```bash
# 1. 复制多个 Tomcat 目录
cp -r /opt/apache-tomcat-8.0.27 /opt/tomcat-instance1
cp -r /opt/apache-tomcat-8.0.27 /opt/tomcat-instance2

# 2. 修改各实例端口（避免冲突）
# 实例1：8081, 8006, 8010
# 实例2：8082, 8007, 8011

# 修改 server.xml
sed -i 's/8080/8081/g' /opt/tomcat-instance1/conf/server.xml
sed -i 's/8005/8006/g' /opt/tomcat-instance1/conf/server.xml
sed -i 's/8009/8010/g' /opt/tomcat-instance1/conf/server.xml

# 3. 分别启动实例
/opt/tomcat-instance1/bin/startup.sh
/opt/tomcat-instance2/bin/startup.sh
```

### 2.2 新式多实例部署（推荐）

**架构优势**：

- 二进制文件与数据目录分离
- 便于版本升级和维护
- 资源分配更灵活

#### 2.2.1 部署步骤

```bash
# 1. 创建数据目录
mkdir -p /{tomcat1,tomcat2}

# 2. 移动原始数据目录到实例1
cd /opt/tomcat8027
mv conf/ logs/ temp/ work/ webapps/ -t /tomcat1/

# 3. 复制实例1配置到实例2
cp -ra /tomcat1/* /tomcat2/

# 4. 查看最终目录结构
ls /opt/tomcat8027/  # 只保留 bin、lib 等二进制文件
ls /tomcat1/         # 实例1数据目录
ls /tomcat2/         # 实例2数据目录
```

#### 2.2.2 配置文件修改

```bash
# 修改实例1端口
sed -i 's/8005/8100/g' /tomcat1/conf/server.xml
sed -i 's/8080/8101/g' /tomcat1/conf/server.xml
sed -i 's/8009/8102/g' /tomcat1/conf/server.xml

# 修改实例2端口
sed -i 's/8005/8200/g' /tomcat2/conf/server.xml
sed -i 's/8080/8201/g' /tomcat2/conf/server.xml
sed -i 's/8009/8202/g' /tomcat2/conf/server.xml

# 验证配置
grep -E '8100|8101' /tomcat1/conf/server.xml
grep -E '8200|8201' /tomcat2/conf/server.xml
```

#### 2.2.3 创建管理脚本

```bash
# 创建脚本目录
mkdir -p /tomcat-sh/

# 启动脚本
cat > /tomcat-sh/start_tomcat.sh << 'EOF'
#!/bin/bash
export CATALINA_HOME=/opt/tomcat8027/
export CATALINA_BASE=${1%/}

TOMCAT_ID=$(ps aux | grep "java" | grep "Dcatalina.base=$CATALINA_BASE " | grep -v "grep" | awk '{print $2}')

if [ -n "$TOMCAT_ID" ]; then
    echo "tomcat(${TOMCAT_ID}) still running now, please shutdown it first"
    exit 2
fi

TOMCAT_START_LOG=$($CATALINA_HOME/bin/startup.sh 2>&1)

if [ "$?" = "0" ]; then
    echo "$0 $1 start succeed"
else
    echo "$0 ${1%/} start failed"
    echo "$TOMCAT_START_LOG"
fi
EOF

# 停止脚本
cat > /tomcat-sh/stop_tomcat.sh << 'EOF'
#!/bin/bash
export CATALINA_HOME=/opt/tomcat8027/
export CATALINA_BASE=${1%/}

$CATALINA_HOME/bin/shutdown.sh
sleep 3

TOMCAT_ID=$(ps aux | grep "java" | grep "Dcatalina.base=$CATALINA_BASE " | grep -v "grep" | awk '{print $2}')
if [ -n "$TOMCAT_ID" ]; then
    kill -9 $TOMCAT_ID
    echo "Force killed tomcat(${TOMCAT_ID})"
fi
EOF

chmod +x /tomcat-sh/*.sh
```

#### 2.2.4 启动多实例

```bash
# 启动实例1
bash /tomcat-sh/start_tomcat.sh /tomcat1/

# 启动实例2
bash /tomcat-sh/start_tomcat.sh /tomcat2/

# 检查端口
netstat -tunlp | grep java
```

#### 2.2.5 验证访问

```bash
# 访问实例1
curl http://10.0.0.10:8101/

# 访问实例2
curl http://10.0.0.10:8201/
```

---

## 三、Nginx + Tomcat 负载均衡

### 3.1 Nginx 负载均衡配置

```nginx
# /etc/nginx/conf.d/tomcat-lb.conf
upstream tomcat_cluster {
    # 负载均衡算法（默认轮询）
    # ip_hash;
    # least_conn;

    server 10.0.0.10:8101 weight=1 max_fails=3 fail_timeout=30s;
    server 10.0.0.10:8201 weight=1 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name your-domain.com;

    access_log /var/log/nginx/tomcat-access.log main;
    error_log /var/log/nginx/tomcat-error.log;

    location / {
        proxy_pass http://tomcat_cluster;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 30s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;

        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|html|txt)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /nginx_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        allow 10.0.0.0/24;
        deny all;
    }
}
```

### 3.2 测试负载均衡

```bash
# 1. 测试Nginx配置
nginx -t

# 2. 重载Nginx配置
nginx -s reload

# 3. 测试负载均衡效果
for i in {1..10}; do
    curl -s http://your-domain.com/ | grep -o "端口：[0-9]\+"
done

# 4. 查看Nginx访问日志
tail -f /var/log/nginx/tomcat-access.log
```

### 3.3 会话保持配置

```nginx
upstream tomcat_cluster {
    ip_hash;
    server 10.0.0.10:8101;
    server 10.0.0.10:8201;
}
```

---

## 四、Zabbix 监控 Tomcat

### 4.1 Tomcat JMX 配置

```bash
# 修改 Tomcat 启动脚本
vim /opt/tomcat8027/bin/catalina.sh

CATALINA_OPTS="$CATALINA_OPTS
-Dcom.sun.management.jmxremote
-Djava.rmi.server.hostname=10.0.0.10
-Dcom.sun.management.jmxremote.port=12345
-Dcom.sun.management.jmxremote.ssl=false
-Dcom.sun.management.jmxremote.authenticate=false"
```



#### 4.1.2 重启 Tomcat 并验证

```bash
# 重启实例1（配置了JMX）
bash /tomcat-sh/stop_tomcat.sh /tomcat1/
bash /tomcat-sh/start_tomcat.sh /tomcat1/

# 验证JMX端口
netstat -tunlp | grep 12345

# 使用 jps 查看Java进程
jps -lvm
```



### 4.2 Zabbix Server 配置

```bash
# 安装 Java Gateway
yum install zabbix-java-gateway -y

# 配置 Java Gateway
vim /etc/zabbix/zabbix_java_gateway.conf

# 配置 Zabbix Server
vim /etc/zabbix/zabbix_server.conf

JavaGateway=127.0.0.1
JavaGatewayPort=10052
StartJavaPollers=5

systemctl start zabbix-java-gateway
systemctl restart zabbix-server
```

### 4.3 Zabbix Web 界面配置

**添加主机**：

- 主机名称：tomcat-10
- 群组：Linux servers / Tomcat servers
- JMX接口：10.0.0.10，端口 12345

**关联模板**：

- Template App Apache Tomcat JMX
- Template App Generic Java JMX

**宏配置**：

| 宏              | 值    |
| :-------------- | :---- |
| {$JMX.PORT}     | 12345 |
| {$JMX.USER}     |       |
| {$JMX.PASSWORD} |       |

### 4.4 手动测试 JMX 连接

```bash
# 下载 JMX 客户端
wget http://crawler.archive.org/cmdline-jmxclient/cmdline-jmxclient-0.10.3.jar

# 测试连接
java -jar cmdline-jmxclient-0.10.3.jar - 10.0.0.10:12345 java.lang:type=Memory HeapMemoryUsage
```

### 4.5 监控项说明

**JVM 指标**：
- 堆内存使用率
- 非堆内存使用率
- 垃圾回收统计
- 线程数

**Tomcat 指标**：
- 请求处理统计
- 会话数
- 线程池状态
- 缓存命中率

---

## 五、最佳实践与优化

### 5.1 安全建议

```bash
# 1. 启用JMX认证（生产环境必须）
-Dcom.sun.management.jmxremote.authenticate=true
-Dcom.sun.management.jmxremote.password.file=/path/to/jmxremote.password

# 2. 配置防火墙
firewall-cmd --permanent --add-port=8101/tcp
firewall-cmd --permanent --add-port=8201/tcp
firewall-cmd --reload

# 3. 限制访问IP
<Valve className="org.apache.catalina.valves.RemoteAddrValve"
       allow="10.0.0.0/24" />
```

### 5.2 性能优化

```bash
# JVM参数优化
CATALINA_OPTS="$CATALINA_OPTS
-Xms1024m
-Xmx2048m
-XX:PermSize=256m
-XX:MaxPermSize=512m
-XX:+UseConcMarkSweepGC
-XX:+CMSParallelRemarkEnabled
-XX:+UseCMSInitiatingOccupancyOnly
-XX:CMSInitiatingOccupancyFraction=70"

# Tomcat连接器优化
<Connector port="8080" protocol="org.apache.coyote.http11.Http11NioProtocol"
           maxThreads="200"
           minSpareThreads="10"
           acceptCount="100"
           maxConnections="10000"
           connectionTimeout="20000" />
```

### 5.3 监控告警配置

**内存使用率过高**：

```
{Template App Generic Java JMX:jmx["java.lang:type=Memory",HeapMemoryUsage.used].last()}/{Template App Generic Java JMX:jmx["java.lang:type=Memory",HeapMemoryUsage.max].last()}>0.8
```

**线程数异常**：

```
{Template App Generic Java JMX:jmx["java.lang:type=Threading",ThreadCount].last()}>500
```

**请求处理错误**：

```
{Template App Apache Tomcat JMX:jmx["Catalina:type=GlobalRequestProcessor,name=\"http-nio-8080\"",errorCount].last()}>10
```

---

## 六、故障排查

### 6.1 常见问题

```bash
# 1. 端口冲突
netstat -tunlp | grep :8080

# 2. 内存不足
tail -f /tomcat1/logs/catalina.out

# 3. JMX连接失败
firewall-cmd --list-all
getenforce

# 4. Nginx代理失败
tail -f /var/log/nginx/error.log
```

### 6.2 日志分析

```bash
# 实时查看Tomcat日志
tail -f /tomcat1/logs/catalina.out

# 查看访问日志
tail -f /tomcat1/logs/localhost_access_log.*.txt

# 分析错误日志
grep -i "error\|exception" /tomcat1/logs/catalina.out
```

---

## 七、总结

通过 Tomcat 多实例部署，可以实现：

1. **资源隔离**：不同应用互不影响
2. **版本管理**：独立升级和维护
3. **负载均衡**：提高应用可用性和性能
4. **监控管理**：精细化监控每个实例

**关键点**：

- 理解 CATALINA_HOME 和 CATALINA_BASE 的区别
- 掌握多实例的启动脚本编写
- 配置 Nginx 实现负载均衡和动静分离
- 使用 Zabbix 监控 Tomcat 的 JMX 指标
