# Redis主从哨兵高可用与安全配置指南

## 一、Redis主从复制架构

### 1.1 主从复制概述

Redis提供主从库模式保证数据副本一致性，采用读写分离方式：

- 主库：负责写操作
- 从库：负责读操作，自动同步主库数据

### 1.2 主从配置部署

#### 主节点配置（db-51）

```bash
cat > /etc/redis.conf <<'EOF'
daemonize yes
bind 127.0.0.1  10.0.0.51
port 6379
requirepass StrongMasterPass123!  # 启用强密码
protected-mode yes                # 开启保护模式
pidfile /redis/redis_6379.pid
logfile /redis/redis_6379.log
dir /redis/

dbfilename dump.rdb
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
aof-use-rdb-preamble yes

# 可选：禁用危险命令
rename-command KEYS     "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
rename-command FLUSHALL "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX1"
rename-command FLUSHDB  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX2"
rename-command CONFIG   "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX3"
rename-command SHUTDOWN "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX4"
rename-command DEBUG    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX5"
EOF
```

#### 从节点配置（db-52/db-53）

```bash
cat > /etc/redis.conf <<'EOF'
daemonize yes
bind 127.0.0.1 10.0.0.52
port 6379
protected-mode yes
pidfile /redis/redis_6379.pid
logfile /redis/redis_6379.log
dir /redis/
dbfilename dump.rdb
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
aof-use-rdb-preamble yes
masterauth StrongMasterPass123!  # 主节点密码
replicaof 10.0.0.51 6379

# 可选：禁用危险命令
rename-command KEYS     "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
rename-command FLUSHALL "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX1"
rename-command FLUSHDB  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX2"
rename-command CONFIG   "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX3"
rename-command SHUTDOWN "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX4"
rename-command DEBUG    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX5"
EOF
```

#### 安全建议：

1. 建议将默认端口6379改为其他端口，避免被常见扫描工具识别
2. 密码建议使用16位以上，包含大小写字母、数字和特殊字符
3. bind地址建议仅绑定内网IP，避免暴露在公网
4. 以非root用户运行Redis服务

### 1.3 创建Redis专用用户和目录

```bash
# 创建Redis专用用户
useradd redis -M -s /sbin/nologin

# 创建数据目录并设置权限
mkdir -p /redis/
chown -R redis.redis /redis/

# 如果Redis二进制文件已安装，设置权限
chown redis.redis /usr/local/redis/bin/redis* 2>/dev/null || true
```

### 1.4 验证主从关系

```bash
# 在主节点查看复制信息（需要认证）
redis-cli -a StrongMasterPass123! info replication

# 输出示例
role:master
connected_slaves:2
slave0:ip=10.0.0.52,port=6379,state=online,offset=179,lag=0
slave1:ip=10.0.0.53,port=6379,state=online,offset=179,lag=0
```

### 1.5 主从操作命令

```bash
# 查看复制信息（从节点）
redis-cli -a StrongMasterPass123! info replication
# role:slave

# 取消从节点身份（变为主节点）
redis-cli -a StrongMasterPass123! replicaof no one
# redis-cli info replication ---> role:master

# 再次修改主从关系
redis-cli -a StrongMasterPass123! replicaof 10.0.0.51 6379
# redis-cli info replication ---> role:slave
```

---

## 二、Redis哨兵高可用集群

### 2.1 哨兵架构原理

哨兵集群提供Redis高可用解决方案：

- **监控**：持续检查主从节点状态
- **通知**：通过API向管理员报告故障
- **自动故障转移**：主节点故障时自动提升从节点
- **配置提供者**：客户端自动发现当前主节点

### 2.2 哨兵集群部署

#### 哨兵配置

```bash
cat >/redis/sentinel.conf <<'EOF'
daemonize yes
bind 0.0.0.0
port 26379
dir /redis/
logfile /redis/sentinel.log
sentinel monitor mymaster 10.0.0.51 6379 2
sentinel down-after-milliseconds mymaster 30000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 180000

# 如果主节点有密码，需配置
sentinel auth-pass mymaster StrongMasterPass123!

# 哨兵自身认证（可选，增强安全性）
sentinel requirepass SentinelPass123!
EOF

# 启动哨兵
redis-sentinel /redis/sentinel.conf
ps -ef|grep redis
redis-cli -p 26379 info sentinel
```

#### Systemd服务配置

```ini
[Unit]
Description=Redis Sentinel
After=network.target

[Service]
Type=notify
User=redis
Group=redis
RuntimeDirectory=redis
ExecStart=/usr/local/bin/redis-sentinel /redis/sentinel.conf
ExecStop=/bin/kill -s QUIT $MAINPID

# 安全限制
NoNewPrivileges=yes
ReadWritePaths=/redis
ReadOnlyPaths=/

[Install]
WantedBy=multi-user.target
```

### 2.3 哨兵操作与监控

#### 查看哨兵状态

```bash
# 连接哨兵（如有密码需要认证）
redis-cli -p 26379
127.0.0.1:26379> auth SentinelPass123!

# 查看哨兵信息
info sentinel

# 获取主节点地址
sentinel get-master-addr-by-name mymaster

# 查看主节点信息
sentinel master mymaster

# 查看从节点信息
sentinel slaves mymaster

# 检查仲裁状态
sentinel ckquorum mymaster
```

### 2.4 故障转移流程

#### 故障发现与切换

1. **主观下线**：单个哨兵认为主节点不可用
2. **客观下线**：多个哨兵确认主节点故障
3. **选举领导者**：哨兵间选举负责故障转移的领导者
4. **故障转移**：
   - 选择最优从节点作为新主节点
   - 将其它从节点指向新主节点
   - 旧主节点恢复后作为从节点加入

