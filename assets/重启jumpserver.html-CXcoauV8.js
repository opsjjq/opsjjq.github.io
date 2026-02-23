import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="jumpserver-堡垒机重启部署指南" tabindex="-1"><a class="header-anchor" href="#jumpserver-堡垒机重启部署指南"><span>Jumpserver 堡垒机重启部署指南</span></a></h1><h2 id="系统重启后组件启动顺序与问题排查" tabindex="-1"><a class="header-anchor" href="#系统重启后组件启动顺序与问题排查"><span>系统重启后组件启动顺序与问题排查</span></a></h2><h3 id="_1-系统重启后状态检查" tabindex="-1"><a class="header-anchor" href="#_1-系统重启后状态检查"><span>1. 系统重启后状态检查</span></a></h3><h4 id="数据库服务器-db-51" tabindex="-1"><a class="header-anchor" href="#数据库服务器-db-51"><span>数据库服务器 (db-51)</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查服务状态</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span></span>
<span class="line"><span class="token comment"># 应看到：</span></span>
<span class="line"><span class="token comment"># - MySQL: 3306 端口</span></span>
<span class="line"><span class="token comment"># - Redis: 6379 端口</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="管理服务器-master-61" tabindex="-1"><a class="header-anchor" href="#管理服务器-master-61"><span>管理服务器 (master-61)</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 初始状态只应有基础服务</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span></span>
<span class="line"><span class="token comment"># 应看到：</span></span>
<span class="line"><span class="token comment"># - SSH: 22 端口</span></span>
<span class="line"><span class="token comment"># - Postfix: 25 端口</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-组件启动顺序与依赖关系" tabindex="-1"><a class="header-anchor" href="#_2-组件启动顺序与依赖关系"><span>2. 组件启动顺序与依赖关系</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">1. Core后端服务 (Python)</span>
<span class="line">2. Lina前端服务 (Vue.js)</span>
<span class="line">3. Luna网页终端服务 (Angular)</span>
<span class="line">4. Koko SSH服务 (Golang)</span>
<span class="line">5. Lion VNC服务 (Golang + Guacamole)</span>
<span class="line">6. Nginx反向代理</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-core-后端服务启动" tabindex="-1"><a class="header-anchor" href="#_3-core-后端服务启动"><span>3. Core 后端服务启动</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 进入项目目录</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/jumpserver-v2.12.0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 激活虚拟环境</span></span>
<span class="line"><span class="token builtin class-name">source</span> /opt/venv_py3/bin/activate</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 检查内存（至少需要4G）</span></span>
<span class="line"><span class="token function">free</span> <span class="token parameter variable">-m</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 启动所有Core服务</span></span>
<span class="line">./jms start all <span class="token parameter variable">-d</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 验证服务状态</span></span>
<span class="line">./jms status</span>
<span class="line"><span class="token comment"># 应看到6个进程运行：</span></span>
<span class="line"><span class="token comment"># - gunicorn (HTTP服务)</span></span>
<span class="line"><span class="token comment"># - flower (监控)</span></span>
<span class="line"><span class="token comment"># - daphne (WebSocket)</span></span>
<span class="line"><span class="token comment"># - celery_ansible (异步任务)</span></span>
<span class="line"><span class="token comment"># - celery_default (默认异步任务)</span></span>
<span class="line"><span class="token comment"># - beat (定时任务)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6. 检查端口</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;8080|8070|5555&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-lina-前端服务启动" tabindex="-1"><a class="header-anchor" href="#_4-lina-前端服务启动"><span>4. Lina 前端服务启动</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 进入项目目录</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/lina-v2.12.0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 启动服务</span></span>
<span class="line"><span class="token function">nohup</span> <span class="token function">yarn</span> serve <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 验证端口</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">9528</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-luna-网页终端启动" tabindex="-1"><a class="header-anchor" href="#_5-luna-网页终端启动"><span>5. Luna 网页终端启动</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 进入项目目录</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/luna-v2.12.0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 绑定到0.0.0.0以允许外部访问</span></span>
<span class="line"><span class="token function">nohup</span> ng serve --proxy-config proxy.conf.json <span class="token parameter variable">--host</span> <span class="token number">0.0</span>.0.0 <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 验证端口</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">4200</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-koko-ssh服务启动" tabindex="-1"><a class="header-anchor" href="#_6-koko-ssh服务启动"><span>6. Koko SSH服务启动</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 进入项目目录</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/koko-v2.12.0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 启动服务</span></span>
<span class="line">./koko <span class="token parameter variable">-f</span> config.yml <span class="token parameter variable">-d</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 验证端口</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;5000|2222&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 查看日志</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> data/logs/koko.log</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-lion-vnc服务启动" tabindex="-1"><a class="header-anchor" href="#_7-lion-vnc服务启动"><span>7. Lion VNC服务启动</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 启动Guacamole服务</span></span>
<span class="line">/etc/init.d/guacd start</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 进入项目目录</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/lion-v2.12.0-linux-amd64</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 启动服务</span></span>
<span class="line"><span class="token function">nohup</span> ./lion <span class="token parameter variable">-f</span> config.yml <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 验证端口</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">8081</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-nginx配置与启动" tabindex="-1"><a class="header-anchor" href="#_8-nginx配置与启动"><span>8. Nginx配置与启动</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 配置主机名解析</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;10.0.0.61 luna koko lion core lina&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/hosts</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 测试配置</span></span>
<span class="line">nginx <span class="token parameter variable">-t</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 重载配置</span></span>
<span class="line">nginx <span class="token parameter variable">-s</span> reload</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 或重启服务</span></span>
<span class="line">systemctl restart nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-访问验证" tabindex="-1"><a class="header-anchor" href="#_9-访问验证"><span>9. 访问验证</span></a></h3><h4 id="统一入口" tabindex="-1"><a class="header-anchor" href="#统一入口"><span>统一入口</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">http://10.0.0.61</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="组件独立访问" tabindex="-1"><a class="header-anchor" href="#组件独立访问"><span>组件独立访问</span></a></h4><ul><li>Lina前端: <code>http://10.0.0.61:9528</code></li><li>Luna终端: <code>http://10.0.0.61:4200</code></li><li>Core后端: <code>http://10.0.0.61:8080</code></li></ul><h3 id="_10-常见问题排查" tabindex="-1"><a class="header-anchor" href="#_10-常见问题排查"><span>10. 常见问题排查</span></a></h3><h4 id="问题1-前端无法访问后端api" tabindex="-1"><a class="header-anchor" href="#问题1-前端无法访问后端api"><span>问题1：前端无法访问后端API</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看Lina日志</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /opt/lina-v2.12.0/nohup.out</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 常见错误：</span></span>
<span class="line"><span class="token comment"># Proxy error: Could not proxy request /api/v1/settings/public/ </span></span>
<span class="line"><span class="token comment"># from 10.0.0.61:9528 to http://localhost:8080 (ECONNREFUSED)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token comment"># 1. 检查Core服务是否运行</span></span>
<span class="line"><span class="token comment"># 2. 检查8080端口是否监听</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="问题2-luna无法访问koko" tabindex="-1"><a class="header-anchor" href="#问题2-luna无法访问koko"><span>问题2：Luna无法访问Koko</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看Luna日志</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /opt/luna-v2.12.0/nohup.out</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 常见错误：</span></span>
<span class="line"><span class="token comment"># [HPM] Error occurred while trying to proxy request /koko/elfinder/sftp/ </span></span>
<span class="line"><span class="token comment"># from 10.0.0.61:4200 to http://localhost:5000 (ECONNREFUSED)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token comment"># 1. 检查Koko服务是否运行</span></span>
<span class="line"><span class="token comment"># 2. 检查5000端口是否监听</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="问题3-内存不足" tabindex="-1"><a class="header-anchor" href="#问题3-内存不足"><span>问题3：内存不足</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 检查内存使用</span></span>
<span class="line"><span class="token function">free</span> <span class="token parameter variable">-m</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Core服务大约需要1G内存</span></span>
<span class="line"><span class="token comment"># 如果内存不足，可尝试：</span></span>
<span class="line"><span class="token comment"># 1. 增加swap空间</span></span>
<span class="line"><span class="token comment"># 2. 优化MySQL配置</span></span>
<span class="line"><span class="token comment"># 3. 增加物理内存</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="问题4-端口冲突" tabindex="-1"><a class="header-anchor" href="#问题4-端口冲突"><span>问题4：端口冲突</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看端口占用</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tunlp</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token operator">&lt;</span>端口号<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token comment"># 1. 停止冲突服务</span></span>
<span class="line"><span class="token comment"># 2. 修改配置文件中的端口</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-快速重启脚本" tabindex="-1"><a class="header-anchor" href="#_11-快速重启脚本"><span>11. 快速重启脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 快速重启Jumpserver所有组件</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止所有服务</span></span>
<span class="line"><span class="token function">pkill</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;yarn serve&quot;</span></span>
<span class="line"><span class="token function">pkill</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;ng serve&quot;</span></span>
<span class="line"><span class="token function">pkill</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;koko&quot;</span></span>
<span class="line"><span class="token function">pkill</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;lion&quot;</span></span>
<span class="line"><span class="token function">pkill</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;guacd&quot;</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/jumpserver-v2.12.0 <span class="token operator">&amp;&amp;</span> ./jms stop all</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动Core服务</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/jumpserver-v2.12.0</span>
<span class="line"><span class="token builtin class-name">source</span> /opt/venv_py3/bin/activate</span>
<span class="line">./jms start all <span class="token parameter variable">-d</span></span>
<span class="line">deactivate</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动Lina</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/lina-v2.12.0 <span class="token operator">&amp;&amp;</span> <span class="token function">nohup</span> <span class="token function">yarn</span> serve <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动Luna</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/luna-v2.12.0 <span class="token operator">&amp;&amp;</span> <span class="token function">nohup</span> ng serve --proxy-config proxy.conf.json <span class="token parameter variable">--host</span> <span class="token number">0.0</span>.0.0 <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动Koko</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/koko-v2.12.0 <span class="token operator">&amp;&amp;</span> ./koko <span class="token parameter variable">-f</span> config.yml <span class="token parameter variable">-d</span> <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动Lion</span></span>
<span class="line">/etc/init.d/guacd start</span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/lion-v2.12.0-linux-amd64 <span class="token operator">&amp;&amp;</span> <span class="token function">nohup</span> ./lion <span class="token parameter variable">-f</span> config.yml <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启Nginx</span></span>
<span class="line">nginx <span class="token parameter variable">-s</span> reload</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;Jumpserver重启完成&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_12-监控要点" tabindex="-1"><a class="header-anchor" href="#_12-监控要点"><span>12. 监控要点</span></a></h3><ol><li><p><strong>进程状态监控</strong></p><p>bash</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># Core进程</span>
<span class="line">/opt/jumpserver-v2.12.0/jms status</span>
<span class="line"></span>
<span class="line"># 端口监控</span>
<span class="line">netstat -tunlp | grep -E &#39;9528|4200|8080|5000|2222|8081&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>日志监控</strong></p><p>bash</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># Core日志</span>
<span class="line">tail -f /opt/jumpserver-v2.12.0/logs/*</span>
<span class="line"></span>
<span class="line"># Koko日志</span>
<span class="line">tail -f /opt/koko-v2.12.0/data/logs/koko.log</span>
<span class="line"></span>
<span class="line"># Lina/Luna日志</span>
<span class="line">tail -f /opt/lina-v2.12.0/nohup.out</span>
<span class="line">tail -f /opt/luna-v2.12.0/nohup.out</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>资源监控</strong></p><p>bash</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 内存使用</span>
<span class="line">free -m</span>
<span class="line"></span>
<span class="line"># CPU使用</span>
<span class="line">top</span>
<span class="line"></span>
<span class="line"># 磁盘空间</span>
<span class="line">df -h</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="总结要点" tabindex="-1"><a class="header-anchor" href="#总结要点"><span>总结要点</span></a></h3><ol><li><strong>启动顺序是关键</strong>：必须按照依赖关系顺序启动</li><li><strong>内存要求严格</strong>：Core服务需要至少1G可用内存</li><li><strong>日志是排错关键</strong>：组件间通信问题通过日志快速定位</li><li><strong>组件解耦设计</strong>：各组件独立运行，故障隔离</li><li><strong>生产环境建议</strong>：组件分离部署，使用域名解析，配置监控告警</li></ol>`,41)])])}const r=n(i,[["render",p]]),d=JSON.parse('{"path":"/10-%E5%A0%A1%E5%9E%92%E6%9C%BA%E8%BF%90%E7%BB%B4/01-%E5%A0%A1%E5%9E%92%E6%9C%BA%E8%BF%90%E7%BB%B4/%E9%87%8D%E5%90%AFjumpserver.html","title":"Jumpserver 堡垒机重启部署指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"10-堡垒机运维/01-堡垒机运维/重启jumpserver.md"}');export{r as comp,d as data};
