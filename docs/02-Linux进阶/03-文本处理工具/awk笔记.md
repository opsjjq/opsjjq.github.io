---
title: AWK笔记
---

## Linux 三剑客 - AWK 文本处理

---

## 一、工具对比

| 工具 | 擅长领域 | 特点 | 典型场景 |
| :--- | :--- | :--- | :--- |
| **grep** | 查找匹配 | 快速过滤，正则匹配 | `grep "error" logfile` |
| **sed** | 编辑修改 | 流编辑，非交互式 | `sed 's/old/new/g' file` |
| **awk** | 格式化处理 | 字段处理，编程特性 | `awk '{print $1,$3}' file` |

---

## 二、AWK 核心概念

### 1. AWK 是什么？

AWK 是一种**文本处理编程语言**，专为在 UNIX/Linux 环境下对文本数据进行处理而设计。

| 功能 | 说明 |
| :--- | :--- |
| 扫描 | 逐行读取文本数据 |
| 过滤 | 基于条件筛选数据行 |
| 提取 | 按字段获取特定数据 |
| 格式化 | 按需求重新组织输出 |
| 计算 | 执行统计和数学运算 |

### 2. 基础语法

```sh
awk [选项] '模式 {动作}' 文件/数据流  # 命令行模式
awk [选项] -f 脚本文件 文件           # 脚本模式
```

| 选项 | 说明 |
| :--- | :--- |
| `-F fs` | 指定输入字段分隔符（默认：空格/制表符） |
| `-v var=值` | 定义变量并赋值 |
| `-f 文件` | 从文件读取 awk 脚本 |

---

## 三、AWK 处理流程

```text
输入数据 → BEGIN块 → 主循环(逐行处理) → END块 → 输出结果
        ↓          ↓                 ↓         ↓
    初始化   匹配模式执行动作       最终处理
```

---

## 四、核心功能详解

### 1. 数据字段提取

**默认分隔符（空格/制表符）：**

```sh
awk '{print $1}' test.log           # 提取第一列
awk '{print $1,$3}' test.log       # 提取第一列和第三列
awk '{print $(NF-1), $NF}' test.log  # 提取倒数两列
```

**指定分隔符：**

```sh
awk -F ':' '{print "用户名:", $1, "UID:", $3}' /etc/passwd
awk -F '[:|]' '{print $1, $2}' file.txt
```

### 2. 内置变量

#### 行相关变量

| 变量 | 说明 |
| :--- | :--- |
| `NR` | 当前行号（Number of Record） |
| `FNR` | 当前文件中的行号（File Number of Record） |

```sh
awk '{print NR, $0}' file.txt              # 行号在前
awk '{print $0, "行号:", NR}' file.txt     # 行号在后
awk 'NR==5{print $0}' file.txt             # 仅第 5 行
awk 'NR>=10 && NR<=20{print $0}' file.txt  # 10-20 行
awk 'NR%2==0{print $0}' file.txt           # 偶数行
```

#### 列相关变量

| 变量 | 说明 |
| :--- | :--- |
| `NF` | 当前行的字段数（Number of Field） |
| `$0` | 整行内容 |
| `$1,$2,...$NF` | 第 1,2,... 最后一个字段 |

```sh
awk '{print "本行有", NF, "列"}' file.txt
awk '{print "第一列:", $1, "最后一列:", $NF}' file.txt
awk '{print "倒数第二列:", $(NF-1)}' file.txt
```

#### 分隔符变量

| 变量 | 说明 |
| :--- | :--- |
| `FS` | 输入字段分隔符（默认空格） |
| `RS` | 输入记录（行）分隔符（默认换行符） |
| `OFS` | 输出字段分隔符（默认空格） |
| `ORS` | 输出记录（行）分隔符（默认换行符） |

```sh
echo "a:b:c" | awk -v FS=':' -v OFS='|' '{print $1,$2,$3}'  # 输出: a|b|c
echo "姓名:张三;年龄:25;城市:北京" | awk -v RS=';' '{print $0}'
```

---

## 五、模式匹配

### 1. 正则表达式匹配

```sh
awk '/error/{print NR ":" $0}' logfile           # 包含 error 的行
awk '/^[0-9]+/{print $0}' file.txt              # 以数字开头
awk '/[Aa]pple/{print $0}' fruit.txt            # 包含 Apple 或 apple
awk '!/error/{print $0}' logfile                # 不包含 error 的行
```

### 2. 字段值匹配

