---
title: SP1557 GSS2 - Can you answer these queries II 线段树
  
tag:
  - 题解
  - 线段树
  - 离线
  - GSS
abbrlink: d345d3a1
date: 2019-07-13 20:34:14
---
感觉这题自己也讲不清，还是搬运洛谷的一篇题解吧。。。

作者: [duyi](https://www.luogu.org/space/show?uid=100674)

[在Ta的博客查看](https://www.luogu.org/blog/top-oier/solution-sp1557)
* * *

观察这题与[GSS1](https://www.luogu.org/problemnew/show/SP1043)的最主要差别是需要去重。

这样的问题有一个比较套路化的技巧<del>（主要看个人经验）</del>。就是可以**离线**做。我们将所有询问按r从小到大排序。

我们一次从<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>1</mn></mrow><annotation encoding="application/x-tex">1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.64444em;"></span><span class="strut bottom" style="height: 0.64444em; vertical-align: 0em;"></span><span class="base"><span class="mord">1</span></span></span></span></span>到<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>n</mi></mrow><annotation encoding="application/x-tex">n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.43056em;"></span><span class="strut bottom" style="height: 0.43056em; vertical-align: 0em;"></span><span class="base"><span class="mord mathit">n</span></span></span></span></span>扫过整个序列。假设现在扫到<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.65952em;"></span><span class="strut bottom" style="height: 0.65952em; vertical-align: 0em;"></span><span class="base"><span class="mord mathit">i</span></span></span></span></span>。在线段树中，
**第<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>j</mi></mrow><annotation encoding="application/x-tex">j</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.65952em;"></span><span class="strut bottom" style="height: 0.85396em; vertical-align: -0.19444em;"></span><span class="base"><span class="mord mathit" style="margin-right: 0.05724em;">j</span></span></span></span></span>个叶子结点我们维护<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>j</mi><mo>]</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[j]...a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mclose">]</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>序列的和<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>S</mi><mi>u</mi><mi>m</mi></mrow><annotation encoding="application/x-tex">Sum</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.68333em;"></span><span class="strut bottom" style="height: 0.68333em; vertical-align: 0em;"></span><span class="base"><span class="mord mathit" style="margin-right: 0.05764em;">S</span><span class="mord mathit">u</span><span class="mord mathit">m</span></span></span></span></span>**。

> 如：
> 
> 叶子结点1：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mn>2</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[1] + a[2] + ... + a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">2</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>
> 
> 叶子结点2：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mn>2</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mn>3</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[2] + a[3] + ... + a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">2</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">3</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>
> 
> ...
> 
> 叶子结点i：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>

我们顺次扫过整个序列，在更新<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.65952em;"></span><span class="strut bottom" style="height: 0.65952em; vertical-align: 0em;"></span><span class="base"><span class="mord mathit">i</span></span></span></span></span>时，由于相同值不能重复计算，所以<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>只能更新值<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>最近一次出现的位置<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>j</mi><mo>+</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">j+1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.65952em;"></span><span class="strut bottom" style="height: 0.85396em; vertical-align: -0.19444em;"></span><span class="base"><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mbin">+</span><span class="mord">1</span></span></span></span></span>到<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.65952em;"></span><span class="strut bottom" style="height: 0.65952em; vertical-align: 0em;"></span><span class="base"><span class="mord mathit">i</span></span></span></span></span>这段区间。对于每个位置上的数上一次出现的位置，我们可以用一个pre数组记录。

> 更新后：
> 
> 叶子结点1：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mn>2</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">a[1] + a[2] + ... + a[i-1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">2</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>
> 
> 叶子结点2：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mn>2</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mn>3</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">a[2] + a[3] + ... + a[i-1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">2</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">3</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>
> 
> ...
> 
> 叶子结点j：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>j</mi><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mi>j</mi><mo>+</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">a[j] + a[j+1] + ... + a[i-1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mbin">+</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>
> 
> 叶子结点j+1：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>j</mi><mo>+</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mi>j</mi><mo>+</mo><mn>2</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[j+1] + a[j+2] + ... + a[i-1] + a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mbin">+</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mbin">+</span><span class="mord">2</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>
> 
> ...
> 
> 叶子结点i-1：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i-1] + a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>
> 
> 叶子结点i：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>

考虑下一次更新。如果不考虑<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>p</mi><mi>r</mi><mi>e</mi><mo>[</mo><mi>i</mi><mo>+</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">pre[i+1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">p</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mord mathit">e</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">+</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>（为说理方便，不妨设<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>p</mi><mi>r</mi><mi>e</mi><mo>[</mo><mi>i</mi><mo>+</mo><mn>1</mn><mo>]</mo><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">pre[i+1]=0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">p</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mord mathit">e</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">+</span><span class="mord">1</span><span class="mclose">]</span><span class="mrel">=</span><span class="mord">0</span></span></span></span></span>）我们会对线段树上所有节点都加上<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>+</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i+1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">+</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>，于是：

> 此时叶子结点1变为：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mn>2</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">a[1] + a[2] + ... + a[i-1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">2</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>**+a[i+1]**
> 
> 叶子结点2变为：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mn>2</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mn>3</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">a[2] + a[3] + ... + a[i-1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">2</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord">3</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>**+a[i+1]**
> 
> ...
> 
> 叶子结点j：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>j</mi><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mi>j</mi><mo>+</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">a[j] + a[j+1] + ... + a[i-1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mbin">+</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>**+a[i+1]**
> 
> 叶子结点j+1：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>j</mi><mo>+</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mi>j</mi><mo>+</mo><mn>2</mn><mo>]</mo><mo>+</mo><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">.</mi><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[j+1] + a[j+2] + ... + a[i-1] + a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mbin">+</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.05724em;">j</span><span class="mbin">+</span><span class="mord">2</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord">.</span><span class="mord">.</span><span class="mord">.</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>**+a[i+1]**
> 
> ...
> 
> 叶子结点i-1：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo>]</mo><mo>+</mo><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i-1] + a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">−</span><span class="mord">1</span><span class="mclose">]</span><span class="mbin">+</span><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>**+a[i+1]**
> 
> 叶子结点i：<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>**+a[i+1]**

