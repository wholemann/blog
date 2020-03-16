---
title: ""
date: "2020-03-16 16:17:09 +0900"
template: "wiki"
draft: false
slug: "/wiki/web-publisher-lecture"
category: ""
tags:
---

## HTML 작성 기초

### 웹 표준

구조 계층 - HTML, XHTML
표현 계층 - CSS
JavaScript - 동작 계층

웹 표준 구현은 구조, 표현, 동작의 분리가 이루어져야 한다.

HTML이 없으면 웹페이지도 없다.
CSS, JavaScript는 필수 계층이 아니다.
동작 계층이나 표현 계층이 없더라도 사용할 수 있어야 한다.
표현 계층은 .css파일로, 동작 계층은 .js파일로 분리해야 한다.
접근성과 사용성에도 적극적이어야 한다.
마우스가 없어도, 키보드 만으로도 사용되어져야 한다.

- 웹 접근성
  - [웹 접근성 연구소](wah.or.kr) 참고.
  - 경우에 따라 법적인 제재를 받을 수 있으니 신중하게 다뤄야 한다.

```html
<a href="#" onclick="window.open('','','')">go naver</a> (X)

<a href="http://naver.com">go naver</a> (O)
```

웹 표준을 위반한 코드다. onclick과 같은 js 코드는 따로 분리한다. js가 동작하지 않으면 저 태그 자체로 아무 것도 할 수 없기 때문이다. 아래 a 태그처럼 해당 태그 자체로 어떤 동작이 일어나야 한다.

### HTML 태그 작성 문법

종료 태그가 없는 경우 HTML5는 \<input type="text" />와 같이 종료해도 되고 안 해도 상관 없다.
단, XHTML의 경우 반드시 종료를 해줘야 한다.

종료 태그를 생략해도 되는 태그가 있지만 되도록 종료 태그를 붙이는 습관을 갖자.

### meta요소 알아보기

head의 meta charset은 title보다 먼저 나와야 한다.

[Google에서 인식하는 특수 태그](https://support.google.com/webmasters/answer/79812?hl=ko)

- description: 책 페이지 수, 주요 내용 등 검색이 됐으면 하는 내용을 넣어놓으면 좋다. 검색에 도움이 많이 된다.
- author: 저자.
- generator: 이 웹사이트를 만들 때 사용한 라이브러리나 프레임워크 명시.
- copyright, reply-to, date는 HTML5에선 오류 가능성이 있다.

- robots
  - index: 현재 페이지를 수집해서 검색 엔진이 보여주는 걸 허용한다.
  - noindex: 현재 페이지를 허용하지 않는다.
  - follow: 연결된 페이지를 허용한다.
  - nofollow: 연결된 페이지를 허용하지 않는다.
  - none: 현재 페이지, 연결된 페이지 모두 허용하지 않는다.

- 오픈 그래픽 관련된 메타 태그 설정으로 카카오톡에 공유할 때 링크 밑에 나오는 썸네일 설정에 관련된 것이다.
- og:title, og:url, og:image, og:type, og:description

```html
<meta property="og:xxx" content="">
```

- 일정 시간 이후 특정 사이트로 이동시킨다.

```html
<meta http-equiv="refresh" content="3; url=http://google.com/">
```

- 모바일이나 반응형 웹을 위해선 꼭 써야하는 태그다.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### HTML 템플릿 작성하기

viewport, description은 꼭 넣어주자.

[네이버 코딩 컨벤션](http://bit.ly/2QiRPzQ)

body 최상단에 아래 코드를 무조건 좋다. 넣어주는 게 웹 접근성에 도움이 많이 된다.

```html
<body>
  <p><a href="#content">본문바로가기</a></p>
  <div id="wrap">
    <div id="header">
    </div>
    <div id="container">
      <div id="content">
      </div>
    </div>
    <div id="footer">
    </div>
  </div>
```

## 각종 html 요소 알아보기

### 문자 실체 참조와 수치 문자 참조 적용

`<` `>` 는 html 태그로 인식되기 때문에 \&lt; \&gt;로 문자 실체 참조를 이용해서 표현해야 된다.
\&copy; 는 \&#169; 수치 문자 참조를 이용해서도 나타낼 수 있다. XHTML에서는 수치 문자 참조를 쓰는 걸 권장한다.

### 구문을 강조하거나 하이라이팅 지정하기

- em: 주관적인 강조에 적합하다. (emphasis)
- strong: 객관적인 강조에 적합하다. (strong importance)
- mark: 주의 환기가 필요한 문장에 적합하다.

### 단의어 정의와 약어, 작품의 제목 표현

- block 태그: 줄이 바뀌는 것. ex) \<p>
- inline 태그: 줄이 바뀌지 않고 한 줄. ex) \<span>
- dfn 태그: 어떤 단어에 대한 뜻을 title의 값으로 설명해줌. mouse over하면 tooltip이 뜬다.
- abbr 태그: 어떤 단어의 축약을 표현한다.
- cite 태그: 어떤 작품의 제목을 표현한다. 노래, 그림, 영화 등.
- small 태그: 앞의 내용에 부가적인 설명을 표현한다.

### 루비 주석과 시간의 표현

- ruby 주석: 글자 위에 부가적으로 글자를 표현할 때 쓴다.
- time 태그: datetime을 통해서 정확한 날짜 시간을 표현할 수 있다. 물론 화면에 나타나진 않는다.

```html
<p>논문 발표일은 <time datetime="2020-03-16">2020년 3월 16일</time>입니다.</p>
```

- 외국인의 경우 월, 일이 뭘 의미하는지 모르기 때문에 태그를 봤을 때 정확한 파악이 가능해진다.
- 2020-30-16T09:20:00 T이후에 시 분 초 표현이 가능하다.
