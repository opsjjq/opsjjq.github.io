## 一、Alertmanager概述

### 1.1 什么是Alertmanager？

Alertmanager是一个独立的告警管理模块，主要功能包括：

- 接收Prometheus等客户端发来的警报
- 通过分组、删除重复等处理
- 将警报路由发送给正确的接收器
- 支持多种告警方式（Email, Slack, Webhook等）

### 1.2 架构图说明

```
Prometheus (监控指标) → Alertmanager (告警管理) → 接收器 (邮件/钉钉/Slack等)
```

---

## 二、安装和配置Alertmanager

### 2.1 安装方式

```bash
# 下载二进制文件
wget https://github.com/prometheus/alertmanager/releases/download/v0.27.0/alertmanager-0.27.0.linux-amd64.tar.gz
tar xf alertmanager-0.27.0.linux-amd64.tar.gz
mkdir /alertmanager
mv alertmanager-0.27.0.linux-amd64/ /alertmanager
cd /alertmanager/
```

### 2.2 启动

```bash
/alertmanager/alertmanager --config.file=/alertmanager/alertmanager.yml &
后台运行启动Alertmanager，先选用最初的配置内容，然后通过ConfigMap来动态改变配置文件。
```

---

## 三、Kubernetes部署配置

### 3.1 ConfigMap配置

```yaml
# config.yml
apiVersion: v1
data:
  config.yml: |
    global: 
      # 当alertmanager持续多长时间未接收到告警后标记告警状态为 resolved
      resolve_timeout: 5m
      # 配置邮件发送信息
      smtp_smarthost: 'smtp.163.com:25'
      smtp_from: 'wangyp903@163.com'
      smtp_auth_username: 'wangyp903@163.com'
      smtp_auth_password: 'SUiDJwfZuSTLgUv4'
      smtp_require_tls: false
      
    # 所有报警信息进入后的根路由，用来设置报警的分发策略
    route:
      # 接收到的报警信息里面有许多alertname=NodeLoadHigh 这样的标签的报警信息将会批量被聚合到一个分组里面
      group_by: ['alertname']
      # 当一个新的报警分组被创建后，需要等待至少 group_wait 时间来初始化通知，如果在等待时间内当前group接收到了新的告警，这些告警将会合并为一个通知向receiver发送
      group_wait: 30s
      # 相同的group发送告警通知的时间间隔
      group_interval: 30s
      # 如果一个报警信息已经发送成功了，等待 repeat_interval 时间来重新发送
      repeat_interval: 1m
      # 默认的receiver：如果一个报警没有被一个route匹配，则发送给默认的接收器
      receiver: default

      # 上面所有的属性都由所有子路由继承，并且可以在每个子路由上进行覆盖。
      routes:
      - {}
    # 配置告警接收者的信息
    receivers:
    - name: 'default'
      email_configs:
      - to: '3341786550@qq.com'
        send_resolved: true  # 接受告警恢复的通知
kind: ConfigMap
metadata:
  name: alertmanager
  namespace: monitor
```

### 3.2 后端pod等资源配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alertmanager
  namespace: monitor
spec:
  selector:
    matchLabels:
      app: alertmanager
  template:
    metadata:
      labels:
        app: alertmanager
    spec:
      volumes:
      - name: config
        configMap:
          name: alertmanager
      containers:
      - name: alertmanager
        image: prom/alertmanager:v0.27.0
        args:
        - "--config.file=/etc/alertmanager/config.yml"
        - "--log.level=debug"
        ports:
        - containerPort: 9093
          name: http
        volumeMounts:
        - mountPath: "/etc/alertmanager"
          name: config
---
apiVersion: v1
kind: Service
metadata:
  name: alertmanager
  namespace: monitor
spec:
  type: ClusterIP
  ports:
    - port: 9093
  selector:
    app: alertmanager

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: alertmanager
  namespace: monitor
spec:
  ingressClassName: nginx
  rules:
  - host: alert.qwe.cn
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: alertmanager
            port:
              number: 9093
```

```bash
kubectl apply -f config.yaml# 或者 准备好config.yml文件 然后 kubectl -n monitor create configmap prometheus-config --from-file=config.yml
kubectl apply -f pod.yaml
```

---

## 四、配置Prometheus连接Alertmanager

### 4.1 修改Prometheus.yml

```yaml
# prometheus.yml
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  - /etc/prometheus/alert_rules.yml
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"
    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.
    static_configs:
      - targets: ["localhost:9090"]
        # The label name is added as a label `label_name=<label_value>` to any timeseries scraped from this config.
        labels:
          app: "prometheus"
```

### 4.2 配置文件更新技巧

```sh
# 从容器中导出配置文件
kubectl -n monitor get pods
kubectl -n monitor exec prometheus-6497d6f8bc-qp9tx -- cat /etc/prometheus/prometheus.yml
```

### 4.3创建告警规则

#### 告警规则示例

```yaml
# alert_rules.yml
groups:
- name: node_metrics
  rules:
  - alert: NodeLoad
    expr: node_load15 < 1  # 监控指标表达式 过去15分钟的平均负载
    for: 2m                # 持续时间
    annotations:
      summary: "Low node load detected on {{ $labels.instance }}"
      description: "Node load is below 1 (current value: {{ $value }})"
