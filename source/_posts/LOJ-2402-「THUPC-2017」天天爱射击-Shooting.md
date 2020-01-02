---
title: 'LOJ #2402. 「THUPC 2017」天天爱射击 / Shooting'
abbrlink: 50db0ada
date: 2019-08-05 12:21:19
tags:
  - 题解
  - 可持久化
  - 线段树
  - 主席树

---

[传送门](https://loj.ac/problem/2402)

一开始看到这道题，非常懵逼，不知道怎么做。

然后发现子弹是按照顺序发射的，于是转化一下题目条件，木板$[L_i,R_i]$会在接触到第$S_i$个子弹时破掉，于是就转换成求$[L_i,R_i]$第$S_i$大的子弹编号是多少。

这就是主席树模板嘛！

p.s.如果你懒（像我一样），不想把操作离线下来搞，就可以搞一下线段树合并，反正没几行。

注意：

要特判如果打到木板$i$上面的子弹不足$S_i$，这样显然木板不能被打碎，要continue掉。

注意$Update(rt[pos],1,MAXN,i);$这里的$MAXN$不能写成小的$maxn$，可能会出一些玄学问题。

```cpp
#include <bits/stdc++.h>
#define MAXN 300005
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
int rt[MAXN];
namespace SegmentTree{
    struct node{
        int l,r;
        int cnt;
    }tree[MAXN*200];
    #define lc tree[i].l
    #define rc tree[i].r
    int tot;
    inline void pushup(int i,int x,int y){
        tree[i].cnt=tree[x].cnt+tree[y].cnt;
    }
    void Update(int &i,int l,int r,int pos){
        if (!i) i=++tot;
        if (l==r){
            tree[i].cnt++;
            return ;
        }
        int mid=(l+r)>>1;
        if (pos<=mid) Update(lc,l,mid,pos);
        else Update(rc,mid+1,r,pos);
        pushup(i,lc,rc);
    }
    int Query(int rt1,int rt2,int l,int r,int k){
        if (l==r) return l;
        int mid=(l+r)>>1,cnt=tree[tree[rt2].l].cnt-tree[tree[rt1].l].cnt;
        if (k<=cnt) return Query(tree[rt1].l,tree[rt2].l,l,mid,k);
        else return Query(tree[rt1].r,tree[rt2].r,mid+1,r,k-cnt);
    }
    void Merge(int &x,int y){
        if (!x||!y){
            x=x+y;
            return ;
        }
        pushup(x,x,y);
        Merge(tree[x].l,tree[y].l);
        Merge(tree[x].r,tree[y].r);
    }
}
using namespace SegmentTree;
struct Board{
    int l,r,s;
}b[MAXN];
int Ans[MAXN];
int main(){
    int n=read(),m=read();
    int maxn=0;
    for (register int i=1;i<=n;++i){
        b[i].l=read(),b[i].r=read(),b[i].s=read();
        maxn=max(maxn,b[i].l);
        maxn=max(maxn,b[i].r);
    }
    for (register int i=1;i<=m;++i){
        int pos=read();
        maxn=max(maxn,pos);
        Update(rt[pos],1,MAXN,i);
    }
    for (register int i=1;i<=maxn;++i){
        Merge(rt[i],rt[i-1]);
    }
    for (register int i=1;i<=n;++i){
        int l=b[i].l,r=b[i].r,s=b[i].s;
        if (tree[rt[r]].cnt-tree[rt[l-1]].cnt<s) {//特判这种情况
            continue;
        }
        else {
            Ans[Query(rt[l-1],rt[r],1,MAXN,s)]++;
        }
    }
    for (register int i=1;i<=m;++i){
        printf("%d\n",Ans[i]);
    }
}
```

