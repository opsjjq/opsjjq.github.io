import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const p={};function i(t,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="docker-compose-使用与实践" tabindex="-1"><a class="header-anchor" href="#docker-compose-使用与实践"><span>Docker Compose 使用与实践</span></a></h1><h2 id="一、docker-compose-安装与基础" tabindex="-1"><a class="header-anchor" href="#一、docker-compose-安装与基础"><span>一、Docker Compose 安装与基础</span></a></h2><h3 id="安装方法" tabindex="-1"><a class="header-anchor" href="#安装方法"><span>安装方法</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 下载最新版 Docker Compose</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-o</span> /opt/docker-compose https://github.com/docker/compose/releases/download/v5.0.1/docker-compose-linux-x86_64</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加执行权限</span></span>
<span class="line"><span class="token function">chmod</span> +x /opt/docker-compose</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建软链接（方便全局调用）</span></span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /opt/docker-compose /usr/local/bin/docker-compose</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证安装</span></span>
<span class="line"><span class="token function">docker-compose</span> <span class="token parameter variable">-v</span></span>
<span class="line"><span class="token comment"># 输出：Docker Compose version v5.0.1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="官方文档参考" tabindex="-1"><a class="header-anchor" href="#官方文档参考"><span>官方文档参考</span></a></h3><ul><li><a href="https://docs.docker.com/reference/compose-file" target="_blank" rel="noopener noreferrer">Compose 文件参考</a></li><li><a href="https://docs.docker.com/reference/compose-file/services/#labels" target="_blank" rel="noopener noreferrer">服务配置关键字</a></li></ul><hr><h2 id="二、docker-compose-yml-核心关键字详解" tabindex="-1"><a class="header-anchor" href="#二、docker-compose-yml-核心关键字详解"><span>二、docker-compose.yml 核心关键字详解</span></a></h2><h3 id="_1-service-服务定义" tabindex="-1"><a class="header-anchor" href="#_1-service-服务定义"><span>1. service - 服务定义</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>latest</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_2-command-覆盖默认命令" tabindex="-1"><a class="header-anchor" href="#_2-command-覆盖默认命令"><span>2. command - 覆盖默认命令</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">test</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox</span>
<span class="line">    <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token key atrule">echo &quot;项目名称</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>COMPOSE_PROJECT_NAME<span class="token punctuation">}</span>&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_3-configs-配置文件管理" tabindex="-1"><a class="header-anchor" href="#_3-configs-配置文件管理"><span>3. configs - 配置文件管理</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">redis</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">configs</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> redis_config</span>
<span class="line">      <span class="token punctuation">-</span> app_config</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">configs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">redis_config</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">file</span><span class="token punctuation">:</span> ./redis.conf</span>
<span class="line">  <span class="token key atrule">app_config</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">external</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>  <span class="token comment"># 引用外部已创建的配置</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_4-container-name-容器命名" tabindex="-1"><a class="header-anchor" href="#_4-container-name-容器命名"><span>4. container_name - 容器命名</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>nginx<span class="token punctuation">-</span>container</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_5-depends-on-服务依赖关系" tabindex="-1"><a class="header-anchor" href="#_5-depends-on-服务依赖关系"><span>5. depends_on - 服务依赖关系</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> api</span>
<span class="line">      <span class="token punctuation">-</span> database</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">api</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> node<span class="token punctuation">:</span><span class="token number">18</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">database</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token number">15</span></span>
<span class="line"><span class="token comment"># 启动顺序：database → api → web</span></span>
<span class="line"><span class="token comment"># 停止顺序：web → api → database</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_6-devices-设备映射" tabindex="-1"><a class="header-anchor" href="#_6-devices-设备映射"><span>6. devices - 设备映射</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">serial-app</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> ubuntu</span>
<span class="line">    <span class="token key atrule">devices</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;/dev/ttyUSB0:/dev/ttyUSB0&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_7-dns-自定义-dns" tabindex="-1"><a class="header-anchor" href="#_7-dns-自定义-dns"><span>7. dns - 自定义 DNS</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">dns</span><span class="token punctuation">:</span> 8.8.8.8</span>
<span class="line">    <span class="token comment"># 或使用列表</span></span>
<span class="line">    <span class="token key atrule">dns</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> 8.8.8.8</span>
<span class="line">      <span class="token punctuation">-</span> 1.1.1.1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_8-entrypoint-入口点覆盖" tabindex="-1"><a class="header-anchor" href="#_8-entrypoint-入口点覆盖"><span>8. entrypoint - 入口点覆盖</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> alpine</span>
<span class="line">    <span class="token key atrule">entrypoint</span><span class="token punctuation">:</span> /app/start.sh</span>
<span class="line">    <span class="token comment"># 或使用列表格式</span></span>
<span class="line">    <span class="token key atrule">entrypoint</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> /bin/sh</span>
<span class="line">      <span class="token punctuation">-</span> <span class="token punctuation">-</span>c</span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;echo Starting...&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_9-env-file-与-environment-环境变量" tabindex="-1"><a class="header-anchor" href="#_9-env-file-与-environment-环境变量"><span>9. env_file 与 environment - 环境变量</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> node<span class="token punctuation">:</span><span class="token number">18</span></span>
<span class="line">    <span class="token key atrule">env_file</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> .env.production</span>
<span class="line">      <span class="token punctuation">-</span> .env.override  <span class="token comment"># 后加载的覆盖前面的</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> NODE_ENV=production</span>
<span class="line">      <span class="token punctuation">-</span> DEBUG=false</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_10-networks-网络配置" tabindex="-1"><a class="header-anchor" href="#_10-networks-网络配置"><span>10. networks - 网络配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">frontend</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> front<span class="token punctuation">-</span>tier</span>
<span class="line">      <span class="token punctuation">-</span> back<span class="token punctuation">-</span>tier</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">front-tier</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line">  <span class="token key atrule">back-tier</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_11-ports-端口映射" tabindex="-1"><a class="header-anchor" href="#_11-ports-端口映射"><span>11. ports - 端口映射</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;80:80&quot;</span>                    <span class="token comment"># 标准映射</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;8080:80&quot;</span>                  <span class="token comment"># 主机 8080→容器 80</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;127.0.0.1:3000:3000&quot;</span>     <span class="token comment"># 仅本地访问</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;0.0.0.0:443:443&quot;</span>         <span class="token comment"># 所有网络接口</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_12-volumes-数据卷" tabindex="-1"><a class="header-anchor" href="#_12-volumes-数据卷"><span>12. volumes - 数据卷</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">database</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token number">15</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> postgres_data<span class="token punctuation">:</span>/var/lib/postgresql/data  <span class="token comment"># 命名卷</span></span>
<span class="line">      <span class="token punctuation">-</span> ./config<span class="token punctuation">:</span>/etc/postgresql                <span class="token comment"># 主机目录</span></span>
<span class="line">      <span class="token punctuation">-</span> /opt/data<span class="token punctuation">:</span>/app/data                     <span class="token comment"># 绝对路径</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres_data</span><span class="token punctuation">:</span>  <span class="token comment"># 声明命名卷</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_13-restart-重启策略" tabindex="-1"><a class="header-anchor" href="#_13-restart-重启策略"><span>13. restart - 重启策略</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always  <span class="token comment"># 选项：no, always, on-failure, unless-stopped</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_14-deploy-部署配置-swarm-模式" tabindex="-1"><a class="header-anchor" href="#_14-deploy-部署配置-swarm-模式"><span>14. deploy - 部署配置（Swarm 模式）</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">deploy</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line">      <span class="token key atrule">resources</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">limits</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">cpus</span><span class="token punctuation">:</span> <span class="token string">&#39;0.5&#39;</span></span>
<span class="line">          <span class="token key atrule">memory</span><span class="token punctuation">:</span> 512M</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、实践案例集锦" tabindex="-1"><a class="header-anchor" href="#三、实践案例集锦"><span>三、实践案例集锦</span></a></h2><h3 id="案例-1-python-flask-redis-访问计数器" tabindex="-1"><a class="header-anchor" href="#案例-1-python-flask-redis-访问计数器"><span>案例 1：Python Flask + Redis 访问计数器</span></a></h3><p><strong>项目结构</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">/flask-redis/</span>
<span class="line">├── flask-redis.py</span>
<span class="line">├── requirements.txt</span>
<span class="line">└── docker-compose.yml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>应用代码（flask-redis.py）</strong>：</p><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code class="language-python"><span class="line"><span class="token keyword">from</span> flask <span class="token keyword">import</span> Flask</span>
<span class="line"><span class="token keyword">from</span> redis <span class="token keyword">import</span> Redis</span>
<span class="line"></span>
<span class="line">app <span class="token operator">=</span> Flask<span class="token punctuation">(</span>__name__<span class="token punctuation">)</span></span>
<span class="line">redis <span class="token operator">=</span> Redis<span class="token punctuation">(</span>host<span class="token operator">=</span><span class="token string">&#39;redis&#39;</span><span class="token punctuation">,</span> port<span class="token operator">=</span><span class="token number">6379</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token decorator annotation punctuation">@app<span class="token punctuation">.</span>route</span><span class="token punctuation">(</span><span class="token string">&#39;/&#39;</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">def</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    count <span class="token operator">=</span> redis<span class="token punctuation">.</span>incr<span class="token punctuation">(</span><span class="token string">&#39;visits&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token string-interpolation"><span class="token string">f&#39;本页面已被访问 </span><span class="token interpolation"><span class="token punctuation">{</span>count<span class="token punctuation">}</span></span><span class="token string"> 次\\n&#39;</span></span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">&quot;__main__&quot;</span><span class="token punctuation">:</span></span>
<span class="line">    app<span class="token punctuation">.</span>run<span class="token punctuation">(</span>host<span class="token operator">=</span><span class="token string">&quot;0.0.0.0&quot;</span><span class="token punctuation">,</span> port<span class="token operator">=</span><span class="token number">5000</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>docker-compose.yml</strong>：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">webapp</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> python<span class="token punctuation">:</span><span class="token number">3.9</span></span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> flask<span class="token punctuation">-</span>app</span>
<span class="line">    <span class="token key atrule">working_dir</span><span class="token punctuation">:</span> /app</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;5000:5000&quot;</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./flask<span class="token punctuation">-</span>redis.py<span class="token punctuation">:</span>/app/app.py</span>
<span class="line">      <span class="token punctuation">-</span> ./requirements.txt<span class="token punctuation">:</span>/app/requirements.txt</span>
<span class="line">    <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">&gt;</span><span class="token scalar string"></span>
<span class="line">      sh -c &quot;pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/ &amp;&amp;</span>
<span class="line">             python app.py&quot;</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>network</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> redis</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">redis</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> redis<span class="token punctuation">-</span>cache</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;6379:6379&quot;</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>network</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app-network</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>运行与测试</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 启动服务</span></span>
<span class="line"><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试访问</span></span>
<span class="line"><span class="token function">curl</span> http://localhost:5000</span>
<span class="line"><span class="token comment"># 输出：本页面已被访问 1 次</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="案例-2-zabbix-监控平台" tabindex="-1"><a class="header-anchor" href="#案例-2-zabbix-监控平台"><span>案例 2：Zabbix 监控平台</span></a></h3><p><strong>docker-compose.yml</strong>：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">mysql</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">8.0</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">MYSQL_ROOT_PASSWORD</span><span class="token punctuation">:</span> <span class="token string">&quot;123456&quot;</span></span>
<span class="line">      <span class="token key atrule">MYSQL_DATABASE</span><span class="token punctuation">:</span> zabbix</span>
<span class="line">      <span class="token key atrule">MYSQL_USER</span><span class="token punctuation">:</span> zabbix</span>
<span class="line">      <span class="token key atrule">MYSQL_PASSWORD</span><span class="token punctuation">:</span> zabbix</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> zabbix_mysql<span class="token punctuation">:</span>/var/lib/mysql</span>
<span class="line">      <span class="token punctuation">-</span> ./my.cnf<span class="token punctuation">:</span>/etc/my.cnf</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;3307:3306&quot;</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> zabbix<span class="token punctuation">-</span>net</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">zabbix-server</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> zabbix/zabbix<span class="token punctuation">-</span>server<span class="token punctuation">-</span>mysql<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">DB_SERVER_HOST</span><span class="token punctuation">:</span> <span class="token string">&quot;mysql&quot;</span></span>
<span class="line">      <span class="token key atrule">MYSQL_USER</span><span class="token punctuation">:</span> <span class="token string">&quot;zabbix&quot;</span></span>
<span class="line">      <span class="token key atrule">MYSQL_PASSWORD</span><span class="token punctuation">:</span> <span class="token string">&quot;zabbix&quot;</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;10051:10051&quot;</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> zabbix<span class="token punctuation">-</span>net</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> mysql</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">zabbix-web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> zabbix/zabbix<span class="token punctuation">-</span>web<span class="token punctuation">-</span>nginx<span class="token punctuation">-</span>mysql<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">DB_SERVER_HOST</span><span class="token punctuation">:</span> <span class="token string">&quot;mysql&quot;</span></span>
<span class="line">      <span class="token key atrule">MYSQL_USER</span><span class="token punctuation">:</span> <span class="token string">&quot;zabbix&quot;</span></span>
<span class="line">      <span class="token key atrule">MYSQL_PASSWORD</span><span class="token punctuation">:</span> <span class="token string">&quot;zabbix&quot;</span></span>
<span class="line">      <span class="token key atrule">ZBX_SERVER_HOST</span><span class="token punctuation">:</span> <span class="token string">&quot;zabbix-server&quot;</span></span>
<span class="line">      <span class="token key atrule">PHP_TZ</span><span class="token punctuation">:</span> <span class="token string">&quot;Asia/Shanghai&quot;</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;8777:8080&quot;</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> zabbix<span class="token punctuation">-</span>net</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> mysql</span>
<span class="line">      <span class="token punctuation">-</span> zabbix<span class="token punctuation">-</span>server</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">zabbix_mysql</span><span class="token punctuation">:</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">zabbix-net</span><span class="token punctuation">:</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>MySQL 配置文件（my.cnf）</strong>：</p><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysqld</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">port</span><span class="token punctuation">=</span><span class="token value attr-value">3306</span></span>
<span class="line"><span class="token key attr-name">character_set_server</span><span class="token punctuation">=</span><span class="token value attr-value">utf8mb4</span></span>
<span class="line"><span class="token key attr-name">collation-server</span><span class="token punctuation">=</span><span class="token value attr-value">utf8mb4_bin</span></span>
<span class="line"><span class="token key attr-name">log_bin_trust_function_creators</span><span class="token punctuation">=</span><span class="token value attr-value">1</span></span>
<span class="line"><span class="token key attr-name">max_allowed_packet</span><span class="token punctuation">=</span><span class="token value attr-value">64M</span></span>
<span class="line"><span class="token key attr-name">innodb_buffer_pool_size</span><span class="token punctuation">=</span><span class="token value attr-value">512M</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="案例-3-wordpress-博客系统" tabindex="-1"><a class="header-anchor" href="#案例-3-wordpress-博客系统"><span>案例 3：WordPress 博客系统</span></a></h3><p><strong>docker-compose.yml</strong>：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">db</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">8.0</span></span>
<span class="line">    <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>default_authentication_plugin=mysql_native_password</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> wp_db<span class="token punctuation">:</span>/var/lib/mysql</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">MYSQL_ROOT_PASSWORD</span><span class="token punctuation">:</span> <span class="token number">123456</span></span>
<span class="line">      <span class="token key atrule">MYSQL_DATABASE</span><span class="token punctuation">:</span> wordpress</span>
<span class="line">      <span class="token key atrule">MYSQL_USER</span><span class="token punctuation">:</span> wordpress</span>
<span class="line">      <span class="token key atrule">MYSQL_PASSWORD</span><span class="token punctuation">:</span> wordpress</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">wordpress</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> db</span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> wordpress<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;8001:80&quot;</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">WORDPRESS_DB_HOST</span><span class="token punctuation">:</span> db</span>
<span class="line">      <span class="token key atrule">WORDPRESS_DB_USER</span><span class="token punctuation">:</span> wordpress</span>
<span class="line">      <span class="token key atrule">WORDPRESS_DB_PASSWORD</span><span class="token punctuation">:</span> wordpress</span>
<span class="line">      <span class="token key atrule">WORDPRESS_DB_NAME</span><span class="token punctuation">:</span> wordpress</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> wp_content<span class="token punctuation">:</span>/var/www/html/wp<span class="token punctuation">-</span>content</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">wp_db</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">wp_content</span><span class="token punctuation">:</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="案例-4-jenkins-ci-cd-平台" tabindex="-1"><a class="header-anchor" href="#案例-4-jenkins-ci-cd-平台"><span>案例 4：Jenkins CI/CD 平台</span></a></h3><p><strong>jenkins-compose.yml</strong>：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">jenkins</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> jenkins/jenkins<span class="token punctuation">:</span>lts</span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>ci</span>
<span class="line">    <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">user</span><span class="token punctuation">:</span> root</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;8080:8080&quot;</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;50000:50000&quot;</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> /data/jenkins<span class="token punctuation">:</span>/var/jenkins_home</span>
<span class="line">      <span class="token punctuation">-</span> /var/run/docker.sock<span class="token punctuation">:</span>/var/run/docker.sock</span>
<span class="line">      <span class="token punctuation">-</span> /usr/bin/docker<span class="token punctuation">:</span>/usr/bin/docker</span>
<span class="line">      <span class="token punctuation">-</span> /root/.ssh<span class="token punctuation">:</span>/root/.ssh</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> JAVA_OPTS=<span class="token punctuation">-</span>Djenkins.install.runSetupWizard=false</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="案例-5-gitlab-代码仓库" tabindex="-1"><a class="header-anchor" href="#案例-5-gitlab-代码仓库"><span>案例 5：GitLab 代码仓库</span></a></h3><p><strong>gitlab-compose.yml</strong>：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgresql</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token number">16</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">POSTGRES_USER</span><span class="token punctuation">:</span> gitlab</span>
<span class="line">      <span class="token key atrule">POSTGRES_PASSWORD</span><span class="token punctuation">:</span> password</span>
<span class="line">      <span class="token key atrule">POSTGRES_DB</span><span class="token punctuation">:</span> gitlabhq_production</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> postgres_data<span class="token punctuation">:</span>/var/lib/postgresql/data</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">redis</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span><span class="token number">7</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> redis_data<span class="token punctuation">:</span>/data</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">gitlab</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> gitlab/gitlab<span class="token punctuation">-</span>ce<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> postgresql</span>
<span class="line">      <span class="token punctuation">-</span> redis</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;89:80&quot;</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;10022:22&quot;</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> gitlab_data<span class="token punctuation">:</span>/var/opt/gitlab</span>
<span class="line">      <span class="token punctuation">-</span> gitlab_logs<span class="token punctuation">:</span>/var/log/gitlab</span>
<span class="line">      <span class="token punctuation">-</span> gitlab_config<span class="token punctuation">:</span>/etc/gitlab</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">GITLAB_OMNIBUS_CONFIG</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">        external_url &#39;http://10.0.0.200:89&#39;</span>
<span class="line">        gitlab_rails[&#39;gitlab_shell_ssh_port&#39;] = 10022</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres_data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">redis_data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">gitlab_data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">gitlab_logs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">gitlab_config</span><span class="token punctuation">:</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、ci-cd-流水线实践" tabindex="-1"><a class="header-anchor" href="#四、ci-cd-流水线实践"><span>四、CI/CD 流水线实践</span></a></h2><h3 id="gitlab-jenkins-自动化部署流程" tabindex="-1"><a class="header-anchor" href="#gitlab-jenkins-自动化部署流程"><span>GitLab + Jenkins 自动化部署流程</span></a></h3><p><strong>1. GitLab 仓库配置</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 初始化本地仓库</span></span>
<span class="line"><span class="token function">git</span> init</span>
<span class="line"><span class="token function">git</span> remote <span class="token function">add</span> origin http://10.0.0.200:89/root/myapp.git</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 推送代码</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;# My Application&quot;</span> <span class="token operator">&gt;</span> README.md</span>
<span class="line"><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span></span>
<span class="line"><span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;Initial commit&quot;</span></span>
<span class="line"><span class="token function">git</span> push <span class="token parameter variable">-u</span> origin master</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>2. Jenkins 任务配置</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">项目类型：流水线项目</span>
<span class="line">源码管理：Git</span>
<span class="line">仓库 URL：http://10.0.0.200:89/root/myapp.git</span>
<span class="line">构建触发器：GitLab webhook</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>3. Jenkins Pipeline 脚本</strong></p><div class="language-groovy line-numbers-mode" data-highlighter="prismjs" data-ext="groovy"><pre><code class="language-groovy"><span class="line">pipeline <span class="token punctuation">{</span></span>
<span class="line">    agent any</span>
<span class="line"></span>
<span class="line">    stages <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;Checkout&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                git branch<span class="token punctuation">:</span> <span class="token string">&#39;master&#39;</span><span class="token punctuation">,</span></span>
<span class="line">                    url<span class="token punctuation">:</span> <span class="token string">&#39;http://10.0.0.200:89/root/myapp.git&#39;</span><span class="token punctuation">,</span></span>
<span class="line">                    credentialsId<span class="token punctuation">:</span> <span class="token string">&#39;gitlab-credentials&#39;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;Build&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">&#39;docker build -t myapp:\${BUILD_NUMBER} .&#39;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;Deploy&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">&#39;&#39;&#39;</span>
<span class="line">                    docker stop myapp || true</span>
<span class="line">                    docker rm myapp || true</span>
<span class="line">                    docker run -d \\</span>
<span class="line">                      --name myapp \\</span>
<span class="line">                      -p 8080:80 \\</span>
<span class="line">                      -v \${WORKSPACE}:/usr/share/nginx/html \\</span>
<span class="line">                      nginx:latest</span>
<span class="line">                &#39;&#39;&#39;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>4. GitLab Webhook 配置</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">URL: http://jenkins-server:8080/project/myapp</span>
<span class="line">Secret Token: [Jenkins 生成的 token]</span>
<span class="line">触发事件：Push events, Merge request events</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、故障排查与最佳实践" tabindex="-1"><a class="header-anchor" href="#五、故障排查与最佳实践"><span>五、故障排查与最佳实践</span></a></h2><h3 id="常见问题解决" tabindex="-1"><a class="header-anchor" href="#常见问题解决"><span>常见问题解决</span></a></h3><p><strong>1. MySQL 权限问题</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 编辑 my.cnf 添加</span></span>
<span class="line"><span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">log_bin_trust_function_creators</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>2. 清理残留数据</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 完全清理 Compose 项目</span></span>
<span class="line"><span class="token function">docker-compose</span> down <span class="token parameter variable">-v</span>  <span class="token comment"># 删除容器、网络和卷</span></span>
<span class="line"><span class="token function">docker</span> system prune <span class="token parameter variable">-a</span>  <span class="token comment"># 清理所有未使用资源</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>3. 查看服务日志</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker-compose</span> logs <span class="token parameter variable">-f</span> <span class="token punctuation">[</span>service_name<span class="token punctuation">]</span></span>
<span class="line"><span class="token function">docker-compose</span> logs <span class="token parameter variable">--tail</span><span class="token operator">=</span><span class="token number">100</span> web</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="最佳实践建议" tabindex="-1"><a class="header-anchor" href="#最佳实践建议"><span>最佳实践建议</span></a></h3><ol><li><strong>环境分离</strong>：使用不同 compose 文件管理开发/生产环境</li><li><strong>数据持久化</strong>：对数据库等有状态服务使用命名卷</li><li><strong>资源限制</strong>：为生产环境服务配置 CPU/内存限制</li><li><strong>健康检查</strong>：添加 healthcheck 确保服务可用性</li><li><strong>版本控制</strong>：将 docker-compose.yml 纳入 Git 管理</li><li><strong>网络隔离</strong>：为不同项目创建独立网络</li><li><strong>敏感信息</strong>：使用 secrets 或环境变量文件管理密码</li><li><strong>镜像标签</strong>：使用特定版本标签而非 latest</li></ol><hr><h3 id="常用命令速查" tabindex="-1"><a class="header-anchor" href="#常用命令速查"><span>常用命令速查</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 启动服务</span></span>
<span class="line"><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止服务</span></span>
<span class="line"><span class="token function">docker-compose</span> down</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看状态</span></span>
<span class="line"><span class="token function">docker-compose</span> <span class="token function">ps</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs <span class="token parameter variable">-f</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 执行命令</span></span>
<span class="line"><span class="token function">docker-compose</span> <span class="token builtin class-name">exec</span> service_name <span class="token builtin class-name">command</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 构建镜像</span></span>
<span class="line"><span class="token function">docker-compose</span> build</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 拉取镜像</span></span>
<span class="line"><span class="token function">docker-compose</span> pull</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启服务</span></span>
<span class="line"><span class="token function">docker-compose</span> restart</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 扩展实例</span></span>
<span class="line"><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span> <span class="token parameter variable">--scale</span> <span class="token assign-left variable">web</span><span class="token operator">=</span><span class="token number">3</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,114)])])}const o=n(p,[["render",i]]),u=JSON.parse('{"path":"/05-%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92/02-docker%E5%AE%B9%E5%99%A8/6-docker-compose%E4%BD%BF%E7%94%A8%E4%B8%8E%E5%AE%9E%E8%B7%B5.html","title":"Docker Compose 使用与实践","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"05-容器编排/02-docker容器/6-docker-compose使用与实践.md"}');export{o as comp,u as data};
