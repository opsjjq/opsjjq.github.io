# 期中架构 Ansible 剧本

> 覆盖 db51、rsync41、nfs31、web7/8、slb5/6，与《期中架构脚本命令》对应，变量只使用必要项。

---

## 1. 目录结构

```
ansible/
├── hosts
├── group_vars/
│   └── all.yml
├── host_vars/
│   ├── 172.16.1.5.yml    # slb5
│   └── 172.16.1.6.yml    # slb6
├── site.yml
└── roles/
    ├── db/                 # MySQL（db51）
    │   ├── tasks/
    │   │   └── main.yml
    ├── rsync-server/
    │   ├── tasks/
    │   │   └── main.yml
    │   ├── handlers/
    │   │   └── main.yml
    │   └── templates/
    │       └── rsyncd.conf.j2
    ├── nfs-server/
    │   ├── tasks/
    │   │   └── main.yml
    │   ├── handlers/
    │   │   └── main.yml
    │   └── templates/
    │       └── lsyncd.conf.j2
    ├── web/                # nginx + php-fpm + wordpress
    │   ├── tasks/
    │   │   └── main.yml
    │   └── templates/
    │       ├── wordpress.conf.j2
    │       └── wp-config.php.j2
    └── slb/                # keepalived + nginx（5/6 用变量区分）
        ├── tasks/
        │   └── main.yml
        ├── handlers/
        │   └── main.yml
        └── templates/
            ├── keepalived.conf.j2
            ├── check_web.sh.j2
            ├── check_vip.sh.j2
            ├── ssl.conf.j2
            └── proxy_params.j2
```

---

## 2. 主机清单 `hosts`

```ini
[all:vars]
ansible_port=22
ansible_password='qwe'

[slb]
172.16.1.5
172.16.1.6

[web]
172.16.1.7
172.16.1.8

[nfs]
172.16.1.31

[backup]
172.16.1.41

[db]
172.16.1.51
```

---

## 3. 全局变量 `group_vars/all.yml`

```yaml
---
# 共用
rsync_user: rsync_backup
rsync_password: "qwe123"
nfs_network: "172.16.1.0/24"
yum_repo_61: "http://172.16.1.61:12345"

# DB（WordPress 用）
db_host: "172.16.1.51"
mysql_wp_user: wang
mysql_wp_password: "qwe123123"
redis_password: "qwe123123"

# NFS / 后端
nfs_server_ip: "172.16.1.31"
web_backend_ips:
  - "172.16.1.7:80"
  - "172.16.1.8:80"
```

---

## 4. 主机变量 `host_vars/172.16.1.5.yml`（slb5）

```yaml
---
slb_role: master
keepalived_state: MASTER
keepalived_priority: 150
keepalived_router_id: lb-5
keepalived_script: check_web
slb_generate_cert: true
```

---

## 5. 主机变量 `host_vars/172.16.1.6.yml`（slb6）

```yaml
---
slb_role: backup
keepalived_state: BACKUP
keepalived_priority: 100
keepalived_router_id: lb-6
keepalived_script: check_vip
slb_generate_cert: false
slb_master_ip: "10.0.0.5"
```

---

## 6. 主 Playbook `site.yml`

```yaml
---
- name: 部署 Rsync（41）
  hosts: backup
  roles:
    - rsync-server

- name: 部署 NFS（31）
  hosts: nfs
  roles:
    - nfs-server

- name: 部署 DB MySQL（51）
  hosts: db
  roles:
    - db

- name: 部署 Web（7、8）
  hosts: web
  roles:
    - web

- name: 部署 SLB（5、6）
  hosts: slb
  roles:
    - slb
```

**执行：**

```bash
ansible-playbook -i hosts site.yml
# 单组：ansible-playbook -i hosts site.yml --limit db
# 单机：ansible-playbook -i hosts site.yml --limit 172.16.1.7
```

---

## 7. Role：db（MySQL）

### 7.1 `roles/db/tasks/main.yml`

