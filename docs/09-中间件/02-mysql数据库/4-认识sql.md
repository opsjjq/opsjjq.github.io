# SQL 语言基础与 MySQL 数据库操作指南

## 一、导出与导入数据库

### 1. 导出数据库

使用 `mysqldump` 命令行工具将数据库导出为 SQL 文件。

**导出指定数据库：**

```bash
mysqldump -u root -p testdb > /path/to/testdb.sql
```

**导出多个数据库：**

```bash
mysqldump -u root -p --databases db1 db2 > /path/to/databases.sql
```

**导出所有数据库：**

```bash
mysqldump -u root -p --all-databases > /path/to/all_databases.sql
```

### 2. 导入数据库

**命令行导入：**

```bash
mysql -uroot -p < /path/to/testdb.sql
```

**MySQL 环境导入：**

```sql
mysql> source /path/to/testdb.sql;
```

### 3. 其他常用选项

- `--add-drop-table`：在每个表的创建语句前添加 `DROP TABLE IF EXISTS` 语句
- `--single-transaction`：导出过程中不锁表（适用于 InnoDB）
- `--routines`：导出存储过程和函数
- `--triggers`：导出触发器

---

## 二、认识 SQL

**SQL（Structured Query Language）** 是结构化查询语言，用于关系型数据库的数据定义和操作，是大多数关系型数据库管理系统的工业标准语言。

---

## 三、SQL 四大分类

### 1. **DDL（数据定义语言）**

用于定义数据库、表、列等对象的结构。

**常用动词：**

- `CREATE`：创建数据库或表
- `DROP`：删除数据库或表
- `ALTER`：修改数据库或表结构

**示例：**

```sql
-- 创建数据库
CREATE DATABASE test2 DEFAULT CHARSET utf8mb4;

-- 查看数据库
SHOW DATABASES;
SHOW CREATE DATABASE test1;

-- 修改数据库字符集
ALTER DATABASE test2 CHARACTER SET utf8;

-- 删除数据库
DROP DATABASE IF EXISTS test2;

-- 创建表
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    age TINYINT UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2. **DML（数据操作语言）**

用于对表中的数据进行增、删、改操作。

**常用动词：**

- `INSERT`：插入数据
- `UPDATE`：更新数据
- `DELETE`：删除数据

**示例：**

```sql
-- 插入数据
INSERT INTO students (name, age) VALUES ('张三', 18);

-- 更新数据
UPDATE students SET score = 90 WHERE id = 1;

-- 删除数据
DELETE FROM students WHERE id = 5;
```

### 3. **DQL（数据查询语言）**

用于从表中查询数据。

**常用关键字：**

- `SELECT`：选择数据
- `WHERE`：条件筛选
- `ORDER BY`：排序
- `GROUP BY`：分组
- `HAVING`：分组后筛选

**示例：**

```sql
-- 基础查询
SELECT * FROM students;

-- 条件查询
SELECT * FROM students WHERE age > 18;

-- 排序查询
SELECT * FROM students ORDER BY age DESC;

-- 分组查询
SELECT gender, COUNT(*) FROM students GROUP BY gender;
```

### 4. **DCL（数据控制语言）**

用于管理数据库用户权限。

**常用动词：**

- `GRANT`：授权
- `REVOKE`：撤销权限

**示例：**

```sql
-- 创建用户
CREATE USER 'test_user'@'localhost' IDENTIFIED BY 'password123';

-- 授予权限
GRANT SELECT, INSERT ON test1.* TO 'test_user'@'localhost';

-- 查看权限
SHOW GRANTS FOR 'test_user'@'localhost';

-- 撤销权限
REVOKE INSERT ON test1.* FROM 'test_user'@'localhost';
```

---

## 四、MySQL 核心概念

### 1. **表、列、行**

- **表（Table）**：数据的主要组织单元，由行和列组成
- **列（Column）**：表中的一个字段，用于存储特定类型的数据
- **行（Row）**：表中的一个记录或实例，包含一组与列对应的值

### 2. **主键与外键**

- **主键（Primary Key）**：用于唯一标识表中每一行的列（或列组合），具有唯一性、非空性和不可更改性
- **外键（Foreign Key）**：用于建立表之间的关联关系，引用另一张表的主键

### 3. **索引**

- **作用**：加快数据检索速度，提高查询性能
- **优点**：快速定位数据、提高查询效率、支持排序和连接操作
- **缺点**：占用额外存储空间，可能降低数据更新性能

---

## 五、字符集与编码

### 1. **常用字符集**

- `utf8`：支持3字节字符（包含中文）
- `utf8mb4`：支持4字节字符（包含emoji等特殊符号，MySQL 5.7+推荐使用）

### 2. **解决乱码问题**

```sql
-- 查看当前字符集设置
SHOW VARIABLES LIKE '%char%';

-- 修改配置文件（/etc/my.cnf）
[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

[mysql]
default-character-set = utf8mb4

[client]
default-character-set = utf8mb4
```

---

## 六、学习建议

1. **逐步学习**：按照 DDL → DML → DQL → DCL 的顺序学习
2. **多实践**：每个命令至少手动执行3遍
3. **做笔记**：记录常见错误和解决方案
4. **理解原理**：不仅要会写SQL，还要理解执行计划
5. **安全第一**：生产环境操作前一定要备份

---

## 七、MySQL 数据类型概览

### 1. **数值类型**

- `INT`：整数类型
- `FLOAT`：浮点数
- `DECIMAL`：精确小数

### 2. **字符串类型**

- `CHAR`：定长字符串
- `VARCHAR`：变长字符串
- `TEXT`：长文本

### 3. **日期时间类型**

- `DATE`：日期
- `DATETIME`：日期时间
- `TIMESTAMP`：时间戳

---

## 八、数据表约束

### 1. **主键约束**

```sql
PRIMARY KEY (column)
```

特点：唯一性、非空性，一张表只能有一个主键

### 2. **非空约束**

```sql
NOT NULL
```

特点：该字段必须写入数据

### 3. **唯一约束**

```sql
UNIQUE KEY
```

特点：该字段的值不得重复

### 4. **默认值**

```sql
DEFAULT 'value'
```

特点：插入数据时如未指定，使用默认值

### 5. **自增属性**

```sql
AUTO_INCREMENT
```

特点：数字字段自动增长，通常与主键配合使用
