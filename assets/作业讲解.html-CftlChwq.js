import{_ as e,c as n,e as t,o as l}from"./app-DtXLoKBz.js";const a="/assets/image-20260207143138320-D2QQdifx.png",i={};function d(r,s){return l(),n("div",null,[...s[0]||(s[0]=[t('<h2 id="一、磁盘管理流程图解" tabindex="-1"><a class="header-anchor" href="#一、磁盘管理流程图解"><span>一、磁盘管理流程图解</span></a></h2><p><strong>磁盘管理完整流程</strong>：</p><p><img src="'+a+`" alt="image-20260207143138320"></p><h2 id="二、机械硬盘的五个主要组成部分" tabindex="-1"><a class="header-anchor" href="#二、机械硬盘的五个主要组成部分"><span>二、机械硬盘的五个主要组成部分</span></a></h2><table><thead><tr><th style="text-align:left;">组件</th><th style="text-align:left;">作用</th><th style="text-align:left;">图示说明</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>机械臂</strong></td><td style="text-align:left;">移动磁头到指定磁道</td><td style="text-align:left;">控制磁头定位</td></tr><tr><td style="text-align:left;"><strong>磁头</strong></td><td style="text-align:left;">读写数据</td><td style="text-align:left;">悬浮在盘片上方进行读写</td></tr><tr><td style="text-align:left;"><strong>盘片</strong></td><td style="text-align:left;">存储数据介质</td><td style="text-align:left;">表面涂有磁性材料</td></tr><tr><td style="text-align:left;"><strong>主轴马达</strong></td><td style="text-align:left;">带动盘片高速旋转</td><td style="text-align:left;">转速决定读写速度</td></tr><tr><td style="text-align:left;"><strong>硬盘接口</strong></td><td style="text-align:left;">连接主板与硬盘</td><td style="text-align:left;">SATA/SCSI/NVMe等</td></tr></tbody></table><p><strong>盘片结构详解</strong>：</p><ul><li><strong>磁头</strong>：每个盘片上下各1个，共2个磁头</li><li><strong>磁道</strong>：从外圈到内圈编号0、1、2...</li><li><strong>柱面</strong>：所有盘片相同位置的磁道集合</li><li><strong>扇区</strong>：最小存储单位（512字节）</li><li><strong>块</strong>：多个连续扇区（通常8个=4KB）</li></ul><h2 id="三、磁盘接口类型-五种" tabindex="-1"><a class="header-anchor" href="#三、磁盘接口类型-五种"><span>三、磁盘接口类型（五种）</span></a></h2><table><thead><tr><th style="text-align:left;">接口类型</th><th style="text-align:left;">特点</th><th style="text-align:left;">适用场景</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>SATA</strong></td><td style="text-align:left;">主流家用接口，6Gbps速率</td><td style="text-align:left;">台式机、笔记本硬盘</td></tr><tr><td style="text-align:left;"><strong>M.2 NVMe</strong></td><td style="text-align:left;">PCIe通道，速度极快</td><td style="text-align:left;">高性能SSD</td></tr><tr><td style="text-align:left;"><strong>mSATA</strong></td><td style="text-align:left;">迷你版SATA</td><td style="text-align:left;">超薄设备</td></tr><tr><td style="text-align:left;"><strong>SAS</strong></td><td style="text-align:left;">服务器专用，稳定性高</td><td style="text-align:left;">企业级存储</td></tr><tr><td style="text-align:left;"><strong>PCIe</strong></td><td style="text-align:left;">直接连接PCIe总线</td><td style="text-align:left;">高性能存储卡</td></tr></tbody></table><h2 id="四、磁盘分区表类型对比" tabindex="-1"><a class="header-anchor" href="#四、磁盘分区表类型对比"><span>四、磁盘分区表类型对比</span></a></h2><table><thead><tr><th style="text-align:left;">特性</th><th style="text-align:left;">MBR</th><th style="text-align:left;">GPT</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>最大容量</strong></td><td style="text-align:left;">2TB</td><td style="text-align:left;">理论无限</td></tr><tr><td style="text-align:left;"><strong>分区数量</strong></td><td style="text-align:left;">4个主分区（或3主+1扩）</td><td style="text-align:left;">128个主分区</td></tr><tr><td style="text-align:left;"><strong>分区表大小</strong></td><td style="text-align:left;">固定</td><td style="text-align:left;">动态可调</td></tr><tr><td style="text-align:left;"><strong>兼容性</strong></td><td style="text-align:left;">所有系统支持</td><td style="text-align:left;">较新系统和UEFI</td></tr><tr><td style="text-align:left;"><strong>管理命令</strong></td><td style="text-align:left;">fdisk</td><td style="text-align:left;">gdisk</td></tr><tr><td style="text-align:left;"><strong>引导方式</strong></td><td style="text-align:left;">BIOS</td><td style="text-align:left;">UEFI</td></tr></tbody></table><h2 id="五、系统分区类型" tabindex="-1"><a class="header-anchor" href="#五、系统分区类型"><span>五、系统分区类型</span></a></h2><table><thead><tr><th style="text-align:left;">分区类型</th><th style="text-align:left;">特点</th><th style="text-align:left;">用途</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>主分区</strong></td><td style="text-align:left;">直接存储数据，系统启动必需</td><td style="text-align:left;">安装操作系统、/boot分区</td></tr><tr><td style="text-align:left;"><strong>扩展分区</strong></td><td style="text-align:left;">不能直接使用，需再划分</td><td style="text-align:left;">容器，用于创建逻辑分区</td></tr><tr><td style="text-align:left;"><strong>逻辑分区</strong></td><td style="text-align:left;">在扩展分区内创建</td><td style="text-align:left;">数据存储（/home、/var等）</td></tr></tbody></table><p><strong>MBR分区编号规则</strong>：</p><ul><li>sda1-sda4：主分区或扩展分区</li><li>sda5+：逻辑分区</li></ul><h2 id="六、linux分区命名规则" tabindex="-1"><a class="header-anchor" href="#六、linux分区命名规则"><span>六、Linux分区命名规则</span></a></h2><h3 id="_1-按硬盘类型命名" tabindex="-1"><a class="header-anchor" href="#_1-按硬盘类型命名"><span>1. 按硬盘类型命名</span></a></h3><ul><li><strong>IDE接口</strong>：<code>/dev/hda</code>, <code>/dev/hdb</code></li><li><strong>SCSI/SATA/SAS</strong>：<code>/dev/sda</code>, <code>/dev/sdb</code></li><li><strong>NVMe</strong>：<code>/dev/nvme0n1</code>, <code>/dev/nvme0n2</code></li><li><strong>虚拟磁盘</strong>：<code>/dev/vda</code>, <code>/dev/vdb</code></li></ul><h3 id="_2-按分区编号" tabindex="-1"><a class="header-anchor" href="#_2-按分区编号"><span>2. 按分区编号</span></a></h3><ul><li>主分区：1-4（如<code>sda1</code>, <code>sda2</code>）</li><li>逻辑分区：5+（如<code>sda5</code>, <code>sda6</code>）</li></ul><h2 id="七、分区含义解释" tabindex="-1"><a class="header-anchor" href="#七、分区含义解释"><span>七、分区含义解释</span></a></h2><p><strong>MBR分区表下</strong>：</p><ul><li><code>/dev/sda1</code>：第一块硬盘的第一个主分区</li><li><code>/dev/sdb2</code>：第二块硬盘的第二个主分区</li><li><code>/dev/sdc6</code>：第三块硬盘的第二个逻辑分区</li></ul><p><strong>编号规则</strong>：</p><ul><li>1,2,3,4：主分区或扩展分区</li><li>5,6,7...：逻辑分区</li></ul><h2 id="八、分区方案实践" tabindex="-1"><a class="header-anchor" href="#八、分区方案实践"><span>八、分区方案实践</span></a></h2><h3 id="方案1-四个主分区" tabindex="-1"><a class="header-anchor" href="#方案1-四个主分区"><span>方案1：四个主分区</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 查看磁盘</span></span>
<span class="line">lsblk</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 使用 fdisk 分区</span></span>
<span class="line"><span class="token function">fdisk</span> /dev/sdc</span>
<span class="line"><span class="token comment"># 依次创建 4 个主分区，每个 2G</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 查看结果</span></span>
<span class="line">lsblk /dev/sdc</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果：sdc1、sdc2、sdc3、sdc4各2G</p><h3 id="方案2-三主一扩" tabindex="-1"><a class="header-anchor" href="#方案2-三主一扩"><span>方案2：三主一扩</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">fdisk /dev/sdc</span>
<span class="line"># 创建3个主分区各1G</span>
<span class="line"># 创建扩展分区（剩余容量）</span>
<span class="line"># 在扩展分区内创建逻辑分区（全部容量）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果：sdc1、sdc2、sdc3各1G，sdc4扩展分区，sdc5逻辑分区（剩余容量）</p><h3 id="方案3-两主两逻" tabindex="-1"><a class="header-anchor" href="#方案3-两主两逻"><span>方案3：两主两逻</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">fdisk /dev/sdc</span>
<span class="line"># 创建2个主分区各2G</span>
<span class="line"># 创建扩展分区（剩余容量）</span>
<span class="line"># 创建2个逻辑分区</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果：sdc1、sdc2各2G，sdc3扩展分区，sdc5、sdc6逻辑分区</p><h2 id="九、fdisk命令详解" tabindex="-1"><a class="header-anchor" href="#九、fdisk命令详解"><span>九、fdisk命令详解</span></a></h2><table><thead><tr><th style="text-align:left;">命令</th><th style="text-align:left;">含义</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><code>m</code></td><td style="text-align:left;">显示帮助菜单</td><td style="text-align:left;">列出所有可用命令</td></tr><tr><td style="text-align:left;"><code>n</code></td><td style="text-align:left;">新建分区</td><td style="text-align:left;">创建新分区</td></tr><tr><td style="text-align:left;"><code>d</code></td><td style="text-align:left;">删除分区</td><td style="text-align:left;">删除指定分区</td></tr><tr><td style="text-align:left;"><code>p</code></td><td style="text-align:left;">打印分区表</td><td style="text-align:left;">显示当前分区信息</td></tr><tr><td style="text-align:left;"><code>t</code></td><td style="text-align:left;">修改分区类型</td><td style="text-align:left;">更改分区ID</td></tr><tr><td style="text-align:left;"><code>w</code></td><td style="text-align:left;">保存并退出</td><td style="text-align:left;">写入分区表</td></tr><tr><td style="text-align:left;"><code>q</code></td><td style="text-align:left;">不保存退出</td><td style="text-align:left;">放弃修改</td></tr><tr><td style="text-align:left;"><code>a</code></td><td style="text-align:left;">切换启动标志</td><td style="text-align:left;">设置/取消启动分区</td></tr><tr><td style="text-align:left;"><code>l</code></td><td style="text-align:left;">列出分区类型</td><td style="text-align:left;">显示支持的分区ID</td></tr><tr><td style="text-align:left;"><code>v</code></td><td style="text-align:left;">验证分区表</td><td style="text-align:left;">检查分区表一致性</td></tr><tr><td style="text-align:left;"><code>u</code></td><td style="text-align:left;">切换单位</td><td style="text-align:left;">扇区/柱面显示切换</td></tr></tbody></table><h2 id="十、4tb硬盘分区方案" tabindex="-1"><a class="header-anchor" href="#十、4tb硬盘分区方案"><span>十、4TB硬盘分区方案</span></a></h2><p><strong>步骤</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 1. 使用gdisk创建GPT分区表</span>
<span class="line">gdisk /dev/sdc</span>
<span class="line"></span>
<span class="line"># 2. 创建分区</span>
<span class="line"># 在gdisk中按n创建新分区</span>
<span class="line"># 选择默认起始扇区</span>
<span class="line"># 输入+4T或直接回车使用全部空间</span>
<span class="line"></span>
<span class="line"># 3. 保存并退出</span>
<span class="line"># 按w写入</span>
<span class="line"></span>
<span class="line"># 4. 格式化为ext4</span>
<span class="line">mkfs.ext4 /dev/sdc1</span>
<span class="line"></span>
<span class="line"># 5. 查看结果</span>
<span class="line">lsblk /dev/sdc</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十一、重读分区表命令" tabindex="-1"><a class="header-anchor" href="#十一、重读分区表命令"><span>十一、重读分区表命令</span></a></h2><p><strong>方法1：partx</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看分区信息</span>
<span class="line">partx /dev/sdc</span>
<span class="line"></span>
<span class="line"># 添加所有新分区</span>
<span class="line">partx -a -v /dev/sdc</span>
<span class="line"></span>
<span class="line"># 显示详细信息</span>
<span class="line">partx --show /dev/sdc</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>方法2：partprobe</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 通知系统分区表变化</span>
<span class="line">partprobe /dev/sdc</span>
<span class="line"></span>
<span class="line"># 或通知所有设备</span>
<span class="line">partprobe</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>区别</strong>：</p><ul><li><code>partx</code>：更精细控制，可指定操作</li><li><code>partprobe</code>：更通用，自动处理</li></ul><h2 id="十二、分区表类型转换" tabindex="-1"><a class="header-anchor" href="#十二、分区表类型转换"><span>十二、分区表类型转换</span></a></h2><p><strong>使用parted命令</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 进入parted交互模式</span>
<span class="line">parted /dev/sdc</span>
<span class="line"></span>
<span class="line"># 查看当前类型</span>
<span class="line">print</span>
<span class="line"></span>
<span class="line"># MBR转GPT</span>
<span class="line">mktable gpt</span>
<span class="line"># 或</span>
<span class="line">mklabel gpt</span>
<span class="line"></span>
<span class="line"># GPT转MBR</span>
<span class="line">mktable msdos</span>
<span class="line"># 或</span>
<span class="line">mklabel msdos</span>
<span class="line"></span>
<span class="line"># 确认转换</span>
<span class="line">yes</span>
<span class="line"></span>
<span class="line"># 退出</span>
<span class="line">quit</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意</strong>：转换会清除所有分区数据！</p><h2 id="十三、查看分区表信息" tabindex="-1"><a class="header-anchor" href="#十三、查看分区表信息"><span>十三、查看分区表信息</span></a></h2><p><strong>方法对比</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 1. lsblk（推荐）</span>
<span class="line">lsblk /dev/sdb</span>
<span class="line">lsblk -f /dev/sdb  # 显示文件系统</span>
<span class="line"></span>
<span class="line"># 2. fdisk</span>
<span class="line">fdisk -l /dev/sdb</span>
<span class="line"># 或交互式查看</span>
<span class="line">fdisk /dev/sdb -&gt; p</span>
<span class="line"></span>
<span class="line"># 3. parted</span>
<span class="line">parted /dev/sdb print</span>
<span class="line"></span>
<span class="line"># 4. partx</span>
<span class="line">partx /dev/sdb</span>
<span class="line">partx -l /dev/sdb</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十四、主流文件系统对比" tabindex="-1"><a class="header-anchor" href="#十四、主流文件系统对比"><span>十四、主流文件系统对比</span></a></h2><table><thead><tr><th style="text-align:left;">系统</th><th style="text-align:left;">文件系统</th><th style="text-align:left;">特点</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>Windows</strong></td><td style="text-align:left;">NTFS</td><td style="text-align:left;">支持加密、压缩、权限控制，支持大文件</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">exFAT</td><td style="text-align:left;">跨平台（Win/Mac），适合闪存设备</td></tr><tr><td style="text-align:left;"><strong>Linux</strong></td><td style="text-align:left;">Ext4</td><td style="text-align:left;">稳定可靠，支持日志，CentOS 6默认</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">XFS</td><td style="text-align:left;">高性能，支持大容量，CentOS 7+默认</td></tr><tr><td style="text-align:left;"><strong>macOS</strong></td><td style="text-align:left;">APFS</td><td style="text-align:left;">Apple专用，优化闪存性能</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;">HFS+</td><td style="text-align:left;">旧版Mac系统使用</td></tr></tbody></table><p><strong>兼容性矩阵</strong>：</p><table><thead><tr><th style="text-align:left;">系统</th><th style="text-align:left;">NTFS</th><th style="text-align:left;">exFAT</th><th style="text-align:left;">Ext4</th><th style="text-align:left;">XFS</th><th style="text-align:left;">APFS</th></tr></thead><tbody><tr><td style="text-align:left;">Windows</td><td style="text-align:left;">✓</td><td style="text-align:left;">✓</td><td style="text-align:left;">需软件</td><td style="text-align:left;">需软件</td><td style="text-align:left;">✗</td></tr><tr><td style="text-align:left;">Linux</td><td style="text-align:left;">✓</td><td style="text-align:left;">✓</td><td style="text-align:left;">✓</td><td style="text-align:left;">✓</td><td style="text-align:left;">需软件</td></tr><tr><td style="text-align:left;">macOS</td><td style="text-align:left;">只读</td><td style="text-align:left;">✓</td><td style="text-align:left;">需软件</td><td style="text-align:left;">需软件</td><td style="text-align:left;">✓</td></tr></tbody></table><h2 id="十五、硬盘防护要点" tabindex="-1"><a class="header-anchor" href="#十五、硬盘防护要点"><span>十五、硬盘防护要点</span></a></h2><p><strong>机械硬盘</strong>：</p><ol><li><strong>怕震动</strong>：运行时避免移动</li><li><strong>怕高温</strong>：保持良好散热</li><li><strong>怕灰尘</strong>：保持清洁环境</li><li><strong>怕突然断电</strong>：可能导致磁头损坏</li></ol><p><strong>固态硬盘</strong>：</p><ol><li><strong>怕突然断电</strong>：可能损坏正在写入的数据</li><li><strong>怕写入过量</strong>：有写入寿命限制</li><li><strong>怕高温</strong>：影响性能和寿命</li><li><strong>需要TRIM支持</strong>：保持性能</li></ol><h2 id="十六、设备表示含义" tabindex="-1"><a class="header-anchor" href="#十六、设备表示含义"><span>十六、设备表示含义</span></a></h2><p><strong>通用规则</strong>：</p><ul><li><code>/dev/sda</code>：第一块SATA/SCSI硬盘</li><li><code>/dev/sdb</code>：第二块SATA/SCSI硬盘</li><li><code>/dev/sdc</code>：第三块SATA/SCSI硬盘</li></ul><p><strong>MBR分区表</strong>：</p><ul><li><code>/dev/sda1</code>：第一个主分区</li><li><code>/dev/sda2</code>：第二个主分区</li><li><code>/dev/sda5</code>：第一个逻辑分区</li></ul><p><strong>GPT分区表</strong>：</p><ul><li><code>/dev/sda1</code>：第一个分区</li><li><code>/dev/sda2</code>：第二个分区</li><li>...最多128个</li></ul><h2 id="十七、综合分区实践" tabindex="-1"><a class="header-anchor" href="#十七、综合分区实践"><span>十七、综合分区实践</span></a></h2><h3 id="任务分解" tabindex="-1"><a class="header-anchor" href="#任务分解"><span>任务分解：</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 1. MBR分区：3主2逻</span>
<span class="line">fdisk /dev/sdc</span>
<span class="line"># 创建3个1G主分区</span>
<span class="line"># 创建扩展分区（剩余）</span>
<span class="line"># 创建2个逻辑分区（2G和剩余）</span>
<span class="line"></span>
<span class="line"># 2. 删除MBR，创建GPT</span>
<span class="line">parted /dev/sdc mktable gpt</span>
<span class="line">gdisk /dev/sdc</span>
<span class="line"># 创建3个分区</span>
<span class="line"></span>
<span class="line"># 3. 删除GPT，创建XFS</span>
<span class="line">parted /dev/sdc mktable msdos</span>
<span class="line">fdisk /dev/sdc</span>
<span class="line"># 创建2个分区</span>
<span class="line">mkfs.xfs /dev/sdc1</span>
<span class="line">mkfs.xfs /dev/sdc2</span>
<span class="line"></span>
<span class="line"># 4. 整盘格式化</span>
<span class="line">mkfs.xfs -f /dev/sdc</span>
<span class="line"></span>
<span class="line"># 5. 挂载到/data</span>
<span class="line">mount /dev/sdc /data</span>
<span class="line"></span>
<span class="line"># 6. 自动挂载配置</span>
<span class="line">blkid /dev/sdc  # 获取UUID</span>
<span class="line">echo &quot;UUID=$(blkid -s UUID -o value /dev/sdc) /data xfs defaults 0 0&quot; &gt;&gt; /etc/fstab</span>
<span class="line"></span>
<span class="line"># 验证</span>
<span class="line">mount -a</span>
<span class="line">df -h</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十八、mount挂载原理图解" tabindex="-1"><a class="header-anchor" href="#十八、mount挂载原理图解"><span>十八、mount挂载原理图解</span></a></h2><p><strong>挂载概念</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">物理磁盘 (/dev/sdb1)</span>
<span class="line">     ↓</span>
<span class="line">文件系统 (ext4/xfs)</span>
<span class="line">     ↓</span>
<span class="line">挂载点 (/data目录)</span>
<span class="line">     ↓</span>
<span class="line">用户访问 (/data/files)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>挂载效果</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">挂载前：</span>
<span class="line">/opt/今天天气不错.log  → 存储在/dev/sda</span>
<span class="line"></span>
<span class="line">挂载后：</span>
<span class="line">mount /dev/sdb1 /data</span>
<span class="line">/data/明天天气不知道咋样 → 存储在/dev/sdb1</span>
<span class="line"></span>
<span class="line">本质：将物理存储映射到目录树</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十九、gdisk命令详解" tabindex="-1"><a class="header-anchor" href="#十九、gdisk命令详解"><span>十九、gdisk命令详解</span></a></h2><table><thead><tr><th style="text-align:left;">命令</th><th style="text-align:left;">含义</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><code>b</code></td><td style="text-align:left;">备份GPT数据</td><td style="text-align:left;">备份分区表到文件</td></tr><tr><td style="text-align:left;"><code>c</code></td><td style="text-align:left;">更改分区名称</td><td style="text-align:left;">为分区设置标签</td></tr><tr><td style="text-align:left;"><code>d</code></td><td style="text-align:left;">删除分区</td><td style="text-align:left;">删除指定分区</td></tr><tr><td style="text-align:left;"><code>i</code></td><td style="text-align:left;">显示详细信息</td><td style="text-align:left;">显示分区详细信息</td></tr><tr><td style="text-align:left;"><code>l</code></td><td style="text-align:left;">列出分区类型</td><td style="text-align:left;">显示支持的类型代码</td></tr><tr><td style="text-align:left;"><code>n</code></td><td style="text-align:left;">新建分区</td><td style="text-align:left;">创建新分区</td></tr><tr><td style="text-align:left;"><code>o</code></td><td style="text-align:left;">创建空GPT</td><td style="text-align:left;">清空并创建新GPT</td></tr><tr><td style="text-align:left;"><code>p</code></td><td style="text-align:left;">打印分区表</td><td style="text-align:left;">显示当前分区信息</td></tr><tr><td style="text-align:left;"><code>q</code></td><td style="text-align:left;">退出不保存</td><td style="text-align:left;">放弃所有修改</td></tr><tr><td style="text-align:left;"><code>r</code></td><td style="text-align:left;">恢复选项</td><td style="text-align:left;">专家功能，数据恢复</td></tr><tr><td style="text-align:left;"><code>s</code></td><td style="text-align:left;">排序分区</td><td style="text-align:left;">按起始位置排序</td></tr><tr><td style="text-align:left;"><code>t</code></td><td style="text-align:left;">更改类型代码</td><td style="text-align:left;">修改分区类型</td></tr><tr><td style="text-align:left;"><code>v</code></td><td style="text-align:left;">验证磁盘</td><td style="text-align:left;">检查GPT完整性</td></tr><tr><td style="text-align:left;"><code>w</code></td><td style="text-align:left;">保存并退出</td><td style="text-align:left;">写入分区表</td></tr><tr><td style="text-align:left;"><code>x</code></td><td style="text-align:left;">专家功能</td><td style="text-align:left;">高级选项</td></tr><tr><td style="text-align:left;"><code>?</code></td><td style="text-align:left;">显示帮助</td><td style="text-align:left;">显示命令列表</td></tr></tbody></table><h2 id="二十、整盘格式化技巧" tabindex="-1"><a class="header-anchor" href="#二十、整盘格式化技巧"><span>二十、整盘格式化技巧</span></a></h2><p><strong>直接格式化整盘</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 不分区，直接格式化整块磁盘</span>
<span class="line">mkfs.xfs -f /dev/sdc</span>
<span class="line"></span>
<span class="line"># 查看结果</span>
<span class="line">blkid /dev/sdc</span>
<span class="line"></span>
<span class="line"># 直接挂载使用</span>
<span class="line">mount /dev/sdc /data</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>优势</strong>：</p><ul><li>简化管理</li><li>避免分区表开销</li><li>适合单一用途磁盘</li></ul><h2 id="二十一、查看uuid方法" tabindex="-1"><a class="header-anchor" href="#二十一、查看uuid方法"><span>二十一、查看UUID方法</span></a></h2><p><strong>blkid命令详解</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看所有设备UUID</span>
<span class="line">blkid</span>
<span class="line"></span>
<span class="line"># 查看指定设备</span>
<span class="line">blkid /dev/sdc1</span>
<span class="line"></span>
<span class="line"># 仅显示UUID</span>
<span class="line">blkid -s UUID /dev/sdc1</span>
<span class="line">blkid -s UUID -o value /dev/sdc1</span>
<span class="line"></span>
<span class="line"># 查看文件系统类型</span>
<span class="line">blkid -s TYPE /dev/sdc1</span>
<span class="line"></span>
<span class="line"># 查看所有信息</span>
<span class="line">blkid -p /dev/sdc1</span>
<span class="line"></span>
<span class="line"># 示例输出：</span>
<span class="line"># /dev/sdc1: UUID=&quot;7a813e49-937b-4900-96b8-434915f39b19&quot; TYPE=&quot;xfs&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二十二、umount-busy问题解决" tabindex="-1"><a class="header-anchor" href="#二十二、umount-busy问题解决"><span>二十二、umount busy问题解决</span></a></h2><p><strong>情况分析</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 报错示例</span>
<span class="line">umount /data</span>
<span class="line"># umount: /data: target is busy.</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>解决方案</strong>：</p><h3 id="方法1-离开挂载目录" tabindex="-1"><a class="header-anchor" href="#方法1-离开挂载目录"><span>方法1：离开挂载目录</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">cd /  # 离开/data目录</span>
<span class="line">umount /data</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方法2-查找占用进程" tabindex="-1"><a class="header-anchor" href="#方法2-查找占用进程"><span>方法2：查找占用进程</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 使用lsof查找</span>
<span class="line">lsof /data</span>
<span class="line">lsof | grep /data</span>
<span class="line"></span>
<span class="line"># 或使用fuser</span>
<span class="line">fuser -m /data</span>
<span class="line">fuser -vm /data</span>
<span class="line"></span>
<span class="line"># 杀死占用进程</span>
<span class="line">fuser -km /data  # 强制终止</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方法3-延迟卸载" tabindex="-1"><a class="header-anchor" href="#方法3-延迟卸载"><span>方法3：延迟卸载</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">umount -l /data  # lazy卸载</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="方法4-检查子挂载" tabindex="-1"><a class="header-anchor" href="#方法4-检查子挂载"><span>方法4：检查子挂载</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看是否有嵌套挂载</span>
<span class="line">mount | grep /data</span>
<span class="line"></span>
<span class="line"># 先卸载子挂载</span>
<span class="line">umount /data/subdir</span>
<span class="line">umount /data</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>排查流程</strong>：</p><ol><li>检查是否在当前目录</li><li>查找占用进程</li><li>检查嵌套挂载</li><li>考虑延迟卸载</li></ol><h2 id="二十三、磁盘使用率查看" tabindex="-1"><a class="header-anchor" href="#二十三、磁盘使用率查看"><span>二十三、磁盘使用率查看</span></a></h2><p><strong>df命令详解</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 基本查看</span>
<span class="line">df</span>
<span class="line"></span>
<span class="line"># 友好单位显示</span>
<span class="line">df -h</span>
<span class="line"></span>
<span class="line"># 显示文件系统类型</span>
<span class="line">df -Th</span>
<span class="line"></span>
<span class="line"># 仅显示指定文件系统</span>
<span class="line">df -h -t xfs</span>
<span class="line">df -h -t ext4</span>
<span class="line"></span>
<span class="line"># 排除特定类型</span>
<span class="line">df -h -x tmpfs</span>
<span class="line"></span>
<span class="line"># 显示inode使用情况</span>
<span class="line">df -i</span>
<span class="line">df -hi</span>
<span class="line"></span>
<span class="line"># 按使用率排序</span>
<span class="line">df -h | sort -k5 -rh</span>
<span class="line"></span>
<span class="line"># 常用组合</span>
<span class="line">df -hT --total  # 显示总计</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二十四、-etc-fstab配置详解" tabindex="-1"><a class="header-anchor" href="#二十四、-etc-fstab配置详解"><span>二十四、/etc/fstab配置详解</span></a></h2><p><strong>配置格式</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">&lt;设备标识&gt; &lt;挂载点&gt; &lt;文件系统&gt; &lt;挂载选项&gt; &lt;dump备份&gt; &lt;fsck检查&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>示例配置</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 方式1：设备名（不推荐）</span>
<span class="line">/dev/sdc /data xfs defaults 0 0</span>
<span class="line"></span>
<span class="line"># 方式2：UUID（推荐）</span>
<span class="line">UUID=7a813e49-937b-4900-96b8-434915f39b19 /data xfs defaults 0 0</span>
<span class="line"></span>
<span class="line"># 方式3：磁盘标签</span>
<span class="line">LABEL=DataDisk /data xfs defaults 0 0</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>参数说明</strong>：</p><ol><li><strong>设备标识</strong>：UUID、设备名、标签</li><li><strong>挂载点</strong>：必须存在的目录</li><li><strong>文件系统</strong>：ext4、xfs、nfs等</li><li><strong>挂载选项</strong>：defaults、noatime、nodiratime等</li><li><strong>dump备份</strong>：0=不备份，1=备份</li><li><strong>fsck检查</strong>：0=不检查，1=优先检查，2=次优检查</li></ol><p><strong>验证配置</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 测试fstab配置</span>
<span class="line">mount -a</span>
<span class="line"></span>
<span class="line"># 查看挂载</span>
<span class="line">df -hT</span>
<span class="line"></span>
<span class="line"># 检查fstab语法</span>
<span class="line">mount -fav</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二十五、生成大文件方法" tabindex="-1"><a class="header-anchor" href="#二十五、生成大文件方法"><span>二十五、生成大文件方法</span></a></h2><p><strong>dd命令使用</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 生成5G文件</span>
<span class="line">dd if=/dev/zero of=/opt/5G.txt bs=1M count=5120</span>
<span class="line"></span>
<span class="line"># 简化写法（5G=5*1024M）</span>
<span class="line">dd if=/dev/zero of=/opt/5G.txt bs=100M count=50</span>
<span class="line"></span>
<span class="line"># 显示进度</span>
<span class="line">dd if=/dev/zero of=/opt/5G.txt bs=1M count=5120 status=progress</span>
<span class="line"></span>
<span class="line"># 指定块大小优化</span>
<span class="line">dd if=/dev/zero of=/opt/5G.txt bs=4K count=1310720</span>
<span class="line"></span>
<span class="line"># 使用稀疏文件（快速创建）</span>
<span class="line">fallocate -l 5G /opt/5G.txt</span>
<span class="line">truncate -s 5G /opt/5G.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>参数说明</strong>：</p><ul><li><code>if</code>：输入文件（/dev/zero生成空字符）</li><li><code>of</code>：输出文件</li><li><code>bs</code>：块大小</li><li><code>count</code>：块数量</li><li><code>status=progress</code>：显示进度</li></ul><h2 id="二十六、linux特殊设备文件" tabindex="-1"><a class="header-anchor" href="#二十六、linux特殊设备文件"><span>二十六、Linux特殊设备文件</span></a></h2><table><thead><tr><th style="text-align:left;">设备文件</th><th style="text-align:left;">作用</th><th style="text-align:left;">示例</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>/dev/null</strong></td><td style="text-align:left;">数据黑洞</td><td style="text-align:left;"><code>command &gt; /dev/null 2&gt;&amp;1</code></td></tr><tr><td style="text-align:left;"><strong>/dev/zero</strong></td><td style="text-align:left;">零字符源</td><td style="text-align:left;"><code>dd if=/dev/zero of=file bs=1M count=100</code></td></tr><tr><td style="text-align:left;"><strong>/dev/random</strong></td><td style="text-align:left;">真随机数</td><td style="text-align:left;">用于密钥生成</td></tr><tr><td style="text-align:left;"><strong>/dev/urandom</strong></td><td style="text-align:left;">伪随机数</td><td style="text-align:left;">速度更快，足够安全</td></tr><tr><td style="text-align:left;"><strong>/dev/full</strong></td><td style="text-align:left;">总返回磁盘满错误</td><td style="text-align:left;">测试程序错误处理</td></tr></tbody></table><p><strong>安全应用</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 1. 安全擦除文件</span>
<span class="line">dd if=/dev/urandom of=file_to_wipe bs=1M</span>
<span class="line">shred -v file_to_wipe</span>
<span class="line"></span>
<span class="line"># 2. 生成随机密码</span>
<span class="line">tr -dc A-Za-z0-9 &lt;/dev/urandom | head -c 32</span>
<span class="line"></span>
<span class="line"># 3. 测试磁盘性能</span>
<span class="line">dd if=/dev/zero of=/tmp/test.img bs=1G count=1 oflag=dsync</span>
<span class="line"></span>
<span class="line"># 4. 静默运行程序</span>
<span class="line">./script.sh &gt; /dev/null 2&gt;&amp;1 &amp;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二十七、重要提示" tabindex="-1"><a class="header-anchor" href="#二十七、重要提示"><span>二十七、重要提示</span></a></h2><h3 id="工作实践建议" tabindex="-1"><a class="header-anchor" href="#工作实践建议"><span>工作实践建议：</span></a></h3><ol><li><strong>优先使用UUID</strong>：避免设备名变化导致挂载失败</li><li><strong>测试fstab配置</strong>：使用<code>mount -a</code>测试后再重启</li><li><strong>备份重要数据</strong>：分区操作前务必备份</li><li><strong>使用LVM</strong>：生产环境推荐使用LVM管理磁盘</li><li><strong>监控磁盘空间</strong>：设置告警，避免磁盘写满</li></ol><h3 id="故障处理流程" tabindex="-1"><a class="header-anchor" href="#故障处理流程"><span>故障处理流程：</span></a></h3><ol><li>磁盘空间不足 → 清理文件或扩容</li><li>挂载失败 → 检查fstab语法、UUID、文件系统</li><li>性能问题 → 优化挂载选项、考虑SSD</li><li>数据损坏 → 使用fsck检查修复</li></ol><h3 id="面试重点" tabindex="-1"><a class="header-anchor" href="#面试重点"><span>面试重点：</span></a></h3><ol><li>理解inode和block概念</li><li>掌握fdisk/gdisk分区操作</li><li>熟悉文件系统特点</li><li>理解挂载原理</li><li>掌握故障排查方法</li></ol>`,130)])])}const p=e(i,[["render",d]]),v=JSON.parse('{"path":"/02-Linux%E8%BF%9B%E9%98%B6/01-%E7%A3%81%E7%9B%98%E5%AD%98%E5%82%A8%E7%AE%A1%E7%90%86/%E4%BD%9C%E4%B8%9A%E8%AE%B2%E8%A7%A3.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"opsjjq","username":"opsjjq","email":"wangyp987@gmail.com","commits":1,"url":"https://github.com/opsjjq"}],"changelog":[{"hash":"ca8e661b7c6729c958583ed3d1a001b6de398273","time":1771558748000,"email":"wangyp987@gmail.com","author":"opsjjq","message":"222"}]},"filePathRelative":"02-Linux进阶/01-磁盘存储管理/作业讲解.md"}');export{p as comp,v as data};
