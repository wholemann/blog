---
title: "코드스피츠 코틀린JS로 배우는 코틀린 기초"
date: "2020-02-03 00:09:25 +0900"
template: "wiki"
draft: false
slug: "/wiki/code-spitz"
category: ""
tags:
---

continuation == callback

CPS? continuation(callback)을 passing하는 스타일의 프로그래밍.

blocking? 명령이 수행될 때 어떤 명령이 오래동안 cpu를 점유하는 것.
단 한줄의 console.log도 점유.
하지만 상황마다 그 점유 시간에 따라 상대적으로 결정됨.
결국 blocking nonblocking은 상대적.

동기 비동기는 전혀 다른 얘기.

sync = 노이만 머신 메모리에 적재된 명령을 순서대로 빼서 수행하는 것.
async = 명령이 적재된 순서대로 수행되지 않음. 프로그램이 임의의 순서로 메모리에 적재된 명령을 수행함.

sync blocking = 컴퓨터 죽음
sync nonblocking = 이런 경우가? 지금 실행 중인 쓰레드 안에서는 불가능. 해당 쓰레드는 sync 다른 백그라운드 쓰레드는 nonblocking. 자바 Future.

async blocking = Node MySQL. sync blocking보다 찾기도 힘들다.
async nonblocking = 이걸 추구해야함.

sync blocking 스타일로 프로그램을 짜면서 async nonblocking으로 동작하게 하고 싶음.

tail recursive가 가능한 플랫폼인지 아닌지 모르기 때문에 코틀린 컴파일러가 그걸 판별해서 최적화 해줌.
반환형을 추론할 수 없어서 명시적으로 해야됨.

```kotlin
fun fact(n: Int) = _fact(n, 1)
tailrec fun _fact(n: Int, a: Int): Int = if (n == 0) a else _fact(n - 1, n * a)
```

factorial CPS

_fact한테 앞에 받아왔던 callback을 passing

```kotlin
fun factCPS(n: Int, block: (Int) -> Unit) = _factCPS(n, 1, block)
tailrec fun _factCPS(n: Int, a: Int, block: (Int) -> Unit) {
    if (n == 0) block(a) else _factCPS(n - 1, n * a, block)
}
```

continuation은 함수만 얘기하는 건 아니다. callback 역할을 하는 객체가 됐든 함수가 됐든.

최종적으로 continuation한테 레포팅을 하는 방식.

```kotlin
factCPS(3, ::println)
```

CPS style에서는 예외도 report로 받으면 됨. 나의 범위 내에서 처리.

```kotlin
fun factThrow(n: Int) = _factThrow(n, 1)
fun _factThrow(n: Int, a: Int): Int = when {
    n < 0 -> throw Throwable("invalid value: $n")
    n == 0 -> a
    else -> _fact(n - 1, n * a)
}

try {
    println(factThrow(-3))
} catch (e: Throwable) {
    println(e)
}
```

throw에 대해선 tailrec은 조건을 만족하지 못함.
언어마다 tailrec 판별 조건이 다름.

저건 언어 구조를 이용한 에러처리는 좋지 않음.
예외로직 구간을 설정하면 명령을 계속 감시하기 때문.
그래서 예외라는 건 과부하가 걸림.

예외의 더 큰 문제는 조건 분기. 그 안에 또 예외가 발생하면 끝이 없음.

코틀린에선 반드시 catch해야만 하는 예외 자체를 없애버림.

### factorial CPS Exception

예외도 레포트의 한 종류일 뿐.

```kotlin
fun factCPSEx(n: Int, block: (Int) -> Unit, ex: (String) -> Unit = {}) = _factCPSEx(n, 1, block, ex)
tailrec fun _factCPSEx(n: Int, a: Int, block: (Int) -> Unit, ex: (String) -> Unit) {
  when {
      n < 0 -> ex("invalid value: $n")
      n == 0 -> block(a)
      else -> _factCPSEx(n - 1, n * a, block, ex)
  }
}

factCPSEx(-3, ::println, ::println)
```

