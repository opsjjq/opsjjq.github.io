## 一、SSH 概述与基础原理

### 1. SSH 是什么？

- **SSH (Secure Shell)**：安全外壳协议，用于计算机之间的加密登录
- **协议特点**：所有传输数据加密，即使被截获也无法解密
- **默认端口**：22 (TCP协议)

### 2. SSH 客户端工具

| 分类 | 工具 |
| :--- | :--- |
| Windows | MobaXterm、Xshell、Termius、PuTTY、Finalshell |
| Linux | 自带 `ssh` 命令 |
| 跨平台 | Windows Terminal |

### 3. 为什么需要 SSH？

| 协议    | 安全性 | 数据加密 | 推荐度 |
| :------ | :----- | :------- | :----- |
| **SSH** | 高     | 全程加密 | ★★★★★ |
| Telnet  | 低     | 明文传输 | ☆☆☆☆☆ |
| FTP     | 低     | 明文传输 | ☆☆☆☆☆ |

---

## 二、Telnet 不安全登录演示

### 1. Telnet 服务端配置

```sh
yum install telnet-server telnet -y
systemctl start telnet.socket
netstat -tunlp | grep :23
```

### 2. Telnet 客户端连接

```sh
telnet 10.0.0.61
```

### 3. 安全风险演示

使用 Wireshark 抓包工具可轻易捕获：

- 用户名、密码明文
- 所有操作命令明文
- 传输数据无加密

---

## 三、SSH 密码认证原理

### 1. 加密算法对比

| 算法类型 | 特点 | 优点 | 缺点 | 应用场景 |
| :------- | :--- | :--- | :--- | :------- |
| **对称加密 (DES)** | 加密解密使用同一密钥 | 速度快、效率高 | 密钥分发困难，易泄露 | 本地数据加密 |
| **非对称加密 (RSA)** | 公钥加密，私钥解密 | 安全性高，无需传输私钥 | 速度慢，计算复杂 | SSH认证、SSL证书 |

### 2. SSH 密码认证流程

```text
客户端连接请求 → 服务端
             ← 发送公钥 ←
客户端使用公钥加密密码 → 
             ← 使用私钥解密验证 ←
             ← 登录成功/失败 ←
```

### 3. 关键文件与命令

#### 服务端公钥文件

```sh
ls /etc/ssh/ssh_host_*
# ssh_host_ecdsa_key      # 私钥
# ssh_host_ecdsa_key.pub  # 公钥
```

#### 客户端已知主机记录

```sh
cat ~/.ssh/known_hosts
# 格式：IP 算法 公钥
```

#### 获取远程主机公钥

```sh
ssh-keyscan 10.0.0.61
cat /etc/ssh/ssh_host_ecdsa_key.pub
```

### 4. 主机指纹验证

```sh
ssh-keygen -E SHA256 -lf /etc/ssh/ssh_host_ecdsa_key.pub
```

首次连接时验证提示：
```text
The authenticity of host '10.0.0.61 (10.0.0.61)' can't be established.
ECDSA key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxx
Are you sure you want to continue connecting (yes/no)?
```

---

## 四、SSH 服务部署与安全配置

### 1. 基础安装与检查

```sh
rpm -qa openssh openssh-server
yum install openssh-server openssh -y
systemctl status sshd
```

### 2. 安全配置建议

#### 配置文件：`/etc/ssh/sshd_config`

```sh
Port 22999                          # 1. 修改默认端口（防止暴力扫描）
PermitRootLogin no                  # 2. 禁用 root 直接登录（重要！）
PubkeyAuthentication yes            # 3. 启用公钥认证
PasswordAuthentication no            # 4. 禁用密码认证
AllowUsers bob01 admin@10.0.0.0/24  # 5. 限制用户访问
```

#### 创建普通用户用于登录

```sh
useradd bob01
echo "随机密码" | passwd --stdin bob01
pwgen -s 12 1  # 生成 12 位随机密码
```

### 3. 服务管理

```sh
systemctl restart sshd              # 重启服务使配置生效
netstat -tunlp | grep sshd         # 查看新端口监听
systemctl enable sshd              # 设置开机自启
```

### 4. 恢复默认配置

```sh
sed -i.bak \
  -e 's/^Port 22999/Port 22/' \
  -e 's/^PermitRootLogin no/PermitRootLogin yes/' \
  /etc/ssh/sshd_config
systemctl restart sshd
```

---

## 五、SSH 密钥认证与免密登录

### 1. 生成密钥对

```sh
ssh-keygen -t rsa -N '' -f ~/.ssh/id_rsa
# -t rsa        # 指定算法
# -N ''         # 空密码
# -f ~/.ssh/id_rsa  # 指定文件路径
```

### 2. 分发公钥

#### 方法一：使用 ssh-copy-id

```sh
ssh-copy-id root@10.0.0.7
```

#### 方法二：手动分发

