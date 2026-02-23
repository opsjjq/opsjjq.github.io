import{_ as n,c as a,e,o as l}from"./app-DtXLoKBz.js";const i={};function p(c,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="nfs-配置练习题" tabindex="-1"><a class="header-anchor" href="#nfs-配置练习题"><span>NFS 配置练习题</span></a></h2><h3 id="_1-开放-nfs-share-目录-提供给任意用户只读访问" tabindex="-1"><a class="header-anchor" href="#_1-开放-nfs-share-目录-提供给任意用户只读访问"><span>1. 开放 <code>/nfs/share</code> 目录，提供给任意用户只读访问</span></a></h3><p><strong>服务端配置</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 安装必要软件</span></span>
<span class="line">yum <span class="token function">install</span> nfs-utils rpcbind <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建共享目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /nfs/share</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 配置/etc/exports（关键：ro只读 + all_squash匿名映射）</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;/nfs/share *(ro,sync,all_squash)&#39;</span> <span class="token operator">&gt;</span> /etc/exports</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 启动服务（必须先启动rpcbind）</span></span>
<span class="line">systemctl start rpcbind.service</span>
<span class="line">systemctl start rpcbind.socket</span>
<span class="line">systemctl start nfs</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 查看共享列表</span></span>
<span class="line">showmount <span class="token parameter variable">-e</span> <span class="token number">172.16</span>.1.31</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6. 设置目录权限（映射到nfsnobody）</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> nfsnobody:nfsnobody /nfs/share</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端验证</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 创建挂载点</span></span>
<span class="line"><span class="token function">mkdir</span> /nfs_share</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 挂载NFS共享</span></span>
<span class="line"><span class="token function">mount</span> <span class="token parameter variable">-t</span> nfs <span class="token number">172.16</span>.1.31:/nfs/share /nfs_share</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 验证只读权限（应无法创建文件）</span></span>
<span class="line"><span class="token function">touch</span> /nfs_share/test.txt  <span class="token comment"># 应提示&quot;Read-only file system&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_2-开放-nfs-upload-目录-提供给172-16-1-0-24网段-上传数据映射为nfs-upload用户-uid-gid-200" tabindex="-1"><a class="header-anchor" href="#_2-开放-nfs-upload-目录-提供给172-16-1-0-24网段-上传数据映射为nfs-upload用户-uid-gid-200"><span>2. 开放 <code>/nfs/upload</code> 目录，提供给172.16.1.0/24网段，上传数据映射为nfs-upload用户（UID=GID=200）</span></a></h3><p><strong>服务端配置</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 创建专用用户和组</span></span>
<span class="line"><span class="token function">groupadd</span> <span class="token parameter variable">-g</span> <span class="token number">200</span> nfs-upload</span>
<span class="line"><span class="token function">useradd</span> <span class="token parameter variable">-u</span> <span class="token number">200</span> <span class="token parameter variable">-g</span> <span class="token number">200</span> <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /sbin/nologin nfs-upload</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建共享目录并设置权限</span></span>
<span class="line"><span class="token function">mkdir</span> /nfs/upload</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> nfs-upload:nfs-upload /nfs/upload</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 配置/etc/exports（关键：身份映射参数）</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;/nfs/upload 172.16.1.0/24(rw,sync,all_squash,anonuid=200,anongid=200)&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/exports</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 重新加载配置</span></span>
<span class="line">exportfs <span class="token parameter variable">-r</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端验证</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 挂载共享</span></span>
<span class="line"><span class="token function">mkdir</span> /nfs_upload</span>
<span class="line"><span class="token function">mount</span> <span class="token parameter variable">-t</span> nfs <span class="token number">172.16</span>.1.31:/nfs/upload /nfs_upload</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 测试写入（文件属主应为nfs-upload）</span></span>
<span class="line"><span class="token function">touch</span> /nfs_upload/test_upload.txt</span>
<span class="line"><span class="token function">ls</span> <span class="token parameter variable">-l</span> /nfs_upload/  <span class="token comment"># 应显示属主为nfs-upload</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_3-开放-home-chaoge-目录仅共享给172-16-1-41-且只有chaoge01用户-uid-1888-可以完全访问" tabindex="-1"><a class="header-anchor" href="#_3-开放-home-chaoge-目录仅共享给172-16-1-41-且只有chaoge01用户-uid-1888-可以完全访问"><span>3. 开放 <code>/home/chaoge</code> 目录仅共享给172.16.1.41，且只有chaoge01用户（UID=1888）可以完全访问</span></a></h3><p><strong>服务端配置</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 创建chaoge01用户</span></span>
<span class="line"><span class="token function">useradd</span> chaoge01 <span class="token parameter variable">-u</span> <span class="token number">1888</span> <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /sbin/nologin</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建目录并设置严格权限（700：仅属主可访问）</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /home/chaoge</span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> chaoge01:chaoge01 /home/chaoge</span>
<span class="line"><span class="token function">chmod</span> <span class="token number">700</span> /home/chaoge</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 配置/etc/exports（无身份映射，保持原始权限）</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;/home/chaoge 172.16.1.41(rw)&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/exports</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 重新加载配置</span></span>
<span class="line">exportfs <span class="token parameter variable">-r</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端配置</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 创建相同UID的用户</span></span>
<span class="line"><span class="token function">useradd</span> chaoge01 <span class="token parameter variable">-u</span> <span class="token number">1888</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 挂载共享</span></span>
<span class="line"><span class="token function">mkdir</span> /nfs_chaoge</span>
<span class="line"><span class="token function">mount</span> <span class="token parameter variable">-t</span> nfs <span class="token number">172.16</span>.1.31:/home/chaoge /nfs_chaoge</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 验证权限（只有chaoge01用户可访问）</span></span>
<span class="line"><span class="token function">su</span> - chaoge01</span>
<span class="line"><span class="token builtin class-name">cd</span> /nfs_chaoge  <span class="token comment"># 应能成功进入</span></span>
<span class="line"><span class="token function">touch</span> test_file.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_4-添加30g硬盘-为nfs提供-nfs-nginx-data-存储-仅web-7主机使用-映射为www用户-uid-gid-11211-供nginx使用" tabindex="-1"><a class="header-anchor" href="#_4-添加30g硬盘-为nfs提供-nfs-nginx-data-存储-仅web-7主机使用-映射为www用户-uid-gid-11211-供nginx使用"><span>4. 添加30G硬盘，为NFS提供 <code>/nfs-nginx-data</code> 存储，仅web-7主机使用，映射为www用户（UID=GID=11211），供Nginx使用</span></a></h3><p><strong>服务端配置</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 格式化30G新硬盘</span></span>
<span class="line">lsblk  <span class="token comment"># 确认磁盘设备（如/dev/sdb）</span></span>
<span class="line">mkfs.xfs /dev/sdb</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建挂载点并挂载</span></span>
<span class="line"><span class="token function">mkdir</span> /nfs-nginx-data</span>
<span class="line"><span class="token function">mount</span> /dev/sdb /nfs-nginx-data</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 创建www用户</span></span>
<span class="line"><span class="token function">useradd</span> www <span class="token parameter variable">-u</span> <span class="token number">11211</span> <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /sbin/nologin</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 配置/etc/exports（指定主机名和身份映射）</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&#39;/nfs-nginx-data web-7(rw,sync,all_squash,anonuid=11211,anongid=11211)&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/exports</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 设置目录权限</span></span>
<span class="line"><span class="token function">chown</span> <span class="token parameter variable">-R</span> www:www /nfs-nginx-data</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6. 创建测试数据</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /nfs-nginx-data/index.html <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">&lt;meta charset=utf8&gt;</span>
<span class="line">NFS共享存储测试页面</span>
<span class="line">&lt;img src=&#39;test.png&#39;&gt;</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 7. 重新加载配置</span></span>
<span class="line">exportfs <span class="token parameter variable">-r</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端（web-7）配置</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 安装Nginx</span></span>
<span class="line">yum <span class="token function">install</span> nginx <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 挂载NFS到Nginx网页目录</span></span>
<span class="line"><span class="token function">mount</span> <span class="token parameter variable">-t</span> nfs <span class="token number">172.16</span>.1.31:/nfs-nginx-data /usr/share/nginx/html</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 启动Nginx</span></span>
<span class="line">systemctl start nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 测试访问</span></span>
<span class="line"><span class="token function">curl</span> http://localhost</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nfs配置要点总结" tabindex="-1"><a class="header-anchor" href="#nfs配置要点总结"><span>NFS配置要点总结</span></a></h2><h3 id="配置文件-etc-exports-语法" tabindex="-1"><a class="header-anchor" href="#配置文件-etc-exports-语法"><span>配置文件 <code>/etc/exports</code> 语法：</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">共享目录 客户端地址(参数1,参数2,...)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="常用参数说明" tabindex="-1"><a class="header-anchor" href="#常用参数说明"><span>常用参数说明：</span></a></h3><table><thead><tr><th style="text-align:left;">参数</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><code>ro</code> / <code>rw</code></td><td style="text-align:left;">只读 / 读写</td></tr><tr><td style="text-align:left;"><code>sync</code> / <code>async</code></td><td style="text-align:left;">同步/异步写入</td></tr><tr><td style="text-align:left;"><code>root_squash</code></td><td style="text-align:left;">root用户映射为匿名用户（默认）</td></tr><tr><td style="text-align:left;"><code>no_root_squash</code></td><td style="text-align:left;">root保持root权限（不安全）</td></tr><tr><td style="text-align:left;"><code>all_squash</code></td><td style="text-align:left;">所有用户映射为匿名用户</td></tr><tr><td style="text-align:left;"><code>anonuid=</code> / <code>anongid=</code></td><td style="text-align:left;">指定映射的UID/GID</td></tr></tbody></table><h3 id="服务管理命令" tabindex="-1"><a class="header-anchor" href="#服务管理命令"><span>服务管理命令：</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 启动服务（必须顺序）</span></span>
<span class="line">systemctl start rpcbind</span>
<span class="line">systemctl start nfs</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看共享</span></span>
<span class="line">showmount <span class="token parameter variable">-e</span> 服务器IP</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新加载配置（不重启服务）</span></span>
<span class="line">exportfs <span class="token parameter variable">-r</span></span>
<span class="line"><span class="token comment"># 或</span></span>
<span class="line">systemctl reload nfs</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看NFS端口信息</span></span>
<span class="line">rpcinfo <span class="token parameter variable">-p</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,31)])])}const d=n(i,[["render",p]]),r=JSON.parse('{"path":"/02-Linux%E8%BF%9B%E9%98%B6/04-%E6%96%87%E4%BB%B6%E5%90%8C%E6%AD%A5%E4%B8%8E%E5%AD%98%E5%82%A8/nfs%E9%A2%98%E7%9B%AE.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"02-Linux进阶/04-文件同步与存储/nfs题目.md"}');export{d as comp,r as data};
