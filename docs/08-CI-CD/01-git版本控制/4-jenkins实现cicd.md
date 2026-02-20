# Jenkins 实现 CI/CD 流水线

## 1. Jenkins 简介

Jenkins 是一个开源的、可扩展的持续集成（CI）和持续交付（CD）引擎，通过自动化构建、测试和部署流程，提高软件开发效率。它提供了丰富的插件生态系统（超过1000个插件），支持与各种开发、测试和部署工具集成。

### 主要特性：

- **简易安装**：基于 Java 的独立程序，支持 Windows、Mac OS X 和各类 Unix 系统。
- **配置简单**：通过 Web 界面轻松配置，支持即时错误检查和内置帮助。
- **插件丰富**：通过插件集成 CI/CD 工具链中的几乎所有工具。
- **分布式构建**：支持在多台机器上分布式执行任务，加速构建、测试和部署流程。

---

## 2. 传统部署方式 vs Jenkins 自动化部署

### 传统部署方式：

- 开发人员将代码上传至 Git 仓库（如 GitHub）。
- 运维人员手动或通过脚本从服务器下载代码并部署。
- 需要编写 Shell 脚本实现拉取代码、环境部署和程序运行。

### Jenkins 自动化部署：

- 实现自动化 CI/CD 流水线，从代码提交到部署全流程自动化。
- 支持与 GitLab 等代码仓库集成，自动触发构建和部署任务。

---

## 3. Jenkins 安装与配置

### 环境准备：

- 操作系统：CentOS 7
- IP 地址：10.0.0.100
- 默认端口：8080（确保端口未被占用）

---

### 安装步骤：

1. **安装 JDK**（Jenkins 基于 Java 开发）：

   ```bash
   rpm -ivh jdk-8u181-linux-x64.rpm
   ```

2. **安装 Jenkins**：

   ```bash
   rpm -ivh jenkins-2.499-1.1.noarch.rpm
   ```

3. **启动 Jenkins**：

   ```bash
   systemctl start jenkins
   systemctl enable jenkins
   ```

4. **检查运行状态**：

   ```bash
   netstat -tunlp | grep 8080
   ```

---

### 配置文件说明：

- **主配置文件**：`/etc/sysconfig/jenkins`
- **Jenkins 主目录**：`/var/lib/jenkins`
- **日志文件**：`/var/log/jenkins/jenkins.log`
- **初始密码文件**：`/var/lib/jenkins/secrets/initialAdminPassword`

---

### 初始访问：

1. 浏览器访问 `http://10.0.0.100:8080`
2. 输入初始密码（从上述密码文件中获取）
3. 安装推荐插件或跳过（建议离线导入插件）

---

## 4. Jenkins 插件管理

### 离线安装插件：

1. 下载插件包（可从官网或镜像站获取）。

2. 解压插件到 `/var/lib/jenkins/plugins/` 目录。

3. 重启 Jenkins 服务：

   ```bash
   systemctl restart jenkins
   ```

---

### 修改执行用户（可选）：

在 `/etc/sysconfig/jenkins` 中修改 `JENKINS_USER="root"`，重启服务生效。

---

## 5. 基础任务创建与执行

### 创建自由风格任务：

1. 点击"新建任务"，输入任务名称（如 `test-job`）。
2. 选择"自由风格项目"，点击确定。
3. 在"构建"部分添加"执行 Shell"步骤。

---

### 示例 Shell 脚本：

```bash
echo "当前主机名：$(hostname)"
echo "工作目录：$(pwd)"
echo "Jenkins 内置变量："
echo "JOB_NAME: ${JOB_NAME}"
echo "BUILD_ID: ${BUILD_ID}"
echo "WORKSPACE: ${WORKSPACE}"
```

---

### 执行与查看结果：

- 点击"立即构建"执行任务。
- 查看控制台输出，验证命令执行情况。
- 工作区路径：`/var/lib/jenkins/workspace/<任务名>/`

---

## 6. Jenkins 远程执行与免密配置

### 配置 SSH 免密登录：

1. 在 Jenkins 服务器生成 SSH 密钥：

   ```bash
   ssh-keygen -t rsa -b 2048 -N "" -f /root/.ssh/id_rsa
   ```

2. 将公钥复制到目标服务器：

   ```bash
   ssh-copy-id root@10.0.0.7
   ```

---

### 在任务中远程执行命令：

在 Shell 步骤中添加：

```bash
ssh root@10.0.0.7 "hostname && date"
```

---

## 7. Jenkins 与 GitLab 集成实现 CI/CD

### 集成流程：

1. **开发人员在 GitLab 提交代码**。
2. **Jenkins 自动拉取代码**。
3. **执行构建、测试和部署任务**。

---

### 配置步骤：

#### 1. GitLab 项目准备：

- 在 GitLab 创建项目（如 `my_flask`）。
- 开发人员推送 Flask 应用代码至仓库。

---

#### 2. Jenkins 任务配置：

- 创建自由风格任务，配置 Git 仓库地址。
- 添加认证方式（SSH 密钥或用户名/密码）。

---

#### 3. 部署脚本示例（Python Flask）：

```bash
#!/bin/bash
# 部署 Flask 应用到目标服务器
cd /opt/linux0224_python/
pip3 install flask
# 停止旧进程
pkill -f py1.py
# 启动新进程
nohup python3 py1.py > nohup.log 2>&1 &
```

---

#### 4. Jenkins 任务中的部署步骤：

```bash
# 发送代码到目标服务器
scp -r ${WORKSPACE}/* root@10.0.0.7:/opt/linux0224_python/
# 执行部署脚本
ssh root@10.0.0.7 "cd /opt/linux0224_python && bash deploy.sh"
```

---

## 8. 高级功能与最佳实践

### 1. 流水线（Pipeline）任务：

- 使用 Jenkinsfile 定义完整的 CI/CD 流程。
- 支持多阶段、并行执行和错误处理。

---

### 2. 参数化构建：

- 支持动态输入参数（如版本号、环境变量）。
- 提高任务灵活性和复用性。

---

### 3. 分布式构建：

- 配置多个 Agent 节点，分担构建负载。
- 支持不同环境（如 Linux、Windows）的构建任务。

---

### 4. 集成通知：

- 配置邮件、Slack 等通知插件。
- 实时反馈构建状态。

---

## 9. 故障排除与维护

### 常见问题：

1. **Jenkins 启动失败**：检查端口冲突、Java 环境。
2. **插件安装失败**：更换镜像源或离线安装。
3. **Git 拉取失败**：检查网络、认证配置。
4. **远程执行失败**：检查 SSH 免密配置、防火墙。

---

### 日志查看：

```bash
tail -f /var/log/jenkins/jenkins.log
```

---

## 10. 总结

Jenkins 作为 CI/CD 的核心工具，通过自动化构建、测试和部署流程，显著提升软件交付效率。结合 GitLab 等代码管理工具，可以实现从代码提交到生产部署的全流程自动化。掌握 Jenkins 的基础配置、任务管理和插件使用，是现代化 DevOps 实践的重要技能。
