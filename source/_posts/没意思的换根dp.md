---
title: 没意思的换根dp
tags:
  - 题解
  - 树形dp
abbrlink: 3b8720a9
date: 2019-11-13 22:37:31
---

![](https://ae01.alicdn.com/kf/Ha0352971b2014aa5abb437aedb49c245K.png)

这题真的很套路，很没意思。

考虑换根dp，然后就是爆拆式子：

![](https://ae01.alicdn.com/kf/H6e79afe259234b9193a76b9fe78f00453.png)

（$A$为除去$u$之后的$u$子树，$B$为除去$v$之后的$v$子树）

以$u$为根：

$\sum _{i \in A} dis(i,u)^2 c[i]+w^2c[v]+\sum _{i\in B}dis(i,u)^2c[i]$

以$v$为根：

$\sum_{i\in A}dis(i,v)^2c[i]+w^2c[u]+\sum _{i\in B}dis(i,v)^2c[i]$

注意到$i\in A$时，$dis(i,u)=dis(i,v)+w$，

$i\in B$时，$dis(i,u)=dis(i,v)-w$。

然后就是爆拆式子：

第一部分的$Delta1$

$\sum _{i \in A} dis(i,u)^2 c[i]-\sum_{i\in A}dis(i,v)^2c[i]$

$=\sum _{i \in A} (dis(i,v)+w)^2 c[i]-\sum_{i\in A}dis(i,v)^2c[i]$

$=\sum _{i \in A} (dis(i,v)^2+2w \times dis(i,v)+w^2)c[i]-\sum_{i\in A}dis(i,v)^2c[i]$

$=2w \times \sum_{i\in A} dis(i,v) c[i]+w^2 \times \sum _{i\in A} c[i]$

然后要维护后面两个值，发现第一个并不是很好维护，于是我们又要再一次换根来求出这个毒瘤东西。

细节部分自己看吧。

考试时因为没有考虑到$1$不一定在$v$子树里面，然后直接用了以$1$为根的子树值，然后调了$1h$才发现，血亏。

第二部分的$Delta2$

长得这个样子，自己推吧：

$-\sum _{i\in B}dis(i,v)c[i]+w^2 \times _{i\in B} c[i]$

细节部分自己注意。

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
#define ld long double
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
ld sum_dis_c[MAXN],sum_c[MAXN],asroot[MAXN];
//以u为根的sum_dis_c
ld c[MAXN];
ld Ans,ret;
namespace Tree{
    struct Edge{
        int to;
        ld len;
    };
    vector<Edge>G[MAXN];
    inline void AddEdge(int u,int v,ld w){
        G[u].push_back(Edge{v,w});
    }
    void dfs(int u,int father){//先初始化sum_dis_c[MAXN],sum_c[MAXN]
        for (register int i=0;i<(int)G[u].size();++i){
            int v=G[u][i].to,w=G[u][i].len;
            if (v==father) continue;
            dfs(v,u);
            sum_dis_c[u]+=sum_dis_c[v]+w*sum_c[v];//提起来了w的距离
            sum_c[u]+=sum_c[v];//加上子树的sum_c
        }
        sum_dis_c[u]+=0*c[u];
        sum_c[u]+=c[u];
    }
    void Init(int u,int father,ld Len){
        Ans+=c[u]*Len*Len;
        for (register int i=0;i<(int)G[u].size();++i){
            int v=G[u][i].to,w=G[u][i].len;
            if (v==father) continue;
            Init(v,u,Len+w);
        }
    }
}
using namespace Tree;
void Init2(int u,int father){
    for (register int i=0;i<(int)G[u].size();++i){
        int v=G[u][i].to,w=G[u][i].len;
        if (v==father) continue;
        asroot[v]=asroot[u]-w*sum_c[v]+w*(sum_c[1]-sum_c[v]);
        Init2(v,u);
    }
}
void Solve(int u,int father){
    ret=min(ret,Ans);
    for (register int i=0;i<(int)G[u].size();++i){
        int v=G[u][i].to,w=G[u][i].len;
        if (v==father) continue;
        ld Delta1=2.00*(asroot[u]-sum_dis_c[v]-sum_c[v]*w)*w+(sum_c[1]-sum_c[v]-c[u])*w*w;
        ld Delta2=-2.00*(sum_dis_c[v]+w*sum_c[v]-w*c[v])*w+(sum_c[v]-c[v])*w*w;
        ld Delta=Delta1+Delta2-c[v]*w*w+c[u]*w*w;
        Ans+=Delta;
        Solve(v,u);
        Ans-=Delta;
    }
}
int main(){
    int n=read();
    for (register int i=1;i<=n;++i){
        scanf("%Lf",&c[i]);
    }
    for (register int i=1;i<n;++i){
        int u,v;
        ld w;
        scanf("%d%d%Lf",&u,&v,&w);
        AddEdge(u,v,w);
        AddEdge(v,u,w);
    }
    dfs(1,1);
    Init(1,1,0);
    asroot[1]=sum_dis_c[1];
    Init2(1,1);
    ret=1e23;
    Solve(1,1);
    printf("%.7Lf\n",ret);
}
```

