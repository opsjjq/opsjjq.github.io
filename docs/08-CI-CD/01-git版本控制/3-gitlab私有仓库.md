# GitLab私有仓库搭建与使用指南

## 一、GitLab 概述

### 1.1 为什么需要私有仓库

- **代码安全**：防止商业代码泄露到公共仓库（GitHub、Gitee）
- **自主可控**：企业内部所有资料完全私有化管理
- **协作规范**：统一代码管理流程，实现标准化开发运维

---

### 1.2 适用场景

- **中小型公司**：Git + 远程仓库 + Shell脚本实现发布更新
- **中大型公司**：搭建GitLab私有仓库，实现完整CI/CD流程

---

## 二、GitLab 部署安装

### 2.1 环境准备（CentOS 7）

```bash
# 安装依赖
yum install curl policycoreutils-python openssh-server postfix wget -y

# 启动必要服务
systemctl start sshd postfix
systemctl enable sshd postfix
```

---

### 2.2 安装GitLab

```bash
# 下载GitLab社区版（12.0.3）
wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/gitlab-ce-12.0.3-ce.0.el7.x86_64.rpm

# 安装方式任选其一
rpm -ivh gitlab-ce-12.0.3-ce.0.el7.x86_64.rpm
# 或
yum localinstall gitlab-ce-12.0.3-ce.0.el7.x86_64.rpm
```

---

### 2.3 基础配置

```bash
# 修改配置文件
cat > /etc/gitlab/gitlab.rb <<'EOF'
external_url 'http://10.0.0.99'
gitlab_rails['gitlab_email_enabled'] = true
gitlab_rails['gitlab_email_from'] = 'your_email@qq.com'
gitlab_rails['gitlab_email_display_name'] = 'your_company'
gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.qq.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "your_email@qq.com"
gitlab_rails['smtp_password'] = "your_smtp_password"
gitlab_rails['smtp_domain'] = "smtp.qq.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true
EOF

# 重新加载配置
gitlab-ctl reconfigure
```

---

### 2.4 测试邮件功能

```bash
# 进入Rails控制台
gitlab-rails console

# 测试发送邮件
Notify.test_email('test@example.com', '测试邮件', 'Hello GitLab').deliver_now
```

---

## 三、GitLab 命令行管理

### 3.1 常用命令

```bash
gitlab-ctl start                  # 启动所有服务
gitlab-ctl stop                   # 停止所有服务
gitlab-ctl restart                # 重启所有服务
gitlab-ctl status                 # 查看服务状态
gitlab-ctl reconfigure            # 重新加载配置
gitlab-ctl tail                   # 查看所有日志
gitlab-ctl tail nginx             # 查看Nginx日志
gitlab-ctl tail postgresql        # 查看数据库日志
```

---

### 3.2 服务状态检查

```bash
# 查看Nginx监听端口
netstat -tunlp | grep nginx
# 输出示例：
# tcp 0 0 0.0.0.0:8060 0.0.0.0:* LISTEN
# tcp 0 0 0.0.0.0:80   0.0.0.0:* LISTEN
```

---

## 四、Web界面初始配置

### 4.1 首次访问

1. 浏览器访问：`http://10.0.0.99`
2. 设置root用户密码（无需原密码）
3. 使用root账号登录：
   - 用户名：`root`
   - 密码：自定义设置的密码

---

### 4.2 关闭注册功能

1. 登录后进入 **Admin Area**（管理区域）
2. 选择 **Settings** → **General**
3. 展开 **Sign-up restrictions**
4. 取消勾选 **Sign-up enabled**
5. 保存更改

---

### 4.3 设置用户邮箱

1. 右上角头像 → **Settings**
2. 左侧菜单选择 **User Settings**
3. 添加并验证邮箱

---

## 五、用户与项目管理

### 5.1 创建用户组

1. **Admin Area** → **Groups** → **New group**
2. 配置信息：
   - Group name: `dev_group`
   - Group URL: 自动生成
   - 可见级别：Private（私有）
3. 创建成功后可管理组成员

---

### 5.2 创建用户

1. **Admin Area** → **Users** → **New user**
2. 配置用户信息：
   - Name: 显示名称
   - Username: 登录用户名（唯一）
   - Email: 用户邮箱（唯一）
   - 角色分配：
     - Admin：管理员
     - Regular：普通用户
3. 创建后用户会收到重置密码邮件

---

### 5.3 创建项目

1. 顶部导航栏 **+** → **New project**

2. 选择创建方式：

   - **Create blank project**：空项目
   - **Import project**：导入已有项目

3. 项目配置：

   - Project name: `my_halo`
   - Project URL: 选择所属组
   - Visibility Level: Private（私有）

4. 创建后获取项目地址：

   ```text
   git@10.0.0.99:dev_group/my_halo.git
   http://10.0.0.99/dev_group/my_halo.git
   ```

---

## 六、Git操作实践

### 6.1 SSH Key配置

