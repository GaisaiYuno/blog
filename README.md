# Hexo主题Material X改编版本

Hexo主题[Material X](https://github.com/xaoxuu/hexo-theme-material-x)的改编版本，参照各网友的博客魔改而来，感谢所有模块的原作者。

## 预览图

![1.PNG](https://i.loli.net/2020/02/08/pRWzTi9ZlUX6ohF.png)

![2.PNG](https://i.loli.net/2020/02/08/i6LaPtVCx58MyFd.png)

## 新增功能

- 增加 [一言hitokoto](https://hitokoto.cn/)。
- 增加评分系统 [WidgetPack](https://widgetpack.com/)。
- 增加 pjax，感谢 [sunhang.top](https://sunhang.top/2019/12/20/pjax/)。
- 增加最新评论功能，感谢 [辣椒の酱](https://removeif.github.io/theme/博客中gitalk最新评论的获取.html)。
- 支持 aplayer 使用自己的 music.js。
- 增加 2048、BZOJ 离线题库、Markdown 在线编辑、留言板、实验室等功能。
- 可以开启 no-refferer。

## 强制使用

MathJax、FancyBox、pjax

## 不支持

- pjax 暂不支持除 gitalk 之外的评论系统。

## 使用方法

注：以下的操作都在 theme/material-x/_config.yml 中进行。

### 最新评论

```yaml
latest_comments:
  enable: true
  repo: gaisaiyuno/gaisaiyuno.github.io
```

enable 设成 true，下面的 repo 填写用户名 /github pages 地址。

```yaml
- widget: latest_comments
```

将 widget 调到想要的位置。

### 评分系统

首先，上 https://widgetpack.com/ 注册一个账号，获得一个 id，然后进入Rating/Setting，将 Vote via 改成 IP address，这样不用登陆就可以评分。

```yaml
widget_pack:
  enable: true
  hint: 来了就留下您的评分吧！
  id: 21085
```

然后 enable 设成 true，hint 填写提示语，id 就是您申请到的 id。

### 一言

```yaml
- widget: hitokoto
```

加上这一项，把 widget 调到想要的位置。

### Aplayer

由于使用了pjax，这里不能使用原主题侧边栏模式，只能使用吸底模式。

 ```yaml
music:
  enable: true         # 是否启用
  own: false           # 是否使用自定义music.js
  path: /js/music.js   # music.js位置
  color: '#1BCDFC'     # 主题色
  mode: circulation    # random （随机） single （单曲） circulation （列表循环） order （列表）
  server: netease      # netease（网易云音乐）tencent（QQ音乐） xiami（虾米） kugou（酷狗）
  type: playlist       # song （单曲） album （专辑） playlist （歌单） search （搜索）
  id: 2482575335       # 歌曲/专辑/歌单 ID
  volume: 0.7          # 音量, 0~1
  autoplay: false      # 自动播放
 ```

own 代表是否使用自定义 music.js，如果设为 true，就必须填写 path 参数，代表 music.js 位置，而且下面的 color, mode, server, type, id, volume, autoplay 等参数将被忽略；如果设为false，代表使用在线歌单，path将会被忽略，其他参数参见注释。

这里安利一下我自己的[music.js生成器](https://github.com/GaisaiYuno/missevan-spider)。

### no-refferer

有时博客使用的音频，图片等等加载不出来，是因为别人开了防盗链，使用 no-referrer 就可以加载出来。

但是开启了 no-refferer ，就无法使用不蒜子统计。

```yaml
no_referrer: false
```

### temp文件夹

我发现有些时候直接 `hexo g` 而不 `hexo clean` 有些问题，然而直接 `hexo clean`，会将 public 文件夹里面的 2048 游戏等删掉，就想到可以把这些文件放入一个 temp 文件夹，`hexo clean && hexo g`之后直接复制进 public 文件夹，然后 `hexo d` 上传。

## .bat文件使用方法

可以看到，根目录里面有四个 .bat 文件。

- preview.bat：在 localhost:4000 预览。

- update.bat：重新生成 /public，上传到 github。
- generate_public_without_updating.bat：**第一次使用必须执行**，它的作用就是生成 public 文件夹并且把 temp 文件夹复制进去。

- update_without_cleaning.bat：不 clean，直接上传。

## 下载

因为主题里面BZOJ离线题库较大，国内建议到 [镜像源Gitee](https://gitee.com/steven_meng/blog) 下载，或者

```bash
git clone https://gitee.com/steven_meng/blog.git
```

