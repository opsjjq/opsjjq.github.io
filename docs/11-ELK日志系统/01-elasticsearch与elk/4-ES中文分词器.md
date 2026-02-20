# ES 中文分词器（IK Analyzer）配置指南

> **问题背景**：默认 ES 对中文处理为单个字符分词，需要安装第三方中文分词插件才能实现中文词语匹配。

**期望效果**：`content: "方向"` → 匹配"方向"整体，而非单个字符"方"和"向"

---

## 一、安装 IK 分词器

### 1. 版本要求

IK 分词器版本必须与 ES 版本对应。

**下载地址**：https://release.infinilabs.com/analysis-ik/stable

## 安装

（三个节点都需要）

**在线安装**:

```
/usr/share/elasticsearch/bin/elasticsearch-plugin install https://release.infinilabs.com/analysis-ik/stable/elasticsearch-analysis-ik-7.9.1.zip
```

**离线安装**:

```
/usr/share/elasticsearch/bin/elasticsearch-plugin install file:///root/elasticsearch-analysis-ik-7.9.1.zip
```

安装后需要**重启所有节点**的ES服务：

```
systemctl restart elasticsearch.service
```

---

## 二、IK 分词器使用

### 1. 创建支持中文分词的索引

```yaml
PUT /colors_directions_cn
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_smart"
      },
      "color": {
        "type": "keyword"
      },
      "direction": {
        "type": "keyword"
      }
    }
  }
}
```

| 字段类型 | 说明 |
| :--- | :--- |
| content | 使用 `ik_max_word` 分词器，进行中文分词 |
| color, direction | keyword 类型，不进行分词 |

### 2. 分词模式对比

| 模式 | 说明 | 适用场景 |
| :--- | :--- | :--- |
| **ik_max_word** | 最细粒度拆分，穷尽所有组合 | Term Query |
| **ik_smart** | 最粗粒度拆分 | Phrase 查询 |

### 3. 分词效果测试

```bash
POST /colors_directions_cn/_analyze
{
  "analyzer": "ik_max_word",
  "text": "中华人民共和国国歌"
}

POST /colors_directions_cn/_analyze
{
  "analyzer": "ik_smart",
  "text": "中华人民共和国国歌"
}

"中华人民共和国国歌"
ik_max_word
中华人民共和国,中华人民,中华,华人,人民共和国,人民,共和国,共和,国,国歌
ik_smart
中华人民共和国,国歌
```

## 三、测试数据插入

```json
PUT /colors_directions_cn/_doc/1
{
  "content": "黑色的汽车在夏天比较吸热，无论停放在哪个方向",
  "color": "黑色",
  "direction": null
}

PUT /colors_directions_cn/_doc/2
{
  "content": "白色的建筑物在北方地区能更好地反射阳光",
  "color": "白色",
  "direction": "北"
}

PUT /colors_directions_cn/_doc/3
{
  "content": "中国的五星红旗是红色和黄色的组合",
  "color": "红色",
  "direction": null
}
```

## 4.搜索示例

```json
POST /colors_directions_cn/_search
{
  "query": {
    "match": {
      "content": "红色"
    }
  },
  "highlight": {
    "pre_tags": ["<begin>"],
    "post_tags": ["<end>"],
    "fields": {
      "content": {}
    }
  }
}

// 同时搜索颜色 or 方向
POST /colors_directions_cn/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "content": "红色"
          }
        },
        {
          "match": {
            "content": "北方"
          }
        }
      ]
    }
  }
}
```



------

## 5.自定义中文词库

### 5.1 配置热更新词库

#### 5.11 安装Nginx（用于提供词库文件）

```
yum install nginx -y
```

#### 5.1.2 创建自定义词典文件

```
cat > /usr/share/nginx/html/my_word.txt << 'EOF'
北京
上海
江苏
淮安
山东
王权富贵
张老三
周杰伦
EOF
```

#### 5.1.3 启动Nginx

```
systemctl start nginx
curl 10.0.0.90/my_word.txt
```

#### 5.1.4 配置IK分词器

```
vim /etc/elasticsearch/analysis-ik/IKAnalyzer.cfg.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <comment>IK Analyzer 扩展配置</comment>
  <!--用户可以在这里配置自己的扩展字典 -->
  <entry key="ext_dict"></entry>
  <!--用户可以在这里配置自己的扩展停止词字典-->
  <entry key="ext_stopwords"></entry>
  <!--用户可以在这里配置远程扩展字典 -->
  <entry key="remote_ext_dict">http://10.0.0.90/my_word.txt</entry> 
  <!--用户可以在这里配置远程扩展停止词字典-->
  <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

#### 5.1.5 同步到所有节点并重启

```sh
# 同步配置文件
cd /etc/elasticsearch/analysis-ik/
scp IKAnalyzer.cfg.xml root@10.0.0.91:/etc/elasticsearch/analysis-ik/
scp IKAnalyzer.cfg.xml root@10.0.0.92:/etc/elasticsearch/analysis-ik/

# 重启所有节点
systemctl restart elasticsearch.service
```

### 5.2测试分词

```bash
POST /colors_directions_cn/_analyze
{
  "analyzer": "ik_max_word",
  "text": "王权富贵"
}
在未添加词库前无法得到王权富贵  四字分词
IK分词器每60秒从远程URL检查更新
稍等后  再次测试分词可得到王权富贵  四字
```

![image-20260203213130479](./assets/image-20260203213130479.png)

### 5.3创建索引

```bash
PUT /colors_directions_cn
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_smart"
      }
    }
  }
}

PUT /names/_doc/1
{"content":"张三李四王二麻"}
PUT /names/_doc/2
{"content":"张三王老五"}
PUT /names/_doc/3
{"content":"马斯克和王老五"}
PUT /names/_doc/4
{"content":"王权富贵"}
```

### 5.3测试查询

```bash
POST /names/_search
{
  "query": {
    "match": {
      "content": "王老五"
    }
  },
  "highlight": {
    "pre_tags": ["<begin>"],
    "post_tags": ["<end>"],
    "fields": {
      "content": {}
    }
  }
}

POST /names/_search
{
  "query": {
    "match": {
      "content": "王权富贵"
    }
  },
  "highlight": {
    "pre_tags": ["<begin>"],
    "post_tags": ["<end>"],
    "fields": {
      "content": {}
    }
  }
}
```

------

## 四、热更新说明

### 4.1 特性

- **60秒更新间隔**: IK分词器每60秒从远程URL检查更新
- **无需重启**: 修改词库后自动生效
- **注意事项**:
  1. 后端开发需在更新词典后，再录入相关数据
  2. 新产品的关键词需要先更新词典

### 4.2 验证步骤

1. 修改Nginx上的`my_word.txt`文件
2. 等待60秒自动更新
3. 测试分词效果

### 4.3 删除词语

从`my_word.txt`中删除词语后，同样在60秒后生效，ES将不再识别该词语。

------

## 五、注意事项

1. **版本匹配**: IK分词器版本必须与ES版本严格对应
2. **所有节点**: 插件需要在所有ES节点上安装
3. **重启服务**: 安装插件后必须重启ES服务
4. **索引重建**: 已存在的索引需要重建或重新设置mapping才能使用新分词器
5. **热更新延迟**: 远程词库更新有60秒延迟