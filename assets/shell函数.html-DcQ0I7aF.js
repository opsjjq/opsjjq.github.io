import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const p={};function i(t,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="shell-函数完全指南" tabindex="-1"><a class="header-anchor" href="#shell-函数完全指南"><span>Shell 函数完全指南</span></a></h1><h2 id="一、函数基础" tabindex="-1"><a class="header-anchor" href="#一、函数基础"><span>一、函数基础</span></a></h2><h3 id="_1-1-为什么使用函数" tabindex="-1"><a class="header-anchor" href="#_1-1-为什么使用函数"><span>1.1 为什么使用函数</span></a></h3><ul><li><strong>代码复用</strong>：避免重复编写相同代码</li><li><strong>结构清晰</strong>：让脚本更易读、易维护</li><li><strong>模块化</strong>：分解复杂脚本为小功能块</li></ul><h3 id="_1-2-函数定义语法" tabindex="-1"><a class="header-anchor" href="#_1-2-函数定义语法"><span>1.2 函数定义语法</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方式1：推荐写法</span></span>
<span class="line"><span class="token keyword">function</span> 函数名<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    函数体</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方式2：简洁写法</span></span>
<span class="line">函数名<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    函数体</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例：</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 定义简单函数</span></span>
<span class="line"><span class="token function-name function">say_hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;Hello!&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 调用函数</span></span>
<span class="line">say_hello</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、函数传参" tabindex="-1"><a class="header-anchor" href="#二、函数传参"><span>二、函数传参</span></a></h2><h3 id="_2-1-基本参数传递" tabindex="-1"><a class="header-anchor" href="#_2-1-基本参数传递"><span>2.1 基本参数传递</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 带参数的函数</span></span>
<span class="line"><span class="token function-name function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$1</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;Hello, <span class="token variable">$name</span>!&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 调用时传参</span></span>
<span class="line">greet <span class="token string">&quot;张三&quot;</span></span>
<span class="line">greet <span class="token string">&quot;李四&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-使用局部变量" tabindex="-1"><a class="header-anchor" href="#_2-2-使用局部变量"><span>2.2 使用局部变量</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 使用local声明局部变量</span></span>
<span class="line"><span class="token function-name function">calculate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">a</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$1</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">b</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$2</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">sum</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$((</span>a <span class="token operator">+</span> b<span class="token variable">))</span></span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;和为: <span class="token variable">$sum</span>&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">calculate <span class="token number">5</span> <span class="token number">3</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、函数返回值" tabindex="-1"><a class="header-anchor" href="#三、函数返回值"><span>三、函数返回值</span></a></h2><h3 id="_3-1-返回状态码" tabindex="-1"><a class="header-anchor" href="#_3-1-返回状态码"><span>3.1 返回状态码</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 使用return返回状态码</span></span>
<span class="line"><span class="token function-name function">check_file</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">file</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$1</span>&quot;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;<span class="token variable">$file</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">0</span>  <span class="token comment"># 成功</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">1</span>  <span class="token comment"># 失败</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查返回值</span></span>
<span class="line">check_file <span class="token string">&quot;/etc/passwd&quot;</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">$?</span> <span class="token parameter variable">-eq</span> <span class="token number">0</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;文件存在&quot;</span></span>
<span class="line"><span class="token keyword">else</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;文件不存在&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-返回数据" tabindex="-1"><a class="header-anchor" href="#_3-2-返回数据"><span>3.2 返回数据</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 使用echo返回数据</span></span>
<span class="line"><span class="token function-name function">get_sum</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">sum</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$((</span> $<span class="token number">1</span> <span class="token operator">+</span> $<span class="token number">2</span> <span class="token variable">))</span></span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$sum</span>&quot;</span>  <span class="token comment"># 返回计算结果</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取返回值</span></span>
<span class="line"><span class="token assign-left variable">result</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>get_sum <span class="token number">10</span> <span class="token number">20</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;结果是: <span class="token variable">$result</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、实用案例" tabindex="-1"><a class="header-anchor" href="#四、实用案例"><span>四、实用案例</span></a></h2><h3 id="_4-1-简单计算器" tabindex="-1"><a class="header-anchor" href="#_4-1-简单计算器"><span>4.1 简单计算器</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 四则运算计算器</span></span>
<span class="line"><span class="token function-name function">calculator</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">a</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$1</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">op</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$2</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">b</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$3</span>&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">case</span> <span class="token string">&quot;<span class="token variable">$op</span>&quot;</span> <span class="token keyword">in</span></span>
<span class="line">        <span class="token string">&quot;+&quot;</span><span class="token punctuation">)</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$((</span>$a <span class="token operator">+</span> $b<span class="token variable">))</span></span>&quot;</span> <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token string">&quot;-&quot;</span><span class="token punctuation">)</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$((</span>$a <span class="token operator">-</span> $b<span class="token variable">))</span></span>&quot;</span> <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token string">&quot;*&quot;</span><span class="token punctuation">)</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$((</span>$a <span class="token operator">*</span> $b<span class="token variable">))</span></span>&quot;</span> <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token string">&quot;/&quot;</span><span class="token punctuation">)</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$((</span>$a <span class="token operator">/</span> $b<span class="token variable">))</span></span>&quot;</span> <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">        *<span class="token punctuation">)</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;错误: 不支持的操作符&quot;</span> <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">esac</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用示例</span></span>
<span class="line"><span class="token assign-left variable">result</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>calculator <span class="token number">10</span> <span class="token string">&quot;+&quot;</span> <span class="token number">5</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;10 + 5 = <span class="token variable">$result</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-文件备份函数" tabindex="-1"><a class="header-anchor" href="#_4-2-文件备份函数"><span>4.2 文件备份函数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 简单文件备份</span></span>
<span class="line"><span class="token function-name function">backup_file</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">source_file</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$1</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">backup_dir</span><span class="token operator">=</span><span class="token string">&quot;/tmp/backup&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 创建备份目录</span></span>
<span class="line">    <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token string">&quot;<span class="token variable">$backup_dir</span>&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 生成备份文件名</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">timestamp</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y%m%d_%H%M%S<span class="token variable">)</span></span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">backup_file</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${backup_dir}</span>/<span class="token variable"><span class="token variable">$(</span><span class="token function">basename</span> $source_file<span class="token variable">)</span></span>_<span class="token variable">$timestamp</span>&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 复制文件</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token function">cp</span> <span class="token string">&quot;<span class="token variable">$source_file</span>&quot;</span> <span class="token string">&quot;<span class="token variable">$backup_file</span>&quot;</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;备份成功: <span class="token variable">$backup_file</span>&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">0</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;备份失败&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">1</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用示例</span></span>
<span class="line">backup_file <span class="token string">&quot;/etc/hosts&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-用户登录验证" tabindex="-1"><a class="header-anchor" href="#_4-3-用户登录验证"><span>4.3 用户登录验证</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 简单的登录验证</span></span>
<span class="line"><span class="token function-name function">login</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">user</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$1</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">pass</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$2</span>&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 这里只是示例，实际应加密存储密码</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable">$user</span>&quot;</span> <span class="token operator">==</span> <span class="token string">&quot;admin&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token string">&quot;<span class="token variable">$pass</span>&quot;</span> <span class="token operator">==</span> <span class="token string">&quot;123456&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;登录成功&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">0</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;用户名或密码错误&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">1</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用示例</span></span>
<span class="line">login <span class="token string">&quot;admin&quot;</span> <span class="token string">&quot;123456&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、函数库使用" tabindex="-1"><a class="header-anchor" href="#五、函数库使用"><span>五、函数库使用</span></a></h2><h3 id="_5-1-创建函数库" tabindex="-1"><a class="header-anchor" href="#_5-1-创建函数库"><span>5.1 创建函数库</span></a></h3><p><strong>utils.sh（工具函数库）</strong></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 常用工具函数库</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 打印彩色信息</span></span>
<span class="line"><span class="token function-name function">print_info</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token entity" title="\\033">\\033</span>[32m[INFO]<span class="token entity" title="\\033">\\033</span>[0m <span class="token variable">$1</span>&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token function-name function">print_error</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token entity" title="\\033">\\033</span>[31m[ERROR]<span class="token entity" title="\\033">\\033</span>[0m <span class="token variable">$1</span>&quot;</span> <span class="token operator">&gt;</span><span class="token file-descriptor important">&amp;2</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查命令是否存在</span></span>
<span class="line"><span class="token function-name function">check_command</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> <span class="token string">&quot;<span class="token variable">$1</span>&quot;</span> <span class="token operator">&gt;</span>/dev/null <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">0</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        print_error <span class="token string">&quot;命令 <span class="token variable">$1</span> 不存在&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">1</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 确认操作</span></span>
<span class="line"><span class="token function-name function">confirm</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">&quot;<span class="token variable">$1</span> (y/N): &quot;</span> choice</span>
<span class="line">    <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable">$choice</span>&quot;</span> <span class="token operator">=~</span> ^<span class="token punctuation">[</span>Yy<span class="token punctuation">]</span>$ <span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-使用函数库" tabindex="-1"><a class="header-anchor" href="#_5-2-使用函数库"><span>5.2 使用函数库</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 主脚本</span></span>
<span class="line"><span class="token comment"># 导入函数库</span></span>
<span class="line"><span class="token builtin class-name">source</span> ./utils.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用函数库中的函数</span></span>
<span class="line">print_info <span class="token string">&quot;开始执行脚本&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> check_command <span class="token string">&quot;git&quot;</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    print_info <span class="token string">&quot;Git已安装&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> confirm <span class="token string">&quot;是否继续?&quot;</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    print_info <span class="token string">&quot;用户选择继续&quot;</span></span>
<span class="line"><span class="token keyword">else</span></span>
<span class="line">    print_info <span class="token string">&quot;用户选择取消&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、最佳实践" tabindex="-1"><a class="header-anchor" href="#六、最佳实践"><span>六、最佳实践</span></a></h2><h3 id="_6-1-命名规范" tabindex="-1"><a class="header-anchor" href="#_6-1-命名规范"><span>6.1 命名规范</span></a></h3><ul><li>使用小写字母和下划线</li><li>名称要有描述性</li><li>动词开头更清晰</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 好名字</span></span>
<span class="line">create_user<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">backup_files<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">check_disk_space<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 不好的名字</span></span>
<span class="line">foo<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">do_it<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">func1<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-错误处理" tabindex="-1"><a class="header-anchor" href="#_6-2-错误处理"><span>6.2 错误处理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 带错误处理的函数</span></span>
<span class="line"><span class="token function-name function">safe_delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">file</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$1</span>&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;<span class="token variable">$file</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;错误: 文件不存在&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">1</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> <span class="token function">rm</span> <span class="token string">&quot;<span class="token variable">$file</span>&quot;</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;删除成功&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">0</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;删除失败&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">2</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-参数验证" tabindex="-1"><a class="header-anchor" href="#_6-3-参数验证"><span>6.3 参数验证</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 验证参数的函数</span></span>
<span class="line"><span class="token function-name function">validate_params</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">$#</span> <span class="token parameter variable">-lt</span> <span class="token number">2</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;用法: <span class="token variable">$0</span> 参数1 参数2&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">1</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token string">&quot;<span class="token variable">$1</span>&quot;</span> <span class="token operator">=~</span> ^<span class="token punctuation">[</span><span class="token number">0</span>-9<span class="token punctuation">]</span>+$ <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;错误: 第一个参数必须是数字&quot;</span></span>
<span class="line">        <span class="token builtin class-name">return</span> <span class="token number">2</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line">    </span>
<span class="line">    <span class="token builtin class-name">return</span> <span class="token number">0</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用</span></span>
<span class="line">validate_params <span class="token string">&quot;<span class="token variable">$@</span>&quot;</span> <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token number">1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-调试技巧" tabindex="-1"><a class="header-anchor" href="#_6-4-调试技巧"><span>6.4 调试技巧</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 调试函数</span></span>
<span class="line"><span class="token assign-left variable">debug_mode</span><span class="token operator">=</span>false</span>
<span class="line"></span>
<span class="line"><span class="token function-name function">debug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable">$debug_mode</span>&quot;</span> <span class="token operator">=</span> <span class="token boolean">true</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;[DEBUG] <span class="token variable">$@</span>&quot;</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在函数中使用</span></span>
<span class="line"><span class="token function-name function">process_data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    debug <span class="token string">&quot;开始处理数据&quot;</span></span>
<span class="line">    <span class="token comment"># ... 处理逻辑</span></span>
<span class="line">    debug <span class="token string">&quot;处理完成&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 开启调试</span></span>
<span class="line"><span class="token assign-left variable">debug_mode</span><span class="token operator">=</span>true</span>
<span class="line">process_data</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、简单实用脚本示例" tabindex="-1"><a class="header-anchor" href="#七、简单实用脚本示例"><span>七、简单实用脚本示例</span></a></h2><h3 id="系统信息脚本" tabindex="-1"><a class="header-anchor" href="#系统信息脚本"><span>系统信息脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># system_info.sh</span></span>
<span class="line"></span>
<span class="line"><span class="token function-name function">show_system_info</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 系统信息 ===&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;主机名: <span class="token variable"><span class="token variable">$(</span><span class="token function">hostname</span><span class="token variable">)</span></span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;系统: <span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token parameter variable">-s</span><span class="token variable">)</span></span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;内核: <span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token parameter variable">-r</span><span class="token variable">)</span></span>&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token function-name function">show_disk_info</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 磁盘信息 ===&quot;</span></span>
<span class="line">    <span class="token function">df</span> <span class="token parameter variable">-h</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&quot;^/dev&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token function-name function">show_memory_info</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 内存信息 ===&quot;</span></span>
<span class="line">    <span class="token function">free</span> <span class="token parameter variable">-h</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 主程序</span></span>
<span class="line"><span class="token keyword">case</span> <span class="token string">&quot;<span class="token variable">\${1<span class="token operator">:-</span>all}</span>&quot;</span> <span class="token keyword">in</span></span>
<span class="line">    <span class="token string">&quot;system&quot;</span><span class="token punctuation">)</span> show_system_info <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token string">&quot;disk&quot;</span><span class="token punctuation">)</span> show_disk_info <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token string">&quot;memory&quot;</span><span class="token punctuation">)</span> show_memory_info <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token string">&quot;all&quot;</span><span class="token punctuation">)</span></span>
<span class="line">        show_system_info</span>
<span class="line">        <span class="token builtin class-name">echo</span></span>
<span class="line">        show_disk_info</span>
<span class="line">        <span class="token builtin class-name">echo</span></span>
<span class="line">        show_memory_info</span>
<span class="line">        <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">    *<span class="token punctuation">)</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;用法: <span class="token variable">$0</span> {system|disk|memory|all}&quot;</span> <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">esac</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,50)])])}const o=n(p,[["render",i]]),u=JSON.parse('{"path":"/06-%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BF%90%E7%BB%B4/01-shell%E8%84%9A%E6%9C%AC%E7%BC%96%E7%A8%8B/shell%E5%87%BD%E6%95%B0.html","title":"Shell 函数完全指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"06-自动化运维/01-shell脚本编程/shell函数.md"}');export{o as comp,u as data};
