# Docker 网络详解

## 一、Docker 网络基础

### 1. Docker 网络工作原理

- **技术基础**：利用 Linux 的 network namespace、network bridge、虚拟网络设备实现
- **默认网桥**：安装 Docker 后自动创建 `docker0` 虚拟网桥（虚拟交换机）
- **通信机制**：在宿主机和容器内分别创建虚拟接口（veth pair）实现通信

---

### 2. 容器创建流程

1. 创建一对虚拟接口（veth pair）
2. 宿主机一端桥接到 `docker0` 网桥，命名如 `vethXXXXXX`
3. 容器一端命名为 `eth0`（仅在容器命名空间内可见）
4. 从网桥地址段分配 IP 给容器，配置默认路由
5. 容器通过 `eth0` 与其他容器通信

---

### 3. 容器如何访问外部网络

```bash
# 检查 IP 转发是否开启
sysctl net.ipv4.ip_forward
# 输出应为：net.ipv4.ip_forward = 1

# 如果为 0，手动开启转发
sysctl -w net.ipv4.ip_forward=1

# 或者启动 Docker 时自动设置
dockerd --ip-forward=true
```

> Docker 服务默认开启 IP 转发，但若宿主机未启用，容器将无法访问外部网络

---

### 4. 容器之间访问

容器间通信需要满足两个条件：

1. 网络拓扑已互联（默认通过 `docker0` 网桥连接）
2. 宿主机防火墙（如 `iptables`）允许通信

---

## 二、Docker 四种网络模式

### 1. Bridge 模式（默认）

```bash
docker run --network=bridge  # 默认值，可省略
```

**特点**：

- 连接到默认 `docker0` 网桥
- 自动分配 IP（172.17.0.0/16）
- 通过 iptables NAT 与宿主机通信
- 同一宿主机容器可互访，不同宿主机容器需额外配置
- 需要端口映射供外部访问（原理：iptables 添加 DNAT 规则）

**网络拓扑**：

```text
宿主机 ←→ docker0网桥 ←→ veth pair ←→ 容器eth0
```

**常用命令**：

```bash
# 查看网络列表
docker network ls

# 查看网络详情
docker inspect bridge | grep Subnet

# 安装网桥管理工具
yum install bridge-utils -y  # CentOS/RHEL
apt install bridge-utils -y   # Debian/Ubuntu

# 查看网桥信息
brctl show

# 查看 docker0 网桥配置
ifconfig docker0
ip addr show docker0

# 查看虚拟网卡
ifconfig | grep veth
ip link show | grep veth
```

---

### 2. Host 模式

```bash
docker run --network=host
```

**特点**：

- 容器直接使用宿主机网络栈
- 无独立网络命名空间
- 无端口映射功能（直接使用宿主机端口）
- 网络性能更高（无 NAT/虚拟化开销）
- 安全性较低（容器直接暴露于主机网络环境）

**实战**：

```bash
# 运行 host 模式容器
docker run -d --network host nginx

# 查看端口（直接使用宿主机端口）
netstat -tunlp | grep :80

# 进入容器查看网络配置（与宿主机一致）
docker exec -it <container> bash
ifconfig
ip addr show
```

---

### 3. Container 模式

```bash
docker run --network=container:<容器名或ID>
```

**特点**：

- 新容器共享指定容器的**网络命名空间**
- **共享 IP 地址和端口**配置
- 各自有独立的文件系统、进程列表
- 适合需要网络共享的应用场景（如 Sidecar 模式）

**实战**：

```bash
# 创建第一个容器并映射端口
docker run -d --name web1 -p 80:80 nginx

# 创建第二个容器，共享 web1 的网络
docker run -d --name web2 --network container:web1 alpine

# 在 web2 中访问 web1 的服务
docker exec -it web2 sh
curl http://localhost

# 测试外部访问
curl http://localhost:80  # 宿主机的 80 端口
```

---

### 4. None 模式

```bash
docker run --network=none
```

**特点**：

- 无网络配置，只有 lo 回环接口
- 需要手动配置网络
- 适用于需要完全自定义网络的场景
- 常用于安全性要求极高的场景

