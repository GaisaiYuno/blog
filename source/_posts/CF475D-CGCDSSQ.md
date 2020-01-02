---
title: CF475D CGCDSSQ
tags:
  - 题解
  - gcd
  - 数学
  - 二分
abbrlink: 9c3c8881
date: 2019-10-26 12:33:21
---

考虑$g_1=gcd(a_l,a_{l+1},...,a_{r}),g_2=gcd(a_l,a_{l+1},...,a_r,a_{r+1})$

显然有$g_1$为$g_2$的倍数

若$g_1!=g_2$，那么肯定$g_2 \le \frac{g_1}{2}$

这就说明我们固定$l$，$gcd$的不同值至多有$\log _2 a[l]$种。

于是我们用$ST$表维护$gcd$值，每次可以二分到$gcd$变化的位置。

对答案的贡献就是这一段的长度。

注意边界问题。

```cpp
#include <bits/stdc++.h>
#define MAXN 300005
#define MAXM 35
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
int n;
int q[MAXN],a[MAXN];
map<int,int>ans;
namespace ST_table{
	int st[MAXM][MAXN],lg[MAXN];
	inline void Init_ST(){
		lg[0]=-1;
		for (register int i=1;i<=n;++i){
			lg[i]=lg[i>>1]+1;
		}
		for (register int i=1;i<=n;++i){
			st[0][i]=a[i];
		}
		for (register int i=1;i<MAXM;++i){
			for (register int j=1;j+(1<<i)-1<=n;++j){
				st[i][j]=__gcd(st[i-1][j],st[i-1][j+(1<<(i-1))]);
			}
		}
	}
	inline int Query(int l,int r){
	    if (l>r) return 0;
		int k=lg[r-l+1];
		return __gcd(st[k][l],st[k][r-(1<<k)+1]);
	}
}
using namespace ST_table;
inline int Find(int L,int p,int g){
	int l=p,r=n,ans=0;
	while (l<=r){
		int mid=(l+r)>>1;
		if (Query(L,mid)==g) ans=mid,l=mid+1;
		else r=mid-1;
	}
	return ans;
}
inline int Calc(int p){
	int now=a[p],L=p;
	while (true){
		int lst=p;
		p=Find(L,p,now);
		ans[now]+=p-lst+1;
		if (p==n) return 0;
		++p;
		now=Query(L,p);
	}
}
#undef int
int main(){
#define int long long
	n=read();
	for (register int i=1;i<=n;++i) a[i]=read();
	int m=read();
	for (register int i=1;i<=m;++i) q[i]=read();
	Init_ST();
	for (register int i=1;i<=n;++i) Calc(i);
	for (register int i=1;i<=m;++i){
		printf("%I64d\n",ans[q[i]]);
	}
}
```

