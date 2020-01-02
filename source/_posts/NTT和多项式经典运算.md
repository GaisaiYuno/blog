---
title: NTT和运用
abbrlink: dd621cde
date: 2019-10-05 21:41:18
tags:
  - NTT
  - 多项式
---

## NTT

有时候，题目要求对一个大质数（特别是998244353之类的数）取模，就不能用FFT，而是用NTT。

NTT采用原根替代单位根，如果不了解原根，请参考[这篇博客](/archives/3594e75f.html)。

常见NTT质数表：

| $a\times 2^b+1$ | a    | b    | g    |
| --------------- | ---- | ---- | ---- |
| 3               | 1    | 1    | 2    |
| 5               | 1    | 2    | 2    |
| 17              | 1    | 4    | 3    |
| 97              | 3    | 5    | 5    |
| 193             | 3    | 6    | 5    |
| 257             | 1    | 8    | 3    |
| 7681            | 15   | 9    | 17   |
| 12289           | 3    | 12   | 11   |
| 40961           | 5    | 13   | 3    |
| 65537           | 1    | 16   | 3    |
| 786433          | 3    | 18   | 10   |
| 5767169         | 11   | 19   | 3    |
| 7340033         | 7    | 20   | 3    |
| 23068673        | 11   | 21   | 3    |
| 104857601       | 25   | 22   | 3    |

采用NTT编写A*B problem。

代码如下：

```cpp
#include <bits/stdc++.h>
#define MAXN 240005
#define MOD 998244353
#define invG 332748118 //G的逆元
#define G 3
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
static int r[MAXN],a[MAXN],b[MAXN];
inline void NTT(int *A,int n,int type){
    for (register int i=0;i<n;++i) if (i<r[i]) swap(A[i],A[r[i]]);
    for (register int i=1;i<n;i<<=1){
        int R=i<<1;
        int Gn=ksm(type==1?G:invG,(MOD-1)/R);
        for (register int j=0;j<n;j+=R){
        	int g=1;
            for (register int k=0;k<i;++k,g=(1ll*g*Gn)%MOD){
                int x=A[j+k],y=(1ll*g*A[i+j+k])%MOD;
                A[j+k]=(x+y)%MOD,A[i+j+k]=(x-y+MOD)%MOD;
            }
        }
    }
}
char s1[MAXN],s2[MAXN];
int ans[MAXN];
int main(){
    int n=read();
    scanf("%s%s",s1+1,s2+1);
    for (register int i=1;i<=n;++i) a[i-1]=s1[n-i+1]-'0';
    for (register int i=1;i<=n;++i) b[i-1]=s2[n-i+1]-'0';
    int m=1,L=0;
    while (m<=2*n) m<<=1,L++;
    for (register int i=0;i<=m;++i){
        r[i]=(r[i>>1]>>1|((i&1)<<(L-1)));
    }
    NTT(a,m,1),NTT(b,m,1);
    for (register int i=0;i<=m;++i) a[i]=(1ll*a[i]*b[i])%MOD;
    NTT(a,m,-1);
    int inv=ksm(m,MOD-2);
    for (register int i=0;i<=m;++i){
        ans[i]+=(1ll*a[i]*inv)%MOD;//要乘上m的逆元
        ans[i+1]+=ans[i]/10,ans[i]%=10;
    }
    while (ans[m]==0) m--;
    for (register int i=m;i>=0;--i) putchar(ans[i]+'0');
}
```

## 常见多项式运算

这里才是重点部分。

### 多项式求逆

