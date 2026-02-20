## 一、ES 官方快照备份恢复

### 1. 环境要求与准备

#### NFS 服务端配置

```bash
# 安装NFS
yum install nfs-utils -y
# 创建ES用户（与ES节点用户一致）
groupadd elasticsearch -g 996
useradd elasticsearch -g 996 -u 998 -M -s /sbin/nologin

# 配置NFS共享
echo '/es-data 10.0.0.0/24(rw,sync,all_squash,anonuid=998,anongid=996)' >> /etc/exports
# 创建目录并授权
mkdir -p /es-data
chown -R elasticsearch.elasticsearch /es-data/
# 重启NFS服务
systemctl restart nfs
```

#### ES 客户端节点配置

```
# 安装NFS客户端
yum install nfs-utils -y
mkdir /es-client-data -p
mount -t nfs 10.0.0.31:/es-data /es-client-data

# 检查挂载
df -h | grep es-client-data
```

#### 修改ES配置文件

所有节点

```sh
echo 'path.repo: /es-client-data/'>> /etc/elasticsearch/elasticsearch.yml
# 重启ES服务
systemctl restart elasticsearch.service
# 检查集群节点情况
curl -X GET "10.0.0.90:9200/_cat/nodes?v"
```

### 2. 快照备份操作流程

```bash
https://www.elastic.co/guide/en/elasticsearch/reference/7.9/snapshot-restore.html
```

#### 注册快照仓库

```sh
PUT /_snapshot/my_backup
{
  "type": "fs",
  "settings": {
    "location": "/es-client-data/my_backup_location",
    "compress": true
  }
}
```

#### 查询仓库信息

```
GET /_snapshot/my_backup
```

#### 创建全量快照

```
PUT /_snapshot/my_backup/snapshot_1?wait_for_completion=true

# 异步方式（推荐用于大快照）
PUT /_snapshot/my_backup/snapshot_1
{
  "indices": "index_1,index_2",
  "ignore_unavailable": true,
  "include_global_state": false
}
```

#### 创建指定索引快照

```json
PUT /_snapshot/my_backup/snapshot_2?wait_for_completion=true
{
  "indices": "t1,t2",
  "ignore_unavailable": true,
  "include_global_state": false
}
```

"ignore_unavailable": true,  // 忽略不存在的索引

"include_global_state": false 的影响：
快照文件更小
恢复时不会覆盖目标集群的现有全局设置
更适合跨集群迁移，避免设置冲突
注意： 
恢复快照时，需要手动在目标集群中创建相同的索引模板、ILM策略等
某些依赖集群设置的索引可能无法正常工作

#### 查看快照信息

```json
# 查看所有仓库
GET /_snapshot

# 查看指定仓库
GET /_snapshot/my_backup/

# 查看指定快照
GET /_snapshot/my_backup/snapshot_1
GET /_snapshot/my_backup/snapshot_2

# 查看正在创建过程中的快照
GET /_snapshot/my_backup/_current
```

### 3. 恢复操作

#### 恢复整个快照

```json
delete
//  GET /_cat/indices?v&h=index,status,health,docs.count,store.size
POST /_snapshot/my_backup/snapshot_2/_restore
//  GET /_cat/indices?v&h=index,status,health,docs.count,store.size
Elasticsearch 快照恢复的默认行为：
不允许覆盖已存在的索引
不允许恢复到一个已有同名索引的集群
需要保证目标索引不存在或已关闭
```

#### 恢复指定索引（可重命名）

```json
POST /_snapshot/my_backup/snapshot_2/_restore
{
  "indices": "t2",
  "ignore_unavailable": true,
  "include_global_state": false,              
  "rename_pattern": "t(.+)",             
  "rename_replacement": "restored_index_$1",  
  "include_aliases": false
}
```

#### 按日期命名快照

```
PUT /_snapshot/my_backup/%3Csnapshot-%7Bnow%2Fd%7D%3E
```

## 二、第三方备份工具 elasticdump

```bash
1.安装node环境，基于nodejs开发的备份工具
# 注意node版本要求 
2.软件官网
https://www.npmjs.com/package/elasticdump
```

### 1. 安装 Node.js 环境

