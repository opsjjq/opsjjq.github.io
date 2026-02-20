## 一、Redis 数据存储格式

Redis 采用键值对（key-value）形式存储数据：

```text
key : value
```

key 始终是字符串类型，而 value 支持多种数据类型。

---

## 二、Redis 全局命令

### 1. 数据写入与读取

```bash
# 设置字符串类型的键值对
127.0.0.1:6379> set keyname value
OK

127.0.0.1:6379> get key
"value"
```

### 2. 数据库管理

```bash
# 查看当前数据库 key 数量
127.0.0.1:6379> dbsize
(integer) 3

# 查看所有 key（生产环境慎用！）
127.0.0.1:6379> keys *
1) "k1"
2) "k2"
3) "k3"

# 安全搜索建议使用 SCAN 命令替代 keys *
127.0.0.1:6379> scan 0 match user* count 10

# 查看数据库信息
127.0.0.1:6379> info keyspace
# Keyspace
db0:keys=6,expires=0,avg_ttl=0
db1:keys=1,expires=0,avg_ttl=0

# 查看 Redis 所有信息区段
127.0.0.1:6379> info
# 或查看指定区段，如主从、内存、CPU等
127.0.0.1:6379> info replication
127.0.0.1:6379> info memory
```

### 3. 数据库切换与清空

```bash
# 切换数据库（Redis 默认 16 个库：0-15）
127.0.0.1:6379> select 15
OK

# 清空当前数据库（危险命令）
127.0.0.1:6379> flushdb
OK

# 清空所有数据库（极度危险命令）
127.0.0.1:6379> flushall
OK
```

### 4. Key 操作命令

```bash
# 检查 key 是否存在
127.0.0.1:6379> exists key1 key2
(integer) 2

# 删除 key
127.0.0.1:6379> del key1 key2
(integer) 2

# 设置 key 过期时间（秒）
127.0.0.1:6379> expire session_key 180
(integer) 1

# 查看剩余过期时间
127.0.0.1:6379> ttl session_key
(integer) 154

# 查看 value 类型
127.0.0.1:6379> type mykey
string
```

---

## 三、Redis 五大核心数据类型

### 1. String（字符串）

最基本的 Redis 数据类型，一个 key 对应一个字符串值。

**常用命令：**

```bash
# 设置单个值
set name "linux0224"

# 设置多个值
mset name2 "linux0224" address2 "北京" hobby2 "学习"

# 读取单个值
get name

# 读取多个值
mget name2 address2 hobby2

# 数值操作
set counter 0
incr counter          # 加1
decr counter          # 减1
incrby counter 100    # 加100
decrby counter 50     # 减50
```

#### 中文显示支持

使用 `redis-cli --raw` 参数可直接显示中文，避免转义。

#### 应用场景

```text
1. 数据缓存
经典用法，把经常要读取的如mysql里的url、字符串、音视频等字符串信息，存储到redis里。
redis作为缓存层，加速数据读取，mysql作为数据持久化层，降低mysql的访问压力。

提示：音视频等信息存储在mysql里，一般存储的是如url，或者路径，便于查找访问。
而非直接存储二进制数据，并不合适。

2.计数器
redis是单线程模式，一个命令结束才会执行下一个命令，因此可以实现计数器的作用，确保多进程访问redis的数据，也能确保数据源正确性。
（使用场景，如微博的博文阅读量，你可以理解为你可以直接修改key的值，修改阅读量为99999）

3.用作网站用户的登录会话存储
存储session，或者token等信息
```

### 2. List（列表）

基于双向链表实现的有序元素集合，支持重复元素。

**常用命令：**

| 命令   | 简述                                                         | 使用             |
| :----- | :----------------------------------------------------------- | :--------------- |
| lpush  | 将给定值推入到列表右端                                       | RPUSH key value  |
| lpush  | 将给定值推入到列表左端                                       | LPUSH key value  |
| lpop   | 从列表的右端弹出一个值，并返回被弹出的值                     | RPOP key         |
| lpop   | 从列表的左端弹出一个值，并返回被弹出的值                     | LPOP key         |
| lrange | 获取列表在给定范围上的所有值                                 | LRANGE key 0 -1  |
| lindex | 通过索引获取列表中的元素。你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。 | LINDEX key index |