```sh
ssh root@10.0.0.7 "mkdir -p ~/.ssh && chmod 700 ~/.ssh"
cat ~/.ssh/id_rsa.pub | ssh root@10.0.0.7 "cat >> ~/.ssh/authorized_keys"
ssh root@10.0.0.7 "chmod 600 ~/.ssh/authorized_keys"
```

### 3. 验证免密登录

```sh
ssh root@10.0.0.7 "hostname && uptime"
```

---

## 六、SSH 批量分发与管理

### 1. 批量生成密钥

```sh
for i in 7 8 41; do
  ssh-keygen -t rsa -N '' -f ~/.ssh/id_rsa_${i} -q
done
```

### 2. 批量分发公钥

```sh
for i in 7 8 41; do
  ssh-copy-id -i ~/.ssh/id_rsa_${i}.pub root@10.0.0.${i}
done
```

### 3. SSH 批量执行命令

```sh
for i in 7 8 41; do
  echo "=== 10.0.0.${i} ==="
  ssh root@10.0.0.${i} "hostnamectl | grep hostname"
done
```

---

## 七、SSH 配置文件详解

### 1. 服务端配置

```sh
vim /etc/ssh/sshd_config
```

| 配置项 | 默认值 | 推荐值 | 说明 |
| :----- | :----- | :----- | :--- |
| Port | 22 | 22999 | 修改默认端口 |
| PermitRootLogin | yes | no | 禁止 root 登录 |
| PubkeyAuthentication | yes | yes | 启用公钥认证 |
| PasswordAuthentication | yes | no | 禁用密码认证 |
| MaxAuthTries | 6 | 3 | 最大认证次数 |
| ClientAliveInterval | 0 | 300 | 客户端存活检测 |
| ClientAliveCountMax | 3 | 2 | 存活检测次数 |

### 2. 客户端配置

```sh
vim ~/.ssh/config
```

```ssh
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking ask
    
Host web*
    HostName 10.0.0.{7,8,41}
    User root
    
Host db
    HostName 10.0.0.51
    User mysql
    Port 2222
```

### 3. 权限要求

| 文件/目录 | 权限要求 |
| :-------- | :------- |
| ~/.ssh/ | 700 |
| ~/.ssh/id_rsa | 600 |
| ~/.ssh/id_rsa.pub | 644 |
| ~/.ssh/authorized_keys | 600 |
| ~/.ssh/config | 600 |

---

## 八、SSH 常见问题排查

### 1. 连接被拒绝

```sh
# 检查服务是否运行
systemctl status sshd

# 检查端口是否监听
netstat -tunlp | grep ssh

# 检查防火墙规则
firewall-cmd --list-all
iptables -L -n
```

### 2. 密钥认证失败

```sh
# 检查权限
ls -la ~/.ssh/

# 检查服务端日志
tail -f /var/log/secure

# 检查 SELinux
setenforce 0
```

### 3. 连接超时

```sh
# 检查网络连通性
ping 10.0.0.7

# 检查路由
traceroute 10.0.0.7

# 检查 DNS
nslookup 10.0.0.7
```

---

## 九、SSH 安全加固最佳实践

### 1. 网络层面

```sh
# 使用防火墙限制来源IP
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="10.0.0.0/24" service name="ssh" accept'

# 使用 TCP Wrapper
echo "sshd: 10.0.0.0/24" >> /etc/hosts.allow
echo "sshd: ALL" >> /etc/hosts.deny
```

### 2. 应用层面

```sh
# 限制登录时间
AllowUsers admin@10.0.0.* Mon-Fri 09:00-18:00

# 启用双因素认证
# 安装 Google Authenticator
yum install google-authenticator -y
google-authenticator
```

### 3. 监控层面

```sh
# 监控失败登录
tail -f /var/log/secure | grep 'Failed password'

# 使用 fail2ban 自动封禁
yum install fail2ban -y
systemctl enable fail2ban
```

---

## 十、SSH 隧道与端口转发

### 1. 本地端口转发

```sh
# 将远程服务器的 3306 端口映射到本地 3307
ssh -L 3307:localhost:3306 root@10.0.0.51 -N -f
```

### 2. 远程端口转发

```sh
# 将内网服务器的 8080 端口映射到外网
ssh -R 8080:localhost:80 root@外网IP -N -f
```

### 3. 动态端口转发（SOCKS5 代理）

```sh
# 创建 SOCKS5 代理
ssh -D 1080 -N -f root@10.0.0.7
```

### 4. 跳板机连接

```sh
# 使用 SSH 跳板机连接内网服务器
ssh -J jump@10.0.0.61 root@10.0.0.51

# 配置 ~/.ssh/config
Host internal-server
    HostName 10.0.0.51
    User root
    ProxyJump jump@10.0.0.61
```

------

## 五、SSH 公钥认证（免密登录）

### 1. 公钥认证原理

```
客户端生成密钥对 → 公钥上传至服务端 → 登录时使用私钥签名
      ↓                           ↓
  私钥本地保存         公钥存入authorized_keys
```

### 2. 配置步骤

#### 第一步：生成密钥对

