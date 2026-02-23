import{_ as a,c as n,e,o as l}from"./app-DtXLoKBz.js";const i="/assets/image-20260120222647648-D8D4Dp6V.png",r={};function p(c,s){return l(),n("div",null,[...s[0]||(s[0]=[e(`<h1 id="harbor-私有镜像仓库部署" tabindex="-1"><a class="header-anchor" href="#harbor-私有镜像仓库部署"><span>Harbor 私有镜像仓库部署</span></a></h1><h2 id="一、harbor-安装部署" tabindex="-1"><a class="header-anchor" href="#一、harbor-安装部署"><span>一、Harbor 安装部署</span></a></h2><h3 id="准备安装包" tabindex="-1"><a class="header-anchor" href="#准备安装包"><span>准备安装包</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">harbor-offline-installer-v1.9.0-rc1.tgz</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h3 id="安装步骤" tabindex="-1"><a class="header-anchor" href="#安装步骤"><span>安装步骤</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 解压安装包</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt <span class="token operator">&amp;&amp;</span> <span class="token function">tar</span> <span class="token parameter variable">-xf</span> harbor-offline-installer-v1.9.0-rc1.tgz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 进入安装目录</span></span>
<span class="line"><span class="token builtin class-name">cd</span> harbor/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 编辑配置文件</span></span>
<span class="line"><span class="token function">vim</span> harbor.yml</span>
<span class="line"><span class="token comment"># hostname: 10.0.0.200</span></span>
<span class="line"><span class="token comment"># harbor_admin_password: Harbor12345</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 执行安装脚本</span></span>
<span class="line">./install.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 访问 Harbor</span></span>
<span class="line"><span class="token comment"># URL: http://10.0.0.200:80</span></span>
<span class="line"><span class="token comment"># 用户名: admin</span></span>
<span class="line"><span class="token comment"># 密码: Harbor12345</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6. 新建项目 first</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、配置-docker-客户端" tabindex="-1"><a class="header-anchor" href="#二、配置-docker-客户端"><span>二、配置 Docker 客户端</span></a></h2><h3 id="修改宿主机-docker-配置" tabindex="-1"><a class="header-anchor" href="#修改宿主机-docker-配置"><span>修改宿主机 Docker 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">vim</span> /etc/docker/daemon.json</span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;registry-mirrors&quot;</span> <span class="token builtin class-name">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">&quot;https://ms9glx6x.mirror.aliyuncs.com&quot;</span></span>
<span class="line">  <span class="token punctuation">]</span>,</span>
<span class="line">  <span class="token string">&quot;insecure-registries&quot;</span>:<span class="token punctuation">[</span><span class="token string">&quot;http://10.0.0.200&quot;</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl restart <span class="token function">docker</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意事项</strong>：</p><ul><li>注意这里的端口，可能有其他容器抢占 Harbor 在宿主机对应的端口</li><li><code>docker update --restart=no image1</code> 可关闭某自动跟随 Docker 重启的容器</li></ul><hr><h2 id="三、推送镜像到-harbor" tabindex="-1"><a class="header-anchor" href="#三、推送镜像到-harbor"><span>三、推送镜像到 Harbor</span></a></h2><h3 id="推送本地镜像" tabindex="-1"><a class="header-anchor" href="#推送本地镜像"><span>推送本地镜像</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 标记镜像</span></span>
<span class="line"><span class="token function">docker</span> tag alpine:latest <span class="token number">10.0</span>.0.200/first/alpine:latest</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 登录 Harbor</span></span>
<span class="line"><span class="token function">docker</span> login <span class="token number">10.0</span>.0.200</span>
<span class="line"><span class="token comment"># 用户名: admin</span></span>
<span class="line"><span class="token comment"># 密码: Harbor12345</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 推送镜像</span></span>
<span class="line"><span class="token function">docker</span> push <span class="token number">10.0</span>.0.200/first/alpine:latest</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+i+`" alt="image-20260120222647648"></p><hr><h2 id="四、harbor-管理命令" tabindex="-1"><a class="header-anchor" href="#四、harbor-管理命令"><span>四、Harbor 管理命令</span></a></h2><h3 id="停止运行" tabindex="-1"><a class="header-anchor" href="#停止运行"><span>停止运行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 停止 Harbor</span></span>
<span class="line"><span class="token function">docker-compose</span> stop</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="启动-harbor" tabindex="-1"><a class="header-anchor" href="#启动-harbor"><span>启动 Harbor</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 启动 Harbor</span></span>
<span class="line"><span class="token function">docker-compose</span> start</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="重启-harbor" tabindex="-1"><a class="header-anchor" href="#重启-harbor"><span>重启 Harbor</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 重启 Harbor</span></span>
<span class="line"><span class="token function">docker-compose</span> restart</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="停止并删除容器" tabindex="-1"><a class="header-anchor" href="#停止并删除容器"><span>停止并删除容器</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 停止并删除容器</span></span>
<span class="line"><span class="token function">docker-compose</span> down</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="停止并删除容器及数据" tabindex="-1"><a class="header-anchor" href="#停止并删除容器及数据"><span>停止并删除容器及数据</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 停止并删除容器及数据</span></span>
<span class="line"><span class="token function">docker-compose</span> down <span class="token parameter variable">-v</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、harbor-常用操作" tabindex="-1"><a class="header-anchor" href="#五、harbor-常用操作"><span>五、Harbor 常用操作</span></a></h2><h3 id="拉取镜像" tabindex="-1"><a class="header-anchor" href="#拉取镜像"><span>拉取镜像</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 拉取镜像</span></span>
<span class="line"><span class="token function">docker</span> pull <span class="token number">10.0</span>.0.200/first/alpine:latest</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="搜索镜像" tabindex="-1"><a class="header-anchor" href="#搜索镜像"><span>搜索镜像</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 搜索镜像</span></span>
<span class="line"><span class="token function">docker</span> search <span class="token number">10.0</span>.0.200/first/alpine</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="删除镜像" tabindex="-1"><a class="header-anchor" href="#删除镜像"><span>删除镜像</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 删除本地镜像</span></span>
<span class="line"><span class="token function">docker</span> rmi <span class="token number">10.0</span>.0.200/first/alpine:latest</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在 Harbor 界面中删除镜像</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、harbor-项目管理" tabindex="-1"><a class="header-anchor" href="#六、harbor-项目管理"><span>六、Harbor 项目管理</span></a></h2><h3 id="创建项目" tabindex="-1"><a class="header-anchor" href="#创建项目"><span>创建项目</span></a></h3><ol><li>登录 Harbor 界面</li><li>点击&quot;项目&quot; → &quot;新建项目&quot;</li><li>填写项目名称（如 first）</li><li>选择项目可见性（公开/私有）</li><li>点击&quot;确定&quot;</li></ol><hr><h3 id="添加用户" tabindex="-1"><a class="header-anchor" href="#添加用户"><span>添加用户</span></a></h3><ol><li>点击&quot;用户管理&quot; → &quot;新建用户&quot;</li><li>填写用户信息</li><li>设置用户角色</li></ol><hr><h3 id="分配权限" tabindex="-1"><a class="header-anchor" href="#分配权限"><span>分配权限</span></a></h3><ol><li>进入项目设置</li><li>点击&quot;成员&quot;</li><li>添加用户并分配角色（开发者/维护者/访客）</li></ol><hr><h2 id="七、harbor-高级配置" tabindex="-1"><a class="header-anchor" href="#七、harbor-高级配置"><span>七、Harbor 高级配置</span></a></h2><h3 id="配置-https" tabindex="-1"><a class="header-anchor" href="#配置-https"><span>配置 HTTPS</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 生成证书</span></span>
<span class="line">openssl genrsa <span class="token parameter variable">-out</span> ca.key <span class="token number">4096</span></span>
<span class="line">openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-x509</span> <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-key</span> ca.key <span class="token parameter variable">-out</span> ca.crt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 编辑 harbor.yml</span></span>
<span class="line"><span class="token function">vim</span> harbor.yml</span>
<span class="line"><span class="token comment"># https:</span></span>
<span class="line"><span class="token comment">#   port: 443</span></span>
<span class="line"><span class="token comment">#   certificate: /your/certificate/path</span></span>
<span class="line"><span class="token comment">#   private_key: /your/private/key/path</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 重新配置</span></span>
<span class="line">./prepare</span>
<span class="line"><span class="token function">docker-compose</span> down <span class="token parameter variable">-v</span></span>
<span class="line">./install.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="配置存储后端" tabindex="-1"><a class="header-anchor" href="#配置存储后端"><span>配置存储后端</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 编辑 harbor.yml</span></span>
<span class="line"><span class="token function">vim</span> harbor.yml</span>
<span class="line"><span class="token comment"># storage:</span></span>
<span class="line"><span class="token comment">#   s3:</span></span>
<span class="line"><span class="token comment">#     accesskey: &lt;access_key&gt;</span></span>
<span class="line"><span class="token comment">#     secretkey: &lt;secret_key&gt;</span></span>
<span class="line"><span class="token comment">#     region: &lt;region&gt;</span></span>
<span class="line"><span class="token comment">#     regionendpoint: &lt;endpoint&gt;</span></span>
<span class="line"><span class="token comment">#     bucket: &lt;bucket_name&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="配置镜像复制" tabindex="-1"><a class="header-anchor" href="#配置镜像复制"><span>配置镜像复制</span></a></h3><ol><li>在目标 Harbor 创建项目</li><li>在源 Harbor 配置复制规则</li><li>设置复制策略（手动/定时）</li><li>测试复制功能</li></ol><hr><h2 id="八、harbor-备份与恢复" tabindex="-1"><a class="header-anchor" href="#八、harbor-备份与恢复"><span>八、Harbor 备份与恢复</span></a></h2><h3 id="备份数据" tabindex="-1"><a class="header-anchor" href="#备份数据"><span>备份数据</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 备份数据库</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-i</span> harbor-db mysqldump <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-pHarbor12345</span> registry <span class="token operator">&gt;</span> /data/backup/registry.sql</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 备份配置文件</span></span>
<span class="line"><span class="token function">cp</span> harbor.yml /data/backup/</span>
<span class="line"><span class="token function">cp</span> /data/secretkey /data/backup/</span>
<span class="line"><span class="token function">cp</span> /data/ssl/* /data/backup/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="恢复数据" tabindex="-1"><a class="header-anchor" href="#恢复数据"><span>恢复数据</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 恢复数据库</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-i</span> harbor-db mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-pHarbor12345</span> registry <span class="token operator">&lt;</span> /data/backup/registry.sql</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 恢复配置文件</span></span>
<span class="line"><span class="token function">cp</span> /data/backup/harbor.yml <span class="token builtin class-name">.</span></span>
<span class="line"><span class="token function">cp</span> /data/backup/secretkey /data/</span>
<span class="line"><span class="token function">cp</span> /data/backup/* /data/ssl/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启 Harbor</span></span>
<span class="line"><span class="token function">docker-compose</span> down <span class="token parameter variable">-v</span></span>
<span class="line">./prepare</span>
<span class="line">./install.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="九、harbor-监控与日志" tabindex="-1"><a class="header-anchor" href="#九、harbor-监控与日志"><span>九、Harbor 监控与日志</span></a></h2><h3 id="查看日志" tabindex="-1"><a class="header-anchor" href="#查看日志"><span>查看日志</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看 Harbor 日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs <span class="token parameter variable">-f</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看特定服务日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs <span class="token parameter variable">-f</span> harbor-core</span>
<span class="line"><span class="token function">docker-compose</span> logs <span class="token parameter variable">-f</span> harbor-jobservice</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="监控-harbor" tabindex="-1"><a class="header-anchor" href="#监控-harbor"><span>监控 Harbor</span></a></h3><ol><li>使用 Prometheus + Grafana 监控 Harbor</li><li>配置 Harbor 指标导出</li><li>设置告警规则</li></ol><hr><h2 id="十、harbor-故障排查" tabindex="-1"><a class="header-anchor" href="#十、harbor-故障排查"><span>十、Harbor 故障排查</span></a></h2><h3 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h3><p><strong>1. 登录失败</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查 Harbor 服务状态</span></span>
<span class="line"><span class="token function">docker-compose</span> <span class="token function">ps</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs harbor-core</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>2. 镜像推送失败</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查 Docker 配置</span></span>
<span class="line"><span class="token function">cat</span> /etc/docker/daemon.json</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查网络连接</span></span>
<span class="line"><span class="token function">ping</span> <span class="token number">10.0</span>.0.200</span>
<span class="line">telnet <span class="token number">10.0</span>.0.200 <span class="token number">80</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>3. Harbor 无法启动</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查端口占用</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">80</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查磁盘空间</span></span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="清理-harbor" tabindex="-1"><a class="header-anchor" href="#清理-harbor"><span>清理 Harbor</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 清理未使用的镜像</span></span>
<span class="line"><span class="token function">docker</span> system prune <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理 Harbor 数据</span></span>
<span class="line"><span class="token function">docker-compose</span> down <span class="token parameter variable">-v</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> /data/*</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,92)])])}const d=a(r,[["render",p]]),o=JSON.parse('{"path":"/05-%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92/02-docker%E5%AE%B9%E5%99%A8/4-%E5%AE%B9%E5%99%A8%E4%BB%93%E5%BA%93harbor.html","title":"Harbor 私有镜像仓库部署","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"05-容器编排/02-docker容器/4-容器仓库harbor.md"}');export{d as comp,o as data};
