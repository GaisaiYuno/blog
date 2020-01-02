---
title: SP4487 GSS6 - Can you answer these queries VI 平衡树
  
tag:
  - 题解
  - 平衡树
  - GSS
abbrlink: 6442638e
date: 2019-07-13 20:34:14
---
建议先做[SP1043 GSS1 - Can you answer these queries I](https://www.luogu.org/problemnew/show/SP1043)
[传送门](https://www.luogu.org/problemnew/show/SP4487)
我们可以用$FHQ Treap$做这道题。
首先，$FHQ Treap$最重要的是Merge和Split操作，Split按照权值split
但是这道题插入删除修改时，要按照分出序列前$k$个值，是不是没法做？
没关系，我们采用类似于FindKth的方法split，即**按照节点的子树大小split**
就可以方便地分出序列前$k$个值了

然后其他的就没有别的什么特别的了。在提取区间时只需要split一下$r$，然后split一下$l-1$，分成的三棵子树中中间的那棵子树就是维护$l ~ r$的节点的子树了。
还有tree[0].maxn要初始化，这一点非常孙

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
        int sum;
        int lmax,rmax;
        int maxn;
    }tree[MAXN];
    int tot;
    #define lc(i) tree[i].l
    #define rc(i) tree[i].r
    //注意fhq treap和线段树不同：根节点不会算
    inline void Update(int x){
        tree[x].sz=tree[lc(x)].sz+tree[rc(x)].sz+1;
        tree[x].sum=tree[lc(x)].sum+tree[rc(x)].sum+tree[x].val;
        tree[x].lmax=max(tree[lc(x)].lmax,tree[lc(x)].sum+tree[x].val+tree[rc(x)].lmax);
        tree[x].rmax=max(tree[rc(x)].rmax,tree[lc(x)].rmax+tree[x].val+tree[rc(x)].sum);
        tree[x].maxn=max(max(tree[lc(x)].maxn,tree[rc(x)].maxn),tree[lc(x)].rmax+tree[x].val+tree[rc(x)].lmax);
    }
    inline int New(int v){
        tree[++tot].val=v;
        tree[tot].pri=rand();
        tree[tot].sz=1;
        tree[tot].maxn=tree[tot].sum=v;
        tree[tot].lmax=tree[tot].rmax=max(v,0);
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
    //这是按照权值split的方法
    /*
    void SplitByVal(int i,int k,int &x,int &y){
        if (!i){//叶节点
            x=y=0;
        }
        else {
            if (tree[i].val<=k){x=i,SplitByVal(rc(i),k,rc(i),y);}
            else{y=i,SplitByVal(lc(i),k,x,lc(i));}
            Update(i);
        }
    } */
    void Split(int i,int k,int &x,int &y){
    //按照排名split，就可以方便地在数组k位置插入val(妙啊)
        if (!i) {
            x=y=0;
        }
        else {
            if (tree[lc(i)].sz>=k) {y=i,Split(lc(i),k,x,lc(i));}//在左子树
            else {x=i,Split(rc(i),k-tree[lc(i)].sz-1,rc(i),y);}//在右子树
            Update(i);
        }
    }
    //以上为FHQ Treap
    int root,x,y,z;
    void Init(){
        tot=0,root=0;
        memset(tree,0,sizeof(tree));
        srand(19260817);
    }
    inline void Add(int pos,int num){//在pos插入num
        Split(root,pos,x,y);
        root=Merge(Merge(x,New(num)),y);
    }
    inline void Del(int pos){//删除pos处元素
        Split(root,pos,x,z);
        Split(x,pos-1,x,y);
        y=Merge(lc(y),rc(y));
        root=Merge(Merge(x,y),z);
    }
};
using namespace FHQ_Treap;
inline char gc(){
    char ch=getchar();
    while (ch!='I'&&ch!='D'&&ch!='R'&&ch!='Q') ch=getchar();
    return ch;
}
int main(){
    Init();
    int n=read();
    for (register int i=1;i<=n;++i){
        int x=read();
        root=Merge(root,New(x));
    }
    tree[0].maxn=-0x7fffffff;//Very Important
    int q=read();
    while (q--){
        char opr=gc();
        if (opr=='I'){
            int p=read(),x=read();
            Add(p-1,x);
        }
        else if (opr=='D'){
            int p=read();
            Del(p);
        }
        else if (opr=='R'){
            int p=read(),x=read();
            Del(p),Add(p-1,x);
        }
        else {
            int l=read(),r=read();
            //舍弃r右子树 舍弃l左子树
            Split(root,r,x,z);
            Split(x,l-1,x,y);
            printf("%d\n",tree[y].maxn);
            root=Merge(Merge(x,y),z);
        }
    }
}
```