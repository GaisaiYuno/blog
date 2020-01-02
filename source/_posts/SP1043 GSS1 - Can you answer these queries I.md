---
title: SP1043 GSS1 - Can you answer these queries I 线段树
  
tag:
  - 题解
  - 线段树
  - GSS
abbrlink: 4171bd57
date: 2019-07-13 20:34:14
---

[传送门](https://www.luogu.org/problemnew/show/SP1043)
**线段树每个节点中存的值：**

$val[]$ ——区间所有数之和
$lmax[]$ ——选的$a[i]$在区间内，且包括$a[l]$，连续$a[i]$之和的最大值
$rmax[]$ ——选的$a[i]$在区间内，且包括$a[r]$，连续$a[i]$之和的最大值
$maxn[]$ ——选的$a[i]$在区间内，连续$a[i]$之和的最大值（即本题答案）
之所以要计算$lmax$，$rmax$，$val$，是为了合并节点时，能计算出$maxn$的值

------------------------------------

这里介绍一种比较简洁的写法
这道题中线段树的重点是节点合并，即$pushup$的过程
不妨**将节点合并的操作定义为+**
这样Query时就不用再敲一遍相同的代码，直接将查询结果相"+"即可
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
        int lmax,rmax,maxn;
        //从左端开始最大值，从右端开始最大值，整段最大值
        int val;//这段的和
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    node operator + (node A,node B){//定义合并操作+
        node temp;
        temp.lmax=max(B.lmax+A.val,A.lmax);
        //可以左区间全部选，加上右区间lmax,也可以直接用左区间lmax
        temp.rmax=max(A.rmax+B.val,B.rmax);
        //同理
        temp.maxn=max(max(A.maxn,B.maxn),A.rmax+B.lmax);
        //可以直接用左右区间maxn,也可以将左右区间rmax,lmax合并
        temp.val=A.val+B.val;
        temp.l=A.l,temp.r=B.r;
        return temp;
    }
    void pushup(int i){
        tree[i]=tree[lc]+tree[rc];
    }
    void Build(int l,int r,int i){//建树
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
        //这里就不用再重复一遍节点合并的过程
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
        int L=read(),R=read();
        node temp=Query(L,R,1);
        printf("%d\n",temp.maxn);
    }
}
```
猫树：
```cpp
// luogu-judger-enable-o2
#include <bits/stdc++.h>
#define MAXN (1<<20)+7
#define MAXM 23
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
int cnt[MAXN];
inline void Init(int len){
    cnt[1]=0;
    for(register int i=2;i<=len<<1;++i){
        cnt[i]=cnt[i>>1]+1;
    }
}
inline void write(int x){
    if(x<0)putchar('-'),x*=-1;
    if(!x)putchar(48);
    static int sta[45],tp;
    for(tp=0;x;x/=10)sta[++tp]=x%10;
    for(;tp;putchar(sta[tp--]^48));
    putchar('\n');
}
int a[MAXN];
namespace Meow_Tree{
    int pos[MAXN];//编号
    int maxn[MAXM][MAXN],pmax[MAXM][MAXN];//区间最大值，包含端点最大值
    void Build(int l,int r,int i,int d){
        if (l==r) {
            pos[l]=i;
            return ;
        }
        int mid=(l+r)>>1;
        int sum,Max;
        sum=pmax[d][mid]=maxn[d][mid]=a[mid],Max=max(a[mid],0);
        for (register int i=mid-1;i>=l;--i){
            sum+=a[i],Max+=a[i];
            pmax[d][i]=max(pmax[d][i+1],sum);
            maxn[d][i]=max(maxn[d][i+1],Max);
            Max=max(Max,0);
        }
        sum=pmax[d][mid+1]=maxn[d][mid+1]=a[mid+1],Max=max(a[mid+1],0);
        for (register int i=mid+2;i<=r;++i){
            sum+=a[i],Max+=a[i];
            pmax[d][i]=max(pmax[d][i-1],sum);
            maxn[d][i]=max(maxn[d][i-1],Max);
            Max=max(Max,0);
        }
        Build(l,mid,i<<1,d+1);
        Build(mid+1,r,i<<1|1,d+1);
    }
    inline int Query(int l,int r){
        if (l==r) return a[l];
        int p=cnt[pos[l]]-cnt[pos[l]^pos[r]];
        return max(max(maxn[p][l],maxn[p][r]),pmax[p][l]+pmax[p][r]);
    }
}
using namespace Meow_Tree;
int main(){
    int n=read();
    for (register int i=1;i<=n;++i) {
        a[i]=read();
    }
    int len=2;
    while (len<n) len<<=1;//要建完全2叉树
    Init(len);
    Build(1,len,1,1);
    int m=read();
    while (m--){
        int l=read(),r=read();
        printf("%d\n",Query(l,r));
    }
}
```