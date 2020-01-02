---
title: P2839 [国家集训队]middle（可持久化线段树+二分）
  
tag:
  - 题解
  - 作业
  - 主席树
  - 可持久化
  - 线段树
abbrlink: 1c5d594e
date: 2019-07-13 19:46:14
---
# 题目
[传送门](https://www.luogu.org/problemnew/show/P2839)
一个长度为$n$的序列$a$，设其排过序之后为$b$，其中位数定义为$b[n/2]$，其中$a,b$从$0$开始标号,除法取下整。
给你一个长度为$n$的序列$s$。
回答$Q$个这样的询问：$s$的左端点在$[a,b]$之间,右端点在$[c,d]$之间的子序列中，最大的中位数。
其中$a<b<c<d$。
位置也从$0$开始标号。
我会使用一些方式强制你在线。
# 题解
寻找中位数有一个通常的套路：
考虑二分中位数，设$x$是现在二分的数，$mid$是序列的中位数：
将大于$x$的数设为$1$，小于$x$的数设为$-1$。
将整个$1/-1$序列求和
若$Sum>0$，说明$1$的数量比$-1$多，也就是大于$x$的数比小于$x$的数多
说明$x<=mid$
反之$x>mid$

------------------
回到本题，$[b+1,c-1]$为必选区间，$[a,b]$选后缀，$[c,d]$选前缀。
要使中位数尽可能大，我们要使$Sum$尽量大。
因为$[b+1,c-1]$固定且$[a,b]$后缀$[c,d]$前缀互不影响，所以在$[a,b]$区间我们选择最大后缀，在$[c,d]$区间我们选择最大前缀。

至此，我们已经有具体思路了：
线段树维护区间最大前缀，最大后缀，区间和，每次二分，用线段树判断可不可行。

---------------------------

但是，若使用普通线段树，每次查询都要重置区间为$1/-1$，所以查询时间复杂度为$O(nlogn)$
不$TLE$才奇怪。

考虑使用可持久化线段树，把每次二分后的$1/-1$序列预处理下来，每次查询就是查一个历史版本
这样每次查询时间复杂度为$O(log^2n)$，预处理复杂度为$O(nlogn)$，总复杂度为$O(nlogn+qlog^2n)$可以$AC$。

```cpp
#include <bits/stdc++.h>
#define MAXN 20005
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
namespace SegmentTree{
    struct node{
        int l,r;
        int lmax,rmax,sum;
    }tree[MAXN*20];
    int tot;
    #define lc tree[i].l
    #define rc tree[i].r
    node operator + (node A,node B){
        node C;
        C.sum=A.sum+B.sum;
        C.lmax=max(A.lmax,A.sum+B.lmax);
        C.rmax=max(B.rmax,A.rmax+B.sum);
        return C;
    }
    void pushup(int i){
        tree[i].sum=tree[lc].sum+tree[rc].sum;
        tree[i].lmax=max(tree[lc].lmax,tree[lc].sum+tree[rc].lmax);
        tree[i].rmax=max(tree[rc].rmax,tree[lc].rmax+tree[rc].sum);
    }
    inline void Value(int i,int val){
        tree[i].sum=tree[i].lmax=tree[i].rmax=val;
    }
    void build(int &i,int L,int R){//一开始都是1
        if (!i) i=++tot;
        Value(i,R-L+1);
        if (L==R){
            return ;
        }
        int mid=(L+R)>>1;
        build(lc,L,mid);
        build(rc,mid+1,R);
        pushup(i);
    }
    void update(int &i,int L,int R,int index){//修改成-1
        tree[++tot]=tree[i],i=tot;//新建节点
        if (L==R) {
            Value(i,-1);
            return ;
        }
        int mid=(L+R)>>1;
        if (index<=mid) update(lc,L,mid,index);
        else update(rc,mid+1,R,index);
        pushup(i);
    }
    node query(int i,int L,int R,int ql,int qr){
        if (ql<=L&&R<=qr){
            return tree[i];
        }
        int mid=(L+R)>>1;
        if (ql>mid) return query(rc,mid+1,R,ql,qr);
        else if (qr<=mid) return query(lc,L,mid,ql,qr);
        else return query(lc,L,mid,ql,qr)+query(rc,mid+1,R,ql,qr);
    }
}
using namespace SegmentTree;
int rt[MAXN];
int a[MAXN],b[MAXN],c[MAXN];//b:id a:原数组
inline bool cmp(int A,int B){
    return a[A]<a[B];
}
inline void discrete(int n){//离散化
    for (register int i=1;i<=n;++i) b[i]=i;
    sort(b+1,b+1+n,cmp);
}
int n;
#define VAR rt[mid],1,n
inline int Check(int mid,int A,int B,int C,int D){//[A,B] [B+1,C-1] [C,D]
    int sum=0;
    if (B+1<=C-1) sum+=query(VAR,B+1,C-1).sum;//这个特判容易漏掉
    sum+=query(VAR,A,B).rmax;
    sum+=query(VAR,C,D).lmax;
    return sum;
}
int p[4];
int main(){
    n=read();
    for (register int i=1;i<=n;++i) a[i]=read();
    discrete(n);
    build(rt[1],1,n);
    for (register int i=2;i<=n;++i){//预处理历史版本
        rt[i]=rt[i-1];
        update(rt[i],1,n,b[i-1]);
    }
    int last=0;
    int q=read();
    while (q--){
        for (register int i=0;i<4;++i){
            p[i]=(read()+last)%n+1;
        }
        sort(p,p+4);
        int A=p[0],B=p[1],C=p[2],D=p[3];
        int l=1,r=n;
        int ans=0;
        while (l<=r){
            int mid=(l+r)>>1;
            if (Check(mid,A,B,C,D)>=0) {
                ans=a[b[mid]];
                l=mid+1;
            }
            else {
                r=mid-1;
            }
        }
        last=ans;
        printf("%d\n",ans);
    }
}
```