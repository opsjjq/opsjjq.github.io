# Rsync 基础概念与实践

---

## 一、Rsync 基础概念

### 1.1 Rsync 工作模式对比

| 模式            | 协议          | 认证方式 | 优点     | 缺点           |
| :-------------- | :------------ | :------- | :------- | :------------- |
| **本地模式**    | 本地文件系统  | 无需认证 | 简单快速 | 仅限本地       |
| **远程 SSH 模式** | SSH 协议     | 系统用户 | 配置简单 | 系统用户不安全 |
| **服务模式**    | Rsync 自有协议 | 虚拟用户 | 安全可控 | 配置复杂       |

### 1.2 为什么需要服务模式？

- SSH 模式使用系统用户（不安全）
- SSH 模式使用普通用户（可能导致权限不足）
- 服务模式使用虚拟用户，更加安全可控

---

## 二、Rsync 本地模式

### 2.1 安装与基本语法

```sh
yum install rsync -y

# 本地同步
rsync [选项] 源路径 目标路径

# 远程同步（SSH 模式）
rsync [选项] 源路径 用户名@IP:目标路径      # 推送
rsync [选项] 用户名@IP:源路径 目标路径      # 拉取
```

### 2.2 常用参数详解

| 参数        | 说明                     |
| :---------- | :----------------------- |
| `-a`        | 归档模式（等于 -rlptgoD） |
| `-v`        | 详细模式输出             |
| `-z`        | 传输时压缩               |
| `-P`        | 显示进度信息             |
| `--delete`  | 删除目标多余文件         |
| `--bwlimit` | 限速（KB/s）             |

### 2.3 本地模式示例

```sh
# 同步单个文件
rsync -avzP /var/log/messages /opt/

# 同步目录（注意斜杠区别）
rsync -avzP /var/log /tmp/      # 拷贝 log 目录本身
rsync -avzP /var/log/ /tmp/     # 拷贝 log 目录内容

# 增量备份测试
mkdir /test1
echo "test" > /test1/file.txt
rsync -avzP /test1/ /test2/

# 完全同步（危险！）
rsync -avzP --delete /test1/ /test2/

# 大文件限速传输
dd if=/dev/zero of=/tmp/2G.log bs=100M count=20
rsync -avzP --bwlimit=10240 /tmp/2G.log /opt/
```

---

## 三、Rsync 远程 SSH 模式

### 3.1 推送与拉取

```sh
# 推送模式（上传）
rsync -avzP /root/ root@172.16.1.31:/tmp/
rsync -avzP --delete /root/ root@172.16.1.31:/tmp/

# 拉取模式（下载）
rsync -avzP root@172.16.1.41:/etc/passwd /opt/
rsync -avzP root@172.16.1.41:/root/ /tmp/
```

### 3.2 SSH 模式注意事项

```sh
# 使用 SSH 密钥认证
ssh-keygen -t rsa
ssh-copy-id root@172.16.1.31

# 指定 SSH 端口
rsync -avzP -e "ssh -p 2222" /root/ root@172.16.1.31:/tmp/
```

---

## 四、Rsync 服务模式（Daemon 模式）

### 4.1 服务端配置

```sh
# 安装 rsync
yum install rsync -y

# 创建配置文件
cat > /etc/rsyncd.conf << 'EOF'
uid = www
gid = www
port = 873
fake super = yes
use chroot = no
max connections = 200
timeout = 600
ignore errors
read only = false
list = false
auth users = rsync_backup
secrets file = /etc/rsync.passwd
log file = /var/log/rsyncd.log

[backup]
comment = backup directory
path = /backup

[data]
path = /data
EOF

# 创建用户和目录
useradd -u 1000 -M -s /sbin/nologin www
mkdir -p /backup /data
chown -R www:www /backup /data

# 配置密码文件
echo "rsync_backup:qwe123" > /etc/rsync.passwd
chmod 600 /etc/rsync.passwd

# 启动服务
systemctl start rsyncd
systemctl enable rsyncd

# 检查端口
netstat -tunlp | grep :873
```

### 4.2 客户端配置

```sh
# 方式1：密码变量
export RSYNC_PASSWORD='qwe123'
rsync -avzP rsync_backup@rsync-41::backup /tmp/

# 方式2：密码文件（推荐）
echo "qwe123" > /etc/rsync_client.passwd
chmod 600 /etc/rsync_client.passwd
rsync -avzP --password-file=/etc/rsync_client.passwd \
    rsync_backup@rsync-41::backup /tmp/
```

---

## 五、高级应用技巧

### 5.1 排除和包含模式

