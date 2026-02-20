# Shell 条件判断与流程控制综合整理

## 一、逻辑组合判断

### 1. 基础逻辑运算符（test命令）

| 运算符           | 含义   | 示例                     |
| :--------------- | :----- | :----------------------- |
| `! expr`         | 逻辑非 | `[ ! -f file ]`          |
| `expr1 -a expr2` | 逻辑与 | `[ -f file -a -r file ]` |
| `expr1 -o expr2` | 逻辑或 | `[ -f file -o -d dir ]`  |

### 2. Bash扩展测试（双括号`[[ ]]`）

| 运算符 | 含义               | 示例                       |
| :----- | :----------------- | :------------------------- |
| `=~`   | 正则表达式匹配     | `[[ "$str" =~ ^[0-9]+$ ]]` |
| `==`   | 模式匹配（通配符） | `[[ "$file" == *.sh ]]`    |
| `&&`   | 逻辑与             | `[[ -f file && -r file ]]` |
| `||`   | 逻辑或             | `[[ -f file || -d dir ]]`  |

**注意**：`[`是命令，`[[`是关键字，后者功能更强大，支持正则和模式匹配。

---

## 二、条件判断类型

### 1. 文件判断

| 运算符    | 含义          | 示例                 |
| :-------- | :------------ | :------------------- |
| `-f file` | 普通文件存在  | `[ -f /etc/passwd ]` |
| `-d file` | 目录存在      | `[ -d /etc ]`        |
| `-e file` | 文件/目录存在 | `[ -e /some/path ]`  |
| `-L file` | 符号链接存在  | `[ -L /bin/sh ]`     |
| `-r file` | 可读          | `[ -r file.txt ]`    |
| `-w file` | 可写          | `[ -w file.txt ]`    |
| `-x file` | 可执行        | `[ -x /bin/bash ]`   |
| `-s file` | 非空文件      | `[ -s data.log ]`    |

### 2. 整数比较

| 运算符 | 含义     | 示例            |
| :----- | :------- | :-------------- |
| `-eq`  | 等于     | `[ $a -eq $b ]` |
| `-ne`  | 不等于   | `[ $a -ne $b ]` |
| `-lt`  | 小于     | `[ $a -lt $b ]` |
| `-le`  | 小于等于 | `[ $a -le $b ]` |
| `-gt`  | 大于     | `[ $a -gt $b ]` |
| `-ge`  | 大于等于 | `[ $a -ge $b ]` |

### 3. 字符串判断

| 运算符         | 含义       | 示例                |
| :------------- | :--------- | :------------------ |
| `-z str`       | 空字符串   | `[ -z "$str" ]`     |
| `-n str`       | 非空字符串 | `[ -n "$str" ]`     |
| `str1 = str2`  | 相等       | `[ "$a" = "$b" ]`   |
| `str1 != str2` | 不相等     | `[ "$a" != "$b" ]`  |
| `str1 < str2`  | 字典序小于 | `[[ "$a" < "$b" ]]` |
| `str1 > str2`  | 字典序大于 | `[[ "$a" > "$b" ]]` |

---

## 三、Case语句

### 1. 语法结构

```bash
case 变量 in
    模式1)
        命令1
        ;;
    模式2)
        命令2
        ;;
    *)  # 默认匹配
        默认命令
        ;;
esac
```

### 2. 模式匹配支持

- 具体值：`"start"`、`"stop"`
- 通配符：
  - `*` 匹配任意字符串
  - `?` 匹配单个字符
  - `[abc]` 匹配指定字符集
  - `[a-z0-9]` 匹配字符范围
  - `|` 或功能（如 `[a-z]|[A-Z]`）

### 3. 主要应用场景

1. **菜单选择**：用户交互式选择
2. **服务管理**：`start`/`stop`/`restart`控制
3. **命令行解析**：参数处理
4. **状态机实现**：多条件分支

---

## 四、脚本实践示例

### 1. 猜数字脚本

```bash
#!/bin/bash
result=66
read -p "请输入数字: " num

if [[ $num =~ [^0-9] ]]; then
    echo "请输入纯数字整数！"
    exit 1
fi

if [ $num -gt $result ]; then
    echo "猜大了！"
elif [ $num -lt $result ]; then
    echo "猜小了！"
else
    echo "恭喜你，猜对了！"
fi
```

### 2. 登录验证

```bash
#!/bin/bash
read -p "请输入用户名: " username
read -p "请输入密码: " password -s

if [[ $username == "admin" && $password == "123456" ]]; then
    echo -e "\n登录成功！"
else
    echo -e "\n账号或密码错误！"
fi
```

### 3. 计算器（Case版）

```bash
#!/bin/bash
read -p "输入第一个数字: " num1
read -p "输入第二个数字: " num2

echo "请选择运算:"
echo "1) 加  2) 减  3) 乘  4) 除"
read -p "选择(1-4): " op

case $op in
    1) echo "结果: $((num1 + num2))" ;;
    2) echo "结果: $((num1 - num2))" ;;
    3) echo "结果: $((num1 * num2))" ;;
    4) [ $num2 -eq 0 ] && echo "除数不能为0" || echo "结果: $((num1 / num2))" ;;
    *) echo "无效选择" ;;
esac
```

### 4. 服务管理脚本

```bash
#!/bin/bash
case $1 in
    start)
        systemctl start nginx
        echo "Nginx 已启动"
        ;;
    stop)
        systemctl stop nginx
        echo "Nginx 已停止"
        ;;
    restart)
        systemctl restart nginx
        echo "Nginx 已重启"
        ;;
    status)
        systemctl status nginx
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
```

### 5. 成绩评级

```bash
#!/bin/bash
read -p "请输入成绩(0-100): " score

if [[ ! $score =~ ^[0-9]+$ ]] || [ $score -lt 0 ] || [ $score -gt 100 ]; then
    echo "请输入0-100之间的整数"
    exit 1
fi

case 1 in
    $(($score < 60))) echo "不及格" ;;
    $(($score <= 80))) echo "良好" ;;
    *) echo "优秀" ;;
esac
```

---

## 五、实用技巧

### 1. 颜色输出

```bash
echo -e "\033[32m绿色文字\033[0m"      # 绿色
echo -e "\033[31;42m红字绿底\033[0m"   # 红色文字，绿色背景
```

颜色代码：

- 前景色：30-37（黑、红、绿、黄、蓝、品红、青、白）
- 背景色：40-47
- 特效：1(粗体)、4(下划线)、5(闪烁)、7(反显)

### 2. 逻辑组合技巧

```bash
# 条件执行
[ 条件 ] && 成功命令 || 失败命令

# 示例：检查文件并备份
[ -f file.log ] && cp file.log file.log.bak || echo "文件不存在"
```

### 3. 输入验证

```bash
# 验证6位数字密码
if [[ $1 =~ ^[0-9]{6}$ ]]; then
    echo "密码格式正确"
else
    echo "密码必须是6位纯数字"
fi
```

---

## 六、注意事项

1. **字符串比较**：始终用双引号包裹变量，防止空值错误
2. **整数运算**：使用`$(( ))`进行算术运算
3. **文件测试**：检查文件前先验证路径有效性
4. **Case语句**：每个分支以`;;`结束，`*)`处理默认情况
5. **退出状态**：脚本应使用合适的退出码（0成功，非0失败）
