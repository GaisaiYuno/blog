---
title: 记一下Github被*的解决方法
date: 2020-01-22 16:56:04
tags:
  - 实用
---

在hosts文件(C:\Windows\System32\drivers\etc)里面添加：

```plain
# GitHub Start 
151.101.100.133 assets-cdn.github.com 
151.101.100.133 raw.githubusercontent.com 
151.101.100.133 gist.githubusercontent.com 
151.101.100.133 cloud.githubusercontent.com 
151.101.100.133 camo.githubusercontent.com 
151.101.100.133 user-images.githubusercontent.com
151.101.100.133 avatars0.githubusercontent.com 
151.101.100.133 avatars1.githubusercontent.com 
151.101.100.133 avatars2.githubusercontent.com 
151.101.100.133 avatars3.githubusercontent.com 
151.101.100.133 avatars4.githubusercontent.com 
151.101.100.133 avatars5.githubusercontent.com 
151.101.100.133 avatars6.githubusercontent.com 
151.101.100.133 avatars7.githubusercontent.com 
151.101.100.133 avatars8.githubusercontent.com 
# GitHub End
```

https://www.ipaddress.com/
到这个网站，查avatars0.githubusercontent.com ，就能得到最新的地址，替换掉原文的151.101.100.133就行了