# Kubernetes Pod 资源汇总

## 1. Pod 是什么

Pod 是 Kubernetes 中最小的**调度与运行单元**，属于资源对象。它是一组共享命名空间（网络、IPC 等）的容器集合，是 Kubernetes 进行资源调度的最小单位。

---

## 2. 创建 Pod

### 组件创建 Pod 流程

1. 客户端准备 Pod 的 YAML 声明式配置文件
2. kubectl 通过 HTTP 向 kube-apiserver 发送创建 Pod 请求
3. kube-apiserver 对请求进行认证、授权和准入控制
4. kube-apiserver 将 Pod 对象写入 etcd（状态为 Pending，`spec.nodeName` 为空）
5. kube-scheduler 通过 watch API Server，发现未调度的 Pod
6. kube-scheduler 通过 API Server 获取集群中 Pod/Node 等资源信息，完成调度决策
7. kube-scheduler 向 API Server 提交更新请求，为 Pod 写入 `spec.nodeName`
8. kube-apiserver 将更新后的 Pod 信息写入 etcd，完成 Pod 与 Node 的绑定
9. 目标 Node 上的 kubelet 通过 watch API Server，发现属于自己的 Pod
10. kubelet 调用容器运行时（CRI）创建 Pause 容器和业务容器，并持续上报 Pod 状态

---

### YAML 创建 Pod

```yaml
# pod-multi-container.yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
  namespace: default
  labels:
    app: web-app
    tier: frontend
spec:
  containers:
    - name: nginx-container
      image: nginx:alpine
      ports:
        - containerPort: 80
    - name: mysql-container
      image: mysql:5.7
      env:
        - name: MYSQL_ROOT_PASSWORD
          value: "123456"
        - name: MYSQL_DATABASE
          value: "appdb"
      ports:
        - containerPort: 3306
```

```bash
# 创建 Pod
kubectl create -f pod-multi-container.yaml

# 查看 Pod 信息与标签
kubectl get pods -o wide --show-labels

# 修改标签
kubectl label pods multi-container-pod app=nginx-mysql --overwrite
```

---

### 删除 Pod

```bash
# 通过 YAML 文件删除
kubectl delete -f pod-multi-container.yaml

# 直接删除 Pod
kubectl delete pods multi-container-pod

# 按标签删除 Pod
kubectl delete pods -l app=web-app
```

---

## 3. Pod 资源状态管理

Pod 生命周期中的常见状态：

| 状态 | 含义 |
| :--- | :--- |
| **Pending** | 已调度，正在拉取镜像或创建容器 |
| **Running** | 所有容器正常运行 |
| **Succeeded** | 所有容器成功退出（Job 类任务） |
| **Failed** | 至少一个容器异常退出 |
| **CrashLoopBackOff** | 容器反复崩溃重启 |

```bash
# 查看 Pod 状态
kubectl get pods -o wide
kubectl get pods -o wide --show-labels

# 查看 Pod 详情与事件
kubectl describe pod <pod-name>

# 查看容器日志
kubectl logs <pod-name> [-c <container-name>]

# 实时监测 Pod 变化
kubectl get pods -w
```

---

## 4. Pod 详情信息查看

```bash
kubectl describe pods <pod-name>
```

输出包含：

- **基本信息**：名称、命名空间、标签、节点等
- **容器状态**：运行状态、重启次数、镜像等
- **事件（Events）**：从创建到当前的完整事件记录
- **资源限制**：CPU、内存的 requests 与 limits
- **网络信息**：IP 地址、端口映射等

---

## 5. Pod 环境变量

环境变量用于向容器传递配置信息。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mysql-with-env
  labels:
    app: mysql
spec:
  containers:
    - name: mysql
      image: mysql:5.7
      env:
        - name: MYSQL_ROOT_PASSWORD
          value: "123456"
        - name: MYSQL_DATABASE
          value: "appdb"
        - name: APP_ENV
          value: "production"
