# 部署堡垒机 Jumpserver (Python + Vue + Golang) - 整理版

## 1. 数据库服务器 (db-51)

### 安装与配置 MySQL

```bash
yum -y localinstall http://mirrors.ustc.edu.cn/mysql-repo/mysql57-community-release-el7.rpm
sed -i '/gpgcheck=1/c gpgcheck=0' /etc/yum.repos.d/mysql-community*
yum install -y mysql-community-server

# 禁用随机密码生成
if [ ! "$(cat /usr/bin/mysqld_pre_systemd | grep -v ^\# | grep initialize-insecure )" ]; then
    sed -i "s@--initialize @--initialize-insecure @g" /usr/bin/mysqld_pre_systemd
fi

systemctl enable mysqld
systemctl start mysqld

# 创建数据库与用户
mysql -e "create database jumpserver default charset 'utf8';"
mysql -e "create database wordpress default charset 'utf8';"
mysql -e "set global validate_password_policy=LOW;"
mysql -e "create user 'wang'@'%' identified by 'qwe123123';"
mysql -e "grant all on jumpserver.* to 'wang'@'%';"
mysql -e "grant all on wordpress.* to 'wang'@'%';"
mysql -e "flush privileges;"
```



### 安装与配置 Redis

```bash
yum -y install epel-release wget make gcc-c++
cd /opt ; wget https://download.redis.io/releases/redis-6.2.4.tar.gz
tar -xf redis-6.2.4.tar.gz
cd redis-6.2.4
make && make install PREFIX=/usr/local/redis

# 配置环境变量
echo 'export PATH=$PATH:/usr/local/redis/bin/' >> /etc/profile
source /etc/profile

# 配置文件设置
cp /opt/redis-6.2.4/redis.conf /etc/redis.conf
sed -i "s/bind 127.0.0.1/bind 0.0.0.0/g" /etc/redis.conf
sed -i "s/daemonize no/daemonize yes/g" /etc/redis.conf
sed -i "561i maxmemory-policy allkeys-lru" /etc/redis.conf
sed -i "481i requirepass qwe123123" /etc/redis.conf

# 创建 systemd 服务
cat > /etc/systemd/system/redis.service <<EOF
[Unit]
Description=Redis persistent key-value database
After=network.target
After=network-online.target
Wants=network-online.target

[Service]
Type=forking
PIDFile=/var/run/redis_6379.pid
ExecStart=/usr/local/redis/bin/redis-server /etc/redis.conf
ExecReload=/bin/kill -s HUP \$MAINPID
ExecStop=/bin/kill -s QUIT \$MAINPID

[Install]
WantedBy=multi-user.target
EOF

systemctl enable redis
systemctl start redis
```



## 2. 管理服务器 (master-61)

### 基础环境准备

```bash
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo

yum install -y bash-completion vim lrzsz wget expect net-tools nc nmap tree dos2unix htop iftop iotop unzip telnet sl psmisc nethogs glances bc ntpdate openldap-devel

# Python 依赖
yum -y install git python-pip gcc automake autoconf python-devel vim sshpass lrzsz readline-devel zlib zlib-devel openssl openssl-devel mysql-devel

# 设置中文环境
localedef -c -f UTF-8 -i zh_CN zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8
```



### 下载 Jumpserver 源码

```bash
mkdir /opt/jumpserver-v2.12.0
wget -O /opt/jumpserver-v2.12.0.tar.gz https://github.com/jumpserver/jumpserver/archive/refs/tags/v2.12.0.tar.gz
tar -xf jumpserver-v2.12.0.tar.gz -C /opt/jumpserver-v2.12.0 --strip-components 1
yum install -y $(cat /opt/jumpserver-v2.12.0/requirements/rpm_requirements.txt)
```



### Python 3.6.9 环境搭建

