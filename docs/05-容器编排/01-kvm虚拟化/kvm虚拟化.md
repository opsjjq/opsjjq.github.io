# KVM虚拟化技术全解

---

## 一、虚拟化历史与背景

### 1.1 虚拟化的演进过程

| 阶段 | 特征 | 问题 |
|:-----|:-----|:-----|
| 单机时代 | 单一物理服务器运行CentOS系统，部署多个LNMP集群 | 端口、进程、文件系统路径冲突，管理复杂 |
| 虚拟机解决方案 | 通过虚拟化技术创建隔离的运行环境 | 业务增长导致虚拟机数量激增，服务器负载压力增大 |

### 1.2 企业级虚拟化对比

| 方案 | 组件 | 说明 |
|:-----|:-----|:-----|
| **VMware vSphere** | ESXi + vCenter | 企业级商业虚拟化解决方案 |
| **开源替代** | KVM + OpenStack | Linux内核原生虚拟化模块 |

```text
虚拟化关系图谱：
VMware vSphere → ESXi + vCenter
开源替代 → KVM + OpenStack
```

---

## 二、KVM虚拟化基础

### 2.1 虚拟化类型

| 类型 | 特征 | 性能 |
|:-----|:-----|:-----|
| **完全虚拟化** | 客户机无需修改系统 | 兼容性好但性能较低 |
| **半虚拟化** | 客户机需修改系统内核 | 性能较高 |
| **硬件辅助虚拟化** | 利用Intel VT-x/AMD-V技术 | 性能最佳 |

### 2.2 虚拟化优势

| 优势 | 说明 |
|:-----|:-----|
| 资源隔离 | CPU、内存、存储、网络资源完全隔离 |
| 环境隔离 | 不同应用运行在独立环境，互不干扰 |
| 快速部署 | 模板化部署，快速创建和复制虚拟机 |
| 灵活迁移 | 支持虚拟机在不同物理主机间迁移 |
| 高可用性 | 故障时自动迁移到其他主机，保障业务连续性 |

---

## 三、KVM部署实践

### 3.1 环境准备

```bash
# 检查CPU是否支持虚拟化
grep -E '(vmx|svm)' /proc/cpuinfo

# 安装KVM及相关管理工具
yum install libvirt virt-install qemu-kvm -y
# 或安装所有相关包
yum install libvirt* virt-* qemu-kvm* -y

# 启动并启用libvirtd服务
systemctl start libvirtd.service
systemctl enable libvirtd.service
```

### 3.2 VNC远程连接配置

| 特点 | 说明 |
|:-----|:-----|
| VNC提供 | 图形化远程访问能力 |
| SSH无法连接时 | VNC仍可访问虚拟机控制台 |
| 推荐工具 | TightVNC Client |

### 3.3 创建第一个虚拟机

```bash
virt-install --virt-type kvm --os-type=linux --os-variant rhel7 \
  --name kvm_centos7 --memory 2048,maxmemory=4096 \
  --vcpus 2,maxvcpus=8 --disk /data/kvm_centos7.raw,format=raw,size=10 \
  --cdrom /data/CentOS-7-x86_64-DVD-1804.iso --network network=default \
  --graphics vnc,listen=0.0.0.0 --noautoconsole
```

**创建虚拟机命令详解：**

| 参数 | 说明 |
|:-----|:-----|
| `--virt-type kvm` | 虚拟化类型 |
| `--os-type=linux` | 操作系统类型 |
| `--os-variant rhel7` | 系统变体 |
| `--name kvm_centos7` | 虚拟机名称 |
| `--memory 2048,maxmemory=4096` | 内存配置 |
| `--vcpus 2,maxvcpus=8` | CPU配置 |
| `--disk /data/kvm_centos7.raw,format=raw,size=10` | 磁盘配置 |
| `--cdrom /data/CentOS-7-x86_64-DVD-1804.iso` | 安装镜像 |
| `--network network=default` | 网络配置 |
| `--graphics vnc,listen=0.0.0.0` | VNC配置 |

**稀疏文件解释：**

稀疏文件创建时只分配实际写入数据的空间，而非立即分配全部空间，节省磁盘空间，随数据写入动态扩展。

### 3.4 虚拟机管理基础命令

