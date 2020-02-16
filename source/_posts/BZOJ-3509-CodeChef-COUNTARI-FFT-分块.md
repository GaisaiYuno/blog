---
title: '[BZOJ 3509] [CodeChef] COUNTARI (FFT+分块)'
abbrlink: 33bda6e6
date: 2019-10-13 22:28:38
tags:
  - 题解
  - FFT
  - 分块

---

[传送门](/bzojch/p/3509.html)

首先，遇到等差数列这种形式，最先要想到移项。

$A[k]-A[j]=A[j]-A[i] \to A[k]+A[i]=2 \times A[j]$

于是很容易想到固定$j$，而在$j$两边枚举$i,k$。

注意到如果固定$j$，$2 \times A[j]$为常数，于是可以构造生成函数$F_{left}=\sum _{i=0}^\infty [i \in A[1]...A[j-1]] x^i$，$F_{right}=\sum _{i=0}^\infty [i \in A[j+1]...A[n]] x^i$。

$F_{left} \times F_{right}$中$x^{2 \times A[j]}$的系数就是答案。

但是注意到如果这样每次都要两边构造生成函数，然后计算，是$O(n^2 \log n)$的。

发现从$j$到$j+1$的过程中，变化的$F_{left}$和$F_{right}$并不多，每次重新$FFT$似乎有些浪费，而且每次$FFT$只能计算出一个数的贡献。

于是我们毒瘤地想到，我们要扩大$F_{left},F_{right}$每次变化的次数，比如每次让它变化$\sqrt{n}$个数。

于是可以采用分块，对于$i,j,k$中两个以上的数在同一个块的情况，暴力解决：

```cpp
inline void Query1(int id){//k在i,j右边
	int lb=(id-1)*Size+1,rb=min(id*Size,n);
	memset(Right,0,sizeof(Right));
	Add(Right,rb+1,n);//注意去掉
	for (register int j=lb+1;j<=rb;++j){//枚举中间的j
		for (register int i=lb;i<j;++i){//枚举左边的i
			if (2*A[j]-A[i]>=0) ans+=Right[2*A[j]-A[i]];
		}
	}
}
```

$Query1$计算的是$i,j$在编号为$id$的块，而$k$在$i,j$右边，而且不在$i,j$所在的块的情况。

```cpp
inline void Query2(int id){
	int lb=(id-1)*Size+1,rb=min(id*Size,n);
	memset(Left,0,sizeof(Left));
	Add(Left,1,rb-1);
	for (register int j=rb-1;j>=lb;--j){//枚举中间的j
		Left[A[j]]--;
		for (register int k=j+1;k<=rb;++k){//枚举右边的k
			if (2*A[j]-A[k]>=0) ans+=Left[2*A[j]-A[k]];
		}
	}
}
```

$Query2$计算的是$i,j$在编号为$id$的块，而$k$在$i,j$左边的情况。

这样可以做到不重不漏。

剩下$FFT$非常好写，只要把$1\to lb-1$和$rb+1 \to n$ 的$A[i]$丢进$Left$和$Right$两个数组卷积即可。

时间复杂度分析：假设块大小为$sz$，暴力时间复杂度$O(sz \times n)$，$FFT$时间复杂度为$O( \frac{n}{sz} \t\dfrac\sqrt {n \log n})$。

于是总时间复杂度为$O(sz \times n + \frac\dfracz} \times n\log n)$

搞一下均值，$sz  + \fr\dfrac{sz} \times n\log n \le 2 \times \sqrt {n \log n}$

于是$sz=\sqrt{n \log n}$时最优。

~~实测$sz=2600$最优。~~

