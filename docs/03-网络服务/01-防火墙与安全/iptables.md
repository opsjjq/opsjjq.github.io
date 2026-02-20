# iptables 原理与命令指南

## 一、服务器防火墙介绍

服务器防火墙是位于网络与服务器之间的安全屏障，用于控制进出服务器的数据流量，保障系统安全。防火墙对流经它的网络通信进行扫描，从而过滤掉一些攻击，避免其在目标计算机上被执行。它还能关闭不使用的端口，禁止特定端口的流出通信，以及阻止来自不明站点的访问。

```bash
防火墙一般分为硬件防火墙和软件防火墙：
硬件防火墙：在硬件级别实现部分防火墙功能，另一部分基于软件实现，性能高，成本也高。
软件防火墙：运行于通用硬件平台上的应用软件，性能较低，成本也较低。
```

---

## 二、软件防火墙介绍

1. 系统底层实现流量控制、数据包过滤的模块是 **netfilter**。
2. 用户通过 **iptables** 命令修改规则，实现对网络行为的控制。

---

## 三、iptables 介绍

iptables 是 Linux 系统上基于 netfilter 框架的用户态防火墙工具，提供规则配置接口，实现数据包过滤、网络地址转换（NAT）等功能。

### 使用场景

软件防火墙主要工作在 **网络层（L3）** 和 **传输层（L4）**，部分高级防火墙可扩展至 **应用层（L7）**。

```text
开源的基于数据包过滤的防火墙工具，常见用途包括：

1. 主机防火墙（filter 表的 INPUT 链）
2. 局域网共享上网（nat 表的 POSTROUTING 链）
3. 端口及 IP 映射（nat 表的 PREROUTING 链）
4. IP 一对一映射
```

---

## 四、iptables 工作流程

iptables 采用数据包过滤机制工作，对请求的数据包头部数据进行分析，并根据预先设定的规则进行匹配，决定是否允许进入主机。数据包经过防火墙时会依次经过不同的 **链（Chain）**，每个链中包含一系列 **规则（Rule）**，按顺序匹配并执行相应动作。

```bash
工作流程特点：
1. 防火墙按配置规则的顺序从上到下、从前到后过滤。
2. 若匹配上规则，则立即执行阻止或允许动作，不再继续匹配后续规则。
3. 若所有规则均未匹配，则继续向下匹配，直到匹配默认规则。
4. 默认规则在该链的所有规则执行完毕后才会执行。
```

---

## 五、四表五链

### 四表（Tables）

| 表名   | 作用                          |
| :----- | :---------------------------- |
| filter | 数据包过滤（默认表）          |
| nat    | 网络地址转换                  |
| mangle | 修改数据包内容（如 TTL、TOS） |
| raw    | 数据包跟踪前处理              |

### 五链（Chains）

| 链名            | 作用                        |
| :-------------- | :-------------------------- |
| **INPUT**       | 进入本机的数据包            |
| **OUTPUT**      | 从本机发出的数据包          |
| **FORWARD**     | 经过本机转发的数据包        |
| **PREROUTING**  | 路由前处理（主要用于 DNAT） |
| **POSTROUTING** | 路由后处理（主要用于 SNAT） |

### 什么是 netfilter？

netfilter 是 Linux 内核中的一个软件框架，用于管理网络数据包。它不仅具备网络地址转换功能，还支持数据包内容修改、数据包过滤等防火墙功能。netfilter 定义了五个链来决定数据包的流向与处理方式：

- **PREROUTING** 链 —— 路由前
- **INPUT** 链 —— 本地上送
- **OUTPUT** 链 —— 本地发送
- **FORWARD** 链 —— 转发
- **POSTROUTING** 链 —— 路由后

这些链决定了数据包是被接受（ACCEPT）还是丢弃（DROP）。

### 表与链的对应关系

| 表     | 可用的链                        |
| :----- | :------------------------------ |
| filter | INPUT、OUTPUT、FORWARD          |
| nat    | PREROUTING、OUTPUT、POSTROUTING |
| mangle | 所有五链                        |
| raw    | PREROUTING、OUTPUT              |

