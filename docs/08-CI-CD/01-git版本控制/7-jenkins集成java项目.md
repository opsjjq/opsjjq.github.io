# Jenkins集成Java项目自动化部署指南

## 一、Java项目部署概述

### 1.1 Java项目特点

- Java是一种编译型语言，需要将源码编译为可执行文件
- Spring Boot是当前主流的Java Web开发框架
- Spring Boot内置Tomcat服务器，在`<mirrors>`部分添加：简化了部署流程

### 1.2 Java项目部署方式对比

| 部署方式    | 文件类型 | 是否需要Tomcat | 部署命令                | 适用场景           |
| :---------- | :------- | :------------- | :---------------------- | :----------------- |
| 传统方式    | WAR包    | 需要           | 放入Tomcat的webapps目录 | 传统企业项目       |
| Spring Boot | JAR包    | 不需要（内置） | java -jar *.jar         | 互联网公司快速迭代 |

### 1.3 Spring Boot项目优势

- 内置Tomcat，无需额外安装应用服务器
- 简化配置，约定优于配置
- 易于打包和部署，一个JAR包包含所有依赖

## 二、环境准备与架构设计

### 2.1 系统架构

```text
开发人员 → GitLab代码仓库 → Jenkins CI/CD → Web服务器集群
                                     ↓
                                自动化部署脚本
```



### 2.2 服务器规划

| 服务器        | IP地址     | 角色       | 所需软件                     |
| :------------ | :--------- | :--------- | :--------------------------- |
| Jenkins服务器 | 10.0.0.101 | 构建服务器 | Jenkins + Git + Maven + Java |
| GitLab服务器  | 10.0.0.99  | 代码仓库   | GitLab                       |
| Web服务器1    | 10.0.0.7   | 生产环境   | Java + 部署脚本              |
| Web服务器2    | 10.0.0.8   | 生产环境   | Java + 部署脚本              |

## 三、环境配置

### 3.1 Java环境安装（所有Web服务器）

```bash
# 检查Java环境
java -version

# 如未安装，安装Java
yum install java-1.8.0-openjdk -y
```



### 3.2 Maven环境配置（Jenkins服务器）

#### 3.2.1 安装Maven

```bash
cd /opt
wget https://archive.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
tar -xf apache-maven-3.3.9-bin.tar.gz
ln -s /opt/apache-maven-3.3.9 /usr/local/maven
echo 'export PATH=/usr/local/maven/bin:$PATH' >> /etc/profile
source /etc/profile

# 验证安装
mvn -version
```



#### 3.2.2 配置阿里云Maven镜像

```bash
vim /usr/local/maven/conf/settings.xml
```



在`<mirrors>`部分添加：

```xml
<mirror>
    <id>alimaven</id>
    <mirrorOf>central</mirrorOf>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
</mirror>
```



### 3.3 Jenkins插件安装

1. **必须插件**：
   - Git plugin
   - Maven Integration plugin
   - Publish Over SSH
2. **手动安装Publish Over SSH插件**：
   - 下载插件：`publish-over-ssh.hpi`
   - Jenkins → 系统管理 → 插件管理 → 高级 → 上传插件

### 3.4 SSH免密配置

```bash
# 在Jenkins服务器执行
ssh-keygen -t rsa
ssh-copy-id root@10.0.0.7
ssh-copy-id root@10.0.0.8

# 测试SSH连接
ssh root@10.0.0.7 "hostname"
ssh root@10.0.0.8 "hostname"
```



### 3.5 Jenkins SSH配置

1. **添加SSH私钥**：

   ```text
   Jenkins → 系统管理 → 系统配置
   Publish over SSH → SSH Servers
   ```

   

   - Name: web-servers
   - Hostname: 10.0.0.7,10.0.0.8
   - Username: root
   - Remote Directory: /opt/sh-jenkins
   - 添加Private Key

## 四、GitLab仓库准备

### 4.1 创建项目

1. 登录GitLab
2. 新建项目 → Import project
3. 填入示例项目URL：`https://gitee.com/yuco/springboot-test.git`
4. 项目名称：`springboot-test`

