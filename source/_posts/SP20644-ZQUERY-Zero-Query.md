---
title: SP20644 ZQUERY - Zero Query
tags:
  - 题解
  - 回滚莫队
abbrlink: 24d65f48
date: 2019-08-11 15:40:48
---

[传送门](https://www.luogu.org/problem/SP20644)

## $Pro$

长度为$n$的序列，序列中的值为$1$或$−1$
有$m$个询问，询问在$[L,R]$中**区间和**为$0$的区间的**最大长度**

## $Sol$

考虑莫队

对于区间$[l,r]$，统计两个数组$Max[i]$和$Min[i]$，表示$\max j (\sum_{k=l}^j a[k] =i)$和$\min j  (\sum_{k=l}^j a[k] =i)$，特别地$Max[0]=l-1$,$Min[0]=l-1$

那么每来一个数$x$，$sum+=x$，然后更新$Max[sum]$和$Min[sum]$，答案和$Max[sum]-Min[sum]$取一个最大值。

但是这个删除操作比较不好搞，考虑只加不减的回滚莫队。

![](/images/wellwellwell.png)

分别用上面的方法统计蓝色区域和红色区域的最大值，最后在算上绿色区域即可。

注意：多清零，最好专门开两个数组，专门跑暴力。

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
#define X 50000
#define INF 0x3f3f3f3f
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
int a[MAXN],pos[MAXN],n,m;
struct Query{
    int l,r,id;
}q[MAXN];
inline bool operator < (const Query &A,const Query &B){
    return pos[A.l]==pos[B.l]?A.r<B.r:pos[A.l]<pos[B.l];
}
static int Ans[MAXN];
int ans,Size;
int tempMax[MAXN],tempMin[MAXN];
int Max[MAXN],Min[MAXN];
int Max1[MAXN],Min1[MAXN];
int tempsum,tempans;
inline int BruteForce(int l,int r){
    int s=0,ret=0;
    for (register int i=l;i<=r;++i) Max1[s+X]=-INF,Min1[s+X]=INF,s+=a[i];
	Max1[s+X]=-INF,Min1[s+X]=INF;//可能是负数，所以要加上一个很大的数
    s=0;
    Max1[X]=max(Max1[X],l-1);
    Min1[X]=min(Min1[X],l-1);
    for (register int i=l;i<=r;++i){
        s+=a[i];
        Max1[s+X]=max(Max1[s+X],i);
        Min1[s+X]=min(Min1[s+X],i);
        ret=max(ret,Max1[s+X]-Min1[s+X]);
    }
    s=0;
    for (register int i=l;i<=r;++i) Max1[s+X]=-INF,Min1[s+X]=INF,s+=a[i];
    Max1[s+X]=-INF,Min1[s+X]=INF;
    return ret;
}
int sum;
inline int MoQueue(int i,int id){
    int R=min(n,Size*id);
    int r=R;
    for (register int i=0;i<MAXN;++i) Max[i]=-INF,tempMax[i]=-INF;
    for (register int i=0;i<MAXN;++i) Min[i]=INF,tempMin[i]=INF;
    ans=0,sum=0;
    Max[X]=R;
    Min[X]=R;
	tempMax[X]=R+1;
	tempMin[X]=R+1;
    while (pos[q[i].l]==id){
        if (pos[q[i].l]==pos[q[i].r]){
            Ans[q[i].id]=BruteForce(q[i].l,q[i].r);
            i++;
            continue;
        }
        for (register int j=r+1;j<=q[i].r;++j){
        	sum+=a[j];
		    Max[sum+X]=max(Max[sum+X],j);
		    Min[sum+X]=min(Min[sum+X],j);
		    ans=max(ans,Max[sum+X]-Min[sum+X]);//蓝色区域
		}
		r=q[i].r;
        tempans=0,tempsum=0;
		tempMax[X]=R+1;
		tempMin[X]=R+1;//反向意义
        for (register int j=R;j>=q[i].l;--j){
        	tempsum+=a[j];
		    tempMax[tempsum+X]=max(tempMax[tempsum+X],j);
		    tempMin[tempsum+X]=min(tempMin[tempsum+X],j);
		    tempans=max(tempans,tempMax[tempsum+X]-tempMin[tempsum+X]);//红色区域
		    tempans=max(tempans,Max[-tempsum+X]-tempMin[tempsum+X]+1);//绿色区域，注意+1
		}
		Ans[q[i].id]=max(tempans,ans);
		for (register int j=q[i].l;j<=R;++j){//还原 
		    tempMax[tempsum+X]=-INF;
		    tempMin[tempsum+X]=INF;
		    tempsum-=a[j];
		}
        i++;
    }
    return i;
}
int main(){
    n=read(),m=read();
    Size=(int)(n/sqrt(m));
    for (register int i=1;i<=n;++i){
        a[i]=read();
        pos[i]=(i-1)/Size+1;
    }
    for (register int i=1;i<=m;++i){
        q[i].l=read(),q[i].r=read(),q[i].id=i;
    }
    sort(q+1,q+1+m);
    int ptr=1;
    for (register int i=1;i<=pos[n];++i){
        ptr=MoQueue(ptr,i);
    }
    for (register int i=1;i<=m;++i){
        printf("%d\n",Ans[i]);
    }
}
```

