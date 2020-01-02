---
title: 'Codeforces Round #589 (Div. 2)'
abbrlink: 9b983113
date: 2019-09-30 19:41:52
tags:
  - 比赛
---

[比赛传送门](https://codeforces.com/contest/1228)

## $Pro1$

[传送门](https://codeforces.com/contest/1228/problem/A)

让你找到任意一个数$x \in [l,r]$，使得$x$的各位数字都不同。

## $Sol1$

注意到$1 \le l \le r \le 10^5$，每个数最多$5$位。

于是硬上$O(n \log _{10} n)$大模拟即可。

## $Code1$

```cpp
#include <bits/stdc++.h>
#define MAXN 2000005
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
inline int Check(int x){
	int cnt[10];
	memset(cnt,0,sizeof(cnt));
	while (x) {
		cnt[x%10]++;
		x/=10;
	}
	for (register int i=0;i<=9;++i){
		if (cnt[i]>1) return false;
	}
	return true;
}
int main(){
	int l=read(),r=read();
	for (register int i=l;i<=r;++i){
		if (Check(i)){
			printf("%d\n",i);
			return 0;
		}
	}
	puts("-1");
	return 0;
}
```

## $Pro2$

[传送门](https://codeforces.com/contest/1228/problem/B)

给你两个数列$r[i],c[i]$，要你构造一个长$h$宽$w$的格子图，使得第$i$个纵列从最上面数起刚好有$c[i]$个连续的黑色格子，第$i$个横列从最左边数起刚好有$r[i]$个连续的黑色格子。

求满足条件的格子图的总数。

## $Sol2$

设这个图是$map$，注意到$map[i][1 \to r[i]]$都必须是黑色的，$map[i][r[i]+1]$为白色的，对于$c[i]$也是同理。

如果这样染色出现冲突，答案就是$0$。

发现剩下的格子都可以随意染色，于是答案就是$2^{未被染色的格子个数}$

## $Code2$

```cpp
#include <bits/stdc++.h>
#define MAXN 2000005
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
int a[1005][1005];
int main(){
	int h=read(),w=read();
	memset(a,-1,sizeof(a));
	for (register int i=1;i<=h;++i){
		int len=read();
		for (register int j=1;j<=len;++j){
			if (a[i][j]==0){//出现冲突
				puts("0");
				return 0;
			}
			a[i][j]=1;
		}
		if (a[i][len+1]==1){
			puts("0");
			return 0;
		}
		a[i][len+1]=0;
	}
	for (register int i=1;i<=w;++i){
		int len=read();
		for (register int j=1;j<=len;++j){
			if (a[j][i]==0){
				puts("0");
				return 0;
			}
			a[j][i]=1;
		}
		if (a[len+1][i]==1){
			puts("0");
			return 0;
		}
		a[len+1][i]=0;
	}
	long long ans=1;
	for (register int i=1;i<=h;++i){
		for (register int j=1;j<=w;++j){
			if (a[i][j]==-1) ans=(ans*2ll)%((long long)1e9+7);//没被染色
		}
	}
	printf("%lld\n",ans);
}
```

## $Pro3$

[传送门](https://codeforces.com/contest/1228/problem/C)

定义$prime(x)$为$x$的质因子的集合，比如说$prime(140)=\\{2,5,7\\}$

设$g(x,p)$是能够整除$x$的最大的$p^k$，比如说$g(45,3)=9$

设$f(x,y)$为$\prod _{p \in prime(x)} g(y,p)$，比如说$f(30, 70) = g(70, 2) \cdot g(70, 3) \cdot g(70, 5) = 2^1 \cdot 3^0 \cdot 5^1 = 10$

给你$x,n$，计算$\prod _{i=1}^n f(x,i)$

## $Sol3$

~~数论不会先打表~~

先计算一下$x=10,n=10$的情况：

$f(10,1)=1$ $f(10,2)=2$ $f(10,3)=1$ $f(10,4)=4$ $f(10,5)=5$

$f(10,6)=2$ $f(10,7)=1$ $f(10,8)=8$ $f(10,9)=1$ $f(10,10)=10$

如何考虑，不妨对$prime(x)$中的元素分别考虑，考虑质因子$2$对答案的贡献，他会分别对$f(x,2 \times i)$做出一个$2$的贡献，同时对$f(x,2^2 \times i)$做出一个$2$的贡献，对$f(x,2^3 \times i)$做出一个$2$的贡献。

于是总的贡献是$2^ {⌊n/2⌋} \times 2 ^ {⌊n/2^2⌋} \times 2^{⌊n/2^3⌋} ...$

于是我们得到核心代码：

```cpp
inline int Calc(int x,int n){
	while (n){
		ans=(ans*ksm(x,n/x,MOD))%MOD;
		n/=x;
	}
	return 0;
}
```

就是计算每一个质因子$x$对于答案的贡献。

## $Code3$

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
#define int long long
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
int ans=1;
inline int ksm(int b,int p,int k){
    int ans=1;
    while (p>0){
        if (p&1ll){
            ans=(b*ans)%k;
        }
        b=(b*b)%k;
        p>>=1ll;
    }
    return ans%MOD;
}
inline int Calc(int x,int n){
	while (n){
		ans=(ans*ksm(x,n/x,MOD))%MOD;
		n/=x;
	}
	return 0;
}
int cnt,primes[MAXN];
inline void Sieve(int x){
	int bd=sqrt(x);
	for (register int i=2;i<=bd;++i){
		if (x%i==0){
			primes[++cnt]=i;
			while (x%i==0) x/=i;
		}
	}
	if (x>1) primes[++cnt]=x;//x是质数
}
#undef int
int main(){
#define int long long
	int x,n;
	cin>>x>>n;
	Sieve(x);//找出x的所有质因子
	for (register int i=1;i<=cnt;++i){
		Calc(primes[i],n);
	}
	cout<<ans;
}
```

## $Pro4$

[传送门](https://codeforces.com/contest/1228/problem/C)

称两个点集$v_1,v_2$是好的，当且仅当$v_1,v_2$之间没有连边，而且任意$x \in v_1,y \in v_2$，$x,y$都有边相连。

要你把$1 \dots n$的点分成$3$个集合$v_1,v_2,v_3$，满足$v_1 ∪ v_2 ∪ v_3 = \\{1 \dots n\\}$，而且$v_1,v_2$是好的，$v_2,v_3$是好的，$v_3,v_1$是好的。

如下图$\\{1\\},\\{2,3\\},\\{4,5,6\\}$就是一个合法的解。

![](https://cdn.jsdelivr.net/gh/GaisaiYuno/imghost/8f2b8fba1ab8461f6fac8f47e03c5c2483ebb678.png)

## $Sol4$

首先，这个图如果不联通，就无解。

仔细观察上图，发现从一个点连出的边，总是到达和这个点不属于同一个集合的一个点，我们可以利用这个性质。

首先，令点$1$所在的集合编号为$1$，显然，将$1$连出的边遍历一遍，就可以找到不在$1$中的点，剩下的点在集合$1$。

```cpp
for (register int i=0;i<G[1].size();++i){
	vis[G[1][i]]=true;//标记2,3组
}
```

在从标记到的点集中随便抽出一个点$u$，钦定它在集合$2$中，那么它能够到达的点肯定是在集合$1,3$中，此时$1$集合中的点我们已经知道了，于是$3$集合我们也可以知道是那些。

```cpp
bool flag=true;
for (register int i=1;i<=n;++i){
	if (!vis[i]){
		ans[i]=1;
	}
	else if (vis[i]&&flag){
		for (register int j=0;j<G[i].size();++j){//这次到达的是1,3组
			int v=G[i][j];
			if (vis[v]) ans[v]=3;
		}
		flag=false;
	}
}
```

下面是麻烦的验证过程：

首先，计算出在集合$1$，$2$，$3$中的点数$cnt1,cnt2,cnt3$

注意到$cnt1 !=0,cnt2!=0,cnt3!=0$且$cnt1*cnt2+cnt2*cnt3+cnt1*cnt3=m$。

而且和每个点相邻的所有点都在另外两个集合中，可以根据这个性质进一步验证。

```cpp
int cnt1=0,cnt2=0,cnt3=0;
for (register int i=1;i<=n;++i){
	if (ans[i]==0) ans[i]=2;
	if (ans[i]==1) cnt1++;
	if (ans[i]==2) cnt2++;
	if (ans[i]==3) cnt3++;	
}
if (cnt1==0||cnt2==0||cnt3==0) return puts("-1"),0;
if (cnt1*cnt2+cnt2*cnt3+cnt3*cnt1!=m) return puts("-1"),0;

int c[4];
for (register int i=1;i<=n;++i){
	memset(c,0,sizeof(c));
	for (register int j=0;j<G[i].size();++j){
		c[ans[G[i][j]]]++;
	}
	if (c[ans[i]]!=0) return puts("-1"),0;//两个点在同一个集合
	if (ans[i]==1) if (c[2]!=cnt2||c[3]!=cnt3) return puts("-1"),0;//和不相等
	if (ans[i]==2) if (c[1]!=cnt1||c[3]!=cnt3) return puts("-1"),0;
	if (ans[i]==3) if (c[1]!=cnt1||c[2]!=cnt2) return puts("-1"),0;
}
```

## $Code4$

```cpp
#include <bits/stdc++.h>
#define MAXN 300005
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
int deg[MAXN],vis[MAXN];
int vised[MAXN];
vector<int>G[MAXN];
inline void dfs(int u){
	vised[u]=true;
	for (register int i=0;i<G[u].size();++i){
		if (!vised[G[u][i]]) dfs(G[u][i]);
	}
}
int ans[MAXN];
int main(){
	int n=read(),m=read();
	for (register int i=1;i<=m;++i){
		int u=read(),v=read();
		G[u].push_back(v),G[v].push_back(u);
		deg[u]++,deg[v]++;
	}
	dfs(1);
	for (register int i=1;i<=n;++i){
		if (!vised[i]) return puts("-1"),0;//判断联通
	}
	for (register int i=0;i<G[1].size();++i){
		vis[G[1][i]]=true;//标记2,3组
	}
	bool flag=true;
	for (register int i=1;i<=n;++i){
		if (!vis[i]){
			ans[i]=1;
		}
		else if (vis[i]&&flag){
			for (register int j=0;j<G[i].size();++j){//这次到达的是1,3组
				int v=G[i][j];
				if (vis[v]) ans[v]=3;
			}
			flag=false;
		}
	}
	int cnt1=0,cnt2=0,cnt3=0;
	for (register int i=1;i<=n;++i){
		if (ans[i]==0) ans[i]=2;
		if (ans[i]==1) cnt1++;
		if (ans[i]==2) cnt2++;
		if (ans[i]==3) cnt3++;
	}
	if (cnt1==0||cnt2==0||cnt3==0) return puts("-1"),0;
	if (cnt1*cnt2+cnt2*cnt3+cnt3*cnt1!=m) return puts("-1"),0;
	int c[4];
	for (register int i=1;i<=n;++i){
		memset(c,0,sizeof(c));
		for (register int j=0;j<G[i].size();++j){
			c[ans[G[i][j]]]++;
		}
		if (c[ans[i]]!=0) return puts("-1"),0;
		if (ans[i]==1) if (c[2]!=cnt2||c[3]!=cnt3) return puts("-1"),0;
		if (ans[i]==2) if (c[1]!=cnt1||c[3]!=cnt3) return puts("-1"),0;
		if (ans[i]==3) if (c[1]!=cnt1||c[2]!=cnt2) return puts("-1"),0;
	}
	for (register int i=1;i<=n;++i){
		printf("%d ",ans[i]);
	}
}
```

