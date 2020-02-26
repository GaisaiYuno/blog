---
title: 后缀自动机 SAM 学习笔记
abbrlink: '21200e22'
date: 2020-02-21 21:58:44
tags:
  - SAM
  - 字符串
---

# 后缀自动机

## 回顾

我们来复习一下 DFA （确定有限状态自动机）的定义：

1. 字符集 $\Sigma $ ，自动机只能输入这些字符，对于小写英文字符串，$\Sigma = \texttt{abcd...z}$，对于 01 字符串，$\Sigma  = \texttt{01}$ 。

2. 状态集合 $Q$ ，如果我们把 DFA 看成一张图，$Q$ 就是图上所有节点组成的集合。

   在下面的论证过程中，可能不分“节点”和“状态”，其实他们是一样的。

3. 起始状态 $start$ ，$start \in Q$ （注意$start$ 只有一个节点），就是开始的节点。

4. 接受状态集合 $F$ ，$F \subseteq Q$，是一些特殊的节点，当我们把字符串输入这个自动机，经过一系列的转移，最终达到这些节点，我们称这个字符串是可以接受的。

5. 转移函数 $\delta$ ，$\delta$ 是一个接受两个参数返回一个值的函数，第一个参数和返回值都是一个状态（节点），第二个参数是字符集里面 的一个字符，如果我们把 DFA 看成一张图，那么这个函数可以写成下列的形式 $\delta(u,c)=v$  ，其中 $u,v$ 都是节点，$c$ 是一个字符，定义 $\delta(u,s)=\delta(\delta(\delta(u,s[1]),s[2]),s[3]...)$。

注意，如果状态 $u$ 没有 $c$ 的转移，记 $\delta(u,c)=null$。规定 $\delta(null,c)=null$。

定义把一个字符串 $s$ 按顺序输入 DFA $A$ ，能不能被 $A$ 接受，结果为 $A(s)$，为真（True）或假（False）。

我们定义，一个字符串的后缀自动机（SAM）是一个接受且 **仅接受** 这个字符串的所有后缀的 DFA，我们记字符串 $s$ 的后缀自动机为 $SAM_s$ ，定义 $SAM_s$ 转移函数为 $\delta_s$ 。

那么，一个字符串 $t$ 是字符串 $s$ 的后缀，当且仅当 $SAM_s(t)=True$。

还有，一个字符串 $t$ 是字符串 $s$ 的子串，当且仅当 $\forall \delta_s(start_s,t) \not= null$。 

## 朴素 SAM

可以将一个字符串的所有后缀插入一个 Trie 里面构建 DFA，我们称这样的 DFA 为朴素 SAM。