**实战**：

```bash
# 运行 none 模式容器
docker run --network none -it --rm busybox /bin/sh

# 容器内查看网络（只有 lo 接口）
/ # ifconfig
lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0

/ # ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
```

---

### 网络管理命令

```bash
# 网络管理完整命令集
docker network
  connect     Connect a container to a network
  create      Create a network
  disconnect  Disconnect a container from a network
  inspect     Display detailed information on one or more networks
  ls          List networks
  prune       Remove all unused networks
  rm          Remove one or more networks
```

**创建自定义网络示例**：

```bash
# 创建自定义桥接网络
docker network create \
  --driver bridge \
  --subnet 192.168.23.0/24 \
  --gateway 192.168.23.1 \
  test_net

# 使用自定义网络运行容器
docker run -d --name app1 --network test_net alpine sleep 3600

# 查看容器 IP 配置
docker exec app1 ifconfig

# 查看网络详情
docker inspect test_net | grep -A5 "IPAM"
```

---

## 三、Bridge 网络配置与管理

### 1. 修改默认网桥配置

```bash
# 编辑 Docker 配置文件
vi /etc/docker/daemon.json

# 添加或修改以下配置
{
  "bip": "192.168.2.1/24",          # 修改默认网桥 IP 段
  "fixed-cidr": "192.168.2.0/24",   # 固定 IP 范围
  "default-gateway": "192.168.2.1", # 默认网关
  "registry-mirrors": ["https://ms9glx6x.mirror.aliyuncs.com"]
}

# 重启 Docker 服务
systemctl restart docker

# 验证配置
ifconfig docker0
ip addr show docker0
```

---

### 2. 自定义网络

```bash
# 创建自定义桥接网络
docker network create -d bridge \
  --subnet 192.168.55.0/24 \
  --gateway 192.168.55.1 \
  --ip-range 192.168.55.128/25 \
  --label env=prod \
  my_prod_net

# 查看网络详情
docker network inspect my_prod_net

# 使用自定义网络运行容器
docker run -d \
  --name web_app \
  --network my_prod_net \
  --ip 192.168.55.130 \
  nginx:alpine

# 创建第二个容器（自动分配 IP）
docker run -d \
  --name api_app \
  --network my_prod_net \
  python:3.9

# 测试容器间通信
docker exec web_app ping api_app

# 清理网络
docker network rm my_prod_net
```

---

### 3. 容器网络调试技巧

```bash
# 使用 busybox 调试网络
docker run -it --rm --name net_tool busybox /bin/sh

# 容器内常用网络命令：
# ifconfig      # 查看网络接口
# route -n      # 查看路由表
# ping <host>   # 测试连通性
# traceroute <host> # 跟踪路由
# nslookup <domain> # DNS 查询

# 提取容器 IP 地址的多种方法

# 方法 1：使用 inspect 命令
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <容器名>

# 方法 2：查看所有容器 IP
docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)

# 方法 3：使用 jq 解析（需要安装 jq）
docker inspect <容器名> | jq -r '.[0].NetworkSettings.Networks[].IPAddress'

# 方法 4：简化的 ip 命令
docker inspect <容器名> | grep IPAddress
```

---

### 4. Bash 函数简化操作

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
function docker_ip() {
    # 获取单个容器的 IP 地址
    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$1" 2>/dev/null || echo "容器不存在或未运行"
}

function docker_ips() {
    # 列出所有运行中容器的名称和 IP
    docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)
}

function docker_net_info() {
    # 查看容器详细网络信息
    docker inspect "$1" | grep -A 20 "NetworkSettings"
}

# 重新加载配置
source ~/.bashrc

# 使用示例
docker_ip web_app
docker_ips
```

---

## 四、端口映射与防火墙

### 1. 端口映射

```bash
# 基本端口映射
docker run -d -p 8080:80 nginx  # 宿主机 8080 -> 容器 80

# 指定宿主机 IP
docker run -d -p 127.0.0.1:8080:80 nginx  # 仅本地访问

