import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function t(p,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="linux-软件包管理与-yum-配置" tabindex="-1"><a class="header-anchor" href="#linux-软件包管理与-yum-配置"><span>Linux 软件包管理与 Yum 配置</span></a></h1><hr><h2 id="一、编程语言与软件包基础" tabindex="-1"><a class="header-anchor" href="#一、编程语言与软件包基础"><span>一、编程语言与软件包基础</span></a></h2><h3 id="_1-代码文件与软件程序" tabindex="-1"><a class="header-anchor" href="#_1-代码文件与软件程序"><span>1. 代码文件与软件程序</span></a></h3><table><thead><tr><th style="text-align:left;">概念</th><th style="text-align:left;">说明</th><th style="text-align:left;">示例</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>代码文件</strong></td><td style="text-align:left;">编程语言编写的源文件</td><td style="text-align:left;"><code>.py</code>, <code>.go</code>, <code>.c</code>, <code>.java</code></td></tr><tr><td style="text-align:left;"><strong>软件程序</strong></td><td style="text-align:left;">编译/解释后生成的可执行程序</td><td style="text-align:left;"><code>nginx</code>, <code>vim</code>, <code>python3</code></td></tr><tr><td style="text-align:left;"><strong>软件包</strong></td><td style="text-align:left;">包含程序、配置、文档的集合</td><td style="text-align:left;"><code>.rpm</code>, <code>.tar.gz</code>, <code>.deb</code></td></tr></tbody></table><h3 id="_2-编程语言类型对比" tabindex="-1"><a class="header-anchor" href="#_2-编程语言类型对比"><span>2. 编程语言类型对比</span></a></h3><table><thead><tr><th style="text-align:left;">类型</th><th style="text-align:left;">特点</th><th style="text-align:left;">编译方式</th><th style="text-align:left;">示例</th><th style="text-align:left;">运维场景</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>编译型语言</strong></td><td style="text-align:left;">需编译为二进制文件</td><td style="text-align:left;">先编译后运行</td><td style="text-align:left;">C, C++, Go, Rust</td><td style="text-align:left;">系统工具开发</td></tr><tr><td style="text-align:left;"><strong>解释型语言</strong></td><td style="text-align:left;">需要解释器实时解释</td><td style="text-align:left;">边解释边运行</td><td style="text-align:left;">Python, PHP, Ruby</td><td style="text-align:left;">快速开发、脚本</td></tr></tbody></table><h3 id="_3-编译与解释过程体验" tabindex="-1"><a class="header-anchor" href="#_3-编译与解释过程体验"><span>3. 编译与解释过程体验</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># Go语言编译示例</span></span>
<span class="line">go <span class="token function">fmt</span> hello.go        <span class="token comment"># 格式化代码</span></span>
<span class="line">go run hello.go        <span class="token comment"># 直接运行（临时编译）</span></span>
<span class="line">go build hello.go      <span class="token comment"># 编译为二进制文件</span></span>
<span class="line">./hello                <span class="token comment"># 运行编译后的程序</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Python解释示例</span></span>
<span class="line">python3 hello.py       <span class="token comment"># 直接解释执行</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、rpm-包管理" tabindex="-1"><a class="header-anchor" href="#二、rpm-包管理"><span>二、RPM 包管理</span></a></h2><h3 id="_1-rpm-基础命令" tabindex="-1"><a class="header-anchor" href="#_1-rpm-基础命令"><span>1. RPM 基础命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> package.rpm              <span class="token comment"># 安装并显示详情</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-Uvh</span> package.rpm              <span class="token comment"># 升级安装</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> <span class="token parameter variable">--force</span> package.rpm      <span class="token comment"># 强制安装</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> <span class="token parameter variable">--nodeps</span> package.rpm     <span class="token comment"># 忽略依赖安装（不推荐）</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查询</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span>                           <span class="token comment"># 查询所有已安装包</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> nginx              <span class="token comment"># 查询指定软件</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qi</span> package_name              <span class="token comment"># 查询软件包信息</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ql</span> package_name              <span class="token comment"># 查询软件包安装文件</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qf</span> /path/to/file             <span class="token comment"># 查询文件所属包</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 卸载</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-e</span> package_name              <span class="token comment"># 卸载软件包</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-e</span> <span class="token parameter variable">--nodeps</span> package_name     <span class="token comment"># 强制卸载（忽略依赖）</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-rpm-依赖问题解决" tabindex="-1"><a class="header-anchor" href="#_2-rpm-依赖问题解决"><span>2. RPM 依赖问题解决</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 查看依赖关系</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qR</span> package_name            <span class="token comment"># 查看已安装包的依赖</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qpR</span> package.rpm            <span class="token comment"># 查看未安装包的依赖</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 安装工具辅助分析</span></span>
<span class="line">yum <span class="token function">install</span> yum-utils</span>
<span class="line">repoquery <span class="token parameter variable">--requires</span> <span class="token parameter variable">--resolve</span> package_name  <span class="token comment"># 解析依赖</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 手工安装依赖（按提示顺序安装）</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-本地光盘-rpm-源" tabindex="-1"><a class="header-anchor" href="#_3-本地光盘-rpm-源"><span>3. 本地光盘 RPM 源</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 挂载光盘</span></span>
<span class="line"><span class="token function">mount</span> /dev/sr0 /mnt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看光盘内容</span></span>
<span class="line"><span class="token function">ls</span> /mnt/Packages/              <span class="token comment"># RPM包目录</span></span>
<span class="line"><span class="token function">ls</span> /mnt/repodata/              <span class="token comment"># 仓库元数据</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从光盘安装软件</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> /mnt/Packages/package.rpm</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、源码编译安装" tabindex="-1"><a class="header-anchor" href="#三、源码编译安装"><span>三、源码编译安装</span></a></h2><h3 id="_1-编译环境准备" tabindex="-1"><a class="header-anchor" href="#_1-编译环境准备"><span>1. 编译环境准备</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># C语言编译环境</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> gcc <span class="token function">make</span> gcc-c++ ncurses-devel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Go语言环境</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> golang</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Python开发环境</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> python3 python3-devel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 常用开发库</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> openssl openssl-devel pcre pcre-devel zlib zlib-devel</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-源码编译安装流程" tabindex="-1"><a class="header-anchor" href="#_2-源码编译安装流程"><span>2. 源码编译安装流程</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 以淘宝 Tengine（Nginx）为例</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 下载源码</span></span>
<span class="line"><span class="token function">wget</span> https://tengine.taobao.org/download/tengine-2.4.0.tar.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 解压</span></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzvf</span> tengine-2.4.0.tar.gz</span>
<span class="line"><span class="token builtin class-name">cd</span> tengine-2.4.0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 配置编译选项</span></span>
<span class="line">./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/opt/nginx --with-http_ssl_module</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 编译安装</span></span>
<span class="line"><span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 启动服务</span></span>
<span class="line">/opt/nginx/sbin/nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-二进制包安装-java示例" tabindex="-1"><a class="header-anchor" href="#_3-二进制包安装-java示例"><span>3. 二进制包安装（Java示例）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 下载解压</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"><span class="token function">wget</span> https://download.oracle.com/java/8/jdk-8u221-linux-x64.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzvf</span> jdk-8u221-linux-x64.tar.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建软链接</span></span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> jdk1.8.0_221 jdk</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 配置环境变量</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export JAVA_HOME=/opt/jdk&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=$JAVA_HOME/bin:$PATH&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/profile</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 验证安装</span></span>
<span class="line"><span class="token function">java</span> <span class="token parameter variable">-version</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、yum-包管理器" tabindex="-1"><a class="header-anchor" href="#四、yum-包管理器"><span>四、YUM 包管理器</span></a></h2><h3 id="_1-yum-基础命令" tabindex="-1"><a class="header-anchor" href="#_1-yum-基础命令"><span>1. YUM 基础命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 软件管理</span></span>
<span class="line">yum <span class="token function">install</span> package            <span class="token comment"># 安装软件</span></span>
<span class="line">yum remove package             <span class="token comment"># 卸载软件</span></span>
<span class="line">yum update package             <span class="token comment"># 更新软件</span></span>
<span class="line">yum upgrade                    <span class="token comment"># 升级所有软件</span></span>
<span class="line">yum check-update               <span class="token comment"># 检查可用更新</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查询搜索</span></span>
<span class="line">yum list installed             <span class="token comment"># 列出已安装</span></span>
<span class="line">yum list available             <span class="token comment"># 列出可用</span></span>
<span class="line">yum search keyword              <span class="token comment"># 搜索软件</span></span>
<span class="line">yum info package               <span class="token comment"># 查看信息</span></span>
<span class="line">yum provides /path/to/file     <span class="token comment"># 查看文件所属包</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 缓存管理</span></span>
<span class="line">yum clean all                  <span class="token comment"># 清理缓存</span></span>
<span class="line">yum makecache                  <span class="token comment"># 重建缓存</span></span>
<span class="line">yum <span class="token function">history</span>                    <span class="token comment"># 查看操作历史</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-yum-仓库配置" tabindex="-1"><a class="header-anchor" href="#_2-yum-仓库配置"><span>2. YUM 仓库配置</span></a></h3><h4 id="_2-1-仓库文件结构" tabindex="-1"><a class="header-anchor" href="#_2-1-仓库文件结构"><span>2.1 仓库文件结构</span></a></h4><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token comment">#/etc/yum.repos.d/name.repo</span></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">repository-id</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">name</span><span class="token punctuation">=</span><span class="token value attr-value">Repository Name</span></span>
<span class="line"><span class="token key attr-name">baseurl</span><span class="token punctuation">=</span><span class="token value attr-value">url://path/to/repo</span></span>
<span class="line"><span class="token key attr-name">enabled</span><span class="token punctuation">=</span><span class="token value attr-value">1                      # 1 启用，0 禁用</span></span>
<span class="line"><span class="token key attr-name">gpgcheck</span><span class="token punctuation">=</span><span class="token value attr-value">1                     # 1 检查 GPG 签名</span></span>
<span class="line"><span class="token key attr-name">gpgkey</span><span class="token punctuation">=</span><span class="token value attr-value">url://path/to/key</span></span>
<span class="line"><span class="token key attr-name">priority</span><span class="token punctuation">=</span><span class="token value attr-value">1                     # 优先级（数字越小优先级越高）</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-配置网络仓库" tabindex="-1"><a class="header-anchor" href="#_2-2-配置网络仓库"><span>2.2 配置网络仓库</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 配置阿里云源</span></span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo</span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理并重建缓存</span></span>
<span class="line">yum clean all</span>
<span class="line">yum makecache</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-3-配置本地仓库" tabindex="-1"><a class="header-anchor" href="#_2-3-配置本地仓库"><span>2.3 配置本地仓库</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 挂载光盘</span></span>
<span class="line"><span class="token function">mount</span> /dev/sr0 /mnt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建仓库文件</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/local.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local]</span>
<span class="line">name=Local CD-ROM</span>
<span class="line">baseurl=file:///mnt</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 验证仓库</span></span>
<span class="line">yum repolist</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-yum-高级功能" tabindex="-1"><a class="header-anchor" href="#_3-yum-高级功能"><span>3. YUM 高级功能</span></a></h3><h4 id="_3-1-下载-rpm-包" tabindex="-1"><a class="header-anchor" href="#_3-1-下载-rpm-包"><span>3.1 下载 RPM 包</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方法1：使用 --downloadonly</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">--downloadonly</span> <span class="token parameter variable">--downloaddir</span><span class="token operator">=</span>/path package</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方法2：使用 yumdownloader</span></span>
<span class="line">yum <span class="token function">install</span> yum-utils</span>
<span class="line">yumdownloader <span class="token parameter variable">--destdir</span><span class="token operator">=</span>/path package</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-2-离线安装包" tabindex="-1"><a class="header-anchor" href="#_3-2-离线安装包"><span>3.2 离线安装包</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 在有网络环境中下载依赖</span></span>
<span class="line"><span class="token function">mkdir</span> /myrepo</span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">--downloadonly</span> <span class="token parameter variable">--downloaddir</span><span class="token operator">=</span>/myrepo package</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建本地仓库</span></span>
<span class="line">createrepo /myrepo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 配置本地仓库文件</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/myrepo.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[myrepo]</span>
<span class="line">name=My Local Repo</span>
<span class="line">baseurl=file:///myrepo</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">priority=1</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 离线安装</span></span>
<span class="line">yum clean all</span>
<span class="line">yum <span class="token function">install</span> package</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-3-安装指定版本" tabindex="-1"><a class="header-anchor" href="#_3-3-安装指定版本"><span>3.3 安装指定版本</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 以 MySQL 5.6.43 为例</span></span>
<span class="line"><span class="token comment"># 1. 配置指定版本仓库</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/mysql56.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[mysql56]</span>
<span class="line">name=MySQL 5.6 Community</span>
<span class="line">baseurl=https://repo.mysql.com/yum/mysql-5.6-community/el/7/x86_64/</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 安装指定版本</span></span>
<span class="line">yum <span class="token function">install</span> mysql-community-server-5.6.43</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、安装方式对比与选择" tabindex="-1"><a class="header-anchor" href="#五、安装方式对比与选择"><span>五、安装方式对比与选择</span></a></h2><h3 id="_1-三种安装方式对比" tabindex="-1"><a class="header-anchor" href="#_1-三种安装方式对比"><span>1. 三种安装方式对比</span></a></h3><table><thead><tr><th style="text-align:left;">方式</th><th style="text-align:left;">优点</th><th style="text-align:left;">缺点</th><th style="text-align:left;">适用场景</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>YUM/RPM</strong></td><td style="text-align:left;">自动处理依赖、版本管理</td><td style="text-align:left;">版本可能较旧</td><td style="text-align:left;">生产环境、基础软件</td></tr><tr><td style="text-align:left;"><strong>源码编译</strong></td><td style="text-align:left;">最新版本、自定义功能</td><td style="text-align:left;">依赖复杂、编译耗时</td><td style="text-align:left;">开发环境、特殊需求</td></tr><tr><td style="text-align:left;"><strong>二进制包</strong></td><td style="text-align:left;">免编译、快速部署</td><td style="text-align:left;">平台依赖、更新慢</td><td style="text-align:left;">中间件、大型软件</td></tr></tbody></table><h3 id="_2-选择建议" tabindex="-1"><a class="header-anchor" href="#_2-选择建议"><span>2. 选择建议</span></a></h3><table><thead><tr><th style="text-align:left;">场景</th><th style="text-align:left;">推荐方式</th><th style="text-align:left;">原因</th></tr></thead><tbody><tr><td style="text-align:left;">系统基础软件</td><td style="text-align:left;">YUM</td><td style="text-align:left;">自动依赖管理、安全更新</td></tr><tr><td style="text-align:left;">标准服务程序</td><td style="text-align:left;">YUM</td><td style="text-align:left;">版本稳定、易于维护</td></tr><tr><td style="text-align:left;">生产环境部署</td><td style="text-align:left;">YUM</td><td style="text-align:left;">便于批量管理</td></tr><tr><td style="text-align:left;">需要最新特性</td><td style="text-align:left;">源码编译</td><td style="text-align:left;">获取最新版本</td></tr><tr><td style="text-align:left;">需要自定义模块</td><td style="text-align:left;">源码编译</td><td style="text-align:left;">灵活配置选项</td></tr><tr><td style="text-align:left;">Java、Go等环境</td><td style="text-align:left;">二进制包</td><td style="text-align:left;">官方预编译</td></tr><tr><td style="text-align:left;">跨平台部署</td><td style="text-align:left;">二进制包</td><td style="text-align:left;">无需编译环境</td></tr></tbody></table><h3 id="_3-常见依赖环境" tabindex="-1"><a class="header-anchor" href="#_3-常见依赖环境"><span>3. 常见依赖环境</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 基础编译环境</span></span>
<span class="line">yum groupinstall <span class="token string">&quot;Development Tools&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Web服务器依赖</span></span>
<span class="line">yum <span class="token function">install</span> openssl-devel pcre-devel zlib-devel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 数据库依赖</span></span>
<span class="line">yum <span class="token function">install</span> ncurses-devel libaio-devel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Python开发</span></span>
<span class="line">yum <span class="token function">install</span> python3-devel</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、实用技巧与故障处理" tabindex="-1"><a class="header-anchor" href="#六、实用技巧与故障处理"><span>六、实用技巧与故障处理</span></a></h2><h3 id="_1-rpm-包查询技巧" tabindex="-1"><a class="header-anchor" href="#_1-rpm-包查询技巧"><span>1. RPM 包查询技巧</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看软件配置文件</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qc</span> package_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看软件文档</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qd</span> package_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看软件安装脚本</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-q</span> <span class="token parameter variable">--scripts</span> package_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证软件包完整性</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-V</span> package_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-yum-故障排查" tabindex="-1"><a class="header-anchor" href="#_2-yum-故障排查"><span>2. YUM 故障排查</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 缓存问题</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/cache/yum/*</span>
<span class="line">yum clean all</span>
<span class="line">yum makecache</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 仓库问题</span></span>
<span class="line">yum repolist all                <span class="token comment"># 查看所有仓库状态</span></span>
<span class="line">yum <span class="token parameter variable">--disablerepo</span><span class="token operator">=</span><span class="token string">&quot;*&quot;</span> <span class="token parameter variable">--enablerepo</span><span class="token operator">=</span><span class="token string">&quot;repo&quot;</span> list available  <span class="token comment"># 测试特定仓库</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 依赖问题</span></span>
<span class="line">yum deplist package             <span class="token comment"># 查看依赖关系</span></span>
<span class="line">yum <span class="token function">install</span> --skip-broken      <span class="token comment"># 跳过损坏包</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-常用软件源地址" tabindex="-1"><a class="header-anchor" href="#_3-常用软件源地址"><span>3. 常用软件源地址</span></a></h3><table><thead><tr><th style="text-align:left;">镜像源</th><th style="text-align:left;">地址</th></tr></thead><tbody><tr><td style="text-align:left;">阿里云镜像</td><td style="text-align:left;">https://mirrors.aliyun.com/</td></tr><tr><td style="text-align:left;">清华大学镜像</td><td style="text-align:left;">https://mirrors.tuna.tsinghua.edu.cn/</td></tr><tr><td style="text-align:left;">网易镜像</td><td style="text-align:left;">http://mirrors.163.com/</td></tr><tr><td style="text-align:left;">Docker官方</td><td style="text-align:left;">https://download.docker.com/linux/centos/</td></tr><tr><td style="text-align:left;">MySQL官方</td><td style="text-align:left;">https://repo.mysql.com/</td></tr><tr><td style="text-align:left;">Nginx官方</td><td style="text-align:left;">https://nginx.org/packages/</td></tr></tbody></table><h3 id="_4-创建本地软件仓库" tabindex="-1"><a class="header-anchor" href="#_4-创建本地软件仓库"><span>4. 创建本地软件仓库</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 创建本地仓库脚本</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">REPO_DIR</span><span class="token operator">=</span><span class="token string">&quot;/data/yum_repo&quot;</span></span>
<span class="line"><span class="token assign-left variable">PACKAGES</span><span class="token operator">=</span><span class="token string">&quot;nginx redis mysql&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 创建目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">$REPO_DIR</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 下载软件包</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">pkg</span> <span class="token keyword">in</span> <span class="token variable">$PACKAGES</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">    yum <span class="token function">install</span> <span class="token parameter variable">--downloadonly</span> <span class="token parameter variable">--downloaddir</span><span class="token operator">=</span><span class="token variable">$REPO_DIR</span> <span class="token variable">$pkg</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 创建仓库</span></span>
<span class="line">createrepo <span class="token variable">$REPO_DIR</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 配置仓库文件</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/local.repo <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[local-repo]</span>
<span class="line">name=Local Repository</span>
<span class="line">baseurl=file://<span class="token variable">$REPO_DIR</span></span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">priority=1</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;本地仓库创建完成: <span class="token variable">$REPO_DIR</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、最佳实践总结" tabindex="-1"><a class="header-anchor" href="#七、最佳实践总结"><span>七、最佳实践总结</span></a></h2><h3 id="_1-安装软件前检查" tabindex="-1"><a class="header-anchor" href="#_1-安装软件前检查"><span>1. 安装软件前检查</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 检查系统版本</span></span>
<span class="line"><span class="token function">cat</span> /etc/redhat-release</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 检查架构</span></span>
<span class="line"><span class="token function">uname</span> <span class="token parameter variable">-m</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 检查磁盘空间</span></span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span> /usr</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 检查依赖</span></span>
<span class="line">yum deplist package_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-安装后验证" tabindex="-1"><a class="header-anchor" href="#_2-安装后验证"><span>2. 安装后验证</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 验证安装</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> package</span>
<span class="line"><span class="token function">which</span> command_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 验证配置</span></span>
<span class="line">service_name <span class="token parameter variable">--version</span></span>
<span class="line">service_name <span class="token parameter variable">-t</span>            <span class="token comment"># 测试配置（如nginx）</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 验证运行</span></span>
<span class="line">systemctl status service_name</span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> port</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-维护建议" tabindex="-1"><a class="header-anchor" href="#_3-维护建议"><span>3. 维护建议</span></a></h3><table><thead><tr><th style="text-align:left;">维护项</th><th style="text-align:left;">操作命令</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">定期更新</td><td style="text-align:left;"><code>yum update</code></td><td style="text-align:left;">更新所有软件包</td></tr><tr><td style="text-align:left;">清理无用的包</td><td style="text-align:left;"><code>yum autoremove</code></td><td style="text-align:left;">清理不再使用的依赖</td></tr><tr><td style="text-align:left;">备份配置</td><td style="text-align:left;">手动备份</td><td style="text-align:left;">记录重要配置路径</td></tr><tr><td style="text-align:left;">记录操作</td><td style="text-align:left;"><code>yum history</code></td><td style="text-align:left;">追踪安装历史</td></tr><tr><td style="text-align:left;">版本控制</td><td style="text-align:left;">Git等工具</td><td style="text-align:left;">管理配置文件变更</td></tr></tbody></table>`,69)])])}const d=n(i,[["render",t]]),r=JSON.parse('{"path":"/01-Linux%E5%9F%BA%E7%A1%80/01-%E8%BD%AF%E4%BB%B6%E5%8C%85%E7%AE%A1%E7%90%86/19_20%E8%BD%AF%E4%BB%B6%E5%8C%85%E7%AE%A1%E7%90%86%E4%B8%8Eyum.html","title":"Linux 软件包管理与 Yum 配置","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"01-Linux基础/01-软件包管理/19_20软件包管理与yum.md"}');export{d as comp,r as data};
