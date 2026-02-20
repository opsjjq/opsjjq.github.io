# Rsync 备份实践

---

## 一、Rsync 排除操作

```sh
rsync -avzP --exclude=b.png /tmp/ rsync_backup@10.0.0.41::data
rsync -avzP --exclude=d1 /tmp/ rsync_backup@10.0.0.41::data
rsync -avzP --exclude='*.log' --exclude='tmp/' --exclude='.git/' \
    /source/ rsync_backup@10.0.0.41::backup
```

---

## 二、备份架构

### 2.1 架构说明

```
客户端 → rsync 服务端 → 数据备份存储
         ↓
      邮件通知
```

### 2.2 服务器角色

| 服务器    | IP 地址     | 角色           |
| :-------- | :---------- | :------------- |
| nfs-31    | 10.0.0.31   | 备份客户端     |
| rsync-41  | 10.0.0.41   | rsync 备份服务端 |

---

## 三、客户端配置

### 3.1 备份脚本

```bash
#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin

# 0. 删除七天之前的旧文件
find /backup -type f -mtime +7 -delete

# 1. 创建目录
mkdir -p /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")

# 2. 打包备份数据
cd / && tar -zcf /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/etc.tgz etc
cd / && tar -zcf /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/log.tgz var/log

# 2.1 生成校验文件
md5sum /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/*.tgz \
    > /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/all_data_md5.txt

# 3. 传输数据到 rsync 服务器
export RSYNC_PASSWORD=qwe123
rsync -avzP /backup/ rsync_backup@rsync41::bak

# 4. 删除本地旧文件
find /backup -type f -mtime +7 -delete
```

### 3.2 调试脚本

```sh
bash -x /opt/my_rsync.sh
```

### 3.3 定时任务

```sh
# 确保 crond 服务运行
systemctl status crond

# 添加定时任务
crontab -e
0 1 * * * /bin/bash /opt/my_rsync.sh

# 删除所有定时任务
crontab -r
```

---

## 四、服务端配置

### 4.1 安装脚本

```bash
#!/bin/bash

# 1. 安装 rsync 服务
yum install rsync -y

# 2. 写配置文件
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
auth users = usr41
secrets file = /etc/usr41.passwd
log file = /var/log/rsyncd.log

[bak]
comment = backup directory
path = /backup

[data]
path = /data
EOF

# 3. 创建用户和目录
useradd -u 1000 -M -s /sbin/nologin www
mkdir -p /{backup,data}
chown -R www.www /backup
chown -R www.www /data

# 4. 创建密码文件
touch /etc/usr41.passwd
chmod 600 /etc/usr41.passwd
echo "usr41:qwe123" > /etc/usr41.passwd

# 5. 启动服务
systemctl restart rsyncd
```

---

## 五、数据校验

### 5.1 校验命令

```sh
md5sum /backup/$(hostname)_$(ifconfig eth0 | awk 'NR==2{print $2}')_$(date "+%F")/*.tgz > size.txt
md5sum -c size.txt
```

### 5.2 校验结果说明

| 结果    | 说明         |
| :------ | :----------- |
| OK      | 文件校验通过 |
| FAILED  | 文件已损坏   |

---

## 六、邮件通知

### 6.1 配置 mailx

```bash
yum install mailx -y

cat > /etc/mail.rc << 'EOF'
set from=3011637329@qq.com
set smtp=smtps://smtp.qq.com:465
set smtp-auth-user=3011637329@qq.com
set smtp-auth-password=授权码
set smtp-auth=login
set ssl-verify=ignore
set nss-config-dir=/etc/pki/nssdb/
EOF
```

### 6.2 发送校验邮件

```bash
md5sum -c all_data_md5.txt > check_md5result.txt
mail -s "check-$(date +%F)" 3011637329@qq.com < check_md5result.txt
```

---

## 七、服务端汇总脚本

### 7.1 服务端校验脚本

```bash
#!/bin/bash

# 1. 校验备份数据
md5sum -c /bak/nfs-31_10.0.0.31_$(date "+%F")/all_data_md5.txt \
    > /bak/nfs31_10.0.0.31_$(date "+%F")/check_md5result.txt

# 2. 发送邮件
mail -s "name-check-rsync-$(date +%F)" 3011637329@qq.com \
    < /bak/nfs31_10.0.0.31_$(date "+%F")/check_md5result.txt

# 3. 删除旧数据（保留 180 天）
find /bak -type f -mtime +180 -delete
```

### 7.2 定时校验

```bash
crontab -e
0 2 * * * /bin/bash /opt/my_rsync_server.sh
```

---

## 八、过期文件删除

```sh
# 服务端删除 6 个月前的备份数据
find /momo -type f -mtime +180 -delete
```
