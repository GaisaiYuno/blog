---
title: 'P4085 [USACO17DEC]Haybale Feast'
abbrlink: 4e7e1605
date: 2019-07-25 13:39:39
tags:
  - 题解
  - 线段树
  - 尺取法

---

[传送门](https://www.luogu.org/problem/P4085 )

考虑尺取法求出所有满足条件的$i,j$，使$\sum ^j _{k=i}F_k>=M$，$O(n)$即可求出。

再考虑如何求$\max(S_i,S_{i+1},...S_{j-1},S_j)$

用线段树预处理即可

```cpp
// luogu-judger-enable-o2
#include <iostream>
#include <cstdio>
#include <algorithm>
#define ll long long
#define MAXN 100005
using namespace std;
ll S[MAXN],F[MAXN];
inline void lread(ll &x){
	ll f=1ll;
	char ch=getchar();
	while (ch<'0'||ch>'9'){
		if (ch=='-') f=-1ll;
		ch=getchar();
	}
	x=0;
	while (ch<='9'&&ch>='0'){
		x=(x<<3ll)+(x<<1ll)+(ll)(ch-'0');
		ch=getchar();
	}
	x*=f;
}
struct SegmentTree{
	struct node{
		int l,r;
		ll val;
	}tree[MAXN<<2];
	inline void pushup(int i){
		tree[i].val=max(tree[i<<1].val,tree[i<<1|1].val);
	}
	void build(int l,int r,int i){
		tree[i].l=l;
		tree[i].r=r;
		if (l==r){
			tree[i].val=S[l];
			return ;
		}
		int mid=(l+r)>>1;
		build(l,mid,i<<1);
		build(mid+1,r,i<<1|1);
		pushup(i);
	}
	ll query(int L,int R,int i){
		int l=tree[i].l,r=tree[i].r;
		if (L<=l&&r<=R){
			return tree[i].val;
		}
		int mid=(l+r)>>1;
		ll ans=-0x7fffffff;
		if (L<=mid){
			ans=max(ans,query(L,R,i<<1));
		}
		if (mid<R){
			ans=max(ans,query(L,R,i<<1|1));
		}
		return ans;
	}
}Seg;
int main(){
//	freopen("hayfeast.in","r",stdin);
//	freopen("hayfeast.out","w",stdout);
	int n;
	ll m;
	scanf("%d%lld",&n,&m);
	for (register int i=1;i<=n;++i){
		lread(F[i]),lread(S[i]);
	}
	Seg.build(1,n,1);
	int l=1,r=1;
	ll sum=F[1],ans=0x7fffffff;
	while (l<=n&&r<=n){
		while (r<=n&&sum<m){
			sum+=F[++r];
		}
		while (r<=n){
			sum+=F[++r];
			ll val=Seg.query(l,r,1);
			if (val>=ans){break;}
			else{ans=val;}
		}
		while (l<=r&&sum>=m){
			sum-=F[l++];
		}
	}
	printf("%lld\n",ans);
}
```



