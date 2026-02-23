import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function t(p,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="自动化发布静态网站-ci-cd实践指南" tabindex="-1"><a class="header-anchor" href="#自动化发布静态网站-ci-cd实践指南"><span>自动化发布静态网站 - CI/CD实践指南</span></a></h1><h2 id="一、项目概述" tabindex="-1"><a class="header-anchor" href="#一、项目概述"><span>一、项目概述</span></a></h2><h3 id="_1-1-项目目标" tabindex="-1"><a class="header-anchor" href="#_1-1-项目目标"><span>1.1 项目目标</span></a></h3><p>实现从代码提交到自动化部署的完整CI/CD流水线，通过Jenkins将静态网站一键部署到多台Web服务器。</p><h3 id="_1-2-技术架构" tabindex="-1"><a class="header-anchor" href="#_1-2-技术架构"><span>1.2 技术架构</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">开发人员 → GitLab代码仓库 → Jenkins自动化构建 → 多台Web服务器</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="_1-3-环境准备" tabindex="-1"><a class="header-anchor" href="#_1-3-环境准备"><span>1.3 环境准备</span></a></h3><table><thead><tr><th style="text-align:left;">服务器</th><th style="text-align:left;">IP地址</th><th style="text-align:left;">角色</th><th style="text-align:left;">软件要求</th></tr></thead><tbody><tr><td style="text-align:left;">GitLab服务器</td><td style="text-align:left;">10.0.0.99</td><td style="text-align:left;">代码仓库</td><td style="text-align:left;">GitLab</td></tr><tr><td style="text-align:left;">Jenkins服务器</td><td style="text-align:left;">10.0.0.101</td><td style="text-align:left;">CI/CD构建服务器</td><td style="text-align:left;">Jenkins + Git</td></tr><tr><td style="text-align:left;">Web服务器1</td><td style="text-align:left;">10.0.0.7</td><td style="text-align:left;">生产环境</td><td style="text-align:left;">Nginx</td></tr><tr><td style="text-align:left;">Web服务器2</td><td style="text-align:left;">10.0.0.8</td><td style="text-align:left;">生产环境</td><td style="text-align:left;">Nginx</td></tr></tbody></table><h2 id="二、环境配置" tabindex="-1"><a class="header-anchor" href="#二、环境配置"><span>二、环境配置</span></a></h2><h3 id="_2-1-gitlab代码仓库配置" tabindex="-1"><a class="header-anchor" href="#_2-1-gitlab代码仓库配置"><span>2.1 GitLab代码仓库配置</span></a></h3><ol><li><p><strong>创建项目</strong></p><ul><li>在GitLab中创建新项目</li><li>导入示例静态网站代码库：<code>https://gitee.com/lvyeyou/DaShuJuZhiDaPingZhanShi.git</code></li></ul></li><li><p><strong>项目结构</strong></p><p>text</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">智慧城市/</span>
<span class="line">└── 智慧工地/</span>
<span class="line">    ├── index.html</span>
<span class="line">    ├── css/</span>
<span class="line">    ├── js/</span>
<span class="line">    └── images/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="_2-2-jenkins服务器配置" tabindex="-1"><a class="header-anchor" href="#_2-2-jenkins服务器配置"><span>2.2 Jenkins服务器配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 安装Git</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token function">git</span> <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 配置SSH免密登录到Web服务器</span></span>
<span class="line">ssh-keygen <span class="token parameter variable">-t</span> rsa  <span class="token comment"># 生成密钥对</span></span>
<span class="line">ssh-copy-id root@10.0.0.7</span>
<span class="line">ssh-copy-id root@10.0.0.8</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 创建部署脚本目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /my_shell</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-web服务器配置" tabindex="-1"><a class="header-anchor" href="#_2-3-web服务器配置"><span>2.3 Web服务器配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装Nginx（在Web7和Web8上执行）</span></span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建代码存放目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /code</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置Nginx虚拟主机</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/nginx/conf.d/monitor.conf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">server{</span>
<span class="line">    listen 80;</span>
<span class="line">    server_name _;</span>
<span class="line">    location / {</span>
<span class="line">        root /code/web/智慧城市/智慧工地;</span>
<span class="line">        index index.html;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启Nginx</span></span>
<span class="line"><span class="token function">pkill</span> <span class="token parameter variable">-9</span> nginx</span>
<span class="line">systemctl restart nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、jenkins流水线配置" tabindex="-1"><a class="header-anchor" href="#三、jenkins流水线配置"><span>三、Jenkins流水线配置</span></a></h2><h3 id="_3-1-创建jenkins任务" tabindex="-1"><a class="header-anchor" href="#_3-1-创建jenkins任务"><span>3.1 创建Jenkins任务</span></a></h3><ol><li><p><strong>新建项目</strong> → <strong>自由风格项目</strong></p><ul><li>项目名称：<code>html-deploy</code></li><li>描述：自动化部署静态网站</li></ul></li><li><p><strong>源码管理配置</strong></p><p>text</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">源码管理：Git</span>
<span class="line">Repository URL: http://10.0.0.99/chaoge/linux0224_html.git</span>
<span class="line">分支：*/master</span>
<span class="line">凭证：添加GitLab账号密码</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="_3-2-部署脚本编写" tabindex="-1"><a class="header-anchor" href="#_3-2-部署脚本编写"><span>3.2 部署脚本编写</span></a></h3><p>在Jenkins机器上创建部署脚本：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># filename: /my_shell/html.sh</span></span>
<span class="line"><span class="token comment"># author: www.yuchaoit.cn</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 进入代码目录，打包传输</span></span>
<span class="line"><span class="token assign-left variable">DATE</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y-%m-%d-%H-%M-%S<span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">web_server_list</span><span class="token operator">=</span><span class="token string">&quot;10.0.0.7 10.0.0.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function-name function">get_code</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token variable">\${WORKSPACE}</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token function">tar</span> czf /opt/web-<span class="token variable">\${DATE}</span>.tar.gz ./*</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 代码发送到Web集群</span></span>
<span class="line"><span class="token comment"># 基于软连接实现版本切换和回滚</span></span>
<span class="line"><span class="token function-name function">scp_web_server</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token for-or-select variable">host</span> <span class="token keyword">in</span> <span class="token variable">$web_server_list</span></span>
<span class="line">    <span class="token keyword">do</span></span>
<span class="line">        <span class="token comment"># 传输代码包</span></span>
<span class="line">        <span class="token function">scp</span> /opt/web-<span class="token variable">\${DATE}</span>.tar.gz root@<span class="token variable">$host</span>:/opt/</span>
<span class="line">        </span>
<span class="line">        <span class="token comment"># 解压到版本目录</span></span>
<span class="line">        <span class="token function">ssh</span> root@<span class="token variable">$host</span> <span class="token string">&quot;mkdir -p /code/web-<span class="token variable">\${DATE}</span> &amp;&amp; \\</span>
<span class="line">                        tar -zxf /opt/web-<span class="token variable">\${DATE}</span>.tar.gz -C /code/web-<span class="token variable">\${DATE}</span>&quot;</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment"># 更新软链接（原子操作）</span></span>
<span class="line">        <span class="token function">ssh</span> root@<span class="token variable">$host</span> <span class="token string">&quot;rm -rf /code/web &amp;&amp; \\</span>
<span class="line">                        ln -s /code/web-<span class="token variable">\${DATE}</span> /code/web&quot;</span></span>
<span class="line">        </span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;已部署到服务器: <span class="token variable">$host</span>&quot;</span></span>
<span class="line">    <span class="token keyword">done</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token function-name function">deploy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    get_code</span>
<span class="line">    scp_web_server</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 执行入口</span></span>
<span class="line">deploy</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-jenkins构建配置" tabindex="-1"><a class="header-anchor" href="#_3-3-jenkins构建配置"><span>3.3 Jenkins构建配置</span></a></h3><ol><li><p><strong>构建触发器</strong>：Poll SCM（可选，定期检查代码变更）</p></li><li><p><strong>构建环境</strong>：</p><ul><li>Delete workspace before build starts（可选，清理工作空间）</li></ul></li><li><p><strong>构建步骤</strong>：</p><p>text</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">执行shell：</span>
<span class="line">/my_shell/html.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="_3-4-常见问题解决" tabindex="-1"><a class="header-anchor" href="#_3-4-常见问题解决"><span>3.4 常见问题解决</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. Host key verification failed 错误</span></span>
<span class="line"><span class="token comment"># 解决方法：在Jenkins机器上手动SSH连接一次Web服务器</span></span>
<span class="line"><span class="token function">ssh</span> root@10.0.0.7 <span class="token string">&quot;exit&quot;</span></span>
<span class="line"><span class="token function">ssh</span> root@10.0.0.8 <span class="token string">&quot;exit&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 权限问题</span></span>
<span class="line"><span class="token comment"># 确保Jenkins用户有执行脚本权限</span></span>
<span class="line"><span class="token function">chmod</span> +x /my_shell/html.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 网络连接问题</span></span>
<span class="line"><span class="token comment"># 检查防火墙和网络连通性</span></span>
<span class="line"><span class="token function">ping</span> <span class="token number">10.0</span>.0.7</span>
<span class="line"><span class="token function">ping</span> <span class="token number">10.0</span>.0.8</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、webhook自动化触发配置" tabindex="-1"><a class="header-anchor" href="#四、webhook自动化触发配置"><span>四、WebHook自动化触发配置</span></a></h2><h3 id="_4-1-jenkins配置webhook" tabindex="-1"><a class="header-anchor" href="#_4-1-jenkins配置webhook"><span>4.1 Jenkins配置WebHook</span></a></h3><ol><li><strong>安装插件</strong>：GitLab Plugin（如未安装）</li><li><strong>项目配置</strong>： <ul><li>勾选&quot;Build when a change is pushed to GitLab&quot;</li><li>生成Secret token，例如：<code>095212d20ac3a465641d2331b0086432</code></li><li>WebHook URL：<code>http://10.0.0.101:8080/project/html-deploy</code></li></ul></li></ol><h3 id="_4-2-gitlab配置webhook" tabindex="-1"><a class="header-anchor" href="#_4-2-gitlab配置webhook"><span>4.2 GitLab配置WebHook</span></a></h3><ol><li><p><strong>进入项目设置</strong> → <strong>WebHooks</strong></p></li><li><p><strong>添加WebHook</strong>：</p><p>text</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">URL: http://10.0.0.101:8080/project/html-deploy</span>
<span class="line">Secret Token: 095212d20ac3a465641d2331b0086432</span>
<span class="line">触发事件：Push events</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>启用SSL验证</strong>：取消勾选（内网环境）</p></li><li><p><strong>测试连接</strong>：点击&quot;Test&quot;，确认返回HTTP 200</p></li></ol><h3 id="_4-3-本地网络请求配置" tabindex="-1"><a class="header-anchor" href="#_4-3-本地网络请求配置"><span>4.3 本地网络请求配置</span></a></h3><p>在GitLab服务器上允许本地网络请求：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 编辑GitLab配置文件</span></span>
<span class="line"><span class="token function">vim</span> /etc/gitlab/gitlab.rb</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加配置</span></span>
<span class="line">gitlab_rails<span class="token punctuation">[</span><span class="token string">&#39;webhook_allow_localhost&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span></span>
<span class="line">gitlab_rails<span class="token punctuation">[</span><span class="token string">&#39;allow_local_requests_from_web_hooks_and_services&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新配置GitLab</span></span>
<span class="line">gitlab-ctl reconfigure</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、完整工作流程" tabindex="-1"><a class="header-anchor" href="#五、完整工作流程"><span>五、完整工作流程</span></a></h2><h3 id="_5-1-开发人员工作流" tabindex="-1"><a class="header-anchor" href="#_5-1-开发人员工作流"><span>5.1 开发人员工作流</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 克隆代码</span></span>
<span class="line"><span class="token function">git</span> clone http://10.0.0.99/chaoge/linux0224_html.git</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 修改代码</span></span>
<span class="line"><span class="token function">vim</span> index.html</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 提交更改</span></span>
<span class="line"><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span></span>
<span class="line"><span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;更新页面内容&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 推送代码（触发自动化部署）</span></span>
<span class="line"><span class="token function">git</span> push origin master</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 注意：如遇代码冲突</span></span>
<span class="line"><span class="token function">git</span> pull origin master</span>
<span class="line"><span class="token comment"># 手动解决冲突后重新提交</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-自动化部署流程" tabindex="-1"><a class="header-anchor" href="#_5-2-自动化部署流程"><span>5.2 自动化部署流程</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">1. 开发人员推送代码到GitLab</span>
<span class="line">2. GitLab触发WebHook通知Jenkins</span>
<span class="line">3. Jenkins拉取最新代码</span>
<span class="line">4. 执行部署脚本：</span>
<span class="line">   - 打包代码</span>
<span class="line">   - 传输到Web服务器</span>
<span class="line">   - 解压到版本目录</span>
<span class="line">   - 更新软链接</span>
<span class="line">5. 访问网站验证更新</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-版本回滚机制" tabindex="-1"><a class="header-anchor" href="#_5-3-版本回滚机制"><span>5.3 版本回滚机制</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 如果需要回滚到上一个版本</span></span>
<span class="line"><span class="token comment"># 在Web服务器上执行：</span></span>
<span class="line"><span class="token function">rm</span> /code/web</span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /code/web-<span class="token operator">&lt;</span>previous-date<span class="token operator">&gt;</span> /code/web</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 示例：回滚到2024-01-04版本</span></span>
<span class="line"><span class="token function">rm</span> /code/web</span>
<span class="line"><span class="token function">ln</span> <span class="token parameter variable">-s</span> /code/web-2024-01-04-15-30-00 /code/web</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、测试验证" tabindex="-1"><a class="header-anchor" href="#六、测试验证"><span>六、测试验证</span></a></h2><h3 id="_6-1-首次构建测试" tabindex="-1"><a class="header-anchor" href="#_6-1-首次构建测试"><span>6.1 首次构建测试</span></a></h3><ol><li><p>在Jenkins中点击&quot;Build Now&quot;</p></li><li><p>查看控制台输出，确认部署成功</p></li><li><p>访问测试：</p><p>text</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">http://10.0.0.7</span>
<span class="line">http://10.0.0.8</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="_6-2-webhook触发测试" tabindex="-1"><a class="header-anchor" href="#_6-2-webhook触发测试"><span>6.2 WebHook触发测试</span></a></h3><ol><li>修改代码并推送到GitLab</li><li>观察Jenkins自动触发构建</li><li>验证网站内容已更新</li></ol><h3 id="_6-3-多版本验证" tabindex="-1"><a class="header-anchor" href="#_6-3-多版本验证"><span>6.3 多版本验证</span></a></h3><ol><li><p>多次修改和推送代码</p></li><li><p>检查Web服务器上的版本目录：</p><p>bash</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ls -la /code/</span>
<span class="line"># 应看到类似结构：</span>
<span class="line"># web -&gt; web-2024-01-05-10-30-00</span>
<span class="line"># web-2024-01-05-10-30-00</span>
<span class="line"># web-2024-01-05-09-45-00</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="七、优化建议" tabindex="-1"><a class="header-anchor" href="#七、优化建议"><span>七、优化建议</span></a></h2><h3 id="_7-1-脚本优化" tabindex="-1"><a class="header-anchor" href="#_7-1-脚本优化"><span>7.1 脚本优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 添加错误处理和日志记录</span></span>
<span class="line"><span class="token builtin class-name">set</span> <span class="token parameter variable">-e</span>  <span class="token comment"># 遇到错误立即退出</span></span>
<span class="line"><span class="token builtin class-name">set</span> <span class="token parameter variable">-o</span> pipefail  <span class="token comment"># 管道命令错误也会被捕获</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加日志记录</span></span>
<span class="line"><span class="token assign-left variable">log_file</span><span class="token operator">=</span><span class="token string">&quot;/var/log/deploy-<span class="token variable">\${DATE}</span>.log&quot;</span></span>
<span class="line"><span class="token builtin class-name">exec</span> <span class="token operator">&gt;</span> <span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token function">tee</span> <span class="token parameter variable">-a</span> <span class="token string">&quot;<span class="token variable">$log_file</span>&quot;</span><span class="token punctuation">)</span> <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加清理旧版本功能（保留最近5个版本）</span></span>
<span class="line"><span class="token function-name function">clean_old_versions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token for-or-select variable">host</span> <span class="token keyword">in</span> <span class="token variable">$web_server_list</span></span>
<span class="line">    <span class="token keyword">do</span></span>
<span class="line">        <span class="token function">ssh</span> root@<span class="token variable">$host</span> <span class="token string">&quot;cd /code &amp;&amp; ls -td web-* | tail -n +6 | xargs rm -rf&quot;</span></span>
<span class="line">    <span class="token keyword">done</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-安全优化" tabindex="-1"><a class="header-anchor" href="#_7-2-安全优化"><span>7.2 安全优化</span></a></h3><ol><li><strong>使用非root用户</strong>：创建专用部署用户</li><li><strong>SSH密钥管理</strong>：使用部署专用密钥</li><li><strong>网络隔离</strong>：限制Jenkins到Web服务器的访问</li><li><strong>代码验证</strong>：添加代码扫描和安全检查</li></ol><h3 id="_7-3-扩展功能" tabindex="-1"><a class="header-anchor" href="#_7-3-扩展功能"><span>7.3 扩展功能</span></a></h3><ol><li><strong>多环境部署</strong>：添加测试环境、预生产环境</li><li><strong>蓝绿部署</strong>：实现零停机部署</li><li><strong>监控告警</strong>：集成监控系统，部署失败时告警</li><li><strong>通知机制</strong>：部署成功/失败时发送通知（邮件、钉钉、Slack）</li></ol><h2 id="八、故障排查" tabindex="-1"><a class="header-anchor" href="#八、故障排查"><span>八、故障排查</span></a></h2><h3 id="常见问题及解决方案" tabindex="-1"><a class="header-anchor" href="#常见问题及解决方案"><span>常见问题及解决方案</span></a></h3><table><thead><tr><th style="text-align:left;">问题</th><th style="text-align:left;">可能原因</th><th style="text-align:left;">解决方案</th></tr></thead><tbody><tr><td style="text-align:left;">构建失败：Host key verification failed</td><td style="text-align:left;">SSH首次连接未确认</td><td style="text-align:left;">手动SSH连接一次目标服务器</td></tr><tr><td style="text-align:left;">WebHook未触发</td><td style="text-align:left;">GitLab配置错误</td><td style="text-align:left;">检查URL、Token、网络连通性</td></tr><tr><td style="text-align:left;">Nginx 403错误</td><td style="text-align:left;">文件权限问题</td><td style="text-align:left;">检查Nginx用户对代码目录的权限</td></tr><tr><td style="text-align:left;">部署后页面未更新</td><td style="text-align:left;">软链接错误</td><td style="text-align:left;">检查软链接是否指向正确版本目录</td></tr><tr><td style="text-align:left;">Jenkins无法拉取代码</td><td style="text-align:left;">凭证错误</td><td style="text-align:left;">重新配置GitLab访问凭证</td></tr></tbody></table><h2 id="九、总结" tabindex="-1"><a class="header-anchor" href="#九、总结"><span>九、总结</span></a></h2><p>通过本实践，您已掌握：</p><ol><li>GitLab + Jenkins + Nginx 的CI/CD流水线搭建</li><li>自动化部署脚本编写</li><li>WebHook配置实现自动触发</li><li>多服务器批量部署</li><li>版本管理和回滚机制</li></ol><p>这套自动化部署方案可应用于各种静态资源部署场景，通过简单的修改即可适配不同的项目需求。</p><hr><p><strong>后续学习建议</strong>：</p><ol><li>学习使用Jenkins Pipeline（声明式/脚本式）</li><li>探索容器化部署（Docker + Kubernetes）</li><li>了解基础设施即代码（Terraform、Ansible）</li><li>实践微服务架构的CI/CD</li></ol>`,64)])])}const d=n(i,[["render",t]]),r=JSON.parse('{"path":"/08-CI-CD/01-git%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6/5-cicd%E5%AE%9E%E8%B7%B5%E5%8F%91%E5%B8%83%E9%9D%99%E6%80%81%E7%BD%91%E7%AB%99.html","title":"自动化发布静态网站 - CI/CD实践指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"08-CI-CD/01-git版本控制/5-cicd实践发布静态网站.md"}');export{d as comp,r as data};
