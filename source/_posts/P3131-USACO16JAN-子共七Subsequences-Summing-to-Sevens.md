---
title: 'P3131 [USACO16JAN]子共七Subsequences Summing to Sevens'
tags:
  - 题解
  - 前缀和
abbrlink: f084de21
date: 2019-07-27 15:07:24
---

[传送门](https://www.luogu.org/problem/P3131 )

为什么你们的题解都写得这么长。

考虑前缀和，设$a[i]$的前缀和数组为$sum[i]$，则我们有$\sum _{i=x} ^y a[i]=sum[y]-sum[x-1]$，因为$\sum _{i=x} ^y a[i] \mod 7 = 0$，所以我们有$sum[y]-sum[x-1] \mod 7= 0$，即$sum[y]$和$sum[x-1]$模$7$同余。

考虑贪心，我们设$last[i]=\min \{ j , sum[j] \mod 7 = i\}$，就可以求出模$7$意义下离现在位置$y$最远的$x$，满足$sum[x-1]$和$sum[y]$同余，就可以搞定了。

记得每步都%7，要不然可能会爆$\rm int$
```cpp
#include <bits/stdc++.h>
#define MAXN 500005
using namespace std;
int a[MAXN],last[7];
int main(){
    int n;
    scanf("%d",&n);
    for (register int i=1;i<=n;++i) scanf("%d",&a[i]);
    memset(last,0x3f,sizeof(last));
    int ans=0;
    for (register int i=1;i<=n;++i){
        a[i]=(a[i]+a[i-1])%7;
        ans=max(ans,i-last[a[i]]);
        last[a[i]]=min(last[a[i]],i);
    }
    printf("%d\n",ans);
}
```