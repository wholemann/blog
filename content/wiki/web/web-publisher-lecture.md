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

- ruby 주석: 글자 위에 부가적으로 글자를 표현할 때 사용한다.
- time 태그: datetime을 통해서 정확한 날짜 시간을 표현할 수 있다. 물론 화면에 나타나진 않는다.

```html
<p>논문 발표일은 <time datetime="2020-03-16">2020년 3월 16일</time>입니다.</p>
```

- 외국인의 경우 월, 일이 뭘 의미하는지 모르기 때문에 태그를 봤을 때 정확한 파악이 가능해진다.
- 2020-30-16T09:20:00 T이후에 시 분 초 표현이 가능하다.

### 제목, 문단, 연락처, 인용문

h 태그에는 p 태그가 들어갈 수 없고, p 태그 안에 또다른 p 태그나 h 태그가 들어갈 수 없다.

- h 태그: 제목을 표현할 때 사용한다.
- hr 태그: 가로 구분선이 나타난다. hr을 기준으로 다른 내용이 나온다는 걸 표현한다.
- p 태그: 단락을 표현할 때 사용한다.
- address 태그: 주소, 연락처, 이메일 주소 등을 표현할 때 사용한다.
- blockquote 태그: 인용문을 표현할 때 사용한다.

눈이 안 보이는 경우 웹 사이트의 내용이 소리로 들리게 되는데 내용이 많을 경우 들어야 될 소리가 길어지므로
title 속성을 통해 짧게 요약된 문장으로 듣고 지나갈 수 있다.
HTML5부터는 footer를 이용해서 출처를 나타낸다.

```html
<blockquote title="웹이란'장애에 구애 없이 모든 사람들이 손쉽게 정보를 공유할 수 있는 공간'이라고 정의">
  <p>월드 와이드 웹 (World Wide Web)을 창시한 팀 버너스 리(Tim Berners-Lee)는 웹이란
    '장애에 구애 없이 모든 사람들이 손쉽게 정보를 공유할 수 있는 공간'이라고 정의하였으며,
    웹 콘텐츠를 제작할 때에는 장애에 구애됨이 없이 누구나 접근할 수 있도록 제작하여야
    한다고 하였다. 이렇듯 웹 창시자가 웹의 기본적 철학에서 웹 접근성 부문을 강조함에도 불구하고,
    웹 접근성을 바라보는 입장에 따라 다르게 정의하고 있다.</p>
  <footer>출처 : <cite><a href="https://www.wah.or.kr:444/Accessibility/define.asp">웹 접근성 연구소 &gt; 웹 접근성이란?</a></cite></footer>
</blockquote>
```

- pre 태그: 입력한 형태 그대로 표현해주는 태그로 줄 바꿈, 공백 표현, 코드를 보여주고 싶을 때 사용한다. 다른 태그에선 공백을 아무리 넣어도 실제론 한 칸만 공백이 생기기 때문이다.

### 목록 작성하기

- ul 태그: 순서가 없는 목록을 표현하는 태그이다. p 태그, h 태그는 올 수 없다. 반드시 li 태그만 있어야 한다.
- li 태그: li 안에는 거의 모든 태그를 사용할 수 있다.
- ol 태그: 순서가 있는 목록을 표현하는 태그이다. ex) \<ol type="a"> -> a, b, c, d.

- dl 태그: 정의를 위한 항목들의 리스트. dt, dd 태그를 자식으로 가진다. 두 태그 모두 있어야 한다.
- dt 태그: 안에 inline 태그만 사용할 수 있다. 제목과 같은 역할. 여러 dd를 가질 수 있다.
- dd 태그: 안에 어떠한 태그든 사용할 수 있다. 내용의 역할.

### 테이블 작성하기

웹 표준에선 table을 이용해서 레이아웃을 작성해서는 안 된다. 그러나 이곳 저곳 쓰이는 곳이 많다.
그룹핑을 한다면 tbody는 필수지만 thead, tfoot은 생략 가능하다. thead, tfoot만 있는 건 불가능하다.
colspan, rowspan으로 열이나 행을 합칠 수 있다.

- table 태그: 표를 표현하는 태그.
- tr 태그: 표에서 행을 표현하는 태그.
- td 태그: 셀 하나 하나를 표현한다.
- caption 태그: 표의 제목을 표현한다.
- thead 태그: 표에서 헤더를 표현하는 부분.
- th 태그: table header cell. scope가 필수 속성으로 제목이 표현하는 방향, 범위를 지정한다.
- tbody 태그: 헤더 외에 본문을 표현하는 부분.
- tfoot 태그: 표의 최하단을 표현하는 부분.

```html
<table border width="100%">
  <caption>table caption</caption>
  <colgroup>
    <col width="25%">
    <col width="25%">
    <col width="25%">
    <col>
  </colgroup>
```

