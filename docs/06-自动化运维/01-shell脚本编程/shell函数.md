# Shell 函数完全指南

## 一、函数基础

### 1.1 为什么使用函数

- **代码复用**：避免重复编写相同代码
- **结构清晰**：让脚本更易读、易维护
- **模块化**：分解复杂脚本为小功能块

### 1.2 函数定义语法

```bash
# 方式1：推荐写法
function 函数名() {
    函数体
}

# 方式2：简洁写法
函数名() {
    函数体
}
```

**示例：**

```bash
#!/bin/bash
# 定义简单函数
say_hello() {
    echo "Hello!"
}

# 调用函数
say_hello
```

---

## 二、函数传参

### 2.1 基本参数传递

```bash
#!/bin/bash
# 带参数的函数
greet() {
    local name="$1"
    echo "Hello, $name!"
}

# 调用时传参
greet "张三"
greet "李四"
```

### 2.2 使用局部变量

```bash
#!/bin/bash
# 使用local声明局部变量
calculate() {
    local a="$1"
    local b="$2"
    local sum=$((a + b))
    echo "和为: $sum"
}

calculate 5 3
```

---

## 三、函数返回值

### 3.1 返回状态码

```bash
#!/bin/bash
# 使用return返回状态码
check_file() {
    local file="$1"
    if [ -f "$file" ]; then
        return 0  # 成功
    else
        return 1  # 失败
    fi
}

# 检查返回值
check_file "/etc/passwd"
if [ $? -eq 0 ]; then
    echo "文件存在"
else
    echo "文件不存在"
fi
```

### 3.2 返回数据

```bash
#!/bin/bash
# 使用echo返回数据
get_sum() {
    local sum=$(( $1 + $2 ))
    echo "$sum"  # 返回计算结果
}

# 获取返回值
result=$(get_sum 10 20)
echo "结果是: $result"
```

---

## 四、实用案例

### 4.1 简单计算器

```bash
#!/bin/bash
# 四则运算计算器
calculator() {
    local a="$1"
    local op="$2"
    local b="$3"
    
    case "$op" in
        "+") echo "$(($a + $b))" ;;
        "-") echo "$(($a - $b))" ;;
        "*") echo "$(($a * $b))" ;;
        "/") echo "$(($a / $b))" ;;
        *) echo "错误: 不支持的操作符" ;;
    esac
}

# 使用示例
result=$(calculator 10 "+" 5)
echo "10 + 5 = $result"
```

### 4.2 文件备份函数

```bash
#!/bin/bash
# 简单文件备份
backup_file() {
    local source_file="$1"
    local backup_dir="/tmp/backup"
    
    # 创建备份目录
    mkdir -p "$backup_dir"
    
    # 生成备份文件名
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${backup_dir}/$(basename $source_file)_$timestamp"
    
    # 复制文件
    if cp "$source_file" "$backup_file"; then
        echo "备份成功: $backup_file"
        return 0
    else
        echo "备份失败"
        return 1
    fi
}

# 使用示例
backup_file "/etc/hosts"
```

### 4.3 用户登录验证

```bash
#!/bin/bash
# 简单的登录验证
login() {
    local user="$1"
    local pass="$2"
    
    # 这里只是示例，实际应加密存储密码
    if [[ "$user" == "admin" && "$pass" == "123456" ]]; then
        echo "登录成功"
        return 0
    else
        echo "用户名或密码错误"
        return 1
    fi
}

# 使用示例
login "admin" "123456"
```

---

## 五、函数库使用

### 5.1 创建函数库

**utils.sh（工具函数库）**

```bash
#!/bin/bash
# 常用工具函数库

# 打印彩色信息
print_info() {
    echo -e "\033[32m[INFO]\033[0m $1"
}

print_error() {
    echo -e "\033[31m[ERROR]\033[0m $1" >&2
}

# 检查命令是否存在
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        return 0
    else
        print_error "命令 $1 不存在"
        return 1
    fi
}

# 确认操作
confirm() {
    read -p "$1 (y/N): " choice
    [[ "$choice" =~ ^[Yy]$ ]]
}
```

### 5.2 使用函数库

```bash
#!/bin/bash
# 主脚本
# 导入函数库
source ./utils.sh

# 使用函数库中的函数
print_info "开始执行脚本"

if check_command "git"; then
    print_info "Git已安装"
fi

if confirm "是否继续?"; then
    print_info "用户选择继续"
else
    print_info "用户选择取消"
fi
```

---

## 六、最佳实践

### 6.1 命名规范

- 使用小写字母和下划线
- 名称要有描述性
- 动词开头更清晰

```bash
# 好名字
create_user()
backup_files()
check_disk_space()

# 不好的名字
foo()
do_it()
func1()
```

### 6.2 错误处理

```bash
#!/bin/bash
# 带错误处理的函数
safe_delete() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        echo "错误: 文件不存在"
        return 1
    fi
    
    if rm "$file"; then
        echo "删除成功"
        return 0
    else
        echo "删除失败"
        return 2
    fi
}
```

### 6.3 参数验证

```bash
#!/bin/bash
# 验证参数的函数
validate_params() {
    if [ $# -lt 2 ]; then
        echo "用法: $0 参数1 参数2"
        return 1
    fi
    
    if [[ ! "$1" =~ ^[0-9]+$ ]]; then
        echo "错误: 第一个参数必须是数字"
        return 2
    fi
    
    return 0
}

# 使用
validate_params "$@" || exit 1
```

### 6.4 调试技巧

```bash
#!/bin/bash
# 调试函数
debug_mode=false

debug() {
    if [ "$debug_mode" = true ]; then
        echo "[DEBUG] $@"
    fi
}

# 在函数中使用
process_data() {
    debug "开始处理数据"
    # ... 处理逻辑
    debug "处理完成"
}

# 开启调试
debug_mode=true
process_data
```

---

## 七、简单实用脚本示例

### 系统信息脚本

```bash
#!/bin/bash
# system_info.sh

show_system_info() {
    echo "=== 系统信息 ==="
    echo "主机名: $(hostname)"
    echo "系统: $(uname -s)"
    echo "内核: $(uname -r)"
}

show_disk_info() {
    echo "=== 磁盘信息 ==="
    df -h | grep -E "^/dev"
}

show_memory_info() {
    echo "=== 内存信息 ==="
    free -h
}

# 主程序
case "${1:-all}" in
    "system") show_system_info ;;
    "disk") show_disk_info ;;
    "memory") show_memory_info ;;
    "all")
        show_system_info
        echo
        show_disk_info
        echo
        show_memory_info
        ;;
    *) echo "用法: $0 {system|disk|memory|all}" ;;
esac
```
