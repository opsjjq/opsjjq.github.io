import{_ as n,c as a,e,o as i}from"./app-DtXLoKBz.js";const l="/assets/1669365885884-hGEbZ34Y.png",p="/assets/1669365953958-0QPMXRnn.png",c="/assets/image-20260203155712991-MqwFRih3.png",t="/assets/image-20260203155644037-DqVtzKFj.png",d="/assets/image-20260203160715732-QzQZf4_P.png",r={};function o(u,s){return i(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="监控接口" tabindex="-1"><a class="header-anchor" href="#监控接口"><span>监控接口</span></a></h1><h2 id="常用监控接口" tabindex="-1"><a class="header-anchor" href="#常用监控接口"><span>常用监控接口</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 集群健康状态</span>
<span class="line">http://10.0.0.90:9200/_cat/health</span>
<span class="line"></span>
<span class="line"># 节点信息</span>
<span class="line">http://10.0.0.90:9200/_cat/nodes</span>
<span class="line"></span>
<span class="line"># 主节点信息</span>
<span class="line">http://10.0.0.90:9200/_cat/master</span>
<span class="line"></span>
<span class="line"># 索引信息</span>
<span class="line">http://10.0.0.90:9200/_cat/indices</span>
<span class="line"></span>
<span class="line"># 分片信息</span>
<span class="line">http://10.0.0.90:9200/_cat/shards</span>
<span class="line"></span>
<span class="line"># 指定索引分片信息</span>
<span class="line">http://10.0.0.90:9200/_cat/shards/t2</span>
<span class="line"></span>
<span class="line">_cat API 常见参数</span>
<span class="line">参数	说明	示例</span>
<span class="line">?v	显示详细格式，包括列标题	/_cat/nodes?v</span>
<span class="line">?h	指定显示的列	/_cat/nodes?h=name,ip,cpu</span>
<span class="line">?help	显示帮助信息	/_cat/nodes?help</span>
<span class="line">?format	指定输出格式（json, yaml等）	/_cat/nodes?format=json</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="脚本监控示例" tabindex="-1"><a class="header-anchor" href="#脚本监控示例"><span>脚本监控示例</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 判断集群是否健康</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.90:9200/_cat/health <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;green&#39;</span> <span class="token operator">|</span> <span class="token function">wc</span> <span class="token parameter variable">-l</span></span>
<span class="line"><span class="token comment"># 集群节点信息   ?v显示详细格式</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.90:9200/_cat/nodes?v</span>
<span class="line"><span class="token comment"># 统计ES节点数量</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.90:9200/_cat/nodes <span class="token operator">|</span> <span class="token function">wc</span> <span class="token parameter variable">-l</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="kibana监控管理" tabindex="-1"><a class="header-anchor" href="#kibana监控管理"><span>Kibana监控管理</span></a></h1><h2 id="ui" tabindex="-1"><a class="header-anchor" href="#ui"><span>UI</span></a></h2><h3 id="开启监控" tabindex="-1"><a class="header-anchor" href="#开启监控"><span>开启监控</span></a></h3><p><img src="`+l+'" alt="1669365885884"></p><p><img src="'+p+'" alt="1669365953958"></p><h3 id="es集群信息" tabindex="-1"><a class="header-anchor" href="#es集群信息"><span>es集群信息</span></a></h3><p><img src="'+c+'" alt="image-20260203155712991"></p><h3 id="节点状态" tabindex="-1"><a class="header-anchor" href="#节点状态"><span>节点状态</span></a></h3><p><img src="'+t+`" alt="image-20260203155644037"></p><h3 id="kibana生成的监控数据" tabindex="-1"><a class="header-anchor" href="#kibana生成的监控数据"><span>kibana生成的监控数据</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kibana获取监控数据，写入es，然后kibana再读。</span>
<span class="line">10s采集区间。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+d+`" alt="image-20260203160715732"></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">.monitoring-es-7-<span class="token punctuation">{</span>日期<span class="token punctuation">}</span></span>
<span class="line">用途：存储 Elasticsearch 集群的监控数据</span>
<span class="line">包含的数据类型：</span>
<span class="line">GET .monitoring-es-7-2026.02.03/_search</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;size&quot;</span><span class="token builtin class-name">:</span> <span class="token number">1</span>,</span>
<span class="line">  <span class="token string">&quot;_source&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span><span class="token string">&quot;type&quot;</span>, <span class="token string">&quot;cluster_name&quot;</span>, <span class="token string">&quot;timestamp&quot;</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line">具体包含的指标：</span>
<span class="line"><span class="token number">1</span>. 集群级别指标</span>
<span class="line">   - 集群状态（green/yellow/red）</span>
<span class="line">   - 节点数量</span>
<span class="line">   - 分片数量</span>
<span class="line">   - 未分配分片数</span>
<span class="line">   - 文档总数</span>
<span class="line">   - 索引总数</span>
<span class="line"><span class="token number">2</span>. 节点级别指标</span>
<span class="line">   - JVM 堆内存使用率</span>
<span class="line">   - 系统内存使用率</span>
<span class="line">   - CPU 使用率</span>
<span class="line">   - 磁盘使用情况</span>
<span class="line">   - 网络流量</span>
<span class="line">   - 线程池状态</span>
<span class="line">   - 垃圾回收统计</span>
<span class="line"><span class="token number">3</span>. 索引级别指标</span>
<span class="line">   - 索引大小</span>
<span class="line">   - 文档数量</span>
<span class="line">   - 索引/查询吞吐量</span>
<span class="line">   - 索引/查询延迟</span>
<span class="line">   - 分片统计</span>
<span class="line"><span class="token number">4</span>. 分片级别指标</span>
<span class="line">   - 分片状态</span>
<span class="line">   - 文档数量</span>
<span class="line">   - 存储大小</span>
<span class="line">   - 索引/查询操作数</span>
<span class="line">   </span>
<span class="line">.monitoring-kibana-7-<span class="token punctuation">{</span>日期<span class="token punctuation">}</span></span>
<span class="line">用途：存储 Kibana 实例的监控数据</span>
<span class="line">包含的数据类型：</span>
<span class="line">GET .monitoring-kibana-7-2026.02.03/_search</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;size&quot;</span><span class="token builtin class-name">:</span> <span class="token number">1</span>,</span>
<span class="line">  <span class="token string">&quot;_source&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span><span class="token string">&quot;kibana&quot;</span>, <span class="token string">&quot;process&quot;</span>, <span class="token string">&quot;os&quot;</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line">具体包含的指标：</span>
<span class="line"></span>
<span class="line"><span class="token number">1</span>. Kibana 实例信息</span>
<span class="line">   - 版本号</span>
<span class="line">   - 实例名称/UUID</span>
<span class="line">   - 运行状态</span>
<span class="line"><span class="token number">2</span>. 进程指标</span>
<span class="line">   - 内存使用（RSS、堆内存）</span>
<span class="line">   - CPU 使用率</span>
<span class="line">   - 正常运行时间</span>
<span class="line">   - 响应时间</span>
<span class="line"><span class="token number">3</span>. 请求统计</span>
<span class="line">   - HTTP 请求总数</span>
<span class="line">   - 响应时间分布</span>
<span class="line">   - 错误率</span>
<span class="line">   - 并发连接数</span>
<span class="line"><span class="token number">4</span>. 搜索性能</span>
<span class="line">   - Elasticsearch 查询次数</span>
<span class="line">   - 平均查询时间</span>
<span class="line">   - 查询失败率</span>
<span class="line"><span class="token number">5</span>. 系统资源</span>
<span class="line">   - 内存使用情况</span>
<span class="line">   - CPU 负载</span>
<span class="line">   - 磁盘空间</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="console" tabindex="-1"><a class="header-anchor" href="#console"><span>Console</span></a></h2><p>在 Kibana 的 Dev Tools Console 里，<strong>不写完整的 URL</strong>，只写 API 路径部分。</p><ul><li>Kibana 的 Console 会自动连接到你在 <code>kibana.yml</code> 中配置的 Elasticsearch</li><li>不需要指定主机和端口</li></ul><h3 id="查看监控状态" tabindex="-1"><a class="header-anchor" href="#查看监控状态"><span>查看监控状态</span></a></h3><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line">GET /_cluster/settings</span>
<span class="line">########结果如下</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;persistent&quot;</span> <span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;xpack&quot;</span> <span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;monitoring&quot;</span> <span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">&quot;collection&quot;</span> <span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token property">&quot;enabled&quot;</span> <span class="token operator">:</span> <span class="token string">&quot;true&quot;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;transient&quot;</span> <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关闭监控" tabindex="-1"><a class="header-anchor" href="#关闭监控"><span>关闭监控</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">PUT /_cluster/settings</span>
<span class="line">{</span>
<span class="line">  &quot;persistent&quot;: {</span>
<span class="line">    &quot;xpack&quot;: {</span>
<span class="line">      &quot;monitoring&quot;: {</span>
<span class="line">        &quot;collection&quot;: {</span>
<span class="line">          &quot;enabled&quot;: &quot;false&quot;</span>
<span class="line">        }</span>
<span class="line">      }</span>
<span class="line">    }</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意</strong>: 关闭监控后可以删除监控数据索引.monitoring-es-7-2026.02.03 .monitoring-es-7-2026.02.03</p>`,26)])])}const m=n(r,[["render",o]]),b=JSON.parse('{"path":"/11-ELK%E6%97%A5%E5%BF%97%E7%B3%BB%E7%BB%9F/01-elasticsearch%E4%B8%8Eelk/3-ES%E7%9B%91%E6%8E%A7%E6%8E%A5%E5%8F%A3.html","title":"监控接口","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"11-ELK日志系统/01-elasticsearch与elk/3-ES监控接口.md"}');export{m as comp,b as data};
