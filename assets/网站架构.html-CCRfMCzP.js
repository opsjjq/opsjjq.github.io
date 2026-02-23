import{_ as n,c as e,e as t,o as a}from"./app-DtXLoKBz.js";const l={};function i(d,s){return a(),e("div",null,[...s[0]||(s[0]=[t(`<h2 id="一、网站架构演进概述" tabindex="-1"><a class="header-anchor" href="#一、网站架构演进概述"><span>一、网站架构演进概述</span></a></h2><h3 id="_1-网站架构定义" tabindex="-1"><a class="header-anchor" href="#_1-网站架构定义"><span>1. 网站架构定义</span></a></h3><p>大型网站架构是为支撑<strong>大规模用户访问</strong>、<strong>海量数据处理</strong>及<strong>复杂业务功能</strong>而设计的软件架构体系。</p><h3 id="_2-架构演进历程" tabindex="-1"><a class="header-anchor" href="#_2-架构演进历程"><span>2. 架构演进历程</span></a></h3><table><thead><tr><th style="text-align:left;">阶段</th><th style="text-align:left;">特点</th><th style="text-align:left;">优势</th><th style="text-align:left;">劣势</th><th style="text-align:left;">适用场景</th></tr></thead><tbody><tr><td style="text-align:left;">单体架构</td><td style="text-align:left;">所有业务集中在一个项目</td><td style="text-align:left;">开发简单、部署方便、调试容易</td><td style="text-align:left;">单点故障、性能瓶颈、扩展困难</td><td style="text-align:left;">小型网站、初期项目</td></tr><tr><td style="text-align:left;">集群架构</td><td style="text-align:left;">单机复制多份，构成集群</td><td style="text-align:left;">性能提升、高可用、易于扩展</td><td style="text-align:left;">成本增加、复杂度提高</td><td style="text-align:left;">中大型网站</td></tr><tr><td style="text-align:left;">微服务架构</td><td style="text-align:left;">大系统拆分为独立小系统</td><td style="text-align:left;">解耦业务、独立部署扩展</td><td style="text-align:left;">系统复杂、运维难度提高</td><td style="text-align:left;">大型互联网应用</td></tr></tbody></table><p><strong>关键组件</strong>：节点、负载均衡、高可用</p><h2 id="二、运维架构环境规划" tabindex="-1"><a class="header-anchor" href="#二、运维架构环境规划"><span>二、运维架构环境规划</span></a></h2><h3 id="_1-架构组件说明" tabindex="-1"><a class="header-anchor" href="#_1-架构组件说明"><span>1. 架构组件说明</span></a></h3><table><thead><tr><th style="text-align:left;">服务器角色</th><th style="text-align:left;">作用</th><th style="text-align:left;">运行软件</th><th style="text-align:left;">类比</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>用户端</strong></td><td style="text-align:left;">访问网站的用户请求</td><td style="text-align:left;">浏览器</td><td style="text-align:left;">顾客</td></tr><tr><td style="text-align:left;"><strong>防火墙</strong></td><td style="text-align:left;">安全防护、流量控制</td><td style="text-align:left;">iptables</td><td style="text-align:left;">保安</td></tr><tr><td style="text-align:left;"><strong>负载均衡</strong></td><td style="text-align:left;">请求调度分发</td><td style="text-align:left;">nginx/keepalived</td><td style="text-align:left;">迎宾服务员</td></tr><tr><td style="text-align:left;"><strong>Web服务器</strong></td><td style="text-align:left;">处理用户请求</td><td style="text-align:left;">nginx/php/tomcat</td><td style="text-align:left;">点餐前台</td></tr><tr><td style="text-align:left;"><strong>数据库服务器</strong></td><td style="text-align:left;">存储动态数据</td><td style="text-align:left;">mysql/redis</td><td style="text-align:left;">厨房仓库</td></tr><tr><td style="text-align:left;"><strong>存储服务器</strong></td><td style="text-align:left;">存储静态资源</td><td style="text-align:left;">nfs</td><td style="text-align:left;">粮仓仓库</td></tr><tr><td style="text-align:left;"><strong>备份服务器</strong></td><td style="text-align:left;">数据备份</td><td style="text-align:left;">rsync+inotify</td><td style="text-align:left;">粮仓仓库二号</td></tr><tr><td style="text-align:left;"><strong>缓存服务器</strong></td><td style="text-align:left;">高速数据读写</td><td style="text-align:left;">redis</td><td style="text-align:left;">自助取餐</td></tr><tr><td style="text-align:left;"><strong>管理服务器</strong></td><td style="text-align:left;">批量化管理</td><td style="text-align:left;">ansible/zabbix</td><td style="text-align:left;">调度总台</td></tr></tbody></table><h3 id="_2-服务器规划表" tabindex="-1"><a class="header-anchor" href="#_2-服务器规划表"><span>2. 服务器规划表</span></a></h3><table><thead><tr><th style="text-align:left;">服务器作用</th><th style="text-align:left;">主机名</th><th style="text-align:left;">外网地址</th><th style="text-align:left;">内网地址</th><th style="text-align:left;">运行软件</th></tr></thead><tbody><tr><td style="text-align:left;">管理机</td><td style="text-align:left;">master-61</td><td style="text-align:left;">10.0.0.61</td><td style="text-align:left;">172.16.1.61</td><td style="text-align:left;">Ansible/zabbix/jumpserver</td></tr><tr><td style="text-align:left;">负载均衡服务器1</td><td style="text-align:left;">slb-5</td><td style="text-align:left;">10.0.0.5</td><td style="text-align:left;">172.16.1.5</td><td style="text-align:left;">nginx/keepalived</td></tr><tr><td style="text-align:left;">负载均衡服务器2</td><td style="text-align:left;">slb-6</td><td style="text-align:left;">10.0.0.6</td><td style="text-align:left;">172.16.1.6</td><td style="text-align:left;">nginx/keepalived</td></tr><tr><td style="text-align:left;">Web服务器1</td><td style="text-align:left;">web-7</td><td style="text-align:left;">10.0.0.7</td><td style="text-align:left;">172.16.1.7</td><td style="text-align:left;">nginx/php</td></tr><tr><td style="text-align:left;">Web服务器2</td><td style="text-align:left;">web-8</td><td style="text-align:left;">10.0.0.8</td><td style="text-align:left;">172.16.1.8</td><td style="text-align:left;">nginx/tomcat</td></tr><tr><td style="text-align:left;">Web服务器3</td><td style="text-align:left;">web-9</td><td style="text-align:left;">10.0.0.9</td><td style="text-align:left;">172.16.1.9</td><td style="text-align:left;">nginx/php</td></tr><tr><td style="text-align:left;">存储服务器</td><td style="text-align:left;">nfs-31</td><td style="text-align:left;">10.0.0.31</td><td style="text-align:left;">172.16.1.31</td><td style="text-align:left;">nfs/rsyncd/lsyncd</td></tr><tr><td style="text-align:left;">备份服务器</td><td style="text-align:left;">rsync-41</td><td style="text-align:left;">10.0.0.41</td><td style="text-align:left;">172.16.1.41</td><td style="text-align:left;">nfs/rsyncd/lsyncd</td></tr><tr><td style="text-align:left;">数据库服务器</td><td style="text-align:left;">db-51</td><td style="text-align:left;">10.0.0.51</td><td style="text-align:left;">172.16.1.51</td><td style="text-align:left;">mysql/redis</td></tr></tbody></table><p><strong>网络说明</strong>：</p><ul><li><strong>外网地址</strong>：模拟公网IP，可通过Windows直接访问</li><li><strong>内网地址</strong>：模拟局域网环境，仅内部服务器间通信</li></ul><h3 id="_1-模板机创建步骤" tabindex="-1"><a class="header-anchor" href="#_1-模板机创建步骤"><span>1. 模板机创建步骤</span></a></h3><h4 id="步骤1-创建虚拟机" tabindex="-1"><a class="header-anchor" href="#步骤1-创建虚拟机"><span>步骤1：创建虚拟机</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">系统: CentOS 7</span>
<span class="line">内存: 2GB (最低1GB)</span>
<span class="line">CPU: 1核心</span>
<span class="line">硬盘: 40GB</span>
<span class="line">网卡1: NAT模式 (外网) - 网段10.0.0.0/24</span>
<span class="line">网卡2: LAN区段 (内网) - 网段172.16.1.0/24</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="步骤2-系统安装优化" tabindex="-1"><a class="header-anchor" href="#步骤2-系统安装优化"><span>步骤2：系统安装优化</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 进入内核选择界面时，按上下方向键，取消自动选择</span>
<span class="line"># 输入 tab 键，复制粘贴如下代码，将网卡名改为 eth0 格式</span>
<span class="line">net.ifnames=0 biosdevname=0</span>
<span class="line"></span>
<span class="line"># 安装时设置</span>
<span class="line">时区: 亚洲/上海</span>
<span class="line">语言: 英文</span>
<span class="line">主机名: type</span>
<span class="line">IP地址: 10.0.0.100</span>
<span class="line">网关: 10.0.0.254</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="步骤3-网络配置" tabindex="-1"><a class="header-anchor" href="#步骤3-网络配置"><span>步骤3：网络配置</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">cat &gt;/etc/sysconfig/network-scripts/ifcfg-eth0&lt;&lt;&#39;EOF&#39;</span>
<span class="line">TYPE=Ethernet</span>
<span class="line">BOOTPROTO=static</span>
<span class="line">NAME=eth0</span>
<span class="line">DEVICE=eth0</span>
<span class="line">ONBOOT=yes</span>
<span class="line">IPADDR=10.0.0.100</span>
<span class="line">NETMASK=255.255.255.0</span>
<span class="line">GATEWAY=10.0.0.254</span>
<span class="line">EOF</span>
<span class="line">cat &gt;/etc/sysconfig/network-scripts/ifcfg-eth1&lt;&lt;&#39;EOF&#39;</span>
<span class="line">TYPE=Ethernet</span>
<span class="line">BOOTPROTO=static</span>
<span class="line">NAME=eth1</span>
<span class="line">DEVICE=eth1</span>
<span class="line">ONBOOT=yes</span>
<span class="line">IPADDR=172.16.1.100</span>
<span class="line">NETMASK=255.255.255.0</span>
<span class="line">EOF</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="步骤4-系统初始化优化" tabindex="-1"><a class="header-anchor" href="#步骤4-系统初始化优化"><span>步骤4：系统初始化优化</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 关闭防火墙和SELinux</span></span>
<span class="line">systemctl stop firewalld NetworkManager</span>
<span class="line">systemctl disable firewalld NetworkManager</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/^SELINUX=/c SELINUX=disabled&#39;</span> /etc/selinux/config</span>
<span class="line">setenforce <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 优化SSH连接</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/#UseDNS yes/UseDNS no/g&#39;</span> /etc/ssh/sshd_config</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/GSSAPIAuthentication yes/GSSAPIAuthentication no/g&#39;</span> /etc/ssh/sshd_config</span>
<span class="line">systemctl restart sshd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 优化PS1变量</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;export PS1=&quot;[\\[\\e[34;1m\\]\\u@\\[\\e[0m\\]\\[\\e[32;1m\\]\\H\\[\\e[0m\\] \\[\\e[31;1m\\]\\w\\[\\e[0m\\]]\\\\$&quot;&#39;</span> <span class="token operator">&gt;&gt;</span>~/.bashrc</span>
<span class="line"><span class="token builtin class-name">source</span> ~/.bashrc</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 配置YUM源</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /etc/yum.repos.d</span>
<span class="line"><span class="token function">mkdir</span> bakrepo <span class="token operator">&amp;&amp;</span> <span class="token function">mv</span> *.repo bakrepo/</span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo</span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> epel.repo http://mirrors.aliyun.com/repo/epel-7.repo</span>
<span class="line">yum clean all <span class="token operator">&amp;&amp;</span> yum makecache</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 安装基础软件</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> tree <span class="token function">wget</span> bash-completion lrzsz net-tools sysstat iotop iftop <span class="token function">htop</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6. 配置hosts解析</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/hosts <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">10.0.0.61  172.16.1.61  master61</span>
<span class="line">10.0.0.5   172.16.1.5   slb5</span>
<span class="line">10.0.0.6   172.16.1.6   slb6</span>
<span class="line">10.0.0.7   172.16.1.7   web7</span>
<span class="line">10.0.0.8   172.16.1.8   web8</span>
<span class="line">10.0.0.9   172.16.1.9   web9</span>
<span class="line">10.0.0.31  172.16.1.31  nfs31</span>
<span class="line">10.0.0.41  172.16.1.41  rsync41</span>
<span class="line">10.0.0.51  172.16.1.51  db51</span>
<span class="line">EOF</span></span>
<span class="line"><span class="token comment"># DNS解析</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span>/etc/resolv.conf<span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">nameserver 223.5.5.5</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 7. 时间同步</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;* * * * * /usr/sbin/ntpdate time1.aliyun.com &gt; /dev/null 2&gt;&amp;1&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/crontab</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 8. 关闭Swap</span></span>
<span class="line">swapoff <span class="token parameter variable">-a</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/swap/d&#39;</span> /etc/fstab</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="步骤5-创建ip修改脚本" tabindex="-1"><a class="header-anchor" href="#步骤5-创建ip修改脚本"><span>步骤5：创建IP修改脚本</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">cat &gt;/set.sh&lt;&lt;&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line"># network_init.sh</span>
<span class="line"></span>
<span class="line">read -p &quot;请输入IP主机位：&quot; my_ip</span>
<span class="line">read -p &quot;请输入主机名：&quot; host_name</span>
<span class="line"></span>
<span class="line">echo &#39;正在修改网卡配置文件eth0&#39;</span>
<span class="line">sed -i &quot;/IPADDR/s#100#\${my_ip}#g&quot; /etc/sysconfig/network-scripts/ifcfg-eth0</span>
<span class="line"></span>
<span class="line">echo &#39;正在修改网卡配置文件eth1&#39;</span>
<span class="line">sed -i &quot;/IPADDR/s#100#\${my_ip}#g&quot; /etc/sysconfig/network-scripts/ifcfg-eth1</span>
<span class="line"></span>
<span class="line">echo &#39;正在修改主机名&#39;</span>
<span class="line">hostnamectl set-hostname \${host_name}</span>
<span class="line"></span>
<span class="line">echo &#39;重启network服务中&#39;</span>
<span class="line">systemctl restart network</span>
<span class="line"></span>
<span class="line">echo &#39;配置完成！&#39;</span>
<span class="line">EOF</span>
<span class="line">chmod +x /set.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="步骤6-拍摄快照" tabindex="-1"><a class="header-anchor" href="#步骤6-拍摄快照"><span>步骤6：拍摄快照</span></a></h4><ol><li>关机模板机</li><li>创建快照：<code>template_init</code></li><li>克隆虚拟机</li></ol><h3 id="_2-各服务器配置" tabindex="-1"><a class="header-anchor" href="#_2-各服务器配置"><span>2. 各服务器配置</span></a></h3><h4 id="克隆后配置示例" tabindex="-1"><a class="header-anchor" href="#克隆后配置示例"><span>克隆后配置示例</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 对于slb-5服务器</span>
<span class="line">./network_init.sh</span>
<span class="line"># 输入IP主机位: 5</span>
<span class="line"># 输入主机名: slb-5</span>
<span class="line"></span>
<span class="line"># 检查配置</span>
<span class="line">hostname    # 应显示slb-5</span>
<span class="line">ip addr show eth0  # 应显示10.0.0.5</span>
<span class="line">ip addr show eth1  # 应显示172.16.1.5</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,29)])])}const c=n(l,[["render",i]]),r=JSON.parse('{"path":"/04-Web%E6%9E%B6%E6%9E%84/00-%E7%BD%91%E7%AB%99%E6%9E%B6%E6%9E%84%E5%9F%BA%E7%A1%80/%E7%BD%91%E7%AB%99%E6%9E%B6%E6%9E%84.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"04-Web架构/00-网站架构基础/网站架构.md"}');export{c as comp,r as data};