```bash
链的执行时机与用途：

1. PREROUTING 链
   时机：数据包进入网卡，路由决策之前
   用途：DNAT、连接跟踪、数据包标记
   适用表：raw, mangle, nat

2. INPUT 链
   时机：路由决策后，目标为本机
   用途：过滤进入本机的流量
   适用表：mangle, filter

3. FORWARD 链
   时机：路由决策后，需要转发的数据包
   用途：控制经过本机转发的流量
   适用表：mangle, filter

4. OUTPUT 链
   时机：本机进程发出的数据包
   用途：控制本机发出的流量
   适用表：raw, mangle, nat, filter

5. POSTROUTING 链
   时机：所有数据包发送到网卡之前
   用途：SNAT、伪装（Masquerading）
   适用表：mangle, nat
```

---

## 六、数据包在防火墙中的完整历程

### 1. 数据包流向图

```text
外部网络 → 网卡接收 → PREROUTING链 → 路由决策
                                       ↓
                          目标为本机？     目标为其他主机？
                                ↓                  ↓
                           INPUT链             FORWARD链
                                ↓                  ↓
                         本地进程处理         POSTROUTING链
                                ↓                  ↓
                          OUTPUT链               网卡发送
                                ↓                  ↓
                          POSTROUTING链         外部网络
                                ↓
                            网卡发送
```

```bash
入站数据包：数据包进入网卡后，先经 PREROUTING 链。若目标为本机，则进入 INPUT 链，最终交给本机应用程序处理。

出站数据包：本机生成的数据包先经 OUTPUT 链，路由后进入 POSTROUTING 链，最后发送到目标。

转发数据包：非本机目标的数据包经 PREROUTING 链后，进入 FORWARD 链，最后通过 POSTROUTING 链发送到目标。
```

### 2. 详细流程解析

#### 阶段一：数据包进入（Ingress）

```text
1. 数据包到达网卡
2. 经过 PREROUTING 链（所有表均可处理）
   - raw 表：决定是否进行连接跟踪
   - mangle 表：修改数据包（如 TTL）
   - nat 表：DNAT（目标地址转换）
3. 路由决策：判断数据包是发给本机还是需要转发
```

#### 阶段二：本地处理（Local Process）

```text
如果目标为本机：
1. 经过 INPUT 链
   - mangle 表：修改数据包
   - filter 表：决定是否接受（ACCEPT/DROP/REJECT）
2. 交给上层协议栈（TCP/UDP）
3. 应用程序接收处理
```

#### 阶段三：转发处理（Forward）

```text
如果需要转发到其他主机：
1. 经过 FORWARD 链
   - mangle 表：修改数据包
   - filter 表：决定是否允许转发
2. 继续流向 POSTROUTING 链
```

#### 阶段四：数据包发出（Egress）

```text
本地产生或转发数据包的出口：
1. 本地进程产生数据包 → OUTPUT 链
   - raw 表：连接跟踪处理
   - mangle 表：修改数据包
   - nat 表：处理本地产生的数据包的 NAT
   - filter 表：决定是否允许发出

2. 经过 POSTROUTING 链（所有出口数据包必经）
   - mangle 表：最后修改机会
   - nat 表：SNAT（源地址转换）
3. 发送到网卡 → 外部网络
```

### 匹配规则后的动作

```bash
防火墙对匹配规则的流量执行以下动作之一：

ACCEPT  允许数据包通过
REJECT  拒绝数据包通过，并返回拒绝响应
DROP    直接丢弃数据包，不回应
LOG     在 /var/log/message 中记录日志，然后传递给下一条规则
SNAT    源地址转换，用于内网共享公网 IP
DNAT    目标地址转换
REDIRECT 在本机做端口映射
```

### 开启内核转发

```bash
# 临时开启
echo 1 > /proc/sys/net/ipv4/ip_forward

# 永久开启
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
```

---

## 七、iptables 命令实战

### 1. 基本命令与参数

```bash
常用参数说明：
-L  显示所选链的所有规则
-n  以数字形式显示 IP 和端口
-t  指定表（如 filter、nat）
-A  在链末尾追加规则
-I  在链开头插入规则
-D  删除规则
-F  清空所有规则
-p  指定协议（tcp、udp、icmp、all）
--dport  目标端口
--sport  源端口
-s  源 IP
-d  目标 IP
-m  指定模块（如 multiport）
-i  指定输入网卡
-o  指定输出网卡
-j  执行动作（ACCEPT、DROP、REJECT 等）
-X  删除用户自定义链
-Z  计数器清零
```

#### 查看规则

```bash
iptables -nL               # 查看所有链规则，数字格式显示
iptables -nL --line-numbers # 显示规则及行号
```

#### 清空规则

```bash
iptables -F   # 删除所有规则
iptables -X   # 删除用户自定义链
iptables -Z   # 计数器清零
```

