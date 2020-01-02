---
title: CF482B Interesting Array 线段树
  
tag:
  - 题解
  - 线段树
abbrlink: 6cbf9bb0
date: 2019-07-13 20:34:14
---
# 题面
构建一个序列$a$,满足$m$条限制. 限制形如$<l,r,q>$: $a[l]$&$a[l+1]$&...&$a[r-1]$&$a[r]=q$;(此处&为位运算的$\rm and$操作).

# 题解
我们发现：
- 如果$q$的第$i$位为$1$，那么$a[l],a[l+1]...a[r]$的第$i$位都为$1$。
- 如果$q$的第$i$位为$0$，那么$a[l],a[l+1]...a[r]$的第$i$位至少有一个为$0$。

考虑将将所有二进制状态压缩在一个$int$里，用线段树维护。
将$a[1]$到$a[n]$先设为$0$。
先满足第一个条件（$a[l],a[l+1]...a[r]$的第$i$位都为$1$），用按位或运算将$a[l],a[l+1]...a[r]$的第$i$位设成$1$。
最后扫一遍，看满不满足第二个条件，做判断。
```cpp
#include <bits/stdc++.h>
#define MAXN 100005
using namespace std;
int ans[MAXN];
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
        int val,tag;
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void pushup(int i){
        tree[i].val=tree[lc].val&tree[rc].val;
    }
    inline void pushdown(int i){
        if (tree[i].tag){
            tree[lc].tag|=tree[i].tag;
            tree[rc].tag|=tree[i].tag;
            tree[lc].val|=tree[i].tag;
            tree[rc].val|=tree[i].tag;
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
    void Update(int i,int L,int R,int val){
        if (L<=tree[i].l&&tree[i].r<=R){
            tree[i].val|=val;
            tree[i].tag|=val;
            return ;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L<=mid) Update(lc,L,R,val);
        if (mid<R) Update(rc,L,R,val);
        pushup(i);
    }
    int Query(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].val;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L>mid) return Query(rc,L,R);
        else if (mid>=R) return Query(lc,L,R);
        else return Query(lc,L,R)&Query(rc,L,R);
    }
    void Out(int i){//记录结果
        if (tree[i].l==tree[i].r){
            ans[tree[i].l]=tree[i].val;
            return ;
        }
        pushdown(i);
        Out(lc);  
        Out(rc);
    }
}
using namespace SegmentTree;
int ql[MAXN],qr[MAXN],qp[MAXN];
int main(){
    int n=read(),m=read();
    Build(1,1,n);
    for (register int i=1;i<=m;++i){
        ql[i]=read(),qr[i]=read(),qp[i]=read();
        Update(1,ql[i],qr[i],qp[i]);//第i位设成1
    }
    Out(1);
    for (register int i=1;i<=m;++i){
        if (Query(1,ql[i],qr[i])!=qp[i]){//扫一遍，判断满不满足
            puts("NO");
            return 0;
        }
    }
    puts("YES");
    for (register int i=1;i<=n;++i){
        printf("%d ",ans[i]);
    }
}
```
