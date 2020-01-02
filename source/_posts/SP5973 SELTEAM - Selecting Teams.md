---
title: SP5973 SELTEAM - Selecting Teams
  
tag:
  - 题解
  - 组合数
  - 数学
abbrlink: d0c5fa
date: 2019-07-13 20:34:14
---
[传送门](https://www.luogu.org/problemnew/show/SP5973)

考虑先选$p$名队员，方法数为$C^p_n$，其中$1\le p\le k$，然后从$p$名队员中钦定一名队长，方法数为$p$，其他的队员可选可不选，有$2^{p-1}$种方法。
所以总的方案数为
$$\sum^k_{p=1}C^p_n \times p \times 2^{p-1}$$
但是这似乎也没什么用，算这个式子的复杂度为$O(k)$，有$T$组数据，总复杂度为$O(Tk)$。
经过一(cha)番(zhao)思(ti)考(jie)后发现模数$8388608=2^{23}$，所以对于$p \ge 24$，$C^p_n \times p \times 2^{p-1}=0$，可以不用考虑。
所以单次查询时间复杂度为$O(min(k,23))$，总复杂度为$O(min(k,23) \times T)$，可以过。

```cpp
#include <bits/stdc++.h>
#define MOD 8388608
#define MAXN 1000005
#define MAXK 30
#define ll long long
using namespace std;
ll C[MAXN][MAXK],pow2[MAXK];
inline void Init(){
    for (register int i=0;i<MAXN;++i){
        C[i][0]=1;
        for (register int j=1;j<=min(23,i);++j){
            C[i][j]=(C[i-1][j-1]+C[i-1][j])%MOD;
        }
    }
    pow2[0]=1;
    for (register int i=1;i<MAXK;++i){
        pow2[i]=pow2[i-1]<<1ll;
    }
}
int main(){
    Init();
    int T;
    scanf("%d",&T);
    while (T--){
        ll n,k;
        scanf("%lld%lld",&n,&k);
        ll ans=0;
        for (register int i=1;i<=min(k,23ll);++i){
            ans=(ans+pow2[i-1]*(ll)i*C[n][i])%MOD;
        }
        printf("%lld\n",ans);
    }
}
```

p.s.这种在模数上下坑的题目我还是第一次见到