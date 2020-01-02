---
title: AT3621 Small Multiple
tags:
  - 题解
  - 数学
abbrlink: 4bdb7fa0
date: 2019-10-26 12:39:26
---

巧妙啊！

不妨考虑枚举答案，我们不要从小到大枚举，而是从位数之和从小到大枚举。

考虑一个数$x$，$x+1$为$x$的数位之和$+1$，$x \times 10$数位和不变。

于是我们可以在$\bmod k$的意义下计算$x$，将$x,x+1$连一条长度为$1$的边，将$x,x\times 10$连一条长度为$0$的边。

于是答案就是$1 \to 0$的距离。

具体实现时使用一种神奇的$\rm bfs$，具体看代码吧。

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
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
int d[MAXN],vis[MAXN];
deque<int>Q;
inline void Push(int x,int pre,int len,bool flag){
	d[x]=min(d[x],d[pre]+len);
	if (flag) Q.push_front(x);
	else Q.push_back(x);
}
int main(){
	int K=read();
	memset(d,0x3f,sizeof(d));
	Q.push_front(1),d[1]=1;
	while (Q.size()){
		int x=Q.front();Q.pop_front();
		if (!vis[x]) vis[x]=true;
		else continue;
		if (!x){
			printf("%d\n",d[x]);
			return 0;
		}
		Push((x+1)%K,x,1,0);
		Push((x*10)%K,x,0,1);
	}
}
```



