import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i="/assets/image-20260201010249833-BU0ccE8q.png",c="/assets/image-20260201010619312-c1cT0yvd.png",p="/assets/image-20260201010624282-DPfSypA4.png",t={};function r(d,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="es集群内两节点机器部署" tabindex="-1"><a class="header-anchor" href="#es集群内两节点机器部署"><span>ES集群内两节点机器部署</span></a></h1><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 准备2个es节点</span></span>
<span class="line"><span class="token comment"># es90 10.0.0.90   master</span></span>
<span class="line"><span class="token comment"># es91 10.0.0.91</span></span>
<span class="line"></span>
<span class="line"><span class="token number">1</span>. 安装ES</span>
<span class="line"><span class="token punctuation">[</span>root@es90 ~<span class="token punctuation">]</span><span class="token comment">#ls /opt/</span></span>
<span class="line">all-db.sql  elasticsearch-7.9.1-x86_64.rpm  kibana-7.9.1-x86_64.rpm</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token number">2</span>. <span class="token comment"># 修改内存相关参数</span></span>
<span class="line"><span class="token function">vim</span> /usr/lib/systemd/system/elasticsearch.service</span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">LimitMEMLOCK</span><span class="token operator">=</span>infinity</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token number">3</span>.如果是两个新的es节点 修改配置文件如下</span>
<span class="line"><span class="token comment"># es90</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/elasticsearch/elasticsearch.yml <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">cluster.name: es1</span>
<span class="line">node.name: es90</span>
<span class="line">path.data: /var/lib/elasticsearch/</span>
<span class="line">path.logs: /var/log/elasticsearch/</span>
<span class="line">bootstrap.memory_lock: true</span>
<span class="line">network.host: 127.0.0.1,10.0.0.90 </span>
<span class="line">http.port: 9200</span>
<span class="line">discovery.seed_hosts: [&quot;10.0.0.90&quot;,&quot;10.0.0.91&quot;]</span>
<span class="line">cluster.initial_master_nodes: [&quot;es90&quot;]</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># es91</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/elasticsearch/elasticsearch.yml <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">cluster.name: es1</span>
<span class="line">node.name: es91</span>
<span class="line">path.data: /var/lib/elasticsearch/</span>
<span class="line">path.logs: /var/log/elasticsearch/</span>
<span class="line">bootstrap.memory_lock: true</span>
<span class="line">network.host: 127.0.0.1,10.0.0.91</span>
<span class="line">http.port: 9200</span>
<span class="line">discovery.seed_hosts: [&quot;10.0.0.90&quot;,&quot;10.0.0.91&quot;]</span>
<span class="line">cluster.initial_master_nodes: [&quot;es90&quot;]</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token number">4</span>. es90节点已有数据</span>
<span class="line"><span class="token comment"># es90</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/elasticsearch/elasticsearch.yml <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">cluster.name: es1</span>
<span class="line">node.name: es90</span>
<span class="line">path.data: /var/lib/elasticsearch/</span>
<span class="line">path.logs: /var/log/elasticsearch/</span>
<span class="line">bootstrap.memory_lock: true</span>
<span class="line">network.host: 10.0.0.90  </span>
<span class="line">http.port: 9200</span>
<span class="line">discovery.seed_hosts: [&quot;10.0.0.91&quot;]</span>
<span class="line">cluster.initial_master_nodes: [&quot;es90&quot;]</span>
<span class="line">EOF</span></span>
<span class="line">systemctl restart elasticsearch</span>
<span class="line"><span class="token comment">#cluster.initial_master_nodes只有已有集群的master节点需要配置新加入的节点不能配置这个</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># es91</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/elasticsearch/elasticsearch.yml <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">cluster.name: es1</span>
<span class="line">node.name: es91</span>
<span class="line">path.data: /var/lib/elasticsearch/</span>
<span class="line">path.logs: /var/log/elasticsearch/</span>
<span class="line">bootstrap.memory_lock: true</span>
<span class="line">network.host: 10.0.0.91</span>
<span class="line">http.port: 9200</span>
<span class="line">discovery.seed_hosts: [&quot;10.0.0.90&quot;]</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4.如果要清理原有es数据</span></span>
<span class="line"><span class="token comment"># systemctl stop elasticsearch</span></span>
<span class="line"><span class="token comment"># mv /var/lib/elasticsearch/* /tmp/es/</span></span>
<span class="line"><span class="token comment"># systemctl daemon-reload</span></span>
<span class="line"><span class="token comment"># systemctl restart elasticsearch</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5.启动两个es</span></span>
<span class="line">systemctl daemon-reload </span>
<span class="line">systemctl restart elasticsearch</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> elasticsearch</span>
<span class="line"></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token string">&quot;10.0.0.90:9200/_cat/nodes?v&quot;</span></span>
<span class="line"><span class="token function">ip</span>        heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name</span>
<span class="line"><span class="token number">10.0</span>.0.90           <span class="token number">12</span>          <span class="token number">95</span>   <span class="token number">1</span>    <span class="token number">0.09</span>    <span class="token number">0.07</span>     <span class="token number">0.05</span> dilmrt    *      es90</span>
<span class="line"><span class="token number">10.0</span>.0.91           <span class="token number">10</span>          <span class="token number">81</span>  <span class="token number">66</span>    <span class="token number">1.06</span>    <span class="token number">0.37</span>     <span class="token number">0.17</span> dilmrt    -      es91</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token function">netstat</span> -tunlp<span class="token operator">|</span><span class="token function">grep</span> <span class="token number">9200</span></span>
<span class="line"><span class="token function">curl</span> <span class="token number">127.0</span>.0.1:9200</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="检查es插件" tabindex="-1"><a class="header-anchor" href="#检查es插件"><span>检查es插件</span></a></h2><p><img src="`+i+'" alt="image-20260201010249833"></p><h3 id="节点信息" tabindex="-1"><a class="header-anchor" href="#节点信息"><span>节点信息</span></a></h3><p><img src="'+c+'" alt="image-20260201010619312"></p><p><img src="'+p+`" alt="image-20260201010624282"></p><h1 id="集群维护" tabindex="-1"><a class="header-anchor" href="#集群维护"><span>集群维护</span></a></h1><h2 id="创建index" tabindex="-1"><a class="header-anchor" href="#创建index"><span>创建index</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># http://10.0.0.90:5601/app/dev_tools#/console</span></span>
<span class="line">PUT /t4</span>
<span class="line"></span>
<span class="line">put t4/_doc/1</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;name&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;1&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line">get t4/_settings</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="elk架构采用的index设置" tabindex="-1"><a class="header-anchor" href="#elk架构采用的index设置"><span>ELK架构采用的index设置</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 3分片 1副本</span></span>
<span class="line">PUT /index-name</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token string">&quot;settings&quot;</span>:<span class="token punctuation">{</span></span>
<span class="line">        <span class="token string">&quot;number_of_shards&quot;</span>:3, </span>
<span class="line">        <span class="token string">&quot;number_of_replicas&quot;</span>:1</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line">put t4/_doc/1</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;name&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;1&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="es节点故障情况" tabindex="-1"><a class="header-anchor" href="#es节点故障情况"><span>es节点故障情况</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">关闭es90</span>
<span class="line">systemctl stop elasticsearch.service </span>
<span class="line"></span>
<span class="line"></span>
<span class="line">1.es集群会在短暂的故障后，将数据切换到其他节点，确保健康，以及保障index的分片、副本数。</span>
<span class="line">2. es 7.x系列之后，要求，至少有2个节点正常，就是健康的。</span>
<span class="line">3. es数据分片颜色状态（插件观察）</span>
<span class="line">- 紫色，迁移中</span>
<span class="line">- 黄色，复制中</span>
<span class="line">- 绿色，正常</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="加入新的节点" tabindex="-1"><a class="header-anchor" href="#加入新的节点"><span>加入新的节点</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># es92 节点配置</span></span>
<span class="line"></span>
<span class="line"><span class="token function">wget</span> https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.9.1-x86_64.rpm</span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> elasticsearch-7.9.1-x86_64.rpm</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/elasticsearch/elasticsearch.yml <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">cluster.name: es1</span>
<span class="line">node.name: es92</span>
<span class="line">path.data: /var/lib/elasticsearch/</span>
<span class="line">path.logs: /var/log/elasticsearch/</span>
<span class="line">bootstrap.memory_lock: true</span>
<span class="line">network.host: 10.0.0.92</span>
<span class="line">http.port: 9200</span>
<span class="line">discovery.seed_hosts: [&quot;10.0.0.90&quot;]</span>
<span class="line">EOF</span></span>
<span class="line"><span class="token function">vim</span> /usr/lib/systemd/system/elasticsearch.service</span>
<span class="line"><span class="token comment"># [Service]</span></span>
<span class="line"><span class="token assign-left variable">LimitMEMLOCK</span><span class="token operator">=</span>infinity</span>
<span class="line"></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start elasticsearch</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> elasticsearch</span>
<span class="line"><span class="token comment"># 如果没有加入节点 es92自成集群 可执行如下</span></span>
<span class="line">systemctl stop elasticsearch</span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span>  /var/lib/elasticsearch/*</span>
<span class="line">systemctl start elasticsearch</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16)])])}const m=n(t,[["render",r]]),v=JSON.parse('{"path":"/11-ELK%E6%97%A5%E5%BF%97%E7%B3%BB%E7%BB%9F/01-elasticsearch%E4%B8%8Eelk/2-ES%E9%9B%86%E7%BE%A4.html","title":"ES集群内两节点机器部署","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"11-ELK日志系统/01-elasticsearch与elk/2-ES集群.md"}');export{m as comp,v as data};
