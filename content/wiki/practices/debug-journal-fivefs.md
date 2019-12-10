---
title: "5fs 디버그 저널 작성법"
date: "2019-12-10 11:15:23 +0900"
template: "wiki"
draft: false
slug: "/wiki/debug_journal_fivefs"
category: ""
tags:
---

## 디버그 저널 작성법

<https://web.archive.org/web/20061012051113/http://xper.org/wiki/xp/DebugJournal>

## 예시 1

### Facts

- gradle java appliacation 빌드하는 법을 구글링.
- 블로그 내용 열심히 참고했으나 구버전 내용이거나 뭔가 안 됨.
- 한참 삽질하다가 공홈 가이드 발견. 적용하니까 1분만에 됐음.

### Feelings

- 아 왜 그리 오래 삽질을 했을까. 진짜 빡치네.

### Findings

- 개념 같은 경우 블로그가 처음 이해엔 도움이 되는 건 사실이다.
- 하지만 감이 잡힌 후 구체적인 기술의 사용법 같은 경우 이젠 1번으로 공식 문서를 보자.

### Future Action Plan

- 문제가 생기면 해당 부분에 관한 공식문서를 본다.

### Feedback (일정기간 Future Action을 실천 후)

- 1주일 실천해보니 공식 문서를 보는 습관이 생겨서 확실히 시간 낭비가 줄어들었다.

## 예시 2

### Facts

- javascript object {key: value}에서 키 값으로 함수의 연산결과를 대입하고 싶었으나 문법 오류.
- 한참 이것 저것 해보다가 키값 동적 할당 등 다양한 검색어를 때리다가 computed property name을 발견.
- ES6는 computed property name를 아래와 같이 지원함.

```javascript
const a = {
  ['key' + i++]: value
}
```

### Feelings

- computed...computed 왜 생각을 못했나...

### Findings

- 속성 이름을 동적으로 넣고 싶은 거였다.
- 영어로 하면 computed property name이다. 사실 영어가 익숙해도 쉽게 떠올릴 수 있을진 모르겠다.

### Future Action Plan

- 이런건 자주 쓰이는 표현이니 외워야 되는 듯 하다.
- 일단 문제가 생기면 해당 이슈를 표현하는게 영어로 어떤 표현일지 최대한 생각해보고 검색하자.

### Feedback

- 한달 동안 키워드 사전을 만들어 놓으니 검색 소요 시간이 상당히 단축 됐다.
