---
title: P4178 Tree
abbrlink: '124033e5'
date: 2019-07-22 22:50:51
tags:
  - 题解
  - 点分治

---

[传送门](https://www.luogu.org/problemnew/show/P4178)

考虑点分治，$Calc()$函数如何实现呢？，我们把$u$子树内以根节点为端点的链的长度全部存到一个栈里面，将栈排一个序，令$f(i)$为使得$stk[i]+stk[j] \le k$的最小的$j$，考虑把这个式子转换成$stk[j] \le k-stk[i]$，发现只要一次upper_bound，就可以求出$j$， 然后左端点的$i$和区间$[i+1,f[i]]$的数都可以配对，所以有$f[i]-i$种配对方法。

注意是upper_bound而不是lower_bound

```cpp
// luogu-judger-enable-o2
#include <bits/stdc++.h>
#define MAXN 40005
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
struct node{
    int to,len;
};
vector<node>G[MAXN];
inline void AddEdge(int u,int v,int w){
    G[u].push_back(node{v,w});
}
int sz[MAXN],f[MAXN],root;
int vis[MAXN];
//sz是有向的子树的大小，f是无向的子树的最大值，root为重心
void GetRoot(int u,int father,int tot){
    sz[u]=1,f[u]=0;
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to;
        if (v!=father&&!vis[v]){
            GetRoot(v,u,tot);
            sz[u]+=sz[v];
            f[u]=max(f[u],sz[v]);
        }
    }
    f[u]=max(f[u],tot-sz[u]);
    if (f[u]<f[root]) root=u;
}
int stk[MAXN],r;
void GetDep(int u,int father,int dep){
    stk[++r]=dep;
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to,w=G[u][i].len;
        if (v!=father&&!vis[v]){
            GetDep(v,u,dep+w);
        }
    }
}
int k;
inline int Calc(int u,int w){
    r=0;
    GetDep(u,0,w);
    sort(stk+1,stk+1+r);
    int sum=0;
    for (register int i=1;i<=r;++i){
        sum+=upper_bound(stk+i,stk+1+r,k-stk[i])-stk-i-1;
    }
    return sum;
}
inline void NewRoot(int u,int sz){
    root=0;
    GetRoot(u,0,sz);
}
int ans;
void dfs(int u){
    ans+=Calc(u,0);
    vis[u]=true;
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i].to,w=G[u][i].len;
        if (!vis[v]){
            ans-=Calc(v,w);
            NewRoot(v,sz[v]);
            dfs(root);
        }
    }
}

int main(){
    int n=read();
    for (register int i=1;i<n;++i){
        int u=read(),v=read(),w=read();
        AddEdge(u,v,w);
        AddEdge(v,u,w);
    }
    k=read();
    f[0]=n;
    NewRoot(1,n);
    dfs(root);
    printf("%d\n",ans);
}
```

还有一种$O(n)$求配对方法的办法，考虑$two$ $pointers$，维护两个指针$l,r$，我们发现左端点往右，对应的$k-stk[l]$是单调递减的，也就是说，右端点一定是往左的，根据这个性质，如果$stk[l]+stk[r] \le k$，把左端点往右移动，顺便记录答案，否则把右端点往左移动即可。

每个指针加起来移动$n$次，所以算法是$O(n)$的

```cpp
int l=1,sum=0;
while (l<r){
    if (stk[l]+stk[r]<=k) sum+=(r-l),l++;
    else r--;
}
return sum;
```

