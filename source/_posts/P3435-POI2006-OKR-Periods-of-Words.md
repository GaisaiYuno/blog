---
title: 'P3435 [POI2006]OKR-Periods of Words'
abbrlink: 620a89de
date: 2019-11-03 21:56:33
tags:
  - 题解
  - kmp
  - 树形结构
---

### $Pro$

定义一个串$A$是$Q$的周期，仅当$A$是$Q$的$proper$前缀（即$A!=Q$的意思），而且$Q$是$AA$的前缀（没有$proper$的限制）。比如说$abab$和$ababab$是$abababa$的周期。

给你一个字符串，求出它所有前缀的最大周期长度之和。

### $Sol$

![](https://ae01.alicdn.com/kf/H591e3227195a424c945a85bc4cc14babH.png)

首先先把$A,Q$画出来。

![](https://ae01.alicdn.com/kf/H055fd29a953c41cbac6dc5b555642ffcW.png)

发现绿色部分是相等的，而且绿色部分是$A$的真$border$（既是$A$的前缀又是$A$的后缀而且不等于$A$）。

发现周期长度为$len(Q)-len(border)$，于是想让周期尽量长，就要$border$尽量短。

问题转化为求$A$的每个前缀的最短非空$border$。

这就提示我们建立$fail$树，何谓$fail$树，就是$i$向$next[i]$连边形成的树形结构。

发现$i$到根节点的路径上的节点代表$A[1 \to i]$的所有$border$。

具体证明参见[这篇博客](https://stevenmhy.tk/archives/428b39ea.html)。

![](https://ae01.alicdn.com/kf/H1e53b6bbd96b4f088a1f7d3a97f8c897d.png)

建出$fail$树之后，发现对于和$0$相邻的所有节点，它的子树里面的所有节点的最短非空$border$的长度都为这个节点的标号，很好理解。

于是可以通过一个类似于染色的方法，$O(n)$地计算出来对于每个节点的最短非空$border$的长度。

最后统计答案扫一遍即可，记得开long long。

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
using namespace std;
inline int read(){
	int x=0,f=1;
	char ch=getchar();
	while (ch<'0'||ch>'9'){
		if (ch=='-') f=-1;
		ch=getchar();
	}
	while (ch>='0'&&ch<='9'){
		x=(x<<1)+(x<<3)+(ch^'0');
		ch=getchar();
	}
	return x*f;
}
char a[MAXN];
int nex[MAXN];
vector<int>G[MAXN];
int num[MAXN];
inline void dfs(int u,int father,int color){
	num[u]=color;
	for (register int i=0;i<G[u].size();++i){
		if (color==0) dfs(G[u][i],u,G[u][i]);
		else dfs(G[u][i],u,color);
	}
}
int main(){
	int n=read();
	scanf("%s",a+1);
	int j=0;
	for (register int i=2;i<=n;++i){
		while (j&&a[j+1]!=a[i]) j=nex[j];
		if (a[j+1]==a[i]) ++j;
		nex[i]=j;
	}
	for (register int i=1;i<=n;++i){
		G[nex[i]].push_back(i);
	}
	dfs(0,0,0);
	long long ans=0;
	for (register int i=1;i<=n;++i){
		ans+=i-num[i];
	}
	printf("%lld\n",ans);
}
```

