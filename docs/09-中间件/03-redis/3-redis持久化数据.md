# Redis持久化机制详解

## 一、为什么需要持久化？

Redis是基于内存的数据库，所有数据存储在内存中。如果Redis进程重启或服务器宕机，内存中的数据将全部丢失。

持久化机制可将内存中的数据保存到磁盘中，确保数据在重启后能够恢复。

---

## 二、RDB持久化（Redis DataBase）

### 1. 概念

RDB是一种**快照式持久化**机制，将某一时刻的内存数据完整保存到磁盘文件中。

### 2. 触发方式

- **手动触发**：
  - `save`命令：同步保存，阻塞Redis服务器直到RDB过程完成
  - `bgsave`命令：异步保存，后台fork子进程进行保存
- **自动触发**：
  - 配置`save`规则（如：`save 60 1000`）
  - Redis正常关闭（shutdown）
  - 主从复制时，从节点首次全量同步

### 3. 执行流程（BGSAVE）

```text
1. 客户端执行BGSAVE命令
2. 主进程检查是否有子进程正在执行
3. 如果没有，fork子进程进行持久化（fork子进程的这个过程是阻塞的）
4. 子进程将数据写入临时RDB文件
5. 写入完成后，原子替换旧RDB文件
6. 通知主进程，更新统计信息
```

### 4. 配置文件参数

```bash
# RDB相关配置
save 900 1      # 900秒内至少有1个key变化
save 300 10     # 300秒内至少有10个key变化
save 60 10000   # 60秒内至少有10000个key变化
# save ""       # 关闭RDB快照功能

dir /opt              # 保存目录
dbfilename dump.rdb   # RDB文件名
stop-writes-on-bgsave-error yes  # 持久化出错时停止写入
rdbcompression yes    # 启用压缩
rdbchecksum yes       # 启用校验
```

**注意**：Redis的`save`规则检查机制是：先检查更严格的条件（如`save 60 10000`），一旦满足就执行，然后重置所有计数器。因此`save 900 1`的条件可能没机会实际触发。

### 5. 数据恢复测试

```bash
# 1. 手动bgsave
redis-cli bgsave

# 2. 测试自动触发条件
for((i=1;i<=10000;i++));do
  redis-cli set "key_$i" "value_$i"
done

# 3. 模拟数据丢失并恢复
redis-cli flushdb
# 确认数据已清空
redis-cli dbsize

# 4. 恢复数据
redis-cli shutdown
cp dump.bak dump.rdb  # 恢复备份文件
redis-server /etc/redis.conf
redis-cli dbsize  # 检查数据是否恢复
```

### 6. 优缺点

**优点**：

- 文件紧凑，适合备份
- 恢复速度快
- 适合大规模数据恢复

**缺点**：

- 数据可能丢失（上次持久化到故障之间的数据）
- fork过程可能阻塞主进程（数据量大时）

---

## 三、AOF持久化（Append Only File）

### 1. 概念

AOF通过记录所有**写命令**来实现持久化，以日志形式追加保存每个写操作（可与RDB同时开启）。

### 2. 执行流程

```text
1. 命令追加：将写命令追加到AOF缓冲区
2. 文件写入：将缓冲区内容写入系统缓冲区
3. 文件同步：根据策略将系统缓冲区同步到磁盘
```

### 3. 写回策略

- **always**：每个写命令都同步到磁盘（最安全，性能最低）
- **everysec**：每秒同步一次（推荐，平衡安全与性能）
- **no**：由操作系统决定何时同步（最快，最不安全）

### 4. 配置文件参数

```bash
# AOF相关配置
appendonly yes                    # 启用AOF
appendfilename "appendonly.aof"   # AOF文件名
appendfsync everysec              # 同步策略
auto-aof-rewrite-percentage 100   # 增长比例触发重写
auto-aof-rewrite-min-size 64mb    # 最小大小触发重写
```

### 5. 开启AOF实践

```bash
# 修改配置文件
echo "appendonly yes" >> /etc/redis.conf
echo 'appendfilename "appendonly.aof"' >> /etc/redis.conf
echo 'appendfsync everysec' >> /etc/redis.conf

# 重启Redis
redis-cli shutdown
redis-server /etc/redis.conf

# 手动触发AOF重写
redis-cli CONFIG SET appendonly yes
redis-cli BGREWRITEAOF
```

### 6. AOF重写机制

- **目的**：解决AOF文件过大的问题，删除冗余命令
- **触发方式**：
  - 手动：`BGREWRITEAOF`命令
  - 自动：根据配置自动触发
- **原理**：将当前数据库状态转换为命令集，生成新的AOF文件

### 7. 优缺点

**优点**：

- 数据安全性高（最多丢失1秒数据）
- 可读性强（文本格式）
- 支持实时持久化

**缺点**：

- 文件体积较大
- 恢复速度较慢
- 性能略低于RDB

---

## 四、混合持久化（Redis 4.0+）

### 1. 概念

结合RDB和AOF的优点：

- 使用RDB格式存储全量数据
- 使用AOF格式存储增量数据

### 2. 开启方式

```bash
# 混合持久化配置
aof-use-rdb-preamble yes

# 也可命令行开启（临时生效）
redis-cli config set aof-use-rdb-preamble yes
```

### 3. 工作流程

```text
1. 写入时：先以RDB格式保存全量快照
2. 后续：以AOF格式记录增量命令
3. 重写时：生成RDB快照 + AOF增量命令
```

### 4. 数据恢复流程

```bash
# 恢复操作步骤：
1. 将AOF文件放入配置文件指定的dir目录下
2. 重启Redis
# Redis会自动检查并加载混合持久化文件
```

### 5. 优缺点

**优点**：

- 结合RDB和AOF的优点
- 启动速度快（RDB格式）
- 数据丢失风险低（AOF增量）

**缺点**：

- AOF文件中添加了RDB格式的内容，可读性变差

---

## 五、持久化选择策略

### 1. 数据安全性要求高

- 使用AOF（appendfsync always）
- 或混合持久化

### 2. 数据恢复速度要求高

- 使用RDB
- 或混合持久化

### 3. 一般场景

- 推荐混合持久化（平衡安全与性能）

### 4. 特殊场景

- 可关闭持久化（不考虑数据丢失，追求极致性能）

---

## 六、实践注意事项

### 1. RDB与AOF同时开启时的优先级

当RDB和AOF同时开启时，Redis重启后**优先加载AOF文件**进行数据恢复。

### 2. 重要命令

```bash
# 查看持久化配置
redis-cli CONFIG GET save
redis-cli CONFIG GET appendonly

# 手动触发持久化
redis-cli bgsave          # 触发RDB
redis-cli BGREWRITEAOF    # 触发AOF重写

# 扫描key（用于数据验证）
redis-cli --scan --pattern '*'
```

### 3. 数据备份策略

- 定期备份RDB/AOF文件到异地
- 使用`md5sum`校验文件完整性
- 测试恢复流程确保可用性

---

## 七、最佳实践建议

1. **生产环境推荐使用混合持久化**，平衡性能与数据安全
2. **定期测试数据恢复流程**，确保备份有效
3. **监控持久化状态**，关注`info Persistence`输出
4. **合理配置保存目录**，确保磁盘空间充足
5. **根据业务特点调整参数**，如`save`规则、`appendfsync`策略等