### CPS 장점

1. 우리가 레포팅 할 시점을 고를 수 있다는 점.
2. 예외를 포함한 기존의 제어문이 관여했던 부분도 CPS 객체 안에서 해결 가능.

### Continuation & Sequence

```kotlin
class Cont<T> {
  var state = 0
  var isCompleted = false
  var result: T? = null
  fun resume(v: T) {
      state++
      result = v
  }
  fun complete(v: T) {
      isCompleted = true
      result = v
  }
}
```

```kotlin
fun continuation1(a: Int, cont: Cont<Int>? = null) = run {
  var v: Int
  val c = if (cont == null) {
      v = a
      Cont()
  } else {
      v = cont.result!!
      cont
  }
  when (c.state) {
      0 -> {
          v++
          println("state $v")
          c.resume(v)
      }
      1 -> {
          v++
          println("state $v")
          c.resume(v)
      }
      else -> {
          v++
          println("state $v")
          c.complete(v)
      }
  }
  c
}
```

```kotlin
fun main(args: Array<String>) {
    var cont = continuation1(3)
    while (!cont.isCompleted) {   // hasNext()
        cont = continuation1(3, cont) // next()
    }
    println(cont.result)
}
```

### Sequence to Iteration

결국 위의 코드는 이터레이션에 가까움.

Sequence(고유명사) = continuation 구문을 자동으로 만들어주는 iteration 생성기

```kotlin
val s = sequence {
    var v = 3
    v++
    println("state $v")
    yield(v)
    v++
    println("state $v")
    yield(v)
    v++
    println("state $v")
    yield(v)
}
```

yield로 iteration을 나눔.

sequence ~ yield는 sync blocking 코드로 보이게 해줌.

컴파일러가 sequence block을 우리 대신 continuation 객체를 이용한 코드로 바꿔줌.

사실은 수신 객체 지정 함수라 sequence context가 수신 객체로 들어감. 그래서 사실은 this.yield 와 같음.

```kotlin
override suspend fun yield(value: T) {
    nextValue = value
    state = State_ready
    return suspendCoroutineUninterceptedOrReturn { c ->
        nextStep =c
        COROUTINE_SUSPENDED
    }
}
```

suspendCoroutineUninterceptedOrReturn 에 람다에 주어지는 인자 c가 continuation.

suspend 는 분할해줘야 하는 하나의 코드 지점.
resume 은 suspend된 지점부터 다시 재개.

suspendCoroutineUninterceptedOrReturn 이 명령덕에 컴파일러가 코드를 나눌 수 있음. 컴파일러에게 알려주는 것.

컴파일러가 Continuation\<T>을 만들어서 줌. 그래서 람다에서 받는 것.
result 값의 Type이 T가 됨.

co

```kotlin
class State {
    var result = "
    lateinit var target: Promise<Response>
}

sequence {
    val s = State()
    s.target = window.fetch(Request("a.txt"))
    yield(s)
    s.target = window.fetch(Request(s.result))
    yield(s)
    println(s.result)
}
```

외부에서 원하는 타이밍에 제네레이터 안의 iteration을 하게 해줌.

코틀린처럼 단방향인 경우
시퀀스 밖에서 안으로 값을 줄 방법이 없다.

즉, iteration 중간에 밖에서 값을 공급 받을 수 없음.

대화를 위해선 양방향을 통신을 위한 메모리 공간을 갖고 있는 객체의 속성을 통해
sequence 안에서 통신이 가능.

```kotlin
fun co(it: Iterator\<State>? = null, sep: SequenceScope\<State>? = null) {
    val iter = it ?: sep?.iterator() ?: throw Throwable("invalid")
    if (iter.hasNext()) iter.next().let { state ->
      state.target.then { it.text() }.then {
        state.result = it
        co(iter)
      }
    }
}

co(sequence {
    val s = State()
    s.target = window.fetch(Request("a.txt"))
    yield(s)
    s.target = window.fetch(Request(s.result))
    yield(s)
    println(s.result)
})
```

