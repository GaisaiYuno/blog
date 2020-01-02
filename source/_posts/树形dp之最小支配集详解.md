---
title: 树形dp之最小支配集详解
abbrlink: a18ff24e
date: 2019-08-25 20:34:03
tags:
  - 树形dp
---

最小支配集的定义：给你一棵树，让你选出一些节点，选出来的节点会把自己和相邻的节点全部覆盖，让你求出选出来节点的最小数量。

考虑树形dp：

定义:
$dp[i][0]$: 点$i$属于支配集，并且以点$i$为根的子树都被覆盖了的情况下支配集中包含的最少点数 也就是$i$支配自己

合法状态举例（不一定最少）

![](/images/sample1.png)

$dp[i][1]$: 点$i$**不属于**支配集，且以$i$为根的子树都被覆盖，且$i$被其中不少于$1$个子节点覆盖的情况下支配集包含的最少点数 也就是$i$的孩子支配$i$

![](/images/sample2.png)

$dp[i][2]$: 点$i$**不属于**支配集，且以$i$为根的子树都被覆盖，**且$i$没被子节点覆盖**的情况下支配集包含的最少点数 也就是$i$由父亲支配

![](/images/sample3.png)

希望你们好好研究子状态，容易混淆的地方已经用粗体字标出

------------

初始值的设置：

因为$u$由自己支配，所以至少选$u$自己；

因为$u$由孩子支配，而且$u$一定不能选，所以这种情况设成INF，表示未知；

因为$u$由父亲支配，而且$u$一定不能选，所以这种情况设成0。

```cpp
dp[u][0]=1;dp[u][1]=INF;dp[u][2]=0;//INF不能太大
```

$1.u$支配自己​：剩下怎么搞，都能满足节点$v$被覆盖

```cpp
int val=min(min(dp[v][0],dp[v][1]),dp[v][2]);
dp[u][0]+=val;
```

统计方案数也非常简单，只要等于最小值，都可以加入最佳方案

```cpp
ll temp=0;
for (register int i=0;i<=2;++i){
    if (dp[v][i]==val) Add(temp,cnt[v][i]);//加入方案
}
Mul(cnt[u][0],temp);
```

$2.u$由孩子节点支配：

这种情况是最复杂的：

```cpp
val=min(dp[u][1]+min(dp[v][0],dp[v][1]),dp[u][2]+dp[v][0]);
temp=0;
for (register int i=0;i<=1;++i) {
    if (dp[u][1]+dp[v][i]==val) Add(temp,cnt[v][i]);
}
Mul(cnt[u][1],temp);
if (dp[u][2]+dp[v][0]==val) Add(cnt[u][1],cnt[u][2]*cnt[v][0]%MOD);
dp[u][1]=val;//要最后更新
```

$--1.$只要$u$已经由孩子支配了，发现$v$可以由自己支配，也可以由孩子支配，但是不能由父亲支配，因为$u$不支配自己。

$--2.$如果$u$由父亲支配，那么加入一个自己支配自己的子节点，就可以变成一个合法的由孩子支配的状态，注意这样的状态不是由父亲支配的状态，因为前面的子状态保证了$u$的孩子不支配$u$，与此矛盾。

$3.u$由父亲支配，发现$v$只能由孩子支配，就这样完了。

```cpp
dp[u][2]+=dp[v][1];
Mul(cnt[u][2],cnt[v][1]);
```

完整代码，可以求出方案数

```cpp
/*
定义:
dp[i][0]: 点i属于支配集，并且以点i为根的子树都被覆盖了的情况下支配集中包含的最少点数 也就是i支配自己
dp[i][1]: 点i不属于支配集，且以i为根的子树都被覆盖，且i被其中不少于1个子节点覆盖的情况下支配集包含的最少点数 也就是i的孩子支配i
dp[i][2]: 点i不属于支配集，且以i为根的子树都被覆盖，且i没被子节点覆盖的情况下支配集包含的最少点数 也就是i由父亲支配
 */
#include <bits/stdc++.h>
#define INF 0x3f3f3f3f
#define memmax(a) memset(a,0x3f,sizeof(a))
#define MAXN 500005
#define MOD 1032992941
#define ll long long
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
        x=(x<<3)+(x<<1)+(ch-'0');
        ch=getchar();
    }
    return x*f;
}
vector<int>G[MAXN];
void AddEdge(int u,int v){
    G[u].push_back(v);
    G[v].push_back(u);
}
int dp[MAXN][3];
ll cnt[MAXN][3];
void Add(ll &A,ll B){
    A=(A+B)%MOD;
}
void Mul(ll &A,ll B){
    A=(A*B)%MOD;
}
void dfs(int u,int father){
    dp[u][0]=1;dp[u][1]=INF;dp[u][2]=0;//INF不能太大
    cnt[u][0]=cnt[u][1]=cnt[u][2]=1;//因为方案是乘起来的
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i];
        if (v!=father){
            dfs(v,u);
            //----------------------------------------------------------
            //只要u支配了自己，剩下怎样都可以
            int val=min(min(dp[v][0],dp[v][1]),dp[v][2]);
            dp[u][0]+=val;

            ll temp=0;
            for (register int i=0;i<=2;++i){
                if (dp[v][i]==val) Add(temp,cnt[v][i]);
            }
            Mul(cnt[u][0],temp);

            //----------------------------------------------------------
            //1.u由其中一个子节点支配,子节点由自己或是孩子支配，而不由u支配
            //2.u由父亲支配,子节点支配自己
            val=min(dp[u][1]+min(dp[v][0],dp[v][1]),dp[u][2]+dp[v][0]);
            
            temp=0;
            for (register int i=0;i<=1;++i) {
                if (dp[u][1]+dp[v][i]==val) Add(temp,cnt[v][i]);
            }
            Mul(cnt[u][1],temp);
            if (dp[u][2]+dp[v][0]==val) Add(cnt[u][1],cnt[u][2]*cnt[v][0]%MOD);

            dp[u][1]=val;//要最后更新

            //----------------------------------------------------------
            //u由父亲支配,子节点只能支配自己
            //(子节点不能由父亲支配，因为u没有；也不能由自己支配，因为u仅仅由父亲支配)
            dp[u][2]+=dp[v][1];
            Mul(cnt[u][2],cnt[v][1]);
        }
    }
}
#undef int
int main(){
#define int long long
    int n=read();
    for (register int i=1;i<n;++i){
        AddEdge(read(),read());
    }
    dfs(1,0);
    int val=min(dp[1][0],dp[1][1]);//1没有父亲
    ll ans=0;
    for (register int i=0;i<=1;++i) {
        if (dp[1][i]==val) Add(ans,cnt[1][i]);
    }
    printf("%d\n%lld\n",val,ans);
}
```

