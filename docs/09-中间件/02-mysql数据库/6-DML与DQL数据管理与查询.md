# DML 数据操作语言

## 概述

开发需要重点掌握的 SQL 语言，运维人员熟悉即可。因为网站有各式各样的数据写入和读取操作，这属于开发对于表的设计，是开发必须重点掌握的技能。

运维人员无须像开发一样了解各种业务表的结构和设计，只需要熟悉查询数据操作。

DML（Data Manipulation Language）包括：

- **SELECT**：查询数据
- **INSERT**：插入数据
- **DELETE**：删除数据
- **UPDATE**：更新数据

---

## 一、INSERT 插入数据

### 1.1 查看表结构

```sql
DESC students;
```

### 1.2 插入方式

#### (1) 部分字段插入

```sql
-- 插入学生数据（只指定部分字段）
INSERT INTO students (name, age, gender, address)
VALUES ('马十五', 19, '男', '南京市鼓楼区');
```

#### (2) 完整字段插入

```sql
-- 插入单个完整学生数据（必须按顺序写全所有值）
INSERT INTO students
VALUES (7, '周九', 20, '女', '武汉市武昌区', '2023-09-02 08:00:00', '13400134000', 1.62, 88.50);
```

#### (3) 多条数据插入

```sql
INSERT INTO students (name, age, gender, address)
VALUES
('郑十一', 21, '男', '西安市雁塔区'),
('王十二', 19, '女', '重庆市渝中区'),
('冯十三', 20, '男', '苏州市姑苏区');
```

### 1.3 注意事项

- 字段与值必须一一对应
- 未指定的字段会使用默认值
- 主键字段（如 `id`）通常可以自动递增，无需手动指定
- 字符字段长度不能超出定义，否则报错

### 1.4 批量插入（Shell 脚本）

```bash
# 方式一：构造连续数据
for i in {1..1000}
do
    mysql -uroot -p密码 -e "INSERT INTO stu4(name, address) VALUES ('学生$i', '地球人');"
done

# 方式二：从文件读取数据
for name in `cat stu_name.txt`
do
    mysql -uroot -p密码 -e "INSERT INTO stu4(name, address) VALUES ('$name', '地球人');"
done
```

---

## 二、UPDATE 更新数据

### 2.1 语法

```sql
UPDATE 表名 SET 字段 = 新值 WHERE 更新范围;
```

### 2.2 示例

```sql
-- 更新单个字段
UPDATE students SET age = 19 WHERE name = '张三';

-- 更新多个字段
UPDATE students
SET address = '上海市黄浦区', phone = '13912345678'
WHERE name = '李四';
```

### 2.3 ⚠️ 危险操作

```sql
-- 错误：没有 WHERE 条件的 UPDATE（会更新所有行）
-- UPDATE students SET score = 0;  -- 危险！

-- 正确：始终添加 WHERE 条件
UPDATE students SET score = score + 5 WHERE age > 18;
```

---

## 三、DELETE 删除数据

### 3.1 删除指定记录

```sql
-- 删除指定学生
DELETE FROM students WHERE name = '冯十三';

-- 删除有外键关联的记录（需先删除依赖表）
DELETE FROM student_courses WHERE course_id = 4;
DELETE FROM courses WHERE course_id = 4;
```

### 3.2 清空表数据

```sql
-- DELETE 清空（保留自增序列）
DELETE FROM students_backup;

-- TRUNCATE 清空（重置自增序列，更快）
TRUNCATE TABLE students_backup;
```

### 3.3 DELETE 与 TRUNCATE 对比

| 操作     | 是否记录日志 | 是否重置自增ID | 速度 | 可回滚 |
| :------- | :----------- | :------------- | :--- | :----- |
| DELETE   | 是           | 否             | 慢   | 是     |
| TRUNCATE | 否           | 是             | 快   | 否     |

### 3.4 伪删除（逻辑删除）

通过添加状态字段实现逻辑删除，避免物理删除风险：

```sql
-- 添加状态字段
ALTER TABLE stu4 ADD COLUMN is_deleted TINYINT DEFAULT 0 COMMENT '0:正常 1:已删除';

-- 逻辑删除
UPDATE stu4 SET is_deleted = 1 WHERE name = '亮亮';

-- 查询时过滤已删除数据
SELECT * FROM stu4 WHERE is_deleted = 0;
```

---

## 四、DQL 数据查询语言

### 4.1 条件查询

#### 基础查询