时间复杂度$O(n \sqrt {n \log n})$

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
using namespace std;
inline int read(){
	int x=0,f=1;
	char ch=getchar();
	while (ch<'0'||ch>'9'){
		x=(x<<1)+(x<<3)+(ch^'0');
		ch=getchar();
	}
	while (ch>='0'&&ch<='9'){
		x=(x<<1)+(x<<3)+(ch^'0');
		ch=getchar();
	}
	return x*f;
}
namespace FFT{
	const double PI=acos(-1.0);
	struct Complex{
    	double x,y;
	}a[MAXN],b[MAXN];
	inline Complex operator + (const Complex &A,const Complex &B){
	    return Complex{A.x+B.x,A.y+B.y};
	}
	inline Complex operator - (const Complex &A,const Complex &B){
	    return Complex{A.x-B.x,A.y-B.y};
	}
	inline Complex operator * (const Complex &A,const Complex &B){
	    return Complex{A.x*B.x-A.y*B.y,A.x*B.y+A.y*B.x};
	}
	int r[MAXN];
	inline void FFT(Complex *A,int n,int type){
	    for (register int i=0;i<n;++i) if (i<r[i]) swap(A[i],A[r[i]]);
	    for (register int i=1;i<n;i<<=1){
	        int R=i<<1;
	        Complex Wn=Complex{cos(2*PI/R),type*sin(2*PI/R)};
	        for (register int j=0;j<n;j+=R){
	            Complex w=Complex{1,0};
	            for (register int k=0;k<i;++k,w=w*Wn){
	                Complex x=A[j+k],y=w*A[i+j+k];
	                A[j+k]=x+y,A[i+j+k]=x-y;
	            }
	        }
	    }
	}
	int m,L;
	inline void Init(int len){
		m=1,L=0;
	    while (m<=2*len) m<<=1,L++;
	    memset(r,0,sizeof(r));
	    for (register int i=0;i<=m;++i){
	        r[i]=(r[i>>1]>>1|((i&1)<<(L-1)));
	    }
	}
	inline void Mul(int *des,int *A,int *B,int len){
		Init(len);
		for (register int i=0;i<=len;++i) a[i]=Complex{(double)A[i],0},b[i]=Complex{(double)B[i],0};
		for (register int i=len+1;i<m;++i) a[i]=Complex{0,0},b[i]=Complex{0,0};
		FFT(a,m,1),FFT(b,m,1);
		for (register int i=0;i<m;++i) a[i]=a[i]*b[i];
		FFT(a,m,-1);
		for (register int i=0;i<=len;++i) des[i]=(int)((double)a[i].x/m+0.5);
	}
}
using namespace FFT;
int A[MAXN],id[MAXN],Size,Max;
inline void Add(int *F,int l,int r){
	for (register int i=l;i<=r;++i){
		F[A[i]]++,Max=max(Max,A[i]);
	}
}
//A[k]-A[j]=A[j]-A[i]
//A[k]+A[i]=2*A[j]
//找到j
int Left[MAXN],Right[MAXN],res[MAXN];
long long ans;
int n;
inline void Query1(int id){//k在i,j右边 
	int lb=(id-1)*Size+1,rb=min(id*Size,n);
	memset(Right,0,sizeof(Right));
	Add(Right,rb+1,n);//注意去掉
	for (register int j=lb+1;j<=rb;++j){//枚举中间的j
		for (register int i=lb;i<j;++i){//枚举左边的i
			if (2*A[j]-A[i]>=0) ans+=Right[2*A[j]-A[i]];
		}
	}
}
inline void Query2(int id){
	int lb=(id-1)*Size+1,rb=min(id*Size,n);
	memset(Left,0,sizeof(Left));
	Add(Left,1,rb-1);
	for (register int j=rb-1;j>=lb;--j){//枚举中间的j
		Left[A[j]]--;
		for (register int k=j+1;k<=rb;++k){//枚举右边的k
			if (2*A[j]-A[k]>=0) ans+=Left[2*A[j]-A[k]];
		}
	}
}
int main(){
	n=read();
	for (register int i=1;i<=n;++i){
		A[i]=read();
	}
	Size=sqrt(n*log(n)/log(2));
	for (register int i=1;i<=n;++i){
		id[i]=(i-1)/Size+1;
	}
	for (register int i=1;i<=id[n];++i){//计算每个块中的 
		Query1(i),Query2(i);
	}
	int temp=ans;
	for (register int i=2;i<=id[n]-1;++i){
		int lb=(i-1)*Size+1,rb=min(i*Size,n);
		memset(Left,0,sizeof(Left)),memset(Right,0,sizeof(Right));
		Max=0;
		Add(Left,1,lb-1),Add(Right,rb+1,n);//两边的构造生成函数
		Mul(res,Left,Right,Max*2);
		for (register int j=lb;j<=rb;++j){
			ans+=res[A[j]*2];
		}
	}
	printf("%lld\n",ans);
}
```

