# DDL（数据库定义语言）详解

## 一、MySQL 数据类型

### 1.1 文本类型

| 数据类型          | 描述                                      |
| :---------------- | :---------------------------------------- |
| CHAR(size)        | 固定长度字符串，最多255字符               |
| VARCHAR(size)     | 可变长度字符串，最多255字符（超长转TEXT） |
| TINYTEXT          | 最大255字符                               |
| TEXT              | 最大65,535字符                            |
| MEDIUMTEXT        | 最大16,777,215字符                        |
| LONGTEXT          | 最大4,294,967,295字符                     |
| ENUM('x','y','z') | 枚举类型，最多65,535个值                  |
| SET               | 集合类型，最多64个选项                    |

### 1.2 数字类型

| 数据类型        | 描述                                       |
| :-------------- | :----------------------------------------- |
| TINYINT(size)   | -128~127，无符号0~255                      |
| SMALLINT(size)  | -32768~32767，无符号0~65535                |
| MEDIUMINT(size) | -8388608~8388607，无符号0~16777215         |
| INT(size)       | -2147483648~2147483647，无符号0~4294967295 |
| BIGINT(size)    | -9.22×10¹⁸~9.22×10¹⁸，无符号0~1.84×10¹⁹    |
| FLOAT(size,d)   | 单精度浮点数                               |
| DOUBLE(size,d)  | 双精度浮点数                               |
| DECIMAL(size,d) | 精确小数，以字符串形式存储                 |

**注意**：添加`UNSIGNED`属性可将范围从0开始。

### 1.3 日期/时间类型

| 数据类型  | 格式                | 范围                                              |
| :-------- | :------------------ | :------------------------------------------------ |
| DATE      | YYYY-MM-DD          | 1000-01-01 ~ 9999-12-31                           |
| DATETIME  | YYYY-MM-DD HH:MM:SS | 1000-01-01 00:00:00 ~ 9999-12-31 23:59:59         |
| TIMESTAMP | YYYY-MM-DD HH:MM:SS | 1970-01-01 00:00:01 UTC ~ 2038-01-09 03:14:07 UTC |
| TIME      | HH:MM:SS            | -838:59:59 ~ 838:59:59                            |
| YEAR      | YYYY 或 YY          | 1901~2155 或 1970~2069                            |

---

## 二、数据库操作

### 2.1 创建数据库

```sql
-- 基本创建
CREATE DATABASE `test1`;

-- 完整创建（推荐）
CREATE DATABASE IF NOT EXISTS `test1` DEFAULT CHARSET utf8mb4;

-- 使用数据库
USE `test1`;

-- 删除数据库
DROP DATABASE `test1`;
```

### 2.2 查看数据库信息

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 查看指定数据库创建语句
SHOW CREATE DATABASE test1;
```

### 2.3 修改数据库字符集

```sql
ALTER DATABASE 库名 CHARSET 新的字符集;
```

### 2.4 设置MySQL默认字符集

```bash
# 修改配置文件 /etc/my.cnf
cat >/etc/my.cnf <<'EOF'
[mysqld]
character_set_server=utf8mb4
port=3306
user=mysql
basedir=/opt/mysql
datadir=/www.yuchaoit.cn/mysql_3306
socket=/tmp/mysql.sock

[mysql]
socket=/tmp/mysql.sock
EOF

# 重启MySQL服务
systemctl restart mysql
```

---

## 三、数据表操作

### 3.1 创建表规范

1. 表名不以数字开头，见名知意，不超过18字符
2. 默认使用InnoDB引擎
3. 默认字符集utf8mb4
4. 字段名与业务相关，不超过18字符
5. 选择合适的数据类型节省空间
6. 字段建议NOT NULL，有注释
7. 每张表应有主键
8. NOT NULL字段应有默认值
9. 为表添加注释

### 3.2 创建表示例

```sql
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '学号',
  `name` varchar(64) NOT NULL COMMENT '学生姓名',
  `age` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '学生年龄',
  `gender` enum('男','女') NOT NULL DEFAULT '男' COMMENT '学生性别',
  `address` varchar(100) DEFAULT NULL COMMENT '地址',
  `intime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入学时间',
  `phone` char(11) DEFAULT NULL COMMENT '手机号',
  `height` float(4,2) DEFAULT NULL COMMENT '身高(米)',
  `score` decimal(5,2) DEFAULT '0.00' COMMENT '成绩',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生信息表';
```

