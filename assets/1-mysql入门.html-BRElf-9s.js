import{_ as a,c as n,e,o as l}from"./app-DtXLoKBz.js";const i={};function t(p,s){return l(),n("div",null,[...s[0]||(s[0]=[e(`<h1 id="mysql数据库入门与实践指南" tabindex="-1"><a class="header-anchor" href="#mysql数据库入门与实践指南"><span>MySQL数据库入门与实践指南</span></a></h1><h2 id="一、数据库基础概念" tabindex="-1"><a class="header-anchor" href="#一、数据库基础概念"><span>一、数据库基础概念</span></a></h2><h3 id="_1-1-数据库-db-与数据库管理系统-dbms" tabindex="-1"><a class="header-anchor" href="#_1-1-数据库-db-与数据库管理系统-dbms"><span>1.1 数据库（DB）与数据库管理系统（DBMS）</span></a></h3><ul><li><strong>数据库</strong>：存储数据的&quot;仓库&quot;，以<strong>表</strong>为基本单位组织数据</li><li><strong>DBMS</strong>：管理和操作数据库的软件系统</li></ul><h3 id="_1-2-主流数据库类型" tabindex="-1"><a class="header-anchor" href="#_1-2-主流数据库类型"><span>1.2 主流数据库类型</span></a></h3><h4 id="关系型数据库-sql" tabindex="-1"><a class="header-anchor" href="#关系型数据库-sql"><span>关系型数据库（SQL）</span></a></h4><table><thead><tr><th style="text-align:left;">特点</th><th style="text-align:left;">适用场景</th><th style="text-align:left;">代表产品</th></tr></thead><tbody><tr><td style="text-align:left;">二维表格结构</td><td style="text-align:left;">Web 1.0网站、传统企业系统</td><td style="text-align:left;">MySQL、Oracle、SQL Server、PostgreSQL</td></tr><tr><td style="text-align:left;">强数据一致性</td><td style="text-align:left;">需要复杂查询和事务支持</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">使用SQL语言</td><td style="text-align:left;"></td><td style="text-align:left;"></td></tr></tbody></table><h4 id="非关系型数据库-nosql" tabindex="-1"><a class="header-anchor" href="#非关系型数据库-nosql"><span>非关系型数据库（NoSQL）</span></a></h4><table><thead><tr><th style="text-align:left;">特点</th><th style="text-align:left;">适用场景</th><th style="text-align:left;">代表产品</th></tr></thead><tbody><tr><td style="text-align:left;">数据结构灵活</td><td style="text-align:left;">Web 2.0/3.0动态网站</td><td style="text-align:left;">Redis、MongoDB、Cassandra</td></tr><tr><td style="text-align:left;">高并发读写</td><td style="text-align:left;">大规模数据存取</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">无固定模式</td><td style="text-align:left;">高性能要求场景</td><td style="text-align:left;"></td></tr></tbody></table><h3 id="_1-3-核心概念类比" tabindex="-1"><a class="header-anchor" href="#_1-3-核心概念类比"><span>1.3 核心概念类比</span></a></h3><table><thead><tr><th style="text-align:left;">数据库概念</th><th style="text-align:left;">类比理解</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>数据库</strong></td><td style="text-align:left;">文件夹</td><td style="text-align:left;">存放相关数据的集合</td></tr><tr><td style="text-align:left;"><strong>表</strong></td><td style="text-align:left;">文件夹中的文件</td><td style="text-align:left;">存储特定类型数据的基本结构</td></tr><tr><td style="text-align:left;"><strong>列（字段）</strong></td><td style="text-align:left;">文件中的列</td><td style="text-align:left;">定义数据类型（如数字、文本）</td></tr><tr><td style="text-align:left;"><strong>行（记录）</strong></td><td style="text-align:left;">文件中的行</td><td style="text-align:left;">一条具体的数据记录</td></tr><tr><td style="text-align:left;"><strong>主键</strong></td><td style="text-align:left;">唯一标识符</td><td style="text-align:left;">唯一标识每一行，不能为空或重复</td></tr><tr><td style="text-align:left;"><strong>外键</strong></td><td style="text-align:left;">表间连接</td><td style="text-align:left;">指向另一张表的主键，建立关联关系</td></tr></tbody></table><h3 id="_1-4-sql语言" tabindex="-1"><a class="header-anchor" href="#_1-4-sql语言"><span>1.4 SQL语言</span></a></h3><ul><li><strong>查询语言</strong>：<code>SELECT</code></li><li><strong>操作语言</strong>：<code>INSERT</code>、<code>UPDATE</code>、<code>DELETE</code></li><li><strong>管理语言</strong>：<code>CREATE</code>、<code>DROP</code></li></ul><hr><h2 id="二、mysql特点与版本选择" tabindex="-1"><a class="header-anchor" href="#二、mysql特点与版本选择"><span>二、MySQL特点与版本选择</span></a></h2><h3 id="_2-1-为什么选择mysql" tabindex="-1"><a class="header-anchor" href="#_2-1-为什么选择mysql"><span>2.1 为什么选择MySQL</span></a></h3><ul><li>开源免费</li><li>性能强大稳定</li><li>社区活跃</li><li>兼容多种编程语言</li><li>安装简单</li></ul><h3 id="_2-2-innodb引擎特性" tabindex="-1"><a class="header-anchor" href="#_2-2-innodb引擎特性"><span>2.2 InnoDB引擎特性</span></a></h3><ol><li>支持事务（ACID特性）</li><li>表级锁机制</li><li>支持外键约束</li><li>适合电商、用户管理等场景</li></ol><h3 id="_2-3-版本选择" tabindex="-1"><a class="header-anchor" href="#_2-3-版本选择"><span>2.3 版本选择</span></a></h3><ul><li><strong>企业版</strong>：收费，提供技术支持</li><li><strong>社区版</strong>：免费，适合学习和生产（主流：5.6、5.7、8.0）</li></ul><hr><h2 id="三、mysql单实例安装部署" tabindex="-1"><a class="header-anchor" href="#三、mysql单实例安装部署"><span>三、MySQL单实例安装部署</span></a></h2><h3 id="_3-1-环境准备" tabindex="-1"><a class="header-anchor" href="#_3-1-环境准备"><span>3.1 环境准备</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 进入工作目录</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下载并解压（以5.7.28为例）</span></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzf</span> mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建软链接</span></span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /opt/mysql-5.7.28-linux-glibc2.12-x86_64 /opt/mysql</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置PATH</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/opt/mysql/bin&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-依赖处理" tabindex="-1"><a class="header-anchor" href="#_3-2-依赖处理"><span>3.2 依赖处理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 移除冲突的mariadb</span></span>
<span class="line">yum remove mariadb-libs.x86_64 <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装MySQL依赖</span></span>
<span class="line">yum <span class="token function">install</span> libaio-devel <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理默认配置</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> /etc/my.cnf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-创建用户和目录" tabindex="-1"><a class="header-anchor" href="#_3-3-创建用户和目录"><span>3.3 创建用户和目录</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建MySQL用户</span></span>
<span class="line"><span class="token function">useradd</span> <span class="token parameter variable">-s</span> /sbin/nologin <span class="token parameter variable">-M</span> mysql</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建数据目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /linux0224/mysql_3306/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置权限</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> mysql.mysql /linux0224/</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> mysql.mysql /opt/mysql*</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-配置文件" tabindex="-1"><a class="header-anchor" href="#_3-4-配置文件"><span>3.4 配置文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/my.cnf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">[mysqld]</span>
<span class="line">port=3306</span>
<span class="line">user=mysql</span>
<span class="line">basedir=/opt/mysql</span>
<span class="line">datadir=/linux0224/mysql_3306/</span>
<span class="line">socket=/tmp/mysql.sock</span>
<span class="line"></span>
<span class="line">[mysql]</span>
<span class="line">socket=/tmp/mysql.sock</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-5-初始化数据库" tabindex="-1"><a class="header-anchor" href="#_3-5-初始化数据库"><span>3.5 初始化数据库</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 初始化数据目录</span></span>
<span class="line">mysqld --initialize-insecure <span class="token parameter variable">--user</span><span class="token operator">=</span>mysql <span class="token punctuation">\\</span></span>
<span class="line">       <span class="token parameter variable">--basedir</span><span class="token operator">=</span>/opt/mysql <span class="token punctuation">\\</span></span>
<span class="line">       <span class="token parameter variable">--datadir</span><span class="token operator">=</span>/linux0224/mysql_3306/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-6-启动管理" tabindex="-1"><a class="header-anchor" href="#_3-6-启动管理"><span>3.6 启动管理</span></a></h3><h4 id="方式一-使用系统自带脚本" tabindex="-1"><a class="header-anchor" href="#方式一-使用系统自带脚本"><span>方式一：使用系统自带脚本</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cp</span> /opt/mysql/support-files/mysql.server /etc/init.d/mysqld</span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式二-创建systemd服务" tabindex="-1"><a class="header-anchor" href="#方式二-创建systemd服务"><span>方式二：创建Systemd服务</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/systemd/system/mysqld.service <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">[Unit]</span>
<span class="line">Description=MySQL Server</span>
<span class="line">After=network.target</span>
<span class="line"></span>
<span class="line">[Service]</span>
<span class="line">User=mysql</span>
<span class="line">Group=mysql</span>
<span class="line">ExecStart=/opt/mysql/bin/mysqld --defaults-file=/etc/my.cnf</span>
<span class="line">LimitNOFILE=5000</span>
<span class="line"></span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-7-登录mysql" tabindex="-1"><a class="header-anchor" href="#_3-7-登录mysql"><span>3.7 登录MySQL</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 首次登录（无密码）</span></span>
<span class="line">mysql</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改root密码</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p</span> <span class="token parameter variable">-S</span> /tmp/mysql.sock password <span class="token string">&quot;your_new_password&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、mysql多实例部署" tabindex="-1"><a class="header-anchor" href="#四、mysql多实例部署"><span>四、MySQL多实例部署</span></a></h2><h3 id="_4-1-多实例优势" tabindex="-1"><a class="header-anchor" href="#_4-1-多实例优势"><span>4.1 多实例优势</span></a></h3><ul><li>资源利用率高</li><li>适合资金紧张的公司</li><li>用户并发量不大的业务</li></ul><h3 id="_4-2-创建多实例数据目录" tabindex="-1"><a class="header-anchor" href="#_4-2-创建多实例数据目录"><span>4.2 创建多实例数据目录</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /linux0224/mysql_3307</span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /linux0224/mysql_3308</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> mysql.mysql /linux0224</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-初始化实例" tabindex="-1"><a class="header-anchor" href="#_4-3-初始化实例"><span>4.3 初始化实例</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 初始化3307实例</span></span>
<span class="line">mysqld --initialize-insecure <span class="token parameter variable">--user</span><span class="token operator">=</span>mysql <span class="token punctuation">\\</span></span>
<span class="line">       <span class="token parameter variable">--basedir</span><span class="token operator">=</span>/opt/mysql <span class="token punctuation">\\</span></span>
<span class="line">       <span class="token parameter variable">--datadir</span><span class="token operator">=</span>/linux0224/mysql_3307</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 初始化3308实例</span></span>
<span class="line">mysqld --initialize-insecure <span class="token parameter variable">--user</span><span class="token operator">=</span>mysql <span class="token punctuation">\\</span></span>
<span class="line">       <span class="token parameter variable">--basedir</span><span class="token operator">=</span>/opt/mysql <span class="token punctuation">\\</span></span>
<span class="line">       <span class="token parameter variable">--datadir</span><span class="token operator">=</span>/linux0224/mysql_3308</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-配置文件" tabindex="-1"><a class="header-anchor" href="#_4-4-配置文件"><span>4.4 配置文件</span></a></h3><h4 id="_3307实例配置" tabindex="-1"><a class="header-anchor" href="#_3307实例配置"><span>3307实例配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/mysql_3307.cnf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">[mysqld]</span>
<span class="line">port=3307</span>
<span class="line">user=mysql</span>
<span class="line">basedir=/opt/mysql/</span>
<span class="line">datadir=/linux0224/mysql_3307/</span>
<span class="line">socket=/linux0224/mysql_3307/mysql.sock</span>
<span class="line">log_error=/linux0224/mysql_3307/mysql.log</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3308实例配置" tabindex="-1"><a class="header-anchor" href="#_3308实例配置"><span>3308实例配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/mysql_3308.cnf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">[mysqld]</span>
<span class="line">port=3308</span>
<span class="line">user=mysql</span>
<span class="line">basedir=/opt/mysql/</span>
<span class="line">datadir=/linux0224/mysql_3308/</span>
<span class="line">socket=/linux0224/mysql_3308/mysql.sock</span>
<span class="line">log_error=/linux0224/mysql_3308/mysql.log</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-5-启动脚本模板" tabindex="-1"><a class="header-anchor" href="#_4-5-启动脚本模板"><span>4.5 启动脚本模板</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建3307启动脚本（示例）</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /linux0224/3307.sh <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line">port=&quot;3307&quot;</span>
<span class="line">Cmdpath=&quot;/opt/mysql/bin/&quot;</span>
<span class="line">mysql_sock=&quot;/linux0224/mysql_\\\${port}/mysql.sock&quot;</span>
<span class="line">mysqld_pid_file_path=&quot;/linux0224/mysql_\\\${port}/mysqld_\\\${port}.pid&quot;</span>
<span class="line"></span>
<span class="line">start(){</span>
<span class="line">    if [ ! -e &quot;\\$mysql_sock&quot; ];then</span>
<span class="line">        printf &quot;Starting MySQL...\\n&quot;</span>
<span class="line">        /bin/sh \\\${Cmdpath}/mysqld_safe \\</span>
<span class="line">            --defaults-file=/etc/mysql_\\\${port}.cnf \\</span>
<span class="line">            --pid-file=\\$mysqld_pid_file_path 2&gt;&amp;1 &gt; /dev/null &amp;</span>
<span class="line">        sleep 3</span>
<span class="line">    else</span>
<span class="line">        printf &quot;MySQL is running...\\n&quot;</span>
<span class="line">        exit 1</span>
<span class="line">    fi</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">stop(){</span>
<span class="line">    if [ ! -e &quot;\\$mysql_sock&quot; ];then</span>
<span class="line">        printf &quot;MySQL is stopped...\\n&quot;</span>
<span class="line">        exit 1</span>
<span class="line">    else</span>
<span class="line">        printf &quot;Stoping MySQL...\\n&quot;</span>
<span class="line">        mysqld_pid=\\$(cat &quot;\\$mysqld_pid_file_path&quot;)</span>
<span class="line">        kill \\$mysqld_pid</span>
<span class="line">        sleep 2</span>
<span class="line">    fi</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">restart(){</span>
<span class="line">    printf &quot;Restarting MySQL...\\n&quot;</span>
<span class="line">    stop</span>
<span class="line">    sleep 2</span>
<span class="line">    start</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">case &quot;\\$1&quot; in</span>
<span class="line">    start) start ;;</span>
<span class="line">    stop) stop ;;</span>
<span class="line">    restart) restart ;;</span>
<span class="line">    *) printf &quot;Usage: \\$0 {start|stop|restart}\\n&quot; ;;</span>
<span class="line">esac</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建3308脚本（复制修改端口即可）</span></span>
<span class="line"><span class="token function">sed</span> <span class="token string">&#39;s/3307/3308/g&#39;</span> /linux0224/3307.sh <span class="token operator">&gt;</span> /linux0224/3308.sh</span>
<span class="line"><span class="token function">chmod</span> +x /linux0224/3307.sh /linux0224/3308.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-6-启动多实例" tabindex="-1"><a class="header-anchor" href="#_4-6-启动多实例"><span>4.6 启动多实例</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 启动3306（使用系统服务）</span></span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动3307和3308</span></span>
<span class="line"><span class="token function">bash</span> /linux0224/3307.sh start</span>
<span class="line"><span class="token function">bash</span> /linux0224/3308.sh start</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查端口监听</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> mysql</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-7-设置多实例密码" tabindex="-1"><a class="header-anchor" href="#_4-7-设置多实例密码"><span>4.7 设置多实例密码</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 3306实例（socket在/tmp）</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p</span> <span class="token parameter variable">-S</span> /tmp/mysql.sock password <span class="token string">&quot;linux3306&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3307实例</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p</span> <span class="token parameter variable">-S</span> /linux0224/mysql_3307/mysql.sock password <span class="token string">&quot;linux3307&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3308实例</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p</span> <span class="token parameter variable">-S</span> /linux0224/mysql_3308/mysql.sock password <span class="token string">&quot;linux3308&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-8-连接多实例" tabindex="-1"><a class="header-anchor" href="#_4-8-连接多实例"><span>4.8 连接多实例</span></a></h3><h4 id="方式一-通过ip和端口" tabindex="-1"><a class="header-anchor" href="#方式一-通过ip和端口"><span>方式一：通过IP和端口</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 连接3306</span></span>
<span class="line">mysql <span class="token parameter variable">-h127.0.0.1</span> <span class="token parameter variable">-P3306</span> <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-plinux3306</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 连接3307</span></span>
<span class="line">mysql <span class="token parameter variable">-h127.0.0.1</span> <span class="token parameter variable">-P3307</span> <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-plinux3307</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 连接3308</span></span>
<span class="line">mysql <span class="token parameter variable">-h127.0.0.1</span> <span class="token parameter variable">-P3308</span> <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-plinux3308</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式二-通过socket文件" tabindex="-1"><a class="header-anchor" href="#方式二-通过socket文件"><span>方式二：通过Socket文件</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 连接3306</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-plinux3306</span> <span class="token parameter variable">-S</span> /tmp/mysql.sock</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 连接3307</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-plinux3307</span> <span class="token parameter variable">-S</span> /linux0224/mysql_3307/mysql.sock</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 连接3308</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-plinux3308</span> <span class="token parameter variable">-S</span> /linux0224/mysql_3308/mysql.sock</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-9-快速验证连接" tabindex="-1"><a class="header-anchor" href="#_4-9-快速验证连接"><span>4.9 快速验证连接</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看实例端口</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-plinux3307</span> <span class="token parameter variable">-h127.0.0.1</span> <span class="token parameter variable">-P3307</span> <span class="token punctuation">\\</span></span>
<span class="line">      <span class="token parameter variable">-e</span> <span class="token string">&quot;show global variables like &#39;port&#39;;&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、关键文件说明" tabindex="-1"><a class="header-anchor" href="#五、关键文件说明"><span>五、关键文件说明</span></a></h2><h3 id="_5-1-重要文件路径" tabindex="-1"><a class="header-anchor" href="#_5-1-重要文件路径"><span>5.1 重要文件路径</span></a></h3><table><thead><tr><th style="text-align:left;">文件类型</th><th style="text-align:left;">3306实例</th><th style="text-align:left;">3307实例</th><th style="text-align:left;">3308实例</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>配置文件</strong></td><td style="text-align:left;"><code>/etc/my.cnf</code></td><td style="text-align:left;"><code>/etc/mysql_3307.cnf</code></td><td style="text-align:left;"><code>/etc/mysql_3308.cnf</code></td></tr><tr><td style="text-align:left;"><strong>数据目录</strong></td><td style="text-align:left;"><code>/linux0224/mysql_3306/</code></td><td style="text-align:left;"><code>/linux0224/mysql_3307/</code></td><td style="text-align:left;"><code>/linux0224/mysql_3308/</code></td></tr><tr><td style="text-align:left;"><strong>Socket文件</strong></td><td style="text-align:left;"><code>/tmp/mysql.sock</code></td><td style="text-align:left;"><code>/linux0224/mysql_3307/mysql.sock</code></td><td style="text-align:left;"><code>/linux0224/mysql_3308/mysql.sock</code></td></tr><tr><td style="text-align:left;"><strong>PID文件</strong></td><td style="text-align:left;"><code>/linux0224/mysql_3306/hostname.pid</code></td><td style="text-align:left;"><code>/linux0224/mysql_3307/mysqld_3307.pid</code></td><td style="text-align:left;"><code>/linux0224/mysql_3308/mysqld_3308.pid</code></td></tr><tr><td style="text-align:left;"><strong>错误日志</strong></td><td style="text-align:left;">默认位置</td><td style="text-align:left;"><code>/linux0224/mysql_3307/mysql.log</code></td><td style="text-align:left;"><code>/linux0224/mysql_3308/mysql.log</code></td></tr></tbody></table><h3 id="_5-2-生产环境注意事项" tabindex="-1"><a class="header-anchor" href="#_5-2-生产环境注意事项"><span>5.2 生产环境注意事项</span></a></h3><ol><li><strong>Socket文件</strong>：避免放在<code>/tmp</code>目录（可能被清理）</li><li><strong>权限管理</strong>：确保MySQL用户对目录有正确权限</li><li><strong>备份策略</strong>：定期备份数据和配置文件</li><li><strong>监控</strong>：监控实例运行状态和资源使用情况</li></ol><hr><h2 id="六、运维学习重点" tabindex="-1"><a class="header-anchor" href="#六、运维学习重点"><span>六、运维学习重点</span></a></h2><h3 id="_6-1-运维方向" tabindex="-1"><a class="header-anchor" href="#_6-1-运维方向"><span>6.1 运维方向</span></a></h3><ul><li>安装部署与配置优化</li><li>备份恢复策略</li><li>主从复制与高可用</li><li>性能监控与调优</li><li>安全管理与权限控制</li></ul><h3 id="_6-2-开发方向" tabindex="-1"><a class="header-anchor" href="#_6-2-开发方向"><span>6.2 开发方向</span></a></h3><ul><li>数据库设计与建模</li><li>SQL编写与优化</li><li>索引设计与优化</li><li>存储过程与函数</li><li>事务管理与并发控制</li></ul><hr><h2 id="七、实践建议" tabindex="-1"><a class="header-anchor" href="#七、实践建议"><span>七、实践建议</span></a></h2><h3 id="_7-1-学习路径" tabindex="-1"><a class="header-anchor" href="#_7-1-学习路径"><span>7.1 学习路径</span></a></h3><ol><li>掌握单实例安装部署</li><li>理解多实例架构</li><li>学习基本SQL操作</li><li>实践备份恢复</li><li>探索高可用方案</li></ol><h3 id="_7-2-作业要求" tabindex="-1"><a class="header-anchor" href="#_7-2-作业要求"><span>7.2 作业要求</span></a></h3><ol><li>整理数据库基础知识笔记</li><li>完成MySQL 5.7多实例搭建</li><li>验证各实例独立运行</li><li>掌握不同连接方式</li></ol><hr><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>MySQL作为最流行的开源关系型数据库，掌握其部署和管理是运维人员的基本技能。通过本指南，您应该能够：</p><ul><li>理解数据库基本概念</li><li>完成MySQL单实例部署</li><li>配置和管理多实例环境</li><li>掌握不同的连接方式</li><li>了解生产环境最佳实践</li></ul><p>建议在实际操作中加深理解，为后续的数据库运维和优化打下坚实基础。</p>`,89)])])}const d=a(i,[["render",t]]),c=JSON.parse('{"path":"/09-%E4%B8%AD%E9%97%B4%E4%BB%B6/02-mysql%E6%95%B0%E6%8D%AE%E5%BA%93/1-mysql%E5%85%A5%E9%97%A8.html","title":"MySQL数据库入门与实践指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"09-中间件/02-mysql数据库/1-mysql入门.md"}');export{d as comp,c as data};
