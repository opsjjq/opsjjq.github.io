import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const t="/assets/image-20260131181835312-DSD65O2-.png",i="/assets/image-20260131192917460-CkmGjGBZ.png",p="/assets/image-20260131193300815-BuPD3qR3.png",c="/assets/image-20260131195030481-DRUmdm68.png",o="/assets/image-20260131233135284-jQsPxo_S.png",r="/assets/image-20260131233152710-DQ00zafK.png",d="/assets/image-20260131233237908-Cf2mZmT3.png",u="/assets/image-20260131233035060-CZfZxvrH.png",v="/assets/image-20260201000403298-BtlH4Wjf.png",m={};function b(g,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="elasticsearch-基础指南" tabindex="-1"><a class="header-anchor" href="#elasticsearch-基础指南"><span>Elasticsearch 基础指南</span></a></h1><blockquote><p>Elasticsearch（ES）是一款开源的分布式搜索和分析引擎，基于 Apache Lucene 构建，提供 RESTful API。</p></blockquote><p><strong>官方资源</strong>：</p><ul><li>官网：https://www.elastic.co/cn/</li><li>产品栈：https://www.elastic.co/cn/elastic-stack/</li><li>Lucene 官网：https://lucene.apache.org/core/</li></ul><hr><h2 id="一、为什么学习-es" tabindex="-1"><a class="header-anchor" href="#一、为什么学习-es"><span>一、为什么学习 ES</span></a></h2><table><thead><tr><th style="text-align:left;">原因</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>职业需求</strong></td><td style="text-align:left;">运维、开发、大数据从业者必备技能</td></tr><tr><td style="text-align:left;"><strong>技术栈</strong></td><td style="text-align:left;">ELK 是日志分析的标准解决方案</td></tr><tr><td style="text-align:left;"><strong>性能优势</strong></td><td style="text-align:left;">天然分布式，高性能搜索</td></tr><tr><td style="text-align:left;"><strong>易用性</strong></td><td style="text-align:left;">无需深入 Java 即可维护</td></tr><tr><td style="text-align:left;"><strong>社区生态</strong></td><td style="text-align:left;">强大的社区和商业支持</td></tr></tbody></table><p><strong>应用场景</strong>：搜索、日志分析、业务智能、安全分析、指标分析、性能监控</p><hr><h2 id="二、索引原理对比" tabindex="-1"><a class="header-anchor" href="#二、索引原理对比"><span>二、索引原理对比</span></a></h2><table><thead><tr><th style="text-align:left;">索引类型</th><th style="text-align:left;">说明</th><th style="text-align:left;">示例</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>传统索引</strong></td><td style="text-align:left;">类似书籍目录，通过目录→章节→页码的映射</td><td style="text-align:left;">目录→章节→页码</td></tr><tr><td style="text-align:left;"><strong>倒排索引</strong></td><td style="text-align:left;">关键字→文档的映射</td><td style="text-align:left;">Elasticsearch → 第一章、第二章</td></tr></tbody></table><hr><h2 id="三、系统部署准备" tabindex="-1"><a class="header-anchor" href="#三、系统部署准备"><span>三、系统部署准备</span></a></h2><h3 id="_1-系统优化" tabindex="-1"><a class="header-anchor" href="#_1-系统优化"><span>1. 系统优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 清理 iptables</span></span>
<span class="line">iptables <span class="token parameter variable">-F</span></span>
<span class="line">iptables <span class="token parameter variable">-X</span></span>
<span class="line">iptables <span class="token parameter variable">-Z</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 SELinux</span></span>
<span class="line">getenforce  <span class="token comment"># 应为 Disabled</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 关闭 swap（生产环境建议）</span></span>
<span class="line">swapoff <span class="token parameter variable">-a</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/swap/s/^/#/&#39;</span> /etc/fstab</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-安装-elasticsearch-7-9-1" tabindex="-1"><a class="header-anchor" href="#_2-安装-elasticsearch-7-9-1"><span>2. 安装 Elasticsearch 7.9.1</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 下载安装包</span></span>
<span class="line"><span class="token function">wget</span> https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.9.1-x86_64.rpm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> elasticsearch-7.9.1-x86_64.rpm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动服务</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> elasticsearch</span>
<span class="line">systemctl start elasticsearch</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>参考文档</strong>：https://elasticsearch.bookhub.tech/set_up_elasticsearch/installing_elasticsearch/rpm</p><h3 id="_3-配置文件优化" tabindex="-1"><a class="header-anchor" href="#_3-配置文件优化"><span>3. 配置文件优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 备份原配置</span></span>
<span class="line"><span class="token function">cp</span> /etc/elasticsearch/elasticsearch.yml<span class="token punctuation">{</span>,.ori<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 生成新配置</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/elasticsearch/elasticsearch.yml <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">cluster.name: es1</span>
<span class="line">node.name: devops01</span>
<span class="line">network.host: 127.0.0.1,10.0.0.90</span>
<span class="line">http.port: 9200</span>
<span class="line">path.data: /var/lib/elasticsearch</span>
<span class="line">path.logs: /var/log/elasticsearch</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-内存锁配置" tabindex="-1"><a class="header-anchor" href="#_4-内存锁配置"><span>4. 内存锁配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">vim</span> /usr/lib/systemd/system/elasticsearch.service</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">LimitMEMLOCK</span><span class="token operator">=</span>infinity</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、es-核心概念总结" tabindex="-1"><a class="header-anchor" href="#四、es-核心概念总结"><span>四、ES 核心概念总结</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># ES 是一款强大的搜索引擎系统</span></span>
<span class="line"><span class="token comment"># 基于它可以为用户提供搜索功能</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># ELK Stack 被广泛应用于：</span></span>
<span class="line"><span class="token comment"># - 搜索</span></span>
<span class="line"><span class="token comment"># - 日志管理</span></span>
<span class="line"><span class="token comment"># - 安全分析</span></span>
<span class="line"><span class="token comment"># - 指标分析</span></span>
<span class="line"><span class="token comment"># - 业务分析</span></span>
<span class="line"><span class="token comment"># - 性能监控</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 编辑systemd配置</span></span>
<span class="line"><span class="token function">vim</span> /usr/lib/systemd/system/elasticsearch.service</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加以下内容</span></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">LimitMEMLOCK</span><span class="token operator">=</span>infinity</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启服务</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl restart elasticsearch</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-5-验证安装" tabindex="-1"><a class="header-anchor" href="#_2-5-验证安装"><span><strong>2.5 验证安装</strong></span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 检查端口</span>
<span class="line">netstat -tunlp | grep 9200</span>
<span class="line"></span>
<span class="line"># 测试API</span>
<span class="line">curl http://localhost:9200</span>
<span class="line">{</span>
<span class="line">  &quot;name&quot; : &quot;devops01&quot;,</span>
<span class="line">  &quot;cluster_name&quot; : &quot;elasticsearch&quot;,</span>
<span class="line">  &quot;cluster_uuid&quot; : &quot;HZMHR1EyQRGIfrdezeHSfQ&quot;,</span>
<span class="line">  &quot;version&quot; : {</span>
<span class="line">    &quot;number&quot; : &quot;7.9.1&quot;,</span>
<span class="line">    &quot;build_flavor&quot; : &quot;default&quot;,</span>
<span class="line">    &quot;build_type&quot; : &quot;rpm&quot;,</span>
<span class="line">    &quot;build_hash&quot; : &quot;083627f112ba94dffc1232e8b42b73492789ef91&quot;,</span>
<span class="line">    &quot;build_date&quot; : &quot;2020-09-01T21:22:21.964974Z&quot;,</span>
<span class="line">    &quot;build_snapshot&quot; : false,</span>
<span class="line">    &quot;lucene_version&quot; : &quot;8.6.2&quot;,</span>
<span class="line">    &quot;minimum_wire_compatibility_version&quot; : &quot;6.8.0&quot;,</span>
<span class="line">    &quot;minimum_index_compatibility_version&quot; : &quot;6.0.0-beta1&quot;</span>
<span class="line">  },</span>
<span class="line">  &quot;tagline&quot; : &quot;You Know, for Search&quot;</span>
<span class="line">}</span>
<span class="line"># 浏览器访问</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+t+`" alt="image-20260131181835312"></p><h3 id="_2-6-数据写入" tabindex="-1"><a class="header-anchor" href="#_2-6-数据写入"><span>2.6 数据写入</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> PUT <span class="token string">&#39;http://10.0.0.90:9200/test_1/_doc/1&#39;</span> <span class="token parameter variable">-H</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-d</span> <span class="token string">&#39;{</span>
<span class="line">    &quot;name&quot;:&quot;qwe&quot;,</span>
<span class="line">    &quot;age&quot;:&quot;18&quot;</span>
<span class="line">}&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token parameter variable">-X</span> PUT：HTTP方法，这里是PUT请求</span>
<span class="line">PUT：创建或更新资源</span>
<span class="line">也可以使用 POST（创建）或 GET（查询）</span>
<span class="line"><span class="token comment"># 自动生成ID（使用POST方法）  curl -X POST &#39;http://10.0.0.90:9200/test_1/_doc/&#39;</span></span>
<span class="line">http://10.0.0.90:9200/test_1/_doc/1：URL地址</span>
<span class="line"><span class="token number">10.0</span>.0.90：Elasticsearch服务器IP地址</span>
<span class="line"><span class="token number">9200</span>：ES的HTTP端口</span>
<span class="line">test_1：索引名（类似MySQL中的<span class="token string">&quot;数据库名&quot;</span>）</span>
<span class="line">_doc：文档类型（类似MySQL中的<span class="token string">&quot;表名&quot;</span>，ES <span class="token number">7</span>.x后固定为_doc）</span>
<span class="line"><span class="token number">1</span>：文档ID（类似MySQL中的<span class="token string">&quot;主键ID&quot;</span>）</span>
<span class="line"></span>
<span class="line"><span class="token parameter variable">-H</span> <span class="token string">&#39;Content-Type: application/json&#39;</span>：HTTP头，指定发送的数据格式为JSON</span>
<span class="line"></span>
<span class="line"><span class="token parameter variable">-d</span> <span class="token string">&#39;...&#39;</span>：要发送的数据内容</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 自动生成ID（使用POST方法）</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token string">&#39;http://10.0.0.90:9200/test_1/_doc/&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-d</span> <span class="token string">&#39;{&quot;name&quot;:&quot;abc&quot;, &quot;age&quot;:&quot;20&quot;}&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 删除文档</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> DELETE <span class="token string">&#39;http://10.0.0.90:9200/test_1/_doc/1&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 删除索引（删库）</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> DELETE <span class="token string">&#39;http://10.0.0.90:9200/test_1&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 查看索引信息</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token string">&#39;http://10.0.0.90:9200/test_1&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 批量操作</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token string">&#39;http://10.0.0.90:9200/_bulk&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-d</span> <span class="token string">&#39;{&quot;index&quot;:{&quot;_index&quot;:&quot;test_1&quot;,&quot;_id&quot;:&quot;2&quot;}}</span>
<span class="line">{&quot;name&quot;:&quot;test2&quot;,&quot;age&quot;:&quot;25&quot;}</span>
<span class="line">{&quot;index&quot;:{&quot;_index&quot;:&quot;test_1&quot;,&quot;_id&quot;:&quot;3&quot;}}</span>
<span class="line">{&quot;name&quot;:&quot;test3&quot;,&quot;age&quot;:&quot;30&quot;}&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第三部分-可视化工具" tabindex="-1"><a class="header-anchor" href="#第三部分-可视化工具"><span><strong>第三部分：可视化工具</strong></span></a></h2><h3 id="_3-1-elasticsearch-head插件" tabindex="-1"><a class="header-anchor" href="#_3-1-elasticsearch-head插件"><span><strong>3.1 Elasticsearch Head插件</strong></span></a></h3><p><strong>三种安装方式：</strong></p><ol><li><p><strong>Chrome插件</strong>（推荐）：直接在Chrome商店安装 Elasticsearch</p></li><li><p><strong>Docker运行</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">docker run -p 9100:9100 mobz/elasticsearch-head:7</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>NPM安装</strong>：需要Node.js环境</p></li></ol><p><img src="`+i+'" alt="image-20260131192917460"></p><p><img src="'+p+`" alt="image-20260131193300815"></p><h3 id="_3-2-kibana部署" tabindex="-1"><a class="header-anchor" href="#_3-2-kibana部署"><span><strong>3.2 Kibana部署</strong></span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 安装Kibana</span>
<span class="line">get https://artifacts.elastic.co/downloads/kibana/kibana-7.9.1-x86_64.rpm</span>
<span class="line">rpm -ivh kibana-7.9.1-x86_64.rpm</span>
<span class="line"></span>
<span class="line"># 配置</span>
<span class="line">cat &gt; /etc/kibana/kibana.yml &lt;&lt;&#39;EOF&#39;</span>
<span class="line">server.port: 5601</span>
<span class="line">server.host: &quot;10.0.0.90&quot;</span>
<span class="line">elasticsearch.hosts: [&quot;http://10.0.0.90:9200&quot;]</span>
<span class="line">kibana.index: &quot;.kibana&quot;</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"># 启动</span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start kibana</span>
<span class="line">systemctl enable kibana</span>
<span class="line"># 参考</span>
<span class="line"># https://www.elastic.co/docs/deploy-manage/deploy/self-managed/install-kibana-with-rpm#rpm-repo</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+c+`" alt="image-20260131195030481"></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">在Console控制台里读写es</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="第四部分-数据操作" tabindex="-1"><a class="header-anchor" href="#第四部分-数据操作"><span><strong>第四部分：数据操作</strong></span></a></h2><h3 id="_4-1-数据模型对比" tabindex="-1"><a class="header-anchor" href="#_4-1-数据模型对比"><span><strong>4.1 数据模型对比</strong></span></a></h3><table><thead><tr><th style="text-align:left;">MySQL</th><th style="text-align:left;">Elasticsearch</th><th style="text-align:left;">MongoDB</th></tr></thead><tbody><tr><td style="text-align:left;">Database</td><td style="text-align:left;">Index</td><td style="text-align:left;">Database</td></tr><tr><td style="text-align:left;">Table</td><td style="text-align:left;">Type（7.x后废弃）</td><td style="text-align:left;">Collection</td></tr><tr><td style="text-align:left;">Row</td><td style="text-align:left;">Document</td><td style="text-align:left;">Document</td></tr><tr><td style="text-align:left;">Column</td><td style="text-align:left;">Field</td><td style="text-align:left;">Field</td></tr><tr><td style="text-align:left;">Schema</td><td style="text-align:left;">Mapping</td><td style="text-align:left;">Schema</td></tr><tr><td style="text-align:left;">SQL</td><td style="text-align:left;">Query DSL</td><td style="text-align:left;">MQL</td></tr></tbody></table><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line">索引 = 数据库</span>
<span class="line">只有一个<span class="token string">&quot;表&quot;</span> = _doc</span>
<span class="line">每行字段可以不同（动态映射）</span>
<span class="line"># 灵活的数据结构 日志系统示例：不同日志格式可以共存</span>
<span class="line"></span>
<span class="line"><span class="token comment">// 无需预先定义表结构</span></span>
<span class="line"><span class="token comment">// 直接插入数据，ES自动推断类型</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 第一次插入数字</span></span>
<span class="line">PUT test/_doc/<span class="token number">1</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;count&quot;</span><span class="token operator">:</span> <span class="token number">100</span>  <span class="token comment">// ES推断为long类型</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">// 第二次插入字符串（会报错！）</span></span>
<span class="line">PUT test/_doc/<span class="token number">2</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;count&quot;</span><span class="token operator">:</span> <span class="token string">&quot;一百&quot;</span>  <span class="token comment">// 错误！类型冲突</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-增查改删crud操作" tabindex="-1"><a class="header-anchor" href="#_4-2-增查改删crud操作"><span><strong>4.2 增查改删CRUD操作</strong></span></a></h3><p><strong>1. 创建数据（指定ID）</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># HTTP方式</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> PUT <span class="token string">&#39;http://10.0.0.90:9200/linux_yu/_doc/1&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-d</span> <span class="token string">&#39;{&quot;name&quot;:&quot;qwe&quot;,&quot;website&quot;:&quot;www.qwe.cn&quot;}&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># http://10.0.0.90:5601/app/dev_tools#/console</span></span>
<span class="line">PUT linux_yu/_doc/2</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;name&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;asd&quot;</span>,</span>
<span class="line">  <span class="token string">&quot;website&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;www.asd.cn&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2. 创建数据（自动生成ID）</strong></p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line">POST /test_1/_doc</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;wang&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;age&quot;</span><span class="token operator">:</span> <span class="token string">&quot;19&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;123&quot;</span></span>
<span class="line">  <span class="token property">&quot;school&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">//  生成的ID是类似于  &quot;_id&quot; : &quot;s-dZFJwBFPSCG9uAYJEd&quot;  不同于手动指定的ID</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3. 查询数据</strong></p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"># 按ID查询</span>
<span class="line">GET test_1/_doc/<span class="token number">1</span></span>
<span class="line"></span>
<span class="line"># 搜索所有文档</span>
<span class="line">GET test_1/_search</span>
<span class="line"></span>
<span class="line"># 条件查询</span>
<span class="line"># match</span>
<span class="line">GET test_1/_search</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;query&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;match&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;qwe&quot;</span>  <span class="token comment">// name字段包含&quot;qwe&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"># term</span>
<span class="line">GET test_1/_search</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;query&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;term&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;qwe&quot;</span> </span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"># terms</span>
<span class="line">GET test_1/_search</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;query&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;terms&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;age&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;18&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;29&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;25&quot;</span><span class="token punctuation">]</span>  <span class="token comment">// age等于18、29或25</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"># range</span>
<span class="line">GET test_1/_search</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;query&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;range&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;age&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">&quot;gte&quot;</span><span class="token operator">:</span> <span class="token number">18</span><span class="token punctuation">,</span>    <span class="token comment">// 大于等于18</span></span>
<span class="line">        <span class="token property">&quot;lte&quot;</span><span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>    <span class="token comment">// 小于等于30</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4. 复杂查询</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 多条件查询</span></span>
<span class="line">GET t1/_search</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token key atrule">&quot;query&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token key atrule">&quot;bool&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token comment"># 布尔查询（组合多个条件）</span></span>
<span class="line">      <span class="token key atrule">&quot;must&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">{</span><span class="token key atrule">&quot;match&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token key atrule">&quot;job&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;ops&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token key atrule">&quot;filter&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token key atrule">&quot;range&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token key atrule">&quot;age&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token key atrule">&quot;gt&quot;</span><span class="token punctuation">:</span> <span class="token number">18</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token key atrule">&quot;lt&quot;</span><span class="token punctuation">:</span> <span class="token number">30</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>5. 更新数据</strong></p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"># 更新指定ID（全量替换为新指定的内容）</span>
<span class="line">PUT test_1/_doc/<span class="token number">1</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;chaoge01&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;age&quot;</span><span class="token operator">:</span> <span class="token string">&quot;18888&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"># 部分更新</span>
<span class="line">POST test_1/update/<span class="token number">1</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;chaoge02&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>6. 删除数据</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 删除文档（相当于MySQL的一行数据）</span>
<span class="line">DELETE test_2/_doc/1</span>
<span class="line"></span>
<span class="line"># 删除索引（谨慎！）</span>
<span class="line">DELETE t2/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>7.查看所有索引状态</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">GET /_cat/indices?v<span class="token operator">&amp;</span><span class="token assign-left variable">h</span><span class="token operator">=</span>index,status,health,docs.count,store.size</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="第五部分-kibana-ui界面使用" tabindex="-1"><a class="header-anchor" href="#第五部分-kibana-ui界面使用"><span><strong>第五部分：Kibana UI界面使用</strong></span></a></h2><h3 id="_5-1-创建索引模式" tabindex="-1"><a class="header-anchor" href="#_5-1-创建索引模式"><span><strong>5.1 创建索引模式</strong></span></a></h3><ol><li><p><strong>访问 Kibana</strong> → Management → Index Patterns</p></li><li><p>输入索引名称（如 <code>t1</code> 或 <code>t*</code>）</p></li><li><p>选择时间字段（可选）</p></li><li><p>创建索引模式</p></li></ol><p>访问 10.0.0.90:5601</p><p><img src="`+o+'" alt="image-20260131233135284"></p><p><img src="'+r+'" alt="image-20260131233152710"></p><p><img src="'+d+'" alt="image-20260131233237908"></p><h3 id="_5-2-discover功能" tabindex="-1"><a class="header-anchor" href="#_5-2-discover功能"><span><strong>5.2 Discover功能</strong></span></a></h3><ul><li>实时数据浏览</li><li>添加过滤条件</li><li>字段统计</li><li>时间范围筛选</li></ul><p><img src="'+u+'" alt="image-20260131233035060"></p><p><img src="'+v+'" alt="image-20260201000403298"></p>',73)])])}const k=n(m,[["render",b]]),q=JSON.parse('{"path":"/11-ELK%E6%97%A5%E5%BF%97%E7%B3%BB%E7%BB%9F/01-elasticsearch%E4%B8%8Eelk/1-ES.html","title":"Elasticsearch 基础指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"11-ELK日志系统/01-elasticsearch与elk/1-ES.md"}');export{k as comp,q as data};
