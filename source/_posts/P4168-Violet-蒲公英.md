---
title: 'P4168 [Violet]蒲公英'
tags:
  - 题解
  - 分块
abbrlink: 5b95202e
date: 2019-08-09 15:59:57
---

[传送门](https://www.luogu.org/problem/P4168)

## $Pro$

求区间最小众数，强制在线。

## $Sol$

因为强制在线，所以不能用优美的莫队。

考虑分块。

预处理三个数组$p[i][j],pcnt[i][j],s[i][j]$，

$p[i][j]$代表第$i$块到第$j$块出现次数最多且次数最小的数，也就是最小众数，这个你暴力就可以求出来。

```cpp
inline void AddBlock(int lb,int rb){//暴♂力
    for (register int i=lb;i<=rb;++i){
        cnt[a[i]]++;
        if ((cnt[a[i]]>cnt[ans])||((cnt[a[i]]==cnt[ans])&&(a[i]<ans))){
            ans=a[i];
        }
    }
}
for (register int i=1;i<=id[n];++i){
    memset(cnt,0,sizeof(cnt));
    ans=0;
    for (register int j=i;j<=id[n];++j){
        AddBlock((j-1)*Size+1,min(j*Size,n));
        p[i][j]=ans;
        pcnt[i][j]=cnt[ans];
    }
}
```

$pcnt[i][j]$代表在$i$到$j$的块里面最小众数出现次数。

求$p[i][j]$的时候可以顺便求出$pcnt[i][j]$，时间复杂度$O(n \sqrt n)$

--------

$s[i][j]$代表前$i$个块中，离散化过的值$j$出现过多少次，是一个类似于前缀和的东西，这个也是暴力求，时间复杂度$O(n  \sqrt n)$

```cpp
for (register int i=1;i<=id[n];++i){
    int lb=(i-1)*Size+1,rb=min(i*Size,n);
    for (register int j=1;j<=n;++j){
        s[i][j]=s[i-1][j];
    }
    for (register int j=lb;j<=rb;++j){
        s[i][a[j]]++;
    }
}
```

--------

现在求出$p[i][j],pcnt[i][j],s[i][j]$，考虑如何求出众数。

众数只有两种可能：属于红色区域或者属于蓝色区域（废话）

![](/images/fk.png)

$1.$众数属于蓝色区域，那么我们不妨把蓝色区域的每个数都枚举一遍，然后通过暴力求出这个数在蓝色区域出现次数，通过$s[i][j]$求出红色区域里面这个数出现次数。

```cpp
for (register int i=l;i<=r;++i){
    cnt[a[i]]++;//蓝色区域里面贡献
    if (cnt[a[i]]==1) cnt[a[i]]+=s[rid-1][a[i]]-s[lid][a[i]];//红色区域里面贡献
    //注意判断是不是第一次出现
    if (cnt[a[i]]>cnt[ans]||((cnt[a[i]]==cnt[ans])&&(a[i]<ans))){
        ans=a[i];
    }
}
for (register int i=l;i<=rb;++i) cnt[a[i]]=0;
for (register int i=lb;i<=r;++i) cnt[a[i]]=0;
UpdateAns(l,rb,lid,rid),UpdateAns(lb,r,lid,rid);
```

$2.$众数属于红色区域，注意此时我们不用考虑蓝色区域，如果众数属于蓝色区域，那么它肯定在上面算到了。

所以直接调用预处理的结果即可。

现在我们得到两个答案，但是我们不知道第二个答案的出现次数是怎么样的，于是$pcnt$就派上用场了。

```cpp
if (pcnt[lid+1][rid-1]>cnt[ans]) return b[ans1];
else if (pcnt[lid+1][rid-1]==cnt[ans]&&ans1<ans) return b[ans1];
else return b[ans];
```

细节还是比较多的，注意多清零。

```cpp
#include <bits/stdc++.h>
#define MAXN 40005
#define MAXM 205
using namespace std;
void write(int x) {
	if(x>9)	write(x/10);
	putchar(x%10+'0');
}
inline void Print(int x){
    if (x==0){putchar('0');return ;}
    if (x<0) x=-x,putchar('-');
    write(x);
    putchar('\n');
}
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
int a[MAXN],id[MAXN],b[MAXN],Size,n,m;
int p[MAXM][MAXM];//预处理i到j块的最小众数
int pcnt[MAXM][MAXM];//i到j块的最小众数的出现次数
int s[MAXM][MAXN];//类似于前缀和
int cnt[MAXN],ans;
inline void AddBlock(int lb,int rb){//暴♂力
    for (register int i=lb;i<=rb;++i){
        cnt[a[i]]++;
        if ((cnt[a[i]]>cnt[ans])||((cnt[a[i]]==cnt[ans])&&(a[i]<ans))){
            ans=a[i];
        }
    }
}
inline void Init(){
    for (register int i=1;i<=id[n];++i){
        memset(cnt,0,sizeof(cnt));
        ans=0;
        for (register int j=i;j<=id[n];++j){
            AddBlock((j-1)*Size+1,min(j*Size,n));
            p[i][j]=ans;
            pcnt[i][j]=cnt[ans];
        }
    }
    for (register int i=1;i<=id[n];++i){
        int lb=(i-1)*Size+1,rb=min(i*Size,n);
        for (register int j=1;j<=n;++j){
            s[i][j]=s[i-1][j];
        }
        for (register int j=lb;j<=rb;++j){
            s[i][a[j]]++;
        }
    }
}
inline void discrete(){
    for (register int i=1;i<=n;++i){
        b[i]=a[i];
    }
    sort(b+1,b+1+n);
    int tot=unique(b+1,b+1+n)-b-1;
    for (register int i=1;i<=n;++i){
        a[i]=lower_bound(b+1,b+1+tot,a[i])-b;
    }
}
inline void UpdateAns(int l,int r,int lid,int rid){
    for (register int i=l;i<=r;++i){
        cnt[a[i]]++;
        if (cnt[a[i]]==1) cnt[a[i]]+=s[rid-1][a[i]]-s[lid][a[i]];//绿线里面
        //注意判断是不是第一次出现
        if (cnt[a[i]]>cnt[ans]||((cnt[a[i]]==cnt[ans])&&(a[i]<ans))){
            ans=a[i];
        }
    }
}
inline int Query(int l,int r){
    int lid=id[l],rid=id[r];
    if (lid==rid||lid+1==rid){//如果没有块相隔也会出锅
        ans=0;
        for (register int i=l;i<=r;++i) cnt[a[i]]=0;
        AddBlock(l,r);
        return b[ans];
    }
    int ans1=p[lid+1][rid-1];
    int rb=min(lid*Size,n),lb=(rid-1)*Size+1;
    ans=0;
    for (register int i=l;i<=rb;++i) cnt[a[i]]=0;
    for (register int i=lb;i<=r;++i) cnt[a[i]]=0;
    UpdateAns(l,rb,lid,rid),UpdateAns(lb,r,lid,rid);
    if (pcnt[lid+1][rid-1]>cnt[ans]) return b[ans1];
    else if (pcnt[lid+1][rid-1]==cnt[ans]&&ans1<ans) return b[ans1];
    else return b[ans];
}
int main(){
    n=read(),m=read();
    Size=(int)(sqrt(n));
    for (register int i=1;i<=n;++i){
        a[i]=read(),id[i]=(i-1)/Size+1;
    }
    discrete();
    Init();
    int x=0;
    while (m--){
        int l=(read()+x-1)%n+1,r=(read()+x-1)%n+1;
        if (l>r) swap(l,r);
        Print(x=Query(l,r));
    }
}
```