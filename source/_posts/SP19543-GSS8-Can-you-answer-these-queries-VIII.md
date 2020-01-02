---
title: SP19543 GSS8 - Can you answer these queries VIII
tags:
  - 题解
  - FHQ Treap
  - 平衡树
  - 毒瘤
abbrlink: 3ef91b62
date: 2019-07-27 21:17:01
---

[传送门](https://www.luogu.org/problem/SP19543)

洛谷上面翻译有毒，一是没有数据范围，其实$n \le 200000$，二是没有样例，这里粘贴一组$\rm SPOJ$样例，和自己的对拍数据。

$\rm SPOJ$样例

```
input:
4
1 2 3 5
7
Q 0 2 0
I 3 4
Q 2 4 1
D 0
Q 0 3 1
R 1 2
Q 0 1 0
output:
6
26
40
4
```

我的对拍数据

```
input
20
1574452022 549188900 68567242 1729321800 30592296 1234967064 1540591694 1298547924 1791505596 347980114 142536772 369008392 492229442 883499152 569859698 1891123126 1765828398 540013562 1182847552 1727333276 
20
R 0 378520004
I 0 1564716480
D 1
R 0 1349444400
R 0 1758121648
I 0 1716182608
Q 1 1 1
R 1 2068268798
I 1 727687312
I 2 1307033320
Q 1 2 1
I 3 54907522
Q 1 3 7
R 3 1157040456
I 1 379786942
Q 2 3 1
I 1 1497285546
D 4
Q 3 4 2
D 4
output:
1758121648
3341753952
347894054
3341753952
1060881840
```

附送数据生成器（注意生成器要记录一个$cur$代表当前数组的长度，否则删除操作容易搞错）：

```cpp
#include <bits/stdc++.h>
#define ui unsigned int
using namespace std;
inline int read(){
    int x=0,f=1;
    char ch=getchar();
    while (ch<'0'||ch>'9'){
        if (ch=='-') f=-1;
        ch=getchar();
    }
    while (ch>='0'&&ch<='9'){
        x=(x*10)+(ch-'0');
        ch=getchar();
    }
    return x*f;
}

const char op[4]={'I','D','R','Q'};
inline ui Randui(){
    return (((rand()<<(ui)15)|(rand()))<<1)|(rand()%2);
}
int cur;
int main(){
    srand(time(NULL));
    freopen("gss8.in","w",stdout);
    int n=20;
    printf("%d\n",n);
    for (register int i=1;i<=n;++i){
        printf("%u ",Randui());
    }
    printf("\n");
    int q=20;
    printf("%d\n",q);
    for (register int i=1;i<=q;++i){
        int opr=rand()%4;
        while (cur==0&&opr==1) opr=rand()%4;
        putchar(op[opr]);
        putchar(' ');
        if (opr==0){
            printf("%d %u\n",cur==0?0:rand()%cur+1,Randui());
            cur++;
        }
        else if (opr==1){
            printf("%d\n",cur==0?0:rand()%cur+1);
            cur--;
        }
        else if (opr==2){
            printf("%d %u\n",cur==0?0:rand()%cur+1,Randui());
        }
        else {
            int l=(cur==0?0:rand()%cur+1);
            int r=(cur==0?0:rand()%cur+1);
            if (l>r) swap(l,r);
            printf("%d %d %d\n",l,r,rand()%11);
        }
    }
}
```

-----------------

好了步入正题。

第一步，看见插入和删除操作，立马要条件反射地想到平衡树，这里使用$\rm FHQ Treap$实现。

第二步，发现$\rm I,D,R$操作都比较好实现，唯独$\rm Q$比较烦人，又发现$0 \le k \le 10$，就有了思路。

考虑在每个节点上维护一个数组$ans$，其中$ans[k]=\sum_{i=l}^r A[i] \times (i-l+1)^k$

考虑如何维护$ans$

我们推一推式子：

设整个区间左右端点为$[l,r]$，中间的根节点为$m$，也就是说，根节点代表$[m,m]$，左子树代表$[l,m-1]$，右子树代表$[m+1,r]$，对于所有的$k$，我们要知道所有的$\sum _{i=l}^r{A[i] \times (i-l+1)^k}$

大力拆式子，首先，对于前面的部分$\sum_{i=l}^{m-1}A[i] \times (i-l+1)^k$，它其实就是左子树代表的和，直接相加。

（程序里的$i$其实是上面的$k$）

```cpp
tree[x].ans[i]=tree[lc(x)].ans[i];//左半部分
```

接下来的过程中，我们设$s=m-l+1$

别忘了中间还要一个根节点，就是$A[m] \times (m-l+1)^k$，即$A[m] \times s^k$

```cpp
tree[x].ans[i]+=tree[x].val*(ui)Pow[s][i];//中间
```

最后烦人的是右子树，发现剩下还没消掉的和还有$\sum _{i=m+1}^r A[i] \times (i-l+1)^k$，

我们慢慢来，先拆成这个样子：$\sum _{i=m+1}^r A[i] \times ((m-l+1)+(i-m))^k$

于是右边的式子可以用二项式定理展开：![](/images/gif.gif)

考虑把那个$A[i]$提到里面去，则有：![](/images/gif2.gif)

注意到$A[i]$$(i-m)^{k-j}$其实就是右子树代表的和，所以直接相乘即可。

```cpp
for (register int j=0;j<=i;++j){//右半部分
     tree[x].ans[i]+=tree[rc(x)].ans[j]*Pow[s][i-j]*C[i][j];
}
```

注意题目要$\mod 2^{32}$，我们采用$\text {unsigned int}$自然溢出来取模。

输出$\text {unsigned int}$我们使用$\text{printf("%u")}$

```cpp
#include <bits/stdc++.h>
#define MAXN 200005
#define MAXK 12
#define ui unsigned int //因为题目%2^32所以可以用unsigned int自动取模
using namespace std;
inline int readi() {
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
inline ui readu(){
    ui x=0;
    char ch=getchar();
    while (ch<'0'||ch>'9'){
        ch=getchar();
    }
    while (ch>='0'&&ch<='9'){
        x=(x*(ui)(10))+(ui)(ch-'0');
        ch=getchar();
    }
    return x;
}
ui C[MAXK][MAXK],Pow[MAXN][MAXK];
//pow[i][j] i^j
inline void Init(){
    for (register int i=0;i<MAXK;++i){
        C[i][0]=C[i][i]=1;
        for (register int j=1;j<i;++j){
            C[i][j]=C[i-1][j]+C[i-1][j-1];
        }
    }
    for (register int i=1;i<MAXN;++i){
        Pow[i][0]=1;
        for (register int j=1;j<MAXK;++j){
            Pow[i][j]=Pow[i][j-1]*i;
        }
    }
}
namespace FHQ_Treap{
    struct node{
        int l,r;
        int pri;
        int sz;
        ui val;
        ui ans[MAXK];//ans[i]表示sigma l<=i<=r A[i]*(i-l+1)^k
    }tree[MAXN];
    int tot;
    #define lc(i) tree[i].l
    #define rc(i) tree[i].r
    //注意fhq treap和线段树不同：根节点不会算
    inline void Update(int x){
        tree[x].sz=tree[lc(x)].sz+tree[rc(x)].sz+1;
        const int s=tree[lc(x)].sz+1;
        for (register int i=0;i<MAXK;++i){
            tree[x].ans[i]=tree[lc(x)].ans[i];//左半部分
            tree[x].ans[i]+=tree[x].val*(ui)Pow[s][i];//中间
            for (register int j=0;j<=i;++j){//右半部分
                tree[x].ans[i]+=tree[rc(x)].ans[j]*(ui)Pow[s][i-j]*(ui)C[i][j];
            }
        }
    }
    inline int New(ui v){
        tree[++tot].val=v;
        tree[tot].pri=rand();
        tree[tot].sz=1;
        for (register int i=0;i<MAXK;++i){
            tree[tot].ans[i]=v;
        }
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
    inline void Add(int pos,ui num){//在pos插入num
        Split(root,pos,x,y);
        root=Merge(Merge(x,New(num)),y);
    }
    inline void Del(int pos){//删除pos处元素
        Split(root,pos,x,y);
        Split(y,1,y,z);
        root=Merge(x,z);
    }
};
using namespace FHQ_Treap;
inline char gc(){
    char ch=getchar();
    while (ch!='I'&&ch!='D'&&ch!='R'&&ch!='Q') ch=getchar();
    return ch;
}
signed main(){
    Init();
    srand(time(NULL));
    int n=readi();
    for (register int i=1;i<=n;++i){
        root=Merge(root,New(readu()));
    }
    int q=readi();
    while (q--){
        char opr=gc();
        if (opr=='I'){
            int pos=readi();
            ui val=readu();
            Add(pos,val);
        }
        else if (opr=='D'){
            int pos=readi();
            Del(pos);
        }
        else if (opr=='R'){
            int pos=readi();ui val=readu();
            Del(pos),Add(pos,val);
        }
        else {
            int l=readi(),r=readi(),k=readi();
            Split(root,r+1,x,z);
            Split(x,l,x,y);
            printf("%u\n",tree[y].ans[k]);
            root=Merge(Merge(x,y),z);
        }
    }
}
```

然后你就把$\text{GSS}$系列最难的一道题切掉了。