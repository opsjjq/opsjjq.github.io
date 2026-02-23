import{_ as a,c as n,e,o as i}from"./app-DtXLoKBz.js";const l="/assets/image-20260205003609613-CNiWQQGX.png",p="/assets/image-20260205004041201-BOhHkLkD.png",c="/assets/image-20260205010741459-CvQHZiqo.png",t="/assets/image-20260205010205857-BCPxVOGt.png",r="/assets/image-20260205010858593-De6pI6V-.png",d={};function o(u,s){return i(),n("div",null,[...s[0]||(s[0]=[e(`<h2 id="一、es-官方快照备份恢复" tabindex="-1"><a class="header-anchor" href="#一、es-官方快照备份恢复"><span>一、ES 官方快照备份恢复</span></a></h2><h3 id="_1-环境要求与准备" tabindex="-1"><a class="header-anchor" href="#_1-环境要求与准备"><span>1. 环境要求与准备</span></a></h3><h4 id="nfs-服务端配置" tabindex="-1"><a class="header-anchor" href="#nfs-服务端配置"><span>NFS 服务端配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装NFS</span></span>
<span class="line">yum <span class="token function">install</span> nfs-utils <span class="token parameter variable">-y</span></span>
<span class="line"><span class="token comment"># 创建ES用户（与ES节点用户一致）</span></span>
<span class="line"><span class="token function">groupadd</span> elasticsearch <span class="token parameter variable">-g</span> <span class="token number">996</span></span>
<span class="line"><span class="token function">useradd</span> elasticsearch <span class="token parameter variable">-g</span> <span class="token number">996</span> <span class="token parameter variable">-u</span> <span class="token number">998</span> <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /sbin/nologin</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置NFS共享</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;/es-data 10.0.0.0/24(rw,sync,all_squash,anonuid=998,anongid=996)&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/exports</span>
<span class="line"><span class="token comment"># 创建目录并授权</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /es-data</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> elasticsearch.elasticsearch /es-data/</span>
<span class="line"><span class="token comment"># 重启NFS服务</span></span>
<span class="line">systemctl restart nfs</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="es-客户端节点配置" tabindex="-1"><a class="header-anchor" href="#es-客户端节点配置"><span>ES 客户端节点配置</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 安装NFS客户端</span>
<span class="line">yum install nfs-utils -y</span>
<span class="line">mkdir /es-client-data -p</span>
<span class="line">mount -t nfs 10.0.0.31:/es-data /es-client-data</span>
<span class="line"></span>
<span class="line"># 检查挂载</span>
<span class="line">df -h | grep es-client-data</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="修改es配置文件" tabindex="-1"><a class="header-anchor" href="#修改es配置文件"><span>修改ES配置文件</span></a></h4><p>所有节点</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;path.repo: /es-client-data/&#39;</span><span class="token operator">&gt;&gt;</span> /etc/elasticsearch/elasticsearch.yml</span>
<span class="line"><span class="token comment"># 重启ES服务</span></span>
<span class="line">systemctl restart elasticsearch.service</span>
<span class="line"><span class="token comment"># 检查集群节点情况</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token string">&quot;10.0.0.90:9200/_cat/nodes?v&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-快照备份操作流程" tabindex="-1"><a class="header-anchor" href="#_2-快照备份操作流程"><span>2. 快照备份操作流程</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">https://www.elastic.co/guide/en/elasticsearch/reference/7.9/snapshot-restore.html</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="注册快照仓库" tabindex="-1"><a class="header-anchor" href="#注册快照仓库"><span>注册快照仓库</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">PUT /_snapshot/my_backup</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;type&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;fs&quot;</span>,</span>
<span class="line">  <span class="token string">&quot;settings&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token string">&quot;location&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;/es-client-data/my_backup_location&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;compress&quot;</span><span class="token builtin class-name">:</span> <span class="token boolean">true</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查询仓库信息" tabindex="-1"><a class="header-anchor" href="#查询仓库信息"><span>查询仓库信息</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">GET /_snapshot/my_backup</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="创建全量快照" tabindex="-1"><a class="header-anchor" href="#创建全量快照"><span>创建全量快照</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">PUT /_snapshot/my_backup/snapshot_1?wait_for_completion=true</span>
<span class="line"></span>
<span class="line"># 异步方式（推荐用于大快照）</span>
<span class="line">PUT /_snapshot/my_backup/snapshot_1</span>
<span class="line">{</span>
<span class="line">  &quot;indices&quot;: &quot;index_1,index_2&quot;,</span>
<span class="line">  &quot;ignore_unavailable&quot;: true,</span>
<span class="line">  &quot;include_global_state&quot;: false</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建指定索引快照" tabindex="-1"><a class="header-anchor" href="#创建指定索引快照"><span>创建指定索引快照</span></a></h4><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line">PUT /_snapshot/my_backup/snapshot_2?wait_for_completion=<span class="token boolean">true</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;indices&quot;</span><span class="token operator">:</span> <span class="token string">&quot;t1,t2&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;ignore_unavailable&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;include_global_state&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>&quot;ignore_unavailable&quot;: true, // 忽略不存在的索引</p><p>&quot;include_global_state&quot;: false 的影响： 快照文件更小 恢复时不会覆盖目标集群的现有全局设置 更适合跨集群迁移，避免设置冲突 注意： 恢复快照时，需要手动在目标集群中创建相同的索引模板、ILM策略等 某些依赖集群设置的索引可能无法正常工作</p><h4 id="查看快照信息" tabindex="-1"><a class="header-anchor" href="#查看快照信息"><span>查看快照信息</span></a></h4><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"># 查看所有仓库</span>
<span class="line">GET /_snapshot</span>
<span class="line"></span>
<span class="line"># 查看指定仓库</span>
<span class="line">GET /_snapshot/my_backup/</span>
<span class="line"></span>
<span class="line"># 查看指定快照</span>
<span class="line">GET /_snapshot/my_backup/snapshot_1</span>
<span class="line">GET /_snapshot/my_backup/snapshot_2</span>
<span class="line"></span>
<span class="line"># 查看正在创建过程中的快照</span>
<span class="line">GET /_snapshot/my_backup/_current</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-恢复操作" tabindex="-1"><a class="header-anchor" href="#_3-恢复操作"><span>3. 恢复操作</span></a></h3><h4 id="恢复整个快照" tabindex="-1"><a class="header-anchor" href="#恢复整个快照"><span>恢复整个快照</span></a></h4><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line">delete</span>
<span class="line"><span class="token comment">//  GET /_cat/indices?v&amp;h=index,status,health,docs.count,store.size</span></span>
<span class="line">POST /_snapshot/my_backup/snapshot_2/_restore</span>
<span class="line"><span class="token comment">//  GET /_cat/indices?v&amp;h=index,status,health,docs.count,store.size</span></span>
<span class="line">Elasticsearch 快照恢复的默认行为：</span>
<span class="line">不允许覆盖已存在的索引</span>
<span class="line">不允许恢复到一个已有同名索引的集群</span>
<span class="line">需要保证目标索引不存在或已关闭</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="恢复指定索引-可重命名" tabindex="-1"><a class="header-anchor" href="#恢复指定索引-可重命名"><span>恢复指定索引（可重命名）</span></a></h4><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line">POST /_snapshot/my_backup/snapshot_2/_restore</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;indices&quot;</span><span class="token operator">:</span> <span class="token string">&quot;t2&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;ignore_unavailable&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;include_global_state&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>              </span>
<span class="line">  <span class="token property">&quot;rename_pattern&quot;</span><span class="token operator">:</span> <span class="token string">&quot;t(.+)&quot;</span><span class="token punctuation">,</span>             </span>
<span class="line">  <span class="token property">&quot;rename_replacement&quot;</span><span class="token operator">:</span> <span class="token string">&quot;restored_index_$1&quot;</span><span class="token punctuation">,</span>  </span>
<span class="line">  <span class="token property">&quot;include_aliases&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="按日期命名快照" tabindex="-1"><a class="header-anchor" href="#按日期命名快照"><span>按日期命名快照</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">PUT /_snapshot/my_backup/%3Csnapshot-%7Bnow%2Fd%7D%3E</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="二、第三方备份工具-elasticdump" tabindex="-1"><a class="header-anchor" href="#二、第三方备份工具-elasticdump"><span>二、第三方备份工具 elasticdump</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token number">1</span>.安装node环境，基于nodejs开发的备份工具</span>
<span class="line"><span class="token comment"># 注意node版本要求 </span></span>
<span class="line"><span class="token number">2</span>.软件官网</span>
<span class="line">https://www.npmjs.com/package/elasticdump</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-安装-node-js-环境" tabindex="-1"><a class="header-anchor" href="#_1-安装-node-js-环境"><span>1. 安装 Node.js 环境</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"><span class="token function">wget</span> https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-x64.tar.xz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> node-v10.16.3-linux-x64.tar.xz</span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> node-v10.16.3-linux-x64/ <span class="token function">node</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=/opt/node/bin:$PATH&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置npm源</span></span>
<span class="line"><span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry http://mirrors.cloud.tencent.com/npm/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装elasticdump</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> elasticdump <span class="token parameter variable">-g</span></span>
<span class="line"><span class="token comment"># 查看版本</span></span>
<span class="line">elasticdump <span class="token parameter variable">--version</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-备份操作" tabindex="-1"><a class="header-anchor" href="#_2-备份操作"><span>2. 备份操作</span></a></h3><h4 id="备份单个索引" tabindex="-1"><a class="header-anchor" href="#备份单个索引"><span>备份单个索引</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">elasticdump <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">--input</span><span class="token operator">=</span>http://10.0.0.90:9200/t1 <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">--output</span><span class="token operator">=</span>/es-client-data/t1.json <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">--type</span><span class="token operator">=</span>data</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> /es-client-data/t1.json</span>
<span class="line"><span class="token comment"># {&quot;_index&quot;:&quot;t1&quot;,&quot;_type&quot;:&quot;_doc&quot;,&quot;_id&quot;:&quot;1&quot;,&quot;_score&quot;:1,&quot;_source&quot;:{&quot;name&quot;:&quot;123&quot;}}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="备份并压缩" tabindex="-1"><a class="header-anchor" href="#备份并压缩"><span>备份并压缩</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">elasticdump \\</span>
<span class="line">--input=http://10.0.0.90:9200/t2 \\</span>
<span class="line">--output=$ \\</span>
<span class="line">| gzip &gt; /es-client-data/t2.json.gz</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-恢复操作-1" tabindex="-1"><a class="header-anchor" href="#_3-恢复操作-1"><span>3. 恢复操作</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">elasticdump \\</span>
<span class="line">--input=/es-client-data/t1.json \\</span>
<span class="line">--output=http://10.0.0.90:9200/t1</span>
<span class="line"></span>
<span class="line">索引不存在：会自动创建索引（使用动态映射）</span>
<span class="line">索引已存在：会直接写入数据（追加或覆盖）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-批量备份脚本" tabindex="-1"><a class="header-anchor" href="#_4-批量备份脚本"><span>4. 批量备份脚本</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">cat &gt;dump1.sh&lt;&lt;&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line">indexs=$(curl -s 10.0.0.90:9200/_cat/indices | awk &#39;{print $3}&#39; | grep -v &#39;^\\.&#39;)</span>
<span class="line"></span>
<span class="line">for i in $indexs</span>
<span class="line">do</span>
<span class="line">    elasticdump \\</span>
<span class="line">    --input=http://10.0.0.90:9200/\${i} \\</span>
<span class="line">    --output=/es-client-data/\${i}.json \\</span>
<span class="line">    --type=data</span>
<span class="line">done</span>
<span class="line">EOF</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-带密码认证的备份" tabindex="-1"><a class="header-anchor" href="#_5-带密码认证的备份"><span>5. 带密码认证的备份</span></a></h3><p>es有密码时，备份命令</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">elasticdump \\</span>
<span class="line">--input=http://name:password@10.0.0.90:9200/t2 \\</span>
<span class="line">--output=/es-client-data/t1.json \\</span>
<span class="line">--type=data</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、es-安全认证配置" tabindex="-1"><a class="header-anchor" href="#三、es-安全认证配置"><span>三、ES 安全认证配置</span></a></h2><h3 id="_1-创建证书" tabindex="-1"><a class="header-anchor" href="#_1-创建证书"><span>1. 创建证书</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 创建CA证书</span>
<span class="line">/usr/share/elasticsearch/bin/elasticsearch-certutil ca</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"># 创建节点证书</span>
<span class="line">/usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12</span>
<span class="line"></span>
<span class="line"># 同步证书到所有节点</span>
<span class="line">mkdir -p /etc/elasticsearch/certs</span>
<span class="line">cp /usr/share/elasticsearch/elastic-certificates.p12 /usr/share/elasticsearch/elastic-stack-ca.p12 /etc/elasticsearch/certs/</span>
<span class="line"></span>
<span class="line">scp -r /etc/elasticsearch/certs root@10.0.0.91:/etc/elasticsearch/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-配置es安全功能" tabindex="-1"><a class="header-anchor" href="#_2-配置es安全功能"><span>2. 配置ES安全功能</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 在elasticsearch.yml中添加</span>
<span class="line">echo &#39;xpack.security.enabled: true</span>
<span class="line">xpack.security.transport.ssl.enabled: true</span>
<span class="line">xpack.security.transport.ssl.verification_mode: certificate</span>
<span class="line">xpack.security.transport.ssl.keystore.path: certs/elastic-stack-ca.p12</span>
<span class="line">xpack.security.transport.ssl.truststore.path: certs/elastic-stack-ca.p12&#39; &gt;&gt; /etc/elasticsearch/elasticsearch.yml</span>
<span class="line"></span>
<span class="line"># 修改权限</span>
<span class="line">chown -R elasticsearch.elasticsearch /etc/elasticsearch/</span>
<span class="line">systemctl restart elasticsearch.service</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-设置内置用户密码" tabindex="-1"><a class="header-anchor" href="#_3-设置内置用户密码"><span>3. 设置内置用户密码</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">/usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>内置用户说明：</strong></p><ul><li><code>elastic</code>：超级管理员</li><li><code>kibana_system</code>：Kibana连接ES用</li><li><code>logstash_system</code>：Logstash服务用</li><li><code>beats_system</code>：Beats组件用</li><li><code>apm_system</code>：APM监控用</li></ul><h3 id="_4-配置kibana连接" tabindex="-1"><a class="header-anchor" href="#_4-配置kibana连接"><span>4. 配置Kibana连接</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># kibana.yml配置</span>
<span class="line">echo &#39;elasticsearch.username: &quot;kibana_system&quot;</span>
<span class="line">elasticsearch.password: &quot;qwe123&quot;&#39; &gt;&gt; /etc/kibana/kibana.yml</span>
<span class="line"></span>
<span class="line">systemctl restart kibana</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问登录 elastic qwe123</p><p><img src="`+l+'" alt="image-20260205003609613"></p><h3 id="_5-kibana用户与权限管理" tabindex="-1"><a class="header-anchor" href="#_5-kibana用户与权限管理"><span>5. kibana用户与权限管理</span></a></h3><h4 id="space-工作空间" tabindex="-1"><a class="header-anchor" href="#space-工作空间"><span>Space（工作空间）</span></a></h4><p><img src="'+p+'" alt="image-20260205004041201"></p><h4 id="创建role-角色" tabindex="-1"><a class="header-anchor" href="#创建role-角色"><span>创建Role（角色）</span></a></h4><p>dev角色以及对应权限</p><p><img src="'+c+`" alt="image-20260205010741459"></p><h4 id="创建用户并绑定角色" tabindex="-1"><a class="header-anchor" href="#创建用户并绑定角色"><span>创建用户并绑定角色</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">dev是刚刚创建的角色</span>
<span class="line">kibana_user是登录kibana界面的角色</span>
<span class="line"></span>
<span class="line">kibana_system作用：</span>
<span class="line">Kibana 启动时，用这个身份连接 Elasticsearch</span>
<span class="line">在 Elasticsearch 中创建 .kibana 索引</span>
<span class="line">管理 Kibana 的配置和元数据</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+t+'" alt="image-20260205010205857"></p><h4 id="效果" tabindex="-1"><a class="header-anchor" href="#效果"><span>效果</span></a></h4><p>*的index pattern也只能看到有权限的index</p><p>高权限的用户可以看到所有的index信息</p><p><img src="'+r+'" alt="image-20260205010858593"></p>',72)])])}const m=a(d,[["render",o]]),h=JSON.parse('{"path":"/11-ELK%E6%97%A5%E5%BF%97%E7%B3%BB%E7%BB%9F/01-elasticsearch%E4%B8%8Eelk/5-ES%E5%A4%87%E4%BB%BD.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"11-ELK日志系统/01-elasticsearch与elk/5-ES备份.md"}');export{m as comp,h as data};
