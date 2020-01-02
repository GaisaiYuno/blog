---
title: 'P3007 [USACO11JAN]大陆议会The Continental Cowngress'
abbrlink: 9eef84b4
date: 2019-08-06 09:54:08
tags:
  - 题解
  - 暴力
  - 2-SAT
---

[洛谷](https://www.luogu.org/problem/P3007)

[GDOI](http://119.29.55.79/problem/369)

首先，按照$2-SAT$问题的套路，我们要把这个转化成**依赖性问题**

又发现一只奶牛刚好投两次票，所以只要不满足奶牛的其中一次投票，就要满足另一次，这样就转化成了依赖性问题。

但是，这道题还要输出$"?"$，怎么搞

再看一眼数据范围$1 \le N \le 1000$，这样小的数据范围，暴力都能过。

于是不妨从两个相对的节点$bfs$一遍，如果他们两个都没有矛盾，那么输出$?$，如果一个有矛盾，那么输出$Y/N$，如果都有矛盾，那么输出$IMPOSSIBLE$。

```cpp
#include <bits/stdc++.h>
#define MAXN 4005
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
int vis[MAXN],n,m;
inline int Other(int u){
    if (u<=n) return u+n;
    else return u-n;
}
inline bool bfs(int s){
    memset(vis,0,sizeof(vis));
    queue<int>Q;
    Q.push(s);
    while (Q.size()){
        int u=Q.front();Q.pop();
        vis[u]=true;
        if (vis[Other(u)]) return false;
        for (register int i=0;i<G[u].size();++i){
            int v=G[u][i];
            if (!vis[v]) Q.push(v);
        }
    }
    return true;
}
inline char gc(){
    char ch=getchar();
    while (ch!='Y'&&ch!='N') ch=getchar();
    return ch=='Y';
}
int main(){
    n=read(),m=read();
    //1 ... n赞成票
    //n+1 ... 2*n反对票
    for (register int i=1;i<=m;++i){
        int u=read(),f1=gc(),v=read(),f2=gc();
        AddEdge(u+(!f1)*n,v+f2*n);
        AddEdge(v+(!f2)*n,u+f1*n);
    }
    string Ans="";
    for (register int i=1;i<=n;++i){
        bool True=bfs(i),False=bfs(Other(i));
        if (!True&&!False){
            puts("IMPOSSIBLE");
            return 0;
        }
        else if (True&&!False){
            Ans+='N';
        }
        else if (False&&!True){
            Ans+='Y';
        }
        else {
            Ans+='?';
        }
    }
    cout<<Ans<<endl;
}
```

