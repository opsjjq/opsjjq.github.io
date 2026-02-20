# Zabbix 主动/被动模式与分布式监控

## 一、Zabbix Agent 工作模式

### 1.1 被动模式（默认）

**工作原理：**

- Zabbix Server 主动向 Agent 请求数据
- Agent 接收到请求后采集数据并返回给 Server
- 每个监控项都需要一次独立的请求-响应过程

**特点：**

- Server 发起请求，Agent 被动响应
- 适用于监控项较少的场景
- 网络开销较大，Server 压力较大

```bash
# 被动模式 Agent 配置示例
cat > /etc/zabbix/zabbix_agentd.conf << 'EOF'
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=10.0.0.71           # Server IP，允许接收数据
Include=/etc/zabbix/zabbix_agentd.d/*.conf
EOF
```

### 1.2 主动模式

**工作原理：**

- Agent 主动向 Server 请求监控项列表
- Agent 采集所有数据后一次性发送给 Server
- 支持批量数据传输

**特点：**

- Agent 主动发起请求和发送数据
- 适用于监控项多、机器规模大的场景
- 降低 Server 压力，提高效率

```bash
# 主动模式 Agent 配置示例
cat > /etc/zabbix/zabbix_agentd.conf << 'EOF'
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=10.0.0.71           # Server IP，允许接收数据
ServerActive=10.0.0.71     # Server IP，Agent主动连接
Hostname=web7              # 主机名（与Web界面一致）
Include=/etc/zabbix/zabbix_agentd.d/*.conf
EOF

systemctl restart zabbix-agent
```

### 1.3 修改监控项为主动模式

**Web界面操作步骤：**

1. 配置 → 模板 → 选择模板
2. 监控项 → 全选需要修改的监控项
3. 批量更新 → 类型：Zabbix Agent（主动式）
4. 更新间隔：根据需求调整（如30s）

**注意：** Agent配置和监控项配置必须同时修改为主动模式

---

## 二、自动发现（Discovery）

### 2.1 工作原理

- Zabbix Server 定期扫描指定网段
- 发现符合条件的 Agent
- 自动添加到监控系统中

### 2.2 配置步骤

#### 2.2.1 创建发现规则

1. **配置 → 自动发现 → 创建发现规则**
2. 配置发现参数：
   - 名称：Network Discovery
   - IP范围：10.0.0.1-254
   - 检查类型：Zabbix Agent "system.uname"
   - 更新间隔：1h

#### 2.2.2 配置发现动作

1. **配置 → 动作 → 发现动作 → 创建动作**
2. 条件：自动发现的状态 = "Up"
3. 操作：添加主机、链接模板、添加到主机组

#### 2.2.3 Agent 配置（主动模式）

```bash
# 被发现的机器配置
cat > /etc/zabbix/zabbix_agentd.conf << 'EOF'
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=10.0.0.71
ServerActive=10.0.0.71
Hostname=web8              # 唯一主机名
Include=/etc/zabbix/zabbix_agentd.d/*.conf
EOF

systemctl restart zabbix-agent
```

---

## 三、自动注册（Auto Registration）

### 3.1 工作原理

- Agent 主动向 Server 发送注册请求
- Server 根据条件自动处理
- 降低 Server 扫描压力

### 3.2 配置步骤

#### 3.2.1 Agent 配置

```bash
# 自动注册 Agent 配置
cat > /etc/zabbix/zabbix_agentd.conf << 'EOF'
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=10.0.0.71
ServerActive=10.0.0.71
HostMetadata=Linux         # 元数据，用于匹配条件
Include=/etc/zabbix/zabbix_agentd.d/*.conf
EOF

systemctl restart zabbix-agent
```

#### 3.2.2 Web界面配置

1. **配置 → 动作 → 自动注册动作 → 创建动作**
2. 条件：主机元数据包含 "Linux"
3. 操作：
   - 添加到主机组：Linux servers
   - 链接到模板：Template OS Linux
   - 发送通知到运维人员

---

## 四、分布式监控（Zabbix Proxy）

### 4.1 什么是 Zabbix Proxy

- 代替 Server 收集监控数据的中转站
- 临时存储数据并转发给 Server
- 分担 Server 压力，支持大规模部署

### 4.2 应用场景

- 监控远程区域设备
- 监控网络不稳定区域
- 监控上千台设备时减轻 Server 压力
- 简化分布式监控维护

### 4.3 Proxy 部署步骤

#### 4.3.1 环境准备

```bash
# 1. 安装依赖
rpm -ivh https://mirrors.tuna.tsinghua.edu.cn/zabbix/zabbix/4.0/rhel/7/x86_64/zabbix-release-4.0-1.el7.noarch.rpm
sed -i 's#repo.zabbix.com#mirrors.tuna.tsinghua.edu.cn/zabbix#g' /etc/yum.repos.d/zabbix.repo

# 2. 安装 Proxy 和数据库
yum install zabbix-proxy-mysql mariadb-server -y

# 3. 启动数据库
systemctl start mariadb
systemctl enable mariadb
```

#### 4.3.2 数据库配置

