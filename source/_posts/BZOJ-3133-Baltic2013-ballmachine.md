---
title: 'BZOJ 3133 [Baltic2013]ballmachine'
tags:
  - 堆
  - 贪心
  - 倍增
abbrlink: d32df71b
date: 2019-09-15 15:47:14
---

[传送门](https://www.lydsy.com/JudgeOnline/show.php?id=3133)

注意到题目条件`如果同时有多个点可以走，那么会选择编号最小的节点所在路径的方向。`

不妨考虑对树的节点进行一些安排，使得我们按照$dfs$顺序找到的第一个点就是球落到的点。

不要考虑编号最小的节点在的方向，而是考虑从一个点下落的时候，他会选择哪一条边，使得这条路径可以到达编号最小的点。

没错，假设现在的节点是$u$，它的子节点为$v$，它选择的路径就是子树最小值最小的$v$

于是，可以按照子树最小值的顺序对$u$的子节点$v$进行排序，这样就可以保证我们$dfs$到的第一个没有放球的点就是球下落到的位置，相当于对这棵树进行了重构。

```cpp
inline bool cmp1(const int &a,const int &b){
	return mino[a]<mino[b];
}
void Init(int u){
	mino[u]=u;
	for (register int i=0;i<G[u].size();++i){
		int v=G[u][i];
		Init(v);
		mino[u]=min(mino[u],mino[v]);
	}
	sort(G[u].begin(),G[u].end(),cmp1);
}
```

于是现在重构之后，发现现在按照$dfs$的顺序遍历整棵树，遍历到的顺序就是小球的掉入的顺序。

开始我们维护一个堆，维护的是放球的节点的编号，堆按照先序遍历的顺序排序。

对于插入$num$个小球，就是直接插入。

对于删除，也比较好办，注意到删除一个小球，影响的只是这一条链上面的所有球，于是可以倍增找到同一条链最上面的小球，并且删除，掉下来的小球数量就是他们深度之差。

但是，发现堆并不能$O(\log n)$删除，反向考虑，堆维护改成没有放球的节点的编号，此时堆按照**后序遍历**的顺序排序。

对于插入$num$个小球，就是直接$pop$出来堆顶元素。

对于删除，找到最上面的小球，直接插入即可。

代码：

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
#define LOG 25
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
int anc[LOG][MAXN],mino[MAXN],dfn[MAXN];
vector<int>G[MAXN];
inline void AddEdge(int u,int v){
	G[u].push_back(v);
}
inline bool cmp1(const int &a,const int &b){
	return mino[a]<mino[b];
}
struct cmp{bool operator()(const int &a,const int &b){return dfn[a]>dfn[b];}};
//后序遍历顺序
void Init(int u){
	mino[u]=u;
	for (register int i=0;i<G[u].size();++i){
		int v=G[u][i];
		Init(v);
		mino[u]=min(mino[u],mino[v]);
	}
	sort(G[u].begin(),G[u].end(),cmp1);
}
int cnt;
void dfs(int u,int father){
	anc[0][u]=father;
	for (register int i=1;i<LOG;++i) anc[i][u]=anc[i-1][anc[i-1][u]];
	for (register int i=0;i<G[u].size();++i){
		int v=G[u][i];
		dfs(v,u);
	}
	dfn[u]=++cnt;
}
int inq[MAXN];
int main(){
	int n=read(),q=read();
	for (register int i=1;i<=n;++i){
		int fa=read();
		AddEdge(fa,i);
	}
	Init(0);
	dfs(0,0);
	priority_queue<int,vector<int>,cmp> Q;
	for (register int i=1;i<=n;++i) Q.push(i),inq[i]=true;//Q维护没有放球的位置
	while (q--){
		int opr=read(),num=read();
		if (opr==1){
			int lst;
			while (num--){
				int u=Q.top();Q.pop();
				inq[lst=u]=false;
			}
			printf("%d\n",lst);//输出最后一个小球
		}
		else {
			int ans=0;
			for (register int i=LOG-1;i>=0;--i){
				if (anc[i][num]&&!inq[anc[i][num]]){
					ans|=(1<<i);//ans记录深度
					num=anc[i][num];
				}
			}
			inq[num]=true;
			Q.push(num);
			printf("%d\n",ans);
		}
	}
}
```

