import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="云服务器-mysql-操作手册" tabindex="-1"><a class="header-anchor" href="#云服务器-mysql-操作手册"><span>云服务器 MySQL 操作手册</span></a></h1><h2 id="一、删除旧版-mysql" tabindex="-1"><a class="header-anchor" href="#一、删除旧版-mysql"><span>一、删除旧版 MySQL</span></a></h2><h3 id="_1-1-执行删除脚本" tabindex="-1"><a class="header-anchor" href="#_1-1-执行删除脚本"><span>1.1 执行删除脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建删除脚本</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> remove_mysql.sh <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line"># 停止 MySQL</span>
<span class="line">echo &quot;正在停止 MySQL 服务...&quot;</span>
<span class="line">sudo systemctl stop mysql 2&gt;/dev/null</span>
<span class="line">sudo systemctl stop mysqld 2&gt;/dev/null</span>
<span class="line">sudo /usr/local/mysql/support-files/mysql.server stop 2&gt;/dev/null</span>
<span class="line"></span>
<span class="line"># 杀死所有 MySQL 进程</span>
<span class="line">echo &quot;正在结束 MySQL 进程...&quot;</span>
<span class="line">sudo pkill -9 mysql</span>
<span class="line">sudo pkill -9 mysqld</span>
<span class="line"></span>
<span class="line"># 删除安装目录</span>
<span class="line">echo &quot;正在删除安装目录...&quot;</span>
<span class="line">sudo rm -rf /usr/local/mysql</span>
<span class="line"></span>
<span class="line"># 删除数据目录</span>
<span class="line">echo &quot;正在删除数据目录...&quot;</span>
<span class="line">sudo rm -rf /usr/local/mysql/data</span>
<span class="line">sudo rm -rf /var/lib/mysql</span>
<span class="line"></span>
<span class="line"># 删除配置文件</span>
<span class="line">echo &quot;正在删除配置文件...&quot;</span>
<span class="line">sudo rm -rf /etc/my.cnf</span>
<span class="line">sudo rm -rf /etc/mysql</span>
<span class="line">sudo rm -rf /etc/my.cnf.d</span>
<span class="line"></span>
<span class="line"># 删除日志文件</span>
<span class="line">echo &quot;正在删除日志文件...&quot;</span>
<span class="line">sudo rm -rf /var/log/mysql*</span>
<span class="line">sudo rm -rf /var/log/mysqld.log</span>
<span class="line"></span>
<span class="line"># 清理系统服务</span>
<span class="line">echo &quot;正在清理系统服务...&quot;</span>
<span class="line">sudo systemctl disable mysql 2&gt;/dev/null</span>
<span class="line">sudo systemctl disable mysqld 2&gt;/dev/null</span>
<span class="line">sudo rm -rf /etc/systemd/system/mysql.service</span>
<span class="line">sudo rm -rf /etc/systemd/system/mysqld.service</span>
<span class="line">sudo systemctl daemon-reload</span>
<span class="line"></span>
<span class="line"># 删除用户和组</span>
<span class="line">echo &quot;正在删除用户和组...&quot;</span>
<span class="line">sudo userdel mysql 2&gt;/dev/null</span>
<span class="line">sudo groupdel mysql 2&gt;/dev/null</span>
<span class="line"></span>
<span class="line">echo &quot;MySQL 已完全删除！&quot;</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 执行删除脚本</span></span>
<span class="line"><span class="token function">chmod</span> +x remove_mysql.sh</span>
<span class="line"><span class="token function">sudo</span> ./remove_mysql.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-清理环境变量" tabindex="-1"><a class="header-anchor" href="#_1-2-清理环境变量"><span>1.2 清理环境变量</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 删除 /etc/profile 中的 MySQL 环境变量</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/export PATH=\\$PATH:\\/opt\\/mysql\\/bin/d&#39;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证是否清理成功</span></span>
<span class="line">mysql <span class="token parameter variable">-V</span></span>
<span class="line"><span class="token comment"># 无输出表示已清理干净</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、安装-mysql-5-7-28" tabindex="-1"><a class="header-anchor" href="#二、安装-mysql-5-7-28"><span>二、安装 MySQL 5.7.28</span></a></h2><h3 id="_2-1-安装步骤" tabindex="-1"><a class="header-anchor" href="#_2-1-安装步骤"><span>2.1 安装步骤</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 进入安装目录</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解压 MySQL 安装包</span></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzf</span> mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建软链接</span></span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /opt/mysql-5.7.28-linux-glibc2.12-x86_64 /opt/mysql</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置环境变量</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/opt/mysql/bin&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证安装</span></span>
<span class="line">mysql <span class="token parameter variable">-V</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装依赖</span></span>
<span class="line">yum <span class="token function">install</span> libaio-devel <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建 MySQL 用户</span></span>
<span class="line"><span class="token function">useradd</span> <span class="token parameter variable">-s</span> /sbin/nologin <span class="token parameter variable">-M</span> mysql</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建数据目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /linux0224/mysql_3306/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置目录权限</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> mysql.mysql /linux0224/</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> mysql.mysql /linux0224/*</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> mysql.mysql /opt/mysql*</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证权限</span></span>
<span class="line"><span class="token function">ls</span> <span class="token parameter variable">-ld</span> /linux0224 /linux0224/mysql_3306/ /opt/mysql*</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 初始化数据库</span></span>
<span class="line">mysqld --initialize-insecure <span class="token parameter variable">--user</span><span class="token operator">=</span>mysql <span class="token punctuation">\\</span></span>
<span class="line">       <span class="token parameter variable">--basedir</span><span class="token operator">=</span>/opt/mysql <span class="token punctuation">\\</span></span>
<span class="line">       <span class="token parameter variable">--datadir</span><span class="token operator">=</span>/linux0224/mysql_3306/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、mysql-配置" tabindex="-1"><a class="header-anchor" href="#三、mysql-配置"><span>三、MySQL 配置</span></a></h2><h3 id="_3-1-配置文件" tabindex="-1"><a class="header-anchor" href="#_3-1-配置文件"><span>3.1 配置文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/my.cnf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
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
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-服务管理" tabindex="-1"><a class="header-anchor" href="#_3-2-服务管理"><span>3.2 服务管理</span></a></h3><h4 id="方式一-使用自带脚本" tabindex="-1"><a class="header-anchor" href="#方式一-使用自带脚本"><span>方式一：使用自带脚本</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cp</span> /opt/mysql/support-files/mysql.server /etc/init.d/mysqld</span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式二-创建-systemd-服务" tabindex="-1"><a class="header-anchor" href="#方式二-创建-systemd-服务"><span>方式二：创建 Systemd 服务</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/systemd/system/mysqld.service <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">[Unit]</span>
<span class="line">Description=mysql server by www.yuchaoit.cn</span>
<span class="line">Documentation=man:mysqld(8)</span>
<span class="line">Documentation=https://dev.mysql.com/doc/refman/en/using-systemd.html</span>
<span class="line">After=network.target</span>
<span class="line">After=syslog.target</span>
<span class="line"></span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line"></span>
<span class="line">[Service]</span>
<span class="line">User=mysql</span>
<span class="line">Group=mysql</span>
<span class="line">ExecStart=/opt/mysql/bin/mysqld --defaults-file=/etc/my.cnf</span>
<span class="line">LimitNOFILE=5000</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新加载并启动</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、mysql-密码管理" tabindex="-1"><a class="header-anchor" href="#四、mysql-密码管理"><span>四、MySQL 密码管理</span></a></h2><h3 id="_4-1-设置初始密码" tabindex="-1"><a class="header-anchor" href="#_4-1-设置初始密码"><span>4.1 设置初始密码</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 设置 root 初始密码</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> password qwe123 <span class="token parameter variable">-S</span> /tmp/mysql.sock</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 登录验证</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-pqwe123</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-修改密码的多种方式" tabindex="-1"><a class="header-anchor" href="#_4-2-修改密码的多种方式"><span>4.2 修改密码的多种方式</span></a></h3><h4 id="_4-2-1-使用-mysqladmin" tabindex="-1"><a class="header-anchor" href="#_4-2-1-使用-mysqladmin"><span>4.2.1 使用 mysqladmin</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 修改当前用户密码</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-plinux3306</span> <span class="token parameter variable">-S</span> /tmp/mysql.sock password new3306</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 交互式修改密码</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p</span> <span class="token parameter variable">-S</span> /tmp/mysql.sock password</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-2-2-使用-sql-语句" tabindex="-1"><a class="header-anchor" href="#_4-2-2-使用-sql-语句"><span>4.2.2 使用 SQL 语句</span></a></h4><h5 id="set-语句" tabindex="-1"><a class="header-anchor" href="#set-语句"><span>SET 语句</span></a></h5><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 管理员修改其他用户密码</span></span>
<span class="line">SET PASSWORD FOR <span class="token string">&#39;sql01&#39;</span>@<span class="token string">&#39;localhost&#39;</span> <span class="token operator">=</span> PASSWORD<span class="token punctuation">(</span><span class="token string">&#39;qwe123&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 用户修改自己密码</span></span>
<span class="line">SET PASSWORD <span class="token operator">=</span> <span class="token string">&#39;new_password&#39;</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="update-语句" tabindex="-1"><a class="header-anchor" href="#update-语句"><span>UPDATE 语句</span></a></h5><div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code class="language-sql"><span class="line"><span class="token keyword">UPDATE</span> mysql<span class="token punctuation">.</span><span class="token keyword">user</span> <span class="token keyword">SET</span> authentication_string <span class="token operator">=</span> PASSWORD<span class="token punctuation">(</span><span class="token string">&#39;qwe123&#39;</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">WHERE</span> <span class="token keyword">user</span> <span class="token operator">=</span> <span class="token string">&#39;sql01&#39;</span> <span class="token operator">AND</span> host <span class="token operator">=</span> <span class="token string">&#39;localhost&#39;</span><span class="token punctuation">;</span></span>
<span class="line">FLUSH <span class="token keyword">PRIVILEGES</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="alter-user-语句" tabindex="-1"><a class="header-anchor" href="#alter-user-语句"><span>ALTER USER 语句</span></a></h5><div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code class="language-sql"><span class="line"><span class="token keyword">ALTER</span> <span class="token keyword">USER</span> <span class="token string">&#39;sql02&#39;</span><span class="token variable">@&#39;localhost&#39;</span> IDENTIFIED <span class="token keyword">BY</span> <span class="token string">&#39;qwe123&#39;</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h2 id="五、忘记-root-密码重置" tabindex="-1"><a class="header-anchor" href="#五、忘记-root-密码重置"><span>五、忘记 root 密码重置</span></a></h2><h3 id="方法一-修改配置文件" tabindex="-1"><a class="header-anchor" href="#方法一-修改配置文件"><span>方法一：修改配置文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 修改配置文件，添加跳过授权表参数</span></span>
<span class="line"><span class="token function">vim</span> /etc/my.cnf</span>
<span class="line"><span class="token comment"># 添加如下行：</span></span>
<span class="line"><span class="token comment"># skip-grant-tables</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 重启 MySQL</span></span>
<span class="line">systemctl restart mysqld</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 无密码登录</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 重置密码</span></span>
<span class="line">UPDATE mysql.user SET authentication_string <span class="token operator">=</span> PASSWORD<span class="token punctuation">(</span><span class="token string">&#39;123123&#39;</span><span class="token punctuation">)</span></span>
<span class="line">WHERE user <span class="token operator">=</span> <span class="token string">&#39;root&#39;</span> AND <span class="token function">host</span> <span class="token operator">=</span> <span class="token string">&#39;localhost&#39;</span><span class="token punctuation">;</span></span>
<span class="line">FLUSH PRIVILEGES<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 移除免密参数，重启服务</span></span>
<span class="line"><span class="token comment"># 删除 skip-grant-tables</span></span>
<span class="line">systemctl restart mysqld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方法二-命令行启动免密" tabindex="-1"><a class="header-anchor" href="#方法二-命令行启动免密"><span>方法二：命令行启动免密</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 停止当前 MySQL 服务</span></span>
<span class="line">systemctl stop mysqld</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 以跳过授权表方式启动</span></span>
<span class="line">/opt/mysql/bin/mysqld_safe --defaults-file<span class="token operator">=</span>/etc/my.cnf <span class="token punctuation">\\</span></span>
<span class="line">    --pid-file<span class="token operator">=</span>/linux0224/mysql_3306/yun.pid <span class="token punctuation">\\</span></span>
<span class="line">    --skip-grant-tables <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 无密码登录重置</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span></span>
<span class="line">UPDATE mysql.user SET authentication_string <span class="token operator">=</span> PASSWORD<span class="token punctuation">(</span><span class="token string">&#39;123123&#39;</span><span class="token punctuation">)</span></span>
<span class="line">WHERE user <span class="token operator">=</span> <span class="token string">&#39;root&#39;</span> AND <span class="token function">host</span> <span class="token operator">=</span> <span class="token string">&#39;localhost&#39;</span><span class="token punctuation">;</span></span>
<span class="line">FLUSH PRIVILEGES<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止免密实例，正常启动</span></span>
<span class="line"><span class="token function">pkill</span> mysqld</span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、部署-jpress-网站" tabindex="-1"><a class="header-anchor" href="#六、部署-jpress-网站"><span>六、部署 JPress 网站</span></a></h2><h3 id="_6-1-部署步骤" tabindex="-1"><a class="header-anchor" href="#_6-1-部署步骤"><span>6.1 部署步骤</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 将 jpress.war 放到 Tomcat 目录</span></span>
<span class="line"><span class="token function">cp</span> jpress.war /opt/tomcat8027/webapps/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启 Tomcat（会自动解压 war 包）</span></span>
<span class="line">/opt/tomcat8027/bin/shutdown.sh</span>
<span class="line">/opt/tomcat8027/bin/startup.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-数据库配置" tabindex="-1"><a class="header-anchor" href="#_6-2-数据库配置"><span>6.2 数据库配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 访问网站进行安装</span></span>
<span class="line"><span class="token comment"># 地址: http://服务器IP:8080/jpress</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 数据库连接信息：</span></span>
<span class="line"><span class="token comment"># 主机: 127.0.0.1</span></span>
<span class="line"><span class="token comment"># 用户: root</span></span>
<span class="line"><span class="token comment"># 密码: qwe123</span></span>
<span class="line"><span class="token comment"># 数据库: jpress（自动创建）</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-远程连接配置" tabindex="-1"><a class="header-anchor" href="#_6-3-远程连接配置"><span>6.3 远程连接配置</span></a></h3><div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code class="language-sql"><span class="line"><span class="token comment">-- 创建远程访问用户</span></span>
<span class="line"><span class="token keyword">GRANT</span> <span class="token keyword">SELECT</span><span class="token punctuation">,</span> <span class="token keyword">UPDATE</span><span class="token punctuation">,</span> <span class="token keyword">DELETE</span><span class="token punctuation">,</span> <span class="token keyword">INSERT</span> <span class="token keyword">ON</span> jpress<span class="token punctuation">.</span><span class="token operator">*</span></span>
<span class="line"><span class="token keyword">TO</span> <span class="token string">&#39;jpress&#39;</span><span class="token variable">@&#39;%&#39;</span> IDENTIFIED <span class="token keyword">BY</span> <span class="token string">&#39;jpress1&#39;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- 刷新权限</span></span>
<span class="line">FLUSH <span class="token keyword">PRIVILEGES</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、安全建议" tabindex="-1"><a class="header-anchor" href="#七、安全建议"><span>七、安全建议</span></a></h2><ol><li><strong>修改默认端口</strong>：避免使用 3306 默认端口，改为非常用端口</li><li><strong>限制访问 IP</strong>：仅允许必要的 IP 地址访问</li><li><strong>定期修改密码</strong>：建议每 3 个月修改一次数据库密码</li><li><strong>启用防火墙</strong>：配置防火墙规则，限制数据库端口的访问</li><li><strong>备份策略</strong>：定期备份数据库，确保数据安全</li></ol><hr><h2 id="八、常用命令速查" tabindex="-1"><a class="header-anchor" href="#八、常用命令速查"><span>八、常用命令速查</span></a></h2><table><thead><tr><th style="text-align:left;">命令</th><th style="text-align:left;">用途</th><th style="text-align:left;">示例</th></tr></thead><tbody><tr><td style="text-align:left;"><code>mysql -V</code></td><td style="text-align:left;">查看 MySQL 版本</td><td style="text-align:left;"><code>mysql -V</code></td></tr><tr><td style="text-align:left;"><code>systemctl status mysqld</code></td><td style="text-align:left;">查看服务状态</td><td style="text-align:left;"><code>systemctl status mysqld</code></td></tr><tr><td style="text-align:left;"><code>mysqladmin ping</code></td><td style="text-align:left;">检查 MySQL 是否运行</td><td style="text-align:left;"><code>mysqladmin ping -uroot -p</code></td></tr><tr><td style="text-align:left;"><code>mysql -e</code></td><td style="text-align:left;">执行 SQL 语句</td><td style="text-align:left;"><code>mysql -uroot -p -e &quot;SHOW DATABASES;&quot;</code></td></tr><tr><td style="text-align:left;"><code>mysqldump</code></td><td style="text-align:left;">备份数据库</td><td style="text-align:left;"><code>mysqldump -uroot -p dbname &gt; backup.sql</code></td></tr></tbody></table><hr><p><strong>文档说明</strong>：</p><ul><li>本文档适用于 CentOS 7/8 系统</li><li>MySQL 版本：5.7.28</li><li>安装方式：二进制包安装</li><li>数据目录：<code>/linux0224/mysql_3306/</code></li><li>配置文件：<code>/etc/my.cnf</code></li></ul>`,56)])])}const d=n(i,[["render",p]]),r=JSON.parse('{"path":"/09-%E4%B8%AD%E9%97%B4%E4%BB%B6/02-mysql%E6%95%B0%E6%8D%AE%E5%BA%93/3-%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%99%A8mysql%E9%83%A8%E7%BD%B2%E5%AE%9E%E8%B7%B5.html","title":"云服务器 MySQL 操作手册","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"09-中间件/02-mysql数据库/3-云服务器mysql部署实践.md"}');export{d as comp,r as data};
