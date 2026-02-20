# Docker 镜像构建指南

## 一、手动构建镜像

### 基本流程

```bash
# 1. 启动基础容器
docker run -it --name os1 centos:7.9.2009 bash

# 2. 容器内安装软件
curl -o /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
yum install nginx -y
yum clean all

# 3. 提交镜像
docker commit os1 my-nginx:v1
```

---

## 二、Dockerfile 构建镜像

### Dockerfile 基本语法

```dockerfile
# FROM：指定基础镜像
FROM centos:7.9.2009

# RUN：执行命令
RUN rm -rf /etc/yum.repos.d/*
RUN curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo && \
    curl -o /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo && \
    yum clean all

# 安装软件
RUN yum -y install python36 python36-pip python36-devel && \
    yum clean all

# 安装 Python 包
RUN pip3 install django==2.1.15
```

---

### 构建命令

```bash
# 基本构建
docker build -t my-image:v1 .

# 指定 Dockerfile 路径
docker build -f /path/to/Dockerfile -t my-image:v1 .

# 查看构建历史
docker history my-image:v1
```

---

## 三、多容器部署实践

### 案例：Django + Nginx + Redis

#### 1. Django 应用容器

```dockerfile
FROM centos:7.9.2009
RUN rm -rf /etc/yum.repos.d/*
RUN curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo && \
    curl -o /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo && \
    yum clean all
RUN yum -y install python36 python36-pip python36-devel && \
    yum clean all
RUN pip3 install django==2.1.15
```

```bash
# 构建 Django 镜像
docker build -t mydjango:v1 -f Dockerfile .

# 运行 Django 容器
docker run -d --name mydjango -p 8000:8000 mydjango:v1 \
    python3 manage.py runserver 0.0.0.0:8000
```

---

#### 2. Nginx 反向代理容器

```dockerfile
FROM centos:7.9.2009
RUN rm -rf /etc/yum.repos.d/*
RUN curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo && \
    curl -o /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo && \
    yum clean all
RUN yum -y install nginx && yum clean all
RUN rm -rf /usr/share/nginx/html/*
COPY index.html /usr/share/nginx/html/
```

```bash
# 构建 Nginx 镜像
docker build -t mynginx:v1 -f Dockerfile .

# 运行 Nginx 容器
docker run -d --name mynginx -p 80:80 mynginx:v1
```

---

#### 3. Redis 缓存容器

```dockerfile
FROM centos:7.9.2009
RUN rm -rf /etc/yum.repos.d/*
RUN curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo && \
    curl -o /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo && \
    yum clean all
RUN yum -y install redis && yum clean all
RUN sed -i 's/^bind 127.0.0.1$/bind 0.0.0.0/' /etc/redis.conf
RUN sed -i 's/^protected-mode yes/protected-mode no/' /etc/redis.conf
```

```bash
# 构建 Redis 镜像
docker build -t myredis:v1 -f Dockerfile .

# 运行 Redis 容器
docker run -d --name myredis -p 6379:6379 myredis:v1 redis-server /etc/redis.conf
```

---

## 四、Dockerfile 最佳实践

### 1. 减少镜像层数

```dockerfile
# 不推荐：多层 RUN
RUN yum install -y python3
RUN pip3 install django
RUN yum clean all

# 推荐：合并 RUN
RUN yum install -y python3 && \
    pip3 install django && \
    yum clean all
```

---

### 2. 利用构建缓存

```dockerfile
# 将变化少的指令放在前面
FROM centos:7.9.2009
RUN yum install -y python3  # 很少变化
COPY requirements.txt /app/
RUN pip3 install -r requirements.txt
COPY . /app/  # 经常变化
```

---

### 3. 使用 .dockerignore

```text
# .dockerignore 文件内容
.git
.gitignore
node_modules
*.log
__pycache__
```

---

### 4. 多阶段构建

```dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

---

## 五、常用 Dockerfile 指令

### FROM

```dockerfile
FROM centos:7.9.2009
FROM python:3.9-slim
FROM scratch  # 空镜像，用于最小化构建
```

---

### RUN

```dockerfile
# Shell 形式
RUN yum install -y nginx

# Exec 形式
RUN ["/bin/bash", "-c", "yum install -y nginx"]
```

---

### COPY 与 ADD

```dockerfile
# COPY：复制文件/目录
COPY index.html /usr/share/nginx/html/
COPY . /app/

# ADD：支持 URL 和自动解压
ADD http://example.com/file.tar.gz /tmp/
ADD archive.tar.gz /opt/  # 自动解压
```

---

### CMD 与 ENTRYPOINT

```dockerfile
# CMD：容器启动时的默认命令
CMD ["nginx", "-g", "daemon off;"]
CMD echo "Hello World"

# ENTRYPOINT：容器启动时执行的入口
ENTRYPOINT ["python", "app.py"]

# 组合使用
ENTRYPOINT ["python"]
CMD ["app.py"]
```

---

### ENV

```dockerfile
ENV APP_ENV=production
ENV PATH="/usr/local/bin:${PATH}"
```

---

### EXPOSE

```dockerfile
EXPOSE 80
EXPOSE 443
EXPOSE 3000/tcp
EXPOSE 53/udp
```

---

### VOLUME

```dockerfile
VOLUME ["/var/log"]
VOLUME ["/data", "/config"]
```

---

### USER

```dockerfile
USER nginx
USER 1000:1000
```

---

### WORKDIR

```dockerfile
WORKDIR /app
RUN pwd  # 输出 /app
```

---

### ARG

```dockerfile
ARG VERSION=1.0
FROM python:${VERSION}
```

---

### ONBUILD

```dockerfile
ONBUILD COPY . /app/src
ONBUILD RUN pip install -r requirements.txt
```

---

### HEALTHCHECK

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
```

---

### LABEL

```dockerfile
LABEL maintainer="admin@example.com"
LABEL version="1.0"
LABEL description="My application"
```

---

## 六、镜像优化技巧

### 1. 选择合适的基础镜像

```dockerfile
# 完整版（较大）
FROM centos:7.9.2009

# 精简版（推荐）
FROM centos:7

# 最小版（Alpine）
FROM alpine:3.18

# 语言特定
FROM python:3.9-slim
FROM node:18-alpine
```

---

### 2. 清理缓存

```dockerfile
RUN yum install -y nginx && \
    yum clean all && \
    rm -rf /var/cache/yum/*

RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

---

### 3. 多阶段构建

```dockerfile
# 构建阶段
FROM golang:1.21 AS builder
WORKDIR /src
COPY . .
RUN go build -o app

# 运行阶段
FROM alpine:3.18
COPY --from=builder /src/app /usr/local/bin/app
ENTRYPOINT ["/usr/local/bin/app"]
```

---

### 4. 使用 .dockerignore

```text
# 排除不需要的文件
.git
.gitignore
node_modules
*.md
Dockerfile
docker-compose.yml
```

---

## 七、常见问题排查

### 1. 构建失败

```bash
# 查看详细日志
docker build --progress=plain -t myimage:v1 .

# 使用 no-cache 重新构建
docker build --no-cache -t myimage:v1 .
```

---

### 2. 镜像过大

```bash
# 查看镜像大小
docker images

# 查看镜像层
docker history myimage:v1

# 使用 dive 工具分析
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock \
    wagoodman/dive:latest myimage:v1
```

---

### 3. 缓存问题

```bash
# 清理构建缓存
docker builder prune

# 清理所有未使用资源
docker system prune -a
```
