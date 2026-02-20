# Redis Cluster 集群部署与实践（优化整理版）

## 一、Redis Cluster 概述

### 1.1 为什么需要 Redis Cluster

- **数据分片存储**：将海量数据分散到多个节点，突破单机内存限制
- **高可用性**：每个主节点都有对应的从节点，主节点故障时自动切换
- **负载均衡**：数据均匀分布，支持高并发读写操作
- **横向扩展**：可通过增加节点轻松扩展集群容量

### 1.2 核心概念

- **数据分片**：将数据分为16384个槽（slot），每个节点负责一部分槽
- **主从复制**：每个主节点至少有一个从节点作为备份
- **故障转移**：节点故障时自动进行主从切换
- **集群总线**：节点间通过TCP端口（主端口+10000）进行通信

---

## 二、Redis Cluster 环境准备

### 2.1 架构规划

```text
三台服务器：db-51, db-52, db-53
每台服务器部署：主节点（6379端口） + 从节点（6380端口）
集群模式：3主3从
```

### 2.2 配置文件示例（主节点）

```bash
# 创建目录结构
mkdir -p /opt/redis_6379/{conf,pid,logs}
mkdir -p /redis_db/

# 生成主节点配置文件
cat > /opt/redis_6379/conf/redis_6379.conf <<'EOF'
daemonize yes
bind 0.0.0.0
port 6379
pidfile /opt/redis_6379/pid/redis_6379.pid
logfile /opt/redis_6379/logs/redis_6379.log
save 900 1
save 300 10
save 60 10000
dbfilename linux_redis_dump.rdb
appendonly yes
appendfilename "linux_appendonly.aof"
dir /redis_db/
appendfsync everysec
aof-use-rdb-preamble yes

# 集群配置
cluster-enabled yes
cluster-config-file nodes_6379.conf
cluster-node-timeout 15000
EOF
```

### 2.3 从节点配置（快速生成）

```bash
# 快速生成从节点配置（修改端口）
sed 's/6379/6380/g' /opt/redis_6379/conf/redis_6379.conf > /opt/redis_6379/conf/redis_6380.conf
```

---

## 三、Redis Cluster 部署步骤

### 3.1 启动所有节点

```bash
# 每台服务器启动两个节点
redis-server /opt/redis_6379/conf/redis_6379.conf
redis-server /opt/redis_6379/conf/redis_6380.conf

# 验证进程
ps -ef | grep redis-server
```

### 3.2 创建集群关系

```bash
# 使用redis-cli一键创建集群（推荐Redis 5.0+）
redis-cli --cluster create \
  10.0.0.51:6379 \
  10.0.0.52:6379 \
  10.0.0.53:6379 \
  10.0.0.51:6380 \
  10.0.0.52:6380 \
  10.0.0.53:6380 \
  --cluster-replicas 1
```

### 3.3 集群创建过程解析

1. **槽分配**：自动将16384个槽均匀分配给3个主节点
2. **主从配对**：为每个主节点分配一个从节点（`--cluster-replicas 1`）
3. **集群配置生成**：每个节点生成集群配置文件（nodes-*.conf）
4. **集群握手**：节点间建立连接，形成集群网络

---

## 四、Redis Cluster 使用与管理

### 4.1 集群连接与操作

```bash
# 使用集群模式连接（-c参数启用自动重定向）
redis-cli -c -h 10.0.0.51 -p 6379

# 集群操作示例
> set key1 value1      # 自动重定向到正确的节点
> get key1             # 自动跳转到key所在节点
> cluster info         # 查看集群信息
> cluster nodes        # 查看节点状态
```

**注意**：节点变化是正常的，也是设计如此！

- `redis-cli -c`：为交互式调试设计，自动跟随重定向
- 应用程序客户端：会缓存映射，直接连接正确节点
- 这是 Redis Cluster 的核心特性：数据分片 + 透明访问

### 4.2 集群状态监控

