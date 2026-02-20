## 一、NFS在企业中的应用架构

NFS（Network File System）广泛应用于企业环境中，主要用于存储和共享视频、图片、HTML等静态文件。例如：

- 网站用户上传的文件（如图片、附件、头像等）
- BBS、论坛等产品生成的静态资源
- 企业官网中的大量图片、动态图和网页文件

公有云平台如阿里云的NAS服务即为云化NFS服务。

------

## 二、企业集群为什么需要共享存储

1. **数据一致性保障**
   确保多台服务器访问同一份数据，避免数据冲突。
2. **高可用性与故障切换**
   如邮件服务器故障时，共享存储可被其他节点接管，保障服务连续性。
3. **资源高效利用与负载均衡**
   多节点可同时访问共享存储，实现负载分摊。
4. **数据集中管理与备份**
   数据统一存储，便于管理、备份和恢复。

------

## 三、NFS与RPC的关系

NFS依赖RPC（Remote Procedure Call）实现客户端与服务器之间的通信：

- RPC为NFS提供远程调用抽象，使客户端像调用本地函数一样访问远程文件。
- NFS客户端通过RPC发送请求，服务端通过RPC响应，实现文件操作的网络传输。

------

## 四、NFS架构与通信原理

### 服务端组件：

- **rpcbind**：端口映射服务（端口111）
- **nfs-utils**：共享目录与权限管理
- **nfsd**：NFS守护进程（端口2049）
- **mountd**：挂载请求验证
- **idmapd**：用户身份映射

### 客户端组件：

- NFS文件系统（内核模块）
- RPC模块（封装请求与响应）

### 通信流程：

1. NFS服务端启动，向rpcbind注册端口信息。
2. 客户端通过rpcbind获取服务端端口。
3. 客户端发送RPC请求至服务端对应端口。
4. 服务端验证权限并执行文件操作。
5. 操作结果通过RPC返回客户端。

------

## 五、NFS服务端配置

### 1. 安装与启动：

```sh
yum install nfs-utils rpcbind -y
systemctl start rpcbind.service
systemctl start rpcbind.socket
systemctl start nfs
```

### 2. 配置文件 `/etc/exports`：

```sh
/nfs-data  172.16.1.0/24(rw,sync,all_squash,anonuid=1500,anongid=1500)
```

- **共享目录**：绝对路径，需设置适当本地权限
- **客户端地址**：支持IP、网段、域名（推荐使用IP或网段）
- **权限参数**：
  - `rw`：读写
  - `ro`：只读
  - `sync`：同步写入（安全）
  - `async`：异步写入（性能高）
  - `all_squash`：所有用户映射为匿名用户
  - `anonuid/anongid`：指定映射用户UID/GID

### 3. 重新加载配置：

```sh
systemctl reload nfs
# 或
exportfs -r
```

------

## 六、NFS客户端配置

### 1. 安装与挂载：

```sh
yum install nfs-utils -y
mkdir /mnt/nfs-data
mount -t nfs 172.16.1.31:/nfs-data /mnt/nfs-data
```

### 2. 查看挂载：

```sh
df -h
mount -l | grep nfs
```

------

## 七、NFS结合Nginx实现共享存储

### 服务端：

1. 创建用户www（UID=1500）
2. 创建共享目录并授权
3. 配置`/etc/exports`，指定anonuid/anongid为1500
4. 重新加载NFS

### 客户端：

1. 创建相同UID的www用户
2. 安装Nginx并配置以www用户运行
3. 挂载NFS共享到Nginx网页目录：

```sh
mount -t nfs 172.16.1.31:/nfs-nginx /usr/share/nginx/html
```

1. 在共享目录中放置HTML、图片等静态资源

------

## 八、常见故障与处理

### 1. 客户端未挂载或挂载失效：

```
# 重新挂载
mount -t nfs 服务器IP:/共享目录 /本地目录
```

### 2. NFS服务端故障：

- 检查NFS服务状态：`systemctl status nfs`
- 重启服务：`systemctl restart nfs`

### 3. 强制卸载挂载点（紧急恢复）：

```
umount -fl /挂载点
```

### 4. 权限或映射问题：

- 确保服务端与客户端用户UID/GID一致
- 检查`/etc/exports`中的squash与anonuid设置
