---
title: CF1006F Xor-Paths 双向搜索
  
tag:
  - 题解
  - 搜索
  - 双向搜索
abbrlink: '65461872'
date: 2019-07-13 20:34:14
---
[传送门](https://www.luogu.org/problemnew/show/CF1006F)

# 题解

双向搜索，$Map[x][y][n]$表示搜索到$(x,y)$异或和为n有多少种方法。
还要利用异或的性质：

```
(a^b)^b=a
```
记得开long long
```cpp
#include <bits/stdc++.h>
#include <hash_map>
#define MAXN 25
#define int long long
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
#define inside(x,y) 1<=x&&x<=n&&1<=y&&y<=m
unordered_map<int,int>Map[MAXN][MAXN];
int G[MAXN][MAXN],n,m,k;
void dfs1(int x,int y,int Sum){
	if (x+y==n+1){Map[x][y][Sum]++;return ;}//必定经过对角线 
	if (inside(x+1,y)) dfs1(x+1,y,Sum^G[x+1][y]);
	if (inside(x,y+1)) dfs1(x,y+1,Sum^G[x][y+1]);
}
int ans;
void dfs2(int x,int y,int Sum){
    if (x+y==n+1){
    	ans+=Map[x][y][Sum^k^G[x][y]];//G[x][y]重复算了一遍 
    	return ;
    }
    if (inside(x-1,y)) dfs2(x-1,y,Sum^G[x-1][y]);
    if (inside(x,y-1)) dfs2(x,y-1,Sum^G[x][y-1]);
}
#undef int
int main(){
#define int long long
	n=read(),m=read(),k=read();
	for (register int i=1;i<=n;++i){
		for (register int j=1;j<=m;++j){
			G[i][j]=read();
		}
	}
	dfs1(1,1,G[1][1]);
	dfs2(n,m,G[n][m]);
	printf("%lld\n",ans);
	return 0;
}
```
