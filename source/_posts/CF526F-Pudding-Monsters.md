---
title: CF526F Pudding Monsters
abbrlink: 770788ec
date: 2019-10-26 12:46:31
tags:
  - 题解
  - 分治
---

考虑到每行每列只有一个棋子，我们可以把整个棋盘映射到一个数组上面，如下：

![](https://ae01.alicdn.com/kf/H147a92ad8e27405a92ea9487c33dfb2dk.png)

显然这个数组里面的各个数字都不同。

考虑$[l,r]$区间映射到棋盘上面，满足$k \times k$且恰好包含$k$枚棋子的充要条件。

就是$[l,r]$中的数字形成了一个长度为$r-l+1$的值域连续段，比如$4,2,3$形成了一个长度为$3$的值域连续段。

考虑到每个数都是不同的，可以进一步转化这个条件为$\max(a[i] ,i\in [l,r])-\min(a[i] ,i\in [l,r])+1 = r-l+1$（后面记为$\max,\min$）。

于是$\max-\min=r-l$

这样我们可以想到分治来算这个的种类数。

考虑计算$l,r \in [L,R]$，且$mid=(L+R)/2 \in [l,r]$的方案数。

分成两种情况计算。

### 1

第一种是最大值，最小值都分布在$mid$的同一侧。

举个例子，最大值，最小值都分布在$mid$左边。

我们可以枚举左端点，于是此时$\max,\min,l$确定下来。

只用通过$r=\max-\min+l$计算出右端点并且判断是否符合即可。

```cpp
for (register int i=mid;i>=l;--i){
		int j=lmax[i]-lmin[i]+i;
		if (j<=r&&j>mid&&QueryMax(i,j)==lmax[i]&&QueryMin(i,j)==lmin[i]) ans++;
	}
```

### 2

$\max,\min$分布在$mid$的异侧。

这种情况比较复杂。

考虑$\min$在$mid$左边，先移一下项$l-r=\min-\max \to l-\min=r-\max$。

于是可以开一个桶记录一下$r-\max$。

但是注意到我们的$r$有一个范围，必须让右边的最大值超过左边的最大值，但是必须让左边的最小值小于右边的最小值。

于是可以开两个指针维护$r$的左右边界，然后像莫队一样维护这个桶。

```cpp
int L=mid+1,R=mid+1;//右端点可以到达的区间
for (register int i=mid;i>=l;--i){
	while (R<=r&&rmin[R]>lmin[i]) cnt[R-rmax[R]+N]++,R++;
	while (L<R&&rmax[L]<lmax[i]) cnt[L-rmax[L]+N]--,L++;
	ans+=cnt[i-lmin[i]+N];
}
while (L<R) cnt[L-rmax[L]+N]--,L++;
```

 注意清零的复杂度和区间长度有关，于是不能$\rm memset$清零。

```cpp
#include <bits/stdc++.h>
#define MAXN 300005
#define N 300000
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
int a[MAXN];
int lmax[MAXN],lmin[MAXN],rmax[MAXN],rmin[MAXN];
//l,r是指在终点的哪一边
inline int QueryMax(int l,int r){//满足l <= mid <= r
	return max(lmax[l],rmax[r]);
}
inline int QueryMin(int l,int r){//满足l <= mid <= r
	return min(lmin[l],rmin[r]);
}
long long ans;
int cnt[MAXN*2];
void CDQ(int l,int r){
	if (l==r){
		ans++;//一个也有贡献
		return ;
	}
	int mid=(l+r)>>1;
	CDQ(l,mid),CDQ(mid+1,r);
 
	lmax[mid]=lmin[mid]=a[mid];
	for (register int i=mid-1;i>=l;--i) lmax[i]=max(a[i],lmax[i+1]),lmin[i]=min(a[i],lmin[i+1]);
	rmax[mid+1]=rmin[mid+1]=a[mid+1];
	for (register int i=mid+2;i<=r;++i) rmax[i]=max(a[i],rmax[i-1]),rmin[i]=min(a[i],rmin[i-1]);
 
	//初始化结束
	//max,min都在左边，右边
	//r-l=max-min -> r=max-min+l
	for (register int i=mid;i>=l;--i){
		int j=lmax[i]-lmin[i]+i;
		if (j<=r&&j>mid&&QueryMax(i,j)==lmax[i]&&QueryMin(i,j)==lmin[i]) ans++;
	}
	//l-r=min-max -> l=min-max+r
	for (register int i=mid+1;i<=r;++i){
		int j=rmin[i]-rmax[i]+i;//注意算出来的是左端点
		if (j>=l&&j<=mid&&QueryMax(j,i)==rmax[i]&&QueryMin(j,i)==rmin[i]) ans++;
	}
 
	//max,min一个在左边，一个在右边，开一个桶记录
	//l-r=min-max -> l-min=r-max 或者 l+max=r+min
 
	//左边有最小值
	int L=mid+1,R=mid+1;//右端点可以到达的区间
	for (register int i=mid;i>=l;--i){
		while (R<=r&&rmin[R]>lmin[i]) cnt[R-rmax[R]+N]++,R++;
		while (L<R&&rmax[L]<lmax[i]) cnt[L-rmax[L]+N]--,L++;
		ans+=cnt[i-lmin[i]+N];
	}
	while (L<R) cnt[L-rmax[L]+N]--,L++;
 
	//左边有最大值
	L=mid,R=mid;//右端点可以到达的区间
	for (register int i=mid+1;i<=r;++i){
		while (L>=l&&lmin[L]>rmin[i]) cnt[L+lmax[L]]++,L--;
		while (L<R&&lmax[R]<rmax[i]) cnt[R+lmax[R]]--,R--;
		ans+=cnt[i+rmin[i]];
	}
	while (R>L) cnt[R+lmax[R]]--,R--;
}
signed main(){
	//freopen("CF536F.in","r",stdin);
	int n=read();
	for (register int i=1;i<=n;++i){
		int x=read(),y=read();
		a[x]=y;
	}
	CDQ(1,n);
	printf("%I64d\n",ans);;;;;
}
/*
5
1 1
4 3
3 2
2 4
5 5
*/
```

