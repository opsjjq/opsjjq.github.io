import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const t={};function i(p,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="elk日志格式处理" tabindex="-1"><a class="header-anchor" href="#elk日志格式处理"><span>ELK日志格式处理</span></a></h1><h2 id="一、json格式日志处理" tabindex="-1"><a class="header-anchor" href="#一、json格式日志处理"><span>一、JSON格式日志处理</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">修改Nginx配置为JSON格式（推荐，简单高效）</span>
<span class="line"></span>
<span class="line">使用ES Grok转换器（灵活但复杂）</span>
<span class="line"></span>
<span class="line">使用Filebeat模块（最便捷）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-1-为什么要用json格式" tabindex="-1"><a class="header-anchor" href="#_1-1-为什么要用json格式"><span>1.1 为什么要用JSON格式</span></a></h3><p>普通日志将所有信息放在一个字段中，不方便按字段查询统计。</p><hr><h2 id="二、修改nginx日志格式" tabindex="-1"><a class="header-anchor" href="#二、修改nginx日志格式"><span>二、修改Nginx日志格式</span></a></h2><h3 id="_2-1-配置json格式" tabindex="-1"><a class="header-anchor" href="#_2-1-配置json格式"><span>2.1 配置JSON格式</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token comment"># nginx.conf 配置</span></span>
<span class="line"><span class="token directive"><span class="token keyword">http</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">log_format</span> json <span class="token string">&#39;{&quot;客户端内网地址&quot;:&quot;<span class="token variable">$remote_addr</span>&quot;,&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;时间&quot;:&quot;<span class="token variable">$time_iso8601</span>&quot;,&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;URL&quot;:&quot;<span class="token variable">$request</span>&quot;,&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;状态码&quot;:<span class="token variable">$status</span>,&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;传输流量&quot;:<span class="token variable">$body_bytes_sent,</span>&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;跳转来源&quot;:&quot;<span class="token variable">$http_referer</span>&quot;,&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;浏览器&quot;:&quot;<span class="token variable">$http_user_agent</span>&quot;,&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;客户端外网地址&quot;:&quot;<span class="token variable">$http_x_forwarded_for</span>&quot;,&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;请求响应时间&quot;:<span class="token variable">$request_time,</span>&#39;</span></span>
<span class="line">                     <span class="token string">&#39;&quot;后端地址&quot;:&quot;<span class="token variable">$upstream_addr</span>&quot;}&#39;</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">access_log</span> /var/log/nginx/access.log json</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">systemctl restart nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 也要注意虚拟主机server配置里有没有制定access_log</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-修改filebeat配置支持json" tabindex="-1"><a class="header-anchor" href="#_2-2-修改filebeat配置支持json"><span>2.2 修改Filebeat配置支持JSON</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line">cat <span class="token punctuation">&gt;</span>/etc/filebeat/filebeat.yml&lt;&lt;&#39;EOF&#39;</span>
<span class="line"><span class="token key atrule">filebeat.inputs</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> log</span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> /var/log/nginx/error.log</span>
<span class="line">  <span class="token key atrule">fields</span><span class="token punctuation">:</span> <span class="token comment"># 自定义K-V</span></span>
<span class="line">    <span class="token key atrule">log_type</span><span class="token punctuation">:</span> nginx_error</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> log</span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> /var/log/nginx/access.log</span>
<span class="line">  <span class="token key atrule">json.keys_under_root</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">json.overwrite_keys</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">json.add_error_key</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">fields</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">log_type</span><span class="token punctuation">:</span> nginx_access</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">output.elasticsearch</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;10.0.0.90:9200&quot;</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token key atrule">indices</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">index</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx-access-%{[agent.version]}-%{+yyyy.MM.dd}&quot;</span></span>
<span class="line">      <span class="token key atrule">when.equals</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">fields.log_type</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx_access&quot;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">index</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx-error-%{[agent.version]}-%{+yyyy.MM.dd}&quot;</span></span>
<span class="line">      <span class="token key atrule">when.equals</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">fields.log_type</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx_error&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 禁用ILM和模板</span></span>
<span class="line"><span class="token key atrule">setup.ilm.enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"><span class="token key atrule">setup.template.enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 日志配置</span></span>
<span class="line"><span class="token key atrule">logging.level</span><span class="token punctuation">:</span> info</span>
<span class="line"><span class="token key atrule">logging.to_files</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"><span class="token key atrule">logging.files</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">path</span><span class="token punctuation">:</span> /var/log/filebeat</span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> filebeat</span>
<span class="line">  <span class="token key atrule">keepfiles</span><span class="token punctuation">:</span> <span class="token number">7</span></span>
<span class="line">  <span class="token key atrule">permissions</span><span class="token punctuation">:</span> <span class="token number">0644</span></span>
<span class="line">EOF</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-关键配置项" tabindex="-1"><a class="header-anchor" href="#_2-3-关键配置项"><span>2.3 关键配置项</span></a></h3><table><thead><tr><th style="text-align:left;">配置项</th><th style="text-align:left;">推荐值</th><th style="text-align:left;">原因</th></tr></thead><tbody><tr><td style="text-align:left;"><code>keys_under_root</code></td><td style="text-align:left;"><code>true</code></td><td style="text-align:left;">查询更方便，字段在根级别</td></tr><tr><td style="text-align:left;"><code>overwrite_keys</code></td><td style="text-align:left;"><code>true</code></td><td style="text-align:left;">使用日志时间更准确</td></tr><tr><td style="text-align:left;"><code>add_error_key</code></td><td style="text-align:left;"><code>true</code></td><td style="text-align:left;">便于发现解析问题</td></tr><tr><td style="text-align:left;"><code>fields</code></td><td style="text-align:left;">按需自定义添加</td><td style="text-align:left;">添加业务标识</td></tr></tbody></table><h3 id="_2-4-fields-vs-tags-的区别" tabindex="-1"><a class="header-anchor" href="#_2-4-fields-vs-tags-的区别"><span>2.4 fields vs tags 的区别</span></a></h3><table><thead><tr><th style="text-align:left;">特性</th><th style="text-align:left;"><code>fields</code></th><th style="text-align:left;"><code>tags</code></th></tr></thead><tbody><tr><td style="text-align:left;"><strong>数据类型</strong></td><td style="text-align:left;">可以是任何类型（字符串、数字、布尔值）</td><td style="text-align:left;">只能是字符串数组</td></tr><tr><td style="text-align:left;"><strong>存储方式</strong></td><td style="text-align:left;">作为普通字段存储</td><td style="text-align:left;">作为特殊字段存储</td></tr><tr><td style="text-align:left;"><strong>查询性能</strong></td><td style="text-align:left;">较慢（需要指定完整路径）</td><td style="text-align:left;">较快（专门优化）</td></tr><tr><td style="text-align:left;"><strong>主要用途</strong></td><td style="text-align:left;">存储附加元数据、业务信息</td><td style="text-align:left;">简单分类、过滤、分组</td></tr><tr><td style="text-align:left;"><strong>示例</strong></td><td style="text-align:left;"><code>environment: &quot;production&quot;</code> <code>version: 2.1</code></td><td style="text-align:left;"><code>tags: [&quot;nginx&quot;, &quot;prod&quot;]</code></td></tr></tbody></table><h3 id="_2-5-重建索引流程" tabindex="-1"><a class="header-anchor" href="#_2-5-重建索引流程"><span>2.5 重建索引流程</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 删除旧索引（测试环境）</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> DELETE <span class="token string">&#39;http://localhost:9200/filebeat-7.9.1-2026.02.05-000001&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 重启Filebeat</span></span>
<span class="line">systemctl restart filebeat.service</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 生成新日志</span></span>
<span class="line"><span class="token function">curl</span> <span class="token number">127.0</span>.0.1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 查看新索引</span></span>
<span class="line">GET /nginx-access-7.9.1-2026.02.06/_search</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、es-grok转换器" tabindex="-1"><a class="header-anchor" href="#三、es-grok转换器"><span>三、ES Grok转换器</span></a></h2><h3 id="_3-1-grok模式详解" tabindex="-1"><a class="header-anchor" href="#_3-1-grok模式详解"><span>3.1 Grok模式详解</span></a></h3><p>Grok是一种组合预定义正则表达式来匹配和解析文本的工具。</p><h4 id="nginx日志grok模式映射" tabindex="-1"><a class="header-anchor" href="#nginx日志grok模式映射"><span>Nginx日志Grok模式映射</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">原始日志举例</span>
<span class="line"></span>
<span class="line">127.0.0.1 - - [19/Feb/2023:11:53.49 +0800] &quot;GET / HTTP/1.1&quot; 200 9205 &quot;-&quot; &quot;curl/7.29.0&quot; &quot;-&quot;</span>
<span class="line"></span>
<span class="line">对应Grok模式：</span>
<span class="line">127.0.0.1                    =&gt;   %{IP:clientip}</span>
<span class="line">-                            =&gt;   -</span>
<span class="line">-                            =&gt;   -</span>
<span class="line">[19/Feb/2023:11:53.49 +0800] =&gt;   \\[%{HTTPDATE:nginx.access.time}\\]</span>
<span class="line">&quot;GET / HTTP/1.1&quot;             =&gt;   &quot;%{DATA:nginx.access.info}&quot;</span>
<span class="line">200                          =&gt;   %{NUMBER:http.response.status_code:long}</span>
<span class="line">9205                         =&gt;   %{NUMBER:http.response.body.bytes:long}</span>
<span class="line">&quot;-&quot;                          =&gt;   &quot;(-|%{DATA:http.request.referrer})&quot;</span>
<span class="line">&quot;curl/7.29.0&quot;                =&gt;   &quot;(-|%{DATA:user_agent.original})&quot;</span>
<span class="line">&quot;-&quot;                          =&gt;   &quot;(-|%{IP:clientip})&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完整Grok模式字符串：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">%{IP:clientip} - - \\[%{HTTPDATE:nginx.access.time}\\] &quot;%{DATA:nginx.access.info}&quot; %{NUMBER:http.response.status_code:long} %{NUMBER:http.response.body.bytes:long} &quot;(-|%{DATA:http.request.referrer})&quot; &quot;(-|%{DATA:user_agent.original})&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="_3-2-恢复nginx默认的log格式" tabindex="-1"><a class="header-anchor" href="#_3-2-恢复nginx默认的log格式"><span>3.2 恢复nginx默认的log格式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">log_format main <span class="token string">&#39;$remote_addr - $remote_user [$time_local] &quot;$request&quot; &#39;</span></span>
<span class="line">                <span class="token string">&#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;</span></span>
<span class="line">                <span class="token string">&#39;&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot;&#39;</span><span class="token punctuation">;</span></span>
<span class="line">access_log /var/log/nginx/access.log main<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">systemctl restart nginx</span>
<span class="line"><span class="token function">curl</span> <span class="token number">127.0</span>.0.1</span>
<span class="line"><span class="token function">curl</span> <span class="token number">127.0</span>.0.1</span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-5</span> /var/log/nginx/access.log</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-创建es处理管道-pipeline" tabindex="-1"><a class="header-anchor" href="#_3-3-创建es处理管道-pipeline"><span>3.3 创建ES处理管道（Pipeline）</span></a></h3><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line">PUT _ingest/pipeline/pipeline-nginx-access</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;nginx access log processor&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;processors&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;grok&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">&quot;field&quot;</span><span class="token operator">:</span> <span class="token string">&quot;message&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">&quot;patterns&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token string">&quot;%{IP:clientip} - - \\\\[%{HTTPDATE:nginx.access.time}\\\\] \\&quot;%{DATA:nginx.access.info}\\&quot; %{NUMBER:http.response.status_code:long} %{NUMBER:http.response.body.bytes:long} \\&quot;(-|%{DATA:http.request.referrer})\\&quot; \\&quot;(-|%{DATA:user_agent.original})\\&quot;&quot;</span></span>
<span class="line">        <span class="token punctuation">]</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;remove&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">&quot;field&quot;</span><span class="token operator">:</span> <span class="token string">&quot;message&quot;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="验证pipeline" tabindex="-1"><a class="header-anchor" href="#验证pipeline"><span>验证Pipeline</span></a></h4><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"># 查看所有pipeline</span>
<span class="line">GET _ingest/pipeline</span>
<span class="line"></span>
<span class="line"># 测试pipeline</span>
<span class="line">POST _ingest/pipeline/pipeline-nginx-access/_simulate</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;docs&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;_source&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;127.0.0.1 - - [19/Feb/2023:11:53.49 +0800] \\&quot;GET / HTTP/1.1\\&quot; 200 9205 \\&quot;-\\&quot; \\&quot;curl/7.29.0\\&quot; \\&quot;-\\&quot;&quot;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-filebeat配置" tabindex="-1"><a class="header-anchor" href="#_3-4-filebeat配置"><span>3.4 Filebeat配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line">cat <span class="token punctuation">&gt;</span>/etc/filebeat/filebeat.yml &lt;&lt;&#39;EOF&#39;</span>
<span class="line"><span class="token key atrule">filebeat.inputs</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> log</span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> /var/log/nginx/error.log</span>
<span class="line">  <span class="token key atrule">fields</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">log_type</span><span class="token punctuation">:</span> nginx_error</span>
<span class="line">  <span class="token key atrule">tags</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;error&quot;</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> log</span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> /var/log/nginx/access.log</span>
<span class="line">  <span class="token key atrule">fields</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">log_type</span><span class="token punctuation">:</span> nginx_access</span>
<span class="line">  <span class="token key atrule">tags</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;access&quot;</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">output.elasticsearch</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;10.0.0.90:9200&quot;</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token key atrule">pipelines</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">pipeline</span><span class="token punctuation">:</span> <span class="token string">&quot;pipeline-nginx-access&quot;</span></span>
<span class="line">      <span class="token key atrule">when.contains</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">tags</span><span class="token punctuation">:</span> <span class="token string">&quot;access&quot;</span></span>
<span class="line">  <span class="token key atrule">indices</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">index</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx-access-%{[agent.version]}-%{+yyyy.MM.dd}&quot;</span></span>
<span class="line">      <span class="token key atrule">when.equals</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">fields.log_type</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx_access&quot;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">index</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx-error-%{[agent.version]}-%{+yyyy.MM.dd}&quot;</span></span>
<span class="line">      <span class="token key atrule">when.equals</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">fields.log_type</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx_error&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 禁用ILM和模板</span></span>
<span class="line"><span class="token key atrule">setup.ilm.enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"><span class="token key atrule">setup.template.enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 日志配置</span></span>
<span class="line"><span class="token key atrule">logging.level</span><span class="token punctuation">:</span> info</span>
<span class="line"><span class="token key atrule">logging.to_files</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"><span class="token key atrule">logging.files</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">path</span><span class="token punctuation">:</span> /var/log/filebeat</span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> filebeat</span>
<span class="line">  <span class="token key atrule">keepfiles</span><span class="token punctuation">:</span> <span class="token number">7</span></span>
<span class="line">  <span class="token key atrule">permissions</span><span class="token punctuation">:</span> <span class="token number">0644</span></span>
<span class="line">EOF</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-5-测试" tabindex="-1"><a class="header-anchor" href="#_3-5-测试"><span>3.5 测试</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 清理ES所有索引（可选操作  测试环境使用）</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> DELETE <span class="token string">&#39;http://10.0.0.90:9200/nginx*&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 重启Filebeat服务</span></span>
<span class="line">systemctl restart filebeat</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 生成测试数据</span></span>
<span class="line"><span class="token function">curl</span> <span class="token number">127.0</span>.0.1</span>
<span class="line"><span class="token function">curl</span> <span class="token number">127.0</span>.0.1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 检查ES数据</span></span>
<span class="line"><span class="token comment"># 通过Kibana或ES API查看新生成的索引数据</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、filebeat支持nginx模块" tabindex="-1"><a class="header-anchor" href="#四、filebeat支持nginx模块"><span>四、Filebeat支持Nginx模块</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> DELETE <span class="token string">&#39;http://10.0.0.90:9200/nginx*&#39;</span></span>
<span class="line"><span class="token comment"># Filebeat删除或注释pipelines配置</span></span>
<span class="line"><span class="token function">vim</span> /etc/filebeat/filebeat.yml</span>
<span class="line">systemctl restart filebeat</span>
<span class="line"><span class="token function">curl</span> <span class="token number">10.0</span>.0.90:80</span>
<span class="line"><span class="token function">curl</span> <span class="token number">10.0</span>.0.90:80</span>
<span class="line"><span class="token comment"># 检查完后再次清理索引</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> DELETE <span class="token string">&#39;http://10.0.0.90:9200/nginx*&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-1-模块配置" tabindex="-1"><a class="header-anchor" href="#_4-1-模块配置"><span>4.1 模块配置</span></a></h3><h4 id="_4-1-1-查看-filebeat-环境" tabindex="-1"><a class="header-anchor" href="#_4-1-1-查看-filebeat-环境"><span>4.1.1 查看 Filebeat 环境</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看 filebeat 版本</span></span>
<span class="line">filebeat version</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看当前目录结构</span></span>
<span class="line"><span class="token function">ls</span> /etc/filebeat/</span>
<span class="line"><span class="token function">ls</span> /etc/filebeat/modules.d/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-1-2-启用模块管理功能" tabindex="-1"><a class="header-anchor" href="#_4-1-2-启用模块管理功能"><span>4.1.2 启用模块管理功能</span></a></h4><p>修改 <code>/etc/filebeat/filebeat.yml</code> 配置文件，添加以下内容：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;filebeat.config.modules:</span>
<span class="line">  path: \${path.config}/modules.d/*.yml</span>
<span class="line">  reload.enabled: true&#39;</span> <span class="token operator">&gt;&gt;</span>/etc/filebeat/filebeat.yml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-1-3-查看和管理模块" tabindex="-1"><a class="header-anchor" href="#_4-1-3-查看和管理模块"><span>4.1.3 查看和管理模块</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看所有可用模块</span></span>
<span class="line">filebeat modules list</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启用 nginx 模块</span></span>
<span class="line">filebeat modules <span class="token builtin class-name">enable</span> nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-nginx-日志收集配置" tabindex="-1"><a class="header-anchor" href="#_4-2-nginx-日志收集配置"><span>4.2 Nginx 日志收集配置</span></a></h3><h4 id="配置-nginx-模块" tabindex="-1"><a class="header-anchor" href="#配置-nginx-模块"><span>配置 Nginx 模块</span></a></h4><p>创建 <code>/etc/filebeat/modules.d/nginx.yml</code> 配置文件：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/filebeat/modules.d/nginx.yml <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">- module: nginx</span>
<span class="line">  access:</span>
<span class="line">    enabled: true</span>
<span class="line">    var.paths: [&quot;/var/log/nginx/access.log&quot;]</span>
<span class="line">  error:</span>
<span class="line">    enabled: true</span>
<span class="line">    var.paths: [&quot;/var/log/nginx/error.log&quot;]</span>
<span class="line">  ingress_controller:</span>
<span class="line">    enabled: false</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、tomcat-日志收集配置" tabindex="-1"><a class="header-anchor" href="#五、tomcat-日志收集配置"><span>五、Tomcat 日志收集配置</span></a></h2><h3 id="_5-1-安装-jdk" tabindex="-1"><a class="header-anchor" href="#_5-1-安装-jdk"><span>5.1 安装 JDK</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"><span class="token function">wget</span> https://download.oracle.com/java/17/archive/jdk-17.0.12_linux-x64_bin.tar.gz</span>
<span class="line"><span class="token comment"># 解压 JDK</span></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> jdk-17.0.12_linux-x64_bin.tar.gz <span class="token parameter variable">-C</span> /opt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 更改文件夹名</span></span>
<span class="line"><span class="token function">mv</span> /opt/jdk-17.0.12 /opt/jdk17</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置环境变量</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;$a export JAVA_HOME=/opt/jdk17\\nexport PATH=$JAVA_HOME/bin:$PATH&#39;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"><span class="token function">java</span> <span class="token parameter variable">-version</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-安装和配置-tomcat" tabindex="-1"><a class="header-anchor" href="#_5-2-安装和配置-tomcat"><span>5.2 安装和配置 Tomcat</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"><span class="token comment"># 迅雷添加云盘 再快速下载</span></span>
<span class="line">wegt https://dlcdn.apache.org/tomcat/tomcat-10/v10.1.52/bin/apache-tomcat-10.1.52.tar.gz</span>
<span class="line"><span class="token comment"># 解压 Tomcat</span></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> apache-tomcat-10.1.52.tar.gz <span class="token parameter variable">-C</span> /opt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改 Tomcat 日志格式为 JSON</span></span>
<span class="line"><span class="token comment"># 编辑 /opt/apache-tomcat-10.1.52/conf/server.xml</span></span>
<span class="line"><span class="token comment"># 修改 AccessLogValve 的 pattern 配置为 JSON 格式：</span></span>
<span class="line"></span>
<span class="line">        <span class="token operator">&lt;</span>Valve <span class="token assign-left variable">className</span><span class="token operator">=</span><span class="token string">&quot;org.apache.catalina.valves.AccessLogValve&quot;</span> <span class="token assign-left variable">directory</span><span class="token operator">=</span><span class="token string">&quot;logs&quot;</span></span>
<span class="line">               <span class="token assign-left variable">prefix</span><span class="token operator">=</span><span class="token string">&quot;localhost_access_log&quot;</span> <span class="token assign-left variable">suffix</span><span class="token operator">=</span><span class="token string">&quot;.txt&quot;</span></span>
<span class="line">               <span class="token assign-left variable">pattern</span><span class="token operator">=</span><span class="token string">&quot;{&amp;quot;clientip&amp;quot;:&amp;quot;%h&amp;quot;,&amp;quot;ClientUser&amp;quot;:&amp;quot;%l&amp;quot;,&amp;quot;authenticated&amp;quot;:&amp;quot;%u&amp;quot;,&amp;quot;AccessTime&amp;quot;:&amp;quot;%t&amp;quot;,&amp;quot;method&amp;quot;:&amp;quot;%r&amp;quot;,&amp;quot;status&amp;quot;:&amp;quot;%s&amp;quot;,&amp;quot;SendBytes&amp;quot;:&amp;quot;%b&amp;quot;,&amp;quot;Query?string&amp;quot;:&amp;quot;%q&amp;quot;,&amp;quot;partner&amp;quot;:&amp;quot;%{Referer}i&amp;quot;,&amp;quot;AgentVersion&amp;quot;:&amp;quot;%{User-Agent}i&amp;quot;}&quot;</span>/<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-启动-tomcat" tabindex="-1"><a class="header-anchor" href="#_5-3-启动-tomcat"><span>5.3 启动 Tomcat</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">/opt/apache-tomcat-10.1.52/bin/startup.sh</span>
<span class="line"></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-I</span> <span class="token number">10.0</span>.0.90:8080</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-filebeat-配置——收集-tomcat-日志" tabindex="-1"><a class="header-anchor" href="#_5-4-filebeat-配置——收集-tomcat-日志"><span>5.4 Filebeat 配置——收集 Tomcat 日志</span></a></h3><p>在 <code>/etc/filebeat/filebeat.yml</code> 中添加 Tomcat 输入配置：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line">cat <span class="token punctuation">&gt;</span>/etc/filebeat/filebeat.yml &lt;&lt;&#39;EOF&#39;</span>
<span class="line"><span class="token key atrule">filebeat.inputs</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> log</span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> /opt/apache<span class="token punctuation">-</span>tomcat<span class="token punctuation">-</span>10.1.52/logs/localhost_access_log.<span class="token important">*.txt</span></span>
<span class="line">  <span class="token key atrule">json.keys_under_root</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">json.overwrite_keys</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">tags</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;tomcat&quot;</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">output.elasticsearch</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;10.0.0.90:9200&quot;</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token key atrule">indices</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">index</span><span class="token punctuation">:</span> <span class="token string">&quot;tomcat-access-%{[agent.version]}-%{+yyyy.MM.dd}&quot;</span></span>
<span class="line">      <span class="token key atrule">when.contains</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">tags</span><span class="token punctuation">:</span> <span class="token string">&quot;tomcat&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">setup.ilm.enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"><span class="token key atrule">setup.template.enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">logging.level</span><span class="token punctuation">:</span> info</span>
<span class="line"><span class="token key atrule">logging.to_files</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"><span class="token key atrule">logging.files</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">path</span><span class="token punctuation">:</span> /var/log/filebeat</span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> filebeat</span>
<span class="line">  <span class="token key atrule">keepfiles</span><span class="token punctuation">:</span> <span class="token number">7</span></span>
<span class="line">  <span class="token key atrule">permissions</span><span class="token punctuation">:</span> <span class="token number">0644</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">filebeat.config.modules</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">path</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>path.config<span class="token punctuation">}</span>/modules.d/<span class="token important">*.yml</span></span>
<span class="line">  <span class="token key atrule">reload.enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">EOF</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-5-重启-filebeat" tabindex="-1"><a class="header-anchor" href="#_5-5-重启-filebeat"><span>5.5 重启 Filebeat</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">systemctl restart filebeat.service</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h2 id="六、验证和监控" tabindex="-1"><a class="header-anchor" href="#六、验证和监控"><span>六、验证和监控</span></a></h2><h3 id="_6-1-检查日志格式" tabindex="-1"><a class="header-anchor" href="#_6-1-检查日志格式"><span>6.1 检查日志格式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查 Tomcat 日志是否为 JSON 格式</span></span>
<span class="line"><span class="token function">cat</span> /opt/apache-tomcat-10.1.52/logs/localhost_access_log.2026-02-06.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 Filebeat 状态</span></span>
<span class="line">systemctl status filebeat.service</span>
<span class="line"></span>
<span class="line"><span class="token comment"># curl 命令拿到数据</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;10.0.0.90:9200/_cat/indices/tomcat-access-7.9.1-2026.02.07?v&quot;</span></span>
<span class="line"><span class="token comment"># kibana 终端命令</span></span>
<span class="line">GET _cat/indices/tomcat-access-7.9.1-2026.02.07?v</span>
<span class="line"><span class="token comment"># es插件检查索引数据</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-kibana-配置" tabindex="-1"><a class="header-anchor" href="#_6-2-kibana-配置"><span>6.2 Kibana 配置</span></a></h3><ol><li>登录 Kibana 控制台</li><li>进入 Stack Management → Index Patterns</li><li>创建对应的索引模式： <ul><li><code>tomcat-access-*</code></li></ul></li><li>在 <strong>Discover</strong> 页面查看日志数据</li></ol><hr><h2 id="七、总结" tabindex="-1"><a class="header-anchor" href="#七、总结"><span>七、总结</span></a></h2><p>ELK日志格式处理提供了多种方式来实现日志的规范化采集和字段化查询，包括JSON格式、Grok转换器和Filebeat模块。根据实际需求选择合适的方式，可以提高日志分析的效率和准确性。</p><blockquote><p>下一步：学习Kibana可视化功能，实现数据的图表展示和仪表板管理。</p></blockquote>`,73)])])}const o=n(t,[["render",i]]),r=JSON.parse('{"path":"/11-ELK%E6%97%A5%E5%BF%97%E7%B3%BB%E7%BB%9F/01-elasticsearch%E4%B8%8Eelk/7-ELK%E6%97%A5%E5%BF%97%E6%A0%BC%E5%BC%8F%E5%A4%84%E7%90%86.html","title":"ELK日志格式处理","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"11-ELK日志系统/01-elasticsearch与elk/7-ELK日志格式处理.md"}');export{o as comp,r as data};
