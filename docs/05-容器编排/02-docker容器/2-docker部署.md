# Docker 安装部署指南

## 一、安装前准备

### 配置内核参数（必需）

```bash
# 创建配置文件
cat > /etc/sysctl.d/docker.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

# 加载内核模块
modprobe br_netfilter

# 应用配置
sysctl -p /etc/sysctl.d/docker.conf
```

**作用说明**：

- `net.ipv4.ip_forward=1`：允许流量转发（Docker 网络必需）
- `net.bridge.bridge-nf-call-*`：让 iptables 规则作用于网桥流量

---

## 二、Docker 安装流程（两种源可选）

### 方案一：使用清华源（推荐国内）

```bash
# 1. 卸载旧版本
yum remove docker docker-common docker-selinux docker-engine -y

# 2. 安装依赖
yum install yum-utils device-mapper-persistent-data lvm2 -y

# 3. 下载官方 repo 文件
wget -O /etc/yum.repos.d/docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo

# 4. 替换为清华源
sed -i 's#download.docker.com#mirrors.tuna.tsinghua.edu.cn/docker-ce#g' /etc/yum.repos.d/docker-ce.repo

# 5. 安装
yum makecache fast
yum install docker-ce -y
```

---

### 方案二：使用阿里源

```bash
# 1. 配置阿里云 yum 源
curl -o /etc/yum.repos.d/Centos-7.repo http://mirrors.aliyun.com/repo/Centos-7.repo

# 2. 下载 docker-ce repo
curl -o /etc/yum.repos.d/docker-ce.repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 3. 清理缓存并安装
yum clean all && yum makecache
yum install docker-ce -y
```

---

### 查看可用版本

```bash
# 查看所有可用版本
yum list docker-ce --showduplicates | sort -r
```

---

## 三、配置镜像加速器（国内环境必需）

### 配置镜像加速

登录 [阿里云容器镜像服务](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors) 获取镜像加速器地址。

```bash
# 创建配置目录
mkdir -p /etc/docker

# 配置加速地址
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.m.ixdev.cn",
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me"
  ]
}
EOF

# 重新加载并重启 Docker
systemctl daemon-reload
systemctl restart docker
```

---

### 批量测试镜像站连通性

```bash
cat > /opt/qwe.sh << 'EOF'
#!/bin/bash

MIRRORS=(
    "https://docker.registry.cyou"
    "https://docker-cf.registry.cyou"
    "https://mirror.aliyuncs.com"
    "https://mirror.baidubce.com"
    "https://docker.m.daocloud.io"
    "https://docker.nju.edu.cn"
    "https://fpu73b7s.mirror.aliyuncs.com"
    "https://docker.mirrors.sjtug.sjtu.edu.cn"
    "https://docker.mirrors.ustc.edu.cn"
    "https://mirror.iscas.ac.cn"
    "https://docker.rainbond.cc"
)

echo "正在测试 Docker 镜像站连通性..."
echo "======================================"

for url in "${MIRRORS[@]}"; do
    domain=$(echo $url | sed 's|https://||')
    echo -n "测试 $domain ... "

    # 测试 DNS 解析
    if nslookup "$domain" &>/dev/null; then
        echo -n "DNS✓ "
    else
        echo "DNS✗"
        continue
    fi

    # 测试 HTTPS 连接
    if curl --max-time 10 --silent --head "$url" &>/dev/null; then
        echo "HTTPS✓"
    else
        echo "HTTPS✗"
    fi
done

echo "======================================"
echo "测试完成！"
EOF

chmod +x /opt/qwe.sh
bash /opt/qwe.sh
```

---

## 四、代理加速配置（可选）

### clash应用配置

应用目录--配置文件

```bash
allow-lan: true
bind-address: '*'
```

---

### 虚拟机内配置

NAT网络

拥有10.0.0.*网段内IP

然后代理到主机10.0.0.1的对应端口

```bash
vim /etc/environment
http_proxy="http://10.0.0.1:7897"
https_proxy="http://10.0.0.1:7897"
source /etc/environment

# 检查代理设置
echo $http_proxy
echo $https_proxy
echo $no_proxy
# 可实现http请求 例如 curl 注意ping命令不可用

# 临时取消代理
unset http_proxy https_proxy no_proxy
```

---

## 五、启动与验证

### 启动 Docker 服务

```bash
# 重新加载 systemd 配置
systemctl daemon-reload
systemctl start docker

# 设置开机自启
systemctl enable docker
```

---

### 验证安装

