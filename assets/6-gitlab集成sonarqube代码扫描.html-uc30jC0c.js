import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(r,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="sonarqube-代码质量扫描与-jenkins-集成部署指南" tabindex="-1"><a class="header-anchor" href="#sonarqube-代码质量扫描与-jenkins-集成部署指南"><span>SonarQube 代码质量扫描与 Jenkins 集成部署指南</span></a></h1><h2 id="一、软件开发流水线概述" tabindex="-1"><a class="header-anchor" href="#一、软件开发流水线概述"><span>一、软件开发流水线概述</span></a></h2><p>在 DevOps 运维流水线中，代码质量扫描是测试环节的重要组成部分：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">开发 → 测试 → 运维</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>测试环节包含：</strong></p><ul><li>开发人员：负责单元测试，验证代码逻辑</li><li>测试工程师：使用 Jenkins 等工具进行自动化测试、环境搭建和功能测试</li><li>SonarQube：自动化代码质量扫描工具，减少人工代码审查时间</li></ul><p><strong>参考文档：</strong></p><ul><li>华为 DevOps 软件开发流水线：https://support.huawei.com/enterprise/zh/doc/EDOC1100370695</li></ul><h2 id="二、sonarqube-简介" tabindex="-1"><a class="header-anchor" href="#二、sonarqube-简介"><span>二、SonarQube 简介</span></a></h2><p>SonarQube 是一个开源的代码质量管理系统，用于：</p><ul><li>自动化代码质量扫描</li><li>检测代码漏洞、坏味道和代码规范问题</li><li>支持多种编程语言</li><li>提供详细的代码质量报告</li></ul><h2 id="三、sonarqube-部署" tabindex="-1"><a class="header-anchor" href="#三、sonarqube-部署"><span>三、SonarQube 部署</span></a></h2><h3 id="_3-1-mysql-安装-存储扫描结果" tabindex="-1"><a class="header-anchor" href="#_3-1-mysql-安装-存储扫描结果"><span>3.1 MySQL 安装（存储扫描结果）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 下载 MySQL</span></span>
<span class="line"><span class="token function">wget</span> https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz</span>
<span class="line"><span class="token function">tar</span> zxf mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz <span class="token parameter variable">-C</span> /opt/</span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /opt/mysql-5.7.28-linux-glibc2.12-x86_64/ /opt/mysql5.7.28</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置环境变量</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/opt/mysql5.7.28/bin/&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line">mysql <span class="token parameter variable">-V</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建配置文件</span></span>
<span class="line">cat<span class="token operator">&gt;</span> /etc/my.cnf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">[mysqld]</span>
<span class="line">user=mysql</span>
<span class="line">basedir=/opt/mysql5.7.28/</span>
<span class="line">datadir=/mysql_db/</span>
<span class="line">socket=/tmp/mysql.sock</span>
<span class="line">max_allowed_packet=100M</span>
<span class="line"></span>
<span class="line">[mysql]</span>
<span class="line">socket=/tmp/mysql.sock</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装依赖</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> libaio-devel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建用户和目录</span></span>
<span class="line"><span class="token function">useradd</span> <span class="token parameter variable">-s</span> /sbin/nologin <span class="token parameter variable">-M</span> mysql</span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /mysql_db/</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> mysql.mysql /mysql_db/</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> mysql.mysql /opt/mysql*</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 初始化数据库</span></span>
<span class="line">mysqld --initialize-insecure <span class="token parameter variable">--user</span><span class="token operator">=</span>mysql <span class="token parameter variable">--basedir</span><span class="token operator">=</span>/opt/mysql5.7.28/ <span class="token parameter variable">--datadir</span><span class="token operator">=</span>/mysql_db/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置服务管理</span></span>
<span class="line"><span class="token function">cp</span> /opt/mysql5.7.28/support-files/mysql.server /etc/init.d/mysqld</span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start mysqld</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置 root 密码</span></span>
<span class="line">mysqladmin <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p</span> password qwe123123</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-sonarqube-安装" tabindex="-1"><a class="header-anchor" href="#_3-2-sonarqube-安装"><span>3.2 SonarQube 安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建目录并下载</span></span>
<span class="line"><span class="token function">mkdir</span> /opt/sonar1</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/sonar1</span>
<span class="line"><span class="token function">wget</span> https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-7.0.zip</span>
<span class="line"><span class="token function">unzip</span> sonarqube-7.0.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建专用用户</span></span>
<span class="line"><span class="token function">useradd</span> sonar <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /sbin/nologin</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> sonar.sonar /opt/sonar1/sonarqube-7.0</span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /opt/sonar1/sonarqube-7.0 /opt/sonarqube</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置数据库连接</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /opt/sonarqube/conf/sonar.properties <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">sonar.jdbc.username=root</span>
<span class="line">sonar.jdbc.password=qwe123123</span>
<span class="line">sonar.jdbc.url=jdbc:mysql://localhost:3306/sonar?useUnicode=true&amp;characterEncoding=utf8&amp;rewriteBatchedStatements=true&amp;useConfigs=maxPerformance&amp;useSSL=false</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建数据库</span></span>
<span class="line">mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-pqwe123123</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;create database sonar;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改运行用户</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/^#RUN_AS_USER=/RUN_AS_USER=sonar/&#39;</span> /opt/sonarqube/bin/linux-x86-64/sonar.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建 systemd 服务</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span>/usr/lib/systemd/system/sonar.service<span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">[Unit]</span>
<span class="line">Description=sonar</span>
<span class="line"></span>
<span class="line">[Service]</span>
<span class="line">ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start</span>
<span class="line">ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop</span>
<span class="line">Type=forking</span>
<span class="line">User=sonar</span>
<span class="line">Group=sonar</span>
<span class="line"></span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动服务</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start sonar</span>
<span class="line"><span class="token function">netstat</span> -tunlp<span class="token operator">|</span><span class="token function">grep</span> <span class="token number">9000</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-访问-sonarqube" tabindex="-1"><a class="header-anchor" href="#_3-3-访问-sonarqube"><span>3.3 访问 SonarQube</span></a></h3><ul><li>地址：<a href="http://10.0.0.101:9000/" target="_blank" rel="noopener noreferrer">http://10.0.0.101:9000</a></li><li>默认账号：admin/admin</li></ul><h3 id="_3-4-生成-jenkins-token" tabindex="-1"><a class="header-anchor" href="#_3-4-生成-jenkins-token"><span>3.4 生成 Jenkins Token</span></a></h3><p>在 SonarQube 中生成用于 Jenkins 集成的 Token，例如：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">jenkins: ca267bd60ccd27c779876c5a4f21db4eb3808546</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="四、sonarqube-客户端配置" tabindex="-1"><a class="header-anchor" href="#四、sonarqube-客户端配置"><span>四、SonarQube 客户端配置</span></a></h2><h3 id="_4-1-安装-sonarscanner" tabindex="-1"><a class="header-anchor" href="#_4-1-安装-sonarscanner"><span>4.1 安装 SonarScanner</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 下载和解压</span></span>
<span class="line"><span class="token function">wget</span> https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.0.0.1744-linux.zip</span>
<span class="line"><span class="token function">unzip</span> sonar-scanner-cli-4.0.0.1744-linux.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置环境变量</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/opt/sonar1/sonar-scanner-4.0.0.1744-linux/bin&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-手动代码扫描命令" tabindex="-1"><a class="header-anchor" href="#_4-2-手动代码扫描命令"><span>4.2 手动代码扫描命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">sonar-scanner <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-Dsonar.projectKey</span><span class="token operator">=</span>linux0224 <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-Dsonar.sources</span><span class="token operator">=</span>. <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-Dsonar.host.url</span><span class="token operator">=</span>http://10.0.0.101:9000 <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-Dsonar.login</span><span class="token operator">=</span>ca267bd60ccd27c779876c5a4f21db4eb3808546</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-安装中文插件" tabindex="-1"><a class="header-anchor" href="#_4-3-安装中文插件"><span>4.3 安装中文插件</span></a></h3><ol><li>下载中文插件（兼容版本）</li><li>将插件 JAR 文件放入：<code>/opt/sonarqube/extensions/plugins/</code></li><li>重启服务：<code>systemctl restart sonar</code></li><li>查看日志：<code>tail -f /opt/sonarqube/logs/web.log</code></li></ol><h2 id="五、sonarqube-与-jenkins-集成" tabindex="-1"><a class="header-anchor" href="#五、sonarqube-与-jenkins-集成"><span>五、SonarQube 与 Jenkins 集成</span></a></h2><h3 id="_5-1-jenkins-配置" tabindex="-1"><a class="header-anchor" href="#_5-1-jenkins-配置"><span>5.1 Jenkins 配置</span></a></h3><ol><li><strong>添加 SonarQube 服务器</strong><ul><li>系统管理 → 系统配置 → SonarQube servers</li><li>添加服务器地址和 Token</li></ul></li><li><strong>配置 SonarScanner</strong><ul><li>系统管理 → 全局工具配置 → SonarScanner</li><li>指定 SonarScanner 安装路径</li></ul></li></ol><h3 id="_5-2-在-jenkins-job-中添加构建步骤" tabindex="-1"><a class="header-anchor" href="#_5-2-在-jenkins-job-中添加构建步骤"><span>5.2 在 Jenkins Job 中添加构建步骤</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 在构建步骤中添加 Execute SonarQube Scanner</span></span>
<span class="line"><span class="token assign-left variable">sonar.projectKey</span><span class="token operator">=</span><span class="token variable">\${JOB_NAME}</span></span>
<span class="line"><span class="token assign-left variable">sonar.sources</span><span class="token operator">=</span>.</span>
<span class="line"><span class="token assign-left variable">sonar.host.url</span><span class="token operator">=</span>http://10.0.0.101:9000</span>
<span class="line"><span class="token assign-left variable">sonar.login</span><span class="token operator">=</span>ca267bd60ccd27c779876c5a4f21db4eb3808546</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-完整-devops-流程" tabindex="-1"><a class="header-anchor" href="#_5-3-完整-devops-流程"><span>5.3 完整 DevOps 流程</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">GitLab（代码提交）</span>
<span class="line">    ↓</span>
<span class="line">Jenkins（自动触发）</span>
<span class="line">    ├── 代码拉取</span>
<span class="line">    ├── SonarQube 代码扫描（测试环节）</span>
<span class="line">    ├── 单元测试执行</span>
<span class="line">    └── 构建和部署（运维环节）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、常见问题解决" tabindex="-1"><a class="header-anchor" href="#六、常见问题解决"><span>六、常见问题解决</span></a></h2><h3 id="_6-1-mysql-数据包大小问题" tabindex="-1"><a class="header-anchor" href="#_6-1-mysql-数据包大小问题"><span>6.1 MySQL 数据包大小问题</span></a></h3><p><strong>错误信息：</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Packet for query is too large (14777376 &gt; 4194304)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>解决方案：</strong> 在 MySQL 配置文件中增加：</p><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysqld</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">max_allowed_packet</span><span class="token punctuation">=</span><span class="token value attr-value">100M</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-node-js-环境问题" tabindex="-1"><a class="header-anchor" href="#_6-2-node-js-环境问题"><span>6.2 Node.js 环境问题</span></a></h3><p>对于 JavaScript 项目扫描，需要安装 Node.js：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt/</span>
<span class="line"><span class="token function">wget</span> https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz</span>
<span class="line"><span class="token function">tar</span> xf node-v12.13.0-linux-x64.tar.xz</span>
<span class="line"><span class="token function">mv</span> node-v12.13.0-linux-x64 <span class="token function">node</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$PATH:/opt/node/bin&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-插件兼容性问题" tabindex="-1"><a class="header-anchor" href="#_6-3-插件兼容性问题"><span>6.3 插件兼容性问题</span></a></h3><p>如果插件不兼容：</p><ol><li>查看日志文件：<code>/opt/sonarqube/logs/web.log</code></li><li>删除不兼容的插件</li><li>重启 SonarQube 服务</li></ol><h2 id="七、最佳实践建议" tabindex="-1"><a class="header-anchor" href="#七、最佳实践建议"><span>七、最佳实践建议</span></a></h2><ol><li><strong>定期更新</strong>：保持 SonarQube 和插件的最新版本</li><li><strong>自定义规则</strong>：根据团队规范调整代码质量规则</li><li><strong>集成到 CI/CD</strong>：确保每次代码提交都进行质量扫描</li><li><strong>设置质量阈</strong>：定义通过/失败的质量标准</li><li><strong>定期审查</strong>：团队定期审查代码质量问题</li></ol><h2 id="八、总结" tabindex="-1"><a class="header-anchor" href="#八、总结"><span>八、总结</span></a></h2><p>通过 SonarQube 与 Jenkins 的集成，可以实现：</p><ul><li>自动化代码质量检测</li><li>提前发现潜在缺陷</li><li>统一的代码质量标准</li><li>持续改进开发流程</li></ul><p>这种集成不仅提高了代码质量，还减少了人工代码审查的工作量，是现代化 DevOps 流程中不可或缺的一环。</p>`,53)])])}const t=n(i,[["render",p]]),o=JSON.parse('{"path":"/08-CI-CD/01-git%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6/6-gitlab%E9%9B%86%E6%88%90sonarqube%E4%BB%A3%E7%A0%81%E6%89%AB%E6%8F%8F.html","title":"SonarQube 代码质量扫描与 Jenkins 集成部署指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"08-CI-CD/01-git版本控制/6-gitlab集成sonarqube代码扫描.md"}');export{t as comp,o as data};