```sh
cd /opt
wget https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-x64.tar.xz
tar -xf node-v10.16.3-linux-x64.tar.xz
ln -s node-v10.16.3-linux-x64/ node
echo 'export PATH=/opt/node/bin:$PATH' >> /etc/profile
source /etc/profile

# 设置npm源
npm config set registry http://mirrors.cloud.tencent.com/npm/

# 安装elasticdump
npm install elasticdump -g
# 查看版本
elasticdump --version
```

### 2. 备份操作

#### 备份单个索引

```sh
elasticdump \
--input=http://10.0.0.90:9200/t1 \
--output=/es-client-data/t1.json \
--type=data


cat /es-client-data/t1.json
# {"_index":"t1","_type":"_doc","_id":"1","_score":1,"_source":{"name":"123"}}
```

#### 备份并压缩

```
elasticdump \
--input=http://10.0.0.90:9200/t2 \
--output=$ \
| gzip > /es-client-data/t2.json.gz
```

### 3. 恢复操作

```
elasticdump \
--input=/es-client-data/t1.json \
--output=http://10.0.0.90:9200/t1

索引不存在：会自动创建索引（使用动态映射）
索引已存在：会直接写入数据（追加或覆盖）
```

### 4. 批量备份脚本

```
cat >dump1.sh<<'EOF'
#!/bin/bash
indexs=$(curl -s 10.0.0.90:9200/_cat/indices | awk '{print $3}' | grep -v '^\.')

for i in $indexs
do
    elasticdump \
    --input=http://10.0.0.90:9200/${i} \
    --output=/es-client-data/${i}.json \
    --type=data
done
EOF
```



### 5. 带密码认证的备份

es有密码时，备份命令

```
elasticdump \
--input=http://name:password@10.0.0.90:9200/t2 \
--output=/es-client-data/t1.json \
--type=data
```



## 三、ES 安全认证配置

### 1. 创建证书

```
# 创建CA证书
/usr/share/elasticsearch/bin/elasticsearch-certutil ca


# 创建节点证书
/usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12

# 同步证书到所有节点
mkdir -p /etc/elasticsearch/certs
cp /usr/share/elasticsearch/elastic-certificates.p12 /usr/share/elasticsearch/elastic-stack-ca.p12 /etc/elasticsearch/certs/

scp -r /etc/elasticsearch/certs root@10.0.0.91:/etc/elasticsearch/
```

### 2. 配置ES安全功能

```
# 在elasticsearch.yml中添加
echo 'xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: certs/elastic-stack-ca.p12
xpack.security.transport.ssl.truststore.path: certs/elastic-stack-ca.p12' >> /etc/elasticsearch/elasticsearch.yml

# 修改权限
chown -R elasticsearch.elasticsearch /etc/elasticsearch/
systemctl restart elasticsearch.service
```

### 3. 设置内置用户密码

```
/usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive
```

**内置用户说明：**

- `elastic`：超级管理员
- `kibana_system`：Kibana连接ES用
- `logstash_system`：Logstash服务用
- `beats_system`：Beats组件用
- `apm_system`：APM监控用

### 4. 配置Kibana连接

```
# kibana.yml配置
echo 'elasticsearch.username: "kibana_system"
elasticsearch.password: "qwe123"' >> /etc/kibana/kibana.yml

systemctl restart kibana
```

访问登录
elastic
qwe123

![image-20260205003609613](./assets/image-20260205003609613.png)

### 5. kibana用户与权限管理

#### Space（工作空间）

![image-20260205004041201](./assets/image-20260205004041201.png)

#### 创建Role（角色）

dev角色以及对应权限

![image-20260205010741459](./assets/image-20260205010741459.png)

#### 创建用户并绑定角色

```bash
dev是刚刚创建的角色
kibana_user是登录kibana界面的角色

kibana_system作用：
Kibana 启动时，用这个身份连接 Elasticsearch
在 Elasticsearch 中创建 .kibana 索引
管理 Kibana 的配置和元数据
```

![image-20260205010205857](./assets/image-20260205010205857.png)

#### 效果

*的index pattern也只能看到有权限的index

高权限的用户可以看到所有的index信息

![image-20260205010858593](./assets/image-20260205010858593.png)

