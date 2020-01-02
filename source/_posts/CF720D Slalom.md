---
title: CF720D Slalom 动态规划dp 线段树
  
tag:
  - 题解
  - 动态规划
  - 线段树
abbrlink: 3488b88e
date: 2019-07-13 20:34:14
---
[传送门](https://www.luogu.org/problemnew/show/CF720D)

考虑$dp$，但是这个$dp$该怎么$d$呢？
如果走路的时候能往右就往右，实在不行（有障碍物或往上走会产生新的方法）才向上
（也就是尽可能向低处走），我们就可以做到路径不“重复”。
于是$dp$就呼之欲出：
$F[i][j]=F[i-1][j]$	一般情况
$F[i][j]=0$	若这格是障碍
$F[i][j]=\sum^{j-1}_{k=low}F[i-1][k]$ 若$(i,j-1)$是某个障碍矩阵的左上角
其中$low$为$i-1$列中$j$往下第一个障碍的上面一格
维护一下$low$，并用前缀和优化一下转移即可得到$O(NM)$的算法

-----------------------

现在考虑如何优化：
$dp$转移的过程可以看成是一列扫描线扫过去。
于是我们建立一棵线段树，维护的是这一列$dp$的值。
yy一下，发现这棵线段树需要区间查询，区间设$0$，单点修改，不难实现。
继续思考：需要获得障碍的上下边界，还有快速查询$low$。
我们需要开一个$set$，维护这一列扫描线和障碍物相交的部分。
查询$low$就直接在$set$内lower_bound。
扫描线移动的时候就加上新出现的线段，减去消失的线段，维护一下即可。

-----------------
注意lower_bound(a.begin(),a.end(),x)和a.lower_bound(x)的区别。
前者最坏情况指针位移a.size()那么多，直接被卡$TLE$
本蒟蒻一直卡在那里
```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
#define MOD 1000000007
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
        int val;
        bool tag;
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void pushup(const int &i){
        tree[i].val=(tree[lc].val+tree[rc].val)%MOD;
    }
    inline void Change(const int &i,const int &rt){
        tree[i].val=0;
        tree[i].tag=true;
    }
    inline void pushdown(const int &i){
        if (tree[i].tag){
            Change(lc,i),Change(rc,i);
            tree[i].tag=false;
        }
    }
    void Build(int l,int r,int i){
        tree[i].l=l,tree[i].r=r;
        tree[i].tag=0,tree[i].val=0;
        if(l==r){return ;}
        int mid=(l+r)>>1;
        Build(l,mid,lc);
        Build(mid+1,r,rc);
    }
    void Cover(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            tree[i].tag=true;
            tree[i].val=0;
            return ;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L<=mid) Cover(lc,L,R);
        if (mid<R) Cover(rc,L,R);
        pushup(i);
    }
    void Update(int i,int index,int val){
        if (tree[i].l==tree[i].r){
            tree[i].val=val;
            return ;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1;
        if (index<=mid) Update(lc,index,val);
        else Update(rc,index,val);
        pushup(i);
    }
    int Query(int i,int L,int R){
        if (L>R) return 0;
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].val;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1,ans=0;
        if (L<=mid) ans=(ans+Query(lc,L,R))%MOD;
        if (mid<R) ans=(ans+Query(rc,L,R))%MOD;
        return ans;
    }
}
using namespace SegmentTree;
struct sgmt{
    int x,y1,y2;//是一条竖线 y1下端点 y2上端点
    bool flag;//是左边竖线还是右边竖线
    //0左边 1右边
};
inline bool operator < (const sgmt &A,const sgmt &B){
    if (A.x!=B.x){//先比较x
        return A.x<B.x;
    }
    else {
        if (A.y1==B.y1){
            return A.y2>B.y2;
        }
        else {
            return A.y1>B.y1;
        }
    }
}
#define pii pair<int,int> 
#define l first
#define r second
#define mp make_pair
set<pii>now;//现在扫描到的竖线中的线段
sgmt s[MAXN*2];int tot;//全部的竖线
inline void Add(sgmt A){s[++tot]=A;}
int main(){
    int n=read(),m=read(),k=read();
    for (register int i=1;i<=k;++i){
        int x1=read(),y1=read(),x2=read(),y2=read();
        Add(sgmt{x1,y1,y2,0});
        Add(sgmt{x2+1,y1,y2,1});//类似于差分的一个东西
    }
    Build(1,m,1);
    Update(1,1,1);
    sort(s+1,s+1+tot);
    int p=1;
    for (p=1;s[p].x==1;++p){//先把竖线加入初始的set
        if (s[p].flag==0){
            now.insert(mp(s[p].y1,s[p].y2));
        }
    }
    now.insert(mp(0,0));
    for (register int i=2;i<=n;++i){
        for (register int j=p;s[j].x==i;++j){//二分得到low 线段树区间加，维护DP
            int pos=s[j].y2+1;
            if (s[j].flag==0&&pos<=m){
                //s[j].y2+1<=m不加会RE
                int low=(*--now.lower_bound(mp(pos,0))).r;
                Update(1,pos,Query(1,low+1,pos));//玄学边界
            }
        }
        //下面都是维护now集合，删去移动区间导致消失的线段，加上新的线段
        //这两个顺序不能换（公交车先下后上的原理）
        for (register int j=p;s[j].x==i;++j){//减去消失的线段
            if (s[j].flag){
                now.erase(mp(s[j].y1,s[j].y2));
            }
        }
        for (register int j=p;s[j].x==i;++j,++p){
            if (!s[j].flag){
                now.insert(mp(s[j].y1,s[j].y2));
                Cover(1,s[j].y1,s[j].y2);//顺便把有障碍物的区间设成0
            }
        }
        //至于F[i][j]=F[i-1][j]不要管，因为区间从左到右移动，直接继承上一个区间的F[i][j]
    }
    cout<<Query(1,(*(--now.end())).l+1,m)%MOD<<endl;
}```