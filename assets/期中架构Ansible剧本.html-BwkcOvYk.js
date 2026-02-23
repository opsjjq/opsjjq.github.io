import{_ as n,c as a,e,o as p}from"./app-DtXLoKBz.js";const l={};function t(i,s){return p(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="期中架构-ansible-剧本" tabindex="-1"><a class="header-anchor" href="#期中架构-ansible-剧本"><span>期中架构 Ansible 剧本</span></a></h1><blockquote><p>覆盖 db51、rsync41、nfs31、web7/8、slb5/6，与《期中架构脚本命令》对应，变量只使用必要项。</p></blockquote><hr><h2 id="_1-目录结构" tabindex="-1"><a class="header-anchor" href="#_1-目录结构"><span>1. 目录结构</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ansible/</span>
<span class="line">├── hosts</span>
<span class="line">├── group_vars/</span>
<span class="line">│   └── all.yml</span>
<span class="line">├── host_vars/</span>
<span class="line">│   ├── 172.16.1.5.yml    # slb5</span>
<span class="line">│   └── 172.16.1.6.yml    # slb6</span>
<span class="line">├── site.yml</span>
<span class="line">└── roles/</span>
<span class="line">    ├── db/                 # MySQL（db51）</span>
<span class="line">    │   ├── tasks/</span>
<span class="line">    │   │   └── main.yml</span>
<span class="line">    ├── rsync-server/</span>
<span class="line">    │   ├── tasks/</span>
<span class="line">    │   │   └── main.yml</span>
<span class="line">    │   ├── handlers/</span>
<span class="line">    │   │   └── main.yml</span>
<span class="line">    │   └── templates/</span>
<span class="line">    │       └── rsyncd.conf.j2</span>
<span class="line">    ├── nfs-server/</span>
<span class="line">    │   ├── tasks/</span>
<span class="line">    │   │   └── main.yml</span>
<span class="line">    │   ├── handlers/</span>
<span class="line">    │   │   └── main.yml</span>
<span class="line">    │   └── templates/</span>
<span class="line">    │       └── lsyncd.conf.j2</span>
<span class="line">    ├── web/                # nginx + php-fpm + wordpress</span>
<span class="line">    │   ├── tasks/</span>
<span class="line">    │   │   └── main.yml</span>
<span class="line">    │   └── templates/</span>
<span class="line">    │       ├── wordpress.conf.j2</span>
<span class="line">    │       └── wp-config.php.j2</span>
<span class="line">    └── slb/                # keepalived + nginx（5/6 用变量区分）</span>
<span class="line">        ├── tasks/</span>
<span class="line">        │   └── main.yml</span>
<span class="line">        ├── handlers/</span>
<span class="line">        │   └── main.yml</span>
<span class="line">        └── templates/</span>
<span class="line">            ├── keepalived.conf.j2</span>
<span class="line">            ├── check_web.sh.j2</span>
<span class="line">            ├── check_vip.sh.j2</span>
<span class="line">            ├── ssl.conf.j2</span>
<span class="line">            └── proxy_params.j2</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_2-主机清单-hosts" tabindex="-1"><a class="header-anchor" href="#_2-主机清单-hosts"><span>2. 主机清单 <code>hosts</code></span></a></h2><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">all:vars</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">ansible_port</span><span class="token punctuation">=</span><span class="token value attr-value">22</span></span>
<span class="line"><span class="token key attr-name">ansible_password</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">qwe</span>&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">slb</span><span class="token punctuation">]</span></span></span>
<span class="line">172.16.1.5</span>
<span class="line">172.16.1.6</span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">web</span><span class="token punctuation">]</span></span></span>
<span class="line">172.16.1.7</span>
<span class="line">172.16.1.8</span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">nfs</span><span class="token punctuation">]</span></span></span>
<span class="line">172.16.1.31</span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">backup</span><span class="token punctuation">]</span></span></span>
<span class="line">172.16.1.41</span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">db</span><span class="token punctuation">]</span></span></span>
<span class="line">172.16.1.51</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_3-全局变量-group-vars-all-yml" tabindex="-1"><a class="header-anchor" href="#_3-全局变量-group-vars-all-yml"><span>3. 全局变量 <code>group_vars/all.yml</code></span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token comment"># 共用</span></span>
<span class="line"><span class="token key atrule">rsync_user</span><span class="token punctuation">:</span> rsync_backup</span>
<span class="line"><span class="token key atrule">rsync_password</span><span class="token punctuation">:</span> <span class="token string">&quot;qwe123&quot;</span></span>
<span class="line"><span class="token key atrule">nfs_network</span><span class="token punctuation">:</span> <span class="token string">&quot;172.16.1.0/24&quot;</span></span>
<span class="line"><span class="token key atrule">yum_repo_61</span><span class="token punctuation">:</span> <span class="token string">&quot;http://172.16.1.61:12345&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># DB（WordPress 用）</span></span>
<span class="line"><span class="token key atrule">db_host</span><span class="token punctuation">:</span> <span class="token string">&quot;172.16.1.51&quot;</span></span>
<span class="line"><span class="token key atrule">mysql_wp_user</span><span class="token punctuation">:</span> wang</span>
<span class="line"><span class="token key atrule">mysql_wp_password</span><span class="token punctuation">:</span> <span class="token string">&quot;qwe123123&quot;</span></span>
<span class="line"><span class="token key atrule">redis_password</span><span class="token punctuation">:</span> <span class="token string">&quot;qwe123123&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># NFS / 后端</span></span>
<span class="line"><span class="token key atrule">nfs_server_ip</span><span class="token punctuation">:</span> <span class="token string">&quot;172.16.1.31&quot;</span></span>
<span class="line"><span class="token key atrule">web_backend_ips</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">&quot;172.16.1.7:80&quot;</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">&quot;172.16.1.8:80&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_4-主机变量-host-vars-172-16-1-5-yml-slb5" tabindex="-1"><a class="header-anchor" href="#_4-主机变量-host-vars-172-16-1-5-yml-slb5"><span>4. 主机变量 <code>host_vars/172.16.1.5.yml</code>（slb5）</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">slb_role</span><span class="token punctuation">:</span> master</span>
<span class="line"><span class="token key atrule">keepalived_state</span><span class="token punctuation">:</span> MASTER</span>
<span class="line"><span class="token key atrule">keepalived_priority</span><span class="token punctuation">:</span> <span class="token number">150</span></span>
<span class="line"><span class="token key atrule">keepalived_router_id</span><span class="token punctuation">:</span> lb<span class="token punctuation">-</span><span class="token number">5</span></span>
<span class="line"><span class="token key atrule">keepalived_script</span><span class="token punctuation">:</span> check_web</span>
<span class="line"><span class="token key atrule">slb_generate_cert</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_5-主机变量-host-vars-172-16-1-6-yml-slb6" tabindex="-1"><a class="header-anchor" href="#_5-主机变量-host-vars-172-16-1-6-yml-slb6"><span>5. 主机变量 <code>host_vars/172.16.1.6.yml</code>（slb6）</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">slb_role</span><span class="token punctuation">:</span> backup</span>
<span class="line"><span class="token key atrule">keepalived_state</span><span class="token punctuation">:</span> BACKUP</span>
<span class="line"><span class="token key atrule">keepalived_priority</span><span class="token punctuation">:</span> <span class="token number">100</span></span>
<span class="line"><span class="token key atrule">keepalived_router_id</span><span class="token punctuation">:</span> lb<span class="token punctuation">-</span><span class="token number">6</span></span>
<span class="line"><span class="token key atrule">keepalived_script</span><span class="token punctuation">:</span> check_vip</span>
<span class="line"><span class="token key atrule">slb_generate_cert</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"><span class="token key atrule">slb_master_ip</span><span class="token punctuation">:</span> <span class="token string">&quot;10.0.0.5&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_6-主-playbook-site-yml" tabindex="-1"><a class="header-anchor" href="#_6-主-playbook-site-yml"><span>6. 主 Playbook <code>site.yml</code></span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 Rsync（41）</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">roles</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> rsync<span class="token punctuation">-</span>server</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 NFS（31）</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> nfs</span>
<span class="line">  <span class="token key atrule">roles</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> nfs<span class="token punctuation">-</span>server</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 DB MySQL（51）</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> db</span>
<span class="line">  <span class="token key atrule">roles</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> db</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 Web（7、8）</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> web</span>
<span class="line">  <span class="token key atrule">roles</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> web</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 SLB（5、6）</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> slb</span>
<span class="line">  <span class="token key atrule">roles</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> slb</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>执行：</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">ansible-playbook <span class="token parameter variable">-i</span> hosts site.yml</span>
<span class="line"><span class="token comment"># 单组：ansible-playbook -i hosts site.yml --limit db</span></span>
<span class="line"><span class="token comment"># 单机：ansible-playbook -i hosts site.yml --limit 172.16.1.7</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_7-role-db-mysql" tabindex="-1"><a class="header-anchor" href="#_7-role-db-mysql"><span>7. Role：db（MySQL）</span></a></h2><h3 id="_7-1-roles-db-tasks-main-yml" tabindex="-1"><a class="header-anchor" href="#_7-1-roles-db-tasks-main-yml"><span>7.1 <code>roles/db/tasks/main.yml</code></span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token comment"># MySQL</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装 MySQL 5.7 源</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//mirrors.ustc.edu.cn/mysql<span class="token punctuation">-</span>repo/mysql57<span class="token punctuation">-</span>community<span class="token punctuation">-</span>release<span class="token punctuation">-</span>el7.rpm</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 关闭 MySQL 源 gpgcheck</span>
<span class="line">  <span class="token key atrule">shell</span><span class="token punctuation">:</span> sed <span class="token punctuation">-</span>i &#39;/gpgcheck=1/c gpgcheck=0&#39; /etc/yum.repos.d/mysql<span class="token punctuation">-</span>community<span class="token important">*.repo</span></span>
<span class="line">  <span class="token key atrule">args</span><span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token key atrule">warn</span><span class="token punctuation">:</span> <span class="token boolean important">false</span> <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装 mysql<span class="token punctuation">-</span>community<span class="token punctuation">-</span>server</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>community<span class="token punctuation">-</span>server</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 修改 mysqld 初始化参数</span>
<span class="line">  <span class="token key atrule">replace</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /usr/bin/mysqld_pre_systemd</span>
<span class="line">    <span class="token key atrule">regexp</span><span class="token punctuation">:</span> <span class="token string">&#39;--initialize &#39;</span></span>
<span class="line">    <span class="token key atrule">replace</span><span class="token punctuation">:</span> <span class="token string">&#39;--initialize-insecure &#39;</span></span>
<span class="line">  <span class="token key atrule">ignore_errors</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启用并启动 mysqld</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> mysqld</span>
<span class="line">    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 等待 3306 端口</span>
<span class="line">  <span class="token key atrule">wait_for</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3306</span></span>
<span class="line">    <span class="token key atrule">delay</span><span class="token punctuation">:</span> <span class="token number">5</span></span>
<span class="line">    <span class="token key atrule">timeout</span><span class="token punctuation">:</span> <span class="token number">60</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建库与用户（WordPress）</span>
<span class="line">  <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">    mysql -e &quot;create database if not exists wordpress default charset &#39;utf8&#39;;&quot;</span>
<span class="line">    mysql -e &quot;set global validate_password_policy=LOW;&quot; 2&gt;/dev/null || true</span>
<span class="line">    mysql -e &quot;create user if not exists &#39;{{ mysql_wp_user }}&#39;@&#39;%&#39; identified by &#39;{{ mysql_wp_password }}&#39;;&quot;</span>
<span class="line">    mysql -e &quot;grant all on wordpress.* to &#39;{{ mysql_wp_user }}&#39;@&#39;%&#39;;&quot;</span>
<span class="line">    mysql -e &quot;flush privileges;&quot;</span></span>
<span class="line">  <span class="token key atrule">args</span><span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token key atrule">warn</span><span class="token punctuation">:</span> <span class="token boolean important">false</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_8-role-rsync-server" tabindex="-1"><a class="header-anchor" href="#_8-role-rsync-server"><span>8. Role：rsync-server</span></a></h2><h3 id="_8-1-roles-rsync-server-tasks-main-yml" tabindex="-1"><a class="header-anchor" href="#_8-1-roles-rsync-server-tasks-main-yml"><span>8.1 <code>roles/rsync-server/tasks/main.yml</code></span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装 rsync</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> rsync</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建 www 用户</span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token number">1000</span></span>
<span class="line">    <span class="token key atrule">system</span><span class="token punctuation">:</span> yes</span>
<span class="line">    <span class="token key atrule">shell</span><span class="token punctuation">:</span> /sbin/nologin</span>
<span class="line">    <span class="token key atrule">create_home</span><span class="token punctuation">:</span> no</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建备份目录</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /backup</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 rsyncd 配置</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> rsyncd.conf.j2</span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/rsyncd.conf</span>
<span class="line">  <span class="token key atrule">notify</span><span class="token punctuation">:</span> restart rsyncd</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建密码文件</span>
<span class="line">  <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">content</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ rsync_user }}:{{ rsync_password }}&quot;</span></span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/rsync.passwd</span>
<span class="line">    <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;0600&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动并启用 rsyncd</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> rsyncd</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-roles-rsync-server-handlers-main-yml" tabindex="-1"><a class="header-anchor" href="#_8-2-roles-rsync-server-handlers-main-yml"><span>8.2 <code>roles/rsync-server/handlers/main.yml</code></span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> restart rsyncd</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> rsyncd</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> restarted</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-roles-rsync-server-templates-rsyncd-conf-j2" tabindex="-1"><a class="header-anchor" href="#_8-3-roles-rsync-server-templates-rsyncd-conf-j2"><span>8.3 <code>roles/rsync-server/templates/rsyncd.conf.j2</code></span></a></h3><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token key attr-name">uid</span> <span class="token punctuation">=</span> <span class="token value attr-value">www</span></span>
<span class="line"><span class="token key attr-name">gid</span> <span class="token punctuation">=</span> <span class="token value attr-value">www</span></span>
<span class="line"><span class="token key attr-name">port</span> <span class="token punctuation">=</span> <span class="token value attr-value">873</span></span>
<span class="line"><span class="token key attr-name">fake super</span> <span class="token punctuation">=</span> <span class="token value attr-value">yes</span></span>
<span class="line"><span class="token key attr-name">use chroot</span> <span class="token punctuation">=</span> <span class="token value attr-value">no</span></span>
<span class="line"><span class="token key attr-name">max connections</span> <span class="token punctuation">=</span> <span class="token value attr-value">200</span></span>
<span class="line"><span class="token key attr-name">timeout</span> <span class="token punctuation">=</span> <span class="token value attr-value">600</span></span>
<span class="line">ignore errors</span>
<span class="line"><span class="token key attr-name">read only</span> <span class="token punctuation">=</span> <span class="token value attr-value">false</span></span>
<span class="line"><span class="token key attr-name">list</span> <span class="token punctuation">=</span> <span class="token value attr-value">false</span></span>
<span class="line"><span class="token key attr-name">auth users</span> <span class="token punctuation">=</span> <span class="token value attr-value">{{ rsync_user }}</span></span>
<span class="line"><span class="token key attr-name">secrets file</span> <span class="token punctuation">=</span> <span class="token value attr-value">/etc/rsync.passwd</span></span>
<span class="line"><span class="token key attr-name">log file</span> <span class="token punctuation">=</span> <span class="token value attr-value">/var/log/rsyncd.log</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">backup</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">comment</span> <span class="token punctuation">=</span> <span class="token value attr-value">backup directionary</span></span>
<span class="line"><span class="token key attr-name">path</span> <span class="token punctuation">=</span> <span class="token value attr-value">/backup</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_9-role-nfs-server" tabindex="-1"><a class="header-anchor" href="#_9-role-nfs-server"><span>9. Role：nfs-server</span></a></h2><h3 id="_9-1-roles-nfs-server-tasks-main-yml" tabindex="-1"><a class="header-anchor" href="#_9-1-roles-nfs-server-tasks-main-yml"><span>9.1 <code>roles/nfs-server/tasks/main.yml</code></span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装 nfs<span class="token punctuation">-</span>utils、rpcbind、lsyncd</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>nfs<span class="token punctuation">-</span>utils<span class="token punctuation">,</span> rpcbind<span class="token punctuation">,</span> lsyncd<span class="token punctuation">]</span></span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建 www 用户</span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token number">1500</span></span>
<span class="line">    <span class="token key atrule">system</span><span class="token punctuation">:</span> yes</span>
<span class="line">    <span class="token key atrule">shell</span><span class="token punctuation">:</span> /sbin/nologin</span>
<span class="line">    <span class="token key atrule">create_home</span><span class="token punctuation">:</span> no</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建 NFS 共享目录</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /nfs<span class="token punctuation">-</span>data</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 配置 /etc/exports</span>
<span class="line">  <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">content</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">      /nfs-data {{ nfs_network }}(rw,sync,all_squash,anonuid=1500,anongid=1500)</span></span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/exports</span>
<span class="line">  <span class="token key atrule">notify</span><span class="token punctuation">:</span> reload nfs</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建 lsyncd 密码文件</span>
<span class="line">  <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">content</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ rsync_password }}&quot;</span></span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/rsync.pwd</span>
<span class="line">    <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;0600&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 lsyncd 配置</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> lsyncd.conf.j2</span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/lsyncd.conf</span>
<span class="line">  <span class="token key atrule">notify</span><span class="token punctuation">:</span> restart lsyncd</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建 lsyncd 日志目录</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /var/log/lsyncd</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动并启用 rpcbind、nfs、lsyncd</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item }}&quot;</span></span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line">  <span class="token key atrule">loop</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>rpcbind<span class="token punctuation">,</span> nfs<span class="token punctuation">,</span> lsyncd<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-roles-nfs-server-handlers-main-yml" tabindex="-1"><a class="header-anchor" href="#_9-2-roles-nfs-server-handlers-main-yml"><span>9.2 <code>roles/nfs-server/handlers/main.yml</code></span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> reload nfs</span>
<span class="line">  <span class="token key atrule">command</span><span class="token punctuation">:</span> exportfs <span class="token punctuation">-</span>ra</span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> restart lsyncd</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> lsyncd</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> restarted</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-roles-nfs-server-templates-lsyncd-conf-j2" tabindex="-1"><a class="header-anchor" href="#_9-3-roles-nfs-server-templates-lsyncd-conf-j2"><span>9.3 <code>roles/nfs-server/templates/lsyncd.conf.j2</code></span></a></h3><div class="language-lua line-numbers-mode" data-highlighter="prismjs" data-ext="lua"><pre><code class="language-lua"><span class="line"><span class="token function">settings</span> <span class="token punctuation">{</span></span>
<span class="line">    logfile      <span class="token operator">=</span> <span class="token string">&quot;/var/log/lsyncd/lsyncd.log&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    statusFile   <span class="token operator">=</span> <span class="token string">&quot;/var/log/lsyncd/lsyncd.status&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    inotifyMode  <span class="token operator">=</span> <span class="token string">&quot;CloseWrite&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    maxProcesses <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token function">sync</span> <span class="token punctuation">{</span></span>
<span class="line">    default<span class="token punctuation">.</span>rsync<span class="token punctuation">,</span></span>
<span class="line">    source    <span class="token operator">=</span> <span class="token string">&quot;/nfs-data&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    target    <span class="token operator">=</span> <span class="token string">&quot;{{ rsync_user }}@172.16.1.41::backup&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    delete    <span class="token operator">=</span> <span class="token keyword">true</span><span class="token punctuation">,</span></span>
<span class="line">    exclude   <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">&quot;.*&quot;</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    delay     <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">    rsync     <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">        binary        <span class="token operator">=</span> <span class="token string">&quot;/usr/bin/rsync&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        archive       <span class="token operator">=</span> <span class="token keyword">true</span><span class="token punctuation">,</span></span>
<span class="line">        compress      <span class="token operator">=</span> <span class="token keyword">true</span><span class="token punctuation">,</span></span>
<span class="line">        verbose       <span class="token operator">=</span> <span class="token keyword">true</span><span class="token punctuation">,</span></span>
<span class="line">        password_file <span class="token operator">=</span> <span class="token string">&quot;/etc/rsync.pwd&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        _extra        <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">&quot;--bwlimit=200&quot;</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_10-role-web-nginx-php-fpm-wordpress" tabindex="-1"><a class="header-anchor" href="#_10-role-web-nginx-php-fpm-wordpress"><span>10. Role：web（nginx + php-fpm + WordPress）</span></a></h2><h3 id="_10-1-roles-web-tasks-main-yml" tabindex="-1"><a class="header-anchor" href="#_10-1-roles-web-tasks-main-yml"><span>10.1 <code>roles/web/tasks/main.yml</code></span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 配置 61 yum 源</span>
<span class="line">  <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">content</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">      [local61]</span>
<span class="line">      name=Local YUM Repository on 61</span>
<span class="line">      baseurl={{ yum_repo_61 }}</span>
<span class="line">      gpgcheck=0</span>
<span class="line">      enabled=1</span></span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/yum.repos.d/61.repo</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建 www 用户与组</span>
<span class="line">  <span class="token key atrule">group</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">gid</span><span class="token punctuation">:</span> <span class="token number">666</span></span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token number">666</span></span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">system</span><span class="token punctuation">:</span> yes</span>
<span class="line">    <span class="token key atrule">shell</span><span class="token punctuation">:</span> /sbin/nologin</span>
<span class="line">    <span class="token key atrule">create_home</span><span class="token punctuation">:</span> no</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装 nginx</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动并启用 nginx</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 添加 PHP 7.1 源（webtatic）</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//mirror.webtatic.com/yum/el7/webtatic<span class="token punctuation">-</span>release.rpm</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line">  <span class="token key atrule">ignore_errors</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装 PHP 7.1 与扩展</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> php71w<span class="token punctuation">-</span>cli</span>
<span class="line">      <span class="token punctuation">-</span> php71w<span class="token punctuation">-</span>common</span>
<span class="line">      <span class="token punctuation">-</span> php71w<span class="token punctuation">-</span>fpm</span>
<span class="line">      <span class="token punctuation">-</span> php71w<span class="token punctuation">-</span>mysqlnd</span>
<span class="line">      <span class="token punctuation">-</span> php71w<span class="token punctuation">-</span>gd</span>
<span class="line">      <span class="token punctuation">-</span> php71w<span class="token punctuation">-</span>mbstring</span>
<span class="line">      <span class="token punctuation">-</span> php71w<span class="token punctuation">-</span>xml</span>
<span class="line">      <span class="token punctuation">-</span> php71w<span class="token punctuation">-</span>opcache</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line">  <span class="token key atrule">ignore_errors</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> PHP<span class="token punctuation">-</span>FPM 运行用户</span>
<span class="line">  <span class="token key atrule">replace</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /etc/php<span class="token punctuation">-</span>fpm.d/www.conf</span>
<span class="line">    <span class="token key atrule">regexp</span><span class="token punctuation">:</span> <span class="token string">&#39;^user = .*&#39;</span></span>
<span class="line">    <span class="token key atrule">replace</span><span class="token punctuation">:</span> <span class="token string">&#39;user = www&#39;</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">replace</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /etc/php<span class="token punctuation">-</span>fpm.d/www.conf</span>
<span class="line">    <span class="token key atrule">regexp</span><span class="token punctuation">:</span> <span class="token string">&#39;^group = .*&#39;</span></span>
<span class="line">    <span class="token key atrule">replace</span><span class="token punctuation">:</span> <span class="token string">&#39;group = www&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动 php<span class="token punctuation">-</span>fpm</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> php<span class="token punctuation">-</span>fpm</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 wordpress 站点配置</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> wordpress.conf.j2</span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/nginx/conf.d/wordpress.conf</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建站点目录</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /code/wordpress</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 wp<span class="token punctuation">-</span>config.php</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> wp<span class="token punctuation">-</span>config.php.j2</span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /code/wordpress/wp<span class="token punctuation">-</span>config.php</span>
<span class="line">    <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装 nfs<span class="token punctuation">-</span>utils、rpcbind</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>nfs<span class="token punctuation">-</span>utils<span class="token punctuation">,</span> rpcbind<span class="token punctuation">]</span></span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动 rpcbind</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> rpcbind</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建 uploads 目录</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /code/wordpress/wp<span class="token punctuation">-</span>content/uploads</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 挂载 NFS 到 uploads</span>
<span class="line">  <span class="token key atrule">mount</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /code/wordpress/wp<span class="token punctuation">-</span>content/uploads</span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ nfs_server_ip }}:/nfs-data&quot;</span></span>
<span class="line">    <span class="token key atrule">fstype</span><span class="token punctuation">:</span> nfs</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> mounted</span>
<span class="line">    <span class="token key atrule">opts</span><span class="token punctuation">:</span> defaults<span class="token punctuation">,</span>_netdev</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 写入 fstab</span>
<span class="line">  <span class="token key atrule">lineinfile</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /etc/fstab</span>
<span class="line">    <span class="token key atrule">line</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ nfs_server_ip }}:/nfs-data  /code/wordpress/wp-content/uploads  nfs4  defaults,_netdev  0  0&quot;</span></span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 重载 nginx</span>
<span class="line">  <span class="token key atrule">command</span><span class="token punctuation">:</span> nginx <span class="token punctuation">-</span>s reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>（若 PHP 71 源不可用，可改为使用 61 上自建 repo 中的 php71w 包，或改用 php74/80 并改模板中 fastcgi_pass 等；此处与脚本文档一致用 php71w。）</p><h3 id="_10-2-roles-web-templates-wordpress-conf-j2" tabindex="-1"><a class="header-anchor" href="#_10-2-roles-web-templates-wordpress-conf-j2"><span>10.2 <code>roles/web/templates/wordpress.conf.j2</code></span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server_name</span> wordpress.qwe.cn</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">root</span> /code/wordpress</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">index</span> index.php index.html</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> ~ \\.php$</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">root</span> /code/wordpress</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_pass</span> 127.0.0.1:9000</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_index</span> index.php</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_param</span> SCRIPT_FILENAME <span class="token variable">$document_root</span><span class="token variable">$fastcgi_script_name</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">include</span> fastcgi_params</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">fastcgi_param</span> HTTPS <span class="token boolean">on</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-roles-web-templates-wp-config-php-j2" tabindex="-1"><a class="header-anchor" href="#_10-3-roles-web-templates-wp-config-php-j2"><span>10.3 <code>roles/web/templates/wp-config.php.j2</code></span></a></h3><div class="language-php line-numbers-mode" data-highlighter="prismjs" data-ext="php"><pre><code class="language-php"><span class="line"><span class="token php language-php"><span class="token delimiter important">&lt;?php</span></span>
<span class="line"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;DB_NAME&#39;</span><span class="token punctuation">,</span> <span class="token string single-quoted-string">&#39;wordpress&#39;</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;DB_USER&#39;</span><span class="token punctuation">,</span> <span class="token string single-quoted-string">&#39;{{ mysql_wp_user }}&#39;</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;DB_PASSWORD&#39;</span><span class="token punctuation">,</span> <span class="token string single-quoted-string">&#39;{{ mysql_wp_password }}&#39;</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;DB_HOST&#39;</span><span class="token punctuation">,</span> <span class="token string single-quoted-string">&#39;{{ db_host }}&#39;</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;DB_CHARSET&#39;</span><span class="token punctuation">,</span> <span class="token string single-quoted-string">&#39;utf8mb4&#39;</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;DB_COLLATE&#39;</span><span class="token punctuation">,</span> <span class="token string single-quoted-string">&#39;&#39;</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token variable">$table_prefix</span> <span class="token operator">=</span> <span class="token string single-quoted-string">&#39;wp_&#39;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;WP_DEBUG&#39;</span><span class="token punctuation">,</span> <span class="token constant boolean">false</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span> <span class="token operator">!</span> <span class="token function">defined</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;ABSPATH&#39;</span> <span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">define</span><span class="token punctuation">(</span> <span class="token string single-quoted-string">&#39;ABSPATH&#39;</span><span class="token punctuation">,</span> <span class="token constant">__DIR__</span> <span class="token operator">.</span> <span class="token string single-quoted-string">&#39;/&#39;</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token keyword">require_once</span> <span class="token constant">ABSPATH</span> <span class="token operator">.</span> <span class="token string single-quoted-string">&#39;wp-settings.php&#39;</span><span class="token punctuation">;</span></span>
<span class="line"></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>（若需与脚本文档一致保留 AUTH_KEY 等盐值，可在模板中补全；此处仅保留必要 DB 与表前缀。）</p><hr><h2 id="_11-role-slb-5-6-共用-变量区分" tabindex="-1"><a class="header-anchor" href="#_11-role-slb-5-6-共用-变量区分"><span>11. Role：slb（5/6 共用，变量区分）</span></a></h2><h3 id="_11-1-roles-slb-tasks-main-yml" tabindex="-1"><a class="header-anchor" href="#_11-1-roles-slb-tasks-main-yml"><span>11.1 <code>roles/slb/tasks/main.yml</code></span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 配置 61 yum 源</span>
<span class="line">  <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">content</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">      [local-rpm]</span>
<span class="line">      name=local yum repo</span>
<span class="line">      baseurl={{ yum_repo_61 }}</span>
<span class="line">      enabled=1</span>
<span class="line">      gpgcheck=0</span></span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/yum.repos.d/61.repo</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 清理 yum 缓存（slb6）</span>
<span class="line">  <span class="token key atrule">command</span><span class="token punctuation">:</span> yum clean all</span>
<span class="line">  <span class="token key atrule">when</span><span class="token punctuation">:</span> slb_role == &#39;backup&#39;</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装 nginx、keepalived</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>nginx<span class="token punctuation">,</span> keepalived<span class="token punctuation">]</span></span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动 nginx</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 keepalived 检查脚本（master 用 check_web）</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> check_web.sh.j2</span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/keepalived/check_web.sh</span>
<span class="line">    <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;0755&#39;</span></span>
<span class="line">  <span class="token key atrule">when</span><span class="token punctuation">:</span> keepalived_script == &#39;check_web&#39;</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 keepalived 检查脚本（backup 用 check_vip）</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> check_vip.sh.j2</span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/keepalived/check_vip.sh</span>
<span class="line">    <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;0755&#39;</span></span>
<span class="line">  <span class="token key atrule">when</span><span class="token punctuation">:</span> keepalived_script == &#39;check_vip&#39;</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> slb6 对 master 免密</span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> root</span>
<span class="line">    <span class="token key atrule">generate_ssh_key</span><span class="token punctuation">:</span> yes</span>
<span class="line">    <span class="token key atrule">ssh_key_type</span><span class="token punctuation">:</span> rsa</span>
<span class="line">  <span class="token key atrule">when</span><span class="token punctuation">:</span> slb_role == &#39;backup&#39;</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> slb6 安装 sshpass</span>
<span class="line">  <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> sshpass</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line">  <span class="token key atrule">when</span><span class="token punctuation">:</span> slb_role == &#39;backup&#39;</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> slb6 对 master 免密</span>
<span class="line">  <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;sshpass -p &#39;{{ ansible_password }}&#39; ssh-copy-id -o StrictHostKeyChecking=no root@{{ slb_master_ip | default(&#39;10.0.0.5&#39;) }}&quot;</span></span>
<span class="line">  <span class="token key atrule">when</span><span class="token punctuation">:</span> slb_role == &#39;backup&#39;</span>
<span class="line">  <span class="token key atrule">args</span><span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token key atrule">warn</span><span class="token punctuation">:</span> <span class="token boolean important">false</span> <span class="token punctuation">}</span></span>
<span class="line">  <span class="token key atrule">changed_when</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 keepalived 配置</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> keepalived.conf.j2</span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/keepalived/keepalived.conf</span>
<span class="line">  <span class="token key atrule">notify</span><span class="token punctuation">:</span> restart keepalived</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建证书目录（control）</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ playbook_dir }}/.slb_cert&quot;</span></span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;0700&#39;</span></span>
<span class="line">  <span class="token key atrule">run_once</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">delegate_to</span><span class="token punctuation">:</span> localhost</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 在 control 生成证书（供 slb5/6 共用）</span>
<span class="line">  <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token punctuation">&gt;</span><span class="token scalar string"></span>
<span class="line">    openssl req -x509 -sha256 -nodes -days 36500</span>
<span class="line">    -newkey rsa:2048 -keyout {{ playbook_dir }}/.slb_cert/server.key</span>
<span class="line">    -out {{ playbook_dir }}/.slb_cert/server.crt</span>
<span class="line">    -subj &quot;/C=CN/ST=Beijing/L=Beijing/O=MyCompany/CN=slb5&quot;</span></span>
<span class="line">  <span class="token key atrule">run_once</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">delegate_to</span><span class="token punctuation">:</span> localhost</span>
<span class="line">  <span class="token key atrule">args</span><span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token key atrule">creates</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ playbook_dir }}/.slb_cert/server.crt&quot;</span> <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 拷贝证书到各 SLB</span>
<span class="line">  <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ playbook_dir }}/.slb_cert/{{ item }}&quot;</span></span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> <span class="token string">&quot;/tmp/{{ item }}&quot;</span></span>
<span class="line">  <span class="token key atrule">loop</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>server.key<span class="token punctuation">,</span> server.crt<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署 nginx ssl 与 proxy_params</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">src</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.src }}&quot;</span></span>
<span class="line">    <span class="token key atrule">dest</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.dest }}&quot;</span></span>
<span class="line">  <span class="token key atrule">loop</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">src</span><span class="token punctuation">:</span> ssl.conf.j2<span class="token punctuation">,</span> <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/nginx/conf.d/ssl.conf <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">src</span><span class="token punctuation">:</span> proxy_params.j2<span class="token punctuation">,</span> <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/nginx/proxy_params <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 重载 nginx</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> reloaded</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动 keepalived</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> keepalived</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>（slb6 对 10.0.0.5 免密：若 172.16.1.6 无法直接 delegate_to 10.0.0.5，可在 slb6 上用 shell+sshpass 做 ssh-copy-id，与脚本文档一致。）</p><h3 id="_11-2-roles-slb-handlers-main-yml" tabindex="-1"><a class="header-anchor" href="#_11-2-roles-slb-handlers-main-yml"><span>11.2 <code>roles/slb/handlers/main.yml</code></span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> restart keepalived</span>
<span class="line">  <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> keepalived</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> restarted</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-3-roles-slb-templates-keepalived-conf-j2" tabindex="-1"><a class="header-anchor" href="#_11-3-roles-slb-templates-keepalived-conf-j2"><span>11.3 <code>roles/slb/templates/keepalived.conf.j2</code></span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">global_defs {</span>
<span class="line">    router_id {{ keepalived_router_id }}</span>
<span class="line">}</span>
<span class="line">vrrp_script {{ keepalived_script }} {</span>
<span class="line">    script &quot;/etc/keepalived/{{ keepalived_script }}.sh&quot;</span>
<span class="line">    interval 5</span>
<span class="line">}</span>
<span class="line">vrrp_instance VIP_1 {</span>
<span class="line">    state {{ keepalived_state }}</span>
<span class="line">    interface eth0</span>
<span class="line">    virtual_router_id 50</span>
<span class="line">    priority {{ keepalived_priority }}</span>
<span class="line">    advert_int 1</span>
<span class="line">    authentication {</span>
<span class="line">        auth_type PASS</span>
<span class="line">        auth_pass 1111</span>
<span class="line">    }</span>
<span class="line">    virtual_ipaddress {</span>
<span class="line">        10.0.0.3</span>
<span class="line">    }</span>
<span class="line">    track_script {</span>
<span class="line">        {{ keepalived_script }}</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-4-roles-slb-templates-check-web-sh-j2" tabindex="-1"><a class="header-anchor" href="#_11-4-roles-slb-templates-check-web-sh-j2"><span>11.4 <code>roles/slb/templates/check_web.sh.j2</code></span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token assign-left variable">NGINX_STATUS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">ps</span> -ef<span class="token operator">|</span><span class="token function">grep</span> ngin<span class="token punctuation">[</span>x<span class="token punctuation">]</span><span class="token operator">|</span><span class="token function">wc</span> <span class="token parameter variable">-l</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">\${NGINX_STATUS}</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">   systemctl restart nginx</span>
<span class="line">   <span class="token punctuation">[</span> <span class="token variable">$?</span> <span class="token parameter variable">-eq</span> <span class="token number">1</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> systemctl stop keepalived</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-5-roles-slb-templates-check-vip-sh-j2" tabindex="-1"><a class="header-anchor" href="#_11-5-roles-slb-templates-check-vip-sh-j2"><span>11.5 <code>roles/slb/templates/check_vip.sh.j2</code></span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token assign-left variable">MASTER_VIP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">ssh</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> slb_master_ip <span class="token operator">|</span> default<span class="token punctuation">(</span><span class="token string">&#39;10.0.0.5&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token function">ip</span> a<span class="token operator">|</span><span class="token function">grep</span> <span class="token number">10.0</span>.0.3<span class="token operator">|</span><span class="token function">wc</span> <span class="token parameter variable">-l</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">MY_VIP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">ip</span> a<span class="token operator">|</span><span class="token function">grep</span> <span class="token number">10.0</span>.0.3<span class="token operator">|</span><span class="token function">wc</span> <span class="token parameter variable">-l</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">\${MASTER_VIP}</span> <span class="token operator">==</span> <span class="token number">1</span> <span class="token parameter variable">-a</span> <span class="token variable">\${MY_VIP}</span> <span class="token operator">==</span> <span class="token number">1</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">   systemctl stop keepalived</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-6-roles-slb-templates-ssl-conf-j2" tabindex="-1"><a class="header-anchor" href="#_11-6-roles-slb-templates-ssl-conf-j2"><span>11.6 <code>roles/slb/templates/ssl.conf.j2</code></span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server_name</span> wordpress.qwe.cn</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">return</span> <span class="token number">301</span> https://<span class="token variable">$server_name</span><span class="token variable">$request_uri</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token directive"><span class="token keyword">upstream</span> myweb</span> <span class="token punctuation">{</span></span>
<span class="line"><span class="token punctuation">{</span>% for ip in web_backend_ips %<span class="token punctuation">}</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span><span class="token punctuation">{</span> ip <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">{</span>% endfor %<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">443</span> ssl</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">server_name</span> wordpress.qwe.cn</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">ssl_certificate</span> /tmp/server.crt</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">ssl_certificate_key</span> /tmp/server.key</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://myweb</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">include</span> proxy_params</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-7-roles-slb-templates-proxy-params-j2" tabindex="-1"><a class="header-anchor" href="#_11-7-roles-slb-templates-proxy-params-j2"><span>11.7 <code>roles/slb/templates/proxy_params.j2</code></span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">proxy_set_header Host $http_host;</span>
<span class="line">proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span>
<span class="line">proxy_connect_timeout 30;</span>
<span class="line">proxy_send_timeout 60;</span>
<span class="line">proxy_read_timeout 60;</span>
<span class="line">proxy_buffering on;</span>
<span class="line">proxy_buffer_size 32k;</span>
<span class="line">proxy_buffers 4 128k;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_12-执行顺序与依赖" tabindex="-1"><a class="header-anchor" href="#_12-执行顺序与依赖"><span>12. 执行顺序与依赖</span></a></h2><table><thead><tr><th>顺序</th><th>主机组</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td>backup</td><td>Rsync，NFS 的 lsyncd 依赖其认证</td></tr><tr><td>2</td><td>nfs</td><td>NFS + lsyncd 同步到 41</td></tr><tr><td>3</td><td>db</td><td>MySQL + Redis，Web 与 WordPress 依赖</td></tr><tr><td>4</td><td>web</td><td>依赖 db、nfs（挂载 uploads）</td></tr><tr><td>5</td><td>slb</td><td>依赖 web 已就绪；证书在 control 生成后拷贝到 5/6，或按脚本文档在 slb5 生成再 scp 到 6</td></tr></tbody></table><hr><h2 id="_13-与脚本文档对应关系" tabindex="-1"><a class="header-anchor" href="#_13-与脚本文档对应关系"><span>13. 与脚本文档对应关系</span></a></h2><table><thead><tr><th>角色</th><th>脚本文档</th><th>剧本 role</th></tr></thead><tbody><tr><td>db51</td><td>MySQL 命令</td><td><code>db</code></td></tr><tr><td>rsync41</td><td>rsync 命令</td><td><code>rsync-server</code></td></tr><tr><td>nfs31</td><td>NFS + lsyncd</td><td><code>nfs-server</code></td></tr><tr><td>web7/8</td><td>nginx + php-fpm + wordpress + NFS 挂载</td><td><code>web</code></td></tr><tr><td>slb5/6</td><td>keepalived + nginx + 证书</td><td><code>slb</code>（host_vars 区分 5/6）</td></tr></tbody></table><p>WordPress 程序包（如 <code>wordpress-5.8.2-zh_CN.tar.gz</code>）需自行放到各 web 机的 <code>/tmp</code> 并解压到 <code>/code</code>，或通过 Ansible 的 <code>unarchive</code> 从控制机分发后再执行本剧本。</p>`,76)])])}const o=n(l,[["render",t]]),u=JSON.parse('{"path":"/12-lnmp%E9%AB%98%E5%8F%AF%E7%94%A8%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E9%9B%86%E7%BE%A4%E6%9E%B6%E6%9E%84/%E6%9C%9F%E4%B8%AD%E6%9E%B6%E6%9E%84Ansible%E5%89%A7%E6%9C%AC.html","title":"期中架构 Ansible 剧本","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"12-lnmp高可用负载均衡集群架构/期中架构Ansible剧本.md"}');export{o as comp,u as data};
