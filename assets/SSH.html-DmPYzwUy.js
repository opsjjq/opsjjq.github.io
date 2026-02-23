import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function t(d,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="一、ssh-概述与基础原理" tabindex="-1"><a class="header-anchor" href="#一、ssh-概述与基础原理"><span>一、SSH 概述与基础原理</span></a></h2><h3 id="_1-ssh-是什么" tabindex="-1"><a class="header-anchor" href="#_1-ssh-是什么"><span>1. SSH 是什么？</span></a></h3><ul><li><strong>SSH (Secure Shell)</strong>：安全外壳协议，用于计算机之间的加密登录</li><li><strong>协议特点</strong>：所有传输数据加密，即使被截获也无法解密</li><li><strong>默认端口</strong>：22 (TCP协议)</li></ul><h3 id="_2-ssh-客户端工具" tabindex="-1"><a class="header-anchor" href="#_2-ssh-客户端工具"><span>2. SSH 客户端工具</span></a></h3><table><thead><tr><th style="text-align:left;">分类</th><th style="text-align:left;">工具</th></tr></thead><tbody><tr><td style="text-align:left;">Windows</td><td style="text-align:left;">MobaXterm、Xshell、Termius、PuTTY、Finalshell</td></tr><tr><td style="text-align:left;">Linux</td><td style="text-align:left;">自带 <code>ssh</code> 命令</td></tr><tr><td style="text-align:left;">跨平台</td><td style="text-align:left;">Windows Terminal</td></tr></tbody></table><h3 id="_3-为什么需要-ssh" tabindex="-1"><a class="header-anchor" href="#_3-为什么需要-ssh"><span>3. 为什么需要 SSH？</span></a></h3><table><thead><tr><th style="text-align:left;">协议</th><th style="text-align:left;">安全性</th><th style="text-align:left;">数据加密</th><th style="text-align:left;">推荐度</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>SSH</strong></td><td style="text-align:left;">高</td><td style="text-align:left;">全程加密</td><td style="text-align:left;">★★★★★</td></tr><tr><td style="text-align:left;">Telnet</td><td style="text-align:left;">低</td><td style="text-align:left;">明文传输</td><td style="text-align:left;">☆☆☆☆☆</td></tr><tr><td style="text-align:left;">FTP</td><td style="text-align:left;">低</td><td style="text-align:left;">明文传输</td><td style="text-align:left;">☆☆☆☆☆</td></tr></tbody></table><hr><h2 id="二、telnet-不安全登录演示" tabindex="-1"><a class="header-anchor" href="#二、telnet-不安全登录演示"><span>二、Telnet 不安全登录演示</span></a></h2><h3 id="_1-telnet-服务端配置" tabindex="-1"><a class="header-anchor" href="#_1-telnet-服务端配置"><span>1. Telnet 服务端配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token function">install</span> telnet-server telnet <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start telnet.socket</span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> :23</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-telnet-客户端连接" tabindex="-1"><a class="header-anchor" href="#_2-telnet-客户端连接"><span>2. Telnet 客户端连接</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">telnet <span class="token number">10.0</span>.0.61</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="_3-安全风险演示" tabindex="-1"><a class="header-anchor" href="#_3-安全风险演示"><span>3. 安全风险演示</span></a></h3><p>使用 Wireshark 抓包工具可轻易捕获：</p><ul><li>用户名、密码明文</li><li>所有操作命令明文</li><li>传输数据无加密</li></ul><hr><h2 id="三、ssh-密码认证原理" tabindex="-1"><a class="header-anchor" href="#三、ssh-密码认证原理"><span>三、SSH 密码认证原理</span></a></h2><h3 id="_1-加密算法对比" tabindex="-1"><a class="header-anchor" href="#_1-加密算法对比"><span>1. 加密算法对比</span></a></h3><table><thead><tr><th style="text-align:left;">算法类型</th><th style="text-align:left;">特点</th><th style="text-align:left;">优点</th><th style="text-align:left;">缺点</th><th style="text-align:left;">应用场景</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>对称加密 (DES)</strong></td><td style="text-align:left;">加密解密使用同一密钥</td><td style="text-align:left;">速度快、效率高</td><td style="text-align:left;">密钥分发困难，易泄露</td><td style="text-align:left;">本地数据加密</td></tr><tr><td style="text-align:left;"><strong>非对称加密 (RSA)</strong></td><td style="text-align:left;">公钥加密，私钥解密</td><td style="text-align:left;">安全性高，无需传输私钥</td><td style="text-align:left;">速度慢，计算复杂</td><td style="text-align:left;">SSH认证、SSL证书</td></tr></tbody></table><h3 id="_2-ssh-密码认证流程" tabindex="-1"><a class="header-anchor" href="#_2-ssh-密码认证流程"><span>2. SSH 密码认证流程</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">客户端连接请求 → 服务端</span>
<span class="line">             ← 发送公钥 ←</span>
<span class="line">客户端使用公钥加密密码 → </span>
<span class="line">             ← 使用私钥解密验证 ←</span>
<span class="line">             ← 登录成功/失败 ←</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-关键文件与命令" tabindex="-1"><a class="header-anchor" href="#_3-关键文件与命令"><span>3. 关键文件与命令</span></a></h3><h4 id="服务端公钥文件" tabindex="-1"><a class="header-anchor" href="#服务端公钥文件"><span>服务端公钥文件</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">ls</span> /etc/ssh/ssh_host_*</span>
<span class="line"><span class="token comment"># ssh_host_ecdsa_key      # 私钥</span></span>
<span class="line"><span class="token comment"># ssh_host_ecdsa_key.pub  # 公钥</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="客户端已知主机记录" tabindex="-1"><a class="header-anchor" href="#客户端已知主机记录"><span>客户端已知主机记录</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> ~/.ssh/known_hosts</span>
<span class="line"><span class="token comment"># 格式：IP 算法 公钥</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="获取远程主机公钥" tabindex="-1"><a class="header-anchor" href="#获取远程主机公钥"><span>获取远程主机公钥</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">ssh-keyscan <span class="token number">10.0</span>.0.61</span>
<span class="line"><span class="token function">cat</span> /etc/ssh/ssh_host_ecdsa_key.pub</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-主机指纹验证" tabindex="-1"><a class="header-anchor" href="#_4-主机指纹验证"><span>4. 主机指纹验证</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">ssh-keygen <span class="token parameter variable">-E</span> SHA256 <span class="token parameter variable">-lf</span> /etc/ssh/ssh_host_ecdsa_key.pub</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>首次连接时验证提示：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">The authenticity of host &#39;10.0.0.61 (10.0.0.61)&#39; can&#39;t be established.</span>
<span class="line">ECDSA key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxx</span>
<span class="line">Are you sure you want to continue connecting (yes/no)?</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、ssh-服务部署与安全配置" tabindex="-1"><a class="header-anchor" href="#四、ssh-服务部署与安全配置"><span>四、SSH 服务部署与安全配置</span></a></h2><h3 id="_1-基础安装与检查" tabindex="-1"><a class="header-anchor" href="#_1-基础安装与检查"><span>1. 基础安装与检查</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> openssh openssh-server</span>
<span class="line">yum <span class="token function">install</span> openssh-server openssh <span class="token parameter variable">-y</span></span>
<span class="line">systemctl status sshd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-安全配置建议" tabindex="-1"><a class="header-anchor" href="#_2-安全配置建议"><span>2. 安全配置建议</span></a></h3><h4 id="配置文件-etc-ssh-sshd-config" tabindex="-1"><a class="header-anchor" href="#配置文件-etc-ssh-sshd-config"><span>配置文件：<code>/etc/ssh/sshd_config</code></span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">Port <span class="token number">22999</span>                          <span class="token comment"># 1. 修改默认端口（防止暴力扫描）</span></span>
<span class="line">PermitRootLogin no                  <span class="token comment"># 2. 禁用 root 直接登录（重要！）</span></span>
<span class="line">PubkeyAuthentication <span class="token function">yes</span>            <span class="token comment"># 3. 启用公钥认证</span></span>
<span class="line">PasswordAuthentication no            <span class="token comment"># 4. 禁用密码认证</span></span>
<span class="line">AllowUsers bob01 admin@10.0.0.0/24  <span class="token comment"># 5. 限制用户访问</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建普通用户用于登录" tabindex="-1"><a class="header-anchor" href="#创建普通用户用于登录"><span>创建普通用户用于登录</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">useradd</span> bob01</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;随机密码&quot;</span> <span class="token operator">|</span> <span class="token function">passwd</span> <span class="token parameter variable">--stdin</span> bob01</span>
<span class="line">pwgen <span class="token parameter variable">-s</span> <span class="token number">12</span> <span class="token number">1</span>  <span class="token comment"># 生成 12 位随机密码</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-服务管理" tabindex="-1"><a class="header-anchor" href="#_3-服务管理"><span>3. 服务管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">systemctl restart sshd              <span class="token comment"># 重启服务使配置生效</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> sshd         <span class="token comment"># 查看新端口监听</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> sshd              <span class="token comment"># 设置开机自启</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-恢复默认配置" tabindex="-1"><a class="header-anchor" href="#_4-恢复默认配置"><span>4. 恢复默认配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i.bak</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token string">&#39;s/^Port 22999/Port 22/&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token string">&#39;s/^PermitRootLogin no/PermitRootLogin yes/&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">  /etc/ssh/sshd_config</span>
<span class="line">systemctl restart sshd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、ssh-密钥认证与免密登录" tabindex="-1"><a class="header-anchor" href="#五、ssh-密钥认证与免密登录"><span>五、SSH 密钥认证与免密登录</span></a></h2><h3 id="_1-生成密钥对" tabindex="-1"><a class="header-anchor" href="#_1-生成密钥对"><span>1. 生成密钥对</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-N</span> <span class="token string">&#39;&#39;</span> <span class="token parameter variable">-f</span> ~/.ssh/id_rsa</span>
<span class="line"><span class="token comment"># -t rsa        # 指定算法</span></span>
<span class="line"><span class="token comment"># -N &#39;&#39;         # 空密码</span></span>
<span class="line"><span class="token comment"># -f ~/.ssh/id_rsa  # 指定文件路径</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-分发公钥" tabindex="-1"><a class="header-anchor" href="#_2-分发公钥"><span>2. 分发公钥</span></a></h3><h4 id="方法一-使用-ssh-copy-id" tabindex="-1"><a class="header-anchor" href="#方法一-使用-ssh-copy-id"><span>方法一：使用 ssh-copy-id</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">ssh-copy-id root@10.0.0.7</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="方法二-手动分发" tabindex="-1"><a class="header-anchor" href="#方法二-手动分发"><span>方法二：手动分发</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">ssh</span> root@10.0.0.7 <span class="token string">&quot;mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh&quot;</span></span>
<span class="line"><span class="token function">cat</span> ~/.ssh/id_rsa.pub <span class="token operator">|</span> <span class="token function">ssh</span> root@10.0.0.7 <span class="token string">&quot;cat &gt;&gt; ~/.ssh/authorized_keys&quot;</span></span>
<span class="line"><span class="token function">ssh</span> root@10.0.0.7 <span class="token string">&quot;chmod 600 ~/.ssh/authorized_keys&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-验证免密登录" tabindex="-1"><a class="header-anchor" href="#_3-验证免密登录"><span>3. 验证免密登录</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">ssh</span> root@10.0.0.7 <span class="token string">&quot;hostname &amp;&amp; uptime&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h2 id="六、ssh-批量分发与管理" tabindex="-1"><a class="header-anchor" href="#六、ssh-批量分发与管理"><span>六、SSH 批量分发与管理</span></a></h2><h3 id="_1-批量生成密钥" tabindex="-1"><a class="header-anchor" href="#_1-批量生成密钥"><span>1. 批量生成密钥</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> <span class="token number">7</span> <span class="token number">8</span> <span class="token number">41</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">  ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-N</span> <span class="token string">&#39;&#39;</span> <span class="token parameter variable">-f</span> ~/.ssh/id_rsa_<span class="token variable">\${i}</span> <span class="token parameter variable">-q</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-批量分发公钥" tabindex="-1"><a class="header-anchor" href="#_2-批量分发公钥"><span>2. 批量分发公钥</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> <span class="token number">7</span> <span class="token number">8</span> <span class="token number">41</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">  ssh-copy-id <span class="token parameter variable">-i</span> ~/.ssh/id_rsa_<span class="token variable">\${i}</span>.pub root@10.0.0.<span class="token variable">\${i}</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-ssh-批量执行命令" tabindex="-1"><a class="header-anchor" href="#_3-ssh-批量执行命令"><span>3. SSH 批量执行命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> <span class="token number">7</span> <span class="token number">8</span> <span class="token number">41</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">  <span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 10.0.0.<span class="token variable">\${i}</span> ===&quot;</span></span>
<span class="line">  <span class="token function">ssh</span> root@10.0.0.<span class="token variable">\${i}</span> <span class="token string">&quot;hostnamectl | grep hostname&quot;</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、ssh-配置文件详解" tabindex="-1"><a class="header-anchor" href="#七、ssh-配置文件详解"><span>七、SSH 配置文件详解</span></a></h2><h3 id="_1-服务端配置" tabindex="-1"><a class="header-anchor" href="#_1-服务端配置"><span>1. 服务端配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">vim</span> /etc/ssh/sshd_config</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><table><thead><tr><th style="text-align:left;">配置项</th><th style="text-align:left;">默认值</th><th style="text-align:left;">推荐值</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">Port</td><td style="text-align:left;">22</td><td style="text-align:left;">22999</td><td style="text-align:left;">修改默认端口</td></tr><tr><td style="text-align:left;">PermitRootLogin</td><td style="text-align:left;">yes</td><td style="text-align:left;">no</td><td style="text-align:left;">禁止 root 登录</td></tr><tr><td style="text-align:left;">PubkeyAuthentication</td><td style="text-align:left;">yes</td><td style="text-align:left;">yes</td><td style="text-align:left;">启用公钥认证</td></tr><tr><td style="text-align:left;">PasswordAuthentication</td><td style="text-align:left;">yes</td><td style="text-align:left;">no</td><td style="text-align:left;">禁用密码认证</td></tr><tr><td style="text-align:left;">MaxAuthTries</td><td style="text-align:left;">6</td><td style="text-align:left;">3</td><td style="text-align:left;">最大认证次数</td></tr><tr><td style="text-align:left;">ClientAliveInterval</td><td style="text-align:left;">0</td><td style="text-align:left;">300</td><td style="text-align:left;">客户端存活检测</td></tr><tr><td style="text-align:left;">ClientAliveCountMax</td><td style="text-align:left;">3</td><td style="text-align:left;">2</td><td style="text-align:left;">存活检测次数</td></tr></tbody></table><h3 id="_2-客户端配置" tabindex="-1"><a class="header-anchor" href="#_2-客户端配置"><span>2. 客户端配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">vim</span> ~/.ssh/config</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-ssh line-numbers-mode" data-highlighter="prismjs" data-ext="ssh"><pre><code class="language-ssh"><span class="line">Host *</span>
<span class="line">    ServerAliveInterval 60</span>
<span class="line">    ServerAliveCountMax 3</span>
<span class="line">    StrictHostKeyChecking ask</span>
<span class="line">    </span>
<span class="line">Host web*</span>
<span class="line">    HostName 10.0.0.{7,8,41}</span>
<span class="line">    User root</span>
<span class="line">    </span>
<span class="line">Host db</span>
<span class="line">    HostName 10.0.0.51</span>
<span class="line">    User mysql</span>
<span class="line">    Port 2222</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-权限要求" tabindex="-1"><a class="header-anchor" href="#_3-权限要求"><span>3. 权限要求</span></a></h3><table><thead><tr><th style="text-align:left;">文件/目录</th><th style="text-align:left;">权限要求</th></tr></thead><tbody><tr><td style="text-align:left;">~/.ssh/</td><td style="text-align:left;">700</td></tr><tr><td style="text-align:left;">~/.ssh/id_rsa</td><td style="text-align:left;">600</td></tr><tr><td style="text-align:left;">~/.ssh/id_rsa.pub</td><td style="text-align:left;">644</td></tr><tr><td style="text-align:left;">~/.ssh/authorized_keys</td><td style="text-align:left;">600</td></tr><tr><td style="text-align:left;">~/.ssh/config</td><td style="text-align:left;">600</td></tr></tbody></table><hr><h2 id="八、ssh-常见问题排查" tabindex="-1"><a class="header-anchor" href="#八、ssh-常见问题排查"><span>八、SSH 常见问题排查</span></a></h2><h3 id="_1-连接被拒绝" tabindex="-1"><a class="header-anchor" href="#_1-连接被拒绝"><span>1. 连接被拒绝</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查服务是否运行</span></span>
<span class="line">systemctl status sshd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查端口是否监听</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">ssh</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查防火墙规则</span></span>
<span class="line">firewall-cmd --list-all</span>
<span class="line">iptables <span class="token parameter variable">-L</span> <span class="token parameter variable">-n</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-密钥认证失败" tabindex="-1"><a class="header-anchor" href="#_2-密钥认证失败"><span>2. 密钥认证失败</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查权限</span></span>
<span class="line"><span class="token function">ls</span> <span class="token parameter variable">-la</span> ~/.ssh/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查服务端日志</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /var/log/secure</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 SELinux</span></span>
<span class="line">setenforce <span class="token number">0</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-连接超时" tabindex="-1"><a class="header-anchor" href="#_3-连接超时"><span>3. 连接超时</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查网络连通性</span></span>
<span class="line"><span class="token function">ping</span> <span class="token number">10.0</span>.0.7</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查路由</span></span>
<span class="line"><span class="token function">traceroute</span> <span class="token number">10.0</span>.0.7</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 DNS</span></span>
<span class="line"><span class="token function">nslookup</span> <span class="token number">10.0</span>.0.7</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="九、ssh-安全加固最佳实践" tabindex="-1"><a class="header-anchor" href="#九、ssh-安全加固最佳实践"><span>九、SSH 安全加固最佳实践</span></a></h2><h3 id="_1-网络层面" tabindex="-1"><a class="header-anchor" href="#_1-网络层面"><span>1. 网络层面</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 使用防火墙限制来源IP</span></span>
<span class="line">firewall-cmd <span class="token parameter variable">--permanent</span> --add-rich-rule<span class="token operator">=</span><span class="token string">&#39;rule family=&quot;ipv4&quot; source address=&quot;10.0.0.0/24&quot; service name=&quot;ssh&quot; accept&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 TCP Wrapper</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;sshd: 10.0.0.0/24&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/hosts.allow</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;sshd: ALL&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/hosts.deny</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-应用层面" tabindex="-1"><a class="header-anchor" href="#_2-应用层面"><span>2. 应用层面</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 限制登录时间</span></span>
<span class="line">AllowUsers admin@10.0.0.* Mon-Fri 09:00-18:00</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启用双因素认证</span></span>
<span class="line"><span class="token comment"># 安装 Google Authenticator</span></span>
<span class="line">yum <span class="token function">install</span> google-authenticator <span class="token parameter variable">-y</span></span>
<span class="line">google-authenticator</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-监控层面" tabindex="-1"><a class="header-anchor" href="#_3-监控层面"><span>3. 监控层面</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 监控失败登录</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /var/log/secure <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;Failed password&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 fail2ban 自动封禁</span></span>
<span class="line">yum <span class="token function">install</span> fail2ban <span class="token parameter variable">-y</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> fail2ban</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十、ssh-隧道与端口转发" tabindex="-1"><a class="header-anchor" href="#十、ssh-隧道与端口转发"><span>十、SSH 隧道与端口转发</span></a></h2><h3 id="_1-本地端口转发" tabindex="-1"><a class="header-anchor" href="#_1-本地端口转发"><span>1. 本地端口转发</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 将远程服务器的 3306 端口映射到本地 3307</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-L</span> <span class="token number">3307</span>:localhost:3306 root@10.0.0.51 <span class="token parameter variable">-N</span> <span class="token parameter variable">-f</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-远程端口转发" tabindex="-1"><a class="header-anchor" href="#_2-远程端口转发"><span>2. 远程端口转发</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 将内网服务器的 8080 端口映射到外网</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-R</span> <span class="token number">8080</span>:localhost:80 root@外网IP <span class="token parameter variable">-N</span> <span class="token parameter variable">-f</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-动态端口转发-socks5-代理" tabindex="-1"><a class="header-anchor" href="#_3-动态端口转发-socks5-代理"><span>3. 动态端口转发（SOCKS5 代理）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 SOCKS5 代理</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-D</span> <span class="token number">1080</span> <span class="token parameter variable">-N</span> <span class="token parameter variable">-f</span> root@10.0.0.7</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-跳板机连接" tabindex="-1"><a class="header-anchor" href="#_4-跳板机连接"><span>4. 跳板机连接</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 SSH 跳板机连接内网服务器</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-J</span> jump@10.0.0.61 root@10.0.0.51</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置 ~/.ssh/config</span></span>
<span class="line">Host internal-server</span>
<span class="line">    HostName <span class="token number">10.0</span>.0.51</span>
<span class="line">    User root</span>
<span class="line">    ProxyJump jump@10.0.0.61</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、ssh-公钥认证-免密登录" tabindex="-1"><a class="header-anchor" href="#五、ssh-公钥认证-免密登录"><span>五、SSH 公钥认证（免密登录）</span></a></h2><h3 id="_1-公钥认证原理" tabindex="-1"><a class="header-anchor" href="#_1-公钥认证原理"><span>1. 公钥认证原理</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">客户端生成密钥对 → 公钥上传至服务端 → 登录时使用私钥签名</span>
<span class="line">      ↓                           ↓</span>
<span class="line">  私钥本地保存         公钥存入authorized_keys</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-配置步骤" tabindex="-1"><a class="header-anchor" href="#_2-配置步骤"><span>2. 配置步骤</span></a></h3><h4 id="第一步-生成密钥对" tabindex="-1"><a class="header-anchor" href="#第一步-生成密钥对"><span>第一步：生成密钥对</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 客户端执行（如master-61）</span>
<span class="line">ssh-keygen -t rsa -N &#39;&#39; -f ~/.ssh/id_rsa</span>
<span class="line"></span>
<span class="line"># 查看生成的密钥</span>
<span class="line">ls ~/.ssh/</span>
<span class="line"># id_rsa      # 私钥（绝密！）</span>
<span class="line"># id_rsa.pub  # 公钥（可公开）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第二步-分发公钥到目标主机" tabindex="-1"><a class="header-anchor" href="#第二步-分发公钥到目标主机"><span>第二步：分发公钥到目标主机</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 方法1：使用ssh-copy-id（推荐）</span>
<span class="line">ssh-copy-id root@10.0.0.7</span>
<span class="line"></span>
<span class="line"># 方法2：手动复制</span>
<span class="line">cat ~/.ssh/id_rsa.pub | ssh root@10.0.0.7 \\</span>
<span class="line">  &quot;mkdir -p ~/.ssh &amp;&amp; cat &gt;&gt; ~/.ssh/authorized_keys&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第三步-验证免密登录" tabindex="-1"><a class="header-anchor" href="#第三步-验证免密登录"><span>第三步：验证免密登录</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 客户端连接目标主机（无需密码）</span>
<span class="line">ssh root@10.0.0.7</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-服务端关键文件" tabindex="-1"><a class="header-anchor" href="#_3-服务端关键文件"><span>3. 服务端关键文件</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看授权的公钥</span>
<span class="line">cat ~/.ssh/authorized_keys</span>
<span class="line"># 每行一个公钥，格式：算法 公钥内容 注释</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、ssh-高级应用" tabindex="-1"><a class="header-anchor" href="#六、ssh-高级应用"><span>六、SSH 高级应用</span></a></h2><h3 id="_1-远程执行命令" tabindex="-1"><a class="header-anchor" href="#_1-远程执行命令"><span>1. 远程执行命令</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 基本语法：ssh user@host &quot;command&quot;</span>
<span class="line"></span>
<span class="line"># 查看远程主机信息</span>
<span class="line">ssh root@10.0.0.7 &quot;hostname&quot;</span>
<span class="line">ssh root@10.0.0.7 &quot;free -m&quot;</span>
<span class="line"></span>
<span class="line"># 远程文件操作</span>
<span class="line">ssh root@10.0.0.7 &quot;touch /tmp/test.txt&quot;</span>
<span class="line"></span>
<span class="line"># 远程软件管理</span>
<span class="line">ssh root@10.0.0.7 &quot;yum install redis -y&quot;</span>
<span class="line">ssh root@10.0.7 &quot;systemctl status nginx&quot;</span>
<span class="line"></span>
<span class="line"># 执行多行命令</span>
<span class="line">ssh root@10.0.0.7 &lt;&lt; &#39;EOF&#39;</span>
<span class="line">  echo &quot;开始操作...&quot;</span>
<span class="line">  date</span>
<span class="line">  whoami</span>
<span class="line">EOF</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-批量管理多台主机" tabindex="-1"><a class="header-anchor" href="#_2-批量管理多台主机"><span>2. 批量管理多台主机</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 配置master-61免密登录多台机器</span>
<span class="line">for host in 10.0.0.7 10.0.0.8 10.0.1.31 10.0.1.41; do</span>
<span class="line">  ssh-copy-id root@$host</span>
<span class="line">done</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、ssh-安全加固实战" tabindex="-1"><a class="header-anchor" href="#七、ssh-安全加固实战"><span>七、SSH 安全加固实战</span></a></h2><h3 id="_1-强化安全配置" tabindex="-1"><a class="header-anchor" href="#_1-强化安全配置"><span>1. 强化安全配置</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 编辑SSH服务端配置</span>
<span class="line">vim /etc/ssh/sshd_config</span>
<span class="line"></span>
<span class="line"># 关键安全设置</span>
<span class="line">Port 22999                    # 修改默认端口</span>
<span class="line">PermitRootLogin no            # 禁止root直接登录</span>
<span class="line">PubkeyAuthentication yes      # 启用公钥认证</span>
<span class="line">PasswordAuthentication no     # 禁用密码认证（必须先配置公钥）</span>
<span class="line">AllowUsers bob01 admin@10.0.0.0/24  # 限制用户和IP</span>
<span class="line">MaxAuthTries 3                # 最大尝试次数</span>
<span class="line">ClientAliveInterval 300       # 客户端超时设置</span>
<span class="line">ClientAliveCountMax 2</span>
<span class="line"></span>
<span class="line"># 重启生效</span>
<span class="line">systemctl restart sshd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-防火墙限制访问" tabindex="-1"><a class="header-anchor" href="#_2-防火墙限制访问"><span>2. 防火墙限制访问</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 只允许特定IP访问SSH端口</span>
<span class="line"># 假设只允许172.16.1.61（跳板机）访问</span>
<span class="line"></span>
<span class="line"># 清除现有规则（谨慎操作）</span>
<span class="line">iptables -F</span>
<span class="line"></span>
<span class="line"># 设置默认策略</span>
<span class="line">iptables -P INPUT DROP</span>
<span class="line">iptables -P FORWARD DROP</span>
<span class="line">iptables -P OUTPUT ACCEPT</span>
<span class="line"></span>
<span class="line"># 允许本地回环</span>
<span class="line">iptables -A INPUT -i lo -j ACCEPT</span>
<span class="line">iptables -A OUTPUT -o lo -j ACCEPT</span>
<span class="line"></span>
<span class="line"># 允许已建立的连接</span>
<span class="line">iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT</span>
<span class="line"></span>
<span class="line"># 允许特定IP访问SSH端口</span>
<span class="line">iptables -A INPUT -s 172.16.1.61 -p tcp --dport 22999 -j ACCEPT</span>
<span class="line"></span>
<span class="line"># 保存规则</span>
<span class="line">service iptables save</span>
<span class="line">systemctl restart iptables</span>
<span class="line"></span>
<span class="line"># 查看规则</span>
<span class="line">iptables -L -n</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-故障排查命令" tabindex="-1"><a class="header-anchor" href="#_3-故障排查命令"><span>3. 故障排查命令</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 1. 检查服务状态</span>
<span class="line">systemctl status sshd</span>
<span class="line"></span>
<span class="line"># 2. 查看日志</span>
<span class="line">tail -f /var/log/secure</span>
<span class="line">journalctl -u sshd</span>
<span class="line"></span>
<span class="line"># 3. 测试连接（指定端口）</span>
<span class="line">ssh -v -p 22999 user@host</span>
<span class="line"># -v：详细模式，显示连接过程</span>
<span class="line"></span>
<span class="line"># 4. 检查配置文件语法</span>
<span class="line">sshd -t</span>
<span class="line"></span>
<span class="line"># 5. 临时重启服务调试</span>
<span class="line">systemctl reload sshd  # 不中断现有连接</span>
<span class="line">systemctl restart sshd # 重启服务</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-密钥管理最佳实践" tabindex="-1"><a class="header-anchor" href="#_4-密钥管理最佳实践"><span>4. 密钥管理最佳实践</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 1. 为不同服务使用不同密钥</span>
<span class="line">ssh-keygen -t rsa -f ~/.ssh/id_rsa_github -C &quot;github@email&quot;</span>
<span class="line">ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitlab -C &quot;gitlab@email&quot;</span>
<span class="line"></span>
<span class="line"># 2. 配置~/.ssh/config简化连接</span>
<span class="line">cat &gt;&gt; ~/.ssh/config &lt;&lt; EOF</span>
<span class="line">Host web7</span>
<span class="line">    HostName 10.0.0.7</span>
<span class="line">    Port 22999</span>
<span class="line">    User root</span>
<span class="line">    IdentityFile ~/.ssh/id_rsa_web7</span>
<span class="line"></span>
<span class="line">Host jump</span>
<span class="line">    HostName 172.16.1.61</span>
<span class="line">    Port 22</span>
<span class="line">    User admin</span>
<span class="line">    IdentityFile ~/.ssh/id_rsa_jump</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"># 3. 使用简化命令</span>
<span class="line">ssh web7  # 替代 ssh -p 22999 root@10.0.0.7</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、配置文件总结" tabindex="-1"><a class="header-anchor" href="#八、配置文件总结"><span>八、配置文件总结</span></a></h2><h3 id="ssh-认证涉及的关键文件" tabindex="-1"><a class="header-anchor" href="#ssh-认证涉及的关键文件"><span>SSH 认证涉及的关键文件</span></a></h3><h4 id="服务端-etc-ssh" tabindex="-1"><a class="header-anchor" href="#服务端-etc-ssh"><span>服务端 (<code>/etc/ssh/</code>)</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">sshd_config           # SSH服务主配置文件</span>
<span class="line">ssh_host_*_key        # 主机私钥（保密）</span>
<span class="line">ssh_host_*_key.pub    # 主机公钥（公开）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="客户端-ssh" tabindex="-1"><a class="header-anchor" href="#客户端-ssh"><span>客户端 (<code>~/.ssh/</code>)</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">known_hosts           # 记录已验证的服务端公钥</span>
<span class="line">id_rsa                # 客户端私钥（绝密！）</span>
<span class="line">id_rsa.pub            # 客户端公钥（可分发）</span>
<span class="line">authorized_keys       # 存储允许登录的公钥列表</span>
<span class="line">config                # SSH客户端配置（简化连接）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用命令速查" tabindex="-1"><a class="header-anchor" href="#常用命令速查"><span>常用命令速查</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 密钥管理</span></span>
<span class="line">ssh-keygen            <span class="token comment"># 生成密钥对</span></span>
<span class="line">ssh-copy-id           <span class="token comment"># 分发公钥</span></span>
<span class="line">ssh-keyscan           <span class="token comment"># 获取远程主机公钥</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 连接测试</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-v</span>                <span class="token comment"># 详细模式连接</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-p</span> PORT           <span class="token comment"># 指定端口连接</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-i</span> KEYFILE        <span class="token comment"># 指定私钥文件</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 服务管理</span></span>
<span class="line">systemctl status/start/stop/restart sshd</span>
<span class="line">sshd <span class="token parameter variable">-t</span>               <span class="token comment"># 测试配置语法</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 信息查看</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">ssh</span></span>
<span class="line"><span class="token function">ps</span> aux <span class="token operator">|</span> <span class="token function">grep</span> sshd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,139)])])}const c=n(i,[["render",t]]),r=JSON.parse('{"path":"/03-%E7%BD%91%E7%BB%9C%E6%9C%8D%E5%8A%A1/02-ssh%E8%BF%9C%E7%A8%8B%E7%AE%A1%E7%90%86/SSH.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"03-网络服务/02-ssh远程管理/SSH.md"}');export{c as comp,r as data};
