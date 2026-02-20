# Kubernetes 网络与服务（Service）汇总

## 1. Kubernetes 网络基础

### 网络模型要求

Kubernetes 对网络有以下基本要求：

1. 所有 Pod 不经过 NAT 就能相互通信
2. 所有 Node 都能与所有 Pod 通信
3. Pod 看到的自己 IP 与其他 Pod 看到的相同

---

### Pod 网络特性

- **Pod IP 不稳定**：Pod 重建后 IP 会变化
- **同一 Pod 内容器共享网络**：通过 `localhost` 通信
- **跨节点 Pod 直连**：通过 CNI 网络插件实现

---

## 2. Service 概述

### 什么是 Service

Service 是 Kubernetes 中定义的一种抽象，它定义了一组 Pod 的逻辑集合和访问这些 Pod 的策略。

---

### Service 的作用

1. **服务发现**：为 Pod 提供稳定的访问入口
2. **负载均衡**：在多个 Pod 之间分发流量
3. **跨节点访问**：允许从集群外部访问应用

---

### Service 类型

| 类型 | 说明 |
| :--- | :--- |
| **ClusterIP** | 集群内部访问（默认） |
| **NodePort** | 通过节点端口访问 |
| **LoadBalancer** | 云厂商负载均衡器 |
| **ExternalName** | DNS 别名映射 |

---

## 3. ClusterIP Service

### 基本概念

ClusterIP 是默认的 Service 类型，提供一个集群内部的虚拟 IP（VIP），只能在集群内部访问。

---

### 创建 ClusterIP Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    app: nginx
  ports:
    - name: http
      targetPort: 80
      port: 80
      protocol: TCP
  type: ClusterIP
```

```bash
# 创建 Service
kubectl create -f svc-clusterip.yaml

# 查看 Service
kubectl get svc

# 查看 Service 详情
kubectl describe svc nginx

# 查看 Endpoints（后端 Pod）
kubectl get endpoints nginx
```

---

### 访问 ClusterIP Service

```bash
# 获取 Service IP
kubectl get svc nginx

# 在集群内访问
curl <cluster-ip>:80

# 在 Pod 内访问
kubectl run test-pod --image=busybox --rm -it -- sh
# 在 Pod 内执行：wget -O- nginx:80
```

---

## 4. NodePort Service

### 基本概念

NodePort 通过每个 Node 的 IP 和静态端口暴露服务，可以从集群外部访问。

---

### 创建 NodePort Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  selector:
    app: nginx
  ports:
    - name: http
      targetPort: 80
      port: 80
      nodePort: 30080  # 30000-32767 范围内
      protocol: TCP
  type: NodePort
```

```bash
# 创建 Service
kubectl create -f svc-nodeport.yaml

# 查看 Service
kubectl get svc

# 从外部访问
curl <node-ip>:30080
```

---

### NodePort 端口范围

默认端口范围：`30000-32767`

```bash
# 修改端口范围（在 kube-apiserver 配置中）
# --service-node-port-range=1-65535
```

---

## 5. LoadBalancer Service

### 基本概念

LoadBalancer 类型的 Service 会向云厂商（如 AWS、阿里云）申请一个外部负载均衡器，将流量转发到 NodePort。

---

### 创建 LoadBalancer Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-lb
spec:
  selector:
    app: nginx
  ports:
    - name: http
      targetPort: 80
      port: 80
      protocol: TCP
  type: LoadBalancer
```

```bash
# 创建 Service（需要云厂商支持）
kubectl create -f svc-loadbalancer.yaml

# 查看 Service
kubectl get svc

# 访问外部负载均衡器 IP
curl <external-ip>:80
```

---

## 6. ExternalName Service

### 基本概念

ExternalName 将 Service 映射到外部 DNS 名称，不创建代理或负载均衡器。

---

### 创建 ExternalName Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ExternalName
  externalName: my.database.example.com
```

```bash
# 创建 Service
kubectl create -f svc-externalname.yaml

# 查询 DNS
nslookup my-service.default.svc.cluster.local
# 返回：my.database.example.com
```

---

## 7. Service 与 Pod 的关系

### 标签选择器

Service 通过 `selector` 字段选择 Pod：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    app: nginx  # 选择带有 app=nginx 标签的 Pod
  ports:
    - port: 80
      targetPort: 80
```

---

### Endpoints

Service 自动维护后端 Pod 的 IP 列表：

```bash
# 查看 Endpoints
kubectl get endpoints nginx

# 查看 Endpoints 详情
kubectl describe endpoints nginx
```

---

### 无 Selector 的 Service

当 Service 没有 selector 时，需要手动创建 Endpoints：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-service
spec:
  ports:
    - port: 80
      targetPort: 80

---
apiVersion: v1
kind: Endpoints
metadata:
  name: external-service
subsets:
  - addresses:
      - ip: 10.0.0.100
    ports:
      - port: 80
```