比如字符串 abaaabaa 的朴素 SAM 为：

 ![](https://ouuan.github.io/post_img/%E5%90%8E%E7%BC%80%E8%87%AA%E5%8A%A8%E6%9C%BA%EF%BC%88SAM%EF%BC%89%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/triesam.png)

这样，节点的数量和构建 SAM 的复杂度都为 $\mathcal O(n^2)$ 的，考虑怎么优化？

我们可以优化成 **最简 SAM** ，可以将节点数量和时间复杂度都降到 $\mathcal O(n)$ 。

## 最简 SAM

### right 集合

以下字符串的下标都从 0 开始。

#### 定义

对于一个字符串 $t$ 它在 $s$ 中出现的位置集合为：$\lbrace [l_1,r_1),[l_2,r_2),\cdots,[l_n,r_n)\rbrace$。

我们定义 $right(t)$ 为 $\lbrace r_1,r_2,\cdots,r_n\rbrace$。

### right 集合等价类

### 定义

right 集合相等的字符串，构成一个 right 集合等价类。

对于串 abaaaba，right 集合为 $\lbrace 4,8 \rbrace$ 的字符串为 $\lbrace \texttt{abaa},\texttt{baa}\rbrace$ ，这两个字符串构成一个 right 集合等价类。

### right 集合等价类和最简​ SAM 有什么关系？

我们定义 $reg(v)$ 表示从状态 $v$ 开始能识别的字符串集合，即 $t \in reg(v)$ 当且仅当 $\delta (v,t)\in F$。

因为 SAM 是一个 DAG ，所以 reg​ 集合的大小是有限的。

我们找出字符串 $t$ 的 right 集合 $right(t)$ ，我们发现在 $t$ 后面补上一个字符串 $s[r_i..n]$ ，就得到了一个 $s$ 的后缀。所以若 $right(t_1)=right(t_2)$ ，那么 $reg(\delta(start,t_1))=reg(\delta(start,t_2))$，同时，反着推结论也是成立的。

我们发现，right 集合等价，能推出 reg 集合等价，于是想到，可以 **将 right 集合相同的字符串压成一个节点**。

这样，我们还可以推出 SAM 状态最少，因为 SAM 上节点两两的 reg 集合互不相同。

字符串 abaaabaa 的最简 SAM：

![](https://ouuan.github.io/post_img/%E5%90%8E%E7%BC%80%E8%87%AA%E5%8A%A8%E6%9C%BA%EF%BC%88SAM%EF%BC%89%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/minsam.png)

由于字符串和节点是等价的，我们定义 $right(v)$ 为节点 $v$ 代表的字符串的 right 集合。

### right 集合等价类的性质

我们定义，对于每个状态 $v$ ，$max(v)$ 和 $min(v)$ 分别表示这个状态对应的最长和最短的字符串。

具体来说：

$max(v)=maxlen(\forall s,\delta(start,s)=v)$。

$min(v)=minlen(\forall s,\delta(start,s)=v)$。

其中，$maxlen,minlen$ 分别代表从字符串集合中选出最长和最短的字符串。

1. $v$ 对应的任意一个字符串都是 $max(v)$ 的后缀，由于 $v$ 对应的任意一个字符串都属于 right 集合等价类，他们对应的 $r_i$ 也是相同的。我们观察 $\lbrace [l_1,r_1),[l_2,r_2),\cdots,[l_n,r_n)\rbrace$，和$\lbrace [l_1',r_1),[l_2',r_2),\cdots,[l_n',r_n)\rbrace$ ，显然，由于 $l_i$ 已经最小了，那么 $s[l_i',r_i)$ 是 $s[l_i,r_i)$ 的后缀。

2. $v$ 对应的任意一个字符串都不是 $min(v)$ 的真后缀。证明方法类似于 1. ，不再赘述。

3. $v$ 包含所有这样的字符串，即，$v$ 包含所有长度在 $[len(min(v)),len(max(v))]$ 之间的字符串。

   要证 3. ，我们需再证一个引理，对于一个字符串 $t$ ，它的 right 集合是它的任意一个后缀的 right 集合的子集，这个很好证明，口胡一下，完整是字符串 $t$ 对前缀的限制较多，然而满足此处的字符串为 $t$ ，一定满足后缀为这个后缀。证明完了。

   根据这个引理，我们可以这样证明这个定理，对于一个位置 $p$ ，$right(s[i..p-1]) \subseteq right(s[i+1..p-1]) \subseteq \cdots $，然而 $right(min(v))=right(max(v))$，既然两边的集合互相相等，那么中间的一定相等。

   举个例子加深印象，对于字符串 abaaabaa ，它的 right 集合为 $\lbrace 6 \rbrace$ 的子串为 $\lbrace \texttt{aab}, \texttt{aaab}, \texttt{baaab}, \texttt{abaaab}  \rbrace$，包含了所有长度处于 $[3,6]$ 之间、右端点为 5 的子串。

   我们再研究一下 $right(\texttt{ab}),right(\texttt{b})$，发现它们都等于 $\lbrace 2,6\rbrace$。

   如果我们能找到 right 集合开始不相等的地方，也就是所说的“分割点”，那么上述的“压缩”就变得可行了。

### 如何找到所谓的“分割点”？

#### parent 的概念

我们引入 parent 的概念。

##### 定义一

延续刚才的思路，定义对于每个节点 $v$（除了 $start$），找到一个最长的字符串 $t$ 对应的状态 $u$，使得 $right(v)\subsetneq right(u)$ 。（注意是真子集，也就是 $right(v) \not= right(u)$）

定义 $parent(v)=u$。

##### 定义二

对于每个状态 $v$ （除了起始状态），$min(v)$ 字符串去掉开头字符对应的状态，就是 $parent(v)$。

对于字符串 abaaabaa ，$parent(\delta(start,\texttt{aab}))=parent(\delta(start,\texttt{aaab}))=\delta(start,\texttt{ab})=\delta(start,\texttt{b})$。

显然，有 $len(min(v))=len(max(parent(v)))+1$。

#### parent 树

我们可以发现，right 集合要么包含，要么不相交，parent 集合可以看成 right 集合的包含关系构成是树。

还是串 abaaabaa：

![](https://ouuan.github.io/post_img/%E5%90%8E%E7%BC%80%E8%87%AA%E5%8A%A8%E6%9C%BA%EF%BC%88SAM%EF%BC%89%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/parent.png)

![](https://cdn.jsdelivr.net/gh/GaisaiYuno/imghost/20200222202239.png)

（第二张图左边没显示出来）

### 最简 SAM 的线性构造



# 例题

