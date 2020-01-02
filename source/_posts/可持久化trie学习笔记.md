---
title: 可持久化trie学习笔记
abbrlink: af85b329
date: 2019-10-03 14:11:40
tags:
  - trie
  - 可持久化
---

可持久化trie是一种和最大异或和关系非常紧密的算法。

## 例题1

给你一个数列$\\{a_i\\}$，每次询问给你$l,r,x$，要你计算$\max\\{ a[i]\oplus x\\}(i \in [l,r]) $

如何考虑？

从高位往低位贪心！

举个例子：

$a[i]:100,110,101,010$

$x=010$

首先，发现$a[i]$的第最高位必须是$1$，即使$a[i] \oplus x$最大的$a[i]$只可能是$100,110$中的一个。

再看第二位，如果第二位是$1$的话，$1\oplus1=0$，不是最大的，$a[i]$就确定为$100$。

于是我们可以设计出如下算法：

```cpp
procedure get_max(l,r,x){
    s={a[l],a[l+1],a[l+2]...a[r]};
    for (k in [log2(max(a[i])),1]){
        if (x第k位是1){
            if (s里面有数第k位是0) s=>s中所有第k位为0的数
            else s不变
        }
        else {
            if (s里面有数第k位是1) s=>s中所有第k位为1的数
            else s不变
		}
    }
}
```

发现此算法效率极慢，甚至比不上暴力。

如何优化？

发现一个重要的性质，每次操作之后，$s$中所有数的二进制表示中，$[\log_2(\max(a[i])),k]$的位上面都是一样的。

这让我们想到了trie树。

