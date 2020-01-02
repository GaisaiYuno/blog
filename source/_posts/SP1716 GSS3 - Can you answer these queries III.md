---
title: SP1716 GSS3 - Can you answer these queries III 线段树
  
tag:
  - 题解
  - 线段树
  - GSS
abbrlink: 663570ad
date: 2019-07-13 20:34:14
---
建议先做[SP1043 GSS1 - Can you answer these queries I](https://www.luogu.org/problemnew/show/SP1043)
[传送门](https://www.luogu.org/problemnew/show/SP1716)
没什么好讲的，也就是在GSS1的基础上加一个修改，连pushdown都不要。
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
int a[MAXN];
namespace SegmentTree{
    struct node{
        int l,r;
        int lmax,rmax,maxn;//从左端开始最大值，从右端开始最大值，整段最大值
        int val;//这段的和
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    node operator + (node A,node B){
        node temp;
        temp.lmax=max(B.lmax+A.val,A.lmax);
        temp.rmax=max(A.rmax+B.val,B.rmax);
        temp.maxn=max(max(A.maxn,B.maxn),A.rmax+B.lmax);
        temp.val=A.val+B.val;
        temp.l=A.l,temp.r=B.r;
        return temp;
    }
    void pushup(int i){
        tree[i]=tree[lc]+tree[rc];
    }
    void Build(int l,int r,int i){
        if (l==r){
            tree[i].lmax=tree[i].rmax=tree[i].maxn=tree[i].val=a[l];
            tree[i].l=tree[i].r=l;
            return ;
        }
        int mid=(l+r)>>1;
        Build(l,mid,lc);
        Build(mid+1,r,rc);
        pushup(i);
    }
    node Query(int L,int R,int i){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i];
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L>mid) return Query(L,R,rc);
        else if (R<=mid) return Query(L,R,lc);
        else return Query(L,R,lc)+Query(L,R,rc);
    }
    void Update(int index,int i,int val){
        if (tree[i].l==tree[i].r){
            tree[i].lmax=tree[i].rmax=tree[i].maxn=tree[i].val=val;
            return ;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        if (index<=mid) Update(index,lc,val);
        else Update(index,rc,val);
        pushup(i);
    }
};
using namespace SegmentTree;
int main(){
    int n=read();
    for (register int i=1;i<=n;++i){
        a[i]=read();
    }
    Build(1,n,1);
    int q=read();
    while (q--){
        int opr=read(),L=read(),R=read();
        if (opr==0){
            Update(L,1,R);
        }
        else {
            printf("%d\n",Query(L,R,1).maxn);
        }
    }
}```