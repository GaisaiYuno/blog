---
title: SP1296 SUMFOUR - 4 values whose sum is 0
tags:
  - 题解
  - 二分
abbrlink: e606560d
date: 2019-07-31 08:56:41
---

[传送门](https://www.luogu.org/problem/SP1296)

考虑把$A+B+C+D=0$转换成$-A-B=C+D$，于是预处理出$C+D$的数组，sort一遍以后二分查找即可。

时间复杂度$O(n^2\log (n^2))$（反正不会爆就是了）

我以前写的代码，码风可能有点清奇。 

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
using namespace std;
int A[4005], B[4005], C[4005], D[4005];
int SumCD[4005 * 4005];
int main()
{
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++)
    {
        scanf("%d%d%d%d", &A[i], &B[i], &C[i], &D[i]);
    }
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            SumCD[i + j * n] = C[i] + D[j];
        }
    }
    sort(SumCD, SumCD + n * n);
    int ans = 0;
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            int find = A[i] + B[j];
            ans += upper_bound(SumCD, SumCD + n * n, -find) - lower_bound(SumCD, SumCD + n * n, -find);
        }
    }
    printf("%d\n", ans);
}
```

