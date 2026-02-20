# 高并发缓存中间件 Redis

## 一、为什么学习 Redis？

Redis 作为 C 语言开发的高性能键值存储系统，支持多种数据结构，广泛应用于缓存、消息队列、会话存储等场景。掌握其原理与高级操作是应对高并发、低延迟需求的必备技能。

---

### Redis 在电商架构中的应用

Redis 在电商系统中常用于：

- 缓存商品信息、用户会话
- 消息队列（如订单处理、库存更新）
- 实时排行榜、秒杀系统

---

### Redis 学习体系（阿里云视角）

涵盖：

- 基础部署与配置
- 数据类型与操作
- 持久化机制
- 主从复制与哨兵
- 集群与高可用
- 性能调优与监控

---

### 无 Redis 架构

所有请求直接访问数据库，数据库压力大，响应慢。

---

### 使用 Redis 的缓存架构

```sql
关系数据库是基于硬盘读写的，其效率和资源有限，而 Redis 是基于内存的，其读写速度差别很大。
策略性将常访问数据放到 Redis 提高系统吞吐和并发量。
通过 Redis 缓存热点数据，大幅减轻数据库压力，提升系统响应速度。

速度快体现在：
1. 基于内存，读写较快
2. 使用哈希算法直接定位结果，不需要计算，直接 key-value 获取结果
```

---

## 二、关系型与非关系型数据库

```sql
关系型数据库 SQL：
mysql  oracle  postgreSQL

非关系型数据库 NoSQL（not only sql）：
redis  mongodb
```

| 特性 | 关系型数据库 | 非关系型数据库（如 Redis） |
| :--- | :--- | :--- |
| 数据结构 | 表结构固定 | 灵活（键值、文档、图等） |
| 扩展性 | 垂直扩展为主 | 水平扩展能力强 |
| 事务支持 | 强一致性 | 最终一致性为主 |
| 适用场景 | 复杂查询、事务处理 | 高并发读写、缓存、消息队列 |

---

## 三、Redis 特性

- 支持多种数据结构：字符串、哈希、列表、集合、有序集合等
- 高性能：基于内存操作，读写速度快
- 持久化：支持 RDB 和 AOF 两种持久化方式
- 内置高可用架构：支持主从复制、哨兵、集群模式
- 功能丰富：发布订阅、Lua 脚本、事务、流水线等

---

## 四、Redis 应用场景（面试重点）

```sql
1. 缓存（key过期特性）
   - 用户登录网站的 session 信息写入 Redis，过期后自动删除
   - 商城的优惠券过期
   - 短信验证码的过期

2. 排行榜（列表、有序集合）
   - 抖音点赞点击量
   - 直播间打赏老板排行榜

3. 计数器
   - 博客阅读量
   - 视频播放次数
   - 在线观看人数
   - 评论最新数量
   - 点赞、点踩

4. 社交网络（集合数据类型）
   - 粉丝
   - 共同好友 / 可能认识的人
   - 兴趣爱好 / 同兴趣的人
   - 用户注册、账号是否已存在

5. 消息队列（列表类型）
   - ELK 日志的缓存
   - 聊天记录

6. 发布订阅
   - 粉丝关注通知
   - 粉丝群消息发布
```

---

## 五、Redis 安装部署

### 5.1 版本选择

| 版本 | 主要新特性（关键演进） | 当前状态与使用建议 |
| :--- | :--- | :--- |
| **Redis 7.x** | Redis Functions、Multi-part AOF、命令参数验证、增强的 JSON 处理与集群管理 | 最新稳定系列，适合对新特性有明确需求且技术栈较新的项目，建议生产前充分测试 |
| **Redis 6.x** | ACL、多线程 I/O、客户端缓存、RESP3 协议、原生 SSL/TLS 支持 | 生产环境主流版本，云厂商默认或推荐版本，性能、安全、功能平衡，最稳妥的选择 |
| **Redis 5.x** | Stream 数据类型、RDB 格式优化、集群管理器移植到 redis-cli、Active Defragmentation v2 | 存量系统广泛使用，若业务重度依赖 Stream 可选此版本，新项目建议 6.x 或 7.x |
| **Redis 4.0 及以下** | 混合持久化、模块系统、PSYNC2 改进等 | 已逐步淘汰，主流云平台已停止支持 |

---

### 5.2 安装步骤（以 Redis 6.2.4 为例）

#### 编译安装

```bash
# 安装依赖
yum -y install epel-release wget make gcc-c++

# 下载并解压
cd /opt
wget https://download.redis.io/releases/redis-6.2.4.tar.gz
tar -xf redis-6.2.4.tar.gz

# 编译并安装到指定目录
cd redis-6.2.4
make && make install PREFIX=/usr/local/redis
```

---

#### 检查安装结果

```bash
cd /usr/local/redis/
ls bin/
# 应包含：
# redis-benchmark  redis-check-aof  redis-check-rdb  redis-cli  redis-sentinel  redis-server
```

---

#### 配置环境变量

```bash
echo 'export PATH=$PATH:/usr/local/redis/bin/' >> /etc/profile
source /etc/profile
```

---

## 六、Redis 配置文件详解

### 6.1 配置文件创建与解释