### 4.2 项目结构说明

```text
springboot-test/
├── pom.xml          # Maven配置文件
├── src/             # 源代码目录
│   ├── main/
│   │   ├── java/    # Java源码
│   │   └── resources/ # 配置文件
│   └── test/        # 测试代码
└── target/          # 编译输出目录（构建后生成）
```



## 五、Jenkins任务配置

### 5.1 创建Maven项目

1. **新建任务** → **构建一个Maven项目**
2. 任务名称：`java-springboot-deploy`
3. 描述：Spring Boot项目自动化部署

### 5.2 源码管理配置

```text
Git → Repository URL: http://10.0.0.99/chaoge/springboot-test.git
凭证：添加GitLab用户名密码
分支：*/master
```



### 5.3 构建触发器配置

```text
☑️ Build when a change is pushed to GitLab
Secret token: 生成并保存（示例：71def90efe52f31ac2d142600243eff1）
WebHook URL: http://10.0.0.101:8080/project/java-springboot-deploy
```



### 5.4 构建环境配置

```text
Root POM: pom.xml
Goals and options: clean install -Dmaven.test.skip=true
```



### 5.5 构建后操作 - SSH发布

1. **增加构建后操作步骤** → **Send build artifacts over SSH**

2. 配置参数：

   ```text
   SSH Server: web-servers
   Transfer Set:
     Source files: target/springboot-helloword-1.jar
     Remove prefix: target/
     Remote directory: 
     Exec command: /opt/sh-jenkins/deploy-java.sh
   ```

   

## 六、部署脚本开发

### 6.1 Web服务器部署脚本

在Web服务器（10.0.0.7和10.0.0.8）上创建：

```bash
# 创建脚本目录
mkdir -p /opt/sh-jenkins

# 创建部署脚本
cat > /opt/sh-jenkins/deploy-java.sh << 'EOF'
#!/bin/bash

# 格式化时间
DATE=$(date +%Y%m%d)

# 程序目录配置
DIR=/usr/local/app
JARFILE=springboot-helloword-1.jar

# 创建备份目录
if [ ! -d $DIR/backup ];then
   mkdir -p $DIR/backup
fi

# 进入应用目录
cd $DIR

# 停止旧进程
echo "停止旧进程..."
ps -ef | grep $JARFILE | grep -v grep | awk '{print $2}' | xargs -i kill -9 {} || true

# 备份旧程序
if [ -f $JARFILE ]; then
    echo "备份旧版本..."
    mv $JARFILE $DIR/backup/$JARFILE.$DATE
fi

# 部署新程序
echo "部署新版本..."
mv -f /opt/sh-jenkins/$JARFILE .

# 检查Java环境
if ! command -v java &> /dev/null; then
    echo "安装Java环境..."
    yum install java-1.8.0-openjdk -y
fi

# 启动新程序
echo "启动服务..."
nohup java -server -Xms512M -Xmx512M \
    -Dserver.port=18888 \
    -jar $JARFILE > $DIR/out.log 2>&1 &

# 等待启动
sleep 10

# 检查进程
if ps -ef | grep -v grep | grep -q $JARFILE; then
    echo "服务启动成功！PID: $(ps -ef | grep $JARFILE | grep -v grep | awk '{print $2}')"
    
    # 清理旧备份（保留最近5个）
    cd $DIR/backup
    ls -lt *.jar | awk 'NR>5{print $NF}' | xargs rm -f 2>/dev/null || true
    echo "旧版本清理完成"
else
    echo "服务启动失败，检查日志..."
    tail -50 $DIR/out.log
    exit 1
fi

echo "部署完成！"
EOF

# 添加执行权限
chmod +x /opt/sh-jenkins/deploy-java.sh

# 创建应用目录
mkdir -p /usr/local/app
```



### 6.2 脚本功能说明

