## 一、Ansible 核心概念

### 1.1 自动化运维优势

- **提高效率**：减少重复性工作
- **减少错误**：降低人为出错可能性
- **数据化管理**：支持数据化汇报、问题追溯
- **标准化输出**：导出 JSON/YAML 等格式，便于前端展示

### 1.2 学习路线

1. **主机清单语法**：服务器分组、认证配置、变量管理
2. **常用模块学习**：语法、参数、用法记忆
3. **Shell脚本改造**：将 Shell 命令转换为 Ansible 模块操作

---

## 二、安装与配置

### 2.1 安装 Ansible

```bash
# CentOS/RHEL
yum install epel-release ansible libselinux-python -y

# 验证安装
ansible --version
```

### 2.2 主机清单配置 (`/etc/ansible/hosts`)

```ini
# 基础分组
[web]
172.16.1.7
172.16.1.8
172.16.1.9

[nfs]
172.16.1.31

[backup]
172.16.1.41

# 连续IP简化写法
[web]
172.16.1.[7:9]

# 公共变量（新版语法）
[web:vars]
ansible_port=22999
ansible_user=root
ansible_password='123123'

# 全局变量
[all:vars]
ansible_port=22999
```

### 2.3 连接认证方式

**方式一：公私钥认证（推荐）**

```bash
# 分发公钥
sshpass -p '密码' ssh-copy-id IP地址 -o StrictHostKeyChecking=no
```

**方式二：密码认证**

```ini
[backup]
172.16.1.41 ansible_port=22999 ansible_user=root ansible_password='123123'
```

**忽略主机指纹确认**

```bash
# 修改配置文件
vim /etc/ansible/ansible.cfg
host_key_checking = False
```

---

## 三、命令执行模式

### 3.1 两种模式

- **Ad-hoc 模式**：临时批量执行命令（类似 Shell 命令）
- **Playbook 模式**：编写剧本批量执行（类似 Shell Scripts）

### 3.2 基础语法格式

```bash
ansible <主机模式> [-m <模块名>] [-a <模块参数>] [选项]
```

### 3.3 命令结果颜色含义

| 颜色     | 含义                         |
| :------- | :--------------------------- |
| **绿色** | 命令成功执行，但状态未改变   |
| **黄色** | 命令成功执行，且状态发生改变 |
| **紫色** | 警告信息，有更合适的用法     |
| **红色** | 命令执行失败                 |
| **蓝色** | 详细的执行过程               |

---

## 四、常用模块详解

### 4.1 ping 模块 - 测试连通性

```bash
ansible all -m ping
```

### 4.2 command 模块 - 执行简单命令

```bash
# 查看主机名
ansible web -m command -a "hostname"

# 切换目录执行
ansible web -a "tar -czf log.tgz /var/log chdir=/opt"

# 条件执行
ansible web -a "mkdir /opt creates=/opt"  # 目录存在则跳过
ansible web -a "tar -czf /backup_config/etc.tgz etc chdir=/ removes=/backup_config"
```

### 4.3 shell 模块 - 执行复杂命令

```bash
# 支持特殊符号
ansible web -m shell -a "ps -ef | grep ssh"
ansible web -m shell -a "date '+%F %T' > /tmp/date.log"

# 复合命令
ansible web -m shell -a "mkdir /0224/; echo 'hostname' > /0224/hostname.sh; chmod +x /0224/hostname.sh; /0224/hostname.sh"
```

### 4.4 copy 模块 - 文件分发

```bash
# 基础拷贝
ansible web -m copy -a "src=/tmp/61-dnf.log dest=/tmp/web-dnf.log"

# 指定权限和属主
ansible web -m copy -a "src=/tmp/61-dnf.log dest=/opt/web-dnf.log owner=www group=www mode=600"

# 备份原文件
ansible web -m copy -a "src=/tmp/61-dnf.log dest=/opt/web-dnf.log backup=yes"

# 直接写入内容
ansible web -m copy -a "content='文本内容' dest=/opt/file.txt"

# 拷贝目录（注意斜杠）
ansible web -m copy -a "src=/opt/ dest=/tmp/"      # 拷贝目录内容
ansible web -m copy -a "src=/opt dest=/tmp/"       # 拷贝整个目录
```

### 4.5 file 模块 - 文件管理

```bash
# 创建文件
ansible web -m file -a "path=/opt/hello_ansible.log state=touch"

# 创建目录
ansible web -m file -a "path=/opt/hello_ansible state=directory"

# 创建带权限的文件
ansible web -m file -a "path=/opt/hello-linux.log state=touch owner=www group=www mode=777"

# 创建软链接
ansible web -m file -a "src=/etc/hosts dest=/opt/hosts state=link"

# 修改文件属性
ansible web -m file -a "path=/opt/file.log owner=www group=www mode=666"

# 删除文件/目录
ansible web -m file -a "path=/opt/file.log state=absent"
```

### 4.6 script 模块 - 执行本地脚本

script 模块使用的都是管理机（控制端）本地的脚本。

```bash
# 创建测试脚本
cat > /root/echo_server_info.sh << EOF
echo "\$(hostname -I)" >> /tmp/server_info.log
echo "\$(uptime)" >> /tmp/server_info.log
echo "\$(free -m)" >> /tmp/server_info.log
EOF

# 远程执行
ansible nfs -m script -a "/root/echo_server_info.sh"
```

