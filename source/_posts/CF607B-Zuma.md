---
title: CF607B Zuma
abbrlink: 9d964d26
date: 2019-07-24 22:48:16
tags:
  - 题解
  - 动态规划

---

[传送门](https://www.luogu.org/problem/CF607B)

我们发现一个很有趣的性质：假设$a[i]==a[j]$且$i<j$，先把$[i+1,j-1]$区间中的回文串消到只剩一个，这一个回文串会和两段的$a[i],a[j]$构成一个更大的回文串，所以在消去这个回文串的同时，顺便消掉两端的$a[i]$和$a[j]$即可。

考虑如下的$dp$方程，$dp[l][r]$为把$[l,r]$全部消完最小的花费。

$1.$$a[l]==a[r]$，为上面讨论过的情况，直接$dp[l][r]=min(dp[l+1][r-1])$即可

$2.$考虑在中间设一个分割点$k$，发现$dp[l][r]=min(dp[l][k]+dp[k+1][r])$

$3.$边界条件，这里我们把$dp[i][i]$设为$1$（长度为$1$的回文串），把$dp[i][i-1]$设为$1$（长度为$0$的回文串）

代码最好用记忆化搜索实现，看起来清晰一点：

```cpp
#include <bits/stdc++.h>
#define MAXN 505
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
int dp[MAXN][MAXN],a[MAXN],n;
int dfs(int l,int r){
    if (dp[l][r]!=0x3f3f3f3f) return dp[l][r];
    if (l==r||l==r+1) return 1;
    if (a[l]==a[r]) dp[l][r]=dfs(l+1,r-1);
    for (register int i=l;i<r;++i){
        dp[l][r]=min(dp[l][r],dfs(l,i)+dfs(i+1,r));
    }
    return dp[l][r];
}
int main(){
    n=read();
    for (register int i=1;i<=n;++i){
        a[i]=read();
    }
    memset(dp,0x3f,sizeof(dp));
    printf("%d\n",dfs(1,n));
}
```