```yaml
---
# MySQL
- name: 安装 MySQL 5.7 源
  yum:
    name: http://mirrors.ustc.edu.cn/mysql-repo/mysql57-community-release-el7.rpm
    state: present

- name: 关闭 MySQL 源 gpgcheck
  shell: sed -i '/gpgcheck=1/c gpgcheck=0' /etc/yum.repos.d/mysql-community*.repo
  args: { warn: false }

- name: 安装 mysql-community-server
  yum:
    name: mysql-community-server
    state: present

- name: 修改 mysqld 初始化参数
  replace:
    path: /usr/bin/mysqld_pre_systemd
    regexp: '--initialize '
    replace: '--initialize-insecure '
  ignore_errors: true

- name: 启用并启动 mysqld
  systemd:
    name: mysqld
    enabled: yes
    state: started

- name: 等待 3306 端口
  wait_for:
    port: 3306
    delay: 5
    timeout: 60

- name: 创建库与用户（WordPress）
  shell: |
    mysql -e "create database if not exists wordpress default charset 'utf8';"
    mysql -e "set global validate_password_policy=LOW;" 2>/dev/null || true
    mysql -e "create user if not exists '{{ mysql_wp_user }}'@'%' identified by '{{ mysql_wp_password }}';"
    mysql -e "grant all on wordpress.* to '{{ mysql_wp_user }}'@'%';"
    mysql -e "flush privileges;"
  args: { warn: false }
```

---

## 8. Role：rsync-server

### 8.1 `roles/rsync-server/tasks/main.yml`

```yaml
---
- name: 安装 rsync
  yum:
    name: rsync
    state: present

- name: 创建 www 用户
  user:
    name: www
    uid: 1000
    system: yes
    shell: /sbin/nologin
    create_home: no

- name: 创建备份目录
  file:
    path: /backup
    state: directory
    owner: www
    group: www

- name: 部署 rsyncd 配置
  template:
    src: rsyncd.conf.j2
    dest: /etc/rsyncd.conf
  notify: restart rsyncd

- name: 创建密码文件
  copy:
    content: "{{ rsync_user }}:{{ rsync_password }}"
    dest: /etc/rsync.passwd
    mode: '0600'

- name: 启动并启用 rsyncd
  systemd:
    name: rsyncd
    state: started
    enabled: yes
```

### 8.2 `roles/rsync-server/handlers/main.yml`

```yaml
---
- name: restart rsyncd
  systemd:
    name: rsyncd
    state: restarted
```

### 8.3 `roles/rsync-server/templates/rsyncd.conf.j2`

```ini
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
auth users = {{ rsync_user }}
secrets file = /etc/rsync.passwd
log file = /var/log/rsyncd.log

[backup]
comment = backup directionary
path = /backup
```

---

## 9. Role：nfs-server

### 9.1 `roles/nfs-server/tasks/main.yml`

```yaml
---
- name: 安装 nfs-utils、rpcbind、lsyncd
  yum:
    name: [nfs-utils, rpcbind, lsyncd]
    state: present

- name: 创建 www 用户
  user:
    name: www
    uid: 1500
    system: yes
    shell: /sbin/nologin
    create_home: no

- name: 创建 NFS 共享目录
  file:
    path: /nfs-data
    state: directory
    owner: www
    group: www

- name: 配置 /etc/exports
  copy:
    content: |
      /nfs-data {{ nfs_network }}(rw,sync,all_squash,anonuid=1500,anongid=1500)
    dest: /etc/exports
  notify: reload nfs

- name: 创建 lsyncd 密码文件
  copy:
    content: "{{ rsync_password }}"
    dest: /etc/rsync.pwd
    mode: '0600'

- name: 部署 lsyncd 配置
  template:
    src: lsyncd.conf.j2
    dest: /etc/lsyncd.conf
  notify: restart lsyncd

- name: 创建 lsyncd 日志目录
  file:
    path: /var/log/lsyncd
    state: directory

- name: 启动并启用 rpcbind、nfs、lsyncd
  systemd:
    name: "{{ item }}"
    state: started
    enabled: yes
  loop: [rpcbind, nfs, lsyncd]
```