### 4.7 cron 模块 - 定时任务管理

```bash
# 添加定时任务
ansible nfs -m cron -a "name='ntp aliyun' minute=*/5 job='ntpdate -u ntp.aliyun.com'"

# 删除定时任务
ansible nfs -m cron -a "name='ntp aliyun' state=absent"

# 每分钟执行
ansible nfs -m cron -a "name='一句话' job='echo 人定胜天 >> /tmp/hello.log'"

# 修改定时任务
ansible nfs -m cron -a "name='一句话' minute=30 hour=23 job='echo 人定胜天 >> /tmp/hello.log'"
```

### 4.8 group 模块 - 用户组管理

```bash
# 创建组
ansible nfs -m group -a "name=chaoge_ops gid=1234"

# 删除组
ansible nfs -m group -a "name=chaoge_ops state=absent"
```

### 4.9 user 模块 - 用户管理

```bash
# 创建用户
ansible nfs -m user -a "name=chaoge01 uid=8888"

# 创建组和用户（无家目录、不可登录）
ansible nfs -m group -a "name=cc01 gid=1777"
ansible nfs -m user -a "name=cc01 uid=1777 group=1777 create_home=no shell=/sbin/nologin"
```

### 4.10 yum 模块 - 软件包管理

```bash
# 安装软件（latest = installed = present）
ansible backup -m yum -a "name=net-tools state=latest"

# 卸载软件（absent = removed）
ansible backup -m yum -a "name=net-tools state=absent"

# 安装特定服务
ansible backup -m yum -a "name=rsync state=installed"
```

### 4.11 systemd 模块 - 服务管理

```bash
# 安装并启动服务
ansible web -m yum -a "name=nginx state=installed"
ansible web -m systemd -a "name=nginx state=started"

# 设置开机自启
ansible web -m systemd -a "name=nginx state=started enabled=yes"

# 停止服务并禁用自启
ansible web -m systemd -a "name=nginx state=stopped enabled=no"

# 重载服务配置
ansible web -m systemd -a "name=nginx daemon_reload=yes"
```

### 4.12 mount 模块 - 挂载管理

path 是目标机器的路径。

```bash
# 挂载并写入 fstab
ansible web -m mount -a "src='172.16.1.31:/nfs-nginx-data' path=/usr/share/nginx/html fstype=nfs state=mounted"

# 仅写入 fstab 不挂载
ansible web -m mount -a "src='172.16.1.31:/nfs-nginx-data' path=/usr/share/nginx/html fstype=nfs state=present"

# 卸载并删除 fstab 记录
ansible web -m mount -a "src='172.16.1.31:/nfs-nginx-data' path=/usr/share/nginx/html fstype=nfs state=absent"

# 只卸载不删除 fstab 记录
ansible web -m mount -a "src='172.16.1.31:/nfs-nginx-data' path=/usr/share/nginx/html fstype=nfs state=unmounted"
```

### 4.13 archive 模块 - 文件压缩

```bash
# 压缩文件（默认 gz 格式）
ansible web -m archive -a "path=/etc dest=/opt/etc.tgz"

# 指定压缩格式
ansible web -m archive -a "path=/var/log dest=/opt/log.zip format=zip"
```

### 4.14 unarchive 模块 - 文件解压

```bash
# 解压远程文件
ansible web -m unarchive -a "src=/opt/etc.tgz dest=/opt/etc_file/ remote_src=yes"

# 解压本地文件到远程
ansible web -m unarchive -a "src=/opt/etc.tgz dest=/tmp/"
```

### 4.15 其他实用模块

- **lineinfile**：修改文件中的特定行
- **replace**：替换文件内容
- **get_url**：下载文件
- **synchronize**：文件同步（类似 rsync）
- **debug**：调试输出
- **setup**：收集主机信息（facts）
- **wait_for**：等待条件满足

---

## 五、实用技巧

### 5.1 查看模块帮助

```bash
# 列出所有模块
ansible-doc -l

# 查看模块详情
ansible-doc -s module_name

# 查看模块示例
ansible-doc module_name
```

### 5.2 调试技巧

```bash
# 显示详细执行过程
ansible web -vvvvv -m shell -a "df -h"

# 清理 Ansible 缓存
rm -rf ~/.ansible/cp/*
```

### 5.3 状态管理

- **changed_when**：自定义 changed 状态条件
- **failed_when**：自定义失败条件
- **ignore_errors**：忽略错误继续执行

---

## 六、综合练习

### 6.1 基础模块练习

完成以下模块的实操练习：

- ping、command、shell
- copy、file、script
- cron、group、user
- yum、systemd、mount
- archive、unarchive

### 6.2 Shell 脚本改造

将之前的 Nginx、NFS、Rsync 部署脚本改造为 Ansible 模块形式，要求：

1. 使用合适的主机组（web、nfs、backup）
2. 使用恰当的模块替代 Shell 命令
3. 实现完整的服务部署流程

---

## 七、学习资源

### 7.1 官方文档

- [Ansible 官方文档](https://docs.ansible.com/ansible/latest/)
- [模块文档索引](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/index.html)

### 7.2 学习要点

1. **模块记忆**：常用模块名称和核心参数
2. **语法熟练**：命令格式和参数写法
3. **实践为主**：多动手练习，从简单到复杂
4. **错误排查**：学会阅读和理解错误信息
5. **最佳实践**：遵循 Ansible 的设计理念和最佳实践