```
# 客户端执行（如master-61）
ssh-keygen -t rsa -N '' -f ~/.ssh/id_rsa

# 查看生成的密钥
ls ~/.ssh/
# id_rsa      # 私钥（绝密！）
# id_rsa.pub  # 公钥（可公开）
```

#### 第二步：分发公钥到目标主机

```
# 方法1：使用ssh-copy-id（推荐）
ssh-copy-id root@10.0.0.7

# 方法2：手动复制
cat ~/.ssh/id_rsa.pub | ssh root@10.0.0.7 \
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

#### 第三步：验证免密登录

```
# 客户端连接目标主机（无需密码）
ssh root@10.0.0.7
```

### 3. 服务端关键文件

```
# 查看授权的公钥
cat ~/.ssh/authorized_keys
# 每行一个公钥，格式：算法 公钥内容 注释
```

------

## 六、SSH 高级应用

### 1. 远程执行命令

```
# 基本语法：ssh user@host "command"

# 查看远程主机信息
ssh root@10.0.0.7 "hostname"
ssh root@10.0.0.7 "free -m"

# 远程文件操作
ssh root@10.0.0.7 "touch /tmp/test.txt"

# 远程软件管理
ssh root@10.0.0.7 "yum install redis -y"
ssh root@10.0.7 "systemctl status nginx"

# 执行多行命令
ssh root@10.0.0.7 << 'EOF'
  echo "开始操作..."
  date
  whoami
EOF
```

### 2. 批量管理多台主机

```
# 配置master-61免密登录多台机器
for host in 10.0.0.7 10.0.0.8 10.0.1.31 10.0.1.41; do
  ssh-copy-id root@$host
done
```

------

## 七、SSH 安全加固实战

### 1. 强化安全配置

```
# 编辑SSH服务端配置
vim /etc/ssh/sshd_config

# 关键安全设置
Port 22999                    # 修改默认端口
PermitRootLogin no            # 禁止root直接登录
PubkeyAuthentication yes      # 启用公钥认证
PasswordAuthentication no     # 禁用密码认证（必须先配置公钥）
AllowUsers bob01 admin@10.0.0.0/24  # 限制用户和IP
MaxAuthTries 3                # 最大尝试次数
ClientAliveInterval 300       # 客户端超时设置
ClientAliveCountMax 2

# 重启生效
systemctl restart sshd
```

### 2. 防火墙限制访问

```
# 只允许特定IP访问SSH端口
# 假设只允许172.16.1.61（跳板机）访问

# 清除现有规则（谨慎操作）
iptables -F

# 设置默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许特定IP访问SSH端口
iptables -A INPUT -s 172.16.1.61 -p tcp --dport 22999 -j ACCEPT

# 保存规则
service iptables save
systemctl restart iptables

# 查看规则
iptables -L -n
```

### 3. 故障排查命令

```
# 1. 检查服务状态
systemctl status sshd

# 2. 查看日志
tail -f /var/log/secure
journalctl -u sshd

# 3. 测试连接（指定端口）
ssh -v -p 22999 user@host
# -v：详细模式，显示连接过程

# 4. 检查配置文件语法
sshd -t

# 5. 临时重启服务调试
systemctl reload sshd  # 不中断现有连接
systemctl restart sshd # 重启服务
```

### 4. 密钥管理最佳实践

```
# 1. 为不同服务使用不同密钥
ssh-keygen -t rsa -f ~/.ssh/id_rsa_github -C "github@email"
ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitlab -C "gitlab@email"

# 2. 配置~/.ssh/config简化连接
cat >> ~/.ssh/config << EOF
Host web7
    HostName 10.0.0.7
    Port 22999
    User root
    IdentityFile ~/.ssh/id_rsa_web7

Host jump
    HostName 172.16.1.61
    Port 22
    User admin
    IdentityFile ~/.ssh/id_rsa_jump
EOF

# 3. 使用简化命令
ssh web7  # 替代 ssh -p 22999 root@10.0.0.7
```

------

## 八、配置文件总结

### SSH 认证涉及的关键文件

#### 服务端 (`/etc/ssh/`)

```
sshd_config           # SSH服务主配置文件
ssh_host_*_key        # 主机私钥（保密）
ssh_host_*_key.pub    # 主机公钥（公开）
```



#### 客户端 (`~/.ssh/`)

```
known_hosts           # 记录已验证的服务端公钥
id_rsa                # 客户端私钥（绝密！）
id_rsa.pub            # 客户端公钥（可分发）
authorized_keys       # 存储允许登录的公钥列表
config                # SSH客户端配置（简化连接）
```

### 常用命令速查

```sh
# 密钥管理
ssh-keygen            # 生成密钥对
ssh-copy-id           # 分发公钥
ssh-keyscan           # 获取远程主机公钥

# 连接测试
ssh -v                # 详细模式连接
ssh -p PORT           # 指定端口连接
ssh -i KEYFILE        # 指定私钥文件

# 服务管理
systemctl status/start/stop/restart sshd
sshd -t               # 测试配置语法

# 信息查看
netstat -tunlp | grep ssh
ps aux | grep sshd
```