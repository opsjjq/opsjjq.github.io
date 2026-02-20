# LVM 逻辑卷管理

---

## 一、为什么学习LVM

**Logical Volume Manager（逻辑卷管理器）** 是现代Linux系统中灵活管理存储的核心技术。

### 主要优势

#### 1. 灵活的存储管理

| 功能 | 说明 |
|:-----|:-----|
| 动态调整分区大小 | 无需停机即可在线扩容/缩容 |
| 方便存储分配 | 将物理存储整合为存储池，按需分配 |

#### 2. 提高存储利用率

| 功能 | 说明 |
|:-----|:-----|
| 磁盘空间整合 | 将多个小容量硬盘合并为大存储池 |
| 高效存储迁移 | 数据可在物理设备间平滑迁移 |

#### 3. 数据保护与容错

| 功能 | 说明 |
|:-----|:-----|
| 快照功能 | 创建时间点副本，便于备份和恢复 |
| 镜像功能（可选） | 数据冗余，提高可靠性 |

---

## 二、什么是LVM

LVM将多个物理存储设备抽象为一个逻辑上的大硬盘，实现存储空间的弹性管理。

### 两种创建方式

| 方式 | 说明 |
|:-----|:-----|
| **基于分区** | 将硬盘分区统一为卷组 |
| **基于硬盘** | 整块硬盘作为物理卷加入卷组 |

### LVM vs RAID

| 特性 | LVM | RAID |
|:-----|:-----|:-----|
| **目的** | 逻辑存储管理 | 物理数据冗余/性能 |
| **层级** | 软件/逻辑层 | 硬件/物理层 |
| **功能** | 弹性扩容、快照、迁移 | 数据保护、性能提升 |
| **兼容** | 可基于RAID创建 | 可作为LVM底层 |

**结构对比图：**

```text
LVM结构：                    RAID结构：
应用                         应用
↓                           ↓
文件系统                     文件系统
↓                           ↓
逻辑卷(LV)                    ↓
↓                           RAID阵列
卷组(VG)                     ↓
↓                           物理硬盘
物理卷(PV)                  (多块硬盘)
↓
物理硬盘/分区
```

---

## 三、LVM核心概念

### 1. 核心术语

| 术语 | 英文 | 说明 |
|:-----|:-----|:-----|
| **物理分区** | Physical Partition, PP | 物理硬盘上的实际分区 |
| **物理卷** | Physical Volume, PV | LVM的基础存储单元，对应一个PP |
| **物理区域** | Physical Extent, PE | PV的最小分配单元，默认4MB |
| **卷组** | Volume Group, VG | 由多个PV组成的存储池 |
| **逻辑扩展单元** | Logical Extent, LE | LV的基本组成单元，一个LE对应一个PE |
| **逻辑卷** | Logical Volume, LV | 从VG划分出的逻辑分区，可动态调整大小 |

### 2. 存储层级关系

```text
硬盘 → 分区(PP) → 物理卷(PV) → 卷组(VG) → 逻辑卷(LV) → 文件系统
```

### 3. LVM扩容原理

通过交换PE实现弹性调整：

| 操作 | 结果 |
|:-----|:-----|
| 添加PE | 扩容LV |
| 移除PE | 缩容LV |

**默认限制：**

| 参数 | 默认值 |
|:-----|:-------|
| PE大小 | 4MB（可配置） |
| 最大PE数 | 65534个 |
| 最大VG容量 | 256GB（4MB × 65534） |

### 4. LVM工作流程

```text
物理磁盘 → 创建物理卷pv → 创建卷组VG → 创建逻辑卷LV → 格式化文件系统 → 挂载使用
```

**详细步骤：**

| 步骤 | 操作 | 命令示例 |
|:-----|:-----|:---------|
| 1 | 物理分区 | `fdisk`创建分区，标记System ID为`8e`（LVM） |
| 2 | PV阶段 | `pvcreate`创建物理卷 |
| 3 | VG阶段 | `vgcreate`创建卷组 |
| 4 | LV阶段 | `lvcreate`创建逻辑卷 |
| 5 | 格式化 | `mkfs`创建文件系统 |
| 6 | 挂载 | `mount`使用逻辑卷 |

---

## 四、LVM命令汇总

| 操作 | PV命令 | VG命令 | LV命令 |
|:-----|:-------|:-------|:-------|
| 列出 | `pvs` | `vgs` | `lvs` |
| 详细显示 | `pvdisplay` | `vgdisplay` | `lvdisplay` |
| 创建 | `pvcreate` | `vgcreate` | `lvcreate` |
| 扩容 | - | `vgextend` | `lvextend` |
| 缩容 | - | `vgreduce` | `lvreduce` |
| 删除 | `pvremove` | `vgremove` | `lvremove` |
| 扫描 | `pvscan` | `vgscan` | `lvscan` |

---

## 五、物理卷（PV）管理

### 常用命令

```bash
# 创建PV
pvcreate /dev/sdb1

# 查看PV信息
pvs
pvscan
pvdisplay /dev/sdb1

# 删除PV
pvremove /dev/sdb1
```

### 实践示例

```bash
# 查看现有存储
pvs
lsblk

# 创建新PV
pvcreate /dev/sdb
pvs  # 验证
```

---

## 六、卷组（VG）管理

### 常用命令

```bash
# 创建VG
vgcreate vg0 /dev/sdb

# 查看VG信息
vgs
vgdisplay vg0

# 扩展VG（添加新PV）
vgextend vg0 /dev/sdc

# 删除VG
vgremove vg0
```

### 实践示例

```bash
# 创建VG
vgcreate vg0 /dev/sdb
vgs  # 验证

# 扩展VG
vgextend vg0 /dev/sdc
vgs  # 查看扩展后
```

---

