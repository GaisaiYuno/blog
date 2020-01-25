---
title: 记一下Github被*的解决方法
tags:
  - 实用
abbrlink: 75e6bc2e
date: 2020-01-22 16:56:04
---

如果是Windows，在hosts文件(C:\Windows\System32\drivers\etc)里面添加：

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

若是linux的话，可以去/etc/hosts修改

可以用vim /etc/hosts修改，先安装vim，按i，输入，再按esc，输入:wq直接退出

https://www.ipaddress.com/
到这个网站，查avatars0.githubusercontent.com ，就能得到最新的地址，替换掉原文的151.101.100.133就行了