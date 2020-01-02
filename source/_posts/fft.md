---
title: FFT入门
  
tag:
  - FFT
  - 数学
abbrlink: 76ede821
date: 2019-07-13 20:34:14
---
# FFT入门

>FFT(快速傅里叶变换)是上个学期学会的东西，由于接下来要玩母函数，所以现在写篇博客复习一下。  
>FFT可以在$O(n\log n)$的时间内完成多项式乘法。

## 问题
给定两个十进制数（$10^5$位），求它们的乘积。

不妨把它归为一个**多项式乘积**的问题：每一位都是一个系数，那么`1234*2333`就变成了：

$\displaystyle (x^3+2x^2+3x+4)*(2x^3+3x^2+3x+3)$

对于多项式乘积问题，显然跑$O(n^2)$的朴素高精度乘法是过不了的。考虑我们计算$a \times b$的方式：令$X$为答案，则有：
$\displaystyle X_n = \sum_{i=0}^n a_i\times b_{n-i}$

因此，我们做的事情是**直接计算答案的每一位**。现在我们换一种思路。

## 点值表达
之前我们使用的$(x^{5}+233x^3+x)$这种表达方式，被称为`系数表达`。因为它给出了系数向量：$(1,0,233,0,1,0)$。

但是考虑这样一个事实：**给定$n$个点，可以唯一确定一个$n-1$次多项式函数。**至于如何确定，有[高斯消元](https://zh.wikipedia.org/wiki/%E9%AB%98%E6%96%AF%E6%B6%88%E5%8E%BB%E6%B3%95)和[拉格朗日插值法](https://zh.wikipedia.org/wiki/%E6%8B%89%E6%A0%BC%E6%9C%97%E6%97%A5%E6%8F%92%E5%80%BC%E6%B3%95)。

因此我们拥有了一种全新的表达多项式的方式：点值表达。给出$n+1$个点，可以表达一个多项式。  
例如：$(0,0),(1,1),(2,4)$是多项式$(x^2)$的一种点值表达。**一个多项式有无数组点值表达**。

`有什么用呢？`   
考虑多项式的加法$A+B$，生成的多项式的点值表达，可以由$A$和$B$的点值表达得到。在$A$和$B$上取相同的一些$x$，求出对应的点值表达：  
$A:(x_1,y_{a1}),(x_2,y_{a2})\cdots$  
$B:(x_1,y_{b1}),(x_2,y_{b2})\cdots$  

则$A+B :(x_1,y_{a1}+y_{b1}),(x_2,y_{a2}+y_{b2})\cdots$

看图很好理解：
![](https://i4.buimg.com/567571/c7a816db3c3d1d94.png)

我们把`从点值表达变成系数表达`的过程称作**插值**。

那么多项式的乘法也类似。大概是这样的步骤：
![](https://i4.buimg.com/567571/f4bb6de6fe223c24.png)

## 单位复数根
对着数学书脑补一番就解决了。  

单位复数根：$ω_n^k$均匀分布在以$(0,0)$为中心的复平面圆上。$n=8$时长成这样：  
![](https://i4.buimg.com/567571/a2bbef9639356c57.png)

$ω_n^k=e^{2πi\frac{k}{n}}$（注意其中的$i$是虚数单位）。欧拉告诉我们，$e^{iu}=\cos(u)+i\sin(u)$，故有：$ω_n^k=\cos(2πk/n)+i\sin(2πk/n)$.

看图应该能脑补出来：**尽管$ω_n^k$有$n$种取值，$(ω_n^k)^2$只有$\frac{n}{2}$种取值。**

在图中的意义是：`第一象限点`的平方与`第三象限点`的平方一致；`第二象限点`的平方与`第四象限点`的平方一致。因为$(a+b)^2=(-a-b)^2$。

由于这货的性质，我们选择`单位复数根`作为$x$坐标进行求值。

## FFT

**关键步骤：**  
将$\displaystyle A=\sum_{i=0}^n a_i x^i$拆分为：  
$A_0={a_0,a_2x,a_4x^2,\cdots,a_{n-2}x^{\frac{n}{2}-1}}$  
$A_1={a_1,a_3x,a_5x^2,…,a_{n-1}x^{\frac{n}{2}-1}}$    
则有：$A(x)=A_0(x^2)+xA_1(x^2)$

由于我们使用单位复数根进行求值，则$x^2$只有$n/2$种取值。我们把问题规模成功降低了一半！

那么如何插值回来呢？  
**令$ω_n^k=\cos(2πk/n)-i\sin(2πk/n)$**即可。（这里变成减号）

上面那段话并不清楚，因为我太弱了，根本讲不清楚。要完全理解上面的话，推荐看完代码，然后啃一啃《导论》。

所以我们就写出了代码：[uoj #34.多项式乘法](http://uoj.ac/problem/34)  

```cpp
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <complex>
#include <iostream>
using namespace std;
typedef complex<double> cp;                     //complex库

void fft(cp *a,int n,int flag)                  //作用：求出a的点值表达，存进a
{
    int i;
    cp a0[n/2+1],a1[n/2+1];

    if(n==1) return;
    cp w_n(cos(2*M_PI/n),sin(flag*2*M_PI/n));   //flag=1:求值  flag=2:插值
    cp w(1,0);

    for(i=0;i<n/2;i++) a0[i]=a[i*2],a1[i]=a[i*2+1];     //分治

    fft(a0,n/2,flag);
    fft(a1,n/2,flag);

    for(i=0;i<n/2;i++)
    {
        a[i]=a0[i]+w*a1[i];
        a[i+n/2]=a0[i]-w*a1[i];
        w=w*w_n;                                //递推单位复数根
    }

}

cp x[300005]={0},y[300005]={0};
int n,m;

void init()
{
    int i;
    scanf("%d%d",&n,&m);
    for(i=0;i<=n;i++) cin>>x[i].real();
    for(i=0;i<=m;i++) cin>>y[i].real();
    m+=n;
    for(n=1;n<=m;n=n*2);
}

int main(void)
{
    int i;
    init();
    fft(x,n,1);                                 //求值
    fft(y,n,1);                                 //求值

    for(i=0;i<n;i++) x[i]=x[i]*y[i];            //点值乘法
    fft(x,n,-1);                                //插值

    for(i=0;i<=m;i++)
        printf("%d ",int((x[i].real())/n+0.5));       //四舍五入输出

    return 0;
}
```

跑了4460ms。[提交记录](http://uoj.ac/submission/94091)    
递归版的比较慢（废话），迭代版的跑得比香港记者还快。  

然而我并不会蝴蝶操作那套理论，请看riteme的博客：[有关多项式的算法](http://riteme.github.io/blog/2016-7-21/fft.html)


**相关资料**
>riteme [快速数论变换(NTT)](http://riteme.github.io/blog/2016-8-22/ntt.html)   
简要介绍了快速数论变换。  
>xlightgod [UOJ34 多项式乘法](http://blog.xlightgod.com/%E3%80%90uoj34%E3%80%91%E5%A4%9A%E9%A1%B9%E5%BC%8F%E4%B9%98%E6%B3%95/)  
适合入门FFT。我就是在那里学习了一个。  
>iamzky [快速傅里叶变换](http://blog.csdn.net/iamzky/article/details/22712347)  
讲解很详细。  

