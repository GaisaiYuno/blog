---
title: SP3978 DISQUERY - Distance Query
abbrlink: b3f6292d
date: 2019-07-31 21:43:21
tags:
  - 题解
  - 线段树
  - 树链剖分

---

[传送门](https://www.luogu.org/problem/SP3978)

树链剖分裸题

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
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
struct Edge{int to,len;};
vector<Edge>G[MAXN];
inline void AddEdge(int u,int v,int w){
    Edge temp;
    temp.to=v;
    temp.len=w;
    G[u].push_back(temp);
}
int fa[MAXN],dep[MAXN],tofa[MAXN],dfn[MAXN],seq[MAXN],cnt,top[MAXN],sz[MAXN],son[MAXN];
void dfs1(int u,int father){
    sz[u]=1;
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to,w=G[u][i].len;
        if (v!=father){
            fa[v]=u,dep[v]=dep[u]+1;
            tofa[v]=w;
            dfs1(v,u);
            sz[u]+=sz[v];
            if (sz[v]>sz[son[u]]) son[u]=v;
        }
    }
}
void dfs2(int u,int t){
    seq[dfn[u]=++cnt]=u;
    top[u]=t;
    if (son[u]) dfs2(son[u],t);
    else return ;
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to;
        if (v!=son[u]&&v!=fa[u]){
            dfs2(v,v);
        }
    }
}
namespace SegmentTree{
    struct node{
        int l,r;
        int maxn,mino;
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void pushup(int i){
        tree[i].maxn=max(tree[lc].maxn,tree[rc].maxn);
        tree[i].mino=min(tree[lc].mino,tree[rc].mino);
    }
    void Build(int i,int l,int r){
        tree[i].l=l,tree[i].r=r;
        if (l==r){
            tree[i].maxn=tree[i].mino=tofa[seq[l]];
            return ;
        }
        int mid=(l+r)>>1;
        Build(lc,l,mid);
        Build(rc,mid+1,r);
        pushup(i);
    }
    int QueryMax(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].maxn;
        }
        int mid=(tree[i].l+tree[i].r)>>1,ans=-0x7fffffff;
        if (L<=mid) ans=max(ans,QueryMax(lc,L,R));
        if (mid<R) ans=max(ans,QueryMax(rc,L,R));
        return ans;
    }
    int QueryMin(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].mino;
        }
        int mid=(tree[i].l+tree[i].r)>>1,ans=0x7fffffff;
        if (L<=mid) ans=min(ans,QueryMin(lc,L,R));
        if (mid<R) ans=min(ans,QueryMin(rc,L,R));
        return ans;
    }
}
using namespace SegmentTree;
inline int QueryChainMax(int u,int v){
    int ans=-0x7fffffff;
    while (top[u]!=top[v]){
        if (dep[top[u]]<dep[top[v]]) swap(u,v);
        ans=max(ans,QueryMax(1,dfn[top[u]],dfn[u]));
        u=fa[top[u]];
    }
    if (u==v) return ans;
    if (dep[u]>dep[v]) swap(u,v);
    return max(ans,QueryMax(1,dfn[u]+1,dfn[v]));
}
inline int QueryChainMin(int u,int v){
    int ans=0x7fffffff;
    while (top[u]!=top[v]){
        if (dep[top[u]]<dep[top[v]]) swap(u,v);
        ans=min(ans,QueryMin(1,dfn[top[u]],dfn[u]));
        u=fa[top[u]];
    }
    if (u==v) return ans;
    if (dep[u]>dep[v]) swap(u,v);
    return min(ans,QueryMin(1,dfn[u]+1,dfn[v]));
}
int main(){
    int n=read();
    for (register int i=1;i<n;++i){
        int u=read(),v=read(),w=read();
        AddEdge(u,v,w);
        AddEdge(v,u,w);
    }
    dfs1(1,0);
    dfs2(1,1);
    Build(1,1,n);
    int q=read();
    while (q--){
        int u=read(),v=read();
        printf("%d %d\n",QueryChainMin(u,v),QueryChainMax(u,v));
    }
}
```

