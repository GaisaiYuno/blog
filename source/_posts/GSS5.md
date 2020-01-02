---
title: SP2916 GSS5 - Can you answer these queries V 线段树
  
tag:
  - 题解
  - 线段树
  - GSS
abbrlink: 733d8170
date: 2019-07-13 20:34:14
---
[传送门](https://www.luogu.org/problemnew/show/SP2916)
# 题面
给定一个序列。查询左端点在$[x_1, y_1]$之间，且右端点在$[x_2, y_2]$之间的最大子段和，
数据保证$x_1\leq x_2,y_1\leq y_2$ ，但是不保证端点所在的区间不重合

# 题解
线段树好题，建议先做[SP1043 GSS1 - Can you answer these queries I](https://www.luogu.org/problemnew/show/SP1043)

首先分析两线段相离的情况，发现$[y1+1,x2-1]$是必选区间
![](/images/GSS1.png)

然后分析两线段相交的情况：
![](/images/GSS2.png)

有三种情况
 - 端点在$[x2,y1]$，只用求$[x2,y1]$区间子段最大值
 - 左端点在$[x1,x2-1]$，右端点在$[x2,y2]$，按照线段相离的方法来求
 - 左端点在$[x1,y1]$，右端点在$[x1+1,y2]$，同理

$p.s.$可能$cmath$不支持$y1$，我把$x1,y1,x2,y2$换成了$l1,r1,l2,r2$。
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
    node empty_node(){
        node temp;
        temp.l=temp.r=temp.lmax=temp.rmax=temp.maxn=temp.val=0;
        return temp;
    }
    void Init(){
        memset(tree,0,sizeof(tree));
    }
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
    node TEMPQuery(int L,int R,int i){
        if (L>R) return empty_node();//特判L>R情况
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i];
        }
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L>mid) return TEMPQuery(L,R,rc);
        else if (R<=mid) return TEMPQuery(L,R,lc);
        else return TEMPQuery(L,R,lc)+TEMPQuery(L,R,rc);
    }
    node Query(int L,int R){
        return TEMPQuery(L,R,1);
    }
};
using namespace SegmentTree;
inline int Get_Ans(int l1,int r1,int l2,int r2){//r1<=l2即区间[l1,r1],[l2,r2]相离或相切
    if (r1==l2) return Query(l1,r1).rmax+Query(l2,r2).lmax-a[r1];//相切特殊情况
    return Query(l1,r1).rmax+Query(r1+1,l2-1).val+Query(l2,r2).lmax;
}
inline int Solve(int l1,int r1,int l2,int r2){
    if (l1==l2&&r1==r2){
        return Query(l1,r1).maxn;
    }
    if (r1<l2){
        return Get_Ans(l1,r1,l2,r2);
    }
    else {
        int ans=Query(l2,r1).maxn;
        ans=max(ans,Get_Ans(l1,l2,l2,r2));
        ans=max(ans,Get_Ans(l1,r1,r1,r2));
        return ans;
    }
}
int main(){
    int Case=read();
    for (register int k=1;k<=Case;++k){
        int n=read();
        for (register int i=1;i<=n;++i){
            a[i]=read();
        }
        Init();
        Build(1,n,1);
        int q=read();
        while (q--){
            int l1=read(),r1=read(),l2=read(),r2=read();
            printf("%d\n",Solve(l1,r1,l2,r2));
        }
    }
}
```
