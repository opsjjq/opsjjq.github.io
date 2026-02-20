# Shell 数组操作完全指南

## 一、数组概述

### 1.1 什么是 Shell 数组

- **数组**：可以存储多个值的数据结构
- **稀疏数组**：Bash 数组只存储有值的索引位置，空索引不占用空间
- **支持类型**：
  - **数值索引数组**：使用整数索引（0, 1, 2...）
  - **关联数组**：使用字符串作为键（key/value 结构）

### 1.2 核心特点

- 索引从 0 开始
- 支持不连续的索引（稀疏性）
- 关联数组需要 Bash 4.0+ 版本
- 汉字在数组中被视为单个字符

---

## 二、数组操作符速查表

| 语法              | 含义            | 示例                      |
| :---------------- | :-------------- | :------------------------ |
| `${array[i]}`     | 获取第 i 个元素 | `${arr[0]} → "a"`         |
| `${array[@]}`     | 获取所有元素    | `${arr[@]} → "a" "b" "c"` |
| `${!array[@]}`    | 获取所有索引    | `${!arr[@]} → 0 1 2`      |
| `${#array[@]}`    | 获取元素个数    | `${#arr[@]} → 3`          |
| `${#array[i]}`    | 获取元素长度    | `${#arr[0]} → 1`          |
| `${array[@]:s:n}` | 数组切片        | `${arr[@]:0:2} → "a" "b"` |

---

## 三、普通数组操作

### 3.1 定义与初始化

```bash
# 方式1：自动索引（推荐）
names=(张三 李四 王五 赵六)

# 方式2：手动指定索引
colors[0]="红色"
colors[2]="绿色"
colors[5]="蓝色"

# 方式3：从命令输出创建
files=( $(ls *.txt) )
```

### 3.2 基本操作

```bash
# 1. 访问元素
echo "第一个元素: ${names[0]}"  # 张三
echo "第二个元素: ${names[1]}"  # 李四

# 2. 查看所有元素
echo "所有元素: ${names[@]}"

# 3. 查看所有索引
echo "所有索引: ${!names[@]}"

# 4. 获取数组长度
echo "数组长度: ${#names[@]}"  # 4

# 5. 获取元素长度
echo "元素长度: ${#names[0]}"  # 2（张三）
```

### 3.3 增删改查

```bash
# 初始化数组
students=(小明 小红 小刚)

# 添加元素（自动追加）
students+=(小丽)            # 方式1：数组末尾添加
students[${#students[@]}]="小强"  # 方式2：计算索引添加
students[10]="小张"         # 方式3：指定索引添加（创建稀疏数组）

# 修改元素
students[0]="大明"

# 删除元素
unset students[1]           # 删除第二个元素
unset students              # 删除整个数组

# 切片操作
fruits=("苹果" "香蕉" "橙子" "葡萄" "芒果")
echo "${fruits[@]:1:3}"     # 香蕉 橙子 葡萄
echo "${fruits[@]:2}"       # 橙子 葡萄 芒果（从索引2开始到末尾）
```

---

## 四、关联数组操作

### 4.1 声明与初始化

```bash
# 必须声明为关联数组
declare -A person

# 赋值方式1：逐个添加
person[name]="张三"
person[age]="25"
person[city]="北京"

# 赋值方式2：批量初始化
declare -A config=(
    ["host"]="localhost"
    ["port"]="8080"
    ["debug"]="true"
)

# 赋值方式3：读取文件创建
declare -A env_vars
while IFS='=' read -r key value; do
    env_vars[$key]="$value"
done < config.env
```

### 4.2 操作示例

```bash
# 访问元素
echo "姓名: ${person[name]}"
echo "年龄: ${person[age]}"

# 遍历所有键
for key in "${!person[@]}"; do
    echo "键: $key"
done

# 遍历键值对
for key in "${!person[@]}"; do
    echo "$key: ${person[$key]}"
done

# 检查键是否存在
if [[ -v person[name] ]]; then
    echo "姓名键存在"
fi

# 删除键值对
unset person[city]
```

---

## 五、数组遍历技巧

### 5.1 普通数组遍历

```bash
# 方法1：直接遍历值
array=("a" "b" "c" "d")
for item in "${array[@]}"; do
    echo "元素: $item"
done

# 方法2：遍历索引
for index in "${!array[@]}"; do
    echo "索引 $index: ${array[$index]}"
done

# 方法3：C风格遍历
for ((i=0; i<${#array[@]}; i++)); do
    echo "第 $i 个元素: ${array[$i]}"
done
```

### 5.2 关联数组遍历

```bash
declare -A user_info=(
    ["username"]="admin"
    ["password"]="123456"
    ["email"]="admin@example.com"
)

# 遍历所有值
for value in "${user_info[@]}"; do
    echo "值: $value"
done

# 遍历所有键
for key in "${!user_info[@]}"; do
    echo "键: $key"
done

# 遍历键值对
for key in "${!user_info[@]}"; do
    printf "%-15s: %s\n" "$key" "${user_info[$key]}"
done
```

---

## 六、实用案例

### 6.1 统计登录 Shell 出现次数

```bash
#!/bin/bash
declare -A shell_count

# 统计 /etc/passwd 中各种 shell 的使用次数
while IFS=: read -r username password uid gid desc home shell rest; do
    ((shell_count[$shell]++))
done < /etc/passwd

# 输出统计结果
echo "登录 Shell 统计："
echo "=================="
printf "%-20s %-10s\n" "Shell类型" "使用人数"
echo "------------------"
for shell in "${!shell_count[@]}"; do
    printf "%-20s %-10d\n" "$shell" "${shell_count[$shell]}"
done
```

