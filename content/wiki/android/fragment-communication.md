---
title: "Android fragment communication"
date: "2019-12-06 13:40:48 +0900"
template: "wiki"
draft: false
slug: "/wiki/fragment-communication"
category: ""
tags:
---

# Fragment 통신방법

프레그먼트 통신방법

1. 공용 ViewModel
2. interface 구현
3. 이벤트 버스 ( RxJava, Otto(Deprecated))

번호순으로 추천.

AAC ViewModel 이용하면 액티비티를 통해 공통된 ViewModel을 

ViewModelProviders로부터 얻을수 있음.

뷰모델내에 LiveData등을 이용해서 프레그먼트간 싱크를 맞출수 있음.
