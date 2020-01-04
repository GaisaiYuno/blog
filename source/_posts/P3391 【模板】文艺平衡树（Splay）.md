---
title: P3391 【模板】文艺平衡树（Splay）
  
tag:
  - 题解
  - 模板
  - Splay
  - 平衡树
abbrlink: '174583e7'
date: 2019-07-13 19:46:14
---

平衡树模板题

Splay写法：

```cpp
// luogu-judger-enable-o2
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
int fa[MAXN],ch[MAXN][2],size[MAXN],tag[MAXN];
#define lc(i) ch[i][0]
#define rc(i) ch[i][1]
inline void pushup(int i){
    size[i]=size[lc(i)]+size[rc(i)]+1;
}
inline void pushdown(int i){
    if (tag[i]){
        tag[i]^=1;
        tag[lc(i)]^=1,tag[rc(i)]^=1;
        swap(lc(i),rc(i));
    }
}
inline void rotate(int x,int &k){
    int y=fa[x],z=fa[y];
    bool p=(lc(y)==x);
    if (y==k) k=x;
    else {
        if (lc(z)==y) lc(z)=x;
        else rc(z)=x;
    }
    ch[y][!p]=ch[x][p];
    fa[ch[y][!p]]=y,ch[x][p]=y;
    fa[y]=x,fa[x]=z;
    pushup(x),pushup(y);
}
inline void splay(int x,int &k){
    while (x!=k){
        int y=fa[x],z=fa[y];
        if (y!=k){
            if ((lc(y)==x)^(lc(z)==y)) rotate(x,k);
            else rotate(y,k);
        }
        rotate(x,k);
    }
}
void build(int l,int r,int f){
    if (l>r) return ;
    int mid=(l+r)>>1;
    if (mid<f) lc(f)=mid;
    else rc(f)=mid;
    fa[mid]=f;size[mid]=1;
    if (l==r) return ;
    build(l,mid-1,mid),build(mid+1,r,mid);
    pushup(mid);
}
int Find(int x,int k){
    pushdown(x);
    if (k==size[lc(x)]+1) return x;
    else if (k<=size[lc(x)]) return Find(lc(x),k);
    else return Find(rc(x),k-size[lc(x)]-1);
}
int root;
void Update(int l,int r){
    int x=Find(root,l),y=Find(root,r+2);
    splay(x,root),splay(y,rc(x));
    tag[lc(y)]^=1;
}
int main(){
    int n=read(),m=read();
    root=(n+3)/2,build(1,n+2,root);
    for (register int i=1;i<=m;++i){
        int l=read(),r=read();
        Update(l,r);
    }
    for (register int i=2;i<=n+1;++i){
        printf("%d ",Find(root,i)-1);
    }
}
```

FHQ Treap写法：

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
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
namespace FHQTreap{
    struct node{
        int l,r;
        int pri,val,sz;
        bool tag;
    }tree[MAXN];
    #define lc(i) tree[i].l
    #define rc(i) tree[i].r
    inline void pushup(int i){
        tree[i].sz=tree[lc(i)].sz+tree[rc(i)].sz+1;
    }
    inline void pushdown(int i){
        if (tree[i].tag){
            swap(lc(i),rc(i));
            tree[lc(i)].tag^=1;
            tree[rc(i)].tag^=1;
            tree[i].tag=false;
        }
    }
    void Split(int i,int k,int &x,int &y){
        pushdown(i);
        if (i==0) return x=y=0,void();
        if (tree[lc(i)].sz>=k){
            y=i;
            Split(lc(i),k,x,lc(y));
            pushup(y);
        }
        else {
            x=i;
            Split(rc(i),k-tree[lc(i)].sz-1,rc(x),y);
            pushup(x);
        }
    }
    int Merge(int x,int y){
        if (!x||!y) return x+y;
        pushdown(x),pushdown(y);
        if (tree[x].pri>tree[y].pri){
            lc(y)=Merge(x,lc(y));
            pushup(y);
            return y;
        }
        else {
            rc(x)=Merge(rc(x),y);
            pushup(x);
            return x;
        }
    }
    int root,tot;
    inline void Reverse(int l,int r){
        int x,y,z;
        Split(root,l-1,x,y);
        Split(y,r-l+1,y,z);
        tree[y].tag^=1;
        root=Merge(x,Merge(y,z));
    }
    void Print(int i){
        if (!i) return ;
        pushdown(i);
        Print(lc(i));
        printf("%d ",tree[i].val);
        Print(rc(i));
    }
    int New(int val){
        tree[++tot].sz=1;
        tree[tot].pri=rand();
        tree[tot].val=val;
        tree[tot].l=tree[tot].r=tree[tot].tag=0;
        return tot;
    }
}
using namespace FHQTreap;
int main(){
    int n=read(),m=read();
    for (register int i=1;i<=n;++i) root=Merge(root,New(i));
    for (register int i=1;i<=m;++i){
        int l=read(),r=read();
        Reverse(l,r);
    }
    Print(root);
}
```

