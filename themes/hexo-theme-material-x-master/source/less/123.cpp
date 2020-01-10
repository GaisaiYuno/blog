#include <bits/stdc++.h>
#define MAXN 200005
#define MAXM 100005
#define ull unsigned long long
#define int long long
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
int pos[MAXN];
int Size,n;
namespace BIT{
    ull C[MAXN];
    #define lowbit(i) (i&(-i))
    inline void Add(int pos,int val){
        for (int i=pos;i<MAXN;i+=lowbit(i)) C[i]+=val;
    }
    inline ull Ask(int pos){
        ull ans=0;
        for (int i=pos;i;i-=lowbit(i)) ans+=C[i];
        return ans;
    }
    inline void AddInterval(int l,int r,int val){
    	Add(l,val);
    	Add(r+1,-val);
	}
	inline ull QueryPoint(int p){
		return Ask(p);
	}
}
using namespace BIT;
//namespace FK{
//	ull val[MAXN],sum[MAXM];
//	int qry(int p){
//		int id=pos[p],lb=(id-1)*Size+1;
//		int ans=0;
//		for (int i=lb;i<=p;++i) ans+=val[i];
//		for (int i=1;i<=id-1;++i) ans+=sum[i]; 
//		return ans;
//	}
//	void upd(int index,int delta){
//		val[index]+=delta;
//		sum[pos[index]]+=delta;
//	}
//	void Update(int l,int r){
//		upd(l,1),upd(r+1,-1);
//	}
//}
//using namespace FK;
int a[MAXN];
int L[MAXN],R[MAXN];
int top1;
int stk_p[MAXN],stk_x[MAXN],stk_t1[MAXN];
int top2;
int stk_l[MAXN],stk_r[MAXN],stk_t2[MAXN];
struct Query{
	int p,f,id,tim;
}Q[MAXN];
int topq;
bool operator < (Query A,Query B){
	return A.p<B.p;
}
int pre[MAXN];//前缀和
int ans[MAXN],vis[MAXN];
#undef int
int main(){
#define int long long
	// freopen("FNCS4.in","r",stdin);
	// freopen("FNCS4.ans","w",stdout);
	n=read();
	Size=sqrt(n);
	for (int i=1;i<=n;++i){
		a[i]=read(),pre[i]=pre[i-1]+a[i];
		pos[i]=(i-1)/Size+1;
	}
	for (int i=1;i<=n;++i){
		L[i]=read(),R[i]=read();
	}
	int q=read();
	for (int t=1;t<=q;++t){
		int opr=read();
		if (opr==1){
			int p=read(),x=read();
			++top1;
			stk_p[top1]=p,stk_x[top1]=x;
			stk_t1[top1]=t;
		}
		else if (opr==2){
			int l=read(),r=read();
			++top2;
			stk_l[top2]=l,stk_r[top2]=r;
			stk_t2[top2]=t;
		}
		if (t%Size==0||t==q){
			for (int i=1;i<=n;++i) C[i]=0;
			topq=0;
			for (int i=1;i<=top2;++i){
				if (stk_l[i]!=1) Q[++topq]=Query{stk_l[i]-1,-1,i,stk_t2[i]};
				Q[++topq]=Query{stk_r[i],1,i,stk_t2[i]};
			}
			sort(Q+1,Q+1+topq);
			int ptr=0,now=0;
			for (int i=1;i<=top2;++i) ans[i]=0;
			for (int i=1;i<=topq;++i){
				while (ptr<=n&&ptr<Q[i].p){
					ptr++;
					AddInterval(L[ptr],R[ptr],1);
					now+=pre[R[ptr]]-pre[L[ptr]-1];
				}
				int temp=now;
				for (int j=1;j<=top1&&stk_t1[j]<Q[i].tim;++j){
					int delta=0;
					if (!vis[stk_p[j]]) delta=stk_x[j]-a[stk_p[j]];//如果有重复覆盖就臭了
					else delta=stk_x[j]-vis[stk_p[j]];
					vis[stk_p[j]]=stk_x[j];
					temp+=QueryPoint(stk_p[j])*delta;
				}
				for (int j=1;j<=top1&&stk_t1[j]<Q[i].tim;++j){
					vis[stk_p[j]]=0;
				}
				ans[Q[i].id]+=Q[i].f*temp;
			}
			for (int i=1;i<=top2;++i){
				printf("%lld\n",ans[i]);
			}
			for (int i=1;i<=top1;++i) a[stk_p[i]]=stk_x[i];
			for (int i=1;i<=n;++i) pre[i]=pre[i-1]+a[i];
			top1=top2=0;
		}
	}
}
/*
5
1 2 3 4 5
1 3
2 5
4 5
3 5
1 2
10
2 1 4
1 3 7
2 1 4
2 3 5
2 1 4
1 3 7
2 1 4
2 3 5
2 1 4
1 3 7
*/