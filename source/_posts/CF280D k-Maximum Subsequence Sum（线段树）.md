---
title: CF280D k-Maximum Subsequence Sum 线段树
  
tag:
  - 题解
  - 暴力
  - 线段树
  - 毒瘤
  - 贪心
  - 费用流
abbrlink: 6ce8a7e1
date: 2019-07-13 20:34:14
---
[传送门](https://www.luogu.org/problemnew/show/CF280D)
# 题面大意：
长度为$n$的数列，支持两种操作：
$1.$修改某个位置的值
$2.$询问区间$[l,r]$里选出至多$k$个不相交的子段和的最大值。 一共有$m$个操作

# 解法：
## 暴力
$dp$+滚动数组（在本地卡进$2s$）
模拟赛的时候有人用这个方法$A$了
$dp[i][j][p]$表示进行到$a[i]$，用了$j$个区间，$a[i]$选不选
大力转移即可
```cpp
#include <bits/stdc++.h>
#define MAXN 200005
using namespace std;
inline int read() {
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9') {
        if (ch=='-') f=-1;
        ch=getchar();
    }
    while (ch>='0'&&ch<='9') {
        x=(x*10)+(ch-'0');
        ch=getchar();
    }
    return x*f;
}
int a[MAXN];
namespace bf{
	int dp[2][25][2];
	inline int query(int l,int r,int k){
		memset(dp,0,sizeof(dp));
		for (register int i=l;i<=r;++i){
			for (register int j=1;j<=k;++j){
				dp[i&1][j][0]=max(dp[!(i&1)][j][1],dp[!(i&1)][j][0]);
				dp[i&1][j][1]=max(dp[!(i&1)][j-1][0],dp[!(i&1)][j][1])+a[i];
				dp[i&1][j][1]=max(dp[i&1][j][1],dp[!(i&1)][j-1][0]+a[i]);
			}
		}
		int ans=-0x7fffffff;
		for (register int i=0;i<=k;++i){
			ans=max(ans,max(dp[r&1][i][1],dp[r&1][i][0]));
		}
		return ans;
	}
}
using namespace bf;
int main(){
	int n=read();
	for (register int i=1;i<=n;++i){
		a[i]=read();
	}
	int q=read();
	while (q--){
		int opr=read();
		if (opr==0){
			int i=read(),val=read();
			a[i]=val;
		}
		else {
			int l=read(),r=read(),k=read();
			printf("%d\n",query(l,r,k));
		}
	}
}
```
## 正解
毒瘤线段树，维护$18$个值：
$sum$ 区间和
$l,r$ 区间左右边界
$maxs$ 最大子段和
$mins$ 最小子段和
$maxsl$ 最大子段和左边界
$maxsr$最大子段和右边界
$minsl$最小子段和左边界
$minsr$最小子段和右边界
$maxl,minl$最大，最小前缀和
$maxlp,minlp$最大，最小前缀和右端点（显然左端点确定） 
$maxr,minr$最大，最小后缀和
$maxrp,minrp$最大，最小后缀和左端点
$flag$翻转标记

每次取最大子段和，$ans+=$最大子段和，
然后把最大子段和的区间每个数$*-1$，如果最大子段和$<=0$或者操作次数$>k$退出

你肯定会有疑问：这样怎么保证取出来不超过$k$段？

设原数列最大子段和为$\sum_{p=i}^{j} a_p$：
$a_1 a_2 a_3 ... a_i a_{i+1} a_{i+2} ... a_{j-1} a_{j} .... a{n}$
取出最大子段和，区间$*-1$
$a_1 a_2 a_3 ... -a_i -a_{i+1} -a_{i+2} ... -a_{j-1} -a_{j} .... a{n}$
假设操作一次后最大子段和变为$\sum_{p=i'}^{j'} a_p$，其中$i'<j$且$j<j'$
$a_1 a_2 a_3 ... a_{i'} a_{i'+1} a_{i'+2} ... a_{j'-1} a_{j'} .... a{n}$
两次结果相加，中间部分抵消：
$a_i + a_{i+1} + a_{i+2} ... + a_{j-1} + a_{j} +a_{i'} + a_{i'+1} + a_{i'+2} +... a_{j'-1} + a_{j'}$
$=a_i+...+a_{i'-1}+a_{j+1}+...+a_{j'}$
结果变为两段，即$k=2$
其他情况自己脑补一下，就会发现其实每次操作后段数最多$+1$

贪心的正确性可以用费用流证明，这里贴一篇[博客](https://blog.csdn.net/liangzihao1/article/details/81361155)

p.s.不要忘记恢复修改过的线段树
```cpp
#include <bits/stdc++.h>
#define MAXN 100005
using namespace std;
inline int read() {
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9') {
        if (ch=='-') f=-1;
        ch=getchar();
    }
    while (ch>='0'&&ch<='9') {
        x=(x*10)+(ch-'0');
        ch=getchar();
    }
    return x*f;
}
int a[MAXN];
bool DBG=true;
namespace SegmentTree{
	struct node{
		int sum;//区间和
		int l,r;//区间左右边界
		int maxs;//最大子段和
        int mins;//最小子段和
		int maxsl;//最大子段和左边界
        int maxsr;//最大子段和右边界
		int minsl;//最小子段和左边界
        int minsr;//最小子段和右边界
		int maxl,minl;//最大，最小前缀和
		int maxlp,minlp;//最大，最小前缀和右端点（显然左端点确定） 
		int maxr,minr;//最大，最小后缀和
		int maxrp,minrp;//最大，最小后缀和左端点
		bool flag;//翻转标记
	}tree[MAXN<<2];
	inline void sw(int &a,int &b){int temp=a;a=b;b=temp;}
    inline void re(int &a){a=-a;}
	inline void Rev(int i){//翻转tree[i]
        re(tree[i].sum);
		sw(tree[i].maxs,tree[i].mins);
        re(tree[i].maxs),re(tree[i].mins);
		sw(tree[i].maxsl,tree[i].minsl);
		sw(tree[i].maxsr,tree[i].minsr);
		sw(tree[i].maxl,tree[i].minl);
        re(tree[i].maxl),re(tree[i].minl);
		sw(tree[i].maxlp,tree[i].minlp);
		sw(tree[i].maxr,tree[i].minr);
        re(tree[i].maxr),re(tree[i].minr);
		sw(tree[i].maxrp,tree[i].minrp);
		tree[i].flag^=1;
	}
	#define lc i<<1
	#define rc i<<1|1
    #define nd tree[i]
	inline void pushdown(int i){
		if (tree[i].flag) Rev(lc),Rev(rc),tree[i].flag=0;
	}
	node operator + (const node &A,const node &B){
        //这里不能写错，要不然调一年
        node C;
        C.l=A.l,C.r=B.r;
        C.sum=A.sum+B.sum;
        C.flag=false;
        //维护maxs,mins,maxsl,minsl
        if (max(A.maxs,B.maxs)>A.maxr+B.maxl){
            if (A.maxs>B.maxs){
                C.maxs=A.maxs;
                C.maxsl=A.maxsl;
                C.maxsr=A.maxsr;
            }
            else {
                C.maxs=B.maxs;
                C.maxsl=B.maxsl;
                C.maxsr=B.maxsr;
            }
        }
        else {
            C.maxs=A.maxr+B.maxl;
            C.maxsl=A.maxrp;
            C.maxsr=B.maxlp;
        }
        if (min(A.mins,B.mins)<A.minr+B.minl){
            if (A.mins<B.mins){
                C.mins=A.mins;
                C.minsl=A.minsl;
                C.minsr=A.minsr;
            }
            else {
                C.mins=B.mins;
                C.minsl=B.minsl;
                C.minsr=B.minsr;
            }
        }
        else {
            C.mins=A.minr+B.minl;
            C.minsl=A.minrp;
            C.minsr=B.minlp;
        }
        //维护maxl,minl,维护其端点
        if (A.sum+B.maxl>A.maxl){
            C.maxl=A.sum+B.maxl;
            C.maxlp=B.maxlp;
        }
        else {
            C.maxl=A.maxl;
            C.maxlp=A.maxlp;
        }
        if (A.sum+B.minl<A.minl){
            C.minl=A.sum+B.minl;
            C.minlp=B.minlp;
        }
        else {
            C.minl=A.minl;
            C.minlp=A.minlp;
        }
        //维护maxr,minr,维护其端点
        if (A.maxr+B.sum>B.maxr){
            C.maxr=A.maxr+B.sum;
            C.maxrp=A.maxrp;
        }
        else {
            C.maxr=B.maxr;
            C.maxrp=B.maxrp;
        }
        if (A.minr+B.sum<B.minr){
            C.minr=A.minr+B.sum;
            C.minrp=A.minrp;
        }
        else {
            C.minr=B.minr;
            C.minrp=B.minrp;
        }
        return C;//快乐地return 
	}
    inline void pushup(int i){
        bool temp=tree[i].flag;
        tree[i]=tree[lc]+tree[rc];
        tree[i].flag=temp;
    }
    inline void Set(int i,int val){
        nd.sum=nd.maxs=nd.mins=nd.maxl=nd.minl=nd.maxr=nd.minr=val;
    }
    void Build(int l,int r,int i){
        tree[i].flag=0;
        if (l==r){
            tree[i].l=l,tree[i].r=l;
            Set(i,a[l]);
            nd.maxsl=nd.maxsr=nd.minsl=nd.minsr=nd.maxlp=nd.minlp=nd.maxrp=nd.minrp=l;
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
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1;
        if (mid>=R) return Query(L,R,lc);
        else if (mid<L) return Query(L,R,rc);
        else return Query(L,R,lc)+Query(L,R,rc);
    }
    void Update(int L,int R,int i){//区间*-1
        if (L<=tree[i].l&&tree[i].r<=R){
            Rev(i);
            return ;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1;
        if (mid>=R) Update(L,R,lc);
        else if (mid<L) Update(L,R,rc);
        else Update(L,R,lc),Update(L,R,rc);
        pushup(i);
    }
    void Update_pos(int index,int i,int val){//单点修改
        if (tree[i].l==tree[i].r){
            Set(i,tree[i].flag?-val:val);
            return ;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1;
        if (index<=mid) Update_pos(index,lc,val);
        else Update_pos(index,rc,val);
        pushup(i);
    }
}
using namespace SegmentTree;
int L[MAXN],R[MAXN];
int main(){
    int n=read();
    for (register int i=1;i<=n;++i){
        a[i]=read();
    }
    Build(1,n,1);
    int q=read();
    while (q--){
        int opr=read();
        if (opr==1){
            int l=read(),r=read(),k=read();
            int tot=0,ans=0;
            for (register int i=1;i<=k;++i){//贪心
                node Q=Query(l,r,1);
                if (Q.maxs<=0) break;
                ans+=Q.maxs;
                L[++tot]=Q.maxsl,R[tot]=Q.maxsr;
                Update(L[tot],R[tot],1);
            }
            for (register int i=1;i<=tot;++i){//恢复线段树
                Update(L[i],R[i],1);
            }
            printf("%d\n",ans);
        }
        else {
            int i=read(),val=read();
            Update_pos(i,1,val);
        }
    }
}
```