```sql
-- 查询所有数据
SELECT * FROM students;

-- 查询指定字段
SELECT name, age FROM students;
```

#### WHERE 条件查询

```sql
-- 简单条件
SELECT * FROM students WHERE age > 18;

-- 多条件组合
SELECT * FROM students WHERE age > 18 AND gender = '男';

-- 范围查询
SELECT * FROM students WHERE age BETWEEN 18 AND 20;

-- IN 查询
SELECT * FROM students WHERE address IN ('北京市海淀区', '上海市浦东新区');

-- 模糊查询
SELECT * FROM students WHERE name LIKE '张%';    -- 张开头
SELECT * FROM students WHERE name LIKE '%三';    -- 三结尾
```

### 4.2 GROUP BY 分组聚合

```sql
-- 统计学生总数
SELECT COUNT(*) AS 学生总数 FROM students;

-- 按性别统计
SELECT gender, COUNT(*) AS 人数 FROM students GROUP BY gender;

-- 按地址分组统计
SELECT address, COUNT(*) AS 人数 FROM students GROUP BY address;
```

### 4.3 HAVING 分组后筛选

```sql
-- 只显示人数大于4的性别组
SELECT gender, COUNT(*) AS 人数
FROM students
GROUP BY gender
HAVING COUNT(*) > 4;
```

### 4.4 ORDER BY 排序

```sql
-- 升序
SELECT * FROM students ORDER BY age ASC;

-- 降序
SELECT * FROM students ORDER BY score DESC;

-- 多字段排序
SELECT * FROM students ORDER BY gender ASC, age DESC;
```

### 4.5 LIMIT 分页

```sql
-- 查询前3条
SELECT * FROM students LIMIT 3;

-- 分页查询（每页2条，第2页）
SELECT * FROM students LIMIT 2, 2;
```

### 4.6 多表关联查询

```sql
-- INNER JOIN（内连接）
SELECT s.name, c.course_name, sc.score
FROM students s
INNER JOIN student_courses sc ON s.id = sc.student_id
INNER JOIN courses c ON sc.course_id = c.course_id;

-- LEFT JOIN（左连接）
SELECT s.name, c.course_name, sc.score
FROM students s
LEFT JOIN student_courses sc ON s.id = sc.student_id
LEFT JOIN courses c ON sc.course_id = c.course_id;
```

### 4.7 子查询

```sql
-- 查询成绩高于平均分的学生
SELECT * FROM students
WHERE score > (SELECT AVG(score) FROM students);
```

---

## 五、MySQL 元数据查询

### 5.1 SHOW 语句

```sql
-- 显示所有数据库
SHOW DATABASES;

-- 显示当前数据库的所有表
SHOW TABLES;

-- 显示表结构
SHOW COLUMNS FROM students;

-- 显示表创建语句
SHOW CREATE TABLE students;

-- 显示系统变量
SHOW VARIABLES LIKE '%port%';
```

### 5.2 SELECT 查询系统信息

```sql
-- 查询当前数据库
SELECT DATABASE();

-- 查询当前用户
SELECT USER();

-- 查询当前时间
SELECT NOW();

-- 查询系统变量
SELECT @@version;
SELECT @@port;
SELECT @@datadir;
```

---

## 六、综合练习

### 6.1 练习1：学生信息统计

```sql
SELECT
    s.name,
    COUNT(sc.course_id) AS 选课数量,
    AVG(sc.score) AS 平均分
FROM students s
LEFT JOIN student_courses sc ON s.id = sc.student_id
GROUP BY s.id
ORDER BY 平均分 DESC;
```

### 6.2 练习2：课程统计分析

```sql
SELECT
    c.course_name,
    COUNT(sc.student_id) AS 选课人数,
    AVG(sc.score) AS 平均分
FROM courses c
LEFT JOIN student_courses sc ON c.course_id = sc.course_id
GROUP BY c.course_id
HAVING 选课人数 > 0
ORDER BY 平均分 DESC;
```

---

## 总结要点

1. **INSERT**：注意字段与值的对应关系，支持批量插入
2. **UPDATE**：务必添加 WHERE 条件，避免全表更新
3. **DELETE**：区分物理删除与逻辑删除，TRUNCATE 比 DELETE 更快
4. **SELECT**：掌握条件查询、分组、排序、分页和多表关联
5. **安全原则**：重要操作前先备份，UPDATE/DELETE 必须带 WHERE
6. **运维重点**：熟悉查询操作，了解系统变量和元数据查询
