---
title: "AWS EC2 Java8 설치"
date: "2019-12-06 13:45:51 +0900"
template: "wiki"
draft: false
slug: "/wiki/aws-java8-install"
category: ""
tags:
---

# AWS EC2(Amazon Linux)에 Java8 설치하기

```
sudo yum install -y java-1.8.0-openjdk-devel.x86_64
    sudo /usr/sbin/alternatives --config java
    
    sudo yum remove java-1.7.0-openjdk
    
    java -version
```
