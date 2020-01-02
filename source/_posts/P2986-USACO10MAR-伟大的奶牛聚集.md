---
title: 'P2986 [USACO10MAR]伟大的奶牛聚集'
tags:
  - 题解
  - 树形dp
  - 动态规划
  - 图论
abbrlink: db7b4afe
date: 2019-08-30 22:59:55
---

[传送门](https://www.luogu.org/problem/P2986)

考虑预处理出$sz$数组，表示子树的大小，处理出来$val[u]$数组，表示$u$的子树里面的所有奶牛到$u$集合的不方便度。

于是$dp$就十分简单，初始化$dp[1]=val[1]$，然后考虑集合地点从$u$变到$v$，$v$子树里面的所有奶牛都会少走$w$路程，而剩下奶牛都会都走$w$路程。

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
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
int C[MAXN];
struct Edge{
    int to,len;
};
vector<Edge>G[MAXN];
inline void AddEdge(int u,int v,int w){
    G[u].push_back(Edge{v,w});
}
int sz[MAXN],sum;
int val[MAXN],dp[MAXN];
void init(int u,int father){
    sz[u]=C[u];
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to,w=G[u][i].len;
        if (v!=father){
            init(v,u);
            sz[u]+=sz[v];
            val[u]+=val[v];
            val[u]+=sz[v]*w;
        }
    }
}
int ans;
void dfs(int u,int father){
    ans=min(ans,dp[u]);
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to,w=G[u][i].len;
        if (v!=father){
            dp[v]=dp[u]-sz[v]*w+(sz[1]-sz[v])*w;
            dfs(v,u);
        }
    }
}
#undef int
int main(){
#define int long long
    int n=read();
    for (register int i=1;i<=n;++i){
        C[i]=read();
    }
    for (register int i=1;i<n;++i){
        int u=read(),v=read(),w=read();
        AddEdge(u,v,w);
        AddEdge(v,u,w);
    }
    init(1,1);
    ans=1e15;
    dp[1]=val[1];
    dfs(1,1);
    printf("%lld\n",ans);
}
```

