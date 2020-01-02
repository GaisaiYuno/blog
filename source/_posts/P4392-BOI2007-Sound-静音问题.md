---
title: 'P4392 [BOI2007]Sound 静音问题'
abbrlink: ade5d163
date: 2019-07-25 13:26:36
tags:
  - 题解
  - 线段树

---

[传送门](https://www.luogu.org/problem/P4392 )

线段树模板题。

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
using namespace std;
inline int read(){
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9'){
        if (x=='-') f=-1;
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
        int maxn,mino;
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void pushup(int i){
        tree[i].maxn=max(tree[lc].maxn,tree[rc].maxn);
        tree[i].mino=min(tree[lc].mino,tree[rc].mino);
    }
    void Build(int i,int l,int r){
        tree[i].l=l,tree[i].r=r;
        if (l==r){
            tree[i].maxn=tree[i].mino=a[l];
            return ;
        }
        int mid=(l+r)>>1;
        Build(lc,l,mid);
        Build(rc,mid+1,r);
        pushup(i);
    }
    int QueryMax(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].maxn;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        int ans=-0x7fffffff;
        if (L<=mid) ans=max(ans,QueryMax(lc,L,R));
        if (mid<R) ans=max(ans,QueryMax(rc,L,R));
        return ans;
    }
    int QueryMin(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].mino;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        int ans=0x7fffffff;
        if (L<=mid) ans=min(ans,QueryMin(lc,L,R));
        if (mid<R) ans=min(ans,QueryMin(rc,L,R));
        return ans;
    }
}
using namespace SegmentTree;
int main(){
    int n=read(),m=read(),c=read();
    for (register int i=1;i<=n;++i) a[i]=read();
    Build(1,1,n);
    bool flag=false;
    for (register int i=1;i<=n-m+1;++i){
        int Max=QueryMax(1,i,i+m-1),Min=QueryMin(1,i,i+m-1);
        if (Max-Min<=c){
            printf("%d\n",i);
            flag=true;
        }
    }
    if (!flag) printf("NONE\n");
}
```

