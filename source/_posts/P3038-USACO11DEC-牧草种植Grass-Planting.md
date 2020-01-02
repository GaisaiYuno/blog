---
title: 'P3038 [USACO11DEC]牧草种植Grass Planting'
tags:
  - 题解
  - 树链剖分
  - 线段树
abbrlink: ad35bf33
date: 2019-07-27 07:55:05
---

[传送门](https://www.luogu.org/problem/P3038 )

翻译有误，应该是查询$u$到$v$上最大值。

线段树查询最大值和区间$+1$，

```cpp
#include <bits/stdc++.h>
#define MAXN 2000005
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
vector<int>G[MAXN];
inline void AddEdge(int u,int v){
    G[u].push_back(v);
}
int sz[MAXN],big[MAXN],fa[MAXN],top[MAXN],dep[MAXN],tofa[MAXN];
void dfs1(int u,int father){
    fa[u]=father;sz[u]=1;
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i];
        if (v!=father){
            dep[v]=dep[u]+1;
            dfs1(v,u);
            sz[u]+=sz[v];
            if (sz[big[u]]<sz[v]) big[u]=v;
        }
    }
}
int seq[MAXN],cnt;
int alb[MAXN];
void dfs2(int u,int t){
    alb[seq[u]=++cnt]=u;
    top[u]=t;
    if (big[u]) dfs2(big[u],t);
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i];
        if (v!=fa[u]&&v!=big[u]){
            dfs2(v,v);
        }
    }
}
namespace SegmentTree{
    struct node{
        int l,r;
        int val,tag;
        inline int len(){
            return r-l+1;
        }
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void pushup(int i){
        tree[i].val=tree[lc].val+tree[rc].val;
    }
    inline void Change(int i,int val){
        tree[i].val+=val*tree[i].len();
        tree[i].tag+=val;
    }
    inline void pushdown(int i){
        if (tree[i].tag){
            Change(lc,tree[i].tag);
            Change(rc,tree[i].tag);
            tree[i].tag=0;
        }
    }
    void Build(int i,int l,int r){
        tree[i].l=l,tree[i].r=r;
        if (l==r) {
            tree[i].val=0;
            return ;
        }
        int mid=(l+r)>>1;
        Build(lc,l,mid);
        Build(rc,mid+1,r);
        pushup(i);
    }
    int Query(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].val;
        }
        pushdown(i); 
        int mid=(tree[i].l+tree[i].r)>>1,ans=0;
        if (L<=mid) ans=max(ans,Query(lc,L,R));
        if (mid<R) ans=max(ans,Query(rc,L,R));
        return ans;
    }
    void Update(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            Change(i,1);
            return ;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        pushdown(i);
        if (L<=mid) Update(lc,L,R);
        if (mid<R) Update(rc,L,R);
        pushup(i);
    }
}
using namespace SegmentTree;
inline int Query_Chain(int u,int v){
    int ans=0;
    while (top[u]!=top[v]){
        if (dep[top[u]]<dep[top[v]]){
            swap(u,v);
        }
        ans+=Query(1,seq[top[u]],seq[u]);
        u=fa[top[u]];
    }
    if (dep[u]>dep[v]) swap(u,v);
    return ans+Query(1,seq[u]+1,seq[v]);
}
inline void Update_Chain(int u,int v){
    while (top[u]!=top[v]){
        if (dep[top[u]]<dep[top[v]]){
            swap(u,v);
        }
        Update(1,seq[top[u]],seq[u]);
        u=fa[top[u]];
    }
    if (dep[u]>dep[v]) swap(u,v);
    Update(1,seq[u]+1,seq[v]);
}
inline void Init(){
    dfs1(1,0);
    dfs2(1,1);
}
int main(){
    int n=read(),m=read();
    for (register int i=1;i<n;++i){
        int u=read(),v=read();
        AddEdge(u,v);
        AddEdge(v,u);
    }
    Init();
    Build(1,1,n);
    while (m--){
        char ch[2];
        scanf("%s",ch);
        int u=read(),v=read();
        if (ch[0]=='Q') {
            printf("%d\n",Query_Chain(u,v));
        }
        else if (ch[0]=='P'){
            Update_Chain(u,v);
        }
    }
}
```

