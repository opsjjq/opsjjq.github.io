import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(t,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="tomcat-多实例部署与负载均衡" tabindex="-1"><a class="header-anchor" href="#tomcat-多实例部署与负载均衡"><span>Tomcat 多实例部署与负载均衡</span></a></h1><hr><h2 id="一、tomcat-实例概念解析" tabindex="-1"><a class="header-anchor" href="#一、tomcat-实例概念解析"><span>一、Tomcat 实例概念解析</span></a></h2><h3 id="_1-1-单实例-vs-多实例" tabindex="-1"><a class="header-anchor" href="#_1-1-单实例-vs-多实例"><span>1.1 单实例 vs 多实例</span></a></h3><p><strong>单实例</strong>：</p><ul><li>一个完整的 Tomcat 软件（二进制+数据目录）运行一个或多个应用</li><li>通过不同的端口或虚拟目录区分不同应用</li></ul><p><strong>多实例</strong>：</p><ul><li>多个独立的 Tomcat 软件实例运行在同一台服务器上</li><li>每个实例有独立的数据目录和配置文件</li><li>可以实现资源隔离、版本升级等需求</li></ul><h3 id="_1-2-实例部署模式" tabindex="-1"><a class="header-anchor" href="#_1-2-实例部署模式"><span>1.2 实例部署模式</span></a></h3><table><thead><tr><th style="text-align:left;">模式</th><th style="text-align:left;">描述</th><th style="text-align:left;">适用场景</th></tr></thead><tbody><tr><td style="text-align:left;">单实例单应用</td><td style="text-align:left;">一个 Tomcat 运行一个应用</td><td style="text-align:left;">简单项目部署</td></tr><tr><td style="text-align:left;">单实例多应用</td><td style="text-align:left;">一个 Tomcat 运行多个应用</td><td style="text-align:left;">测试环境，资源共享</td></tr><tr><td style="text-align:left;">多实例单应用</td><td style="text-align:left;">多个 Tomcat 运行同一个应用</td><td style="text-align:left;">负载均衡、高可用</td></tr><tr><td style="text-align:left;">多实例多应用</td><td style="text-align:left;">多个 Tomcat 运行不同应用</td><td style="text-align:left;">生产环境，资源隔离</td></tr></tbody></table><hr><h2 id="二、tomcat-多实例部署实践" tabindex="-1"><a class="header-anchor" href="#二、tomcat-多实例部署实践"><span>二、Tomcat 多实例部署实践</span></a></h2><h3 id="_2-1-传统多实例部署" tabindex="-1"><a class="header-anchor" href="#_2-1-传统多实例部署"><span>2.1 传统多实例部署</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 复制多个 Tomcat 目录</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-r</span> /opt/apache-tomcat-8.0.27 /opt/tomcat-instance1</span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-r</span> /opt/apache-tomcat-8.0.27 /opt/tomcat-instance2</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 修改各实例端口（避免冲突）</span></span>
<span class="line"><span class="token comment"># 实例1：8081, 8006, 8010</span></span>
<span class="line"><span class="token comment"># 实例2：8082, 8007, 8011</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改 server.xml</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8080/8081/g&#39;</span> /opt/tomcat-instance1/conf/server.xml</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8005/8006/g&#39;</span> /opt/tomcat-instance1/conf/server.xml</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8009/8010/g&#39;</span> /opt/tomcat-instance1/conf/server.xml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 分别启动实例</span></span>
<span class="line">/opt/tomcat-instance1/bin/startup.sh</span>
<span class="line">/opt/tomcat-instance2/bin/startup.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-新式多实例部署-推荐" tabindex="-1"><a class="header-anchor" href="#_2-2-新式多实例部署-推荐"><span>2.2 新式多实例部署（推荐）</span></a></h3><p><strong>架构优势</strong>：</p><ul><li>二进制文件与数据目录分离</li><li>便于版本升级和维护</li><li>资源分配更灵活</li></ul><h4 id="_2-2-1-部署步骤" tabindex="-1"><a class="header-anchor" href="#_2-2-1-部署步骤"><span>2.2.1 部署步骤</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 创建数据目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /<span class="token punctuation">{</span>tomcat1,tomcat2<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 移动原始数据目录到实例1</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/tomcat8027</span>
<span class="line"><span class="token function">mv</span> conf/ logs/ temp/ work/ webapps/ <span class="token parameter variable">-t</span> /tomcat1/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 复制实例1配置到实例2</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-ra</span> /tomcat1/* /tomcat2/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 查看最终目录结构</span></span>
<span class="line"><span class="token function">ls</span> /opt/tomcat8027/  <span class="token comment"># 只保留 bin、lib 等二进制文件</span></span>
<span class="line"><span class="token function">ls</span> /tomcat1/         <span class="token comment"># 实例1数据目录</span></span>
<span class="line"><span class="token function">ls</span> /tomcat2/         <span class="token comment"># 实例2数据目录</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-2-配置文件修改" tabindex="-1"><a class="header-anchor" href="#_2-2-2-配置文件修改"><span>2.2.2 配置文件修改</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 修改实例1端口</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8005/8100/g&#39;</span> /tomcat1/conf/server.xml</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8080/8101/g&#39;</span> /tomcat1/conf/server.xml</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8009/8102/g&#39;</span> /tomcat1/conf/server.xml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改实例2端口</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8005/8200/g&#39;</span> /tomcat2/conf/server.xml</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8080/8201/g&#39;</span> /tomcat2/conf/server.xml</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/8009/8202/g&#39;</span> /tomcat2/conf/server.xml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证配置</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;8100|8101&#39;</span> /tomcat1/conf/server.xml</span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;8200|8201&#39;</span> /tomcat2/conf/server.xml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-3-创建管理脚本" tabindex="-1"><a class="header-anchor" href="#_2-2-3-创建管理脚本"><span>2.2.3 创建管理脚本</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建脚本目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /tomcat-sh/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动脚本</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /tomcat-sh/start_tomcat.sh <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line">export CATALINA_HOME=/opt/tomcat8027/</span>
<span class="line">export CATALINA_BASE=\${1%/}</span>
<span class="line"></span>
<span class="line">TOMCAT_ID=$(ps aux | grep &quot;java&quot; | grep &quot;Dcatalina.base=$CATALINA_BASE &quot; | grep -v &quot;grep&quot; | awk &#39;{print $2}&#39;)</span>
<span class="line"></span>
<span class="line">if [ -n &quot;$TOMCAT_ID&quot; ]; then</span>
<span class="line">    echo &quot;tomcat(\${TOMCAT_ID}) still running now, please shutdown it first&quot;</span>
<span class="line">    exit 2</span>
<span class="line">fi</span>
<span class="line"></span>
<span class="line">TOMCAT_START_LOG=$($CATALINA_HOME/bin/startup.sh 2&gt;&amp;1)</span>
<span class="line"></span>
<span class="line">if [ &quot;$?&quot; = &quot;0&quot; ]; then</span>
<span class="line">    echo &quot;$0 $1 start succeed&quot;</span>
<span class="line">else</span>
<span class="line">    echo &quot;$0 \${1%/} start failed&quot;</span>
<span class="line">    echo &quot;$TOMCAT_START_LOG&quot;</span>
<span class="line">fi</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止脚本</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /tomcat-sh/stop_tomcat.sh <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line">export CATALINA_HOME=/opt/tomcat8027/</span>
<span class="line">export CATALINA_BASE=\${1%/}</span>
<span class="line"></span>
<span class="line">$CATALINA_HOME/bin/shutdown.sh</span>
<span class="line">sleep 3</span>
<span class="line"></span>
<span class="line">TOMCAT_ID=$(ps aux | grep &quot;java&quot; | grep &quot;Dcatalina.base=$CATALINA_BASE &quot; | grep -v &quot;grep&quot; | awk &#39;{print $2}&#39;)</span>
<span class="line">if [ -n &quot;$TOMCAT_ID&quot; ]; then</span>
<span class="line">    kill -9 $TOMCAT_ID</span>
<span class="line">    echo &quot;Force killed tomcat(\${TOMCAT_ID})&quot;</span>
<span class="line">fi</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">chmod</span> +x /tomcat-sh/*.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-4-启动多实例" tabindex="-1"><a class="header-anchor" href="#_2-2-4-启动多实例"><span>2.2.4 启动多实例</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 启动实例1</span></span>
<span class="line"><span class="token function">bash</span> /tomcat-sh/start_tomcat.sh /tomcat1/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动实例2</span></span>
<span class="line"><span class="token function">bash</span> /tomcat-sh/start_tomcat.sh /tomcat2/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查端口</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">java</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-5-验证访问" tabindex="-1"><a class="header-anchor" href="#_2-2-5-验证访问"><span>2.2.5 验证访问</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 访问实例1</span></span>
<span class="line"><span class="token function">curl</span> http://10.0.0.10:8101/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 访问实例2</span></span>
<span class="line"><span class="token function">curl</span> http://10.0.0.10:8201/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、nginx-tomcat-负载均衡" tabindex="-1"><a class="header-anchor" href="#三、nginx-tomcat-负载均衡"><span>三、Nginx + Tomcat 负载均衡</span></a></h2><h3 id="_3-1-nginx-负载均衡配置" tabindex="-1"><a class="header-anchor" href="#_3-1-nginx-负载均衡配置"><span>3.1 Nginx 负载均衡配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token comment"># /etc/nginx/conf.d/tomcat-lb.conf</span></span>
<span class="line"><span class="token directive"><span class="token keyword">upstream</span> tomcat_cluster</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment"># 负载均衡算法（默认轮询）</span></span>
<span class="line">    <span class="token comment"># ip_hash;</span></span>
<span class="line">    <span class="token comment"># least_conn;</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">server</span> 10.0.0.10:8101 weight=1 max_fails=3 fail_timeout=30s</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server</span> 10.0.0.10:8201 weight=1 max_fails=3 fail_timeout=30s</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server_name</span> your-domain.com</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">access_log</span> /var/log/nginx/tomcat-access.log main</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">error_log</span> /var/log/nginx/tomcat-error.log</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://tomcat_cluster</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-Proto <span class="token variable">$scheme</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_connect_timeout</span> <span class="token number">30s</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_read_timeout</span> <span class="token number">60s</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_send_timeout</span> <span class="token number">60s</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_buffering</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_buffer_size</span> <span class="token number">4k</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_buffers</span> <span class="token number">8</span> <span class="token number">4k</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_busy_buffers_size</span> <span class="token number">8k</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> ~* \\.(jpg|jpeg|png|gif|ico|css|js|html|txt)$</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">expires</span> <span class="token number">30d</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">add_header</span> Cache-Control <span class="token string">&quot;public, immutable&quot;</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /nginx_status</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">stub_status</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">access_log</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">allow</span> 127.0.0.1</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">allow</span> 10.0.0.0/24</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">deny</span> all</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-测试负载均衡" tabindex="-1"><a class="header-anchor" href="#_3-2-测试负载均衡"><span>3.2 测试负载均衡</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 测试Nginx配置</span></span>
<span class="line">nginx <span class="token parameter variable">-t</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 重载Nginx配置</span></span>
<span class="line">nginx <span class="token parameter variable">-s</span> reload</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 测试负载均衡效果</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> <span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">..</span><span class="token number">10</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">    <span class="token function">curl</span> <span class="token parameter variable">-s</span> http://your-domain.com/ <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-o</span> <span class="token string">&quot;端口：[0-9]\\+&quot;</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 查看Nginx访问日志</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /var/log/nginx/tomcat-access.log</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-会话保持配置" tabindex="-1"><a class="header-anchor" href="#_3-3-会话保持配置"><span>3.3 会话保持配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token directive"><span class="token keyword">upstream</span> tomcat_cluster</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">ip_hash</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server</span> 10.0.0.10:8101</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server</span> 10.0.0.10:8201</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、zabbix-监控-tomcat" tabindex="-1"><a class="header-anchor" href="#四、zabbix-监控-tomcat"><span>四、Zabbix 监控 Tomcat</span></a></h2><h3 id="_4-1-tomcat-jmx-配置" tabindex="-1"><a class="header-anchor" href="#_4-1-tomcat-jmx-配置"><span>4.1 Tomcat JMX 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 修改 Tomcat 启动脚本</span></span>
<span class="line"><span class="token function">vim</span> /opt/tomcat8027/bin/catalina.sh</span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">CATALINA_OPTS</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$CATALINA_OPTS</span></span>
<span class="line">-Dcom.sun.management.jmxremote</span>
<span class="line">-Djava.rmi.server.hostname=10.0.0.10</span>
<span class="line">-Dcom.sun.management.jmxremote.port=12345</span>
<span class="line">-Dcom.sun.management.jmxremote.ssl=false</span>
<span class="line">-Dcom.sun.management.jmxremote.authenticate=false&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-1-2-重启-tomcat-并验证" tabindex="-1"><a class="header-anchor" href="#_4-1-2-重启-tomcat-并验证"><span>4.1.2 重启 Tomcat 并验证</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 重启实例1（配置了JMX）</span></span>
<span class="line"><span class="token function">bash</span> /tomcat-sh/stop_tomcat.sh /tomcat1/</span>
<span class="line"><span class="token function">bash</span> /tomcat-sh/start_tomcat.sh /tomcat1/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证JMX端口</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">12345</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 jps 查看Java进程</span></span>
<span class="line">jps <span class="token parameter variable">-lvm</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-zabbix-server-配置" tabindex="-1"><a class="header-anchor" href="#_4-2-zabbix-server-配置"><span>4.2 Zabbix Server 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装 Java Gateway</span></span>
<span class="line">yum <span class="token function">install</span> zabbix-java-gateway <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置 Java Gateway</span></span>
<span class="line"><span class="token function">vim</span> /etc/zabbix/zabbix_java_gateway.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置 Zabbix Server</span></span>
<span class="line"><span class="token function">vim</span> /etc/zabbix/zabbix_server.conf</span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">JavaGateway</span><span class="token operator">=</span><span class="token number">127.0</span>.0.1</span>
<span class="line"><span class="token assign-left variable">JavaGatewayPort</span><span class="token operator">=</span><span class="token number">10052</span></span>
<span class="line"><span class="token assign-left variable">StartJavaPollers</span><span class="token operator">=</span><span class="token number">5</span></span>
<span class="line"></span>
<span class="line">systemctl start zabbix-java-gateway</span>
<span class="line">systemctl restart zabbix-server</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-zabbix-web-界面配置" tabindex="-1"><a class="header-anchor" href="#_4-3-zabbix-web-界面配置"><span>4.3 Zabbix Web 界面配置</span></a></h3><p><strong>添加主机</strong>：</p><ul><li>主机名称：tomcat-10</li><li>群组：Linux servers / Tomcat servers</li><li>JMX接口：10.0.0.10，端口 12345</li></ul><p><strong>关联模板</strong>：</p><ul><li>Template App Apache Tomcat JMX</li><li>Template App Generic Java JMX</li></ul><p><strong>宏配置</strong>：</p><table><thead><tr><th style="text-align:left;">宏</th><th style="text-align:left;">值</th></tr></thead><tbody><tr><td style="text-align:left;">{$JMX.PORT}</td><td style="text-align:left;">12345</td></tr><tr><td style="text-align:left;">{$JMX.USER}</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">{$JMX.PASSWORD}</td><td style="text-align:left;"></td></tr></tbody></table><h3 id="_4-4-手动测试-jmx-连接" tabindex="-1"><a class="header-anchor" href="#_4-4-手动测试-jmx-连接"><span>4.4 手动测试 JMX 连接</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 下载 JMX 客户端</span></span>
<span class="line"><span class="token function">wget</span> http://crawler.archive.org/cmdline-jmxclient/cmdline-jmxclient-0.10.3.jar</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试连接</span></span>
<span class="line"><span class="token function">java</span> <span class="token parameter variable">-jar</span> cmdline-jmxclient-0.10.3.jar - <span class="token number">10.0</span>.0.10:12345 java.lang:type<span class="token operator">=</span>Memory HeapMemoryUsage</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-5-监控项说明" tabindex="-1"><a class="header-anchor" href="#_4-5-监控项说明"><span>4.5 监控项说明</span></a></h3><p><strong>JVM 指标</strong>：</p><ul><li>堆内存使用率</li><li>非堆内存使用率</li><li>垃圾回收统计</li><li>线程数</li></ul><p><strong>Tomcat 指标</strong>：</p><ul><li>请求处理统计</li><li>会话数</li><li>线程池状态</li><li>缓存命中率</li></ul><hr><h2 id="五、最佳实践与优化" tabindex="-1"><a class="header-anchor" href="#五、最佳实践与优化"><span>五、最佳实践与优化</span></a></h2><h3 id="_5-1-安全建议" tabindex="-1"><a class="header-anchor" href="#_5-1-安全建议"><span>5.1 安全建议</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 启用JMX认证（生产环境必须）</span></span>
<span class="line"><span class="token parameter variable">-Dcom.sun.management.jmxremote.authenticate</span><span class="token operator">=</span>true</span>
<span class="line"><span class="token parameter variable">-Dcom.sun.management.jmxremote.password.file</span><span class="token operator">=</span>/path/to/jmxremote.password</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 配置防火墙</span></span>
<span class="line">firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">8101</span>/tcp</span>
<span class="line">firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">8201</span>/tcp</span>
<span class="line">firewall-cmd <span class="token parameter variable">--reload</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 限制访问IP</span></span>
<span class="line"><span class="token operator">&lt;</span>Valve <span class="token assign-left variable">className</span><span class="token operator">=</span><span class="token string">&quot;org.apache.catalina.valves.RemoteAddrValve&quot;</span></span>
<span class="line">       <span class="token assign-left variable">allow</span><span class="token operator">=</span><span class="token string">&quot;10.0.0.0/24&quot;</span> /<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-性能优化" tabindex="-1"><a class="header-anchor" href="#_5-2-性能优化"><span>5.2 性能优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># JVM参数优化</span></span>
<span class="line"><span class="token assign-left variable">CATALINA_OPTS</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$CATALINA_OPTS</span></span>
<span class="line">-Xms1024m</span>
<span class="line">-Xmx2048m</span>
<span class="line">-XX:PermSize=256m</span>
<span class="line">-XX:MaxPermSize=512m</span>
<span class="line">-XX:+UseConcMarkSweepGC</span>
<span class="line">-XX:+CMSParallelRemarkEnabled</span>
<span class="line">-XX:+UseCMSInitiatingOccupancyOnly</span>
<span class="line">-XX:CMSInitiatingOccupancyFraction=70&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Tomcat连接器优化</span></span>
<span class="line"><span class="token operator">&lt;</span>Connector <span class="token assign-left variable">port</span><span class="token operator">=</span><span class="token string">&quot;8080&quot;</span> <span class="token assign-left variable">protocol</span><span class="token operator">=</span><span class="token string">&quot;org.apache.coyote.http11.Http11NioProtocol&quot;</span></span>
<span class="line">           <span class="token assign-left variable">maxThreads</span><span class="token operator">=</span><span class="token string">&quot;200&quot;</span></span>
<span class="line">           <span class="token assign-left variable">minSpareThreads</span><span class="token operator">=</span><span class="token string">&quot;10&quot;</span></span>
<span class="line">           <span class="token assign-left variable">acceptCount</span><span class="token operator">=</span><span class="token string">&quot;100&quot;</span></span>
<span class="line">           <span class="token assign-left variable">maxConnections</span><span class="token operator">=</span><span class="token string">&quot;10000&quot;</span></span>
<span class="line">           <span class="token assign-left variable">connectionTimeout</span><span class="token operator">=</span><span class="token string">&quot;20000&quot;</span> /<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-监控告警配置" tabindex="-1"><a class="header-anchor" href="#_5-3-监控告警配置"><span>5.3 监控告警配置</span></a></h3><p><strong>内存使用率过高</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">{Template App Generic Java JMX:jmx[&quot;java.lang:type=Memory&quot;,HeapMemoryUsage.used].last()}/{Template App Generic Java JMX:jmx[&quot;java.lang:type=Memory&quot;,HeapMemoryUsage.max].last()}&gt;0.8</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>线程数异常</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">{Template App Generic Java JMX:jmx[&quot;java.lang:type=Threading&quot;,ThreadCount].last()}&gt;500</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>请求处理错误</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">{Template App Apache Tomcat JMX:jmx[&quot;Catalina:type=GlobalRequestProcessor,name=\\&quot;http-nio-8080\\&quot;&quot;,errorCount].last()}&gt;10</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h2 id="六、故障排查" tabindex="-1"><a class="header-anchor" href="#六、故障排查"><span>六、故障排查</span></a></h2><h3 id="_6-1-常见问题" tabindex="-1"><a class="header-anchor" href="#_6-1-常见问题"><span>6.1 常见问题</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 端口冲突</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> :8080</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 内存不足</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /tomcat1/logs/catalina.out</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. JMX连接失败</span></span>
<span class="line">firewall-cmd --list-all</span>
<span class="line">getenforce</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. Nginx代理失败</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /var/log/nginx/error.log</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-日志分析" tabindex="-1"><a class="header-anchor" href="#_6-2-日志分析"><span>6.2 日志分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 实时查看Tomcat日志</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /tomcat1/logs/catalina.out</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看访问日志</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /tomcat1/logs/localhost_access_log.*.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 分析错误日志</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;error\\|exception&quot;</span> /tomcat1/logs/catalina.out</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、总结" tabindex="-1"><a class="header-anchor" href="#七、总结"><span>七、总结</span></a></h2><p>通过 Tomcat 多实例部署，可以实现：</p><ol><li><strong>资源隔离</strong>：不同应用互不影响</li><li><strong>版本管理</strong>：独立升级和维护</li><li><strong>负载均衡</strong>：提高应用可用性和性能</li><li><strong>监控管理</strong>：精细化监控每个实例</li></ol><p><strong>关键点</strong>：</p><ul><li>理解 CATALINA_HOME 和 CATALINA_BASE 的区别</li><li>掌握多实例的启动脚本编写</li><li>配置 Nginx 实现负载均衡和动静分离</li><li>使用 Zabbix 监控 Tomcat 的 JMX 指标</li></ul>`,82)])])}const r=n(i,[["render",p]]),o=JSON.parse('{"path":"/09-%E4%B8%AD%E9%97%B4%E4%BB%B6/01-tomcat%E4%B8%AD%E9%97%B4%E4%BB%B6/tomcat%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1.html","title":"Tomcat 多实例部署与负载均衡","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"09-中间件/01-tomcat中间件/tomcat负载均衡.md"}');export{r as comp,o as data};
