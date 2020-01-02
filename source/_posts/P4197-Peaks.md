---
title: P4197 Peaks
abbrlink: 897ab7a0
date: 2019-09-08 20:54:30
tags:
  - 题解
  - 主席树
  - 线段树合并
  - 并查集
---

[传送门](https://www.luogu.org/problem/P4197)

这道题其实就是P4185 [USACO18JAN]MooTube和P3224 [HNOI2012]永无乡的结合。

看到第$k$高，就要想到主席树，但是考虑到题目条件：只经过困难值小于等于x的路径，于是考虑离线操作，把询问和边按照边权从小到大排序，来了一个边权为$x$的询问，只要把$ \le x$的边全部连上，同时合并两个连通块所代表的主席树即可。

代码：

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
		x=(x<<3)+(x<<1)+(ch^'0');
		ch=getchar();
	}
	return x*f;
}
int a[MAXN],rt[MAXN];
namespace SegmentTree{
	struct node{
		int cnt;
		int l,r;
	}tree[MAXN*50];
	inline void pushup(int i,int lson,int rson){
		tree[i].cnt=tree[lson].cnt+tree[rson].cnt;
	}
	int tot;
	void Update(int &i,int l,int r,int index){
		if (!i) i=++tot;
		if (l==r){
			tree[i].cnt=1;
			return ;
		}
		int mid=(l+r)>>1;
		if (index<=mid) Update(tree[i].l,l,mid,index);
		else Update(tree[i].r,mid+1,r,index);
		pushup(i,tree[i].l,tree[i].r);
	}
	int Merge(int x,int y){
		if (!x||!y) return x+y;
		pushup(x,x,y);
		tree[x].l=Merge(tree[x].l,tree[y].l);
		tree[x].r=Merge(tree[x].r,tree[y].r);
		tree[y].l=tree[y].r=0;
		return x;
	}
	int Query(int i,int l,int r,int k){
		if (l==r){
			return l;
		}
		int mid=(l+r)>>1;
		if (tree[tree[i].l].cnt>=k) return Query(tree[i].l,l,mid,k);
		else return Query(tree[i].r,mid+1,r,k-tree[tree[i].l].cnt);
	}
};
using namespace SegmentTree;

struct Edge{
    int u,v,len;
}E[MAXN];
int cnte;
inline bool operator < (const Edge &A,const Edge &B){
    return A.len<B.len;
}
inline void AddEdge(int u,int v,int w){
    E[++cnte]=Edge{u,v,w};
}

struct query{
    int u,x,k,id;
}Q[MAXN];
int cntq;
inline bool operator < (const query &A,const query &B){
    return A.x<B.x;
}
inline void AddQuery(int u,int x,int k,int id){
    Q[++cntq]=query{u,x,k,id};
}

namespace BCJ{
	int fa[MAXN],sz[MAXN];
	inline void Init(){
		for (register int i=0;i<MAXN;++i) fa[i]=i,sz[i]=1;
	}
	int Find(int i){
		return fa[i]==i?i:fa[i]=Find(fa[i]);
	}
}
using namespace BCJ;
inline void Union(int u,int v){
	int fau=Find(u),fav=Find(v);
	if (fau==fav) return ;
	fa[fav]=fau;
	sz[fau]+=sz[fav];
	sz[fav]=0;
	rt[fau]=Merge(rt[fau],rt[fav]);
}
int n,m,q,b[MAXN];
inline void discrete(){
	for (register int i=1;i<=n;++i) b[i]=a[i];
	sort(b+1,b+1+n);
	for (register int i=1;i<=n;++i){
		a[i]=lower_bound(b+1,b+1+n,a[i])-b;
	}
}
int id[MAXN],Ans[MAXN];
int main(){
	n=read(),m=read(),q=read();
	for (register int i=1;i<=n;++i){
		a[i]=read();
	}
	discrete();
    for (register int i=1;i<=n;++i){
		Update(rt[i],1,n,a[i]);
        id[a[i]]=i;
	}
    for (register int i=1;i<=m;++i){
        int u=read(),v=read(),w=read();
        AddEdge(u,v,w);
    }
    sort(E+1,E+1+m);
    for (register int i=1;i<=q;++i){
        int v=read(),x=read(),k=read();
        AddQuery(v,x,k,i);
    }
    sort(Q+1,Q+1+q);
    Init();
    int pos=1;
    for (register int i=1;i<=q;++i){
        while (pos<m&&E[pos].len<=Q[i].x) {//连边
            Union(E[pos].u,E[pos].v);
            pos++;
        }
        int k=Q[i].k,t=Find(Q[i].u);
        if (sz[t]<k) Ans[Q[i].id]=-1;
        else Ans[Q[i].id]=b[Query(rt[t],1,n,sz[t]-k+1)];
    }
    for (register int i=1;i<=q;++i){
        printf("%d\n",Ans[i]);
    }
}
```

有兴趣可以看一看这一道题[P5443 [APIO2019]桥梁](https://www.luogu.org/problem/P5443)

是上面离线思想加上分块的一道~~大毒瘤~~好题