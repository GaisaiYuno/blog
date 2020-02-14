---
title: AC自动机学习笔记
abbrlink: 3693928b
date: 2020-02-13 11:46:04
tags:
  - AC自动机
---

AC 自动机 = KMP + Trie

![](https://cdn.jsdelivr.net/gh/GaisaiYuno/imghost/79278056_p0_master1200.jpg)

<!-- more -->

## AC 自动机的定义

AC 自动机是一个关于若干模式串的 DFA （确定有限状态自动机），接受且仅接受以某个模式串作为后缀的字符串。

什么又是 DFA 呢？

一个 DFA 由以下部分组成：

1. 字符集 $\sum $ ，自动机只能输入这些字符，对于小写英文字符串，$\sum = \texttt{abcd...z}$，对于 01 字符串，$\sum = \texttt{01}$ 。
2. 状态集合 $Q$ ，如果我们把 DFA 看成一张图，$Q$ 就是图上所有节点组成的集合。
3. 起始状态 $start$ ，$start \in Q$ （注意$start$ 只有一个节点），就是开始的节点。
4. 接受状态集合 $F$ ，$F \subseteq Q$，是一些特殊的节点，当我们把字符串输入这个自动机，经过一系列的转移，最终达到这些节点，我们称这个字符串是可以接受的。
5. 转移函数 $\delta$ ，$\delta$ 是一个接受两个参数返回一个值的函数，第一个参数和返回值都是一个状态（节点），第二个参数是字符集里面 的一个字符，如果我们把 DFA 看成一张图，那么这个函数可以写成下列的形式 $\delta(u,c)=v$  ，其中 $u,v$ 都是节点，$c$ 是一个字符。

我们先举几个简单的例子，加深一下我们对 DFA 的印象。

注意：下面我们用阴影代表 $F$ 中的节点。

Trie 树是一种简单的 DFA ，其形态是一棵树，比如说，一棵仅接受字符串 aa, ab, bb 的 DFA 长成这样：

![](https://i.loli.net/2020/02/14/tcwZVi8OkBSXYH3.jpg)

我们再来构造一个仅能接受任意多的连续 1 组成的 01 字符串的 DFA ；

我们再来构造一个仅能接受含有 3 的倍数个 1 的 01 字符串的 DFA ：

![](https://i.loli.net/2020/02/14/5o4BwNitpZMObAW.jpg)

我们再构造一个仅能接受以 1011 为结尾的 01 字符串的 DFA ：

![](https://i.loli.net/2020/02/14/wfTPqs4Dntx9p6Q.jpg)

注意，我们要能接受所有后缀为 1011 的字符串，那么我们失配的时候，我们就不用重新开始，假设我们现在输入的字符串为$s$，只有最后一位失配，那么可以找到这个字符串的最长真 border ，可以从位置为 $|border(s)|$ 的节点重新走起。

注意到没有，这个和 KMP 长得很像哦。 

## AC 自动机能干什么

我们已经知道 KMP 可以根据一个模式串匹配文本串，但是有多个模式串的时候，我们需要跑 $n$ 次 KMP ，导致时间复杂度大大增加。

AC 自动机采用了把所有模式串整合起来，构建一个 DFA 的做法，可以快速进行多模匹配。

## AC 自动机的构建

终于步入正题了。

构造 AC 自动机大概分两个过程：

1. 构造模式串组成的 Trie 树。
2. 连 fail 边。

先定义一下 $str(u)$ ，$str(u)$ 代表根节点到 $u$ 节点路径上的边上的字母依次组成的字符串，$dep(u)$ 代表节点 $u$ 在 Trie 中的深度。

再定义一下 fail 边，fail 边是 AC 自动机上一种特殊的边，区别于 Trie 树里面的普通边，对于每个节点 $u$ ，都有对应的 fail 边 $(u,fail(u))$ ，满足 $str(fail(u))$ 是 $str(u)$ 的最长真后缀，很容易证明这样的 $fail(u)$ 是唯一的。

当节点 $u$ 没有字符 $c$ 的出边，把 $\delta(u,c)$ 定义成 $\delta (fail(u),c)$ ，特别地，$\forall c\in \sum ,\delta(fail(start),c)=start$ 。

如何构建 fail 边呢？我们注意到 $dep(fail(u)) < dep(u)$ ，可以想到对 Trie 树进行 bfs（其实类似于一个 dp） ，对于一个节点 $u$ ：

- 若 Trie 上存在出边 $trie(u,c)$ ，那么我们记 $\delta(u,c)$ 为 $v$ ，$\delta(fail(u),c)$ 为 $w$，有  $fail(v)=w$ 。为什么呢？注意到 $str(v)=str(u)+c$ 而且 $str(w)=str(fail(u))+c$ ，$str(fail(u))$ 是 $str(u)$ 的最长后缀，就能推出 $str(w)$ 是 $str(v)$ 的最长后缀，那么就有 $fail(v)=w$ 。
- 若不存在这样的出边，那么我们直接把 $\delta(u,c)$ 设成 $\delta(fail(u),c)$ ，也就是上文提到的那种情况。

我们来看一下节点 $u$ 沿着 $fail$ 向上跳直到跳到根节点组成的节点集合 $S$ ，$\forall v \in S, str(v) = \text{suffix}(str(u))$ ，这是一个非常重要的性质。

我们来看一下 say, she, shr, her 组成的 AC 自动机：

![](https://cdn.jsdelivr.net/gh/GaisaiYuno/imghost/20170711221050491.png)

（图片来自于 [yyb](https://www.cnblogs.com/cjyyb/p/7196308.html)）

再来看一下代码：

```cpp
void BuildFail(){
	queue<int>Q;
	for (int i=0;i<26;++i){
		if (trie[0][i]) Q.push(trie[0][i]);
	}
	while (Q.size()){
		int now=Q.front();Q.pop();
		for (int i=0;i<26;++i){
			int &child=trie[now][i];
			if (child){
				fail[child]=trie[fail[now]][i];
				Q.push(child);
			}
			else {
				child=trie[fail[now]][i];
			}
		}
	}
}
```

## AC 自动机的应用

### 例题 1

给你 $n$ 个模式串和一个文本串，问**多少个**模式串在文本串里面出现过（重复不算）。

我们在插入的时候，标记这个节点有多少次作为终止节点（ed 数组）：

```cpp
void Insert(int id,char *s){
	int len=strlen(s),root=0;
    for (int i=0;i<len;++i){
        int c=s[i]-'a';
        if (!trie[root][c]) trie[root][c]=++tot;
        root=trie[root][c];
    }
    ed[root]++,pos[id]=root;
}
```

再来看一下 Query ，我们依次把 s 所含的字符塞进 AC 自动机，每塞进一个字符，发现 fail 链上的所有节点都可能对答案做出贡献，那么我们暴力跳 fail 链即可。

```cpp
int Query(char *s){
    int len=strlen(s),root=0,ans=0;
    for (int i=0;i<len;++i){
        int c=s[i]-'a';
        root=trie[root][c];
        for (int j=root;ed[j]!=-1;j=fail[j]){
            //注意相同只计算一次
            //只要一个前缀已经被重复计算，后面的肯定被重复计算
            ans+=ed[j],ed[j]=-1;
        }
    }
    return ans;
}
```

## 例题 2

给你 $n$ 个模式串和一个文本串，问每个模式串在文本串里面的出现次数。

还是上述的思路，我们考虑如何快速算出 Query 的值。

定义 fail 树是把 AC 自动机里面的边 $(u,fail(u))$ 抽出来，形成的一棵树。

那么给节点 $u$ 加上 $x$ ，对 fail 树里面 $u$ 的子树中的每个节点都有贡献。

那么我们就可以这样写：

```cpp
vector<int>G[MAXN];
void AddEdge(int u,int v){
	G[u].push_back(v);
}
void dfs(int u){
	for (int i=0;i<G[u].size();++i){
		int v=G[u][i];
		dfs(v);
		sz[u]+=sz[v];
	}
}

int len=strlen(s),root=0;
for (int i=0;i<len;++i){
	int c=s[i]-'a';
	root=trie[root][c];
	sz[root]++;
}
for (int i=2;i<=tot;++i){
    AddEdge(fail[i],i);
}
dfs(0);
for (int i=1;i<=n;++i){
    printf("%d\n",sz[pos[i]]);
}
```

## 例题 3

[P2444 [POI2000]病毒](https://www.luogu.com.cn/problem/P2444)

我们可以发现如果这些 01 字符串组成的 AC 自动机有环，那么就存在无限的字符集 $\sum$ ，使得输入这些字符，永远不会达到终止状态，满足题目要求。

那么问题就变成找到这个环，而且避开终止状态。

首先，我们要标记出所有的终止状态，注意到终止状态不仅仅包括 Trie 树上的终止节点，也包含了这些节点在 fail 树上的子节点：

```cpp
void BuildFail(){
    queue<int>Q;
    for (int i=0;i<2;++i) if (trie[0][i]) Q.push(trie[0][i]);
    while (Q.size()){
        int now=Q.front();Q.pop();
        for (int i=0;i<2;++i){
            if (trie[now][i]){
                fail[trie[now][i]]=trie[fail[now]][i];
                ed[trie[now][i]]|=ed[fail[trie[now][i]]];//标记子节点
                Q.push(trie[now][i]);
            }
            else {
                trie[now][i]=trie[fail[now]][i];
            }
        }
    }
}
```

下面，我们只需要一个简单的 dfs 就能解决问题：

```cpp
int fd=false;
void dfs(int u){
	if (fd) return ;
	if (stk[u]) return fd=true,void();
	if (ed[u]||vis[u]) return ;
	vis[u]=true;
	stk[u]=true;
	dfs(trie[u][0]),dfs(trie[u][1]);
	stk[u]=false;
}

puts(fd?"TAK":"NIE");
```