![](https://cdn.jsdelivr.net/gh/GaisaiYuno/imghost/20191003162144.png)

考虑用trie维护$s$，如何马上求出${a[l],a[l+1],a[l+2]...a[r]}$呢？

我们需要可持久化，实现时类似于主席树前缀和做差即可。

```cpp
Print(Query(31,rt[l-1],rt[r],x),'\n');
```

如何快速查询$s$中有没有二进制$k$位上面是$0/1$的数，只要查询这个子树的大小即可。

```cpp
int Query(int index,int l,int r,int x){
	if (index<0) return 0;
	bool pos=(x>>index)&1;
	int k=tree[ch(r,pos^1)].sz-tree[ch(l,pos^1)].sz;//子树大小
	if (k>0){//有pos^1子树，根据贪心，必须往那里去
		return Query(index-1,ch(l,pos^1),ch(r,pos^1),x)+(1<<index);
	}
	else {
		return Query(index-1,ch(l,pos),ch(r,pos),x);
	}
}
```

插入也非常简单：
```cpp
void Insert(int &i,int pre,int index,int x){
	tree[i=++tot].sz=tree[pre].sz;//新建节点
	if (index<0){
		tree[i].sz++;
		return ;
	}
	bool pos=(x>>index)&1;
	ch(i,pos^1)=ch(pre,pos^1);//继承子节点
	Insert(ch(i,pos),ch(pre,pos),index-1,x);//继续插入
	tree[i].sz=tree[ch(i,0)].sz+tree[ch(i,1)].sz;//更新子树大小
}
```

总的代码：

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
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
void print(int x){
	if (x>9) print(x/10);
	putchar('0'+x%10);
}
inline void Print(int x,char ch){
	if (x==0) return putchar('0'),void();
	if (x<0) x=-x,putchar('-');
	print(x);
	putchar(ch);
}
int rt[MAXN];
namespace Trie{
	struct node{
		int ch[2];
		int sz;
	}tree[MAXN<<5];
	#define ch(i,p) tree[i].ch[p]
	int tot;
	void Insert(int &i,int pre,int index,int x){
		tree[i=++tot].sz=tree[pre].sz;
		if (index<0){
			tree[i].sz++;
			return ;
		}
		bool pos=(x>>index)&1;
		ch(i,pos^1)=ch(pre,pos^1);
		Insert(ch(i,pos),ch(pre,pos),index-1,x);
		tree[i].sz=tree[ch(i,0)].sz+tree[ch(i,1)].sz;
	}
	int Query(int index,int l,int r,int x){
		if (index<0) return 0;
		bool pos=(x>>index)&1;
		int k=tree[ch(r,pos^1)].sz-tree[ch(l,pos^1)].sz;
		if (k>0){
			return Query(index-1,ch(l,pos^1),ch(r,pos^1),x)+(1<<index);
		}
		else {
			return Query(index-1,ch(l,pos),ch(r,pos),x);
		}
	}
}
using namespace Trie;
int a[MAXN];
int main(){
	int n=read(),m=read();
	for (register int i=1;i<=n;++i){
		a[i]=read();
	}
	for (register int i=1;i<=n;++i){
		Insert(rt[i],rt[i-1],31,a[i]);
	}
	for (register int i=1;i<=m;++i){
		int x=read(),l=read()+1,r=read()+1;
		Print(Query(31,rt[l-1],rt[r],x),'\n');
	}
}
```

## 例题2

[P4735 最大异或和](https://www.luogu.org/problem/P4735)

`A x`：添加操作，表示在序列末尾添加一个数$x$，序列的长度变为$N+1$。

`Q l r x`：询问操作，你需要找到一个位置$p$，满足$l \le p \le r$，使得： $a[p] \oplus a[p+1] \oplus ... \oplus a[N] \oplus x$最大，输出最大是多少。

令$sum[p]=a[1] \oplus a[2] \oplus ... \oplus a[p]$。

考虑转换$a[p] \oplus a[p+1] \oplus ... \oplus a[N]$为$sum[N] \oplus sum[p-1]$。

问题变为找到一个$sum[p-1],(l \le p \le r)$，使得$(sum[N] \oplus x) \oplus sum[p-1]$最大。

于是这个问题也可以可持久化trie解决。

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
		x=(x<<3)+(x<<1)+(ch^'0');
		ch=getchar();
	}
	return x*f;
}
void print(int x){
	if (x>9) print(x/10);
	putchar('0'+x%10);
}
inline void Print(int x,char ch){
	if (x==0) return putchar('0'),putchar(ch),void();
	if (x<0) x=-x,putchar('-');
	print(x);
	putchar(ch);
}
int rt[MAXN];
namespace Trie{
	struct node{
		int ch[2];
		int sz;
	}tree[MAXN<<5];
	#define ch(i,p) tree[i].ch[p]
	int tot;
	void Insert(int &i,int pre,int index,int x){
		tree[i=++tot].sz=tree[pre].sz;
		if (index<0){
			tree[i].sz++;
			return ;
		}
		bool pos=(x>>index)&1;
		ch(i,pos^1)=ch(pre,pos^1);
		Insert(ch(i,pos),ch(pre,pos),index-1,x);
		tree[i].sz=tree[ch(i,0)].sz+tree[ch(i,1)].sz;
	}
	int Query(int index,int l,int r,int x){
		if (index<0) return 0;
		bool pos=(x>>index)&1;
		int k=tree[ch(r,pos^1)].sz-tree[ch(l,pos^1)].sz;
		if (k>0) return Query(index-1,ch(l,pos^1),ch(r,pos^1),x)+(1<<index);
		else return Query(index-1,ch(l,pos),ch(r,pos),x);
	}
}
using namespace Trie;
inline char gc(){
	char ch=getchar();
	while (ch!='A'&&ch!='Q') ch=getchar();
	return ch;
}
int a[MAXN];
int main(){
	int n=read(),m=read();
	for (register int i=1;i<=n;++i){
		a[i]=read()^a[i-1];
	}
	for (register int i=1;i<=n;++i){
		Insert(rt[i],rt[i-1],31,a[i]);
	}
	for (register int i=1;i<=m;++i){
		char ch=gc();
		if (ch=='A'){
			int x=read();
			a[n+1]=x^a[n];
			Insert(rt[n+1],rt[n],31,a[n+1]);
			++n;
		}
		else {
			int l=read()-1,r=read()-1,x=read();
			if (l==0&&l==r) Print(a[n]^x,'\n');//特判qwq
			else {
				if (!l) Print(Query(31,0,rt[r],x^a[n]),'\n');//这里也要
				else Print(Query(31,rt[l-1],rt[r],x^a[n]),'\n');
			}
		}
	}
}
```

## 例题3

[P4098 [HEOI2013]ALO](https://www.luogu.org/problem/P4098)

枚举次小值$a[i]$，这题的重点是找到$minl,maxr$，使得$a[i]$是$[minl,maxr]$中的次小值。

这个可以使用set或者平衡树或主席树之类的实现，也可以用双向链表$O(n)$实现。

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
		x=(x<<3)+(x<<1)+(ch^'0');
		ch=getchar();
	}
	return x*f;
}
void print(int x){
	if (x>9) print(x/10);
	putchar('0'+x%10);
}
inline void Print(int x,char ch){
	if (x==0) return putchar('0'),putchar(ch),void();
	if (x<0) x=-x,putchar('-');
	print(x);
	putchar(ch);
}
int rt[MAXN];
namespace Trie{
	struct node{
		int ch[2];
		int sz;
	}tree[MAXN<<5];
	#define ch(i,p) tree[i].ch[p]
	int tot;
	void Insert(int &i,int pre,int index,int x){
		tree[i=++tot].sz=tree[pre].sz;
		if (index<0){
			tree[i].sz++;
			return ;
		}
		bool pos=(x>>index)&1;
		ch(i,pos^1)=ch(pre,pos^1);
		Insert(ch(i,pos),ch(pre,pos),index-1,x);
		tree[i].sz=tree[ch(i,0)].sz+tree[ch(i,1)].sz;
	}
	int Query(int index,int l,int r,int x){
		if (index<0) return 0;
		bool pos=(x>>index)&1;
		int k=tree[ch(r,pos^1)].sz-tree[ch(l,pos^1)].sz;
		if (k>0) return Query(index-1,ch(l,pos^1),ch(r,pos^1),x)+(1<<index);
		else return Query(index-1,ch(l,pos),ch(r,pos),x);
	}
}
using namespace Trie;
inline char gc(){
	char ch=getchar();
	while (ch!='A'&&ch!='Q') ch=getchar();
	return ch;
}
int a[MAXN],id[MAXN],pre[MAXN],nex[MAXN];
inline int cmp(int i,int j){
	return a[i]<a[j];
}
int L[MAXN],R[MAXN];
int main(){
	int n=read();
	for (register int i=1;i<=n;++i){
		a[i]=read(),pre[i]=i-1,nex[i]=i+1;
	}
	pre[0]=1,nex[n]=n;
	for (register int i=1;i<=n;++i){
		Insert(rt[i],rt[i-1],31,a[i]);
	}
	for (register int i=1;i<=n;++i){
		id[i]=i;
	}
	sort(id+1,id+1+n,cmp);
	for (register int i=1;i<=n;++i){
		nex[pre[id[i]]]=nex[id[i]];
		pre[nex[id[i]]]=pre[id[i]];
		L[id[i]]=pre[pre[id[i]]];
		R[id[i]]=nex[nex[id[i]]];
	}
	int ans=0;
	for (register int i=1;i<=n;++i){
		ans=max(ans,Query(31,rt[L[i]],rt[R[i]-1],a[i]));
	}
	printf("%d\n",ans);
}
```