```bash
# 生成SSH密钥
ssh-keygen -t rsa -C "your_email@example.com"

# 查看公钥
cat ~/.ssh/id_rsa.pub

# 将公钥添加到GitLab
# 用户设置 → SSH Keys → 粘贴公钥
```

---

### 6.2 克隆远程仓库

```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"

# 克隆项目
git clone git@10.0.0.99:dev_group/my_halo.git
```

---

### 6.3 推送代码到GitLab

```bash
# 关联远程仓库
git remote add origin git@10.0.0.99:dev_group/my_halo.git

# 查看远程仓库
git remote -v

# 推送代码
git add .
git commit -m "Initial commit"
git push -u origin master
```

---

### 6.4 分支保护设置

1. 项目设置 → **Repository** → **Protected Branches**
2. 保护master分支：
   - 允许推送：Maintainers
   - 允许合并：Maintainers
   - 允许解保护：Maintainers

---

## 七、手工部署流程

### 7.1 首次部署脚本

```bash
#!/bin/bash
# deploy_flask.sh

# 克隆代码
cd /opt/cangku1
git clone git@10.0.0.99:dev_group/my_flask.git

# 安装依赖
cd my_flask
yum install python3 python3-devel python3-pip -y > /dev/null
pip3 install flask -i https://mirrors.aliyun.com/pypi/simple > /dev/null

# 停止旧进程
kill -9 $(ps -ef | grep python.py | grep -v grep | awk '{print $2}') 2>/dev/null

# 启动应用
nohup python3 python.py > nohup.log 2>&1 &

# 检查进程
sleep 2
echo "项目进程号：$(ps -ef | grep 'python.py' | grep -v grep | awk '{print $2}')"
```

---

### 7.2 更新部署脚本

```bash
#!/bin/bash
# restart_flask.sh

cd /opt/cangku1/my_flask

# 更新代码
git pull origin master

# 重启应用
kill -9 $(ps -ef | grep python.py | grep -v grep | awk '{print $2}') 2>/dev/null
nohup python3 python.py > nohup.log 2>&1 &

# 验证启动
sleep 2
echo "更新后进程号：$(ps -ef | grep 'python.py' | grep -v grep | awk '{print $2}')"
echo "本地测试：$(curl -s 127.0.0.1:5000)"
```

---

## 八、GitLab备份与恢复

### 8.1 备份配置

```bash
# 修改配置文件添加备份设置
cat >> /etc/gitlab/gitlab.rb <<'EOF'
gitlab_rails['backup_path'] = "/gitlab_backup/"
gitlab_rails['backup_keep_time'] = 604800  # 保留7天
EOF

# 创建备份目录并授权
mkdir -p /gitlab_backup/
chown -R git.git /gitlab_backup/

# 重新加载配置
gitlab-ctl reconfigure
```

---

### 8.2 手动备份

```bash
# 执行备份命令
gitlab-rake gitlab:backup:create

# 查看备份文件
ls -lh /gitlab_backup/
# 示例：1658161288_2022_07_19_12.0.3_gitlab_backup.tar
```

---

### 8.3 手动恢复

```bash
# 停止相关服务
gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq
gitlab-ctl stop nginx

# 执行恢复（使用备份文件时间戳）
gitlab-rake gitlab:backup:restore BACKUP=1658161288_2022_07_19_12.0.3

# 重新启动服务
gitlab-ctl reconfigure
gitlab-ctl restart
gitlab-ctl status | grep run
```

---

## 九、权限管理最佳实践

### 9.1 用户角色说明

| 角色 | 权限说明 |
| :--- | :--- |
| Guest | 只读访问，无法修改 |
| Reporter | 查看代码，创建issue |
| Developer | 克隆、推送、创建分支/合并请求 |
| Maintainer | 管理项目、保护分支、推送master |
| Owner | 最高权限，可删除项目 |

---

### 9.2 项目协作流程

1. **开发者**创建特性分支
2. 在分支上开发并提交代码
3. 创建合并请求（Pull Request）
4. **维护者**审查代码
5. 通过后合并到主分支
6. 删除特性分支

---

### 9.3 分支策略示例

```text
master     - 生产环境代码
develop    - 开发集成分支
feature/*  - 功能开发分支
hotfix/*   - 紧急修复分支
release/*  - 版本发布分支
```

---

## 十、故障排查指南

### 10.1 常见问题

1. **无法访问GitLab**

   ```bash
   # 检查服务状态
   gitlab-ctl status

   # 查看日志
   gitlab-ctl tail nginx
   tail -f /var/log/gitlab/nginx/gitlab_access.log
   ```

2. **SSH连接失败**

   ```bash
   # 测试连接
   ssh -T git@10.0.0.99

   # 检查SSH配置
   cat ~/.ssh/config
   ```

3. **备份恢复失败**

   ```bash
   # 检查版本一致性
   cat /opt/gitlab/version-manifest.txt

   # 检查磁盘空间
   df -h /gitlab_backup/
   ```

---

### 10.2 性能优化建议

1. 定期清理无用分支和标签
2. 设置合理的备份保留策略
3. 监控磁盘空间使用情况
4. 定期更新到稳定版本