```

---

### 查看 Pod 内环境变量

```bash
# 1. 创建 Pod
kubectl create -f mysql-pod.yaml

# 2. 进入容器查看环境变量
kubectl exec mysql-with-env -- env | grep MYSQL

# 3. 通过 describe 查看环境变量配置
kubectl describe pods mysql-with-env

# 4. 导出为 YAML 查看
kubectl get pods mysql-with-env -o yaml | grep -A5 env:
```

---

## 6. 容器启动命令

通过 `command` 字段覆盖容器默认的启动命令。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-once
spec:
  restartPolicy: Never  # 执行一次后不重启
  containers:
    - name: busybox
      image: busybox
      command:
        - sh
        - -c
        - "echo '容器启动时间:' && date && hostname"
```

```bash
# 创建并查看日志
kubectl create -f busybox-pod.yaml
kubectl logs busybox-once

# 查看 Pod 状态（应为 Completed）
kubectl get pods busybox-once
```

---

## 7. Pod 网络与存储卷（Volumes）

### 网络特性

- 同一个 Pod 内的所有容器共享网络命名空间
- 通过 `pause` 容器（沙盒）提供共享的网络栈
- 容器间可通过 `localhost` 直接通信

---

### 存储卷示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: shared-volume-pod
spec:
  nodeName: k8s-node-12
  volumes:
    - name: nginx-log-volume
      hostPath:
        path: /nginx-logs  # 宿主机目录
        type: DirectoryOrCreate

  containers:
    - name: nginx
      image: nginx:alpine
      volumeMounts:
        - name: nginx-log-volume
          mountPath: /var/log/nginx  # 容器内挂载路径

    - name: log-watcher
      image: busybox
      args: [/bin/sh, -c, 'tail -f /shared-logs/access.log']
      volumeMounts:
        - name: nginx-log-volume
          mountPath: /shared-logs  # 同一卷在不同容器中的挂载点
```

---

### 存储卷类型对比

| 类型 | 说明 | 持久性 |
| :--- | :--- | :--- |
| **hostPath** | 映射到宿主机目录 | Pod 删除后数据保留 |
| **emptyDir** | 临时空目录 | Pod 删除后数据丢失 |
| **configMap** | 配置信息卷 | 与 ConfigMap 生命周期一致 |
| **secret** | 敏感信息卷 | 与 Secret 生命周期一致 |

```bash
# 查看字段定义
kubectl explain pod.spec.volumes
kubectl explain pod.spec.volumes.hostPath
```

---

## 8. 多容器 Pod 实践

### 场景：Flask + Redis 应用

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: flask-redis-app
spec:
  nodeName: k8s-node-11
  containers:
    - name: redis
      image: redis:alpine
      ports:
        - containerPort: 6379

    - name: flask-app
      image: my-flask-redis:latest
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 5000
      command: ["python3", "/opt/flask-redis.py"]
```

---

访问测试：

```bash
# 获取 Pod IP
kubectl get pods flask-redis-app -o wide

# 访问 Flask 应用
curl <pod-ip>:5000
# 输出：k8s运行flask程序, 站点访问次数 1 次
```

---

## 9. Pod 生命周期状态

| 状态 | 含义 |
| :--- | :--- |
| **Pending** | API Server 已创建 Pod，等待调度 |
| **ContainerCreating** | 正在拉取镜像、创建容器 |
| **Running** | 至少一个容器处于运行状态 |
| **Succeeded** | 所有容器成功退出（不再重启） |
| **Failed** | 至少一个容器异常退出 |
| **CrashLoopBackOff** | 容器启动失败，正在重试 |
| **Unknown** | 无法获取 Pod 状态 |

---

## 10. 生命周期钩子

Kubernetes 提供容器生命周期钩子，在特定阶段执行操作。

### postStart（启动后处理）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-poststart
spec:
  containers:
    - name: nginx
      image: nginx:alpine
      lifecycle:
        postStart:
          exec:
            command: ["/bin/sh", "-c", "echo '初始化完成' > /usr/share/nginx/html/status.txt"]
