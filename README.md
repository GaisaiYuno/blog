# Material X魔改版本

[Material X主题](https://github.com/xaoxuu/hexo-theme-material-x)的魔改版本，参照各网友的博客魔改而来，感谢所有模块的原作者。

## 预览图

![1.PNG](https://i.loli.net/2020/02/08/pRWzTi9ZlUX6ohF.png)

![2.PNG](https://i.loli.net/2020/02/08/i6LaPtVCx58MyFd.png)

## 改动部分

- 强制使用MathJax、FancyBox、pjax。
- 增加[一言hitokoto](https://hitokoto.cn/)。
- 增加评分系统[WidgetPack](https://widgetpack.com/)。
- 增加pjax，感谢[sunhang.top](https://sunhang.top/2019/12/20/pjax/)。
- 增加最新评论功能，感谢[辣椒の酱](https://removeif.github.io/theme/博客中gitalk最新评论的获取.html)。
- 支持aplayer使用自己的music.js。
- 增加2048、BZOJ离线题库、Markdown在线编辑、留言板、实验室等功能。

## 不支持

- pjax暂不支持除gitalk之外的评论系统

## 使用方法

注：以下的操作都在theme/material-x/_config.yml中进行。

### 最新评论

```yaml
latest_comments:
  enable: true
  repo: gaisaiyuno/gaisaiyuno.github.io
```

enable设成true，下面的repo填写用户名/github pages地址。

```yaml
- widget: latest_comments
```

将widget调到想要的位置。

### 评分系统

首先，上 https://widgetpack.com/ 注册一个账号，获得一个id，然后进入Rating/Setting，将Vote via改成IP address，这样不用注册账号也能评分。

```yaml
widget_pack:
  enable: true
  hint: 来了就留下您的评分吧！
  id: 21085
```

然后enable设成true，hint填写提示语，id就是您申请到的id。

### 一言

```yaml
- widget: hitokoto
```

只要加上这一项就行了

### Aplayer

由于使用了pjax，这里不能使用原主题侧边栏模式，只能使用吸底模式。

 ```yaml
music:
  enable: true         # 是否启用
  own: false           # 是否使用自己的music.js
  path: /js/music.js   # music.js位置
  color: '#1BCDFC'     # 主题色
  mode: circulation    # random （随机） single （单曲） circulation （列表循环） order （列表）
  server: netease      # netease（网易云音乐）tencent（QQ音乐） xiami（虾米） kugou（酷狗）
  type: playlist       # song （单曲） album （专辑） playlist （歌单） search （搜索）
  id: 2482575335       # 歌曲/专辑/歌单 ID
  volume: 0.7          # 音量, 0~1
  autoplay: false      # 自动播放
 ```

own代表是否使用自己的music.js，如果设为true，就必须填写path参数，代表music.js位置，而且下面的color, mode, server, type, id, volume, autoplay等参数将被忽略；如果设为false，代表使用在线歌单，path将会被忽略，其他参数参见注释。

这里安利一下我自己的[music.js生成器](https://github.com/GaisaiYuno/missevan-spider)

### temp文件夹

我发现有些时候直接`hexo g`而不`hexo clean`有些问题，然而直接`hexo clean`，会将public文件夹里面的2048游戏等删掉，就想到可以把这些文件放入一个temp文件夹，`hexo clean && hexo g`之后直接复制进public文件夹，然后`hexo d`上传。

## .bat文件使用方法

可以看到，根目录里面有四个.bat文件

- preview.bat：在localhost:4000预览。

- update.bat：重新生成/public，上传到github。
- generate_public_without_updating.bat：**第一次使用必须执行**，它的作用就是生成public文件夹并且把temp文件夹复制进去。

- update_without_cleaning.bat：不clean，直接上传。