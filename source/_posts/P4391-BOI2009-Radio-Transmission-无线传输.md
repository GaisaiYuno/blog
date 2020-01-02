---
title: 'P4391 [BOI2009]Radio Transmission 无线传输'
abbrlink: b7a3c803
date: 2019-10-28 19:11:30
tags:
  - 题解
  - KMP
---

考虑到一个合法的$s$，长度为$n$，那么题目给的字符串（设为$a$，长度为$m$）肯定可以这么表示：

$s[1 \to n] + s[1 \to n] + s[1 \to n] ... +s[1 \to n]+s[1 \to i]$

$1 \le i \le n$

考虑这个字符串的$next[n]$。

可以知道$s[1 \to next[n]]$的后$i$位肯定是$s[1 \to i]$，否则这个肯定不能匹配。

考虑离后$i$位最近的$s[1 \to i]$，发现出现在这里的前$i$位：

![](https://ae01.alicdn.com/kf/Hb7a705efc8d84c1d98ec250cc0452938b.png)

再演算一遍，发现前面的部分也可以匹配上。

于是$n - next[n]$是最小的解（$next[n]$取所有合法的border的最大值）。

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
		x=(x<<1)+(x<<3)+(ch^'0');
		ch=getchar();
	}
	return x*f;
}
char s[MAXN];
int nex[MAXN];
int main(){
	int n=read();
	scanf("%s",s+1);
	int j=0;
	memset(nex,0,sizeof(nex));
	for (register int i=2;i<=n;++i){
		while (j>0&&s[j+1]!=s[i]) j=nex[j];
		if (s[j+1]==s[i]) j++;
		nex[i]=j;
	}
	printf("%d\n",n-nex[n]);
}
```

