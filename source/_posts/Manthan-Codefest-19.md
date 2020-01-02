---
title: 'Manthan, Codefest 19'
abbrlink: a3cbb677
date: 2019-08-27 20:01:41
tags:
---

[比赛传送门](http://codeforces.com/contest/1208)

## $Pro1$

[A. XORinacci](http://codeforces.com/contest/1208/problem/A)

定义：

$f(0)=a,f(1)=b,f(n)=f(n-1) \oplus f(n-2)$

给你$a,b$，求$f(n)$

## $Sol1$

找规律：

$f(0)=a,f(1)=b,f(2)=a  \oplus b,f(3)=b \oplus (a \oplus b)=a,f(4)=a \oplus (a \oplus b)=b .... $

于是发现以$3$个数为循环节：

## $Code1$

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
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
#undef int
int main(){
#define int long long
	int t=read();
	for (register int i=1;i<=t;++i){
		int a=read(),b=read(),n=read();
		printf("%I64d\n",(n%3==0?a:(n%3==1?b:a^b)));
	}
} 
```

## $Pro2$

[B. Uniqueness](http://codeforces.com/contest/1208/problem/B)

给你一个序列$a_1,a_2,...a_n$，你要选定一段连续的区间$[l,r]$并且删去，使得剩下的数互不相同。

求删去区间长度的最小值。

## $Sol2$

由于$n \le 2000$，所以$O(n^2)$的解法应该能轻松过。

考虑枚举左端点$l$，然后从$n$开始推$r$。

假设$[l,r]$是不合法的区间，那么$[l,r-1]$肯定不合法，于是只要枚举到一个不合法的$r$，就统计答案，退出循环。

还有一个$O(n)$的解法，观察到$l$往左推进，右端点的极左位置肯定是向右移动的，于是维护$l,r$两个指针，注意到两个指针最多移动$n$次，于是这个解法是$O(n)$的。

##  $Code2$

```cpp
//n^2解法
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
int a[MAXN],b[MAXN],n;
inline void discrete(){
	for (register int i=1;i<=n;++i) b[i]=a[i];
	sort(b+1,b+1+n);
	for (register int i=1;i<=n;++i) a[i]=lower_bound(b+1,b+1+n,a[i])-b;
}
int cnt[MAXN];
int main(){
	n=read();
	for (register int i=1;i<=n;++i){
		a[i]=read();
	}
	discrete();
	int ans=0x7fffffff;
	
	memset(cnt,0,sizeof(cnt));
	for (register int i=1;i<=n;++i){
		cnt[a[i]]++;
		if (cnt[a[i]]>1){
			break;
		}
		ans=min(ans,n-i);
	}
	
	memset(cnt,0,sizeof(cnt));
	for (register int i=n;i>=1;--i){//两种特判
		cnt[a[i]]++;
		if (cnt[a[i]]>1){
			break;
		}
		ans=min(ans,i-1);
	}
	
	for (register int i=1;i<=n;++i){
		memset(cnt,0,sizeof(cnt));
		for (register int j=1;j<=i;++j){
			cnt[a[j]]++;
			if (cnt[a[j]]>1) {//如果前半部分不合法，就退出
				printf("%d\n",ans==0x7fffffff?0:ans);
				return 0;
			}
		}
		for (register int j=n;j>=i+1;--j){
			cnt[a[j]]++;
			if (cnt[a[j]]>1) break;//退出
			ans=min(ans,j-i-1);
		}
	}
	printf("%d\n",ans);
}
```

## $Pro3$

[C. Magic Grid](http://codeforces.com/contest/1208/problem/C)

给你$0$到$n^2-1$的数，将他们填进$n \times n$的矩阵，满足每行和每列的异或和相等。

$n$是$4$的倍数。

## $Sol3$

考虑每$4 \times 4$个矩阵填数。

对于$4 \times t,4 \times t+1,4 \times t+2,4 \times t+3$四个数，都可以表示为$...00,...01,...10,...10$的形式，异或一下，全部都可以抵消。

对于$4 \times t,4 \times (t+1),4 \times (t+2),4 \times (t+3)$四个数，也是同样可以抵消。

## $Code3$

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
int ans[1005][1005];
int main(){
	int n=read();
	int p=n/4;
	int cnt=0;
	for (register int i=1;i<=p;++i){
		for (register int j=1;j<=p;++j){
			for (register int k=0;k<4;++k){
				for (register int l=0;l<4;++l){
					ans[(i-1)*4+k+1][(j-1)*4+l+1]=cnt++;
				}
			}
		}
	}
	for (register int i=1;i<=n;++i){
		for (register int j=1;j<=n;++j){
			printf("%d ",ans[i][j]);
		}
		printf("\n");
	}
}
```

## $Pro4$

[D. Restore Permutation](http://codeforces.com/contest/1208/problem/D)

给你一个数组$p_1,p_2,...p_n$，要你求数组$a_1,a_2,...a_n$

其中$\\{a\\}$是$1$到$n$的排列，数组$p$的生成方式为$p_i=\sum _{j=1}^i a[j] (a[j]\le a[i])$

## $Sol4$

考虑逆推，即从$a_n$推到$a_1$

维护一个树状数组，一开始的值为$1,2,...n$。

对于$a_i$，在树状数组上面二分，找到使得前缀和$\le p_i$的最大位置$pos$

把$a_i$设成$pos$，然后将树状数组上面把位置$pos$设成$0$即可。

## $Code4$

```cpp
#include <bits/stdc++.h>
#define MAXN 1000005
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
namespace BIT{
	int C[MAXN];
	#define lowbit(i) (i&(-i))
	inline void Add(int x,int val){
		for (register int i=x;i<MAXN;i+=lowbit(i)){
			C[i]+=val;
		}
	}
	inline int Query(int x){
		int ans=0;
		for (register int i=x;i>0;i-=lowbit(i)){
			ans+=C[i];
		}
		return ans;
	}
};
using namespace BIT;
int a[MAXN],n;
inline int BinSearch(int pos){
	int l=0,r=MAXN-1,ans;
	while (l<r-1){
		int mid=(l+r)>>1;
		if (Query(mid)<=a[pos]) l=mid;
		else r=mid;
	}
	return r;
}
int ans[MAXN];
#undef int
int main(){
#define int long long
	n=read();
	for (register int i=1;i<=n;++i) a[i]=read();
	for (register int i=1;i<=n;++i){
		Add(i,i);
	}
	for (register int i=n;i>=1;--i){
		int pos=BinSearch(i);
		Add(pos,-pos);
		ans[i]=pos;
	}
	for (register int i=1;i<=n;++i){
		printf("%I64d ",ans[i]);
	}
}
```

