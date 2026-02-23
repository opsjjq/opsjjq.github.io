import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function t(p,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="lamp-架构与阿里云" tabindex="-1"><a class="header-anchor" href="#lamp-架构与阿里云"><span>LAMP 架构与阿里云</span></a></h1><hr><h2 id="一、lamp-架构概述" tabindex="-1"><a class="header-anchor" href="#一、lamp-架构概述"><span>一、LAMP 架构概述</span></a></h2><h3 id="_1-什么是-lamp" tabindex="-1"><a class="header-anchor" href="#_1-什么是-lamp"><span>1. 什么是 LAMP</span></a></h3><p>LAMP 是一组用于搭建动态网站的开源软件组合：</p><ul><li><strong>L</strong>：Linux 操作系统</li><li><strong>A</strong>：Apache HTTP Server</li><li><strong>M</strong>：MySQL/MariaDB 数据库</li><li><strong>P</strong>：PHP/Python/Perl 编程语言</li></ul><h3 id="_2-常见架构变体" tabindex="-1"><a class="header-anchor" href="#_2-常见架构变体"><span>2. 常见架构变体</span></a></h3><table><thead><tr><th style="text-align:left;">架构</th><th style="text-align:left;">组件组合</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>LAMP</strong></td><td style="text-align:left;">Linux + Apache + MySQL + PHP</td></tr><tr><td style="text-align:left;"><strong>LNMP</strong></td><td style="text-align:left;">Linux + Nginx + MySQL + PHP</td></tr><tr><td style="text-align:left;"><strong>LNMPA</strong></td><td style="text-align:left;">Linux + Nginx + MySQL + PHP + Apache</td></tr></tbody></table><h3 id="_3-组件功能说明" tabindex="-1"><a class="header-anchor" href="#_3-组件功能说明"><span>3. 组件功能说明</span></a></h3><table><thead><tr><th style="text-align:left;">组件</th><th style="text-align:left;">功能</th><th style="text-align:left;">特点</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>Apache</strong></td><td style="text-align:left;">Web 服务器，处理 HTTP 请求</td><td style="text-align:left;">稳定、模块丰富、兼容性好</td></tr><tr><td style="text-align:left;"><strong>Nginx</strong></td><td style="text-align:left;">Web 服务器/反向代理</td><td style="text-align:left;">高并发、内存占用小</td></tr><tr><td style="text-align:left;"><strong>MySQL</strong></td><td style="text-align:left;">关系型数据库</td><td style="text-align:left;">开源、性能好、社区活跃</td></tr><tr><td style="text-align:left;"><strong>PHP</strong></td><td style="text-align:left;">服务端脚本语言</td><td style="text-align:left;">简单易学、Web 开发首选</td></tr><tr><td style="text-align:left;"><strong>Python</strong></td><td style="text-align:left;">通用编程语言</td><td style="text-align:left;">简洁优雅、全栈开发</td></tr></tbody></table><hr><h2 id="二、阿里云服务器初始化" tabindex="-1"><a class="header-anchor" href="#二、阿里云服务器初始化"><span>二、阿里云服务器初始化</span></a></h2><h3 id="_1-远程连接配置" tabindex="-1"><a class="header-anchor" href="#_1-远程连接配置"><span>1. 远程连接配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. SSH 连接阿里云 ECS</span></span>
<span class="line"><span class="token function">ssh</span> root@your-server-ip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 修改命令提示符</span></span>
<span class="line"><span class="token function">vim</span> /etc/profile.d/env.sh</span>
<span class="line"><span class="token comment"># 添加内容：</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PS1</span></span><span class="token operator">=</span><span class="token string">&quot;[\\u@yun \\W]\\$ &quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 使配置生效</span></span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile.d/env.sh</span>
<span class="line"><span class="token comment"># 效果：[root@yun ~]#</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-安全配置优化" tabindex="-1"><a class="header-anchor" href="#_2-安全配置优化"><span>2. 安全配置优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 关闭 SELinux</span></span>
<span class="line">getenforce                     <span class="token comment"># 查看 SELinux 状态</span></span>
<span class="line">setenforce <span class="token number">0</span>                   <span class="token comment"># 临时关闭</span></span>
<span class="line"><span class="token function">vim</span> /etc/selinux/config        <span class="token comment"># 永久关闭</span></span>
<span class="line"><span class="token comment"># 修改：SELINUX=disabled</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 关闭防火墙</span></span>
<span class="line">systemctl stop firewalld       <span class="token comment"># 停止防火墙</span></span>
<span class="line">systemctl disable firewalld    <span class="token comment"># 禁用开机启动</span></span>
<span class="line">iptables <span class="token parameter variable">-F</span>                    <span class="token comment"># 清空 iptables 规则</span></span>
<span class="line">iptables-save                  <span class="token comment"># 保存规则</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 修改 SSH 配置（可选）</span></span>
<span class="line"><span class="token function">vim</span> /etc/ssh/sshd_config</span>
<span class="line"><span class="token comment"># Port 2222                    # 修改默认端口</span></span>
<span class="line"><span class="token comment"># PermitRootLogin no          # 禁止 root 登录</span></span>
<span class="line"><span class="token comment"># PasswordAuthentication no   # 禁用密码登录（使用密钥）</span></span>
<span class="line">systemctl restart sshd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、lamp-环境部署" tabindex="-1"><a class="header-anchor" href="#三、lamp-环境部署"><span>三、LAMP 环境部署</span></a></h2><h3 id="_1-apache-安装与配置" tabindex="-1"><a class="header-anchor" href="#_1-apache-安装与配置"><span>1. Apache 安装与配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 安装 Apache</span></span>
<span class="line">yum <span class="token function">install</span> httpd <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 修改主配置文件</span></span>
<span class="line"><span class="token function">vim</span> /etc/httpd/conf/httpd.conf</span>
<span class="line"><span class="token comment"># 主要修改项：</span></span>
<span class="line"><span class="token comment"># ServerName www.example.com:80   # 取消注释并修改</span></span>
<span class="line"><span class="token comment"># DirectoryIndex index.html index.php  # 添加 index.php</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 启动 Apache 服务</span></span>
<span class="line">systemctl start httpd</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> httpd</span>
<span class="line">systemctl status httpd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 测试 Apache</span></span>
<span class="line"><span class="token function">curl</span> localhost</span>
<span class="line"><span class="token comment"># 或浏览器访问服务器 IP</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-mysql-安装与配置" tabindex="-1"><a class="header-anchor" href="#_2-mysql-安装与配置"><span>2. MySQL 安装与配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 下载 MySQL 官方 YUM 源</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /etc/yum.repos.d/</span>
<span class="line"><span class="token function">wget</span> https://repo.mysql.com//mysql-community-release-el7-5.noarch.rpm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 安装 MySQL 源</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> mysql-community-release-el7-5.noarch.rpm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 安装 MySQL 服务器</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> mysql-community-server</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 启动 MySQL</span></span>
<span class="line">systemctl start mysqld</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> mysqld</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 安全初始化</span></span>
<span class="line">mysql_secure_installation</span>
<span class="line"><span class="token comment"># 按提示设置：</span></span>
<span class="line"><span class="token comment"># - 设置 root 密码</span></span>
<span class="line"><span class="token comment"># - 移除匿名用户 (y)</span></span>
<span class="line"><span class="token comment"># - 禁止 root 远程登录 (n - 生产环境建议 y)</span></span>
<span class="line"><span class="token comment"># - 移除 test 数据库 (y)</span></span>
<span class="line"><span class="token comment"># - 重新加载权限表 (y)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6. 登录测试</span></span>
<span class="line">mysql <span class="token parameter variable">-u</span> root <span class="token parameter variable">-p</span></span>
<span class="line"><span class="token comment"># 输入密码后执行：</span></span>
<span class="line">show databases<span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">select</span> version<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token builtin class-name">exit</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-php-安装与配置" tabindex="-1"><a class="header-anchor" href="#_3-php-安装与配置"><span>3. PHP 安装与配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 安装 PHP 及常用扩展</span></span>
<span class="line">yum <span class="token function">install</span> php <span class="token parameter variable">-y</span></span>
<span class="line">yum <span class="token function">install</span> php-mysql php-gd php-mbstring php-xml <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 重启 Apache 加载 PHP 模块</span></span>
<span class="line">systemctl restart httpd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 测试 PHP 配置</span></span>
<span class="line"><span class="token function">vim</span> /var/www/html/info.php</span>
<span class="line"><span class="token comment"># 内容：</span></span>
<span class="line"><span class="token operator">&lt;</span>?php</span>
<span class="line">phpinfo<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">?<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 访问测试</span></span>
<span class="line"><span class="token comment"># 浏览器访问：http://服务器IP/info.php</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、部署-discuz-论坛" tabindex="-1"><a class="header-anchor" href="#四、部署-discuz-论坛"><span>四、部署 Discuz 论坛</span></a></h2><h3 id="_1-准备工作" tabindex="-1"><a class="header-anchor" href="#_1-准备工作"><span>1. 准备工作</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 创建网站目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /var/www/html/discuz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 下载 Discuz</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /tmp</span>
<span class="line"><span class="token function">wget</span> https://foruda.gitee.com/attach_file/1684563897456560193/discuz_x3.4_sc_utf8_20230520.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 安装解压工具</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token function">unzip</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 解压文件</span></span>
<span class="line"><span class="token function">unzip</span> discuz_x3.4_sc_utf8_20230520.zip</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-安装-discuz" tabindex="-1"><a class="header-anchor" href="#_2-安装-discuz"><span>2. 安装 Discuz</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 复制文件到网站目录</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-r</span> upload/* /var/www/html/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 设置目录权限</span></span>
<span class="line"><span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">777</span> /var/www/html/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 创建数据库</span></span>
<span class="line">mysql <span class="token parameter variable">-u</span> root <span class="token parameter variable">-p</span></span>
<span class="line"><span class="token comment"># SQL 命令：</span></span>
<span class="line">CREATE DATABASE discuz DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci<span class="token punctuation">;</span></span>
<span class="line">GRANT ALL PRIVILEGES ON discuz.* TO <span class="token string">&#39;discuz&#39;</span>@<span class="token string">&#39;localhost&#39;</span> IDENTIFIED BY <span class="token string">&#39;你的密码&#39;</span><span class="token punctuation">;</span></span>
<span class="line">FLUSH PRIVILEGES<span class="token punctuation">;</span></span>
<span class="line"><span class="token builtin class-name">exit</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 解决可能的问题</span></span>
<span class="line">yum <span class="token function">install</span> php-mysqli <span class="token parameter variable">-y</span></span>
<span class="line">systemctl restart httpd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-web-安装向导" tabindex="-1"><a class="header-anchor" href="#_3-web-安装向导"><span>3. Web 安装向导</span></a></h3><ol><li>浏览器访问：<code>http://服务器IP/install</code></li><li>同意许可协议</li><li>环境检查通过后继续</li><li>配置数据库信息： <ul><li>数据库服务器：localhost</li><li>数据库名：discuz</li><li>用户名：discuz</li><li>密码：设置的密码</li></ul></li><li>管理员账号配置</li><li>完成安装</li></ol><h3 id="_4-安全优化" tabindex="-1"><a class="header-anchor" href="#_4-安全优化"><span>4. 安全优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 恢复目录权限</span></span>
<span class="line"><span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">755</span> /var/www/html/</span>
<span class="line"><span class="token function">chmod</span> <span class="token number">644</span> /var/www/html/config/config_global.php</span>
<span class="line"><span class="token function">chmod</span> <span class="token number">644</span> /var/www/html/config/config_ucenter.php</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 删除安装目录</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/www/html/install/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 删除测试文件</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> /var/www/html/info.php</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、阿里云安全组配置" tabindex="-1"><a class="header-anchor" href="#五、阿里云安全组配置"><span>五、阿里云安全组配置</span></a></h2><h3 id="_1-开放必要端口" tabindex="-1"><a class="header-anchor" href="#_1-开放必要端口"><span>1. 开放必要端口</span></a></h3><p>需要在阿里云控制台配置安全组规则：</p><table><thead><tr><th style="text-align:left;">端口/协议</th><th style="text-align:left;">用途</th><th style="text-align:left;">建议</th></tr></thead><tbody><tr><td style="text-align:left;">22/tcp</td><td style="text-align:left;">SSH 远程连接</td><td style="text-align:left;">开放</td></tr><tr><td style="text-align:left;">80/tcp</td><td style="text-align:left;">HTTP 网站访问</td><td style="text-align:left;">开放</td></tr><tr><td style="text-align:left;">443/tcp</td><td style="text-align:left;">HTTPS 安全访问</td><td style="text-align:left;">可选</td></tr><tr><td style="text-align:left;">3306/tcp</td><td style="text-align:left;">MySQL 远程连接</td><td style="text-align:left;">生产环境不建议</td></tr><tr><td style="text-align:left;">21/tcp</td><td style="text-align:left;">FTP 文件传输</td><td style="text-align:left;">可选</td></tr><tr><td style="text-align:left;">6379/tcp</td><td style="text-align:left;">Redis 数据库</td><td style="text-align:left;">可选</td></tr></tbody></table><h3 id="_2-安全组配置步骤" tabindex="-1"><a class="header-anchor" href="#_2-安全组配置步骤"><span>2. 安全组配置步骤</span></a></h3><ol><li>登录阿里云控制台</li><li>进入 ECS 实例管理</li><li>选择&quot;安全组&quot;配置</li><li>添加安全组规则： <ul><li>授权类型：自定义 TCP</li><li>端口范围：80/80</li><li>授权对象：0.0.0.0/0（或指定 IP 段）</li></ul></li></ol>`,41)])])}const d=n(i,[["render",t]]),r=JSON.parse('{"path":"/04-Web%E6%9E%B6%E6%9E%84/01-lamp%E6%9E%B6%E6%9E%84/lamp%E6%9E%B6%E6%9E%84%E4%B8%8E%E9%98%BF%E9%87%8C%E4%BA%91.html","title":"LAMP 架构与阿里云","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"04-Web架构/01-lamp架构/lamp架构与阿里云.md"}');export{d as comp,r as data};