```bash
# 设置数据库密码
mysqladmin password qwe123123

# 创建数据库和用户
mysql -uroot -pqwe123123 -e "CREATE DATABASE zabbix_proxy CHARACTER SET utf8 COLLATE utf8_bin;"
mysql -uroot -pqwe123123 -e "GRANT ALL PRIVILEGES ON zabbix_proxy.* TO zabbix_proxy@localhost IDENTIFIED BY 'qwe123123';"
mysql -uroot -pqwe123123 -e "FLUSH PRIVILEGES;"

# 导入表结构
zcat /usr/share/doc/zabbix-proxy-mysql-*/schema.sql.gz | mysql -uzabbix_proxy -pqwe123123 zabbix_proxy
```

#### 4.3.3 Proxy 配置

```bash
cat > /etc/zabbix/zabbix_proxy.conf << 'EOF'
# 基本配置
ProxyMode=0                    # 0-主动模式，1-被动模式
Server=10.0.0.71              # Zabbix Server IP
ServerPort=10051              # Zabbix Server 端口
Hostname=zbx-proxy            # Proxy 主机名（唯一）

# 日志配置
LogFile=/var/log/zabbix/zabbix_proxy.log
LogFileSize=0
PidFile=/var/run/zabbix/zabbix_proxy.pid
SocketDir=/var/run/zabbix

# 数据库配置
DBHost=localhost
DBName=zabbix_proxy
DBUser=zabbix_proxy
DBPassword=qwe123123

# 性能参数
ConfigFrequency=60           # 配置同步频率（秒）
DataSenderFrequency=5        # 数据发送频率（秒）
StartPollers=5              # 启动的监控进程数
EOF

# 启动服务
systemctl start zabbix-proxy
systemctl enable zabbix-proxy
```

### 4.4 配置 Agent 使用 Proxy

#### 4.4.1 Agent 配置

```bash
# Agent 指向 Proxy
cat > /etc/zabbix/zabbix_agentd.conf << 'EOF'
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=10.0.0.72            # Proxy IP（允许接收数据）
ServerActive=10.0.0.72      # Proxy IP（Agent主动连接）
HostMetadata=Linux          # 用于自动注册
Include=/etc/zabbix/zabbix_agentd.d/*.conf
EOF

systemctl restart zabbix-agent
```

#### 4.4.2 Web界面配置 Proxy

1. **管理 → Agent代理程序 → 创建代理**
2. 配置参数：
   - 代理名称：zbx-proxy（与配置文件一致）
   - 代理模式：主动式
   - 代理地址：10.0.0.72

#### 4.4.3 配置自动注册到 Proxy

1. **配置 → 动作 → 自动注册动作 → 创建动作**
2. 条件：主机元数据包含 "Linux"
3. 操作：
   - 添加到主机组：Proxy Hosts
   - 链接到模板
   - 通过代理监控：选择 "zbx-proxy"

---

## 五、架构对比

### 5.1 传统架构

```
Agent → Server → Database → Web UI
```

### 5.2 分布式架构

```
Agent → Proxy → Server → Database → Web UI
           ↳ 本地缓存
```

### 5.3 混合架构

```
区域1：Agent → Proxy1 → Server
区域2：Agent → Proxy2 → Server
远程：Agent（主动模式）→ Server
```

---

## 六、性能优化建议

### 6.1 主动模式优化

1. **调整数据发送频率**：根据监控需求调整
2. **批量修改监控项**：使用模板批量操作
3. **合理设置缓存**：避免数据丢失

### 6.2 自动发现/注册优化

1. **合理设置扫描间隔**：避免频繁扫描
2. **使用条件过滤**：精确匹配目标主机
3. **配置通知**：及时了解新加入的主机

### 6.3 Proxy 优化

1. **数据库优化**：定期清理历史数据
2. **网络优化**：确保 Proxy-Server 网络稳定
3. **资源分配**：根据负载调整进程数

---

## 七、故障排查

### 7.1 检查 Agent 连接

```bash
# 检查 Agent 是否运行
systemctl status zabbix-agent

# 测试与 Server/Proxy 通信
telnet 10.0.0.71 10051
telnet 10.0.0.72 10051

# 手动获取数据测试
zabbix_get -s 10.0.0.7 -k system.uname
```

### 7.2 查看日志

```bash
# Agent 日志
tail -f /var/log/zabbix/zabbix_agentd.log

# Proxy 日志
tail -f /var/log/zabbix/zabbix_proxy.log

# Server 日志
tail -f /var/log/zabbix/zabbix_server.log
```

### 7.3 常见问题

1. **主机名不匹配**：确保 Agent 配置的 Hostname 与 Web 界面一致
2. **权限问题**：检查脚本和日志文件的 zabbix 用户权限
3. **网络问题**：确保防火墙允许相关端口（10050, 10051）
4. **时间同步**：确保所有服务器时间一致

---

## 八、监控策略建议

### 8.1 小规模部署（<100台）

- 使用被动模式
- 直接 Agent → Server
- 简单易维护

### 8.2 中规模部署（100-500台）

- 混合模式：重要主机用被动，其他用主动
- 考虑使用自动发现
- 开始规划监控分组

### 8.3 大规模部署（>500台）

- 部署 Zabbix Proxy
- 所有 Agent 使用主动模式
- 实施自动注册
- 按区域/业务划分监控架构

---

## 九、总结

通过合理配置主动/被动模式、自动发现/注册和分布式 Proxy，可以构建高效、稳定、可扩展的 Zabbix 监控体系，满足不同规模的监控需求。

> 下一步：学习ELK日志分析系统，实现日志集中管理与可视化分析。
