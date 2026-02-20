## ELK日志分析系统

### 一、ELK概述

#### 1.1 什么是ELK

ELK是Elastic Stack的核心组件，由三个开源软件的首字母组成：

- **Elasticsearch**：分布式搜索和分析引擎
- **Logstash**：数据收集和处理管道
- **Kibana**：数据可视化和分析平台

组合版本会统一发布，确保组件兼容性。

#### 1.2 各组件功能

**Elasticsearch**

- 实时分布式搜索和分析引擎
- 用于全文搜索、结构化搜索和分析
- 基于Apache Lucene构建，使用Java编写
- 特点：分布式、零配置、自动发现、RESTful API

**Logstash**

- 数据收集引擎，具有实时传输能力
- 负责数据收集、解析和传输
- 支持多种数据源输入
- 工作方式：C/S架构

**Kibana**

- Elasticsearch的可视化Web平台
- 提供数据分析和可视化功能
- 支持图表、仪表板等多种展示形式

**Filebeat**

Filebeat隶属于Beats。目前Beats包含四种工具：Packetbeat（搜集网络流量数据）、Topbeat（搜集系统、进程和文件系统级别的CPU和内存使用情况等数据）、Filebeat（搜集文件数据）、Winlogbeat（搜集Windows事件日志数据）

- 轻量级日志收集代理
- 占用资源少，适合部署在各个服务器
- 官方推荐的日志收集工具

---

### 二、为什么使用ELK

#### 2.1 传统日志分析的局限性

- 日志量太大，归档困难
- 文本搜索速度慢
- 多维度查询困难
- 分布式系统日志分散

#### 2.2 ELK的优势

1. **集中化管理**：所有服务器日志统一收集
2. **实时分析**：快速定位问题
3. **多维查询**：支持复杂查询条件
4. **可视化展示**：直观的数据展示
5. **开源免费**：降低企业成本

#### 2.3 主要应用场景

1. **问题排查**：快速定位系统故障
2. **监控预警**：实时监控系统状态
3. **关联分析**：多数据源日志联动分析
4. **数据分析**：业务数据统计分析

---

### 三、部署

#### 3.1 环境准备

- 建议4G以上内存
- 系统环境建议重置

#### 3.2 Elasticsearch单节点部署

```bash
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.9.1-x86_64.rpm
rpm -ivh elasticsearch-7.9.1-x86_64.rpm

cat > /etc/elasticsearch/elasticsearch.yml <<'EOF'
cluster.name: es1
node.name: devops01
network.host: 127.0.0.1,10.0.0.90
http.port: 9200
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
EOF

systemctl daemon-reload
```

启动服务：

```bash
systemctl start elasticsearch.service
curl 10.0.0.90:9200
```

#### 3.3 Kibana部署配置

```yaml
# /etc/kibana/kibana.yml
server.port: 5601
server.host: "10.0.0.90"
elasticsearch.hosts: ["http://localhost:9200"]
kibana.index: ".kibana"
```

启动服务：

```bash
systemctl start kibana
ss -tnlp | grep 5601
```

#### 3.4 Nginx日志配置

```bash
# Nginx安装和配置脚本
yum install nginx -y

# 清理旧配置
rm -rf /etc/nginx/conf.d/*
rm -rf /var/log/nginx/*

# 创建配置文件
cat > /etc/nginx/conf.d/nginx-filebeat.conf <<'EOF'
server {
    listen 80;
    server_name www.qwe.cn;
    access_log /var/log/nginx/access.log;
    root /www;
    index index.html;
}
EOF

# 创建网站目录和测试页面
mkdir -p /www
echo 'wo shi index' > /www/index.html

# 重启服务
systemctl restart nginx
curl 127.0.0.1
```

---

### 四、Filebeat配置

#### 使用背景

Filebeat应该安装在想要采集日志的源服务器上

```
应用服务器（运行Filebeat） → ES服务器（接收日志） → ES存储
┌─────────────────┐     ┌─────────────────┐
│ Web服务器1       │────▶│                 │
│ ├ Filebeat      │     │ ES集群           │
│ └ App日志        │     │（3台机器）       │
└─────────────────┘     └─────────────────┘
         │
┌─────────────────┐            │
│ Web服务器2       │────────────┘
│ ├ Filebeat      │
│ └ App日志       │
└─────────────────┘
```

Filebeat的核心功能：
- 监控文件变化：需要直接访问日志文件
- 读取本地文件：需要文件系统权限
- 低资源占用：轻量级，适合在应用服务器运行

#### 4.1 安装Filebeat

```bash
# https://www.elastic.co/downloads/past-releases?product=filebeat
cd /opt
wget https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.9.1-x86_64.rpm
rpm -ivh filebeat-7.9.1-x86_64.rpm
```

#### 4.2 基础配置

```yaml
# /etc/filebeat/filebeat.yml 基础配置
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/nginx/*.log # filebeat本机机器的文件路径

output.elasticsearch:
  hosts: ["10.0.0.90:9200"]
```

启动Filebeat：

```bash
systemctl start filebeat.service
ps -ef | grep filebeat
```

当ES集群扩容时：

```yaml
# 所有应用服务器上的filebeat.yml更新 可以写IP也可以做DNS域名解析
output.elasticsearch:
  hosts:
    - "es-node1-IP:9200"
    - "es-node2-IP:9200"  # 新增节点
    - "es-node3-IP:9200"  # 新增节点
  # 负载均衡配置
  loadbalance: true
  compression_level: 3
```

#### 4.3 日志收集验证

1. 生成Nginx访问日志：

```bash
curl 127.0.0.1/nothing
# 检查日志内容大小
ls -l /var/log/nginx/*
```

2. 查看ES索引：

```bash
# 查看Filebeat创建的索引
GET /filebeat-7.9.1-2026.02.05-000001/_search
```

---

### 五、日志格式处理

详见：[ELK日志格式处理.md](7-ELK日志格式处理.md)

---

### 六、日常运维工作

运维人员日常使用ELK可以：

1. 监控网站访问日志，检测异常IP
2. 分析接口是否遭受攻击
3. 统计流量高峰和低谷时段
4. 统一分析所有Nginx服务器的访问日志
5. 分析HTTP状态码分布

---

### 七、总结

ELK日志分析系统提供了强大的日志收集、存储、分析和可视化能力，能够帮助运维人员快速定位问题、监控系统状态、进行数据分析。通过合理配置Filebeat、Elasticsearch和Kibana，可以构建一个高效的日志管理平台。

> 下一步：学习ELK日志格式处理，实现日志的规范化采集和字段化查询。
