# ELK日志格式处理

## 一、JSON格式日志处理

```bash
修改Nginx配置为JSON格式（推荐，简单高效）

使用ES Grok转换器（灵活但复杂）

使用Filebeat模块（最便捷）
```

### 1.1 为什么要用JSON格式

普通日志将所有信息放在一个字段中，不方便按字段查询统计。

---

## 二、修改Nginx日志格式

### 2.1 配置JSON格式

```nginx
# nginx.conf 配置
http {
    log_format json '{"客户端内网地址":"$remote_addr",'
                     '"时间":"$time_iso8601",'
                     '"URL":"$request",'
                     '"状态码":$status,'
                     '"传输流量":$body_bytes_sent,'
                     '"跳转来源":"$http_referer",'
                     '"浏览器":"$http_user_agent",'
                     '"客户端外网地址":"$http_x_forwarded_for",'
                     '"请求响应时间":$request_time,'
                     '"后端地址":"$upstream_addr"}';

    access_log /var/log/nginx/access.log json;

systemctl restart nginx

# 也要注意虚拟主机server配置里有没有制定access_log
```

### 2.2 修改Filebeat配置支持JSON

```yaml
cat >/etc/filebeat/filebeat.yml<<'EOF'
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/nginx/error.log
  fields: # 自定义K-V
    log_type: nginx_error

- type: log
  enabled: true
  paths:
    - /var/log/nginx/access.log
  json.keys_under_root: true
  json.overwrite_keys: true
  json.add_error_key: true
  fields:
    log_type: nginx_access

output.elasticsearch:
  hosts: ["10.0.0.90:9200"]
  indices:
    - index: "nginx-access-%{[agent.version]}-%{+yyyy.MM.dd}"
      when.equals:
        fields.log_type: "nginx_access"
    - index: "nginx-error-%{[agent.version]}-%{+yyyy.MM.dd}"
      when.equals:
        fields.log_type: "nginx_error"

# 禁用ILM和模板
setup.ilm.enabled: false
setup.template.enabled: false

# 日志配置
logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
EOF
```

### 2.3 关键配置项

| 配置项            | 推荐值         | 原因                     |
| :---------------- | :------------- | :----------------------- |
| `keys_under_root` | `true`         | 查询更方便，字段在根级别 |
| `overwrite_keys`  | `true`         | 使用日志时间更准确       |
| `add_error_key`   | `true`         | 便于发现解析问题         |
| `fields`          | 按需自定义添加 | 添加业务标识             |

### 2.4 fields vs tags 的区别

| 特性         | `fields`                                   | `tags`                    |
| :----------- | :----------------------------------------- | :------------------------ |
| **数据类型** | 可以是任何类型（字符串、数字、布尔值）     | 只能是字符串数组          |
| **存储方式** | 作为普通字段存储                           | 作为特殊字段存储          |
| **查询性能** | 较慢（需要指定完整路径）                   | 较快（专门优化）          |
| **主要用途** | 存储附加元数据、业务信息                   | 简单分类、过滤、分组      |
| **示例**     | `environment: "production"` `version: 2.1` | `tags: ["nginx", "prod"]` |

### 2.5 重建索引流程

```bash
# 1. 删除旧索引（测试环境）
curl -X DELETE 'http://localhost:9200/filebeat-7.9.1-2026.02.05-000001'

# 2. 重启Filebeat
systemctl restart filebeat.service

# 3. 生成新日志
curl 127.0.0.1

# 4. 查看新索引
GET /nginx-access-7.9.1-2026.02.06/_search
```

---

## 三、ES Grok转换器

### 3.1 Grok模式详解

Grok是一种组合预定义正则表达式来匹配和解析文本的工具。

#### Nginx日志Grok模式映射

```
原始日志举例

127.0.0.1 - - [19/Feb/2023:11:53.49 +0800] "GET / HTTP/1.1" 200 9205 "-" "curl/7.29.0" "-"

对应Grok模式：
127.0.0.1                    =>   %{IP:clientip}
-                            =>   -
-                            =>   -
[19/Feb/2023:11:53.49 +0800] =>   \[%{HTTPDATE:nginx.access.time}\]
"GET / HTTP/1.1"             =>   "%{DATA:nginx.access.info}"
200                          =>   %{NUMBER:http.response.status_code:long}
9205                         =>   %{NUMBER:http.response.body.bytes:long}
"-"                          =>   "(-|%{DATA:http.request.referrer})"
"curl/7.29.0"                =>   "(-|%{DATA:user_agent.original})"
"-"                          =>   "(-|%{IP:clientip})"
```

