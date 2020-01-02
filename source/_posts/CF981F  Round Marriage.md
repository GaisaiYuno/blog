---
title: CF981F  Round Marriage 随机
  
tag:
  - 题解
  - 暴力
  - 随机
abbrlink: d7b367ce
date: 2019-07-13 20:34:14
---

[传送门](https://www.luogu.org/problemnew/show/CF981F)
这道题其实可以用暴力水过$qwq$
首先可以知道一个暴力做法如下，具体地来说可以用调整法证明其正确性，但是过不了所有的点。

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>
#define MAXN 200005
using namespace std;
int A[MAXN], B[MAXN];
int l;;
inline int read(){
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9'){
        if (ch=='-') f=-1;
        ch=getchar();
    }
    while (ch>='0'&&ch<='9'){
        x=(x<<1)+(x<<3)+ch-'0';
        ch=getchar();
    }
    return x*f;
}
inline int max(int a, int b){
    return a > b ? a : b;
}
inline int min(int a, int b){
    return a < b ? a : b;
}
inline int calc(int a, int b){
    int dis = a > b ? a - b : b - a;
    return min(dis, l - dis);
}
int num1[MAXN],num2[MAXN];
int main(){
    int n;
    n=read(),l=read();
    for (register int i = 0; i < n; ++i){
        A[i]=read();
    }
    for (register int i = 0; i < n; ++i){
        B[i]=read();
    }
    sort(A, A + n);
    sort(B, B + n);
    int minmax = 0x7fffffff;
    for (register int i = 0; i <n; ++i){
        int maxn = -0x7fffffff;
        for (register int j = 0; j <n; ++j){
            maxn = max(maxn, calc(A[j], B[(i + j >= n) ? (i + j - n) : (i + j)]));
        }
        minmax = min(minmax, maxn);
    }
    printf("%d\n", minmax);
    return 0;
}
```

然后，我们有一个比较显然的优化：如果当前最大值已经比最小的最大值要大的话，就$break$掉。

```cpp
for (register int i = 0; i <n; ++i){
    int maxn = -0x7fffffff;
    for (register int j = 0; j <n; ++j){
        maxn = max(maxn, calc(A[j], B[(i + j >= n) ? (i + j - n) : (i + j)]));
        if (maxn >= minmax){
            break;
        }
    }
    minmax = min(minmax, maxn);
}
```
但是，显然这个程序在随机数据下表现良好，但是会被一些特殊数据卡掉。。。比如说这个程序就$T$在了第24个点

什么？你要写二分？**too young too naive**！如果数据不是随机的，我们就“构造”出随机的数据，比如说，用random_shuffle优化枚举顺序

```cpp
#pragma GCC optimize (2)
#pragma G++ optimize (2)
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>
#define MAXN 200005
using namespace std;
int A[MAXN], B[MAXN];
int l;;
inline int read(){
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9'){
        if (ch=='-') f=-1;
        ch=getchar();
    }
    while (ch>='0'&&ch<='9'){
        x=(x<<1)+(x<<3)+ch-'0';
        ch=getchar();
    }
    return x*f;
}
inline int max(int a, int b){
    return a > b ? a : b;
}
inline int min(int a, int b){
    return a < b ? a : b;
}
inline int calc(int a, int b){
    int dis = a > b ? a - b : b - a;
    return min(dis, l - dis);
}
int num1[MAXN],num2[MAXN];
int main(){
    int n;
    n=read(),l=read();
    for (register int i = 0; i < n; ++i){
        //scanf("%d", &A[i]);
        A[i]=read(),num1[i]=i;
    }
    for (register int i = 0; i < n; ++i){
        //scanf("%d", &B[i]);
        B[i]=read(),num2[i]=i;
    }
    random_shuffle(num1,num1+n);
    random_shuffle(num2,num2+n);
    sort(A, A + n);
    sort(B, B + n);
    int minmax = 0x7fffffff;
    for (register int ii = 0; ii <n; ++ii){
        int maxn = -0x7fffffff;
        for (register int jj = 0; jj <n; ++jj){
            int i=num1[ii],j=num2[jj];
            maxn = max(maxn, calc(A[j], B[(i + j >= n) ? (i + j - n) : (i + j)]));
            if (maxn >= minmax){
                break;
            }
        }
        minmax = min(minmax, maxn);
    }
    printf("%d\n", minmax);
    return 0;
}
```

然后就$A$了 $hhh...$