1. **版本管理**：自动备份旧版本JAR文件
2. **进程管理**：优雅停止旧进程，启动新进程
3. **环境检查**：自动检测并安装Java环境
4. **日志记录**：记录启动日志便于排查问题
5. **清理机制**：自动清理历史备份文件（保留最近5个）

## 七、GitLab WebHook配置

### 7.1 配置WebHook

1. 登录GitLab，进入项目设置

2. WebHooks → Add new webhook

3. 配置参数：

   ```text
   URL: http://10.0.0.101:8080/project/java-springboot-deploy
   Secret Token: 71def90efe52f31ac2d142600243eff1
   Trigger: Push events
   SSL verification: Disable (内网环境)
   ```

   

### 7.2 测试WebHook

点击"Test"按钮，确认返回HTTP 200状态码

### 7.3 允许本地网络请求

```bash
# 在GitLab服务器执行
vim /etc/gitlab/gitlab.rb

# 添加配置
gitlab_rails['webhook_allow_localhost'] = true
gitlab_rails['allow_local_requests_from_web_hooks_and_services'] = true

# 重新配置
gitlab-ctl reconfigure
```



## 八、测试与验证

### 8.1 手动构建测试

1. Jenkins → java-springboot-deploy → Build Now
2. 查看控制台输出，确认：
   - 代码拉取成功
   - Maven编译成功
   - JAR文件传输成功
   - 远程脚本执行成功

### 8.2 验证服务状态

```bash
# 在Web服务器上检查
ps -ef | grep springboot-helloword-1.jar
netstat -tlnp | grep 18888

# 访问服务
curl http://localhost:18888/say
```



### 8.3 WebHook自动化测试

1. 修改代码并提交：

   ```bash
   git clone http://10.0.0.99/chaoge/springboot-test.git
   cd springboot-test
   # 修改代码...
   git add .
   git commit -m "测试自动部署"
   git push origin master
   ```

   

2. 观察Jenkins自动触发构建

## 九、故障排查指南

### 9.1 常见问题及解决方案

| 问题          | 可能原因              | 解决方案                      |
| :------------ | :-------------------- | :---------------------------- |
| Maven编译失败 | 网络问题/依赖下载失败 | 检查Maven镜像配置，网络连通性 |
| SSH连接失败   | 密钥配置错误/网络问题 | 测试SSH免密登录，检查防火墙   |
| 服务启动失败  | Java环境问题/端口冲突 | 检查Java安装，端口占用情况    |
| WebHook不触发 | GitLab配置错误        | 检查URL、Token、网络连通性    |
| 文件传输失败  | 权限问题/路径错误     | 检查远程目录权限和路径        |

### 9.2 调试技巧

1. **查看Jenkins日志**：

   text

   ```
   Jenkins → 构建历史 → 控制台输出
   ```

   

2. **检查远程执行**：

   bash

   ```
   # 在Web服务器查看脚本执行日志
   tail -f /usr/local/app/out.log
   ```

   

3. **手动测试脚本**：

   bash

   ```
   # 在Web服务器手动执行
   cd /opt/sh-jenkins
   ./deploy-java.sh
   ```

   

## 十、优化建议

### 10.1 安全优化

1. **使用专用用户**：创建jenkins用户代替root
2. **最小权限原则**：限制SSH访问权限
3. **密钥管理**：定期更换SSH密钥

### 10.2 性能优化

1. **Maven缓存**：配置本地Maven仓库缓存
2. **并行构建**：配置多个构建节点
3. **增量部署**：仅传输变更文件

### 10.3 功能扩展

1. **通知集成**：添加钉钉/企业微信通知
2. **健康检查**：添加服务健康检查机制
3. **回滚机制**：添加一键回滚功能
4. **多环境部署**：支持测试/预生产/生产环境

## 十一、总结

通过本文档，已经完成了：

1. ✅ 搭建完整的Java项目CI/CD流水线
2. ✅ 配置GitLab + Jenkins自动化构建
3. ✅ 实现Spring Boot项目的自动化部署
4. ✅ 掌握多服务器批量部署方案
5. ✅ 建立版本管理和回滚机制
