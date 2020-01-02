---
title: '[POJ2229] [USACO 2005 January Silver] Sum sets '
abbrlink: 8d0fe55e
date: 2019-07-24 23:30:12
tags:
  - 题解
  - 动态规划
  - 背包
  - 完全背包

---

一个裸的完全背包，考虑将$2^k$当做物品，做完全背包即可。

```cpp
#include <iostream>
#include <cstdio>
#define MAXN 1000005
#define MAXM 24
#define MOD 1000000000
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
int pow2[MAXN];
int dp[MAXN];//dp[i]和为i的方法数
int main(){
    int n=read();
    for (register int i=0;i<MAXM;++i){
        pow2[i]=(1<<i);
    }
    dp[0]=1;
    for (register int j=0;j<MAXM;++j){
        for (register int i=1;i<=n;++i){
            if (i-pow2[j]>=0){
                dp[i]+=dp[i-pow2[j]];
                dp[i]%=MOD;
            }
        }
    }
    printf("%d\n",dp[n]);
}
```

