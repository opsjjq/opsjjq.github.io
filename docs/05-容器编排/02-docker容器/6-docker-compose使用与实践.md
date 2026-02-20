# Docker Compose 使用与实践

## 一、Docker Compose 安装与基础

### 安装方法

```bash
# 下载最新版 Docker Compose
curl -o /opt/docker-compose https://github.com/docker/compose/releases/download/v5.0.1/docker-compose-linux-x86_64

# 添加执行权限
chmod +x /opt/docker-compose

# 创建软链接（方便全局调用）
ln -s /opt/docker-compose /usr/local/bin/docker-compose

# 验证安装
docker-compose -v
# 输出：Docker Compose version v5.0.1
```

---

### 官方文档参考

- [Compose 文件参考](https://docs.docker.com/reference/compose-file)
- [服务配置关键字](https://docs.docker.com/reference/compose-file/services/#labels)

---

## 二、docker-compose.yml 核心关键字详解

### 1. service - 服务定义

```yaml
services:
  app:
    image: nginx:latest
```

---

### 2. command - 覆盖默认命令

```yaml
services:
  test:
    image: busybox
    command: echo "项目名称: ${COMPOSE_PROJECT_NAME}"
```

---

### 3. configs - 配置文件管理

```yaml
services:
  redis:
    image: redis:latest
    configs:
      - redis_config
      - app_config

configs:
  redis_config:
    file: ./redis.conf
  app_config:
    external: true  # 引用外部已创建的配置
```

---

### 4. container_name - 容器命名

```yaml
services:
  web:
    image: nginx
    container_name: my-nginx-container
```

---

### 5. depends_on - 服务依赖关系

```yaml
services:
  web:
    image: nginx
    depends_on:
      - api
      - database

  api:
    image: node:18

  database:
    image: postgres:15
# 启动顺序：database → api → web
# 停止顺序：web → api → database
```

---

### 6. devices - 设备映射

```yaml
services:
  serial-app:
    image: ubuntu
    devices:
      - "/dev/ttyUSB0:/dev/ttyUSB0"
```

---

### 7. dns - 自定义 DNS

```yaml
services:
  app:
    image: nginx
    dns: 8.8.8.8
    # 或使用列表
    dns:
      - 8.8.8.8
      - 1.1.1.1
```

---

### 8. entrypoint - 入口点覆盖

```yaml
services:
  app:
    image: alpine
    entrypoint: /app/start.sh
    # 或使用列表格式
    entrypoint:
      - /bin/sh
      - -c
      - "echo Starting..."
```

---

### 9. env_file 与 environment - 环境变量

```yaml
services:
  app:
    image: node:18
    env_file:
      - .env.production
      - .env.override  # 后加载的覆盖前面的
    environment:
      - NODE_ENV=production
      - DEBUG=false
```

---

### 10. networks - 网络配置

```yaml
services:
  frontend:
    image: nginx
    networks:
      - front-tier
      - back-tier

networks:
  front-tier:
    driver: bridge
  back-tier:
    driver: bridge
```

---

### 11. ports - 端口映射

```yaml
services:
  web:
    image: nginx
    ports:
      - "80:80"                    # 标准映射
      - "8080:80"                  # 主机 8080→容器 80
      - "127.0.0.1:3000:3000"     # 仅本地访问
      - "0.0.0.0:443:443"         # 所有网络接口
```

---

### 12. volumes - 数据卷

```yaml
services:
  database:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data  # 命名卷
      - ./config:/etc/postgresql                # 主机目录
      - /opt/data:/app/data                     # 绝对路径

volumes:
  postgres_data:  # 声明命名卷
```

---

### 13. restart - 重启策略

```yaml
services:
  app:
    image: nginx
    restart: always  # 选项：no, always, on-failure, unless-stopped
```

---

### 14. deploy - 部署配置（Swarm 模式）

```yaml
services:
  app:
    image: nginx
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

---

## 三、实践案例集锦

### 案例 1：Python Flask + Redis 访问计数器

**项目结构**：

```text
/flask-redis/
├── flask-redis.py
├── requirements.txt
└── docker-compose.yml
```

---

**应用代码（flask-redis.py）**：

```python
from flask import Flask
from redis import Redis

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

@app.route('/')
def hello():
    count = redis.incr('visits')
    return f'本页面已被访问 {count} 次\n'

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

---

**docker-compose.yml**：

```yaml
services:
  webapp:
    image: python:3.9
    container_name: flask-app
    working_dir: /app
    ports:
      - "5000:5000"
    volumes:
      - ./flask-redis.py:/app/app.py
      - ./requirements.txt:/app/requirements.txt
    command: >
      sh -c "pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/ &&
             python app.py"
    networks:
      - app-network
    depends_on:
      - redis

  redis:
    image: redis:latest
    container_name: redis-cache
    ports:
      - "6379:6379"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

---

**运行与测试**：

```bash
# 启动服务
docker-compose up -d

# 测试访问
curl http://localhost:5000
# 输出：本页面已被访问 1 次
```

---

### 案例 2：Zabbix 监控平台

**docker-compose.yml**：

```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: "123456"
      MYSQL_DATABASE: zabbix
      MYSQL_USER: zabbix
      MYSQL_PASSWORD: zabbix
    volumes:
      - zabbix_mysql:/var/lib/mysql
      - ./my.cnf:/etc/my.cnf
    ports:
      - "3307:3306"
    networks:
      - zabbix-net

  zabbix-server:
    image: zabbix/zabbix-server-mysql:latest
    environment:
      DB_SERVER_HOST: "mysql"
      MYSQL_USER: "zabbix"
      MYSQL_PASSWORD: "zabbix"
    ports:
      - "10051:10051"
    networks:
      - zabbix-net
    depends_on:
      - mysql

  zabbix-web:
    image: zabbix/zabbix-web-nginx-mysql:latest
    environment:
      DB_SERVER_HOST: "mysql"
      MYSQL_USER: "zabbix"
      MYSQL_PASSWORD: "zabbix"
      ZBX_SERVER_HOST: "zabbix-server"
      PHP_TZ: "Asia/Shanghai"
    ports:
      - "8777:8080"
    networks:
      - zabbix-net
    depends_on:
      - mysql
      - zabbix-server

volumes:
  zabbix_mysql:

networks:
  zabbix-net:
```

---

**MySQL 配置文件（my.cnf）**：

```ini
[mysqld]
port=3306
character_set_server=utf8mb4
collation-server=utf8mb4_bin
log_bin_trust_function_creators=1
max_allowed_packet=64M
innodb_buffer_pool_size=512M
```

---

### 案例 3：WordPress 博客系统

**docker-compose.yml**：

```yaml
services:
  db:
    image: mysql:8.0
    command: --default_authentication_plugin=mysql_native_password
    volumes:
      - wp_db:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8001:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_content:/var/www/html/wp-content

volumes:
  wp_db:
  wp_content:
```

---

### 案例 4：Jenkins CI/CD 平台

**jenkins-compose.yml**：

```yaml
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins-ci
    privileged: true
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - /data/jenkins:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
      - /root/.ssh:/root/.ssh
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false
```

---

### 案例 5：GitLab 代码仓库

**gitlab-compose.yml**：

```yaml
services:
  postgresql:
    image: postgres:16
    environment:
      POSTGRES_USER: gitlab
      POSTGRES_PASSWORD: password
      POSTGRES_DB: gitlabhq_production
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

  gitlab:
    image: gitlab/gitlab-ce:latest
    depends_on:
      - postgresql
      - redis
    ports:
      - "89:80"
      - "10022:22"
    volumes:
      - gitlab_data:/var/opt/gitlab
      - gitlab_logs:/var/log/gitlab
      - gitlab_config:/etc/gitlab
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://10.0.0.200:89'
        gitlab_rails['gitlab_shell_ssh_port'] = 10022

volumes:
  postgres_data:
  redis_data:
  gitlab_data:
  gitlab_logs:
  gitlab_config:
```

---

## 四、CI/CD 流水线实践

### GitLab + Jenkins 自动化部署流程

**1. GitLab 仓库配置**

```bash
# 初始化本地仓库
git init
git remote add origin http://10.0.0.200:89/root/myapp.git

# 推送代码
echo "# My Application" > README.md
git add .
git commit -m "Initial commit"
git push -u origin master
```

---

**2. Jenkins 任务配置**

```text
项目类型：流水线项目
源码管理：Git
仓库 URL：http://10.0.0.200:89/root/myapp.git
构建触发器：GitLab webhook
```

---

**3. Jenkins Pipeline 脚本**

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'http://10.0.0.200:89/root/myapp.git',
                    credentialsId: 'gitlab-credentials'
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t myapp:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop myapp || true
                    docker rm myapp || true
                    docker run -d \
                      --name myapp \
                      -p 8080:80 \
                      -v ${WORKSPACE}:/usr/share/nginx/html \
                      nginx:latest
                '''
            }
        }
    }
}
```

---

**4. GitLab Webhook 配置**

```text
URL: http://jenkins-server:8080/project/myapp
Secret Token: [Jenkins 生成的 token]
触发事件：Push events, Merge request events
```

---

## 五、故障排查与最佳实践

### 常见问题解决

**1. MySQL 权限问题**

```bash
# 编辑 my.cnf 添加
[mysqld]
log_bin_trust_function_creators=1
```

---

**2. 清理残留数据**

```bash
# 完全清理 Compose 项目
docker-compose down -v  # 删除容器、网络和卷
docker system prune -a  # 清理所有未使用资源
```

---

**3. 查看服务日志**

```bash
docker-compose logs -f [service_name]
docker-compose logs --tail=100 web
```

---

### 最佳实践建议

1. **环境分离**：使用不同 compose 文件管理开发/生产环境
2. **数据持久化**：对数据库等有状态服务使用命名卷
3. **资源限制**：为生产环境服务配置 CPU/内存限制
4. **健康检查**：添加 healthcheck 确保服务可用性
5. **版本控制**：将 docker-compose.yml 纳入 Git 管理
6. **网络隔离**：为不同项目创建独立网络
7. **敏感信息**：使用 secrets 或环境变量文件管理密码
8. **镜像标签**：使用特定版本标签而非 latest

---

### 常用命令速查

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 执行命令
docker-compose exec service_name command

# 构建镜像
docker-compose build

# 拉取镜像
docker-compose pull

# 重启服务
docker-compose restart

# 扩展实例
docker-compose up -d --scale web=3
```