### 2.5 测试主从故障自动化转移

```bash
# 1. 查看当前主节点
sentinel get-master-addr-by-name mymaster
# 输出：1) "10.0.0.51" 2) "6379"

# 2. 模拟主节点故障
redis-cli -h 10.0.0.51 -p 6379 -a StrongMasterPass123! debug segfault

# 3. 等待故障转移（约30-60秒）
sleep 45

# 4. 查看新主节点
sentinel get-master-addr-by-name mymaster
# 输出可能变为：1) "10.0.0.52" 2) "6379"

# 5. 验证新主节点可写
redis-cli -h 10.0.0.52 -p 6379 -a StrongMasterPass123! set test_key "故障转移成功"

# 6. 验证从节点可读
redis-cli -h 10.0.0.53 -p 6379 -a StrongMasterPass123! get test_key
```

#### 修复old_master

```bash
# 1. 重启原主节点
systemctl start redis

# 2. 查看复制状态
redis-cli -a StrongMasterPass123! info replication
# 输出应显示为从节点角色，指向新主节点
# Replication
# role:slave
# master_host:10.0.0.52  # 或10.0.0.53
# master_port:6379
# master_link_status:up
```

### 2.6 客户端连接策略（安全增强版）

#### Python客户端连接哨兵

```python
from redis.sentinel import Sentinel

# 哨兵节点列表（建议使用内网IP）
sentinel_nodes = [
    ('10.0.0.51', 26379),
    ('10.0.0.52', 26379),
    ('10.0.0.53', 26379)
]

# 创建哨兵连接（带认证）
sentinel = Sentinel(
    sentinel_nodes,
    socket_timeout=0.5,
    sentinel_kwargs={'password': 'SentinelPass123!'}  # 哨兵密码
)

# 获取主节点连接（写操作）
master = sentinel.master_for(
    'mymaster',
    password='StrongMasterPass123!',  # Redis密码
    socket_timeout=0.5,
    retry_on_timeout=True
)

# 获取从节点连接（读操作）
slave = sentinel.slave_for(
    'mymaster',
    password='StrongMasterPass123!',
    socket_timeout=0.5,
    retry_on_timeout=True
)

# 执行操作
try:
    master.set('key', 'value')
    value = slave.get('key')
    print(f"操作成功，获取的值: {value}")
except Exception as e:
    print(f"连接失败: {e}")
```

---

## 三、安全配置总结

### 3.1 必须实施的安全措施

1. **密码策略**：
   - 主从节点使用强密码（16位以上，混合字符）
   - 哨兵集群设置独立密码
   - 定期更换密码
2. **网络隔离**：
   - bind配置仅限内网IP
   - 使用防火墙限制访问来源
   - 避免将Redis暴露到公网
3. **权限控制**：
   - 以非root用户（redis用户）运行服务
   - 限制数据目录权限
   - 禁用危险命令（KEYS, FLUSHALL, CONFIG等）
4. **配置加固**：
   - 开启protected-mode
   - 修改默认端口
   - 配置合适的超时时间

### 3.2 监控与审计

1. **日志监控**：
   - 定期检查Redis日志
   - 监控异常登录尝试
   - 设置日志轮转策略
2. **性能监控**：
   - 监控内存使用情况
   - 监控连接数变化
   - 监控主从同步延迟
3. **定期安全检查**：
   - 检查配置文件权限
   - 验证用户权限设置
   - 更新Redis到安全版本

---

## 附录：常用命令速查

### 安全相关

```bash
# 查看Redis配置（需要认证）
redis-cli -a your_password config get *

# 动态修改密码（谨慎使用）
redis-cli -a old_password config set requirepass new_password

# 查看客户端连接
redis-cli -a your_password client list

# 查看认证日志
grep "AUTH" /redis/redis_6379.log
```

### 复制相关

```bash
# 查看复制状态
redis-cli -a your_password info replication

# 查看复制延迟
redis-cli -a your_password --latency

# 手动触发同步
redis-cli -a your_password sync
```

### 哨兵相关

```bash
# 强制故障转移（谨慎使用）
redis-cli -p 26379 -a SentinelPass123! sentinel failover mymaster

# 查看哨兵节点
redis-cli -p 26379 -a SentinelPass123! sentinel sentinels mymaster

# 移除故障节点
redis-cli -p 26379 -a SentinelPass123! sentinel remove mymaster

# 重置故障状态
redis-cli -p 26379 -a SentinelPass123! sentinel reset mymaster
```

### 性能测试

```bash
# 基准测试（带认证）
redis-benchmark -h 10.0.0.51 -p 6379 -a StrongMasterPass123! -n 100000 -q

# 测试SET操作
redis-benchmark -t set -n 1000000 -r 10000000 -a StrongMasterPass123!

# 测试GET操作
redis-benchmark -t get -n 1000000 -r 10000000 -a StrongMasterPass123!
```

### 入侵检测与响应

```bash
# 1. 检查异常连接
redis-cli -a your_password client list | grep -v "10.0.0"

# 2. 检查持久化文件
ls -la /redis/dump.rdb /redis/appendonly.aof

# 3. 检查SSH授权文件（如果曾经被攻击）
ls -la ~/.ssh/authorized_keys
stat ~/.ssh/authorized_keys

# 4. 紧急响应步骤
# a) 立即修改密码
# b) 重启Redis服务
# c) 检查并清理异常数据
# d) 审查防火墙规则
```

---

## 注意事项

1. **生产环境部署前**务必在测试环境验证所有配置
2. **密码管理**建议使用密钥管理服务，避免硬编码
3. **定期备份**配置文件和持久化数据
4. **监控告警**设置关键指标阈值（如内存使用率、连接数等）
5. **文档更新**保持操作文档与实际环境同步
