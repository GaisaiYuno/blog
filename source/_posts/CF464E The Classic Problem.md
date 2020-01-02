---
title: CF464E The Classic Problem 主席树
  
tag:
  - 题解
  - 图论
  - 主席树
  - 可持久化
  - 线段树
  - Dijkstra
abbrlink: 28c938b4
date: 2019-07-13 20:34:14
---
[传送门](https://www.luogu.org/problemnew/show/CF464E)
一眼看上去：这不就是最短路的模板吗？
两眼：边权太大了，怎么开的下？
考虑还是用$\rm Dijkstra$解决，每个点开一棵线段树，存储二进制的状态

我们要实现的功能:
1.给二进制数加上$2^k$，这可以看成把$k$位后所有连续的$1$变成0，再把所有连续$1$后的那一个$0$变成$1$
2.比较两个二进制数的大小，先比较高位，再比较低位。

但是用普通线段树实现，空间为$O(nm)$会爆掉。
考虑使用主席树，每次只要新开$\log n$的节点，空间复杂度为$O(n \log n)$

代码细节比较多，比较烦人
```cpp
#include <bits/stdc++.h>
#define MAXN 500005
#define MOD 1000000007
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
int pow2[MAXN];
inline void Init(){
    pow2[0]=1;
    for (register int i=1;i<MAXN;++i){
        pow2[i]=(pow2[i-1]<<1)%MOD;
    }
}
namespace SegmentTree{
    struct node{
        int l,r;
        int v;
    }tree[MAXN*30];
    #define lc(i) tree[i].l
    #define rc(i) tree[i].r
    inline void pushup(int i,int len){
        //维护区间[l,r]代表的二进制数MOD1e7的值
        tree[i].v=(tree[lc(i)].v+tree[rc(i)].v*pow2[len]%MOD)%MOD;
    }
    int tot;
    #define Lson lc(x),lc(y),L,mid
    #define Rson rc(x),rc(y),mid+1,R
    int Update(int x,int &y,int L,int R,int index){
        y=++tot;
        lc(y)=lc(x),rc(y)=rc(x);
        if (L==R){
            tree[y].v=tree[x].v^1;
            return tree[x].v;//有进位：1，没进位：0
        }
        int mid=(L+R)>>1,ans;
        if (index<=mid){
            ans=Update(Lson,index);
            if (ans!=0) ans=Update(Rson,index);//如果进位到右边，还要继续修改右子树
        }
        else {//右边的不可能进位
            ans=Update(Rson,index);
        }
        pushup(y,mid-L+1);
        return ans;
    }
    bool Compare(int x,int y,int L,int R){
        //比较可持久化线段树x,y对应二进制数的大小
        if (L==R) {
            return tree[x].v>tree[y].v;
        }
        int mid=(L+R)>>1;
        if (tree[rc(x)].v==tree[rc(y)].v){//优先比较右边
            return Compare(Lson);
        }
        else {
            return Compare(Rson);
        }
    }
}
using namespace SegmentTree;
 
int maxn;
struct Node{
    int u,rt;
};
bool operator < (Node A,Node B){
    return Compare(A.rt,B.rt,0,maxn);
}
 
struct Edge{
    int to,len;
};
vector<Edge>G[MAXN];
inline void AddEdge(int u,int v,int w){
    Edge temp;
    temp.to=v,temp.len=w;
    G[u].push_back(temp);
}
int vis[MAXN],dis[MAXN],rt[MAXN],pre[MAXN],dep[MAXN];
int s,t;
void Out(int u,int dep){//输出路径
    if (u==s){printf("%I64d\n%I64d ",dep,s);return ;}
    Out(pre[u],dep+1);
    printf("%I64d ",u);
}
#undef int
int main(){
#define int long long
    Init();
    int n=read(),m=read();
    for (register int i=1;i<=m;++i){
        int u=read(),v=read(),w=read();
        AddEdge(u,v,w);
        AddEdge(v,u,w);
        maxn=max(maxn,w);
    }
    maxn+=log2(m)+1;//最多进log2(m)次位
    
    s=read(),t=read();
    priority_queue<Node>Q;
    Q.push(Node{s,0});
    while (Q.size()){
        int u=Q.top().u,R=Q.top().rt;
        Q.pop();
        if (vis[u]) continue;
        vis[u]=true;
        for (register int i=0;i<G[u].size();++i){
            int v=G[u][i].to,w=G[u][i].len,_rt=0;
            Update(R,_rt,0,maxn,w);
            if (!rt[v]||Compare(rt[v],_rt,0,maxn)){
                rt[v]=_rt,pre[v]=u;
                dep[v]=dep[u]+1;
                Q.push(Node{v,rt[v]});
            }
        }
    }
    if (!vis[t]){
        printf("-1\n");
    }
    else {
        printf("%I64d\n",tree[rt[t]].v);
        Out(t,1);
    }
}
```