完整Grok模式字符串：

```
%{IP:clientip} - - \[%{HTTPDATE:nginx.access.time}\] "%{DATA:nginx.access.info}" %{NUMBER:http.response.status_code:long} %{NUMBER:http.response.body.bytes:long} "(-|%{DATA:http.request.referrer})" "(-|%{DATA:user_agent.original})"
```

### 3.2 恢复nginx默认的log格式

```bash
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';
access_log /var/log/nginx/access.log main;

systemctl restart nginx
curl 127.0.0.1
curl 127.0.0.1
tail -5 /var/log/nginx/access.log
```

### 3.3 创建ES处理管道（Pipeline）

```json
PUT _ingest/pipeline/pipeline-nginx-access
{
  "description": "nginx access log processor",
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": [
          "%{IP:clientip} - - \\[%{HTTPDATE:nginx.access.time}\\] \"%{DATA:nginx.access.info}\" %{NUMBER:http.response.status_code:long} %{NUMBER:http.response.body.bytes:long} \"(-|%{DATA:http.request.referrer})\" \"(-|%{DATA:user_agent.original})\""
        ]
      }
    },
    {
      "remove": {
        "field": "message"
      }
    }
  ]
}
```

#### 验证Pipeline

```json
# 查看所有pipeline
GET _ingest/pipeline

# 测试pipeline
POST _ingest/pipeline/pipeline-nginx-access/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "127.0.0.1 - - [19/Feb/2023:11:53.49 +0800] \"GET / HTTP/1.1\" 200 9205 \"-\" \"curl/7.29.0\" \"-\""
      }
    }
  ]
}
```

### 3.4 Filebeat配置

```yaml
cat >/etc/filebeat/filebeat.yml <<'EOF'
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/nginx/error.log
  fields:
    log_type: nginx_error
  tags: ["error"]

- type: log
  enabled: true
  paths:
    - /var/log/nginx/access.log
  fields:
    log_type: nginx_access
  tags: ["access"]

output.elasticsearch:
  hosts: ["10.0.0.90:9200"]
  pipelines:
    - pipeline: "pipeline-nginx-access"
      when.contains:
        tags: "access"
  indices:
    - index: "nginx-access-%{[agent.version]}-%{+yyyy.MM.dd}"
      when.equals:
        fields.log_type: "nginx_access"
    - index: "nginx-error-%{[agent.version]}-%{+yyyy.MM.dd}"
      when.equals:
        fields.log_type: "nginx_error"

# 禁用ILM和模板
setup.ilm.enabled: false
setup.template.enabled: false

# 日志配置
logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
EOF
```

### 3.5 测试

```bash
# 1. 清理ES所有索引（可选操作  测试环境使用）
curl -X DELETE 'http://10.0.0.90:9200/nginx*'

# 2. 重启Filebeat服务
systemctl restart filebeat

# 3. 生成测试数据
curl 127.0.0.1
curl 127.0.0.1

# 4. 检查ES数据
# 通过Kibana或ES API查看新生成的索引数据
```

---

## 四、Filebeat支持Nginx模块

```bash
curl -X DELETE 'http://10.0.0.90:9200/nginx*'
# Filebeat删除或注释pipelines配置
vim /etc/filebeat/filebeat.yml
systemctl restart filebeat
curl 10.0.0.90:80
curl 10.0.0.90:80
# 检查完后再次清理索引
curl -X DELETE 'http://10.0.0.90:9200/nginx*'
```

### 4.1 模块配置

#### 4.1.1 查看 Filebeat 环境

```bash
# 查看 filebeat 版本
filebeat version

# 查看当前目录结构
ls /etc/filebeat/
ls /etc/filebeat/modules.d/
```

#### 4.1.2 启用模块管理功能

修改 `/etc/filebeat/filebeat.yml` 配置文件，添加以下内容：

```bash
echo 'filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: true' >>/etc/filebeat/filebeat.yml
```

#### 4.1.3 查看和管理模块

```bash
# 查看所有可用模块
filebeat modules list

# 启用 nginx 模块
filebeat modules enable nginx
```

### 4.2 Nginx 日志收集配置

#### 配置 Nginx 模块

