---
title: Material X主题pjax使用
abbrlink: db1997ec
date: 2020-01-05 21:31:38
tags:
  - pjax
  - 实用
  - Material X
---

这里简单讲一下什么是pjax，可以理解为点击连接时不刷新页面，而是替换页面的内容，来达到优化访问速度的目的，同时还可以保留一些不需要刷新的内容（如正在播放的音乐）。

如何在Material X主题中使用pjax，我们需要首先引进pjax的脚本，插入`layout/_partial/head.ejs`：

```html
<script src="https://cdn.jsdelivr.net/npm/pjax/pjax.js"></script>
```

然后我们在`layout/layout.ejs`插入如下代码（注意要在`</body>`）的前面

```html
<script>
	var pjax = new Pjax({
		elements: "a",//代表点击链接就更新
		selectors: [//代表要更新哪些html元素（dom节点）
			"title",
			".l_body",
			"cover-wrapper"
		]
	})
	function LoadHitoKoto(){//加载一言
		fetch('https://v1.hitokoto.cn/?c=a')
		.then(function (res){
			return res.json();
		})
		.then(function (data) {
			var h_content = document.getElementById('hitokoto-content');
			var h_from = document.getElementById('hitokoto-from');
			h_content.innerText = data.hitokoto; 
			h_from.innerText = "——" + data.from; 
		})
		.catch(function (err) {
			console.error(err);
		})
	}
	function LoadGitalk(){
		$.getScript("/js/gitalk.js", function() {
			var gitalk = new Gitalk({
				clientID: "xxx",
				clientSecret: "xxx",
				repo: "gaisaiyuno.github.io",
				owner: "GaisaiYuno",
				admin: "GaisaiYuno",
				id: location.pathname,      // Ensure uniqueness and length less than 50
				distractionFreeMode: false  // Facebook-like distraction free mode
			});
			gitalk.render('gitalk-container');
		});
	}
	function LoadMathJax(){//加载mathjax
		$.getScript("//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML", function() {
			MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
			var math = document.getElementsByClassName("entry-content")[0];
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
		});
	}
	function LoadFancybox(){//加载fancybox（点开图片放大）
		$(".article-entry").find("img").each(function () {//渲染fancy box
			var t = document.createElement("a");
			$(t).attr("data-fancybox", "gallery"),
			$(t).attr("href", $(this).attr("src")),
			$(this).wrap(t)
		})
	}
	function LoadWpac(){//加载点赞系统
		wpac_init = window.wpac_init || [];
		wpac_init.push({widget: 'Rating', id: 21085});//渲染widget pack（点赞系统）
		WIDGETPACK_LOADED=false;
		(function() {
			WIDGETPACK_LOADED = true;
			var mc = document.createElement('script');
			mc.type = 'text/javascript';
			mc.async = true;
			mc.src = 'https://embed.widgetpack.com/widget.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(mc, s.nextSibling);
		})();
	}
    // 开始 PJAX 执行的函数
    document.addEventListener('pjax:send', function (){
		$(".loading").css("display", "block");//加载转圈圈的css
   });

   // PJAX 完成之后执行的函数，可以和上面的重载放在一起
   document.addEventListener('pjax:complete', function (){
		$(".loading").css("display", "none");
		LoadMathJax();
		LoadHitoKoto();
		LoadWpac();
		LoadFancybox();
		LoadGitalk();
   });
  </script>
```

然后我们还得魔改一下css，首先是加上一个加载动画：

```css
.loading{display:none}
.loading{height:100%;width:100%;position:fixed;top:0;left:0;z-index:999999;background-color:rgba(250,250,250,.9)}
.loading img{width: 280px;height:210px;position: relative;top: 45%;left: 50%;margin-left:-140px;margin-top: -105px;}
#loader{display: block; position: relative; left: 50%; top: 50%; width: 150px; height: 150px; margin: -75px 0 0 -75px; border-radius: 50%; border: 3px solid transparent; border-top-color: #ff5a5a; -webkit-animation: spin 1s linear infinite; animation: spin 1s linear infinite;}
#loader:before{content: ""; position: absolute; top: 5px; left: 5px; right: 5px; bottom: 5px; border-radius: 50%; border: 3px solid transparent; border-top-color: #5af33f; -webkit-animation: spin 3s linear infinite; animation: spin 3s linear infinite;}
#loader:after{content: ""; position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; border-radius: 50%; border: 3px solid transparent; border-top-color: #6dc9ff; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite;}
@-webkit-keyframes spin{0%{-webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); transform: rotate(0deg);} 100%{-webkit-transform: rotate(360deg); -ms-transform: rotate(360deg); transform: rotate(360deg);}}
@keyframes spin{0%{-webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); transform: rotate(0deg);} 100%{-webkit-transform: rotate(360deg); -ms-transform: rotate(360deg); transform: rotate(360deg);}}
```

加入`source/style.less`，然后把

```html
<div class="loading"><div id="loader"></div></div>
```

插入`layout/_partial/head.ejs`。

后来发现gitalk的css会出点问题，需要把gitalk.css的全部内容加入`source/style.less`。

友链的图片显示也会有点问题，我们就不要占位图了，把`layout/links.ejs`里面的：

```html
<img class='avatar' src='<%- theme.avatar_placeholder %>' data-echo='<%- url_for(item.avatar ? item.avatar : "https://img.vim-cn.com/a4/87a96e2e01b1180bba1e76e190df5220378c1a.png") %>'/>
```

改成：

```html
<img class='avatar' src='<%- url_for(item.avatar ? item.avatar : "https://img.vim-cn.com/a4/87a96e2e01b1180bba1e76e190df5220378c1a.png") %>'/>
```

这样就差不多了。

> 参考：https://sunhang.top/2019/12/20/pjax/