---
title: CF25E Test 字符串哈希
  
tag:
  - 题解
  - 字符串哈希
abbrlink: c161ca58
date: 2019-07-13 20:34:14
---

[传送门](https://www.luogu.org/problemnew/show/CF25E)

做法：**字符串哈希**

不过似乎$\rm kmp$也能做
分类讨论两字符串$A B$合并的情况：
1.$B$为$A$的子串 - 直接枚举$B$在$A$中的位置，哈希判断即可
2.$A$为$B$的子串 - 这里由于偷懒，就没写，在暴力枚举时枚举多一些情况
3.$A B$有相同长度的前缀和后缀 - 枚举前缀后缀长度，哈希判断
4.$A B$没有相同的前缀和后缀 - 直接将字符串相加
可以看出，字符串减少的长度$1=2>3>4$
于是优先判断$1$、$2$ 然后才是$3$、$4$
最后暴力枚举，记录答案

还有一个神坑：**$s1,s2$合并，长度可能超过$100000$，所以数组要开$200005$**

代码：

```cpp
#include <bits/stdc++.h>
#define Base 131
#define MAXN 200005
#define LL long long
#define ll long long
#define mem(a) memset(a,0,sizeof(a))
#define memmax(a) memset(a,0x3f,sizeof(a))
#define ull unsigned long long
using namespace std;
ull p[MAXN];;
ull h1[MAXN],h2[MAXN];
inline void Init_Hash(string A,ull *h){//哈希预处理
	h[0]=(A[0]-'a');
	for (register int i=1;i<(int)A.size();++i){
		h[i]=h[i-1]*Base+(ull)(A[i]-'a');
	}
}
inline ull Hash(int l,int r,ull *h){
	//利用unsigned long long 自然溢出来哈希
	if (l==0) return h[r];//这个特判很重要
	return h[r]-h[l-1]*p[r-l+1];
}
inline string connect(string A,string B){
	//将字符串合并的函数
	Init_Hash(A,h1),Init_Hash(B,h2);
	if (B.size()<=A.size()){
		//B为A的字串,一定更优 
		ull HashB=Hash(0,B.size()-1,h2);
		for (register int i=0;i<(int)A.size()-(int)B.size()+1;++i){
			if (Hash(i,i+(int)B.size()-1,h1)==HashB){
				return A;
			}
		}
	}
	int Size=min(A.size(),B.size());
	for (register int i=Size-1;i>=1;--i){//枚举相同字串长度 
		if (Hash((int)A.size()-i,(int)A.size()-1,h1)==Hash(0,i-1,h2)){
			string ans=A;
			for (register int j=i;j<(int)B.size();++j){
				ans+=B[j];
			}
			return ans;
		}
	}
	return A+B;//AB没有相同的前缀和后缀
}
inline void Init_P(){//预处理Base^n
	p[0]=1;
	for (register int i=1;i<MAXN;++i){
		p[i]=p[i-1]*Base;
	}
}
int main(){
	Init_P();
	string s1,s2,s3;
	cin>>s1>>s2>>s3;
    
	int ans=0x7fffffff;
	
	ans=min(ans,(int)connect(s1,connect(s2,s3)).size());
	ans=min(ans,(int)connect(s1,connect(s3,s2)).size());
	ans=min(ans,(int)connect(s2,connect(s1,s3)).size());
	ans=min(ans,(int)connect(s2,connect(s3,s1)).size());
	ans=min(ans,(int)connect(s3,connect(s1,s2)).size());
	ans=min(ans,(int)connect(s3,connect(s2,s1)).size());
	
	ans=min(ans,(int)connect(connect(s2,s3),s1).size());
	ans=min(ans,(int)connect(connect(s3,s2),s1).size());
	ans=min(ans,(int)connect(connect(s1,s3),s2).size());
	ans=min(ans,(int)connect(connect(s3,s1),s2).size());
	ans=min(ans,(int)connect(connect(s1,s2),s3).size());
	ans=min(ans,(int)connect(connect(s2,s1),s3).size());
    
	//暴力枚举12种情况（太暴力了）
    
	printf("%d\n",ans);
}
```
然后你就可以成功地水一道黑题了