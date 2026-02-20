# Nginx 高级 Rewrite 技术

## 概述

URL 重写是在服务器端修改请求的 URL 或返回重定向（如整站更换域名 `360buy.com` → `jd.com`、HTTP 跳转 HTTPS）。这一功能由 **ngx_http_rewrite_module** 模块实现。

| 指令 | 说明 |
| :--- | :--- |
| `if` | 条件判断 |
| `return` | 返回状态码或重定向 |
| `set` | 设置变量 |
| `break` | 终止当前 rewrite 后续指令 |
| `rewrite` | 对请求 URI 进行重写 |

---

## if 指令

写在 `server{}` 或 `location{}` 块中，语法为：`if (条件) { 动作 }`。

**条件符号**：

- `=` 完全匹配（区分大小写）
- `!=` 不等于
- `~` 正则匹配（区分大小写）
- `~*` 正则匹配（不区分大小写）

常用变量：`$http_user_agent`（用户代理）、`$request_method`（请求方法）。

```nginx
location /test-if {
    if ($http_user_agent = huawei) {
        echo "agent is huawei";
    }
    if ($http_user_agent ~ Iphone) {
        echo "agent is Iphone";   # 区分大小写
    }
    if ($http_user_agent ~* Chrome) {
        echo "agent is Chrome";   # 不区分大小写
    }
    if ($request_method != GET) {
        echo "必须是GET方法";
    }
    if ($http_user_agent ~* IE) {
        echo "不支持IE，请用Chrome";
    }
    echo "未匹配 >>> $http_user_agent";
}
```

**测试命令**：

- `curl 10.0.0.8:22555/test-if`
- `curl -A 'huawei' ...` 完全匹配
- `curl -A 'Iphone' ...` 匹配 Iphone
- `curl -X POST ...` 触发"必须是GET方法"

---

## return 指令

可返回自定义状态码和文本，或进行 301/302 重定向到指定 URL。

```nginx
location = / {
    echo "welcome";
}
location /test-return {
    if ($http_user_agent = huawei) {
        return 200 "agent is $http_user_agent\n";
    }
    if ($request_method != GET) {
        return 405 "必须GET\n";
    }
    if ($http_user_agent ~* IE) {
        return 301 http://yuchaoit.cn/cai.jpg;
    }
    return 404 "sorry\n";
}
location / {
    return 301 http://yuchaoit.cn/cai.jpg;
}
location /ji {
    return 500 "500了\n";
}
```

**测试结果**：

- `curl 10.0.0.8:22666/` → welcome
- `curl -A huawei .../test-return` → 200
- `curl -X POST .../test-return` → 405
- 访问未匹配路径 → 301 到新 URL

---

## set 指令

定义变量，后续通过 `$变量名` 引用。

```nginx
set $my_url http://yuchaoit.cn/data/cai.jpg;
location /test-set {
    return 301 $my_url;
}
```

访问 `/test-set` 会 301 重定向到 `$my_url`。

---

## break 指令

终止当前 location 内后续的 rewrite 相关指令（不再执行后面的 if/return/rewrite/set）。

**与 last 的区别**：

- `break`：不重新做 location 匹配，继续执行当前 location 的其他非 rewrite 指令
- `last`：用新的 URI 重新匹配 location（内部跳转）

```nginx
location / {
    set $my_website yuchaoit.cn;
    echo "welcome:" $my_website;
    break;
    set $my_name yuchao;
    echo "my name is" $my_name;   # 不会执行
}
```

---

## rewrite 指令

语法：`rewrite regex replacement [flag];`

**用途**：域名更换、活动页跳转等。跳转时一般会保留 URI 和查询参数。

| flag | 说明 |
| :--- | :--- |
| `permanent` | 301 永久重定向（浏览器会缓存） |
| `redirect` | 302 临时重定向 |
| `last` | 用新 URI 重新匹配 location（内部跳转） |
| `break` | 本 location 内不再 rewrite，不重新匹配 |

---

### 1. 301 永久重定向（换域名）

旧域名 `laoliulinux.cc` 全站跳转到新域名 `linux0224.com`。

```nginx
# 旧域名服务器配置
server {
    listen 80;
    server_name laoliulinux.cc;
    location / {
        root /laoliu/;
        index index.html;
        rewrite / http://linux0224.com permanent;
    }
}
```

新域名需单独配置 `server_name linux0224.com` 并指定 root。在客户端 hosts 文件中添加：`10.0.0.8 laoliulinux.cc linux0224.com`。

---

### 2. 302 临时重定向（活动页）

`www.laoliulinux.cc/phone` → `phone.laoliulinux.cc`

```nginx
# 主站配置
server {
    listen 80;
    server_name www.laoliulinux.cc;
    location /phone {
        rewrite / http://phone.laoliulinux.cc redirect;
    }
}

# 活动页专用配置
server {
    listen 80;
    server_name phone.laoliulinux.cc;
    location / {
        root /phone.laoliulinux.cc/;
        index index.html;
    }
}
```

在 hosts 文件中增加 `phone.laoliulinux.cc`，访问 `www.laoliulinux.cc/phone` 验证 302 重定向。

---

### 3. last：多次内部跳转（URI 不变）

访问 `/AAA/xxx` → 内部重写为 `/BBB/xxx` → 再重写为 `/CCC/xxx`，浏览器地址栏仍显示为 `/AAA/xxx`。

使用 `$1` 等引用正则捕获组。

```nginx
# 准备工作：mkdir -p /linux0224/ && echo 'i am ccc' > /linux0224/hello.html

server {
    listen 30000;
    server_name _;

    location /CCC {
        alias /linux0224/;
    }

    location /BBB {
        rewrite ^/BBB/(.*)$ /CCC/$1 last;
    }

    location /AAA {
        rewrite ^/AAA/(.*)$ /BBB/$1 last;
    }
}
```

请求 `/AAA/file.txt` 会内部经过 `/BBB/file.txt` 最终由 `/CCC` 对应的目录响应。

---

### 4. break：只重写一次

本条 rewrite 执行后不再继续匹配其他 location，需有对应的物理目录和文件。

```nginx
# 准备工作：mkdir -p /www/{AAA,BBB,CCC} 并在各目录创建 index.html

server {
    listen 31000;
    server_name _;

    location /CCC {
        root /www/;
        index index.html;
    }

    location /BBB {
        root /www/;
        index index.html;
        rewrite ^/BBB/(.*)$ /CCC/$1 break;
    }

    location /AAA {
        root /www/;
        index index.html;
        rewrite ^/AAA/(.*)$ /BBB/$1 break;
    }
}
```

**注意事项**：访问 `/AAA/` 或 `/AAA` 时，Nginx 可能先对目录做内部重定向再匹配，表现会与访问 `/AAA/文件` 不同，建议使用具体文件路径进行测试。

---

## 最佳实践建议

1. **避免过度使用 if**：if 指令在 Nginx 中效率较低，尽量用 location 匹配替代
2. **rewrite 优先级**：在同一个 location 中，rewrite 指令按顺序执行，直到遇到合适的 flag
3. **捕获组使用**：使用 `( )` 捕获正则表达式部分，通过 `$1`、`$2` 引用
4. **参数保留**：rewrite 默认会保留原始请求的参数，无需额外处理
5. **性能考虑**：
   - 尽量使用 location 匹配而非 if 判断
   - 避免复杂的正则表达式
   - 将常用重写规则前置
6. **调试技巧**：
   - 使用 `echo` 指令输出调试信息
   - 设置 `rewrite_log on;` 在 error_log 中查看重写过程
   - 使用 `error_log logs/error.log debug;` 开启详细调试