[传送门](https://www.luogu.org/problem/P4238)

给你一个多项式$A$，要你求出一个多项式$B$，满足$AB=1\pmod {x^n}$

系数对$998244353$取模。

首先，理解$\pmod {x^n}$是为了去掉后面的部分。

下文中的除法全部代表向下取整。

我们假设求出了一个$B'$，满足$AB'=1\pmod{x^{\frac{n}{2}}}$，我们要求$B$，满足$AB=1 \pmod{x^n}$。其实就是一个小范围的解推出大范围的解。

那么我们有后面的部分$B-B'=0 \pmod{x^{\frac{n}{2}}}$

根据套路，我们要把后面的模数搞成$x^n$，于是**两边平方**。

$(B-B')^2=0\pmod{x^n}$

拆开$B^2 -2BB'+B'^2=0 \pmod{x^n}$

两边同时乘$A$，发现可以消掉很多。

$AB^2-2ABB'+AB'^2=0\pmod{x^n}$

显然$AB=1$，可以消掉，变成：

$B-2B'+AB'^2=0 \pmod{x^n}$

得出$B=2B'-AB'^2=B'(2-AB') \pmod{x^n}$

于是可以根据这个公式从一个小的解推出大的。

别忘了边界条件$A[0]=B[0]^{-1}$。

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
#define MOD 998244353
#define invG 332748118
#define G 3
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
        int Gn=ksm(type==1?G:invG,(MOD-1)/R);
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
	Inv(A,B,(len+1)>>1);//注意是向上取整
	Init(len);
	for (register int i=0;i<len;++i) C[i]=A[i];//只用前面一部分
	for (register int i=len;i<m;++i) C[i]=0;
	NTT(C,m,1),NTT(B,m,1);
	for (register int i=0;i<m;++i){
		B[i]=(2ll-1ll*B[i]*C[i]%MOD+MOD)*B[i]%MOD;
	}
	NTT(B,m,-1);
    int inv=get_inv(m);
	for (register int i=0;i<len;++i) B[i]=(1ll*B[i]*inv)%MOD;//推完之后B'->B
	for (register int i=len;i<m;++i) B[i]=0;//多出来的部分要舍去
}
int F[MAXN],Ans[MAXN];
int main(){
	int n=read();
	for (register int i=0;i<n;++i) F[i]=read();
	Inv(F,Ans,n);
	for (register int i=0;i<n;++i) printf("%d ",Ans[i]);
}
```

### 分治FFT

[传送门](https://www.luogu.org/problem/P4721)

此题我们使用生成函数做法。

构造生成函数$f(x)=\sum_{i=0}^\infty f[i] \times x^i,g(x)=\sum_{i=0}^\infty g[i] \times x^i$。

注意到$f(x)*g(x)=f(x)$。

欸这个有问题吧，这个应该无解才对啊！

再看一眼题目，注意到$f(x) \times g(x)$没有取到$x^0$

怎么办呢？补上一个$1$即可。（也可以这么理解，卷积起来之后整体后移了一位，所以要补上）

得到式子$f(x)*g(x)+1=f(x)$

解得$f(x)(1-g(x))=1$。

因为只用求前$n$项，转化为$f(x)(1-g(x))=1 \pmod{x^n}$

于是$f(x)=(1-g(x))^{-1} \pmod{x^n}$。

对于生成函数做法，还有一个解释，暴力做法是每次分别求出$f[i]$，而生成函数做法是一起解出$f$。

代码：

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
#define MOD 998244353
#define invG 332748118
#define G 3
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
        int Gn=ksm(type==1?G:invG,(MOD-1)/R);
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
int F[MAXN],Ans[MAXN];
int main(){
	int n=read();
	F[0]=1;
	for (register int i=1;i<n;++i) F[i]=(-read()+MOD)%MOD;
	Inv(F,Ans,n);
	for (register int i=0;i<n;++i) printf("%d ",Ans[i]);
}
```

### 多项式开根