```bash
# 查看运行中的虚拟机
virsh list

# 查看所有虚拟机（包括关闭的）
virsh list --all

# 启动虚拟机
virsh start kvm_centos7

# 正常关闭虚拟机
virsh shutdown kvm_centos7

# 强制关闭虚拟机
virsh destroy kvm_centos7

# 重启虚拟机
virsh reboot kvm_centos7

# 查看VNC端口
virsh vncdisplay kvm_centos7

# 查看虚拟机IP地址
virsh domifaddr kvm_centos7

# 查看网络列表
virsh net-list

# 查看DHCP租约
virsh net-dhcp-leases default

# 设置虚拟机开机自启
virsh autostart kvm_centos7

# 虚拟机重命名
virsh domrename centos7 web-7
```

---

## 四、VNC安装与使用

### 安装步骤

| 步骤 | 操作 |
|:-----|:-----|
| 1 | 下载TightVNC客户端 |
| 2 | 打开TightVNC Viewer |
| 3 | Host输入：`10.0.0.13:5900` |
| 4 | 按提示完成安装配置 |

**下载链接：**

```
https://www.tightvnc.com/download/2.8.85/tightvnc-2.8.85-gpl-setup-64bit.msi
```

**注意事项：**

VNC界面安装系统后，可能无法正常重启，需返回宿主机使用`virsh start kvm_centos7`启动。

---

## 五、KVM高级管理

### 5.1 虚拟机配置管理

```bash
# 导出虚拟机配置
virsh dumpxml kvm_centos7 > /data/config.xml

# 从配置文件恢复虚拟机
virsh define /data/config.xml

# 设置开机自启
virsh autostart kvm_centos7

# 取消开机自启
virsh autostart --disable kvm_centos7
```

### 5.2 磁盘管理

```bash
# 创建新磁盘
qemu-img create -f qcow2 /data/newdisk.qcow2 20G

# 调整磁盘大小
qemu-img resize /data/disk.qcow2 +5G

# 磁盘格式转换
qemu-img convert -f raw -O qcow2 input.raw output.qcow2
```

### 5.3 快照管理

```bash
# 创建快照
virsh snapshot-create-as kvm_centos7 <快照名>

# 查看快照列表
virsh snapshot-list kvm_centos7

# 恢复快照
virsh snapshot-revert kvm_centos7 <快照名>

# 删除快照
virsh snapshot-delete kvm_centos7 <快照名>
```

### 5.4 虚拟机克隆

```bash
# 克隆虚拟机（需要先关机）
virt-clone \
  --original <源虚拟机> \
  --name <新虚拟机名> \
  --file /data/<新磁盘文件>
```

### 5.5 磁盘管理实战

#### 1. 克隆虚拟机

```bash
# 源虚拟机必须处于关闭或暂停状态
virt-clone --auto-clone -o kvm_centos7 -n kvm2
```

#### 2. 转换磁盘格式（raw ↔ qcow2）

```bash
# raw转qcow2
qemu-img convert -f raw -O qcow2 /data/kvm2.raw /data/kvm2.qcow2

# 查看磁盘配置
virsh dumpxml kvm2 | grep -A5 "source file"

# 修改虚拟机配置使用qcow2磁盘
virsh edit kvm2
```

**配置文件修改：**

```xml
<!-- 原配置（raw格式） -->
<disk type='file' device='disk'>
  <driver name='qemu' type='raw'/>
  <source file='/data/kvm2.raw'/>
  <!-- ... -->
</disk>

<!-- 修改后（qcow2格式） -->
<disk type='file' device='disk'>
  <driver name='qemu' type='qcow2'/>
  <source file='/data/kvm2.qcow2'/>
  <!-- ... -->
</disk>
```

#### 3. 扩容虚拟机磁盘

```bash
# 创建新磁盘
qemu-img create -f qcow2 add01.qcow2 1G

# 热添加磁盘（无需关机）
virsh attach-disk kvm2 /data/add01.qcow2 vdb --live --cache=none --subdriver=qcow2
```

### 5.6 迁移虚拟机磁盘文件

```bash
# 1. 关闭虚拟机
virsh shutdown centos7

# 2. 编辑虚拟机配置
virsh edit centos7
# 修改磁盘路径：/data/kvm_centos7.raw → /new_data/www.yuchaoit.cn.raw

# 3. 移动磁盘文件
mv /data/kvm_centos7.raw /new_data/

# 4. 启动虚拟机
virsh start centos7
```

---

## 六、网络配置

### 6.1 桥接网络配置

```bash
# 创建桥接网络配置文件
cat > /etc/sysconfig/network-scripts/ifcfg-br0 << EOF
DEVICE=br0
TYPE=Bridge
ONBOOT=yes
BOOTPROTO=static
IPADDR=10.0.0.150
NETMASK=255.255.255.0
GATEWAY=10.0.0.254
DNS1=8.8.8.8
EOF

# 修改物理网卡配置
cat > /etc/sysconfig/network-scripts/ifcfg-ens33 << EOF
DEVICE=ens33
ONBOOT=yes
BRIDGE=br0
EOF

# 重启网络服务
systemctl restart network
```

