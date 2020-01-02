---
title: 'P2971 [USACO10HOL]牛的政治Cow Politics'
tags:
  - 题解
  - LCA
  - 树的直径
abbrlink: b13f4097
date: 2019-07-22 16:02:07
---

[传送门](https://www.luogu.org/problemnew/show/P2971)

扫了一眼题解，发现没有一个严谨证明的，那么我就来证明一波吧。

首先，我们看一看如何求树的直径：

$1.$随便定一个根节点，第一遍$bfs$求出树中深度最深的节点，记为$u$。

$2 .$以$u$为根节点，第二遍$bfs$求出树中深度最深的点$v$

$3.$树的直径的端点即为$u,v$

------------------

类比到此题：

我们把政党$p$中的牛最深的记为$\max _p$

发现：**$p$政党最长的链一定是某个$p$政党的牛和$\max_p$构成的**（类似于树的直径）

考虑如何证明这个结论，采用反证法（自己画一个图比较好理解）：

>  声明：为了简化证明，我们记$ab$为树上$ab$两点的最短路径，$dep(a)$为节点$a$在树中的深度。

设某个$p$政党的牛$a$和另一个深度小于$\max _p $的牛$b$构成了最长的链。

首先，我们求出$lca (a,b)$，设为$c$，求出$lca(a,\max _p)$，设为$c'$。

我们可以知道，$c'$，$c$有直接的祖先关系，也有可能$c=c'$，简单来说，就是在同一条到根节点的链上。（这一点参见虚树的证明）

考虑两种情况：

$1.$$c'$的祖先为$c$（如图），那我们有$c'\max_ p+cc'+dep(c)=dep({\max_ p})$，且$cb+dep(c)=dep(b)$，

由$dep(b) < dep({\max_ p})$，两式相减，发现$dep(c)$抵消，我们有$cb<c' \max _p+cc'...*$

发现$ab=ac'+c'c+cb$，且$a\max_p=ac'+c'\max_p$，将$*$式代入，我们有$ab=ac'+c'c+cb<ac'+c'c+c'\max _p+c'c=a\max _p+cc' \times 2$

由于$c'$的祖先为$c$，所以$cc'>0$，所以$ab<a\max_p$，假设错误。

![](/images/123.png)

$2.$$c$的祖先为$c$，证明方法差不多，不再赘述。

所以，我们求一波$LCA$，然后预处理出$\max_p$，最后暴力扫过一遍所有的牛，求出答案。

时间复杂度$O(n\log n)$

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
#define MAXM 25
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
inline void Init(int root){
    memset(dep,0,sizeof(dep));
    dfs(root,0);
}
int val[MAXN],maxu[MAXN],maxdep[MAXN],ans[MAXN];
inline int Dis(int u,int v){
    return dep[u]+dep[v]-2*dep[LCA(u,v)];
}
int main(){
    int n=read(),k=read();
    int root;
    for (register int i=1;i<=n;++i){
        int a=read(),p=read();
        val[i]=a;
        AddEdge(i,p),AddEdge(p,i);
        if (!p) root=i;
    }
    Init(root);
    for (register int i=1;i<=n;++i){//预处理
        if (dep[maxu[val[i]]]<dep[i]) maxu[val[i]]=i;
    }
    for (register int i=1;i<=n;++i){
        ans[val[i]]=max(ans[val[i]],Dis(maxu[val[i]],i));
    }
    for (register int i=1;i<=k;++i){
        printf("%d\n",ans[i]);
    }
}
```