```sh
awk '$1=="root"{print $0}' /etc/passwd          # 第一列等于 root
awk '$3>1000{print $0}' /etc/passwd            # UID 大于 1000
awk '$1=="root" && $3==0{print $0}' /etc/passwd  # root 且 UID 为 0
awk '$1=="root" || $1=="admin"{print $0}' file.txt  # root 或 admin
```

### 3. 范围模式

```sh
awk 'NR>=5 && NR<=10{print $0}' file.txt       # 5-10 行
awk '/start/,/end/{print $0}' file.txt          # start 到 end 之间的行
awk 'NR==10,/error/{print $0}' logfile         # 第 10 行到包含 error 的行
```

---

## 六、BEGIN 和 END 块

```sh
awk 'BEGIN{
    FS=":"                                       # 设置输入分隔符
    OFS="\t"                                     # 设置输出分隔符
    count=0                                      # 初始化计数器
    print "用户\tUID\tGID"                       # 打印表头
}
{
    count++                                      # 统计行数
    print $1,$3,$4                               # 处理每行数据
}
END{
    print "================"
    print "总计用户数:", count
    print "处理完成!"
}' /etc/passwd
```

---

## 七、实战案例

### 案例 1：统计单词频率

```sh
awk -v RS='[^a-zA-Z0-9]+' '{
    word = tolower($0)
    count[word]++
}
END{
    for(w in count) print count[w], w
}' article.txt | sort -rn | head -5
```

### 案例 2：系统监控

```sh
top -bn1 | awk '/^%Cpu/{print "用户CPU:", $2, "%", "系统CPU:", $4, "%"}'
free -m | awk '/^Mem:/{print "总内存:", $2, "M", "已使用:", $3, "M", "使用率:", $3/$2*100, "%"}'
```

### 案例 3：日志分析

```sh
awk '{status_count[$9]++} END{for(code in status_count) print code, status_count[code]}' access.log
awk '{ip_count[$1]++} END{for(ip in ip_count) if(ip_count[ip]>100) print ip, ip_count[ip]}' access.log | sort -rnk2
```

### 案例 4：数据报表

```sh
awk -F',' 'BEGIN{
    print "=== 销售报表 ==="
    printf "%-10s %-8s %-10s %-10s\n", "产品", "数量", "单价", "总价"
    total=0
}
{
    product=$1
    qty=$2
    price=$3
    subtotal=qty*price
    total+=subtotal
    printf "%-10s %-8d %-10.2f %-10.2f\n", product, qty, price, subtotal
}
END{
    print "========================="
    printf "总计: %.2f\n", total
}' sales.csv
```

```bash
# 原文内容
I have a dog, it is lovely, it is called Mimi. Every time I go home...

# 统计前5个高频词
awk -v RS='[^a-zA-Z0-9]+' '{
    word = tolower($0)      # 转小写
    count[word]++           # 统计词频
} 
END{
    for(w in count){
        print count[w], w   # 输出 频率 单词
    }
}' article.txt | sort -rn | head -5

# 更简洁版本
awk '{for(i=1;i<=NF;i++) words[tolower($i)]++} END{for(w in words) print words[w],w}' article.txt | sort -rn | head -5
```

#### 案例2：系统监控

```bash
# 监控CPU使用率（top命令输出）
top -bn1 | awk '/^%Cpu/{print "用户CPU:", $2, "%", "系统CPU:", $4, "%"}'

# 监控内存使用
free -m | awk '/^Mem:/{print "总内存:", $2, "M", "已使用:", $3, "M", "使用率:", $3/$2*100, "%"}'
```

#### 案例3：日志分析

```bash
# 统计HTTP状态码
awk '{status_count[$9]++} END{for(code in status_count) print code, status_count[code]}' access.log

# 统计IP访问量
awk '{ip_count[$1]++} END{for(ip in ip_count) if(ip_count[ip]>100) print ip, ip_count[ip]}' access.log | sort -rnk2
```

#### 案例4：数据报表

```bash
# 生成销售报表
awk -F',' 'BEGIN{
    print "=== 销售报表 ==="
    printf "%-10s %-8s %-10s %-10s\n", "产品", "数量", "单价", "总价"
    total=0
}
{
    product=$1
    qty=$2
    price=$3
    subtotal=qty*price
    total+=subtotal
    printf "%-10s %-8d %-10.2f %-10.2f\n", product, qty, price, subtotal
}
END{
    print "========================="
    printf "总计: %.2f\n", total
}' sales.csv
```
