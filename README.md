# 润鲁收集系统 V2.0 Web 管理端

#### 介绍

润鲁收集系统 V2.0 Web 管理端，基于 Quasar 开发。

本产品是一个主要面向学生的文件收集系统，旨在帮助大家提高收集整理文件的效率。本产品通过内建组件与第三方存储（七牛云存储）API 的整合，实现文件**云端存储、打包、自动重命名等**，让**收集者**告别繁琐的文件整理工作；通过与**钉钉群消息机器人**Webhook 的整合，自动发送钉钉消息提醒，使收集者无需做多余的提醒工作，同时也能避免**提交者**忘记提交的烦恼，提高效率。

#### 软件架构

![设计理念](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/frontend1.png)


![框架](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/frontend2.png)



![其他技术点](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/frontend3.png)





#### 安装教程

##### 软件环境

Nodejs：v14.60 +

##### 部署

1. 运行 **npm install** 安装依赖

2. 运行 **quasar build** 命令来构建项目

3. 进入dist目录，复制spa文件夹至项目客户端的 Nginx 匹配文件中映射的项目客户端目录下，示例配置文件如下，

   ```shell
   # collectorAdmin.conf 
   
   server {
       server_name upadmin.anrunlu.net;
       listen 80;
       charset utf-8;
       client_max_body_size 75M;
   
       location / {
           root /home/runluCollectorAdmin;
           index  index.html;
           # try_files $uri $uri/ /index.html;
       }
   
     	location /api/ {
   		proxy_pass http://127.0.0.1:3009/;
   	}
   }
   
   ```
   
   

#### 使用说明

[润鲁收集系统管理端使用说明](https://www.yuque.com/docs/share/b0bba4ec-7f29-48a2-b55b-d2f6578b027b?#)