### 9.2 `roles/nfs-server/handlers/main.yml`

```yaml
---
- name: reload nfs
  command: exportfs -ra
- name: restart lsyncd
  systemd:
    name: lsyncd
    state: restarted
```

### 9.3 `roles/nfs-server/templates/lsyncd.conf.j2`

```lua
settings {
    logfile      = "/var/log/lsyncd/lsyncd.log",
    statusFile   = "/var/log/lsyncd/lsyncd.status",
    inotifyMode  = "CloseWrite",
    maxProcesses = 8,
}
sync {
    default.rsync,
    source    = "/nfs-data",
    target    = "{{ rsync_user }}@172.16.1.41::backup",
    delete    = true,
    exclude   = {".*"},
    delay     = 1,
    rsync     = {
        binary        = "/usr/bin/rsync",
        archive       = true,
        compress      = true,
        verbose       = true,
        password_file = "/etc/rsync.pwd",
        _extra        = {"--bwlimit=200"}
    }
}
```

---

## 10. Role：web（nginx + php-fpm + WordPress）

### 10.1 `roles/web/tasks/main.yml`

```yaml
---
- name: 配置 61 yum 源
  copy:
    content: |
      [local61]
      name=Local YUM Repository on 61
      baseurl={{ yum_repo_61 }}
      gpgcheck=0
      enabled=1
    dest: /etc/yum.repos.d/61.repo

- name: 创建 www 用户与组
  group:
    name: www
    gid: 666
  user:
    name: www
    uid: 666
    group: www
    system: yes
    shell: /sbin/nologin
    create_home: no

- name: 安装 nginx
  yum:
    name: nginx
    state: present

- name: 启动并启用 nginx
  systemd:
    name: nginx
    state: started
    enabled: yes

- name: 添加 PHP 7.1 源（webtatic）
  yum:
    name: https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
    state: present
  ignore_errors: true

- name: 安装 PHP 7.1 与扩展
  yum:
    name:
      - php71w-cli
      - php71w-common
      - php71w-fpm
      - php71w-mysqlnd
      - php71w-gd
      - php71w-mbstring
      - php71w-xml
      - php71w-opcache
    state: present
  ignore_errors: true

- name: PHP-FPM 运行用户
  replace:
    path: /etc/php-fpm.d/www.conf
    regexp: '^user = .*'
    replace: 'user = www'
- replace:
    path: /etc/php-fpm.d/www.conf
    regexp: '^group = .*'
    replace: 'group = www'

- name: 启动 php-fpm
  systemd:
    name: php-fpm
    state: started
    enabled: yes

- name: 部署 wordpress 站点配置
  template:
    src: wordpress.conf.j2
    dest: /etc/nginx/conf.d/wordpress.conf

- name: 创建站点目录
  file:
    path: /code/wordpress
    state: directory
    owner: www
    group: www

- name: 部署 wp-config.php
  template:
    src: wp-config.php.j2
    dest: /code/wordpress/wp-config.php
    owner: www
    group: www

- name: 安装 nfs-utils、rpcbind
  yum:
    name: [nfs-utils, rpcbind]
    state: present

- name: 启动 rpcbind
  systemd:
    name: rpcbind
    state: started
    enabled: yes

- name: 创建 uploads 目录
  file:
    path: /code/wordpress/wp-content/uploads
    state: directory
    owner: www
    group: www

- name: 挂载 NFS 到 uploads
  mount:
    path: /code/wordpress/wp-content/uploads
    src: "{{ nfs_server_ip }}:/nfs-data"
    fstype: nfs
    state: mounted
    opts: defaults,_netdev

- name: 写入 fstab
  lineinfile:
    path: /etc/fstab
    line: "{{ nfs_server_ip }}:/nfs-data  /code/wordpress/wp-content/uploads  nfs4  defaults,_netdev  0  0"
    state: present

- name: 重载 nginx
  command: nginx -s reload
```

（若 PHP 71 源不可用，可改为使用 61 上自建 repo 中的 php71w 包，或改用 php74/80 并改模板中 fastcgi_pass 等；此处与脚本文档一致用 php71w。）

