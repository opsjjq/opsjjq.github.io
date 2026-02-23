import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i="/assets/image-20260129154625875-DZMhwvxi.png",p="/assets/image-20260129155045928-DnSqKO52.png",t="/assets/image-20260129162356347-JJsBUUiW.png",c="/assets/image-20260129172846377-BsZrQ8yM.png",r="/assets/image-20260129172828037-cwFmZtuM.png",o="/assets/image-20260129194539233-Cyl9aex8.png",u="/assets/image-20260129203140616-DT5dOydr.png",d="/assets/image-20260129220439007-SZ5kOv4M.png",m="/assets/image-20260130000413305-D8XRAM7C.png",v="/assets/image-20260130000958239-B98tav7k.png",k={};function b(h,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="一、监控基本原理" tabindex="-1"><a class="header-anchor" href="#一、监控基本原理"><span>一、监控基本原理</span></a></h1><h2 id="prometheus监控架构" tabindex="-1"><a class="header-anchor" href="#prometheus监控架构"><span>Prometheus监控架构</span></a></h2><p>无论是业务应用还是Kubernetes系统组件，只要提供了满足标准Prometheus格式的metrics API，即可被Prometheus采集监控。</p><h2 id="标准监控接口" tabindex="-1"><a class="header-anchor" href="#标准监控接口"><span>标准监控接口</span></a></h2><ul><li><strong>路径</strong>: <code>/metrics</code></li><li><strong>协议</strong>: HTTP/HTTPS</li><li><strong>格式</strong>: Prometheus文本格式</li><li><strong>示例组件</strong>: <ul><li>Prometheus自身: <code>:9090/metrics</code></li><li>CoreDNS: <code>:9153/metrics</code></li><li>Kubernetes API Server: <code>:6443/metrics</code></li></ul></li></ul><h3 id="prometheus" tabindex="-1"><a class="header-anchor" href="#prometheus"><span>prometheus</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n monitor exec -it prometheus-6497d6f8bc-qp9tx -- sh</span></span>
<span class="line">Defaulted container <span class="token string">&quot;prometheus&quot;</span> out of: prometheus, change-permission-of-directory <span class="token punctuation">(</span>init<span class="token punctuation">)</span></span>
<span class="line">/prometheus $ <span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span></span>
<span class="line">Active Internet connections <span class="token punctuation">(</span>only servers<span class="token punctuation">)</span></span>
<span class="line">Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> :::9090                 :::*                    LISTEN      <span class="token number">1</span>/prometheus</span>
<span class="line">/prometheus $ </span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 程序主动暴露一些metrics API、以及端口，是程序开发者定义好的，我们直接可以去访问</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="coredns" tabindex="-1"><a class="header-anchor" href="#coredns"><span>CoreDNS</span></a></h3><p>k8s本身资源也一样，因为暴露metricsAPI，交给prometheus已经是成熟且固定的方案。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n kube-system get po -owide|grep dns</span></span>
<span class="line">coredns-6b4b464477-cp2bq                <span class="token number">1</span>/1     Running   <span class="token number">4</span> <span class="token punctuation">(</span>21h ago<span class="token punctuation">)</span>   4d23h   <span class="token number">10.2</span>.3.78   k8s-node-11     <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>           <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span></span>
<span class="line">coredns-6b4b464477-t8vkn                <span class="token number">1</span>/1     Running   <span class="token number">4</span> <span class="token punctuation">(</span>21h ago<span class="token punctuation">)</span>   4d23h   <span class="token number">10.2</span>.0.11   k8s-master-10   <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>           <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span></span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#kubectl -n kube-system get svc -o wide</span></span>
<span class="line">NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>                  AGE     SELECTOR</span>
<span class="line">kube-dns   ClusterIP   <span class="token number">10.1</span>.0.10    <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>        <span class="token number">53</span>/UDP,53/TCP,9153/TCP   5d15h   k8s-app<span class="token operator">=</span>kube-dns</span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus<span class="token punctuation">]</span><span class="token comment">#curl  -s 10.1.0.10:9153/metrics | tail</span></span>
<span class="line">process_resident_memory_bytes <span class="token number">5</span>.9273216e+07</span>
<span class="line"><span class="token comment"># HELP process_start_time_seconds Start time of the process since unix epoch in seconds.</span></span>
<span class="line"><span class="token comment"># TYPE process_start_time_seconds gauge</span></span>
<span class="line">process_start_time_seconds <span class="token number">1</span>.7696337756e+09</span>
<span class="line"><span class="token comment"># HELP process_virtual_memory_bytes Virtual memory size in bytes.</span></span>
<span class="line"><span class="token comment"># TYPE process_virtual_memory_bytes gauge</span></span>
<span class="line">process_virtual_memory_bytes <span class="token number">7</span>.83007744e+08</span>
<span class="line"><span class="token comment"># HELP process_virtual_memory_max_bytes Maximum amount of virtual memory available in bytes.</span></span>
<span class="line"><span class="token comment"># TYPE process_virtual_memory_max_bytes gauge</span></span>
<span class="line">process_virtual_memory_max_bytes <span class="token number">1</span>.8446744073709552e+19</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="添加至监控配置" tabindex="-1"><a class="header-anchor" href="#添加至监控配置"><span>添加至监控配置</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">kubectl -n monitor edit configmap prometheus-config</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">    scrape_configs:</span>
<span class="line">      <span class="token comment"># The job name is added as a label \`job=&lt;job_name&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">      - job_name: <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment"># metrics_path defaults to &#39;/metrics&#39;</span></span>
<span class="line">        <span class="token comment"># scheme defaults to &#39;http&#39;.</span></span>
<span class="line"></span>
<span class="line">        static_configs:</span>
<span class="line">          - targets: <span class="token punctuation">[</span><span class="token string">&quot;localhost:9090&quot;</span><span class="token punctuation">]</span></span>
<span class="line">            labels:</span>
<span class="line">              app: <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span>
<span class="line">      - job_name: <span class="token string">&quot;core_dns&quot;</span></span>
<span class="line">        static_configs:</span>
<span class="line">          - targets: <span class="token punctuation">[</span><span class="token string">&quot;10.1.0.10:9153&quot;</span><span class="token punctuation">]</span></span>
<span class="line">            labels:</span>
<span class="line">              namespace: <span class="token string">&#39;kube-system&#39;</span></span>
<span class="line">              service: <span class="token string">&#39;kube-dns&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="热更新-reload-配置" tabindex="-1"><a class="header-anchor" href="#热更新-reload-配置"><span>热更新 reload 配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl <span class="token parameter variable">-n</span> monitor get po <span class="token parameter variable">-o</span> wide</span>
<span class="line">NAME                          READY   STATUS    RESTARTS      AGE   IP          NODE          NOMINATED NODE   READINESS GATES</span>
<span class="line">prometheus-6497d6f8bc-qp9tx   <span class="token number">1</span>/1     Running   <span class="token number">1</span> <span class="token punctuation">(</span>18h ago<span class="token punctuation">)</span>   18h   <span class="token number">10.2</span>.2.78   k8s-node-12   <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>           <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token number">10.2</span>.2.78:9090/-/reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="验证-查看target" tabindex="-1"><a class="header-anchor" href="#验证-查看target"><span>验证 查看target</span></a></h4><p><img src="`+i+'" alt="image-20260129154625875"></p><h4 id="检查样本" tabindex="-1"><a class="header-anchor" href="#检查样本"><span>检查样本</span></a></h4><p><img src="'+p+`" alt="image-20260129155045928"></p><hr><h1 id="二、监控目标添加实践" tabindex="-1"><a class="header-anchor" href="#二、监控目标添加实践"><span>二、监控目标添加实践</span></a></h1><h2 id="常用监控对象" tabindex="-1"><a class="header-anchor" href="#常用监控对象"><span>常用监控对象</span></a></h2><h3 id="_2-1-coredns监控配置" tabindex="-1"><a class="header-anchor" href="#_2-1-coredns监控配置"><span>2.1 CoreDNS监控配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># prometheus.yml 配置片段</span></span>
<span class="line"><span class="token key atrule">scrape_configs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;coredns&#39;</span></span>
<span class="line">    <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;10.96.0.10:9153&#39;</span><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>验证方法</strong>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看CoreDNS服务</span></span>
<span class="line">kubectl <span class="token parameter variable">-n</span> kube-system get svc kube-dns</span>
<span class="line"><span class="token comment"># 访问指标接口</span></span>
<span class="line"><span class="token function">curl</span> <span class="token number">10.1</span>.0.10:9153/metrics <span class="token operator">|</span> <span class="token function">tail</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-kubernetes-api-server监控配置" tabindex="-1"><a class="header-anchor" href="#_2-2-kubernetes-api-server监控配置"><span>2.2 Kubernetes API Server监控配置</span></a></h3><p>API Server使用HTTPS协议，需要认证授权：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl get svc kubernetes <span class="token parameter variable">-n</span> default</span>
<span class="line">NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>   AGE</span>
<span class="line">kubernetes   ClusterIP   <span class="token number">10.1</span>.0.1     <span class="token operator">&lt;</span>none<span class="token operator">&gt;</span>        <span class="token number">443</span>/TCP   5d16h</span>
<span class="line">kubectl edit</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;kubernetes-apiserver&#39;</span></span>
<span class="line">        <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;10.1.0.1&#39;</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token key atrule">scheme</span><span class="token punctuation">:</span> https</span>
<span class="line">        <span class="token key atrule">tls_config</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">ca_file</span><span class="token punctuation">:</span> /var/run/secrets/kubernetes.io/serviceaccount/ca.crt</span>
<span class="line">          <span class="token key atrule">insecure_skip_verify</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">        <span class="token key atrule">bearer_token_file</span><span class="token punctuation">:</span> /var/run/secrets/kubernetes.io/serviceaccount/token</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>手动验证</strong>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 获取token</span></span>
<span class="line">kubectl <span class="token parameter variable">-n</span> monitor create token prometheus</span>
<span class="line"><span class="token comment"># 访问API Server metrics</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-k</span> <span class="token parameter variable">-H</span> <span class="token string">&quot;Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IndQcEh4NkFyYVF3SVc2Z0JxY01lV2ZicnZqbjNlQV9RNmFwMEphSjZxbW8ifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNzY5Njc4MTIxLCJpYXQiOjE3Njk2NzQ1MjEsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJtb25pdG9yIiwic2VydmljZWFjY291bnQiOnsibmFtZSI6InByb21ldGhldXMiLCJ1aWQiOiJkMmU0Y2VjNC0zODhiLTQ3ZDUtOTkwNS0zNzRjMDBmZDIyMGEifX0sIm5iZiI6MTc2OTY3NDUyMSwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Om1vbml0b3I6cHJvbWV0aGV1cyJ9.DAYgPn8eDpOPGEFW0kGwXAmLfmvwPURpTGl-RQ6IX6y4SRfHZ6D0mKiOcTaTNEnrEaQmu_G4GI0GqKeAHZgpq0dTU8xLDhAo_68RXUBm5r_MME4U1DNeDOMJ49mfAB9hTJbusnhua8J88MgQOxRkhPtqZm03uWv2bgy3cYGz_Bd4rh_fOJSMAG2-HtyaCK9b4RAiPAiiHqLdY0LpEPkTOnIgUk0096Tv0RUB8lhDOLFzA9lNiJ-JnxJqu4LHV5IeE_U49Vn9XqBjeqZUjOuckUE_dURReHhXHFfLTpJTvlRPYmMlFuOZTH7-NHnMNGOyn5EtPPnTVx120pU_1LklAw&quot;</span> https://10.1.0.1:443/metrics <span class="token operator">|</span> <span class="token function">tail</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-配置热更新" tabindex="-1"><a class="header-anchor" href="#_2-3-配置热更新"><span>2.3 配置热更新</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 触发热重载 svc或者podIP</span>
<span class="line">curl -X POST 10.1.218.72:9090/-/reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+t+`" alt="image-20260129162356347"></p><hr><h1 id="三、常用监控对象分类" tabindex="-1"><a class="header-anchor" href="#三、常用监控对象分类"><span>三、常用监控对象分类</span></a></h1><h2 id="_3-1-内部系统组件" tabindex="-1"><a class="header-anchor" href="#_3-1-内部系统组件"><span>3.1 内部系统组件</span></a></h2><ul><li>kube-apiserver</li><li>kube-scheduler</li><li>kube-controller-manager</li><li>kube-dns/coredns</li></ul><h2 id="_3-2-kubernetes节点" tabindex="-1"><a class="header-anchor" href="#_3-2-kubernetes节点"><span>3.2 Kubernetes节点</span></a></h2><ul><li>CPU、内存、磁盘、网络</li><li>节点健康状况</li></ul><h2 id="_3-3-业务容器基础指标" tabindex="-1"><a class="header-anchor" href="#_3-3-业务容器基础指标"><span>3.3 业务容器基础指标</span></a></h2><ul><li>CPU使用率</li><li>内存使用量</li><li>磁盘I/O</li><li>网络流量</li></ul><h2 id="_3-4-业务容器业务指标" tabindex="-1"><a class="header-anchor" href="#_3-4-业务容器业务指标"><span>3.4 业务容器业务指标</span></a></h2><ul><li>应用自定义metrics</li><li>通过<code>/metrics</code> API暴露</li></ul><h2 id="_3-5-编排级指标" tabindex="-1"><a class="header-anchor" href="#_3-5-编排级指标"><span>3.5 编排级指标</span></a></h2><ul><li>Deployment状态</li><li>StatefulSet状态</li><li>DaemonSet状态</li><li>资源请求/限制</li></ul><hr><h1 id="四、节点级监控-node-exporter" tabindex="-1"><a class="header-anchor" href="#四、节点级监控-node-exporter"><span>四、节点级监控（Node Exporter）</span></a></h1><p>Node Exporter是一个官方的Prometheus exporter，它可以从操作系统中提取各种指标，例如CPU使用率、内存使用率、磁盘使用率等等。Node Exporter本质上是一个二进制文件，需要在每个节点上安装并运行。</p><h2 id="_4-1-daemonset部署" tabindex="-1"><a class="header-anchor" href="#_4-1-daemonset部署"><span>4.1 DaemonSet部署</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">每个节点都需要监控，因此可以使用DaemonSet类型来管理node_exporter</span>
<span class="line">添加节点的容忍配置</span>
<span class="line">挂载宿主机中的系统文件信息</span>
<span class="line"></span>
<span class="line">Prometheus使用Node Exporter来监控节点。</span>
<span class="line">Node Exporter是一个官方的Prometheus exporter，它可以从操作系统中提取各种指标，例如CPU使用率、内存使用率、磁盘使用率等等。Node Exporter本质上是一个二进制文件，需要在每个节点上安装并运行。</span>
<span class="line"></span>
<span class="line">Node Exporter运行起来了，Prometheus就可以通过HTTP协议获取到节点的各种指标，并将这些指标存储到自己的时间序列数据库中。然后，就可以使用Prometheus提供的查询语言PromQL对这些指标进行查询和分析了。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># node-exporter.yml</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> DaemonSet</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> node<span class="token punctuation">-</span>exporter</span>
<span class="line">  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> monitor</span>
<span class="line">  <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">app</span><span class="token punctuation">:</span> node<span class="token punctuation">-</span>exporter</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> node<span class="token punctuation">-</span>exporter</span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> node<span class="token punctuation">-</span>exporter</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">hostPID</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">      <span class="token key atrule">hostIPC</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">      <span class="token key atrule">hostNetwork</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">      <span class="token key atrule">nodeSelector</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">kubernetes.io/os</span><span class="token punctuation">:</span> linux</span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> node<span class="token punctuation">-</span>exporter</span>
<span class="line">        <span class="token key atrule">image</span><span class="token punctuation">:</span> prom/node<span class="token punctuation">-</span>exporter<span class="token punctuation">:</span>v1.10.2</span>
<span class="line">        <span class="token key atrule">args</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>web.listen<span class="token punctuation">-</span>address=$(HOSTIP)<span class="token punctuation">:</span><span class="token number">9100</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>path.procfs=/host/proc</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>path.sysfs=/host/sys</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>path.rootfs=/host/root</span>
<span class="line">        <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9100</span></span>
<span class="line">        <span class="token key atrule">env</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> HOSTIP</span>
<span class="line">          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">fieldRef</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">fieldPath</span><span class="token punctuation">:</span> status.hostIP</span>
<span class="line">        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> proc</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /host/proc</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> sys</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /host/sys</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> root</span>
<span class="line">          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /host/root</span>
<span class="line">      <span class="token key atrule">tolerations</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">operator</span><span class="token punctuation">:</span> <span class="token string">&quot;Exists&quot;</span></span>
<span class="line">      <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> proc</span>
<span class="line">        <span class="token key atrule">hostPath</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">path</span><span class="token punctuation">:</span> /proc</span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> sys</span>
<span class="line">        <span class="token key atrule">hostPath</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">path</span><span class="token punctuation">:</span> /sys</span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> root</span>
<span class="line">        <span class="token key atrule">hostPath</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">path</span><span class="token punctuation">:</span> /</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>DaemonSet定义了如何创建Pod，并保证每个节点上都会有一个运行着Node Exporter的Pod。</p><p>在容器定义中，使用了Prometheus官方提供的node-exporter镜像，并指定了需要暴露的端口号和一些参数，例如路径和忽略的文件系统类型等等。容器使用了hostNetwork模式，以便在Pod中直接访问节点上的网络。此外，容器也挂载了节点上的一些目录，例如/proc、/sys和/root等等，以便从节点中获取指标。</p><h2 id="_4-2-创建与验证" tabindex="-1"><a class="header-anchor" href="#_4-2-创建与验证"><span>4.2 创建与验证</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl apply <span class="token parameter variable">-f</span> node_exporter.yml </span>
<span class="line"><span class="token comment"># 查看运行状态</span></span>
<span class="line">kubectl <span class="token parameter variable">-n</span> monitor get po <span class="token parameter variable">-owide</span> <span class="token operator">|</span> <span class="token function">grep</span> node-exporter</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 访问指标接口</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.12:9100/metrics <span class="token operator">|</span> <span class="token function">tail</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看节点内存指标</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.10:9100/metrics <span class="token operator">|</span> <span class="token function">grep</span> node_memory_MemTotal_bytes</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.11:9100/metrics <span class="token operator">|</span> <span class="token function">grep</span> node_memory_MemTotal_bytes</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token number">10.0</span>.0.12:9100/metrics <span class="token operator">|</span> <span class="token function">grep</span> node_memory_MemTotal_bytes</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-3添加到target" tabindex="-1"><a class="header-anchor" href="#_4-3添加到target"><span>4.3添加到target</span></a></h2><p>ServiceDiscovery动态发现目标的机制</p><p>ServiceDiscovery和static_config都是Prometheus中用于配置target列表的机制，但它们之间有一些区别。</p><p>静态配置（static_config）是手动定义的target列表，您需要手动添加或删除每个目标。这意味着当集群中的节点增加或删除时，您需要手动更新静态配置文件以添加或删除节点。这对于较小的集群可能是可行的，但对于规模较大的集群而言，手动维护静态配置文件可能会变得非常困难。</p><p>相比之下，ServiceDiscovery是一种动态发现目标的机制，它允许Prometheus自动发现并监视与其连接的所有目标。ServiceDiscovery的工作方式是通过查询指定的服务注册表或API，来获取要监视的目标列表。当服务注册表或API发生更改时，Prometheus将自动检测到更改并更新其目标列表。这使得ServiceDiscovery非常适合用于动态环境，例如Kubernetes集群。</p><p>因此，ServiceDiscovery和静态配置之间的主要区别在于它们如何管理目标列表。静态配置需要手动添加和删除目标，而ServiceDiscovery会自动发现目标并自动更新列表。在许多情况下，使用ServiceDiscovery会更加方便和可扩展，特别是在动态环境中，而静态配置适用于静态环境或小型集群。</p><hr><h1 id="五、服务发现与relabeling" tabindex="-1"><a class="header-anchor" href="#五、服务发现与relabeling"><span>五、服务发现与Relabeling</span></a></h1><h2 id="_5-1-静态配置-vs-服务发现" tabindex="-1"><a class="header-anchor" href="#_5-1-静态配置-vs-服务发现"><span>5.1 静态配置 vs 服务发现</span></a></h2><table><thead><tr><th style="text-align:left;">特性</th><th style="text-align:left;">静态配置</th><th style="text-align:left;">服务发现</th></tr></thead><tbody><tr><td style="text-align:left;">管理方式</td><td style="text-align:left;">手动配置</td><td style="text-align:left;">自动发现</td></tr><tr><td style="text-align:left;">扩展性</td><td style="text-align:left;">适合小集群</td><td style="text-align:left;">适合大集群</td></tr><tr><td style="text-align:left;">维护成本</td><td style="text-align:left;">节点变化需手动更新</td><td style="text-align:left;">自动适应变化</td></tr></tbody></table><h2 id="_5-2-prometheus支持的kubernetes服务发现" tabindex="-1"><a class="header-anchor" href="#_5-2-prometheus支持的kubernetes服务发现"><span>5.2 Prometheus支持的Kubernetes服务发现</span></a></h2><ol><li><strong>Node</strong>: 发现集群节点</li><li><strong>Service</strong>: 发现Service</li><li><strong>Pod</strong>: 发现Pod</li><li><strong>Endpoints</strong>: 发现Endpoints</li><li><strong>Ingress</strong>: 发现Ingress资源</li></ol><h2 id="_5-3-node-exporter服务发现配置" tabindex="-1"><a class="header-anchor" href="#_5-3-node-exporter服务发现配置"><span>5.3 Node Exporter服务发现配置</span></a></h2><p>Prometheus的node类型的服务发现模式，默认是和kubelet的10250绑定的。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl <span class="token parameter variable">-n</span> monitor edit configmap prometheus-config</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token number">10.1</span>.218.72:9090/-/reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;kubernetes-sd-node-exporter&#39;</span></span>
<span class="line">        <span class="token key atrule">kubernetes_sd_configs</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">role</span><span class="token punctuation">:</span> node</span>
<span class="line">        <span class="token key atrule">relabel_configs</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__address__<span class="token punctuation">]</span></span>
<span class="line">          <span class="token key atrule">regex</span><span class="token punctuation">:</span> <span class="token string">&#39;(.*):10250&#39;</span></span>
<span class="line">          <span class="token key atrule">replacement</span><span class="token punctuation">:</span> <span class="token string">&#39;\${1}:9100&#39;</span></span>
<span class="line">          <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __address__</span>
<span class="line">          <span class="token key atrule">action</span><span class="token punctuation">:</span> replace</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="对比两个端口的用途" tabindex="-1"><a class="header-anchor" href="#对比两个端口的用途"><span>对比两个端口的用途</span></a></h3><table><thead><tr><th style="text-align:left;">端口</th><th style="text-align:left;">组件</th><th style="text-align:left;">提供指标</th><th style="text-align:left;">协议</th><th style="text-align:left;">是否需要认证</th></tr></thead><tbody><tr><td style="text-align:left;">10250</td><td style="text-align:left;">kubelet</td><td style="text-align:left;">kubelet自身指标、cAdvisor容器指标</td><td style="text-align:left;">HTTPS</td><td style="text-align:left;">需要Bearer Token</td></tr><tr><td style="text-align:left;">9100</td><td style="text-align:left;">node-exporter</td><td style="text-align:left;">节点系统指标（CPU、内存、磁盘、网络等）</td><td style="text-align:left;">HTTP</td><td style="text-align:left;">不需要认证</td></tr></tbody></table><p><img src="`+c+'" alt="image-20260129172846377"></p><p><img src="'+r+`" alt="image-20260129172828037"></p><h2 id="_5-4-容器指标采集-cadvisor" tabindex="-1"><a class="header-anchor" href="#_5-4-容器指标采集-cadvisor"><span>5.4 容器指标采集（cAdvisor）</span></a></h2><p>cAdvisor（Container Advisor）是一个由Google开源的容器监控代理程序，用于收集和分析容器的资源使用情况。它可以监控容器的CPU、内存、磁盘和网络等资源使用情况，并提供有关容器的性能指标、事件和警报等信息。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">      - job_name: &#39;kubernetes-sd-cadvisor&#39;</span>
<span class="line">        kubernetes_sd_configs:</span>
<span class="line">          - role: node</span>
<span class="line">        scheme: https</span>
<span class="line">        tls_config:</span>
<span class="line">          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt</span>
<span class="line">          insecure_skip_verify: true</span>
<span class="line">        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token</span>
<span class="line">        relabel_configs:</span>
<span class="line">        - target_label: __metrics_path__</span>
<span class="line">          replacement: /metrics/cadvisor</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl <span class="token parameter variable">-n</span> monitor edit configmaps prometheus-config</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token number">10.1</span>.218.72:9090/-/reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+o+`" alt="image-20260129194539233"></p><h2 id="_5-5-kubelet指标采集" tabindex="-1"><a class="header-anchor" href="#_5-5-kubelet指标采集"><span>5.5 kubelet指标采集</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">      - job_name: &#39;kubernetes-sd-kubelet&#39;</span>
<span class="line">        kubernetes_sd_configs:</span>
<span class="line">          - role: node</span>
<span class="line">        scheme: https</span>
<span class="line">        tls_config:</span>
<span class="line">          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt</span>
<span class="line">          insecure_skip_verify: true</span>
<span class="line">        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl <span class="token parameter variable">-n</span> monitor edit configmaps prometheus-config</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token number">10.1</span>.218.72:9090/-/reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+u+`" alt="image-20260129203140616"></p><hr><h1 id="六、kube-state-metrics" tabindex="-1"><a class="header-anchor" href="#六、kube-state-metrics"><span>六、kube-state-metrics</span></a></h1><p>（Kubernetes对象状态监控）</p><h2 id="_6-1-部署kube-state-metrics" tabindex="-1"><a class="header-anchor" href="#_6-1-部署kube-state-metrics"><span>6.1 部署kube-state-metrics</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 下载并修改配置</span></span>
<span class="line"><span class="token function">wget</span> https://github.com/kubernetes/kube-state-metrics/archive/refs/tags/v2.9.2.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> kube-state-metrics-2.9.2</span>
<span class="line"><span class="token builtin class-name">cd</span> kube-state-metrics-2.9.2/examples/standard/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 两个节点准备镜像 </span></span>
<span class="line">nerdctl pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.9.2</span>
<span class="line">nerdctl tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.9.2 registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.9.2</span>
<span class="line"></span>
<span class="line"><span class="token function">vim</span> deployment.yaml  </span>
<span class="line"><span class="token function">vim</span> service-account.yaml </span>
<span class="line"><span class="token function">vim</span> service.yaml修改命名空间</span>
<span class="line">namespace: monitor</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 部署</span></span>
<span class="line">kubectl apply <span class="token parameter variable">-f</span> <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-2-基于endpoints的服务发现" tabindex="-1"><a class="header-anchor" href="#_6-2-基于endpoints的服务发现"><span>6.2 基于Endpoints的服务发现</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">      - job_name: &#39;kubernetes-sd-endpoints&#39;</span>
<span class="line">        kubernetes_sd_configs:</span>
<span class="line">          - role: endpoints</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl <span class="token parameter variable">-n</span> monitor edit configmaps prometheus-config</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token number">10.1</span>.218.72:9090/-/reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+d+`" alt="image-20260129220439007"></p><p>可以发现，实际上endpoint这个类型，目标是去抓取整个集群中所有的命名空间的Endpoint列表，然后使用默认的/metrics进行数据抓取，我们可以通过查看集群中的所有ep列表来做对比：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">kubectl get endpoints --all-namespaces</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>但是实际上并不是每个服务都已经实现了/metrics监控的，也不是每个实现了/metrics接口的服务都需要注册到Prometheus中。</p><hr><h1 id="七、基于service的业务应用监控" tabindex="-1"><a class="header-anchor" href="#七、基于service的业务应用监控"><span>七、基于Service的业务应用监控</span></a></h1><h2 id="_7-1-自动发现机制" tabindex="-1"><a class="header-anchor" href="#_7-1-自动发现机制"><span>7.1 自动发现机制</span></a></h2><p>通过Service的annotations控制监控采集：</p><p>kubectl -n kube-system get svc kube-dns -o yaml</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Service</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">annotations</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">prometheus.io/scrape</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>      <span class="token comment"># 是否采集</span></span>
<span class="line">    <span class="token key atrule">prometheus.io/port</span><span class="token punctuation">:</span> <span class="token string">&quot;9153&quot;</span>        <span class="token comment"># 采集端口</span></span>
<span class="line">    <span class="token key atrule">prometheus.io/path</span><span class="token punctuation">:</span> <span class="token string">&quot;/metrics&quot;</span>    <span class="token comment"># 默认采集路径</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在Kubernetes中，可以使用Service的annotations声明来配置Prometheus的服务发现和监控。具体来说，Service对象的annotations中的键值对将转换为Prometheus中的标签（labels）。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">名为<span class="token string">&quot;my-service&quot;</span>的Service对象添加了两个annotations标记。</span>
<span class="line"><span class="token string">&quot;prometheus.io/scrape: &#39;true&#39;&quot;</span>标记用于启用Prometheus的服务发现和监控</span>
<span class="line"><span class="token string">&quot;prometheus.io/path: &#39;/metrics&#39;&quot;</span>标记则指定了自定义的采集路径。</span>
<span class="line">意味着Prometheus会使用<span class="token string">&quot;/metrics&quot;</span>作为采集路径来获取名为<span class="token string">&quot;my-service&quot;</span>的Service对象的指标数据。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-2-prometheus配置模板" tabindex="-1"><a class="header-anchor" href="#_7-2-prometheus配置模板"><span>7.2 Prometheus配置模板</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;kubernetes-sd-endpoints&#39;</span></span>
<span class="line">        <span class="token key atrule">kubernetes_sd_configs</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">role</span><span class="token punctuation">:</span> endpoints</span>
<span class="line">        <span class="token key atrule">relabel_configs</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token comment"># 只采集有prometheus.io/scrape=true注解的服务</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_scrape<span class="token punctuation">]</span></span>
<span class="line">            <span class="token key atrule">action</span><span class="token punctuation">:</span> keep</span>
<span class="line">            <span class="token key atrule">regex</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">          </span>
<span class="line">          <span class="token comment"># 自定义采集路径</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_path<span class="token punctuation">]</span></span>
<span class="line">            <span class="token key atrule">action</span><span class="token punctuation">:</span> replace</span>
<span class="line">            <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __metrics_path__</span>
<span class="line">            <span class="token key atrule">regex</span><span class="token punctuation">:</span> (.+)</span>
<span class="line">          </span>
<span class="line">          <span class="token comment"># 自定义采集端口</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__address__<span class="token punctuation">,</span> __meta_kubernetes_service_annotation_prometheus_io_port<span class="token punctuation">]</span></span>
<span class="line">            <span class="token key atrule">action</span><span class="token punctuation">:</span> replace</span>
<span class="line">            <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __address__</span>
<span class="line">            <span class="token key atrule">regex</span><span class="token punctuation">:</span> (<span class="token punctuation">[</span>^<span class="token punctuation">:</span><span class="token punctuation">]</span>+)(<span class="token punctuation">?</span><span class="token punctuation">:</span><span class="token punctuation">:</span>\\d+)<span class="token punctuation">?</span>;(\\d+)</span>
<span class="line">            <span class="token key atrule">replacement</span><span class="token punctuation">:</span> $1<span class="token punctuation">:</span>$2</span>
<span class="line">          </span>
<span class="line">          <span class="token comment"># 添加Kubernetes标签</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__meta_kubernetes_namespace<span class="token punctuation">]</span></span>
<span class="line">            <span class="token key atrule">action</span><span class="token punctuation">:</span> replace</span>
<span class="line">            <span class="token key atrule">target_label</span><span class="token punctuation">:</span> kubernetes_namespace</span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__meta_kubernetes_service_name<span class="token punctuation">]</span></span>
<span class="line">            <span class="token key atrule">action</span><span class="token punctuation">:</span> replace</span>
<span class="line">            <span class="token key atrule">target_label</span><span class="token punctuation">:</span> kubernetes_service_name</span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__meta_kubernetes_pod_name<span class="token punctuation">]</span></span>
<span class="line">            <span class="token key atrule">action</span><span class="token punctuation">:</span> replace</span>
<span class="line">            <span class="token key atrule">target_label</span><span class="token punctuation">:</span> kubernetes_pod_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">kubectl <span class="token parameter variable">-n</span> monitor edit configmaps prometheus-config</span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token number">10.1</span>.218.72:9090/-/reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">假设一个 Service 有这样的注解：</span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: Service</span>
<span class="line">metadata:</span>
<span class="line">  name: my-app</span>
<span class="line">  annotations:</span>
<span class="line">    prometheus.io/scrape: <span class="token string">&quot;true&quot;</span></span>
<span class="line">    prometheus.io/path: <span class="token string">&quot;/custom-metrics&quot;</span></span>
<span class="line">    prometheus.io/port: <span class="token string">&quot;8080&quot;</span></span>
<span class="line"><span class="token comment">####</span></span>
<span class="line">这些annotations会被Prometheus自动转换为标签（labels）：</span>
<span class="line">prometheus.io/scrape → __meta_kubernetes_service_annotation_prometheus_io_scrape</span>
<span class="line">prometheus.io/port → __meta_kubernetes_service_annotation_prometheus_io_port</span>
<span class="line">prometheus.io/path → __meta_kubernetes_service_annotation_prometheus_io_path</span>
<span class="line"><span class="token number">1</span>. 服务发现阶段</span>
<span class="line">   ↓ 发现Kubernetes所有Services/Endpoints</span>
<span class="line">   ↓ 提取annotations转换为元标签</span>
<span class="line">   ↓ 得到: <span class="token assign-left variable">__meta_kubernetes_service_annotation_prometheus_io_path</span><span class="token operator">=</span><span class="token string">&quot;/custom-metrics&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token number">2</span>. relabeling阶段</span>
<span class="line">   ↓ 配置规则: 把元标签的值复制到内部标签</span>
<span class="line">   ↓ 执行: __metrics_path__ <span class="token operator">=</span> <span class="token string">&quot;/custom-metrics&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token number">3</span>. 采集阶段</span>
<span class="line">   ↓ Prometheus看到: __metrics_path__ <span class="token operator">=</span> <span class="token string">&quot;/custom-metrics&quot;</span></span>
<span class="line">   ↓ 实际访问: http://<span class="token operator">&lt;</span>target<span class="token operator">&gt;</span>/custom-metrics</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-3监控kube-state-metrics的service" tabindex="-1"><a class="header-anchor" href="#_7-3监控kube-state-metrics的service"><span>7.3监控kube-state-metrics的service</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">修改kube-state-metrics的service</span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus/kube-state-metrics-2.9.2/examples/standard<span class="token punctuation">]</span><span class="token comment">#vim service.yaml </span></span>
<span class="line"></span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: Service</span>
<span class="line">metadata:</span>
<span class="line">  annotations:  </span>
<span class="line">    prometheus.io/scrape: <span class="token string">&quot;true&quot;</span>  <span class="token comment"># 必须</span></span>
<span class="line">    prometheus.io/port: <span class="token string">&quot;8080&quot;</span>  <span class="token comment"># 组件自身设计8080端口提供主要的 Kubernetes 集群状态指标</span></span>
<span class="line">  labels:</span>
<span class="line">    app.kubernetes.io/name: kube-state-metrics</span>
<span class="line">    app.kubernetes.io/version: <span class="token number">2.1</span>.0</span>
<span class="line">  name: kube-state-metrics</span>
<span class="line">  namespace: monitor</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@k8s-master-10 /kube/prometheus/kube-state-metrics-2.9.2/examples/standard<span class="token punctuation">]</span><span class="token comment">#kubectl apply -f .</span></span>
<span class="line">clusterrolebinding.rbac.authorization.k8s.io/kube-state-metrics unchanged</span>
<span class="line">clusterrole.rbac.authorization.k8s.io/kube-state-metrics unchanged</span>
<span class="line">deployment.apps/kube-state-metrics unchanged</span>
<span class="line">serviceaccount/kube-state-metrics unchanged</span>
<span class="line">service/kube-state-metrics configured</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+m+'" alt="image-20260130000413305"></p><p><img src="'+v+`" alt="image-20260130000958239"></p><hr><h1 id="prometheus-yml总结" tabindex="-1"><a class="header-anchor" href="#prometheus-yml总结"><span>prometheus.yml总结</span></a></h1><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">global:</span>
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
<span class="line">  - /etc/prometheus/alert_rules.yml</span>
<span class="line">  <span class="token comment"># - &quot;first_rules.yml&quot;</span></span>
<span class="line">  <span class="token comment"># - &quot;second_rules.yml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># A scrape configuration containing exactly one endpoint to scrape:</span></span>
<span class="line"><span class="token comment"># Here it&#39;s Prometheus itself.</span></span>
<span class="line">scrape_configs:</span>
<span class="line">  <span class="token comment"># The job name is added as a label \`job=&lt;job_name&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">  - job_name: <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line">    <span class="token comment"># metrics_path defaults to &#39;/metrics&#39;</span></span>
<span class="line">    <span class="token comment"># scheme defaults to &#39;http&#39;.</span></span>
<span class="line">    static_configs:</span>
<span class="line">      - targets: <span class="token punctuation">[</span><span class="token string">&quot;localhost:9090&quot;</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token comment"># The label name is added as a label \`label_name=&lt;label_value&gt;\` to any timeseries scraped from this config.</span></span>
<span class="line">        labels:</span>
<span class="line">          app: <span class="token string">&quot;prometheus&quot;</span></span>
<span class="line"></span>
<span class="line">  - job_name: <span class="token string">&quot;core_dns&quot;</span></span>
<span class="line">    static_configs:</span>
<span class="line">      - targets: <span class="token punctuation">[</span><span class="token string">&quot;10.1.0.10:9153&quot;</span><span class="token punctuation">]</span></span>
<span class="line">        labels:</span>
<span class="line">          namespace: <span class="token string">&#39;kube-system&#39;</span></span>
<span class="line">          service: <span class="token string">&#39;kube-dns&#39;</span></span>
<span class="line"></span>
<span class="line">  - job_name: <span class="token string">&#39;kubernetes-apiserver&#39;</span></span>
<span class="line">    static_configs:</span>
<span class="line">      - targets: <span class="token punctuation">[</span><span class="token string">&#39;10.1.0.1&#39;</span><span class="token punctuation">]</span></span>
<span class="line">      scheme: https</span>
<span class="line">      tls_config:</span>
<span class="line">        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt</span>
<span class="line">        insecure_skip_verify: <span class="token boolean">true</span></span>
<span class="line">      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token</span>
<span class="line"></span>
<span class="line">  - job_name: <span class="token string">&#39;kubernetes-sd-node-exporter&#39;</span></span>
<span class="line">    kubernetes_sd_configs:</span>
<span class="line">      - role: <span class="token function">node</span></span>
<span class="line">    relabel_configs:</span>
<span class="line">      - source_labels: <span class="token punctuation">[</span>__address__<span class="token punctuation">]</span></span>
<span class="line">        regex: <span class="token string">&#39;(.*):10250&#39;</span></span>
<span class="line">        replacement: <span class="token string">&#39;\${1}:9100&#39;</span></span>
<span class="line">        target_label: __address__</span>
<span class="line">        action: replace</span>
<span class="line"></span>
<span class="line">  - job_name: <span class="token string">&#39;kubernetes-sd-cadvisor&#39;</span></span>
<span class="line">    kubernetes_sd_configs:</span>
<span class="line">      - role: <span class="token function">node</span></span>
<span class="line">    scheme: https</span>
<span class="line">    tls_config:</span>
<span class="line">      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt</span>
<span class="line">      insecure_skip_verify: <span class="token boolean">true</span></span>
<span class="line">    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token</span>
<span class="line">    relabel_configs:</span>
<span class="line">      - target_label: __metrics_path__</span>
<span class="line">        replacement: /metrics/cadvisor</span>
<span class="line"></span>
<span class="line">  - job_name: <span class="token string">&#39;kubernetes-sd-kubelet&#39;</span></span>
<span class="line">    kubernetes_sd_configs:</span>
<span class="line">      - role: <span class="token function">node</span></span>
<span class="line">    scheme: https</span>
<span class="line">    tls_config:</span>
<span class="line">      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt</span>
<span class="line">      insecure_skip_verify: <span class="token boolean">true</span></span>
<span class="line">    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token</span>
<span class="line"></span>
<span class="line">  - job_name: <span class="token string">&#39;kubernetes-sd-endpoints&#39;</span></span>
<span class="line">    kubernetes_sd_configs:</span>
<span class="line">      - role: endpoints</span>
<span class="line">    relabel_configs:</span>
<span class="line">      <span class="token comment"># 只采集有prometheus.io/scrape=true注解的服务</span></span>
<span class="line">      - source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_scrape<span class="token punctuation">]</span></span>
<span class="line">        action: keep</span>
<span class="line">        regex: <span class="token boolean">true</span></span>
<span class="line">      </span>
<span class="line">      <span class="token comment"># 自定义采集路径</span></span>
<span class="line">      - source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_path<span class="token punctuation">]</span></span>
<span class="line">        action: replace</span>
<span class="line">        target_label: __metrics_path__</span>
<span class="line">        regex: <span class="token punctuation">(</span>.+<span class="token punctuation">)</span></span>
<span class="line">      </span>
<span class="line">      <span class="token comment"># 自定义采集端口</span></span>
<span class="line">      - source_labels: <span class="token punctuation">[</span>__address__, __meta_kubernetes_service_annotation_prometheus_io_port<span class="token punctuation">]</span></span>
<span class="line">        action: replace</span>
<span class="line">        target_label: __address__</span>
<span class="line">        regex: <span class="token punctuation">(</span><span class="token punctuation">[</span>^:<span class="token punctuation">]</span>+<span class="token punctuation">)</span><span class="token punctuation">(</span>?::<span class="token punctuation">\\</span>d+<span class="token punctuation">)</span>?<span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">\\</span>d+<span class="token punctuation">)</span></span>
<span class="line">        replacement: <span class="token variable">$1</span><span class="token builtin class-name">:</span><span class="token variable">$2</span></span>
<span class="line">      </span>
<span class="line">      <span class="token comment"># 添加Kubernetes标签</span></span>
<span class="line">      - source_labels: <span class="token punctuation">[</span>__meta_kubernetes_namespace<span class="token punctuation">]</span></span>
<span class="line">        action: replace</span>
<span class="line">        target_label: kubernetes_namespace</span>
<span class="line">      - source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_name<span class="token punctuation">]</span></span>
<span class="line">        action: replace</span>
<span class="line">        target_label: kubernetes_service_name</span>
<span class="line">      - source_labels: <span class="token punctuation">[</span>__meta_kubernetes_pod_name<span class="token punctuation">]</span></span>
<span class="line">        action: replace</span>
<span class="line">        target_label: kubernetes_pod_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="常用服务的-metrics-支持情况" tabindex="-1"><a class="header-anchor" href="#常用服务的-metrics-支持情况"><span>常用服务的 Metrics 支持情况</span></a></h1><h2 id="原生支持-prometheus-metrics" tabindex="-1"><a class="header-anchor" href="#原生支持-prometheus-metrics"><span><strong>原生支持 Prometheus metrics</strong></span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;prometheus-self&#39;</span></span>
<span class="line">  <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;localhost:9090&#39;</span><span class="token punctuation">]</span>  <span class="token comment"># 原生支持</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;coredns&#39;</span></span>
<span class="line">  <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;coredns:9153&#39;</span><span class="token punctuation">]</span>  <span class="token comment"># 原生支持</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;etcd&#39;</span></span>
<span class="line">  <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;etcd:2379&#39;</span><span class="token punctuation">]</span>  <span class="token comment"># 原生支持</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;kubernetes-apiserver&#39;</span></span>
<span class="line">  <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;kubernetes:443&#39;</span><span class="token punctuation">]</span>  <span class="token comment"># 原生支持</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="需要-exporter" tabindex="-1"><a class="header-anchor" href="#需要-exporter"><span><strong>需要 Exporter</strong></span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># MySQL（需要 exporter）</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;mysql&#39;</span></span>
<span class="line">  <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;mysql-exporter:9104&#39;</span><span class="token punctuation">]</span>  <span class="token comment"># 不是 MySQL 本身</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Redis（需要 exporter）</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;redis&#39;</span></span>
<span class="line">  <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;redis-exporter:9121&#39;</span><span class="token punctuation">]</span>  <span class="token comment"># 不是 Redis 本身</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Nginx（需要 exporter 或 module）</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;nginx&#39;</span></span>
<span class="line">  <span class="token key atrule">static_configs</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;nginx-exporter:9113&#39;</span><span class="token punctuation">]</span>  <span class="token comment"># 不是 Nginx 本身</span></span>
<span class="line">    <span class="token comment"># 或者如果使用 nginx-module-vts:</span></span>
<span class="line">    <span class="token comment"># targets: [&#39;nginx:9913&#39;]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实际部署示例" tabindex="-1"><a class="header-anchor" href="#实际部署示例"><span>实际部署示例</span></a></h2><h3 id="场景1-监控外部-mysql-数据库" tabindex="-1"><a class="header-anchor" href="#场景1-监控外部-mysql-数据库"><span>场景1：监控外部 MySQL 数据库</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 部署 mysqld_exporter</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> mysql-exporter <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">9104</span>:9104 <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">DATA_SOURCE_NAME</span><span class="token operator">=</span><span class="token string">&quot;exporter:password@(mysql-server:3306)/&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  prom/mysqld-exporter</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. Prometheus 配置</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> prometheus.yml <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">- job_name: &#39;external-mysql&#39;</span>
<span class="line">  static_configs:</span>
<span class="line">    - targets: [&#39;mysql-exporter-host:9104&#39;]</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="场景2-监控自带-metrics-的服务" tabindex="-1"><a class="header-anchor" href="#场景2-监控自带-metrics-的服务"><span>场景2：监控自带 metrics 的服务</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># CoreDNS（自带 metrics）</span></span>
<span class="line"><span class="token comment"># 无需额外部署，直接配置</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> prometheus.yml <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">- job_name: &#39;coredns&#39;</span>
<span class="line">  static_configs:</span>
<span class="line">    - targets: [&#39;10.96.0.10:9153&#39;]</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="快速检查脚本" tabindex="-1"><a class="header-anchor" href="#快速检查脚本"><span>快速检查脚本</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 检查服务是否提供 Prometheus metrics</span></span>
<span class="line"></span>
<span class="line"><span class="token function-name function">check_service</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">host</span><span class="token operator">=</span><span class="token variable">$2</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">port</span><span class="token operator">=</span><span class="token variable">$3</span></span>
<span class="line">    </span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;检查 <span class="token variable">$name</span> (<span class="token variable">$host</span>:<span class="token variable">$port</span>)... &quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;http://<span class="token variable">\${host}</span>:<span class="token variable">\${port}</span>/metrics&quot;</span> <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>/dev/null <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&quot;prometheus&quot;</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;✅ 原生支持&quot;</span></span>
<span class="line">    <span class="token keyword">elif</span> <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;http://<span class="token variable">\${host}</span>:<span class="token variable">\${port}</span>/metrics&quot;</span> <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>/dev/null <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-1</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&quot;^[a-zA-Z_]&quot;</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;✅ 提供 metrics（可能是 Prometheus 格式）&quot;</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;❌ 需要 exporter&quot;</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试常见服务</span></span>
<span class="line">check_service <span class="token string">&quot;Prometheus自身&quot;</span> <span class="token string">&quot;localhost&quot;</span> <span class="token string">&quot;9090&quot;</span></span>
<span class="line">check_service <span class="token string">&quot;node-exporter&quot;</span> <span class="token string">&quot;localhost&quot;</span> <span class="token string">&quot;9100&quot;</span></span>
<span class="line">check_service <span class="token string">&quot;cAdvisor&quot;</span> <span class="token string">&quot;localhost&quot;</span> <span class="token string">&quot;8080&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,129)])])}const _=n(k,[["render",b]]),y=JSON.parse('{"path":"/07-%E7%9B%91%E6%8E%A7%E4%BD%93%E7%B3%BB/02-prometheus%E7%9B%91%E6%8E%A7/%E7%9B%91%E6%8E%A7%E9%A1%B9.html","title":"一、监控基本原理","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"07-监控体系/02-prometheus监控/监控项.md"}');export{_ as comp,y as data};
