---
title: CF145E Lucky Queries 线段树
  
tag:
  - 题解
  - 线段树
abbrlink: 2af40d72
date: 2019-07-13 20:34:14
---

[传送门](https://www.luogu.org/problemnew/show/CF145E)

# 题解
一看数据范围就知道是线段树
不过怎样区间翻转是一个问题
这里的思想非常巧妙
**记录最长不上升子序列的长度**
在区间翻转的时候,交换最长不上升子序列的长度和最长不下降子序列的长度即可.
还有合并区间时需要用到一点$\rm dp$的思想
代码有点丑神犇勿喷
$code$:

```cpp
#include <iostream>
#include <cstdio>
#define MAXN 1000005
#define ll int
using namespace std;
struct node{
    int sheng,jiang,seven,four;
    bool lazy;
}tree[MAXN*4];
int max(int a,int b){
    return a>b?a:b;
}
int n,m;
void swap(int &a,int &b){
    int t=a;
    a=b;
    b=t;
}
char str[MAXN];
void push_up(int i){
    tree[i].seven=tree[i<<1].seven+tree[i<<1|1].seven;
    tree[i].four=tree[i<<1].four+tree[i<<1|1].four;
    int max1=max(tree[i<<1].sheng+tree[i<<1|1].seven,tree[i<<1].four+tree[i<<1|1].sheng);
    tree[i].sheng=max(max1,tree[i<<1].four+tree[i<<1|1].seven);
    //可能前面不下降,后面全7
    //可能前面全4,后面不下降
    //可能前面全4,后面全7
    int max2=max(tree[i<<1].jiang+tree[i<<1|1].four,tree[i<<1].seven+tree[i<<1|1].jiang);
    tree[i].jiang=max(max2,tree[i<<1].seven+tree[i<<1|1].four);
    //同理
}
void buildtree(int l,int r,int i){
    if (l==r){
        tree[i].sheng=1;
        tree[i].jiang=1;
        tree[i].seven=(str[l]=='7');
        tree[i].four=!tree[i].seven;
        return ;
    }
    int mid=(l+r)>>1;
    buildtree(l,mid,i<<1);
    buildtree(mid+1,r,i<<1|1);
    push_up(i);
}
void rev(int i){
    tree[i].lazy=!tree[i].lazy;
    swap(tree[i].four,tree[i].seven);
    swap(tree[i].jiang,tree[i].sheng);
    //区间翻转需要swap一下
}
void update(int l,int r,int L,int R,int i){
    if (r<L||l>R){
        return ;
    }
    if (r<=R&&l>=L){
        rev(i);
        return ;
    }
    if (tree[i].lazy){
        tree[i].lazy=false;
        rev(i<<1);
        rev(i<<1|1);
    }
	int mid=(l+r)>>1;
	if (mid>=r){
		update(l,mid,L,R,i<<1);
	}
    else if (l>mid){
    	update(mid+1,r,L,R,i<<1|1);
	}
	else {
		update(l,mid,L,R,i<<1);
		update(mid+1,r,L,R,i<<1|1);
	}
    push_up(i);
}
int main(){
    scanf("%d%d%s",&n,&m,str+1);
    buildtree(1,n,1);
    int ans;
    for (int t=0;t<m;t++){
        char ch[100];
        scanf("%s",ch);
        if (ch[0]=='c'){
            printf("%d\n",tree[1].sheng);
        }
        else {
            int l,r;
            scanf("%d%d",&l,&r);
            update(1,n,l,r,1);
        }
    }
}
```