创建 `/etc/filebeat/modules.d/nginx.yml` 配置文件：

```bash
cat > /etc/filebeat/modules.d/nginx.yml <<'EOF'
- module: nginx
  access:
    enabled: true
    var.paths: ["/var/log/nginx/access.log"]
  error:
    enabled: true
    var.paths: ["/var/log/nginx/error.log"]
  ingress_controller:
    enabled: false
EOF
```

---

## 五、Tomcat 日志收集配置

### 5.1 安装 JDK

```bash
cd /opt
wget https://download.oracle.com/java/17/archive/jdk-17.0.12_linux-x64_bin.tar.gz
# 解压 JDK
tar -xf jdk-17.0.12_linux-x64_bin.tar.gz -C /opt

# 更改文件夹名
mv /opt/jdk-17.0.12 /opt/jdk17

# 配置环境变量
sed -i '$a export JAVA_HOME=/opt/jdk17\nexport PATH=$JAVA_HOME/bin:$PATH' /etc/profile
source /etc/profile
java -version
```

### 5.2 安装和配置 Tomcat

```bash
cd /opt
# 迅雷添加云盘 再快速下载
wegt https://dlcdn.apache.org/tomcat/tomcat-10/v10.1.52/bin/apache-tomcat-10.1.52.tar.gz
# 解压 Tomcat
tar -xf apache-tomcat-10.1.52.tar.gz -C /opt

# 修改 Tomcat 日志格式为 JSON
# 编辑 /opt/apache-tomcat-10.1.52/conf/server.xml
# 修改 AccessLogValve 的 pattern 配置为 JSON 格式：

        <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="{&quot;clientip&quot;:&quot;%h&quot;,&quot;ClientUser&quot;:&quot;%l&quot;,&quot;authenticated&quot;:&quot;%u&quot;,&quot;AccessTime&quot;:&quot;%t&quot;,&quot;method&quot;:&quot;%r&quot;,&quot;status&quot;:&quot;%s&quot;,&quot;SendBytes&quot;:&quot;%b&quot;,&quot;Query?string&quot;:&quot;%q&quot;,&quot;partner&quot;:&quot;%{Referer}i&quot;,&quot;AgentVersion&quot;:&quot;%{User-Agent}i&quot;}"/>
```

### 5.3 启动 Tomcat

```bash
/opt/apache-tomcat-10.1.52/bin/startup.sh

curl -I 10.0.0.90:8080
```

### 5.4 Filebeat 配置——收集 Tomcat 日志

在 `/etc/filebeat/filebeat.yml` 中添加 Tomcat 输入配置：

```yaml
cat >/etc/filebeat/filebeat.yml <<'EOF'
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /opt/apache-tomcat-10.1.52/logs/localhost_access_log.*.txt
  json.keys_under_root: true
  json.overwrite_keys: true
  tags: ["tomcat"]

output.elasticsearch:
  hosts: ["10.0.0.90:9200"]
  indices:
    - index: "tomcat-access-%{[agent.version]}-%{+yyyy.MM.dd}"
      when.contains:
        tags: "tomcat"

setup.ilm.enabled: false
setup.template.enabled: false

logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644

filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: true
EOF
```

### 5.5 重启 Filebeat

```
systemctl restart filebeat.service
```

---

## 六、验证和监控

### 6.1 检查日志格式

```bash
# 检查 Tomcat 日志是否为 JSON 格式
cat /opt/apache-tomcat-10.1.52/logs/localhost_access_log.2026-02-06.txt

# 检查 Filebeat 状态
systemctl status filebeat.service

# curl 命令拿到数据
curl -s "10.0.0.90:9200/_cat/indices/tomcat-access-7.9.1-2026.02.07?v"
# kibana 终端命令
GET _cat/indices/tomcat-access-7.9.1-2026.02.07?v
# es插件检查索引数据
```

### 6.2 Kibana 配置

1. 登录 Kibana 控制台
2. 进入 Stack Management → Index Patterns
3. 创建对应的索引模式：
   - `tomcat-access-*`
4. 在 **Discover** 页面查看日志数据

---

## 七、总结

ELK日志格式处理提供了多种方式来实现日志的规范化采集和字段化查询，包括JSON格式、Grok转换器和Filebeat模块。根据实际需求选择合适的方式，可以提高日志分析的效率和准确性。

> 下一步：学习Kibana可视化功能，实现数据的图表展示和仪表板管理。
