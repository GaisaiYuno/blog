---
title: CF438D The Child and Sequence 线段树
  
tag:
  - 题解
  - 线段树
abbrlink: 139c564f
date: 2019-07-13 20:34:14
---
[传送门](https://www.luogu.org/problemnew/show/CF438D)

线段树的神奇操作
考虑维护区间和，区间最大值。
取模的时候，若当前区间的最大值小于$\rm Mod$
你就会发现这个区间的所有数都不会变，直接$\rm return$ ，不用继续维护。

------------
记得开$\rm long$ $\rm long$，我被$\rm long$ $\rm long$孙了很久

```cpp
#include <bits/stdc++.h>
#define int long long
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
int a[MAXN];
namespace SegmentTree{
    struct node{
        int l,r;
        int val,maxn;
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    void pushup(int i){
        tree[i].val=tree[lc].val+tree[rc].val;
        tree[i].maxn=max(tree[lc].maxn,tree[rc].maxn);
    }
    void Build(int i,int l,int r){
        tree[i].l=l,tree[i].r=r;
        if (l==r){
            tree[i].val=tree[i].maxn=a[l];
            return ;
        }
        int mid=(l+r)>>1;
        Build(lc,l,mid);
        Build(rc,mid+1,r);
        pushup(i);
    }
    void Update(int i,int index,int val){
        if (tree[i].l==tree[i].r){
            tree[i].val=tree[i].maxn=val;
            return ;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        if (index<=mid) Update(lc,index,val);
        else Update(rc,index,val);
        pushup(i);
    }
    void Mod(int i,int L,int R,int M){
        if (tree[i].maxn<M) return ;//取模以后结果肯定不变
        if (tree[i].l==tree[i].r){
            tree[i].val=tree[i].maxn=(tree[i].val%M);
            return ;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L<=mid) Mod(lc,L,R,M);
        if (mid<R) Mod(rc,L,R,M);
        pushup(i);
    }
    int Query(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].val;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        int ans=0;
        if (L<=mid) ans+=Query(lc,L,R);
        if (mid<R) ans+=Query(rc,L,R);
        return ans;
    }
}
using namespace SegmentTree;
#undef int
int main(){
#define int long long
    int n=read(),m=read();
    for (register int i=1;i<=n;++i){
        a[i]=read();
    }
    Build(1,1,n);
    while (m--){
        int opr=read();
        if (opr==1){
            int l=read(),r=read();
            printf("%lld\n",Query(1,l,r));
        }
        else if (opr==2){
            int l=read(),r=read(),x=read();
            Mod(1,l,r,x);
        }
        else {
            int k=read(),x=read();
            Update(1,k,x);
        }
    }
}```
```