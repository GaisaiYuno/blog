---
title: CF1202D Print a 1337-string...
abbrlink: 4813dbf2
date: 2019-08-07 23:55:38
tags:
  - 题解
  - 数学
---

[传送门]()

加不了了，因为CF挂了。

## $Pro$

给你$n$，$n \le 10^9$，要你输出一个字符串$s$，使得$s$有$n$个子串为$1337$，且$|s|\le 10^5$

## $Sol$

1.$1337......7$，$n$个$7$？但是题目说$|s| \le 10^5$，绝对会挂掉。

2.$1.......1337......7$？前面$a$个$1$，$b$个$7$，只要找到$a,b$，使得$a \times b = n$即可，但是$n$为质数时就挂了。

$3.$考虑$1337$这样串的特性，发现$1$和$7$只能对答案造成$n$级别的贡献，但是$3$能对答案造成$n^2$级别的贡献。

构造一个这样的串$1....13....31...13....31....13...37$

这样我们有足够多的$3$，可能对答案造成很多贡献。

继续yy，发现一个$1$对答案的贡献是$($它后面$3$的个数$)*($它后面$3$的个数$-1)/2$。

于是，我们要把$n$拆分成$\sum \frac{\dfracmes(i-1)}{2} \times j$的形式。

第一眼看上去，我们预处理$\frac \dfracimes (i-1)}{2}$，这不就是裸的背包吗？

但是仔细考虑之后，发现原来比背包还要简单，因为$2 \times 1 /2 =1$，所以保证了有解，而且$\frac {i \times (i\dfrac2}$分布得比较紧密，完全可以用一个贪心算法求出解：

```cpp
while (n>0){
    int pos=upper_bound(Data+1,Data+MAXN,n)-Data-1;
    vis[pos]++;
    n-=Data[pos];
}
```

求出解后，我们得到了$vis$数组，代表你需要$vis[i]$个$1$，它的后面有$i$个$3$。

这不就好搞了吗，差分一下即可。

为什么串的长度能控制在$10^5$之内，感性理解一下，取数是贪心取的，串中$3$的数量大概就是$\sqrt n$级别的，然而$\sqrt {10^9} < 10^5$，再算上$1$和$7$之类的边边角角大概不会超过。

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
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
int Data[MAXN];
int vis[MAXN];
inline void Put(char ch,int t){
    for (register int i=1;i<=t;++i){
        putchar(ch);
    }
}
#undef int
int main(){
#define int long long
    int t=read();
    for (register int i=1;i<MAXN;++i){
        Data[i]=i*(i+1)/2ll;
    }
    while (t--){
        int n=read();
        memset(vis,0,sizeof(vis));
        while (n>0){
            int pos=upper_bound(Data+1,Data+MAXN,n)-Data-1;
            vis[pos]++;
            n-=Data[pos];
        }
        int lst=-1;
        for (register int i=MAXN-1;i>=0;--i){
            if (vis[i]){
                if (lst!=-1) Put('3',lst-i);
                Put('1',vis[i]);
                lst=i;
            }
        }
        Put('3',lst+1);
        Put('7',1);
        printf("\n");
    }
}
```