---

## 8. Service 会话保持

### 会话亲和性

通过 `sessionAffinity` 配置会话保持：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-sticky
spec:
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800  # 3小时
```

---

### 会话保持类型

| 类型 | 说明 |
| :--- | :--- |
| **None** | 无会话保持（默认） |
| **ClientIP** | 基于客户端 IP 的会话保持 |

---

## 9. Service DNS

### CoreDNS

Kubernetes 集群默认运行 CoreDNS，为 Service 提供 DNS 解析。

---

### DNS 解析格式

```bash
# Service 完整域名格式
<service-name>.<namespace>.svc.cluster.local

# 示例
nginx.default.svc.cluster.local
```

---

### DNS 解析测试

```bash
# 在 Pod 内测试 DNS
kubectl run dns-test --image=busybox --rm -it -- sh

# 在 Pod 内执行
nslookup nginx
nslookup nginx.default
nslookup nginx.default.svc.cluster.local
```

---

## 10. Headless Service

### 基本概念

Headless Service 不分配 ClusterIP，而是直接返回 Pod IP 列表，用于需要直接访问 Pod 的场景。

---

### 创建 Headless Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-headless
spec:
  clusterIP: None  # 关键：设置为 None
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

```bash
# 创建 Service
kubectl create -f svc-headless.yaml

# 查看 Service（ClusterIP 为 None）
kubectl get svc

# DNS 解析返回所有 Pod IP
nslookup nginx-headless.default.svc.cluster.local
```

---

## 11. Service 与 Ingress

### Service vs Ingress

| 特性 | Service | Ingress |
| :--- | :--- | :--- |
| **作用层级** | L4（TCP/UDP） | L7（HTTP/HTTPS） |
| **路由规则** | 简单的端口映射 | 基于主机名、路径的路由 |
| **SSL/TLS** | 不支持 | 支持 |
| **适用场景** | 内部服务、数据库 | Web 应用、API |

---

### Ingress 示例

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
spec:
  rules:
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nginx
                port:
                  number: 80
```

---

## 12. Service 最佳实践

### 命名规范

- Service 名称：小写字母、数字、连字符
- 避免使用保留字：`kubernetes`、`kube-` 开头的名称

---

### 端口命名

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    app: nginx
  ports:
    - name: http    # 建议命名端口
      port: 80
      targetPort: 80
    - name: https
      port: 443
      targetPort: 443
```

---

### 资源限制

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
```

---

## 13. 常用命令汇总

```bash
# 创建 Service
kubectl create -f svc.yaml
kubectl expose deployment nginx --port=80 --target-port=80

# 查看 Service
kubectl get svc
kubectl get svc -o wide
kubectl describe svc <name>

# 查看 Endpoints
kubectl get endpoints
kubectl describe endpoints <name>

# 删除 Service
kubectl delete svc <name>
kubectl delete -f svc.yaml

# 编辑 Service
kubectl edit svc <name>

# 导出 Service 配置
kubectl get svc <name> -o yaml > svc-config.yaml
```

---

## 14. 故障排查

### Service 无法访问

```bash
# 1. 检查 Service 是否存在
kubectl get svc

# 2. 检查 Endpoints 是否有后端 Pod
kubectl get endpoints <svc-name>

# 3. 检查 Pod 是否正常运行
kubectl get pods -l <label-selector>

# 4. 检查 Pod 标签是否匹配
kubectl get pods --show-labels

# 5. 检查 Pod 是否就绪
kubectl describe pod <pod-name>

# 6. 在 Pod 内测试连接
kubectl run test-pod --image=busybox --rm -it -- sh
# 在 Pod 内执行：wget -O- <service-name>:<port>
```

---

### DNS 解析失败

```bash
# 1. 检查 CoreDNS Pod 是否运行
kubectl get pods -n kube-system -l k8s-app=kube-dns

# 2. 查看 CoreDNS 日志
kubectl logs -n kube-system -l k8s-app=kube-dns

# 3. 测试 DNS 解析
kubectl run dns-test --image=busybox --rm -it -- nslookup kubernetes.default
```

---

## 15. 总结

### Service 关键要点

1. **Service 提供稳定的访问入口**，解决 Pod IP 不稳定的问题
2. **ClusterIP** 用于集群内部访问
3. **NodePort** 用于外部访问
4. **LoadBalancer** 用于云厂商负载均衡
5. **Headless Service** 用于直接访问 Pod
6. **CoreDNS** 提供 Service 的 DNS 解析
7. **Ingress** 提供 L7 层的路由能力

---

### 选择 Service 类型

| 场景 | 推荐类型 |
| :--- | :--- |
| **集群内部服务** | ClusterIP |
| **外部访问应用** | NodePort 或 LoadBalancer |
| **有状态应用** | Headless Service |
| **Web 应用路由** | Ingress + Service |
| **外部服务映射** | ExternalName |
