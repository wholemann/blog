---
title: "Git command"
date: "2019-12-06 15:25:27 +0900"
template: "wiki"
draft: false
slug: "/wiki/git-command"
category: ""
tags:
---

### 특정 시점으로 돌아가야 할 때

- 특히 commit history를 보고 특정 시점으로 돌아가서 소스를 볼 때 유용
- 아니면 해당 시점 이후의 개선을 직접 해볼 수도 있음

```bash
git checkout -b exercise-1
git log
git reset --hard (commit identifier)
```

### 커밋 메시지에 특정 단어가 들어있는 히스토리만 나오게 함
```bash
git log -i --grep='exercise 2'
```
