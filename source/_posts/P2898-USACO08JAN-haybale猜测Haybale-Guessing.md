---
title: 'P2898 [USACO08JAN]haybale猜测Haybale Guessing'
abbrlink: 8a9a3c57
date: 2019-08-02 22:56:38
tags:
  - 题解
  - 二分
  - 线段树
---

[传送门](https://www.luogu.org/problem/P2898)

这道题思路还是比较巧妙的，考虑如何判断矛盾。

首先，发现题目中说

> 每个位置上的数都不同的序列a[1..n]

所以任意两个不相交的区间中，最小值一定是不同的（性质$1$），因为如果最小值相同，那么最小值对应到的那个数是相同的，说明两段区间都包含那个数，即两段区间相交。

再继续考虑，我们考虑二分答案，现在二分到一个位置$pos$，我们首先把位置$\le pos$的操作按照$RMQ$值从大到小排序，然后依次分层操作，也就是说，（举个栗子）我们先把$RMQ$值为$6$的操作操作完，再操作$RMQ$值为$5$的操作操作完……

在操作相同的层时，可以根据刚才说的性质$1$判断。

但是只根据这一个性质是远远不够的，还有没有更多的性质？

从特殊情况考虑，如果出现这样的情况，那么肯定不行：

![](/images/min.png)

 但是出现这样的情况，那么可以接受：

![](/images/min2.png)

因为最小值$5$可以在边边上面出现。

这样的情况可以推广，用一句话总结：

性质$2$，假设现在我们要判断$RMQ$值为$x$的一个操作合不合法，我们在数轴上面把$RMQ$值$>x$代表的区间全部染色，如果现在的操作的区间全部被染色，则不合法（现在的$[l,r]$包含于大区间）

那么程序就很好实现了，只要一棵支持区间赋值成$1$，区间求和的线段树即可。

每次二分重建线段树，时间复杂度$O(n\log^2 n)$

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
        x=(x<<3)+(x<<1)+(ch^'0');
        ch=getchar();
    }
    return x*f;
}
namespace SegmentTree{
    struct node{
        int l,r;
        int tag,val;
        inline int len(){
            return r-l+1;
        }
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void Cover(int i){
        tree[i].tag=1,tree[i].val=tree[i].len();
    }
    inline void pushup(int i){
        tree[i].val=tree[lc].val+tree[rc].val;
    }
    inline void pushdown(int i){
        if (tree[i].tag){
            Cover(lc),Cover(rc);
            tree[i].tag=0;
        }
    }
    void Build(int i,int l,int r){
        tree[i].l=l,tree[i].r=r;
        tree[i].val=tree[i].tag=0;
        if (l==r) return ;
        int mid=(l+r)>>1;
        Build(lc,l,mid);
        Build(rc,mid+1,r);
    }
    void Update(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            Cover(i);
            return ;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        pushdown(i);
        if (L<=mid) Update(lc,L,R);
        if (mid<R) Update(rc,L,R);
        pushup(i);
    }
    int Query(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].val;
        }
        int mid=(tree[i].l+tree[i].r)>>1,ans=0;
        pushdown(i);
        if (L<=mid) ans+=Query(lc,L,R);
        if (mid<R) ans+=Query(rc,L,R);
        return ans;
    }
}
using namespace SegmentTree;
struct query{
    int l,r;
    int val;
}Q[MAXN],A[MAXN];
inline bool operator < (const query &A,const query &B){
    return A.val>B.val;
}
inline bool Covered(int l,int r){//判断是否全部被染色
    return (r-l+1)==Query(1,l,r);
}
int n,q;
inline bool Check(int pos){
    Build(1,1,n);
    for (register int i=1;i<=pos;++i){
        A[i]=Q[i];
    }
    sort(A+1,A+1+pos);
    int lmin,lmax,rmin,rmax;
    lmin=lmax=A[1].l;
    rmin=rmax=A[1].r;
    for (register int i=2;i<=pos;++i){
        if (A[i].val==A[i-1].val){//继续扩展
            lmin=min(lmin,A[i].l);
            lmax=max(lmax,A[i].l);
            rmin=min(rmin,A[i].r);
            rmax=max(rmax,A[i].r);
            if (lmax>rmin) return 1;
        }
        else {
            if (Covered(lmax,rmin)) return 1;
            Update(1,lmin,rmax);
            lmin=lmax=A[i].l;
            rmin=rmax=A[i].r;
        }
    }
    if (Covered(lmax,rmin)) return 1;
    return 0;
}
int main(){
    n=read(),q=read();
    for (register int i=1;i<=q;++i){
        Q[i]=query{read(),read(),read()};
    }
    int l=1,r=q;
    int ans=0;
    while (l<=r){
        int mid=(l+r)>>1;
        if (Check(mid)) ans=mid,r=mid-1;
        else l=mid+1;
    }
    printf("%d\n",ans);
}
```