```bash
yum install gcc patch libffi-devel python-devel zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel -y

cd /opt && wget https://www.python.org/ftp/python/3.6.9/Python-3.6.9.tar.xz
xz -d Python-3.6.9.tar.xz
tar -xvf Python-3.6.9.tar
cd Python-3.6.9/
./configure --prefix=/opt/python3/
make && make install

# 环境变量配置
echo 'export PATH=$PATH:/opt/python3/bin' >> /etc/profile
source /etc/profile

# 配置 pip 源
mkdir ~/.pip
cat > ~/.pip/pip.conf <<EOF
[global]
index-url = https://mirrors.aliyun.com/pypi/simple/
trusted-host = mirrors.aliyun.com
EOF
```



### 创建 Python 虚拟环境

```bash
python3 -m venv /opt/venv_py3
source /opt/venv_py3/bin/activate

# 修改依赖文件
sed -i '/huaweicloud-sdk-python-1.0.21/d' /opt/jumpserver-v2.12.0/requirements/requirements.txt

# 安装依赖
pip3 install -r /opt/jumpserver-v2.12.0/requirements/requirements.txt
```



### Jumpserver Core 配置

```bash
# 生成密钥
if [ "$SECRET_KEY" = "" ]; then SECRET_KEY=`cat /dev/urandom | tr -dc A-Za-z0-9 | head -c 50`; echo "SECRET_KEY=$SECRET_KEY" >> ~/.bashrc; echo $SECRET_KEY; else echo $SECRET_KEY; fi
if [ "$BOOTSTRAP_TOKEN" = "" ]; then BOOTSTRAP_TOKEN=`cat /dev/urandom | tr -dc A-Za-z0-9 | head -c 16`; echo "BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN" >> ~/.bashrc; echo $BOOTSTRAP_TOKEN; else echo $BOOTSTRAP_TOKEN; fi

# 配置文件
cd /opt/jumpserver-v2.12.0
cp config_example.yml config.yml

cat > config.yml <<EOF
SECRET_KEY: "$SECRET_KEY"
BOOTSTRAP_TOKEN: "$BOOTSTRAP_TOKEN"
DEBUG: true
LOG_LEVEL: DEBUG
SESSION_EXPIRE_AT_BROWSER_CLOSE: true
DB_ENGINE: mysql
DB_HOST: 10.0.0.51
DB_PORT: 3306
DB_USER: wang
DB_PASSWORD: qwe123123
DB_NAME: jumpserver
HTTP_BIND_HOST: 0.0.0.0
HTTP_LISTEN_PORT: 8080
WS_LISTEN_PORT: 8070
REDIS_HOST: 10.0.0.51
REDIS_PORT: 6379
REDIS_PASSWORD: qwe123123
EOF

# 数据库迁移
cd /opt/jumpserver-v2.12.0/apps
find /opt/jumpserver-v2.12.0/apps -name "0*.py" -delete
python3 manage.py makemigrations
python3 ./manage.py migrate

# 创建超级用户
python3 manage.py createsuperuser
# 输入：admin / admin@qwe.com / qwe123123
```



### 启动 Core 服务

```bash
cd /opt/jumpserver-v2.12.0
./jms start all -d
./jms status  # 验证服务状态
```



## 3. Lina 前端部署

### Node.js 环境

```bash
mkdir -p /opt/node-v12.22.9 && cd /opt/node-v12.22.9 && wget https://nodejs.org/dist/v12.22.9/node-v12.22.9-linux-x64.tar.gz
tar -xf node-v12.22.9-linux-x64.tar.gz -C /opt/node-v12.22.9 --strip-components 1
echo 'export PATH=$PATH:/opt/node-v12.22.9/bin' >> /etc/profile
source /etc/profile

npm config set registry http://registry.npmmirror.com
npm install -g yarn
```



### Lina 源码与依赖

