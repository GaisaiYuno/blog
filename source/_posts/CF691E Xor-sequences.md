---
title: CF691E Xor-sequences 矩阵快速幂
  
tag:
  - 题解
  - 矩阵快速幂
abbrlink: 4fae5fc4
date: 2019-07-13 20:34:14
---
[传送门](https://www.luogu.org/problemnew/show/CF691E)
可以用矩阵快速幂解决
$k$很多，但是我们分析可以看出，$dp[k]=dp[k-1] * a$($dp[k]$和$a$都是矩阵)
($a[i][j]$即$a[i]$ xor $a[j]$中二进制$1$的个数模$3$是否等于$0$)
$dp[1]$是什么自己想一想
最后求$dp[k]$的元素之和即可

```cpp
#include <cstdio>
#include <iostream>
#include <cstring>
#define MOD 1000000007
#define MAXN 105
using namespace std;
long long n,k,ans;
//快读快写
inline long long read(){
	char ch;
	long long f=1,x=0;
	ch=getchar();
	while (ch>'9'||ch<'0'){
		if (ch=='-'){
			f=-1;
		}
		ch=getchar();
	}
	while (ch<='9'&&ch>='0'){
		x=x*10+ch-'0';
		ch=getchar();
	}
	return f*x;
}
inline void print(long long x){
	if (x<0) x=-x,putchar('-');
	if (x>9) print(x/10);
	putchar(x%10+'0');
}

struct binary{
	bool num[65];
	long long len;
	void clear(){
		memset(num,0,sizeof(num));
	}
	void convert(long long a){
		long long i=0;
		while (a>0){
			num[i++]=a&1;
			a>>=1;
		}
		len=i;
	}
	long long SumTrue(){
		long long sum=0;
		for (long long j=0;j<len;j++){
			sum+=num[j];
		}
		return sum;
	}
}a[MAXN];
binary operator ^ (const binary &a,const binary &b){
	binary c;
	long long maxlen=max(a.len,b.len);
	for (long long i=0;i<maxlen;i++){
		c.num[i]=a.num[i] xor b.num[i];
	}
	c.len=maxlen;
	return c;
}

struct matrix{
	long long v[MAXN][MAXN];
	void clear(){
		memset(v,0,sizeof(v));
	}
	void YPYlovesDYF(){
		for (long long i=0;i<n;i++){
			for (long long j=0;j<n;j++){
			    binary c=a[i]^a[j];
			    v[i][j]=(c.SumTrue()%3==0);
			}
		}
	}
};
matrix operator *(const matrix &a,const matrix &b){
	matrix ans;
	ans.clear();
	for (long long i=0;i<n;i++){
		for (long long j=0;j<n;j++){
			for (long long k=0;k<n;k++){
				ans.v[i][j]=(ans.v[i][j]+a.v[i][k]*b.v[k][j])%MOD;
			}
		}
	}
	return ans;
}

//矩阵快速幂
matrix ksm(matrix a,long long pows){
	matrix ans;
	ans.clear();
	for (long long i=0;i<n;i++){
	    ans.v[i][i]=1;
	}
	while (pows>0){
		if (pows&1){
			ans=ans*a;
		}
		a=a*a;
		pows>>=1;
	}
	return ans;
}
int main(){
	n=read();
	k=read();
	long long temp;
	for (long long i=0;i<n;i++){
		temp=read();
		a[i].clear();
		a[i].convert(temp);
	}
	matrix ans;
	ans.YPYlovesDYF();
	ans=ksm(ans,k-1);
	long long ret=0;
	for (long long i=0;i<n;i++){
	    for (long long j=0;j<n;j++){
	        ret=(ret+ans.v[i][j])%MOD;
	    }
	}
	print(ret);
	return 0;
}
```

发现自己太弱了,其实不用模拟二进制,用位运算来计算$1$的个数也可以

```cpp
int count(ll a)
{
    int ans = 0;
    while(a){
        if(a & 1) ans++;
        a >>= 1;
    }
    return ans;
}
```