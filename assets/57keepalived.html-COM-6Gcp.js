import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function t(p,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="keepalived-高可用集群部署指南" tabindex="-1"><a class="header-anchor" href="#keepalived-高可用集群部署指南"><span>Keepalived 高可用集群部署指南</span></a></h1><hr><h2 id="一、为什么需要-keepalived" tabindex="-1"><a class="header-anchor" href="#一、为什么需要-keepalived"><span>一、为什么需要 Keepalived？</span></a></h2><h3 id="_1-负载均衡单点故障问题" tabindex="-1"><a class="header-anchor" href="#_1-负载均衡单点故障问题"><span>1. 负载均衡单点故障问题</span></a></h3><ul><li>传统负载均衡器（如 SLB5）是单点，一旦故障整个网站瘫痪</li><li>需要高可用（HA）解决方案确保入口服务不中断</li></ul><h3 id="_2-keepalived-解决方案" tabindex="-1"><a class="header-anchor" href="#_2-keepalived-解决方案"><span>2. Keepalived 解决方案</span></a></h3><ul><li>创建虚拟 IP（VIP）在多个 LB 服务器间漂移</li><li>实现负载均衡器的高可用性</li></ul><hr><h2 id="二、keepalived-工作原理" tabindex="-1"><a class="header-anchor" href="#二、keepalived-工作原理"><span>二、Keepalived 工作原理</span></a></h2><h3 id="_1-vrrp-协议基础" tabindex="-1"><a class="header-anchor" href="#_1-vrrp-协议基础"><span>1. VRRP 协议基础</span></a></h3><ul><li>VRRP：虚拟路由冗余协议（Virtual Router Redundancy Protocol）</li><li>解决静态路由的单点故障问题</li><li>通过竞选协议将路由任务交给某一台 VRRP 路由器</li></ul><h3 id="_2-工作流程" tabindex="-1"><a class="header-anchor" href="#_2-工作流程"><span>2. 工作流程</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">1. Master 节点优先获得 VIP 资源</span>
<span class="line">2. Master 持续发送 VRRP 广播包（心跳）</span>
<span class="line">3. Backup 节点监听心跳包</span>
<span class="line">4. Master 故障时，Backup 接管 VIP（&lt;1秒）</span>
<span class="line">5. Master 恢复后，根据优先级重新接管 VIP</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-组播通信机制" tabindex="-1"><a class="header-anchor" href="#_3-组播通信机制"><span>3. 组播通信机制</span></a></h3><ul><li>Master/Backup 向组播地址 <code>224.0.0.18</code> 发送心跳</li><li>确保同一组内设备能互相感知状态</li><li>使用明文密码认证（默认配置）</li></ul><hr><h2 id="三、环境准备与部署" tabindex="-1"><a class="header-anchor" href="#三、环境准备与部署"><span>三、环境准备与部署</span></a></h2><h3 id="_1-网络架构" tabindex="-1"><a class="header-anchor" href="#_1-网络架构"><span>1. 网络架构</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">客户端 → VIP:10.0.0.3 → [LB5(MASTER) / LB6(BACKUP)] → [Web7 / Web8]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="_2-后端-web-服务器部署-web7、web8" tabindex="-1"><a class="header-anchor" href="#_2-后端-web-服务器部署-web7、web8"><span>2. 后端 Web 服务器部署（Web7、Web8）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装 Nginx</span></span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建测试页面</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;Web7 Service&#39;</span> <span class="token operator">&gt;</span> /usr/share/nginx/html/index.html</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;Web8 Service&#39;</span> <span class="token operator">&gt;</span> /usr/share/nginx/html/index.html</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动服务</span></span>
<span class="line">systemctl start nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-负载均衡器部署-lb5、lb6" tabindex="-1"><a class="header-anchor" href="#_3-负载均衡器部署-lb5、lb6"><span>3. 负载均衡器部署（LB5、LB6）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装 Nginx</span></span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置负载均衡</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/conf.d/lb.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">upstream web_pools {</span>
<span class="line">    server 10.0.0.7:80;</span>
<span class="line">    server 10.0.0.8:80;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">server {</span>
<span class="line">    listen 80;</span>
<span class="line">    server_name _;</span>
<span class="line">    </span>
<span class="line">    location / {</span>
<span class="line">        proxy_pass http://web_pools;</span>
<span class="line">        include /etc/nginx/proxy_params;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 代理参数配置</span></span>
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
<span class="line">systemctl start nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、keepalived-配置详解" tabindex="-1"><a class="header-anchor" href="#四、keepalived-配置详解"><span>四、Keepalived 配置详解</span></a></h2><h3 id="_4-1-master-节点配置-lb5" tabindex="-1"><a class="header-anchor" href="#_4-1-master-节点配置-lb5"><span>4.1 MASTER 节点配置（LB5）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装 Keepalived</span></span>
<span class="line">yum <span class="token function">install</span> keepalived <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置文件</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/keepalived/keepalived.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">global_defs {</span>
<span class="line">    router_id lb-5</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">vrrp_instance VIP_1 {</span>
<span class="line">    state MASTER</span>
<span class="line">    interface eth0</span>
<span class="line">    virtual_router_id 50</span>
<span class="line">    priority 150</span>
<span class="line">    advert_int 1</span>
<span class="line">    </span>
<span class="line">    authentication {</span>
<span class="line">        auth_type PASS</span>
<span class="line">        auth_pass 1111</span>
<span class="line">    }</span>
<span class="line">    </span>
<span class="line">    virtual_ipaddress {</span>
<span class="line">        10.0.0.3/24</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl start keepalived</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-backup-节点配置-lb6" tabindex="-1"><a class="header-anchor" href="#_4-2-backup-节点配置-lb6"><span>4.2 BACKUP 节点配置（LB6）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装 Keepalived</span></span>
<span class="line">yum <span class="token function">install</span> keepalived <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置文件</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/keepalived/keepalived.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">global_defs {</span>
<span class="line">    router_id lb-6</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">vrrp_instance VIP_1 {</span>
<span class="line">    state BACKUP</span>
<span class="line">    interface eth0</span>
<span class="line">    virtual_router_id 50</span>
<span class="line">    priority 100</span>
<span class="line">    advert_int 1</span>
<span class="line">    </span>
<span class="line">    authentication {</span>
<span class="line">        auth_type PASS</span>
<span class="line">        auth_pass 1111</span>
<span class="line">    }</span>
<span class="line">    </span>
<span class="line">    virtual_ipaddress {</span>
<span class="line">        10.0.0.3/24</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl start keepalived</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-关键配置参数" tabindex="-1"><a class="header-anchor" href="#_4-3-关键配置参数"><span>4.3 关键配置参数</span></a></h3><table><thead><tr><th style="text-align:left;">参数</th><th style="text-align:left;">说明</th><th style="text-align:left;">MASTER</th><th style="text-align:left;">BACKUP</th></tr></thead><tbody><tr><td style="text-align:left;"><code>router_id</code></td><td style="text-align:left;">路由唯一标识</td><td style="text-align:left;">lb-5</td><td style="text-align:left;">lb-6</td></tr><tr><td style="text-align:left;"><code>state</code></td><td style="text-align:left;">节点角色</td><td style="text-align:left;">MASTER</td><td style="text-align:left;">BACKUP</td></tr><tr><td style="text-align:left;"><code>interface</code></td><td style="text-align:left;">VIP 绑定网卡</td><td style="text-align:left;">eth0</td><td style="text-align:left;">eth0</td></tr><tr><td style="text-align:left;"><code>virtual_router_id</code></td><td style="text-align:left;">虚拟路由 ID（组内一致）</td><td style="text-align:left;">50</td><td style="text-align:left;">50</td></tr><tr><td style="text-align:left;"><code>priority</code></td><td style="text-align:left;">优先级（MASTER 更高）</td><td style="text-align:left;">150</td><td style="text-align:left;">100</td></tr><tr><td style="text-align:left;"><code>auth_pass</code></td><td style="text-align:left;">认证密码（组内一致）</td><td style="text-align:left;">1111</td><td style="text-align:left;">1111</td></tr></tbody></table><hr><h2 id="五、验证与测试" tabindex="-1"><a class="header-anchor" href="#五、验证与测试"><span>五、验证与测试</span></a></h2><h3 id="_5-1-检查-vip-分配" tabindex="-1"><a class="header-anchor" href="#_5-1-检查-vip-分配"><span>5.1 检查 VIP 分配</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查 VIP 是否在 MASTER 节点</span></span>
<span class="line"><span class="token function">ip</span> addr show eth0 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&quot;10.0.0.3&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试访问</span></span>
<span class="line"><span class="token function">curl</span> http://10.0.0.3</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-故障模拟" tabindex="-1"><a class="header-anchor" href="#_5-2-故障模拟"><span>5.2 故障模拟</span></a></h3><p><strong>MASTER 故障模拟</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 在 LB5 停止 Keepalived</span></span>
<span class="line">systemctl stop keepalived</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 VIP 是否漂移到 LB6</span></span>
<span class="line"><span class="token function">ip</span> addr show eth0 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&quot;10.0.0.3&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证服务可用性</span></span>
<span class="line"><span class="token function">curl</span> http://10.0.0.3</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>MASTER 恢复</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 在 LB5 重启 Keepalived</span></span>
<span class="line">systemctl start keepalived</span>
<span class="line"></span>
<span class="line"><span class="token comment"># VIP 应自动漂移回 LB5（优先级更高）</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、keepalived-脑裂问题与解决" tabindex="-1"><a class="header-anchor" href="#六、keepalived-脑裂问题与解决"><span>六、Keepalived 脑裂问题与解决</span></a></h2><h3 id="_6-1-什么是脑裂" tabindex="-1"><a class="header-anchor" href="#_6-1-什么是脑裂"><span>6.1 什么是脑裂？</span></a></h3><ul><li>MASTER 和 BACKUP 同时持有 VIP</li><li>心跳线故障导致双方都认为自己是 MASTER</li><li>造成 IP 冲突和服务中断</li></ul><h3 id="_6-2-脑裂原因" tabindex="-1"><a class="header-anchor" href="#_6-2-脑裂原因"><span>6.2 脑裂原因</span></a></h3><table><thead><tr><th style="text-align:left;">原因</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">心跳线路故障</td><td style="text-align:left;">网线损坏、防火墙阻挡</td></tr><tr><td style="text-align:left;">网络配置错误</td><td style="text-align:left;">IP 冲突、路由问题</td></tr><tr><td style="text-align:left;">配置不一致</td><td style="text-align:left;">virtual_router_id 不同</td></tr></tbody></table><h3 id="_6-3-脑裂检测脚本-backup-节点" tabindex="-1"><a class="header-anchor" href="#_6-3-脑裂检测脚本-backup-节点"><span>6.3 脑裂检测脚本（BACKUP 节点）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置 SSH 免密登录（LB6 → LB5）</span></span>
<span class="line">ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-N</span> <span class="token string">&#39;&#39;</span> <span class="token parameter variable">-f</span> ~/.ssh/id_rsa</span>
<span class="line">ssh-copy-id root@10.0.0.5</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检测脚本</span></span>
<span class="line"><span class="token assign-left variable">MASTER_VIP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">ssh</span> <span class="token number">10.0</span>.0.5 <span class="token string">&quot;ip a | grep 10.0.0.3 | wc -l&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">MY_VIP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">ip</span> a <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">10.0</span>.0.3 <span class="token operator">|</span> <span class="token function">wc</span> <span class="token parameter variable">-l</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">\${MASTER_VIP}</span> <span class="token operator">==</span> <span class="token number">1</span> <span class="token parameter variable">-a</span> <span class="token variable">\${MY_VIP}</span> <span class="token operator">==</span> <span class="token number">1</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    systemctl stop keepalived</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-nginx-健康检查脚本-master-节点" tabindex="-1"><a class="header-anchor" href="#_6-4-nginx-健康检查脚本-master-节点"><span>6.4 Nginx 健康检查脚本（MASTER 节点）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">NGINX_STATUS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> ngin<span class="token punctuation">[</span>x<span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token function">wc</span> <span class="token parameter variable">-l</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">\${NGINX_STATUS}</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    systemctl restart nginx</span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">$?</span> <span class="token operator">==</span> <span class="token number">1</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        systemctl stop keepalived</span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-5-配置脚本调用" tabindex="-1"><a class="header-anchor" href="#_6-5-配置脚本调用"><span>6.5 配置脚本调用</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> /etc/keepalived/keepalived.conf <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line"></span>
<span class="line">vrrp_script check_nginx {</span>
<span class="line">    script &quot;/etc/keepalived/check_nginx.sh&quot;</span>
<span class="line">    interval 5</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">vrrp_instance VIP_1 {</span>
<span class="line">    track_script {</span>
<span class="line">        check_nginx</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、总结" tabindex="-1"><a class="header-anchor" href="#七、总结"><span>七、总结</span></a></h2><h3 id="_7-1-核心要点" tabindex="-1"><a class="header-anchor" href="#_7-1-核心要点"><span>7.1 核心要点</span></a></h3><ol><li><strong>VRRP 协议</strong>：实现路由器故障自动切换</li><li><strong>VIP 漂移</strong>：Master 故障时 Backup 自动接管</li><li><strong>脑裂防护</strong>：通过脚本检测和处理脑裂情况</li><li><strong>健康检查</strong>：确保下游服务正常时 VIP 才生效</li></ol><h3 id="_7-2-部署流程" tabindex="-1"><a class="header-anchor" href="#_7-2-部署流程"><span>7.2 部署流程</span></a></h3><table><thead><tr><th style="text-align:left;">步骤</th><th style="text-align:left;">操作</th></tr></thead><tbody><tr><td style="text-align:left;">1</td><td style="text-align:left;">部署后端 Web 服务</td></tr><tr><td style="text-align:left;">2</td><td style="text-align:left;">配置负载均衡 Nginx</td></tr><tr><td style="text-align:left;">3</td><td style="text-align:left;">安装 Keepalived</td></tr><tr><td style="text-align:left;">4</td><td style="text-align:left;">配置 MASTER 节点</td></tr><tr><td style="text-align:left;">5</td><td style="text-align:left;">配置 BACKUP 节点</td></tr><tr><td style="text-align:left;">6</td><td style="text-align:left;">配置健康检查脚本</td></tr><tr><td style="text-align:left;">7</td><td style="text-align:left;">测试故障切换</td></tr></tbody></table><h3 id="_7-3-注意事项" tabindex="-1"><a class="header-anchor" href="#_7-3-注意事项"><span>7.3 注意事项</span></a></h3><ul><li>Master 和 Backup 的 virtual_router_id 必须一致</li><li>认证密码 auth_pass 必须相同</li><li>priority 值高的节点会成为 Master</li><li>生产环境必须配置脑裂检测机制</li></ul>`,60)])])}const d=n(i,[["render",t]]),r=JSON.parse('{"path":"/04-Web%E6%9E%B6%E6%9E%84/05-%E9%AB%98%E5%8F%AF%E7%94%A8%E9%9B%86%E7%BE%A4/57keepalived.html","title":"Keepalived 高可用集群部署指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"04-Web架构/05-高可用集群/57keepalived.md"}');export{d as comp,r as data};