### 6.2 虚拟机使用桥接网络

```bash
# 创建时指定桥接网络
--network bridge=br0

# 修改现有虚拟机网络配置
virsh edit kvm_centos7
# 将 <source network='default'/> 改为 <source bridge='br0'/>
```

### 6.3 快速创建桥接网络

```bash
# 一键创建桥接
virsh iface-bridge eth0 bro0

# 虚拟机内部配置静态IP
# 编辑 /etc/sysconfig/network-scripts/ifcfg-eth0
BOOTPROTO="static"
IPADDR="10.0.0.140"
NETMASK=255.255.255.0
GATEWAY="10.0.0.254"
DNS1="223.5.5.5"
```

---

## 七、热添加技术

### 7.1 热添加磁盘

```bash
# 创建新磁盘
qemu-img create -f qcow2 /data/newdisk.qcow2 10G

# 热添加磁盘到运行中的虚拟机
virsh attach-disk kvm_centos7 /data/newdisk.qcow2 vdb --live --subdriver qcow2
```

### 7.2 热添加网卡

```bash
# 临时添加网卡
virsh attach-interface kvm_centos7 --type bridge --model virtio --source bro0

# 永久生效配置
virsh attach-interface kvm_centos7 --type bridge --model virtio --source bro0 --config
```

**虚拟机内部配置：**

```bash
# 查看新网卡
ip link show

# 创建网卡配置文件
cat > /etc/sysconfig/network-scripts/ifcfg-eth1 << EOF
TYPE="Ethernet"
NAME="eth1"
DEVICE="eth1"
ONBOOT="yes"
BOOTPROTO="static"
IPADDR="10.0.0.141"
NETMASK="255.255.255.0"
GATEWAY="10.0.0.254"
DNS1="223.5.5.5"
EOF

# 激活网卡
ifup eth1
```

### 7.3 热添加CPU

```bash
# 前提：创建时指定最大CPU数
--vcpus 2,maxvcpus=8

# 热添加CPU
virsh setvcpus kvm_centos7 --count 4 --live

# 永久生效
virsh setvcpus kvm_centos7 --count 4 --config

# 限制：不能超过maxvcpus，不能减少只能增加
```

### 7.4 热添加内存

```bash
# 前提：创建时指定最大内存
--memory 2048,maxmemory=8192

# 热添加内存
virsh setmem kvm_centos7 4G --live

# 永久生效
virsh setmem kvm_centos7 4G --config

# 查看内存状态
virsh dommemstat kvm_centos7
```

### 7.5 CPU拓扑调整

```bash
# 查看CPU绑定状态
virsh vcpupin kvm_centos7

# 设置CPU绑定
virsh vcpupin kvm_centos7 0 2  # vCPU0绑定到物理CPU2
virsh vcpupin kvm_centos7 1 3  # vCPU1绑定到物理CPU3
```

---

## 八、最佳实践与注意事项

### 8.1 性能优化建议

| 优化项 | 建议 |
|:-------|:-----|
| 磁盘格式选择 | raw格式性能最佳，qcow2格式支持快照和压缩 |
| CPU绑定 | 将关键虚拟机vCPU绑定到特定物理CPU，减少上下文切换 |
| 内存管理 | 合理设置内存气球，动态调整内存分配 |

### 8.2 故障处理

| 问题 | 解决方案 |
|:-----|:---------|
| VNC无法连接 | 检查防火墙规则，验证libvirtd服务状态，查看VNC监听地址配置 |
| 虚拟机无法启动 | 检查磁盘文件权限，验证虚拟机配置XML格式，查看系统日志 |
| 网络问题 | 确保桥接网络配置正确，验证宿主机和虚拟机路由设置 |

### 8.3 安全建议

| 建议 | 说明 |
|:-----|:-----|
| 网络隔离 | 生产环境使用独立虚拟网络 |
| 权限控制 | 限制非管理员用户访问virsh命令 |
| 定期备份 | 备份虚拟机配置和重要磁盘文件 |
| 更新维护 | 定期更新KVM、qemu和libvirt组件 |

---

**文档说明：**

- 本指南涵盖KVM虚拟化从基础到高级的完整操作流程
- 所有命令均在CentOS/RHEL 7环境下测试验证
- 实际部署时请根据具体环境调整IP地址、路径等参数
- 建议在测试环境验证后再应用于生产环境
