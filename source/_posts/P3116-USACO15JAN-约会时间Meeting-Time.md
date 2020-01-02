---
title: P3116 [USACO15JAN]约会时间Meeting Time 拓扑排序
tags:
  - 题解
  - 拓扑排序
  - 图论
  - 动态规划
abbrlink: abe8eb3f
date: 2019-07-15 21:30:40
---

考虑$\rm dp$，其中$f1[i][j]$表示由起点到达$i$，走的是路径$1$，路径总长度为$j$的方法可不可行，$f2$类似，拓扑排序的过程中大力转移即可。

转移过程类似背包问题。

好像可以用$\rm bitset$优化，少一些常数。

-------------------------

注意输出$\rm IMPOSSIBLE!$

```cpp
// luogu-judger-enable-o2
#include <bits/stdc++.h>
#define MAXN 105
#define MAXE 10005
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
struct Edge{
    int to,l1,l2;
};
vector<Edge>G[MAXN];
int in[MAXN];
inline void AddEdge(int u,int v,int l1,int l2){
    in[v]++;
    Edge temp;
    temp.to=v;
    temp.l1=l1;
    temp.l2=l2;
    G[u].push_back(temp);
}
int f1[MAXN][MAXE],f2[MAXN][MAXE];
int main(){
    int n=read(),m=read();
    for (register int i=1;i<=m;++i){
        int u=read(),v=read(),l1=read(),l2=read();
        AddEdge(u,v,l1,l2);
    }
    queue<int>Q;
    for (register int i=1;i<=n;++i){
        if (!in[i]) Q.push(i);
    }
    f1[1][0]=f2[1][0]=true;
    while (Q.size()){//拓扑排序
        int u=Q.front();Q.pop();
        for (register int i=0;i<G[u].size();++i){
            int v=G[u][i].to,l1=G[u][i].l1,l2=G[u][i].l2;
            in[v]--;
            for (register int j=0;j<MAXE;++j){//顺便统计一下dp
                if (j+l1<MAXE) f1[v][j+l1]|=f1[u][j];
                if (j+l2<MAXE) f2[v][j+l2]|=f2[u][j];
            }
            if (!in[v]) {
                Q.push(v);
            }
        }
    }
    for (register int i=0;i<MAXE;++i){
        if (f1[n][i]&&f2[n][i]) {
            printf("%d\n",i);
            return 0;
        }
    }
    printf("IMPOSSIBLE");
}
```