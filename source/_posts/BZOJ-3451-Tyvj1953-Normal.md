---
title: BZOJ 3451 Tyvj1953 Normal
abbrlink: 4c0b76ff
date: 2019-10-09 22:41:43
tags:
  - 题解
  - FFT
  - 点分治
---

此题恶臭，心态被搞了。

考虑$Solve$算法，每个点有且仅有一次被当做树的根，于是可以将整个算法的期望时间复杂度变成每个点的树的期望大小之和。

想到这里，你还得有一个更加恶臭的想法，考虑如何表示每个点的树的期望大小，记$p[i][j]$为$j$在$i$子树里面的概率。

那么$i$子树的期望大小即是$\sum _{j!=i} p[i][j]$。

如何计算$p[i][j]$，考虑$i$到$j$的路径上共$dis(i,j)+1$个点，只有$i$是第一个被选择的点时，$i$和$j$才不会被分开，于是$p[i][j]=\frac{1}{dis(i,j)+1}$。\dfrac

如何计算$\sum _{i=1}^n \sum _{j=1} ^n \f\dfrac}{dis(i,j)+1}$。

我们转换一下，假设等于$k$的$dis(i,j)$有$cnt[k]$个，答案即是$\sum cnt[k] \times \frac{1}{k+\dfrac

这个$cnt[k]$可以$FFT$+点分治去做。

考虑求出过当前树的根节点的路径数，设生成函数$F(x)=\sum _{i=0}^\infty dep(i) x^i$。其中$dep(i)$代表深度为$i$的节点个数。

$F(x)^2=\sum _{i=0}^\infty (\sum _{j=0}^i dep(j) dep(i-j)) x^i$，即是$\sum _{i=0}^\infty route(i) x^i$，其中$route(i)$代表路径个数。

这样算可能会有重复，于是按照点分治的套路需要容斥一下。

```cpp
#include <bits/stdc++.h>
#define MAXN 500005
using namespace std;
inline int read(){
	int x=0,f=1;
	char ch=getchar();
	while (ch<'0'||ch>'9'){
		if (ch=='-') f=-1;
		ch=getchar();
	}
	while (ch>='0'&&ch<='9'){
		x=(x<<1)+(x<<3)+(ch^'0');
		ch=getchar();
	}
	return x*f;
}
const double PI=acos(-1.0);
struct Complex{
    double x,y;
};
inline Complex operator + (const Complex &A,const Complex &B){
    return Complex{A.x+B.x,A.y+B.y};
}
inline Complex operator - (const Complex &A,const Complex &B){
    return Complex{A.x-B.x,A.y-B.y};
}
inline Complex operator * (const Complex &A,const Complex &B){
    return Complex{A.x*B.x-A.y*B.y,A.x*B.y+A.y*B.x};
}
Complex A[MAXN];
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
	if (type==-1){
    	for (register int i=0;i<n;++i) A[i].x/=(double)n;
	}
}
int d[MAXN],ret[MAXN],ans[MAXN],sz;
inline void Mul(int f){
	int m=1,L=0;
	while (m<=2*sz) m<<=1,L++;
	for (register int i=0;i<=m;++i){
		r[i]=r[i>>1]>>1|((i&1)<<(L-1));
	}
	FFT(A,m,1);
	for (register int i=0;i<m;++i) A[i]=A[i]*A[i];
	FFT(A,m,-1);
	for (register int i=0;i<=sz*2;++i) ans[i]+=f*(int)(A[i].x+0.5);//深度可能变成两倍（恶臭）
	for (register int i=0;i<=m;++i) A[i].x=0,A[i].y=0;
}

vector<int>G[MAXN];
inline void AddEdge(int u,int v){
	G[u].push_back(v);
}
int dp[MAXN],max_dp[MAXN],vis[MAXN],tot,root;
inline void InitDP(int u,int father){
	dp[u]=1,max_dp[u]=0;
	for (register int i=0;i<(int)G[u].size();++i){
		int v=G[u][i];
		if (v!=father&&!vis[v]){
			InitDP(v,u);
			dp[u]+=dp[v];
			max_dp[u]=max(max_dp[u],dp[v]);
		}
	}
	max_dp[u]=max(max_dp[u],tot-dp[u]);
	if (max_dp[root]>max_dp[u]) root=u;
}
int n;
inline int GetRoot(int u,int s){
	tot=s,root=0;
	InitDP(u,0);
	return root;
}
inline void InitDep(int u,int father,int dep){
	sz=max(sz,dep);
	A[dep].x++;
	for (register int i=0;i<(int)G[u].size();++i){
		int v=G[u][i];
		if (v!=father&&!vis[v]){
			InitDep(v,u,dep+1);
		}
	}
}
inline void Calc(int u,int f){
	sz=0;
	InitDep(u,0,f==-1?1:0);
	Mul(f);
}
inline void dfs(int u){
	vis[u]=true;
	Calc(u,1);
	for (register int i=0;i<(int)G[u].size();++i){
		int v=G[u][i];
		if (!vis[v]){
			Calc(v,-1);
			dfs(GetRoot(v,dp[v]));
		}
	}
}
int main(){
	n=read();
	max_dp[0]=n;
	for (register int i=1;i<n;++i){
		int u=read()+1,v=read()+1;
		AddEdge(u,v);
		AddEdge(v,u);
	}
	dfs(GetRoot(1,n));
	double ret=0;
	for (register int i=0;i<n;++i){
		ret+=(double)ans[i]/(i+1);
	}
	printf("%.4lf\n",ret);
}
```