### 6.2 Nginx 日志 IP 访问统计

```bash
#!/bin/bash
LOG_FILE="/var/log/nginx/access.log"
declare -A ip_count

# 使用 awk 高效统计
awk '{ ip_count[$1]++ } 
END { 
    for (ip in ip_count) 
        printf "IP: %-15s 访问次数: %d\n", ip, ip_count[ip] 
}' "$LOG_FILE" | sort -k4 -nr

# 或者使用纯 Bash（适用于小文件）
while read -r line; do
    ip=$(echo "$line" | awk '{print $1}')
    [[ -n "$ip" ]] && ((ip_count[$ip]++))
done < "$LOG_FILE"

# 输出前10个访问最频繁的IP
echo -e "\n访问最频繁的IP（前10）："
for ip in "${!ip_count[@]}"; do
    echo "${ip_count[$ip]} $ip"
done | sort -nr | head -10
```

### 6.3 配置管理器

```bash
#!/bin/bash
declare -A config

# 加载配置文件
load_config() {
    local config_file="$1"
    while IFS='=' read -r key value; do
        # 跳过空行和注释
        [[ -z "$key" || "$key" =~ ^# ]] && continue
        config["$key"]="$value"
    done < "$config_file"
}

# 保存配置
save_config() {
    local config_file="$1"
    > "$config_file"  # 清空文件
    for key in "${!config[@]}"; do
        echo "$key=${config[$key]}" >> "$config_file"
    done
}

# 使用示例
load_config "app.conf"
echo "数据库主机: ${config[db_host]}"
echo "数据库端口: ${config[db_port]}"

# 修改配置
config[db_host]="192.168.1.100"
save_config "app.conf"
```

### 6.4 菜单系统

```bash
#!/bin/bash
declare -A menu_items=(
    ["1"]="查看系统信息"
    ["2"]="查看磁盘使用"
    ["3"]="查看内存使用"
    ["4"]="查看网络连接"
    ["5"]="退出系统"
)

declare -A menu_commands=(
    ["1"]="hostnamectl"
    ["2"]="df -h"
    ["3"]="free -h"
    ["4"]="ss -tuln"
)

show_menu() {
    echo "========== 系统管理菜单 =========="
    for key in $(echo "${!menu_items[@]}" | tr ' ' '\n' | sort); do
        printf "%s. %s\n" "$key" "${menu_items[$key]}"
    done
    echo "=================================="
}

while true; do
    show_menu
    read -p "请选择操作 (1-5): " choice
    
    if [[ "$choice" == "5" ]]; then
        echo "再见！"
        exit 0
    elif [[ -v menu_commands[$choice] ]]; then
        echo "执行: ${menu_items[$choice]}"
        eval "${menu_commands[$choice]}"
    else
        echo "无效选择，请重新输入！"
    fi
    echo
done
```

---

## 七、高级技巧

### 7.1 数组复制

```bash
# 复制数组
original=(1 2 3 4 5)
copy=("${original[@]}")

# 数组合并
array1=(a b c)
array2=(d e f)
combined=("${array1[@]}" "${array2[@]}")
```

### 7.2 数组元素去重

```bash
# 普通数组去重
array=(1 2 2 3 4 4 5)
declare -A seen
unique_array=()
for item in "${array[@]}"; do
    if [[ ! -v seen[$item] ]]; then
        seen[$item]=1
        unique_array+=("$item")
    fi
done
echo "${unique_array[@]}"  # 1 2 3 4 5
```

### 7.3 二维数组模拟

```bash
# 使用关联数组模拟二维数组
declare -A matrix
matrix["0,0"]=1
matrix["0,1"]=2
matrix["1,0"]=3
matrix["1,1"]=4

# 访问元素
echo "${matrix["0,1"]}"  # 输出: 2
```

### 7.4 数组与字符串转换

```bash
# 数组转字符串
fruits=("apple" "banana" "orange")
str=$(IFS=,; echo "${fruits[*]}")
echo "$str"  # apple,banana,orange

# 字符串转数组
str="one,two,three,four"
IFS=',' read -ra arr <<< "$str"
echo "数组长度: ${#arr[@]}"  # 4
echo "第一个元素: ${arr[0]}"  # one
```

---

## 八、注意事项与最佳实践

### 8.1 重要提醒

1. **Bash版本**：关联数组需要 Bash 4.0+，可通过 `bash --version` 查看

2. **索引检查**：访问前检查索引是否存在

   ```bash
   if [[ -v array[5] ]]; then
       echo "索引5存在: ${array[5]}"
   fi
   ```

3. **引号使用**：遍历时使用双引号防止空格问题

   ```bash
   # 正确
   for item in "${array[@]}"; do ...
   
   # 错误（空格会分割元素）
   for item in ${array[@]}; do ...
   ```

### 8.2 性能优化

1. 大型数组考虑使用文件或数据库
2. 频繁操作使用 AWK 等工具更高效
3. 关联数组的键尽量简短

### 8.3 调试技巧

```bash
# 查看数组详细内容
declare -p array_name

# 输出数组结构
echo "数组内容:"
printf "  %s\n" "${array[@]@A}"

# 调试模式下显示所有数组
( set -o posix ; set ) | grep -E '^[a-zA-Z_][a-zA-Z0-9_]*=' | grep -v '^BASH'
```
