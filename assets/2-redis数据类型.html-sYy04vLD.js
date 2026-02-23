import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const t={};function i(p,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="一、redis-数据存储格式" tabindex="-1"><a class="header-anchor" href="#一、redis-数据存储格式"><span>一、Redis 数据存储格式</span></a></h2><p>Redis 采用键值对（key-value）形式存储数据：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">key : value</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>key 始终是字符串类型，而 value 支持多种数据类型。</p><hr><h2 id="二、redis-全局命令" tabindex="-1"><a class="header-anchor" href="#二、redis-全局命令"><span>二、Redis 全局命令</span></a></h2><h3 id="_1-数据写入与读取" tabindex="-1"><a class="header-anchor" href="#_1-数据写入与读取"><span>1. 数据写入与读取</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 设置字符串类型的键值对</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> keyname value</span>
<span class="line">OK</span>
<span class="line"></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> get key</span>
<span class="line"><span class="token string">&quot;value&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-数据库管理" tabindex="-1"><a class="header-anchor" href="#_2-数据库管理"><span>2. 数据库管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看当前数据库 key 数量</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> dbsize</span>
<span class="line"><span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">3</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看所有 key（生产环境慎用！）</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> keys *</span>
<span class="line"><span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;k1&quot;</span></span>
<span class="line"><span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;k2&quot;</span></span>
<span class="line"><span class="token number">3</span><span class="token punctuation">)</span> <span class="token string">&quot;k3&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安全搜索建议使用 SCAN 命令替代 keys *</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> scan <span class="token number">0</span> match user* count <span class="token number">10</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看数据库信息</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> info keyspace</span>
<span class="line"><span class="token comment"># Keyspace</span></span>
<span class="line">db0:keys<span class="token operator">=</span><span class="token number">6</span>,expires<span class="token operator">=</span><span class="token number">0</span>,avg_ttl<span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">db1:keys<span class="token operator">=</span><span class="token number">1</span>,expires<span class="token operator">=</span><span class="token number">0</span>,avg_ttl<span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 Redis 所有信息区段</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> info</span>
<span class="line"><span class="token comment"># 或查看指定区段，如主从、内存、CPU等</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> info replication</span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> info memory</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-数据库切换与清空" tabindex="-1"><a class="header-anchor" href="#_3-数据库切换与清空"><span>3. 数据库切换与清空</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 切换数据库（Redis 默认 16 个库：0-15）</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token keyword">select</span> <span class="token number">15</span></span>
<span class="line">OK</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清空当前数据库（危险命令）</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> flushdb</span>
<span class="line">OK</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清空所有数据库（极度危险命令）</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> flushall</span>
<span class="line">OK</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-key-操作命令" tabindex="-1"><a class="header-anchor" href="#_4-key-操作命令"><span>4. Key 操作命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查 key 是否存在</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> exists key1 key2</span>
<span class="line"><span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">2</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除 key</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> del key1 key2</span>
<span class="line"><span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">2</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置 key 过期时间（秒）</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> expire session_key <span class="token number">180</span></span>
<span class="line"><span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看剩余过期时间</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> ttl session_key</span>
<span class="line"><span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">154</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 value 类型</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">type</span> mykey</span>
<span class="line">string</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、redis-五大核心数据类型" tabindex="-1"><a class="header-anchor" href="#三、redis-五大核心数据类型"><span>三、Redis 五大核心数据类型</span></a></h2><h3 id="_1-string-字符串" tabindex="-1"><a class="header-anchor" href="#_1-string-字符串"><span>1. String（字符串）</span></a></h3><p>最基本的 Redis 数据类型，一个 key 对应一个字符串值。</p><p><strong>常用命令：</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 设置单个值</span></span>
<span class="line"><span class="token builtin class-name">set</span> name <span class="token string">&quot;linux0224&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置多个值</span></span>
<span class="line">mset name2 <span class="token string">&quot;linux0224&quot;</span> address2 <span class="token string">&quot;北京&quot;</span> hobby2 <span class="token string">&quot;学习&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 读取单个值</span></span>
<span class="line">get name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 读取多个值</span></span>
<span class="line">mget name2 address2 hobby2</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 数值操作</span></span>
<span class="line"><span class="token builtin class-name">set</span> counter <span class="token number">0</span></span>
<span class="line">incr counter          <span class="token comment"># 加1</span></span>
<span class="line">decr counter          <span class="token comment"># 减1</span></span>
<span class="line">incrby counter <span class="token number">100</span>    <span class="token comment"># 加100</span></span>
<span class="line">decrby counter <span class="token number">50</span>     <span class="token comment"># 减50</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="中文显示支持" tabindex="-1"><a class="header-anchor" href="#中文显示支持"><span>中文显示支持</span></a></h4><p>使用 <code>redis-cli --raw</code> 参数可直接显示中文，避免转义。</p><h4 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景"><span>应用场景</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">1. 数据缓存</span>
<span class="line">经典用法，把经常要读取的如mysql里的url、字符串、音视频等字符串信息，存储到redis里。</span>
<span class="line">redis作为缓存层，加速数据读取，mysql作为数据持久化层，降低mysql的访问压力。</span>
<span class="line"></span>
<span class="line">提示：音视频等信息存储在mysql里，一般存储的是如url，或者路径，便于查找访问。</span>
<span class="line">而非直接存储二进制数据，并不合适。</span>
<span class="line"></span>
<span class="line">2.计数器</span>
<span class="line">redis是单线程模式，一个命令结束才会执行下一个命令，因此可以实现计数器的作用，确保多进程访问redis的数据，也能确保数据源正确性。</span>
<span class="line">（使用场景，如微博的博文阅读量，你可以理解为你可以直接修改key的值，修改阅读量为99999）</span>
<span class="line"></span>
<span class="line">3.用作网站用户的登录会话存储</span>
<span class="line">存储session，或者token等信息</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-list-列表" tabindex="-1"><a class="header-anchor" href="#_2-list-列表"><span>2. List（列表）</span></a></h3><p>基于双向链表实现的有序元素集合，支持重复元素。</p><p><strong>常用命令：</strong></p><table><thead><tr><th style="text-align:left;">命令</th><th style="text-align:left;">简述</th><th style="text-align:left;">使用</th></tr></thead><tbody><tr><td style="text-align:left;">lpush</td><td style="text-align:left;">将给定值推入到列表右端</td><td style="text-align:left;">RPUSH key value</td></tr><tr><td style="text-align:left;">lpush</td><td style="text-align:left;">将给定值推入到列表左端</td><td style="text-align:left;">LPUSH key value</td></tr><tr><td style="text-align:left;">lpop</td><td style="text-align:left;">从列表的右端弹出一个值，并返回被弹出的值</td><td style="text-align:left;">RPOP key</td></tr><tr><td style="text-align:left;">lpop</td><td style="text-align:left;">从列表的左端弹出一个值，并返回被弹出的值</td><td style="text-align:left;">LPOP key</td></tr><tr><td style="text-align:left;">lrange</td><td style="text-align:left;">获取列表在给定范围上的所有值</td><td style="text-align:left;">LRANGE key 0 -1</td></tr><tr><td style="text-align:left;">lindex</td><td style="text-align:left;">通过索引获取列表中的元素。你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。</td><td style="text-align:left;">LINDEX key index</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 从左侧添加元素</span></span>
<span class="line">lpush mylist <span class="token string">&quot;a&quot;</span> <span class="token string">&quot;b&quot;</span> <span class="token string">&quot;c&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从右侧添加元素</span></span>
<span class="line">rpush mylist <span class="token string">&quot;x&quot;</span> <span class="token string">&quot;y&quot;</span> <span class="token string">&quot;z&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取列表范围0第一个   -1是最后一个  2是第3个</span></span>
<span class="line">lrange mylist <span class="token number">0</span> <span class="token parameter variable">-1</span></span>
<span class="line">lrange mylist <span class="token number">0</span> <span class="token number">2</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 左侧弹出元素</span></span>
<span class="line">lpop mylist</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 右侧弹出元素</span></span>
<span class="line">rpop mylist</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取指定索引元素</span></span>
<span class="line">lindex mylist <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取列表长度</span></span>
<span class="line">llen mylist</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>应用场景：</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">微博，知乎等博文的timeline</span>
<span class="line">  用户发表的文章，用lpush加入时间轴，微博最新的文章列表。</span>
<span class="line">订单系统、物流系统的消息队列</span>
<span class="line">  生产消费者，订单生成，订单处理</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-set-集合" tabindex="-1"><a class="header-anchor" href="#_3-set-集合"><span>3. Set（集合）</span></a></h3><p>Set 是 String 类型的无序集合。无序且<strong>不重复</strong>的字符串集合，基于哈希表实现。</p><p><strong>常用命令：</strong></p><table><thead><tr><th style="text-align:left;">命令</th><th style="text-align:left;">作用</th></tr></thead><tbody><tr><td style="text-align:left;">sadd myset &quot;user1&quot; &quot;user3&quot; &quot;user2&quot;</td><td style="text-align:left;"><strong>添加元素</strong></td></tr><tr><td style="text-align:left;">smembers myset</td><td style="text-align:left;"><strong>查看所有元素</strong></td></tr><tr><td style="text-align:left;">sismember myset &quot;user3&quot;</td><td style="text-align:left;"><strong>判断单元素是否存在</strong></td></tr><tr><td style="text-align:left;">scard myset</td><td style="text-align:left;"><strong>获取集合大小</strong></td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 添加元素</span></span>
<span class="line">sadd myset <span class="token string">&quot;user1&quot;</span> <span class="token string">&quot;user3&quot;</span> <span class="token string">&quot;user2&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看所有元素</span></span>
<span class="line">smembers myset</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 判断单元素是否存在</span></span>
<span class="line">sismember myset <span class="token string">&quot;user1&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取集合大小</span></span>
<span class="line">scard myset</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 集合运算</span></span>
<span class="line">sinter set1 set2      <span class="token comment"># 交集</span></span>
<span class="line">sunion set1 set2      <span class="token comment"># 并集</span></span>
<span class="line"><span class="token function">sdiff</span> set1 set2       <span class="token comment"># 差集</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>应用场景：</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">微信，微博，等社交APP的标签功能</span>
<span class="line">  你，我，他都关注了美女板块的视频动态</span>
<span class="line">  系统根据标签选择给这一类的用户，较高比重的推送美女视频。</span>
<span class="line"></span>
<span class="line">用户收藏夹</span>
<span class="line">  利用set去重功能，实现不会重复收藏，重复性点赞，踩，一类的功能</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-hash-哈希表" tabindex="-1"><a class="header-anchor" href="#_4-hash-哈希表"><span>4. Hash（哈希表）</span></a></h3><p>键值对的集合，适合存储对象。</p><p><strong>常用命令：</strong></p><table><thead><tr><th style="text-align:left;">命令</th><th style="text-align:left;">作用</th></tr></thead><tbody><tr><td style="text-align:left;">hset name1 key1 value1 key2 value2 key3 value3</td><td style="text-align:left;"><strong>添加哈希表name1</strong></td></tr><tr><td style="text-align:left;">hget name1 key1 hmget name1 key1 key2 hgetall name1</td><td style="text-align:left;"><strong>查看元素</strong></td></tr><tr><td style="text-align:left;">hdel name1 key1 del name1</td><td style="text-align:left;"><strong>删除字段或表</strong></td></tr><tr><td style="text-align:left;">hlen name1</td><td style="text-align:left;">获取字段数量</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 设置单个字段</span></span>
<span class="line">hset user:1001 name <span class="token string">&quot;张三&quot;</span> age <span class="token number">25</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置多个字段</span></span>
<span class="line">hmset user:1002 name <span class="token string">&quot;李四&quot;</span> age <span class="token number">30</span> city <span class="token string">&quot;北京&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取单个字段</span></span>
<span class="line">hget user:1001 name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取多个字段</span></span>
<span class="line">hmget user:1001 name age</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取所有字段</span></span>
<span class="line">hgetall user:1001</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除字段</span></span>
<span class="line">hdel user:1001 age</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除哈希表</span></span>
<span class="line">del user:1001</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 字段数量</span></span>
<span class="line">hlen user:1001</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>应用场景：</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">比起string类型存储数据，更直观，更高效，更省空间。</span>
<span class="line">如存储用户信息</span>
<span class="line">存储一篇帖子的阅读数、评论数各类信息。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-zset-有序集合" tabindex="-1"><a class="header-anchor" href="#_5-zset-有序集合"><span>5. Zset（有序集合）</span></a></h3><p>不重复的string 类型元素的集合。每个元素关联一个分数（score），按分数排序。</p><p><strong>常用命令：</strong></p><table><thead><tr><th style="text-align:left;">命令</th><th style="text-align:left;">简述</th><th style="text-align:left;">使用</th></tr></thead><tbody><tr><td style="text-align:left;">ZADD</td><td style="text-align:left;">将一个带有给定分值的成员添加到有序集合里面</td><td style="text-align:left;">ZADD zset-key 178 member1</td></tr><tr><td style="text-align:left;">ZRANGE</td><td style="text-align:left;">根据元素在有序集合中所处的位置，从有序集合中获取多个元素</td><td style="text-align:left;">ZRANGE zset-key 0-1 withscores</td></tr><tr><td style="text-align:left;">ZREM</td><td style="text-align:left;">如果给定元素成员存在于有序集合中，那么就移除这个元素</td><td style="text-align:left;">ZREM zset-key member1</td></tr><tr><td style="text-align:left;">ZINCRBY</td><td style="text-align:left;">增加指定成员的分数</td><td style="text-align:left;">ZINCRBY zset-key 10 member1</td></tr><tr><td style="text-align:left;">ZSCORE</td><td style="text-align:left;">查看成员分数</td><td style="text-align:left;">ZSCORE zset-key member1</td></tr><tr><td style="text-align:left;">ZRANK</td><td style="text-align:left;">查看成员排名（升序）</td><td style="text-align:left;">ZRANK zset-key member1</td></tr><tr><td style="text-align:left;">ZREVRANK</td><td style="text-align:left;">查看成员排名（降序）</td><td style="text-align:left;">ZREVRANK zset-key member1</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 添加元素（分数在前）</span></span>
<span class="line">zadd name1 <span class="token number">2440</span> <span class="token string">&quot;player1&quot;</span> <span class="token number">2100</span> <span class="token string">&quot;player2&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 按分数升序查看</span></span>
<span class="line">zrange name1 <span class="token number">0</span> <span class="token parameter variable">-1</span> withscores</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 按分数降序查看</span></span>
<span class="line">zrevrange name1 <span class="token number">0</span> <span class="token parameter variable">-1</span> withscores</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取元素分数</span></span>
<span class="line">zscore name1 <span class="token string">&quot;player1&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 增加分数</span></span>
<span class="line">zincrby name1 <span class="token number">100</span> <span class="token string">&quot;player1&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取排名</span></span>
<span class="line">zrank name1 <span class="token string">&quot;player1&quot;</span>    <span class="token comment"># 升序排名</span></span>
<span class="line">zrevrank name1 <span class="token string">&quot;player1&quot;</span> <span class="token comment"># 降序排名</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 移除元素</span></span>
<span class="line">zrem name1 <span class="token string">&quot;player1&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>应用场景：</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">排行榜：有序集合经典使用场景。 </span>
<span class="line"></span>
<span class="line">例如小说视频等网站需要对用户上传的小说视频做排行榜，榜单可以按照用户关注数，更新时间，字数等打分，做排行。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,52)])])}const d=n(t,[["render",i]]),r=JSON.parse('{"path":"/09-%E4%B8%AD%E9%97%B4%E4%BB%B6/03-redis/2-redis%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"09-中间件/03-redis/2-redis数据类型.md"}');export{d as comp,r as data};
