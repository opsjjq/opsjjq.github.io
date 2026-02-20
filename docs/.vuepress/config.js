import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: 'wyp运维技术博客',
  description: 'Linux运维、DevOps、容器编排等技术笔记',

  bundler: viteBundler({
    viteOptions: {
      server: {
        host: '0.0.0.0',
        allowedHosts: [
          'www.pu093.top',
          'pu093.top',
          'localhost',
          '127.0.0.1'
        ]
      }
    }
  }),

  theme: defaultTheme({
    navbar: [
      { text: '首页', link: '/' },
      {
        text: 'Linux 系统 & 中间件',
        children: [
          { text: 'Linux基础', link: '/01-Linux基础/' },
          { text: 'Linux进阶', link: '/02-Linux进阶/' },
          { text: '网络服务', link: '/03-网络服务/' },
          { text: 'Web架构', link: '/04-Web架构/' },
          { text: '中间件', link: '/09-中间件/' },
          { text: 'LNMP高可用', link: '/12-lnmp高可用负载均衡集群架构/' },
        ]
      },
      {
        text: '自动化运维 & 云原生',
        children: [
          { text: '容器编排', link: '/05-容器编排/' },
          { text: '自动化运维', link: '/06-自动化运维/' },
          { text: '监控体系', link: '/07-监控体系/' },
          { text: 'CI/CD', link: '/08-CI-CD/' },
          { text: 'ELK日志系统', link: '/11-ELK日志系统/' },
          { text: '堡垒机运维', link: '/10-堡垒机运维/' },
        ]
      },
    ],
    sidebarDepth: 0,
    lastUpdated: false,
    contributors: false,
    sidebar: {
      '/01-Linux基础/': [
        {
          text: 'Linux 基础',
          collapsible: true,
          children: [
            { text: '软件包管理与 yum', link: '/01-Linux基础/01-软件包管理/19_20软件包管理与yum.md' },
            { text: '用户与密码', link: '/01-Linux基础/02-用户与权限管理/用户与密码.md' },
            { text: '进程管理与资源监控', link: '/01-Linux基础/03-进程与资源监控/进程管理与资源监控.md' },
            { text: '服务管理', link: '/01-Linux基础/04-系统服务管理/服务管理.md' },
          ]
        }
      ],
      '/02-Linux进阶/': [
        {
          text: '磁盘存储管理',
          collapsible: true,
          children: [
            { text: '磁盘管理', link: '/02-Linux进阶/01-磁盘存储管理/磁盘管理.md' },
            { text: '作业讲解', link: '/02-Linux进阶/01-磁盘存储管理/作业讲解.md' },
          ]
        },
        {
          text: '逻辑卷管理 LVM',
          collapsible: true,
          children: [
            { text: 'LVM 逻辑卷', link: '/02-Linux进阶/02-逻辑卷管理LVM/lvm逻辑卷.md' },
          ]
        },
        {
          text: '文本处理工具',
          collapsible: true,
          children: [
            { text: '正则表达式', link: '/02-Linux进阶/03-文本处理工具/正则表达式.md' },
            { text: '正则练习', link: '/02-Linux进阶/03-文本处理工具/正则练习.md' },
            { text: 'sed 笔记', link: '/02-Linux进阶/03-文本处理工具/sed笔记.md' },
            { text: 'awk 笔记', link: '/02-Linux进阶/03-文本处理工具/awk笔记.md' },
            { text: '通配符', link: '/02-Linux进阶/03-文本处理工具/通配符.md' },
          ]
        },
        {
          text: '文件同步与存储',
          collapsible: true,
          children: [
            { text: '实时数据同步', link: '/02-Linux进阶/04-文件同步与存储/实时数据同步.md' },
            { text: '共享存储 NFS', link: '/02-Linux进阶/04-文件同步与存储/共享存储nfs.md' },
            { text: 'NFS 题目', link: '/02-Linux进阶/04-文件同步与存储/nfs题目.md' },
            { text: 'Rsync 大纲', link: '/02-Linux进阶/04-文件同步与存储/rsync大纲.md' },
            { text: 'Rsync 练习', link: '/02-Linux进阶/04-文件同步与存储/rsync练习.md' },
          ]
        }
      ],
      '/03-网络服务/': [
        {
          text: '网络服务',
          collapsible: true,
          children: [
            { text: 'Iptables 防火墙', link: '/03-网络服务/01-防火墙与安全/iptables.md' },
            { text: 'SSH 远程管理', link: '/03-网络服务/02-ssh远程管理/SSH.md' },
            { text: '文件共享服务', link: '/03-网络服务/03-文件共享服务/文件共享服务.md' },
          ]
        }
      ],
      '/04-Web架构/': [
        { text: '网站架构基础', link: '/04-Web架构/00-网站架构基础/网站架构.md' },
        {
          text: 'LAMP 架构',
          collapsible: true,
          children: [
            { text: 'LAMP 编译安装', link: '/04-Web架构/01-lamp架构/lamp编译安装.md' },
            { text: 'LAMP 架构与阿里云', link: '/04-Web架构/01-lamp架构/lamp架构与阿里云.md' },
          ]
        },
        {
          text: 'Nginx 服务器',
          collapsible: true,
          children: [
            { text: 'Nginx 入门与安装', link: '/04-Web架构/02-nginx/nginx入门与安装.md' },
            { text: 'Nginx 基础功能', link: '/04-Web架构/02-nginx/nginx功能.md' },
            { text: 'Nginx 进阶功能', link: '/04-Web架构/02-nginx/nginx功能篇二.md' },
            { text: 'Nginx 虚拟主机实战', link: '/04-Web架构/02-nginx/nginx虚拟主机综合实战.md' },
            { text: 'Nginx 高级 Rewrite', link: '/04-Web架构/02-nginx/nginx高级rewrite.md' },
          ]
        },
        {
          text: 'LNMP 架构',
          collapsible: true,
          children: [
            { text: '黄金架构 LNMP', link: '/04-Web架构/03-lnmp架构/51_黄金架构LNMP.md' },
            { text: 'LNMP 集群拆分', link: '/04-Web架构/03-lnmp架构/52_LNMP集群拆分.md' },
          ]
        },
        {
          text: '负载均衡与高可用',
          collapsible: true,
          children: [
            { text: '负载均衡基础', link: '/04-Web架构/04-负载均衡/53负载均衡.md' },
            { text: '策略与参数', link: '/04-Web架构/04-负载均衡/54负载均衡策略与参数.md' },
            { text: 'WordPress 负载均衡', link: '/04-Web架构/04-负载均衡/55_wordpress负载均衡部署.md' },
            { text: 'Keepalived 高可用', link: '/04-Web架构/05-高可用集群/57keepalived.md' },
          ]
        },
        {
          text: 'Web 协议与优化',
          collapsible: true,
          children: [
            { text: 'Web 基础协议', link: '/04-Web架构/06-web基础协议/web基础协议.md' },
            { text: 'HTTPS 安全加密', link: '/04-Web架构/07-https/56https.md' },
            { text: 'CDN 内容分发', link: '/04-Web架构/08-cdn/cdn.md' },
          ]
        }
      ],
      '/05-容器编排/': [
        { text: 'KVM 虚拟化', link: '/05-容器编排/01-kvm虚拟化/kvm虚拟化.md' },
        {
          text: 'Docker 容器',
          collapsible: true,
          children: [
            { text: 'Docker 入门', link: '/05-容器编排/02-docker容器/1-docker入门.md' },
            { text: 'Docker 部署', link: '/05-容器编排/02-docker容器/2-docker部署.md' },
            { text: 'Docker 构建镜像', link: '/05-容器编排/02-docker容器/3-docker构建镜像.md' },
            { text: '容器仓库 Harbor', link: '/05-容器编排/02-docker容器/4-容器仓库harbor.md' },
            { text: 'Docker 网络', link: '/05-容器编排/02-docker容器/5-docker网络.md' },
            { text: 'Docker Compose 实践', link: '/05-容器编排/02-docker容器/6-docker-compose使用与实践.md' },
          ]
        },
        {
          text: 'Kubernetes 编排',
          collapsible: true,
          children: [
            { text: 'K8s 入门', link: '/05-容器编排/03-kubernetes编排/1-k8s入门.md' },
            { text: 'K8s 安装', link: '/05-容器编排/03-kubernetes编排/2-k8s安装.md' },
            { text: 'K8s 资源-Pod', link: '/05-容器编排/03-kubernetes编排/3-k8s资源-pod.md' },
            { text: 'K8s 控制器', link: '/05-容器编排/03-kubernetes编排/4-k8s控制器.md' },
            { text: 'K8s 网络 Service', link: '/05-容器编排/03-kubernetes编排/5-k8s网络service.md' },
            { text: 'K8s 存储', link: '/05-容器编排/03-kubernetes编排/6-k8s存储.md' },
            { text: 'K8s 配置文件', link: '/05-容器编排/03-kubernetes编排/7-k8s配置文件.md' },
          ]
        }
      ],
      '/06-自动化运维/': [
        {
          text: 'Shell 脚本编程',
          collapsible: true,
          children: [
            { text: 'Shell 基础-变量', link: '/06-自动化运维/01-shell脚本编程/shell基础-变量.md' },
            { text: 'Shell 条件判断', link: '/06-自动化运维/01-shell脚本编程/shell条件判断.md' },
            { text: 'Shell 循环语句', link: '/06-自动化运维/01-shell脚本编程/shell循环语句.md' },
            { text: 'Shell 数组', link: '/06-自动化运维/01-shell脚本编程/shell数组.md' },
            { text: 'Shell 函数', link: '/06-自动化运维/01-shell脚本编程/shell函数.md' },
          ]
        },
        {
          text: 'Ansible 自动化',
          collapsible: true,
          children: [
            { text: 'Ansible 基础', link: '/06-自动化运维/02-ansible自动化运维/ansible基础.md' },
            { text: '剧本编写', link: '/06-自动化运维/02-ansible自动化运维/剧本.md' },
            { text: '剧本进阶', link: '/06-自动化运维/02-ansible自动化运维/剧本进阶.md' },
            { text: 'Role 角色', link: '/06-自动化运维/02-ansible自动化运维/role角色.md' },
          ]
        }
      ],
      '/07-监控体系/': [
        {
          text: 'Zabbix 监控',
          collapsible: true,
          children: [
            { text: 'Zabbix 入门与部署', link: '/07-监控体系/01-zabbix监控/1-zabbix入门与部署.md' },
            { text: 'Zabbix 实践', link: '/07-监控体系/01-zabbix监控/2-zabbix实践.md' },
            { text: 'Zabbix 报警多媒介', link: '/07-监控体系/01-zabbix监控/3-zabbix报警多媒介.md' },
            { text: 'Zabbix 监控核心服务', link: '/07-监控体系/01-zabbix监控/4-zabbix监控核心服务.md' },
            { text: 'Zabbix 分布式架构', link: '/07-监控体系/01-zabbix监控/5-zabbix主被动、分布式.md' },
          ]
        },
        {
          text: 'Prometheus 监控',
          collapsible: true,
          children: [
            { text: 'Prometheus 入门', link: '/07-监控体系/02-prometheus监控/普罗米修斯.md' },
            { text: '监控项配置', link: '/07-监控体系/02-prometheus监控/监控项.md' },
            { text: 'Grafana 可视化', link: '/07-监控体系/02-prometheus监控/grafana数据可视化.md' },
            { text: 'AlertManager 报警', link: '/07-监控体系/02-prometheus监控/AlertManager.md' },
          ]
        }
      ],
      '/08-CI-CD/': [
        {
          text: 'CI/CD 与 DevOps',
          collapsible: true,
          children: [
            { text: 'CI/CD 与 DevOps 概述', link: '/08-CI-CD/01-git版本控制/1-cicd与devops.md' },
            { text: 'Git 与代码仓库', link: '/08-CI-CD/01-git版本控制/2-git与代码仓库.md' },
            { text: 'GitLab 私有仓库', link: '/08-CI-CD/01-git版本控制/3-gitlab私有仓库.md' },
            { text: 'Jenkins 实现 CI/CD', link: '/08-CI-CD/01-git版本控制/4-jenkins实现cicd.md' },
            { text: '实践发布静态网站', link: '/08-CI-CD/01-git版本控制/5-cicd实践发布静态网站.md' },
            { text: 'SonarQube 代码扫描', link: '/08-CI-CD/01-git版本控制/6-gitlab集成sonarqube代码扫描.md' },
            { text: 'Jenkins 集成 Java 项目', link: '/08-CI-CD/01-git版本控制/7-jenkins集成java项目.md' },
          ]
        }
      ],
      '/09-中间件/': [
        {
          text: 'Tomcat 中间件',
          collapsible: true,
          children: [
            { text: 'Tomcat 部署 Java 项目', link: '/09-中间件/01-tomcat中间件/tomcat部署java项目.md' },
            { text: 'Tomcat 负载均衡', link: '/09-中间件/01-tomcat中间件/tomcat负载均衡.md' },
          ]
        },
        {
          text: 'MySQL 数据库',
          collapsible: true,
          children: [
            { text: 'MySQL 入门', link: '/09-中间件/02-mysql数据库/1-mysql入门.md' },
            { text: 'MySQL 权限管理', link: '/09-中间件/02-mysql数据库/2-mysql权限.md' },
            { text: '云服务器部署实践', link: '/09-中间件/02-mysql数据库/3-云服务器mysql部署实践.md' },
            { text: 'SQL 基础知识', link: '/09-中间件/02-mysql数据库/4-认识sql.md' },
            { text: 'DDL 数据库 definition', link: '/09-中间件/02-mysql数据库/5-DDL数据库定义.md' },
            { text: 'DML 与 DQL 数据管理', link: '/09-中间件/02-mysql数据库/6-DML与DQL数据管理与查询.md' },
          ]
        },
        {
          text: 'Redis 数据库',
          collapsible: true,
          children: [
            { text: 'Redis 入门', link: '/09-中间件/03-redis/1-redis入门.md' },
            { text: 'Redis 数据类型', link: '/09-中间件/03-redis/2-redis数据类型.md' },
            { text: 'Redis 持久化', link: '/09-中间件/03-redis/3-redis持久化数据.md' },
            { text: '主从哨兵高可用', link: '/09-中间件/03-redis/4-redis主从哨兵高可用架构.md' },
            { text: 'Redis Cluster 集群', link: '/09-中间件/03-redis/5-redis-cluster.md' },
          ]
        }
      ],
      '/10-堡垒机运维/': [
        {
          text: 'Jumpserver 堡垒机',
          collapsible: true,
          children: [
            { text: 'Jumpserver 安装', link: '/10-堡垒机运维/01-堡垒机运维/jumpserver.md' },
            { text: '堡垒机应用实践', link: '/10-堡垒机运维/01-堡垒机运维/堡垒机应用实践.md' },
            { text: '重启与维护', link: '/10-堡垒机运维/01-堡垒机运维/重启jumpserver.md' },
          ]
        }
      ],
      '/11-ELK日志系统/': [
        {
          text: 'Elasticsearch & ELK',
          collapsible: true,
          children: [
            { text: 'ES 基础知识', link: '/11-ELK日志系统/01-elasticsearch与elk/1-ES.md' },
            { text: 'ES 集群架构', link: '/11-ELK日志系统/01-elasticsearch与elk/2-ES集群.md' },
            { text: 'ES 监控接口', link: '/11-ELK日志系统/01-elasticsearch与elk/3-ES监控接口.md' },
            { text: 'ES 中文分词', link: '/11-ELK日志系统/01-elasticsearch与elk/4-ES中文分词器.md' },
            { text: 'ES 数据备份', link: '/11-ELK日志系统/01-elasticsearch与elk/5-ES备份.md' },
            { text: 'ELK 日志系统', link: '/11-ELK日志系统/01-elasticsearch与elk/6-ELK.md' },
            { text: '日志格式处理', link: '/11-ELK日志系统/01-elasticsearch与elk/7-ELK日志格式处理.md' },
            { text: 'ELK 可视化', link: '/11-ELK日志系统/01-elasticsearch与elk/ELK可视化.md' },
            { text: '方案对比', link: '/11-ELK日志系统/01-elasticsearch与elk/对比.md' },
          ]
        }
      ],
      '/12-lnmp高可用负载均衡集群架构/': [
        {
          text: '期中架构实战',
          collapsible: true,
          children: [
            { text: 'Ansible 剧本', link: '/12-lnmp高可用负载均衡集群架构/期中架构Ansible剧本.md' },
            { text: '脚本命令参考', link: '/12-lnmp高可用负载均衡集群架构/期中架构脚本命令.md' },
          ]
        }
      ],
    },
  }),

  host: '0.0.0.0',
  port: 8080,
})
