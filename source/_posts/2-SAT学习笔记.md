---
title: 2-SAT学习笔记
abbrlink: c7c48d7b
date: 2019-08-04 10:22:21
tags:
  - 2-SAT
---

对于$x_1 ... x_n$，考虑如下的$m$条限制：

$x_i$为true/false或者$x_j$为true/false

我们举个例子，如果要求的是$x_i$为true或者$x_j$为false

那么如果$x_i$为false，$x_j$就必须为true

反之，如果$x_j$为true，$x_i$就必须为true

这样，我们巧妙地将**或问题**转换成**与问题**

插句题外话，其实或运算可以转换成与运算，即$x \text{ and } y = \text{not }((\text{not }x) \text{ or } (\text{not y}))$，

~~这个性质在红石里面很有用~~

好了，发现怎么转换以后，我们考虑将问题抽象化，不妨建一个**有向**图。

事实上，我们建的是两倍节点的图，前面的$n$个点代表$x_i==true$，后面$n$个点代表$x_i==false$

$<u,v>$表示$u$**的值**为真的话，$v$**的值**就必须为真。

注意到我们建立的是有向图，所以刚才的边并不代表$v$的值为真，能推出$u$的值为真。

我们考虑如何判断矛盾，我们在求出这个图的强连通分量，同一强连通分量中的值一定相等，如果$x_i==true$代表的节点和$x_i==false$的节点在同一强连通分量，那么不合法。

如果没有这种矛盾，是可以证明一定有一个合法的解的。（然鹅我不会证）

考虑把所有强连通分量缩成一个点，变成一个拓扑图（当然在代码里面不用写）。

![](/images/tp.png)

注意这里每个点代表的是原图的一个强连通分量。

假设我们现在选了一个拓扑序比较靠前的节点$u$，钦定它的值为true​（标成红色）

![](/images/tp2.png)

那么拓扑序大于它的节点都必须为true。

![](/images/tp3.png)

这样标成true的节点太多了，可能造成很多矛盾，不符合基本法。

考虑一个更优的方法：

![](/images/tp4.png)

我们选一个拓扑序靠后的节点$v$，钦定它的值为true，这样只要把较少点标成true。

不知道高到哪里去了。

所以，根据贪心的原则我们优先选择拓扑序靠后的节点设成true

再举个例子：在这种情况下设u=false，因为它的拓扑序比较靠后，如果设u=true显然会造成矛盾。

![](/images/tp5.png)

注意到$tarjan$的拓扑序是从大到小的，所以输出时是这个样子的：

```cpp
for (register int i=1;i<=n;++i){
   printf("%d ",col[i]>col[i+n]);
}
```

-------

好了，算法讲解好了，我们做一道练习题（做之前先把算法理解透彻）：

[P4782 【模板】2-SAT 问题](https://www.luogu.org/problem/P4782)

这里我们设$x_i ==true$的节点在$1 \text{ ~ } n$，$x_i==false$的节点在$n+1 \text{ ~ } 2n$

加边的时候这样加，避免讨论：

```cpp
AddEdge(u+(!a)*n,v+b*n);
AddEdge(v+(!b)*n,u+a*n);
```

注意数组开两倍

```cpp
// luogu-judger-enable-o2
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
vector<int>G[MAXN];
inline void AddEdge(int u,int v){
    G[u].push_back(v);
}
int dfn[MAXN],low[MAXN],cnt;
stack<int>stk;
int scc,col[MAXN];
void tarjan(int u){
    dfn[u]=low[u]=++cnt;
    stk.push(u);
    for (register int i=0;i<G[u].size();++i){
        int v=G[u][i];
        if (!dfn[v]) tarjan(v),low[u]=min(low[u],low[v]);
        else if (!col[v]) low[u]=min(low[u],dfn[v]);
    }
    if (low[u]==dfn[u]){
        ++scc;
        do{
            col[u]=scc;
            u=stk.top(),stk.pop();
        }while (low[u]!=dfn[u]);
    }
}
int main(){
    int n=read(),m=read();
    for (register int i=1;i<=m;++i){
        int u=read(),a=read(),v=read(),b=read(); 
        AddEdge(u+(!a)*n,v+b*n);
        AddEdge(v+(!b)*n,u+a*n);
    }
    for (register int i=1;i<=(n<<1);++i){
        if (!dfn[i]) tarjan(i);
    }
    for (register int i=1;i<=n;++i){
        if (col[i]==col[i+n]){
            puts("IMPOSSIBLE");
            return 0;
        }
    }
    puts("POSSIBLE");
    for (register int i=1;i<=n;++i){
        printf("%d ",col[i]>col[i+n]);
    }
}
```