```bash
# 1. 查看 Docker 信息
docker info

# 2. 查看版本
docker version

# 3. 验证镜像加速
docker info | grep -A 10 "Registry Mirrors"

# 4. 运行测试容器
time docker pull hello-world
docker run hello-world
```

---

### 查看相关进程

```bash
# Docker 客户端位置
which docker

# Docker 守护进程
ps aux | grep docker

# containerd 运行时
ps aux | grep containerd
systemctl status containerd
```

---

## 六、常用 Docker 命令

### 1. 拉取镜像

```bash
docker pull centos:latest
docker pull centos:7.9.2009
docker pull alpine
docker pull busybox:1.29
```

---

### 2. 镜像列表

```bash
docker images
# 镜像重命名
docker tag image1:tag name:tagname
docker tag centos:7.9.2009 centos:7
```

---

### 3. 容器运行

```bash
docker run = docker create + docker start
docker run --rm alpine /bin/echo "Hello Docker"
docker run --rm centos bash -c "ls /opt/"
```

---

### 4. 进入容器空间

```bash
docker run -it --name name1 -p 99:80 centos:7.9.2009 bash
docker exec -it name1 bash
```

---

### 5. 容器列表

```bash
docker ps          # 查看运行中的容器
docker ps -a       # 查看所有容器（包括未运行）
```

---

### 6. 删除容器与镜像

```bash
docker stop <CONTAINER_ID 或 NAME>
docker rm <CONTAINER_ID 或 NAME>
docker rmi <IMAGE_ID 或 NAME>
```

---

### 7. 查看容器信息

```bash
# 容器发行版
docker exec <CONTAINER_ID> bash -c "cat /etc/os-release"

# 容器内核（与宿主机相同）
docker exec <CONTAINER_ID> bash -c "uname -a"
```

---

### 8. 运行模式参数

```bash
-i, --interactive   # 保持 STDIN 打开，允许输入
-t, --tty           # 分配伪终端
-d, --detach        # 后台运行
--name              # 指定容器名称
--rm                # 容器退出后自动删除
```

---

### 9. 后台运行与进入

```bash
# 后台运行
docker run -d -p 100:80 nginx:1.17.9

# 进入后台容器
docker exec -it <CONTAINER_NAME> bash
```

---

### 10. 查看容器 IP 与端口

```bash
# 获取容器 IP
docker inspect --format='{{.NetworkSettings.IPAddress}}' <CONTAINER_NAME>

# 获取端口映射
docker port <CONTAINER_NAME>
```

---

### 11. 重命名容器

```bash
docker rename old_name new_name
```

---

### 12. 查看容器日志

```bash
docker logs <CONTAINER_NAME>
```

---

### 13. 容器资源监控

```bash
docker stats <CONTAINER_NAME>
```

---

### 14. 提交镜像（从容器创建镜像）

```bash
docker commit <CONTAINER_NAME> my-image:v1
```

---

### 15. 导出与导入镜像

```bash
# 导出
docker save image1 > /opt/image1.tar
docker save image1 | gzip > /opt/image1.tgz

# 导入
docker load < /opt/image1.tar
```

---

## 七、实践操作

### 自建 Docker 镜像（以 Nginx 为例）

```bash
# 1. 启动基础容器
docker run -it --name os1 -p 101:80 centos:7.9.2009 bash

# 2. 容器内安装 Nginx
curl -o /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
yum install net-tools nginx vim -y
yum clean all

# 3. 启动 Nginx 并提交镜像
nginx
docker commit os1 os1-nginx

# 4. 使用新镜像运行容器
docker run -d -p 102:80 os1-nginx nginx -g "daemon off;"
```

---

### 提取容器内日志

```bash
# 查看日志路径
docker inspect <CONTAINER_NAME> | grep -i LogPath

# 导出日志到文件
docker logs <CONTAINER_NAME> > /tmp/container.log 2>&1
```

---

### 数据卷挂载映射

```bash
# 命名卷（推荐）
docker volume create mydata
docker run -v mydata:/app/data nginx

# 绑定挂载（直接挂载宿主机目录）
docker run -v /host/path:/app/data nginx

# 匿名卷（自动创建，不易管理）
docker run -v /app/data nginx
```

---

### 容器与宿主机文件复制

```bash
# 从容器复制到宿主机
docker cp <CONTAINER_NAME>:/opt/dir1 /opt/

# 从宿主机复制到容器
docker cp /opt/dir2 <CONTAINER_NAME>:/opt/
```

---

**说明**：

- 容器没有自己的内核，共享宿主机内核。
- `/etc/os-release` 仅表示用户空间的发行版信息。
- 容器内核版本与宿主机一致，确保兼容性即可运行不同 Linux 发行版。
