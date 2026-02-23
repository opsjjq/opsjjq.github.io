import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function t(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="kubernetes-k8s-安装与核心组件详解" tabindex="-1"><a class="header-anchor" href="#kubernetes-k8s-安装与核心组件详解"><span>Kubernetes（K8s）安装与核心组件详解</span></a></h1><blockquote><p>① 参考资料汇总 ② 核心组件详解 ③ 集群安装步骤 ④ 常见工具与网络插件配置</p></blockquote><hr><h2 id="_0-参考资料" tabindex="-1"><a class="header-anchor" href="#_0-参考资料"><span>0. 参考资料</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">1. k8s能干什么</span>
<span class="line">https://kubernetes.io/zh-cn/docs/concepts/overview/#why-you-need-kubernetes-and-what-can-it-do</span>
<span class="line"></span>
<span class="line">2. Docker 官方文档</span>
<span class="line">https://docs.docker.com/get-started/</span>
<span class="line"></span>
<span class="line">3. kubeadm 创建 k8s 集群（官方）</span>
<span class="line">https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/</span>
<span class="line"></span>
<span class="line">4. Prometheus 监控系统</span>
<span class="line">https://prometheus.io/docs/introduction/overview/</span>
<span class="line"></span>
<span class="line">5. Ansible 部署 k8s 工具（easzlab/kubeasz）</span>
<span class="line">https://github.com/easzlab/kubeasz</span>
<span class="line"></span>
<span class="line">6. 阿里云 k8s 产品（生产环境推荐）</span>
<span class="line">https://www.aliyun.com/product/kubernetes</span>
<span class="line"></span>
<span class="line">7. 多版本 K8s API 查询工具</span>
<span class="line">https://k8s.mybatis.io/v1.19/</span>
<span class="line"></span>
<span class="line">8. YAML 自动生成工具</span>
<span class="line">https://k8syaml.com/</span>
<span class="line"></span>
<span class="line">9. 华为云 Kubernetes 文档</span>
<span class="line">https://support.huaweicloud.com/basics-cce/kubernetes_0003.html</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="一、核心组件详解" tabindex="-1"><a class="header-anchor" href="#一、核心组件详解"><span>一、核心组件详解</span></a></h2><h3 id="控制平面组件-control-plane-master" tabindex="-1"><a class="header-anchor" href="#控制平面组件-control-plane-master"><span>控制平面组件（Control Plane / Master）</span></a></h3><h4 id="_1-etcd" tabindex="-1"><a class="header-anchor" href="#_1-etcd"><span>1. etcd</span></a></h4><p>集群的&quot;数据库&quot;</p><ul><li>分布式、高可用的 <strong>KV 数据库</strong></li><li>保存 <strong>整个集群的最终状态</strong>（Node、Pod、Service、Deployment 等）</li><li><strong>所有组件通过 API Server 与 etcd 间接协作</strong></li></ul><blockquote><p>记忆点：<strong>&quot;K8s 没有 etcd，就等于没有记忆&quot;</strong></p></blockquote><hr><h4 id="_2-apiserver" tabindex="-1"><a class="header-anchor" href="#_2-apiserver"><span>2. apiserver</span></a></h4><p>集群的唯一入口</p><ul><li>Kubernetes 的 <strong>统一访问入口</strong></li><li>所有操作都必须经过它：kubectl、Controller、Scheduler、kubelet</li><li>主要职责： <ul><li>认证（Authentication）</li><li>授权（Authorization）</li><li>准入控制（Admission）</li><li>API 注册与发现</li></ul></li></ul><blockquote><p>记忆点：<strong>&quot;谁都不能绕过 API Server&quot;</strong></p></blockquote><hr><h4 id="_3-controller-manager" tabindex="-1"><a class="header-anchor" href="#_3-controller-manager"><span>3. controller-manager</span></a></h4><p>集群的&quot;纠偏系统&quot;</p><ul><li>核心思想：<strong>不断让&quot;实际状态&quot;逼近&quot;期望状态&quot;</strong></li><li>内部包含多个 Controller，例如： <ul><li>Replication Controller：保证副本数</li><li>Node Controller：节点状态管理</li><li>Service / Endpoints Controller</li><li>ResourceQuota Controller</li></ul></li></ul><blockquote><p>记忆点：<strong>&quot;集群出问题，Controller 来兜底&quot;</strong></p></blockquote><hr><h4 id="_4-scheduler" tabindex="-1"><a class="header-anchor" href="#_4-scheduler"><span>4. scheduler</span></a></h4><p>调度决策者</p><ul><li><strong>只负责一件事</strong>：把 Pod 调度到合适的 Node</li><li>调度依据： <ul><li>资源情况（CPU / 内存）</li><li>亲和 / 反亲和规则</li><li>污点与容忍策略</li></ul></li><li><strong>Scheduler 只做决策，不创建 Pod、不运行容器</strong></li></ul><blockquote><p>记忆点：<strong>&quot;Scheduler 只动脑，不动手&quot;</strong></p></blockquote><hr><h3 id="工作节点组件-node" tabindex="-1"><a class="header-anchor" href="#工作节点组件-node"><span>工作节点组件（Node）</span></a></h3><h4 id="_5-kubelet" tabindex="-1"><a class="header-anchor" href="#_5-kubelet"><span>5. kubelet</span></a></h4><p>Node 上的&quot;执行者&quot;</p><ul><li>运行在每一台 Node 上的 <strong>代理进程</strong></li><li>核心职责： <ul><li><strong>Pod 生命周期管理</strong>（从 API Server 获取期望状态，调用 CRI 创建/删除容器）</li><li><strong>容器健康检查</strong>（执行 liveness / readiness 探针）</li><li><strong>资源监控</strong>（通过 cAdvisor 采集信息并上报）</li><li><strong>对接插件</strong>（存储：CSI / Volume；网络：CNI）</li></ul></li></ul><blockquote><p>记忆点：<strong>&quot;Pod 是 kubelet 真正养大的&quot;</strong></p></blockquote><hr><h4 id="_6-container-runtime" tabindex="-1"><a class="header-anchor" href="#_6-container-runtime"><span>6. Container Runtime</span></a></h4><p>真正跑容器的组件</p><ul><li>负责镜像管理、容器创建、启动、销毁</li><li>通过 <strong>CRI（Container Runtime Interface）</strong> 与 kubelet 通信</li><li>常见实现： <ul><li>Docker（旧版本）</li><li>containerd（主流）</li><li>CRI-O</li></ul></li></ul><blockquote><p>记忆点：<strong>&quot;kubelet 负责指挥，runtime 负责干活&quot;</strong></p></blockquote><hr><h4 id="_7-kube-proxy" tabindex="-1"><a class="header-anchor" href="#_7-kube-proxy"><span>7. kube-proxy</span></a></h4><p>Service 的网络实现者</p><ul><li>负责 <strong>Service 的网络转发与负载均衡</strong></li><li>核心功能：将 Service IP 转发到后端 Pod</li><li>实现方式：iptables 或 ipvs（性能更好）</li><li><strong>kube-proxy 不是 DNS，只是做网络规则转发</strong></li></ul><blockquote><p>记忆点：<strong>&quot;Service 能访问，全靠 kube-proxy 写规则&quot;</strong></p></blockquote><hr><h3 id="客户端工具" tabindex="-1"><a class="header-anchor" href="#客户端工具"><span>客户端工具</span></a></h3><h4 id="_8-kubectl" tabindex="-1"><a class="header-anchor" href="#_8-kubectl"><span>8. kubectl</span></a></h4><p>管理入口工具</p><ul><li>Kubernetes 官方 CLI</li><li>本质：向 kube-apiserver 发送 HTTP 请求</li><li>常用能力： <ul><li>资源增删改查</li><li>日志查看</li><li>exec 进入容器</li></ul></li></ul><blockquote><p>记忆点：<strong>&quot;kubectl ≈ API Server 客户端&quot;</strong></p></blockquote><hr><h3 id="组件关系一句话总结" tabindex="-1"><a class="header-anchor" href="#组件关系一句话总结"><span>组件关系一句话总结</span></a></h3><blockquote><p><strong>kubectl / 组件 → API Server → etcd Scheduler 决定去哪 Controller 保证不出错 kubelet 真正跑 Pod kube-proxy 负责网络转发</strong></p></blockquote><hr><h3 id="建议记住的五句话" tabindex="-1"><a class="header-anchor" href="#建议记住的五句话"><span>建议记住的五句话</span></a></h3><ol><li><strong>etcd 保存状态</strong></li><li><strong>API Server 是唯一入口</strong></li><li><strong>Controller 保证期望状态</strong></li><li><strong>Scheduler 决定 Pod 去哪</strong></li><li><strong>kubelet 在 Node 上真正干活</strong></li></ol><hr><h2 id="二、k8s-部署架构概览" tabindex="-1"><a class="header-anchor" href="#二、k8s-部署架构概览"><span>二、K8s 部署架构概览</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">master:</span>
<span class="line">  etcd</span>
<span class="line">  kube-apiserver</span>
<span class="line">  kube-controller-manager</span>
<span class="line">  kube-scheduler</span>
<span class="line">  kubelet</span>
<span class="line">  kube-proxy</span>
<span class="line">  flannel</span>
<span class="line">  containerd</span>
<span class="line">  runc</span>
<span class="line">  CNI</span>
<span class="line"></span>
<span class="line">node1 / node2:</span>
<span class="line">  kubelet</span>
<span class="line">  kube-proxy</span>
<span class="line">  flannel</span>
<span class="line">  containerd</span>
<span class="line">  runc</span>
<span class="line">  CNI</span>
<span class="line">  nerdctl</span>
<span class="line">  buildkitd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 网络插件 flannel 确保三台机器内的容器之间可以互相通信</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、版本选择建议" tabindex="-1"><a class="header-anchor" href="#三、版本选择建议"><span>三、版本选择建议</span></a></h2><table><thead><tr><th style="text-align:left;">组件</th><th style="text-align:left;">版本</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>containerd</strong></td><td style="text-align:left;"><strong>1.6.39</strong></td><td style="text-align:left;">1.6 系列最终维护版，兼容 k8s ≤ 1.27</td></tr><tr><td style="text-align:left;"><strong>runc</strong></td><td style="text-align:left;"><strong>1.1.12</strong></td><td style="text-align:left;">最后一个稳定支持 glibc 2.17</td></tr><tr><td style="text-align:left;"><strong>nerdctl</strong></td><td style="text-align:left;"><strong>1.7.7</strong></td><td style="text-align:left;">官方声明支持 containerd 1.6</td></tr><tr><td style="text-align:left;"><strong>buildkit</strong></td><td style="text-align:left;"><strong>0.12.5</strong></td><td style="text-align:left;">不强依赖新 glibc</td></tr><tr><td style="text-align:left;"><strong>CNI plugins</strong></td><td style="text-align:left;"><strong>v1.2.0</strong></td><td style="text-align:left;">flannel / kubelet 完全兼容</td></tr></tbody></table><hr><h2 id="四、环境准备" tabindex="-1"><a class="header-anchor" href="#四、环境准备"><span>四、环境准备</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment">## 主机名解析</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> /etc/hosts <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">10.0.0.10 k8s-master-10</span>
<span class="line">10.0.0.11 k8s-node-11</span>
<span class="line">10.0.0.12 k8s-node-12</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">## 防火墙与 SELinux 初始化</span></span>
<span class="line">systemctl stop firewalld NetworkManager</span>
<span class="line">systemctl disable firewalld NetworkManager</span>
<span class="line"></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-ri</span> <span class="token string">&#39;s#(SELINUX=).*#\\1disabled#&#39;</span> /etc/selinux/config</span>
<span class="line">setenforce <span class="token number">0</span></span>
<span class="line">getenforce</span>
<span class="line"></span>
<span class="line">iptables <span class="token parameter variable">-F</span></span>
<span class="line">iptables <span class="token parameter variable">-X</span></span>
<span class="line">iptables <span class="token parameter variable">-Z</span></span>
<span class="line">iptables <span class="token parameter variable">-P</span> FORWARD ACCEPT</span>
<span class="line"></span>
<span class="line"><span class="token comment">## 关闭 swap（k8s 默认禁用 swap）</span></span>
<span class="line">swapoff <span class="token parameter variable">-a</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/ swap / s|^\\(.*\\)$|#\\1|g&#39;</span> /etc/fstab</span>
<span class="line"></span>
<span class="line"><span class="token comment">## yum 源配置（阿里云镜像）</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-o</span> /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-o</span> /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/aliyuncs/d&#39;</span> /etc/yum.repos.d/*.repo</span>
<span class="line">yum clean all <span class="token operator">&amp;&amp;</span> yum makecache fast</span>
<span class="line"></span>
<span class="line"><span class="token comment">## 时间同步（chrony）</span></span>
<span class="line">yum <span class="token function">install</span> chrony <span class="token parameter variable">-y</span></span>
<span class="line">systemctl start chronyd</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> chronyd</span>
<span class="line">ntpdate <span class="token parameter variable">-u</span> ntp.aliyun.com</span>
<span class="line">hwclock <span class="token parameter variable">-w</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">## 内核参数配置（开启数据包转发）</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&lt;&lt;</span><span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">&gt;</span> /etc/sysctl.d/k8s.conf</span></span>
<span class="line">net.bridge.bridge-nf-call-ip6tables = 1</span>
<span class="line">net.bridge.bridge-nf-call-iptables = 1</span>
<span class="line">net.ipv4.ip_forward = 1</span>
<span class="line">vm.max_map_count = 262144</span>
<span class="line">EOF</span></span>
<span class="line">modprobe br_netfilter</span>
<span class="line"><span class="token function">sysctl</span> <span class="token parameter variable">-p</span> /etc/sysctl.d/k8s.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、更新-centos-7-系统内核" tabindex="-1"><a class="header-anchor" href="#五、更新-centos-7-系统内核"><span>五、更新 CentOS 7 系统内核</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /opt/kernel</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/kernel</span>
<span class="line"><span class="token function">wget</span> https://dl.lamp.sh/kernel/el7/kernel-ml-5.10.222-1.el7.x86_64.rpm</span>
<span class="line"><span class="token function">wget</span> https://dl.lamp.sh/kernel/el7/kernel-ml-devel-5.10.222-1.el7.x86_64.rpm</span>
<span class="line"></span>
<span class="line">yum localinstall <span class="token parameter variable">-y</span> kernel-ml-5.10.222-1.el7.x86_64.rpm kernel-ml-devel-5.10.222-1.el7.x86_64.rpm</span>
<span class="line"></span>
<span class="line"><span class="token function">awk</span> -F<span class="token punctuation">\\</span>&#39; <span class="token string">&#39;$1==&quot;menuentry &quot; {print $2}&#39;</span> /etc/grub2.cfg</span>
<span class="line"></span>
<span class="line">grub2-set-default <span class="token string">&#39;CentOS Linux (5.10.222-1.el7.x86_64) 7 (Core)&#39;</span></span>
<span class="line"><span class="token function">reboot</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启后验证</span></span>
<span class="line"><span class="token function">uname</span> <span class="token parameter variable">-r</span></span>
<span class="line"><span class="token comment"># 输出：5.10.222-1.el7.x86_64</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、安装-containerd" tabindex="-1"><a class="header-anchor" href="#六、安装-containerd"><span>六、安装 containerd</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">cd</span> /opt/</span>
<span class="line"><span class="token function">wget</span> https://github.com/containerd/containerd/releases/download/v1.6.39/containerd-1.6.39-linux-amd64.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> containerd-1.6.39-linux-amd64.tar.gz</span>
<span class="line"><span class="token function">mv</span> /opt/bin/* /usr/local/bin</span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/containerd</span>
<span class="line">containerd config default <span class="token operator">&gt;</span> /etc/containerd/config.toml</span>
<span class="line"></span>
<span class="line"><span class="token function">tee</span> /etc/systemd/system/containerd.service <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">[Unit]</span>
<span class="line">Description=containerd container runtime</span>
<span class="line">Documentation=https://containerd.io</span>
<span class="line">After=network.target dbus.service</span>
<span class="line">[Service]</span>
<span class="line">ExecStartPre=-/sbin/modprobe overlay</span>
<span class="line">ExecStart=/usr/local/bin/containerd</span>
<span class="line">Type=notify</span>
<span class="line">Delegate=yes</span>
<span class="line">KillMode=process</span>
<span class="line">Restart=always</span>
<span class="line">RestartSec=5</span>
<span class="line">LimitNPROC=infinity</span>
<span class="line">LimitCORE=infinity</span>
<span class="line">TasksMax=infinity</span>
<span class="line">OOMScoreAdjust=-999</span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> containerd</span>
<span class="line"></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/SystemdCgroup = false/SystemdCgroup = true/&#39;</span> /etc/containerd/config.toml</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s|sandbox_image = &quot;.*&quot;|sandbox_image = &quot;registry.aliyuncs.com/google_containers/pause:3.9&quot;|&#39;</span> /etc/containerd/config.toml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 镜像加速配置</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/containerd/certs.d/docker.io</span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/containerd/certs.d/docker.io/hosts.toml <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">server = &quot;https://docker.io&quot;</span>
<span class="line">[host.&quot;https://docker.1ms.run&quot;]</span>
<span class="line">  capabilities = [&quot;pull&quot;, &quot;resolve&quot;]</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl restart containerd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、安装-runc" tabindex="-1"><a class="header-anchor" href="#七、安装-runc"><span>七、安装 runc</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">wget</span> https://github.com/opencontainers/runc/releases/download/v1.1.12/runc.amd64</span>
<span class="line"><span class="token function">chmod</span> +x runc.amd64</span>
<span class="line"><span class="token function">mv</span> runc.amd64 /usr/local/bin/runc</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、安装-cni-插件" tabindex="-1"><a class="header-anchor" href="#八、安装-cni-插件"><span>八、安装 CNI 插件</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /opt/cni/bin</span>
<span class="line"><span class="token function">wget</span> https://github.com/containernetworking/plugins/releases/download/v1.2.0/cni-plugins-linux-amd64-v1.2.0.tgz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-C</span> /opt/cni/bin <span class="token parameter variable">-xzf</span> cni-plugins-linux-amd64-v1.2.0.tgz</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="九、安装-kubelet、kubeadm、kubectl-等" tabindex="-1"><a class="header-anchor" href="#九、安装-kubelet、kubeadm、kubectl-等"><span>九、安装 kubelet、kubeadm、kubectl 等</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&lt;&lt;</span><span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">&gt;</span> /etc/yum.repos.d/kubernetes.repo</span></span>
<span class="line">[kubernetes]</span>
<span class="line">name=Kubernetes</span>
<span class="line">baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64</span>
<span class="line">enabled=1</span>
<span class="line">gpgcheck=0</span>
<span class="line">repo_gpgcheck=0</span>
<span class="line">gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg</span>
<span class="line">        http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">yum clean all <span class="token operator">&amp;&amp;</span> yum makecache</span>
<span class="line">yum <span class="token function">install</span> kubelet-1.27.0 kubeadm-1.27.0 kubectl-1.27.0 ipvsadm cri-tools-1.26.0 <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> kubelet</span>
<span class="line"></span>
<span class="line"><span class="token comment"># crictl 配置</span></span>
<span class="line"><span class="token function">tee</span> /etc/crictl.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">runtime-endpoint: unix:///run/containerd/containerd.sock</span>
<span class="line">image-endpoint: unix:///run/containerd/containerd.sock</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">crictl version</span>
<span class="line">crictl pull alpine</span>
<span class="line">crictl images</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十、master-节点初始化" tabindex="-1"><a class="header-anchor" href="#十、master-节点初始化"><span>十、Master 节点初始化</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubeadm init <span class="token punctuation">\\</span></span>
<span class="line">  --apiserver-advertise-address<span class="token operator">=</span><span class="token number">10.0</span>.0.10 <span class="token punctuation">\\</span></span>
<span class="line">  --image-repository registry.aliyuncs.com/google_containers <span class="token punctuation">\\</span></span>
<span class="line">  --kubernetes-version v1.27.0 <span class="token punctuation">\\</span></span>
<span class="line">  --service-cidr<span class="token operator">=</span><span class="token number">10.1</span>.0.0/16 <span class="token punctuation">\\</span></span>
<span class="line">  --pod-network-cidr<span class="token operator">=</span><span class="token number">10.2</span>.0.0/16 <span class="token punctuation">\\</span></span>
<span class="line">  --service-dns-domain<span class="token operator">=</span>cluster.local <span class="token punctuation">\\</span></span>
<span class="line">  --ignore-preflight-errors<span class="token operator">=</span>Swap <span class="token punctuation">\\</span></span>
<span class="line">  --ignore-preflight-errors<span class="token operator">=</span>NumCPU</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>初始化成功后，按提示执行：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token environment constant">$HOME</span>/.kube</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">cp</span> <span class="token parameter variable">-i</span> /etc/kubernetes/admin.conf <span class="token environment constant">$HOME</span>/.kube/config</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">chown</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-u</span><span class="token variable">)</span></span><span class="token builtin class-name">:</span><span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-g</span><span class="token variable">)</span></span> <span class="token environment constant">$HOME</span>/.kube/config</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十一、node-节点加入集群" tabindex="-1"><a class="header-anchor" href="#十一、node-节点加入集群"><span>十一、Node 节点加入集群</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 在 Node 节点执行（token 和 hash 以实际输出为准）</span></span>
<span class="line">kubeadm <span class="token function">join</span> <span class="token number">10.0</span>.0.10:6443 <span class="token parameter variable">--token</span> <span class="token operator">&lt;</span>token<span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --discovery-token-ca-cert-hash sha256:<span class="token operator">&lt;</span>hash<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十二、安装-flannel-网络插件" tabindex="-1"><a class="header-anchor" href="#十二、安装-flannel-网络插件"><span>十二、安装 Flannel 网络插件</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 在 Master 节点执行</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt</span>
<span class="line"><span class="token function">git</span> clone <span class="token parameter variable">--depth</span> <span class="token number">1</span> https://github.com/coreos/flannel.git</span>
<span class="line"><span class="token builtin class-name">cd</span> flannel/Documentation</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 编辑 kube-flannel.yml</span></span>
<span class="line"><span class="token comment"># 修改两处：</span></span>
<span class="line"><span class="token comment"># 1. Network: &quot;10.2.0.0/16&quot;（与 --pod-network-cidr 一致）</span></span>
<span class="line"><span class="token comment"># 2. 在 args 中添加 --iface=eth0</span></span>
<span class="line"></span>
<span class="line">kubectl apply <span class="token parameter variable">-f</span> kube-flannel.yml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十三、配置-kubectl-补全" tabindex="-1"><a class="header-anchor" href="#十三、配置-kubectl-补全"><span>十三、配置 kubectl 补全</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">yum <span class="token function">install</span> bash-completion <span class="token parameter variable">-y</span></span>
<span class="line"><span class="token builtin class-name">source</span> /usr/share/bash-completion/bash_completion</span>
<span class="line"><span class="token builtin class-name">source</span> <span class="token operator">&lt;</span><span class="token punctuation">(</span>kubectl completion <span class="token function">bash</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;source &lt;(kubectl completion bash)&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.bashrc</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十四、master-污点设置-禁止调度" tabindex="-1"><a class="header-anchor" href="#十四、master-污点设置-禁止调度"><span>十四、Master 污点设置（禁止调度）</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl taint nodes k8s-master-10 node-role.kubernetes.io/control-plane<span class="token operator">=</span>:NoSchedule</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启 CoreDNS 使其重新调度到 Node 节点</span></span>
<span class="line">kubectl <span class="token parameter variable">-n</span> kube-system rollout restart deploy coredns</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证</span></span>
<span class="line">kubectl <span class="token parameter variable">-n</span> kube-system get pods <span class="token parameter variable">-o</span> wide <span class="token operator">|</span> <span class="token function">grep</span> coredns</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十五、安装-nerdctl-替代-docker-cli" tabindex="-1"><a class="header-anchor" href="#十五、安装-nerdctl-替代-docker-cli"><span>十五、安装 nerdctl（替代 Docker CLI）</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">wget</span> https://github.com/containerd/nerdctl/releases/download/v1.7.7/nerdctl-1.7.7-linux-amd64.tar.gz</span>
<span class="line"><span class="token function">tar</span> xf nerdctl-1.7.7-linux-amd64.tar.gz</span>
<span class="line"><span class="token function">mv</span> nerdctl /usr/local/bin/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置 docker 别名</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /usr/local/bin/docker <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">#!/bin/bash</span>
<span class="line">/usr/local/bin/nerdctl &quot;$@&quot;</span>
<span class="line">EOF</span></span>
<span class="line"><span class="token function">chmod</span> +x /usr/local/bin/docker</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 补全配置</span></span>
<span class="line">nerdctl completion <span class="token function">bash</span> <span class="token operator">&gt;</span> /etc/bash_completion.d/nerdctl</span>
<span class="line"><span class="token builtin class-name">source</span> /etc/bash_completion.d/nerdctl</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>关键点：<code>nerdctl -n k8s.io</code> 可直接操作 k8s 使用的镜像，无需 push/pull。</p></blockquote><hr><h2 id="十六、安装-buildkit-镜像构建工具" tabindex="-1"><a class="header-anchor" href="#十六、安装-buildkit-镜像构建工具"><span>十六、安装 buildkit（镜像构建工具）</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">wget</span> https://github.com/moby/buildkit/releases/download/v0.12.5/buildkit-v0.12.5.linux-amd64.tar.gz</span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /usr/local/buildctl</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> buildkit-v0.12.5.linux-amd64.tar.gz <span class="token parameter variable">-C</span> /usr/local/buildctl</span>
<span class="line"></span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /usr/local/buildctl/bin/buildkitd /usr/local/bin/buildkitd</span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /usr/local/buildctl/bin/buildctl /usr/local/bin/buildctl</span>
<span class="line"></span>
<span class="line"><span class="token function">tee</span> /etc/systemd/system/buildkit.service <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">[Unit]</span>
<span class="line">Description=BuildKit</span>
<span class="line">Documentation=https://github.com/moby/buildkit</span>
<span class="line">[Service]</span>
<span class="line">ExecStart=/usr/local/bin/buildkitd</span>
<span class="line">Restart=always</span>
<span class="line">RestartSec=5</span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> buildkit</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十七、配置-kube-proxy-使用-ipvs-模式" tabindex="-1"><a class="header-anchor" href="#十七、配置-kube-proxy-使用-ipvs-模式"><span>十七、配置 kube-proxy 使用 IPVS 模式</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl edit configmap <span class="token parameter variable">-n</span> kube-system kube-proxy</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改：</span></span>
<span class="line"><span class="token comment"># mode: &quot;&quot; → mode: &quot;ipvs&quot;</span></span>
<span class="line"><span class="token comment"># scheduler: &quot;&quot; → scheduler: &quot;rr&quot;</span></span>
<span class="line"></span>
<span class="line">kubectl rollout restart daemonset <span class="token parameter variable">-n</span> kube-system kube-proxy</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十八、测试运行-pod" tabindex="-1"><a class="header-anchor" href="#十八、测试运行-pod"><span>十八、测试运行 Pod</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl run nginx-test <span class="token parameter variable">--image</span><span class="token operator">=</span>nginx:latest</span>
<span class="line">kubectl get pods <span class="token parameter variable">-o</span> wide</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 进入容器执行命令</span></span>
<span class="line">kubectl <span class="token builtin class-name">exec</span> nginx-test -- <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token string">&#39;echo &quot;Hello K8s!&quot; &gt; /usr/share/nginx/html/index.html&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 访问 Pod IP（需在同集群内）</span></span>
<span class="line"><span class="token function">curl</span> <span class="token operator">&lt;</span>Pod-IP<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十九、总结-master-与-node-组件分布" tabindex="-1"><a class="header-anchor" href="#十九、总结-master-与-node-组件分布"><span>十九、总结：Master 与 Node 组件分布</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># Master 节点</span></span>
<span class="line">etcd</span>
<span class="line">kube-apiserver</span>
<span class="line">kube-controller-manager</span>
<span class="line">kube-scheduler</span>
<span class="line">kubelet</span>
<span class="line">kube-proxy</span>
<span class="line">flannel</span>
<span class="line">containerd</span>
<span class="line">runc</span>
<span class="line">CNI 插件</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Node 节点</span></span>
<span class="line">kubelet</span>
<span class="line">kube-proxy</span>
<span class="line">flannel</span>
<span class="line">containerd</span>
<span class="line">runc</span>
<span class="line">CNI 插件</span>
<span class="line">nerdctl</span>
<span class="line">buildkit</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二十、参考资料与延伸阅读" tabindex="-1"><a class="header-anchor" href="#二十、参考资料与延伸阅读"><span>二十、参考资料与延伸阅读</span></a></h2><ul><li><a href="https://cloud.tencent.com/developer/article/2307102" target="_blank" rel="noopener noreferrer">腾讯云 K8s 安装文档</a></li><li><a href="https://blog.csdn.net/terryzxy/article/details/141673546" target="_blank" rel="noopener noreferrer">CSDN 详细安装指南</a></li><li><a href="https://kubernetes.io/zh-cn/docs/home/" target="_blank" rel="noopener noreferrer">K8s 官方文档</a></li><li><a href="https://github.com/containerd/containerd" target="_blank" rel="noopener noreferrer">containerd 官方 GitHub</a></li></ul>`,115)])])}const r=n(i,[["render",t]]),d=JSON.parse('{"path":"/05-%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92/03-kubernetes%E7%BC%96%E6%8E%92/2-k8s%E5%AE%89%E8%A3%85.html","title":"Kubernetes（K8s）安装与核心组件详解","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"05-容器编排/03-kubernetes编排/2-k8s安装.md"}');export{r as comp,d as data};