```

---

### preStop（停止前处理）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-prestop
spec:
  volumes:
    - name: log-volume
      hostPath:
        path: /tmp/nginx-logs
  containers:
    - name: nginx
      image: nginx:alpine
      lifecycle:
        preStop:
          exec:
            command: ["/bin/sh", "-c", "echo 'Pod 即将终止' > /var/log/nginx/stop.log"]
      volumeMounts:
        - name: log-volume
          mountPath: /var/log/nginx
```

---

## 11. 初始化容器（Init Containers）

在应用容器启动前运行的专用容器，用于执行初始化任务。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-with-init
spec:
  volumes:
    - name: html-volume
      emptyDir: {}

  initContainers:
    - name: init-html
      image: busybox
      command: ["sh", "-c", "echo '欢迎页面' > /html/index.html"]
      volumeMounts:
        - name: html-volume
          mountPath: /html

  containers:
    - name: nginx
      image: nginx:alpine
      volumeMounts:
        - name: html-volume
          mountPath: /usr/share/nginx/html
```

**特点**：

- 按顺序执行，全部成功后主容器才启动
- 执行完成后变为 `Terminated` 状态，但容器实体保留
- Pod 删除时才彻底清理 init 容器

---

## 12. 健康探针

### 存活探针（livenessProbe）

检测容器是否正常运行，失败则重启容器。

**探测方式**：

1. **httpGet**：发送 HTTP GET 请求
2. **tcpSocket**：尝试建立 TCP 连接
3. **exec**：执行容器内命令

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-liveness
spec:
  containers:
    - name: nginx
      image: nginx:alpine
      livenessProbe:
        httpGet:
          path: /healthz
          port: 80
        initialDelaySeconds: 5  # 容器启动后5秒开始探测
        periodSeconds: 10       # 每10秒探测一次
        timeoutSeconds: 2       # 2秒内无响应视为失败
        failureThreshold: 3     # 连续失败3次重启容器
```

---

### 就绪探针（readinessProbe）

检测容器是否准备好接收流量，失败则从 Service 端点移除。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-readiness
spec:
  containers:
    - name: nginx
      image: nginx:alpine
      readinessProbe:
        httpGet:
          path: /ready
          port: 80
        initialDelaySeconds: 10
        periodSeconds: 5
        successThreshold: 1
        failureThreshold: 2
```

---

## 13. 资源限制

通过 `resources` 字段限制容器的 CPU 和内存使用。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: limited-pod
spec:
  containers:
    - name: nginx
      image: nginx:alpine
      resources:
        requests:  # 节点必须满足的最小资源
          memory: "64Mi"
          cpu: "250m"  # 0.25核
        limits:    # 容器最大可使用资源
          memory: "128Mi"
          cpu: "500m"  # 0.5核
```

**单位说明**：

- CPU：`1000m` = 1核，`250m` = 0.25核
- 内存：`Mi` = 兆字节，`Gi` = 千兆字节

---

## 14. 最佳实践

### Pod 设计原则

1. **单一职责**：一个 Pod 应只包含紧密耦合的容器
   - 适合放一起：Nginx + PHP-FPM，Flask + Redis（Sidecar 模式）
   - 应分开：应用容器 + 数据库容器
2. **明确探针**：所有生产 Pod 都应配置 livenessProbe 和 readinessProbe
3. **资源限制**：为每个容器设置合理的 requests 和 limits
4. **使用标签**：通过标签组织和管理 Pod
5. **考虑持久化**：重要数据使用持久化存储卷

---

### 调试技巧

```bash
# 查看 Pod 完整状态
kubectl describe pod <name>

# 查看容器日志
kubectl logs <pod> [-c <container>]

# 进入容器调试
kubectl exec -it <pod> -- sh

# 查看资源使用情况
kubectl top pods
kubectl top pods --containers

# 导出 Pod 配置
kubectl get pod <name> -o yaml > pod-config.yaml
```