## 七、逻辑卷（LV）管理

### 创建选项

```bash
# 指定大小
lvcreate -L 10G -n lv1 vg0

# 指定PE数量（每个PE默认4M）
lvcreate -l 100 -n lv2 vg0  # 100×4M=400M

# 使用百分比
lvcreate -l 50%VG -n lv3 vg0      # VG的50%
lvcreate -l 100%FREE -n lv4 vg0   # 全部剩余空间
```

### 管理命令

```bash
# 查看LV
lvs
lvdisplay /dev/vg0/lv1

# 扩展LV
lvextend -L +2G /dev/vg0/lv1

# 删除LV
lvremove /dev/vg0/lv1
```

---

## 八、LVM实战：创建2.5G逻辑卷

### 步骤

```bash
# 1. 准备物理设备（分区或整盘）
lsblk /dev/sdb

# 2. 安装LVM工具
yum install lvm2 -y  # CentOS/RHEL
apt install lvm2 -y  # Ubuntu/Debian

# 3. 创建物理卷
pvcreate /dev/sdb1 /dev/sdb2
pvs  # 验证

# 4. 创建卷组
vgcreate vg01 /dev/sdb1 /dev/sdb2
vgs vg01  # 验证

# 5. 创建逻辑卷（2.5G）
lvcreate -n lv01 -L 2.5G vg01
lvs  # 验证

# 6. 格式化
mkfs.xfs /dev/vg01/lv01  # CentOS 7+
# 或 mkfs.ext4 /dev/vg01/lv01

# 7. 挂载使用
mkdir /test-linux
mount /dev/vg01/lv01 /test-linux
df -hT | grep test
```

---

## 九、LVM动态扩容

### 扩容流程

```bash
# 1. 查看当前状态
df -hT | grep test
lvs /dev/vg01/lv01
vgs vg01

# 2. 如果VG空间不足，先扩展VG
# 2.1 准备新硬盘/分区
lsblk /dev/sdb

# 2.2 创建PV
pvcreate /dev/sdb5

# 2.3 扩展VG
vgextend vg01 /dev/sdb5
vgs vg01  # 验证

# 3. 扩展LV
lvextend -L +2G /dev/vg01/lv01

# 4. 更新文件系统
# 对于XFS：
xfs_growfs /dev/vg01/lv01

# 对于EXT4：
resize2fs /dev/vg01/lv01

# 5. 验证
df -hT | grep test
```

**重要提示：**

| 文件系统 | 扩容 | 缩容 |
|:---------|:-----|:-----|
| XFS | 支持 | 不支持 |
| EXT4 | 支持 | 支持 |

---

## 十、开机自动挂载

### 配置/etc/fstab

```bash
# 获取LV信息
blkid /dev/vg01/lv01

# 编辑fstab
vim /etc/fstab
# 添加：
/dev/mapper/vg01-lv01  /test-linux  xfs  defaults  0  0
# 或使用UUID：
UUID=xxxx-xxxx-xxxx  /test-linux  xfs  defaults  0  0

# 测试配置
mount -a
df -h
```

---

## 十一、LVM删除流程

```bash
# 1. 卸载文件系统
umount /test-linux

# 2. 删除逻辑卷
lvremove /dev/vg01/lv01
lvremove /dev/vg01/lv02
lvremove /dev/vg01/lv03

# 3. 删除卷组
vgremove vg01

# 4. 删除物理卷
pvremove /dev/sdb1 /dev/sdb2 /dev/sdb5

# 5. 验证清理
lvs
vgs
pvs
```

---

## 十二、实践案例记录

### 1. 创建PV和VG

```bash
pvcreate /dev/sdc /dev/sdd
vgcreate myvg1 /dev/sdc /dev/sdd
vgs  # 验证：5.99G总容量
```

### 2. 创建LV

```bash
lvcreate -L 4.5G -n mylv1 myvg1
lvcreate -L 1G -n mylv2 myvg1
lvs  # 验证
```

### 3. 格式化和挂载

```bash
mkfs.xfs /dev/myvg1/mylv1
mkdir /mnt/t3lvm
mount /dev/myvg1/mylv1 /mnt/t3lvm
df -hT  # 验证
```

### 4. VG扩容

```bash
# 添加新硬盘
pvcreate /dev/sde
vgextend myvg1 /dev/sde
vgs  # 验证：从6G扩容到7G
```

### 5. LV扩容

```bash
lvextend -l +100%free /dev/myvg1/mylv2
lvs  # 验证：从1G扩容到2.49G
```

---

## 十三、最佳实践建议

| 序号 | 建议 | 说明 |
|:-----|:-----|:-----|
| 1 | 规划先行 | 根据业务需求合理规划VG和LV大小 |
| 2 | 使用UUID | 在fstab中使用UUID而非设备名 |
| 3 | 保留空间 | VG中保留一定空间用于紧急扩容 |
| 4 | 定期监控 | 监控LV使用率，提前规划扩容 |
| 5 | 测试备份 | 重要操作前测试并备份数据 |
| 6 | 文档记录 | 记录LVM配置，便于维护 |

---

## 十四、故障处理

### 常见问题

| 问题 | 解决方案 |
|:-----|:---------|
| 挂载失败 | 检查fstab配置、文件系统类型 |
| 扩容失败 | 确认VG有足够空间 |
| 性能问题 | 考虑使用SSD或调整PE大小 |
| 数据损坏 | 使用快照备份恢复 |

### 诊断命令

```bash
# 查看LVM状态
pvs; vgs; lvs

# 查看详细信息
pvdisplay; vgdisplay; lvdisplay

# 查看物理设备
lsblk
fdisk -l

# 检查文件系统
xfs_repair /dev/vg01/lv01  # XFS
fsck /dev/vg01/lv01        # EXT4
```
