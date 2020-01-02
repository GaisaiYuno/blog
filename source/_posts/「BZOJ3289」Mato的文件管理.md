---
title: 「BZOJ3289」Mato的文件管理
abbrlink: 13dd710
date: 2019-08-05 17:48:39
tags:
  - 题解
  - 莫队
  - 树状数组
---

[BZOJ](https://www.lydsy.com/JudgeOnline/problem.php?id=3289)

[GDOI](http://119.29.55.79/problem/358)

一句话题意：给你$l,r$，求$a[l],a[l+1]...a[r]$逆序对个数。

按照套路，我们先离散化。

然后考虑加入一个数会对逆序对做出多少贡献，先考虑我们从左边加入一个数，如图：

![](/images/nxd.png)

显然，只有**严格**小于他的数才会对答案产生贡献。

再考虑在右边加入一个数，如图：

![](/images/nxd2.png)

显然，只有**严格**大于他的数才会对答案产生贡献。

删除也是类似的贡献法考虑。

---------------

所以，我们用树状数组维护即可。

```cpp
#include <bits/stdc++.h>
#define MAXN 50005
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
int a[MAXN],b[MAXN],n;
namespace BIT{
    int c[MAXN];
    #define lowbit(x) (x&-x)
    inline void Update(int pos,int val){
        for (register int i=pos;i<MAXN;i+=lowbit(i)){
            c[i]+=val;
        }
    }
    inline int GetSmaller(int pos){
        pos--;
        int ans=0;
        for (register int i=pos;i>0;i-=lowbit(i)){
            ans+=c[i];
        }
        return ans;
    }
    inline int GetBigger(int num){
        return GetSmaller(MAXN-1)-GetSmaller(num+1);
    }
}
using namespace BIT;
inline void discrete(){
    for (register int i=1;i<=n;++i){
        b[i]=a[i];
    }
    sort(b+1,b+1+n);
    for (register int i=1;i<=n;++i){
        a[i]=lower_bound(b+1,b+1+n,a[i])-b;
    }
}

int pos[MAXN];
struct Query{
    int l,r,id;
}q[MAXN];
inline bool operator < (const Query &a,const Query &b){
    return pos[a.l]<pos[b.l]||(pos[a.l]==pos[b.l]&&((pos[a.l]&1)?a.r<b.r:a.r>b.r));
}
int Ans[MAXN];
int main(){
    n=read();
    int Size=sqrt(n);
    for (register int i=1;i<=n;++i){
        a[i]=read();
        pos[i]=(i-1)/Size+1;
    }
    discrete();
    int m=read();
    for (register int i=1;i<=m;++i){
        q[i].l=read(),q[i].r=read(),q[i].id=i;
    }
    sort(q+1,q+1+m);
    int l=1,r=0,ans=0;
    for (register int i=1;i<=m;++i){
        while (l<q[i].l){
            Update(a[l],-1);
            ans-=GetSmaller(a[l++]);
        }
        while (l>q[i].l){
            Update(a[--l],1);
            ans+=GetSmaller(a[l]);
        }
        while (r<q[i].r){
            Update(a[++r],1);
            ans+=GetBigger(a[r]);
        }
        while (r>q[i].r){
            Update(a[r],-1);
            ans-=GetBigger(a[r--]);
        }
        Ans[q[i].id]=ans;
    }
    for (register int i=1;i<=m;++i){
        printf("%d\n",Ans[i]);
    }
}
```