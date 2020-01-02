---
title: FHQ Treap学习笔记
abbrlink: f3a20b54
date: 2019-12-11 22:45:21
tags:
  - FHQ Treap
  - 平衡树
---

这将是一篇只有重点内容的学习笔记。

## Merge

因为每个节点实际上代表了一段区间，我们以这种形式表示一个节点：

![1.png](https://i.loli.net/2019/12/11/2nHqtWEAmiFJL3r.png)

考虑Merge，我们要维护堆性质，这里认为是大根堆。

### 1.pri(x)>pri(y)

![1.png](https://i.loli.net/2019/12/11/kXVju7zl8pMqL9R.png)

![1.png](https://i.loli.net/2019/12/11/WclJmshbRKQS2GO.png)

问题转化为Merge(rc(x),y)

这样可以递归下去

现在根节点变为x

### 2.pri(x)<=pri(y)

不再赘述

## Split

### 1.k<=sz(lc)

![2nHqtWEAmiFJL3r.png](https://i.loli.net/2019/12/11/GgqSHzvl9BjNEop.png)

![2nHqtWEAmiFJL3r.png](https://i.loli.net/2019/12/11/9HDxBevaOwUs5F7.png)

### k>sz(rc)

不再赘述