```

#### 告警规则要素说明

| 要素          | 说明         | 示例                 |
| :------------ | :----------- | :------------------- |
| `alert`       | 告警名称     | NodeLoad             |
| `expr`        | PromQL表达式 | node_load15 > 1      |
| `for`         | 持续时间     | 2m                   |
| `labels`      | 自定义标签   | severity: warning    |
| `annotations` | 告警描述信息 | summary, description |

#### 告警状态说明

- **Inactive**: 未触发告警条件
- **Pending**: 触发条件但未达到持续时间
- **Firing**: 触发条件且达到持续时间，正在发送告警

### 4.4更新ConfigMap

```bash
kubectl -n monitor delete configmaps prometheus-config
kubectl -n monitor create configmap prometheus-config --from-file=/kube/prometheus/config/prometheus.yml --from-file=/kube/prometheus/config/alert_rules.yml

curl -X POST 10.1.218.72:9090/-/reload
kubectl -n monitor exec  prometheus-6497d6f8bc-qp9tx -- ls /etc/prometheus/
# alert_rules.yml
# prometheus.yml
```

### 4.4重载普罗米修斯

```bash
kubectl -n monitor get svc prometheus
curl -X POST 10.1.218.72:9090/-/reload
```

![image-20260130221810585](./assets/image-20260130221810585.png)

```bash
设置了node_load15 < 1则报警
# 过去15分钟内系统平均负载小于1
```

![image-20260130222131221](./assets/image-20260130222131221.png)

---

## 五、钉钉告警集成

### 5.1 钉钉机器人创建

1. 在钉钉群中添加自定义机器人
2. 获取Webhook地址：`https://oapi.dingtalk.com/robot/send?access_token=your_token`
3. alertmanager系统配置的webhook发送的JSON格式，是和钉钉API的字段不符的，没法直接用

### 5.2 部署prometheus-webhook-dingtalk

prometheus-webhook-dingtalk

一个第三方的告警通知插件，用于将 Prometheus 的告警信息发送到钉钉群组。

#### 5.2.1 ConfigMap配置

```bash
mkdir /alertmanager/ding && cd /alertmanager/ding
vim configmap.yml
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: webhook-dingtalk-config
  namespace: monitor
data:
  config.yml: |
    targets:
      webhook_ops:
        url: https://oapi.dingtalk.com/robot/send?access_token=427d011ae8fa314518c7796538a89480d7155884566a923451068774f651ae93
        secret: "SEC2b36fe35b72d9287ab93c52ce46e05a344be04dc0b8fbcee36003a88035a8e97"
```

```bash
kubectl apply -f configmap.yml
```

#### 5.2.2 后端pod等资源配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webhook-dingtalk
  namespace: monitor
spec:
  selector:
    matchLabels:
      app: webhook-dingtalk
  template:
    metadata:
      labels:
        app: webhook-dingtalk
    spec:
      containers:
      - name: webhook-dingtalk
        image: timonwong/prometheus-webhook-dingtalk:master
        args:
        - "--config.file=/etc/prometheus-webhook-dingtalk/config.yml"
        imagePullPolicy: IfNotPresent
        volumeMounts:
        - mountPath: "/etc/prometheus-webhook-dingtalk/config.yml"
          name: config
          subPath: config.yml
        ports:
        - containerPort: 8060
          name: http
        resources:
          requests:
            cpu: 50m
            memory: 100Mi
          limits:
            cpu: 50m
            memory: 100Mi
      volumes:
      - name: config
        configMap:
          name: webhook-dingtalk-config
          items:
          - key: config.yml
            path: config.yml
---
apiVersion: v1
kind: Service
metadata:
  name: webhook-dingtalk
  namespace: monitor
spec:
  selector:
    app: webhook-dingtalk
  ports:
    - name: hook
      port: 8060
      targetPort: http
```

```bash
vim webhook.yaml
kubectl apply -f webhook.yaml
kubectl -n monitor get po
[root@k8s-master-10 /alertmanager/ding]#kubectl -n monitor logs webhook-dingtalk-7dbfb87c85-4qxw8 
level=info ts=2026-01-30T14:42:20.318Z caller=main.go:60 msg="Starting prometheus-webhook-dingtalk" version="(version=2.0.0, branch=master, revision=4e77a3cc3e7a23fcb18b33826bce8d2904583465)"
level=info ts=2026-01-30T14:42:20.318Z caller=main.go:61 msg="Build context" (gogo1.16.7,userroot@337ecc9a2774,date20210819-13:17:15)=(MISSING)
level=info ts=2026-01-30T14:42:20.318Z caller=coordinator.go:83 component=configuration file=/etc/prometheus-webhook-dingtalk/config.yml msg="Loading configuration file"
level=info ts=2026-01-30T14:42:20.318Z caller=coordinator.go:91 component=configuration file=/etc/prometheus-webhook-dingtalk/config.yml msg="Completed loading of configuration file"
level=info ts=2026-01-30T14:42:20.318Z caller=main.go:98 component=configuration msg="Loading templates" templates=
ts=2026-01-30T14:42:20.319Z caller=main.go:114 component=configuration msg="Webhook urls for prometheus alertmanager" urls=http://localhost:8060/dingtalk/webhook_ops/send
level=info ts=2026-01-30T14:42:20.319Z caller=web.go:210 component=web msg="Start listening for connections" address=:8060
```

根据日志可以看出，prometheus-webhook-dingtalk已经成功启动，并且已经加载了配置文件`/etc/prometheus-webhook-dingtalk/config.yml`，同时也加载了模板。

另外，也可以看到它监听的端口是`8060`，可以通过地址`http://localhost:8060/dingtalk/webhook_ops/send`来接收来自Alertmanager的告警信息。

