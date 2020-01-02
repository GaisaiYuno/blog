---
title: KMP详解
abbrlink: 428b39ea
date: 2019-10-27 17:36:56
tags:
  - 字符串
  - KMP
---

我们有两个字符串：

A="abbaabbbabaa"

B="abbaaba"

显然第一个位置不能匹配：

```
abbaabb(x)babaa
abbaaba(x)
```

我们要不要暴力移动？

```
abbaabbbabaa
 abbaaba
```

显然不是最优的！

考虑我们1~7位已经匹配了，说明$A[1 \to 7] = B[1 \to 7]$

我们需要找到一个位置$i$，使得$A[7-i+1 \to 7] = B[1 \to i]$

这样我们直接跳到$i$即可。

```
abbaabbbabaa
    abbaaba
(i=3)
```

注意到$A[1 \to 7]=B[1 \to 7]$。

即$B[7-i+1 \to 7]=B[1\to i]$

于是要找到$i$，等于找到一个位置$i$，使得$B$的前$i$位和后$i$位相等。

（这样的字符串$B[1 \to i]$称为$B$的border）

怎么办？

可以搞出一个$next[x]$数组，表示$B$的前$x$位的最长border的长度。

为什么是最大，明明所有满足前缀=后缀的$i$都是合法的？

仔细考虑一件事情，考虑$A$中最大的border，肯定是$A[1 \to next[n]]$（蓝色）

考虑$A$中第二大的border​，肯定是$A[1 \to next[next[n]]]$（红色）

为什么？

考虑一个比红色字符串长的字符串（绿色），如果它是$A$的border，这样可以推出最左边和最右边的两个绿色字符串相等，又因为两个蓝色字符串相等，就可以推出中间两个绿色字符串和两边的绿色字符串相等，可以推出它是蓝色字符串的border，说明$next[next[n]]$可以取得更大，推出矛盾。

![](https://ae01.alicdn.com/kf/H849d6493d9214b05b3ee8e7cc3ea2162z.png)

于是我们可以顺着$next$数组向前跳，肯定是从大到小遍历了$A$的所有border。



顺便扯几句，如果对于所有的$i \in [1,n]$我们把$i$向$next[i]$连一条边，就会形成一棵树，因为显然$next[i]<i$。

这样就可以构成一棵fail树，有很多奇妙的性质。

对于字符串abaabaa，它的$next$数组：

| 1    | 2    | 3    | 4    | 5    | 6    | 7    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0    | 0    | 1    | 1    | 2    | 3    | 4    |

构建出来fail树。

![](https://ae01.alicdn.com/kf/H9cd674cd278848b2848f691119c831ccI.png)

fail树有什么性质呢？

假设我们现在有一个节点$x$，那么对于$x$的子树里面的节点$y$，满足$A[1 \to x]$是$A[1 \to y]$的border。

对于$x$的祖先$z$，满足$A[1 \to z]$是$A[1 \to x]$的border。



不扯淡了，考虑如何构建$next$数组。

![](https://ae01.alicdn.com/kf/H76ea326661a44dc281a7e65906023fd9O.png)

考虑一个类似于$dp$的做法，从大到小遍历$next$数组，并且开一个指针$j$维护现在匹配的哪里。

然后每次暴力跳（往$next[j]$跳，即跳到父节点），跳到一个位置$j$，满足$a[j+1]==a[i]$即可。

为什么每次暴力跳完之后不用指针归位，考虑到我们找到的是最大的$next[i]$，所以可以从上一个位置继续跳，这是保证KMP时间复杂度正确的主要因素。

求nex部分代码：

```cpp
int j=0;
for (register int i=2;i<=n;++i){
	while (j&&a[j+1]!=a[i]) j=nex[j];
	if (a[j+1]==a[i]) j++;
	nex[i]=j;
}
```

如何证明时间复杂度，再从fail树的角度考虑。

每次求$next$，就等于是从上次跳到的位置向上到某个祖先，然后向下挂一个节点，位置移动到哪个节点。

显然每个节点最多只会被跳到一次。

于是复杂度是$O(n)$的。

求两个字符串之间的匹配也比较相似，不再赘述：

```cpp
j=0;
for (register int i=1;i<=m;++i){
	while (j&&a[j+1]!=b[i]) j=nex[j];
	if (a[j+1]==b[i]) j++;
	if (j==n) printf("%d\n",i-n+1);
}
```

模板题：

https://www.luogu.org/problem/P3375

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
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
int nex[MAXN];
int main(){
	char a[MAXN],b[MAXN];
	scanf("%s",b+1);
	scanf("%s",a+1);
	int n=strlen(a+1),m=strlen(b+1);
	memset(nex,0,sizeof(nex));
	int cnt=0,j=0;
	for (register int i=2;i<=n;++i){
		while (j&&a[j+1]!=a[i]) j=nex[j];
		if (a[j+1]==a[i]) j++;
		nex[i]=j;
	}
	j=0;
	for (register int i=1;i<=m;++i){
		while (j&&a[j+1]!=b[i]) j=nex[j];
		if (a[j+1]==b[i]) j++;
		if (j==n) printf("%d\n",i-n+1);
	}
	for (register int i=1;i<=n;++i){
		printf("%d ",nex[i]);
	}
}
```

咕咕咕