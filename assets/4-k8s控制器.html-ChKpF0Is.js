import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const t={};function p(i,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="kubernetes-控制器汇总" tabindex="-1"><a class="header-anchor" href="#kubernetes-控制器汇总"><span>Kubernetes 控制器汇总</span></a></h1><h2 id="_1-控制器概述" tabindex="-1"><a class="header-anchor" href="#_1-控制器概述"><span>1. 控制器概述</span></a></h2><p>Kubernetes 控制器是确保集群状态与期望状态一致的核心组件。它们通过监控集群状态并执行必要的操作来维持系统的稳定性。</p><h3 id="常见控制器类型" tabindex="-1"><a class="header-anchor" href="#常见控制器类型"><span>常见控制器类型</span></a></h3><table><thead><tr><th style="text-align:left;">控制器</th><th style="text-align:left;">用途</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>ReplicaSet</strong></td><td style="text-align:left;">确保 Pod 副本数量</td></tr><tr><td style="text-align:left;"><strong>Deployment</strong></td><td style="text-align:left;">管理 ReplicaSet，支持滚动更新</td></tr><tr><td style="text-align:left;"><strong>DaemonSet</strong></td><td style="text-align:left;">在每个节点运行 Pod</td></tr><tr><td style="text-align:left;"><strong>StatefulSet</strong></td><td style="text-align:left;">有状态应用部署</td></tr><tr><td style="text-align:left;"><strong>Job</strong></td><td style="text-align:left;">一次性任务</td></tr><tr><td style="text-align:left;"><strong>CronJob</strong></td><td style="text-align:left;">定时任务</td></tr></tbody></table><hr><h2 id="_2-replicaset-控制器" tabindex="-1"><a class="header-anchor" href="#_2-replicaset-控制器"><span>2. ReplicaSet 控制器</span></a></h2><h3 id="基本概念" tabindex="-1"><a class="header-anchor" href="#基本概念"><span>基本概念</span></a></h3><p>ReplicaSet 确保指定数量的 Pod 副本始终运行。如果 Pod 异常退出，ReplicaSet 会自动创建新的 Pod 替换。</p><hr><h3 id="创建-replicaset" tabindex="-1"><a class="header-anchor" href="#创建-replicaset"><span>创建 ReplicaSet</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> ReplicaSet</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>rs</span>
<span class="line">  <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">          <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">          <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http</span>
<span class="line">              <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 ReplicaSet</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> rs-nginx.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 ReplicaSet 和 Pod</span></span>
<span class="line">kubectl get rs</span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 ReplicaSet 详情</span></span>
<span class="line">kubectl describe rs nginx-rs</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="扩缩容" tabindex="-1"><a class="header-anchor" href="#扩缩容"><span>扩缩容</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方式一：修改 YAML 文件</span></span>
<span class="line">kubectl edit rs nginx-rs</span>
<span class="line"><span class="token comment"># 修改 replicas: 3 → 5</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方式二：直接扩缩容</span></span>
<span class="line">kubectl scale rs nginx-rs <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">5</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证</span></span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="删除-replicaset" tabindex="-1"><a class="header-anchor" href="#删除-replicaset"><span>删除 ReplicaSet</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 删除 ReplicaSet（会同时删除管理的 Pod）</span></span>
<span class="line">kubectl delete rs nginx-rs</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 仅删除 ReplicaSet，保留 Pod</span></span>
<span class="line">kubectl delete rs nginx-rs <span class="token parameter variable">--cascade</span><span class="token operator">=</span>false</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_3-deployment-控制器" tabindex="-1"><a class="header-anchor" href="#_3-deployment-控制器"><span>3. Deployment 控制器</span></a></h2><h3 id="基本概念-1" tabindex="-1"><a class="header-anchor" href="#基本概念-1"><span>基本概念</span></a></h3><p>Deployment 是最常用的控制器，它管理 ReplicaSet 并提供滚动更新、回滚等高级功能。</p><hr><h3 id="创建-deployment" tabindex="-1"><a class="header-anchor" href="#创建-deployment"><span>创建 Deployment</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> deploy1</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">2</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">          <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>containers</span>
<span class="line">          <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http</span>
<span class="line">              <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 Deployment</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> deploy-nginx.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 Deployment、ReplicaSet 和 Pod</span></span>
<span class="line">kubectl get deploy</span>
<span class="line">kubectl get rs</span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="deployment-状态字段" tabindex="-1"><a class="header-anchor" href="#deployment-状态字段"><span>Deployment 状态字段</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl get deploy deploy1 <span class="token parameter variable">-o</span> yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>关键字段：</p><table><thead><tr><th style="text-align:left;">字段</th><th style="text-align:left;">含义</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>spec.replicas</strong></td><td style="text-align:left;">期望的 Pod 副本数</td></tr><tr><td style="text-align:left;"><strong>status.replicas</strong></td><td style="text-align:left;">当前运行的 Pod 数量</td></tr><tr><td style="text-align:left;"><strong>status.updatedReplicas</strong></td><td style="text-align:left;">已更新到新版本的 Pod 数量</td></tr><tr><td style="text-align:left;"><strong>status.availableReplicas</strong></td><td style="text-align:left;">可用的 Pod 数量</td></tr><tr><td style="text-align:left;"><strong>status.readyReplicas</strong></td><td style="text-align:left;">就绪的 Pod 数量</td></tr></tbody></table><hr><h3 id="扩缩容-1" tabindex="-1"><a class="header-anchor" href="#扩缩容-1"><span>扩缩容</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方式一：修改 YAML</span></span>
<span class="line">kubectl edit deployment deploy1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方式二：命令行扩缩容</span></span>
<span class="line">kubectl scale deployment deploy1 <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">5</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证</span></span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="滚动更新" tabindex="-1"><a class="header-anchor" href="#滚动更新"><span>滚动更新</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方式一：修改 YAML 中的镜像版本</span></span>
<span class="line">kubectl edit deployment deploy1</span>
<span class="line"><span class="token comment"># 修改 image: nginx:alpine → nginx:1.20</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方式二：直接更新镜像</span></span>
<span class="line">kubectl <span class="token builtin class-name">set</span> image deployment deploy1 nginx-containers<span class="token operator">=</span>nginx:1.20</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看更新状态</span></span>
<span class="line">kubectl rollout status deployment deploy1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看更新历史</span></span>
<span class="line">kubectl rollout <span class="token function">history</span> deployment deploy1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看特定版本的详细信息</span></span>
<span class="line">kubectl rollout <span class="token function">history</span> deployment deploy1 <span class="token parameter variable">--revision</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="回滚" tabindex="-1"><a class="header-anchor" href="#回滚"><span>回滚</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看历史版本</span></span>
<span class="line">kubectl rollout <span class="token function">history</span> deployment deploy1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 回滚到上一个版本</span></span>
<span class="line">kubectl rollout undo deployment deploy1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 回滚到指定版本</span></span>
<span class="line">kubectl rollout undo deployment deploy1 --to-revision<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证</span></span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx</span>
<span class="line">kubectl describe deploy deploy1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="更新策略配置" tabindex="-1"><a class="header-anchor" href="#更新策略配置"><span>更新策略配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> deploy<span class="token punctuation">-</span>update</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line">  <span class="token key atrule">strategy</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> RollingUpdate</span>
<span class="line">    <span class="token key atrule">rollingUpdate</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">maxSurge</span><span class="token punctuation">:</span> <span class="token number">1</span>        <span class="token comment"># 更新过程中最多比期望值多 1 个 Pod</span></span>
<span class="line">      <span class="token key atrule">maxUnavailable</span><span class="token punctuation">:</span> <span class="token number">1</span>  <span class="token comment"># 更新过程中最多有 1 个 Pod 不可用</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">          <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">          <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="暂停和恢复更新" tabindex="-1"><a class="header-anchor" href="#暂停和恢复更新"><span>暂停和恢复更新</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 暂停 Deployment 更新</span></span>
<span class="line">kubectl rollout pause deployment deploy1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 执行多次修改（不会立即触发更新）</span></span>
<span class="line">kubectl <span class="token builtin class-name">set</span> image deployment deploy1 nginx-containers<span class="token operator">=</span>nginx:1.19</span>
<span class="line">kubectl <span class="token builtin class-name">set</span> resources deployment deploy1 <span class="token parameter variable">--limits</span><span class="token operator">=</span>cpu<span class="token operator">=</span>500m,memory<span class="token operator">=</span>256Mi</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 恢复更新（一次性应用所有修改）</span></span>
<span class="line">kubectl rollout resume deployment deploy1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_4-daemonset-控制器" tabindex="-1"><a class="header-anchor" href="#_4-daemonset-控制器"><span>4. DaemonSet 控制器</span></a></h2><h3 id="基本概念-2" tabindex="-1"><a class="header-anchor" href="#基本概念-2"><span>基本概念</span></a></h3><p>DaemonSet 确保在每个节点上运行一个 Pod 副本，常用于日志收集、监控代理等场景。</p><hr><h3 id="创建-daemonset" tabindex="-1"><a class="header-anchor" href="#创建-daemonset"><span>创建 DaemonSet</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> DaemonSet</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>ds</span>
<span class="line">  <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">          <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">          <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 DaemonSet</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> ds-nginx.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 DaemonSet 和 Pod</span></span>
<span class="line">kubectl get ds</span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx <span class="token parameter variable">-o</span> wide</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证每个节点都有一个 Pod</span></span>
<span class="line">kubectl get nodes</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="节点选择器" tabindex="-1"><a class="header-anchor" href="#节点选择器"><span>节点选择器</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> DaemonSet</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>ds<span class="token punctuation">-</span>labeled</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">nodeSelector</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">disk</span><span class="token punctuation">:</span> ssd  <span class="token comment"># 只在带有 disk=ssd 标签的节点运行</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">          <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">          <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 给节点打标签</span></span>
<span class="line">kubectl label nodes k8s-node-11 <span class="token assign-left variable">disk</span><span class="token operator">=</span>ssd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证 DaemonSet 只在指定节点运行</span></span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx <span class="token parameter variable">-o</span> wide</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_5-statefulset-控制器" tabindex="-1"><a class="header-anchor" href="#_5-statefulset-控制器"><span>5. StatefulSet 控制器</span></a></h2><h3 id="基本概念-3" tabindex="-1"><a class="header-anchor" href="#基本概念-3"><span>基本概念</span></a></h3><p>StatefulSet 用于管理有状态应用，如数据库、消息队列等。它提供稳定的网络标识、持久化存储和有序部署。</p><hr><h3 id="创建-statefulset" tabindex="-1"><a class="header-anchor" href="#创建-statefulset"><span>创建 StatefulSet</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Service</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>svc</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None</span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">  <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line">      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>sts</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>svc</span>
<span class="line">  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">          <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine</span>
<span class="line">          <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 Service 和 StatefulSet</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> sts-nginx.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 StatefulSet 和 Pod</span></span>
<span class="line">kubectl get sts</span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 注意 Pod 名称的有序性</span></span>
<span class="line"><span class="token comment"># nginx-sts-0, nginx-sts-1, nginx-sts-2</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="statefulset-特性" tabindex="-1"><a class="header-anchor" href="#statefulset-特性"><span>StatefulSet 特性</span></a></h3><table><thead><tr><th style="text-align:left;">特性</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>稳定的网络标识</strong></td><td style="text-align:left;">Pod 名称固定，如 nginx-sts-0、nginx-sts-1</td></tr><tr><td style="text-align:left;"><strong>有序部署</strong></td><td style="text-align:left;">按顺序创建 Pod，前一个就绪后才创建下一个</td></tr><tr><td style="text-align:left;"><strong>有序删除</strong></td><td style="text-align:left;">按逆序删除 Pod</td></tr><tr><td style="text-align:left;"><strong>有序滚动更新</strong></td><td style="text-align:left;">从最大序号开始更新</td></tr><tr><td style="text-align:left;"><strong>持久化存储</strong></td><td style="text-align:left;">每个 Pod 可绑定独立的 PVC</td></tr></tbody></table><hr><h3 id="扩缩容-2" tabindex="-1"><a class="header-anchor" href="#扩缩容-2"><span>扩缩容</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 扩容</span></span>
<span class="line">kubectl scale statefulset nginx-sts <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">5</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 缩容</span></span>
<span class="line">kubectl scale statefulset nginx-sts <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证</span></span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_6-job-控制器" tabindex="-1"><a class="header-anchor" href="#_6-job-控制器"><span>6. Job 控制器</span></a></h2><h3 id="基本概念-4" tabindex="-1"><a class="header-anchor" href="#基本概念-4"><span>基本概念</span></a></h3><p>Job 用于一次性任务，确保任务成功完成。Pod 成功退出后，Job 不会重启 Pod。</p><hr><h3 id="创建-job" tabindex="-1"><a class="header-anchor" href="#创建-job"><span>创建 Job</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> batch/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Job</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> pi<span class="token punctuation">-</span>job</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">completions</span><span class="token punctuation">:</span> <span class="token number">3</span>      <span class="token comment"># 需要完成 3 个 Pod</span></span>
<span class="line">  <span class="token key atrule">parallelism</span><span class="token punctuation">:</span> <span class="token number">1</span>     <span class="token comment"># 并发运行 1 个 Pod</span></span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> pi</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> pi</span>
<span class="line">          <span class="token key atrule">image</span><span class="token punctuation">:</span> perl</span>
<span class="line">          <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;perl&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-Mbignum=bpi&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-wle&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;print bpi(2000)&quot;</span><span class="token punctuation">]</span></span>
<span class="line">      <span class="token key atrule">restartPolicy</span><span class="token punctuation">:</span> Never</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 Job</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> job-pi.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 Job 和 Pod</span></span>
<span class="line">kubectl get job</span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>pi</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 Pod 日志</span></span>
<span class="line">kubectl logs <span class="token operator">&lt;</span>pod-name<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="job-类型" tabindex="-1"><a class="header-anchor" href="#job-类型"><span>Job 类型</span></a></h3><table><thead><tr><th style="text-align:left;">类型</th><th style="text-align:left;">completions</th><th style="text-align:left;">parallelism</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>非并发 Job</strong></td><td style="text-align:left;">1</td><td style="text-align:left;">1</td><td style="text-align:left;">串行执行，完成 1 个 Pod</td></tr><tr><td style="text-align:left;"><strong>固定完成次数</strong></td><td style="text-align:left;">N</td><td style="text-align:left;">1</td><td style="text-align:left;">串行执行，完成 N 个 Pod</td></tr><tr><td style="text-align:left;"><strong>并行 Job</strong></td><td style="text-align:left;">N</td><td style="text-align:left;">M</td><td style="text-align:left;">并行执行，最多 M 个 Pod 同时运行</td></tr><tr><td style="text-align:left;"><strong>工作队列</strong></td><td style="text-align:left;">不设置</td><td style="text-align:left;">不设置</td><td style="text-align:left;">Pod 自行协调完成</td></tr></tbody></table><hr><h2 id="_7-cronjob-控制器" tabindex="-1"><a class="header-anchor" href="#_7-cronjob-控制器"><span>7. CronJob 控制器</span></a></h2><h3 id="基本概念-5" tabindex="-1"><a class="header-anchor" href="#基本概念-5"><span>基本概念</span></a></h3><p>CronJob 用于定时任务，基于 Cron 表达式调度 Job。</p><hr><h3 id="创建-cronjob" tabindex="-1"><a class="header-anchor" href="#创建-cronjob"><span>创建 CronJob</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> batch/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> CronJob</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> hello<span class="token punctuation">-</span>cronjob</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">schedule</span><span class="token punctuation">:</span> <span class="token string">&quot;*/1 * * * *&quot;</span>  <span class="token comment"># 每分钟执行一次</span></span>
<span class="line">  <span class="token key atrule">jobTemplate</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">completions</span><span class="token punctuation">:</span> <span class="token number">1</span></span>
<span class="line">      <span class="token key atrule">parallelism</span><span class="token punctuation">:</span> <span class="token number">1</span></span>
<span class="line">      <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> hello</span>
<span class="line">              <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox</span>
<span class="line">              <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent</span>
<span class="line">              <span class="token key atrule">command</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token punctuation">-</span> sh</span>
<span class="line">                <span class="token punctuation">-</span> <span class="token punctuation">-</span>c</span>
<span class="line">                <span class="token punctuation">-</span> <span class="token string">&quot;date; echo &#39;Hello from Kubernetes&#39;&quot;</span></span>
<span class="line">          <span class="token key atrule">restartPolicy</span><span class="token punctuation">:</span> OnFailure</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 CronJob</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> cronjob-hello.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 CronJob 和 Job</span></span>
<span class="line">kubectl get cronjob</span>
<span class="line">kubectl get job</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 等待一分钟后查看</span></span>
<span class="line">kubectl get pods</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="cron-表达式格式" tabindex="-1"><a class="header-anchor" href="#cron-表达式格式"><span>Cron 表达式格式</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># ┌───────────── 分钟 (0 - 59)</span>
<span class="line"># │ ┌───────────── 小时 (0 - 23)</span>
<span class="line"># │ │ ┌───────────── 日 (1 - 31)</span>
<span class="line"># │ │ │ ┌───────────── 月 (1 - 12)</span>
<span class="line"># │ │ │ │ ┌───────────── 星期 (0 - 6) (0 = 周日)</span>
<span class="line"># │ │ │ │ │</span>
<span class="line"># │ │ │ │ │</span>
<span class="line"># * * * * *</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="常用-cron-表达式" tabindex="-1"><a class="header-anchor" href="#常用-cron-表达式"><span>常用 Cron 表达式</span></a></h3><table><thead><tr><th style="text-align:left;">表达式</th><th style="text-align:left;">含义</th></tr></thead><tbody><tr><td style="text-align:left;"><code>*/1 * * * *</code></td><td style="text-align:left;">每分钟</td></tr><tr><td style="text-align:left;"><code>0 */1 * * *</code></td><td style="text-align:left;">每小时</td></tr><tr><td style="text-align:left;"><code>0 0 * * *</code></td><td style="text-align:left;">每天午夜</td></tr><tr><td style="text-align:left;"><code>0 0 * * 0</code></td><td style="text-align:left;">每周日午夜</td></tr><tr><td style="text-align:left;"><code>0 0 1 * *</code></td><td style="text-align:left;">每月 1 号午夜</td></tr><tr><td style="text-align:left;"><code>0 9-17 * * 1-5</code></td><td style="text-align:left;">工作日 9:00-17:00 每小时</td></tr></tbody></table><hr><h2 id="_8-控制器选择指南" tabindex="-1"><a class="header-anchor" href="#_8-控制器选择指南"><span>8. 控制器选择指南</span></a></h2><table><thead><tr><th style="text-align:left;">场景</th><th style="text-align:left;">推荐控制器</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>无状态 Web 应用</strong></td><td style="text-align:left;">Deployment</td></tr><tr><td style="text-align:left;"><strong>每个节点运行一个 Pod</strong></td><td style="text-align:left;">DaemonSet</td></tr><tr><td style="text-align:left;"><strong>有状态数据库</strong></td><td style="text-align:left;">StatefulSet</td></tr><tr><td style="text-align:left;"><strong>一次性批处理任务</strong></td><td style="text-align:left;">Job</td></tr><tr><td style="text-align:left;"><strong>定时任务</strong></td><td style="text-align:left;">CronJob</td></tr><tr><td style="text-align:left;"><strong>简单的 Pod 副本管理</strong></td><td style="text-align:left;">ReplicaSet（通常由 Deployment 管理）</td></tr></tbody></table><hr><h2 id="_9-常用命令汇总" tabindex="-1"><a class="header-anchor" href="#_9-常用命令汇总"><span>9. 常用命令汇总</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># Deployment</span></span>
<span class="line">kubectl create <span class="token parameter variable">-f</span> deploy.yaml</span>
<span class="line">kubectl get deploy</span>
<span class="line">kubectl get deploy deploy1 <span class="token parameter variable">-o</span> yaml</span>
<span class="line">kubectl scale deployment deploy1 <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">5</span></span>
<span class="line">kubectl <span class="token builtin class-name">set</span> image deployment deploy1 <span class="token assign-left variable">nginx</span><span class="token operator">=</span>nginx:1.20</span>
<span class="line">kubectl rollout status deployment deploy1</span>
<span class="line">kubectl rollout <span class="token function">history</span> deployment deploy1</span>
<span class="line">kubectl rollout undo deployment deploy1</span>
<span class="line">kubectl rollout pause deployment deploy1</span>
<span class="line">kubectl rollout resume deployment deploy1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># ReplicaSet</span></span>
<span class="line">kubectl get rs</span>
<span class="line">kubectl scale rs nginx-rs <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">3</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># DaemonSet</span></span>
<span class="line">kubectl get ds</span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>nginx <span class="token parameter variable">-o</span> wide</span>
<span class="line"></span>
<span class="line"><span class="token comment"># StatefulSet</span></span>
<span class="line">kubectl get sts</span>
<span class="line">kubectl scale statefulset nginx-sts <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">5</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Job</span></span>
<span class="line">kubectl get job</span>
<span class="line">kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>pi</span>
<span class="line"></span>
<span class="line"><span class="token comment"># CronJob</span></span>
<span class="line">kubectl get cronjob</span>
<span class="line">kubectl get job</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_10-最佳实践" tabindex="-1"><a class="header-anchor" href="#_10-最佳实践"><span>10. 最佳实践</span></a></h2><ol><li><strong>使用 Deployment 而非直接使用 ReplicaSet</strong>：Deployment 提供滚动更新和回滚功能</li><li><strong>合理设置资源限制</strong>：为每个 Pod 设置 CPU 和内存的 requests 和 limits</li><li><strong>配置健康检查</strong>：使用 livenessProbe 和 readinessProbe</li><li><strong>使用标签选择器</strong>：通过标签组织和管理资源</li><li><strong>监控控制器状态</strong>：定期检查 Deployment、DaemonSet 等的状态</li><li><strong>合理设置更新策略</strong>：根据业务需求调整 maxSurge 和 maxUnavailable</li><li><strong>有状态应用使用 StatefulSet</strong>：确保稳定的网络标识和持久化存储</li><li><strong>定时任务使用 CronJob</strong>：避免手动调度 Job</li></ol>`,107)])])}const o=n(t,[["render",p]]),r=JSON.parse('{"path":"/05-%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92/03-kubernetes%E7%BC%96%E6%8E%92/4-k8s%E6%8E%A7%E5%88%B6%E5%99%A8.html","title":"Kubernetes 控制器汇总","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"05-容器编排/03-kubernetes编排/4-k8s控制器.md"}');export{o as comp,r as data};
