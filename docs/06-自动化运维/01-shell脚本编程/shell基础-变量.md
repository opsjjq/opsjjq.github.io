# Shell编程基础

## 一、程序运行方式概述

### 解释型语言

- **Shell**：由C语言开发，弱数据类型脚本语言，无需声明变量类型，默认字符串。
- **Python**：跨平台解释型语言，支持面向对象、函数式编程，广泛应用于脚本与Web开发。

运行方式：

```bash
python start_celery_beat.py
```

### 编译型语言

- **Go**：静态编译型语言，编译后生成二进制可执行文件，适合系统级与并发应用。

运行方式：

```bash
go run hello.go      # 直接解释运行（类似解释型）
go build hello.go    # 编译生成二进制文件
./hello              # 运行编译后的程序
```

---

## 二、Shell 脚本基础

### 1. 脚本运行方式对比

| 方式                                | 是否创建子Shell      | 影响当前Shell | 适用场景           |
| :---------------------------------- | :------------------- | :------------ | :----------------- |
| `bash script.sh`                    | 是                   | 否            | 常规执行           |
| `source script.sh` 或 `. script.sh` | 否                   | 是            | 加载环境变量       |
| `./script.sh`                       | 是（取决于 shebang） | 否            | 直接执行可执行脚本 |
| `exec ./script.sh`                  | 否                   | 替换当前进程  | 进程替换场景       |

> **注意**：如果脚本中有 `exit` 命令，使用 `source` 执行会导致当前 Shell 退出。

### 2. 变量与作用域

- **局部变量**：不加 `export`，仅在当前 Shell 有效。
- **全局变量**：使用 `export` 导出，对当前 Shell 及其子进程可见。

示例：

```bash
name="局部变量"
export global_name="全局变量"
```

- **变量命名规范**：
  - 字母或下划线开头
  - 避免使用 Shell 关键字
  - 建议使用 `_` 连接单词，如 `my_var_name`
  - 系统变量通常全大写

### 3. 变量操作

#### 字符串类型：

```bash
name='张三'          # 单引号：原样输出
greet="Hello $name"  # 双引号：支持变量替换
cmd=`date +%F`       # 反引号：执行命令
cmd2=$(date +%F)     # $()：推荐写法
```

#### 提取变量值：

```bash
${变量名}           # 标准取值
${变量名:-默认值}   # 空值时使用默认值
${#变量名}          # 字符串长度
```

#### 删除变量：

```bash
unset 变量名
```

### 4. 特殊变量

| 变量        | 含义                       |
| :---------- | :------------------------- |
| `$0`        | 脚本名称                   |
| `$1` ~ `$n` | 位置参数                   |
| `$#`        | 参数个数                   |
| `$*`        | 所有参数（作为一个字符串） |
| `$@`        | 所有参数（保持独立）       |
| `$?`        | 上一条命令的返回值         |
| `$$`        | 当前进程 PID               |

> **`$\*` 与 `$@` 区别**：建议在循环中使用 `"$@"` 保持参数独立性。

---

## 三、交互式输入与脚本实战

### 1. `read` 命令

```bash
read -p "请输入用户名：" username
read -s -p "请输入密码：" password  # -s 隐藏输入
```

### 2. 实战脚本示例

#### 创建用户并设置密码：

```bash
#!/bin/bash
username=$1
password=$2
useradd $username
echo $password | passwd --stdin $username
```

#### 备份目录：

```bash
#!/bin/bash
read -p "请输入要备份的目录：" src
read -p "请输入备份目标路径：" dst
mkdir -p $dst && cp -a $src $dst
echo "备份完成"
```

#### 修改主机名与IP：

```bash
#!/bin/bash
read -p "请输入新主机名：" hostname
read -p "请输入新IP地址：" ip
hostnamectl set-hostname $hostname
sed -i "/IPADDR=/c IPADDR=$ip" /etc/sysconfig/network-scripts/ifcfg-eth0
systemctl restart network
```

---

## 四、Shell 数据类型与运算

### 1. 数据类型（弱类型）

- **字符串**：默认类型
- **整数**：需特殊处理才能进行数学运算
- **数组**：索引数组与关联数组
- **只读变量**：`readonly VAR=value`

### 2. 数学运算方法

| 方法     | 示例                   | 说明                 |
| :------- | :--------------------- | :------------------- |
| `expr`   | `expr 3 + 4`           | 需转义 `*`，空格严格 |
| `$(( ))` | `echo $((3 * 4))`      | 推荐整数运算         |
| `$[ ]`   | `echo $[3 * 4]`        | 简洁整数运算         |
| `let`    | `let result=3*4`       | 无空格要求           |
| `bc`     | `echo "3.14 * 2" | bc` | 支持小数运算         |

### 3. 实战练习

#### 简易计算器：

```bash
#!/bin/bash
echo "计算结果是：$[$1 $2 $3]"
```

运行：

```bash
./calculate.sh 3 \* 8
```

#### 服务器信息采集：

```bash
#!/bin/bash
echo "主机名：$(hostname)"
echo "IP地址：$(hostname -I)"
echo "内存使用率：$(free -m | awk 'NR==2{printf "%.2f%%", $3/$2*100}')"
echo "磁盘使用率：$(df -h / | awk 'NR==2{print $5}')"
```

---

## 五、Python 与 Go 示例

### Python 脚本示例：

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
print("Python 脚本运行示例")
```

### Go 脚本示例：

```go
package main
import "fmt"
func main() {
    fmt.Println("Go 语言示例")
}
```

---

## 六、编译型与解释型语言对比

| 特性     | 编译型（如 Go）      | 解释型（如 Python、Shell） |
| :------- | :------------------- | :------------------------- |
| 执行速度 | 快（二进制直接执行） | 慢（需解释器逐行翻译）     |
| 跨平台性 | 依赖平台架构         | 跨平台性好                 |
| 源码保护 | 可保护（二进制分发） | 源码暴露                   |
| 适用场景 | 系统工具、高并发应用 | 脚本、自动化、Web开发      |

---

## 七、Shell 脚本规范与开发支持

### 脚本编写规范：

1. 见名知意，以 `.sh` 结尾
2. 添加注释：作者、时间、功能说明
3. 统一存放脚本目录
4. 使用语法高亮编辑器（如 Vim）

### Vim 插件示例（自动添加文件头）：

```vim
autocmd BufNewFile *.sh call AddFileInformation_sh()
function AddFileInformation_sh()
    let infor = "#!/bin/bash\n"
    \."# Author: your_name\n"
    \."# Date: ".strftime("%Y-%m-%d %H:%M")."\n"
    silent put! =infor
endfunction
```

---

## 八、括号在 Shell 中的用途总结

| 括号 | 主要用途                     |
| :--- | :--------------------------- |
| `{}` | 变量扩展、数组访问、代码块   |
| `[]` | 条件测试、数组索引           |
| `()` | 数组定义、子 Shell、命令分组 |

示例：

```bash
# 变量扩展
${name}
# 条件测试
[ "$a" -eq "$b" ]
# 子 Shell
(cd /tmp && ls)
```
