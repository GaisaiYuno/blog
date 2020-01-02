---
title: 'LOJ #6220.sum'
abbrlink: 49aed47d
date: 2019-07-21 20:43:27
tags:
  - 题解
  - 随机化
---

[传送门](https://loj.ac/problem/6220)

大家好，我非常喜欢随机化，所以用$\rm randomshuffle$ AC了此题。

每次$\rm randomshuffle$整个序列，判断前缀的和是否是$n$的倍数。

你一定会怀疑这个算法的时间复杂度，但是它就是AC了，所以不要怀疑$\rm srand(19260817)$，它会让你的程序以$O(-1)$ 的时间跑过数据。

```cpp
#include <bits/stdc++.h>
#define MAXN 1000011
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
int a[MAXN],b[MAXN];
#undef int
int main(){
#define int long long
    srand(19260817);
    int n=read();
    for (register int i=1;i<=n;++i){
        a[i]=read();
    }
    for (register int i=1;i<=n;++i){
        b[i]=i;
    }
    for (register int t=1;t<=100000;++t){
        random_shuffle(b+1,b+1+n);
        int sum=0;
        for (register int i=1;i<=n;++i){
            sum+=a[b[i]];
            if (sum%n==0){
                for (register int j=1;j<=i;++j){
                    printf("%lld %lld\n",b[j],a[b[j]]);
                }
                printf("\n");
                return 0;
            }
        }
    }
}
```

