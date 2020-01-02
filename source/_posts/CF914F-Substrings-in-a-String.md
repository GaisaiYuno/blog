---
title: CF914F Substrings in a String
abbrlink: 289007d3
date: 2019-07-21 20:05:08
tags:
  - 题解
  - bitset
  - 乱搞

---

[传送门](https://www.luogu.org/problemnew/show/CF914F)

$bitset$的神奇用法，乍眼一看好像是$KMP$，发现每次都要预处理$next$数组，时间复杂度爆了。

考虑$bitset$（玄学），我们记录这样一个$bitset$  $ a[i][j]$，其中$a[i][j]=1$时，$s[j]$-'a'$=i$

大概把字符串$abcabcabc$能转换成这样一个东西：

| a    | 1    | 0    | 0    | 1    | 0    | 0    | 1    | 0    | 0    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| b    | 0    | 1    | 0    | 0    | 1    | 0    | 0    | 1    | 0    |
| c    | 0    | 0    | 1    | 0    | 0    | 1    | 0    | 0    | 1    |

修改非常简单，只要把原来的$1$变成$0$，再把新加进的变成$1$

考虑如何查询，假设我们查询的是$abc$，我们把$a,b,c$挪到同一列（用位移操作即可完成），如下：

| a    | 1    | 0    | 0    | 1    | 0    | 0    | 1    | 0    | 0    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| b    | 1    | 0    | 0    | 1    | 0    | 0    | 1    | 0    | 0    |
| c    | 1    | 0    | 0    | 1    | 0    | 0    | 1    | 0    | 0    |

用$ans$去和每一列做$and$运算，操作完之后，$ans$大概长成这个样子：

| ans  | 1    | 0    | 0    | 1    | 0    | 0    | 1    | 0    | 0    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
|      |      |      |      |      |      |      |      |      |      |

发现只有在$i$位后面出现$abc$字符串，$ans[i]$才为$1$。

于是我们发现答案为$\sum_{i=l}^{r-len+1} ans[i]$（$len$为查询的字符串的长度），前缀和相减即可。

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
#define MAXM 27
using namespace std;
bitset<MAXN>B[MAXM];
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
inline char gc(){
    char ch=getchar();
    while (ch<'a'||ch>'z') ch=getchar();
    return ch;
}
int main(){
    char ch[MAXN];
    scanf("%s",ch);
    int n=strlen(ch);
    for (register int i=1;i<=n;++i){
        B[ch[i-1]-'a'][i]=1;
    }
    int q=read();
    while (q--){
        int opr=read();
        if (opr==1){
            int i=read();
            char c=gc();
            B[ch[i-1]-'a'][i]=0;
            ch[i-1]=c;
            B[ch[i-1]-'a'][i]=1;
        }
        else {
            int l=read(),r=read();
            char y[MAXN];
            scanf("%s",y);
            int len=strlen(y);
            bitset<MAXN>ans;
            ans.set();//set是全部变成1
            for (register int i=0;i<len;++i){
                ans&=(B[y[i]-'a']>>i);
            }
            printf("%d\n",max(0,(int)(ans>>l).count()-(int)(ans>>(r-len+2)).count()));
        }
    }
}
```

听说正解是分块+$SAM$，害怕