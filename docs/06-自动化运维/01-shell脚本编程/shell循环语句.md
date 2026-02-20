# Shell 循环语句详解：for 与 while

## 一、for 循环

### 1.1 基本语法

```bash
# 方式1：使用范围表达式
for i in {1..10}
do
    echo $i
done

# 方式2：使用seq命令
for i in $(seq 1 10); do
    echo $i
done

# 单行写法
for i in {1..4}; do echo "aaa"; done
```

### 1.2 适用场景

#### 1.2.1 遍历字符串列表

```bash
#!/bin/bash
for i in "红烧肉" "酱牛肉" "烤羊肉串" "烤土豆片"
do
    echo "菜品：$i"
done
```

#### 1.2.2 遍历数组

```bash
#!/bin/bash
# 定义数组
dishes=("红烧肉" "酱牛肉" "烤羊肉串" "烤土豆片")

# 遍历数组
for i in "${dishes[@]}"; do
    echo "菜品：$i"
done
```

### 1.3 特殊技巧

#### 1.3.1 提取PATH变量

```bash
#!/bin/bash
# 方法1：使用sed替换分隔符
new_path=$(echo $PATH | sed 's#:# #g')
for p in $new_path; do
    echo "$p"
done

# 方法2：使用awk（推荐）
echo $PATH | awk -F ':' '{
    for (i=1;i<=NF;i++) 
        print $i
}'
```

#### 1.3.2 修改IFS分隔符

```bash
#!/bin/bash
all_cai="红烧肉#五花肉#爆炒腰花#酱牛肉#酱牛毽子#烤羊肉串#烤羊宝#烤土豆片#烤菜花"
IFS="#"
for i in $all_cai; do 
    echo "$i"
done
# 注意：修改IFS会影响后续命令，建议保存和恢复原IFS值
```

### 1.4 实用案例

#### 1.4.1 批量用户管理

```bash
#!/bin/bash
case $1 in
    "create")
        for num in {1..10}; do
            useradd user${num}
            echo "password${num}" | passwd --stdin user${num}
        done
        ;;
    "delete")
        for num in {1..10}; do
            userdel -r user${num}
        done
        ;;
    *)
        echo "用法: $0 {create|delete}"
        ;;
esac
```

#### 1.4.2 网络探测

```bash
#!/bin/bash
# 探测网段存活主机
network="10.0.0"
for i in {1..254}; do
    ip="${network}.$i"
    if ping -c 1 -W 1 $ip &> /dev/null; then
        echo "$ip 存活"
    else
        echo "$ip 未响应"
    fi
done
```

#### 1.4.3 数据备份

```bash
#!/bin/bash
# MySQL表备份
now=$(date +%F-%T)
tables=$(mysql -uroot -p123123 -se "SHOW TABLES FROM db1;" | grep -v '^Tables')

backup_dir="/backup/db1"
mkdir -p "$backup_dir"

for table in $tables; do
    mysqldump -uroot -p123123 db1 "$table" > "${backup_dir}/${table}_${now}.sql"
    echo "已备份: $table"
done
```

---

## 二、while 循环

### 2.1 基本语法

```bash
# 不确定循环次数时使用while
while [ condition ]
do
    commands
done
```

### 2.2 基本示例

```bash
#!/bin/bash
# 计数器循环
count=1
while [ $count -le 5 ]; do
    echo "计数: $count"
    count=$((count + 1))
done
```

### 2.3 文件处理

#### 2.3.1 逐行读取文件

```bash
#!/bin/bash
lineno=1
while IFS= read -r line; do
    printf "%3d: %s\n" "$lineno" "$line"
    ((lineno++))
done < "filename.txt"
```

#### 2.3.2 处理/etc/passwd

```bash
#!/bin/bash
# 提取可登录用户
while IFS=: read -r username _ uid gid desc home shell; do
    if [[ "$shell" == */bash ]]; then
        echo "可登录用户: $username (UID: $uid)"
    fi
done < /etc/passwd
```

### 2.4 数值计算

#### 2.4.1 累加计算

```bash
#!/bin/bash
# 1-100累加
sum=0
i=1
while [ $i -le 100 ]; do
    sum=$((sum + i))
    ((i++))
done
echo "1-100的和: $sum"
```

#### 2.4.2 奇偶数分别累加

```bash
#!/bin/bash
# 只加奇数
odd_sum=0
i=1
while [ $i -le 100 ]; do
    if [ $((i % 2)) -eq 1 ]; then
        odd_sum=$((odd_sum + i))
    fi
    ((i++))
done
echo "1-100奇数和: $odd_sum"

# 只加偶数
even_sum=0
i=1
while [ $i -le 100 ]; do
    if [ $((i % 2)) -eq 0 ]; then
        even_sum=$((even_sum + i))
    fi
    ((i++))
done
echo "1-100偶数和: $even_sum"
```

### 2.5 控制流程

#### 2.5.1 break和continue

```bash
#!/bin/bash
# 跳过特定数字
i=0
while [ $i -lt 10 ]; do
    ((i++))
    if [[ $i -eq 4 || $i -eq 8 ]]; then
        continue  # 跳过4和8
    fi
    echo "当前数字: $i"
done

# 猜数字游戏
target=8
attempts=0
while true; do
    read -p "猜一个数字(1-10): " guess
    ((attempts++))
    
    if [ "$guess" -eq "$target" ]; then
        echo "恭喜！猜对了！"
        break
    elif [ "$guess" -lt "$target" ]; then
        echo "猜小了"
    else
        echo "猜大了"
    fi
done
echo "总共尝试了 $attempts 次"
```