#### 设置默认策略

```bash
iptables -P INPUT ACCEPT   # 设置 INPUT 链默认允许
iptables -P INPUT DROP     # 设置 INPUT 链默认拒绝
```

### 2. 实战规则配置

#### 禁止特定 IP 访问

```bash
# 禁止 10.0.0.51 ping 本机
iptables -A INPUT -p icmp -s 10.0.0.51 -j DROP

# 禁止 172.16.1.0/24 网段访问 22 端口
iptables -A INPUT -s 172.16.1.0/24 -p tcp --dport 22 -j DROP
```

#### 端口控制

```bash
# 禁止特定 IP 访问 22 端口
iptables -I INPUT -s 172.16.1.51 -p tcp --dport 22 -j DROP

# 使用 multiport 模块控制多个端口
iptables -I INPUT -m multiport -s 10.0.0.52 -p tcp --dport 80,22 -j DROP
```

#### 网卡限制

```bash
# 禁止 172.16.1.51 通过 eth1 访问 80 端口
iptables -I INPUT -i eth1 -s 172.16.1.51 -p tcp --dport 80 -j DROP

# 禁止任何 IP 通过 eth0 访问 22 端口
iptables -I INPUT -i eth0 -p tcp --dport 22 -j DROP

# 允许所有 IP 通过 eth0 访问 80 端口
iptables -A INPUT -i eth0 -p tcp --dport 80 -j ACCEPT
```

#### 取反符号使用

```bash
# 只允许 172.16.1.0/24 网段访问 80 端口，其他一律拒绝
iptables -I INPUT ! -s 172.16.1.0/24 -p tcp --dport 80 -j DROP
```

#### 跳板机配置

```bash
# 只允许跳板机 10.0.0.51 访问 SSH
iptables -I INPUT ! -s 10.0.0.51 -p tcp --dport 22 -j DROP
```

### 3. 高级应用场景

#### Web 服务器防火墙配置

```bash
# 清空现有规则
iptables -F
iptables -X
iptables -Z

# 允许 HTTP/HTTPS
iptables -A INPUT -p tcp -m multiport --dport 80,443 -j ACCEPT

# 允许 SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许内网访问
iptables -A INPUT -s 10.0.0.0/24 -j ACCEPT
iptables -A INPUT -s 172.16.1.0/24 -j ACCEPT

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT

# 设置默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
```

#### SNAT 共享上网

```bash
# 开启 IP 转发
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p

# 配置 SNAT，内网 172.16.1.0/24 通过 10.0.0.7 上网
iptables -t nat -A POSTROUTING -s 172.16.1.0/24 -j SNAT --to-source 10.0.0.7

# 内网机器设置网关为 172.16.1.7
route add default gw 172.16.1.7
# 或修改网卡配置：GATEWAY=172.16.1.7
```

#### DNAT 端口映射

```bash
# 将外网 20022 端口映射到内网 172.16.1.61 的 22 端口
iptables -t nat -A PREROUTING -d 10.0.0.7 -p tcp --dport 20022 -j DNAT --to-destination 172.16.1.61:22

# 将 17788 端口映射到本机 80 端口
iptables -t nat -A PREROUTING -d 10.0.0.7 -p tcp --dport 17788 -j DNAT --to-destination 10.0.0.7:80

# 删除映射规则
iptables -t nat -D PREROUTING -d 10.0.0.7 -p tcp --dport 17788 -j DNAT --to-destination 10.0.0.7:80
```

### 4. 规则管理

#### 保存与恢复规则

```bash
# 保存规则到文件
iptables-save > /opt/iptables_rules.txt

# 从文件恢复规则
iptables-restore < /opt/iptables_rules.txt
```

#### 服务管理

```bash
# 禁用 firewalld
systemctl stop firewalld
systemctl disable firewalld

# 启用 iptables 服务
yum install iptables-services -y
systemctl start iptables
systemctl enable iptables
```

#### 加载内核模块

```bash
modprobe ip_tables
modprobe iptable_filter
modprobe iptable_nat
modprobe ip_conntrack
modprobe ip_conntrack_ftp
modprobe ip_nat_ftp
modprobe ipt_state
```

---

## 八、总结

iptables是Linux系统上强大的防火墙工具，通过配置四表五链的规则，可以实现数据包过滤、网络地址转换等功能。掌握iptables的工作原理和常用命令，可以有效地保护服务器安全，实现网络访问控制。

> 下一步：学习更多运维技术，构建完整的运维知识体系。
