import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const p={};function i(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="wordpress负载均衡部署" tabindex="-1"><a class="header-anchor" href="#wordpress负载均衡部署"><span>WordPress负载均衡部署</span></a></h2><h3 id="一、wordpress部署核心概念" tabindex="-1"><a class="header-anchor" href="#一、wordpress部署核心概念"><span>一、WordPress部署核心概念</span></a></h3><h4 id="部署本质" tabindex="-1"><a class="header-anchor" href="#部署本质"><span>部署本质</span></a></h4><p>将编程语言编写的程序（如WordPress）在Linux服务器上以HTTP服务形式运行。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">用户访问流程：</span>
<span class="line">client → HTTP服务端（绑定端口 10.0.0.7:80）→ 网站程序</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="关键原则" tabindex="-1"><a class="header-anchor" href="#关键原则"><span>关键原则</span></a></h4><ol><li>后端服务需绑定特定端口提供HTTP服务</li><li>运维需确保程序正确运行并对外提供服务</li></ol><hr><h3 id="二、wordpress负载均衡部署流程" tabindex="-1"><a class="header-anchor" href="#二、wordpress负载均衡部署流程"><span>二、WordPress负载均衡部署流程</span></a></h3><h4 id="部署顺序" tabindex="-1"><a class="header-anchor" href="#部署顺序"><span>部署顺序</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">1. 部署Web7（后端节点1）</span>
<span class="line">2. 部署Web8（后端节点2）</span>
<span class="line">3. 部署lb-5（负载均衡器）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="三、web7完整部署流程" tabindex="-1"><a class="header-anchor" href="#三、web7完整部署流程"><span>三、Web7完整部署流程</span></a></h3><h4 id="_1-环境准备" tabindex="-1"><a class="header-anchor" href="#_1-环境准备"><span>1. 环境准备</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建www用户组</span></span>
<span class="line"><span class="token function">groupadd</span> www <span class="token parameter variable">-g</span> <span class="token number">666</span></span>
<span class="line"><span class="token function">useradd</span> www <span class="token parameter variable">-s</span> /sbin/nologin <span class="token parameter variable">-M</span> <span class="token parameter variable">-u</span> <span class="token number">666</span> <span class="token parameter variable">-g</span> <span class="token number">666</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置统一YUM源</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/61.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local-rpm]</span>
<span class="line">name=local yum repo</span>
<span class="line">baseurl=http://172.16.1.61:12345</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装Nginx</span></span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 卸载旧PHP，安装PHP7.1</span></span>
<span class="line">yum remove php-mysql-5.4 php php-fpm php-common <span class="token parameter variable">-y</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> php71w-cli php71w-common php71w-devel php71w-embedded <span class="token punctuation">\\</span></span>
<span class="line">php71w-gd php71w-mcrypt php71w-mbstring php71w-pdo php71w-xml <span class="token punctuation">\\</span></span>
<span class="line">php71w-fpm php71w-mysqlnd php71w-opcache php71w-pecl-memcached <span class="token punctuation">\\</span></span>
<span class="line">php71w-pecl-redis php71w-pecl-mongodb php71w-json <span class="token punctuation">\\</span></span>
<span class="line">php71w-pecl-apcu php71w-pecl-apcu-devel</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-php-fpm配置" tabindex="-1"><a class="header-anchor" href="#_2-php-fpm配置"><span>2. PHP-FPM配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 修改PHP-FPM运行用户</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/^user/c user = www&#39;</span> /etc/php-fpm.d/www.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/^group/c group = www&#39;</span> /etc/php-fpm.d/www.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建会话目录并授权</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /var/lib/php/session</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> www.www /var/lib/php</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动PHP-FPM</span></span>
<span class="line">systemctl start php-fpm</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> php-fpm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证PHP-FPM运行（监听127.0.0.1:9000）</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> php</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-nginx-php测试环境" tabindex="-1"><a class="header-anchor" href="#_3-nginx-php测试环境"><span>3. Nginx+PHP测试环境</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token comment"># /etc/nginx/conf.d/php.conf</span></span>
<span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server_name</span> _</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">root</span> /php-code/</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment"># 转发到PHP-FPM</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_pass</span> 127.0.0.1:9000</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment"># 保留请求URL格式</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_param</span> SCRIPT_FILENAME <span class="token variable">$document_root</span><span class="token variable">$fastcgi_script_name</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment"># 转换HTTP数据为FastCGI协议</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">include</span> fastcgi_params</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建测试PHP文件</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /php-code/</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /php-code/test-info.php <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">&lt;?php</span>
<span class="line">    phpinfo();</span>
<span class="line">?&gt;</span>
<span class="line">EOF</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> www.www /php-code/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="四、wordpress部署步骤" tabindex="-1"><a class="header-anchor" href="#四、wordpress部署步骤"><span>四、WordPress部署步骤</span></a></h3><h4 id="_1-准备工作" tabindex="-1"><a class="header-anchor" href="#_1-准备工作"><span>1. 准备工作</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建WordPress目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /code/wordpress</span>
<span class="line"><span class="token builtin class-name">cd</span> /code/wordpress</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下载并解压WordPress（使用稳定版本）</span></span>
<span class="line"><span class="token comment"># wordpress-5.9.3-zh_CN.zip</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-nginx配置" tabindex="-1"><a class="header-anchor" href="#_2-nginx配置"><span>2. Nginx配置</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token comment"># /etc/nginx/conf.d/wordpress.conf</span></span>
<span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server_name</span> wordpress.linux0224.cn</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment"># 静态请求处理</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">root</span> /code/wordpress/</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">index</span> index.php index.html</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> ~* \\.php$</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment"># 动态PHP请求处理</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">root</span> /code/wordpress/</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_index</span> index.php</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_pass</span> 127.0.0.1:9000</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_param</span> SCRIPT_FILENAME <span class="token variable">$document_root</span><span class="token variable">$fastcgi_script_name</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">include</span> /etc/nginx/fastcgi_params</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-关键配置说明" tabindex="-1"><a class="header-anchor" href="#_3-关键配置说明"><span>3. 关键配置说明</span></a></h4><ol><li><strong>静态请求</strong>（.css, .js, .jpg等）由Nginx直接处理</li><li><strong>动态请求</strong>（.php）转发给PHP-FPM处理</li><li>必须分开配置才能正常显示样式</li></ol><hr><h3 id="五、数据库部署-db-51" tabindex="-1"><a class="header-anchor" href="#五、数据库部署-db-51"><span>五、数据库部署（db-51）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 清理旧YUM源，配置统一源</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> /etc/yum.repos.d/*.repo</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/61.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local-rpm]</span>
<span class="line">name=local yum repo</span>
<span class="line">baseurl=http://172.16.1.61:12345</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装MariaDB</span></span>
<span class="line">yum <span class="token function">install</span> mariadb-server mariadb <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start mariadb</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置root密码</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> password <span class="token string">&#39;123123&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建WordPress数据库</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p123123</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;CREATE DATABASE wordpress&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建远程访问用户</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p123123</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;GRANT ALL PRIVILEGES ON *.* TO &#39;wordpress_user&#39;@&#39;%&#39; IDENTIFIED BY &#39;123123&#39;&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="六、wordpress安装注意事项" tabindex="-1"><a class="header-anchor" href="#六、wordpress安装注意事项"><span>六、WordPress安装注意事项</span></a></h3><h4 id="_1-重要原则" tabindex="-1"><a class="header-anchor" href="#_1-重要原则"><span>1. 重要原则</span></a></h4><ol><li><strong>域名一致性</strong>：安装时使用的域名（<a href="https://wordpress.linux0224.cn/" target="_blank" rel="noopener noreferrer">wordpress.linux0224.cn</a>）必须固定</li><li><strong>数据写入数据库</strong>：配置信息会存入数据库，不可随意更改</li><li><strong>多节点数据同步</strong>：Web7和Web8使用同一数据库，确保数据一致</li></ol><h4 id="_2-初始化安装步骤" tabindex="-1"><a class="header-anchor" href="#_2-初始化安装步骤"><span>2. 初始化安装步骤</span></a></h4><ol><li>访问 <code>http://wordpress.linux0224.cn</code></li><li>填写数据库信息（db-51服务器）</li><li>生成 <code>wp-config.php</code> 配置文件</li><li>将此文件复制到Web8的相同位置</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 从Web7复制配置文件到Web8</span></span>
<span class="line"><span class="token function">scp</span> /code/wordpress/wp-config.php root@172.16.1.8:/code/wordpress/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="七、web8部署-自动化脚本" tabindex="-1"><a class="header-anchor" href="#七、web8部署-自动化脚本"><span>七、Web8部署（自动化脚本）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># install-nginx-php.sh</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建用户</span></span>
<span class="line"><span class="token function">groupadd</span> www <span class="token parameter variable">-g</span> <span class="token number">666</span></span>
<span class="line"><span class="token function">useradd</span> www <span class="token parameter variable">-s</span> /sbin/nologin <span class="token parameter variable">-M</span> <span class="token parameter variable">-u</span> <span class="token number">666</span> <span class="token parameter variable">-g</span> <span class="token number">666</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置YUM源</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/61.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local-rpm]</span>
<span class="line">name=local yum repo</span>
<span class="line">baseurl=http://172.16.1.61:12345</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装软件</span></span>
<span class="line">yum clean all</span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line">yum remove php-mysql-5.4 php php-fpm php-common <span class="token parameter variable">-y</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> php71w-cli php71w-common php71w-devel php71w-embedded <span class="token punctuation">\\</span></span>
<span class="line">php71w-gd php71w-mcrypt php71w-mbstring php71w-pdo php71w-xml <span class="token punctuation">\\</span></span>
<span class="line">php71w-fpm php71w-mysqlnd php71w-opcache php71w-pecl-memcached <span class="token punctuation">\\</span></span>
<span class="line">php71w-pecl-redis php71w-pecl-mongodb php71w-json <span class="token punctuation">\\</span></span>
<span class="line">php71w-pecl-apcu php71w-pecl-apcu-devel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置PHP-FPM</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/^user/c user = www&#39;</span> /etc/php-fpm.d/www.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/^group/c group = www&#39;</span> /etc/php-fpm.d/www.conf</span>
<span class="line">systemctl start php-fpm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置Nginx</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/conf.d/php.conf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">server {</span>
<span class="line">    listen 80;</span>
<span class="line">    server_name _;</span>
<span class="line">    location / {</span>
<span class="line">        root /php-code/;</span>
<span class="line">        fastcgi_pass 127.0.0.1:9000;</span>
<span class="line">        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;</span>
<span class="line">        include /etc/nginx/fastcgi_params;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建测试文件</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /php-code/</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /php-code/test-info.php <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">&lt;?php</span>
<span class="line">    phpinfo();</span>
<span class="line">?&gt;</span>
<span class="line">EOF</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> www.www /php-code/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动Nginx</span></span>
<span class="line"><span class="token function">mv</span> /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak</span>
<span class="line">systemctl start nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="八、负载均衡器-lb-5-部署" tabindex="-1"><a class="header-anchor" href="#八、负载均衡器-lb-5-部署"><span>八、负载均衡器（lb-5）部署</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 清理并配置YUM源</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> /etc/yum.repos.d/*.repo</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/61.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local-rpm]</span>
<span class="line">name=local yum repo</span>
<span class="line">baseurl=http://172.16.1.61:12345</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装Nginx</span></span>
<span class="line">yum clean all</span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start nginx</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nginx负载均衡配置" tabindex="-1"><a class="header-anchor" href="#nginx负载均衡配置"><span>Nginx负载均衡配置</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token comment"># 定义后端服务器组</span></span>
<span class="line"><span class="token directive"><span class="token keyword">upstream</span> my-web</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server</span> 172.16.1.7:80 weight=2</span><span class="token punctuation">;</span>  <span class="token comment"># Web7，权重2</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server</span> 172.16.1.8:80 weight=1</span><span class="token punctuation">;</span>  <span class="token comment"># Web8，权重1</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 负载均衡虚拟主机</span></span>
<span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server_name</span> wordpress.linux0224.cn</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://my-web/</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">include</span> /etc/nginx/proxy_params</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="代理参数文件" tabindex="-1"><a class="header-anchor" href="#代理参数文件"><span>代理参数文件</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token comment"># /etc/nginx/proxy_params</span></span>
<span class="line"><span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$http_host</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token directive"><span class="token keyword">proxy_connect_timeout</span> <span class="token number">30</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token directive"><span class="token keyword">proxy_send_timeout</span> <span class="token number">60</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token directive"><span class="token keyword">proxy_read_timeout</span> <span class="token number">60</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token directive"><span class="token keyword">proxy_buffering</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token directive"><span class="token keyword">proxy_buffer_size</span> <span class="token number">32k</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token directive"><span class="token keyword">proxy_buffers</span> <span class="token number">4</span> <span class="token number">128k</span></span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="九、故障分析与处理" tabindex="-1"><a class="header-anchor" href="#九、故障分析与处理"><span>九、故障分析与处理</span></a></h3><h4 id="_1-常见故障场景" tabindex="-1"><a class="header-anchor" href="#_1-常见故障场景"><span>1. 常见故障场景</span></a></h4><table><thead><tr><th style="text-align:left;">故障点</th><th style="text-align:left;">现象</th><th style="text-align:left;">影响</th><th style="text-align:left;">解决方案</th></tr></thead><tbody><tr><td style="text-align:left;">lb-5负载均衡器故障</td><td style="text-align:left;">用户完全无法访问网站</td><td style="text-align:left;">整个网站瘫痪</td><td style="text-align:left;">部署高可用负载均衡</td></tr><tr><td style="text-align:left;">后端Nginx服务故障</td><td style="text-align:left;">部分请求失败，日志显示连接拒绝</td><td style="text-align:left;">请求转发到健康节点</td><td style="text-align:left;">修复Nginx服务</td></tr><tr><td style="text-align:left;">PHP-FPM服务故障</td><td style="text-align:left;">返回502 Bad Gateway错误</td><td style="text-align:left;">动态内容无法访问</td><td style="text-align:left;">重启PHP-FPM</td></tr><tr><td style="text-align:left;">数据库故障</td><td style="text-align:left;">数据库连接错误</td><td style="text-align:left;">所有动态内容无法加载</td><td style="text-align:left;">修复数据库服务</td></tr></tbody></table><h4 id="_2-测试方法" tabindex="-1"><a class="header-anchor" href="#_2-测试方法"><span>2. 测试方法</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查后端节点连通性</span></span>
<span class="line"><span class="token function">curl</span> <span class="token number">172.16</span>.1.7:80</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 模拟PHP-FPM故障</span></span>
<span class="line"><span class="token function">pkill</span> <span class="token parameter variable">-9</span> php-fpm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查服务状态</span></span>
<span class="line">systemctl status nginx</span>
<span class="line">systemctl status php-fpm</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="十、重要注意事项" tabindex="-1"><a class="header-anchor" href="#十、重要注意事项"><span>十、重要注意事项</span></a></h3><h4 id="_1-域名管理" tabindex="-1"><a class="header-anchor" href="#_1-域名管理"><span>1. 域名管理</span></a></h4><ul><li>安装时使用固定域名（如<a href="https://wordpress.linux0224.cn/" target="_blank" rel="noopener noreferrer">wordpress.linux0224.cn</a>）</li><li>该域名信息会写入数据库，不可随意更改</li><li>所有节点使用相同域名配置</li></ul><h4 id="_2-虚拟主机配置" tabindex="-1"><a class="header-anchor" href="#_2-虚拟主机配置"><span>2. 虚拟主机配置</span></a></h4><ul><li>多域名虚拟主机通过不同配置文件实现</li><li>示例：wordpress.conf、wecenter.conf</li><li>所有配置使用80端口，通过server_name区分</li></ul><h4 id="_3-数据一致性" tabindex="-1"><a class="header-anchor" href="#_3-数据一致性"><span>3. 数据一致性</span></a></h4><ul><li>Web7和Web8使用同一数据库（db-51）</li><li>配置文件（wp-config.php）保持一致</li><li>上传文件需使用共享存储（如NFS）</li></ul><hr><h3 id="十一、常见问题解答" tabindex="-1"><a class="header-anchor" href="#十一、常见问题解答"><span>十一、常见问题解答</span></a></h3><h4 id="q-为什么轮询时两台机器都刷新日志" tabindex="-1"><a class="header-anchor" href="#q-为什么轮询时两台机器都刷新日志"><span>Q: 为什么轮询时两台机器都刷新日志？</span></a></h4><p>A: 一次完整的页面请求可能包含多个资源（HTML、CSS、JS、图片等），负载均衡器会对每个独立请求进行轮询分配，因此两台服务器日志都会有记录。</p><h4 id="q-后端服务器80端口被占用怎么办" tabindex="-1"><a class="header-anchor" href="#q-后端服务器80端口被占用怎么办"><span>Q: 后端服务器80端口被占用怎么办？</span></a></h4><p>A: 可以使用其他端口（如8080、8888等），在负载均衡器配置中相应调整端口号。</p><h4 id="q-如何实现多网站负载均衡" tabindex="-1"><a class="header-anchor" href="#q-如何实现多网站负载均衡"><span>Q: 如何实现多网站负载均衡？</span></a></h4><p>A: 基于多域名虚拟主机配置，为每个网站创建独立的upstream和server配置。</p><hr><h3 id="十二、总结" tabindex="-1"><a class="header-anchor" href="#十二、总结"><span>十二、总结</span></a></h3><p><strong>核心要点总结：</strong></p><ol><li>部署顺序：数据库 → 后端节点 → 负载均衡器</li><li>配置一致性：所有节点软件版本、配置需保持一致</li><li>域名固定：安装和使用阶段使用相同域名</li><li>故障排查：通过日志分析请求流向，定位故障点</li><li>自动化部署：编写脚本提高部署效率</li></ol><p>通过本实践文档，我们学习了WordPress负载均衡的完整部署流程，包括后端节点配置、数据库部署、负载均衡器配置等。掌握这些技能后，可以构建高可用的Web服务架构。</p><blockquote><p>下一步：学习更多运维技术，构建完整的运维知识体系。</p></blockquote>`,76)])])}const r=n(p,[["render",i]]),d=JSON.parse('{"path":"/04-Web%E6%9E%B6%E6%9E%84/04-%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1/55_wordpress%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E9%83%A8%E7%BD%B2.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"04-Web架构/04-负载均衡/55_wordpress负载均衡部署.md"}');export{r as comp,d as data};