### 10.2 `roles/web/templates/wordpress.conf.j2`

```nginx
server {
    listen 80;
    server_name wordpress.qwe.cn;
    root /code/wordpress;
    index index.php index.html;
    location ~ \.php$ {
        root /code/wordpress;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_param HTTPS on;
    }
}
```

### 10.3 `roles/web/templates/wp-config.php.j2`

```php
<?php
define( 'DB_NAME', 'wordpress' );
define( 'DB_USER', '{{ mysql_wp_user }}' );
define( 'DB_PASSWORD', '{{ mysql_wp_password }}' );
define( 'DB_HOST', '{{ db_host }}' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );
$table_prefix = 'wp_';
define( 'WP_DEBUG', false );
if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}
require_once ABSPATH . 'wp-settings.php';
```

（若需与脚本文档一致保留 AUTH_KEY 等盐值，可在模板中补全；此处仅保留必要 DB 与表前缀。）

---

## 11. Role：slb（5/6 共用，变量区分）

### 11.1 `roles/slb/tasks/main.yml`

```yaml
---
- name: 配置 61 yum 源
  copy:
    content: |
      [local-rpm]
      name=local yum repo
      baseurl={{ yum_repo_61 }}
      enabled=1
      gpgcheck=0
    dest: /etc/yum.repos.d/61.repo

- name: 清理 yum 缓存（slb6）
  command: yum clean all
  when: slb_role == 'backup'

- name: 安装 nginx、keepalived
  yum:
    name: [nginx, keepalived]
    state: present

- name: 启动 nginx
  systemd:
    name: nginx
    state: started
    enabled: yes

- name: 部署 keepalived 检查脚本（master 用 check_web）
  template:
    src: check_web.sh.j2
    dest: /etc/keepalived/check_web.sh
    mode: '0755'
  when: keepalived_script == 'check_web'

- name: 部署 keepalived 检查脚本（backup 用 check_vip）
  template:
    src: check_vip.sh.j2
    dest: /etc/keepalived/check_vip.sh
    mode: '0755'
  when: keepalived_script == 'check_vip'

- name: slb6 对 master 免密
  user:
    name: root
    generate_ssh_key: yes
    ssh_key_type: rsa
  when: slb_role == 'backup'

- name: slb6 安装 sshpass
  yum:
    name: sshpass
    state: present
  when: slb_role == 'backup'

- name: slb6 对 master 免密
  shell: "sshpass -p '{{ ansible_password }}' ssh-copy-id -o StrictHostKeyChecking=no root@{{ slb_master_ip | default('10.0.0.5') }}"
  when: slb_role == 'backup'
  args: { warn: false }
  changed_when: true

- name: 部署 keepalived 配置
  template:
    src: keepalived.conf.j2
    dest: /etc/keepalived/keepalived.conf
  notify: restart keepalived

- name: 创建证书目录（control）
  file:
    path: "{{ playbook_dir }}/.slb_cert"
    state: directory
    mode: '0700'
  run_once: true
  delegate_to: localhost

- name: 在 control 生成证书（供 slb5/6 共用）
  shell: >
    openssl req -x509 -sha256 -nodes -days 36500
    -newkey rsa:2048 -keyout {{ playbook_dir }}/.slb_cert/server.key
    -out {{ playbook_dir }}/.slb_cert/server.crt
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyCompany/CN=slb5"
  run_once: true
  delegate_to: localhost
  args: { creates: "{{ playbook_dir }}/.slb_cert/server.crt" }

- name: 拷贝证书到各 SLB
  copy:
    src: "{{ playbook_dir }}/.slb_cert/{{ item }}"
    dest: "/tmp/{{ item }}"
  loop: [server.key, server.crt]

- name: 部署 nginx ssl 与 proxy_params
  template:
    src: "{{ item.src }}"
    dest: "{{ item.dest }}"
  loop:
    - { src: ssl.conf.j2, dest: /etc/nginx/conf.d/ssl.conf }
    - { src: proxy_params.j2, dest: /etc/nginx/proxy_params }

- name: 重载 nginx
  systemd:
    name: nginx
    state: reloaded

- name: 启动 keepalived
  systemd:
    name: keepalived
    state: started
    enabled: yes
```

