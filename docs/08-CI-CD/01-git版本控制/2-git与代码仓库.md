## 一、Git入门

### 1. Git是什么？

- 分布式版本控制系统，由Linus Torvalds开发
- 可用于代码、配置文件、文档等的版本管理

---

### 2. 安装与配置

```bash
# 安装Git
yum install git -y

# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
git config --global color.ui true

# 查看配置
git config --list

# 查看不同级别配置
git config --local --list    # 当前用户的这个仓库配置
git config --global --list   # 当前用户所有仓库配置
git config --system --list   # 系统配置上所有用户所有仓库配置

# local可以覆盖global，global可以覆盖system
```

---

### 3. 核心概念

- **工作区**：当前编辑的目录
- **暂存区**：临时存放改动的区域
- **本地仓库**：保存历史版本的区域
- **远程仓库**：托管在服务器上的仓库

---

## 二、Git基本使用流程

### 场景一：从零开始创建仓库并编写代码

```bash
# 创建目录并初始化
mkdir my_project
cd my_project
git init

# 编写文件后提交
git add .
git commit -m "First version"

# 查看提交历史
git log
git log --oneline
```

---

### 场景二：本地已有代码，初始化为Git仓库

```bash
# 初始化仓库
git init

# 查看状态
git status

# 添加文件到暂存区
git add .

# 提交到本地仓库
git commit -m "Initial commit"
```

---

### 场景三：克隆远程仓库

```bash
# 克隆远程仓库
git clone https://gitee.com/jumpserver/jumpserver.git

# 查看提交历史
git log
git log --oneline

# 查看最新4条
git log -4
```

---

### git add命令详解

| git add 命令 | 作用范围 | 包含内容 |
| :--- | :--- | :--- |
| `git add test2.txt` | 指定文件 | 仅 `test2.txt` 文件 |
| `git add .` | 当前目录 | 当前目录下**新增**和**修改**的文件 |
| `git add -A` 或 `git add --all` | 整个仓库 | 所有**新增、修改、删除**的文件 |
| `git add -u` 或 `git add --update` | 整个仓库 | 所有**修改和删除**的文件（不包括新增） |

---

### 版本回退

```bash
# 回退到上一个版本
git reset --hard HEAD^

# 回退到指定版本（查看版本号：git log --oneline）
git reset --hard "commit_id"

# 查看所有提交记录（包括已回退的）
git reflog
```

---

## 三、Git实战命令总结

| 操作 | 命令 |
| :--- | :--- |
| 初始化仓库 | `git init` |
| 克隆仓库 | `git clone <url>` |
| 查看状态 | `git status` |
| 添加文件 | `git add <file>` |
| 提交更改 | `git commit -m "message"` |
| 查看日志 | `git log` / `git log --oneline` |
| 版本回退 | `git reset --hard <commit>` |
| 查看操作历史 | `git reflog` |
