import{_ as s,c as a,e,o as l}from"./app-DtXLoKBz.js";const t={};function p(i,n){return l(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="kubernetes-配置文件汇总-configmap-与-secret" tabindex="-1"><a class="header-anchor" href="#kubernetes-配置文件汇总-configmap-与-secret"><span>Kubernetes 配置文件汇总（ConfigMap 与 Secret）</span></a></h1><h2 id="_1-配置管理概述" tabindex="-1"><a class="header-anchor" href="#_1-配置管理概述"><span>1. 配置管理概述</span></a></h2><h3 id="为什么需要配置管理" tabindex="-1"><a class="header-anchor" href="#为什么需要配置管理"><span>为什么需要配置管理</span></a></h3><p>Kubernetes 应用通常需要配置文件、环境变量等。直接将配置打包到镜像中会导致：</p><ol><li>配置与代码耦合，难以更新</li><li>敏感信息（密码、密钥）泄露风险</li><li>不同环境需要不同镜像</li></ol><hr><h3 id="配置管理方案" tabindex="-1"><a class="header-anchor" href="#配置管理方案"><span>配置管理方案</span></a></h3><table><thead><tr><th style="text-align:left;">方案</th><th style="text-align:left;">用途</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>ConfigMap</strong></td><td style="text-align:left;">存储非敏感配置</td></tr><tr><td style="text-align:left;"><strong>Secret</strong></td><td style="text-align:left;">存储敏感信息（密码、密钥）</td></tr><tr><td style="text-align:left;"><strong>环境变量</strong></td><td style="text-align:left;">直接传递配置</td></tr><tr><td style="text-align:left;"><strong>命令行参数</strong></td><td style="text-align:left;">动态配置</td></tr></tbody></table><hr><h2 id="_2-configmap" tabindex="-1"><a class="header-anchor" href="#_2-configmap"><span>2. ConfigMap</span></a></h2><h3 id="什么是-configmap" tabindex="-1"><a class="header-anchor" href="#什么是-configmap"><span>什么是 ConfigMap</span></a></h3><p>ConfigMap 用于存储非敏感的配置数据，如配置文件、命令行参数、环境变量等。</p><hr><h3 id="创建-configmap" tabindex="-1"><a class="header-anchor" href="#创建-configmap"><span>创建 ConfigMap</span></a></h3><h4 id="方式一-从字面值创建" tabindex="-1"><a class="header-anchor" href="#方式一-从字面值创建"><span>方式一：从字面值创建</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl create configmap nginx-config <span class="token punctuation">\\</span></span>
<span class="line">  --from-literal<span class="token operator">=</span>nginx_port<span class="token operator">=</span><span class="token number">80</span> <span class="token punctuation">\\</span></span>
<span class="line">  --from-literal<span class="token operator">=</span>server_name<span class="token operator">=</span>www.example.com</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式二-从文件创建" tabindex="-1"><a class="header-anchor" href="#方式二-从文件创建"><span>方式二：从文件创建</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建配置文件</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> nginx.conf <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">server {</span>
<span class="line">    listen 80;</span>
<span class="line">    server_name www.example.com;</span>
<span class="line"></span>
<span class="line">    location / {</span>
<span class="line">        root /usr/share/nginx/html;</span>
<span class="line">        index index.html;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从文件创建 ConfigMap</span></span>
<span class="line">kubectl create configmap nginx-conf --from-file<span class="token operator">=</span>nginx.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式三-从目录创建" tabindex="-1"><a class="header-anchor" href="#方式三-从目录创建"><span>方式三：从目录创建</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建配置目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> config</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> config/app.conf <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">app_name=myapp</span>
<span class="line">app_version=1.0.0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> config/db.conf <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">db_host=localhost</span>
<span class="line">db_port=3306</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从目录创建 ConfigMap</span></span>
<span class="line">kubectl create configmap app-config --from-file<span class="token operator">=</span>config/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式四-yaml-文件创建" tabindex="-1"><a class="header-anchor" href="#方式四-yaml-文件创建"><span>方式四：YAML 文件创建</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config</span>
<span class="line">  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> yuchaoit</span>
<span class="line"><span class="token key atrule">data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">nginx_port</span><span class="token punctuation">:</span> <span class="token string">&quot;80&quot;</span></span>
<span class="line">  <span class="token key atrule">server_name</span><span class="token punctuation">:</span> <span class="token string">&quot;www.yuchaoit.com&quot;</span></span>
<span class="line">  <span class="token key atrule">nginx.conf</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">    server {</span>
<span class="line">        listen 80;</span>
<span class="line">        server_name www.yuchaoit.com;</span></span>
<span class="line"></span>
<span class="line">        location / <span class="token punctuation">{</span></span>
<span class="line">            root /usr/share/nginx/html;</span>
<span class="line">            index index.html;</span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 ConfigMap</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> configmap-nginx.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 ConfigMap</span></span>
<span class="line">kubectl get configmap nginx-config <span class="token parameter variable">-n</span> yuchaoit</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 ConfigMap 详情</span></span>
<span class="line">kubectl describe configmap nginx-config <span class="token parameter variable">-n</span> yuchaoit</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 ConfigMap 数据</span></span>
<span class="line">kubectl get configmap nginx-config <span class="token parameter variable">-n</span> yuchaoit <span class="token parameter variable">-o</span> yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="使用-configmap" tabindex="-1"><a class="header-anchor" href="#使用-configmap"><span>使用 ConfigMap</span></a></h3><h4 id="方式一-环境变量" tabindex="-1"><a class="header-anchor" href="#方式一-环境变量"><span>方式一：环境变量</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>cm<span class="token punctuation">-</span>env</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">      <span class="token key atrule">env</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> NGINX_PORT</span>
<span class="line">          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config</span>
<span class="line">              <span class="token key atrule">key</span><span class="token punctuation">:</span> nginx_port</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SERVER_NAME</span>
<span class="line">          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config</span>
<span class="line">              <span class="token key atrule">key</span><span class="token punctuation">:</span> server_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式二-命令行参数" tabindex="-1"><a class="header-anchor" href="#方式二-命令行参数"><span>方式二：命令行参数</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>cm<span class="token punctuation">-</span>args</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">      <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-c&quot;</span><span class="token punctuation">]</span></span>
<span class="line">      <span class="token key atrule">args</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">echo &quot;Nginx Port</span><span class="token punctuation">:</span> $(NGINX_PORT)<span class="token punctuation">,</span> <span class="token key atrule">Server</span><span class="token punctuation">:</span> $(SERVER_NAME)&quot;</span>
<span class="line">      <span class="token key atrule">env</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> NGINX_PORT</span>
<span class="line">          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config</span>
<span class="line">              <span class="token key atrule">key</span><span class="token punctuation">:</span> nginx_port</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SERVER_NAME</span>
<span class="line">          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config</span>
<span class="line">              <span class="token key atrule">key</span><span class="token punctuation">:</span> server_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式三-挂载为文件" tabindex="-1"><a class="header-anchor" href="#方式三-挂载为文件"><span>方式三：挂载为文件</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>cm<span class="token punctuation">-</span>volume</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config<span class="token punctuation">-</span>volume</span>
<span class="line">      <span class="token key atrule">configMap</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config<span class="token punctuation">-</span>volume</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/nginx/conf.d</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 Pod</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> pod-cm-volume.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证配置文件</span></span>
<span class="line">kubectl <span class="token builtin class-name">exec</span> nginx-cm-volume -- <span class="token function">cat</span> /etc/nginx/conf.d/nginx_port</span>
<span class="line">kubectl <span class="token builtin class-name">exec</span> nginx-cm-volume -- <span class="token function">cat</span> /etc/nginx/conf.d/server_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式四-挂载为单个文件" tabindex="-1"><a class="header-anchor" href="#方式四-挂载为单个文件"><span>方式四：挂载为单个文件</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>cm<span class="token punctuation">-</span>file</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>conf<span class="token punctuation">-</span>volume</span>
<span class="line">      <span class="token key atrule">configMap</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>conf</span>
<span class="line">        <span class="token key atrule">items</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> nginx.conf</span>
<span class="line">            <span class="token key atrule">path</span><span class="token punctuation">:</span> nginx.conf</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>conf<span class="token punctuation">-</span>volume</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/nginx/nginx.conf</span>
<span class="line">          <span class="token key atrule">subPath</span><span class="token punctuation">:</span> nginx.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="configmap-更新" tabindex="-1"><a class="header-anchor" href="#configmap-更新"><span>ConfigMap 更新</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 更新 ConfigMap</span></span>
<span class="line">kubectl edit configmap nginx-config</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看更新后的数据</span></span>
<span class="line">kubectl get configmap nginx-config <span class="token parameter variable">-o</span> yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 注意：挂载的 ConfigMap 会自动更新，但环境变量不会自动更新</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_3-secret" tabindex="-1"><a class="header-anchor" href="#_3-secret"><span>3. Secret</span></a></h2><h3 id="什么是-secret" tabindex="-1"><a class="header-anchor" href="#什么是-secret"><span>什么是 Secret</span></a></h3><p>Secret 用于存储敏感信息，如密码、密钥、证书等。Secret 数据默认是 base64 编码的。</p><hr><h3 id="secret-类型" tabindex="-1"><a class="header-anchor" href="#secret-类型"><span>Secret 类型</span></a></h3><table><thead><tr><th style="text-align:left;">类型</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>Opaque</strong></td><td style="text-align:left;">通用 Secret（默认）</td></tr><tr><td style="text-align:left;"><strong>kubernetes.io/service-account-token</strong></td><td style="text-align:left;">Service Account Token</td></tr><tr><td style="text-align:left;"><strong>kubernetes.io/dockercfg</strong></td><td style="text-align:left;">Docker Registry 凭证</td></tr><tr><td style="text-align:left;"><strong>kubernetes.io/dockerconfigjson</strong></td><td style="text-align:left;">Docker Registry 凭证（JSON）</td></tr><tr><td style="text-align:left;"><strong>kubernetes.io/basic-auth</strong></td><td style="text-align:left;">基本认证</td></tr><tr><td style="text-align:left;"><strong>kubernetes.io/ssh-auth</strong></td><td style="text-align:left;">SSH 认证</td></tr><tr><td style="text-align:left;"><strong>kubernetes.io/tls</strong></td><td style="text-align:left;">TLS 证书</td></tr></tbody></table><hr><h3 id="创建-secret" tabindex="-1"><a class="header-anchor" href="#创建-secret"><span>创建 Secret</span></a></h3><h4 id="方式一-从字面值创建-1" tabindex="-1"><a class="header-anchor" href="#方式一-从字面值创建-1"><span>方式一：从字面值创建</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl create secret generic mysql-secret <span class="token punctuation">\\</span></span>
<span class="line">  --from-literal<span class="token operator">=</span>username<span class="token operator">=</span>root <span class="token punctuation">\\</span></span>
<span class="line">  --from-literal<span class="token operator">=</span>password<span class="token operator">=</span><span class="token number">123456</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式二-从文件创建-1" tabindex="-1"><a class="header-anchor" href="#方式二-从文件创建-1"><span>方式二：从文件创建</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建证书文件</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> tls.crt <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">-----BEGIN CERTIFICATE-----</span>
<span class="line">...</span>
<span class="line">-----END CERTIFICATE-----</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> tls.key <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">-----BEGIN RSA PRIVATE KEY-----</span>
<span class="line">...</span>
<span class="line">-----END RSA PRIVATE KEY-----</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从文件创建 Secret</span></span>
<span class="line">kubectl create secret tls tls-secret <span class="token parameter variable">--cert</span><span class="token operator">=</span>tls.crt <span class="token parameter variable">--key</span><span class="token operator">=</span>tls.key</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式三-yaml-文件创建" tabindex="-1"><a class="header-anchor" href="#方式三-yaml-文件创建"><span>方式三：YAML 文件创建</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret</span>
<span class="line">  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> yuchaoit</span>
<span class="line"><span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque</span>
<span class="line"><span class="token key atrule">data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">username</span><span class="token punctuation">:</span> cm9vdA==  <span class="token comment"># base64 编码的 &quot;root&quot;</span></span>
<span class="line">  <span class="token key atrule">password</span><span class="token punctuation">:</span> MTIzNDU2  <span class="token comment"># base64 编码的 &quot;123456&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># base64 编码</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;root&quot;</span> <span class="token operator">|</span> base64</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;123456&quot;</span> <span class="token operator">|</span> base64</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建 Secret</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> secret-mysql.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 Secret（数据是 base64 编码的）</span></span>
<span class="line">kubectl get secret mysql-secret <span class="token parameter variable">-n</span> yuchaoit <span class="token parameter variable">-o</span> yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解码查看</span></span>
<span class="line">kubectl get secret mysql-secret <span class="token parameter variable">-n</span> yuchaoit <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">&#39;{.data.password}&#39;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">-d</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="使用-secret" tabindex="-1"><a class="header-anchor" href="#使用-secret"><span>使用 Secret</span></a></h3><h4 id="方式一-环境变量-1" tabindex="-1"><a class="header-anchor" href="#方式一-环境变量-1"><span>方式一：环境变量</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>env</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">5.7</span></span>
<span class="line">      <span class="token key atrule">env</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_ROOT_PASSWORD</span>
<span class="line">          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret</span>
<span class="line">              <span class="token key atrule">key</span><span class="token punctuation">:</span> password</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_USER</span>
<span class="line">          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret</span>
<span class="line">              <span class="token key atrule">key</span><span class="token punctuation">:</span> username</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式二-挂载为文件" tabindex="-1"><a class="header-anchor" href="#方式二-挂载为文件"><span>方式二：挂载为文件</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>volume</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>volume</span>
<span class="line">      <span class="token key atrule">secret</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">secretName</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">5.7</span></span>
<span class="line">      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>volume</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/mysql/secrets</span>
<span class="line">          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 Pod</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> pod-secret-volume.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证 Secret 文件</span></span>
<span class="line">kubectl <span class="token builtin class-name">exec</span> mysql-secret-volume -- <span class="token function">ls</span> /etc/mysql/secrets</span>
<span class="line">kubectl <span class="token builtin class-name">exec</span> mysql-secret-volume -- <span class="token function">cat</span> /etc/mysql/secrets/password</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="方式三-挂载为单个文件" tabindex="-1"><a class="header-anchor" href="#方式三-挂载为单个文件"><span>方式三：挂载为单个文件</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>file</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>volume</span>
<span class="line">      <span class="token key atrule">secret</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">secretName</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret</span>
<span class="line">        <span class="token key atrule">items</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> password</span>
<span class="line">            <span class="token key atrule">path</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>password</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">5.7</span></span>
<span class="line">      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>volume</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/mysql/password.txt</span>
<span class="line">          <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>password</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="secret-加密" tabindex="-1"><a class="header-anchor" href="#secret-加密"><span>Secret 加密</span></a></h3><p>Kubernetes 支持静态加密 Secret 数据（需要配置 EncryptionConfiguration）。</p><hr><h2 id="_4-configmap-与-secret-对比" tabindex="-1"><a class="header-anchor" href="#_4-configmap-与-secret-对比"><span>4. ConfigMap 与 Secret 对比</span></a></h2><table><thead><tr><th style="text-align:left;">特性</th><th style="text-align:left;">ConfigMap</th><th style="text-align:left;">Secret</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>用途</strong></td><td style="text-align:left;">非敏感配置</td><td style="text-align:left;">敏感信息</td></tr><tr><td style="text-align:left;"><strong>数据格式</strong></td><td style="text-align:left;">明文</td><td style="text-align:left;">base64 编码</td></tr><tr><td style="text-align:left;"><strong>存储限制</strong></td><td style="text-align:left;">1MiB</td><td style="text-align:left;">1MiB</td></tr><tr><td style="text-align:left;"><strong>安全性</strong></td><td style="text-align:left;">不加密</td><td style="text-align:left;">支持加密</td></tr><tr><td style="text-align:left;"><strong>访问控制</strong></td><td style="text-align:left;">RBAC</td><td style="text-align:left;">RBAC</td></tr><tr><td style="text-align:left;"><strong>挂载方式</strong></td><td style="text-align:left;">环境变量、文件</td><td style="text-align:left;">环境变量、文件</td></tr></tbody></table><hr><h2 id="_5-最佳实践" tabindex="-1"><a class="header-anchor" href="#_5-最佳实践"><span>5. 最佳实践</span></a></h2><h3 id="configmap-最佳实践" tabindex="-1"><a class="header-anchor" href="#configmap-最佳实践"><span>ConfigMap 最佳实践</span></a></h3><ol><li><strong>分离配置与代码</strong>：不要将配置打包到镜像中</li><li><strong>使用命名空间</strong>：不同环境使用不同的命名空间</li><li><strong>版本控制</strong>：将 ConfigMap YAML 文件纳入版本控制</li><li><strong>合理命名</strong>：使用清晰的命名规范</li><li><strong>限制大小</strong>：单个 ConfigMap 不超过 1MiB</li></ol><hr><h3 id="secret-最佳实践" tabindex="-1"><a class="header-anchor" href="#secret-最佳实践"><span>Secret 最佳实践</span></a></h3><ol><li><strong>不要在 YAML 中明文存储</strong>：使用 <code>--from-literal</code> 或 <code>--from-file</code> 创建</li><li><strong>使用 RBAC</strong>：限制对 Secret 的访问</li><li><strong>启用加密</strong>：在生产环境启用 Secret 加密</li><li><strong>定期轮换</strong>：定期更新密码和密钥</li><li><strong>最小权限原则</strong>：只授予必要的权限</li></ol><hr><h3 id="使用建议" tabindex="-1"><a class="header-anchor" href="#使用建议"><span>使用建议</span></a></h3><table><thead><tr><th style="text-align:left;">场景</th><th style="text-align:left;">推荐方案</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>应用配置</strong></td><td style="text-align:left;">ConfigMap</td></tr><tr><td style="text-align:left;"><strong>数据库密码</strong></td><td style="text-align:left;">Secret</td></tr><tr><td style="text-align:left;"><strong>API 密钥</strong></td><td style="text-align:left;">Secret</td></tr><tr><td style="text-align:left;"><strong>TLS 证书</strong></td><td style="text-align:left;">Secret（类型：kubernetes.io/tls）</td></tr><tr><td style="text-align:left;"><strong>Docker Registry 凭证</strong></td><td style="text-align:left;">Secret（类型：kubernetes.io/dockerconfigjson）</td></tr></tbody></table><hr><h2 id="_6-常用命令汇总" tabindex="-1"><a class="header-anchor" href="#_6-常用命令汇总"><span>6. 常用命令汇总</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># ConfigMap</span></span>
<span class="line">kubectl create configmap <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> --from-literal<span class="token operator">=</span><span class="token operator">&lt;</span>key<span class="token operator">&gt;=</span><span class="token operator">&lt;</span>value<span class="token operator">&gt;</span></span>
<span class="line">kubectl create configmap <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> --from-file<span class="token operator">=</span><span class="token operator">&lt;</span>file<span class="token operator">&gt;</span></span>
<span class="line">kubectl create configmap <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> --from-file<span class="token operator">=</span><span class="token operator">&lt;</span>dir<span class="token operator">&gt;</span></span>
<span class="line">kubectl get configmap</span>
<span class="line">kubectl describe configmap <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span></span>
<span class="line">kubectl get configmap <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> <span class="token parameter variable">-o</span> yaml</span>
<span class="line">kubectl edit configmap <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span></span>
<span class="line">kubectl delete configmap <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Secret</span></span>
<span class="line">kubectl create secret generic <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> --from-literal<span class="token operator">=</span><span class="token operator">&lt;</span>key<span class="token operator">&gt;=</span><span class="token operator">&lt;</span>value<span class="token operator">&gt;</span></span>
<span class="line">kubectl create secret generic <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> --from-file<span class="token operator">=</span><span class="token operator">&lt;</span>file<span class="token operator">&gt;</span></span>
<span class="line">kubectl create secret tls <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> <span class="token parameter variable">--cert</span><span class="token operator">=</span><span class="token operator">&lt;</span>cert<span class="token operator">&gt;</span> <span class="token parameter variable">--key</span><span class="token operator">=</span><span class="token operator">&lt;</span>key<span class="token operator">&gt;</span></span>
<span class="line">kubectl get secret</span>
<span class="line">kubectl describe secret <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span></span>
<span class="line">kubectl get secret <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> <span class="token parameter variable">-o</span> yaml</span>
<span class="line">kubectl edit secret <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span></span>
<span class="line">kubectl delete secret <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解码 Secret</span></span>
<span class="line">kubectl get secret <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">&#39;{.data.&lt;key&gt;}&#39;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">-d</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_7-故障排查" tabindex="-1"><a class="header-anchor" href="#_7-故障排查"><span>7. 故障排查</span></a></h2><h3 id="configmap-无法挂载" tabindex="-1"><a class="header-anchor" href="#configmap-无法挂载"><span>ConfigMap 无法挂载</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 检查 ConfigMap 是否存在</span></span>
<span class="line">kubectl get configmap</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 检查 Pod 状态</span></span>
<span class="line">kubectl get pods</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 查看 Pod 事件</span></span>
<span class="line">kubectl describe pod <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 检查挂载点</span></span>
<span class="line">kubectl <span class="token builtin class-name">exec</span> <span class="token operator">&lt;</span>pod<span class="token operator">&gt;</span> -- <span class="token function">ls</span> /etc/config</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="secret-环境变量未生效" tabindex="-1"><a class="header-anchor" href="#secret-环境变量未生效"><span>Secret 环境变量未生效</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 检查 Secret 是否存在</span></span>
<span class="line">kubectl get secret</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 检查 Pod 环境变量</span></span>
<span class="line">kubectl <span class="token builtin class-name">exec</span> <span class="token operator">&lt;</span>pod<span class="token operator">&gt;</span> -- <span class="token function">env</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token operator">&lt;</span>key<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 查看 Pod 配置</span></span>
<span class="line">kubectl get pod <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> <span class="token parameter variable">-o</span> yaml <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-A10</span> env:</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_8-实战案例" tabindex="-1"><a class="header-anchor" href="#_8-实战案例"><span>8. 实战案例</span></a></h2><h3 id="nginx-配置管理" tabindex="-1"><a class="header-anchor" href="#nginx-配置管理"><span>Nginx 配置管理</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config</span>
<span class="line"><span class="token key atrule">data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">nginx.conf</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">    user nginx;</span>
<span class="line">    worker_processes auto;</span>
<span class="line">    error_log /var/log/nginx/error.log;</span>
<span class="line">    pid /run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line">    events <span class="token punctuation">{</span></span>
<span class="line">        worker_connections 1024;</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    http <span class="token punctuation">{</span></span>
<span class="line">        include /etc/nginx/mime.types;</span>
<span class="line">        default_type application/octet<span class="token punctuation">-</span>stream;</span>
<span class="line"></span>
<span class="line">        server <span class="token punctuation">{</span></span>
<span class="line">            listen 80;</span>
<span class="line">            server_name localhost;</span>
<span class="line"></span>
<span class="line">            location / <span class="token punctuation">{</span></span>
<span class="line">                root /usr/share/nginx/html;</span>
<span class="line">                index index.html;</span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config<span class="token punctuation">-</span>pod</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config<span class="token punctuation">-</span>volume</span>
<span class="line">      <span class="token key atrule">configMap</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config</span>
<span class="line">        <span class="token key atrule">items</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> nginx.conf</span>
<span class="line">            <span class="token key atrule">path</span><span class="token punctuation">:</span> nginx.conf</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>config<span class="token punctuation">-</span>volume</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/nginx/nginx.conf</span>
<span class="line">          <span class="token key atrule">subPath</span><span class="token punctuation">:</span> nginx.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="mysql-密码管理" tabindex="-1"><a class="header-anchor" href="#mysql-密码管理"><span>MySQL 密码管理</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret</span>
<span class="line"><span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque</span>
<span class="line"><span class="token key atrule">data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">root-password</span><span class="token punctuation">:</span> MTIzNDU2</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>pod</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>volume</span>
<span class="line">      <span class="token key atrule">secret</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">secretName</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql</span>
<span class="line">      <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">5.7</span></span>
<span class="line">      <span class="token key atrule">env</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_ROOT_PASSWORD</span>
<span class="line">          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret</span>
<span class="line">              <span class="token key atrule">key</span><span class="token punctuation">:</span> root<span class="token punctuation">-</span>password</span>
<span class="line">      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>secret<span class="token punctuation">-</span>volume</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/mysql/secrets</span>
<span class="line">          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_9-总结" tabindex="-1"><a class="header-anchor" href="#_9-总结"><span>9. 总结</span></a></h2><h3 id="配置管理关键要点" tabindex="-1"><a class="header-anchor" href="#配置管理关键要点"><span>配置管理关键要点</span></a></h3><ol><li><strong>ConfigMap</strong> 用于非敏感配置</li><li><strong>Secret</strong> 用于敏感信息</li><li><strong>环境变量</strong> 适合少量配置</li><li><strong>挂载文件</strong> 适合配置文件</li><li><strong>版本控制</strong> 管理配置变更</li><li><strong>安全加固</strong> 保护敏感信息</li></ol><hr><h3 id="选择指南" tabindex="-1"><a class="header-anchor" href="#选择指南"><span>选择指南</span></a></h3><table><thead><tr><th style="text-align:left;">需求</th><th style="text-align:left;">推荐方案</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>应用配置</strong></td><td style="text-align:left;">ConfigMap</td></tr><tr><td style="text-align:left;"><strong>数据库密码</strong></td><td style="text-align:left;">Secret</td></tr><tr><td style="text-align:left;"><strong>TLS 证书</strong></td><td style="text-align:left;">Secret（TLS 类型）</td></tr><tr><td style="text-align:left;"><strong>Docker 凭证</strong></td><td style="text-align:left;">Secret（Docker 类型）</td></tr><tr><td style="text-align:left;"><strong>配置文件</strong></td><td style="text-align:left;">ConfigMap 挂载为文件</td></tr><tr><td style="text-align:left;"><strong>环境变量</strong></td><td style="text-align:left;">ConfigMap 或 Secret</td></tr></tbody></table>`,112)])])}const o=s(t,[["render",p]]),r=JSON.parse('{"path":"/05-%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92/03-kubernetes%E7%BC%96%E6%8E%92/7-k8s%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.html","title":"Kubernetes 配置文件汇总（ConfigMap 与 Secret）","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"05-容器编排/03-kubernetes编排/7-k8s配置文件.md"}');export{o as comp,r as data};