我们发现，我们的操作实际上是对序列进行了**自动去重**。我们之所以能实现这样的去重，实质上是两步操作的结果：

1.  第<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.65952em;"></span><span class="strut bottom" style="height: 0.65952em; vertical-align: 0em;"></span><span class="base"><span class="mord mathit">i</span></span></span></span></span>次更新时只更新<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>p</mi><mi>r</mi><mi>e</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">pre[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">p</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mord mathit">e</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>后面的节点。使得<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>p</mi><mi>r</mi><mi>e</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">pre[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">p</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mord mathit">e</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>及其前面的节点所对应的子序列都不包含<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>。

2.  在第<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>i</mi><mo>+</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">i+1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.65952em;"></span><span class="strut bottom" style="height: 0.74285em; vertical-align: -0.08333em;"></span><span class="base"><span class="mord mathit">i</span><span class="mbin">+</span><span class="mord">1</span></span></span></span></span>次更新时对不管是<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>p</mi><mi>r</mi><mi>e</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">pre[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">p</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mord mathit">e</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>前的还是<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>p</mi><mi>r</mi><mi>e</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">pre[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">p</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mord mathit">e</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>后的节点，都统一加上<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>+</mo><mn>1</mn><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i+1]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mbin">+</span><span class="mord">1</span><span class="mclose">]</span></span></span></span></span>。这样，对于<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>p</mi><mi>r</mi><mi>e</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">pre[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">p</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mord mathit">e</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>前的节点，就自动跳过了<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>，在子序列中只保留了一次<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mo>[</mo><mi>i</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">a[i]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mord mathit">a</span><span class="mopen">[</span><span class="mord mathit">i</span><span class="mclose">]</span></span></span></span></span>的值，巧妙的实现了去重。

如此一来，当我们更新到位置<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>k</mi></mrow><annotation encoding="application/x-tex">k</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.69444em;"></span><span class="strut bottom" style="height: 0.69444em; vertical-align: 0em;"></span><span class="base"><span class="mord mathit" style="margin-right: 0.03148em;">k</span></span></span></span></span>时，每个叶子节点都维护着一个**以自己开头，以a[k]（或a[k-1]，这是去重的结果）结尾的不含重复数字的子序列**。所谓的子序列，就是再原序列里不一定连续的一段数。**而我们维护的这些子序列不连续，当且仅当中间有重复数字被去除。**

这样，当扫描到的k等于当前询问的r时，我们就可以去线段树里找答案了。然而，以r结尾的子序列并不一定是最优的，因此我们对于线段树里的每个节点还要维护一个Max。表示在扫描整个序列的过程中，在该节点所管辖的范围内**所出现过的最大的Sum值**。

现在，每个叶子节点都对应了一段子序列的和。我们要高效地求出所有这些和中最大的一个，于是问题就转化为了用线段树求区间最大值。由于在扫描整个序列的过程中，我们需要不断地对线段树进行更新，为了高效地维护Sum和Max，我们引入懒标记LazySum和LazyMax。

当我们用 a[i] 更新当前整个区间时：

*   Sum += a[i]

*   Max = max(Sum, Max)

*   LazySum += a[i]

*   LazyMax = max(LazySum, LazyMax)

当我们下放懒标记时

*   son.Max = max(son.Max,son.sum+fa.LazyMax)

*   son.Sum += fa.LazySum

*   son.LazyMax = max(son.LazyMax,son.LazySum+fa.LazyMax)

*   son.LazySum += fa.LazySum

那么对于区间<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mo>[</mo><mi>l</mi><mo separator="true">,</mo><mi>r</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">[l,r]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.01968em;">l</span><span class="mpunct">,</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mclose">]</span></span></span></span></span>，当我们更新到<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>r</mi></mrow><annotation encoding="application/x-tex">r</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.43056em;"></span><span class="strut bottom" style="height: 0.43056em; vertical-align: 0em;"></span><span class="base"><span class="mord mathit" style="margin-right: 0.02778em;">r</span></span></span></span></span>以后，查询线段树<span><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mo>[</mo><mi>l</mi><mo separator="true">,</mo><mi>r</mi><mo>]</mo></mrow><annotation encoding="application/x-tex">[l,r]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height: 0.75em;"></span><span class="strut bottom" style="height: 1em; vertical-align: -0.25em;"></span><span class="base"><span class="mopen">[</span><span class="mord mathit" style="margin-right: 0.01968em;">l</span><span class="mpunct">,</span><span class="mord mathit" style="margin-right: 0.02778em;">r</span><span class="mclose">]</span></span></span></span></span>这段区间的Max即可。

#### 参考代码：

（我的代码）

```cpp
#include <bits/stdc++.h>
#define MAXN 100005
#define INF 0x7fffffff
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
namespace SegmentTree{
    struct node{
        int l,r;
        int sum,maxn;//maxn:sum历史最大值
        int sumtag,maxtag;
    }tree[MAXN<<2];
    #define lc i<<1
    #define rc i<<1|1
    inline void pushup(int i){
        tree[i].sum=max(tree[lc].sum,tree[rc].sum);
        tree[i].maxn=max(tree[lc].maxn,tree[rc].maxn);
    }
    inline void Change(int s,int i){
        tree[s].maxn=max(tree[s].maxn,tree[s].sum+tree[i].maxtag);
        tree[s].sum+=tree[i].sumtag;
        tree[s].maxtag=max(tree[s].maxtag,tree[s].sumtag+tree[i].maxtag);
        tree[s].sumtag+=tree[i].sumtag;
    }
    inline void pushdown(int i){
        Change(lc,i),Change(rc,i);
        tree[i].maxtag=tree[i].sumtag=0;
    }
    void Build(int i,int l,int r){
        tree[i].l=l,tree[i].r=r;
        if (l==r) return ;
        int mid=(l+r)>>1;
        Build(lc,l,mid);
        Build(rc,mid+1,r);
    }
    void Update(int i,int L,int R,int val){
        if (L<=tree[i].l&&tree[i].r<=R){
            tree[i].sum+=val;
            tree[i].maxn=max(tree[i].sum,tree[i].maxn);
            tree[i].sumtag+=val;
            tree[i].maxtag=max(tree[i].maxtag,tree[i].sumtag);
            return ;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1;
        if (L<=mid) Update(lc,L,R,val);
        if (mid<R) Update(rc,L,R,val);
        pushup(i);
    }
    int Query(int i,int L,int R){
        if (L<=tree[i].l&&tree[i].r<=R){
            return tree[i].maxn;
        }
        pushdown(i);
        int mid=(tree[i].l+tree[i].r)>>1,ans=-INF;
        if (L<=mid) ans=max(ans,Query(lc,L,R));
        if (mid<R) ans=max(ans,Query(rc,L,R));
        return ans;
    }
}
using namespace SegmentTree;
int pre[MAXN*2],last[MAXN*2];//求出a[i]前使a[j]=a[i]最大的j，类似于链表
int a[MAXN];
#define NUM 100005
struct Qry{
    int l,r;
    int id;
}Q[MAXN];
bool operator < (const Qry &A,const Qry &B){
    return A.r<B.r;
}
int ans[MAXN];
int main(){
    int n=read();
    for (register int i=1;i<=n;++i){
        a[i]=read();
        pre[i]=last[a[i]+NUM];
        last[a[i]+NUM]=i;
    }
    int q=read();
    for (register int i=1;i<=q;++i){
        Q[i].l=read(),Q[i].r=read();
        Q[i].id=i;
    }
    Build(1,1,n);
    sort(Q+1,Q+1+q);
    register int pos=1;
    for (register int i=1;i<=n;++i){
        Update(1,pre[i]+1,i,a[i]);
        for (;pos<=q;++pos){
            if (Q[pos].r>i){
                break;
            }
            ans[Q[pos].id]=Query(1,Q[pos].l,Q[pos].r);
        }
    }
    for (register int i=1;i<=q;++i){
        printf("%d\n",ans[i]);
    }
}
```

不知道为什么格式乱了