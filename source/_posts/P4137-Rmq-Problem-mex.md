---
title: P4137 Rmq Problem / mex
tags:
  - 题解
  - 莫队
  - 回滚莫队
abbrlink: 1e45153c
date: 2019-08-08 21:26:27
---

[传送门](https://www.luogu.org/problem/P4137)

首先建议看一下[这篇博客](https://gaisaiyuno.github.io/archives/f36dea03.html)，学习一下回滚莫队和撤销的奇巧淫技。

$0 \le a_i \le 10^9$，蜃是恐怖，但是发现如果答案$ans > n+1$，说明$1 ... n+1$所有数都出现过，但是我们只有$n$个数，所以矛盾，于是读入的时候这样处理即可。 

```cpp
a[i]=min(n+1,read());
```

加入一个数，如何维护$mex$值呢？

按照上面的思路，维护一个$Max[i]$数组（其中$i$为连续$1$的端点时$Max[i]$才有意义）代表连续$1$的另一个端点的下标。

如果包含现在数字的连续$1$的左端点能到达$0$，说明现在的$mex$值为右端点$+1$

```cpp
if (L==0) ans=R+1;
```

注意当加入的数为$0$的时候有一个小特判，为了防止$x-1$越界。

时间复杂度为$O(n \sqrt n)$，但是它就是被卡了，交几次说不定能过呢？

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
int a[MAXN],pos[MAXN],n,m;
struct Query{
    int l,r,id;
}q[MAXN];
inline bool operator < (const Query &A,const Query &B){
    return pos[A.l]==pos[B.l]?A.r<B.r:pos[A.l]<pos[B.l];
}
static int Ans[MAXN];
static int vis[MAXN];
static int Max[MAXN];//最重要的数组，存的是这一段的另一个端点
int ans,Size;
struct node{
    int pos,org;//位置，一开始的值
}stk[MAXN];
int top,f;
inline void Update(int pos,int val){
    if (f) stk[++top]=node{pos,Max[pos]};
    Max[pos]=val;
}
inline void Add(int x){
    vis[x]++;
    if (vis[x]>1) return ;
	if (x==0) {//特判 
		if (!vis[x+1]) ans=x+1;
		else ans=Max[x+1]+1;
		int R=Max[x+1];
		Update(0,R);Update(R,0);
		return ;
	}
    int L=vis[x-1]?Max[x-1]:x,R=vis[x+1]?Max[x+1]:x;
    if (L==0) ans=R+1;
    Update(L,R);Update(R,L);
}
inline void Undo(){
    for (register int i=top;i>=1;--i){
        Max[stk[i].pos]=stk[i].org;
    }
    top=0;
}
inline int BruteForce(int l,int r){
    ans=0;
    f=false;
    for (register int i=l;i<=r;++i){
        Add(a[i]);
    }
    for (register int i=l;i<=r;++i){
        Max[a[i]]=0,vis[a[i]]=0;
    }
    int temp=ans;
    ans=0;
    return temp;
}
inline int MoQueue(int i,int id){
    int R=min(n,Size*id);
    int l=R,r=R-1;
    ans=0;
    memset(vis,0,sizeof(vis));
    memset(Max,0,sizeof(Max));
    top=0;
    while (pos[q[i].l]==id){
        if (pos[q[i].l]==pos[q[i].r]){
            Ans[q[i].id]=BruteForce(q[i].l,q[i].r);
            i++;
            continue;
        }
        f=false;
        while (r<q[i].r) Add(a[++r]);
        int temp=ans;
        f=true;
        while (l>q[i].l) Add(a[--l]);
        Ans[q[i].id]=ans;
        while (l<R) vis[a[l++]]--;
        Undo();
        ans=temp;
        i++;
    }
    return i;
}
int main(){
    n=read(),m=read();
    Size=(int)(n/sqrt(m));
    for (register int i=1;i<=n;++i){
        a[i]=min(n+1,read());
        pos[i]=(i-1)/Size+1;
    }
    for (register int i=1;i<=m;++i){
        q[i].l=read(),q[i].r=read(),q[i].id=i;
    }
    sort(q+1,q+1+m);
    int ptr=1;
    for (register int i=1;i<=pos[n];++i){
        ptr=MoQueue(ptr,i);
    }
    for (register int i=1;i<=m;++i){
        printf("%d\n",Ans[i]);
    }
}
```

8/11 upd

其实是我之前愚蠢了，其实不要用**只插入的莫队**，要用**只删除的莫队**

因为$mex$这个东西有很神奇的特性，你插入的时候不能$O(1)$得出$mex$，但是删除的时候，如果这个数的$cnt$被减至$0$，那么你的答案就和它取一个$\min$即可。

于是使用只删除的莫队，以左端点所在的块编号为第一关键字升序排列，以右端点为第二关键字**降序**排列，然后预处理出$L$到$q[i].r$的$cnt$ 数组（$q[i].r$ 是这一段右端点的最大值），每次删除即可。

代码和思维上面都比较好想。

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
int a[MAXN],pos[MAXN],n,m,Size;
static int Ans[MAXN];
struct Query{
    int l,r,id;
}q[MAXN];
inline bool operator < (const Query &A,const Query &B){
    return pos[A.l]==pos[B.l]?A.r>B.r:pos[A.l]<pos[B.l];
}
static int vis[MAXN],bf[MAXN];
inline int BruteForce(int l,int r){
    for (register int i=l;i<=r;++i){
        bf[a[i]]++;
    }
    int pos=-1;
    while (bf[++pos]);
    for (register int i=l;i<=r;++i){
        bf[a[i]]=0;
    }
    return pos;
}
inline int MoQueue(int i,int id){
    int L=(id-1)*Size+1,R=min(id*Size,n);
    memset(vis,0,sizeof(vis));
    for (register int j=L;j<=q[i].r;++j){
        vis[a[j]]++;
    }
    int r=q[i].r;
    int ans=-1;
    while (vis[++ans]);
    for (;pos[q[i].l]==id;++i){
        if (pos[q[i].l]==pos[q[i].r]){
            Ans[q[i].id]=BruteForce(q[i].l,q[i].r);
            continue;
        }
        for (register int j=r;j>q[i].r;--j){
            if (--vis[a[j]]==0) ans=min(ans,a[j]);
        }
        r=q[i].r;
        int temp=ans;
        for (register int j=L;j<q[i].l;++j){
            if (--vis[a[j]]==0) ans=min(ans,a[j]);
        }
        Ans[q[i].id]=ans;
        for (register int j=L;j<q[i].l;++j){
            ++vis[a[j]];
        }
        ans=temp;
    }
    return i;
}
int main(){
    n=read(),m=read();
    Size=(int)(n/sqrt(m));
    for (register int i=1;i<=n;++i){
        a[i]=min(n+1,read());
        pos[i]=(i-1)/Size+1;
    }
    for (register int i=1;i<=m;++i){
        q[i].l=read(),q[i].r=read(),q[i].id=i;
    }
    sort(q+1,q+1+m);
    int ptr=1;
    for (register int i=1;i<=pos[n];++i){
        ptr=MoQueue(ptr,i);
    }
    for (register int i=1;i<=m;++i){
        printf("%d\n",Ans[i]);
    }
}
```