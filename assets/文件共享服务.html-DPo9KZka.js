import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function t(p,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="一、文件共享方案概览" tabindex="-1"><a class="header-anchor" href="#一、文件共享方案概览"><span>一、文件共享方案概览</span></a></h2><table><thead><tr><th style="text-align:left;">服务方案</th><th style="text-align:left;">特点</th><th style="text-align:left;">适用场景</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>FTP</strong></td><td style="text-align:left;">提供用户认证机制，标准文件传输协议</td><td style="text-align:left;">跨平台文件传输，匿名/认证下载</td></tr><tr><td style="text-align:left;"><strong>Python HTTP Server</strong></td><td style="text-align:left;">快速启动，无需配置</td><td style="text-align:left;">临时文件共享，简单测试</td></tr><tr><td style="text-align:left;"><strong>Nginx</strong></td><td style="text-align:left;">提供用户认证，反向代理，负载均衡</td><td style="text-align:left;">静态文件服务器，Web服务集成</td></tr><tr><td style="text-align:left;"><strong>Samba</strong></td><td style="text-align:left;">Linux-Windows共享，提供用户认证</td><td style="text-align:left;">混合环境文件共享，网络驱动器</td></tr><tr><td style="text-align:left;"><strong>NFS</strong></td><td style="text-align:left;">Linux之间共享，高性能</td><td style="text-align:left;">Linux集群，分布式存储</td></tr></tbody></table><p><strong>重点学习</strong>：</p><ul><li>NFS（主要生产环境使用）</li><li>Nginx（多功能集成）</li><li>Python HTTP Server（快速临时共享）</li></ul><h2 id="二、ftp服务搭建" tabindex="-1"><a class="header-anchor" href="#二、ftp服务搭建"><span>二、FTP服务搭建</span></a></h2><h3 id="服务端部署-vsftpd" tabindex="-1"><a class="header-anchor" href="#服务端部署-vsftpd"><span>服务端部署（vsftpd）</span></a></h3><h4 id="_1-安装软件" tabindex="-1"><a class="header-anchor" href="#_1-安装软件"><span>1. 安装软件</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token function">install</span> vsftpd <span class="token parameter variable">-y</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="_2-创建ftp用户" tabindex="-1"><a class="header-anchor" href="#_2-创建ftp用户"><span>2. 创建FTP用户</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建系统用户（FTP使用Linux用户认证）</span></span>
<span class="line"><span class="token function">useradd</span> nfs01</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;123123&#39;</span> <span class="token operator">|</span> <span class="token function">passwd</span> <span class="token parameter variable">--stdin</span> nfs01</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-修改配置文件" tabindex="-1"><a class="header-anchor" href="#_3-修改配置文件"><span>3. 修改配置文件</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查找配置文件</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ql</span> vsftpd <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;.conf$&#39;</span></span>
<span class="line"><span class="token comment"># 输出：/etc/vsftpd/vsftpd.conf</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 禁用匿名登录（安全考虑）</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/^anonymous_enable=YES/anonymous_enable=NO/&#39;</span> /etc/vsftpd/vsftpd.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加配置到文件末尾</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> /etc/vsftpd/vsftpd.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line"></span>
<span class="line"># 自定义配置（共享文件夹设置）</span>
<span class="line"># local_root: 指定本地用户的默认数据根目录</span>
<span class="line"># chroot_local_user: 禁锢用户到指定目录（禁止切换到其他目录）</span>
<span class="line"># allow_writeable_chroot: 允许用户在禁锢目录中写入数据</span>
<span class="line">local_root=/testftpd/</span>
<span class="line">chroot_local_user=YES</span>
<span class="line">allow_writeable_chroot=YES</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-创建共享目录并设置权限" tabindex="-1"><a class="header-anchor" href="#_4-创建共享目录并设置权限"><span>4. 创建共享目录并设置权限</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建共享目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /testftpd/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建测试文件</span></span>
<span class="line"><span class="token function">touch</span> /testftpd/1.png</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改目录权限（重要！）</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> nfs01:nfs01 /testftpd/</span>
<span class="line"><span class="token function">chmod</span> <span class="token number">755</span> /testftpd/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证权限</span></span>
<span class="line"><span class="token function">ls</span> <span class="token parameter variable">-ld</span> /testftpd/</span>
<span class="line"><span class="token comment"># 输出：drwxr-xr-x 2 nfs01 nfs01 56 Dec 10 16:26 /testftpd/</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_5-启动服务" tabindex="-1"><a class="header-anchor" href="#_5-启动服务"><span>5. 启动服务</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">systemctl restart vsftpd</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> vsftpd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证服务状态</span></span>
<span class="line"><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> vsftpd</span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> :21</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端连接测试" tabindex="-1"><a class="header-anchor" href="#客户端连接测试"><span>客户端连接测试</span></a></h3><h4 id="linux客户端" tabindex="-1"><a class="header-anchor" href="#linux客户端"><span>Linux客户端</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装FTP客户端</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token function">ftp</span> <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 连接FTP服务器</span></span>
<span class="line"><span class="token function">ftp</span> <span class="token number">10.0</span>.0.31  <span class="token comment"># 或 ftp nfs31</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 连接过程示例</span></span>
<span class="line">ftp<span class="token operator">&gt;</span> <span class="token function">open</span> <span class="token number">10.0</span>.0.31</span>
<span class="line">Name: nfs01</span>
<span class="line">Password: <span class="token number">123123</span></span>
<span class="line">ftp<span class="token operator">&gt;</span> <span class="token function">ls</span></span>
<span class="line">ftp<span class="token operator">&gt;</span> get <span class="token number">1</span>.png  <span class="token comment"># 下载文件</span></span>
<span class="line">ftp<span class="token operator">&gt;</span> put local_file  <span class="token comment"># 上传文件</span></span>
<span class="line">ftp<span class="token operator">&gt;</span> bye        <span class="token comment"># 退出</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="windows客户端" tabindex="-1"><a class="header-anchor" href="#windows客户端"><span>Windows客户端</span></a></h4><p><strong>命令行方式</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">C:\\Users\\用户名&gt;ftp 10.0.0.31</span>
<span class="line">用户名: nfs01</span>
<span class="line">密码: 123123</span>
<span class="line">ftp&gt; ls</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>图形化方式</strong>：</p><ol><li>打开文件资源管理器</li><li>在地址栏输入：<code>ftp://10.0.0.31/</code></li><li>输入用户名密码：nfs01 / 123123</li><li>即可图形化操作文件</li></ol><p><strong>使用专业工具</strong>：</p><ul><li>FileZilla</li><li>WinSCP</li><li>Xftp</li></ul><h2 id="三、samba服务搭建" tabindex="-1"><a class="header-anchor" href="#三、samba服务搭建"><span>三、Samba服务搭建</span></a></h2><h3 id="服务端部署" tabindex="-1"><a class="header-anchor" href="#服务端部署"><span>服务端部署</span></a></h3><h4 id="_1-安装软件-1" tabindex="-1"><a class="header-anchor" href="#_1-安装软件-1"><span>1. 安装软件</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token function">install</span> samba <span class="token parameter variable">-y</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="_2-配置samba" tabindex="-1"><a class="header-anchor" href="#_2-配置samba"><span>2. 配置Samba</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看配置文件</span></span>
<span class="line"><span class="token function">ls</span> /etc/samba/</span>
<span class="line"><span class="token comment"># 输出：lmhosts  smb.conf  smb.conf.example</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 备份原配置文件</span></span>
<span class="line"><span class="token function">cp</span> /etc/samba/smb.conf /etc/samba/smb.conf.bak</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加共享配置到文件末尾</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> /etc/samba/smb.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line"></span>
<span class="line">[smb_share]                 # 共享名（Windows中显示的名称）</span>
<span class="line">    comment = myself share dir  # 共享描述</span>
<span class="line">    path = /mysmb            # 共享目录路径</span>
<span class="line">    guest ok = no            # 禁止匿名访问</span>
<span class="line">    public = no              # 非公共共享</span>
<span class="line">    writable = yes           # 可写权限</span>
<span class="line">    create mask = 0644       # 创建文件默认权限</span>
<span class="line">    directory mask = 0755    # 创建目录默认权限</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-创建samba用户和共享目录" tabindex="-1"><a class="header-anchor" href="#_3-创建samba用户和共享目录"><span>3. 创建Samba用户和共享目录</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建系统用户</span></span>
<span class="line"><span class="token function">useradd</span> samba01</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;123123&#39;</span> <span class="token operator">|</span> <span class="token function">passwd</span> <span class="token parameter variable">--stdin</span> samba01</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将系统用户添加为Samba用户</span></span>
<span class="line"><span class="token comment"># -a：添加用户，-u：指定用户名</span></span>
<span class="line">pdbedit <span class="token parameter variable">-a</span> <span class="token parameter variable">-u</span> samba01</span>
<span class="line"><span class="token comment"># 输入密码：123123</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建共享目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /mysmb</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置目录权限</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> samba01:samba01 /mysmb/</span>
<span class="line"><span class="token function">chmod</span> <span class="token number">755</span> /mysmb/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建测试文件</span></span>
<span class="line"><span class="token function">touch</span> /mysmb/3.png</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-启动服务" tabindex="-1"><a class="header-anchor" href="#_4-启动服务"><span>4. 启动服务</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 启动Samba服务</span></span>
<span class="line">systemctl start smb</span>
<span class="line">systemctl start nmb  <span class="token comment"># NetBIOS名称服务</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> smb nmb</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证服务状态</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> smb</span>
<span class="line"><span class="token comment"># 输出：</span></span>
<span class="line"><span class="token comment"># tcp        0      0 0.0.0.0:445             0.0.0.0:*    LISTEN</span></span>
<span class="line"><span class="token comment"># tcp        0      0 0.0.0.0:139             0.0.0.0:*    LISTEN</span></span>
<span class="line"></span>
<span class="line"><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> smb</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="samba防火墙配置-如果需要" tabindex="-1"><a class="header-anchor" href="#samba防火墙配置-如果需要"><span>Samba防火墙配置（如果需要）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 开放Samba端口</span></span>
<span class="line">firewall-cmd <span class="token parameter variable">--permanent</span> --add-service<span class="token operator">=</span>samba</span>
<span class="line">firewall-cmd <span class="token parameter variable">--reload</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 或手动开放端口</span></span>
<span class="line">firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">139</span>/tcp</span>
<span class="line">firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">445</span>/tcp</span>
<span class="line">firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">137</span>/udp</span>
<span class="line">firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">138</span>/udp</span>
<span class="line">firewall-cmd <span class="token parameter variable">--reload</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端连接测试-1" tabindex="-1"><a class="header-anchor" href="#客户端连接测试-1"><span>客户端连接测试</span></a></h3><h4 id="linux客户端-1" tabindex="-1"><a class="header-anchor" href="#linux客户端-1"><span>Linux客户端</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装Samba客户端</span></span>
<span class="line">yum <span class="token function">install</span> samba-client <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看可用的共享</span></span>
<span class="line">smbclient <span class="token parameter variable">-L</span> //10.0.0.31/ <span class="token parameter variable">-U</span> samba01</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 连接共享目录</span></span>
<span class="line">smbclient //10.0.0.31/smb_share <span class="token parameter variable">-U</span> samba01</span>
<span class="line"><span class="token comment"># 输入密码：123123</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Samba客户端常用命令</span></span>
<span class="line">smb<span class="token operator">&gt;</span> ?          <span class="token comment"># 查看所有命令</span></span>
<span class="line">smb<span class="token operator">&gt;</span> <span class="token function">ls</span>         <span class="token comment"># 列出文件</span></span>
<span class="line">smb<span class="token operator">&gt;</span> get <span class="token function">file</span>   <span class="token comment"># 下载文件</span></span>
<span class="line">smb<span class="token operator">&gt;</span> put <span class="token function">file</span>   <span class="token comment"># 上传文件</span></span>
<span class="line">smb<span class="token operator">&gt;</span> <span class="token function">mkdir</span> <span class="token function">dir</span>  <span class="token comment"># 创建目录</span></span>
<span class="line">smb<span class="token operator">&gt;</span> <span class="token function">rm</span> <span class="token function">file</span>    <span class="token comment"># 删除文件</span></span>
<span class="line">smb<span class="token operator">&gt;</span> <span class="token builtin class-name">exit</span>       <span class="token comment"># 退出</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="windows客户端-1" tabindex="-1"><a class="header-anchor" href="#windows客户端-1"><span>Windows客户端</span></a></h4><ol><li><p><strong>运行窗口方式</strong>：</p><ul><li>Win + R 打开运行窗口</li><li>输入：<code>\\\\10.0.0.31\\smb_share</code></li><li>输入用户名：samba01，密码：123123</li></ul></li><li><p><strong>文件资源管理器</strong>：</p><ul><li>打开&quot;此电脑&quot;</li><li>地址栏输入：<code>\\\\10.0.0.31\\smb_share</code></li><li>或点击&quot;映射网络驱动器&quot;</li></ul></li><li><p><strong>命令行方式</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">net use Z: \\\\10.0.0.31\\smb_share /user:samba01 123123</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ol><h2 id="四、python简易http服务器" tabindex="-1"><a class="header-anchor" href="#四、python简易http服务器"><span>四、Python简易HTTP服务器</span></a></h2><h3 id="快速启动文件共享" tabindex="-1"><a class="header-anchor" href="#快速启动文件共享"><span>快速启动文件共享</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># Python 2.x</span></span>
<span class="line">python <span class="token parameter variable">-m</span> SimpleHTTPServer <span class="token number">8000</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Python 3.x</span></span>
<span class="line">python3 <span class="token parameter variable">-m</span> http.server <span class="token number">8000</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定目录共享</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /path/to/share <span class="token operator">&amp;&amp;</span> python3 <span class="token parameter variable">-m</span> http.server <span class="token number">8000</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 允许外部访问（默认只允许本地）</span></span>
<span class="line">python3 <span class="token parameter variable">-m</span> http.server <span class="token number">8000</span> <span class="token parameter variable">--bind</span> <span class="token number">0.0</span>.0.0</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="访问方式" tabindex="-1"><a class="header-anchor" href="#访问方式"><span>访问方式</span></a></h3><ul><li>浏览器访问：<code>http://服务器IP:8000</code></li><li>支持目录浏览和文件下载</li><li>无认证机制（适合临时、内部使用）</li></ul><h2 id="五、nginx文件服务器" tabindex="-1"><a class="header-anchor" href="#五、nginx文件服务器"><span>五、Nginx文件服务器</span></a></h2><h3 id="基础配置示例" tabindex="-1"><a class="header-anchor" href="#基础配置示例"><span>基础配置示例</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">server {</span>
<span class="line">    listen       80;</span>
<span class="line">    server_name  fileserver.example.com;</span>
<span class="line">    </span>
<span class="line">    # 开启目录浏览</span>
<span class="line">    autoindex on;</span>
<span class="line">    autoindex_exact_size off;</span>
<span class="line">    autoindex_localtime on;</span>
<span class="line">    </span>
<span class="line">    # 文件下载目录</span>
<span class="line">    location /downloads/ {</span>
<span class="line">        alias /data/files/;</span>
<span class="line">        </span>
<span class="line">        # 添加简单认证</span>
<span class="line">        auth_basic &quot;Restricted Access&quot;;</span>
<span class="line">        auth_basic_user_file /etc/nginx/.htpasswd;</span>
<span class="line">    }</span>
<span class="line">    </span>
<span class="line">    # 限制文件类型</span>
<span class="line">    location ~* \\.(txt|log|conf)$ {</span>
<span class="line">        deny all;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建密码文件" tabindex="-1"><a class="header-anchor" href="#创建密码文件"><span>创建密码文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装htpasswd工具</span></span>
<span class="line">yum <span class="token function">install</span> httpd-tools <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建认证文件</span></span>
<span class="line">htpasswd <span class="token parameter variable">-c</span> /etc/nginx/.htpasswd user1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、服务对比与选择建议" tabindex="-1"><a class="header-anchor" href="#六、服务对比与选择建议"><span>六、服务对比与选择建议</span></a></h2><table><thead><tr><th style="text-align:left;">特性</th><th style="text-align:left;">FTP</th><th style="text-align:left;">Samba</th><th style="text-align:left;">Nginx</th><th style="text-align:left;">Python HTTP</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>认证机制</strong></td><td style="text-align:left;">✓</td><td style="text-align:left;">✓</td><td style="text-align:left;">✓</td><td style="text-align:left;">✗</td></tr><tr><td style="text-align:left;"><strong>跨平台</strong></td><td style="text-align:left;">✓</td><td style="text-align:left;">✓（Win友好）</td><td style="text-align:left;">✓</td><td style="text-align:left;">✓</td></tr><tr><td style="text-align:left;"><strong>性能</strong></td><td style="text-align:left;">中等</td><td style="text-align:left;">中等</td><td style="text-align:left;">高</td><td style="text-align:left;">低</td></tr><tr><td style="text-align:left;"><strong>配置复杂度</strong></td><td style="text-align:left;">简单</td><td style="text-align:left;">中等</td><td style="text-align:left;">中等</td><td style="text-align:left;">简单</td></tr><tr><td style="text-align:left;"><strong>适用场景</strong></td><td style="text-align:left;">文件传输</td><td style="text-align:left;">Win-Linux共享</td><td style="text-align:left;">静态文件服务</td><td style="text-align:left;">临时共享</td></tr><tr><td style="text-align:left;"><strong>推荐指数</strong></td><td style="text-align:left;">★★★★☆</td><td style="text-align:left;">★★★★☆</td><td style="text-align:left;">★★★★★</td><td style="text-align:left;">★★☆☆☆</td></tr></tbody></table>`,55)])])}const d=n(i,[["render",t]]),r=JSON.parse('{"path":"/03-%E7%BD%91%E7%BB%9C%E6%9C%8D%E5%8A%A1/03-%E6%96%87%E4%BB%B6%E5%85%B1%E4%BA%AB%E6%9C%8D%E5%8A%A1/%E6%96%87%E4%BB%B6%E5%85%B1%E4%BA%AB%E6%9C%8D%E5%8A%A1.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"03-网络服务/03-文件共享服务/文件共享服务.md"}');export{d as comp,r as data};
