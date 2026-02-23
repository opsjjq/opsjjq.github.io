import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="docker-网络详解" tabindex="-1"><a class="header-anchor" href="#docker-网络详解"><span>Docker 网络详解</span></a></h1><h2 id="一、docker-网络基础" tabindex="-1"><a class="header-anchor" href="#一、docker-网络基础"><span>一、Docker 网络基础</span></a></h2><h3 id="_1-docker-网络工作原理" tabindex="-1"><a class="header-anchor" href="#_1-docker-网络工作原理"><span>1. Docker 网络工作原理</span></a></h3><ul><li><strong>技术基础</strong>：利用 Linux 的 network namespace、network bridge、虚拟网络设备实现</li><li><strong>默认网桥</strong>：安装 Docker 后自动创建 <code>docker0</code> 虚拟网桥（虚拟交换机）</li><li><strong>通信机制</strong>：在宿主机和容器内分别创建虚拟接口（veth pair）实现通信</li></ul><hr><h3 id="_2-容器创建流程" tabindex="-1"><a class="header-anchor" href="#_2-容器创建流程"><span>2. 容器创建流程</span></a></h3><ol><li>创建一对虚拟接口（veth pair）</li><li>宿主机一端桥接到 <code>docker0</code> 网桥，命名如 <code>vethXXXXXX</code></li><li>容器一端命名为 <code>eth0</code>（仅在容器命名空间内可见）</li><li>从网桥地址段分配 IP 给容器，配置默认路由</li><li>容器通过 <code>eth0</code> 与其他容器通信</li></ol><hr><h3 id="_3-容器如何访问外部网络" tabindex="-1"><a class="header-anchor" href="#_3-容器如何访问外部网络"><span>3. 容器如何访问外部网络</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查 IP 转发是否开启</span></span>
<span class="line"><span class="token function">sysctl</span> net.ipv4.ip_forward</span>
<span class="line"><span class="token comment"># 输出应为：net.ipv4.ip_forward = 1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 如果为 0，手动开启转发</span></span>
<span class="line"><span class="token function">sysctl</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">net.ipv4.ip_forward</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 或者启动 Docker 时自动设置</span></span>
<span class="line">dockerd --ip-forward<span class="token operator">=</span>true</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>Docker 服务默认开启 IP 转发，但若宿主机未启用，容器将无法访问外部网络</p></blockquote><hr><h3 id="_4-容器之间访问" tabindex="-1"><a class="header-anchor" href="#_4-容器之间访问"><span>4. 容器之间访问</span></a></h3><p>容器间通信需要满足两个条件：</p><ol><li>网络拓扑已互联（默认通过 <code>docker0</code> 网桥连接）</li><li>宿主机防火墙（如 <code>iptables</code>）允许通信</li></ol><hr><h2 id="二、docker-四种网络模式" tabindex="-1"><a class="header-anchor" href="#二、docker-四种网络模式"><span>二、Docker 四种网络模式</span></a></h2><h3 id="_1-bridge-模式-默认" tabindex="-1"><a class="header-anchor" href="#_1-bridge-模式-默认"><span>1. Bridge 模式（默认）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--network</span><span class="token operator">=</span>bridge  <span class="token comment"># 默认值，可省略</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>特点</strong>：</p><ul><li>连接到默认 <code>docker0</code> 网桥</li><li>自动分配 IP（172.17.0.0/16）</li><li>通过 iptables NAT 与宿主机通信</li><li>同一宿主机容器可互访，不同宿主机容器需额外配置</li><li>需要端口映射供外部访问（原理：iptables 添加 DNAT 规则）</li></ul><p><strong>网络拓扑</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">宿主机 ←→ docker0网桥 ←→ veth pair ←→ 容器eth0</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>常用命令</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看网络列表</span></span>
<span class="line"><span class="token function">docker</span> network <span class="token function">ls</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看网络详情</span></span>
<span class="line"><span class="token function">docker</span> inspect bridge <span class="token operator">|</span> <span class="token function">grep</span> Subnet</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装网桥管理工具</span></span>
<span class="line">yum <span class="token function">install</span> bridge-utils <span class="token parameter variable">-y</span>  <span class="token comment"># CentOS/RHEL</span></span>
<span class="line"><span class="token function">apt</span> <span class="token function">install</span> bridge-utils <span class="token parameter variable">-y</span>   <span class="token comment"># Debian/Ubuntu</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看网桥信息</span></span>
<span class="line">brctl show</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 docker0 网桥配置</span></span>
<span class="line"><span class="token function">ifconfig</span> docker0</span>
<span class="line"><span class="token function">ip</span> addr show docker0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看虚拟网卡</span></span>
<span class="line"><span class="token function">ifconfig</span> <span class="token operator">|</span> <span class="token function">grep</span> veth</span>
<span class="line"><span class="token function">ip</span> <span class="token function">link</span> show <span class="token operator">|</span> <span class="token function">grep</span> veth</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_2-host-模式" tabindex="-1"><a class="header-anchor" href="#_2-host-模式"><span>2. Host 模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--network</span><span class="token operator">=</span>host</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>特点</strong>：</p><ul><li>容器直接使用宿主机网络栈</li><li>无独立网络命名空间</li><li>无端口映射功能（直接使用宿主机端口）</li><li>网络性能更高（无 NAT/虚拟化开销）</li><li>安全性较低（容器直接暴露于主机网络环境）</li></ul><p><strong>实战</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 运行 host 模式容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--network</span> <span class="token function">host</span> nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看端口（直接使用宿主机端口）</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> :80</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 进入容器查看网络配置（与宿主机一致）</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token operator">&lt;</span>container<span class="token operator">&gt;</span> <span class="token function">bash</span></span>
<span class="line"><span class="token function">ifconfig</span></span>
<span class="line"><span class="token function">ip</span> addr show</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_3-container-模式" tabindex="-1"><a class="header-anchor" href="#_3-container-模式"><span>3. Container 模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--network</span><span class="token operator">=</span>container:<span class="token operator">&lt;</span>容器名或ID<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>特点</strong>：</p><ul><li>新容器共享指定容器的<strong>网络命名空间</strong></li><li><strong>共享 IP 地址和端口</strong>配置</li><li>各自有独立的文件系统、进程列表</li><li>适合需要网络共享的应用场景（如 Sidecar 模式）</li></ul><p><strong>实战</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建第一个容器并映射端口</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web1 <span class="token parameter variable">-p</span> <span class="token number">80</span>:80 nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建第二个容器，共享 web1 的网络</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web2 <span class="token parameter variable">--network</span> container:web1 alpine</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在 web2 中访问 web1 的服务</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> web2 <span class="token function">sh</span></span>
<span class="line"><span class="token function">curl</span> http://localhost</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试外部访问</span></span>
<span class="line"><span class="token function">curl</span> http://localhost:80  <span class="token comment"># 宿主机的 80 端口</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_4-none-模式" tabindex="-1"><a class="header-anchor" href="#_4-none-模式"><span>4. None 模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--network</span><span class="token operator">=</span>none</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>特点</strong>：</p><ul><li>无网络配置，只有 lo 回环接口</li><li>需要手动配置网络</li><li>适用于需要完全自定义网络的场景</li><li>常用于安全性要求极高的场景</li></ul><p><strong>实战</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 运行 none 模式容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--network</span> none <span class="token parameter variable">-it</span> <span class="token parameter variable">--rm</span> busybox /bin/sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 容器内查看网络（只有 lo 接口）</span></span>
<span class="line">/ <span class="token comment"># ifconfig</span></span>
<span class="line">lo        Link encap:Local Loopback</span>
<span class="line">          inet addr:127.0.0.1  Mask:255.0.0.0</span>
<span class="line"></span>
<span class="line">/ <span class="token comment"># ip addr show</span></span>
<span class="line"><span class="token number">1</span>: lo: <span class="token operator">&lt;</span>LOOPBACK,UP,LOWER_UP<span class="token operator">&gt;</span> mtu <span class="token number">65536</span> qdisc noqueue state UNKNOWN</span>
<span class="line">    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00</span>
<span class="line">    inet <span class="token number">127.0</span>.0.1/8 scope <span class="token function">host</span> lo</span>
<span class="line">       valid_lft forever preferred_lft forever</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="网络管理命令" tabindex="-1"><a class="header-anchor" href="#网络管理命令"><span>网络管理命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 网络管理完整命令集</span></span>
<span class="line"><span class="token function">docker</span> network</span>
<span class="line">  connect     Connect a container to a network</span>
<span class="line">  create      Create a network</span>
<span class="line">  disconnect  Disconnect a container from a network</span>
<span class="line">  inspect     Display detailed information on one or <span class="token function">more</span> networks</span>
<span class="line">  <span class="token function">ls</span>          List networks</span>
<span class="line">  prune       Remove all unused networks</span>
<span class="line">  <span class="token function">rm</span>          Remove one or <span class="token function">more</span> networks</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>创建自定义网络示例</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建自定义桥接网络</span></span>
<span class="line"><span class="token function">docker</span> network create <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--driver</span> bridge <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--subnet</span> <span class="token number">192.168</span>.23.0/24 <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--gateway</span> <span class="token number">192.168</span>.23.1 <span class="token punctuation">\\</span></span>
<span class="line">  test_net</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用自定义网络运行容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> app1 <span class="token parameter variable">--network</span> test_net alpine <span class="token function">sleep</span> <span class="token number">3600</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看容器 IP 配置</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> app1 <span class="token function">ifconfig</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看网络详情</span></span>
<span class="line"><span class="token function">docker</span> inspect test_net <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-A5</span> <span class="token string">&quot;IPAM&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、bridge-网络配置与管理" tabindex="-1"><a class="header-anchor" href="#三、bridge-网络配置与管理"><span>三、Bridge 网络配置与管理</span></a></h2><h3 id="_1-修改默认网桥配置" tabindex="-1"><a class="header-anchor" href="#_1-修改默认网桥配置"><span>1. 修改默认网桥配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 编辑 Docker 配置文件</span></span>
<span class="line"><span class="token function">vi</span> /etc/docker/daemon.json</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加或修改以下配置</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;bip&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;192.168.2.1/24&quot;</span>,          <span class="token comment"># 修改默认网桥 IP 段</span></span>
<span class="line">  <span class="token string">&quot;fixed-cidr&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;192.168.2.0/24&quot;</span>,   <span class="token comment"># 固定 IP 范围</span></span>
<span class="line">  <span class="token string">&quot;default-gateway&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;192.168.2.1&quot;</span>, <span class="token comment"># 默认网关</span></span>
<span class="line">  <span class="token string">&quot;registry-mirrors&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span><span class="token string">&quot;https://ms9glx6x.mirror.aliyuncs.com&quot;</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启 Docker 服务</span></span>
<span class="line">systemctl restart <span class="token function">docker</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证配置</span></span>
<span class="line"><span class="token function">ifconfig</span> docker0</span>
<span class="line"><span class="token function">ip</span> addr show docker0</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_2-自定义网络" tabindex="-1"><a class="header-anchor" href="#_2-自定义网络"><span>2. 自定义网络</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建自定义桥接网络</span></span>
<span class="line"><span class="token function">docker</span> network create <span class="token parameter variable">-d</span> bridge <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--subnet</span> <span class="token number">192.168</span>.55.0/24 <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--gateway</span> <span class="token number">192.168</span>.55.1 <span class="token punctuation">\\</span></span>
<span class="line">  --ip-range <span class="token number">192.168</span>.55.128/25 <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--label</span> <span class="token assign-left variable">env</span><span class="token operator">=</span>prod <span class="token punctuation">\\</span></span>
<span class="line">  my_prod_net</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看网络详情</span></span>
<span class="line"><span class="token function">docker</span> network inspect my_prod_net</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用自定义网络运行容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> web_app <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--network</span> my_prod_net <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--ip</span> <span class="token number">192.168</span>.55.130 <span class="token punctuation">\\</span></span>
<span class="line">  nginx:alpine</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建第二个容器（自动分配 IP）</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> api_app <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--network</span> my_prod_net <span class="token punctuation">\\</span></span>
<span class="line">  python:3.9</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试容器间通信</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> web_app <span class="token function">ping</span> api_app</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理网络</span></span>
<span class="line"><span class="token function">docker</span> network <span class="token function">rm</span> my_prod_net</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_3-容器网络调试技巧" tabindex="-1"><a class="header-anchor" href="#_3-容器网络调试技巧"><span>3. 容器网络调试技巧</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 busybox 调试网络</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">--rm</span> <span class="token parameter variable">--name</span> net_tool busybox /bin/sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 容器内常用网络命令：</span></span>
<span class="line"><span class="token comment"># ifconfig      # 查看网络接口</span></span>
<span class="line"><span class="token comment"># route -n      # 查看路由表</span></span>
<span class="line"><span class="token comment"># ping &lt;host&gt;   # 测试连通性</span></span>
<span class="line"><span class="token comment"># traceroute &lt;host&gt; # 跟踪路由</span></span>
<span class="line"><span class="token comment"># nslookup &lt;domain&gt; # DNS 查询</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 提取容器 IP 地址的多种方法</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方法 1：使用 inspect 命令</span></span>
<span class="line"><span class="token function">docker</span> inspect <span class="token parameter variable">-f</span> <span class="token string">&#39;{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}&#39;</span> <span class="token operator">&lt;</span>容器名<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方法 2：查看所有容器 IP</span></span>
<span class="line"><span class="token function">docker</span> inspect <span class="token parameter variable">-f</span> <span class="token string">&#39;{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}&#39;</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-aq</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方法 3：使用 jq 解析（需要安装 jq）</span></span>
<span class="line"><span class="token function">docker</span> inspect <span class="token operator">&lt;</span>容器名<span class="token operator">&gt;</span> <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">&#39;.[0].NetworkSettings.Networks[].IPAddress&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方法 4：简化的 ip 命令</span></span>
<span class="line"><span class="token function">docker</span> inspect <span class="token operator">&lt;</span>容器名<span class="token operator">&gt;</span> <span class="token operator">|</span> <span class="token function">grep</span> IPAddress</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_4-bash-函数简化操作" tabindex="-1"><a class="header-anchor" href="#_4-bash-函数简化操作"><span>4. Bash 函数简化操作</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 添加到 ~/.bashrc 或 ~/.zshrc</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function-name function">docker_ip</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment"># 获取单个容器的 IP 地址</span></span>
<span class="line">    <span class="token function">docker</span> inspect <span class="token parameter variable">-f</span> <span class="token string">&#39;{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}&#39;</span> <span class="token string">&quot;<span class="token variable">$1</span>&quot;</span> <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>/dev/null <span class="token operator">||</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;容器不存在或未运行&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">function</span> <span class="token function-name function">docker_ips</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment"># 列出所有运行中容器的名称和 IP</span></span>
<span class="line">    <span class="token function">docker</span> inspect <span class="token parameter variable">-f</span> <span class="token string">&#39;{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}&#39;</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-aq</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">function</span> <span class="token function-name function">docker_net_info</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment"># 查看容器详细网络信息</span></span>
<span class="line">    <span class="token function">docker</span> inspect <span class="token string">&quot;<span class="token variable">$1</span>&quot;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-A</span> <span class="token number">20</span> <span class="token string">&quot;NetworkSettings&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新加载配置</span></span>
<span class="line"><span class="token builtin class-name">source</span> ~/.bashrc</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用示例</span></span>
<span class="line">docker_ip web_app</span>
<span class="line">docker_ips</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、端口映射与防火墙" tabindex="-1"><a class="header-anchor" href="#四、端口映射与防火墙"><span>四、端口映射与防火墙</span></a></h2><h3 id="_1-端口映射" tabindex="-1"><a class="header-anchor" href="#_1-端口映射"><span>1. 端口映射</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 基本端口映射</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">8080</span>:80 nginx  <span class="token comment"># 宿主机 8080 -&gt; 容器 80</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定宿主机 IP</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">127.0</span>.0.1:8080:80 nginx  <span class="token comment"># 仅本地访问</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 随机端口映射</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">80</span> nginx  <span class="token comment"># Docker 分配随机宿主机端口</span></span>
<span class="line"><span class="token function">docker</span> port <span class="token operator">&lt;</span>容器名<span class="token operator">&gt;</span>        <span class="token comment"># 查看映射的端口</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 映射多个端口</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">8080</span>:80 <span class="token parameter variable">-p</span> <span class="token number">8443</span>:443 nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 映射 UDP 端口</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">53</span>:53/udp dns_server</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看端口映射</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span>  <span class="token comment"># 查看 PORTS 列</span></span>
<span class="line"><span class="token function">docker</span> port <span class="token operator">&lt;</span>容器名<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_2-iptables-规则管理" tabindex="-1"><a class="header-anchor" href="#_2-iptables-规则管理"><span>2. iptables 规则管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看 Docker 创建的 iptables 规则</span></span>
<span class="line">iptables <span class="token parameter variable">-t</span> nat <span class="token parameter variable">-L</span> <span class="token parameter variable">-n</span>  <span class="token comment"># 查看 NAT 表</span></span>
<span class="line">iptables <span class="token parameter variable">-L</span> <span class="token parameter variable">-n</span>         <span class="token comment"># 查看 filter 表</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 DOCKER 链的规则</span></span>
<span class="line">iptables <span class="token parameter variable">-t</span> nat <span class="token parameter variable">-L</span> DOCKER</span>
<span class="line">iptables <span class="token parameter variable">-L</span> DOCKER</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看特定端口映射规则</span></span>
<span class="line">iptables <span class="token parameter variable">-t</span> nat <span class="token parameter variable">-L</span> <span class="token parameter variable">-n</span> <span class="token operator">|</span> <span class="token function">grep</span> :8080</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、容器访问控制" tabindex="-1"><a class="header-anchor" href="#五、容器访问控制"><span>五、容器访问控制</span></a></h2><h3 id="_1-容器访问外部网络" tabindex="-1"><a class="header-anchor" href="#_1-容器访问外部网络"><span>1. 容器访问外部网络</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 永久开启 IP 转发</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;net.ipv4.ip_forward = 1&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/sysctl.conf</span>
<span class="line"><span class="token function">sysctl</span> <span class="token parameter variable">-p</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看当前设置</span></span>
<span class="line"><span class="token function">sysctl</span> net.ipv4.ip_forward</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Docker 服务配置（daemon.json）</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;ip-forward&quot;</span><span class="token builtin class-name">:</span> true,</span>
<span class="line">  <span class="token string">&quot;iptables&quot;</span><span class="token builtin class-name">:</span> <span class="token boolean">true</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_2-容器间通信控制" tabindex="-1"><a class="header-anchor" href="#_2-容器间通信控制"><span>2. 容器间通信控制</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 禁用容器间通信（通过默认网桥）</span></span>
<span class="line">dockerd <span class="token parameter variable">--icc</span><span class="token operator">=</span>false</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看当前 icc 设置</span></span>
<span class="line"><span class="token function">ps</span> aux <span class="token operator">|</span> <span class="token function">grep</span> dockerd <span class="token operator">|</span> <span class="token function">grep</span> icc</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 允许特定容器间通信</span></span>
<span class="line"><span class="token comment"># 1. 创建自定义网络</span></span>
<span class="line"><span class="token function">docker</span> network create app_network</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 将需要通信的容器加入同一网络</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> app1 <span class="token parameter variable">--network</span> app_network nginx</span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> app2 <span class="token parameter variable">--network</span> app_network redis</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 其他容器使用默认网络，无法与 app1/app2 通信</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、实用命令总结" tabindex="-1"><a class="header-anchor" href="#六、实用命令总结"><span>六、实用命令总结</span></a></h2><h3 id="网络管理命令-1" tabindex="-1"><a class="header-anchor" href="#网络管理命令-1"><span>网络管理命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 网络列表与详情</span></span>
<span class="line"><span class="token function">docker</span> network <span class="token function">ls</span>                    <span class="token comment"># 列出所有网络</span></span>
<span class="line"><span class="token function">docker</span> network inspect bridge        <span class="token comment"># 查看指定网络详情</span></span>
<span class="line"><span class="token function">docker</span> network prune                 <span class="token comment"># 清理未使用网络</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 网络创建与删除</span></span>
<span class="line"><span class="token function">docker</span> network create mynet          <span class="token comment"># 创建网络</span></span>
<span class="line"><span class="token function">docker</span> network <span class="token function">rm</span> mynet              <span class="token comment"># 删除网络</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 容器网络操作</span></span>
<span class="line"><span class="token function">docker</span> network connect mynet 容器名    <span class="token comment"># 连接容器到网络</span></span>
<span class="line"><span class="token function">docker</span> network disconnect mynet 容器名 <span class="token comment"># 断开网络连接</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 端口操作</span></span>
<span class="line"><span class="token function">docker</span> port 容器名                   <span class="token comment"># 查看容器端口映射</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="系统网络诊断" tabindex="-1"><a class="header-anchor" href="#系统网络诊断"><span>系统网络诊断</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 网桥管理</span></span>
<span class="line">brctl show                          <span class="token comment"># 查看网桥信息</span></span>
<span class="line">bridge <span class="token function">link</span>                         <span class="token comment"># 查看桥接接口</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 网络接口</span></span>
<span class="line"><span class="token function">ip</span> addr show                        <span class="token comment"># 查看所有网络接口</span></span>
<span class="line"><span class="token function">ip</span> <span class="token function">link</span> show                        <span class="token comment"># 查看链接状态</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 路由与连接</span></span>
<span class="line">route <span class="token parameter variable">-n</span>                            <span class="token comment"># 查看路由表</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span>                      <span class="token comment"># 查看端口监听</span></span>
<span class="line">ss <span class="token parameter variable">-tunlp</span>                           <span class="token comment"># 更快的替代方案</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 容器网络工具</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> 容器名 <span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span>    <span class="token comment"># 查看容器内端口</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> 容器名 <span class="token function">ping</span> google.com   <span class="token comment"># 测试容器网络</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、网络模式选择建议" tabindex="-1"><a class="header-anchor" href="#七、网络模式选择建议"><span>七、网络模式选择建议</span></a></h2><table><thead><tr><th style="text-align:left;">模式</th><th style="text-align:left;">适用场景</th><th style="text-align:left;">优点</th><th style="text-align:left;">缺点</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>Bridge</strong></td><td style="text-align:left;">大多数应用场景</td><td style="text-align:left;">隔离性好，支持端口映射</td><td style="text-align:left;">NAT 带来性能开销</td></tr><tr><td style="text-align:left;"><strong>Host</strong></td><td style="text-align:left;">高性能需求应用</td><td style="text-align:left;">无 NAT 开销，性能最佳</td><td style="text-align:left;">安全性低，端口冲突</td></tr><tr><td style="text-align:left;"><strong>Container</strong></td><td style="text-align:left;">网络共享需求</td><td style="text-align:left;">共享网络配置，减少开销</td><td style="text-align:left;">依赖其他容器</td></tr><tr><td style="text-align:left;"><strong>None</strong></td><td style="text-align:left;">完全自定义网络</td><td style="text-align:left;">最大灵活性</td><td style="text-align:left;">需要手动配置</td></tr><tr><td style="text-align:left;"><strong>自定义网络</strong></td><td style="text-align:left;">复杂应用架构</td><td style="text-align:left;">灵活的网络策略</td><td style="text-align:left;">配置相对复杂</td></tr></tbody></table><hr><h3 id="选择指南" tabindex="-1"><a class="header-anchor" href="#选择指南"><span>选择指南</span></a></h3><ol><li><strong>默认场景</strong>：使用 Bridge 模式，适合 Web 应用、数据库等大多数服务</li><li><strong>性能敏感</strong>：使用 Host 模式，适合网络 IO 密集型应用</li><li><strong>微服务架构</strong>：创建自定义网络，实现服务隔离与发现</li><li><strong>安全隔离</strong>：None 模式 + 自定义配置，适合金融、安全敏感应用</li><li><strong>Sidecar 模式</strong>：Container 模式，共享主容器的网络命名空间</li></ol><hr><h3 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h3><ul><li>生产环境建议使用自定义网络而非默认 bridge</li><li>为不同的应用环境（dev/test/prod）创建独立网络</li><li>使用网络标签（label）进行网络分类管理</li><li>定期清理未使用的网络资源</li><li>监控容器网络性能，适时调整网络模式</li></ul>`,94)])])}const r=n(i,[["render",p]]),o=JSON.parse('{"path":"/05-%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92/02-docker%E5%AE%B9%E5%99%A8/5-docker%E7%BD%91%E7%BB%9C.html","title":"Docker 网络详解","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"05-容器编排/02-docker容器/5-docker网络.md"}');export{r as comp,o as data};