위와 같이 colgroup을 통해서 컬럼의 크기를 조절할 때는 마지막 col의 크기를 지정하지 않는 게 좋다. 브라우저마다 col을 계산하는 방식이 조금씩 다르기 때문이다.

### a요소 알아보기

- a 태그: anchore. 클릭해서 링크로 페이지를 이동할 때 사용한다.

```html
<ul>
  <li><a href="http://daum.net">daum</a></li>
  <li><a href="http://daum.net" title="다음으로 이동">daum</a></li>
  <li><a href="http://daum.net" target="_blank">daum 새 탭으로 열기</a></li>
  <li><a href="img/photo.jpg" tabindex="1" download>포도이미지</a></li>
  <li><a href="mailto:gowgow0606@naver.com">gowgow0606@naver.com</a></li>
  <li><a href="./01-char.html">문자참조</a></li>
</ul>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
  <a href="http://wah.or.kr" accesskey="w" tabindex="2">웹 접근성 연구소</a>
</p>

<!-- accesskey : 단축키 지정 -->
<!-- tabindex(탭으로 이동하는 순서 지정) : a, input, button, select, textarea, ... -->
```

### img요소 알아보기

- img 태그: 이미지를 나타내기 위해 사용한다.
- alt 속성: 대체 텍스트. 경로가 깨져서 그림이 뜨지 않을 때 텍스트가 나온다. 음성으로 읽어준다. 접근성 확보. 필수 속성.
약도 같은 경우 잘 요약해서 적어주면 그림이 없어도 음성으로 파악가능.
- title 속성: 내용 요약. 요즘엔 alt에 넣는게 접근성 측면에서 더 좋음.
- longdesc 속성: 긴 설명이 필요할 때 별도의 설명 파일을 링크해주면 해당 문서를 음성으로 읽어주게 할 수 있다.
요즘은 css text-indent로 설명을 화면 밖으로 밀어놓고 그림만 띄워놓는다. 음성으로 해당 설명을 읽게 하면 된다.

### 이미지맵 만들기

- imagemap 태그: 요즘은 잘 사용하진 않지만, 이미지는 하나인데 이미지 안에 영역을 여러개로 나누고 싶을 때 사용한다. ex) 전국 지도 같은 것.
- usemap 속성에 #을 붙이고 이름을 정한 뒤 name, id 속성 값에 연결한다.
- coords 사각형(rect)은 영역의 대각선 시작점 끝점을 좌표로 지정한다.
- 원형(circle)은 원의 중심과 반지름을 지정한다. "x, y, r"
- 다각형(poly)은 각 꼭지점의 좌표를 지정한다.

```html
<p>
  <img src="img/map.png" usemap="#map" alt="">
  <map name="map" id="map">
    <area shape="rect" coords="15, 25, 218, 84" href="http://google.com/" alt="구글로 이동">
    <area shape="circle" coords="308, 55, 50" href="http://daum.net/" alt="다음으로 이동">
    <area shape="poly" coords="550, 34, 570, 48, 570, 65, 550, 78, 532, 65" href="http://nate.com/" alt="네이트로 이동">
  </map>
</p>
```

### 아이프레임 알아보기

- iframe 태그: 다른 페이지의 문서를 삽입하기 위해 사용한다.

보안상 iframe으로 접근이 안 되는 페이지들이 있다. 그래서 sandbox 속성을 지정해서 script 코드는 실행되지 않지만 접근은 가능해진다. 근데 요즘은 거의 막아놓은 듯.

### 폼 컨트롤 알아보기

get 방식 전송에선 name으로 지정된 '필드값=값' 이 url 뒤에 붙는다.
fieldset으로 여러 필드를 묶어줄 수 있다.

label의 for와 input의 id를 연결할 수 있다.

