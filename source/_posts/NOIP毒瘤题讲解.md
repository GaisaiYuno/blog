---
title: NOIP毒瘤题讲解
tags:
  - 题解
  - 水
abbrlink: 2f7462de
date: 2019-11-09 16:19:40
---

### P1600 天天爱跑步

 这道题细节多比较烦人。

对于一个观察员$u$，考虑哪些跑步者可以对他被他观察到。

### 性质1

![](https://ae01.alicdn.com/kf/H972fabcc99b04a9da0af9b0d294d29d5n.png)

![](https://ae01.alicdn.com/kf/H34497ab036a7434581019f893f1e6ce9b.png)

（搞笑情况）

![](https://ae01.alicdn.com/kf/H5e7d6462a8e342c0bbaf63251caf8eecu.png)

![](https://ae01.alicdn.com/kf/H4f896ffc426e409a8930d5591abad109p.png)

$s \in subtree(u)  \ t \notin subtree(u) \to $从$s$出发，在上行路线上被观察到

$t \in subtree(u) \ s \notin subtree(u) \to $在$t$结束，在下行路线上被观察到

$s,t \in subtree(u)$，全部缩在$u$子树里面，只可能$u==lca(s,t)$时观察到

![](https://ae01.alicdn.com/kf/H884df5dff3744774a372779204bbc4104.png)

如果不是：
![](https://ae01.alicdn.com/kf/H972fabcc99b04a9da0af9b0d294d29d5n.png)

### 性质2
#### 在上行路线上被看到

![](https://ae01.alicdn.com/kf/Hc7e2f50f1d264ab9b57e162c4ba565cfC.png)

#### 在下行路线上被看到

![](https://ae01.alicdn.com/kf/He64381e873c74f42b683f657a3874336W.png)

![](https://ae01.alicdn.com/kf/H239af0a408704537b26f6e1c24702c9bW.png)

```cpp
#include <bits/stdc++.h>
#define MAXN 300005
#define MAXM 25
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
vector<int>G[MAXN];
inline void AddEdge(int u,int v){
	G[u].push_back(v);
}
namespace L__C__A__Desu{//简单LCA
	int anc[MAXN][MAXM],dep[MAXN];
	void dfs(int u,int father){
		anc[u][0]=father;
		for (register int i=1;i<MAXM;++i) anc[u][i]=anc[anc[u][i-1]][i-1];
		for (register int i=0;i<G[u].size();++i){
			int v=G[u][i];
			if (v!=father){
				dep[v]=dep[u]+1;
				dfs(v,u);
			}
		}
	}
	inline int LCA(int u,int v){
		if (u==v) return u;
		if (dep[u]<dep[v]) swap(u,v);
		for (register int i=MAXM-1;i>=0;--i){
			if (dep[anc[u][i]]>=dep[v]) u=anc[u][i];
		}
		if (u==v) return u;
		for (register int i=MAXM-1;i>=0;--i){
			if (anc[u][i]!=anc[v][i]) u=anc[u][i],v=anc[v][i];
		}
		return anc[u][0];
	}
}
using namespace L__C__A__Desu;
struct buc{//更加好用的桶
	int cnt[MAXN*2];
	inline void Init(){
		memset(cnt,0,sizeof(cnt));
	}
	int &operator [](int i){//重载运算符
		return cnt[i+MAXN];
	}
}B;
vector<int>Start[MAXN],End[MAXN],Lca[MAXN];
//以i为结束点的路线组成的集合为End[i]
//....
//....
int dist[MAXN];//编号为i的路线的长度，即dist(s[i],t[i])
int ans[MAXN],w[MAXN];
int s[MAXN],t[MAXN];
void Solve1(int u,int father){//统计上行路线的贡献
	int temp=B[w[u]+dep[u]];//原来的已经有的（要减去）
	for (register int i=0;i<G[u].size();++i){
		int v=G[u][i];
		if (v!=father) Solve1(v,u);
	}
	for (register int i=0;i<Start[u].size();++i){
		int id=Start[u][i];
		B[dep[s[id]]]++;
	}
	ans[u]+=B[w[u]+dep[u]]-temp;
	for (register int i=0;i<Lca[u].size();++i){
		int id=Lca[u][i];
		B[dep[s[id]]]--;//要减去，以后会完全包含于u的子树
	}
}
void Solve2(int u,int father){
	int temp=B[dep[u]-w[u]];
	for (register int i=0;i<G[u].size();++i){
		int v=G[u][i];
		if (v!=father) Solve2(v,u);
	}
	for (register int i=0;i<End[u].size();++i){
		int id=End[u][i];
		B[dep[t[id]]-dist[id]]++;
	}
	ans[u]+=B[dep[u]-w[u]]-temp;
	for (register int i=0;i<Lca[u].size();++i){
		int id=Lca[u][i];
		B[dep[t[id]]-dist[id]]--;
	}
}
int main(){
	int n=read(),m=read();
	for (register int i=1;i<n;++i){
		int u=read(),v=read();
		AddEdge(u,v);
		AddEdge(v,u);
	}
	for (register int i=1;i<=n;++i) w[i]=read();
	dep[1]=1;
	dfs(1,1);
	for (register int i=1;i<=m;++i){
		s[i]=read(),t[i]=read();
		int lca=LCA(s[i],t[i]);
		dist[i]=dep[s[i]]+dep[t[i]]-dep[lca]*2;
		Start[s[i]].push_back(i);
		End[t[i]].push_back(i);
		Lca[lca].push_back(i);
		if (dep[s[i]]-dep[lca]==w[lca]) ans[lca]--;//减去lca上面重复算的
	}
	B.Init(),Solve1(1,1);
	B.Init(),Solve2(1,1);
	for (register int i=1;i<=n;++i) printf("%d ",ans[i]);
}
```

### P3958 奶酪

一开始看这道题感觉有点意思，但是发现$n\le 1000$就屑了。

```cpp
#include <cmath>
#include <cstdio>
#include <iostream>
#include <vector>
#define MAXN 1005
#define ll long long
using namespace std;
struct BCJ
{
    int fa[MAXN];
    void init(int n){
        for (int i = 0; i <= n; i++){
            fa[i] = i;
        }
    }
    int find(int x){
        return (x == fa[x]) ? x : (fa[x] = find(fa[x]));
    }
    void link(int i, int j){
        fa[find(i)] = find(j);
    }
}Set;
struct point{
    ll x, y, z;
    void read(){
        scanf("%lld%lld%lld", &x, &y, &z);
    }
} p[MAXN];
ll calc(ll a, ll b)
{
    return (a - b) * (a - b);
}
ll r;
bool check(point a, point b)
{
    long double dist = sqrt(calc(a.x, b.x) + calc(a.y, b.y) + calc(a.z, b.z));
    return (dist <= (2.0 * r));
}
vector<ll> Up, Down;
int main()
{
    int T;
    scanf("%d", &T);
    while (T--)
    {
        ll n;
        ll h;
        scanf("%lld%lld%lld", &n, &h, &r);
        Set.init(n);
        Up.clear();
        Down.clear();
        for (ll i = 0; i < n; i++)
        {
            p[i].read();
            if ((p[i].z - r) <= 0)
            {
                Down.push_back(i);
            }
            if ((p[i].z + r) >= h)
            {
                Up.push_back(i);
            }
        }
        for (ll i = 0; i < n; i++)
        {
            for (ll j = i + 1; j < n; j++)
            {
                if (check(p[i], p[j]))
                {
                    Set.link(i, j);
                }
            }
        }
        bool flag = false;
        for (ll i = 0; i < Up.size(); i++)
        {
            for (ll j = 0; j < Down.size(); j++)
            {
                if (Set.find(Up[i]) == Set.find(Down[j]))
                {
                    printf("Yes\n");
                    flag = true;
                    break;
                }
            }
            if (flag)
                break;
        }
        if (!flag)
        {
            printf("No\n");
        }
    }
}
```



### P5020 货币系统

玄学代码（NOIP时写的）

```cpp
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cstring>
#define N 5000005
#define MAXN 105
using namespace std;
inline void read(int &x){
	int f=1;
	char ch=getchar();
	while (ch<'0'||ch>'9'){
		if (ch=='-') f=-1;
		ch=getchar();
	}
	x=0;
	while (ch>='0'&&ch<='9'){
		x=(x<<1)+(x<<3)+(ch^48);
		ch=getchar();
	}
	x*=f;
}
int A[MAXN],vis[MAXN];
int n,lst;
int vis_sum[N];
void dfs(int i,int sum){
	if (vis_sum[sum]>lst){
		return ;
	}
	else {
		vis_sum[sum]=lst;
	}
	if (i==n+1||sum>A[n]){
		return ;
	}
	for (register int j=0;;++j){
		int v=sum+A[i]*j;
		if (v<=A[n]){
			bool flag=0;
			int templst=lst;
			if (j!=0) lst=i;
			if (A[lst]==v){flag=1;}
			if (!flag){
				int pos=lower_bound(A+1,A+1+n,v)-A;
				if (A[pos]==v){
					vis[pos]=1;
				}
			}
			dfs(i+1,v);
			lst=templst;
		}
		else{
			break;
		}
	}
}
inline int Calc(){
	memset(vis,0,sizeof(vis));
	sort(A+1,A+1+n);
	lst=0;
	memset(vis_sum,~0x3f,sizeof(vis_sum));
	dfs(1,0);
	int ans=0;
	for (register int i=1;i<=n;++i){
		ans+=(vis[i]==0);
	}
	printf("%d\n",ans);
	return 0;
}
int main(){
	freopen("money.in","r",stdin);
	freopen("money.out","w",stdout);
	int t;
	scanf("%d",&t);
	while (t--){
		scanf("%d",&n);
		for (register int i=1;i<=n;++i){
			read(A[i]);
		}
		if (n==1){
			printf("1\n");
			continue;
		}
		Calc();
	}
	return 0;
}
```

感觉洛谷第一个题解是在扯淡。

定义$(|A|,A)$和$(|B|,B)$是等价的，称为$A \Leftrightarrow B$，注意到等价是相互的，具有传递性。

显然等价具有传递性，即$A \Leftrightarrow B,B \Leftrightarrow C$ 推出$A \Leftrightarrow C$。

将题目给的$a$数组排序，假设已经选出了$j$个数$b[]$，显然$a[1...i] \Leftrightarrow b[1..j]$。

 ![](https://ae01.alicdn.com/kf/H4bb2df1405fd4a63be8d16fe967dfd12A.png)

考虑加上一个数，使得$a[1..i+1] \Leftrightarrow b[1...j]$

![](https://ae01.alicdn.com/kf/Hf78880700590408894c69a9a25ecc55bu.png)

如果$a[i+1]$能够被$b[1...j]$表示，则跳过。

如果$b[j+1]>a[i+1]$，想想就不可能，因为$b[j+1]$不可能参与到$a[i+1]$的表达中。

如果$b[j+1]<a[i+1]$：

如果$b[j+1]$能够被$b[1...j]$表示，那么再来一个$b[j+1]$是没用的，而且不能表示出$a[i+1]$。

如果$b[j+1]$不能被$b[1...j]$表示，注意到等价性是相互的，$g' \Leftrightarrow r'$，表示$b[j+1]$可以在$a[1...i+1]$中得到表达，而因为$b[j+1] < a[i+1]$，所以$a[i+1]$不会参加$b[j+1]$的表达，说明$b[j+1]$可以在$a[1....i]$中得到表达。

但是注意到等价的传递性，$b[1...j] \Leftrightarrow a[1...i]$，所以$b[j+1]$可以在$b[1...j]$中得到表达。

再看一下我们的假设，发生矛盾。

于是$b[j+1]==a[i+1]$

---

我们证明了如下算法的正确性：

```cpp
void Solve(){
    Ans={};
    sort(a);
    for (x in a){
        if (x不能被Ans中的数表达) Ans.insert(x);
    }
}
```

令$dp[x]$表示$x$能不能被表达，可以推出$dp$方程$dp[j]|=dp[j-a[i]]$。

```cpp
// luogu-judger-enable-o2
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>
#define N 105
#define M 25005
using namespace std;
int money[N],dp[M];
int main(){
	freopen("money.in","r",stdin);
	freopen("money.out","w",stdout);
	int t;
	scanf("%d",&t);
	while (t--){
		memset(dp,0,sizeof(dp));
		int n;
		scanf("%d",&n);
		for (register int i=1;i<=n;++i){
			scanf("%d",&money[i]);
		}
		int ans=0;
		sort(money+1,money+1+n);
		dp[0]=1;
		for (register int i=1;i<=n;++i){
			if (dp[money[i]]) {
				continue;
			}
			ans++;
			for (register int j=money[i];j<=money[n];++j){//只用考虑大于当前数的
				dp[j]|=dp[j-money[i]];
			}
		}
		printf("%d\n",ans);
	}
}
```

