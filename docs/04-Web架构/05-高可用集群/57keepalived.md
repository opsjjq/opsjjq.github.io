# Keepalived 高可用集群部署指南

---

## 一、为什么需要 Keepalived？

### 1. 负载均衡单点故障问题

- 传统负载均衡器（如 SLB5）是单点，一旦故障整个网站瘫痪
- 需要高可用（HA）解决方案确保入口服务不中断

### 2. Keepalived 解决方案

- 创建虚拟 IP（VIP）在多个 LB 服务器间漂移
- 实现负载均衡器的高可用性

---

## 二、Keepalived 工作原理

### 1. VRRP 协议基础

- VRRP：虚拟路由冗余协议（Virtual Router Redundancy Protocol）
- 解决静态路由的单点故障问题
- 通过竞选协议将路由任务交给某一台 VRRP 路由器

### 2. 工作流程

```text
1. Master 节点优先获得 VIP 资源
2. Master 持续发送 VRRP 广播包（心跳）
3. Backup 节点监听心跳包
4. Master 故障时，Backup 接管 VIP（<1秒）
5. Master 恢复后，根据优先级重新接管 VIP
```

### 3. 组播通信机制

- Master/Backup 向组播地址 `224.0.0.18` 发送心跳
- 确保同一组内设备能互相感知状态
- 使用明文密码认证（默认配置）

---

## 三、环境准备与部署

### 1. 网络架构

```text
客户端 → VIP:10.0.0.3 → [LB5(MASTER) / LB6(BACKUP)] → [Web7 / Web8]
```

### 2. 后端 Web 服务器部署（Web7、Web8）

```bash
# 安装 Nginx
yum install nginx -y

# 创建测试页面
echo 'Web7 Service' > /usr/share/nginx/html/index.html
echo 'Web8 Service' > /usr/share/nginx/html/index.html

# 启动服务
systemctl start nginx
```

### 3. 负载均衡器部署（LB5、LB6）

```bash
# 安装 Nginx
yum install nginx -y

# 配置负载均衡
cat > /etc/nginx/conf.d/lb.conf << 'EOF'
upstream web_pools {
    server 10.0.0.7:80;
    server 10.0.0.8:80;
}

server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://web_pools;
        include /etc/nginx/proxy_params;
    }
}
EOF

# 代理参数配置
cat > /etc/nginx/proxy_params << 'EOF'
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_connect_timeout 30;
proxy_send_timeout 60;
proxy_read_timeout 60;
proxy_buffering on;
proxy_buffer_size 32k;
proxy_buffers 4 128k;
EOF

systemctl start nginx
```

---

## 四、Keepalived 配置详解

### 4.1 MASTER 节点配置（LB5）

```bash
# 安装 Keepalived
yum install keepalived -y

# 配置文件
cat > /etc/keepalived/keepalived.conf << 'EOF'
global_defs {
    router_id lb-5
}

vrrp_instance VIP_1 {
    state MASTER
    interface eth0
    virtual_router_id 50
    priority 150
    advert_int 1
    
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    
    virtual_ipaddress {
        10.0.0.3/24
    }
}
EOF

systemctl start keepalived
```

### 4.2 BACKUP 节点配置（LB6）

```bash
# 安装 Keepalived
yum install keepalived -y

# 配置文件
cat > /etc/keepalived/keepalived.conf << 'EOF'
global_defs {
    router_id lb-6
}

vrrp_instance VIP_1 {
    state BACKUP
    interface eth0
    virtual_router_id 50
    priority 100
    advert_int 1
    
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    
    virtual_ipaddress {
        10.0.0.3/24
    }
}
EOF

systemctl start keepalived
```

### 4.3 关键配置参数