```bash
mkdir -p /opt/lina-v2.12.0
wget -O /opt/lina-v2.12.0.tar.gz https://github.com/jumpserver/lina/archive/refs/tags/v2.12.0.tar.gz
cd /opt/lina-v2.12.0
tar -xf lina-v2.12.0.tar.gz -C /opt/lina-v2.12.0 --strip-components 1

# 安装依赖
yarn config set registry https://registry.npmmirror.com/
yarn cache clean
rm -rf node_modules yarn.lock
yarn config set ignore-engines true
yarn install
```



### 启动 Lina

```bash
cd /opt/lina-v2.12.0
nohup yarn serve &
netstat -tunlp | grep node  # 验证 9528 端口
```



## 4. Luna 前端部署

### 安装依赖

```bash
mkdir -p /opt/luna-v2.12.0
wget -O /opt/luna-2.12.0.tar.gz https://github.com/jumpserver/luna/archive/refs/tags/v2.12.0.tar.gz
tar -xf luna-2.12.0.tar.gz -C /opt/luna-v2.12.0 --strip-components 1

yum -y install gcc gcc-c++
cd /opt/luna-v2.12.0
npm install
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install node-sass@4.13.0

# 安装 Angular CLI
npm install -g @angular/cli@1.3.2 --unsafe-perm
```



### 启动 Luna

```bash
cd /opt/luna-v2.12.0
nohup ng serve --proxy-config proxy.conf.json --host 0.0.0.0 &
netstat -tunlp | grep angular  # 验证 4200 端口
```



## 5. Koko SSH 服务部署

### Go 环境与 Koko 安装

```bash
mkdir /opt/koko-v2.12.0
cd /opt ; wget https://github.com/jumpserver/koko/releases/download/v2.12.0/koko-v2.12.0-linux-amd64.tar.gz
tar -xf koko-v2.12.0-linux-amd64.tar.gz -C /opt/koko-v2.12.0 --strip-components 1

wget https://golang.google.cn/dl/go1.15.linux-amd64.tar.gz
tar -xf go1.15.linux-amd64.tar.gz
echo 'export PATH=$PATH:/opt/go/bin' >> /etc/profile
source /etc/profile

# 配置
cd /opt/koko-v2.12.0
cp config_example.yml config.yml

cat > config.yml <<EOF
CORE_HOST: http://127.0.0.1:8080
BOOTSTRAP_TOKEN: "$BOOTSTRAP_TOKEN"
BIND_HOST: 0.0.0.0
SSHD_PORT: 2222
HTTPD_PORT: 5000
LOG_LEVEL: DEBUG
EOF

# 启动
./koko -f config.yml -d
netstat -tunlp | grep -E '(5000|2222)'
```



## 6. Lion VNC 服务部署

### Guacamole 安装

```bash
yum -y install cairo-devel libjpeg-devel libpng-devel uuid-devel

mkdir /opt/guacamole-v2.12.0
cd /opt/guacamole-v2.12.0
wget http://download.jumpserver.org/public/guacamole-server-1.3.0.tar.gz
tar -xzf guacamole-server-1.3.0.tar.gz
cd guacamole-server-1.3.0/

./configure --with-init-dir=/etc/init.d
make && make install
ldconfig
```



### Lion 安装与配置

```bash
cd /opt
wget https://github.com/jumpserver/lion-release/releases/download/v2.12.0/lion-v2.12.0-linux-amd64.tar.gz
tar -xf lion-v2.12.0-linux-amd64.tar.gz
cd lion-v2.12.0-linux-amd64

cp config_example.yml config.yml

cat > config.yml <<EOF
CORE_HOST: http://127.0.0.1:8080
BOOTSTRAP_TOKEN: "$BOOTSTRAP_TOKEN"
BIND_HOST: 0.0.0.0
HTTPD_PORT: 8081
LOG_LEVEL: DEBUG
EOF

# 启动服务
/etc/init.d/guacd start
nohup ./lion -f config.yml &
netstat -tunlp | grep lion
```



