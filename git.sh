#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

cnpm sync @xort/cga
  
git add -A
# git add .
git commit -m '@xort/cga' 

git push origin master 
