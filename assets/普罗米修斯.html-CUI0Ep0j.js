import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i="/assets/image-20260128170736776-D_yasfhW.png",p="/assets/image-20260128214236537-ChiXDm_9.png",t={};function c(o,s){return l(),a("div",null,[...s[0]||(s[0]=[e('<h1 id="prometheus" tabindex="-1"><a class="header-anchor" href="#prometheus"><span>Prometheus</span></a></h1><h2 id="prometheus介绍" tabindex="-1"><a class="header-anchor" href="#prometheus介绍"><span>Prometheus介绍</span></a></h2><p>Prometheus是一种开源的监控系统，最初由SoundCloud开发并于2012年发布。它是一种基于指标的监控系统，能够收集、存储和查询来自各种应用程序、服务和系统的度量数据。这些度量数据可以表示应用程序和系统的性能、健康状况和状态等信息。</p><p>Prometheus已经成为了云原生中指标监控的事实标准。它提供了一个灵活的数据模型和查询语言，支持多维度度量数据的聚合和图形化展示，使得开发人员和系统管理员能够快速地诊断和解决问题。此外，Prometheus还提供了一系列的工具和库，使得它可以轻松地与其他系统和服务集成。</p><h2 id="kubernetes监控接口标准化" tabindex="-1"><a class="header-anchor" href="#kubernetes监控接口标准化"><span>Kubernetes监控接口标准化</span></a></h2><p>Kubernetes对监控接口进行了标准化，分为三类：</p><h3 id="_1-resource-metrics" tabindex="-1"><a class="header-anchor" href="#_1-resource-metrics"><span>1. Resource Metrics</span></a></h3><ul><li><strong>接口</strong>: <code>metrics.k8s.io</code></li><li><strong>实现</strong>: metrics-server</li><li><strong>功能</strong>: 提供节点、Pod、Namespace、Class级别的资源监控</li><li><strong>类比Zabbix</strong>: 类似基础监控项</li></ul><h3 id="_2-custom-metrics" tabindex="-1"><a class="header-anchor" href="#_2-custom-metrics"><span>2. Custom Metrics</span></a></h3><ul><li><strong>接口</strong>: <code>custom.metrics.k8s.io</code></li><li><strong>实现</strong>: Prometheus</li><li><strong>功能</strong>: <ul><li>资源监控（与Resource Metrics有重叠）</li><li>自定义监控（如应用级指标：在线人数、MySQL慢查询等）</li></ul></li></ul><h3 id="_3-external-metrics" tabindex="-1"><a class="header-anchor" href="#_3-external-metrics"><span>3. External Metrics</span></a></h3><ul><li><strong>接口</strong>: <code>external.metrics.k8s.io</code></li><li><strong>实现</strong>: 云厂商Provider</li><li><strong>功能</strong>: 云资源监控指标</li></ul><h2 id="prometheus架构" tabindex="-1"><a class="header-anchor" href="#prometheus架构"><span>Prometheus架构</span></a></h2><h3 id="核心组件工作流程" tabindex="-1"><a class="header-anchor" href="#核心组件工作流程"><span>核心组件工作流程</span></a></h3><p><img src="'+i+`" alt="image-20260128170736776"></p><h3 id="组件详解" tabindex="-1"><a class="header-anchor" href="#组件详解"><span>组件详解</span></a></h3><ol><li><strong>Exporter</strong><ul><li>被监控对象提供的组件</li><li>通过API暴露监控指标</li><li>支持预定义和自定义Exporter</li><li>示例：Node Exporter（主机监控）、Blackbox Exporter（网络监控）</li></ul></li><li><strong>Prometheus Server</strong><ul><li>核心监控和告警平台</li><li>定期从Exporter抓取指标数据</li><li>存储到时间序列数据库（TSDB）</li><li>执行查询和告警规则</li></ul></li><li><strong>Pushgateway</strong><ul><li>提供网关地址接收外部推送数据</li><li>适用于批处理任务或短生命周期任务</li></ul></li><li><strong>Alertmanager</strong><ul><li>接收Prometheus的告警</li><li>进行聚合、去重、降噪处理</li><li>发送告警到指定目标</li></ul></li><li><strong>Grafana</strong><ul><li>数据可视化平台</li><li>配置Prometheus为数据源</li><li>自定义仪表盘和警报</li></ul></li></ol><hr><h1 id="部署prometheus" tabindex="-1"><a class="header-anchor" href="#部署prometheus"><span>部署Prometheus</span></a></h1><h2 id="docker部署" tabindex="-1"><a class="header-anchor" href="#docker部署"><span>Docker部署</span></a></h2><p>实现快速测试、本地学习、熟悉UI、理解metrics</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--name</span> prometheus <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">9090</span>:9090 prom/prometheus:v3.9.1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="查看配置" tabindex="-1"><a class="header-anchor" href="#查看配置"><span>查看配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@docker200 ~<span class="token punctuation">]</span><span class="token comment">#docker exec -it prometheus sh</span></span>
<span class="line">/prometheus $ <span class="token function">ps</span> <span class="token parameter variable">-ef</span></span>
<span class="line">PID   <span class="token environment constant">USER</span>     TIME  COMMAND</span>
<span class="line">    <span class="token number">1</span> nobody    <span class="token number">0</span>:00 /bin/prometheus <span class="token parameter variable">--config.file</span><span class="token operator">=</span>/etc/prometheus/prometheus.yml <span class="token parameter variable">--storage.tsdb.path</span><span class="token operator">=</span>/prometheus</span>
<span class="line">   <span class="token number">22</span> nobody    <span class="token number">0</span>:00 <span class="token function">sh</span></span>
<span class="line">   <span class="token number">27</span> nobody    <span class="token number">0</span>:00 <span class="token function">ps</span> <span class="token parameter variable">-ef</span></span>
<span class="line">/prometheus $ <span class="token function">cat</span> /etc/prometheus/prometheus.yml</span>
<span class="line"><span class="token comment"># my global config</span></span>
<span class="line">global:</span>
<span class="line">  scrape_interval: 15s <span class="token comment"># Set the scrape interval to every 15 seconds. Default is every 1 minute.</span></span>
<span class="line">  evaluation_interval: 15s <span class="token comment"># Evaluate rules every 15 seconds. The default is every 1 minute.</span></span>
<span class="line">  <span class="token comment"># scrape_timeout is set to the global default (10s).</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Alertmanager configuration</span></span>
<span class="line">alerting:</span>
<span class="line">  alertmanagers:</span>
<span class="line">    - static_configs:</span>
<span class="line">        - targets:</span>
<span class="line">          <span class="token comment"># - alertmanager:9093</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Load rules once and periodically evaluate them according to the global &#39;evaluation_interval&#39;.</span></span>
<span class="line">rule_files:</span>
<span class="line">  <span class="token comment"># - &quot;first_rules.yml&quot;</span></span>
<span class="line">  <span class="token comment"># - &quot;second_rules.yml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># A scrape configuration containing exactly one endpoint to scrape:</span></span>
<span class="line"><span class="token comment"># Here it&#39;s Prometheus itself.</span></span>
<span class="line">scrape_configs:</span>
<span class="line">  <span class="token comment"># The job name is added as a label \`job=&lt;job_name&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">  - job_name: <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># metrics_path defaults to &#39;/metrics&#39;</span></span>
<span class="line">    <span class="token comment"># scheme defaults to &#39;http&#39;.</span></span>
<span class="line"></span>
<span class="line">    static_configs:</span>
<span class="line">      - targets: <span class="token punctuation">[</span><span class="token string">&quot;localhost:9090&quot;</span><span class="token punctuation">]</span></span>
<span class="line">       <span class="token comment"># The label name is added as a label \`label_name=&lt;label_value&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">        labels:</span>
<span class="line">          app: <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="kubernetes部署" tabindex="-1"><a class="header-anchor" href="#kubernetes部署"><span>kubernetes部署</span></a></h2><h3 id="步骤1-创建命名空间" tabindex="-1"><a class="header-anchor" href="#步骤1-创建命名空间"><span>步骤1：创建命名空间</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl create ns monitor</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="步骤2-创建configmap挂载配置文件" tabindex="-1"><a class="header-anchor" href="#步骤2-创建configmap挂载配置文件"><span>步骤2：创建ConfigMap挂载配置文件</span></a></h3><p>prometheus.yml</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">global</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">scrape_interval</span><span class="token punctuation">:</span> 15s <span class="token comment"># Set the scrape interval to every 15 seconds. Default is every 1 minute.</span></span>
<span class="line">  <span class="token key atrule">evaluation_interval</span><span class="token punctuation">:</span> 15s <span class="token comment"># Evaluate rules every 15 seconds. The default is every 1 minute.</span></span>
<span class="line">  <span class="token comment"># scrape_timeout is set to the global default (10s).</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Alertmanager configuration</span></span>
<span class="line"><span class="token key atrule">alerting</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">alertmanagers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token comment"># - alertmanager:9093</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Load rules once and periodically evaluate them according to the global &#39;evaluation_interval&#39;.</span></span>
<span class="line"><span class="token key atrule">rule_files</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token comment"># - &quot;first_rules.yml&quot;</span></span>
<span class="line">  <span class="token comment"># - &quot;second_rules.yml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># A scrape configuration containing exactly one endpoint to scrape:</span></span>
<span class="line"><span class="token comment"># Here it&#39;s Prometheus itself.</span></span>
<span class="line"><span class="token key atrule">scrape_configs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token comment"># The job name is added as a label \`job=&lt;job_name&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># metrics_path defaults to &#39;/metrics&#39;</span></span>
<span class="line">    <span class="token comment"># scheme defaults to &#39;http&#39;.</span></span>
<span class="line"></span>
<span class="line">    <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;localhost:9090&quot;</span><span class="token punctuation">]</span></span>
<span class="line">       <span class="token comment"># The label name is added as a label \`label_name=&lt;label_value&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">        <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">app</span><span class="token punctuation">:</span> <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl <span class="token parameter variable">-n</span> monitor create configmap prometheus-config --from-file<span class="token operator">=</span>prometheus.yml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>验证</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n monitor get cm</span></span>
<span class="line">NAME                DATA   AGE</span>
<span class="line">kube-root-ca.crt    <span class="token number">1</span>      100s</span>
<span class="line">prometheus-config   <span class="token number">1</span>      16s</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="步骤3-创建pv-pvc" tabindex="-1"><a class="header-anchor" href="#步骤3-创建pv-pvc"><span>步骤3：创建PV + PVC</span></a></h3><p>pv-prometheus.yaml</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolume</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>nfs<span class="token punctuation">-</span>pv</span>
<span class="line">  <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> nfs</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">capacity</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">storage</span><span class="token punctuation">:</span> 20Gi  <span class="token comment"># PV 的容量</span></span>
<span class="line">  <span class="token key atrule">volumeMode</span><span class="token punctuation">:</span> Filesystem</span>
<span class="line">  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> ReadWriteMany  <span class="token comment"># NFS 支持多节点同时读写</span></span>
<span class="line">    <span class="token punctuation">-</span> ReadWriteOnce    <span class="token comment"># 单节点读写</span></span>
<span class="line">    <span class="token punctuation">-</span> ReadOnlyMany     <span class="token comment"># 多节点只读</span></span>
<span class="line">  <span class="token key atrule">persistentVolumeReclaimPolicy</span><span class="token punctuation">:</span> Retain  <span class="token comment"># 删除 PVC 后保留数据</span></span>
<span class="line">  <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> <span class="token string">&quot;&quot;</span></span>
<span class="line">  <span class="token key atrule">mountOptions</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> hard</span>
<span class="line">    <span class="token punctuation">-</span> nfsvers=4.1</span>
<span class="line">  <span class="token key atrule">nfs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">server</span><span class="token punctuation">:</span> 10.0.0.31</span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/data/nfs&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>pvc-prometheus.yaml</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolumeClaim</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> monitor</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> ReadWriteMany <span class="token comment"># 与pv的</span></span>
<span class="line">  <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> <span class="token string">&quot;&quot;</span></span>
<span class="line">  <span class="token key atrule">resources</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">requests</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">storage</span><span class="token punctuation">:</span> 20Gi</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="storageclass-动态存储供应" tabindex="-1"><a class="header-anchor" href="#storageclass-动态存储供应"><span>StorageClass 动态存储供应</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1.1 安装 NFS Provisioner</span></span>
<span class="line"><span class="token comment"># 首先需要安装 NFS 客户端 provisioner：</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># nfs-subdir-external-provisioner.yaml</span></span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: Namespace</span>
<span class="line">metadata:</span>
<span class="line">  name: nfs-storage</span>
<span class="line">---</span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: ServiceAccount</span>
<span class="line">metadata:</span>
<span class="line">  name: nfs-client-provisioner</span>
<span class="line">  namespace: nfs-storage</span>
<span class="line">---</span>
<span class="line">apiVersion: rbac.authorization.k8s.io/v1</span>
<span class="line">kind: ClusterRole</span>
<span class="line">metadata:</span>
<span class="line">  name: nfs-client-provisioner-runner</span>
<span class="line">rules:</span>
<span class="line">  - apiGroups: <span class="token punctuation">[</span><span class="token string">&quot;&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    resources: <span class="token punctuation">[</span><span class="token string">&quot;persistentvolumes&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    verbs: <span class="token punctuation">[</span><span class="token string">&quot;get&quot;</span>, <span class="token string">&quot;list&quot;</span>, <span class="token string">&quot;watch&quot;</span>, <span class="token string">&quot;create&quot;</span>, <span class="token string">&quot;delete&quot;</span><span class="token punctuation">]</span></span>
<span class="line">  - apiGroups: <span class="token punctuation">[</span><span class="token string">&quot;&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    resources: <span class="token punctuation">[</span><span class="token string">&quot;persistentvolumeclaims&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    verbs: <span class="token punctuation">[</span><span class="token string">&quot;get&quot;</span>, <span class="token string">&quot;list&quot;</span>, <span class="token string">&quot;watch&quot;</span>, <span class="token string">&quot;update&quot;</span><span class="token punctuation">]</span></span>
<span class="line">  - apiGroups: <span class="token punctuation">[</span><span class="token string">&quot;storage.k8s.io&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    resources: <span class="token punctuation">[</span><span class="token string">&quot;storageclasses&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    verbs: <span class="token punctuation">[</span><span class="token string">&quot;get&quot;</span>, <span class="token string">&quot;list&quot;</span>, <span class="token string">&quot;watch&quot;</span><span class="token punctuation">]</span></span>
<span class="line">  - apiGroups: <span class="token punctuation">[</span><span class="token string">&quot;&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    resources: <span class="token punctuation">[</span><span class="token string">&quot;events&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    verbs: <span class="token punctuation">[</span><span class="token string">&quot;create&quot;</span>, <span class="token string">&quot;update&quot;</span>, <span class="token string">&quot;patch&quot;</span><span class="token punctuation">]</span></span>
<span class="line">---</span>
<span class="line">apiVersion: rbac.authorization.k8s.io/v1</span>
<span class="line">kind: ClusterRoleBinding</span>
<span class="line">metadata:</span>
<span class="line">  name: run-nfs-client-provisioner</span>
<span class="line">subjects:</span>
<span class="line">  - kind: ServiceAccount</span>
<span class="line">    name: nfs-client-provisioner</span>
<span class="line">    namespace: nfs-storage</span>
<span class="line">roleRef:</span>
<span class="line">  kind: ClusterRole</span>
<span class="line">  name: nfs-client-provisioner-runner</span>
<span class="line">  apiGroup: rbac.authorization.k8s.io</span>
<span class="line">---</span>
<span class="line">apiVersion: rbac.authorization.k8s.io/v1</span>
<span class="line">kind: Role</span>
<span class="line">metadata:</span>
<span class="line">  name: leader-locking-nfs-client-provisioner</span>
<span class="line">  namespace: nfs-storage</span>
<span class="line">rules:</span>
<span class="line">  - apiGroups: <span class="token punctuation">[</span><span class="token string">&quot;&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    resources: <span class="token punctuation">[</span><span class="token string">&quot;endpoints&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    verbs: <span class="token punctuation">[</span><span class="token string">&quot;get&quot;</span>, <span class="token string">&quot;list&quot;</span>, <span class="token string">&quot;watch&quot;</span>, <span class="token string">&quot;create&quot;</span>, <span class="token string">&quot;update&quot;</span>, <span class="token string">&quot;patch&quot;</span><span class="token punctuation">]</span></span>
<span class="line">---</span>
<span class="line">apiVersion: rbac.authorization.k8s.io/v1</span>
<span class="line">kind: RoleBinding</span>
<span class="line">metadata:</span>
<span class="line">  name: leader-locking-nfs-client-provisioner</span>
<span class="line">  namespace: nfs-storage</span>
<span class="line">subjects:</span>
<span class="line">  - kind: ServiceAccount</span>
<span class="line">    name: nfs-client-provisioner</span>
<span class="line">    namespace: nfs-storage</span>
<span class="line">roleRef:</span>
<span class="line">  kind: Role</span>
<span class="line">  name: leader-locking-nfs-client-provisioner</span>
<span class="line">  apiGroup: rbac.authorization.k8s.io</span>
<span class="line">---</span>
<span class="line">apiVersion: apps/v1</span>
<span class="line">kind: Deployment</span>
<span class="line">metadata:</span>
<span class="line">  name: nfs-client-provisioner</span>
<span class="line">  namespace: nfs-storage</span>
<span class="line">spec:</span>
<span class="line">  replicas: <span class="token number">1</span></span>
<span class="line">  selector:</span>
<span class="line">    matchLabels:</span>
<span class="line">      app: nfs-client-provisioner</span>
<span class="line">  strategy:</span>
<span class="line">    type: Recreate</span>
<span class="line">  template:</span>
<span class="line">    metadata:</span>
<span class="line">      labels:</span>
<span class="line">        app: nfs-client-provisioner</span>
<span class="line">    spec:</span>
<span class="line">      serviceAccountName: nfs-client-provisioner</span>
<span class="line">      containers:</span>
<span class="line">        - name: nfs-client-provisioner</span>
<span class="line">          image: swr.cn-north-4.myhuaweicloud.com/ddn-k8s/k8s.gcr.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2</span>
<span class="line">          volumeMounts:</span>
<span class="line">            - name: nfs-client-root</span>
<span class="line">              mountPath: /persistentvolumes</span>
<span class="line">          env:</span>
<span class="line">            - name: PROVISIONER_NAME</span>
<span class="line">              value: k8s-sigs.io/nfs-subdir-external-provisioner</span>
<span class="line">            - name: NFS_SERVER</span>
<span class="line">              value: <span class="token number">10.0</span>.0.31  <span class="token comment"># 你的NFS服务器IP</span></span>
<span class="line">            - name: NFS_PATH</span>
<span class="line">              value: /data/nfs</span>
<span class="line">      volumes:</span>
<span class="line">        - name: nfs-client-root</span>
<span class="line">          nfs:</span>
<span class="line">            server: <span class="token number">10.0</span>.0.31</span>
<span class="line">            path: /data/nfs</span>
<span class="line"><span class="token comment"># 1.2 创建 StorageClass</span></span>
<span class="line"><span class="token comment"># storageclass-nfs.yaml</span></span>
<span class="line"></span>
<span class="line">apiVersion: storage.k8s.io/v1</span>
<span class="line">kind: StorageClass</span>
<span class="line">metadata:</span>
<span class="line">  name: nfs</span>
<span class="line">  annotations:</span>
<span class="line">    storageclass.kubernetes.io/is-default-class: <span class="token string">&quot;true&quot;</span>  <span class="token comment"># 设为默认存储类</span></span>
<span class="line">provisioner: k8s-sigs.io/nfs-subdir-external-provisioner</span>
<span class="line">parameters:</span>
<span class="line">  archiveOnDelete: <span class="token string">&quot;false&quot;</span>  <span class="token comment"># 删除PV时是否存档数据</span></span>
<span class="line">  pathPattern: <span class="token string">&quot;<span class="token variable">\${.PVC.namespace}</span>/<span class="token variable">\${.PVC.name}</span>&quot;</span>  <span class="token comment"># 在NFS服务器上创建子目录的格式</span></span>
<span class="line">reclaimPolicy: Retain  <span class="token comment"># 或 Delete</span></span>
<span class="line">volumeBindingMode: Immediate</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 应用配置：</span></span>
<span class="line">kubectl apply <span class="token parameter variable">-f</span> nfs-subdir-external-provisioner.yaml</span>
<span class="line">kubectl apply <span class="token parameter variable">-f</span> storageclass-nfs.yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 2. 使用 StorageClass</span></span>
<span class="line"><span class="token comment"># 2.1 创建 PVC（自动创建 PV）</span></span>
<span class="line"><span class="token comment"># pvc-prometheus-dynamic.yaml</span></span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: PersistentVolumeClaim</span>
<span class="line">metadata:</span>
<span class="line">  name: prometheus-dynamic</span>
<span class="line">  namespace: monitor</span>
<span class="line">spec:</span>
<span class="line">  storageClassName: nfs  <span class="token comment"># 指定使用哪个StorageClass</span></span>
<span class="line">  accessModes:</span>
<span class="line">    - ReadWriteMany</span>
<span class="line">  resources:</span>
<span class="line">    requests:</span>
<span class="line">      storage: 20Gi</span>
<span class="line"><span class="token comment"># 2.2 在 Deployment 中使用</span></span>
<span class="line"><span class="token comment"># deployment-prometheus.yaml</span></span>
<span class="line">apiVersion: apps/v1</span>
<span class="line">kind: Deployment</span>
<span class="line">metadata:</span>
<span class="line">  name: prometheus</span>
<span class="line">  namespace: monitor</span>
<span class="line">spec:</span>
<span class="line">  replicas: <span class="token number">1</span></span>
<span class="line">  selector:</span>
<span class="line">    matchLabels:</span>
<span class="line">      app: prometheus</span>
<span class="line">  template:</span>
<span class="line">    metadata:</span>
<span class="line">      labels:</span>
<span class="line">        app: prometheus</span>
<span class="line">    spec:</span>
<span class="line">      containers:</span>
<span class="line">      - name: prometheus</span>
<span class="line">        image: prom/prometheus:v2.45.0</span>
<span class="line">        ports:</span>
<span class="line">        - containerPort: <span class="token number">9090</span></span>
<span class="line">        volumeMounts:</span>
<span class="line">        - name: prometheus-data</span>
<span class="line">          mountPath: /prometheus</span>
<span class="line">      volumes:</span>
<span class="line">      - name: prometheus-data</span>
<span class="line">        persistentVolumeClaim:</span>
<span class="line">          claimName: prometheus-dynamic</span>
<span class="line"><span class="token comment"># 3. 验证动态供应</span></span>
<span class="line"><span class="token comment"># 创建 PVC</span></span>
<span class="line">kubectl apply <span class="token parameter variable">-f</span> pvc-prometheus-dynamic.yaml <span class="token parameter variable">-n</span> monitor</span>
<span class="line"><span class="token comment"># 查看 PVC 状态（应该立即绑定）</span></span>
<span class="line">kubectl get pvc <span class="token parameter variable">-n</span> monitor</span>
<span class="line"><span class="token comment"># 查看自动创建的 PV</span></span>
<span class="line">kubectl get <span class="token function">pv</span></span>
<span class="line"><span class="token comment"># 查看 PV 详情</span></span>
<span class="line">kubectl describe <span class="token function">pv</span> <span class="token operator">&lt;</span>pv-name<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="步骤4-创建deployment" tabindex="-1"><a class="header-anchor" href="#步骤4-创建deployment"><span>步骤4：创建Deployment</span></a></h3><p>deployment-prometheus.yaml</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> monitor</span>
<span class="line">  <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">app</span><span class="token punctuation">:</span> prometheus</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">      <span class="token key atrule">initContainers</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;change-permission-of-directory&quot;</span></span>
<span class="line">        <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox</span>
<span class="line">        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token key atrule">args</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;chown -R 65534:65534 /prometheus&quot;</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token key atrule">securityContext</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/etc/prometheus&quot;</span></span>
<span class="line">          <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/prometheus&quot;</span></span>
<span class="line">          <span class="token key atrule">name</span><span class="token punctuation">:</span> data</span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> prom/prometheus<span class="token punctuation">:</span>v2.28.0</span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">        <span class="token key atrule">args</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">&quot;--config.file=/etc/prometheus/prometheus.yml&quot;</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">&quot;--storage.tsdb.path=/prometheus&quot;</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">&quot;--web.enable-lifecycle&quot;</span></span>
<span class="line">        <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9090</span></span>
<span class="line">          <span class="token key atrule">name</span><span class="token punctuation">:</span> http</span>
<span class="line">        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/etc/prometheus&quot;</span></span>
<span class="line">          <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/prometheus&quot;</span></span>
<span class="line">          <span class="token key atrule">name</span><span class="token punctuation">:</span> data</span>
<span class="line">        <span class="token key atrule">resources</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">requests</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m</span>
<span class="line">            <span class="token key atrule">memory</span><span class="token punctuation">:</span> 512Mi</span>
<span class="line">          <span class="token key atrule">limits</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m</span>
<span class="line">            <span class="token key atrule">memory</span><span class="token punctuation">:</span> 512Mi</span>
<span class="line">      <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> data</span>
<span class="line">        <span class="token key atrule">persistentVolumeClaim</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">claimName</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">configMap</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>config</span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="步骤5-创建rbac权限" tabindex="-1"><a class="header-anchor" href="#步骤5-创建rbac权限"><span>步骤5：创建RBAC权限</span></a></h3><p>rbac-prometheus.yaml</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> monitor</span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line"><span class="token key atrule">rules</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">apiGroups</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">&quot;&quot;</span></span>
<span class="line">  <span class="token key atrule">resources</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> nodes</span>
<span class="line">  <span class="token punctuation">-</span> services</span>
<span class="line">  <span class="token punctuation">-</span> endpoints</span>
<span class="line">  <span class="token punctuation">-</span> pods</span>
<span class="line">  <span class="token punctuation">-</span> nodes/proxy</span>
<span class="line">  <span class="token key atrule">verbs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> get</span>
<span class="line">  <span class="token punctuation">-</span> list</span>
<span class="line">  <span class="token punctuation">-</span> watch</span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">apiGroups</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">&quot;extensions&quot;</span></span>
<span class="line">  <span class="token key atrule">resources</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> ingresses</span>
<span class="line">  <span class="token key atrule">verbs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> get</span>
<span class="line">  <span class="token punctuation">-</span> list</span>
<span class="line">  <span class="token punctuation">-</span> watch</span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">apiGroups</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">&quot;&quot;</span></span>
<span class="line">  <span class="token key atrule">resources</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> configmaps</span>
<span class="line">  <span class="token punctuation">-</span> nodes/metrics</span>
<span class="line">  <span class="token key atrule">verbs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> get</span>
<span class="line">  </span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">nonResourceURLs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> /metrics</span>
<span class="line">  <span class="token key atrule">verbs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> get</span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRoleBinding</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line"><span class="token key atrule">roleRef</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io</span>
<span class="line">  <span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole</span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line"><span class="token key atrule">subjects</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount</span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> monitor</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="步骤6-创建service和ingress" tabindex="-1"><a class="header-anchor" href="#步骤6-创建service和ingress"><span>步骤6：创建Service和Ingress</span></a></h3><p>svc-prometheus.yaml</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Service</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> monitor</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">app</span><span class="token punctuation">:</span> prometheus</span>
<span class="line">  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP</span>
<span class="line">  <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> web</span>
<span class="line">      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9090</span></span>
<span class="line">      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> http</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ingress-prometheus.yaml</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">apiVersion: networking.k8s.io/v1</span>
<span class="line">kind: Ingress</span>
<span class="line">metadata:</span>
<span class="line">  name: prometheus</span>
<span class="line">  namespace: monitor</span>
<span class="line">spec:</span>
<span class="line">  ingressClassName: nginx</span>
<span class="line">  rules:</span>
<span class="line">  - host: prometheus.example.com</span>
<span class="line">    http:</span>
<span class="line">      paths:</span>
<span class="line">      - path: /</span>
<span class="line">        pathType: Prefix</span>
<span class="line">        backend:</span>
<span class="line">          service:</span>
<span class="line">            name: prometheus</span>
<span class="line">            port:</span>
<span class="line">              number: <span class="token number">9090</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="步骤7-部署所有资源" tabindex="-1"><a class="header-anchor" href="#步骤7-部署所有资源"><span>步骤7：部署所有资源</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#ll</span></span>
<span class="line">total <span class="token number">24</span></span>
<span class="line">drwxr-xr-x <span class="token number">2</span> root root   <span class="token number">28</span> Jan <span class="token number">28</span> <span class="token number">19</span>:36 config</span>
<span class="line">-rw-r--r-- <span class="token number">1</span> root root <span class="token number">1438</span> Jan <span class="token number">28</span> <span class="token number">18</span>:24 deployment-prometheus.yaml</span>
<span class="line">-rw-r--r-- <span class="token number">1</span> root root  <span class="token number">345</span> Jan <span class="token number">28</span> <span class="token number">19</span>:35 ingress-prometheus.yaml</span>
<span class="line">-rw-r--r-- <span class="token number">1</span> root root  <span class="token number">206</span> Jan <span class="token number">28</span> <span class="token number">18</span>:22 pvc-prometheus.yaml</span>
<span class="line">-rw-r--r-- <span class="token number">1</span> root root  <span class="token number">442</span> Jan <span class="token number">28</span> <span class="token number">19</span>:24 pv-prometheus.yaml</span>
<span class="line">-rw-r--r-- <span class="token number">1</span> root root  <span class="token number">570</span> Jan <span class="token number">28</span> <span class="token number">19</span>:33 rbac-prometheus.yaml</span>
<span class="line">-rw-r--r-- <span class="token number">1</span> root root  <span class="token number">200</span> Jan <span class="token number">28</span> <span class="token number">19</span>:34 svc-prometheus.yaml</span>
<span class="line">kubectl apply <span class="token parameter variable">-f</span> <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="验证" tabindex="-1"><a class="header-anchor" href="#验证"><span>验证</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n monitor get all</span></span>
<span class="line">NAME                              READY   STATUS    RESTARTS      AGE</span>
<span class="line">pod/prometheus-6497d6f8bc-qp9tx   <span class="token number">1</span>/1     Running   <span class="token number">1</span> <span class="token punctuation">(</span>10m ago<span class="token punctuation">)</span>   11m</span>
<span class="line"></span>
<span class="line">NAME                 TYPE        CLUSTER-IP    EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>    AGE</span>
<span class="line">service/prometheus   ClusterIP   <span class="token number">10.1</span>.218.72   <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>        <span class="token number">9090</span>/TCP   15m</span>
<span class="line"></span>
<span class="line">NAME                         READY   UP-TO-DATE   AVAILABLE   AGE</span>
<span class="line">deployment.apps/prometheus   <span class="token number">1</span>/1     <span class="token number">1</span>            <span class="token number">1</span>           15m</span>
<span class="line"></span>
<span class="line">NAME                                    DESIRED   CURRENT   READY   AGE</span>
<span class="line">replicaset.apps/prometheus-6497d6f8bc   <span class="token number">1</span>         <span class="token number">1</span>         <span class="token number">1</span>       15m</span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n monitor get svc</span></span>
<span class="line">NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>    AGE</span>
<span class="line">prometheus   ClusterIP   <span class="token number">10.1</span>.218.72   <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>        <span class="token number">9090</span>/TCP   15m</span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n monitor get pvc</span></span>
<span class="line">NAME         STATUS   VOLUME              CAPACITY   ACCESS MODES   STORAGECLASS   AGE</span>
<span class="line">prometheus   Bound    prometheus-nfs-pv   20Gi       RWX                           14m</span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n monitor  get ingress</span></span>
<span class="line">NAME         CLASS   HOSTS                    ADDRESS     PORTS   AGE</span>
<span class="line">prometheus   nginx   prometheus.example.com   <span class="token number">10.0</span>.0.11   <span class="token number">80</span>      21m</span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n ingress-nginx  get svc</span></span>
<span class="line">NAME                                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>                      AGE</span>
<span class="line">ingress-nginx-controller             NodePort    <span class="token number">10.1</span>.46.56     <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>        <span class="token number">80</span>:32444/TCP,443:32443/TCP   3d3h</span>
<span class="line">ingress-nginx-controller-admission   ClusterIP   <span class="token number">10.1</span>.122.188   <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>        <span class="token number">443</span>/TCP                      3d3h</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl run --rm -it --image=busybox bash</span></span>
<span class="line">/ <span class="token comment"># nslookup prometheus.monitor.svc.cluster.local</span></span>
<span class="line">Server:		<span class="token number">10.1</span>.0.10</span>
<span class="line">Address:	<span class="token number">10.1</span>.0.10:53 <span class="token comment"># DNS服务器 集群内部的 DNS 解析服务（CoreDNS/kube-dns）</span></span>
<span class="line">Name:	prometheus.monitor.svc.cluster.local</span>
<span class="line">Address: <span class="token number">10.1</span>.218.72  <span class="token comment"># 拿到的服务IP地址</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="访问" tabindex="-1"><a class="header-anchor" href="#访问"><span>访问</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 域名解析</span></span>
<span class="line">Ingress Controller 使用 NodePort</span>
<span class="line">Ingress Controller 在所有节点上都有 NodePort 监听可以绑定任意节点的 IP</span>
<span class="line"><span class="token comment"># 全部绑定（推荐）：</span></span>
<span class="line"><span class="token number">10.0</span>.0.12 prometheus.example.com</span>
<span class="line"><span class="token number">10.0</span>.0.11 prometheus.example.com</span>
<span class="line"><span class="token number">10.0</span>.0.10 prometheus.example.com</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#curl -v http://10.0.0.11:32444 -H &quot;Host: prometheus.example.com&quot;</span></span>
<span class="line">* About to connect<span class="token punctuation">(</span><span class="token punctuation">)</span> to <span class="token number">10.0</span>.0.11 port <span class="token number">32444</span> <span class="token punctuation">(</span><span class="token comment">#0)</span></span>
<span class="line">*   Trying <span class="token number">10.0</span>.0.11<span class="token punctuation">..</span>.</span>
<span class="line">* Connected to <span class="token number">10.0</span>.0.11 <span class="token punctuation">(</span><span class="token number">10.0</span>.0.11<span class="token punctuation">)</span> port <span class="token number">32444</span> <span class="token punctuation">(</span><span class="token comment">#0)</span></span>
<span class="line"><span class="token operator">&gt;</span> GET / HTTP/1.1</span>
<span class="line"><span class="token operator">&gt;</span> User-Agent: curl/7.29.0</span>
<span class="line"><span class="token operator">&gt;</span> Accept: */*</span>
<span class="line"><span class="token operator">&gt;</span> Host: prometheus.example.com</span>
<span class="line"><span class="token operator">&gt;</span> </span>
<span class="line"><span class="token operator">&lt;</span> HTTP/1.1 <span class="token number">302</span> Found</span>
<span class="line"><span class="token operator">&lt;</span> Date: Wed, <span class="token number">28</span> Jan <span class="token number">2026</span> <span class="token number">13</span>:32:44 GMT</span>
<span class="line"><span class="token operator">&lt;</span> Content-Type: text/html<span class="token punctuation">;</span> <span class="token assign-left variable">charset</span><span class="token operator">=</span>utf-8</span>
<span class="line"><span class="token operator">&lt;</span> Content-Length: <span class="token number">29</span></span>
<span class="line"><span class="token operator">&lt;</span> Connection: keep-alive</span>
<span class="line"><span class="token operator">&lt;</span> Location: /graph</span>
<span class="line"><span class="token operator">&gt;</span> </span>
<span class="line"><span class="token operator">&lt;</span>a <span class="token assign-left variable">href</span><span class="token operator">=</span><span class="token string">&quot;/graph&quot;</span><span class="token operator">&gt;</span>Found<span class="token operator">&lt;</span>/a<span class="token operator">&gt;</span>.</span>
<span class="line"></span>
<span class="line">* Connection <span class="token comment">#0 to host 10.0.0.11 left intact</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>浏览器访问32444端口</p><p><img src="`+p+`" alt="image-20260128214236537"></p><h3 id="日志查看" tabindex="-1"><a class="header-anchor" href="#日志查看"><span>日志查看</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl <span class="token parameter variable">-n</span> ingress-nginx logs ingress-nginx-controller-594b5c5fcb-652qg <span class="token parameter variable">-f</span></span>
<span class="line"></span>
<span class="line"><span class="token number">10.2</span>.2.0 - - <span class="token punctuation">[</span><span class="token number">28</span>/Jan/2026:13:44:15 +0000<span class="token punctuation">]</span> <span class="token string">&quot;GET /api/v1/query?query=time() HTTP/1.1&quot;</span> <span class="token number">200</span> <span class="token number">103</span> <span class="token string">&quot;http://prometheus.example.com:32444/graph?g0.expr=&amp;g0.tab=1&amp;g0.stacked=0&amp;g0.show_exemplars=0&amp;g0.range_input=1h&quot;</span> <span class="token string">&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0&quot;</span> <span class="token number">441</span> <span class="token number">0.000</span> <span class="token punctuation">[</span>monitor-prometheus-9090<span class="token punctuation">]</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token number">10.2</span>.2.78:9090 <span class="token number">103</span> <span class="token number">0.000</span> <span class="token number">200</span> c7c7dcea1ee8f3dcb76f453870a8e455</span>
<span class="line"><span class="token number">10.2</span>.2.0 - - <span class="token punctuation">[</span><span class="token number">28</span>/Jan/2026:13:44:15 +0000<span class="token punctuation">]</span> <span class="token string">&quot;GET /api/v1/label/__name__/values HTTP/1.1&quot;</span> <span class="token number">200</span> <span class="token number">1480</span> <span class="token string">&quot;http://prometheus.example.com:32444/graph?g0.expr=&amp;g0.tab=1&amp;g0.stacked=0&amp;g0.show_exemplars=0&amp;g0.range_input=1h&quot;</span> <span class="token string">&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0&quot;</span> <span class="token number">444</span> <span class="token number">0.002</span> <span class="token punctuation">[</span>monitor-prometheus-9090<span class="token punctuation">]</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token number">10.2</span>.2.78:9090 <span class="token number">1480</span> <span class="token number">0.002</span> <span class="token number">200</span> 1fe400a44f9b633d6466cf75d6c31629s</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h1><h2 id="抓取时间" tabindex="-1"><a class="header-anchor" href="#抓取时间"><span>抓取时间</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">global:</span>
<span class="line">  scrape_interval: 15s <span class="token comment"># Set the scrape interval to every 15 seconds. Default is every 1 minute.</span></span>
<span class="line">  evaluation_interval: 15s <span class="token comment"># Evaluate rules every 15 seconds. The default is every 1 minute.</span></span>
<span class="line">  <span class="token comment"># scrape_timeout is set to the global default (10s).</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="抓取目标" tabindex="-1"><a class="header-anchor" href="#抓取目标"><span>抓取目标</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># A scrape configuration containing exactly one endpoint to scrape:</span></span>
<span class="line"><span class="token comment"># Here it&#39;s Prometheus itself.</span></span>
<span class="line">scrape_configs:</span>
<span class="line">  <span class="token comment"># The job name is added as a label \`job=&lt;job_name&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">  - job_name: <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># metrics_path defaults to &#39;/metrics&#39;</span></span>
<span class="line">    <span class="token comment"># scheme defaults to &#39;http&#39;.</span></span>
<span class="line"></span>
<span class="line">    static_configs:</span>
<span class="line">      - targets: <span class="token punctuation">[</span><span class="token string">&quot;localhost:9090&quot;</span><span class="token punctuation">]</span></span>
<span class="line">       <span class="token comment"># The label name is added as a label \`label_name=&lt;label_value&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">        labels:</span>
<span class="line">          app: <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个配置中，<code>localhost:9090</code> ：</p><ul><li><strong>localhost</strong>: Prometheus 容器内部</li><li><strong>9090</strong>: Prometheus 自己的 metrics 端点端口</li><li>返回 Prometheus 自身的 Go 运行时指标、HTTP 指标等</li></ul><h2 id="数据" tabindex="-1"><a class="header-anchor" href="#数据"><span>数据</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 举例 </span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span>  <span class="token number">10.1</span>.218.72:9090/metrics <span class="token operator">|</span><span class="token function">tail</span> <span class="token parameter variable">-10</span></span>
<span class="line"><span class="token comment"># TYPE prometheus_web_federation_warnings_total counter</span></span>
<span class="line">prometheus_web_federation_warnings_total <span class="token number">0</span></span>
<span class="line"><span class="token comment"># HELP promhttp_metric_handler_requests_in_flight Current number of scrapes being served.</span></span>
<span class="line"><span class="token comment"># TYPE promhttp_metric_handler_requests_in_flight gauge</span></span>
<span class="line">promhttp_metric_handler_requests_in_flight <span class="token number">1</span></span>
<span class="line"><span class="token comment"># HELP promhttp_metric_handler_requests_total Total number of scrapes by HTTP status code.</span></span>
<span class="line"><span class="token comment"># TYPE promhttp_metric_handler_requests_total counter</span></span>
<span class="line">promhttp_metric_handler_requests_total<span class="token punctuation">{</span>code<span class="token operator">=</span><span class="token string">&quot;200&quot;</span><span class="token punctuation">}</span> <span class="token number">1039</span></span>
<span class="line">promhttp_metric_handler_requests_total<span class="token punctuation">{</span>code<span class="token operator">=</span><span class="token string">&quot;500&quot;</span><span class="token punctuation">}</span> <span class="token number">0</span></span>
<span class="line">promhttp_metric_handler_requests_total<span class="token punctuation">{</span>code<span class="token operator">=</span><span class="token string">&quot;503&quot;</span><span class="token punctuation">}</span> <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">这几个指标的解释：</span>
<span class="line">prometheus_web_federation_warnings_total：表示由于与联邦的通信问题而发出的告警总数。</span>
<span class="line">promhttp_metric_handler_requests_in_flight：表示当前正在处理的抓取请求的数量。</span>
<span class="line">promhttp_metric_handler_requests_total：表示处理过的抓取请求的总数，按HTTP状态代码分类。</span>
<span class="line">在 promhttp_metric_handler_requests_total 指标中，有三个标签 <span class="token punctuation">(</span>code<span class="token operator">=</span><span class="token string">&quot;200&quot;</span>, <span class="token assign-left variable">code</span><span class="token operator">=</span><span class="token string">&quot;500&quot;</span> 和 <span class="token assign-left variable">code</span><span class="token operator">=</span><span class="token string">&quot;503&quot;</span><span class="token punctuation">)</span> ，它们分别表示HTTP状态代码为200、500和503的请求总数。</span>
<span class="line">注意，每个指标都有一个 TYPE 标签，它指定了指标的类型，例如 counter 或 gauge。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="理解tsdb时序数据库" tabindex="-1"><a class="header-anchor" href="#理解tsdb时序数据库"><span>理解TSDB时序数据库</span></a></h2><h3 id="监控数据样本示例" tabindex="-1"><a class="header-anchor" href="#监控数据样本示例"><span>监控数据样本示例</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># HELP promhttp_metric_handler_requests_total Total number of scrapes by HTTP status code.</span>
<span class="line"># TYPE promhttp_metric_handler_requests_total counter</span>
<span class="line">promhttp_metric_handler_requests_total{code=&quot;200&quot;} 1039</span>
<span class="line">promhttp_metric_handler_requests_total{code=&quot;500&quot;} 0</span>
<span class="line">promhttp_metric_handler_requests_total{code=&quot;503&quot;} 0</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关键概念" tabindex="-1"><a class="header-anchor" href="#关键概念"><span>关键概念</span></a></h3><ol><li><p><strong>指标类型</strong>：</p><ul><li><code>counter</code>：计数器（只增不减）</li><li><code>gauge</code>：测量器（可增可减）</li><li><code>histogram</code>：柱状图</li><li><code>summary</code>：采样点分位图统计</li></ul></li><li><p><strong>指标格式</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">&lt;metric_name&gt;{&lt;label_name&gt;=&lt;label_value&gt;, ...} &lt;value&gt; &lt;timestamp&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><code>metric_name</code>：指标名称</li><li><code>label</code>：标签（维度）</li><li><code>value</code>：样本值（float64）</li><li><code>timestamp</code>：时间戳（毫秒级）</li></ul></li><li><p><strong>时间序列</strong>：</p><p>text</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">^</span>
<span class="line">│   . . . . . . . . . . . . . . . . .   node_cpu{cpu=&quot;cpu0&quot;,mode=&quot;idle&quot;}</span>
<span class="line">│     . . . . . . . . . . . . . . . . . node_cpu{cpu=&quot;cpu0&quot;,mode=&quot;system&quot;}</span>
<span class="line">v</span>
<span class="line">&lt;------------------ 时间 ----------------&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="tsdb特点" tabindex="-1"><a class="header-anchor" href="#tsdb特点"><span>TSDB特点</span></a></h3><ul><li><strong>高效存储检索</strong>：快速处理大量时间序列数据</li><li><strong>特定函数支持</strong>：滑动窗口平均、最大最小值等</li><li><strong>聚合操作</strong>：支持数据聚合生成报告</li><li><strong>数据保留策略</strong>：可配置数据保留时间</li></ul><h1 id="流程总结" tabindex="-1"><a class="header-anchor" href="#流程总结"><span>流程总结</span></a></h1><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token number">1</span>. 服务暴露Metrics</span>
<span class="line">应用通过HTTP协议暴露metrics端点</span>
<span class="line">使用Prometheus client libraries生成指标</span>
<span class="line"></span>
<span class="line"><span class="token number">2</span>. 配置监控</span>
<span class="line">编写Prometheus配置文件</span>
<span class="line">定义抓取目标（Targets）</span>
<span class="line">配置抓取间隔和规则</span>
<span class="line"></span>
<span class="line"><span class="token number">3</span>. 数据采集</span>
<span class="line">Prometheus Server定期拉取metrics</span>
<span class="line">支持服务发现自动发现目标</span>
<span class="line">失败时发送警报</span>
<span class="line"></span>
<span class="line"><span class="token number">4</span>. 数据存储</span>
<span class="line">存储到本地TSDB</span>
<span class="line">支持远程存储集成</span>
<span class="line"></span>
<span class="line"><span class="token number">5</span>. 查询与可视化</span>
<span class="line">使用PromQL查询语言</span>
<span class="line">通过Grafana创建仪表盘</span>
<span class="line"></span>
<span class="line"><span class="token number">6</span>. 告警与通知</span>
<span class="line">定义告警规则</span>
<span class="line">Alertmanager处理告警</span>
<span class="line">发送到邮件、Slack等</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="核心理解" tabindex="-1"><a class="header-anchor" href="#核心理解"><span>核心理解</span></a></h1><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">Prometheus功能定位：定期去Tragets列表拉取监控数据，存储到TSDB中，并且提供指标查询、分析的语句和接口。</span>
<span class="line"></span>
<span class="line">Targets概念：要监控的目标对象（服务器、进程、容器等）</span>
<span class="line">配置核心：scrape_configs定义抓取目标，static_configs配置静态目标</span>
<span class="line">抓取机制：基于HTTP协议，默认15秒间隔</span>
<span class="line">数据模型：指标 + 标签 + 时间戳 + 值 <span class="token operator">=</span> 时间序列数据点</span>
<span class="line">扩展性：通过Exporter支持各种系统监控，通过Pushgateway支持推送模式</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="与zabbix相比" tabindex="-1"><a class="header-anchor" href="#与zabbix相比"><span>与zabbix相比</span></a></h1><p>在适用场景方面，Zabbix 更适合传统 IT 架构和中小规模的监控需求，尤其是在静态服务器和网络设备的监控中表现出色。Prometheus 则是云原生监控的首选，适合动态服务集群和大规模数据场景，尤其在 Kubernetes 和容器平台中具有显著优势。</p>`,85)])])}const u=n(t,[["render",c]]),d=JSON.parse('{"path":"/07-%E7%9B%91%E6%8E%A7%E4%BD%93%E7%B3%BB/02-prometheus%E7%9B%91%E6%8E%A7/%E6%99%AE%E7%BD%97%E7%B1%B3%E4%BF%AE%E6%96%AF.html","title":"Prometheus","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"07-监控体系/02-prometheus监控/普罗米修斯.md"}');export{u as comp,d as data};