（slb6 对 10.0.0.5 免密：若 172.16.1.6 无法直接 delegate_to 10.0.0.5，可在 slb6 上用 shell+sshpass 做 ssh-copy-id，与脚本文档一致。）

### 11.2 `roles/slb/handlers/main.yml`

```yaml
---
- name: restart keepalived
  systemd:
    name: keepalived
    state: restarted
```

### 11.3 `roles/slb/templates/keepalived.conf.j2`

```
global_defs {
    router_id {{ keepalived_router_id }}
}
vrrp_script {{ keepalived_script }} {
    script "/etc/keepalived/{{ keepalived_script }}.sh"
    interval 5
}
vrrp_instance VIP_1 {
    state {{ keepalived_state }}
    interface eth0
    virtual_router_id 50
    priority {{ keepalived_priority }}
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        10.0.0.3
    }
    track_script {
        {{ keepalived_script }}
    }
}
```

### 11.4 `roles/slb/templates/check_web.sh.j2`

```bash
#!/bin/bash
NGINX_STATUS=$(ps -ef|grep ngin[x]|wc -l)
if [ ${NGINX_STATUS} == 0 ]; then
   systemctl restart nginx
   [ $? -eq 1 ] && systemctl stop keepalived
fi
```

### 11.5 `roles/slb/templates/check_vip.sh.j2`

```bash
#!/bin/bash
MASTER_VIP=$(ssh {{ slb_master_ip | default('10.0.0.5') }} ip a|grep 10.0.0.3|wc -l)
MY_VIP=$(ip a|grep 10.0.0.3|wc -l)
if [ ${MASTER_VIP} == 1 -a ${MY_VIP} == 1 ]; then
   systemctl stop keepalived
fi
```

### 11.6 `roles/slb/templates/ssl.conf.j2`

```nginx
server {
    listen 80;
    server_name wordpress.qwe.cn;
    return 301 https://$server_name$request_uri;
}
upstream myweb {
{% for ip in web_backend_ips %}
    server {{ ip }};
{% endfor %}
}
server {
    listen 443 ssl;
    server_name wordpress.qwe.cn;
    ssl_certificate /tmp/server.crt;
    ssl_certificate_key /tmp/server.key;
    location / {
        proxy_pass http://myweb;
        include proxy_params;
    }
}
```

### 11.7 `roles/slb/templates/proxy_params.j2`

```
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_connect_timeout 30;
proxy_send_timeout 60;
proxy_read_timeout 60;
proxy_buffering on;
proxy_buffer_size 32k;
proxy_buffers 4 128k;
```

---

## 12. 执行顺序与依赖

| 顺序 | 主机组 | 说明 |
|------|--------|------|
| 1 | backup | Rsync，NFS 的 lsyncd 依赖其认证 |
| 2 | nfs | NFS + lsyncd 同步到 41 |
| 3 | db | MySQL + Redis，Web 与 WordPress 依赖 |
| 4 | web | 依赖 db、nfs（挂载 uploads） |
| 5 | slb | 依赖 web 已就绪；证书在 control 生成后拷贝到 5/6，或按脚本文档在 slb5 生成再 scp 到 6 |

---

## 13. 与脚本文档对应关系

| 角色 | 脚本文档 | 剧本 role |
|------|----------|-----------|
| db51 | MySQL 命令 | `db` |
| rsync41 | rsync 命令 | `rsync-server` |
| nfs31 | NFS + lsyncd | `nfs-server` |
| web7/8 | nginx + php-fpm + wordpress + NFS 挂载 | `web` |
| slb5/6 | keepalived + nginx + 证书 | `slb`（host_vars 区分 5/6） |

WordPress 程序包（如 `wordpress-5.8.2-zh_CN.tar.gz`）需自行放到各 web 机的 `/tmp` 并解压到 `/code`，或通过 Ansible 的 `unarchive` 从控制机分发后再执行本剧本。
