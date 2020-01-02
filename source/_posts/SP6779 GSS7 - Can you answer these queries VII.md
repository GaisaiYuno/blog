---
title: SP6779 GSS7 - Can you answer these queries VII 树链剖分
  
tag:
  - 题解
  - 线段树
  - 树链剖分
  - GSS
abbrlink: 373d1617
date: 2019-07-13 20:34:14
---
建议先做[SP1043 GSS1 - Can you answer these queries I](https://www.luogu.org/problemnew/show/SP1043)
[传送门](https://www.luogu.org/problemnew/show/SP6779)
树链剖分模板题
尽管如此，这道题还是孙了我甚久。
坑点：
在查询的时候，因为两条树链$L,R$是左右对称的，所以不能直接将两条树链合并计算，
而是先翻转$L$或$R$，再合并计算。

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
    while (ch<='9'&&ch>='0'){
        x=(x<<3)+(x<<1)+ch-'0';
        ch=getchar();
    }
    return x*f;
}
void swap(int &a,int &b){
    int temp=a;a=b;b=temp;
}
vector<int>G[MAXN];
inline void AddEdge(int u,int v){
    G[u].push_back(v);
    G[v].push_back(u);
}
int a[MAXN],size[MAXN],fa[MAXN],dep[MAXN],top[MAXN],id[MAXN],Bigson[MAXN];
int cnt;
void dfs(int u,int father){
    size[u]=1;
    dep[u]=dep[father]+1;
    fa[u]=father;
    for (int i=0;i<(int)G[u].size();i++){
        if (G[u][i]!=father){
            dfs(G[u][i],u);
            size[u]+=size[G[u][i]];
            if (size[G[u][i]]>size[Bigson[u]]){
                Bigson[u]=G[u][i];
            }
        }
    }
}
int seq[MAXN];
void dfs2(int u,int Top){
    top[u]=Top;id[u]=++cnt;
    seq[cnt]=u;
    if (!Bigson[u]) return ;
    dfs2(Bigson[u],Top);
    for (int i=0;i<(int)G[u].size();i++){
        if (G[u][i]!=fa[u]&&G[u][i]!=Bigson[u]){
            dfs2(G[u][i],G[u][i]);
        }
    }
}
int n;
//可以直接把GSS1的模板拿过来用
namespace SegmentTree{
    struct node{
        int lmax,rmax,maxn;
        //从左端开始最大值，从右端开始最大值，整段最大值
        int val;//这段的和
        int tag,flag;
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    node empty_node(){
        node temp;
        temp.lmax=temp.rmax=temp.maxn=temp.val=0;
        return temp;
    }
    node operator + (node A,node B){
        node temp;
        temp.lmax=max(B.lmax+A.val,A.lmax);
        temp.rmax=max(A.rmax+B.val,B.rmax);
        temp.maxn=max(max(A.maxn,B.maxn),A.rmax+B.lmax);
        temp.val=A.val+B.val;
        temp.tag=temp.flag=0;
        return temp;
    }
    inline void change(int i,int val,int l,int r){
		tree[i].val=(r-l+1)*val;
        tree[i].lmax=tree[i].rmax=tree[i].maxn=max(0,tree[i].val);
		tree[i].tag=val,tree[i].flag=1;
    }
    void pushdown(int i,int l,int r){
        if (tree[i].flag){
			int mid=(l+r)>>1;
            change(lc,tree[i].tag,l,mid);
			change(rc,tree[i].tag,mid+1,r);
            tree[i].tag=tree[i].flag=0;
        }
    }
    void Build(int l,int r,int i){
        if (l==r){
            tree[i].val=a[seq[l]];
            tree[i].lmax=tree[i].rmax=tree[i].maxn=max(tree[i].val,0);//注意可以为空
            tree[i].flag=0;
            return ;
        }
        int mid=(l+r)>>1;
        Build(l,mid,lc);
        Build(mid+1,r,rc);
        tree[i]=tree[lc]+tree[rc];
    }
    node _Query(int l,int r,int L,int R,int i){
        if (L<=l&&r<=R){
            return tree[i];
        }
        pushdown(i,l,r);
        int mid=(l+r)>>1;
		node ans1=empty_node(),ans2=empty_node();
		if (L<=mid) ans1=_Query(l,mid,L,R,lc);
		if (mid<R) ans2=_Query(mid+1,r,L,R,rc);
		return ans1+ans2;
    }
    node Query(int L,int R){
        return _Query(1,n,L,R,1);
    }
    void _Update(int l,int r,int L,int R,int i,int val){
        if (L<=l&&r<=R){
            change(i,val,l,r);
            return ;
        }
        pushdown(i,l,r);
        int mid=(l+r)>>1;
		if (L<=mid) _Update(l,mid,L,R,lc,val);
		if (mid<R) _Update(mid+1,r,L,R,rc,val);
        tree[i]=tree[lc]+tree[rc];
    }
    void Update(int L,int R,int val){
        _Update(1,n,L,R,1,val);
    }
};
using namespace SegmentTree;
inline void Update_Tree(int u,int v,int val){
	int fu=top[u],fv=top[v];
    while (fu!=fv){
        if (dep[fu]<dep[fv]) swap(u,v),swap(fu,fv);
        Update(id[fu],id[u],val);
        u=fa[fu];fu=top[u];
    }
    if (dep[u]>dep[v]) swap(u,v);
    Update(id[u],id[v],val);
}
inline node Query_Tree(int u,int v){
    node L=empty_node(),R=empty_node();
    //L为左半边,R为右半边，因为L,R对称所以要分别计算
    int fu=top[u],fv=top[v];
	while (fu!=fv){
        if (dep[fu]<dep[fv]){
            R=Query(id[fv],id[v])+R;
			v=fa[fv],fv=top[v];
        }
        else {
            L=Query(id[fu],id[u])+L;
			u=fa[fu],fu=top[u];
        }
    }
    if (dep[u]>dep[v]){
        L=Query(id[v],id[u])+L;
    }
    else {
        R=Query(id[u],id[v])+R;
    }
    swap(L.lmax,L.rmax);//翻转L
    return L+R;
}
int main(){
    n=read();
    for (register int i=1;i<=n;++i){
        a[i]=read();
    }
    for (register int i=1;i<n;++i){
		int u=read(),v=read();
        AddEdge(u,v);
    }
    dfs(1,0);dfs2(1,1);
    Build(1,n,1);
    int q=read();
    while (q--){
        int opr=read(),l=read(),r=read();
        if (opr==1){
            printf("%d\n",Query_Tree(l,r).maxn);
        }
        else {
            int val=read();
            Update_Tree(l,r,val);
        }
    }
}```