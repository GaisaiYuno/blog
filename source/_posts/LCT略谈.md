---
title: LCT略谈
tags:
  - LCT
  - Splay
  - 数据结构
abbrlink: 6662a2c8
date: 2019-12-22 12:21:01
---

## 定义

我们来看LCT的定义是什么。

LCT用Splay维护树的剖分，一棵树被剖分成为虚边和实边。

其中每个点必须连着一条实边，也就是说，如果我们把实边和与实边相连的节点提出来，树里面不会剩下任何节点。

![](https://i.loli.net/2019/12/22/lBLRE2v4qSrF1JU.png)

实边和实边相连的节点组成的联通块，被称为实链，我觉得实链这个说法实在不是很准确，因为实链的点深度是严格依次加1的，所以下图不是LCT。

![](https://i.loli.net/2019/12/22/1qPBpbFX2kRhzAc.png)

可以想到将节点深度从小到大地维护一个Splay，这个Splay的中序遍历即是按照深度排列的节点。

比如ABCD四个点组成的Splay长成这个样子：

![](https://i.loli.net/2019/12/22/ncryVjJeKqwuDOQ.png)

首先，一个最重要的结论是，认父不认子：

![无标题.png](https://i.loli.net/2019/12/22/pbCKVWoPZRBhtaX.png)

比如我们这里画箭头表示认父亲/孩子，对于一个节点，它只认和它有实链相连的节点作为孩子。但是所有节点除了根节点都有一个父亲，Splay里面的节点有父亲，每条实链的根节点认树上的父亲作为根节点。

## 操作

下面谈一下操作：

### Splay操作

来自yyb。

![20170826173033579.png](https://i.loli.net/2019/12/22/QA2luXP1pDtBW6v.png)

```cpp
#define ch(i,p) tree[i].ch[p]
#define fa(i) tree[i].fa
bool is_root(int x){
	//返回是不是那几条重链的根，如果他的父亲不认它，它就是根
	return !(ch(fa(x),0)==x||ch(fa(x),1)==x);
}
bool which(int x){
	//返回x是他的父亲的那个子树
	//0是左子树
	//1是右子树
	return ch(fa(x),1)==x;
}
void pushup(int x){
	tree[x].sz=tree[ch(x,0)].sz+1+tree[ch(x,1)].sz;
}
void reverse(int x){
	if (!x) return ;
	swap(ch(x,0),ch(x,1));
	tree[x].rev^=1;
}
void pushdown(int x){
	if (tree[x].rev){
		reverse(ch(x,0));
		reverse(ch(x,1));
		tree[x].rev=0;
	}
}
void pushdown_all(int x){
	//pushdown整条链
	//递归是为了防止前面的节点先pushdown影响下面的结构
	if (!is_root(x)) pushdown_all(fa(x));
	pushdown(x);
}
void Rotate(int x){
	int y=fa(x),z=fa(y);
	int k=which(x),w=ch(x,k^1);
	//代表x是y的哪一个子树
	//w是图中画的B子树
	ch(y,k)=w,fa(w)=y;//把B接到y上
	if (!is_root(y)) ch(z,which(y))=x;//接到z的下面原来y的位置
	fa(x)=z;ch(x,k^1)=y;fa(y)=x;
	//1.把x接在z的下面，维护他的父亲节点
	//2.把原来子树B的位置接上y
	pushup(y);pushup(x);//先pushup y因为在下面
}
void Splay(int x){
	pushdown_all(x);
	while (!is_root(x)){
		Rotate(x);
	}
	pushup(x);
}
```

相信Splay操作没什么好说的，这里写的是单旋。

如果不知道Splay是什么，你可以把它理解为把$x$节点旋转到这棵Splay的根的一种操作。

### Access操作

可以理解为打通$x$到根节点的实链的一种操作。

```cpp
void Access(int x){
	for (int y=0;x;y=x,x=fa(x)){
		Splay(x);
		ch(x,1)=y;
		pushup(x);
	}
}
```

$y$位于下一条实链的顶部，$x$位于上一条实链的中间某个节点。

Splay(x)之后，因为$x$位于底部，是最后一个，所以$x$右子树是那条实链下面的部分。

所以我们可以把$y$接在$x$的右子树上（可以理解为抢来一个实链），还要pushup维护信息。

**注意：Access操作并不会形成一个以x为根节点的Splay，如果需要，请你再Splay一次**

### MakeRoot操作

 ```cpp
void MakeRoot(int x){
	Access(x);
	Splay(x);
	reverse(x);
}
 ```

Access(x)，Splay(x)之后，我们得到的是一棵根节点为$x$，只有左子树的一棵Splay，这棵Splay中序遍历最靠前的就是$root$，最靠后的是$x$。（考虑一下他们的深度关系）

如果我们reverse(x)，即把$x$左右翻转，$x$就会跑到$root$的位置，$root$就会跑到$x$的位置。（也可以看成将中序遍历翻转）

这样我们就可以将$x$作为根。

### Split操作

```cpp
void Split(int x,int y){
	MakeRoot(x);
	Access(y);
	Splay(y);
}
```

Split操作可以看成打通一条从$x$到$y$的实链，其中实链的Splay根节点是$y$。

这个操作比较简单，不多说了。

### Link操作

```cpp
void Link(int x,int y){//保证x,y不在一个连通块里面
	MakeRoot(x);
	fa(x)=y;
}
```

最关键的Link操作，也是最简单的，将$x$作为$x$所在子树的根后，只要往$y$连一条父亲边即可。

### Cut操作

```cpp
void Cut(int x,int y){//保证有这条边
	Split(x,y);
	ch(y,0)=fa(x)=0;
	pushup(y);
}
```

Cut操作稍微复杂，我们先Split(x,y)，分成了下图这样的一条实链。

![show.png](https://i.loli.net/2019/12/22/ZqrDn3bWBtvQx2C.png)

接下来我们需要断掉这条边。然后维护$y$的子树大小即可。

### FindRoot操作

```cpp
int FindRoot(int x){
	Access(x);
	Splay(x);
	while (ch(x,0)){
		pushdown(x);
		x=ch(x,0);
	}
	Splay(x);
	return x;
}
```

我们Access(x)，Splay(x)，形成了一棵以$x$为根节点的树。

接下来我们要找在中序遍历序列里面最前的一个节点，即根节点，因为树高是$\log n$的，我们可以暴力跳。

接下来还要再Splay一下，以防被卡。

