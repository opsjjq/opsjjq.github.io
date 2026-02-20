# ES集群内两节点机器部署

```bash
# 准备2个es节点
# es90 10.0.0.90   master
# es91 10.0.0.91

1. 安装ES
[root@es90 ~]#ls /opt/
all-db.sql  elasticsearch-7.9.1-x86_64.rpm  kibana-7.9.1-x86_64.rpm


2. # 修改内存相关参数
vim /usr/lib/systemd/system/elasticsearch.service
[Service]
LimitMEMLOCK=infinity


3.如果是两个新的es节点 修改配置文件如下
# es90
cat > /etc/elasticsearch/elasticsearch.yml <<'EOF'
cluster.name: es1
node.name: es90
path.data: /var/lib/elasticsearch/
path.logs: /var/log/elasticsearch/
bootstrap.memory_lock: true
network.host: 127.0.0.1,10.0.0.90 
http.port: 9200
discovery.seed_hosts: ["10.0.0.90","10.0.0.91"]
cluster.initial_master_nodes: ["es90"]
EOF

# es91
cat > /etc/elasticsearch/elasticsearch.yml <<'EOF'
cluster.name: es1
node.name: es91
path.data: /var/lib/elasticsearch/
path.logs: /var/log/elasticsearch/
bootstrap.memory_lock: true
network.host: 127.0.0.1,10.0.0.91
http.port: 9200
discovery.seed_hosts: ["10.0.0.90","10.0.0.91"]
cluster.initial_master_nodes: ["es90"]
EOF

4. es90节点已有数据
# es90
cat > /etc/elasticsearch/elasticsearch.yml <<'EOF'
cluster.name: es1
node.name: es90
path.data: /var/lib/elasticsearch/
path.logs: /var/log/elasticsearch/
bootstrap.memory_lock: true
network.host: 10.0.0.90  
http.port: 9200
discovery.seed_hosts: ["10.0.0.91"]
cluster.initial_master_nodes: ["es90"]
EOF
systemctl restart elasticsearch
#cluster.initial_master_nodes只有已有集群的master节点需要配置新加入的节点不能配置这个

# es91
cat > /etc/elasticsearch/elasticsearch.yml <<'EOF'
cluster.name: es1
node.name: es91
path.data: /var/lib/elasticsearch/
path.logs: /var/log/elasticsearch/
bootstrap.memory_lock: true
network.host: 10.0.0.91
http.port: 9200
discovery.seed_hosts: ["10.0.0.90"]
EOF

# 4.如果要清理原有es数据
# systemctl stop elasticsearch
# mv /var/lib/elasticsearch/* /tmp/es/
# systemctl daemon-reload
# systemctl restart elasticsearch

# 5.启动两个es
systemctl daemon-reload 
systemctl restart elasticsearch
systemctl enable elasticsearch

curl -X GET "10.0.0.90:9200/_cat/nodes?v"
ip        heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
10.0.0.90           12          95   1    0.09    0.07     0.05 dilmrt    *      es90
10.0.0.91           10          81  66    1.06    0.37     0.17 dilmrt    -      es91


netstat -tunlp|grep 9200
curl 127.0.0.1:9200
```

## 检查es插件

![image-20260201010249833](./assets/image-20260201010249833.png)

### 节点信息

![image-20260201010619312](./assets/image-20260201010619312.png)

![image-20260201010624282](./assets/image-20260201010624282.png)

# 集群维护

## 创建index

```bash
# http://10.0.0.90:5601/app/dev_tools#/console
PUT /t4

put t4/_doc/1
{
  "name": "1"
}
get t4/_settings
```

## ELK架构采用的index设置

```bash
# 3分片 1副本
PUT /index-name
{
    "settings":{
        "number_of_shards":3, 
        "number_of_replicas":1
    }
}
put t4/_doc/1
{
  "name": "1"
}
```

## es节点故障情况

```
关闭es90
systemctl stop elasticsearch.service 


1.es集群会在短暂的故障后，将数据切换到其他节点，确保健康，以及保障index的分片、副本数。
2. es 7.x系列之后，要求，至少有2个节点正常，就是健康的。
3. es数据分片颜色状态（插件观察）
- 紫色，迁移中
- 黄色，复制中
- 绿色，正常
```



## 加入新的节点

```bash
# es92 节点配置

wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.9.1-x86_64.rpm
rpm -ivh elasticsearch-7.9.1-x86_64.rpm
cat > /etc/elasticsearch/elasticsearch.yml <<'EOF'
cluster.name: es1
node.name: es92
path.data: /var/lib/elasticsearch/
path.logs: /var/log/elasticsearch/
bootstrap.memory_lock: true
network.host: 10.0.0.92
http.port: 9200
discovery.seed_hosts: ["10.0.0.90"]
EOF
vim /usr/lib/systemd/system/elasticsearch.service
# [Service]
LimitMEMLOCK=infinity

systemctl daemon-reload
systemctl start elasticsearch
systemctl enable elasticsearch
# 如果没有加入节点 es92自成集群 可执行如下
systemctl stop elasticsearch
rm -rf  /var/lib/elasticsearch/*
systemctl start elasticsearch
```

