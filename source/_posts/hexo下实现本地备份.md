---
title: hexo下实现本地备份&&git提交
tags:
  - 实用
abbrlink: c30e4a1f
date: 2019-07-28 18:12:47
---

hexo这个东西比较容易一魔改就挂掉，于是需要一个本地的备份。

--------------

考虑使用7zip进行备份，我们先下载[7zip](https://www.7-zip.org/download.html)

下载exe文件之后，我们安装，但是我们需要的不是GUI界面的7zip，进入7zip安装文件夹，找到7z.exe。

把7z.exe拷过来，放进HexoBlog文件夹，其中的文件如下：

![](/images/files.png)

注意：blog是你的博客文件夹，backups是你的备份文件夹，backup.py是你的备份工具，待会会讲。

backup.py如下，其中source和target_dir是上面所讲的两个文件夹。

time.strftime('%Y%m%d%H%M%S')+'.zip'的意思是生成一个文件名为系统时间的zip压缩包，

zip_command就是生成zip文件的命令。

注意-t7z的命令是生成高压缩比7zip文件，对应压缩时间比较久，可以替换为-tzip，生成时间较短，但是生成文件体积较大。

```python
import os
import time

source = 'D:\\HexoBlog\\blog'
target_dir='D:\\HexoBlog\\backups\\'
target=target_dir+time.strftime('%Y%m%d%H%M%S')+'.zip'
if not os.path.exists(target_dir):
    os.mkdir(target_dir)
zip_command='7z.exe a -t7z '+target+' '+source
print('zip command is:')
print(zip_command)
if os.system(zip_command)==0:
    print('Successful backup to',target)
else:
    print('Backup FAILED')
```

双击运行backup.py，backups文件夹就会出现一个新的备份文件，是不是非常方便。

8/6 upd

骚操作get

后面加一句

```python
os.system("cd backups && git add . && git commit -m \"backup\" && git push -f origin master")
```

即可实现git提交功能