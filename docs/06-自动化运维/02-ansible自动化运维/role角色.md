# Ansible Roles（角色）学习笔记

## 一、Roles 核心概念

### 1.1 为什么需要 Roles

- **解决大型项目问题**：单一Playbook过长、维护困难、代码耦合度高
- **提高可维护性**：模块化设计，结构清晰
- **便于复用**：一次编写，多次使用
- **团队协作**：分工明确，易于管理

### 1.2 Roles 与 Playbook 的关系

| 特性         | **单一Playbook**   | **Roles**          |
| :----------- | :----------------- | :----------------- |
| **结构**     | 单一YAML文件       | 模块化目录结构     |
| **维护性**   | 修改困难，容易出错 | 模块独立，易于维护 |
| **复用性**   | 复制粘贴，难以复用 | 直接调用，高度复用 |
| **适用场景** | 小型、简单任务     | 大型、复杂项目     |

---

## 二、Roles 目录结构

### 2.1 标准目录结构

```text
/etc/ansible/
├── ansible.cfg                    # Ansible配置文件
├── hosts                         # 主机清单
├── site.yml                      # 主入口文件（可选）
├── rsync_servers.yml             # Role启动文件
├── sshd_server.yml               # Role启动文件
└── roles/                        # Roles目录
    ├── rsync_servers/            # 具体角色
    │   ├── tasks/                # 任务目录
    │   │   └── main.yml          # 主任务文件
    │   ├── handlers/             # 处理器目录
    │   │   └── main.yml          # 处理器文件
    │   ├── files/                # 静态文件目录
    │   ├── templates/             # 模板文件目录
    │   │   └── *.j2              # Jinja2模板文件
    │   └── vars/                 # 变量目录
    │       └── main.yml          # 变量文件
    └── sshd_server/              # 另一个角色
        ├── tasks/
        ├── handlers/
        ├── files/
        ├── templates/
        └── vars/
```

### 2.2 目录功能说明

