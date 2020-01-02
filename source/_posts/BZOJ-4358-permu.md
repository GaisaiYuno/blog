---
title: BZOJ 4358 permu
abbrlink: f36dea03
date: 2019-08-07 10:11:22
tags:
  - 题解
  - 莫队
  - 回滚莫队
---

[BZOJ](https://www.lydsy.com/JudgeOnline/problem.php?id=4358)

[GDOI](http://119.29.55.79/problem/361)

首先，安利一下巨佬ypy的[博客](https://www.cnblogs.com/birchtree/p/11310436.html)，我的思路是参照ypy博客的。

先说一下我的思路，首先，将问题抽象为往一个数轴上面放$1$，求最长连续$1$的值。

## Sol1:

线段树维护连续$1$的最大值，代码非常简单，维护区间连续$1$最大值$maxn$，从左边开始连续$1$最大值$lmax$，从右边开始连续$1$最大值$rmax$，区间$1$的和$val$。

时间复杂度$O(n \sqrt n \log n)$，在$BZOJ$上面$\rm AC$，但是在$GDOI$上面$TLE$

```cpp
#include <bits/stdc++.h>
#define MAXN 50005
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
        int l,r,val;
        int lmax,rmax,maxn;
        inline int len(){
            return r-l+1;
        }
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void Change(int i){
        tree[i].lmax=1-tree[i].lmax;
        tree[i].rmax=1-tree[i].rmax;
        tree[i].maxn=1-tree[i].maxn;
        tree[i].val=1-tree[i].val;
    }
    inline void pushup(int i){
        tree[i].val=tree[lc].val+tree[rc].val;
        tree[i].lmax=tree[lc].lmax;
        if (tree[lc].val==tree[lc].len()) tree[i].lmax=max(tree[i].lmax,tree[lc].len()+tree[rc].lmax);
        tree[i].rmax=tree[rc].rmax;
        if (tree[rc].val==tree[rc].len()) tree[i].rmax=max(tree[i].rmax,tree[rc].len()+tree[lc].rmax);
        tree[i].maxn=max(max(tree[lc].maxn,tree[rc].maxn),tree[lc].rmax+tree[rc].lmax);
    }
    void Update(int i,int l,int r,int pos){
        if (l==r){
            Change(i);
            return ;
        }
        int mid=(l+r)>>1;
        if (pos<=mid) Update(lc,l,mid,pos);
        else Update(rc,mid+1,r,pos);
        pushup(i);
    }
    void Build(int i,int l,int r){
        tree[i].l=l,tree[i].r=r;
        if (l==r){
            return ;
        }
        int mid=(l+r)>>1;
        Build(lc,l,mid);
        Build(rc,mid+1,r);
    }
}
using namespace SegmentTree;
int a[MAXN],pos[MAXN];
struct Query{
    int l,r,id;
}q[MAXN];
inline bool operator < (const Query &a,const Query &b){
    return pos[a.l]<pos[b.l]||(pos[a.l]==pos[b.l]&&((pos[a.l]&1)?a.r<b.r:a.r>b.r));
}
int Ans[MAXN];
int main(){
    int n=read(),m=read();
    int Size=sqrt(n);
    for (register int i=1;i<=n;++i){
        a[i]=read();
        pos[i]=(i-1)/Size+1;
    }
    for (register int i=1;i<=m;++i){
        q[i].l=read(),q[i].r=read(),q[i].id=i;
    }
    sort(q+1,q+1+m);
    int l=1,r=0;
    Build(1,1,n);
    for (register int i=1;i<=m;++i){
        while (l<q[i].l) Update(1,1,n,a[l++]);
        while (l>q[i].l) Update(1,1,n,a[--l]);
        while (r<q[i].r) Update(1,1,n,a[++r]);
        while (r>q[i].r) Update(1,1,n,a[r--]);
        Ans[q[i].id]=tree[1].maxn;
    }
    for (register int i=1;i<=m;++i){
        printf("%d\n",Ans[i]);
    }
}
```

## Sol2:

线段树不行，怎么搞？

注意到题目说的是$1$到$n$的排列，所以每个数都是不同的。

首先，发现一个性质，只有往连续$1$的端点左/右侧放$1$，才能增加答案长♂度。

我们画图理解一下：

![](/images/duliu.png)

其中标红代表原来就有$1$。

考虑加进一个数，用蓝色代表。

显然，加进这样一个蓝色对答案没有影响，因为答案至少是$1$。

![](/images/duliu2.png)

但是这样加一个蓝色对答案就有影响了。

![](/images/duliu3.png)

考虑维护这样一个$Max[i]$数组，其中当$i$为端点时， $Max[i]$代表连续$1$的另一端的下标。

对于这个图来说：

![](/images/duliu4.png)

$Max[2]=4,Max[4]=2,Max[6]=6$

考虑如何维护这个$Max$数组。

加进一个$1$之后，计算加进这个$1$后包含这个$1$的最长连续$1$的左右端点，用$L$，$R$表示。

那么我们更新的时候直接$Max[L]=R,Max[R]=L$即可。

考虑如何撤销，发现这个撤销并不好搞，因为从中间断开的时候，无法知道左右端点在哪里。

于是我们使用回滚莫队，具体可以参见这篇[博客](https://gaisaiyuno.github.io/archives/e8e86fd2.html)。

加入的时候，我们搞一个栈，每来一个更新操作，把修改的位置和原来的值记上，然后还原就直接从栈里面一个一个还原即可，不用所谓的撤销操作。

特别特别注意一点，暴力搞完以后要把$ans$设成$1$，因为这个调了一个晚上。

时间复杂度$O(n \sqrt n)$

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
static int vis[MAXN];
static int Max[MAXN];//最重要的数组，存的是这一段的另一个端点
int ans,Size;
struct node{
    int pos,org;//位置，一开始的值
}stk[MAXN];
int top,f;
inline void Update(int pos,int val){
    if (f) stk[++top]=node{pos,Max[pos]};
    Max[pos]=val;
}
inline void Add(int x){
    vis[x]=1;
    int L=vis[x-1]?Max[x-1]:x,R=vis[x+1]?Max[x+1]:x;
    ans=max(ans,R-L+1);
    Update(L,R);Update(R,L);
}
inline void Undo(){
    for (register int i=top;i>=1;--i){
        Max[stk[i].pos]=stk[i].org;
    }
    top=0;
}
inline int BruteForce(int l,int r){
    ans=1;
    f=false;
    for (register int i=l;i<=r;++i){
        Add(a[i]);
    }
    for (register int i=l;i<=r;++i){
        Max[a[i]]=0,vis[a[i]]=0;
    }
    int temp=ans;
    ans=1;
    return temp;
}
inline int MoQueue(int i,int id){
    int R=min(n,Size*id);
    int l=R,r=R-1;
    ans=1;
    memset(vis,0,sizeof(vis));
    memset(Max,0,sizeof(Max));
    top=0;
    while (pos[q[i].l]==id){
        if (pos[q[i].l]==pos[q[i].r]){
            Ans[q[i].id]=BruteForce(q[i].l,q[i].r);
            i++;
            continue;
        }
        f=false;
        while (r<q[i].r) Add(a[++r]);
        int temp=ans;
        f=true;
        while (l>q[i].l) Add(a[--l]);
        Ans[q[i].id]=ans;
        while (l<R) vis[a[l++]]=0;
        Undo();
        ans=temp;
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

