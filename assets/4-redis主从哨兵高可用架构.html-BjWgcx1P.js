import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="redis主从哨兵高可用与安全配置指南" tabindex="-1"><a class="header-anchor" href="#redis主从哨兵高可用与安全配置指南"><span>Redis主从哨兵高可用与安全配置指南</span></a></h1><h2 id="一、redis主从复制架构" tabindex="-1"><a class="header-anchor" href="#一、redis主从复制架构"><span>一、Redis主从复制架构</span></a></h2><h3 id="_1-1-主从复制概述" tabindex="-1"><a class="header-anchor" href="#_1-1-主从复制概述"><span>1.1 主从复制概述</span></a></h3><p>Redis提供主从库模式保证数据副本一致性，采用读写分离方式：</p><ul><li>主库：负责写操作</li><li>从库：负责读操作，自动同步主库数据</li></ul><h3 id="_1-2-主从配置部署" tabindex="-1"><a class="header-anchor" href="#_1-2-主从配置部署"><span>1.2 主从配置部署</span></a></h3><h4 id="主节点配置-db-51" tabindex="-1"><a class="header-anchor" href="#主节点配置-db-51"><span>主节点配置（db-51）</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/redis.conf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">daemonize yes</span>
<span class="line">bind 127.0.0.1  10.0.0.51</span>
<span class="line">port 6379</span>
<span class="line">requirepass StrongMasterPass123!  # 启用强密码</span>
<span class="line">protected-mode yes                # 开启保护模式</span>
<span class="line">pidfile /redis/redis_6379.pid</span>
<span class="line">logfile /redis/redis_6379.log</span>
<span class="line">dir /redis/</span>
<span class="line"></span>
<span class="line">dbfilename dump.rdb</span>
<span class="line">appendonly yes</span>
<span class="line">appendfilename &quot;appendonly.aof&quot;</span>
<span class="line">appendfsync everysec</span>
<span class="line">aof-use-rdb-preamble yes</span>
<span class="line"></span>
<span class="line"># 可选：禁用危险命令</span>
<span class="line">rename-command KEYS     &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&quot;</span>
<span class="line">rename-command FLUSHALL &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX1&quot;</span>
<span class="line">rename-command FLUSHDB  &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX2&quot;</span>
<span class="line">rename-command CONFIG   &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX3&quot;</span>
<span class="line">rename-command SHUTDOWN &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX4&quot;</span>
<span class="line">rename-command DEBUG    &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX5&quot;</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="从节点配置-db-52-db-53" tabindex="-1"><a class="header-anchor" href="#从节点配置-db-52-db-53"><span>从节点配置（db-52/db-53）</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/redis.conf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">daemonize yes</span>
<span class="line">bind 127.0.0.1 10.0.0.52</span>
<span class="line">port 6379</span>
<span class="line">protected-mode yes</span>
<span class="line">pidfile /redis/redis_6379.pid</span>
<span class="line">logfile /redis/redis_6379.log</span>
<span class="line">dir /redis/</span>
<span class="line">dbfilename dump.rdb</span>
<span class="line">appendonly yes</span>
<span class="line">appendfilename &quot;appendonly.aof&quot;</span>
<span class="line">appendfsync everysec</span>
<span class="line">aof-use-rdb-preamble yes</span>
<span class="line">masterauth StrongMasterPass123!  # 主节点密码</span>
<span class="line">replicaof 10.0.0.51 6379</span>
<span class="line"></span>
<span class="line"># 可选：禁用危险命令</span>
<span class="line">rename-command KEYS     &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&quot;</span>
<span class="line">rename-command FLUSHALL &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX1&quot;</span>
<span class="line">rename-command FLUSHDB  &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX2&quot;</span>
<span class="line">rename-command CONFIG   &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX3&quot;</span>
<span class="line">rename-command SHUTDOWN &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX4&quot;</span>
<span class="line">rename-command DEBUG    &quot;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX5&quot;</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="安全建议" tabindex="-1"><a class="header-anchor" href="#安全建议"><span>安全建议：</span></a></h4><ol><li>建议将默认端口6379改为其他端口，避免被常见扫描工具识别</li><li>密码建议使用16位以上，包含大小写字母、数字和特殊字符</li><li>bind地址建议仅绑定内网IP，避免暴露在公网</li><li>以非root用户运行Redis服务</li></ol><h3 id="_1-3-创建redis专用用户和目录" tabindex="-1"><a class="header-anchor" href="#_1-3-创建redis专用用户和目录"><span>1.3 创建Redis专用用户和目录</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建Redis专用用户</span></span>
<span class="line"><span class="token function">useradd</span> redis <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /sbin/nologin</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建数据目录并设置权限</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /redis/</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> redis.redis /redis/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 如果Redis二进制文件已安装，设置权限</span></span>
<span class="line"><span class="token function">chown</span> redis.redis /usr/local/redis/bin/redis* <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>/dev/null <span class="token operator">||</span> <span class="token boolean">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-验证主从关系" tabindex="-1"><a class="header-anchor" href="#_1-4-验证主从关系"><span>1.4 验证主从关系</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 在主节点查看复制信息（需要认证）</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> info replication</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 输出示例</span></span>
<span class="line">role:master</span>
<span class="line">connected_slaves:2</span>
<span class="line">slave0:ip<span class="token operator">=</span><span class="token number">10.0</span>.0.52,port<span class="token operator">=</span><span class="token number">6379</span>,state<span class="token operator">=</span>online,offset<span class="token operator">=</span><span class="token number">179</span>,lag<span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">slave1:ip<span class="token operator">=</span><span class="token number">10.0</span>.0.53,port<span class="token operator">=</span><span class="token number">6379</span>,state<span class="token operator">=</span>online,offset<span class="token operator">=</span><span class="token number">179</span>,lag<span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-5-主从操作命令" tabindex="-1"><a class="header-anchor" href="#_1-5-主从操作命令"><span>1.5 主从操作命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看复制信息（从节点）</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> info replication</span>
<span class="line"><span class="token comment"># role:slave</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 取消从节点身份（变为主节点）</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> replicaof no one</span>
<span class="line"><span class="token comment"># redis-cli info replication ---&gt; role:master</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 再次修改主从关系</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> replicaof <span class="token number">10.0</span>.0.51 <span class="token number">6379</span></span>
<span class="line"><span class="token comment"># redis-cli info replication ---&gt; role:slave</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、redis哨兵高可用集群" tabindex="-1"><a class="header-anchor" href="#二、redis哨兵高可用集群"><span>二、Redis哨兵高可用集群</span></a></h2><h3 id="_2-1-哨兵架构原理" tabindex="-1"><a class="header-anchor" href="#_2-1-哨兵架构原理"><span>2.1 哨兵架构原理</span></a></h3><p>哨兵集群提供Redis高可用解决方案：</p><ul><li><strong>监控</strong>：持续检查主从节点状态</li><li><strong>通知</strong>：通过API向管理员报告故障</li><li><strong>自动故障转移</strong>：主节点故障时自动提升从节点</li><li><strong>配置提供者</strong>：客户端自动发现当前主节点</li></ul><h3 id="_2-2-哨兵集群部署" tabindex="-1"><a class="header-anchor" href="#_2-2-哨兵集群部署"><span>2.2 哨兵集群部署</span></a></h3><h4 id="哨兵配置" tabindex="-1"><a class="header-anchor" href="#哨兵配置"><span>哨兵配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span>/redis/sentinel.conf <span class="token operator">&lt;&lt;</span><span class="token string">&#39;EOF&#39;</span>
<span class="line">daemonize yes</span>
<span class="line">bind 0.0.0.0</span>
<span class="line">port 26379</span>
<span class="line">dir /redis/</span>
<span class="line">logfile /redis/sentinel.log</span>
<span class="line">sentinel monitor mymaster 10.0.0.51 6379 2</span>
<span class="line">sentinel down-after-milliseconds mymaster 30000</span>
<span class="line">sentinel parallel-syncs mymaster 1</span>
<span class="line">sentinel failover-timeout mymaster 180000</span>
<span class="line"></span>
<span class="line"># 如果主节点有密码，需配置</span>
<span class="line">sentinel auth-pass mymaster StrongMasterPass123!</span>
<span class="line"></span>
<span class="line"># 哨兵自身认证（可选，增强安全性）</span>
<span class="line">sentinel requirepass SentinelPass123!</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动哨兵</span></span>
<span class="line">redis-sentinel /redis/sentinel.conf</span>
<span class="line"><span class="token function">ps</span> -ef<span class="token operator">|</span><span class="token function">grep</span> redis</span>
<span class="line">redis-cli <span class="token parameter variable">-p</span> <span class="token number">26379</span> info sentinel</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="systemd服务配置" tabindex="-1"><a class="header-anchor" href="#systemd服务配置"><span>Systemd服务配置</span></a></h4><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Unit</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">Description</span><span class="token punctuation">=</span><span class="token value attr-value">Redis Sentinel</span></span>
<span class="line"><span class="token key attr-name">After</span><span class="token punctuation">=</span><span class="token value attr-value">network.target</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Service</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">Type</span><span class="token punctuation">=</span><span class="token value attr-value">notify</span></span>
<span class="line"><span class="token key attr-name">User</span><span class="token punctuation">=</span><span class="token value attr-value">redis</span></span>
<span class="line"><span class="token key attr-name">Group</span><span class="token punctuation">=</span><span class="token value attr-value">redis</span></span>
<span class="line"><span class="token key attr-name">RuntimeDirectory</span><span class="token punctuation">=</span><span class="token value attr-value">redis</span></span>
<span class="line"><span class="token key attr-name">ExecStart</span><span class="token punctuation">=</span><span class="token value attr-value">/usr/local/bin/redis-sentinel /redis/sentinel.conf</span></span>
<span class="line"><span class="token key attr-name">ExecStop</span><span class="token punctuation">=</span><span class="token value attr-value">/bin/kill -s QUIT $MAINPID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安全限制</span></span>
<span class="line"><span class="token key attr-name">NoNewPrivileges</span><span class="token punctuation">=</span><span class="token value attr-value">yes</span></span>
<span class="line"><span class="token key attr-name">ReadWritePaths</span><span class="token punctuation">=</span><span class="token value attr-value">/redis</span></span>
<span class="line"><span class="token key attr-name">ReadOnlyPaths</span><span class="token punctuation">=</span><span class="token value attr-value">/</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Install</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">WantedBy</span><span class="token punctuation">=</span><span class="token value attr-value">multi-user.target</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-哨兵操作与监控" tabindex="-1"><a class="header-anchor" href="#_2-3-哨兵操作与监控"><span>2.3 哨兵操作与监控</span></a></h3><h4 id="查看哨兵状态" tabindex="-1"><a class="header-anchor" href="#查看哨兵状态"><span>查看哨兵状态</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 连接哨兵（如有密码需要认证）</span></span>
<span class="line">redis-cli <span class="token parameter variable">-p</span> <span class="token number">26379</span></span>
<span class="line"><span class="token number">127.0</span>.0.1:2637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> auth SentinelPass123<span class="token operator">!</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看哨兵信息</span></span>
<span class="line">info sentinel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取主节点地址</span></span>
<span class="line">sentinel get-master-addr-by-name mymaster</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看主节点信息</span></span>
<span class="line">sentinel master mymaster</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看从节点信息</span></span>
<span class="line">sentinel slaves mymaster</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查仲裁状态</span></span>
<span class="line">sentinel ckquorum mymaster</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-故障转移流程" tabindex="-1"><a class="header-anchor" href="#_2-4-故障转移流程"><span>2.4 故障转移流程</span></a></h3><h4 id="故障发现与切换" tabindex="-1"><a class="header-anchor" href="#故障发现与切换"><span>故障发现与切换</span></a></h4><ol><li><strong>主观下线</strong>：单个哨兵认为主节点不可用</li><li><strong>客观下线</strong>：多个哨兵确认主节点故障</li><li><strong>选举领导者</strong>：哨兵间选举负责故障转移的领导者</li><li><strong>故障转移</strong>： <ul><li>选择最优从节点作为新主节点</li><li>将其它从节点指向新主节点</li><li>旧主节点恢复后作为从节点加入</li></ul></li></ol><h3 id="_2-5-测试主从故障自动化转移" tabindex="-1"><a class="header-anchor" href="#_2-5-测试主从故障自动化转移"><span>2.5 测试主从故障自动化转移</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 查看当前主节点</span></span>
<span class="line">sentinel get-master-addr-by-name mymaster</span>
<span class="line"><span class="token comment"># 输出：1) &quot;10.0.0.51&quot; 2) &quot;6379&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 模拟主节点故障</span></span>
<span class="line">redis-cli <span class="token parameter variable">-h</span> <span class="token number">10.0</span>.0.51 <span class="token parameter variable">-p</span> <span class="token number">6379</span> <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> debug segfault</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 等待故障转移（约30-60秒）</span></span>
<span class="line"><span class="token function">sleep</span> <span class="token number">45</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 查看新主节点</span></span>
<span class="line">sentinel get-master-addr-by-name mymaster</span>
<span class="line"><span class="token comment"># 输出可能变为：1) &quot;10.0.0.52&quot; 2) &quot;6379&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 验证新主节点可写</span></span>
<span class="line">redis-cli <span class="token parameter variable">-h</span> <span class="token number">10.0</span>.0.52 <span class="token parameter variable">-p</span> <span class="token number">6379</span> <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> <span class="token builtin class-name">set</span> test_key <span class="token string">&quot;故障转移成功&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6. 验证从节点可读</span></span>
<span class="line">redis-cli <span class="token parameter variable">-h</span> <span class="token number">10.0</span>.0.53 <span class="token parameter variable">-p</span> <span class="token number">6379</span> <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> get test_key</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="修复old-master" tabindex="-1"><a class="header-anchor" href="#修复old-master"><span>修复old_master</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 重启原主节点</span></span>
<span class="line">systemctl start redis</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 查看复制状态</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> info replication</span>
<span class="line"><span class="token comment"># 输出应显示为从节点角色，指向新主节点</span></span>
<span class="line"><span class="token comment"># Replication</span></span>
<span class="line"><span class="token comment"># role:slave</span></span>
<span class="line"><span class="token comment"># master_host:10.0.0.52  # 或10.0.0.53</span></span>
<span class="line"><span class="token comment"># master_port:6379</span></span>
<span class="line"><span class="token comment"># master_link_status:up</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-6-客户端连接策略-安全增强版" tabindex="-1"><a class="header-anchor" href="#_2-6-客户端连接策略-安全增强版"><span>2.6 客户端连接策略（安全增强版）</span></a></h3><h4 id="python客户端连接哨兵" tabindex="-1"><a class="header-anchor" href="#python客户端连接哨兵"><span>Python客户端连接哨兵</span></a></h4><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code class="language-python"><span class="line"><span class="token keyword">from</span> redis<span class="token punctuation">.</span>sentinel <span class="token keyword">import</span> Sentinel</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 哨兵节点列表（建议使用内网IP）</span></span>
<span class="line">sentinel_nodes <span class="token operator">=</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">(</span><span class="token string">&#39;10.0.0.51&#39;</span><span class="token punctuation">,</span> <span class="token number">26379</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">(</span><span class="token string">&#39;10.0.0.52&#39;</span><span class="token punctuation">,</span> <span class="token number">26379</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">(</span><span class="token string">&#39;10.0.0.53&#39;</span><span class="token punctuation">,</span> <span class="token number">26379</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建哨兵连接（带认证）</span></span>
<span class="line">sentinel <span class="token operator">=</span> Sentinel<span class="token punctuation">(</span></span>
<span class="line">    sentinel_nodes<span class="token punctuation">,</span></span>
<span class="line">    socket_timeout<span class="token operator">=</span><span class="token number">0.5</span><span class="token punctuation">,</span></span>
<span class="line">    sentinel_kwargs<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">&#39;password&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;SentinelPass123!&#39;</span><span class="token punctuation">}</span>  <span class="token comment"># 哨兵密码</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取主节点连接（写操作）</span></span>
<span class="line">master <span class="token operator">=</span> sentinel<span class="token punctuation">.</span>master_for<span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">&#39;mymaster&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    password<span class="token operator">=</span><span class="token string">&#39;StrongMasterPass123!&#39;</span><span class="token punctuation">,</span>  <span class="token comment"># Redis密码</span></span>
<span class="line">    socket_timeout<span class="token operator">=</span><span class="token number">0.5</span><span class="token punctuation">,</span></span>
<span class="line">    retry_on_timeout<span class="token operator">=</span><span class="token boolean">True</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取从节点连接（读操作）</span></span>
<span class="line">slave <span class="token operator">=</span> sentinel<span class="token punctuation">.</span>slave_for<span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">&#39;mymaster&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    password<span class="token operator">=</span><span class="token string">&#39;StrongMasterPass123!&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    socket_timeout<span class="token operator">=</span><span class="token number">0.5</span><span class="token punctuation">,</span></span>
<span class="line">    retry_on_timeout<span class="token operator">=</span><span class="token boolean">True</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 执行操作</span></span>
<span class="line"><span class="token keyword">try</span><span class="token punctuation">:</span></span>
<span class="line">    master<span class="token punctuation">.</span><span class="token builtin">set</span><span class="token punctuation">(</span><span class="token string">&#39;key&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;value&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    value <span class="token operator">=</span> slave<span class="token punctuation">.</span>get<span class="token punctuation">(</span><span class="token string">&#39;key&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f&quot;操作成功，获取的值: </span><span class="token interpolation"><span class="token punctuation">{</span>value<span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">except</span> Exception <span class="token keyword">as</span> e<span class="token punctuation">:</span></span>
<span class="line">    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f&quot;连接失败: </span><span class="token interpolation"><span class="token punctuation">{</span>e<span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、安全配置总结" tabindex="-1"><a class="header-anchor" href="#三、安全配置总结"><span>三、安全配置总结</span></a></h2><h3 id="_3-1-必须实施的安全措施" tabindex="-1"><a class="header-anchor" href="#_3-1-必须实施的安全措施"><span>3.1 必须实施的安全措施</span></a></h3><ol><li><strong>密码策略</strong>： <ul><li>主从节点使用强密码（16位以上，混合字符）</li><li>哨兵集群设置独立密码</li><li>定期更换密码</li></ul></li><li><strong>网络隔离</strong>： <ul><li>bind配置仅限内网IP</li><li>使用防火墙限制访问来源</li><li>避免将Redis暴露到公网</li></ul></li><li><strong>权限控制</strong>： <ul><li>以非root用户（redis用户）运行服务</li><li>限制数据目录权限</li><li>禁用危险命令（KEYS, FLUSHALL, CONFIG等）</li></ul></li><li><strong>配置加固</strong>： <ul><li>开启protected-mode</li><li>修改默认端口</li><li>配置合适的超时时间</li></ul></li></ol><h3 id="_3-2-监控与审计" tabindex="-1"><a class="header-anchor" href="#_3-2-监控与审计"><span>3.2 监控与审计</span></a></h3><ol><li><strong>日志监控</strong>： <ul><li>定期检查Redis日志</li><li>监控异常登录尝试</li><li>设置日志轮转策略</li></ul></li><li><strong>性能监控</strong>： <ul><li>监控内存使用情况</li><li>监控连接数变化</li><li>监控主从同步延迟</li></ul></li><li><strong>定期安全检查</strong>： <ul><li>检查配置文件权限</li><li>验证用户权限设置</li><li>更新Redis到安全版本</li></ul></li></ol><hr><h2 id="附录-常用命令速查" tabindex="-1"><a class="header-anchor" href="#附录-常用命令速查"><span>附录：常用命令速查</span></a></h2><h3 id="安全相关" tabindex="-1"><a class="header-anchor" href="#安全相关"><span>安全相关</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看Redis配置（需要认证）</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> your_password config get *</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 动态修改密码（谨慎使用）</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> old_password config <span class="token builtin class-name">set</span> requirepass new_password</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看客户端连接</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> your_password client list</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看认证日志</span></span>
<span class="line"><span class="token function">grep</span> <span class="token string">&quot;AUTH&quot;</span> /redis/redis_6379.log</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="复制相关" tabindex="-1"><a class="header-anchor" href="#复制相关"><span>复制相关</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看复制状态</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> your_password info replication</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看复制延迟</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> your_password <span class="token parameter variable">--latency</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 手动触发同步</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> your_password <span class="token function">sync</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="哨兵相关" tabindex="-1"><a class="header-anchor" href="#哨兵相关"><span>哨兵相关</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 强制故障转移（谨慎使用）</span></span>
<span class="line">redis-cli <span class="token parameter variable">-p</span> <span class="token number">26379</span> <span class="token parameter variable">-a</span> SentinelPass123<span class="token operator">!</span> sentinel failover mymaster</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看哨兵节点</span></span>
<span class="line">redis-cli <span class="token parameter variable">-p</span> <span class="token number">26379</span> <span class="token parameter variable">-a</span> SentinelPass123<span class="token operator">!</span> sentinel sentinels mymaster</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 移除故障节点</span></span>
<span class="line">redis-cli <span class="token parameter variable">-p</span> <span class="token number">26379</span> <span class="token parameter variable">-a</span> SentinelPass123<span class="token operator">!</span> sentinel remove mymaster</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重置故障状态</span></span>
<span class="line">redis-cli <span class="token parameter variable">-p</span> <span class="token number">26379</span> <span class="token parameter variable">-a</span> SentinelPass123<span class="token operator">!</span> sentinel reset mymaster</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="性能测试" tabindex="-1"><a class="header-anchor" href="#性能测试"><span>性能测试</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 基准测试（带认证）</span></span>
<span class="line">redis-benchmark <span class="token parameter variable">-h</span> <span class="token number">10.0</span>.0.51 <span class="token parameter variable">-p</span> <span class="token number">6379</span> <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span> <span class="token parameter variable">-n</span> <span class="token number">100000</span> <span class="token parameter variable">-q</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试SET操作</span></span>
<span class="line">redis-benchmark <span class="token parameter variable">-t</span> <span class="token builtin class-name">set</span> <span class="token parameter variable">-n</span> <span class="token number">1000000</span> <span class="token parameter variable">-r</span> <span class="token number">10000000</span> <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试GET操作</span></span>
<span class="line">redis-benchmark <span class="token parameter variable">-t</span> get <span class="token parameter variable">-n</span> <span class="token number">1000000</span> <span class="token parameter variable">-r</span> <span class="token number">10000000</span> <span class="token parameter variable">-a</span> StrongMasterPass123<span class="token operator">!</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="入侵检测与响应" tabindex="-1"><a class="header-anchor" href="#入侵检测与响应"><span>入侵检测与响应</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 检查异常连接</span></span>
<span class="line">redis-cli <span class="token parameter variable">-a</span> your_password client list <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">&quot;10.0.0&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 检查持久化文件</span></span>
<span class="line"><span class="token function">ls</span> <span class="token parameter variable">-la</span> /redis/dump.rdb /redis/appendonly.aof</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 检查SSH授权文件（如果曾经被攻击）</span></span>
<span class="line"><span class="token function">ls</span> <span class="token parameter variable">-la</span> ~/.ssh/authorized_keys</span>
<span class="line"><span class="token function">stat</span> ~/.ssh/authorized_keys</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 紧急响应步骤</span></span>
<span class="line"><span class="token comment"># a) 立即修改密码</span></span>
<span class="line"><span class="token comment"># b) 重启Redis服务</span></span>
<span class="line"><span class="token comment"># c) 检查并清理异常数据</span></span>
<span class="line"><span class="token comment"># d) 审查防火墙规则</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项"><span>注意事项</span></a></h2><ol><li><strong>生产环境部署前</strong>务必在测试环境验证所有配置</li><li><strong>密码管理</strong>建议使用密钥管理服务，避免硬编码</li><li><strong>定期备份</strong>配置文件和持久化数据</li><li><strong>监控告警</strong>设置关键指标阈值（如内存使用率、连接数等）</li><li><strong>文档更新</strong>保持操作文档与实际环境同步</li></ol>`,62)])])}const r=n(i,[["render",p]]),o=JSON.parse('{"path":"/09-%E4%B8%AD%E9%97%B4%E4%BB%B6/03-redis/4-redis%E4%B8%BB%E4%BB%8E%E5%93%A8%E5%85%B5%E9%AB%98%E5%8F%AF%E7%94%A8%E6%9E%B6%E6%9E%84.html","title":"Redis主从哨兵高可用与安全配置指南","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"09-中间件/03-redis/4-redis主从哨兵高可用架构.md"}');export{r as comp,o as data};