```sh
# 排除特定文件/目录
rsync -avzP --exclude='*.log' --exclude='temp/' /source/ /destination/

# 使用排除文件列表
echo "*.tmp" > /tmp/exclude.list
rsync -avzP --exclude-from='/tmp/exclude.list' /source/ /destination/

# 只包含特定文件类型
rsync -avzP --include='*.jpg' --include='*.png' --exclude='*' /source/ /destination/
```

### 5.2 断点续传与带宽控制

```sh
# 断点续传
rsync -avzP --partial /source/large_file /destination/

# 限速传输
rsync -avzP --bwlimit=10240 /source/ /destination/

# IO 优化
ionice -c 3 rsync -avzP /source/ /destination/
```

---

## 六、备份任务实战

### 6.1 客户端备份脚本

```sh
#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin

find /backup -type f -mtime +7 -delete

mkdir -p /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")

cd / && tar -zcf /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/etc.tgz etc
tar -zcf /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/log.tgz var/log

md5sum /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/*.tgz \
    > /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/all_data_md5.txt

export RSYNC_PASSWORD=qwe123
rsync -avzP /backup/ rsync_backup@rsync41::bak
```

### 6.2 定时任务配置

```sh
crontab -e
0 1 * * * /bin/bash /opt/my_rsync.sh
```

### 6.3 数据校验

```sh
md5sum -c all_data_md5.txt
md5sum -c all_data_md5.txt > check_md5result.txt
mail -s "check-$(date +%F)" 3011637329@qq.com < check_md5result.txt
```

### 6.4 过期文件删除

```sh
find /bak -type f -mtime +180 -delete
```

---

## 七、排除文件实践

```sh
rsync -avzP --exclude=b.png /tmp/ rsync_backup@10.0.0.41::data
rsync -avzP --exclude=d1 /tmp/ rsync_backup@10.0.0.41::data
rsync -avzP --exclude='*.log' --exclude='tmp/' --exclude='.git/' \
    /source/ rsync_backup@10.0.0.41::backup
```

---

## 八、Rsync 排错指南

### 8.1 常见错误

| 错误信息 | 原因分析 | 解决方案 |
| :------- | :------- | :------- |
| @ERROR: auth failed on module backup | 认证失败 | 检查用户名和密码 |
| connection refused | 服务未启动 | systemctl start rsyncd |
| permission denied | 权限不足 | 检查目录权限和用户 |
| @ERROR: chroot failed | chroot 路径不存在 | 检查 path 配置 |

### 8.2 排错命令

```sh
# 测试连接
telnet 10.0.0.41 873

# 检查服务状态
systemctl status rsyncd

# 查看日志
tail -f /var/log/rsyncd.log

# 测试同步
rsync -avzP --password-file=/etc/rsync_client.passwd \
    rsync_backup@10.0.0.41::backup /tmp/test/
```

### 8.3 性能优化

```sh
# 服务端优化
max connections = 100
socket options = SO_KEEPALIVE

# 客户端优化
rsync -avzP --bwlimit=10240 --partial /source/ /destination/
```

---

## 九、Rsync 生产环境实战

### 9.1 网站代码发布

```sh
#!/bin/bash
SRC_DIR=/data/wwwroot
DEST_DIR=web@10.0.0.41::www
DATE=$(date +%F_%H:%M:%S)

# 备份旧版本
rsync -avzP ${SRC_DIR}/ rsync_backup@10.0.0.41::backup/website_${DATE}/
echo "[${DATE}] 备份完成"

# 发布新版本
rsync -avzP --delete ${SRC_DIR}/ ${DEST_DIR}/
echo "[${DATE}] 发布完成"

# 记录日志
echo "[${DATE}] 发布成功" >> /var/log/rsync_publish.log
```

### 9.2 数据库备份

```sh
#!/bin/bash
DB_USER=root
DB_PASS=your_password
DB_NAME=myapp
BACKUP_DIR=/backup/mysql
RSYNC_MODULE=mysql_backup
RSYNC_SERVER=rsync41

mkdir -p ${BACKUP_DIR}

mysqldump -u${DB_USER} -p${DB_PASS} ${DB_NAME} | gzip > \
    ${BACKUP_DIR}/${DB_NAME}_$(date +%F).sql.gz

rsync -avzP ${BACKUP_DIR}/ rsync_backup@${RSYNC_SERVER}::${RSYNC_MODULE}/
```

### 9.3 日志收集

```sh
#!/bin/bash
LOG_DIR=/var/log/nginx
RSYNC_MODULE=logs
RSYNC_SERVER=rsync41

# 压缩历史日志
find ${LOG_DIR} -name "*.log" -mtime +1 -exec gzip {} \;

# 同步日志
rsync -avzP ${LOG_DIR}/ rsync_backup@${RSYNC_SERVER}::${RSYNC_MODULE}/
```
