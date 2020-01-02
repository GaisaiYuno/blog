---
title: CF405D Toy Sum 随机化
  
tag:
  - 题解
  - 随机化
abbrlink: '82e66741'
date: 2019-07-13 20:34:14
---

[传送门](https://www.luogu.org/problemnew/show/CF405D)

模拟赛的$\rm T1$，感觉还是非常可做的。

考虑随机化（大雾），每次把没有用过的数组成的序列$S$打乱，从$S$依次取出数，加入答案集合，我们可以根据加进来的数得出最后一个数的大小，如果这个数还没有用过，那么将这个数加入答案集合，就得出了答案，直接退出。

目前这种做法还没有被卡掉，大概是数据水吧。。。

时间复杂度$O(玄学)$

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
#define ll long long
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
inline void print(ll x){
    if (x>=10ll) print(x/10ll);
    putchar(x%10ll+48ll);
}
ll num[MAXN],vis[MAXN],vis2[MAXN],tot;
int main(){
    ll S=1000000,n=(long long)read();
    ll sum=0;
    for (register int i=1;i<=n;++i){
        ll x=(long long)read();
        vis2[x]=true;
        sum+=x-1;
    }
    for (register int i=1;i<=S;++i){
    	if (!vis2[i]) num[++tot]=i;
    }
    if (S>=sum){//特判
        if (!vis2[S-sum]){
            printf("%lld\n%lld\n",1ll,S-sum);
            return 0;
        }
    }
    for (register int t=1;t<=2000000;++t){
        random_shuffle(num+1,num+1+tot);
        memcpy(vis,vis2,sizeof(vis));
        ll res=0;
        for (register int i=1;i<tot;++i){
            res+=(S-num[i]);
            vis[num[i]]=true;
            if (res>=sum){
                break;
            }
            if (sum-res>S){
                continue;
            }
            if (!vis[S-sum+res]){//没有用过
                print((long long)i+1ll),putchar('\n');
                for (register int j=1;j<=i;++j){
                    print(num[j]),putchar(' ');
                }
                print(S-sum+res),putchar('\n');
                return 0;
            }
        }
    }
}


```

