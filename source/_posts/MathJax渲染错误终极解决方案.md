---
title: MathJax渲染错误终极解决方案
abbrlink: 5d768499
date: 2020-02-10 14:41:50
tags:
  - 实用
---

只要您不使用斜体，然后也不使用*代表乘号：

```bash
cd archives
find ./ -type f -name '*.html'|xargs sed -i "s#<em>#_#g"
find ./ -type f -name '*.html'|xargs sed -i "s#</em>#_#g"
cd ..
```

手动滑稽