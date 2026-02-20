# 自动化发布静态网站 - CI/CD实践指南

## 一、项目概述

### 1.1 项目目标

实现从代码提交到自动化部署的完整CI/CD流水线，通过Jenkins将静态网站一键部署到多台Web服务器。

### 1.2 技术架构

```text
开发人员 → GitLab代码仓库 → Jenkins自动化构建 → 多台Web服务器
```



### 1.3 环境准备

| 服务器        | IP地址     | 角色            | 软件要求      |
| :------------ | :--------- | :-------------- | :------------ |
| GitLab服务器  | 10.0.0.99  | 代码仓库        | GitLab        |
| Jenkins服务器 | 10.0.0.101 | CI/CD构建服务器 | Jenkins + Git |
| Web服务器1    | 10.0.0.7   | 生产环境        | Nginx         |
| Web服务器2    | 10.0.0.8   | 生产环境        | Nginx         |

## 二、环境配置

### 2.1 GitLab代码仓库配置

1. **创建项目**

   - 在GitLab中创建新项目
   - 导入示例静态网站代码库：`https://gitee.com/lvyeyou/DaShuJuZhiDaPingZhanShi.git`

2. **项目结构**

   text

   ```
   智慧城市/
   └── 智慧工地/
       ├── index.html
       ├── css/
       ├── js/
       └── images/
   ```

   

### 2.2 Jenkins服务器配置

```bash
# 1. 安装Git
yum install git -y

# 2. 配置SSH免密登录到Web服务器
ssh-keygen -t rsa  # 生成密钥对
ssh-copy-id root@10.0.0.7
ssh-copy-id root@10.0.0.8

# 3. 创建部署脚本目录
mkdir -p /my_shell
```



### 2.3 Web服务器配置

```bash
# 安装Nginx（在Web7和Web8上执行）
yum install nginx -y

# 创建代码存放目录
mkdir -p /code

# 配置Nginx虚拟主机
cat > /etc/nginx/conf.d/monitor.conf <<'EOF'
server{
    listen 80;
    server_name _;
    location / {
        root /code/web/智慧城市/智慧工地;
        index index.html;
    }
}
EOF

# 重启Nginx
pkill -9 nginx
systemctl restart nginx
```



## 三、Jenkins流水线配置

### 3.1 创建Jenkins任务

1. **新建项目** → **自由风格项目**

   - 项目名称：`html-deploy`
   - 描述：自动化部署静态网站

2. **源码管理配置**

   text

   ```
   源码管理：Git
   Repository URL: http://10.0.0.99/chaoge/linux0224_html.git
   分支：*/master
   凭证：添加GitLab账号密码
   ```

   

### 3.2 部署脚本编写

在Jenkins机器上创建部署脚本：

```bash
#!/bin/bash
# filename: /my_shell/html.sh
# author: www.yuchaoit.cn

# 1. 进入代码目录，打包传输
DATE=$(date +%Y-%m-%d-%H-%M-%S)
web_server_list="10.0.0.7 10.0.0.8"

get_code(){
    cd ${WORKSPACE} && \
    tar czf /opt/web-${DATE}.tar.gz ./*
}

# 2. 代码发送到Web集群
# 基于软连接实现版本切换和回滚
scp_web_server(){
    for host in $web_server_list
    do
        # 传输代码包
        scp /opt/web-${DATE}.tar.gz root@$host:/opt/
        
        # 解压到版本目录
        ssh root@$host "mkdir -p /code/web-${DATE} && \
                        tar -zxf /opt/web-${DATE}.tar.gz -C /code/web-${DATE}"
        
        # 更新软链接（原子操作）
        ssh root@$host "rm -rf /code/web && \
                        ln -s /code/web-${DATE} /code/web"
        
        echo "已部署到服务器: $host"
    done
}

deploy(){
    get_code
    scp_web_server
}

# 执行入口
deploy
```



### 3.3 Jenkins构建配置

1. **构建触发器**：Poll SCM（可选，定期检查代码变更）

2. **构建环境**：

   - Delete workspace before build starts（可选，清理工作空间）

3. **构建步骤**：

   text

   ```
   执行shell：
   /my_shell/html.sh
   ```

   

### 3.4 常见问题解决

```bash
# 1. Host key verification failed 错误
# 解决方法：在Jenkins机器上手动SSH连接一次Web服务器
ssh root@10.0.0.7 "exit"
ssh root@10.0.0.8 "exit"

# 2. 权限问题
# 确保Jenkins用户有执行脚本权限
chmod +x /my_shell/html.sh

# 3. 网络连接问题
# 检查防火墙和网络连通性
ping 10.0.0.7
ping 10.0.0.8
```



## 四、WebHook自动化触发配置

### 4.1 Jenkins配置WebHook

1. **安装插件**：GitLab Plugin（如未安装）
2. **项目配置**：
   - 勾选"Build when a change is pushed to GitLab"
   - 生成Secret token，例如：`095212d20ac3a465641d2331b0086432`
   - WebHook URL：`http://10.0.0.101:8080/project/html-deploy`

### 4.2 GitLab配置WebHook

