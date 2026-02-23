import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const p={};function i(t,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="一、正则表达式练习" tabindex="-1"><a class="header-anchor" href="#一、正则表达式练习"><span>一、正则表达式练习</span></a></h2><ul><li>基本正则表达式（BRE）</li><li>扩展正则表达式（ERE）</li><li>结合grep、sed命令的用法</li></ul><h2 id="二、测试数据" tabindex="-1"><a class="header-anchor" href="#二、测试数据"><span>二、测试数据</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">I am teacher yuchao.</span>
<span class="line">I teach linux,python.</span>
<span class="line">testtttsss000123566666</span>
<span class="line"></span>
<span class="line">I like video,games,girls</span>
<span class="line">#I like girls.</span>
<span class="line">$my blog is http://yuchaoit.cn/</span>
<span class="line">#my site is https://www.cnblogs.com/pyyu</span>
<span class="line">My qq num is 877348180.</span>
<span class="line">my phone num is 15210888008.</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、基础正则表达式练习题" tabindex="-1"><a class="header-anchor" href="#三、基础正则表达式练习题"><span>三、基础正则表达式练习题</span></a></h2><h3 id="_1-查找以指定字符开头的行" tabindex="-1"><a class="header-anchor" href="#_1-查找以指定字符开头的行"><span>1. <code>^</code> 查找以指定字符开头的行</span></a></h3><p><strong>题目</strong>：找出以 <code>I</code> 开头的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：基础写法</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^I&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：添加边界（更精确）</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^I &#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：使用字符类（匹配I或i）</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^[Ii]&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：忽略大小写</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-in</span> <span class="token string">&#39;^i&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-查找以指定字符结尾的行" tabindex="-1"><a class="header-anchor" href="#_2-查找以指定字符结尾的行"><span>2. <code>$</code> 查找以指定字符结尾的行</span></a></h3><p><strong>题目1</strong>：找出以 <code>u</code> 结尾的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;u$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：确保u前是字母（排除标点）</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;[a-zA-Z]u$&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>题目2</strong>：找出以 <code>.</code> 结尾的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：转义点符号</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;\\.$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：使用单引号避免双引号转义问题</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;\\.$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：匹配任何标点结尾</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;[.!?]$&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-查找和排除空行" tabindex="-1"><a class="header-anchor" href="#_3-查找和排除空行"><span>3. <code>^$</code> 查找和排除空行</span></a></h3><p><strong>题目1</strong>：找出空白行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：标准空行匹配</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：反向匹配（不含任何字符）</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-nv</span> <span class="token string">&#39;.&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：排除所有可见字符</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^[[:space:]]*$&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>题目2</strong>：排除空行，提取有内容的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：匹配任意字符</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;.&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：反向排除空行</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-nv</span> <span class="token string">&#39;^$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：匹配非空白字符</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;[[:graph:]]&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>题目3</strong>：找出以 <code>I</code> 开头，<code>s</code> 结尾的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：标准写法</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^I.*s$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：限制中间内容为单词字符</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^I[[:alnum:][:space:]]*s$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：扩展正则写法</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-En</span> <span class="token string">&#39;^I.*s$&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-匹配任意一个字符" tabindex="-1"><a class="header-anchor" href="#_4-匹配任意一个字符"><span>4. <code>.</code> 匹配任意一个字符</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 匹配所有非空行</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;.&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 匹配至少有一个字符的行</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^..*$&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-转义特殊字符" tabindex="-1"><a class="header-anchor" href="#_5-转义特殊字符"><span>5. <code>\\</code> 转义特殊字符</span></a></h3><p><strong>题目</strong>：找出以 <code>$</code> 开头的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：转义美元符号</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^\\$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：匹配所有特殊字符开头的行</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^[#$]&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：使用字符类</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^[[:punct:]]&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-字符类匹配" tabindex="-1"><a class="header-anchor" href="#_6-字符类匹配"><span>6. <code>[ ]</code> 字符类匹配</span></a></h3><p><strong>题目1</strong>：匹配小写字母</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：标准范围</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;[a-z]&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：POSIX字符类</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;[[:lower:]]&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：排除大写字母</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;[^A-Z]&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>题目2</strong>：找出以 <code>.</code> 或 <code>s</code> 结尾的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：字符类</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;[.s]$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：扩展正则的或运算</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-En</span> <span class="token string">&#39;\\.$|s$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：分组写法</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-En</span> <span class="token string">&#39;(\\.|s)$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：转义点号</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;[\\.s]$&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>题目3</strong>：找出以 <code>I</code> 开头，且结尾不是 <code>.</code> 的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：排除点号</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^I.*[^.]$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：扩展正则写法</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-En</span> <span class="token string">&#39;^I.*[^\\.]$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：明确指定结尾字符</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^I.*[[:alnum:]]$&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-i-忽略大小写匹配" tabindex="-1"><a class="header-anchor" href="#_7-i-忽略大小写匹配"><span>7. <code>-i</code> 忽略大小写匹配</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 忽略大小写匹配i开头的行</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;^i&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 结合其他参数</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-in</span> <span class="token string">&#39;^i&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、扩展正则表达式练习题" tabindex="-1"><a class="header-anchor" href="#四、扩展正则表达式练习题"><span>四、扩展正则表达式练习题</span></a></h2><h3 id="_1-指定重复次数" tabindex="-1"><a class="header-anchor" href="#_1-指定重复次数"><span>1. <code>{}</code> 指定重复次数</span></a></h3><p><strong>题目1</strong>：匹配手机号（中国手机号规则）</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：基本匹配（1[3-9]开头，共11位）</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;1[3-9][0-9]{9}&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：更精确的运营商匹配</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;1(3[0-9]|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])[0-9]{8}&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：单词边界限制</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Enow</span> <span class="token string">&#39;[0-9]{11}&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>题目2</strong>：匹配QQ号（5-11位数字）</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：5-11位数字</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Enow</span> <span class="token string">&#39;[0-9]{5,11}&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：常见QQ号范围（5-10位）</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Enow</span> <span class="token string">&#39;[1-9][0-9]{4,9}&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：排除手机号干扰</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Enow</span> <span class="token string">&#39;\\b[1-9][0-9]{4,10}\\b&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-分组与向后引用" tabindex="-1"><a class="header-anchor" href="#_2-分组与向后引用"><span>2. 分组与向后引用</span></a></h3><p><strong>题目1</strong>：查找所有单词中出现连续相同字母的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：至少2个连续相同字母</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;([a-zA-Z])\\1&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：至少2个连续相同字母（带+号）</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;([a-zA-Z])\\1+&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：明确2个连续字母</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;([a-zA-Z])\\1&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>题目2</strong>：只查找同一个字母连续3次的行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：精确3次</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-En</span> <span class="token string">&#39;([a-z])\\1{2}&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：另一种写法</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-En</span> <span class="token string">&#39;([a-zA-Z])\\1\\1&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：扩展正则写法</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-En</span> <span class="token string">&#39;([[:alpha:]])\\1\\1&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：匹配三个相同字母的单词</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-En</span> <span class="token string">&#39;\\b([a-zA-Z])\\1{2}\\b&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-网址提取" tabindex="-1"><a class="header-anchor" href="#_3-网址提取"><span>3. 网址提取</span></a></h3><p><strong>题目1</strong>：提取网站的主机名和域名（<a href="https://www.xxx.xn--com-vb3f281b/" target="_blank" rel="noopener noreferrer">www.xxx.com格式</a>）</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：基本匹配</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;([a-z])\\1{2,}\\.[a-z0-9]{1,}\\.[a-z0-9]{1,}&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：常见域名后缀</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;www\\..*\\.(cn|com|net|org)&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：更精确的匹配</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;www\\.[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：分组提取</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;(www)\\.([a-z0-9]+)\\.([a-z]{2,})&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>题目2</strong>：提取完整的链接地址</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：匹配http/https链接</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;https?://([a-zA-Z0-9])\\1{2}\\.[a-zA-Z0-9]{1,}\\.[a-zA-Z0-9]{1,}[/]?[a-zA-Z0-9]{0,}&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：简单匹配所有链接</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;h.*://.*[/]?.*&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：精确匹配常见URL格式</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;https?://www\\..*\\..*&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：带路径的URL</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;https?://www\\..*\\.(cn|com).*&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案5：通用URL匹配</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Eno</span> <span class="token string">&#39;https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/[a-zA-Z0-9._-]*)*&#39;</span> test.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、工作常见需求实战" tabindex="-1"><a class="header-anchor" href="#五、工作常见需求实战"><span>五、工作常见需求实战</span></a></h2><h3 id="_1-排除配置文件的注释和空行" tabindex="-1"><a class="header-anchor" href="#_1-排除配置文件的注释和空行"><span>1. 排除配置文件的注释和空行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：排除#注释和空行</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Ev</span> <span class="token string">&#39;^#|^$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：分步处理</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">&#39;^#&#39;</span> test.txt <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;.&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：排除#和;注释以及空行</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-Ev</span> <span class="token string">&#39;^[#;]|^$&#39;</span> test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：保留有实际配置的行</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;^[^#]&#39;</span> test.txt <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">&#39;^$&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-查找进程并过滤grep自身" tabindex="-1"><a class="header-anchor" href="#_2-查找进程并过滤grep自身"><span>2. 查找进程并过滤grep自身</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：标准写法</span></span>
<span class="line"><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">ssh</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">&#39;grep&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：使用正则排除</span></span>
<span class="line"><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;[s]sh&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：使用pgrep命令</span></span>
<span class="line">pgrep <span class="token parameter variable">-af</span> <span class="token function">ssh</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：结合awk</span></span>
<span class="line"><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;/ssh/ &amp;&amp; !/grep/&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-查看磁盘使用率" tabindex="-1"><a class="header-anchor" href="#_3-查看磁盘使用率"><span>3. 查看磁盘使用率</span></a></h3><p><strong>查看sda磁盘使用率</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：提取百分比</span></span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span> <span class="token operator">|</span> <span class="token function">grep</span> sda <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-oE</span> <span class="token string">&#39;[0-9]+%&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：使用awk提取</span></span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span> <span class="token operator">|</span> <span class="token function">grep</span> sda <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $5}&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：精确匹配sda设备</span></span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;^/dev/sda&#39;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-oE</span> <span class="token string">&#39;[0-9]+%&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>查看根分区使用率</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：匹配根分区</span></span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;/$&#39;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-oE</span> <span class="token string">&#39;[0-9]+%&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：使用awk</span></span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;$6==&quot;/&quot; {print $5}&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：精确提取</span></span>
<span class="line"><span class="token function">df</span> <span class="token parameter variable">-h</span> / <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-1</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-oE</span> <span class="token string">&#39;[0-9]+%&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-取出网卡ip地址" tabindex="-1"><a class="header-anchor" href="#_4-取出网卡ip地址"><span>4. 取出网卡IP地址</span></a></h3><p><strong>使用ifconfig</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：标准提取</span></span>
<span class="line"><span class="token function">ifconfig</span> ens33 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;netmask&#39;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-Eo</span> <span class="token string">&#39;[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}&#39;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：使用awk简化</span></span>
<span class="line"><span class="token function">ifconfig</span> ens33 <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;/inet / {print $2}&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：精确匹配</span></span>
<span class="line"><span class="token function">ifconfig</span> ens33 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-oP</span> <span class="token string">&#39;inet \\K[\\d.]+&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>使用ip命令</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：标准提取</span></span>
<span class="line"><span class="token function">ip</span> addr show ens33 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;inet &#39;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-Eo</span> <span class="token string">&#39;[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}&#39;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：简化写法</span></span>
<span class="line"><span class="token function">ip</span> <span class="token parameter variable">-4</span> addr show ens33 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-oP</span> <span class="token string">&#39;(?&lt;=inet\\s)\\d+(\\.\\d+){3}&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：使用awk</span></span>
<span class="line"><span class="token function">ip</span> addr show ens33 <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;/inet / {split($2, a, &quot;/&quot;); print a[1]}&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-统计禁止登录的用户" tabindex="-1"><a class="header-anchor" href="#_5-统计禁止登录的用户"><span>5. 统计禁止登录的用户</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：提取nologin用户</span></span>
<span class="line"><span class="token function">grep</span> <span class="token string">&#39;nologin&#39;</span> /etc/passwd <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-Eo</span> <span class="token string">&#39;^[a-z0-9A-Z]+&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：使用awk</span></span>
<span class="line"><span class="token function">awk</span> -F: <span class="token string">&#39;/nologin$/ {print $1}&#39;</span> /etc/passwd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：提取所有系统用户</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;:/sbin/nologin$&#39;</span> /etc/passwd <span class="token operator">|</span> <span class="token function">cut</span> -d: <span class="token parameter variable">-f1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：结合sort去重</span></span>
<span class="line"><span class="token function">grep</span> <span class="token string">&#39;nologin&#39;</span> /etc/passwd <span class="token operator">|</span> <span class="token function">cut</span> -d: <span class="token parameter variable">-f1</span> <span class="token operator">|</span> <span class="token function">sort</span> <span class="token parameter variable">-u</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-找出由root创建的用户-uid≥1000" tabindex="-1"><a class="header-anchor" href="#_6-找出由root创建的用户-uid≥1000"><span>6. 找出由root创建的用户（UID≥1000）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 方案1：匹配4位及以上UID</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;\\b[0-9]{4,}\\b&#39;</span> /etc/passwd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案2：精确匹配普通用户</span></span>
<span class="line"><span class="token function">awk</span> -F: <span class="token string">&#39;$3 &gt;= 1000 &amp;&amp; $3 &lt; 60000 {print $1}&#39;</span> /etc/passwd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案3：使用cut和awk组合</span></span>
<span class="line"><span class="token function">cut</span> -d: -f1,3 /etc/passwd <span class="token operator">|</span> <span class="token function">awk</span> -F: <span class="token string">&#39;$2 &gt;= 1000 {print $1}&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 方案4：排除系统用户</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;:x:[1-9][0-9]{3,}:&#39;</span> /etc/passwd <span class="token operator">|</span> <span class="token function">cut</span> -d: <span class="token parameter variable">-f1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、学习建议与技巧" tabindex="-1"><a class="header-anchor" href="#六、学习建议与技巧"><span>六、学习建议与技巧</span></a></h2><h3 id="_1-正则表达式调试技巧" tabindex="-1"><a class="header-anchor" href="#_1-正则表达式调试技巧"><span>1. 正则表达式调试技巧</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 使用颜色高亮</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">--color</span><span class="token operator">=</span>auto <span class="token string">&#39;pattern&#39;</span> <span class="token function">file</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 显示行号</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;pattern&#39;</span> <span class="token function">file</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 只显示匹配部分</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-o</span> <span class="token string">&#39;pattern&#39;</span> <span class="token function">file</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 显示上下文</span></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-C</span> <span class="token number">3</span> <span class="token string">&#39;pattern&#39;</span> <span class="token function">file</span>  <span class="token comment"># 显示前后3行</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-常用正则模式速查" tabindex="-1"><a class="header-anchor" href="#_2-常用正则模式速查"><span>2. 常用正则模式速查</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 邮箱地址</span>
<span class="line">[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}</span>
<span class="line"></span>
<span class="line"># IP地址</span>
<span class="line">([0-9]{1,3}\\.){3}[0-9]{1,3}</span>
<span class="line"></span>
<span class="line"># 日期（YYYY-MM-DD）</span>
<span class="line">[0-9]{4}-[0-9]{2}-[0-9]{2}</span>
<span class="line"></span>
<span class="line"># 中文字符</span>
<span class="line">[\\u4e00-\\u9fa5]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-性能优化建议" tabindex="-1"><a class="header-anchor" href="#_3-性能优化建议"><span>3. 性能优化建议</span></a></h3><ol><li><strong>尽量具体</strong>：避免过度使用 <code>.*</code></li><li><strong>使用锚点</strong>：<code>^</code> 和 <code>$</code> 可以显著提高性能</li><li><strong>字符类优先</strong>：<code>[abc]</code> 比 <code>(a|b|c)</code> 更高效</li><li><strong>避免回溯</strong>：谨慎使用嵌套量词</li></ol>`,80)])])}const r=n(p,[["render",i]]),o=JSON.parse('{"path":"/02-Linux%E8%BF%9B%E9%98%B6/03-%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E5%B7%A5%E5%85%B7/%E6%AD%A3%E5%88%99%E7%BB%83%E4%B9%A0.html","title":"正则练习","lang":"zh-CN","frontmatter":{"title":"正则练习"},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"02-Linux进阶/03-文本处理工具/正则练习.md"}');export{r as comp,o as data};
