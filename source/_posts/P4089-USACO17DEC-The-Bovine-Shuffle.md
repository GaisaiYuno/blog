---
title: 'P4089 [USACO17DEC]The Bovine Shuffle'
abbrlink: e6c26dfa
date: 2019-07-25 13:32:06
tags:
  - 题解
  - 图论

---

[传送门](https://www.luogu.org/problem/P4089 )

将$i$与$a_i$连边，发现在一个环上的牛永远不会消失，总是在绕圈圈，所以问题转换为求这个图里面所有环的长度之和。

```cpp
#include <bits/stdc++.h>
#define MOD
#define MAXN 100005
#define MAXM
#define LL long long
#define ll long long
#define mem(a) memset(a,0,sizeof(a))
#define memmax(a) memset(a,0x3f,sizeof(a))
//#define int long long
using namespace std;
inline int read(){
	int x=0,f=1;
	char ch=getchar();
	while (ch<'0'||ch>'9'){
		if (ch=='-') f=-1;
		ch=getchar();
	}
	while (ch>='0'&&ch<='9'){
		x=(x*10)+(ch-'0');
		ch=getchar();
	}
	return x*f;
}
int to[MAXN],in[MAXN],vis[MAXN],vis2[MAXN];
void dfs(int u){
	vis[u]=true;
	if (--in[to[u]]==0){
		dfs(to[u]);
	}
}
int dp[MAXN];
void dfs2(int u){
	if (vis2[u]){
		dp[u]=0;
		return ;
	}
	vis2[u]=true;
	dfs2(to[u]);
	dp[u]=dp[to[u]]+1;
}
//#undef int
int main(){
//#define int long long
	int n;
	scanf("%d",&n);
	for (register int i=1;i<=n;++i){
		to[i]=read();
		++in[to[i]];
	}
	for (register int i=1;i<=n;++i){
		if (!vis[i]&&!in[i]){
			dfs(i);
		}
	}
	int ans=0;
	for (register int i=1;i<=n;++i){
		if (!vis[i]&&!vis2[i]){
			dfs2(i);
			ans+=dp[i];
		}
	}
	printf("%d\n",ans);
}
```

