---
title: 'Codeforces Round #583 (Div. 1 + Div. 2, based on Olympiad of Metropolises)'
abbrlink: dfe225c
date: 2019-09-07 22:21:46
tags:
  - 比赛
---

[比赛传送门](https://codeforces.com/contest/1214)

## $Pro1$

[A. Optimal Currency Exchange](https://codeforces.com/contest/1214/problem/A)

## $Sol1$

根据贪心的原则，我们只用选择1元的欧元和5元的美元，注意到$d \le 100,e \le 100$，所以$O(n/e)$枚举即可。

## $Code1$

```cpp
#include <bits/stdc++.h>
#define MAXN 500005
#define int long long
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
using namespace std;
#undef int
int main(){
#define int long long
	int n=read();
	int d=read(),e=read()*5;
	int ans=0x7fffffff;
	for (register int i=0;i<=n/e;++i){
		ans=min(ans,(n-(i*e))%d);
	}
	printf("%I64d\n",ans);
}
```

## $Pro2$

[B. Badges](https://codeforces.com/contest/1214/problem/B)

## $Sol2$

这道题纯粹是在考英语吧，只要$i \le b$而且$n-i \le g$都是合法方案，于是枚举即可。

## $Code2$

```cpp
#include <bits/stdc++.h>
#define MAXN 500005
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
using namespace std;
int main(){
	int b=read(),g=read(),n=read();
	int ans=0;
	for (register int i=0;i<=n;++i){
		int x=i,y=n-i;
		if (x<=b&&y<=g){
			ans++;
		}
	}
	printf("%d\n",ans);
}
```

## $Pro3$

[C. Bad Sequence](https://codeforces.com/contest/1214/problem/C)

给你一个括号序列，你可以把一个括号移到括号序列的任意一个位置，问能不能是括号全部匹配。

## $Sol3$

我们有一个关于括号序列的结论，如果现在的字符是$"("$，那么把它入栈，如果现在的字符是$")"$，就把栈顶弹出，如果现在没有元素可以弹走，那么括号不匹配，如果这样扫一遍之后，都可以弹出，那么括号序列可以匹配。

转到此题，首先判断左右括号是否数量相同，发现我们有一次添加左括号的机会，于是记录没有元素可以弹走次数，如果$\geq 2$，那么输出$\rm No$，剩下输出$\rm Yes$

## $Code3$

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
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
using namespace std;
char ch[MAXN];
int main(){
	int n=read();
	scanf("%s",ch);
	int ans1=0,ans2=0;
	for (register int i=0;i<n;++i){
		if (ch[i]=='(') ans1++;
		else ans2++;
	}
	if (ans1!=ans2) return puts("No"),0;
	int cnt1=0,cnt2=0;
	int cnt=0;
	for (register int i=0;i<n;++i){
		if (ch[i]=='(') cnt1++;
		else{
			if (cnt1>0) cnt1--;
			else cnt++;
		}
	}
	if (cnt<=1) return puts("Yes"),0;
	else return puts("No"),0;
}
```

## $Pro4$

[D. Treasure Island](https://codeforces.com/contest/1214/problem/D)

给你一个地图，标有.的地方可以走，标有#的地方不能走，要你添加尽量少的#使得左上角不能走到右下角。

## $Sol4$

注意到只要把起点相邻的两个格子全部封住，就可以了，于是答案只能是0,1,2其中一个。

分情况讨论，如果答案是0，那么原来就不能从左下角走到右下角。

如果答案是1，说明从左下角走到右下角只有一条唯一的路径，怎么判断，我们先从起点dfs一次，把路径上面所以的点都标成#，然后再dfs一次，如果没有路径可以走，那么答案是1，如果还有路径可走，那么答案是$2$

## $Code4$

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
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
using namespace std;
char ch[MAXN];
vector<int>G[MAXN];
int n,m;
inline bool Inside(int x,int y){
	return x>=0&&x<n&&y>=0&&y<m;
}
vector<int>Mark[MAXN];
bool dfs(int x,int y){
	if (Mark[x][y]==1) return false;
	if (G[x][y]==1) return false;
	if (x==n-1&&y==m-1) return true;
	if (Inside(x+1,y)&&!G[x+1][y]){
		if (dfs(x+1,y)==true) return Mark[x+1][y]=true;
		Mark[x+1][y]=true;
	}
	if (Inside(x,y+1)&&!G[x][y+1]){
		if (dfs(x,y+1)==true) return Mark[x][y+1]=true;
		Mark[x][y+1]=true;
	}
	return false;
}
int main(){
	n=read(),m=read();
	for (register int i=0;i<n;++i){
		scanf("%s",ch);
		for (register int j=0;j<m;++j){
			G[i].push_back(ch[j]=='#');
		}
	}
	for (register int i=0;i<n;++i){
		Mark[i].resize(m);
	}
	int ans=dfs(0,0);
	if (ans==false) return puts("0"),0;
	for (register int i=0;i<n;++i){
		for (register int j=0;j<m;++j){
			if (Mark[i][j]) G[i][j]=true;
			Mark[i][j]=0;
		}
	}
	G[0][0]=false;
	G[n-1][m-1]=false;
	if (dfs(0,0)==false) return puts("1"),0;
	else return puts("2"),0;
}
```