| 参数              | 说明                 | MASTER | BACKUP |
| :---------------- | :------------------- | :----- | :----- |
| `router_id`       | 路由唯一标识         | lb-5   | lb-6   |
| `state`           | 节点角色             | MASTER | BACKUP |
| `interface`       | VIP 绑定网卡         | eth0   | eth0   |
| `virtual_router_id` | 虚拟路由 ID（组内一致） | 50     | 50     |
| `priority`        | 优先级（MASTER 更高） | 150    | 100    |
| `auth_pass`       | 认证密码（组内一致） | 1111   | 1111   |

---

## 五、验证与测试

### 5.1 检查 VIP 分配

```bash
# 检查 VIP 是否在 MASTER 节点
ip addr show eth0 | grep "10.0.0.3"

# 测试访问
curl http://10.0.0.3
```

### 5.2 故障模拟

**MASTER 故障模拟**：

```bash
# 在 LB5 停止 Keepalived
systemctl stop keepalived

# 检查 VIP 是否漂移到 LB6
ip addr show eth0 | grep "10.0.0.3"

# 验证服务可用性
curl http://10.0.0.3
```

**MASTER 恢复**：

```bash
# 在 LB5 重启 Keepalived
systemctl start keepalived

# VIP 应自动漂移回 LB5（优先级更高）
```

---

## 六、Keepalived 脑裂问题与解决

### 6.1 什么是脑裂？

- MASTER 和 BACKUP 同时持有 VIP
- 心跳线故障导致双方都认为自己是 MASTER
- 造成 IP 冲突和服务中断

### 6.2 脑裂原因

| 原因             | 说明                 |
| :--------------- | :------------------- |
| 心跳线路故障     | 网线损坏、防火墙阻挡 |
| 网络配置错误     | IP 冲突、路由问题    |
| 配置不一致       | virtual_router_id 不同 |

### 6.3 脑裂检测脚本（BACKUP 节点）

```bash
#!/bin/bash

# 配置 SSH 免密登录（LB6 → LB5）
ssh-keygen -t rsa -N '' -f ~/.ssh/id_rsa
ssh-copy-id root@10.0.0.5

# 检测脚本
MASTER_VIP=$(ssh 10.0.0.5 "ip a | grep 10.0.0.3 | wc -l")
MY_VIP=$(ip a | grep 10.0.0.3 | wc -l)

if [ ${MASTER_VIP} == 1 -a ${MY_VIP} == 1 ]; then
    systemctl stop keepalived
fi
```

### 6.4 Nginx 健康检查脚本（MASTER 节点）

```bash
#!/bin/bash

NGINX_STATUS=$(ps -ef | grep ngin[x] | wc -l)

if [ ${NGINX_STATUS} == 0 ]; then
    systemctl restart nginx
    
    if [ $? == 1 ]; then
        systemctl stop keepalived
    fi
fi
```

### 6.5 配置脚本调用

```bash
cat >> /etc/keepalived/keepalived.conf << 'EOF'

vrrp_script check_nginx {
    script "/etc/keepalived/check_nginx.sh"
    interval 5
}

vrrp_instance VIP_1 {
    track_script {
        check_nginx
    }
}
EOF
```

---

## 七、总结

### 7.1 核心要点

1. **VRRP 协议**：实现路由器故障自动切换
2. **VIP 漂移**：Master 故障时 Backup 自动接管
3. **脑裂防护**：通过脚本检测和处理脑裂情况
4. **健康检查**：确保下游服务正常时 VIP 才生效

### 7.2 部署流程

| 步骤 | 操作                    |
| :--- | :---------------------- |
| 1    | 部署后端 Web 服务        |
| 2    | 配置负载均衡 Nginx       |
| 3    | 安装 Keepalived         |
| 4    | 配置 MASTER 节点         |
| 5    | 配置 BACKUP 节点         |
| 6    | 配置健康检查脚本         |
| 7    | 测试故障切换             |

### 7.3 注意事项

- Master 和 Backup 的 virtual_router_id 必须一致
- 认证密码 auth_pass 必须相同
- priority 值高的节点会成为 Master
- 生产环境必须配置脑裂检测机制
