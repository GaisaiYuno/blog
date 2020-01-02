---
title: CF61E Enemy is weak
tags:
  - 题解
  - 树状数组
abbrlink: f80f0f91
date: 2019-10-26 12:45:00
---

水！

离散化之后树状数组随便乱搞就行了。

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
using namespace std;
inline int read(){
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9'){
        if (ch=='-') f=-1;
        ch=getchar();
    }
    while (ch>='0'&&ch<='9'){
        x=(x<<1)+(x<<3)+(ch^'0');
        ch=getchar();
    }
    return x*f;
}
int n,q;
struct BIT{
    long long C[MAXN];
    #define lowbit(i) (i&(-i))
    inline void Add(int pos,int val){
        for (register int i=pos;i<=n;i+=lowbit(i)) C[i]+=val;
    }
    inline long long Ask(int pos){
        long long ans=0;
        for (register int i=pos;i;i-=lowbit(i)) ans+=C[i];
        return ans;
    }
	inline long long Query(int l,int r){
		return Ask(r)-Ask(l-1);
	}
}b1,b2;
int a[MAXN],b[MAXN];
inline void discrete(){
	for (register int i=1;i<=n;++i){
		b[i]=a[i];
	}
	sort(b+1,b+1+n);
	for (register int i=1;i<=n;++i){
		a[i]=lower_bound(b+1,b+1+n,a[i])-b;
	}
}
int main(){
	n=read();
	for (register int i=1;i<=n;++i) a[i]=read();
	discrete();
	for (register int i=3;i<=n;++i){
		b2.Add(a[i],1);
	}
	b1.Add(a[1],1);
	long long ans=0;
	for (register int i=2;i<=n-1;++i){
		ans+=b1.Query(a[i]+1,n)*b2.Query(1,a[i]);
		b1.Add(a[i],1);
		b2.Add(a[i+1],-1);
	}
	printf("%lld\n",ans);
}
```

