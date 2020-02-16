---
title: CF438E The Child and Binary Tree
abbrlink: 98d6ffc1
date: 2019-10-09 22:12:43
tags:
  - 题解
  - NTT
---

[传送门](https://www.luogu.org/problem/CF438E)

很好的一道生成函数+NTT题，做完之后可以加深对生成函数的理解。

建议先弄懂卡特兰数是怎么用生成函数推的，参考[这篇博客](/archives/3da1ee6d.html)（只用看推到$C(x)=\frac{1\pm\sqrt{\dfrac}{2}$的部分）

考虑我们是怎么推导出$n$节点二叉树的种类数为卡特兰数的，考虑根节点两边连出的子树，他们的方案数为$c_{n-i-1} \times c_{i}$。于是答案即是$\sum_{j=0}^{i-1} c_{n-j-1} \times c_j$

这道题的递推式也非常像上面的：

$$F_n=1+\sum _{i=1}^n [i \in c] \sum _{j=0}^{k-i} F_jF_{i-j-k} $$

（$1$代表左右子树是空的）

$[]$中的值为真时，代表的数为$1$，否则为$0$。

如法炮制，我们构造生成函数$G(x)=\sum _{i=0}^\infty [i \in c] x^i$。

设生成函数$F(x) =\sum _{i=0}^\infty cnt(i) x^i$，其中$cnt(i)$代表答案，即权值为$i$的神犇二叉树的总数。

于是递推式也是惊人的相似：$F=1+G \times F \times F$。$G$枚举了根节点的权值。

我们可以求出$F=\fr\dfrac\pm \sqrt{1-4G}}{2G}$，其中需要舍弃$\frac{1\dfract{1-4G}}{2G}$，因为其不收敛。

得到$F=\\dfrac1-\sqrt{1-4G}}{2G}$，我们还要进一步分子有理化，得出$F=\frac{2}{1\dfract{1-4G}}$。

我们需要多项式开根和多项式求逆，不会的请转到[这里](/archives/dd621cde.html)

代码：

```cpp
#include <bits/stdc++.h>
#define MAXN 500005
#define MOD 998244353
#define invG 332748118
#define GG 3
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
inline int ksm(int b,int k){
	int ans=1;
	while (k){
		if (k&1) ans=(1ll*ans*b)%MOD;
		b=(1ll*b*b)%MOD;
		k>>=1;
	}
	return ans;
}
int r[MAXN],C[MAXN];
inline void NTT(int *A,int n,int type){
    for (register int i=0;i<n;++i) if (i<r[i]) swap(A[i],A[r[i]]);
    for (register int i=1;i<n;i<<=1){
        int R=i<<1;
        int Gn=ksm(type==1?GG:invG,(MOD-1)/R);
        for (register int j=0;j<n;j+=R){
        	int g=1;
            for (register int k=0;k<i;++k,g=(1ll*g*Gn)%MOD){
                int x=A[j+k],y=(1ll*g*A[i+j+k])%MOD;
                A[j+k]=(x+y)%MOD,A[i+j+k]=(x-y+MOD)%MOD;
            }
        }
    }
}
inline int get_inv(int x){
	return ksm(x,MOD-2);
}
int m,L;
inline void Init(int len){
	m=1,L=0;
	while (m<2*len) m<<=1,L++;
	for (register int i=0;i<m;++i){
		r[i]=(r[i>>1]>>1|((i&1)<<(L-1)));
	}
}
inline void Inv(int *A,int *B,int len){
	if (len==1){
		B[0]=get_inv(A[0]);
		return ;
	}
	Inv(A,B,(len+1)>>1);
	Init(len);
	for (register int i=0;i<len;++i) C[i]=A[i];
	for (register int i=len;i<m;++i) C[i]=0;
	NTT(C,m,1),NTT(B,m,1);
	for (register int i=0;i<m;++i){
		B[i]=(2ll-1ll*B[i]*C[i]%MOD+MOD)*B[i]%MOD;
	}
	NTT(B,m,-1);
    int inv=get_inv(m);
	for (register int i=0;i<len;++i) B[i]=(1ll*B[i]*inv)%MOD;
	for (register int i=len;i<m;++i) B[i]=0;
}
int D[MAXN],inv2;
inline void Sqrt(int *A,int *B,int len){
	if (len==1){
		B[0]=A[0];
		return ;
	}
	Sqrt(A,B,(len+1)>>1);
	for (register int i=0;i<(len<<1);++i) D[i]=0;
	Inv(B,D,len);
	Init(len);
	for (register int i=0;i<len;++i) C[i]=A[i];
	for (register int i=len;i<m;++i) C[i]=0;
	NTT(B,m,1),NTT(C,m,1),NTT(D,m,1);
	for (register int i=0;i<m;++i){
		B[i]=1ll*inv2*(1ll*C[i]*D[i]%MOD+B[i])%MOD;
	}
	NTT(B,m,-1);
	int inv=get_inv(m);
	for (register int i=0;i<len;++i) B[i]=(1ll*B[i]*inv)%MOD;
	for (register int i=len;i<m;++i) B[i]=0;
}
int G[MAXN],F[MAXN];
int S1[MAXN],Ans1[MAXN];
int S2[MAXN],Ans2[MAXN];
int main(){
	int n=read(),len=read();
	inv2=ksm(2,MOD-2);//要初始化，要不然死的很惨（这个错误至少花了我1h）
	G[0]=1;
	for (register int i=1;i<=n;++i){
		G[read()]++;
	}
	S1[0]=1;
	for (register int i=1;i<=len;++i){
		S1[i]=(-4ll*G[i]%MOD+MOD)%MOD;
	}
	Sqrt(S1,Ans1,len+1);
	Ans1[0]=(Ans1[0]+1)%MOD;
	Inv(Ans1,Ans2,len+1);
	for (register int i=1;i<=len;++i){
		printf("%d\n",2ll*Ans2[i]%MOD);
	}
}
```