yield 에서 State type을 확정했기 떄문에 SequenceScope의 T는 State.

처음에만 sequence에서 오고 그 다음엔 iterator로 돌아감.

### suspend & coroutine

sequence & continuation resume으로 결국 번역됨.
이걸 추상화해서 위의 레이어에 있는 객체끼리 통신으로 표현함.

서브루틴? 반복 사용되는 로직을 함수에 가둬놓고 호출하면서 여러번 재활용. 서브루틴은 인자, 리턴값이 있어서 서브루틴 내부가 위에서부터 아래로 한번에 실행.

일반적인 코루틴? 함수의 진입점과 리턴은 있을지라도 중간에 빠져나오고 진입할 수 있는 yield 가 있음. 여러번 진입-나오기-진입-나오기 할 수 있는 루틴.

코틀린 코루틴은 아예 고유명사. 그냥 또다른 생태계임.

CoroutineContext (가장 중요)
get(key): Element

CoroutineContext 얘는 그냥 Element란 애의 컨테이너.

CoroutineContext -> Element에 의존.

CoroutineContext : Element
구상체이자 컨테이너.

Job, Dispatcher는 모두 Element 상속

Dispatcher가 위의 co함수에 해당하는 시퀀스 실행기.

Job? Sequence가 만든 iteration 객체 하나 하나.

결국 CoroutineContext는 Job이랑 Dispatcher를 모두 소유.
하나의 Dispatcher와 다수의 Job으로 이뤄져 있음.

Job의 메소드 호출에 따라 continuation을 호출하는 타이밍을 조절할 수 있음.
추상화 해놓음.

Deferred : Job
Promise같은 비동기 처리를 위한 객체.

동기 Job start() -> join() resume
비동기 Deferred await시점에 resume

coroutine builder: Job, Deferred 만들 수 있는 함수.
launch() -> Job 생성

async() -> Deferred 생성

yield를 통해 suspendCoroutine을 섹션마다 실행했다면

이동네 전체를 한꺼번에 suspendCoroutine 하라는 키워드. 그게 suspend.
Job, Deferred의 await를 기준으로 자동으로 continuation 컴파일러가 섹션을 만들어줌.

일반적인 코루틴이란 결국 언어의 특정 문법을 사용하면 컴파일러가 switch continuation 으로 바꿔주는 걸 말함.

CPS 장점은 예외처리를 CPS 내에서 일반적인 메소드로 처리할 수 있음.
suspendCancellableCoroutine resumeWith가 있음.

```kotlin
suspend fun <T> Promise<T>.await(): T = suspendCancellableCoroutine {
    cont: Cancellablecontinuation<T> ->
    this.then(
        onFulfilled = { cont.resume(it) },
        onRejected = { cont.resumeWithException(it) })
    )
}
```

launch 나 async 로 만든 Job이 continuation 섹션을 나눠주는 건 아니고
Job 같은 경우 내부에서 스타팅 모드를 결정.

context = 지금 생성산 Job을 어느 컨테이너(CoroutineContext)에 넣을지 결정.
start = CoroutineStart.DEFAULT
디폴트 모드는 Job을 만들자 마자 스타트를 시작함.
Lazy 모드는 사용자가 수동으로 스타트하게 해야함.
Job은 리턴값이 없어서 안에 block을 무조건 실행.
안에 블록도 suspended block이라 다시 suspend(비동기) 요소를 가져올 수 있음.

```kotlin
suspend fun main(args: Array<String>) {
    GlobalScope.launch(
        context = EmptyCoroutineContext,
        start = CoroutineStart.DEFAULT
    ) {
        timeout(1000)
        println("a")
    }
    GlobalScope.launch(
            context = Dispatchers.Default,
            start = CoroutineStart.DEFAULT
    ) {
        timeout(1000)
        println("b")
    }
}
```

Dispatchers.Default 넘기면 자동으로 Dispatcher를 담고 있는 EmptyCoroutineContext 컨테이너를
만들어줌.

