---
title: 'P4556 [Vani有约会]雨天的尾巴'
tags:
  - 题解
  - 权值线段树
  - 树上差分
  - LCA
abbrlink: f855d365
date: 2019-07-22 14:16:44
---

[传送门](https://www.luogu.org/problemnew/show/P4556 )

这道题我们使用权值线段树合并，节点$[l,r]​$存的是第$l...r​$种救济粮的最大值$val​$，还要记录最多的救济粮的种类$pos​$，这个维护起来很简单，不再赘述。

考虑树上差分，每个节点开一个权值线段树，我们把节点$x$，$y$的救济粮数目$+1$，把节点$lca(x,y)$，$fa(lca(x,y))$的救济粮数目$-1$，最后一遍$\rm dfs$把$u$点的所有子树的权值线段树和$u$点的权值线段树合并，并且记录答案即可。

注意空间要开$n\log n$，还有$fa(lca(x,y))$不存在，即$lca(x,y)==1$时要加特判。

时间复杂度$O(n\log n)$，空间复杂度$O(n \log n)$，用$\rm set$ 启发式合并可以做到两只$\log$，但是也不好写到哪里去。

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
#define MAXM 60
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
namespace SegmentTree{
    struct node{
        int l,r;
        int val,pos;
    }tree[MAXN*MAXM];
    int tot;
    #define lc tree[i].l
    #define rc tree[i].r
    inline void pushup(int i){
        if (tree[lc].val<tree[rc].val){
            tree[i].val=tree[rc].val;
            tree[i].pos=tree[rc].pos;
        }
        else {
            tree[i].val=tree[lc].val;
            tree[i].pos=tree[lc].pos;
        }
    }
    void Update(int &i,int l,int r,int index,int val){
        if (!i) i=++tot;
        if (l==r) {
            tree[i].val+=val;
            tree[i].pos=l;
            return ;
        }
        int mid=(l+r)>>1;
        if (index<=mid) Update(lc,l,mid,index,val);
        else Update(rc,mid+1,r,index,val);
        pushup(i);
    }
    int Merge(int x,int y,int l,int r){
        if (!x||!y) return x+y;
        if (l==r){
            tree[x].val+=tree[y].val;
            tree[x].pos=l;
            return x;
        }
        int mid=(l+r)>>1;
        tree[x].l=Merge(tree[x].l,tree[y].l,l,mid);
        tree[x].r=Merge(tree[x].r,tree[y].r,mid+1,r);
        pushup(x);
        return x;
    }
}
using namespace SegmentTree;

vector<int>G[MAXN];
inline void AddEdge(int u,int v){
    G[u].push_back(v);
}
int anc[MAXN][MAXM],dep[MAXN],n,m;
void dfs(int u,int father){
    anc[u][0]=father;
    for (register int i=1;i<MAXM;++i){
        anc[u][i]=anc[anc[u][i-1]][i-1];
    }
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i];
        if (v!=father){
            dep[v]=dep[u]+1;
            dfs(v,u);
        }
    }
}
inline int LCA(int u,int v){
    if (dep[u]<dep[v]) swap(u,v);
    for (register int i=MAXM-1;i>=0;--i){
        if (dep[anc[u][i]]>=dep[v]){
            u=anc[u][i];
        }
    }
    if (u==v) return u;
    for (register int i=MAXM-1;i>=0;--i){
        if (anc[u][i]!=anc[v][i]){
            u=anc[u][i];
            v=anc[v][i];
        }
    }
    return anc[u][0];
}
inline void Init(){
    memset(dep,0,sizeof(dep));
    dfs(1,1);
}
int ans[MAXN],rt[MAXN];
void DP(int u,int father){
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i];
        if (v!=father){
            DP(v,u);
            rt[u]=Merge(rt[u],rt[v],1,MAXN-1);
        }
    }
    if (tree[rt[u]].val){
        ans[u]=tree[rt[u]].pos;
    }
}
inline void Upd(int u,int pos,int val){
    Update(rt[u],1,MAXN-1,pos,val);
}
inline void Add(int x,int y,int z){
    int lca=LCA(x,y);
    Upd(x,z,1),Upd(y,z,1);
    Upd(lca,z,-1);
    if (lca!=1) Upd(anc[lca][0],z,-1);
}
int main(){
    n=read(),m=read();
    for (register int i=1;i<n;++i){
        int u=read(),v=read();
        AddEdge(u,v),AddEdge(v,u);
    }
    Init();
    for (register int i=1;i<=m;++i){
        int x=read(),y=read(),z=read();
        Add(x,y,z);
    }
    DP(1,1);
    for (register int i=1;i<=n;++i){
        printf("%d\n",ans[i]);
    }
}
```