#### 2.5.2 密码验证

```bash
#!/bin/bash
# 限制3次验证机会
max_attempts=3
attempt=0
correct_pass="qwe"

while [ $attempt -lt $max_attempts ]; do
    read -sp "请输入密码(剩余$((max_attempts - attempt))次机会): " input_pass
    echo
    ((attempt++))
    
    if [ "$input_pass" = "$correct_pass" ]; then
        echo "密码正确！"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "错误次数过多，系统锁定！"
        exit 1
    fi
done
```

### 2.6 实用案例

#### 2.6.1 跳板机菜单

```bash
#!/bin/bash
while true; do
    clear
    echo "=== 服务器连接菜单 ==="
    echo "1. 连接 Web服务器1 (10.0.0.7)"
    echo "2. 连接 Web服务器2 (10.0.0.9)"
    echo "3. 连接数据库服务器"
    echo "4. 退出"
    echo "====================="
    
    read -p "请选择: " choice
    
    case $choice in
        1)
            ssh user@10.0.0.7
            ;;
        2)
            ssh user@10.0.0.9
            ;;
        3)
            ssh user@db.example.com
            ;;
        4)
            echo "再见！"
            break
            ;;
        *)
            echo "无效选择，请重试"
            sleep 2
            ;;
    esac
done
```

#### 2.6.2 监控脚本

```bash
#!/bin/bash
# 监控服务状态
service_name="nginx"
check_interval=10  # 秒

echo "开始监控 $service_name 服务..."
while true; do
    if systemctl is-active --quiet "$service_name"; then
        echo "$(date): $service_name 运行正常"
    else
        echo "$(date): 警告！$service_name 服务停止，正在重启..."
        systemctl restart "$service_name"
    fi
    sleep $check_interval
done
```

---

## 三、选择指南

### 3.1 for vs while 如何选择

| 场景          | 推荐使用   | 原因                    |
| :------------ | :--------- | :---------------------- |
| 已知循环次数  | for        | 语法简洁，易于理解      |
| 遍历数组/列表 | for        | 直接支持数组遍历        |
| 文件逐行处理  | while      | 更适合不确定行数的情况  |
| 条件循环      | while      | 更适合基于条件的循环    |
| 无限循环      | while true | while更适合无限循环场景 |

### 3.2 最佳实践建议

1. **变量引用**：始终使用双引号引用变量，防止空格引起的错误
2. **整数运算**：使用 `$(( ))` 或 `let` 进行整数运算
3. **数组遍历**：使用 `"${array[@]}"` 安全遍历数组元素
4. **文件读取**：使用 `while IFS= read -r` 安全读取文件
5. **错误处理**：重要的循环添加错误检查和超时机制
6. **性能考虑**：避免在循环内启动子shell，减少性能开销

### 3.3 性能对比示例

```bash
#!/bin/bash
# 方法1：使用for + seq（较慢）
time for i in $(seq 1 10000); do
    : # 空操作
done

# 方法2：使用for + 范围表达式（较快）
time for i in {1..10000}; do
    : # 空操作
done

# 方法3：使用C风格的for（最快）
time for ((i=1; i<=10000; i++)); do
    : # 空操作
done
```

---

## 四、高级技巧

### 4.1 嵌套循环

```bash
#!/bin/bash
# 乘法表
for ((i=1; i<=9; i++)); do
    for ((j=1; j<=i; j++)); do
        printf "%d×%d=%-2d " $j $i $((i*j))
    done
    echo
done
```

### 4.2 并行处理

```bash
#!/bin/bash
# 使用后台进程实现简单并行
for ip in {1..10}; do
    ping -c 1 "192.168.1.$ip" > /dev/null 2>&1 &
done
wait  # 等待所有后台进程完成
echo "所有ping测试完成"
```

### 4.3 进度显示

```bash
#!/bin/bash
# 带进度条的循环
total=50
for ((i=1; i<=total; i++)); do
    # 计算百分比
    percent=$((100*i/total))
    
    # 生成进度条
    bar=""
    for ((j=0; j<percent/2; j++)); do
        bar+="█"
    done
    
    printf "\r[%-50s] %d%%" "$bar" "$percent"
    sleep 0.1
done
echo
```

---

## 五、循环控制语句

### 5.1 break 关键字

- **作用**：立即终止当前循环，跳出循环体
- **适用场景**：满足特定条件时提前结束循环

```bash
#!/bin/bash
# 找到第一个满足条件的数字后停止
for i in {1..20}
do
    echo "当前数字: $i"
    if [ $i -eq 11 ]; then
        echo "找到数字11，终止循环"
        break
    fi
    echo "继续循环..."
done
echo "程序结束"
```

### 5.2 continue 关键字

- **作用**：跳过本次循环的剩余部分，继续下一次循环
- **适用场景**：需要跳过特定条件的循环

```bash
#!/bin/bash
# 跳过特定数字（6和16）
for i in {1..20}
do
    if [ $i -eq 6 ] || [ $i -eq 16 ]; then
        echo "跳过数字: $i"
        continue
    fi
    echo "处理数字: $i"
done
echo "程序结束"
```

### 5.3 exit 关键字

- **作用**：立即终止整个脚本的执行
- **退出码**：可以指定退出状态码（0表示成功，非0表示失败）

```bash
#!/bin/bash
# 错误处理示例
if [ ! -f "/etc/passwd" ]; then
    echo "错误：文件不存在"
    exit 1  # 退出并返回错误码1
fi

echo "文件存在，继续执行..."
exit 0  # 正常退出
```
