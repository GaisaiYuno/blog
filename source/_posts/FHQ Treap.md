---
title: FHQ Treap模板
  
tag:
  - 模板
  - 平衡树
abbrlink: 1ada9bb5
date: 2019-07-13 20:34:14
---
大概是对着网上的模板敲了一遍吧。。。
```cpp
#include <bits/stdc++.h>
#define MAXN 500005
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
namespace FHQ_Treap{
	struct node{
		int l,r;
		int val;//每个点的权值 
		int pri;//优先级（随机生成）
		int sz; 
	}tree[MAXN];
	int tot;
	#define lc(i) tree[i].l
	#define rc(i) tree[i].r
	inline void Update(int x){
		tree[x].sz=tree[lc(x)].sz+tree[rc(x)].sz+1;
	}
	inline int New(int v){
		tree[++tot].val=v;
		tree[tot].pri=rand();
		tree[tot].sz=1;
		return tot;
	}
	int Merge(int x,int y){
		if (!x||!y) return x+y;
		if (tree[x].pri<tree[y].pri){
			rc(x)=Merge(rc(x),y),Update(x);
			return x;
		}
		else {
			lc(y)=Merge(x,lc(y)),Update(y);
			return y;
		}
	}
	void Split(int i,int k,int &x,int &y){
		if (!i){//叶节点
			x=y=0;
		}
		else {
			if (tree[i].val<=k){x=i,Split(rc(i),k,rc(i),y);}
			else{y=i,Split(lc(i),k,x,lc(i));}
			Update(i);
		}
	}
	int kth(int i,int k){//排名为k
		while (true){
			if (k<=tree[lc(i)].sz){
				i=lc(i);
			}
			else if (k==tree[lc(i)].sz+1){
				return i;
			}
			else{
				k-=tree[lc(i)].sz+1;
				i=rc(i);
			}
		}
	}
    //以上为FHQ Treap
    int root,x,y,z;
    void Init(){
        tot=0;
        root=0;
        srand(time(NULL));
    }
    inline void Add(int num){
		Split(root,num,x,y);
		root=Merge(Merge(x,New(num)),y);
    }
    inline void Del(int num){
		Split(root,num,x,z);
		Split(x,num-1,x,y);
		y=Merge(lc(y),rc(y));
		root=Merge(Merge(x,y),z);
    }
    inline int Rank(int num){//获得num排名
        Split(root,num-1,x,y);
        int temp=tree[x].sz+1;
		root=Merge(x,y);
        return temp;
    }
	#define Get_K(rt,rk) tree[kth(rt,rk)].val
    inline int Kth(int k){//获得数组中第k大
		return Get_K(root,k);
    }
    inline int Pre(int num){
        Split(root,num-1,x,y);
		int temp=Get_K(x,tree[x].sz);
		root=Merge(x,y);
        return temp;
    }
    inline int Nex(int num){
        Split(root,num,x,y);
		int temp=Get_K(y,1);
		root=Merge(x,y);
        return temp;
    }
};
using namespace FHQ_Treap;
#define INF 0x3f3f3f3f
int main(){
    Init();
    int n=read();
    Add(INF),Add(-INF);
    
}

```
