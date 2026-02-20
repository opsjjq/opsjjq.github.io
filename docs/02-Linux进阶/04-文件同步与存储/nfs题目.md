## NFS 配置练习题

### 1. 开放 `/nfs/share` 目录，提供给任意用户只读访问

**服务端配置**：

```sh
# 1. 安装必要软件
yum install nfs-utils rpcbind -y

# 2. 创建共享目录
mkdir -p /nfs/share

# 3. 配置/etc/exports（关键：ro只读 + all_squash匿名映射）
echo '/nfs/share *(ro,sync,all_squash)' > /etc/exports

# 4. 启动服务（必须先启动rpcbind）
systemctl start rpcbind.service
systemctl start rpcbind.socket
systemctl start nfs

# 5. 查看共享列表
showmount -e 172.16.1.31

# 6. 设置目录权限（映射到nfsnobody）
chown -R nfsnobody:nfsnobody /nfs/share
```

**客户端验证**：

```sh
# 1. 创建挂载点
mkdir /nfs_share

# 2. 挂载NFS共享
mount -t nfs 172.16.1.31:/nfs/share /nfs_share

# 3. 验证只读权限（应无法创建文件）
touch /nfs_share/test.txt  # 应提示"Read-only file system"
```

------

### 2. 开放 `/nfs/upload` 目录，提供给172.16.1.0/24网段，上传数据映射为nfs-upload用户（UID=GID=200）

**服务端配置**：

```sh
# 1. 创建专用用户和组
groupadd -g 200 nfs-upload
useradd -u 200 -g 200 -M -s /sbin/nologin nfs-upload

# 2. 创建共享目录并设置权限
mkdir /nfs/upload
chown -R nfs-upload:nfs-upload /nfs/upload

# 3. 配置/etc/exports（关键：身份映射参数）
echo '/nfs/upload 172.16.1.0/24(rw,sync,all_squash,anonuid=200,anongid=200)' >> /etc/exports

# 4. 重新加载配置
exportfs -r
```

**客户端验证**：

```sh
# 1. 挂载共享
mkdir /nfs_upload
mount -t nfs 172.16.1.31:/nfs/upload /nfs_upload

# 2. 测试写入（文件属主应为nfs-upload）
touch /nfs_upload/test_upload.txt
ls -l /nfs_upload/  # 应显示属主为nfs-upload
```

------

### 3. 开放 `/home/chaoge` 目录仅共享给172.16.1.41，且只有chaoge01用户（UID=1888）可以完全访问

**服务端配置**：

```sh
# 1. 创建chaoge01用户
useradd chaoge01 -u 1888 -M -s /sbin/nologin

# 2. 创建目录并设置严格权限（700：仅属主可访问）
mkdir -p /home/chaoge
chown -R chaoge01:chaoge01 /home/chaoge
chmod 700 /home/chaoge

# 3. 配置/etc/exports（无身份映射，保持原始权限）
echo '/home/chaoge 172.16.1.41(rw)' >> /etc/exports

# 4. 重新加载配置
exportfs -r
```

**客户端配置**：

```sh
# 1. 创建相同UID的用户
useradd chaoge01 -u 1888

# 2. 挂载共享
mkdir /nfs_chaoge
mount -t nfs 172.16.1.31:/home/chaoge /nfs_chaoge

# 3. 验证权限（只有chaoge01用户可访问）
su - chaoge01
cd /nfs_chaoge  # 应能成功进入
touch test_file.txt
```

------

### 4. 添加30G硬盘，为NFS提供 `/nfs-nginx-data` 存储，仅web-7主机使用，映射为www用户（UID=GID=11211），供Nginx使用

**服务端配置**：

```sh
# 1. 格式化30G新硬盘
lsblk  # 确认磁盘设备（如/dev/sdb）
mkfs.xfs /dev/sdb

# 2. 创建挂载点并挂载
mkdir /nfs-nginx-data
mount /dev/sdb /nfs-nginx-data

# 3. 创建www用户
useradd www -u 11211 -M -s /sbin/nologin

# 4. 配置/etc/exports（指定主机名和身份映射）
echo '/nfs-nginx-data web-7(rw,sync,all_squash,anonuid=11211,anongid=11211)' >> /etc/exports

# 5. 设置目录权限
chown -R www:www /nfs-nginx-data

# 6. 创建测试数据
cat > /nfs-nginx-data/index.html << EOF
<meta charset=utf8>
NFS共享存储测试页面
<img src='test.png'>
EOF

# 7. 重新加载配置
exportfs -r
```

**客户端（web-7）配置**：

```sh
# 1. 安装Nginx
yum install nginx -y

# 2. 挂载NFS到Nginx网页目录
mount -t nfs 172.16.1.31:/nfs-nginx-data /usr/share/nginx/html

# 3. 启动Nginx
systemctl start nginx

# 4. 测试访问
curl http://localhost
```

## NFS配置要点总结

### 配置文件 `/etc/exports` 语法：

```
共享目录 客户端地址(参数1,参数2,...)
```

### 常用参数说明：

| 参数                    | 说明                           |
| :---------------------- | :----------------------------- |
| `ro` / `rw`             | 只读 / 读写                    |
| `sync` / `async`        | 同步/异步写入                  |
| `root_squash`           | root用户映射为匿名用户（默认） |
| `no_root_squash`        | root保持root权限（不安全）     |
| `all_squash`            | 所有用户映射为匿名用户         |
| `anonuid=` / `anongid=` | 指定映射的UID/GID              |

### 服务管理命令：

```sh
# 启动服务（必须顺序）
systemctl start rpcbind
systemctl start nfs

# 查看共享
showmount -e 服务器IP

# 重新加载配置（不重启服务）
exportfs -r
# 或
systemctl reload nfs

# 查看NFS端口信息
rpcinfo -p
```
