---
title: P5099 [USACO2004OPEN]Cave Cows 4 洞穴里的牛之四 SPFA
  
tag:
  - 题解
  - 图论
  - SPFA
abbrlink: dcd3e3e5
date: 2019-07-13 20:34:14
---

[传送门](https://www.luogu.org/problemnew/show/P5099)
考虑建图，把$x$方向$z$方向距离都不超过$2$的点连一条边长为$1$的边，最后跑一遍SPFA。
具体实现可以把点放进一个$map$里面。

```cpp
// luogu-judger-enable-o2
#include <bits/stdc++.h>
#define MAXN 50000
#define pii pair<int,int>
inline int read(){
	int x=0,f=1;
	char ch=getchar();
	while (ch<'0'||ch>'9'){
		if (ch=='-') f=-1;
		ch=getchar(); 
	}
	while (ch>='0'&&ch<='9'){
		x=(x*10)+(ch-'0');
		ch=getchar();
	}
	return x;
}
using namespace std;
vector<int>G[MAXN];
void AddEdge(int u,int v){
    //printf("Adding Edge from %d to %d\n",u,v);
    G[u].push_back(v);
    G[v].push_back(u);
}
map<pii ,int>M;
int X[MAXN],Z[MAXN];
int vis[MAXN],dis[MAXN];
int t,n;
inline int SPFA(){
    queue<int>Q;
    Q.push(n+1);
    vis[n+1]=true;
    for (register int i=1;i<=n;++i){
        dis[i]=0x7fffffff;
    }
    dis[n+1]=0;
    while (Q.size()){
        int u=Q.front();
        Q.pop();
        for (register int i=0;i<G[u].size();++i){
            int v=G[u][i];
            if (!vis[v]){
                vis[v]=true;
                dis[v]=min(dis[v],dis[u]+1);
                Q.push(v);
            }
        }
    }
    int ans=0x7fffffff;
    for (register int i=1;i<=n+1;++i){
        if (Z[i]==t){
            ans=min(ans,dis[i]);
        }
    }
    if (ans==0x7fffffff){
        return -1;
    }
    else {
        return ans;
    }
}
int main(){
    //freopen("testdata.in","r",stdin);
    n=read(),t=read();
    for (register int i=1;i<=n;++i){
        int x=read(),z=read();
        M[make_pair(x,z)]=i;
        X[i]=x,Z[i]=z;
    }
    X[n+1]=Z[n+1]=0;
    M[make_pair(0,0)]=n+1;
    for (register int i=1;i<=n+1;++i){
        for (register int p=-2;p<=2;++p){
            for (register int q=-2;q<=2;++q){
                if (p!=0||q!=0){
                    int ni=X[i]+p,nj=Z[i]+q;
                    if (M.count(make_pair(ni,nj))){
                        AddEdge(i,M[make_pair(ni,nj)]);
                    }
                }
            }
        }
    }
    printf("%d\n",SPFA());
}
```