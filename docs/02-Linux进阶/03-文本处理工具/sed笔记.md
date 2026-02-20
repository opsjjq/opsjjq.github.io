# 关于 Linux 三剑客

| 工具     | 擅长领域   | 特点               | 典型场景                   |
| :------- | :--------- | :----------------- | :------------------------- |
| **grep** | 查找匹配   | 快速过滤，正则匹配 | `grep "error" logfile`     |
| **sed**  | 编辑修改   | 流编辑，非交互式   | `sed 's/old/new/g' file`   |
| **awk**  | 格式化处理 | 字段处理，编程特性 | `awk '{print $1,$3}' file` |

# sed详解

## sed语法

### sed -选项 sed命令  数据源

```bash
sed -i  's/nameold/namenew/g' file
sed -i  's/nameold/namenew/' file
sed -i  '/line1/a line2' file
sed -i  '/line1/i line0' file
sed -i  '/line9/d' file 
sed -i  '/line6/c newline6' file

# a 是追加命令    \ 表示命令会跨越多行   下一行开始才是要追加的内容
sed -i '/line1/a\
line2\
line3\
line4' file
```



### 常用选项

| 选项     | 说明                      | 示例                               |
| :------- | :------------------------ | :--------------------------------- |
| `-n`     | 取消默认输出，配合`p`使用 | `sed -n '3p' file`                 |
| `-e`     | 执行多条sed命令           | `sed -e '1d' -e 's/foo/bar/' file` |
| `-f`     | 指定sed脚本文件           | `sed -f script.sed file`           |
| `-r`     | 使用扩展正则表达式        | `sed -r 's/(ab)+/CD/g' file`       |
| `-i`     | 直接修改源文件            | `sed -i 's/old/new/g' file`        |
| `-i.bak` | 修改前备份原文件          | `sed -i.bak 's/old/new/g' file`    |

### 命令

```text
a  追加，在指定行后添加一行或多行文本
c  取代指定的行
d  删除指定的行
D  删除模式空间的部分内容，直到遇到换行符 \n 结束操作，与多行模式相关
i  插入，在指定的行前添加一行或多行文本
h  把模式空间的内容复制到保持空间
H  把模式空间的内容追加到保持空间
g  把保持空间的内容复制到模式空间
G  把保持空间的内容追加到模式空间
x  交换模式空间和保持空间的内容
l  打印不可见的字符
n  清空模式空间，并读取下一行数据并追加到模式空间
N  不清空模式空间，并读取下一行数据并追加到模式空间
p  打印模式空间的内容，通常 p 会与选项 -n 一起使用
P  打印模式空间的内容，直到遇到换行符结束操作
q  退出 sed
r  从指定文件读取数据
s  取代，s#old#new#g，其中 g 是 s 命令的替代标志，注意和 g 命令区分
w  另存，把模式空间的内容保存到文件中
y  根据对应位置转换字符
:label  定义一个标签
t  如果前面的命令执行成功，则跳转到 t 指定的标签处继续执行，否则继续正常流程
```

## sed匹配

### sed匹配是按行来匹配

### sed匹配文本范围

| 范围        | 解释                                                         |
| ----------- | ------------------------------------------------------------ |
| 空地址      | 全文处理                                                     |
| 单地址      | 指定文件某一行                                               |
| `/pattern/` | 被模式匹配到的每一行  #写入正则，字符数据#                   |
| 范围区间    | `10,20 十到二十行`，`10,+5第10行向下5行`，`/pattern1/,/pattern2/` |
| 步长        | `1~2，表示1、3、5、7、9行`，`2~2两个步长，表示2、4、6、8、10、偶数行` |

### 匹配行操作范围     关于sed处理文件行范围语法

```bash
# 单行定位
sed '5{命令}' file              # 第5行
sed '${命令}' file             # 最后一行

# 范围定位
sed '3,8{命令}' file            # 3-8行
sed '10,+5{命令}' file          # 10-15行
sed '3,${命令}' file            # 第3行到末尾

# 模式匹配
sed '/^root/{命令}' file        # 匹配以root开头的行
sed '/start/,/end/{命令}' file  # start到end之间的行   指的是内容包含字符串

# 步长定位
sed '1~2{命令}' file            # 奇数行(1,3,5...)
sed '2~2{命令}' file            # 偶数行(2,4,6...)

# 从第3行开始，每隔2行处理一次
sed '3~2{命令}' file

# 从匹配"start"的行到第10行
sed '/start/,10{命令}' file

# 从第5行到匹配"end"的行
sed '5,/end/{命令}' file
```

# sed实用

## 插入数据

a指定行下一行添加

i指定行上一行添加

可使用\n添加多行数据

```bash
# SSH配置（多行插入）
sed -i '1i\# SSH安全配置\nPort 25515\nPermitRootLogin no\nPermitEmptyPasswords no\nUseDNS no\nGSSAPIAuthentication no' /etc/ssh/sshd_config
```

## 删除行

对匹配到的行进行删除操作  

```bash
删除第三行数据
sed '3 d'  t1.log

删除文件的3到6行
sed '3,6 d' t1.log

删除第三行开始，向下2行
sed '3,+2 d'  t1.log

删除奇数行 1,3,5,7,9
sed '1~2 d' t1.log

删除偶数行 2,4,6,8
sed '2~2 d' t1.log

保留前三行
sed '4,$ d'  t1.log 

找到game那一行，且删掉
sed '/game/ d' t1.log

删除game这一行到结尾
sed '/game/,$ d'  t1.log 

删除文件中所有包含game的行，以及它下一行
sed '/game/,+1 d' t1.log 
```

## 修改

(包括了替换)

修改数据，是一大重点，因为我们需要用sed来修改各种配置文件，sed这种非交互式修改文件内容，在脚本中实现自动化修改是最常见的。

如修改nginx的端口；

修改mysql的数据存储路径；

```bash
# Nginx端口修改
sed -i 's/listen 80;/listen 8080;/' /etc/nginx/nginx.conf

# 注释/取消注释行
sed -i '/^server_name/s/^/#/' nginx.conf      # 注释
sed -i '/^#server_name/s/^#//' nginx.conf     # 取消注释
```

## 查询

### 分组取出ip

按正则匹配内容打印行

```bash
去头  去尾
ifconfig eth0 | sed -e '2s/^.*inet //' -e '2s/netmask.*//p' -n 

分组提取法
ifconfig eth0 | sed -r '2s/^.*t (.*)n.*/\1/p' -n
```

### 日志处理

```bash
sed -n '/2025-10-01 10:00:00/,/2025-10-01 11:00:00/p' app.log
sed -n '/ERROR/,+3' app.log
```

---

## 五、sed vs awk vs grep

| 需求       | 推荐工具 | 示例                             | 说明       |
| :--------- | :------- | :------------------------------- | :--------- |
| 简单查找   | grep     | `grep "error" log`               | 最快最简   |
| 文本替换   | sed      | `sed 's/old/new/g' file`         | 行内编辑   |
| 列操作     | awk      | `awk '{print $1,$3}' file`       | 字段处理   |
| 复杂计算   | awk      | `awk '{sum+=$1} END{print sum}'` | 统计功能   |
| 多文件处理 | grep     | `grep -r "pattern" dir/`         | 递归搜索   |
| 结构化数据 | awk      | `awk -F, '{print $2}' csv`       | 分隔符处理 |
