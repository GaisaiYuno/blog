---
title: CF735D Taxes
abbrlink: 20ee6331
date: 2019-07-30 09:16:51
tags:
  - 题解
  - 数学

---

[传送门](https://www.luogu.org/problem/CF735D)

一道比较有意思的数学题。

首先，根据贪心的原理，最好把$n$全部分成质数。

考虑分类讨论，

1.$n==1$或$n==2$，显然答案是$1$

2.$n>2$且$n$为偶数，也就是$n \geq 4$，由哥德巴赫猜想，发现$n$可以分成两个质数之和，所以答案为$2$

3.$n>2$且$n$为奇数，

还是分成两种情况：

a.$n$为质数，答案为$1$，

b.$n$不为质数，发现$n$至少为$9$，这样比较好办，先从$n$里面分出一个$3$，剩下的由哥德巴赫猜想可以分成两个质数，答案为$3$

在具体实现时，发现有更简洁的写法：

```cpp
if (isprime(n)) p(1);
else if (n%2==0||isprime(n-2)) p(2);
else p(3);
```

也就是把很多情况合起来写罢了。

```cpp
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <vector>
#define p(a) printf("%d\n",a)
using namespace std;
inline bool isprime(register int x){
    for (register int i=2;i*i<=x;++i){
        if (x%i==0){
            return false;
        }
    }
    return true;
}
int main(){
    int n;
    scanf("%d",&n);
    if (isprime(n)) p(1);
    else if (n%2==0||isprime(n-2)) p(2);
    else p(3);
}
```

