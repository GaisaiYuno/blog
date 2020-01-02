---
title: '[HDU5807] [BestCoder Round #86 1004] Keep In Touch '
tags:
  - 题解
  - 图论
  - 动态规划
abbrlink: f14e4c76
date: 2019-07-25 09:59:05
---

[传送门](http://acm.hdu.edu.cn/showproblem.php?pid=5807 )

## $Pro$

有n个城市，编号依次为1到n，同时有m条单向道路连接着这些城市，其中第i条道路的起点为Ui，终点为Vi 。(1<=Ui < Vi <= n)。
特工团队一共有3名成员：007，008，以及009，他们将要执行q次秘密任务。

在每次任务中，三人可能会处于三个不同的城市，他们互相之间通过对讲机保持联络。编号为i的城市的无线电频为Wi，如果两个城市的无线电频差值的绝对值不超过K，那么无线电就可以接通。三个特工每个时刻必须要选择一条道路，走到下一个城市，每条道路都只需要花费1单位时间。
他们可以选择在任意城市终止任务，甚至可以在起点就终止任务，但不允许在道路上终止任务。现在他们想知道，对于每次任务，给定三个人的起始位置，有多少种可能的合法行动方案，使得行动过程中任意在城市的时刻，他们都可以两两联络？

两个方案被视作不同当且仅当至少存在一个人在某一时刻所在的城市不同。

## $Sol$

考虑一个$O(n^6)$的$dp$，我们设$dp[i][j][k]$为第一个人到$i$，第二个人到$j$，第三个人到$j$的方法数，每次都枚举后继的节点，但是这样会$TLE$

考虑如何优化，不妨不要让他们随便走，而是轮流走，第一人先走，第二人其次，第三人最后。

考虑设一个四维的$dp[sta][i][j][k]$，其中$sta==0$，表示三人都分别在现在的$i$，$j$，$k$，$sta==1$，表示第一人在现在的$i$，第二人和第三人在上一次的$j$，$k$，$sta==2$，表示第一人和第二人在现在的$i$，$j$，但是第三人还在上次的$k$。

假设三人编号为$a$，$b$，$c$，那么我们可以画出如下的图：

![](/images/man1.png)

![](/images/man2.png)

![](/images/man3.png)

转移非常简单，这里不再赘述。

```cpp
#include <bits/stdc++.h>
#define MAXN 55
#define MOD 998244353
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
int w[MAXN];
int dp[3][MAXN][MAXN][MAXN];
int G[MAXN][MAXN];
inline int alb(int x){
    return x>0?x:-x;
}
inline void inc(int &x,int y){
    x=(x+y)%MOD;
}
int n,m,c,q;
int main(){
    int T=read();
    while (T--){
        memset(G,0,sizeof(G));
        n=read(),m=read(),c=read(),q=read();
        for (register int i=1;i<=n;++i){
            w[i]=read();
        }
        for (register int i=1;i<=m;++i){
            int u=read(),v=read();
            G[u][v]=1;
        }
        for (register int i=n;i>=1;--i){
            for (register int j=n;j>=1;--j){
                for (register int k=n;k>=1;--k){
                    dp[0][i][j][k]=1,dp[1][i][j][k]=dp[2][i][j][k]=0;
                    if (max(max(alb(w[i]-w[j]),alb(w[j]-w[k])),alb(w[k]-w[i]))>c){
                        dp[0][i][j][k]=0;
                    }
                    else {
                        for (register int u=k+1;u<=n;++u){
                            if (G[k][u]) inc(dp[0][i][j][k],dp[2][i][j][u]);
                        }
                    }
                    for (register int u=i+1;u<=n;++u){
                        if (G[i][u]) inc(dp[1][i][j][k],dp[0][u][j][k]);
                    }
                    for (register int u=j+1;u<=n;++u){
                        if (G[j][u]) inc(dp[2][i][j][k],dp[1][i][u][k]);
                    }
                }
            }
        }
        while (q--){
            int x=read(),y=read(),z=read();
            printf("%d\n",dp[0][x][y][z]);
        }
    }
}
```