## 7. Nginx 整合配置

### Nginx 安装

```bash
cat > /etc/yum.repos.d/nginx.repo <<EOF
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/\$releasever/\$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
EOF

yum install nginx -y
```



### 主机名解析

```bash
echo "10.0.0.61 luna lina core lion koko" >> /etc/hosts
```



### Nginx 配置文件

```nginx
server {
    listen 80;
    client_max_body_size 5000m;
    
    location /luna/ {
        proxy_pass http://luna:4200;
    }
    
    location /media/replay/ {
        add_header Content-Encoding gzip;
        root /opt/jumpserver-v2.12.0/data/;
    }
    
    location /media/ {
        root /opt/jumpserver-v2.12.0/data/;
    }
    
    location /static/ {
        root /opt/jumpserver-v2.12.0/data/;
    }
    
    location /koko/ {
        proxy_pass http://koko:5000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    location /lion/ {
        proxy_pass http://lion:8081;
        proxy_buffering off;
        proxy_request_buffering off;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;
        proxy_ignore_client_abort on;
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 6000;
    }
    
    location /ws/ {
        proxy_pass http://core:8070;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    location /api/ {
        proxy_pass http://core:8080;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /core/ {
        proxy_pass http://core:8080;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /ui/ {
        proxy_pass http://lina:9528;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location / {
        rewrite ^/(.*)$ /ui/$1 last;
    }
}
```



### 重启 Nginx

```bash
nginx -t
systemctl restart nginx
```



## 8. 访问与验证

### 访问地址

```text
http://10.0.0.61
```



### 默认登录信息

- 用户名：admin
- 密码：admin（首次登录后需修改）

### 组件端口验证

```bash
# Core 后端
netstat -tunlp | grep -E '8080|8070|5555'

# Lina 前端
netstat -tunlp | grep 9528

# Luna 前端
netstat -tunlp | grep 4200

# Koko
netstat -tunlp | grep -E '5000|2222'

# Lion
netstat -tunlp | grep 8081
```



## 9. 重启后的启动顺序

如果服务器重启，需要按以下顺序启动服务：

1. **数据库服务器 (db-51)**

   bash

   ```
   systemctl start mysqld
   systemctl start redis
   ```

   

2. **管理服务器 (master-61)**

   bash

   ```
   # Core 后端
   source /opt/venv_py3/bin/activate
   cd /opt/jumpserver-v2.12.0
   ./jms start all -d
   deactivate
   
   # Lina 前端
   cd /opt/lina-v2.12.0
   nohup yarn serve &
   
   # Luna 前端
   cd /opt/luna-v2.12.0
   nohup ng serve --proxy-config proxy.conf.json --host 0.0.0.0 &
   
   # Koko
   cd /opt/koko-v2.12.0
   ./koko -f config.yml -d
   
   # Lion
   /etc/init.d/guacd start
   cd /opt/lion-v2.12.0-linux-amd64
   nohup ./lion -f config.yml &
   
   # Nginx
   systemctl restart nginx
   ```

   

## 部署要点总结

1. **组件分离**：数据库、Redis 与核心服务分离部署，提高系统稳定性
2. **虚拟环境**：Python 项目使用虚拟环境隔离依赖
3. **端口管理**：各组件使用不同端口，通过 Nginx 统一代理
4. **服务注册**：首次启动需要生成并配置密钥，组件间通过 Token 认证
5. **依赖管理**：Python 使用 pip，Node.js 使用 yarn/npm，确保依赖版本正确
6. **配置文件**：所有组件都有配置文件，注意 YAML 格式和变量引用
7. **启动顺序**：数据库 → Core → 前端 → 代理组件 → Nginx

这个部署过程涉及多种技术栈（Python、Node.js、Golang、Nginx、MySQL、Redis），是典型的现代化 Web 应用部署案例。每个步骤都需要仔细检查，特别是配置文件格式和依赖版本。