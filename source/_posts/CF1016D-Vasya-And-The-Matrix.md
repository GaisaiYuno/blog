---
title: CF1016D Vasya And The Matrix
abbrlink: 2bddaeb1
date: 2019-07-24 23:09:26
tags:
  - 题解
  - 异或

---

[传送门](https://www.luogu.org/problem/CF1016D)

考虑异或的性质：(a xor b) xor b=a，且a xor b = b xor a

先判断不合法的情况，由异或交换律，我们知道$a$数组异或和，$b$数组异或和都是整个数组的异或和，所以这两个值一样的。

我们不妨这么想，我们知道x1 xor x2 xor x3 xor x4 ... xor xn-1，知道x1 xor x2 xor x3 xor x4 ... xor xn，把他们两异或一下，就能知道xn，xn是唯一且一定有解的。

从简单考虑，我们就把$ans[i][j](i<n 且 j<m)$ 设成$0$（设成任意的数理论上都是没有问题的，只是$0$在这里比较方便），显然$ans[i][0]$ xor $ans[i][1]$ xor $ans[i][2]$ xor ...$ans[i][m-1]=0$，我们把这个带到上面的式子里，我们发现$ans[i][m]=0$ xor $a[i]=a[i]$，同理$ans[n][j]=a[j]$。

最后还差一个$ans[n][m]$，还是套到上面的式子里面，就可以求出$ans[n][m]$

```cpp
#include <bits/stdc++.h>
#define MAXN 105
#include <cstdio>
#include <iostream>
namespace fast_io
{
inline char read()
{
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    return s == t ? (((t = (s = buf) + fread(buf, 1, IN_LEN, stdin)) == s) ? -1 : *s++) : *s++;
}
inline void read(int &x)
{
    static bool iosig;
    static char c;
    for (iosig = false, c = read(); !isdigit(c); c = read())
    {
        if (c == '-')
            iosig = true;
        if (c == -1)
            return;
    }
    for (x = 0; isdigit(c); c = read())
        x = ((x + (x << 2)) << 1) + (c ^ '0');
    if (iosig)
        x = -x;
}
inline void read(char *a)
{
    static char c = read();
    while (c != -1 && (c == ' ' || c == '\n' || c == '\r'))
        c = read();
    while (c != -1 && c != '\r' && c != ' ' && c != '\n')
        *a++ = c, c = read();
    *a = 0;
}
const int OUT_LEN = 1000000;
char obuf[OUT_LEN], *ooh = obuf;
inline void print(char c)
{
    if (ooh == obuf + OUT_LEN)
        fwrite(obuf, 1, OUT_LEN, stdout), ooh = obuf;
    *ooh++ = c;
}
inline void print(int x)
{
    static int buf[30], cntt;
    if (x == 0)
        print('0');
    else
    {
        if (x < 0)
            print('-'), x = -x;
        for (cntt = 0; x; x /= 10)
            buf[++cntt] = x % 10 + 48;
        while (cntt)
            print((char)buf[cntt--]);
    }
}
inline void print(char *a)
{
    while (*a)
        print(*a++);
}
inline void flush() { fwrite(obuf, 1, ooh - obuf, stdout); }
} // namespace fast_io
using namespace fast_io;
int max(int a, int b)
{
    return a > b ? a : b;
}
int min(int a, int b)
{
    return a < b ? a : b;
}
using namespace std;
long long a[MAXN],b[MAXN];
long long ans[MAXN][MAXN];
int main()
{
    int n,m;
    scanf("%d%d",&n,&m);
    long long sum1=0,sum2=0;
    for (int i=1;i<=n;i++){
        scanf("%I64d",&a[i]);
        sum1^=a[i];
    }
    for (int i=1;i<=m;i++){
        scanf("%I64d",&b[i]);
        sum2^=b[i];
    }
    if (sum1!=sum2){
        puts("NO");
        return 0;
    }
    else {
        puts("YES");
    }
    long long sum3=0,sum4=0;
    for (int i=1;i<=n-1;i++){
        ans[i][m]=a[i];
        sum3^=a[i];
    }
    for (int i=1;i<=m-1;i++){
        ans[n][i]=b[i];
        sum4^=b[i];
    }
    ans[n][m]=a[n]^sum4;
    for (int i=1;i<=n;i++){
        for (int j=1;j<=m;j++){
            printf("%I64d ",ans[i][j]);
        }
        printf("\n");
    }
}
```

