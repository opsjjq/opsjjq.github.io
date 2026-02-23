import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const p={};function i(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="部署堡垒机-jumpserver-python-vue-golang-整理版" tabindex="-1"><a class="header-anchor" href="#部署堡垒机-jumpserver-python-vue-golang-整理版"><span>部署堡垒机 Jumpserver (Python + Vue + Golang) - 整理版</span></a></h1><h2 id="_1-数据库服务器-db-51" tabindex="-1"><a class="header-anchor" href="#_1-数据库服务器-db-51"><span>1. 数据库服务器 (db-51)</span></a></h2><h3 id="安装与配置-mysql" tabindex="-1"><a class="header-anchor" href="#安装与配置-mysql"><span>安装与配置 MySQL</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token parameter variable">-y</span> localinstall http://mirrors.ustc.edu.cn/mysql-repo/mysql57-community-release-el7.rpm</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/gpgcheck=1/c gpgcheck=0&#39;</span> /etc/yum.repos.d/mysql-community*</span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> mysql-community-server</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 禁用随机密码生成</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /usr/bin/mysqld_pre_systemd <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> ^<span class="token punctuation">\\</span># <span class="token operator">|</span> <span class="token function">grep</span> initialize-insecure <span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s@--initialize @--initialize-insecure @g&quot;</span> /usr/bin/mysqld_pre_systemd</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> mysqld</span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建数据库与用户</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;create database jumpserver default charset &#39;utf8&#39;;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;create database wordpress default charset &#39;utf8&#39;;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;set global validate_password_policy=LOW;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;create user &#39;wang&#39;@&#39;%&#39; identified by &#39;qwe123123&#39;;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;grant all on jumpserver.* to &#39;wang&#39;@&#39;%&#39;;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;grant all on wordpress.* to &#39;wang&#39;@&#39;%&#39;;&quot;</span></span>
<span class="line">mysql <span class="token parameter variable">-e</span> <span class="token string">&quot;flush privileges;&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装与配置-redis" tabindex="-1"><a class="header-anchor" href="#安装与配置-redis"><span>安装与配置 Redis</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token parameter variable">-y</span> <span class="token function">install</span> epel-release <span class="token function">wget</span> <span class="token function">make</span> gcc-c++</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt <span class="token punctuation">;</span> <span class="token function">wget</span> https://download.redis.io/releases/redis-6.2.4.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> redis-6.2.4.tar.gz</span>
<span class="line"><span class="token builtin class-name">cd</span> redis-6.2.4</span>
<span class="line"><span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span> <span class="token assign-left variable">PREFIX</span><span class="token operator">=</span>/usr/local/redis</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置环境变量</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/usr/local/redis/bin/&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置文件设置</span></span>
<span class="line"><span class="token function">cp</span> /opt/redis-6.2.4/redis.conf /etc/redis.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s/bind 127.0.0.1/bind 0.0.0.0/g&quot;</span> /etc/redis.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s/daemonize no/daemonize yes/g&quot;</span> /etc/redis.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;561i maxmemory-policy allkeys-lru&quot;</span> /etc/redis.conf</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;481i requirepass qwe123123&quot;</span> /etc/redis.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建 systemd 服务</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/systemd/system/redis.service <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
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
<span class="line">ExecReload=/bin/kill -s HUP \\<span class="token variable">$MAINPID</span></span>
<span class="line">ExecStop=/bin/kill -s QUIT \\<span class="token variable">$MAINPID</span></span>
<span class="line"></span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> redis</span>
<span class="line">systemctl start redis</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-管理服务器-master-61" tabindex="-1"><a class="header-anchor" href="#_2-管理服务器-master-61"><span>2. 管理服务器 (master-61)</span></a></h2><h3 id="基础环境准备" tabindex="-1"><a class="header-anchor" href="#基础环境准备"><span>基础环境准备</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo</span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo</span>
<span class="line"></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> bash-completion <span class="token function">vim</span> lrzsz <span class="token function">wget</span> <span class="token function">expect</span> net-tools <span class="token function">nc</span> nmap tree dos2unix <span class="token function">htop</span> iftop iotop <span class="token function">unzip</span> telnet sl psmisc nethogs glances <span class="token function">bc</span> ntpdate openldap-devel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Python 依赖</span></span>
<span class="line">yum <span class="token parameter variable">-y</span> <span class="token function">install</span> <span class="token function">git</span> python-pip gcc automake autoconf python-devel <span class="token function">vim</span> sshpass lrzsz readline-devel zlib zlib-devel openssl openssl-devel mysql-devel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置中文环境</span></span>
<span class="line">localedef <span class="token parameter variable">-c</span> <span class="token parameter variable">-f</span> UTF-8 <span class="token parameter variable">-i</span> zh_CN zh_CN.UTF-8</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">LC_ALL</span></span><span class="token operator">=</span>zh_CN.UTF-8</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="下载-jumpserver-源码" tabindex="-1"><a class="header-anchor" href="#下载-jumpserver-源码"><span>下载 Jumpserver 源码</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> /opt/jumpserver-v2.12.0</span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> /opt/jumpserver-v2.12.0.tar.gz https://github.com/jumpserver/jumpserver/archive/refs/tags/v2.12.0.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> jumpserver-v2.12.0.tar.gz <span class="token parameter variable">-C</span> /opt/jumpserver-v2.12.0 --strip-components <span class="token number">1</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /opt/jumpserver-v2.12.0/requirements/rpm_requirements.txt<span class="token variable">)</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="python-3-6-9-环境搭建" tabindex="-1"><a class="header-anchor" href="#python-3-6-9-环境搭建"><span>Python 3.6.9 环境搭建</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token function">install</span> gcc patch libffi-devel python-devel zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt <span class="token operator">&amp;&amp;</span> <span class="token function">wget</span> https://www.python.org/ftp/python/3.6.9/Python-3.6.9.tar.xz</span>
<span class="line">xz <span class="token parameter variable">-d</span> Python-3.6.9.tar.xz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xvf</span> Python-3.6.9.tar</span>
<span class="line"><span class="token builtin class-name">cd</span> Python-3.6.9/</span>
<span class="line">./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/opt/python3/</span>
<span class="line"><span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 环境变量配置</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/opt/python3/bin&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置 pip 源</span></span>
<span class="line"><span class="token function">mkdir</span> ~/.pip</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> ~/.pip/pip.conf <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[global]</span>
<span class="line">index-url = https://mirrors.aliyun.com/pypi/simple/</span>
<span class="line">trusted-host = mirrors.aliyun.com</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建-python-虚拟环境" tabindex="-1"><a class="header-anchor" href="#创建-python-虚拟环境"><span>创建 Python 虚拟环境</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">python3 <span class="token parameter variable">-m</span> venv /opt/venv_py3</span>
<span class="line"><span class="token builtin class-name">source</span> /opt/venv_py3/bin/activate</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改依赖文件</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/huaweicloud-sdk-python-1.0.21/d&#39;</span> /opt/jumpserver-v2.12.0/requirements/requirements.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装依赖</span></span>
<span class="line">pip3 <span class="token function">install</span> <span class="token parameter variable">-r</span> /opt/jumpserver-v2.12.0/requirements/requirements.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="jumpserver-core-配置" tabindex="-1"><a class="header-anchor" href="#jumpserver-core-配置"><span>Jumpserver Core 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 生成密钥</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable">$SECRET_KEY</span>&quot;</span> <span class="token operator">=</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span> <span class="token assign-left variable">SECRET_KEY</span><span class="token operator">=</span><span class="token variable"><span class="token variable">\`</span><span class="token function">cat</span> /dev/urandom <span class="token operator">|</span> <span class="token function">tr</span> <span class="token parameter variable">-dc</span> A-Za-z0-9 <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-c</span> <span class="token number">50</span><span class="token variable">\`</span></span><span class="token punctuation">;</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;SECRET_KEY=<span class="token variable">$SECRET_KEY</span>&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.bashrc<span class="token punctuation">;</span> <span class="token builtin class-name">echo</span> <span class="token variable">$SECRET_KEY</span><span class="token punctuation">;</span> <span class="token keyword">else</span> <span class="token builtin class-name">echo</span> <span class="token variable">$SECRET_KEY</span><span class="token punctuation">;</span> <span class="token keyword">fi</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable">$BOOTSTRAP_TOKEN</span>&quot;</span> <span class="token operator">=</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span> <span class="token assign-left variable">BOOTSTRAP_TOKEN</span><span class="token operator">=</span><span class="token variable"><span class="token variable">\`</span><span class="token function">cat</span> /dev/urandom <span class="token operator">|</span> <span class="token function">tr</span> <span class="token parameter variable">-dc</span> A-Za-z0-9 <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-c</span> <span class="token number">16</span><span class="token variable">\`</span></span><span class="token punctuation">;</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;BOOTSTRAP_TOKEN=<span class="token variable">$BOOTSTRAP_TOKEN</span>&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.bashrc<span class="token punctuation">;</span> <span class="token builtin class-name">echo</span> <span class="token variable">$BOOTSTRAP_TOKEN</span><span class="token punctuation">;</span> <span class="token keyword">else</span> <span class="token builtin class-name">echo</span> <span class="token variable">$BOOTSTRAP_TOKEN</span><span class="token punctuation">;</span> <span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置文件</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/jumpserver-v2.12.0</span>
<span class="line"><span class="token function">cp</span> config_example.yml config.yml</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> config.yml <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">SECRET_KEY: &quot;<span class="token variable">$SECRET_KEY</span>&quot;</span>
<span class="line">BOOTSTRAP_TOKEN: &quot;<span class="token variable">$BOOTSTRAP_TOKEN</span>&quot;</span>
<span class="line">DEBUG: true</span>
<span class="line">LOG_LEVEL: DEBUG</span>
<span class="line">SESSION_EXPIRE_AT_BROWSER_CLOSE: true</span>
<span class="line">DB_ENGINE: mysql</span>
<span class="line">DB_HOST: 10.0.0.51</span>
<span class="line">DB_PORT: 3306</span>
<span class="line">DB_USER: wang</span>
<span class="line">DB_PASSWORD: qwe123123</span>
<span class="line">DB_NAME: jumpserver</span>
<span class="line">HTTP_BIND_HOST: 0.0.0.0</span>
<span class="line">HTTP_LISTEN_PORT: 8080</span>
<span class="line">WS_LISTEN_PORT: 8070</span>
<span class="line">REDIS_HOST: 10.0.0.51</span>
<span class="line">REDIS_PORT: 6379</span>
<span class="line">REDIS_PASSWORD: qwe123123</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 数据库迁移</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/jumpserver-v2.12.0/apps</span>
<span class="line"><span class="token function">find</span> /opt/jumpserver-v2.12.0/apps <span class="token parameter variable">-name</span> <span class="token string">&quot;0*.py&quot;</span> <span class="token parameter variable">-delete</span></span>
<span class="line">python3 manage.py makemigrations</span>
<span class="line">python3 ./manage.py migrate</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建超级用户</span></span>
<span class="line">python3 manage.py createsuperuser</span>
<span class="line"><span class="token comment"># 输入：admin / admin@qwe.com / qwe123123</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动-core-服务" tabindex="-1"><a class="header-anchor" href="#启动-core-服务"><span>启动 Core 服务</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt/jumpserver-v2.12.0</span>
<span class="line">./jms start all <span class="token parameter variable">-d</span></span>
<span class="line">./jms status  <span class="token comment"># 验证服务状态</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-lina-前端部署" tabindex="-1"><a class="header-anchor" href="#_3-lina-前端部署"><span>3. Lina 前端部署</span></a></h2><h3 id="node-js-环境" tabindex="-1"><a class="header-anchor" href="#node-js-环境"><span>Node.js 环境</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /opt/node-v12.22.9 <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> /opt/node-v12.22.9 <span class="token operator">&amp;&amp;</span> <span class="token function">wget</span> https://nodejs.org/dist/v12.22.9/node-v12.22.9-linux-x64.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> node-v12.22.9-linux-x64.tar.gz <span class="token parameter variable">-C</span> /opt/node-v12.22.9 --strip-components <span class="token number">1</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/opt/node-v12.22.9/bin&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry http://registry.npmmirror.com</span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> <span class="token function">yarn</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="lina-源码与依赖" tabindex="-1"><a class="header-anchor" href="#lina-源码与依赖"><span>Lina 源码与依赖</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /opt/lina-v2.12.0</span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> /opt/lina-v2.12.0.tar.gz https://github.com/jumpserver/lina/archive/refs/tags/v2.12.0.tar.gz</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/lina-v2.12.0</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> lina-v2.12.0.tar.gz <span class="token parameter variable">-C</span> /opt/lina-v2.12.0 --strip-components <span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装依赖</span></span>
<span class="line"><span class="token function">yarn</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com/</span>
<span class="line"><span class="token function">yarn</span> cache clean</span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> node_modules yarn.lock</span>
<span class="line"><span class="token function">yarn</span> config <span class="token builtin class-name">set</span> ignore-engines <span class="token boolean">true</span></span>
<span class="line"><span class="token function">yarn</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动-lina" tabindex="-1"><a class="header-anchor" href="#启动-lina"><span>启动 Lina</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt/lina-v2.12.0</span>
<span class="line"><span class="token function">nohup</span> <span class="token function">yarn</span> serve <span class="token operator">&amp;</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">node</span>  <span class="token comment"># 验证 9528 端口</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-luna-前端部署" tabindex="-1"><a class="header-anchor" href="#_4-luna-前端部署"><span>4. Luna 前端部署</span></a></h2><h3 id="安装依赖" tabindex="-1"><a class="header-anchor" href="#安装依赖"><span>安装依赖</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /opt/luna-v2.12.0</span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> /opt/luna-2.12.0.tar.gz https://github.com/jumpserver/luna/archive/refs/tags/v2.12.0.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> luna-2.12.0.tar.gz <span class="token parameter variable">-C</span> /opt/luna-v2.12.0 --strip-components <span class="token number">1</span></span>
<span class="line"></span>
<span class="line">yum <span class="token parameter variable">-y</span> <span class="token function">install</span> gcc gcc-c++</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/luna-v2.12.0</span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span></span>
<span class="line"><span class="token assign-left variable">SASS_BINARY_SITE</span><span class="token operator">=</span>https://npm.taobao.org/mirrors/node-sass/ <span class="token function">npm</span> <span class="token function">install</span> node-sass@4.13.0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装 Angular CLI</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> @angular/cli@1.3.2 --unsafe-perm</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动-luna" tabindex="-1"><a class="header-anchor" href="#启动-luna"><span>启动 Luna</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt/luna-v2.12.0</span>
<span class="line"><span class="token function">nohup</span> ng serve --proxy-config proxy.conf.json <span class="token parameter variable">--host</span> <span class="token number">0.0</span>.0.0 <span class="token operator">&amp;</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> angular  <span class="token comment"># 验证 4200 端口</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-koko-ssh-服务部署" tabindex="-1"><a class="header-anchor" href="#_5-koko-ssh-服务部署"><span>5. Koko SSH 服务部署</span></a></h2><h3 id="go-环境与-koko-安装" tabindex="-1"><a class="header-anchor" href="#go-环境与-koko-安装"><span>Go 环境与 Koko 安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> /opt/koko-v2.12.0</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt <span class="token punctuation">;</span> <span class="token function">wget</span> https://github.com/jumpserver/koko/releases/download/v2.12.0/koko-v2.12.0-linux-amd64.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> koko-v2.12.0-linux-amd64.tar.gz <span class="token parameter variable">-C</span> /opt/koko-v2.12.0 --strip-components <span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token function">wget</span> https://golang.google.cn/dl/go1.15.linux-amd64.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> go1.15.linux-amd64.tar.gz</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/opt/go/bin&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/koko-v2.12.0</span>
<span class="line"><span class="token function">cp</span> config_example.yml config.yml</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> config.yml <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">CORE_HOST: http://127.0.0.1:8080</span>
<span class="line">BOOTSTRAP_TOKEN: &quot;<span class="token variable">$BOOTSTRAP_TOKEN</span>&quot;</span>
<span class="line">BIND_HOST: 0.0.0.0</span>
<span class="line">SSHD_PORT: 2222</span>
<span class="line">HTTPD_PORT: 5000</span>
<span class="line">LOG_LEVEL: DEBUG</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动</span></span>
<span class="line">./koko <span class="token parameter variable">-f</span> config.yml <span class="token parameter variable">-d</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;(5000|2222)&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-lion-vnc-服务部署" tabindex="-1"><a class="header-anchor" href="#_6-lion-vnc-服务部署"><span>6. Lion VNC 服务部署</span></a></h2><h3 id="guacamole-安装" tabindex="-1"><a class="header-anchor" href="#guacamole-安装"><span>Guacamole 安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token parameter variable">-y</span> <span class="token function">install</span> cairo-devel libjpeg-devel libpng-devel uuid-devel</span>
<span class="line"></span>
<span class="line"><span class="token function">mkdir</span> /opt/guacamole-v2.12.0</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/guacamole-v2.12.0</span>
<span class="line"><span class="token function">wget</span> http://download.jumpserver.org/public/guacamole-server-1.3.0.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzf</span> guacamole-server-1.3.0.tar.gz</span>
<span class="line"><span class="token builtin class-name">cd</span> guacamole-server-1.3.0/</span>
<span class="line"></span>
<span class="line">./configure --with-init-dir<span class="token operator">=</span>/etc/init.d</span>
<span class="line"><span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span></span>
<span class="line">ldconfig</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="lion-安装与配置" tabindex="-1"><a class="header-anchor" href="#lion-安装与配置"><span>Lion 安装与配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"><span class="token function">wget</span> https://github.com/jumpserver/lion-release/releases/download/v2.12.0/lion-v2.12.0-linux-amd64.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> lion-v2.12.0-linux-amd64.tar.gz</span>
<span class="line"><span class="token builtin class-name">cd</span> lion-v2.12.0-linux-amd64</span>
<span class="line"></span>
<span class="line"><span class="token function">cp</span> config_example.yml config.yml</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> config.yml <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">CORE_HOST: http://127.0.0.1:8080</span>
<span class="line">BOOTSTRAP_TOKEN: &quot;<span class="token variable">$BOOTSTRAP_TOKEN</span>&quot;</span>
<span class="line">BIND_HOST: 0.0.0.0</span>
<span class="line">HTTPD_PORT: 8081</span>
<span class="line">LOG_LEVEL: DEBUG</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动服务</span></span>
<span class="line">/etc/init.d/guacd start</span>
<span class="line"><span class="token function">nohup</span> ./lion <span class="token parameter variable">-f</span> config.yml <span class="token operator">&amp;</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> lion</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-nginx-整合配置" tabindex="-1"><a class="header-anchor" href="#_7-nginx-整合配置"><span>7. Nginx 整合配置</span></a></h2><h3 id="nginx-安装" tabindex="-1"><a class="header-anchor" href="#nginx-安装"><span>Nginx 安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/nginx.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[nginx-stable]</span>
<span class="line">name=nginx stable repo</span>
<span class="line">baseurl=http://nginx.org/packages/centos/\\<span class="token variable">$releasever</span>/\\<span class="token variable">$basearch</span>/</span>
<span class="line">gpgcheck=1</span>
<span class="line">enabled=1</span>
<span class="line">gpgkey=https://nginx.org/keys/nginx_signing.key</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="主机名解析" tabindex="-1"><a class="header-anchor" href="#主机名解析"><span>主机名解析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;10.0.0.61 luna lina core lion koko&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/hosts</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="nginx-配置文件" tabindex="-1"><a class="header-anchor" href="#nginx-配置文件"><span>Nginx 配置文件</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">client_max_body_size</span> <span class="token number">5000m</span></span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /luna/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://luna:4200</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /media/replay/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">add_header</span> Content-Encoding gzip</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">root</span> /opt/jumpserver-v2.12.0/data/</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /media/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">root</span> /opt/jumpserver-v2.12.0/data/</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /static/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">root</span> /opt/jumpserver-v2.12.0/data/</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /koko/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://koko:5000</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_http_version</span> 1.1</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Upgrade <span class="token variable">$http_upgrade</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Connection <span class="token string">&quot;upgrade&quot;</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /lion/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://lion:8081</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_request_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_http_version</span> 1.1</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Upgrade <span class="token variable">$http_upgrade</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Connection <span class="token variable">$http_connection</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_ignore_client_abort</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_connect_timeout</span> <span class="token number">600</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_send_timeout</span> <span class="token number">600</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_read_timeout</span> <span class="token number">600</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">send_timeout</span> <span class="token number">6000</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /ws/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://core:8070</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_http_version</span> 1.1</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Upgrade <span class="token variable">$http_upgrade</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Connection <span class="token string">&quot;upgrade&quot;</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /api/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://core:8080</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /core/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://core:8080</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /ui/</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_pass</span> http://lina:9528</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token directive"><span class="token keyword">rewrite</span> ^/(.*)$ /ui/<span class="token variable">$1</span> last</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="重启-nginx" tabindex="-1"><a class="header-anchor" href="#重启-nginx"><span>重启 Nginx</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">nginx <span class="token parameter variable">-t</span></span>
<span class="line">systemctl restart nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-访问与验证" tabindex="-1"><a class="header-anchor" href="#_8-访问与验证"><span>8. 访问与验证</span></a></h2><h3 id="访问地址" tabindex="-1"><a class="header-anchor" href="#访问地址"><span>访问地址</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">http://10.0.0.61</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="默认登录信息" tabindex="-1"><a class="header-anchor" href="#默认登录信息"><span>默认登录信息</span></a></h3><ul><li>用户名：admin</li><li>密码：admin（首次登录后需修改）</li></ul><h3 id="组件端口验证" tabindex="-1"><a class="header-anchor" href="#组件端口验证"><span>组件端口验证</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># Core 后端</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;8080|8070|5555&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Lina 前端</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">9528</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Luna 前端</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">4200</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Koko</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;5000|2222&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Lion</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">8081</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-重启后的启动顺序" tabindex="-1"><a class="header-anchor" href="#_9-重启后的启动顺序"><span>9. 重启后的启动顺序</span></a></h2><p>如果服务器重启，需要按以下顺序启动服务：</p><ol><li><p><strong>数据库服务器 (db-51)</strong></p><p>bash</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">systemctl start mysqld</span>
<span class="line">systemctl start redis</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>管理服务器 (master-61)</strong></p><p>bash</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># Core 后端</span>
<span class="line">source /opt/venv_py3/bin/activate</span>
<span class="line">cd /opt/jumpserver-v2.12.0</span>
<span class="line">./jms start all -d</span>
<span class="line">deactivate</span>
<span class="line"></span>
<span class="line"># Lina 前端</span>
<span class="line">cd /opt/lina-v2.12.0</span>
<span class="line">nohup yarn serve &amp;</span>
<span class="line"></span>
<span class="line"># Luna 前端</span>
<span class="line">cd /opt/luna-v2.12.0</span>
<span class="line">nohup ng serve --proxy-config proxy.conf.json --host 0.0.0.0 &amp;</span>
<span class="line"></span>
<span class="line"># Koko</span>
<span class="line">cd /opt/koko-v2.12.0</span>
<span class="line">./koko -f config.yml -d</span>
<span class="line"></span>
<span class="line"># Lion</span>
<span class="line">/etc/init.d/guacd start</span>
<span class="line">cd /opt/lion-v2.12.0-linux-amd64</span>
<span class="line">nohup ./lion -f config.yml &amp;</span>
<span class="line"></span>
<span class="line"># Nginx</span>
<span class="line">systemctl restart nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="部署要点总结" tabindex="-1"><a class="header-anchor" href="#部署要点总结"><span>部署要点总结</span></a></h2><ol><li><strong>组件分离</strong>：数据库、Redis 与核心服务分离部署，提高系统稳定性</li><li><strong>虚拟环境</strong>：Python 项目使用虚拟环境隔离依赖</li><li><strong>端口管理</strong>：各组件使用不同端口，通过 Nginx 统一代理</li><li><strong>服务注册</strong>：首次启动需要生成并配置密钥，组件间通过 Token 认证</li><li><strong>依赖管理</strong>：Python 使用 pip，Node.js 使用 yarn/npm，确保依赖版本正确</li><li><strong>配置文件</strong>：所有组件都有配置文件，注意 YAML 格式和变量引用</li><li><strong>启动顺序</strong>：数据库 → Core → 前端 → 代理组件 → Nginx</li></ol><p>这个部署过程涉及多种技术栈（Python、Node.js、Golang、Nginx、MySQL、Redis），是典型的现代化 Web 应用部署案例。每个步骤都需要仔细检查，特别是配置文件格式和依赖版本。</p>`,61)])])}const r=n(p,[["render",i]]),o=JSON.parse('{"path":"/10-%E5%A0%A1%E5%9E%92%E6%9C%BA%E8%BF%90%E7%BB%B4/01-%E5%A0%A1%E5%9E%92%E6%9C%BA%E8%BF%90%E7%BB%B4/jumpserver.html","title":"部署堡垒机 Jumpserver (Python + Vue + Golang) - 整理版","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"10-堡垒机运维/01-堡垒机运维/jumpserver.md"}');export{r as comp,o as data};