```html
<form action="go.php" method="post">
  <fieldset>
    <legend>fieldset legend</legend>
    <p>
      <label for="name">이름</label>
      <input type="text" id="name" name="name" value="">
    </p>
    <p>
      <label for="idname">아이디</label>
      <input type="text" id="idname" name="idname" value="">
      <input type="button" value="아이디 중복확인">
    </p>
    <p>
      <label for="userpass">비밀번호</label>
      <input type="password" id="userpass" name="userpass" value="">
    </p>
    <p>
      <label for="usercomm">의견</label>
      <!-- cols는 글자수로 보면 된다. rows는 줄 수. -->
      <textarea name="usercomm" id="usercomm" cols="30" rows="10"></textarea>
    </p>
    <p>
      <label for="usersel">지역선택</label>
      <select name="usersel" id="usersel">
        <option value="">서울</option>
        <option value="">부산</option>
        <option value="">광주</option>
        <option value="">대구</option>
        <option value="">대전</option>
      </select>
    </p>
    <p>
      <span>성별</span>
      <label for="">남자</label>
      <input type="radio" id="male" name="choice" value="male">
      <label for="female">여자</label>
      <input type="radio" id="female" name="choice" value="female">
      <!-- name값을 같게 해야 같은 그룹으로 묶인다. -->
    </p>
    <!-- <p>
      <span>취미는?</span>
      <label for="trip">여행</label>
      <input type="checkbox" id="trip" name="" value="trip">
      <label for="read">독서</label>
      <input type="checkbox" id="read" name="" value="read">
      <label for="movie">영화감상</label>
      <input type="checkbox" id="movie" name="" value="movie">
    </p> -->
    <p>
      <span>취미는?</span>
      <label>여행<input type="checkbox" id="trip" name="" value="trip"></label>
      <label>독서<input type="checkbox" id="read" name="" value="read"></label>
      <label>영화감상<input type="checkbox" id="movie" name="" value="movie"></label>
    </p>
    <!-- radio, checkbox는 위와 같이 label for 속성을 쓰지 않고 input을 label로 감싸서 많이 쓴다. -->
  </fieldset>
  <p>
    <!-- <input type="submit" value="전송"> -->
    <button type="submit">전송</button>
    <!-- <input type="reset" value="취소"> -->
    <button type="reset">취소</button>
    <!-- button은 기능적으론 input과 같지만 종료 태그가 있어 안에 내용물(아이콘 같은 것)을 코드로 짜서 나타낼 수 있다. -->
  </p>
</form>
```

### html5에서 추가된 폼 컨트롤과 속성들

```html
<!-- novalidate는 문법 검증을 안 하는 것으로 설정된다. -->
<form action="#" method="post" novalidate="novalidate">
  <fieldset>
    <legend>html5 form</legend>
    <p>
      <label for="username">이름</label>
      <!-- autofocus 처음에 포커스를 줄 부분을 정한다. 1개만 설정 가능. -->
      <!-- autocomplete는 기본적으로 on. -->
      <input type="text" id="username" name="username" value="" placeholder="user name" autofocus="autofocus" autocomplete="off">
    </p>
    <p>
      <label for="useremail">이메일</label>
      <!-- required는 필수 입력 지정 항목. -->
      <input type="email" id="useremail" name="useremail" value="" placeholder="usermail@host.com" required="required">
    </p>
    <p>
      <label for="userurl">웹사이트</label>
      <input type="url" id="userurl" name="userurl" value="" disabled="disabled">
    </p>
    <p>
      <label for="order">주문수량</label>
      <input type="number" id="order" name="" min="1" max=20" value="3">
      <span>개</span>
    </p>
    <p>
      <label for="userrange">길이</label>
      <input type="range" id="userrange" name="userrange" min="0" max="100" step="10" value="30">
    </p>
    <p>
      <label for="userdate">제출일</label>
      <input type="date" id="userdate" name="userdate" min="2020-01-01" max="2020-10-10" value="2020-03-17">
    </p>
    <p>
      <label for="usercolor">색상선택</label>
      <input type="color" id="usercolor" name="usercolor" value="#11b815">
    </p>
    <p>
      <label for="usertel">연락처</label>
      <input type="tel" id="usertel" name="usertel" value="">
    </p>
    <!-- 모바일에서 input type에 맞춰서 적절한 자판으로 바뀌기 때문에 지키는 게 좋다. -->

  </fieldset>
  <input type="submit" name="" id="" value="Send">
</form>
</body>
</html>
```

## 웹페이지 코딩 실습

### 그룹화와 섹셔닝

중요한 영역은 id, 다소 부가적인 영역인 class. id는 링크의 목적지를 가리킨다.

#### sectioning 요소

sectioning 요소에서 시작은 h 태그(제목)로 시작하는 게 권장이다.

- section
- article
- nav
- aside

sectioning 요소는 아니지만 HTML5에 새로 추가된 요소

- header
- footer

IE 9 미만에서는 HTML5 적용이 안 되기 때문에 sectioning 요소를 사용한 경우
[html5shiv](https://github.com/aFarkas/html5shiv) 를 사용해야한다.

```html
<!--[if lt IE 9]>
  <script src="js/html5shiv.js"></script>
  <![endif]-->
```

### 웹 페이지 제작(Markup) 실습

content(본문)을 id로 해야하는 이유는 최상단에서 본문 바로가기와 같은 기능을 링크로 제공하기 위함이다. 탭 키를 누르면 본문 바로가기를 입력할 수 있다. 음성으로 매번 페이지를 이동할 때마다 메뉴 내용을 중복해서 듣지 않고 바로 본문으로 갈 수 있게 하기 위함이다.
