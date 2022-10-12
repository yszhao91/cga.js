#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
vuepress build docs

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:yszhao91/cga.js.git master:gh-pages

rm -rf *
cd -
git checkout  master


# git config --global http.proxy socks5://127.0.0.1:5006 
# git config --global https.proxy socks5://127.0.0.1:5006


# git config --global https.proxy http://127.0.0.1:5006 
# git config --global https.proxy https://127.0.0.1:5006


# git config --global --unset http.proxy 
# git config --global --unset https.proxy