### 5.3 配置Alertmanager Webhook接收器

```yaml
receivers:
- name: 'default'
  webhook_configs:
  - send_resolved: true
    url: http://webhook-dingtalk:8060/dingtalk/webhook_ops/send
```

```bash
kubectl -n monitor exec alertmanager-8d4585fbd-vjbh5 -- cat /etc/alertmanager/config.yml > config.yml
# 添加 webhook_configs到对应位置
vim config.yml

kubectl -n monitor delete cm alertmanager
kubectl -n monitor create configmap alertmanager --from-file=config.yml

curl -X POST 10.1.218.72:9090/-/reload
```

### 日志

```bash
kubectl -n monitor logs alertmanager-7679b9b9d-pfmpv

ts=2026-01-31T07:19:21.494Z caller=dispatch.go:516 level=debug component=dispatcher aggrGroup="{}:{alertname=\"NodeLoad\"}" msg=flushing alerts="[NodeLoad[a3a4121][active] NodeLoad[7b22ce9][active] NodeLoad[634288c][active]]"
ts=2026-01-31T07:19:51.496Z caller=dispatch.go:516 level=debug component=dispatcher aggrGroup="{}:{alertname=\"NodeLoad\"}" msg=flushing alerts="[NodeLoad[a3a4121][active] NodeLoad[7b22ce9][active] NodeLoad[634288c][active]]"
ts=2026-01-31T07:20:21.479Z caller=dispatch.go:164 level=debug component=dispatcher msg="Received alert" alert=NodeLoad[a3a4121][active]
ts=2026-01-31T07:20:21.479Z caller=dispatch.go:164 level=debug component=dispatcher msg="Received alert" alert=NodeLoad[7b22ce9][active]
ts=2026-01-31T07:20:21.479Z caller=dispatch.go:164 level=debug component=dispatcher msg="Received alert" alert=NodeLoad[634288c][active]
ts=2026-01-31T07:20:21.496Z caller=dispatch.go:516 level=debug component=dispatcher aggrGroup="{}:{alertname=\"NodeLoad\"}" msg=flushing alerts="[NodeLoad[a3a4121][active] NodeLoad[7b22ce9][active] NodeLoad[634288c][active]]"
ts=2026-01-31T07:20:21.664Z caller=notify.go:860 level=debug component=dispatcher receiver=default integration=webhook[0] aggrGroup="{}:{alertname=\"NodeLoad\"}" alerts="[NodeLoad[a3a4121][active] NodeLoad[7b22ce9][active] NodeLoad[634288c][active]]" msg="Notify success" attempts=1 duration=168.075551ms
ts=2026-01-31T07:20:22.015Z caller=notify.go:860 level=debug component=dispatcher receiver=default integration=email[0] aggrGroup="{}:{alertname=\"NodeLoad\"}" alerts="[NodeLoad[a3a4121][active] NodeLoad[7b22ce9][active] NodeLoad[634288c][active]]" msg="Notify success" attempts=1 duration=518.473158ms
```

![image-20260131152442582](./assets/image-20260131152442582.png)

### 测试钉钉

```bash
# kubectl -n monitor exec -it curl-test -- sh
curl -X POST http://webhook-dingtalk.monitor.svc.cluster.local:8060/dingtalk/webhook_ops/send \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "firing",
    "alerts": [
      {
        "status": "firing",
        "labels": {
          "alertname": "NodeLoad",
          "instance": "k8s-node-11",
          "severity": "warning"
        },
        "annotations": {
          "summary": "test",
          "description": "test"
        },
        "startsAt": "2026-01-30T17:00:00Z"
      }
    ]
  }'
```

![image-20260131152550752](./assets/image-20260131152550752.png)

---

## 调整报警条件

```bash
kubectl -n monitor edit cm prometheus-config

groups:
    - name: node_metrics
      rules:
      - alert: NodeLoad
        expr: node_load15 > 1  # 监控指标表达式
        for: 2m                # 持续时间
        annotations:
          summary: "high node load detected on {{ $labels.instance }}"
          description: "Node load is above 1 (current value: {{ $value }})"

curl -X POST 10.1.218.72:9090/-/reload
```

![image-20260131163051314](./assets/image-20260131163051314.png)
