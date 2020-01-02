---
title: CF609E Minimum spanning tree for each edge
tags:
  - 题解
  - 树链剖分
  - 最小生成树
  - Kruskal
  - LCA
abbrlink: 3b573a7c
date: 2019-07-23 17:24:57
---

[传送门](https://www.luogu.org/problemnew/show/CF609E)

考虑先把这张图的最小生成树$G$建出来，假设查询的边为$E$，

发现：

$1.$如果$E$本来就在$G$里面，那么直接输出$G$的边权和，因为没有比这个更优的解。

$2.$如果$E$不在$G$里面，那么$E$一定和$G$ 形成一个环，根据贪心的原则，我们把这条环上面最大边权的边删去，这样新的图仍然是一棵树，而且边权和最小。

在实际操作过程中，我们并不用找到那个环，可以这么想，假设$E$的端点分别为$u,v$，在最小生成树上它们的$LCA$为$alb$，那么这个环一定是由$u,alb$这条链，$alb,v$这条链和边$E$所构成，于是，只要找到路径$u,v$上面边权最大的一条边即可。

具体实现时，可以使用树上倍增或树链剖分。

注意：

$1.$求完最小生成树之后，一定要把按边权排序过的$E$数组还原。

$2.$$\rm QueryChain$和$\rm Query$不要写混。

$3.$要开$\rm long$ $\rm long$

```cpp
#include <bits/stdc++.h>
#define MAXN 400005
#define int long long
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
struct Node{
    int to,w;
};
vector<Node>G[MAXN];
inline void AddEdge(int u,int v,int w){
    G[u].push_back(Node{v,w});
}
int sz[MAXN],big[MAXN],fa[MAXN],top[MAXN],dep[MAXN],tofa[MAXN];
void dfs1(int u,int father){
    fa[u]=father;sz[u]=1;
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to,w=G[u][i].w;
        if (v!=father){
            dep[v]=dep[u]+1;
            dfs1(v,u);
            tofa[v]=w;
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
        int v=G[u][i].to;
        if (v!=fa[u]&&v!=big[u]){
            dfs2(v,v);
        }
    }
}
namespace SegmentTree{
    struct node{
        int l,r;
        int val;
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void pushup(int i){
        tree[i].val=max(tree[lc].val,tree[rc].val);
    }
    void Build(int i,int l,int r){
        tree[i].l=l,tree[i].r=r;
        if (l==r) {
            tree[i].val=tofa[alb[l]];
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
        int mid=(tree[i].l+tree[i].r)>>1,ans=0;
        if (L<=mid) ans=max(ans,Query(lc,L,R));
        if (mid<R) ans=max(ans,Query(rc,L,R));
        return ans;
    }
}
using namespace SegmentTree;
inline int Query_Chain(int u,int v){
    int ans=0;
    while (top[u]!=top[v]){
        if (dep[top[u]]<dep[top[v]]){
            swap(u,v);
        }
        ans=max(ans,Query(1,seq[top[u]],seq[u]));
        u=fa[top[u]];
    }
    if (dep[u]>dep[v]) swap(u,v);
    return max(ans,Query(1,seq[u]+1,seq[v]));
}
int n;
inline void Init(){
    dep[1]=1;
    dfs1(1,0);
    dfs2(1,1);
}
 
 
struct Edge{
    int u,v,w,id;
}E[MAXN];
int tot;
inline void AddEdge1(int u,int v,int w){
    E[++tot]=Edge{u,v,w,tot};
}
inline bool cmp1(const Edge &A,const Edge &B){return A.w<B.w;}
inline bool cmp2(const Edge &A,const Edge &B){return A.id<B.id;}
namespace BCJ{
    int Fa[MAXN];
    inline void Init_BCJ(){for (register int i=0;i<MAXN;++i) Fa[i]=i;}
    inline int Get_Fa(int i){return Fa[i]==i?i:Fa[i]=Get_Fa(Fa[i]);}
}
using namespace BCJ;
int MST[MAXN];//这条边在MST中出现过
int Size;//生成树大小
inline void Kruscal(){
    sort(E+1,E+1+tot,cmp1);
    Init_BCJ();
    Size=0;
    for (register int i=1;i<=tot;++i){
        int fau=Get_Fa(E[i].u),fav=Get_Fa(E[i].v);
        if (fau!=fav){
            AddEdge(E[i].u,E[i].v,E[i].w);
            AddEdge(E[i].v,E[i].u,E[i].w);
            Fa[fau]=fav;
            Size+=E[i].w;
            MST[E[i].id]=true;
        }
    }
    sort(E+1,E+1+tot,cmp2);//再给他sort回去
}
#undef int
int main(){
#define int long long
    int n=read(),m=read();
    for (register int i=1;i<=m;++i){
        int u=read(),v=read(),w=read();
        AddEdge1(u,v,w);
    }
    Kruscal();
    Init();//在生成树上面跑树链剖分
    Build(1,1,n);
    for (register int i=1;i<=m;++i){
        if (MST[i]){
            printf("%lld\n",Size);
        }
        else {
            printf("%lld\n",Size-Query_Chain(E[i].u,E[i].v)+E[i].w);
        }
    }
}
```

