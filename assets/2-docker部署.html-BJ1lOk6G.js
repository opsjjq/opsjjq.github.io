import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="docker-安装部署指南" tabindex="-1"><a class="header-anchor" href="#docker-安装部署指南"><span>Docker 安装部署指南</span></a></h1><h2 id="一、安装前准备" tabindex="-1"><a class="header-anchor" href="#一、安装前准备"><span>一、安装前准备</span></a></h2><h3 id="配置内核参数-必需" tabindex="-1"><a class="header-anchor" href="#配置内核参数-必需"><span>配置内核参数（必需）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建配置文件</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/sysctl.d/docker.conf <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">net.bridge.bridge-nf-call-ip6tables = 1</span>
<span class="line">net.bridge.bridge-nf-call-iptables = 1</span>
<span class="line">net.ipv4.ip_forward = 1</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 加载内核模块</span></span>
<span class="line">modprobe br_netfilter</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 应用配置</span></span>
<span class="line"><span class="token function">sysctl</span> <span class="token parameter variable">-p</span> /etc/sysctl.d/docker.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>作用说明</strong>：</p><ul><li><code>net.ipv4.ip_forward=1</code>：允许流量转发（Docker 网络必需）</li><li><code>net.bridge.bridge-nf-call-*</code>：让 iptables 规则作用于网桥流量</li></ul><hr><h2 id="二、docker-安装流程-两种源可选" tabindex="-1"><a class="header-anchor" href="#二、docker-安装流程-两种源可选"><span>二、Docker 安装流程（两种源可选）</span></a></h2><h3 id="方案一-使用清华源-推荐国内" tabindex="-1"><a class="header-anchor" href="#方案一-使用清华源-推荐国内"><span>方案一：使用清华源（推荐国内）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 卸载旧版本</span></span>
<span class="line">yum remove <span class="token function">docker</span> docker-common docker-selinux docker-engine <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 安装依赖</span></span>
<span class="line">yum <span class="token function">install</span> yum-utils device-mapper-persistent-data lvm2 <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 下载官方 repo 文件</span></span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> /etc/yum.repos.d/docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 替换为清华源</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s#download.docker.com#mirrors.tuna.tsinghua.edu.cn/docker-ce#g&#39;</span> /etc/yum.repos.d/docker-ce.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 安装</span></span>
<span class="line">yum makecache fast</span>
<span class="line">yum <span class="token function">install</span> docker-ce <span class="token parameter variable">-y</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="方案二-使用阿里源" tabindex="-1"><a class="header-anchor" href="#方案二-使用阿里源"><span>方案二：使用阿里源</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 配置阿里云 yum 源</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-o</span> /etc/yum.repos.d/Centos-7.repo http://mirrors.aliyun.com/repo/Centos-7.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 下载 docker-ce repo</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-o</span> /etc/yum.repos.d/docker-ce.repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 清理缓存并安装</span></span>
<span class="line">yum clean all <span class="token operator">&amp;&amp;</span> yum makecache</span>
<span class="line">yum <span class="token function">install</span> docker-ce <span class="token parameter variable">-y</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="查看可用版本" tabindex="-1"><a class="header-anchor" href="#查看可用版本"><span>查看可用版本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看所有可用版本</span></span>
<span class="line">yum list docker-ce <span class="token parameter variable">--showduplicates</span> <span class="token operator">|</span> <span class="token function">sort</span> <span class="token parameter variable">-r</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、配置镜像加速器-国内环境必需" tabindex="-1"><a class="header-anchor" href="#三、配置镜像加速器-国内环境必需"><span>三、配置镜像加速器（国内环境必需）</span></a></h2><h3 id="配置镜像加速" tabindex="-1"><a class="header-anchor" href="#配置镜像加速"><span>配置镜像加速</span></a></h3><p>登录 <a href="https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors" target="_blank" rel="noopener noreferrer">阿里云容器镜像服务</a> 获取镜像加速器地址。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建配置目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/docker</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置加速地址</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/docker/daemon.json <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">{</span>
<span class="line">  &quot;registry-mirrors&quot;: [</span>
<span class="line">    &quot;https://docker.m.ixdev.cn&quot;,</span>
<span class="line">    &quot;https://docker.1ms.run&quot;,</span>
<span class="line">    &quot;https://docker.xuanyuan.me&quot;</span>
<span class="line">  ]</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新加载并重启 Docker</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl restart <span class="token function">docker</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="批量测试镜像站连通性" tabindex="-1"><a class="header-anchor" href="#批量测试镜像站连通性"><span>批量测试镜像站连通性</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /opt/qwe.sh <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">MIRRORS=(</span>
<span class="line">    &quot;https://docker.registry.cyou&quot;</span>
<span class="line">    &quot;https://docker-cf.registry.cyou&quot;</span>
<span class="line">    &quot;https://mirror.aliyuncs.com&quot;</span>
<span class="line">    &quot;https://mirror.baidubce.com&quot;</span>
<span class="line">    &quot;https://docker.m.daocloud.io&quot;</span>
<span class="line">    &quot;https://docker.nju.edu.cn&quot;</span>
<span class="line">    &quot;https://fpu73b7s.mirror.aliyuncs.com&quot;</span>
<span class="line">    &quot;https://docker.mirrors.sjtug.sjtu.edu.cn&quot;</span>
<span class="line">    &quot;https://docker.mirrors.ustc.edu.cn&quot;</span>
<span class="line">    &quot;https://mirror.iscas.ac.cn&quot;</span>
<span class="line">    &quot;https://docker.rainbond.cc&quot;</span>
<span class="line">)</span>
<span class="line"></span>
<span class="line">echo &quot;正在测试 Docker 镜像站连通性...&quot;</span>
<span class="line">echo &quot;======================================&quot;</span>
<span class="line"></span>
<span class="line">for url in &quot;\${MIRRORS[@]}&quot;; do</span>
<span class="line">    domain=$(echo $url | sed &#39;s|https://||&#39;)</span>
<span class="line">    echo -n &quot;测试 $domain ... &quot;</span>
<span class="line"></span>
<span class="line">    # 测试 DNS 解析</span>
<span class="line">    if nslookup &quot;$domain&quot; &amp;&gt;/dev/null; then</span>
<span class="line">        echo -n &quot;DNS✓ &quot;</span>
<span class="line">    else</span>
<span class="line">        echo &quot;DNS✗&quot;</span>
<span class="line">        continue</span>
<span class="line">    fi</span>
<span class="line"></span>
<span class="line">    # 测试 HTTPS 连接</span>
<span class="line">    if curl --max-time 10 --silent --head &quot;$url&quot; &amp;&gt;/dev/null; then</span>
<span class="line">        echo &quot;HTTPS✓&quot;</span>
<span class="line">    else</span>
<span class="line">        echo &quot;HTTPS✗&quot;</span>
<span class="line">    fi</span>
<span class="line">done</span>
<span class="line"></span>
<span class="line">echo &quot;======================================&quot;</span>
<span class="line">echo &quot;测试完成！&quot;</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">chmod</span> +x /opt/qwe.sh</span>
<span class="line"><span class="token function">bash</span> /opt/qwe.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、代理加速配置-可选" tabindex="-1"><a class="header-anchor" href="#四、代理加速配置-可选"><span>四、代理加速配置（可选）</span></a></h2><h3 id="clash应用配置" tabindex="-1"><a class="header-anchor" href="#clash应用配置"><span>clash应用配置</span></a></h3><p>应用目录--配置文件</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">allow-lan: <span class="token boolean">true</span></span>
<span class="line">bind-address: <span class="token string">&#39;*&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="虚拟机内配置" tabindex="-1"><a class="header-anchor" href="#虚拟机内配置"><span>虚拟机内配置</span></a></h3><p>NAT网络</p><p>拥有10.0.0.*网段内IP</p><p>然后代理到主机10.0.0.1的对应端口</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">vim</span> /etc/environment</span>
<span class="line"><span class="token assign-left variable">http_proxy</span><span class="token operator">=</span><span class="token string">&quot;http://10.0.0.1:7897&quot;</span></span>
<span class="line"><span class="token assign-left variable">https_proxy</span><span class="token operator">=</span><span class="token string">&quot;http://10.0.0.1:7897&quot;</span></span>
<span class="line"><span class="token builtin class-name">source</span> /etc/environment</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查代理设置</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token variable">$http_proxy</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token variable">$https_proxy</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token variable">$no_proxy</span></span>
<span class="line"><span class="token comment"># 可实现http请求 例如 curl 注意ping命令不可用</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 临时取消代理</span></span>
<span class="line"><span class="token builtin class-name">unset</span> http_proxy https_proxy no_proxy</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、启动与验证" tabindex="-1"><a class="header-anchor" href="#五、启动与验证"><span>五、启动与验证</span></a></h2><h3 id="启动-docker-服务" tabindex="-1"><a class="header-anchor" href="#启动-docker-服务"><span>启动 Docker 服务</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 重新加载 systemd 配置</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start <span class="token function">docker</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置开机自启</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="验证安装" tabindex="-1"><a class="header-anchor" href="#验证安装"><span>验证安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 查看 Docker 信息</span></span>
<span class="line"><span class="token function">docker</span> info</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 查看版本</span></span>
<span class="line"><span class="token function">docker</span> version</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 验证镜像加速</span></span>
<span class="line"><span class="token function">docker</span> info <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-A</span> <span class="token number">10</span> <span class="token string">&quot;Registry Mirrors&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 运行测试容器</span></span>
<span class="line"><span class="token function">time</span> <span class="token function">docker</span> pull hello-world</span>
<span class="line"><span class="token function">docker</span> run hello-world</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="查看相关进程" tabindex="-1"><a class="header-anchor" href="#查看相关进程"><span>查看相关进程</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># Docker 客户端位置</span></span>
<span class="line"><span class="token function">which</span> <span class="token function">docker</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Docker 守护进程</span></span>
<span class="line"><span class="token function">ps</span> aux <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">docker</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># containerd 运行时</span></span>
<span class="line"><span class="token function">ps</span> aux <span class="token operator">|</span> <span class="token function">grep</span> containerd</span>
<span class="line">systemctl status containerd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、常用-docker-命令" tabindex="-1"><a class="header-anchor" href="#六、常用-docker-命令"><span>六、常用 Docker 命令</span></a></h2><h3 id="_1-拉取镜像" tabindex="-1"><a class="header-anchor" href="#_1-拉取镜像"><span>1. 拉取镜像</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> pull centos:latest</span>
<span class="line"><span class="token function">docker</span> pull centos:7.9.2009</span>
<span class="line"><span class="token function">docker</span> pull alpine</span>
<span class="line"><span class="token function">docker</span> pull busybox:1.29</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_2-镜像列表" tabindex="-1"><a class="header-anchor" href="#_2-镜像列表"><span>2. 镜像列表</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> images</span>
<span class="line"><span class="token comment"># 镜像重命名</span></span>
<span class="line"><span class="token function">docker</span> tag image1:tag name:tagname</span>
<span class="line"><span class="token function">docker</span> tag centos:7.9.2009 centos:7</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_3-容器运行" tabindex="-1"><a class="header-anchor" href="#_3-容器运行"><span>3. 容器运行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token operator">=</span> <span class="token function">docker</span> create + <span class="token function">docker</span> start</span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> alpine /bin/echo <span class="token string">&quot;Hello Docker&quot;</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> centos <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">&quot;ls /opt/&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_4-进入容器空间" tabindex="-1"><a class="header-anchor" href="#_4-进入容器空间"><span>4. 进入容器空间</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">--name</span> name1 <span class="token parameter variable">-p</span> <span class="token number">99</span>:80 centos:7.9.2009 <span class="token function">bash</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> name1 <span class="token function">bash</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_5-容器列表" tabindex="-1"><a class="header-anchor" href="#_5-容器列表"><span>5. 容器列表</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> <span class="token function">ps</span>          <span class="token comment"># 查看运行中的容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span>       <span class="token comment"># 查看所有容器（包括未运行）</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_6-删除容器与镜像" tabindex="-1"><a class="header-anchor" href="#_6-删除容器与镜像"><span>6. 删除容器与镜像</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> stop <span class="token operator">&lt;</span>CONTAINER_ID 或 NAME<span class="token operator">&gt;</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">rm</span> <span class="token operator">&lt;</span>CONTAINER_ID 或 NAME<span class="token operator">&gt;</span></span>
<span class="line"><span class="token function">docker</span> rmi <span class="token operator">&lt;</span>IMAGE_ID 或 NAME<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_7-查看容器信息" tabindex="-1"><a class="header-anchor" href="#_7-查看容器信息"><span>7. 查看容器信息</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 容器发行版</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token operator">&lt;</span>CONTAINER_ID<span class="token operator">&gt;</span> <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">&quot;cat /etc/os-release&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 容器内核（与宿主机相同）</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token operator">&lt;</span>CONTAINER_ID<span class="token operator">&gt;</span> <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">&quot;uname -a&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_8-运行模式参数" tabindex="-1"><a class="header-anchor" href="#_8-运行模式参数"><span>8. 运行模式参数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">-i, <span class="token parameter variable">--interactive</span>   <span class="token comment"># 保持 STDIN 打开，允许输入</span></span>
<span class="line">-t, <span class="token parameter variable">--tty</span>           <span class="token comment"># 分配伪终端</span></span>
<span class="line">-d, <span class="token parameter variable">--detach</span>        <span class="token comment"># 后台运行</span></span>
<span class="line"><span class="token parameter variable">--name</span>              <span class="token comment"># 指定容器名称</span></span>
<span class="line"><span class="token parameter variable">--rm</span>                <span class="token comment"># 容器退出后自动删除</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_9-后台运行与进入" tabindex="-1"><a class="header-anchor" href="#_9-后台运行与进入"><span>9. 后台运行与进入</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 后台运行</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">100</span>:80 nginx:1.17.9</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 进入后台容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span> <span class="token function">bash</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_10-查看容器-ip-与端口" tabindex="-1"><a class="header-anchor" href="#_10-查看容器-ip-与端口"><span>10. 查看容器 IP 与端口</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 获取容器 IP</span></span>
<span class="line"><span class="token function">docker</span> inspect <span class="token parameter variable">--format</span><span class="token operator">=</span><span class="token string">&#39;{{.NetworkSettings.IPAddress}}&#39;</span> <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取端口映射</span></span>
<span class="line"><span class="token function">docker</span> port <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_11-重命名容器" tabindex="-1"><a class="header-anchor" href="#_11-重命名容器"><span>11. 重命名容器</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> <span class="token function">rename</span> old_name new_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h3 id="_12-查看容器日志" tabindex="-1"><a class="header-anchor" href="#_12-查看容器日志"><span>12. 查看容器日志</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> logs <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h3 id="_13-容器资源监控" tabindex="-1"><a class="header-anchor" href="#_13-容器资源监控"><span>13. 容器资源监控</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> stats <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h3 id="_14-提交镜像-从容器创建镜像" tabindex="-1"><a class="header-anchor" href="#_14-提交镜像-从容器创建镜像"><span>14. 提交镜像（从容器创建镜像）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> commit <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span> my-image:v1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h3 id="_15-导出与导入镜像" tabindex="-1"><a class="header-anchor" href="#_15-导出与导入镜像"><span>15. 导出与导入镜像</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 导出</span></span>
<span class="line"><span class="token function">docker</span> save image1 <span class="token operator">&gt;</span> /opt/image1.tar</span>
<span class="line"><span class="token function">docker</span> save image1 <span class="token operator">|</span> <span class="token function">gzip</span> <span class="token operator">&gt;</span> /opt/image1.tgz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 导入</span></span>
<span class="line"><span class="token function">docker</span> load <span class="token operator">&lt;</span> /opt/image1.tar</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、实践操作" tabindex="-1"><a class="header-anchor" href="#七、实践操作"><span>七、实践操作</span></a></h2><h3 id="自建-docker-镜像-以-nginx-为例" tabindex="-1"><a class="header-anchor" href="#自建-docker-镜像-以-nginx-为例"><span>自建 Docker 镜像（以 Nginx 为例）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 启动基础容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">--name</span> os1 <span class="token parameter variable">-p</span> <span class="token number">101</span>:80 centos:7.9.2009 <span class="token function">bash</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 容器内安装 Nginx</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-o</span> /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-o</span> /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo</span>
<span class="line">yum <span class="token function">install</span> net-tools nginx <span class="token function">vim</span> <span class="token parameter variable">-y</span></span>
<span class="line">yum clean all</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 启动 Nginx 并提交镜像</span></span>
<span class="line">nginx</span>
<span class="line"><span class="token function">docker</span> commit os1 os1-nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 使用新镜像运行容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">102</span>:80 os1-nginx nginx <span class="token parameter variable">-g</span> <span class="token string">&quot;daemon off;&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="提取容器内日志" tabindex="-1"><a class="header-anchor" href="#提取容器内日志"><span>提取容器内日志</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看日志路径</span></span>
<span class="line"><span class="token function">docker</span> inspect <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-i</span> LogPath</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 导出日志到文件</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span> <span class="token operator">&gt;</span> /tmp/container.log <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="数据卷挂载映射" tabindex="-1"><a class="header-anchor" href="#数据卷挂载映射"><span>数据卷挂载映射</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 命名卷（推荐）</span></span>
<span class="line"><span class="token function">docker</span> volume create mydata</span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-v</span> mydata:/app/data nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 绑定挂载（直接挂载宿主机目录）</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-v</span> /host/path:/app/data nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 匿名卷（自动创建，不易管理）</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-v</span> /app/data nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="容器与宿主机文件复制" tabindex="-1"><a class="header-anchor" href="#容器与宿主机文件复制"><span>容器与宿主机文件复制</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 从容器复制到宿主机</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">cp</span> <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span>:/opt/dir1 /opt/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从宿主机复制到容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">cp</span> /opt/dir2 <span class="token operator">&lt;</span>CONTAINER_NAME<span class="token operator">&gt;</span>:/opt/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>说明</strong>：</p><ul><li>容器没有自己的内核，共享宿主机内核。</li><li><code>/etc/os-release</code> 仅表示用户空间的发行版信息。</li><li>容器内核版本与宿主机一致，确保兼容性即可运行不同 Linux 发行版。</li></ul>`,107)])])}const t=n(i,[["render",p]]),o=JSON.parse('{"path":"/05-%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92/02-docker%E5%AE%B9%E5%99%A8/2-docker%E9%83%A8%E7%BD%B2.html","title":"Docker 安装部署指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"05-容器编排/02-docker容器/2-docker部署.md"}');export{t as comp,o as data};
