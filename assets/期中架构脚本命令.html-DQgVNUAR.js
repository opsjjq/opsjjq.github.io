import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="web负载均衡架构" tabindex="-1"><a class="header-anchor" href="#web负载均衡架构"><span>web负载均衡架构</span></a></h1><blockquote><p>本文档仅包含各机器上直接执行的脚本/命令，不含 Ansible 剧本。</p></blockquote><hr><h2 id="_0-公钥分发与免密登录-master61" tabindex="-1"><a class="header-anchor" href="#_0-公钥分发与免密登录-master61"><span>0. 公钥分发与免密登录（master61）</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> /my_sh <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> /my_sh</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span>01nologin.sh <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line">echo &quot;正在创建公私钥...&quot;</span>
<span class="line">if [ -f /root/.ssh/id_rsa ]</span>
<span class="line">then</span>
<span class="line">  echo &quot;密钥对已经存在,请检查！&quot;</span>
<span class="line">else</span>
<span class="line">  ssh-keygen -f /root/.ssh/id_rsa -N &#39;&#39; &gt; /tmp/create_ssh.log 2&gt;&amp;1</span>
<span class="line">fi</span>
<span class="line"></span>
<span class="line">echo &quot;正在分发公钥中...分发的机器列表是同网段下的{5,6,7,8,31,41,51}机器&quot;</span>
<span class="line">for ip in {5,6,7,8,31,41,51}</span>
<span class="line">do</span>
<span class="line">  sshpass -p &#39;qwe&#39; ssh-copy-id 172.16.1.\${ip} -o StrictHostKeyChecking=no &gt; /tmp/create_ssh.log 2&gt;&amp;1</span>
<span class="line">  echo &quot;正在验证免密登录结果中....&quot;</span>
<span class="line">  echo &quot;远程获取到主机名: $(ssh 172.16.1.\${ip} hostname)&quot;</span>
<span class="line">done</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_1-部署-61-机器本地-yum-仓库" tabindex="-1"><a class="header-anchor" href="#_1-部署-61-机器本地-yum-仓库"><span>1. 部署 61 机器本地 yum 仓库</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> /opt/yumrpm/</span>
<span class="line"><span class="token comment"># 在文件夹内准备好 rpm 文件</span></span>
<span class="line">yum <span class="token function">install</span> createrepo <span class="token parameter variable">-y</span></span>
<span class="line">createrepo /opt/yumrpm/</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/local.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local61]</span>
<span class="line">name=Local YUM Repository on 61</span>
<span class="line">baseurl=file:///opt/yumrpm</span>
<span class="line">gpgcheck=0</span>
<span class="line">enabled=1</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start nginx</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> nginx</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/conf.d/rpm.conf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">server {</span>
<span class="line">    listen 12345;</span>
<span class="line">    server_name _;</span>
<span class="line">    root /opt/yumrpm/;</span>
<span class="line">    autoindex on;</span>
<span class="line">    autoindex_exact_size off;</span>
<span class="line">    autoindex_localtime on;</span>
<span class="line">    charset utf-8;</span>
<span class="line">    include /etc/nginx/mime.types;</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl restart nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_2-配置-ntp-时间同步-61" tabindex="-1"><a class="header-anchor" href="#_2-配置-ntp-时间同步-61"><span>2. 配置 NTP 时间同步（61）</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token function">install</span> ntp <span class="token parameter variable">-y</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/server 0.centos.pool.ntp.org iburst/i server ntp.aliyun.com iburst prefer\\nserver cp.pool.ntp.org iburst&#39;</span> /etc/ntp.conf</span>
<span class="line">systemctl start ntpd</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> ntpd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_3-脚本命令-按角色" tabindex="-1"><a class="header-anchor" href="#_3-脚本命令-按角色"><span>3. 脚本命令（按角色）</span></a></h2><h3 id="db51-—-mysql" tabindex="-1"><a class="header-anchor" href="#db51-—-mysql"><span>db51 — MySQL</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token parameter variable">-y</span> localinstall http://mirrors.ustc.edu.cn/mysql-repo/mysql57-community-release-el7.rpm</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/gpgcheck=1/c gpgcheck=0&#39;</span> /etc/yum.repos.d/mysql-community*</span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> mysql-community-server</span>
<span class="line"></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s@--initialize @--initialize-insecure @g&quot;</span> /usr/bin/mysqld_pre_systemd</span>
<span class="line"></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> mysqld</span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;create database wordpress default charset &#39;utf8&#39;;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;set global validate_password_policy=LOW;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;create user &#39;wang&#39;@&#39;%&#39; identified by &#39;qwe123123&#39;;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;grant all on wordpress.* to &#39;wang&#39;@&#39;%&#39;;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;flush privileges;&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="db51-—-redis-jumpserver-用" tabindex="-1"><a class="header-anchor" href="#db51-—-redis-jumpserver-用"><span>db51 — Redis（jumpserver 用）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token parameter variable">-y</span> <span class="token function">install</span> epel-release <span class="token function">wget</span> <span class="token function">make</span> gcc-c++</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt <span class="token punctuation">;</span> <span class="token function">wget</span> https://download.redis.io/releases/redis-6.2.4.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> redis-6.2.4.tar.gz</span>
<span class="line"><span class="token builtin class-name">cd</span> redis-6.2.4</span>
<span class="line"><span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span> <span class="token assign-left variable">PREFIX</span><span class="token operator">=</span>/usr/local/redis</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/usr/local/redis/bin/&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token function">cp</span> /opt/redis-6.2.4/redis.conf /etc/redis.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s/bind 127.0.0.1/bind 0.0.0.0/g&quot;</span> /etc/redis.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s/daemonize no/daemonize yes/g&quot;</span> /etc/redis.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;561i maxmemory-policy allkeys-lru&quot;</span> /etc/redis.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;481i requirepass qwe123123&quot;</span> /etc/redis.conf</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span>/etc/systemd/system/redis.service <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[Unit]</span>
<span class="line">Description=Redis persistent key-value database</span>
<span class="line">After=network.target</span>
<span class="line">After=network-online.target</span>
<span class="line">Wants=network-online.target</span>
<span class="line"></span>
<span class="line">[Service]</span>
<span class="line">Type=forking</span>
<span class="line">PIDFile=/var/run/redis_6379.pid</span>
<span class="line">ExecStart=/usr/local/redis/bin/redis-server /etc/redis.conf</span>
<span class="line">ExecReload=/bin/kill -s HUP <span class="token variable">$MAINPID</span></span>
<span class="line">ExecStop=/bin/kill -s QUIT <span class="token variable">$MAINPID</span></span>
<span class="line"></span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">EOF</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> redis</span>
<span class="line">systemctl start redis</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="rsync41" tabindex="-1"><a class="header-anchor" href="#rsync41"><span>rsync41</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token function">install</span> <span class="token function">rsync</span> <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/rsyncd.conf <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">uid = www</span>
<span class="line">gid = www</span>
<span class="line">port = 873</span>
<span class="line">fake super = yes</span>
<span class="line">use chroot = no</span>
<span class="line">max connections = 200</span>
<span class="line">timeout = 600</span>
<span class="line">ignore errors</span>
<span class="line">read only = false</span>
<span class="line">list = false</span>
<span class="line">auth users = rsync_backup</span>
<span class="line">secrets file = /etc/rsync.passwd</span>
<span class="line">log file = /var/log/rsyncd.log</span>
<span class="line"></span>
<span class="line">[backup]</span>
<span class="line">comment = backup directionary</span>
<span class="line">path = /backup</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">useradd</span> <span class="token parameter variable">-u</span> <span class="token number">1000</span> <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /sbin/nologin www</span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /backup</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> www.www /backup</span>
<span class="line"><span class="token function">touch</span> /etc/rsync.passwd</span>
<span class="line"><span class="token function">chmod</span> <span class="token number">600</span> /etc/rsync.passwd</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;rsync_backup:qwe123&quot;</span> <span class="token operator">&gt;</span> /etc/rsync.passwd</span>
<span class="line">systemctl restart rsyncd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="nfs31" tabindex="-1"><a class="header-anchor" href="#nfs31"><span>nfs31</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token function">install</span> nfs-utils rpcbind <span class="token parameter variable">-y</span></span>
<span class="line"><span class="token function">mkdir</span> /nfs-data</span>
<span class="line"><span class="token function">useradd</span> www <span class="token parameter variable">-u</span> <span class="token number">1500</span> <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /sbin/nologin</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> www.www /nfs-data/</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/exports <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">/nfs-data 172.16.1.0/24(rw,sync,all_squash,anonuid=1500,anongid=1500)</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> rpcbind.service</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> rpcbind.socket</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> nfs</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 实时同步到 rsync41</span></span>
<span class="line">yum <span class="token function">install</span> lsyncd <span class="token parameter variable">-y</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span>/etc/lsyncd.conf <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">settings {</span>
<span class="line">    logfile      = &quot;/var/log/lsyncd/lsyncd.log&quot;,</span>
<span class="line">    statusFile   = &quot;/var/log/lsyncd/lsyncd.status&quot;,</span>
<span class="line">    inotifyMode  = &quot;CloseWrite&quot;,</span>
<span class="line">    maxProcesses = 8,</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">sync {</span>
<span class="line">    default.rsync,</span>
<span class="line">    source    = &quot;/nfs-data&quot;,</span>
<span class="line">    target    = &quot;rsync_backup@172.16.1.41::backup&quot;,</span>
<span class="line">    delete    = true,</span>
<span class="line">    exclude   = {&quot;.*&quot;},</span>
<span class="line">    delay     = 1,</span>
<span class="line">    rsync     = {</span>
<span class="line">        binary        = &quot;/usr/bin/rsync&quot;,</span>
<span class="line">        archive       = true,</span>
<span class="line">        compress      = true,</span>
<span class="line">        verbose       = true,</span>
<span class="line">        password_file = &quot;/etc/rsync.pwd&quot;,</span>
<span class="line">        _extra        = {&quot;--bwlimit=200&quot;}</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;qwe123&#39;</span> <span class="token operator">&gt;</span> /etc/rsync.pwd</span>
<span class="line"><span class="token function">chmod</span> <span class="token number">600</span> /etc/rsync.pwd</span>
<span class="line">systemctl start lsyncd</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> lsyncd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试挂载-nfs-如-db51" tabindex="-1"><a class="header-anchor" href="#测试挂载-nfs-如-db51"><span>测试挂载 NFS（如 db51）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> /test-nfs</span>
<span class="line"><span class="token function">mount</span> <span class="token parameter variable">-t</span> nfs <span class="token number">172.16</span>.1.31:/nfs-data /test-nfs</span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="web-172-16-1-7-8" tabindex="-1"><a class="header-anchor" href="#web-172-16-1-7-8"><span>web（172.16.1.7/8）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/61.repo <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">[local61]</span>
<span class="line">name=Local YUM Repository on 61</span>
<span class="line">baseurl=http://172.16.1.61:12345</span>
<span class="line">gpgcheck=0</span>
<span class="line">enabled=1</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">groupadd</span> www <span class="token parameter variable">-g</span> <span class="token number">666</span></span>
<span class="line"><span class="token function">useradd</span> www <span class="token parameter variable">-s</span> /sbin/nologin <span class="token parameter variable">-M</span> <span class="token parameter variable">-u</span> <span class="token number">666</span> <span class="token parameter variable">-g</span> <span class="token number">666</span></span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start nginx</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> nginx</span>
<span class="line"></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> php71w-cli php71w-common php71w-devel php71w-embedded php71w-gd php71w-mcrypt php71w-mbstring php71w-pdo php71w-xml php71w-fpm php71w-mysqlnd php71w-opcache php71w-pecl-memcached php71w-pecl-redis php71w-pecl-mongodb php71w-json php71w-pecl-apcu php71w-pecl-apcu-devel</span>
<span class="line"></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/^user/c user = www&#39;</span> /etc/php-fpm.d/www.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/^group/c group = www&#39;</span> /etc/php-fpm.d/www.conf</span>
<span class="line">systemctl start php-fpm</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> php-fpm</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/conf.d/wordpress.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">server{</span>
<span class="line">    listen 80;</span>
<span class="line">    server_name wordpress.qwe.cn;</span>
<span class="line">    root /code/wordpress;</span>
<span class="line">    index index.php index.html;</span>
<span class="line">    location ~ \\.php$ {</span>
<span class="line">        root /code/wordpress;</span>
<span class="line">        fastcgi_pass 127.0.0.1:9000;</span>
<span class="line">        fastcgi_index index.php;</span>
<span class="line">        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;</span>
<span class="line">        include fastcgi_params;</span>
<span class="line">        fastcgi_param HTTPS on;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /code</span>
<span class="line"><span class="token comment"># 将 wordpress-5.8.2-zh_CN.tar.gz 放到 /tmp 后执行：</span></span>
<span class="line"><span class="token comment"># tar -xzvf /tmp/wordpress-5.8.2-zh_CN.tar.gz -C /code</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> www.www /code/wordpress</span>
<span class="line">nginx <span class="token parameter variable">-s</span> reload</span>
<span class="line"></span>
<span class="line"><span class="token comment"># wp-config.php、NFS 挂载等见完整文档</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="slb5" tabindex="-1"><a class="header-anchor" href="#slb5"><span>slb5</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/61.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local-rpm]</span>
<span class="line">name=local yum repo</span>
<span class="line">baseurl=http://172.16.1.61:12345</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">yum <span class="token function">install</span> nginx keepalived <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start nginx</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> nginx</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/keepalived/check_web.sh <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line">NGINX_STATUS=$(ps -ef|grep ngin[x]|wc -l)</span>
<span class="line">if [ \${NGINX_STATUS} == 0 ]; then</span>
<span class="line">   systemctl restart nginx</span>
<span class="line">   [ $? -eq 1 ] &amp;&amp; systemctl stop keepalived</span>
<span class="line">fi</span>
<span class="line">EOF</span></span>
<span class="line"><span class="token function">chmod</span> +x /etc/keepalived/check_web.sh</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/keepalived/keepalived.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">global_defs { router_id lb-5; }</span>
<span class="line">vrrp_script check_web {</span>
<span class="line">    script &quot;/etc/keepalived/check_web.sh&quot;</span>
<span class="line">    interval 5</span>
<span class="line">}</span>
<span class="line">vrrp_instance VIP_1 {</span>
<span class="line">    state MASTER</span>
<span class="line">    interface eth0</span>
<span class="line">    virtual_router_id 50</span>
<span class="line">    priority 150</span>
<span class="line">    advert_int 1</span>
<span class="line">    authentication { auth_type PASS; auth_pass 1111; }</span>
<span class="line">    virtual_ipaddress { 10.0.0.3; }</span>
<span class="line">    track_script { check_web; }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line">systemctl start keepalived</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 证书并拷贝到 slb6</span></span>
<span class="line">openssl req <span class="token parameter variable">-x509</span> <span class="token parameter variable">-sha256</span> <span class="token parameter variable">-nodes</span> <span class="token parameter variable">-days</span> <span class="token number">36500</span> <span class="token parameter variable">-newkey</span> rsa:2048 <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-keyout</span> /tmp/server.key <span class="token parameter variable">-out</span> /tmp/server.crt <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-subj</span> <span class="token string">&quot;/C=CN/ST=Beijing/L=Beijing/O=MyCompany/CN=slb5&quot;</span></span>
<span class="line">  </span>
<span class="line">sshpass <span class="token parameter variable">-p</span> <span class="token string">&quot;qwe&quot;</span> <span class="token function">scp</span> <span class="token parameter variable">-o</span> <span class="token assign-left variable">StrictHostKeyChecking</span><span class="token operator">=</span>no /tmp/server.key /tmp/server.crt root@172.16.1.6:/tmp/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># nginx 80/443 与 proxy_params</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/conf.d/ssl.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">server {</span>
<span class="line">    listen 80;</span>
<span class="line">    server_name wordpress.qwe.cn;</span>
<span class="line">    return 301 https://$server_name$request_uri;</span>
<span class="line">}</span>
<span class="line">upstream myweb {</span>
<span class="line">    server 172.16.1.7:80;</span>
<span class="line">    server 172.16.1.8:80;</span>
<span class="line">}</span>
<span class="line">server {</span>
<span class="line">    listen 443 ssl;</span>
<span class="line">    server_name wordpress.qwe.cn;</span>
<span class="line">    ssl_certificate /tmp/server.crt;</span>
<span class="line">    ssl_certificate_key /tmp/server.key;</span>
<span class="line">    location / {</span>
<span class="line">        proxy_pass http://myweb;</span>
<span class="line">        include proxy_params;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/proxy_params <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">proxy_set_header Host $http_host;</span>
<span class="line">proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span>
<span class="line">proxy_connect_timeout 30;</span>
<span class="line">proxy_send_timeout 60;</span>
<span class="line">proxy_read_timeout 60;</span>
<span class="line">proxy_buffering on;</span>
<span class="line">proxy_buffer_size 32k;</span>
<span class="line">proxy_buffers 4 128k;</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl reload nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="slb6" tabindex="-1"><a class="header-anchor" href="#slb6"><span>slb6</span></a></h3><p>需先完成 slb5 的证书生成并执行 scp 到本机（172.16.1.6），证书位于 <code>/tmp/server.crt</code>、<code>/tmp/server.key</code>。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/61.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local-rpm]</span>
<span class="line">name=local yum repo</span>
<span class="line">baseurl=http://172.16.1.61:12345</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">yum clean all</span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start nginx</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> nginx</span>
<span class="line"></span>
<span class="line">yum <span class="token function">install</span> keepalived <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/keepalived/check_vip.sh <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line">MASTER_VIP=$(ssh 10.0.0.5 ip a|grep 10.0.0.3|wc -l)</span>
<span class="line">MY_VIP=$(ip a|grep 10.0.0.3|wc -l)</span>
<span class="line">if [ \${MASTER_VIP} == 1 -a \${MY_VIP} == 1 ]; then</span>
<span class="line">   systemctl stop keepalived</span>
<span class="line">fi</span>
<span class="line">EOF</span></span>
<span class="line"><span class="token function">chmod</span> +x /etc/keepalived/check_vip.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6 对 10.0.0.5 免密，check_vip.sh 才能执行</span></span>
<span class="line">ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-N</span> <span class="token string">&#39;&#39;</span> <span class="token parameter variable">-f</span> ~/.ssh/id_rsa</span>
<span class="line">yum <span class="token function">install</span> sshpass <span class="token parameter variable">-y</span></span>
<span class="line">sshpass <span class="token parameter variable">-p</span> <span class="token string">&quot;qwe&quot;</span> ssh-copy-id <span class="token parameter variable">-o</span> <span class="token assign-left variable">StrictHostKeyChecking</span><span class="token operator">=</span>no root@10.0.0.5</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/keepalived/keepalived.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">global_defs {</span>
<span class="line">    router_id lb-6</span>
<span class="line">}</span>
<span class="line">vrrp_script check_vip {</span>
<span class="line">    script &quot;/etc/keepalived/check_vip.sh&quot;</span>
<span class="line">    interval 5</span>
<span class="line">}</span>
<span class="line">vrrp_instance VIP_1 {</span>
<span class="line">    state BACKUP</span>
<span class="line">    interface eth0</span>
<span class="line">    virtual_router_id 50</span>
<span class="line">    priority 100</span>
<span class="line">    advert_int 1</span>
<span class="line">    authentication {</span>
<span class="line">        auth_type PASS</span>
<span class="line">        auth_pass 1111</span>
<span class="line">    }</span>
<span class="line">    virtual_ipaddress {</span>
<span class="line">        10.0.0.3</span>
<span class="line">    }</span>
<span class="line">    track_script {</span>
<span class="line">        check_vip</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl start keepalived</span>
<span class="line"></span>
<span class="line"><span class="token comment"># nginx 80/443 与 proxy_params（与 slb5 相同，证书已在 /tmp/）</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/conf.d/ssl.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">server {</span>
<span class="line">    listen 80;</span>
<span class="line">    server_name wordpress.qwe.cn;</span>
<span class="line">    return 301 https://$server_name$request_uri;</span>
<span class="line">}</span>
<span class="line">upstream myweb {</span>
<span class="line">    server 172.16.1.7:80;</span>
<span class="line">    server 172.16.1.8:80;</span>
<span class="line">}</span>
<span class="line">server {</span>
<span class="line">    listen 443 ssl;</span>
<span class="line">    server_name wordpress.qwe.cn;</span>
<span class="line">    ssl_certificate /tmp/server.crt;</span>
<span class="line">    ssl_certificate_key /tmp/server.key;</span>
<span class="line">    location / {</span>
<span class="line">        proxy_pass http://myweb;</span>
<span class="line">        include proxy_params;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/proxy_params <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">proxy_set_header Host $http_host;</span>
<span class="line">proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span>
<span class="line">proxy_connect_timeout 30;</span>
<span class="line">proxy_send_timeout 60;</span>
<span class="line">proxy_read_timeout 60;</span>
<span class="line">proxy_buffering on;</span>
<span class="line">proxy_buffer_size 32k;</span>
<span class="line">proxy_buffers 4 128k;</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl reload nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="访问与-dns" tabindex="-1"><a class="header-anchor" href="#访问与-dns"><span>访问与 DNS</span></a></h2><ul><li>用户访问：<code>https://wordpress.qwe.cn</code></li><li>DNS 将 <strong>wordpress.qwe.cn</strong> 解析到 <strong>10.0.0.3</strong>（Keepalived VIP）即可。</li></ul>`,38)])])}const t=n(i,[["render",p]]),d=JSON.parse('{"path":"/12-lnmp%E9%AB%98%E5%8F%AF%E7%94%A8%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E9%9B%86%E7%BE%A4%E6%9E%B6%E6%9E%84/%E6%9C%9F%E4%B8%AD%E6%9E%B6%E6%9E%84%E8%84%9A%E6%9C%AC%E5%91%BD%E4%BB%A4.html","title":"web负载均衡架构","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"12-lnmp高可用负载均衡集群架构/期中架构脚本命令.md"}');export{t as comp,d as data};
