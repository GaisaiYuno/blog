---
title: 'P2885 [USACO07NOV]电话线Telephone Wire'
tags:
  - 题解
  - 动态规划
abbrlink: 5f08073
date: 2019-07-24 16:49:11
---

[传送门](https://www.luogu.org/problemnew/show/P2885)

（题目描述有毒，这里的树不是指$n$点$n-1$条边的连通图，而是普普通通的树（植物））

考虑$DP$，很容易想到一个$O(n C^2)$的$DP$，令$dp[i][j]$为第$i$棵树**拔到**$j$的高度，且$1$到$i$的所有树之间都连了线的最小花费，我们有：

$dp[i][j]=\min\{dp[i-1][k]+c \times |j-k|\}+(j-h[i])^2$

实际操作过程中，假设一开始最高的树高度为$maxh$，我们发现把一棵树拔到$maxh$以上永远是亏本的，所以不用考虑。

代码，开了$O2$才能在洛谷上面$AC$：

```cpp
// luogu-judger-enable-o2
#include <bits/stdc++.h>
#define MAXN 100005
#define MAXM 105
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
int f[MAXN][MAXM];
int h[MAXN],maxh;
int main(){
    int n=read(),c=read();
    maxh=-0x7fffffff;
    for (register int i=1;i<=n;++i){
        h[i]=read();
        maxh=max(maxh,h[i]);
    }
    for (register int i=h[1];i<=maxh;++i){
        f[1][i]=(i-h[1])*(i-h[1]);
    }
    for (register int i=2;i<=n;++i){
        for (register int j=h[i];j<=maxh;++j){
            f[i][j]=0x7fffffff;
            for (register int k=h[i-1];k<=maxh;++k){
                f[i][j]=min(f[i][j],f[i-1][k]+c*abs(j-k));
            }
            f[i][j]+=(j-h[i])*(j-h[i]);
        }
    }
    int ans=0x7fffffff;
    for (register int i=h[n];i<=maxh;++i){
        ans=min(ans,f[n][i]);
    }
    printf("%d\n",ans);
}
```

考虑如何优化，发现$c \times abs(j-p)$具有单调性，所以就可以$O(nk)$

```cpp
// luogu-judger-enable-o2
#include <bits/stdc++.h>
#define MAXN 100005
#define MAXM 105
#define Calc(p) (f[i-1][p]+c*abs(j-(p)))
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
int f[MAXN][MAXM];
int h[MAXN],maxh;
int main(){
    int n=read(),c=read();
    maxh=-0x7fffffff;
    for (register int i=1;i<=n;++i){
        h[i]=read();
        maxh=max(maxh,h[i]);
    }
    for (register int i=1;i<=n;++i){
        int p=h[i-1];
        for (register int j=h[i];j<=maxh;++j){
            while (p<maxh&&Calc(p+1)<Calc(p)) p++;
            f[i][j]=Calc(p)+(j-h[i])*(j-h[i]);
        }
    }
    int ans=0x7fffffff;
    for (register int i=h[n];i<=maxh;++i){
        ans=min(ans,f[n][i]);
    }
    printf("%d\n",ans);
}
```

