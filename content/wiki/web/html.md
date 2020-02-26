---
title: html
date: "2020-02-26 19:46:00 +0900"
template: "wiki"
draft: false
slug: "/wiki/html/"
category: ""
tags:
---

## 7장

### 7.1 기본 문서 구조 세팅하기

- 문서 엘리먼트: doctype, html, head, body 4종류.
- doctype
  - `<!DOCTYPE HTML>`
  - HTML을 처리하고 있다는 것.
  - HTML 규격 버전 -> 그러나 브라우저가 형식을 보고 자동 감지함.

- html
  - HTML 마크업의 시작을 알림.

- head
  - 문서를 위한 메타데이터 소유.
  - 메타데이터는 브라우저에게 컨텐츠와 문서 안의 마크업에 관련한 정보를 제공.
  - 한 개의 title 엘리먼트가 필요하고 다른 metadata는 선택사항.
  - title
    - 브라우저 탭 부분에 표시되는 텍스트
  - base
    - HTML 문서 안에 포함된 상대적 링크들이 참조하는 URL.
    - base 엘리먼트를 사용하지 않거나 href로 지정하지 않으면 브라우저는 현재 문서의 URL을 기준으로 상대적 링크 분석.
  - meta
    - 각각의 meta 엘리먼트 사용 방식은 이들 중 오직 한가지의 목적으로만 쓸 수 있음.
    - 이름 / 값을 가진 메타데이터 쌍.
    - 캐릭터 인코딩 선언.
    - http-equiv를 이용해서 HTTP 헤더들 중 아래 3개를 시뮬레이트하거나 대체할 수 있음.
      - refresh, default-style, content-type
  - link
    - stylesheet, favicon 로딩처럼 외부 리소스를 로딩함.
    - [리소스 우선순위](http://bit.ly/3a4LkId)를 지정하는 방법 중 하나인 prefetch를 지정할 수 있음.

- body
  - 문서의 컨텐츠를 담음. 컨텐츠는 모든 구문 엘리먼트와 플로우 엘리먼트를 말함.
  - 항상 head 엘리먼트 다음에 놓임.
