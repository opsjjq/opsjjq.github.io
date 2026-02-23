import{_ as a,c as n,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(r,s){return l(),n("div",null,[...s[0]||(s[0]=[e(`<h1 id="iptables-原理与命令指南" tabindex="-1"><a class="header-anchor" href="#iptables-原理与命令指南"><span>iptables 原理与命令指南</span></a></h1><h2 id="一、服务器防火墙介绍" tabindex="-1"><a class="header-anchor" href="#一、服务器防火墙介绍"><span>一、服务器防火墙介绍</span></a></h2><p>服务器防火墙是位于网络与服务器之间的安全屏障，用于控制进出服务器的数据流量，保障系统安全。防火墙对流经它的网络通信进行扫描，从而过滤掉一些攻击，避免其在目标计算机上被执行。它还能关闭不使用的端口，禁止特定端口的流出通信，以及阻止来自不明站点的访问。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">防火墙一般分为硬件防火墙和软件防火墙：</span>
<span class="line">硬件防火墙：在硬件级别实现部分防火墙功能，另一部分基于软件实现，性能高，成本也高。</span>
<span class="line">软件防火墙：运行于通用硬件平台上的应用软件，性能较低，成本也较低。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、软件防火墙介绍" tabindex="-1"><a class="header-anchor" href="#二、软件防火墙介绍"><span>二、软件防火墙介绍</span></a></h2><ol><li>系统底层实现流量控制、数据包过滤的模块是 <strong>netfilter</strong>。</li><li>用户通过 <strong>iptables</strong> 命令修改规则，实现对网络行为的控制。</li></ol><hr><h2 id="三、iptables-介绍" tabindex="-1"><a class="header-anchor" href="#三、iptables-介绍"><span>三、iptables 介绍</span></a></h2><p>iptables 是 Linux 系统上基于 netfilter 框架的用户态防火墙工具，提供规则配置接口，实现数据包过滤、网络地址转换（NAT）等功能。</p><h3 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景"><span>使用场景</span></a></h3><p>软件防火墙主要工作在 <strong>网络层（L3）</strong> 和 <strong>传输层（L4）</strong>，部分高级防火墙可扩展至 <strong>应用层（L7）</strong>。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">开源的基于数据包过滤的防火墙工具，常见用途包括：</span>
<span class="line"></span>
<span class="line">1. 主机防火墙（filter 表的 INPUT 链）</span>
<span class="line">2. 局域网共享上网（nat 表的 POSTROUTING 链）</span>
<span class="line">3. 端口及 IP 映射（nat 表的 PREROUTING 链）</span>
<span class="line">4. IP 一对一映射</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、iptables-工作流程" tabindex="-1"><a class="header-anchor" href="#四、iptables-工作流程"><span>四、iptables 工作流程</span></a></h2><p>iptables 采用数据包过滤机制工作，对请求的数据包头部数据进行分析，并根据预先设定的规则进行匹配，决定是否允许进入主机。数据包经过防火墙时会依次经过不同的 <strong>链（Chain）</strong>，每个链中包含一系列 <strong>规则（Rule）</strong>，按顺序匹配并执行相应动作。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">工作流程特点：</span>
<span class="line"><span class="token number">1</span>. 防火墙按配置规则的顺序从上到下、从前到后过滤。</span>
<span class="line"><span class="token number">2</span>. 若匹配上规则，则立即执行阻止或允许动作，不再继续匹配后续规则。</span>
<span class="line"><span class="token number">3</span>. 若所有规则均未匹配，则继续向下匹配，直到匹配默认规则。</span>
<span class="line"><span class="token number">4</span>. 默认规则在该链的所有规则执行完毕后才会执行。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、四表五链" tabindex="-1"><a class="header-anchor" href="#五、四表五链"><span>五、四表五链</span></a></h2><h3 id="四表-tables" tabindex="-1"><a class="header-anchor" href="#四表-tables"><span>四表（Tables）</span></a></h3><table><thead><tr><th style="text-align:left;">表名</th><th style="text-align:left;">作用</th></tr></thead><tbody><tr><td style="text-align:left;">filter</td><td style="text-align:left;">数据包过滤（默认表）</td></tr><tr><td style="text-align:left;">nat</td><td style="text-align:left;">网络地址转换</td></tr><tr><td style="text-align:left;">mangle</td><td style="text-align:left;">修改数据包内容（如 TTL、TOS）</td></tr><tr><td style="text-align:left;">raw</td><td style="text-align:left;">数据包跟踪前处理</td></tr></tbody></table><h3 id="五链-chains" tabindex="-1"><a class="header-anchor" href="#五链-chains"><span>五链（Chains）</span></a></h3><table><thead><tr><th style="text-align:left;">链名</th><th style="text-align:left;">作用</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>INPUT</strong></td><td style="text-align:left;">进入本机的数据包</td></tr><tr><td style="text-align:left;"><strong>OUTPUT</strong></td><td style="text-align:left;">从本机发出的数据包</td></tr><tr><td style="text-align:left;"><strong>FORWARD</strong></td><td style="text-align:left;">经过本机转发的数据包</td></tr><tr><td style="text-align:left;"><strong>PREROUTING</strong></td><td style="text-align:left;">路由前处理（主要用于 DNAT）</td></tr><tr><td style="text-align:left;"><strong>POSTROUTING</strong></td><td style="text-align:left;">路由后处理（主要用于 SNAT）</td></tr></tbody></table><h3 id="什么是-netfilter" tabindex="-1"><a class="header-anchor" href="#什么是-netfilter"><span>什么是 netfilter？</span></a></h3><p>netfilter 是 Linux 内核中的一个软件框架，用于管理网络数据包。它不仅具备网络地址转换功能，还支持数据包内容修改、数据包过滤等防火墙功能。netfilter 定义了五个链来决定数据包的流向与处理方式：</p><ul><li><strong>PREROUTING</strong> 链 —— 路由前</li><li><strong>INPUT</strong> 链 —— 本地上送</li><li><strong>OUTPUT</strong> 链 —— 本地发送</li><li><strong>FORWARD</strong> 链 —— 转发</li><li><strong>POSTROUTING</strong> 链 —— 路由后</li></ul><p>这些链决定了数据包是被接受（ACCEPT）还是丢弃（DROP）。</p><h3 id="表与链的对应关系" tabindex="-1"><a class="header-anchor" href="#表与链的对应关系"><span>表与链的对应关系</span></a></h3><table><thead><tr><th style="text-align:left;">表</th><th style="text-align:left;">可用的链</th></tr></thead><tbody><tr><td style="text-align:left;">filter</td><td style="text-align:left;">INPUT、OUTPUT、FORWARD</td></tr><tr><td style="text-align:left;">nat</td><td style="text-align:left;">PREROUTING、OUTPUT、POSTROUTING</td></tr><tr><td style="text-align:left;">mangle</td><td style="text-align:left;">所有五链</td></tr><tr><td style="text-align:left;">raw</td><td style="text-align:left;">PREROUTING、OUTPUT</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">链的执行时机与用途：</span>
<span class="line"></span>
<span class="line"><span class="token number">1</span>. PREROUTING 链</span>
<span class="line">   时机：数据包进入网卡，路由决策之前</span>
<span class="line">   用途：DNAT、连接跟踪、数据包标记</span>
<span class="line">   适用表：raw, mangle, nat</span>
<span class="line"></span>
<span class="line"><span class="token number">2</span>. INPUT 链</span>
<span class="line">   时机：路由决策后，目标为本机</span>
<span class="line">   用途：过滤进入本机的流量</span>
<span class="line">   适用表：mangle, filter</span>
<span class="line"></span>
<span class="line"><span class="token number">3</span>. FORWARD 链</span>
<span class="line">   时机：路由决策后，需要转发的数据包</span>
<span class="line">   用途：控制经过本机转发的流量</span>
<span class="line">   适用表：mangle, filter</span>
<span class="line"></span>
<span class="line"><span class="token number">4</span>. OUTPUT 链</span>
<span class="line">   时机：本机进程发出的数据包</span>
<span class="line">   用途：控制本机发出的流量</span>
<span class="line">   适用表：raw, mangle, nat, filter</span>
<span class="line"></span>
<span class="line"><span class="token number">5</span>. POSTROUTING 链</span>
<span class="line">   时机：所有数据包发送到网卡之前</span>
<span class="line">   用途：SNAT、伪装（Masquerading）</span>
<span class="line">   适用表：mangle, nat</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、数据包在防火墙中的完整历程" tabindex="-1"><a class="header-anchor" href="#六、数据包在防火墙中的完整历程"><span>六、数据包在防火墙中的完整历程</span></a></h2><h3 id="_1-数据包流向图" tabindex="-1"><a class="header-anchor" href="#_1-数据包流向图"><span>1. 数据包流向图</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">外部网络 → 网卡接收 → PREROUTING链 → 路由决策</span>
<span class="line">                                       ↓</span>
<span class="line">                          目标为本机？     目标为其他主机？</span>
<span class="line">                                ↓                  ↓</span>
<span class="line">                           INPUT链             FORWARD链</span>
<span class="line">                                ↓                  ↓</span>
<span class="line">                         本地进程处理         POSTROUTING链</span>
<span class="line">                                ↓                  ↓</span>
<span class="line">                          OUTPUT链               网卡发送</span>
<span class="line">                                ↓                  ↓</span>
<span class="line">                          POSTROUTING链         外部网络</span>
<span class="line">                                ↓</span>
<span class="line">                            网卡发送</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">入站数据包：数据包进入网卡后，先经 PREROUTING 链。若目标为本机，则进入 INPUT 链，最终交给本机应用程序处理。</span>
<span class="line"></span>
<span class="line">出站数据包：本机生成的数据包先经 OUTPUT 链，路由后进入 POSTROUTING 链，最后发送到目标。</span>
<span class="line"></span>
<span class="line">转发数据包：非本机目标的数据包经 PREROUTING 链后，进入 FORWARD 链，最后通过 POSTROUTING 链发送到目标。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-详细流程解析" tabindex="-1"><a class="header-anchor" href="#_2-详细流程解析"><span>2. 详细流程解析</span></a></h3><h4 id="阶段一-数据包进入-ingress" tabindex="-1"><a class="header-anchor" href="#阶段一-数据包进入-ingress"><span>阶段一：数据包进入（Ingress）</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">1. 数据包到达网卡</span>
<span class="line">2. 经过 PREROUTING 链（所有表均可处理）</span>
<span class="line">   - raw 表：决定是否进行连接跟踪</span>
<span class="line">   - mangle 表：修改数据包（如 TTL）</span>
<span class="line">   - nat 表：DNAT（目标地址转换）</span>
<span class="line">3. 路由决策：判断数据包是发给本机还是需要转发</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="阶段二-本地处理-local-process" tabindex="-1"><a class="header-anchor" href="#阶段二-本地处理-local-process"><span>阶段二：本地处理（Local Process）</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">如果目标为本机：</span>
<span class="line">1. 经过 INPUT 链</span>
<span class="line">   - mangle 表：修改数据包</span>
<span class="line">   - filter 表：决定是否接受（ACCEPT/DROP/REJECT）</span>
<span class="line">2. 交给上层协议栈（TCP/UDP）</span>
<span class="line">3. 应用程序接收处理</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="阶段三-转发处理-forward" tabindex="-1"><a class="header-anchor" href="#阶段三-转发处理-forward"><span>阶段三：转发处理（Forward）</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">如果需要转发到其他主机：</span>
<span class="line">1. 经过 FORWARD 链</span>
<span class="line">   - mangle 表：修改数据包</span>
<span class="line">   - filter 表：决定是否允许转发</span>
<span class="line">2. 继续流向 POSTROUTING 链</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="阶段四-数据包发出-egress" tabindex="-1"><a class="header-anchor" href="#阶段四-数据包发出-egress"><span>阶段四：数据包发出（Egress）</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">本地产生或转发数据包的出口：</span>
<span class="line">1. 本地进程产生数据包 → OUTPUT 链</span>
<span class="line">   - raw 表：连接跟踪处理</span>
<span class="line">   - mangle 表：修改数据包</span>
<span class="line">   - nat 表：处理本地产生的数据包的 NAT</span>
<span class="line">   - filter 表：决定是否允许发出</span>
<span class="line"></span>
<span class="line">2. 经过 POSTROUTING 链（所有出口数据包必经）</span>
<span class="line">   - mangle 表：最后修改机会</span>
<span class="line">   - nat 表：SNAT（源地址转换）</span>
<span class="line">3. 发送到网卡 → 外部网络</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="匹配规则后的动作" tabindex="-1"><a class="header-anchor" href="#匹配规则后的动作"><span>匹配规则后的动作</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">防火墙对匹配规则的流量执行以下动作之一：</span>
<span class="line"></span>
<span class="line">ACCEPT  允许数据包通过</span>
<span class="line">REJECT  拒绝数据包通过，并返回拒绝响应</span>
<span class="line">DROP    直接丢弃数据包，不回应</span>
<span class="line">LOG     在 /var/log/message 中记录日志，然后传递给下一条规则</span>
<span class="line">SNAT    源地址转换，用于内网共享公网 IP</span>
<span class="line">DNAT    目标地址转换</span>
<span class="line">REDIRECT 在本机做端口映射</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="开启内核转发" tabindex="-1"><a class="header-anchor" href="#开启内核转发"><span>开启内核转发</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 临时开启</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token number">1</span> <span class="token operator">&gt;</span> /proc/sys/net/ipv4/ip_forward</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 永久开启</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;net.ipv4.ip_forward = 1&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/sysctl.conf</span>
<span class="line"><span class="token function">sysctl</span> <span class="token parameter variable">-p</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、iptables-命令实战" tabindex="-1"><a class="header-anchor" href="#七、iptables-命令实战"><span>七、iptables 命令实战</span></a></h2><h3 id="_1-基本命令与参数" tabindex="-1"><a class="header-anchor" href="#_1-基本命令与参数"><span>1. 基本命令与参数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">常用参数说明：</span>
<span class="line"><span class="token parameter variable">-L</span>  显示所选链的所有规则</span>
<span class="line"><span class="token parameter variable">-n</span>  以数字形式显示 IP 和端口</span>
<span class="line"><span class="token parameter variable">-t</span>  指定表（如 filter、nat）</span>
<span class="line"><span class="token parameter variable">-A</span>  在链末尾追加规则</span>
<span class="line"><span class="token parameter variable">-I</span>  在链开头插入规则</span>
<span class="line"><span class="token parameter variable">-D</span>  删除规则</span>
<span class="line"><span class="token parameter variable">-F</span>  清空所有规则</span>
<span class="line"><span class="token parameter variable">-p</span>  指定协议（tcp、udp、icmp、all）</span>
<span class="line"><span class="token parameter variable">--dport</span>  目标端口</span>
<span class="line"><span class="token parameter variable">--sport</span>  源端口</span>
<span class="line"><span class="token parameter variable">-s</span>  源 IP</span>
<span class="line"><span class="token parameter variable">-d</span>  目标 IP</span>
<span class="line"><span class="token parameter variable">-m</span>  指定模块（如 multiport）</span>
<span class="line"><span class="token parameter variable">-i</span>  指定输入网卡</span>
<span class="line"><span class="token parameter variable">-o</span>  指定输出网卡</span>
<span class="line"><span class="token parameter variable">-j</span>  执行动作（ACCEPT、DROP、REJECT 等）</span>
<span class="line"><span class="token parameter variable">-X</span>  删除用户自定义链</span>
<span class="line"><span class="token parameter variable">-Z</span>  计数器清零</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查看规则" tabindex="-1"><a class="header-anchor" href="#查看规则"><span>查看规则</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">iptables <span class="token parameter variable">-nL</span>               <span class="token comment"># 查看所有链规则，数字格式显示</span></span>
<span class="line">iptables <span class="token parameter variable">-nL</span> --line-numbers <span class="token comment"># 显示规则及行号</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="清空规则" tabindex="-1"><a class="header-anchor" href="#清空规则"><span>清空规则</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">iptables <span class="token parameter variable">-F</span>   <span class="token comment"># 删除所有规则</span></span>
<span class="line">iptables <span class="token parameter variable">-X</span>   <span class="token comment"># 删除用户自定义链</span></span>
<span class="line">iptables <span class="token parameter variable">-Z</span>   <span class="token comment"># 计数器清零</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="设置默认策略" tabindex="-1"><a class="header-anchor" href="#设置默认策略"><span>设置默认策略</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">iptables <span class="token parameter variable">-P</span> INPUT ACCEPT   <span class="token comment"># 设置 INPUT 链默认允许</span></span>
<span class="line">iptables <span class="token parameter variable">-P</span> INPUT DROP     <span class="token comment"># 设置 INPUT 链默认拒绝</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-实战规则配置" tabindex="-1"><a class="header-anchor" href="#_2-实战规则配置"><span>2. 实战规则配置</span></a></h3><h4 id="禁止特定-ip-访问" tabindex="-1"><a class="header-anchor" href="#禁止特定-ip-访问"><span>禁止特定 IP 访问</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 禁止 10.0.0.51 ping 本机</span></span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-p</span> icmp <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.51 <span class="token parameter variable">-j</span> DROP</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 禁止 172.16.1.0/24 网段访问 22 端口</span></span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-s</span> <span class="token number">172.16</span>.1.0/24 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">22</span> <span class="token parameter variable">-j</span> DROP</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="端口控制" tabindex="-1"><a class="header-anchor" href="#端口控制"><span>端口控制</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 禁止特定 IP 访问 22 端口</span></span>
<span class="line">iptables <span class="token parameter variable">-I</span> INPUT <span class="token parameter variable">-s</span> <span class="token number">172.16</span>.1.51 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">22</span> <span class="token parameter variable">-j</span> DROP</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 multiport 模块控制多个端口</span></span>
<span class="line">iptables <span class="token parameter variable">-I</span> INPUT <span class="token parameter variable">-m</span> multiport <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.52 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">80,22</span> <span class="token parameter variable">-j</span> DROP</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="网卡限制" tabindex="-1"><a class="header-anchor" href="#网卡限制"><span>网卡限制</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 禁止 172.16.1.51 通过 eth1 访问 80 端口</span></span>
<span class="line">iptables <span class="token parameter variable">-I</span> INPUT <span class="token parameter variable">-i</span> eth1 <span class="token parameter variable">-s</span> <span class="token number">172.16</span>.1.51 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">80</span> <span class="token parameter variable">-j</span> DROP</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 禁止任何 IP 通过 eth0 访问 22 端口</span></span>
<span class="line">iptables <span class="token parameter variable">-I</span> INPUT <span class="token parameter variable">-i</span> eth0 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">22</span> <span class="token parameter variable">-j</span> DROP</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 允许所有 IP 通过 eth0 访问 80 端口</span></span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-i</span> eth0 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">80</span> <span class="token parameter variable">-j</span> ACCEPT</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="取反符号使用" tabindex="-1"><a class="header-anchor" href="#取反符号使用"><span>取反符号使用</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 只允许 172.16.1.0/24 网段访问 80 端口，其他一律拒绝</span></span>
<span class="line">iptables <span class="token parameter variable">-I</span> INPUT <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token number">172.16</span>.1.0/24 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">80</span> <span class="token parameter variable">-j</span> DROP</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="跳板机配置" tabindex="-1"><a class="header-anchor" href="#跳板机配置"><span>跳板机配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 只允许跳板机 10.0.0.51 访问 SSH</span></span>
<span class="line">iptables <span class="token parameter variable">-I</span> INPUT <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.51 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">22</span> <span class="token parameter variable">-j</span> DROP</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-高级应用场景" tabindex="-1"><a class="header-anchor" href="#_3-高级应用场景"><span>3. 高级应用场景</span></a></h3><h4 id="web-服务器防火墙配置" tabindex="-1"><a class="header-anchor" href="#web-服务器防火墙配置"><span>Web 服务器防火墙配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 清空现有规则</span></span>
<span class="line">iptables <span class="token parameter variable">-F</span></span>
<span class="line">iptables <span class="token parameter variable">-X</span></span>
<span class="line">iptables <span class="token parameter variable">-Z</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 允许 HTTP/HTTPS</span></span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">-m</span> multiport <span class="token parameter variable">--dport</span> <span class="token number">80,443</span> <span class="token parameter variable">-j</span> ACCEPT</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 允许 SSH</span></span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">22</span> <span class="token parameter variable">-j</span> ACCEPT</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 允许内网访问</span></span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.0/24 <span class="token parameter variable">-j</span> ACCEPT</span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-s</span> <span class="token number">172.16</span>.1.0/24 <span class="token parameter variable">-j</span> ACCEPT</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 允许本地回环</span></span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-i</span> lo <span class="token parameter variable">-j</span> ACCEPT</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置默认策略</span></span>
<span class="line">iptables <span class="token parameter variable">-P</span> INPUT DROP</span>
<span class="line">iptables <span class="token parameter variable">-P</span> FORWARD DROP</span>
<span class="line">iptables <span class="token parameter variable">-P</span> OUTPUT ACCEPT</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="snat-共享上网" tabindex="-1"><a class="header-anchor" href="#snat-共享上网"><span>SNAT 共享上网</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 开启 IP 转发</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;net.ipv4.ip_forward = 1&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/sysctl.conf</span>
<span class="line"><span class="token function">sysctl</span> <span class="token parameter variable">-p</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置 SNAT，内网 172.16.1.0/24 通过 10.0.0.7 上网</span></span>
<span class="line">iptables <span class="token parameter variable">-t</span> nat <span class="token parameter variable">-A</span> POSTROUTING <span class="token parameter variable">-s</span> <span class="token number">172.16</span>.1.0/24 <span class="token parameter variable">-j</span> SNAT --to-source <span class="token number">10.0</span>.0.7</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 内网机器设置网关为 172.16.1.7</span></span>
<span class="line">route <span class="token function">add</span> default gw <span class="token number">172.16</span>.1.7</span>
<span class="line"><span class="token comment"># 或修改网卡配置：GATEWAY=172.16.1.7</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="dnat-端口映射" tabindex="-1"><a class="header-anchor" href="#dnat-端口映射"><span>DNAT 端口映射</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 将外网 20022 端口映射到内网 172.16.1.61 的 22 端口</span></span>
<span class="line">iptables <span class="token parameter variable">-t</span> nat <span class="token parameter variable">-A</span> PREROUTING <span class="token parameter variable">-d</span> <span class="token number">10.0</span>.0.7 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">20022</span> <span class="token parameter variable">-j</span> DNAT --to-destination <span class="token number">172.16</span>.1.61:22</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将 17788 端口映射到本机 80 端口</span></span>
<span class="line">iptables <span class="token parameter variable">-t</span> nat <span class="token parameter variable">-A</span> PREROUTING <span class="token parameter variable">-d</span> <span class="token number">10.0</span>.0.7 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">17788</span> <span class="token parameter variable">-j</span> DNAT --to-destination <span class="token number">10.0</span>.0.7:80</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除映射规则</span></span>
<span class="line">iptables <span class="token parameter variable">-t</span> nat <span class="token parameter variable">-D</span> PREROUTING <span class="token parameter variable">-d</span> <span class="token number">10.0</span>.0.7 <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">17788</span> <span class="token parameter variable">-j</span> DNAT --to-destination <span class="token number">10.0</span>.0.7:80</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-规则管理" tabindex="-1"><a class="header-anchor" href="#_4-规则管理"><span>4. 规则管理</span></a></h3><h4 id="保存与恢复规则" tabindex="-1"><a class="header-anchor" href="#保存与恢复规则"><span>保存与恢复规则</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 保存规则到文件</span></span>
<span class="line">iptables-save <span class="token operator">&gt;</span> /opt/iptables_rules.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从文件恢复规则</span></span>
<span class="line">iptables-restore <span class="token operator">&lt;</span> /opt/iptables_rules.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="服务管理" tabindex="-1"><a class="header-anchor" href="#服务管理"><span>服务管理</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 禁用 firewalld</span></span>
<span class="line">systemctl stop firewalld</span>
<span class="line">systemctl disable firewalld</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启用 iptables 服务</span></span>
<span class="line">yum <span class="token function">install</span> iptables-services <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start iptables</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> iptables</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="加载内核模块" tabindex="-1"><a class="header-anchor" href="#加载内核模块"><span>加载内核模块</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">modprobe ip_tables</span>
<span class="line">modprobe iptable_filter</span>
<span class="line">modprobe iptable_nat</span>
<span class="line">modprobe ip_conntrack</span>
<span class="line">modprobe ip_conntrack_ftp</span>
<span class="line">modprobe ip_nat_ftp</span>
<span class="line">modprobe ipt_state</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、总结" tabindex="-1"><a class="header-anchor" href="#八、总结"><span>八、总结</span></a></h2><p>iptables是Linux系统上强大的防火墙工具，通过配置四表五链的规则，可以实现数据包过滤、网络地址转换等功能。掌握iptables的工作原理和常用命令，可以有效地保护服务器安全，实现网络访问控制。</p><blockquote><p>下一步：学习更多运维技术，构建完整的运维知识体系。</p></blockquote>`,87)])])}const c=a(i,[["render",p]]),d=JSON.parse('{"path":"/03-%E7%BD%91%E7%BB%9C%E6%9C%8D%E5%8A%A1/01-%E9%98%B2%E7%81%AB%E5%A2%99%E4%B8%8E%E5%AE%89%E5%85%A8/iptables.html","title":"iptables 原理与命令指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"03-网络服务/01-防火墙与安全/iptables.md"}');export{c as comp,d as data};
