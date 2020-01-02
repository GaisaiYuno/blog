---
title: SP2713 GSS4 - Can you answer these queries IV 线段树
  
tag:
  - 题解
  - 线段树
  - GSS
abbrlink: 491bd6e
date: 2019-07-13 20:34:14
---

[传送门](https://www.luogu.org/problemnew/show/SP2713)
注意到开方是向下取整的，而且$\sum a_i \le 10^{18}$
所以我们发现没开几次方，大部分$a_i$都会变成$1$，此时再怎么开方，$a_i$还是$1$，所以不用修改$a_i$
所以想到开一个$flag$，记录这个区间是不是都是$1$
若区间都是$1$修改时直接跳过
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
int a[MAXN];
namespace SegmentTree{
    struct node{
        int l,r;
        bool flag;
        int val;//这段的和
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    void pushup(int i){
        tree[i].val=tree[lc].val+tree[rc].val;
        tree[i].flag=tree[lc].flag&tree[rc].flag;
    }
    void Init(){
        memset(tree,0,sizeof(tree));
    }
    void Build(int l,int r,int i){
        tree[i].l=l,tree[i].r=r;
        if (l==r){
            tree[i].val=a[l];
            if (tree[i].val==1) tree[i].flag=true;
            return ;
        }
        int mid=(l+r)>>1;
        Build(l,mid,lc);
        Build(mid+1,r,rc);
        pushup(i);
    }
    void Update(int L,int R,int i){//暴♂力update
        if (tree[i].flag) return ;
        if (tree[i].l==tree[i].r){
            tree[i].val=(int)(sqrt(tree[i].val));
            if (tree[i].val==1) tree[i].flag=true;
            return ;
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L<=mid) Update(L,R,i<<1);
        if (mid<R) Update(L,R,i<<1|1);
        pushup(i);
    }
    int Query(int L,int R,int i){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].val;
        }
        int ans=0;
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L<=mid) ans+=Query(L,R,i<<1);
        if (mid<R) ans+=Query(L,R,i<<1|1);
        return ans;
    }
};
using namespace SegmentTree;
#undef int
int main(){
#define int long long
    //freopen("1.in","r",stdin);
    int n,cnt=0;
    while (scanf("%lld",&n)!=EOF){
        for (register int i=1;i<=n;++i){
            a[i]=read();
        }
        Init();
        Build(1,n,1);
        int q=read();
        printf("Case #%lld:\n",++cnt);
        while (q--){
            int opr=read(),l=read(),r=read();
            if (l>r) swap(l,r);
            if (opr==0){
                Update(l,r,1);
            }
            else {
                printf("%lld\n",Query(l,r,1));
            }
        }
        printf("\n");
    }
}
```