| 目录           | 作用                   | 必需   | 示例文件         |
| :------------- | :--------------------- | :----- | :--------------- |
| **tasks/**     | 存放任务列表           | **是** | `main.yml`       |
| **handlers/**  | 存放处理器             | 否     | `main.yml`       |
| **files/**     | 存放静态文件           | 否     | 配置文件、脚本等 |
| **templates/** | 存放Jinja2模板         | 否     | `config.j2`      |
| **vars/**      | 存放变量               | 否     | `main.yml`       |
| **defaults/**  | 默认变量（优先级最低） | 否     | `main.yml`       |
| **meta/**      | 角色依赖信息           | 否     | `main.yml`       |

---

## 三、Roles 配置与创建

### 3.1 配置 Roles 路径

```bash
# 1. 配置roles路径（默认在/etc/ansible/ansible.cfg）
vim /etc/ansible/ansible.cfg

# 查找并修改以下配置
roles_path = /etc/ansible/roles

# 2. 创建roles目录
mkdir -p /etc/ansible/roles

# 3. 创建入口文件（与roles目录同级）
touch /etc/ansible/{site.yml,rsync_servers.yml,sshd_server.yml}
```

### 3.2 创建角色目录结构

```bash
# 创建rsync_servers角色目录
mkdir -p /etc/ansible/roles/rsync_servers/{tasks,handlers,files,templates,vars,defaults,meta}

# 创建sshd_server角色目录
mkdir -p /etc/ansible/roles/sshd_server/{tasks,handlers,files,templates,vars}
```

---

## 四、从 Playbook 到 Roles 的转换

### 4.1 转换思路

1. **先写Ad-hoc命令**：理清执行步骤
2. **转为Playbook**：组织为YAML格式
3. **抽象变量**：找出重复使用的值
4. **拆分为Roles**：按功能模块拆分

### 4.2 变量抽象示例

```bash
# Ad-hoc命令示例（发现重复参数）
ansible backup -m group -a "name=www gid=666"
ansible backup -m user -a "name=www uid=666 group=www"
ansible backup -m file -a "path=/data state=directory owner=www group=www"

# 抽象变量：www、666重复使用
# → 定义为变量：rsync_user、user_id
```

### 4.3 完整转换示例：Rsync服务部署

#### 原始Playbook（转换前）

```yaml
---
- hosts: backup
  vars:
    user_id: '666'
    rsync_user: 'www'
  tasks:
    # 1.创建组
    - name: 创建www组
      group:
        name: "{{ rsync_user }}"
        gid: "{{ user_id }}"
    
    # 2.创建用户
    - name: 创建www用户
      user:
        name: "{{ rsync_user }}"
        uid: "{{ user_id }}"
        group: "{{ rsync_user }}"
        create_home: no
        shell: /sbin/nologin
    
    # 3.创建目录
    - name: 创建数据目录
      file:
        path: "{{ item }}"
        state: directory
        owner: "{{ rsync_user }}"
        group: "{{ rsync_user }}"
        mode: '755'
      loop:
        - /data
        - /backup
    
    # 4.安装软件
    - name: 安装rsync
      yum:
        name: rsync
        state: latest
    
    # 5.复制配置文件
    - name: 复制配置文件
      copy:
        src: "{{ item.src }}"
        dest: /etc/
        mode: "{{ item.mode }}"
      notify:
        - restart rsyncd
      loop:
        - { src: 'rsyncd.conf', mode: '644' }
        - { src: 'rsync.passwd', mode: '600' }
    
    # 6.启动服务
    - name: 启动rsyncd服务
      systemd:
        name: rsyncd
        state: started
        enabled: yes
  
  handlers:
    - name: restart rsyncd
      systemd:
        name: rsyncd
        state: restarted
```

#### 转换为Roles结构

**1. 创建变量文件** `/etc/ansible/roles/rsync_servers/vars/main.yml`

```yaml
user_id: '666'
rsync_user: 'www'
```

**2. 创建任务文件** `/etc/ansible/roles/rsync_servers/tasks/main.yml`

```yaml
# 注意：不需要顶层的 tasks: 关键字
- name: 创建www组
  group:
    name: "{{ rsync_user }}"
    gid: "{{ user_id }}"

- name: 创建www用户
  user:
    name: "{{ rsync_user }}"
    uid: "{{ user_id }}"
    group: "{{ rsync_user }}"
    create_home: no
    shell: /sbin/nologin

- name: 创建数据目录
  file:
    path: "{{ item }}"
    state: directory
    owner: "{{ rsync_user }}"
    group: "{{ rsync_user }}"
    mode: '755'
  loop:
    - /data
    - /backup

- name: 安装rsync
  yum:
    name: rsync
    state: latest

- name: 复制配置文件
  copy:
    src: "{{ item.src }}"
    dest: /etc/
    mode: "{{ item.mode }}"
  notify:
    - restart rsyncd
  loop:
    - { src: 'rsyncd.conf', mode: '644' }
    - { src: 'rsync.passwd', mode: '600' }

- name: 启动rsyncd服务
  systemd:
    name: rsyncd
    state: started
    enabled: yes
```

**3. 创建处理器文件** `/etc/ansible/roles/rsync_servers/handlers/main.yml`

```yaml
- name: restart rsyncd
  systemd:
    name: rsyncd
    state: restarted
```

**4. 复制静态文件**

```bash
# 将配置文件复制到files目录
cp /script/rsyncd.conf /etc/ansible/roles/rsync_servers/files/
cp /script/rsync.passwd /etc/ansible/roles/rsync_servers/files/
```

**5. 创建启动文件** `/etc/ansible/rsync_servers.yml`

```yaml
---
- hosts: backup
  roles:
    - rsync_servers
```

---

## 五、Template模板引擎

### 5.1 Jinja2模板基础

- **文件扩展名**：`.j2`
- **变量语法**：`{{ variable_name }}`
- **默认值**：`{{ variable | default('default_value') }}`

### 5.2 模板使用示例：SSHD配置

**1. 创建模板文件** `/etc/ansible/roles/sshd_server/templates/sshd_config.j2`

```jinja2
# SSH服务端口
Port {{ sshd_port | default(22) }}

# 是否允许公钥认证
PubkeyAuthentication {{ pubkey_yes_no | default('yes') }}

# 是否允许root登录
PermitRootLogin {{ permit_root_login | default('no') }}

# 密码认证
PasswordAuthentication {{ password_auth | default('no') }}

# 允许的用户
AllowUsers {{ ssh_allow_users | default('root') }}
```

**2. 创建变量文件** `/etc/ansible/roles/sshd_server/vars/main.yml`

```yaml
sshd_port: "2999"
pubkey_yes_no: "no"
permit_root_login: "no"
password_auth: "yes"
ssh_allow_users: "root admin"
```

**3. 创建任务文件** `/etc/ansible/roles/sshd_server/tasks/main.yml`

```yaml
- name: 复制SSHD配置文件
  template:
    src: sshd_config.j2          # 源模板文件（在templates目录中）
    dest: /etc/ssh/sshd_config   # 目标文件路径
    mode: '600'                  # 文件权限
    backup: yes                  # 备份原文件
    validate: '/usr/sbin/sshd -t -f %s'  # 配置验证
  notify:
    - restart sshd

- name: 启动SSHD服务
  systemd:
    name: sshd
    state: started
    enabled: yes
```

**4. 创建处理器文件** `/etc/ansible/roles/sshd_server/handlers/main.yml`

```yaml
- name: restart sshd
  systemd:
    name: sshd
    state: restarted
```

**5. 创建启动文件** `/etc/ansible/sshd_server.yml`

```yaml
---
- hosts: backup
  roles:
    - sshd_server
```

---

## 六、Roles 使用与调试

### 6.1 基本使用命令

```bash
# 1. 执行Role
ansible-playbook /etc/ansible/sshd_server.yml

# 2. 语法检查
ansible-playbook --syntax-check sshd_server.yml

# 3. 试运行（不实际执行）
ansible-playbook -C sshd_server.yml

# 4. 列出Role中的任务
ansible-playbook --list-tasks sshd_server.yml

# 5. 调试模式
ansible-playbook -vvv sshd_server.yml
```

### 6.2 验证Role执行结果

```bash
# 验证SSHD配置是否生效
ansible backup -m shell -a "grep 'Port' /etc/ssh/sshd_config"
ansible backup -m shell -a "systemctl status sshd"
ansible backup -m shell -a "ss -tlnp | grep :2999"
```

### 6.3 Handler触发测试

```bash
# 1. 修改模板文件触发配置变化
vim /etc/ansible/roles/sshd_server/templates/sshd_config.j2
# 修改端口或其他配置

# 2. 重新执行Role
ansible-playbook sshd_server.yml
# 应该能看到：TASK [复制SSHD配置文件] → changed
# 以及：RUNNING HANDLER [restart sshd] → changed
```

---

## 七、最佳实践与技巧

### 7.1 Role设计原则

1. **单一职责**：每个Role只负责一项具体功能
2. **变量集中管理**：在vars/main.yml中定义所有变量
3. **模板化配置**：使用Jinja2模板实现配置灵活性
4. **错误处理**：配置验证和备份机制
5. **文档清晰**：注释说明Role的功能和用法

### 7.2 常见目录结构优化

```yaml
# 更完整的Role结构示例
role_name/
├── README.md                    # 说明文档
├── defaults/                    # 默认变量（优先级最低）
│   └── main.yml
├── vars/                        # 角色变量
│   └── main.yml
├── tasks/                       # 任务文件
│   ├── main.yml                 # 主任务
│   ├── install.yml              # 安装任务
│   ├── configure.yml            # 配置任务
│   └── service.yml              # 服务管理
├── handlers/                    # 处理器
│   └── main.yml
├── templates/                   # 模板文件
│   └── config.j2
├── files/                       # 静态文件
│   └── script.sh
├── meta/                        # 依赖信息
│   └── main.yml
└── tests/                       # 测试文件
    ├── inventory
    └── test.yml
```

### 7.3 变量优先级

```yaml
# 从高到低的变量优先级：
1. 命令行传递的变量 (-e "key=value")
2. Role中的vars/main.yml
3. Playbook中的vars:
4. Role中的defaults/main.yml
5. 主机清单中的变量
```

### 7.4 Role依赖管理

```yaml
# meta/main.yml 示例
---
dependencies:
  - { role: common, some_parameter: 3 }
  - { role: apache, apache_port: 80 }
  - { role: postgres, dbname: blarg, other_parameter: 12 }
```

---

## 八、总结与学习路径

### 8.1 Roles学习要点

1. **理解理念**：为什么要用Roles（解耦、复用、维护）
2. **掌握结构**：标准目录结构及各目录作用
3. **实践转换**：从Playbook到Roles的转换过程
4. **模板使用**：Jinja2模板的基本语法和使用
5. **调试技巧**：验证Role执行效果

### 8.2 实际工作应用

- **新项目**：直接使用Roles结构开发
- **旧项目重构**：逐步将大型Playbook拆分为Roles
- **团队协作**：每人负责不同Role的开发维护
- **配置管理**：使用模板实现环境差异化配置

### 8.3 下一步学习建议

1. **深入Jinja2**：学习条件判断、循环等高级特性
2. **Role Galaxy**：学习使用社区分享的Roles
3. **Ansible Tower**：学习Web界面管理和调度
4. **自定义模块**：编写自己的Ansible模块

---

**核心记忆点**：

- Roles是Ansible的模块化解决方案，用于管理复杂项目
- 标准目录结构：tasks、handlers、files、templates、vars
- 开发流程：Ad-hoc → Playbook → 抽象变量 → 拆分为Roles
- 模板引擎：使用Jinja2实现配置文件的动态生成
- 关键命令：ansible-playbook执行，各种参数用于调试和管理
