---
title: CF525E Anya and Cubes 双向搜索
  
tag:
  - 题解
  - 双向搜索
  - 搜索
abbrlink: 73ef83bb
date: 2019-07-13 19:58:14
---
# 题目
给你$n$个数,$n≤26$，初始序列为$a_i$,$1≤a_i≤10^9$

你有$k$个$!$ ,每个$!$可以使序列中的一个数变成$a_i!$（$k$不一定要用完）
例如$5!=120$

求:选出任意个数使他们和的等于$S$的方案数$(0≤S≤10^{16})$
# 题解
首先$20!>10^{16}$，于是当$a_i>20$的时候，不能让$a_i$变成$a_i!$
这就少了很多情况。
接下来，定义$Map[k][Sum]$为使用$k$个阶乘符号，和为$Sum$的方法数。
双向搜索即可。
```cpp
#include <bits/stdc++.h>
#include <hash_map>
#define MAXN 30
#define int long long
using namespace std;
inline int read() {
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9') {
        if (ch=='-') f=-1;
        ch=getchar();
    }
    while (ch>='0'&&ch<='9') {
        x=(x*10)+(ch-'0');
        ch=getchar();
    }
    return x*f;
}
int a[MAXN],fac[MAXN],n,k,S;
unordered_map<int,int>Map[MAXN];
inline void Init(){
	fac[1]=1;
	for (register int i=2;i<=20;++i){
		fac[i]=fac[i-1]*i;
	}
}
//三种状态：不选，选，阶乘
void dfs1(int l,int r,int Sum,int usek){
	if (l>r){
		Map[usek][Sum]++;
		return ;
	}
	dfs1(l+1,r,Sum,usek);
	dfs1(l+1,r,Sum+a[l],usek);
	if (a[l]<=20) dfs1(l+1,r,Sum+fac[a[l]],usek+1);
}
int ans;
void dfs2(int l,int r,int Sum,int usek){
	if (l>r){
		for (register int i=0;i<=k-usek;++i){//还能用多少k 
			ans+=Map[i][S-Sum];
		}
		return ;
	}
	dfs2(l+1,r,Sum,usek);
	dfs2(l+1,r,Sum+a[l],usek);
	if (a[l]<=20) dfs2(l+1,r,Sum+fac[a[l]],usek+1);
} 
#undef int
int main(){
#define int long long
	Init();
	n=read(),k=read(),S=read();
	for (register int i=1;i<=n;++i){
		a[i]=read();
	}
	dfs1(1,n/2,0,0);
	dfs2(n/2+1,n,0,0);
	printf("%lld\n",ans);
}

```