Dispatcher는 시스템이 제공하는 3종이 있는데 어떤 Dispatcher를 고르냐에 따라 어떤 쓰레드에서
실행될지 결정됨.

자바스크립트는 싱글 쓰레드 모드. Node환경일 땐 processTick.
브라우저 = timeout, requestAnimationFrame, windowMessageQueue 등

각 플랫폼에 맞게 실행기가 선택됨.

위의 실행 결과는 1초 후 a, b가 동시에 나타남.

```kotlin
GlobalScope.launch(
        context = EmptyCoroutineContext,
        start = CoroutineStart.DEFAULT
    ) {
        timeout(1000)
        println("a")
    }.join()
GlobalScope.launch(
            context = Dispatchers.Default,
            start = CoroutineStart.LAZY
    ) {
        timeout(1000)
        println("b")
    }.start()
```

LAZY는 start()를 했을 때 시작.

join()을 걸면 1초 후에 a가 나왔을 때 b 출력 Job이 시작됨.

Job은 block 안에서 suspend 구문을 지원하긴 하지만 무조건 위에서 아래로 흐르는 구문만 지원.
return값이 없고 block 안이 무조건 실행.
로켓처럼 그냥 날아가버림. 내 손을 떠난다. => launch.

block 안에서 continuation resume을 직접 호출할 수 없음.

Job, Deferred를 쓸 때의 문제점
우리가 continuation resume의 통제권을 잃어버리게 됨.

block 내에서 continuation 통제는 불가능.

```kotlin
val a = GlobalScope.async(
            context = EmptyCoroutineContext,
            start = CoroutineStart.DEFAULT
    ) {
        timeout(1000)
        "a"
    }
    val b = GlobalScope.async(
            context = EmptyCoroutineContext,
            start = CoroutineStart.DEFAULT
    ) {
        timeout(1000)
        "b"
    }
    println(a.await())
    println(b.await())
```

Deferred 객체는 결과값(return)이 나온다.
단, async가 만드는 건 미래의 어떤 값을 반환할 Deferred 객체지 어떤 값을 직접 반환하는 건 아님.

디폴트 모드라 Deferred 객체가 생성된 후 바로 스타트. 그래서 1초 후 동시에 "a" "b" 나옴.

launch랑은 달리 async는 외부 세계와 대화가 가능.
block 내부의 값을 await를 통해 노출 가능.

```kotlin
val b = GlobalScope.async(
            context = EmptyCoroutineContext,
            start = CoroutineStart.LAY
    ) {
        timeout(1000)
        "b"
    }
    b.start()   // LAZY여도 바로 스타트를 하면?
    println(a.await())
    println(b.await())
```

LAZY라면? await할 때 어쩔 수 없이 시작함.(강제 시작)

그러나 바로 스타트를 하면 "a" "b"가 1초 뒤 동시에 나옴.

Job, Deferred를 쓰면 내부에서 low level의 continuation을 만나지 않는다.
중간에 제어구문들도 상태값을 가지고 있어서 cancel 등 여러 가지 제어를 추상화 해놓음.
다만, resume을 직접 우리가 호출할 권한은 상실됨.

```kotlin

suspendCoroutine

// suspendCoroutine을 추상화
suspend fun <T> task(block: ((T) -> Unit) -> Unit): T = suspendCoroutine {
    cont: Continuation<T> -> block { cont.resume(it) }
}

// launch, async를 추상화.
fun <T> async(block: suspend CoroutineScope.() -> T) = GlobalScope.async { block() }
fun launch(block: suspend CoroutineScope.() -> Unit) = GlobalScope.launch { block() }

```

콜백을 사용하면 어휘 공간이 공유되지 않아서 넘겨준 쪽의 어휘를 가져올 수가 없음.
suspend 함수는 로컬 컨텍스트에서 모두 처리되어 다중 비동기 상황에서 함수간 컨텍스트 전환 문제를 고민할 필요가 없음.