### 3.3 查看表结构

```sql
-- 查看表结构
DESC students;

-- 查看完整表信息
SHOW FULL COLUMNS FROM students;

-- 查看表创建语句
SHOW CREATE TABLE students;
```

### 3.4 复制表

```sql
-- 方法1：复制结构
CREATE TABLE students_new LIKE students;

-- 方法2：复制结构+数据
CREATE TABLE students_new AS SELECT * FROM students;
```

---

## 四、ALTER TABLE 操作

### 4.1 基本语法

```sql
ALTER TABLE 表名 具体操作;
```

### 4.2 添加字段

```sql
-- 在末尾添加字段
ALTER TABLE students ADD COLUMN hobby char(20) NOT NULL DEFAULT '看美女' COMMENT '兴趣爱好';

-- 在第一列添加字段
ALTER TABLE students ADD COLUMN height float(4,1) DEFAULT NULL COMMENT '学生身高' FIRST;

-- 在指定字段后添加
ALTER TABLE students ADD COLUMN study_school char(15) NOT NULL COMMENT '学习的学校' AFTER address;
```

### 4.3 修改字段

#### MODIFY（修改字段属性）

```sql
ALTER TABLE 表名 MODIFY 字段名 新数据类型 [约束条件] [注释];

-- 示例：修改字段数据类型和默认值
ALTER TABLE students MODIFY name varchar(5) NOT NULL DEFAULT '佚名' COMMENT '姓名';
```

#### CHANGE（修改字段名和属性）

```sql
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 新数据类型 [约束条件] [注释];

-- 示例：修改字段名和属性
ALTER TABLE students CHANGE hobby good_hobby char(50) NOT NULL DEFAULT '多学习' COMMENT '活的长久的秘诀';
```

### 4.4 删除字段

```sql
ALTER TABLE students DROP COLUMN study_school;
```

### 4.5 修改表属性

```sql
-- 修改表名
ALTER TABLE students RENAME TO new_students;

-- 修改表字符集
ALTER TABLE students CHARSET=utf8mb4;

-- 修改存储引擎
ALTER TABLE students ENGINE=InnoDB;
```

### 4.6 删除表

```sql
-- 删除表（危险操作）
DROP TABLE students;
```

---

## 五、总结对比

| 操作         | MODIFY     | CHANGE           |
| :----------- | :--------- | :--------------- |
| 修改字段名   | ❌ 不支持   | ✅ 支持           |
| 修改数据类型 | ✅ 支持     | ✅ 支持           |
| 修改约束条件 | ✅ 支持     | ✅ 支持           |
| 语法复杂度   | 简单       | 稍复杂           |
| 适用场景     | 仅修改属性 | 修改字段名和属性 |

---

## 六、最佳实践

1. **创建数据库时**：使用完整语法，指定字符集
2. **创建表时**：遵循命名规范，添加注释，选择合适数据类型
3. **修改表结构时**：
   - 业务低峰期操作
   - 使用MODIFY只改属性
   - 使用CHANGE改字段名
   - 批量修改时保持原有属性
4. **删除操作时**：确认后再执行，避免数据丢失
5. **备份习惯**：重要操作前备份数据

---

**重要提示**：

- DDL操作会锁定表，影响业务，建议在维护窗口进行
- 修改字段数据类型可能影响已有数据
- 删除操作不可逆，务必谨慎
- 生产环境严格控制DROP权限
