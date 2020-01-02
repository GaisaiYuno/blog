---
title: CDQ分治优化斜率优化
tags:
  - CDQ分治
  - 斜率优化
abbrlink: b7a912cc
date: 2019-08-20 21:44:53
---

## 例题1：

[P2365 任务安排](https://www.luogu.org/problem/P2365)

我知道你们会$n^2$大暴力，也会$O(n)$普通斜率优化，但是不妨提高一下我们的姿势水平，假设$1 \le N \le 100000$，而且$T_i$和$C_i$不一定是正整数。

朴素$dp$方程：$dp[i]=dp[j]-(s+sumt[i]) \times sumc[j]+sumt[i]\times sumc[i]+s\times sumc[n]$

$x=sumc[j],y=dp[j],k=s+sumt[i],b=sumt[i]\times sumc[i]+s\times sumc[n]$

式子化成$dp[i]=y-kx+b$的形式。

注意到$sumt,sumc$不一定单调，于是我们需要动态地在凸壳上面插入和查询点，但是这样写太过naive了，考虑离线，使用CDQ分治计算答案，每次我们建出左半边的凸壳，查询右半边凸壳的答案，伪代码如下：

```cpp
procedure CDQ(l,r){
    if(l==r){
        用a[l]对应的dp值来更新a的(x,y)
        return
    }
    mid=(l+r)/2
    把[l,r]内的元素按id分成两个区间，id<=mid的分到[l,mid],否则分到[mid+1,r]
    CDQ(l,mid),先递归计算id值小的
    把[l,mid]区间对应的点建出凸壳，用于下一步更新[mid+1,r]的dp值
    for(k in [mid+1,r]){
        用单调队列更新a[k]对应的dp值，因为我们cdq之前按斜率排过序，所以不会出问题
        注意到在这里面即使a[k]对应的dp值的最优决策不在[mid+1,r]中，那么回溯到一个更大的区间后，也会被更新到
    }
    CDQ(mid+1,r)，继续递归下去更新
    按x,y归并排序[l,mid],[mid+1,r],这样回溯的时候x单调递增，才可以直接单调栈(队列)建凸壳
}
int main(){
    输入
    按照斜率对点排序
}
```

摘自巨佬ypy的[博客](https://www.cnblogs.com/birchtree/p/11385473.html)

```cpp
#include <bits/stdc++.h>
#define MAXN 300005
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
int N,S;
int sumT[MAXN],sumC[MAXN];
int ans[MAXN];
struct Point{
	double x,y;
	int id;
}p[MAXN],t[MAXN],q[MAXN];
inline bool cmp1(const Point &A,const Point &B){
	return sumT[A.id]<sumT[B.id];
}
inline bool cmp2(const Point &A,const Point &B){
	if (A.x!=B.x) return A.x<B.x;
	else return A.y<B.y;
}
inline double operator * (const Point &A,const Point &B){
	return A.x*B.y-A.y*B.x;
}
inline Point operator - (const Point &A,const Point &B){
	return Point{A.x-B.x,A.y-B.y};
}
inline double Slope(const Point &A,const Point &B){
	return (double)(A.y-B.y)/(double)(A.x-B.x);
}
inline void Msort1(int l,int r){
	int mid=(l+r)>>1;
	int j=l,k=mid+1;
	for (register int i=l;i<=r;++i){
		if (p[i].id<=mid) t[j++]=p[i];
		else t[k++]=p[i];
	}
	for (register int i=l;i<=r;++i) p[i]=t[i];
}
inline void Msort2(int l,int r){
	int mid=(l+r)>>1;
	int j=l,k=mid+1;
	for (register int i=l;i<=r;++i){
		if (j<=mid&&(k>r||cmp2(p[j],p[k]))) t[j++]=p[i];例题
		else t[k++]=p[i];
	}
	for (register int i=l;i<=r;++i) p[i]=t[i];
}
void CDQ(int l,int r){
	if (l==r){
		p[l].x=(double)sumC[p[l].id];
		p[l].y=(double)ans[p[l].id];
		return ;
	}
	int mid=(l+r)>>1;
	Msort1(l,r);
	CDQ(l,mid);
	int head=1,rear=0;
	for (register int i=l;i<=mid;++i){
		while (head<rear&&((q[rear]-q[rear-1])*(p[i]-q[rear-1]))<0) rear--;
		q[++rear]=p[i];
	}
	for (register int k=mid+1;k<=r;++k){
		int i=p[k].id;
		while (head<rear&&Slope(q[head+1],q[head])<(S+sumT[i])) head++;
		int j=q[head].id;
		ans[i]=min(ans[i],ans[j]+sumT[i]*(sumC[i]-sumC[j])+S*(sumC[N]-sumC[j]));
	}
	CDQ(mid+1,r);
	Msort2(l,r);
}
#undef int
int main(){
#define int long long
	N=read(),S=read();
	for (register int i=1;i<=N;++i){
		sumT[i]=sumT[i-1]+read();
		sumC[i]=sumC[i-1]+read();
		p[i].id=i;
	}
	sort(p+1,p+1+N,cmp1);
	memset(ans,0x3f,sizeof(ans));
	ans[0]=0;
	CDQ(0,N);
	printf("%lld\n",ans[N]);
}
```

## 例题2：

[P4655 [CEOI2017]Building Bridges](https://www.luogu.org/problem/P4655)

很容易得出dp方程：

$dp[i]=min(dp[i],dp[j]+(h[i]-h[j])^2+w[i-1]-w[j])$其中$w[i]$是前缀和。

考虑斜率优化，化成$dp[i]=dp[j]+h[j]^2-w[j]-2h[i]h[j]+h[i]^2$的形式，设$y=dp[j]+h[j]^2-w[j]$的，$x=h[j]$，$k=2h[i]$，$b=h[i]^2$

注意到$h[j]$不一定单调，所以需要CDQ分治。

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
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
struct Point{
    double x,y;
    int i;
}p[MAXN],t[MAXN],q[MAXN];
inline double operator * (const Point &A,const Point &B){
    return A.x*B.y-A.y*B.x;
}
inline Point operator - (const Point &A,const Point &B){
    return Point{A.x-B.x,A.y-B.y};
}
inline bool cmp1(const Point &A,const Point &B){
    if (A.x!=B.x) return A.x<B.x;
    return A.y>B.y;
}
int h[MAXN],sum[MAXN],dp[MAXN];
inline bool cmp2(const Point &A,const Point &B){
    return h[A.i]<h[B.i];
}
inline void Merge1(int l,int r){
    int mid=(l+r)>>1;
    int j=l,k=mid+1;
    for (register int i=l;i<=r;++i){
        if (p[i].i<=mid) t[j++]=p[i];
        else t[k++]=p[i];
    }
    for (register int i=l;i<=r;++i) p[i]=t[i];
}
inline void Merge2(int l,int r){
    int mid=(l+r)>>1;
    int j=l,k=mid+1;
    for (register int i=l;i<=r;++i){
        if (j<=mid&&(k>r||cmp1(p[j],p[k]))) t[i]=p[j++];
        else t[i]=p[k++];
    }
    for (register int i=l;i<=r;++i) p[i]=t[i];
}
void CDQ(int l,int r){
    if (l==r){
        p[l].x=(double)h[l];
        p[l].y=(double)dp[l]-sum[l]+h[l]*h[l];
        return ;
    }
    int mid=(l+r)>>1;
    Merge1(l,r);
    CDQ(l,mid);
    int head=1,rear=0;
    for (register int i=l;i<=mid;++i){
        while (head<rear&&(q[rear]-q[rear-1])*(p[i]-q[rear-1])<=0) rear--;
        q[++rear]=p[i];
    }
    for (register int k=mid+1;k<=r;++k){
        int i=p[k].i;
        while (head<rear&&(q[head+1]-q[head])*Point{1,(double)2*h[i]}>=0) head++;
        int j=q[head].i;
        dp[i]=min(dp[i],dp[j]+(h[i]-h[j])*(h[i]-h[j])+sum[i-1]-sum[j]);
    }
    CDQ(mid+1,r);
    Merge2(l,r);
}
#undef int
int main(){
#define int long long
    int n=read();
    for (register int i=1;i<=n;++i) h[i]=read(),p[i].i=i;
    for (register int i=1;i<=n;++i) sum[i]=sum[i-1]+read();
    memset(dp,0x3f,sizeof(dp));
    dp[1]=0;
    sort(p+1,p+1+n,cmp2);
    CDQ(1,n);
    printf("%lld\n",dp[n]);
}
```

## 例题3：

[P4027 [NOI2007]货币兑换](https://www.luogu.org/problem/P4027)

注意到题目有这么一句话：

> 必然存在一种最优的买卖方案满足：
>
> 每次买进操作使用完所有的人民币；
>
> 每次卖出操作卖出所有的金券。

所以我们列出dp方程，$F[i]$表示第$i$天最多的钱数

$F[i]=max(F[i-1],F[j]/(A[j] \times R[j]+B[j])\times (A[i]\times R[j]+B[i]))$

$F[i]=F[i-1]$表示第$i$天什么都不做，

$F[i]=F[j]/(A[j] \times R[j]+B[j]) \times (A[i] \times R[j]+B[i])$

表示把第$j$天的钱全部按照$R[j]$的比例买进股票，然后在第$i$天按照$R[j]$的比例全部卖出。

考虑斜率优化，由于$F[j]/(A[j] \times R[j]+B[j])$里面只有$j$，不妨考虑换元。

设$F[j]/(A[j] \times R[j]+B[j])=T$，那么我们有$F[i]=T \times (A[i] \times R[j]+B[i])$

拆开，得$F[i]=T \times A[i] \times R[j]+T \times B[i]$

令$y=T \times R[j]$，$x=T$，$k=-B[i]/A[i]$

直接套用CDQ分治模板。

```cpp
#include <bits/stdc++.h>
#define MAXN 300005
#define int long long
#define INF 1e12
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
int N;
double S,A[MAXN],B[MAXN],R[MAXN],ans[MAXN];
struct Point{
	double x,y;
	int id;
}p[MAXN],t[MAXN],q[MAXN];
inline bool cmp1(const Point &X,const Point &Y){
	return -B[X.id]/A[X.id]>-B[Y.id]/A[Y.id];
}
inline bool cmp2(const Point &A,const Point &B){
	if (A.x!=B.x) return A.x<B.x;
	else return A.y>B.y;
}
inline double operator * (const Point &A,const Point &B){
	return A.x*B.y-A.y*B.x;
}
inline Point operator - (const Point &A,const Point &B){
	return {A.x-B.x,A.y-B.y};
}
inline Point operator + (const Point &A,const Point &B){
	return {A.x+B.x,A.y+B.y};
}
inline double Slope(const Point &A){
	if (A.x==0) return A.y>0?INF:-INF;
	return A.y/A.x;
}
inline void Msort1(int l,int r){
	int mid=(l+r)>>1ll;
	int j=l,k=mid+1;
	for (register int i=l;i<=r;++i){
		if (p[i].id<=mid) t[j++]=p[i];
		else t[k++]=p[i];
	}
	for (register int i=l;i<=r;++i) p[i]=t[i];
}
inline void Msort2(int l,int r){
	int mid=(l+r)>>1ll;
	int j=l,k=mid+1;
	for (register int i=l;i<=r;++i){
		if (j<=mid&&(k>r||cmp2(p[j],p[k]))) t[i]=p[j++];
		else t[i]=p[k++];
	}
	for (register int i=l;i<=r;++i) p[i]=t[i];
}
void CDQ(int l,int r){
	if (l==r){
		if (l!=1) ans[l]=max(ans[l],ans[l-1]);
		p[l].x=ans[l]/(A[l]*R[l]+B[l]);
		p[l].y=p[l].x*R[l];
		return ;
	}
	int mid=(l+r)/2;
	Msort1(l,r);
	CDQ(l,mid);
	int head=1,rear=0;
	for (register int i=l;i<=mid;++i){
		while (head<rear&&Slope(q[rear]-q[rear-1])<=Slope(p[i]-q[rear-1])) rear--;
		q[++rear]=p[i];
	}
	for (register int k=mid+1;k<=r;++k){
		int i=p[k].id;
		while (head<rear&&Slope(q[head+1]-q[head])>=(-B[i]/A[i])) head++;
		int j=q[head].id;
		ans[i]=max(ans[i],(ans[j]/(A[j]*R[j]+B[j]))*(A[i]*R[j]+B[i]));
	}
	CDQ(mid+1,r);
	Msort2(l,r);
}
#undef int
int main(){
#define int long long
	N=read(),S=(double)read();
	for (register int i=1;i<=N;++i){
		cin>>A[i]>>B[i]>>R[i];
		p[i].id=i;
	}
	ans[1]=S;
	sort(p+1,p+1+N,cmp1);
	CDQ(1,N);
	printf("%.3f\n",ans[N]);
}
```

## 例题4：

[Machine Works](http://acm.hdu.edu.cn/showproblem.php?pid=3842)

题意：

一个公司获得了一个厂房n(10^5)天的使用权
和一笔启动资金C(10^9)，准备在n天里租借机器生产来获得收益
可以租借的机器有M(10^5)个，每个机器有四个值，D,P,R,G (D<=n, P,R,G都是10^9)
表明你可以再第D天花费P费用（首先手里必须有那么多钱）
租借这个机器，从D+1天开始该机器每天产生G的收益，在你不需要机器时
可以卖掉这个机器，一次获得R的钱

显然可以列出dp方程：$f[i] = max(f[j] - P[i] + R[j] + G[j] * (D[i] - D[j]  - 1)) $

注意到$f[j]>=0$才能转移。

代表你在第$j$天买进机器，然后后面$D[i]-D[j]-1$天使用机器，最后第$i$ 天卖出。

斜率优化比较好推，我就不推了。

代码：

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
#define int long long
#define INF 1e15
#define eps 1e-10
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
struct Machine{
	int d,p,r,g;
}m[MAXN];
inline bool cmp(const Machine &A,const Machine &B){
	return A.d<B.d;
}
int n,c,d;
int ans[MAXN];
struct Point{
	double x,y;
	int id;
}p[MAXN],t[MAXN],q[MAXN];
inline bool cmp1(const Point &A,const Point &B){
	return m[A.id].d<m[B.id].d;
}
inline bool cmp2(const Point &A,const Point &B){
	if (A.x!=B.x) return A.x<B.x;
	else return A.y<B.y;
}
inline double operator * (const Point &A,const Point &B){
	return A.x*B.y-A.y*B.x;
}
inline Point operator - (const Point &A,const Point &B){
	return Point{A.x-B.x,A.y-B.y};
}
inline Point operator + (const Point &A,const Point &B){
	return Point{A.x+B.x,A.y+B.y};
}
inline double Slope(const Point &A,const Point &B){
	return (double)(A.y-B.y)/(double)(A.x-B.x);
}
inline void Msort1(int l,int r){
	int mid=(l+r)>>1;
	int j=l,k=mid+1;
	for (register int i=l;i<=r;++i){
		if (p[i].id<=mid) t[j++]=p[i];
		else t[k++]=p[i];
	}
	for (register int i=l;i<=r;++i) p[i]=t[i];
}
inline void Msort2(int l,int r){
	int mid=(l+r)>>1;
	int j=l,k=mid+1;
	for (register int i=l;i<=r;++i){
		if (j<=mid&&(k>r||cmp2(p[j],p[k]))) t[i]=p[j++];
		else t[i]=p[k++];
	}
	for (register int i=l;i<=r;++i) p[i]=t[i];
}
void CDQ(int l,int r){
	if (l==r){
		p[l].x=(double)m[l].g;
		p[l].y=(double)ans[l]+m[l].r-m[l].g*m[l].d-m[l].g;
		return ;
	}
	int mid=(l+r)>>1;
	Msort1(l,r);
	CDQ(l,mid);
	int head=1,rear=0;
	for (register int i=l;i<=mid;++i){
		if (ans[p[i].id]<0) continue;
		while (head<rear&&(q[rear]-q[rear-1])*(p[i]-q[rear-1])>=0) rear--;
		q[++rear]=p[i];
	}
	for (register int k=mid+1;k<=r;++k){
		int i=p[k].id;
		while (head<rear&&(q[head+1]-q[head])*(Point{1,-m[i].d,1926})<=0) head++;
		int j=q[head].id;
		ans[i]=max(ans[i],ans[j]+m[j].r+m[j].g*(m[i].d-m[j].d-1)-m[i].p);
	}
	CDQ(mid+1,r);
	Msort2(l,r);
}
#undef int
int main(){
#define int long long
	int Case=0;
	while (scanf("%lld%lld%lld",&n,&c,&d)!=EOF&&(n!=0&&c!=0&&d!=0)){
		for (register int i=1;i<=n;++i){
			m[i].d=read(),m[i].p=read(),m[i].r=read(),m[i].g=read();
			p[i].id=i;
		}
		sort(m+1,m+1+n,cmp);
		sort(p+1,p+1+n,cmp1);
		for (register int i=1;i<=n;++i) ans[i]=-INF;
		ans[0]=c;
		CDQ(0,n);
		long long ret=c;
		for (register int i=1;i<=n;++i){
			if (ans[i]>=0) ret=max(ret,(long long)(ans[i]+m[i].r+(d-m[i].d)*m[i].g));
		}
		printf("Case %d: %lld\n",++Case,(long long)ret);
	}
}
```

