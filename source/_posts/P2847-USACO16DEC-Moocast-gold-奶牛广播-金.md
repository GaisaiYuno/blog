---
title: 'P2847 [USACO16DEC]Moocast(gold)奶牛广播-金'
abbrlink: cb6b515c
date: 2019-07-21 17:25:21
tags:
  - 题解
  - 并查集
  - 二分答案
---

[传送门](https://www.luogu.org/problemnew/show/P2847)

并查集+二分答案，假设现在二分到$mid$这个值，把距离小于$mid$的奶牛全部连边，看看最后是不是只剩一个集合。

```cpp
#include <bits/stdc++.h>
#define MAXN 10005
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
namespace BCJ{
    int fa[MAXN];
    inline void Init(){
        for (register int i=0;i<MAXN;++i){
            fa[i]=i;
        }
    }
    int Fa(int i){
        return fa[i]==i?i:fa[i]=Fa(fa[i]);
    }
    inline void Union(int i,int j){
        fa[Fa(i)]=Fa(j);
    }
};
using namespace BCJ;
int x[MAXN],y[MAXN];
inline int Dist(int i,int j){
    return (x[i]-x[j])*(x[i]-x[j])+(y[i]-y[j])*(y[i]-y[j]);
}
int n,k;
inline bool Check(int mid){
    Init();
    for (register int i=1;i<=n;++i){
        for (register int j=1;j<=n;++j){
            if (Dist(i,j)<=mid){
                Union(i,j);
            }
        }
    }
    int ans=0;
    for (register int i=1;i<=n;++i){
        if (fa[i]==i) ans++;
    }
    return ans==1;
}
int main(){
    Init();
    n=read();
    for (register int i=1;i<=n;++i){
        x[i]=read(),y[i]=read();
    }
    int l=0,r=0x7fffffff;
    while (l<=r){
        int mid=(l+r)/2.0;
        if (Check(mid)) r=mid-1;
        else l=mid+1;
    }
    printf("%d\n",l);
}
```

