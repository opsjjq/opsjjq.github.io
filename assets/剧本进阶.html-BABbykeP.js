import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const t={};function p(i,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="一、playbook-高级特性概述" tabindex="-1"><a class="header-anchor" href="#一、playbook-高级特性概述"><span>一、Playbook 高级特性概述</span></a></h2><h3 id="_1-1-为什么需要高级特性" tabindex="-1"><a class="header-anchor" href="#_1-1-为什么需要高级特性"><span>1.1 为什么需要高级特性</span></a></h3><ul><li><strong>简化剧本编写</strong>：避免重复代码</li><li><strong>提高可维护性</strong>：结构化、模块化</li><li><strong>增强灵活性</strong>：条件执行、循环控制</li><li><strong>编程逻辑</strong>：变量、循环、条件判断等编程特性</li></ul><h3 id="_1-2-两种任务参数写法对比" tabindex="-1"><a class="header-anchor" href="#_1-2-两种任务参数写法对比"><span>1.2 两种任务参数写法对比</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 写法1：字典风格（推荐，符合YAML标准）</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建用户</span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> test1</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 写法2：简写风格（Ansible特有）</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建用户</span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span> <span class="token string">&quot;name=test1 state=present&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、循环-loop-控制" tabindex="-1"><a class="header-anchor" href="#二、循环-loop-控制"><span>二、循环（Loop）控制</span></a></h2><h3 id="_2-1-基础循环语法" tabindex="-1"><a class="header-anchor" href="#_2-1-基础循环语法"><span>2.1 基础循环语法</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 循环创建多个用户（繁琐写法）</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> create test1</span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> test1</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> create test2</span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> test2</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line"><span class="token comment"># ... 重复5次</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用loop优化</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> create test1~5</span>
<span class="line">  <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item }}&quot;</span></span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line">  <span class="token key atrule">loop</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> test1</span>
<span class="line">    <span class="token punctuation">-</span> test2</span>
<span class="line">    <span class="token punctuation">-</span> test3</span>
<span class="line">    <span class="token punctuation">-</span> test4</span>
<span class="line">    <span class="token punctuation">-</span> test5</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-循环变量定义与使用" tabindex="-1"><a class="header-anchor" href="#_2-2-循环变量定义与使用"><span>2.2 循环变量定义与使用</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 定义循环变量</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建用户并设置密码</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建用户</span>
<span class="line">      <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item }}&quot;</span></span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line">      <span class="token key atrule">loop</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> test1</span>
<span class="line">        <span class="token punctuation">-</span> test2</span>
<span class="line">        <span class="token punctuation">-</span> test3</span>
<span class="line">        <span class="token punctuation">-</span> test4</span>
<span class="line">        <span class="token punctuation">-</span> test5</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 设置密码</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> echo &#39;yuchao666&#39; <span class="token punctuation">|</span> passwd <span class="token punctuation">-</span><span class="token punctuation">-</span>stdin &quot;<span class="token punctuation">{</span><span class="token punctuation">{</span> item <span class="token punctuation">}</span><span class="token punctuation">}</span>&quot;</span>
<span class="line">      <span class="token key atrule">loop</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> test1</span>
<span class="line">        <span class="token punctuation">-</span> test2</span>
<span class="line">        <span class="token punctuation">-</span> test3</span>
<span class="line">        <span class="token punctuation">-</span> test4</span>
<span class="line">        <span class="token punctuation">-</span> test5</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-使用vars定义循环列表" tabindex="-1"><a class="header-anchor" href="#_2-3-使用vars定义循环列表"><span>2.3 使用vars定义循环列表</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 使用变量定义循环列表</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">vars</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">users_list</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> test1</span>
<span class="line">      <span class="token punctuation">-</span> test2</span>
<span class="line">      <span class="token punctuation">-</span> test3</span>
<span class="line">      <span class="token punctuation">-</span> test4</span>
<span class="line">      <span class="token punctuation">-</span> test5</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建用户</span>
<span class="line">      <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item }}&quot;</span></span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> present</span>
<span class="line">      <span class="token key atrule">loop</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ users_list }}&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-循环字典数据" tabindex="-1"><a class="header-anchor" href="#_2-4-循环字典数据"><span>2.4 循环字典数据</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 循环创建用户并设置UID</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建用户带UID</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">vars</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">users_info</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">user</span><span class="token punctuation">:</span> <span class="token string">&#39;t1&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token string">&#39;2000&#39;</span> <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">user</span><span class="token punctuation">:</span> <span class="token string">&#39;t2&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token string">&#39;2001&#39;</span> <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">user</span><span class="token punctuation">:</span> <span class="token string">&#39;t3&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token string">&#39;2002&#39;</span> <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">user</span><span class="token punctuation">:</span> <span class="token string">&#39;t4&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token string">&#39;2003&#39;</span> <span class="token punctuation">}</span></span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建用户和UID</span>
<span class="line">      <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.user }}&quot;</span></span>
<span class="line">        <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.uid }}&quot;</span></span>
<span class="line">      <span class="token key atrule">loop</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ users_info }}&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-5-实际应用示例-创建多个目录" tabindex="-1"><a class="header-anchor" href="#_2-5-实际应用示例-创建多个目录"><span>2.5 实际应用示例：创建多个目录</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 繁琐写法</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建/data目录</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /data</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;755&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建/backup目录</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> /backup</span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;755&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用loop优化</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建多个目录</span>
<span class="line">  <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.file_path }}&quot;</span></span>
<span class="line">    <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line">    <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.mode }}&quot;</span></span>
<span class="line">  <span class="token key atrule">loop</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">file_path</span><span class="token punctuation">:</span> <span class="token string">&#39;/data&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;755&#39;</span> <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">file_path</span><span class="token punctuation">:</span> <span class="token string">&#39;/backup&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;755&#39;</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、变量-variables" tabindex="-1"><a class="header-anchor" href="#三、变量-variables"><span>三、变量（Variables）</span></a></h2><h3 id="_3-1-变量定义位置与类型" tabindex="-1"><a class="header-anchor" href="#_3-1-变量定义位置与类型"><span>3.1 变量定义位置与类型</span></a></h3><table><thead><tr><th style="text-align:left;">变量类型</th><th style="text-align:left;">定义位置</th><th style="text-align:left;">作用域</th><th style="text-align:left;">示例</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>vars自定义变量</strong></td><td style="text-align:left;">Playbook中vars部分</td><td style="text-align:left;">当前Play</td><td style="text-align:left;"><code>vars: data_path: /data</code></td></tr><tr><td style="text-align:left;"><strong>主机清单变量</strong></td><td style="text-align:left;"><code>/etc/ansible/hosts</code></td><td style="text-align:left;">特定主机/组</td><td style="text-align:left;"><code>172.16.1.7 http_port=80</code></td></tr><tr><td style="text-align:left;"><strong>Ansible内置变量</strong></td><td style="text-align:left;">setup模块收集</td><td style="text-align:left;">全局</td><td style="text-align:left;"><code>{{ ansible_hostname }}</code></td></tr><tr><td style="text-align:left;"><strong>注册变量</strong></td><td style="text-align:left;">tasks中register定义</td><td style="text-align:left;">当前任务及之后</td><td style="text-align:left;"><code>register: result</code></td></tr></tbody></table><h3 id="_3-2-vars自定义变量" tabindex="-1"><a class="header-anchor" href="#_3-2-vars自定义变量"><span>3.2 vars自定义变量</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">-</span> <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">vars</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">data_path</span><span class="token punctuation">:</span> /data</span>
<span class="line">    <span class="token key atrule">dest_path</span><span class="token punctuation">:</span> /etc</span>
<span class="line">    <span class="token key atrule">config_path</span><span class="token punctuation">:</span> /etc/rsync.passwd</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建数据目录</span>
<span class="line">      <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ data_path }}&quot;</span></span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 复制配置文件</span>
<span class="line">      <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">src</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ config_path }}&quot;</span></span>
<span class="line">        <span class="token key atrule">dest</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ dest_path }}&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-ansible内置变量-facts" tabindex="-1"><a class="header-anchor" href="#_3-3-ansible内置变量-facts"><span>3.3 Ansible内置变量（Facts）</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 使用setup模块收集的信息</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 获取IP地址</span>
<span class="line">      <span class="token key atrule">debug</span><span class="token punctuation">:</span> <span class="token key atrule">msg=&quot;IP地址是</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> ansible_all_ipv4_addresses <span class="token punctuation">}</span><span class="token punctuation">}</span>&quot;</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 获取主机名</span>
<span class="line">      <span class="token key atrule">debug</span><span class="token punctuation">:</span> <span class="token key atrule">msg=&quot;主机名是</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> ansible_hostname <span class="token punctuation">}</span><span class="token punctuation">}</span>&quot;</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 获取默认IP</span>
<span class="line">      <span class="token key atrule">debug</span><span class="token punctuation">:</span> <span class="token key atrule">msg=&quot;默认IP</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> ansible_default_ipv4.address <span class="token punctuation">}</span><span class="token punctuation">}</span>&quot;</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 获取eth0 IP</span>
<span class="line">      <span class="token key atrule">debug</span><span class="token punctuation">:</span> <span class="token key atrule">msg=&quot;eth0 IP</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> ansible_facts.eth0.ipv4.address <span class="token punctuation">}</span><span class="token punctuation">}</span>&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-主机清单变量" tabindex="-1"><a class="header-anchor" href="#_3-4-主机清单变量"><span>3.4 主机清单变量</span></a></h3><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token comment"># /etc/ansible/hosts</span></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">all:vars</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">ansible_port</span><span class="token punctuation">=</span><span class="token value attr-value">22999</span></span>
<span class="line"><span class="token key attr-name">ansible_password</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">123123</span>&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">web</span><span class="token punctuation">]</span></span></span>
<span class="line">172.16.1.[7:9]</span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">nfs</span><span class="token punctuation">]</span></span></span>
<span class="line">172.16.1.31</span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">backup</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">172.16.1.41 ansible_port</span><span class="token punctuation">=</span><span class="token value attr-value">22 ansible_password=&#39;123123&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、注册变量-register" tabindex="-1"><a class="header-anchor" href="#四、注册变量-register"><span>四、注册变量（Register）</span></a></h2><h3 id="_4-1-register基础用法" tabindex="-1"><a class="header-anchor" href="#_4-1-register基础用法"><span>4.1 register基础用法</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">-</span> <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 执行命令并注册结果</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 获取IP地址并写入文件</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;echo {{ ansible_default_ipv4.address }} &gt; /tmp/ip.log&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 读取文件并注册结果</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 读取IP文件</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;cat /tmp/ip.log&quot;</span></span>
<span class="line">      <span class="token key atrule">register</span><span class="token punctuation">:</span> ip_log  <span class="token comment"># 注册变量</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 使用注册变量</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 显示IP信息</span>
<span class="line">      <span class="token key atrule">debug</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">msg</span><span class="token punctuation">:</span> <span class="token string">&quot;IP地址是: {{ ip_log.stdout_lines }}&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-注册多个变量" tabindex="-1"><a class="header-anchor" href="#_4-2-注册多个变量"><span>4.2 注册多个变量</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 注册多个变量示例</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> nfs</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 获取主机名</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;echo {{ ansible_hostname }} &gt; /tmp/hostname.log&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 读取主机名文件</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;cat /tmp/hostname.log&quot;</span></span>
<span class="line">      <span class="token key atrule">register</span><span class="token punctuation">:</span> hostname_log</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 获取IP地址</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;echo {{ ansible_default_ipv4.address }} &gt; /tmp/ip.log&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 读取IP文件</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;cat /tmp/ip.log&quot;</span></span>
<span class="line">      <span class="token key atrule">register</span><span class="token punctuation">:</span> ip_log</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 显示挂载信息</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;showmount -e 172.16.1.31&quot;</span></span>
<span class="line">      <span class="token key atrule">register</span><span class="token punctuation">:</span> showmount_log</span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 循环显示所有注册变量</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">debug</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">msg</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.stdout_lines }}&quot;</span></span>
<span class="line">      <span class="token key atrule">loop</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">&quot;{{ showmount_log }}&quot;</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">&quot;{{ ip_log }}&quot;</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">&quot;{{ hostname_log }}&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-常用返回值属性" tabindex="-1"><a class="header-anchor" href="#_4-3-常用返回值属性"><span>4.3 常用返回值属性</span></a></h3><p>注册变量提供了多个属性来获取命令执行结果：</p><table><thead><tr><th style="text-align:left;">属性</th><th style="text-align:left;">描述</th><th style="text-align:left;">示例</th></tr></thead><tbody><tr><td style="text-align:left;"><code>stdout</code></td><td style="text-align:left;">标准输出（字符串）</td><td style="text-align:left;"><code>{{ result.stdout }}</code></td></tr><tr><td style="text-align:left;"><code>stdout_lines</code></td><td style="text-align:left;">标准输出（列表，按行）</td><td style="text-align:left;"><code>{{ result.stdout_lines }}</code></td></tr><tr><td style="text-align:left;"><code>stderr</code></td><td style="text-align:left;">标准错误输出</td><td style="text-align:left;"><code>{{ result.stderr }}</code></td></tr><tr><td style="text-align:left;"><code>rc</code></td><td style="text-align:left;">返回码</td><td style="text-align:left;"><code>{{ result.rc }}</code></td></tr><tr><td style="text-align:left;"><code>changed</code></td><td style="text-align:left;">是否发生改变</td><td style="text-align:left;"><code>{{ result.changed }}</code></td></tr><tr><td style="text-align:left;"><code>failed</code></td><td style="text-align:left;">是否失败</td><td style="text-align:left;"><code>{{ result.failed }}</code></td></tr><tr><td style="text-align:left;"><code>msg</code></td><td style="text-align:left;">消息</td><td style="text-align:left;"><code>{{ result.msg }}</code></td></tr></tbody></table><p><strong>官方文档</strong>：<a href="https://docs.ansible.com/ansible/latest/reference_appendices/common_return_values.html" target="_blank" rel="noopener noreferrer">Common Return Values</a></p><hr><h2 id="五、条件判断-when" tabindex="-1"><a class="header-anchor" href="#五、条件判断-when"><span>五、条件判断（When）</span></a></h2><h3 id="_5-1-基础条件判断" tabindex="-1"><a class="header-anchor" href="#_5-1-基础条件判断"><span>5.1 基础条件判断</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 判断文件变化后重启服务</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 配置文件变化时重启服务</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> rsync</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 复制rsyncd.conf配置文件</span>
<span class="line">      <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">src</span><span class="token punctuation">:</span> /tmp/41work/rsyncd.conf</span>
<span class="line">        <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/</span>
<span class="line">      <span class="token key atrule">register</span><span class="token punctuation">:</span> conf_status  <span class="token comment"># 注册复制操作的结果</span></span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 重启rsyncd服务</span>
<span class="line">      <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> rsyncd</span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> restarted</span>
<span class="line">      <span class="token key atrule">when</span><span class="token punctuation">:</span> conf_status.changed  <span class="token comment"># 仅当配置文件变化时执行</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-复杂条件判断" tabindex="-1"><a class="header-anchor" href="#_5-2-复杂条件判断"><span>5.2 复杂条件判断</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 检查NFS配置文件是否存在并显示内容</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 检查NFS配置</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">vars</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">nfs_file</span><span class="token punctuation">:</span> /etc/exports</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 检查NFS配置文件</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> <span class="token string">&quot;cat {{ nfs_file }}&quot;</span></span>
<span class="line">      <span class="token key atrule">register</span><span class="token punctuation">:</span> nfs_result</span>
<span class="line">      <span class="token key atrule">ignore_errors</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>  <span class="token comment"># 忽略错误继续执行</span></span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 显示配置文件内容</span>
<span class="line">      <span class="token key atrule">debug</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">msg</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ ansible_hostname }} 存在 {{ nfs_file }}，内容: {{ nfs_result.stdout }}&quot;</span></span>
<span class="line">      <span class="token key atrule">when</span><span class="token punctuation">:</span> nfs_result is succeeded  <span class="token comment"># 当命令成功时</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 文件不存在提示</span>
<span class="line">      <span class="token key atrule">debug</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">msg</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ nfs_file }} 文件不存在&quot;</span></span>
<span class="line">      <span class="token key atrule">when</span><span class="token punctuation">:</span> nfs_result is failed  <span class="token comment"># 当命令失败时</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、处理器-handlers" tabindex="-1"><a class="header-anchor" href="#六、处理器-handlers"><span>六、处理器（Handlers）</span></a></h2><h3 id="_6-1-handlers基础用法" tabindex="-1"><a class="header-anchor" href="#_6-1-handlers基础用法"><span>6.1 Handlers基础用法</span></a></h3><p>Handlers用于在任务发生改变时触发特定操作（通常用于重启服务）。</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 使用handlers管理服务重启</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> backup</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 复制rsyncd.conf配置文件</span>
<span class="line">      <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">src</span><span class="token punctuation">:</span> /script/rsyncd.conf</span>
<span class="line">        <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/</span>
<span class="line">      <span class="token key atrule">notify</span><span class="token punctuation">:</span>  <span class="token comment"># 当任务发生改变时通知handler</span></span>
<span class="line">        <span class="token punctuation">-</span> restart rsyncd service</span>
<span class="line">        <span class="token punctuation">-</span> restart nginx service  <span class="token comment"># 可以通知多个handler</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">handlers</span><span class="token punctuation">:</span>  <span class="token comment"># handlers定义在tasks之后</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> restart rsyncd service</span>
<span class="line">      <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> rsyncd</span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> restarted</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> restart nginx service</span>
<span class="line">      <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx</span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> restarted</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-handlers工作原理" tabindex="-1"><a class="header-anchor" href="#_6-2-handlers工作原理"><span>6.2 Handlers工作原理</span></a></h3><ol><li><strong>定义位置</strong>：<code>handlers:</code> 部分必须放在 <code>tasks:</code> 之后</li><li><strong>触发条件</strong>：只有 <code>notify</code> 所在的任务状态为 <code>changed</code> 时才会触发</li><li><strong>执行时机</strong>：所有tasks执行完后，才会按顺序执行被触发的handlers</li><li><strong>多次通知</strong>：同一handler被多次通知，只执行一次</li></ol><hr><h2 id="七、标签-tags" tabindex="-1"><a class="header-anchor" href="#七、标签-tags"><span>七、标签（Tags）</span></a></h2><h3 id="_7-1-标签基础用法" tabindex="-1"><a class="header-anchor" href="#_7-1-标签基础用法"><span>7.1 标签基础用法</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token comment"># 为任务添加标签</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署NFS服务（带标签）</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> nfs</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装nfs<span class="token punctuation">-</span>utils服务</span>
<span class="line">      <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>utils</span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> installed</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> 01_install_nfs_service</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装rpcbind服务</span>
<span class="line">      <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> rpcbind</span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> installed</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> 02_install_rpcbind_service</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建www组</span>
<span class="line">      <span class="token key atrule">group</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> www</span>
<span class="line">        <span class="token key atrule">gid</span><span class="token punctuation">:</span> <span class="token number">666</span></span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> 03_add_group</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建www用户</span>
<span class="line">      <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> www</span>
<span class="line">        <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token number">666</span></span>
<span class="line">        <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line">        <span class="token key atrule">create_home</span><span class="token punctuation">:</span> no</span>
<span class="line">        <span class="token key atrule">shell</span><span class="token punctuation">:</span> /sbin/nologin</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> 04_add_user</span>
<span class="line">    <span class="token comment"># ... 更多带标签的任务</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-标签管理命令" tabindex="-1"><a class="header-anchor" href="#_7-2-标签管理命令"><span>7.2 标签管理命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 列出剧本中的所有标签</span></span>
<span class="line">ansible-playbook --list-tags install_nfs.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 只执行特定标签的任务</span></span>
<span class="line">ansible-playbook <span class="token parameter variable">-t</span> 01_install_nfs_service install_nfs.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 执行多个标签</span></span>
<span class="line">ansible-playbook <span class="token parameter variable">-t</span> <span class="token string">&quot;01_install_nfs_service,02_install_rpcbind_service&quot;</span> install_nfs.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 跳过特定标签</span></span>
<span class="line">ansible-playbook --skip-tags <span class="token string">&quot;05_create_data_dir,06_copy_nfs_exports&quot;</span> install_nfs.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 列出所有任务（显示标签）</span></span>
<span class="line">ansible-playbook --list-tasks install_nfs.yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-任务管理命令" tabindex="-1"><a class="header-anchor" href="#_7-3-任务管理命令"><span>7.3 任务管理命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 列出所有任务</span></span>
<span class="line">ansible-playbook --list-tasks install_nfs.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 从特定任务开始执行</span></span>
<span class="line">ansible-playbook --start-at-task <span class="token string">&quot;创建关于rsync密码文件&quot;</span> install_nfs.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 检查语法（不执行）</span></span>
<span class="line">ansible-playbook --syntax-check install_nfs.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 试运行（显示将执行的操作）</span></span>
<span class="line">ansible-playbook <span class="token parameter variable">-C</span> install_nfs.yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、综合示例" tabindex="-1"><a class="header-anchor" href="#八、综合示例"><span>八、综合示例</span></a></h2><h3 id="_8-1-完整nfs部署剧本-使用高级特性" tabindex="-1"><a class="header-anchor" href="#_8-1-完整nfs部署剧本-使用高级特性"><span>8.1 完整NFS部署剧本（使用高级特性）</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署NFS服务器</span>
<span class="line">  <span class="token key atrule">hosts</span><span class="token punctuation">:</span> nfs</span>
<span class="line">  <span class="token key atrule">vars</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">shared_dirs</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&#39;/data&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;755&#39;</span> <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&#39;/backup&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&#39;755&#39;</span> <span class="token punctuation">}</span></span>
<span class="line">    <span class="token key atrule">nfs_exports_content</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">      /data 172.16.1.0/24(rw,sync,all_squash,anonuid=666,anongid=666)</span>
<span class="line">      /backup 172.16.1.0/24(rw,sync,all_squash,anonuid=666,anongid=666)</span></span>
<span class="line">  </span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 安装软件包</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 安装必要软件包</span>
<span class="line">      <span class="token key atrule">yum</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item }}&quot;</span></span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> installed</span>
<span class="line">      <span class="token key atrule">loop</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> nfs<span class="token punctuation">-</span>utils</span>
<span class="line">        <span class="token punctuation">-</span> rpcbind</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> install_packages</span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 创建用户和组</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建www组</span>
<span class="line">      <span class="token key atrule">group</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> www</span>
<span class="line">        <span class="token key atrule">gid</span><span class="token punctuation">:</span> <span class="token number">666</span></span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> create_group</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建www用户</span>
<span class="line">      <span class="token key atrule">user</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> www</span>
<span class="line">        <span class="token key atrule">uid</span><span class="token punctuation">:</span> <span class="token number">666</span></span>
<span class="line">        <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line">        <span class="token key atrule">create_home</span><span class="token punctuation">:</span> no</span>
<span class="line">        <span class="token key atrule">shell</span><span class="token punctuation">:</span> /sbin/nologin</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> create_user</span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 创建共享目录（使用loop）</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 创建共享目录</span>
<span class="line">      <span class="token key atrule">file</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.path }}&quot;</span></span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> directory</span>
<span class="line">        <span class="token key atrule">owner</span><span class="token punctuation">:</span> www</span>
<span class="line">        <span class="token key atrule">group</span><span class="token punctuation">:</span> www</span>
<span class="line">        <span class="token key atrule">mode</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item.mode }}&quot;</span></span>
<span class="line">      <span class="token key atrule">loop</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ shared_dirs }}&quot;</span></span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> create_dirs</span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 配置NFS</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 配置NFS exports</span>
<span class="line">      <span class="token key atrule">copy</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">content</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ nfs_exports_content }}&quot;</span></span>
<span class="line">        <span class="token key atrule">dest</span><span class="token punctuation">:</span> /etc/exports</span>
<span class="line">      <span class="token key atrule">notify</span><span class="token punctuation">:</span> restart_nfs_services</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> configure_nfs</span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 启动服务</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动rpcbind服务</span>
<span class="line">      <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> rpcbind</span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> start_rpcbind</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 启动NFS服务</span>
<span class="line">      <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs</span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> started</span>
<span class="line">        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> yes</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> start_nfs</span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 验证配置</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 验证NFS配置</span>
<span class="line">      <span class="token key atrule">shell</span><span class="token punctuation">:</span> showmount <span class="token punctuation">-</span>e localhost</span>
<span class="line">      <span class="token key atrule">register</span><span class="token punctuation">:</span> nfs_export_result</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span> verify_config</span>
<span class="line">    </span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 显示NFS导出列表</span>
<span class="line">      <span class="token key atrule">debug</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">msg</span><span class="token punctuation">:</span> <span class="token string">&quot;NFS导出列表: {{ nfs_export_result.stdout_lines }}&quot;</span></span>
<span class="line">      <span class="token key atrule">when</span><span class="token punctuation">:</span> nfs_export_result is succeeded</span>
<span class="line">  </span>
<span class="line">  <span class="token key atrule">handlers</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> restart_nfs_services</span>
<span class="line">      <span class="token key atrule">systemd</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ item }}&quot;</span></span>
<span class="line">        <span class="token key atrule">state</span><span class="token punctuation">:</span> restarted</span>
<span class="line">      <span class="token key atrule">loop</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> rpcbind</span>
<span class="line">        <span class="token punctuation">-</span> nfs</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="九、最佳实践与总结" tabindex="-1"><a class="header-anchor" href="#九、最佳实践与总结"><span>九、最佳实践与总结</span></a></h2><h3 id="_9-1-高级特性使用建议" tabindex="-1"><a class="header-anchor" href="#_9-1-高级特性使用建议"><span>9.1 高级特性使用建议</span></a></h3><ol><li><strong>适度使用</strong>：不要为了用而用，保持剧本可读性</li><li><strong>渐进学习</strong>：先掌握基础，再逐步使用高级特性</li><li><strong>注释清晰</strong>：复杂逻辑要添加详细注释</li><li><strong>模块化设计</strong>：将相关任务分组，使用标签管理</li></ol><h3 id="_9-2-各特性适用场景" tabindex="-1"><a class="header-anchor" href="#_9-2-各特性适用场景"><span>9.2 各特性适用场景</span></a></h3><table><thead><tr><th style="text-align:left;">特性</th><th style="text-align:left;">适用场景</th><th style="text-align:left;">优点</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>循环（loop）</strong></td><td style="text-align:left;">重复性操作（创建多个用户/目录/文件）</td><td style="text-align:left;">减少代码重复，易于维护</td></tr><tr><td style="text-align:left;"><strong>变量（vars）</strong></td><td style="text-align:left;">需要灵活配置的参数</td><td style="text-align:left;">提高剧本灵活性，便于修改</td></tr><tr><td style="text-align:left;"><strong>注册变量（register）</strong></td><td style="text-align:left;">需要获取命令执行结果</td><td style="text-align:left;">实现任务间数据传递</td></tr><tr><td style="text-align:left;"><strong>条件判断（when）</strong></td><td style="text-align:left;">根据不同条件执行不同操作</td><td style="text-align:left;">提高剧本智能性</td></tr><tr><td style="text-align:left;"><strong>处理器（handlers）</strong></td><td style="text-align:left;">配置文件变化后重启服务</td><td style="text-align:left;">确保服务配置生效</td></tr><tr><td style="text-align:left;"><strong>标签（tags）</strong></td><td style="text-align:left;">选择性执行部分任务</td><td style="text-align:left;">提高执行灵活性</td></tr></tbody></table><h3 id="_9-3-学习路径建议" tabindex="-1"><a class="header-anchor" href="#_9-3-学习路径建议"><span>9.3 学习路径建议</span></a></h3><ol><li><strong>第一阶段</strong>：掌握基础YAML语法和常用模块</li><li><strong>第二阶段</strong>：学习变量和循环，简化重复任务</li><li><strong>第三阶段</strong>：掌握条件判断和注册变量，实现智能逻辑</li><li><strong>第四阶段</strong>：使用handlers和标签，优化剧本结构</li><li><strong>第五阶段</strong>：综合运用所有特性，编写生产级剧本</li></ol><h3 id="_9-4-重要官方文档链接" tabindex="-1"><a class="header-anchor" href="#_9-4-重要官方文档链接"><span>9.4 重要官方文档链接</span></a></h3><ul><li><a href="https://docs.ansible.com/ansible/latest/user_guide/playbooks_conditionals.html" target="_blank" rel="noopener noreferrer">Playbook Conditionals</a></li><li><a href="https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html" target="_blank" rel="noopener noreferrer">Playbook Variables</a></li><li><a href="https://docs.ansible.com/ansible/latest/user_guide/playbooks_handlers.html" target="_blank" rel="noopener noreferrer">Playbook Handlers</a></li><li><a href="https://docs.ansible.com/ansible/latest/reference_appendices/common_return_values.html" target="_blank" rel="noopener noreferrer">Common Return Values</a></li></ul><hr><p><strong>核心要点</strong>：Ansible Playbook的高级特性虽然增加了学习曲线，但能显著提高剧本的可维护性和灵活性。在实际工作中，应根据具体需求选择合适的技术组合，平衡功能性与可读性。</p>`,74)])])}const o=n(t,[["render",p]]),u=JSON.parse('{"path":"/06-%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BF%90%E7%BB%B4/02-ansible%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BF%90%E7%BB%B4/%E5%89%A7%E6%9C%AC%E8%BF%9B%E9%98%B6.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"06-自动化运维/02-ansible自动化运维/剧本进阶.md"}');export{o as comp,u as data};