```bash
# 从左侧添加元素
lpush mylist "a" "b" "c"

# 从右侧添加元素
rpush mylist "x" "y" "z"

# 获取列表范围0第一个   -1是最后一个  2是第3个
lrange mylist 0 -1
lrange mylist 0 2

# 左侧弹出元素
lpop mylist

# 右侧弹出元素
rpop mylist

# 获取指定索引元素
lindex mylist 0

# 获取列表长度
llen mylist
```

**应用场景：**

```text
微博，知乎等博文的timeline
  用户发表的文章，用lpush加入时间轴，微博最新的文章列表。
订单系统、物流系统的消息队列
  生产消费者，订单生成，订单处理
```

### 3. Set（集合）

Set 是 String 类型的无序集合。无序且**不重复**的字符串集合，基于哈希表实现。

**常用命令：**

| 命令                               | 作用                   |
| :--------------------------------- | :--------------------- |
| sadd myset "user1" "user3" "user2" | **添加元素**           |
| smembers myset                     | **查看所有元素**       |
| sismember myset "user3"            | **判断单元素是否存在** |
| scard myset                        | **获取集合大小**       |

```bash
# 添加元素
sadd myset "user1" "user3" "user2"

# 查看所有元素
smembers myset

# 判断单元素是否存在
sismember myset "user1"

# 获取集合大小
scard myset

# 集合运算
sinter set1 set2      # 交集
sunion set1 set2      # 并集
sdiff set1 set2       # 差集
```

**应用场景：**

```text
微信，微博，等社交APP的标签功能
  你，我，他都关注了美女板块的视频动态
  系统根据标签选择给这一类的用户，较高比重的推送美女视频。

用户收藏夹
  利用set去重功能，实现不会重复收藏，重复性点赞，踩，一类的功能
```

### 4. Hash（哈希表）

键值对的集合，适合存储对象。

**常用命令：**

| 命令                                                | 作用                |
| :-------------------------------------------------- | :------------------ |
| hset name1 key1 value1 key2 value2 key3 value3      | **添加哈希表name1** |
| hget name1 key1 hmget name1 key1 key2 hgetall name1 | **查看元素**        |
| hdel name1 key1 del name1                           | **删除字段或表**    |
| hlen name1                                          | 获取字段数量        |

```bash
# 设置单个字段
hset user:1001 name "张三" age 25

# 设置多个字段
hmset user:1002 name "李四" age 30 city "北京"

# 获取单个字段
hget user:1001 name

# 获取多个字段
hmget user:1001 name age

# 获取所有字段
hgetall user:1001

# 删除字段
hdel user:1001 age

# 删除哈希表
del user:1001

# 字段数量
hlen user:1001
```

**应用场景：**

```text
比起string类型存储数据，更直观，更高效，更省空间。
如存储用户信息
存储一篇帖子的阅读数、评论数各类信息。
```

### 5. Zset（有序集合）

不重复的string 类型元素的集合。每个元素关联一个分数（score），按分数排序。

**常用命令：**

| 命令     | 简述                                                     | 使用                           |
| :------- | :------------------------------------------------------- | :----------------------------- |
| ZADD     | 将一个带有给定分值的成员添加到有序集合里面               | ZADD zset-key 178 member1      |
| ZRANGE   | 根据元素在有序集合中所处的位置，从有序集合中获取多个元素 | ZRANGE zset-key 0-1 withscores |
| ZREM     | 如果给定元素成员存在于有序集合中，那么就移除这个元素     | ZREM zset-key member1          |
| ZINCRBY  | 增加指定成员的分数                                       | ZINCRBY zset-key 10 member1    |
| ZSCORE   | 查看成员分数                                             | ZSCORE zset-key member1        |
| ZRANK    | 查看成员排名（升序）                                     | ZRANK zset-key member1         |
| ZREVRANK | 查看成员排名（降序）                                     | ZREVRANK zset-key member1      |

```bash
# 添加元素（分数在前）
zadd name1 2440 "player1" 2100 "player2"

# 按分数升序查看
zrange name1 0 -1 withscores

# 按分数降序查看
zrevrange name1 0 -1 withscores

# 获取元素分数
zscore name1 "player1"

# 增加分数
zincrby name1 100 "player1"

# 获取排名
zrank name1 "player1"    # 升序排名
zrevrank name1 "player1" # 降序排名

# 移除元素
zrem name1 "player1"
```

**应用场景：**

```text
排行榜：有序集合经典使用场景。 

例如小说视频等网站需要对用户上传的小说视频做排行榜，榜单可以按照用户关注数，更新时间，字数等打分，做排行。
```