1. **进入项目设置** → **WebHooks**

2. **添加WebHook**：

   text

   ```
   URL: http://10.0.0.101:8080/project/html-deploy
   Secret Token: 095212d20ac3a465641d2331b0086432
   触发事件：Push events
   ```

   

3. **启用SSL验证**：取消勾选（内网环境）

4. **测试连接**：点击"Test"，确认返回HTTP 200

### 4.3 本地网络请求配置

在GitLab服务器上允许本地网络请求：

```bash
# 编辑GitLab配置文件
vim /etc/gitlab/gitlab.rb

# 添加配置
gitlab_rails['webhook_allow_localhost'] = true
gitlab_rails['allow_local_requests_from_web_hooks_and_services'] = true

# 重新配置GitLab
gitlab-ctl reconfigure
```



## 五、完整工作流程

### 5.1 开发人员工作流

```bash
# 1. 克隆代码
git clone http://10.0.0.99/chaoge/linux0224_html.git

# 2. 修改代码
vim index.html

# 3. 提交更改
git add .
git commit -m "更新页面内容"

# 4. 推送代码（触发自动化部署）
git push origin master

# 注意：如遇代码冲突
git pull origin master
# 手动解决冲突后重新提交
```



### 5.2 自动化部署流程

```text
1. 开发人员推送代码到GitLab
2. GitLab触发WebHook通知Jenkins
3. Jenkins拉取最新代码
4. 执行部署脚本：
   - 打包代码
   - 传输到Web服务器
   - 解压到版本目录
   - 更新软链接
5. 访问网站验证更新
```



### 5.3 版本回滚机制

```bash
# 如果需要回滚到上一个版本
# 在Web服务器上执行：
rm /code/web
ln -s /code/web-<previous-date> /code/web

# 示例：回滚到2024-01-04版本
rm /code/web
ln -s /code/web-2024-01-04-15-30-00 /code/web
```



## 六、测试验证

### 6.1 首次构建测试

1. 在Jenkins中点击"Build Now"

2. 查看控制台输出，确认部署成功

3. 访问测试：

   text

   ```
   http://10.0.0.7
   http://10.0.0.8
   ```

   

### 6.2 WebHook触发测试

1. 修改代码并推送到GitLab
2. 观察Jenkins自动触发构建
3. 验证网站内容已更新

### 6.3 多版本验证

1. 多次修改和推送代码

2. 检查Web服务器上的版本目录：

   bash

   ```
   ls -la /code/
   # 应看到类似结构：
   # web -> web-2024-01-05-10-30-00
   # web-2024-01-05-10-30-00
   # web-2024-01-05-09-45-00
   ```

   

## 七、优化建议

### 7.1 脚本优化

```bash
# 添加错误处理和日志记录
set -e  # 遇到错误立即退出
set -o pipefail  # 管道命令错误也会被捕获

# 添加日志记录
log_file="/var/log/deploy-${DATE}.log"
exec > >(tee -a "$log_file") 2>&1

# 添加清理旧版本功能（保留最近5个版本）
clean_old_versions(){
    for host in $web_server_list
    do
        ssh root@$host "cd /code && ls -td web-* | tail -n +6 | xargs rm -rf"
    done
}
```



### 7.2 安全优化

1. **使用非root用户**：创建专用部署用户
2. **SSH密钥管理**：使用部署专用密钥
3. **网络隔离**：限制Jenkins到Web服务器的访问
4. **代码验证**：添加代码扫描和安全检查

### 7.3 扩展功能

1. **多环境部署**：添加测试环境、预生产环境
2. **蓝绿部署**：实现零停机部署
3. **监控告警**：集成监控系统，部署失败时告警
4. **通知机制**：部署成功/失败时发送通知（邮件、钉钉、Slack）

## 八、故障排查

### 常见问题及解决方案

| 问题                                   | 可能原因          | 解决方案                       |
| :------------------------------------- | :---------------- | :----------------------------- |
| 构建失败：Host key verification failed | SSH首次连接未确认 | 手动SSH连接一次目标服务器      |
| WebHook未触发                          | GitLab配置错误    | 检查URL、Token、网络连通性     |
| Nginx 403错误                          | 文件权限问题      | 检查Nginx用户对代码目录的权限  |
| 部署后页面未更新                       | 软链接错误        | 检查软链接是否指向正确版本目录 |
| Jenkins无法拉取代码                    | 凭证错误          | 重新配置GitLab访问凭证         |

## 九、总结

通过本实践，您已掌握：

1. GitLab + Jenkins + Nginx 的CI/CD流水线搭建
2. 自动化部署脚本编写
3. WebHook配置实现自动触发
4. 多服务器批量部署
5. 版本管理和回滚机制

这套自动化部署方案可应用于各种静态资源部署场景，通过简单的修改即可适配不同的项目需求。

------

**后续学习建议**：

1. 学习使用Jenkins Pipeline（声明式/脚本式）
2. 探索容器化部署（Docker + Kubernetes）
3. 了解基础设施即代码（Terraform、Ansible）
4. 实践微服务架构的CI/CD