```bash
# 创建 Redis 用户和目录
useradd redis -M -s /sbin/nologin
mkdir -p /redis/{data,logs,pid}
chown -R redis.redis /redis

# 创建配置文件
cat > /etc/redis.conf <<'EOF'
daemonize yes                # 以守护进程方式运行
bind 0.0.0.0                 # 监听所有 IP，生产环境建议指定内网 IP
port 6379                    # 默认端口
pidfile /redis/pid/redis_6379.pid
logfile /redis/logs/redis_6379.log
dir /redis/data              # 持久化文件存储目录
requirepass yourpassword     # 访问密码，生产环境必须设置
maxmemory-policy allkeys-lru # 内存满时淘汰策略
EOF
```

---

#### `bind` 参数说明（安全建议）：

- `bind 127.0.0.1`：仅本地访问，最安全
- `bind 10.0.0.51 172.16.1.51`：仅允许指定 IP 访问
- `bind 0.0.0.0`：允许所有 IP 访问（需配合防火墙和密码）

---

### 6.2 Systemd 服务配置

```bash
cat > /etc/systemd/system/redis.service <<'EOF'
[Unit]
Description=Redis persistent key-value database
After=network.target
After=network-online.target
Wants=network-online.target

[Service]
Type=forking
PIDFile=/redis/pid/redis_6379.pid
ExecStart=/usr/local/redis/bin/redis-server /etc/redis.conf
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
User=redis
Group=redis

[Install]
WantedBy=multi-user.target
EOF
```

---

启动并设置开机自启：

```bash
systemctl daemon-reload
systemctl enable redis
systemctl start redis
```

---

## 七、Redis 启动、关闭与连接

### 7.1 启动方式

```bash
# 直接启动
/usr/local/redis/bin/redis-server /etc/redis.conf

# 使用 systemctl
systemctl start redis
```

---

### 7.2 连接 Redis

```bash
# 本地连接（无密码）
redis-cli

# 远程连接（带密码）
redis-cli -h 10.0.0.51 -p 6379 -a yourpassword

# 交互式认证
redis-cli -h 10.0.0.51 -p 6379
> auth yourpassword
```

---

### 7.3 关闭 Redis

```bash
# 优雅关闭（会触发持久化）
redis-cli -a yourpassword shutdown

# 或使用 systemctl
systemctl stop redis

# 强制关闭（不推荐，可能导致数据丢失）
kill -9 $(cat /redis/pid/redis_6379.pid)
```

---

### 7.4 基本操作示例

```bash
# 写入数据
set name "linux0224"
set name2 "尖角大王"

# 读取数据（中文需加 --raw）
redis-cli --raw get name2

# 查看 key 数量
dbsize
```

---

### 7.5 Python 连接示例

```python
import redis
conn = redis.StrictRedis(host='10.0.0.51', port=6379, password='yourpassword')
value = conn.get('name').decode('utf-8')
print(value)
```

---

## 八、Redis 日志警告与系统优化

### 8.1 常见警告及修复

| 警告信息 | 问题分析 | 临时修复 | 永久修复 |
| :--- | :--- | :--- | :--- |
| `WARNING: The TCP backlog setting of 511 cannot be enforced...` | TCP 连接队列过小 | `sysctl -w net.core.somaxconn=1024` | 在 `/etc/sysctl.conf` 添加 `net.core.somaxconn=1024` |
| `WARNING overcommit_memory is set to 0!...` | 内存分配策略保守，可能导致持久化失败 | `sysctl -w vm.overcommit_memory=1` | 在 `/etc/sysctl.conf` 添加 `vm.overcommit_memory=1` |

---

### 8.2 一键优化脚本

```bash
cp /etc/sysctl.conf /etc/sysctl.conf.bak.$(date +%Y%m%d)

cat >> /etc/sysctl.conf <<EOF
# Redis 优化参数 - $(date)
net.core.somaxconn = 1024
vm.overcommit_memory = 1
EOF

sysctl -p
```

---

## 九、Redis 安全加固建议

1. **设置访问密码**：`requirepass yourpassword`

2. **限制绑定 IP**：仅绑定内网 IP，如 `bind 10.0.0.51`

3. **禁用高危命令**：在配置文件中添加：

   ```text
   rename-command FLUSHALL ""
   rename-command FLUSHDB ""
   rename-command CONFIG ""
   ```

4. **防火墙限制**：仅允许应用服务器访问 Redis 端口

5. **使用非默认端口**：修改 `port` 参数

6. **启用 TLS 传输加密**（Redis 6.x+）

---

## 十、总结

### 学习要点回顾：

1. Redis 的核心价值：高性能、丰富数据结构、高可用
2. 应用场景：缓存、队列、计数器、社交、排行榜等
3. 安装与配置：源码编译、配置文件详解、系统服务集成
4. 安全与优化：密码、绑定 IP、系统参数调优

---

### 建议：

1. 在本地或云服务器上部署 Redis 6.x
2. 尝试使用 Python/Java 连接并操作 Redis
3. 模拟缓存场景：将 MySQL 热点数据缓存至 Redis
4. 学习 Redis 持久化（RDB/AOF）配置与恢复
