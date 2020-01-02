---
title: BZOJ 4987 Tree
abbrlink: e7d175a4
date: 2019-08-25 15:39:12
tags:
  - 树形dp
  - 动态规划
---

[传送门](https://www.lydsy.com/JudgeOnline/problem.php?id=4987)

先上一个结论，所有$k$个节点应该构成一棵树，形状是原树的直径连着一堆子树，其中直径只经过一遍，子树的所有边经过两次，走法就是从直径的一段走到另一端，但是中途会离开直径，到某个和当前节点相连的子树逛一圈再回到这个节点。

所以子状态就有了，$dp[u][j][0/1/2]$表示$u$的子树里面选$j$个点，而且$u$的子树里面有多少直径的端点。

分六种情况考虑。

--------------

$dp[u][j+k][0]$只能从$dp[u][j][0]$，$dp[v][k][0]$转移而来，显然边$<u,v>$不属于直径，所以要算两遍：

```cpp
chkmin(dp[u][j+k][0],dp[u][j][0]+dp[v][k][0]+len*2);
```

--------------------

$dp[u][j+k][1]$：转移有两种情况：

$a.dp[u][j][1],dp[v][k][0]$转移而来，如图所示，直径一定穿过$u$，所以$<u,v>$算两次。

![](/images/type2.png)

```cpp
chkmin(dp[u][j+k][1],dp[u][j][1]+dp[v][k][0]+len*2);
```

$b.dp[u][j][0],dp[v][k][1]$转移而来，如图所示，直径穿过$<u,v>$，$<u,v>$只算一次。

![](/images/type3.png)

```cpp
chkmin(dp[u][j+k][1],dp[u][j][0]+dp[v][k][1]+len);
```

----------------

$dp[u][j+k][2]$：转移有三种情况：

$a.dp[u][j][0],dp[v][k][2]/dp[u][j][2],dp[v][k][0]$，转移而来，发现直径只可能整个缩在$u/v$的子树之中，所以算两次。

```cpp
chkmin(dp[u][j+k][2],dp[u][j][0]+dp[v][k][2]+len*2);
chkmin(dp[u][j+k][2],dp[u][j][2]+dp[v][k][0]+len*2);
```

$b.dp[u][j][1],dp[v][k][1]$转移而来，发现直径经过$<u,v>$，所以算一次

![](/images/type4.png)

```cpp
chkmin(dp[u][j+k][2],dp[u][j][1]+dp[v][k][1]+len);
```

代码：

```cpp
#include <bits/stdc++.h>
#define MAXN 3005
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
int n,m;
struct Edge{
    int to,len;
};
vector<Edge>G[MAXN];
inline void AddEdge(int u,int v,int w){
    G[u].push_back(Edge{v,w});
}
int dp[MAXN][MAXN][4],sz[MAXN];
inline void chkmin(int &a,int b){
    if (a>b) a=b;
}
void dfs(int u,int father){
    sz[u]=1;
    dp[u][1][0]=dp[u][1][1]=dp[u][1][2]=0;
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to,len=G[u][i].len;
        if (v==father) continue;
        dfs(v,u);
        for (register int j=min(m,sz[u]);j>=1;--j){
            for (register int k=1;k<=min(m,sz[v]);++k){
                if (j+k>m) continue;
                chkmin(dp[u][j+k][0],dp[u][j][0]+dp[v][k][0]+len*2);
                chkmin(dp[u][j+k][1],dp[u][j][1]+dp[v][k][0]+len*2);
                chkmin(dp[u][j+k][1],dp[u][j][0]+dp[v][k][1]+len);
                chkmin(dp[u][j+k][2],dp[u][j][1]+dp[v][k][1]+len);
                chkmin(dp[u][j+k][2],dp[u][j][0]+dp[v][k][2]+len*2);
                chkmin(dp[u][j+k][2],dp[u][j][2]+dp[v][k][0]+len*2);
            }
        }
        sz[u]+=sz[v];
    }
}
int main(){
    n=read(),m=read();
    for (register int i=1;i<n;++i){
        int u=read(),v=read(),w=read();
        AddEdge(u,v,w);
        AddEdge(v,u,w);
    }
    memset(dp,0x3f,sizeof(dp));
    dfs(1,1);
    int ans=0x7fffffff;
    for (register int i=1;i<=n;++i) ans=min(ans,dp[i][m][2]);
    printf("%d\n",ans);
}
```