# 随机端口映射
docker run -d -p 80 nginx  # Docker 分配随机宿主机端口
docker port <容器名>        # 查看映射的端口

# 映射多个端口
docker run -d -p 8080:80 -p 8443:443 nginx

# 映射 UDP 端口
docker run -d -p 53:53/udp dns_server

# 查看端口映射
docker ps  # 查看 PORTS 列
docker port <容器名>
```

---

### 2. iptables 规则管理

```bash
# 查看 Docker 创建的 iptables 规则
iptables -t nat -L -n  # 查看 NAT 表
iptables -L -n         # 查看 filter 表

# 查看 DOCKER 链的规则
iptables -t nat -L DOCKER
iptables -L DOCKER

# 查看特定端口映射规则
iptables -t nat -L -n | grep :8080
```

---

## 五、容器访问控制

### 1. 容器访问外部网络

```bash
# 永久开启 IP 转发
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p

# 查看当前设置
sysctl net.ipv4.ip_forward

# Docker 服务配置（daemon.json）
{
  "ip-forward": true,
  "iptables": true
}
```

---

### 2. 容器间通信控制

```bash
# 禁用容器间通信（通过默认网桥）
dockerd --icc=false

# 查看当前 icc 设置
ps aux | grep dockerd | grep icc

# 允许特定容器间通信
# 1. 创建自定义网络
docker network create app_network

# 2. 将需要通信的容器加入同一网络
docker run -d --name app1 --network app_network nginx
docker run -d --name app2 --network app_network redis

# 3. 其他容器使用默认网络，无法与 app1/app2 通信
```

---

## 六、实用命令总结

### 网络管理命令

```bash
# 网络列表与详情
docker network ls                    # 列出所有网络
docker network inspect bridge        # 查看指定网络详情
docker network prune                 # 清理未使用网络

# 网络创建与删除
docker network create mynet          # 创建网络
docker network rm mynet              # 删除网络

# 容器网络操作
docker network connect mynet 容器名    # 连接容器到网络
docker network disconnect mynet 容器名 # 断开网络连接

# 端口操作
docker port 容器名                   # 查看容器端口映射
```

---

### 系统网络诊断

```bash
# 网桥管理
brctl show                          # 查看网桥信息
bridge link                         # 查看桥接接口

# 网络接口
ip addr show                        # 查看所有网络接口
ip link show                        # 查看链接状态

# 路由与连接
route -n                            # 查看路由表
netstat -tunlp                      # 查看端口监听
ss -tunlp                           # 更快的替代方案

# 容器网络工具
docker exec 容器名 netstat -tunlp    # 查看容器内端口
docker exec 容器名 ping google.com   # 测试容器网络
```

---

## 七、网络模式选择建议

| 模式 | 适用场景 | 优点 | 缺点 |
| :--- | :--- | :--- | :--- |
| **Bridge** | 大多数应用场景 | 隔离性好，支持端口映射 | NAT 带来性能开销 |
| **Host** | 高性能需求应用 | 无 NAT 开销，性能最佳 | 安全性低，端口冲突 |
| **Container** | 网络共享需求 | 共享网络配置，减少开销 | 依赖其他容器 |
| **None** | 完全自定义网络 | 最大灵活性 | 需要手动配置 |
| **自定义网络** | 复杂应用架构 | 灵活的网络策略 | 配置相对复杂 |

---

### 选择指南

1. **默认场景**：使用 Bridge 模式，适合 Web 应用、数据库等大多数服务
2. **性能敏感**：使用 Host 模式，适合网络 IO 密集型应用
3. **微服务架构**：创建自定义网络，实现服务隔离与发现
4. **安全隔离**：None 模式 + 自定义配置，适合金融、安全敏感应用
5. **Sidecar 模式**：Container 模式，共享主容器的网络命名空间

---

### 最佳实践

- 生产环境建议使用自定义网络而非默认 bridge
- 为不同的应用环境（dev/test/prod）创建独立网络
- 使用网络标签（label）进行网络分类管理
- 定期清理未使用的网络资源
- 监控容器网络性能，适时调整网络模式
