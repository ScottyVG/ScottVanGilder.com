---
title: "Kubernetes Monitoring and Observability with Prometheus"
excerpt: "A deep dive into setting up comprehensive monitoring and observability for Kubernetes clusters using Prometheus and Grafana."
date: "2024-01-05"
readTime: "15 min read"
tags: ["Kubernetes", "Monitoring", "Prometheus", "Observability"]
author: "Scott Van Gilder"
---

# Kubernetes Monitoring and Observability with Prometheus

Effective monitoring and observability are crucial for maintaining healthy Kubernetes clusters in production environments. This comprehensive guide will walk you through setting up a complete observability stack.

## The Observability Stack

### Core Components

A complete Kubernetes observability stack typically includes:

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **AlertManager**: Alert routing and management
- **Jaeger**: Distributed tracing
- **Fluentd/Fluent Bit**: Log aggregation

### The Three Pillars of Observability

1. **Metrics**: Numerical data about your system's performance
2. **Logs**: Detailed records of events and transactions
3. **Traces**: Request flow through distributed systems

## Setting Up Prometheus

### Installation with Helm

The easiest way to install Prometheus in Kubernetes is using the Helm chart:

```bash
# Add the Prometheus community Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install the kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values values.yaml
```

### Custom Values Configuration

Create a `values.yaml` file for customization:

```yaml
# values.yaml
prometheus:
  prometheusSpec:
    retention: 30d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp2
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 50Gi

grafana:
  adminPassword: "your-secure-password"
  persistence:
    enabled: true
    size: 10Gi
  
alertmanager:
  alertmanagerSpec:
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: gp2
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 10Gi
```

## Key Metrics to Monitor

### Cluster Level Metrics

Monitor these essential cluster-level metrics:

```promql
# Node CPU utilization
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Node memory utilization
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Node disk utilization
100 - ((node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes)

# Pod restart rate
increase(kube_pod_container_status_restarts_total[1h])
```

### Application Level Metrics

For application monitoring, implement these patterns:

```go
// Example Go application metrics
package main

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status_code"},
    )
    
    httpRequestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name: "http_request_duration_seconds",
            Help: "Duration of HTTP requests",
        },
        []string{"method", "endpoint"},
    )
)
```

## Alerting Strategy

### Critical Alerts

Set up alerts for critical issues that require immediate attention:

```yaml
# critical-alerts.yaml
groups:
- name: critical
  rules:
  - alert: NodeDown
    expr: up{job="node-exporter"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Node {{ $labels.instance }} is down"
      
  - alert: HighMemoryUsage
    expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High memory usage on {{ $labels.instance }}"
      
  - alert: PodCrashLooping
    expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Pod {{ $labels.pod }} is crash looping"
```

### Warning Alerts

Configure warning alerts for issues that need attention but aren't critical:

```yaml
groups:
- name: warnings
  rules:
  - alert: HighCPUUsage
    expr: 100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage on {{ $labels.instance }}"
      
  - alert: DiskSpaceLow
    expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 20
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Low disk space on {{ $labels.instance }}"
```

## Grafana Dashboards

### Essential Dashboards

Create these key dashboards for comprehensive monitoring:

#### 1. Cluster Overview Dashboard

```json
{
  "dashboard": {
    "title": "Kubernetes Cluster Overview",
    "panels": [
      {
        "title": "Cluster CPU Usage",
        "type": "stat",
        "targets": [
          {
            "expr": "100 - (avg(irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)"
          }
        ]
      },
      {
        "title": "Cluster Memory Usage",
        "type": "stat",
        "targets": [
          {
            "expr": "(1 - (sum(node_memory_MemAvailable_bytes) / sum(node_memory_MemTotal_bytes))) * 100"
          }
        ]
      }
    ]
  }
}
```

#### 2. Application Performance Dashboard

Focus on the four golden signals:

- **Latency**: How long it takes to service a request
- **Traffic**: How much demand is placed on your system
- **Errors**: The rate of requests that fail
- **Saturation**: How "full" your service is

## Best Practices

### 1. Start with Golden Signals

Focus on the most important metrics first:

```promql
# Latency (95th percentile response time)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Traffic (requests per second)
rate(http_requests_total[5m])

# Errors (error rate)
rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m])

# Saturation (CPU utilization)
rate(container_cpu_usage_seconds_total[5m])
```

### 2. Use Labels Wisely

Proper labeling is crucial for effective querying:

```yaml
# Good labeling strategy
labels:
  app: "web-server"
  version: "v1.2.3"
  environment: "production"
  team: "platform"
```

### 3. Set Appropriate Retention

Balance storage costs with data needs:

```yaml
prometheus:
  prometheusSpec:
    retention: 30d  # Keep 30 days of data
    retentionSize: 50GB  # Or limit by size
```

### 4. Regular Review and Optimization

- Review alert fatigue regularly
- Optimize slow queries
- Clean up unused metrics
- Update dashboards based on team feedback

## Advanced Monitoring Patterns

### Custom Metrics with ServiceMonitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-metrics
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics
```

### Multi-Cluster Monitoring

For monitoring multiple clusters:

```yaml
# Prometheus federation configuration
- job_name: 'federate'
  scrape_interval: 15s
  honor_labels: true
  metrics_path: '/federate'
  params:
    'match[]':
      - '{job=~"kubernetes-.*"}'
  static_configs:
    - targets:
      - 'prometheus-cluster-1:9090'
      - 'prometheus-cluster-2:9090'
```

## Troubleshooting Common Issues

### High Cardinality Metrics

Monitor and limit high cardinality metrics:

```promql
# Find high cardinality metrics
topk(10, count by (__name__)({__name__=~".+"}))
```

### Storage Issues

Monitor Prometheus storage:

```promql
# Prometheus storage usage
prometheus_tsdb_symbol_table_size_bytes / 1024 / 1024
```

## Conclusion

A well-designed monitoring and observability strategy is essential for operating Kubernetes clusters successfully. Start with the basics—the four golden signals and essential infrastructure metrics—then gradually add more sophisticated monitoring as your needs grow.

Remember that monitoring is not just about collecting data; it's about gaining actionable insights that help you maintain reliable, performant applications. Focus on metrics that matter to your users and business objectives.

The key to successful Kubernetes monitoring is finding the right balance between comprehensive coverage and manageable complexity. Start simple, iterate based on real-world needs, and always prioritize actionable alerts over noise.