[传送门](https://www.luogu.org/problem/P5205)

给你一个$n-1$次多项式$A(x)$，求$B(x)$，使得$B(x)^2=A(x) \pmod{x^n}$

还是多项式求逆的套路。

考虑现在已经求出$B'(x)$，使得$B'(x) ^2 = A(x) \pmod{x^{\frac{n}{2}}}$。

求出一个$B(x)$使得$B(x)^2=A(x)\pmod{x^{n}}$。

两边相减

$B(x)^2-B'(x)^2=0\pmod{x^{\frac{n}{2}}}$。

$(B(x)+B'(x))(B(x)-B'(x))=0 \pmod{x^{\frac{n}{2}}}$

显然$B(x)+B'(x)!=0$。

有$B(x)-B'(x)=0\pmod{x^\frac{n}{2}}$。

还是老套路，两边平方。

$B(x)^2-2B(x)B'(x)+B'(x)^2=0\pmod{x^n}$

注意到$B(x)^2=A(x)$。

代入得：

$A(x)-2B(x)B'(x)+B'(x)^2=0\pmod{x^n}$。

所以$B(x)=\frac{A(x)+B'(x)^2}{2B'(x)}=inv(2) *(A(x)B'^{-1}(x)+B'(x))$

再次套用多项式求逆的模板即可。

边界$B[0]=\sqrt {A[0]}=1$。

代码：

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
#define MOD 998244353
#define invG 332748118
#define G 3
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
        int Gn=ksm(type==1?G:invG,(MOD-1)/R);
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
		return ;//保证a_0=1
	}
	Sqrt(A,B,(len+1)>>1);
	for (register int i=0;i<(len<<1);++i) D[i]=0;
	Inv(B,D,len);//得出B^-1(x)
	Init(len);
	for (register int i=0;i<len;++i) C[i]=A[i];
	for (register int i=len;i<m;++i) C[i]=0;
	NTT(B,m,1),NTT(C,m,1),NTT(D,m,1);//B:目标 C:A(x) D:B^-1(x)
    //注意要做三次NTT
	for (register int i=0;i<m;++i){
		B[i]=1ll*inv2*(1ll*C[i]*D[i]%MOD+B[i])%MOD;
	}
	NTT(B,m,-1);
	int inv=get_inv(m);
	for (register int i=0;i<len;++i) B[i]=(1ll*B[i]*inv)%MOD;
	for (register int i=len;i<m;++i) B[i]=0;
}
int F[MAXN],Ans[MAXN];
int main(){
	inv2=ksm(2,MOD-2);
	int n=read();
	for (register int i=0;i<n;++i) F[i]=read();
	Sqrt(F,Ans,n);
	for (register int i=0;i<n;++i) printf("%d ",Ans[i]);
}
```

##  例题

### 例题1

[P4841 城市规划](https://www.luogu.org/problem/P4841)

此题即是数据加强版POJ1737，[题解在此](/archives/aeb2bd6e.html)

这里不再讨论$dp$方程式，而是着重讨论优化方法。

我们有$F(i)=2^{C_i^2} - \sum_{j=1}^{i-1} F(j) \times 2^{C_{i-j}^2} \times C_{i-1}^{j-1}$。

爆拆一波$C$，有$C_{i-1}^{j-1}=\frac{(i-1)!}{(i-j)!(j-1)!}$。

两边同时除$(i-1)!$，得$\frac{F(i)}{(i-1)!}=\frac{2^{C_i^2}}{(i-1)!}-\sum_{j=1}^{i-1} \frac{F(j)}{(j-1)!} \times \frac {2^{C_{i-j}^2}}{(i-j)!} $（剩下的$(i-j)!$和$(j-1)!$刚好每人分一个）

设$A(x)=\frac{F(i)}{(i-1)!},B(x)=\frac{2^{C_{i}^2}}{(i-1)!},C(x)=\frac{2^{C_{i}^2}}{i!}$

推导这里发现有个致命的错误，$\sum _{j=1}^{i-1}$无法解决，必须重新构造式子。

把后面一坨扔到前面去，左边部分变成$F(i)+\sum_{j=1}^{i-1} F(j) \times 2^{C_{i-j}^2} \times C_{i-1}^{j-1}$。

注意到$j=i$时，$2^{C_{i-j}^2}=2^0=1$，$C_{i-1}^{j-1}=1$。

于是可以把他们两个合并起来，变成$\sum_{j=1}^iF(j)\times 2^{C_{i-j}^2} \times C_{i-1}^{j-1}$。

等价于$A(x)B(x)=C(x)$。

于是得到$A(x)=C(x) B(x)^{-1}$。

可以使用多项式求逆解决。

别忘了$A(x)=\frac {F(i)}{(i-1)!}$，所以答案要乘$(i-1)!$。

代码：

```cpp
#include <bits/stdc++.h>
#define MAXN 2000005
#define MOD 1004535809
#define invG 334845270
#define G 3
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
inline int ksm(int b,int k){
	int ans=1;
	while (k){
		if (k&1) ans=(1ll*ans*b)%MOD;
		b=(1ll*b*b)%MOD;
		k>>=1;
	}
	return ans;
}
inline int get_inv(int x){
	return ksm(x,MOD-2);
}
int r[MAXN],C[MAXN];
inline void NTT(int *A,int n,int type){
    for (register int i=0;i<n;++i) if (i<r[i]) swap(A[i],A[r[i]]);
    for (register int i=1;i<n;i<<=1){
        int R=i<<1;
        int Gn=ksm(type==1?G:invG,(MOD-1)/R);
        for (register int j=0;j<n;j+=R){
        	int g=1;
            for (register int k=0;k<i;++k,g=(1ll*g*Gn)%MOD){
                int x=A[j+k],y=(1ll*g*A[i+j+k])%MOD;
                A[j+k]=(x+y)%MOD,A[i+j+k]=(x-y+MOD)%MOD;
            }
        }
    }
    if (type==1) return ;
    int inv=get_inv(n);
    for (register int i=0;i<n;++i){
    	A[i]=1ll*A[i]*inv%MOD;
	}
}
int m,L;
inline void InitNTT(int len){
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
	InitNTT(len);
	for (register int i=0;i<len;++i) C[i]=A[i];
	for (register int i=len;i<m;++i) C[i]=0;
	NTT(C,m,1),NTT(B,m,1);
	for (register int i=0;i<m;++i){
		B[i]=((2ll-1ll*B[i]*C[i]%MOD+MOD)*B[i]%MOD+MOD)%MOD;
	}
	NTT(B,m,-1);
	for (register int i=len;i<m;++i) B[i]=0;
}
int F[MAXN];
int A[MAXN],B[MAXN],Ans[MAXN];
int fac[MAXN],inv_fac[MAXN],n;
int inv2=ksm(2,MOD-2);
//F=A*B^-1
inline int Calc(int x){
	return 1ll*x*(x-1)/2;//不能取模，要取也只能是MOD-1
}
inline void Init(){
	fac[0]=1;
	for (register int i=1;i<=n;++i) fac[i]=1ll*fac[i-1]*i%MOD;
	for (register int i=0;i<=n;++i) inv_fac[i]=ksm(fac[i],MOD-2);
}
#undef int
int main(){
#define int long long
	n=read();
	Init();
	for (register int i=1;i<=n;++i){
		A[i]=1ll*ksm(2,Calc(i))*inv_fac[i-1]%MOD;
	}
	for (register int i=0;i<=n;++i){
		B[i]=1ll*ksm(2,Calc(i))*inv_fac[i]%MOD;
	}
	InitNTT(n);
	Inv(B,Ans,m);
    
	InitNTT(n);
	NTT(A,m,1);NTT(Ans,m,1);
	for (register int i=0;i<m;++i) A[i]=1ll*A[i]*Ans[i]%MOD;
	NTT(A,m,-1);
    
	printf("%lld\n",1ll*A[n]*fac[n-1]%MOD);
}
```

