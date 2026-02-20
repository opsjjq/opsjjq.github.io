# Jumpserver 堡垒机重启部署指南

## 系统重启后组件启动顺序与问题排查

### 1. 系统重启后状态检查

#### 数据库服务器 (db-51)

```bash
# 检查服务状态
netstat -tunlp
# 应看到：
# - MySQL: 3306 端口
# - Redis: 6379 端口
```



#### 管理服务器 (master-61)

```bash
# 初始状态只应有基础服务
netstat -tunlp
# 应看到：
# - SSH: 22 端口
# - Postfix: 25 端口
```



### 2. 组件启动顺序与依赖关系

```text
1. Core后端服务 (Python)
2. Lina前端服务 (Vue.js)
3. Luna网页终端服务 (Angular)
4. Koko SSH服务 (Golang)
5. Lion VNC服务 (Golang + Guacamole)
6. Nginx反向代理
```



### 3. Core 后端服务启动

```bash
# 1. 进入项目目录
cd /opt/jumpserver-v2.12.0

# 2. 激活虚拟环境
source /opt/venv_py3/bin/activate

# 3. 检查内存（至少需要4G）
free -m

# 4. 启动所有Core服务
./jms start all -d

# 5. 验证服务状态
./jms status
# 应看到6个进程运行：
# - gunicorn (HTTP服务)
# - flower (监控)
# - daphne (WebSocket)
# - celery_ansible (异步任务)
# - celery_default (默认异步任务)
# - beat (定时任务)

# 6. 检查端口
netstat -tunlp | grep -E '8080|8070|5555'
```



### 4. Lina 前端服务启动

```bash
# 1. 进入项目目录
cd /opt/lina-v2.12.0

# 2. 启动服务
nohup yarn serve &

# 3. 验证端口
netstat -tunlp | grep 9528
```



### 5. Luna 网页终端启动

```bash
# 1. 进入项目目录
cd /opt/luna-v2.12.0

# 2. 绑定到0.0.0.0以允许外部访问
nohup ng serve --proxy-config proxy.conf.json --host 0.0.0.0 &

# 3. 验证端口
netstat -tunlp | grep 4200
```



### 6. Koko SSH服务启动

```bash
# 1. 进入项目目录
cd /opt/koko-v2.12.0

# 2. 启动服务
./koko -f config.yml -d

# 3. 验证端口
netstat -tunlp | grep -E '5000|2222'

# 4. 查看日志
tail -f data/logs/koko.log
```



### 7. Lion VNC服务启动

```bash
# 1. 启动Guacamole服务
/etc/init.d/guacd start

# 2. 进入项目目录
cd /opt/lion-v2.12.0-linux-amd64

# 3. 启动服务
nohup ./lion -f config.yml &

# 4. 验证端口
netstat -tunlp | grep 8081
```



### 8. Nginx配置与启动

```bash
# 1. 配置主机名解析
echo "10.0.0.61 luna koko lion core lina" >> /etc/hosts

# 2. 测试配置
nginx -t

# 3. 重载配置
nginx -s reload

# 或重启服务
systemctl restart nginx
```



### 9. 访问验证

#### 统一入口

```text
http://10.0.0.61
```



#### 组件独立访问

- Lina前端: `http://10.0.0.61:9528`
- Luna终端: `http://10.0.0.61:4200`
- Core后端: `http://10.0.0.61:8080`

### 10. 常见问题排查

#### 问题1：前端无法访问后端API

```bash
# 查看Lina日志
tail -f /opt/lina-v2.12.0/nohup.out

# 常见错误：
# Proxy error: Could not proxy request /api/v1/settings/public/ 
# from 10.0.0.61:9528 to http://localhost:8080 (ECONNREFUSED)

# 解决方案：
# 1. 检查Core服务是否运行
# 2. 检查8080端口是否监听
```



#### 问题2：Luna无法访问Koko

```bash
# 查看Luna日志
tail -f /opt/luna-v2.12.0/nohup.out

# 常见错误：
# [HPM] Error occurred while trying to proxy request /koko/elfinder/sftp/ 
# from 10.0.0.61:4200 to http://localhost:5000 (ECONNREFUSED)

# 解决方案：
# 1. 检查Koko服务是否运行
# 2. 检查5000端口是否监听
```



#### 问题3：内存不足

```bash
# 检查内存使用
free -m

# Core服务大约需要1G内存
# 如果内存不足，可尝试：
# 1. 增加swap空间
# 2. 优化MySQL配置
# 3. 增加物理内存
```



#### 问题4：端口冲突

```bash
# 查看端口占用
netstat -tunlp | grep <端口号>

# 解决方案：
# 1. 停止冲突服务
# 2. 修改配置文件中的端口
```



### 11. 快速重启脚本

```bash
#!/bin/bash
# 快速重启Jumpserver所有组件

# 停止所有服务
pkill -f "yarn serve"
pkill -f "ng serve"
pkill -f "koko"
pkill -f "lion"
pkill -f "guacd"
cd /opt/jumpserver-v2.12.0 && ./jms stop all

# 启动Core服务
cd /opt/jumpserver-v2.12.0
source /opt/venv_py3/bin/activate
./jms start all -d
deactivate

# 启动Lina
cd /opt/lina-v2.12.0 && nohup yarn serve &

# 启动Luna
cd /opt/luna-v2.12.0 && nohup ng serve --proxy-config proxy.conf.json --host 0.0.0.0 &

# 启动Koko
cd /opt/koko-v2.12.0 && ./koko -f config.yml -d &

# 启动Lion
/etc/init.d/guacd start
cd /opt/lion-v2.12.0-linux-amd64 && nohup ./lion -f config.yml &

# 重启Nginx
nginx -s reload

echo "Jumpserver重启完成"
```



### 12. 监控要点

1. **进程状态监控**

   bash

   ```
   # Core进程
   /opt/jumpserver-v2.12.0/jms status
   
   # 端口监控
   netstat -tunlp | grep -E '9528|4200|8080|5000|2222|8081'
   ```

   

2. **日志监控**

   bash

   ```
   # Core日志
   tail -f /opt/jumpserver-v2.12.0/logs/*
   
   # Koko日志
   tail -f /opt/koko-v2.12.0/data/logs/koko.log
   
   # Lina/Luna日志
   tail -f /opt/lina-v2.12.0/nohup.out
   tail -f /opt/luna-v2.12.0/nohup.out
   ```

   

3. **资源监控**

   bash

   ```
   # 内存使用
   free -m
   
   # CPU使用
   top
   
   # 磁盘空间
   df -h
   ```

   

### 总结要点

1. **启动顺序是关键**：必须按照依赖关系顺序启动
2. **内存要求严格**：Core服务需要至少1G可用内存
3. **日志是排错关键**：组件间通信问题通过日志快速定位
4. **组件解耦设计**：各组件独立运行，故障隔离
5. **生产环境建议**：组件分离部署，使用域名解析，配置监控告警