```bash
# 查看集群信息
redis-cli -h 10.0.0.51 -p 6379 cluster info

# 查看节点状态
redis-cli -h 10.0.0.51 -p 6379 cluster nodes

# 查看槽位分布
redis-cli -h 10.0.0.51 -p 6379 cluster slots

# 查看集群整体信息
redis-cli --cluster info 10.0.0.51:6379
```

### 4.3 数据均衡性测试

```bash
# 批量写入测试数据
for i in {1..1000}
do
    redis-cli -c -h 10.0.0.51 -p 6379 set k_${i} v_${i}
done

# 查看数据分布情况（预期每个主节点约333个key）
redis-cli --cluster info 10.0.0.51:6379
```

---

## 五、故障模拟与恢复

### 5.1 主节点故障测试

```bash
# 1. 故障前验证集群状态
echo "=== 故障前集群状态 ==="
redis-cli -h 10.0.0.51 -p 6379 cluster nodes | grep -E "(master|slave)" | sort

# 2. 模拟主节点故障
echo "正在停止主节点 10.0.0.51:6379..."
redis-cli -h 10.0.0.51 -p 6379 shutdown

echo "等待20秒故障检测时间..."
sleep 20

# 3. 观察故障转移
echo -e "\n=== 故障转移后集群状态 ==="
redis-cli -h 10.0.0.52 -p 6379 cluster nodes | grep -E "(master|slave|fail)" | sort

# 4. 测试数据访问
echo -e "\n=== 测试数据访问 ==="
redis-cli -c -h 10.0.0.52 -p 6379 set test_failover "测试故障转移"
redis-cli -c -h 10.0.0.53 -p 6379 get test_failover
```

### 5.2 恢复故障节点

```bash
# 重启故障节点
redis-server /opt/redis_6379/conf/redis_6379.conf

# 重新加入集群（自动成为从节点）
redis-cli -h 10.0.0.51 -p 6379 cluster meet 10.0.0.52 6379

# 检查节点健康
redis-cli --cluster info 10.0.0.51:6380

# 恢复故障节点的主节点身份（如果需要）
redis-cli -h 10.0.0.51 -p 6379 cluster failover
```

---

## 六、Redis Cluster 注意事项

### 6.1 键值操作限制

- **不支持多键操作**：跨节点的MSET、MGET等操作不可用
- **事务限制**：涉及多个节点的事务无法保证原子性
- **Lua脚本限制**：脚本中的键必须在同一节点

### 6.2 配置注意事项

1. **网络互通**：确保节点间端口（6379, 6380, 16379, 16380）互通
2. **禁用swap**：避免内存交换影响性能
3. **合理设置超时**：`cluster-node-timeout`根据网络状况调整（默认15秒）
4. **内存规划**：预留足够内存用于集群数据同步

### 6.3 生产环境建议

- **至少3主3从**：确保高可用性和数据安全
- **监控告警**：监控节点状态、内存使用、网络延迟
- **定期备份**：虽然集群有副本，仍需定期全量备份
- **版本一致性**：保持集群内所有Redis版本一致

---

## 七、常用维护命令

```bash
# 集群节点管理
redis-cli --cluster add-node new_host:new_port existing_host:existing_port
redis-cli --cluster del-node host:port node_id
redis-cli --cluster reshard host:port

# 槽位迁移
redis-cli --cluster reshard 10.0.0.51:6379

# 重新平衡槽位
redis-cli --cluster rebalance 10.0.0.51:6379

# 修复槽位连续性
redis-cli --cluster fix host:port
```

---

## 八、核心要点总结

1. **数据分片**：16384个槽，均匀分布到各主节点
2. **自动重定向**：客户端连接任一节点，自动跳转到正确节点
3. **故障转移**：主节点故障时，从节点自动提升为主节点
4. **扩展性**：可动态添加节点，重新分配槽位
5. **客户端支持**：需使用支持Cluster的客户端库
