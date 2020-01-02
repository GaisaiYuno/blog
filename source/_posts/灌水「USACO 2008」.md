---
title: 灌水 USACO 2008 最小生成树
  
tag:
  - 题解
  - 最小生成树
  - 图论
abbrlink: 56ee40b1
date: 2019-07-13 20:34:14
---
我们把自己建了水库的节点称为$A$类节点，通过其他农田饮水的称为$B$类节点。
考虑最后生成的图，根据贪心，图中肯定没有环，所以这个图是一个森林，且森林中的每棵树都有且仅有一个$A$类节点，若大于$1$则造成浪费。
考虑把森林变成树，我们建立超级源点$0$号节点，和图中每个节点$i$相连，边权就可以设为$w_i$，
然后节点$i$，节点$j$连边权为$p_{ij}$的边即可。

最后跑一遍最小生成树，生成树中，与$0$号节点有边相连的节点是$A$类节点，其余为$B$类节点，把生成树中与$0$号节点相连的边去除，就变成了答案的森林图了。

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
using namespace std;
inline int read() {
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9') {
        if (ch=='-') f=-1;
        ch=getchar();
    }
    while (ch>='0'&&ch<='9') {
        x=(x*10)+(ch-'0');
        ch=getchar();
    }
    return x*f;
}
namespace BCJ{
	int fa[MAXN];
	inline void Init(){
		for (register int i=0;i<MAXN;++i){
			fa[i]=i;
		}
	}
	int Fa(int i){
		return fa[i]==i?i:fa[i]=Fa(fa[i]);
	}
	inline void Union(int i,int j){
		fa[Fa(i)]=Fa(j);
	}
};
using namespace BCJ;
struct Edge{
	int u,v,w;
};
inline bool operator < (const Edge &A,const Edge &B){
	return A.w<B.w;
}
Edge s[MAXN];
int tot;
inline void AddEdge(int u,int v,int w){
	s[++tot]=Edge{u,v,w};
}
inline int Kruscal(){
	sort(s+1,s+1+tot);
	Init();
	int ans=0;
	for (register int i=0;i<=tot;++i){
		if (Fa(s[i].u)!=Fa(s[i].v)){
			Union(s[i].u,s[i].v);
			ans+=s[i].w;
		}
	}
	return ans;
}
int main(){
	int n=read();
	for (register int i=1;i<=n;++i){
		int w=read();
		AddEdge(0,i,w);
	}
	for (register int i=1;i<=n;++i){
		for (register int j=1;j<=n;++j){
			int v=read();
			AddEdge(i,j,v);
		}
	}
	printf("%d\n",Kruscal());
}
```

由于加的边形成一个完全图，边数为$n^2$级别，所以$Kruskal$时间复杂度为$O(|E|log|E|)=O(n^2log(n^2))$，在本题数据范围下能过。
如果数据范围再大一些，就要使用$Prim$算法，时间复杂度为$O(nlogn)$，估计能过$n=1000$的点（再大内存会爆）。