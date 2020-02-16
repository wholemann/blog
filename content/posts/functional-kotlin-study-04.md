---
title: 함수형 코틀린 스터디 4회차
date: "2020-02-09"
template: "post"
draft: false
category: "스터디"
slug: "/posts/functional-kotlin-study-04/"
tags:
  - "Kotlin"
  - "Study"
  - "Functional programming"
description: "Delegate, Coroutine, Continuation Passing Style에 대하여"
---

이번 스터디에선 코틀린의 Delegate의 진짜 의미와 코틀린의 비동기 처리 방식인 코루틴에 대해서 알아본 시간이다. 코루틴을 공부할 때 일단 동시성과 비동기에 대한 이해가 부족해서 상당히 힘들었다. 다행스럽게도 스터디 이후 코루틴, 비동기, 동시성에 대해 조금은 이해도가 높아져서 기분이 좋다. Delegate부터 차례로 복기해보도록 하겠다.

## Delegate

delegate에는 property delegate와 class delegate 두 종류가 있다.
이 두 delegate는 완전히 다른 개념이다.

### Delegated Property

어떤 변수나 필드에 값을 할당하는 것이 아닌 Delegate 객체에게 맡기는 것.
getValue, setValue를 operator 오버로딩을 구현한 객체를 by로 할당해주면 된다.

```kotlin
var notNullStr:String by Delegates.notNull<String>()

fun main(args: array<String>) {
  notNullStr = "초기 값"
  println(notNullStr)
}
```

객체를 할당하고 내부의 값을 얻으려면 notNullStr.getValue를 해야하지만 by 키워드로 Delegate 객체를 할당하면 notNullStr로 값을 불러올 수 있다. 결국 델리게이트는 편의 문법이다.

여기서 주의할 점은 Delegate 객체라는 건 존재하지 않는다. 어떠한 객체든 operator getValue, setValue를 구현하면 by로 해당 변수에 delegate가 가능하다.
getValue만 구현한다면 val에만 setValue도 구현한다면 var에 까지 delegate가 가능해진다.

```kotlin
abstract class MakeEven(initialValue: Int) {
  private var value: Int = initialValue

  operator fun getValue(thisRef: Any?, property: KProperty<*>) = value
  operator fun setValue(thisRef: Any?, property: KProperty<*>, newValue: Int) {
    val oldValue = newValue
    val wasEven = newValue % 2 == 0
    if (wasEven) {
      this.value = newValue
    } else {
      this.value = newValue + 1
    }
    afterAssignmentCall(property, oldValue, newValue, wasEven)
  }

  abstract fun afterAssignmentCall(property: KProperty<*>, oldValue: Int, newValue: Int, wasEven: Boolean): Unit
}
```

여기서 afterAssignmentCall 함수는 변수에 새로운 값이 할당될 때마다 마치 listener에 할당된 콜백처럼 쓸 수 있다.

```kotlin
inline fun makeEven(
  initialValue: Int,
  crossinline onAssignment: (
    property: KProperty<*>,
    oldValue: Int,
    newValue: Int,
    wasEven: Boolean) -> Unit) = object : MakeEven(initialValue) {
        override fun afterAssignmentCall(property: KProperty<*>, oldValue: Int, newValue: Int, wasEven: Boolean) =
            onAssignment(property, oldValue, newValue, wasEven)
    }
```

```kotlin
var myEven: Int by makeEven(0) {
  property, oldValue, newValue, wasEven ->
    println("${property.name} $oldValue -> $newValue, Even: $wasEven")
}

fun main(args: Array<String>) {
  myEven = 6
  println("myEven: $myEven")  // 6
  myEven = 3
  println("myEven: $myEven")  // 4
  myEven = 5
  println("myEven: $myEven")  // 6
  myEven = 8
  println("myEven: $myEven")  // 8
}
```

위의 코드를 보면 알겠지만 실제 사용할 땐 변수처럼 쓰고 있다. 할당 연산자가 곧 setValue처럼 됨을 알 수 있다. 홀수가 들어가도 setValue에 구현된 로직에 따라 +1 된 짝수로 변환됨을 볼 수 있다.

코틀린 컴파일러는 해당 변수에 대해서 여러 가지를 알고 있기 때문에 Kotlin reflection에 의해서 우리가 선언한 변수나 필드는 KProperty란 것으로 번역된다. 함수는 KFuntion으로, 클래스는 KClass로 번역된다.

그래서 위의 코드에서 변수명은 myEven이기 때문에 getValue 파라미터에 있는 KProperty는 myEven이라는 이름을 갖고 있다. 그래서 함수 내부에서 property.name을 하면 myEven이라는 이름을 얻을 수 있다.

따라서 실제로 컴파일러는 다음과 같은 코드로 변환한다.

```kotlin
var myEven: Int
        get() = myEven$delegate.getValue(this, KProperty.myEven)
        set(value: Int) = myEven$delegate.setValue(this, KProperty.myEven, value)
```

만약 setValue를 구현하지 않는다면 다음과 같은 에러를 만나게 된다.

>Type 'MakeEven' has no method 'setValue(Nothing?, KProperty<*>, Int)' and thus it cannot serve as a delegate for var (read-write property)

```kotlin
abstract class MakeEven(initialValue: Int) {
  private var value: Int = initialValue

  operator fun getValue(thisRef: Any?, property: KProperty<*>) = value
  
  abstract fun afterAssignmentCall(property: KProperty<*>, oldValue: Int, newValue: Int, wasEven: Boolean): Unit
}


// compile error here
var myEven: Int by makeEven(0) {
    property, oldValue, newValue, wasEven ->
    println("${property.name} $oldValue -> $newValue, Even: $wasEven")
}
```

setValue를 구현하지 않은 경우 var에 할당할 수 없음을 확인했다.
또한 setValue getValue에서 Type을 컴파일러가 알 수 있기 때문에 myEven: Int by 앞에 Int 타입을 생략해도 타입 추론으로 문제가 안 생긴다.

### Delegated Map

```kotlin
data class Book(val delegate: Map<String, Any?>) {
  val name: String by delegate
  val authors: String by delegate
  val pageCount: Int by delegate
  val publicationDate: Date by delegate
  val publisher: String by delegate
}
```

위의 코드가 가능한 이유는 표준 코틀린 Map이 getValue, setValue를 구현하기 때문이다. 근데 특이한 점은 각 property마다 데이터 타입이 다른데 델리게이트에 문제가 없다. 아래와 같이 Generic이 아니라면 설명이 되질 않는다.

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>) : T {
  return this[property.name] as T
}
```

다른 operator와 달리 getValue, setValue는 Generic을 받을 수 있다. 예를 들어 pageCount가 Int 타입이므로 반환 받을 변수의 타입을 바탕으로 Generic이 추정되므로 호출할 때 이미 T가 Int로 들어가는 것이다.

>**There is no magic.**

### 코틀린 Operator의 정체

자바는 언어의 공통 기능을 Top level 객체인 Object에 넣어놨다. 위와 같은 편의 기능을 구현하기 위해선 시스템 컴파일러가 Object에 있는 내장 메소드를 통해 처리해줬다. 여기서 발생하는 문제는 우리가 공통 기능을 넣고 싶으면 Object를 건드려야 하는데 Object는 sealed이기 때문에 우리가 건들 수 없다. 그래서 공통 기능을 만들고 싶으면 어플리케이션에 등장하는 모든 객체가 상속하는 Top level 객체를 만들어야 한다. 그러나 내가 만든 Top level 객체가 내가 쓰는 라이브러리의 Top level 객체는 아니기 때문에 언어 전반에서 사용할 수 있는 공통 기능은 사실상 구현이 불가능했다.

클래스 상속 구조를 뛰어넘는 AOP 개념의 횡단 관심사를 연결할 방법을 찾아야 언어 공통 편의 기능을 추가할 수 있다. 그래서 아무 객체에나 operator를 넣으면 상속 구조와 상관없이 끊임없는 확장이 가능해진다. 결국 operator가 선언된 fun을 보면 컴파일러는 이부분을 Joinpoint로 보는 것이다. 바로 이 부분이 operator의 정체이다. AOP 구현을 위해선 프레임워크 레벨에서 리플렉션을 이용해야 했지만, 코틀린에선 operator를 이용해 컴파일 타임에 AOP가 가능해진 것이다. 코틀린이 가진 뛰어난 언어 디자인을 엿볼 수 있는 부분이다.

### Delegated Class

클래스 위임은 `by` 뒤에 클래스나 인터페이스가 아닌 위임할 인스턴스가 온다.

```kotlin
interface Person {
    fun printName()
}

class PersonImpl(val name: String) : Person {
    override fun printName() {
        println(name)
    }
}

class User(val person: Person) : Person by person
```

위와 같이 코드를 선언하면 User를 생성할 때 주입받은 person 객체의 override된 printName을 사용한다. 즉, person 인스턴스로부터 Person의 동작을 복사해온다. 위임을 쓰지 않는다면 아래와 같이 override 메소드를 구현해야 될 것이다.

```kotlin
class User(val person: Person) : Person {
    override fun printName() {
        // ...
    }
}
```

만약 person 인스턴스에 위임하고 싶은 부분은 구현하지 않고 `by` 키워드를 통해서 위임하고, 자체적인 동작을 정의하고 싶은 인터페이스 메소드가 있다면 override로 구현하면 된다.

또한 위임은 다중으로 가능한데 이 때는 `,`를 통해 구분한다.

```kotlin
class User(val person: Person, val people: People) : Person by person, People by people
```

## Coroutine

### callback의 문제점

코루틴을 다루기 전에 먼저 비동기 처리에 대해서 정리를 해보자.
우리가 흔히 비동기를 다루는 대표적인 방법은 바로 callback이다. 기본적으로 콜백을 이용한 비동기 처리는 함수의 지연 호출을 이용하는 것이다. 우리는 함수를 호출하기 전까진 그 안의 코드가 실행되지 않는다는 특성을 이용한다.

기존의 함수는 호출되는 순간 서브루틴으로 점프가 일어나고 함수의 실행이 끝나면 다시 원래 호출 지점으로 돌아와서 코드를 진행한다. 즉, 실행 순서를 예측할 수 있으므로 우리의 통제권 안에 있다. 그러나 callback은 어느 시점에 실행이 끝나고 돌아오는 순간을 예측할 수 없다. 이건 우리의 통제권을 벗어난 부분이다. 그때 어떤 명령이 실행되고 있을지 모르기 때문이다. 그래서 우리는 사실상 callback을 넘긴 함수 호출 이후 코드를 짜지 않고 기다리는 행위를 하게 된다. 겁이 나기 때문에 사실상 동기 로직으로 작성한다. 따라서 callback 스타일의 진짜 문제점은 callback hell이 아닌 싱글 스레드처럼 작동되는 코드 스타일이 문제다.

>**우리의 callback은 언제 호출될지 모른다.**

### Promise의 반(half) 제어권

그렇다면 우리가 결과를 원할 때 호출하면 어떨까? 만약 우리가 원할 때 호출을 하면 해당 처리에 대한 결과 로딩이 끝난 시점과 끝나지 않은 시점이 존재할 것이다. 로딩이 끝난 시점이라면 바로 결과를 받을 수 있을 것이고 끝나지 않은 시점이라면 callback처럼 대기했다가 결과를 받을 것이다. 결과를 인수하는 시점을 우리가 선택할 수 있기 때문에 우리는 절반의 제어권을 가진다. 물론 비동기 로직 자체를 제어할 순 없기 때문에 완전한 제어권은 가질 수 없다.

위의 내용을 가능하게 한 녀석이 바로 JavaScript의 Promise다. Promise는 then을 호출하기 전까진 안전하게 로직 전개가 가능하게 해준다. 자바에선 CompletableFuture를 통해 이뤄낼 수 있다. 기존의 Future는 결과를 얻기 위해 get을 호출하는 순간 그 밑의 로직은 blocking이 되기 때문에 사실상 callback과 같았다. 그러나 Completablefuture를 이용하면 Promise와 마찬가지로 절반의 제어권을 얻어낼 수 있다.

### 코루틴은 마법인가

사실 현재 우리가 쓰는 컴퓨터인 노이만 머신에서 비동기란 개념은 사실 존재하지 않는다. 명령이 적재되면 명령 중지가 불가능하기 때문이다. 따라서 우리가 알고 있는 모든 비동기는 멀티 스레드로 만든 것이다. OS차원에서 멀티 스레드는 명령을 멈출 수 있기 때문이다. 그래서 OS차원에서 멀티 스레드를 이용하면 실질적 시분할 처리가 가능한 것이다. 언어 차원에선 명령을 멈출 수 있을까? for문을 일시정지했다가 다시 진행하는 게 가능한가? 사실 불가능하다. 그러나 그런 걸 흉내 낼 수 있도록 해주는 게 yield같은 구문이다. 과연 컴파일러가 어떻게 처리하길래 가능한 것일까?

>**There is no magic.**

```javascript
function *genereator() {
  yield 1;
  yield 2;
}
```

위와 같은 간단한 제네레이터 함수를 babel에서 어떻게 번역하는지 살펴봤다. 아래 결과를 살펴보면 switch case로 함수가 호출될 때 조건에 따라 분기되어 처리되도록 만드는 걸 볼 수 있다. 마법은 없다.

```javascript
function genereator() {
  return regeneratorRuntime.wrap(function genereator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;

        case 2:
          _context.next = 4;
          return 2;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
```

### 코틀린의 CPS(Continuation Passing Style)

결국 어떤 상태에 따라 이 함수는 다르게 실행된다는 것인데, 이걸 달성하려면 분할된 함수를 호출할 때마다 유지되어야 하는 상태가 필요하다. 이 상태를 바로 **Continuation**이라 한다. 그리고 이러한 Continuation을 처리부와 호출부 사이에서 계속 던져가며 진행해가는 프로그래밍 스타일을 Continuation Passing Style이라 한다.

기본적으로 JavaScript는 generator라는 키워드로 특정 함수 블록을 선언하고 yield라는 힌트로 switch 분기를 만들어야 하는 곳을 컴파일러에게 알려줘야 한다. C# 또한 언어에서 확정한 스펙(async, await)를 선언한 블록이 아니면 Continuation을 만들 방법은 없다.

또한 JavaScript에서 await 뒤에는 내장 객체인 Promise로 타입이 확정된다. 커스텀 객체를 CPS에서 사용할 수 없다는 것이다. C# 또한 Task라는 객체만 사용 가능하다.

이에 반해 코틀린은 Coroutine을 만들 때 그 어떤 코드에서도 가능하고 어떠한 객체도 CPS 대상 객체가 될 수 있도록 만들었다. 어떤 키워드에 의해서 switch문으로 나눠주는 게 아닌 Continuation을 받는 함수가 오면 그 부분을 기준으로 끊어준다. 바로 그 함수가 suspend 함수다. suspend 함수는 Continuation 객체가 인자로 들어오면 반드시 continuation.resume()을 반드시 해줘야 한다. 물론 resume 시점은 개발자가 정할 수 있다.

### 코루틴 사용

```kotlin
fun main(args: Array<String>) = runBlocking {
  launch {
    delay(1000)
    println("World")
  }
  print("Hello ")
  delay(2000)
}
```

runBlocking은 블록 안의 continuation을 모두 실행하는 동안 해당 쓰레드는 blocking된다. 위의 코드에선 main함수는 블록 안의 모든 처리가 모두 끝날 때까지 종료되지 않는다. launch는 blocking을 걸지 않지만 블록 안의 코드는 별도의 백그라운드 쓰레드에서 동작한다. 제어권을 launch를 실행한 스레드에 바로 돌려준다. delay는 suspend 함수다. 여기서 delay 함수가 호출되면 continuation resume은 1초 후에 호출되는 것이다. delay가 suspend 함수이기 때문에 delay를 기준으로 컴파일러가 switch case 분기가 일어날 것이다.

신기하게도 delay(2000)을 하지 않아도 World가 찍히는 걸 볼 수 있다. launch 자체도 suspend 블록으로 인식되기 때문에 runBlocking은 자식의 Job이 끝날 때까지 기다리게 된다.

```kotlin
class CoroutineUserService(private val userClient: UserClient,
                           private val factClient: FactClient,
                           private val userRepository: UserRepository,
                           private val factRepository: FactRepository) : UserService {
    override fun getFact(id: UserId): Fact = runBlocking {
        val user = async { userRepository.getUserById(id) }.await()
        if (user == null) {
            val userFromService = async { userClient.getUser(id) }.await()
            launch { userRepository.insertUser(userFromService) }
            getFact(userFromService)
        } else {
            async { factRepository.getFactByUserId(id) ?: getFact(user) }.await()
        }
    }

    private suspend fun getFact(user: User): Fact {
        val fact: Deferred<Fact> = GlobalScope.async { factClient.getFact(user) }
        GlobalScope.launch { factRepository.insertFact(fact.await()) }
        return fact.await()
    }
}
```

getFact라는 함수를 보면 suspend가 걸려있음을 확인할 수 있다. 근데 이상하게도 continuation을 받는 부분은 따로 없다. 이건 async라는 함수가 continuation 객체를 생성하기 때문이다. async는 람다 함수의 반환 타입을 제네릭으로 감싼 Deferred\<T>라는 객체를 결과로 만들어낸다. Deferred 타입이 가진 메소드가 await이다. await는 자신의 람다 블록을 백그라운드에서 실행하는 명령이다. 또한 await가 바로 suspend가 풀리고 resume이 되는 지점이다. suspend 블록 안에서 다른 suspend 함수를 호출하면 부모의 continuation을 자식 suspend 함수에 위임한다. 그래서 자식 suspend 함수에서 continuation resume을 진행한다. 이게 서브 Job이 다 끝나야 부모의 Job 끝나는 원인이다.

### 코틀린 코루틴이 성능이 좋은 이유

일반적인 멀티스레드 작업은 스레드마다 task 전체를 맡기기 때문에 스레드가 많이 필요하다.

반면 코틀린 코루틴은 백그라운드 스레드를 task 개수만큼 여러 개 생성하지 않고 필요할 때만 추가적으로 만든다. 그러면 백그라운드 스레드가 여러 개가 아닌데 어떻게 우리 눈에는 동시처리로 보이는 것일까? suspend 단위로 쪼개진 작업을 Event Queue에 넣어 놓고 놀고 있는 스레드가 suspend 단위로 쪼개진 작업을 가져다가 처리하는 것이다. suspend 단위가 작으면 작을수록 해당 블록 처리가 굉장히 빨라지기 때문에 스레드 1개가 여러 task의 suspend 블록들을 번갈아 가면서 시분할로 처리할 수 있게 된다. 그래서 우리한텐 마치 멀티 스레드가 동시에 동작하는 것처럼 보인다. 분명한 건 절대 동시는 아니다. 시분할 된 suspend 블록들을 굉장히 빠른 속도로 처리해서 '동시처럼' 보일 뿐이다.

따라서 코틀린 코루틴에서 성능을 극대화 하고 싶다면 되도록 suspend 블록의 단위를 잘게 나눠야 한다. 이건 순수하게 개발자의 역량에 달려있다. 만약 suspend 블록이 커지면 코루틴의 성능 효율은 전혀 기대할 수 없다. 스레드 1개가 task A, B, C를 suspend 단위로 쪼개서 실행을 하는데 만약 suspend 블록이 크다면 A......., B....., C..., A....., B.... 이런식으로 진행되기 때문에 성능적 이득이 전혀 없다. 우리가 원하는 건 A, B, C, A, B, C, A, B, ... 이기 때문이다.

추가적으로 위의 코드에서 주의할 부분은 getFact함수의 suspend 블록 자체는 매우 가볍지만 블록 안의 factClient는 별도의 스레드를 생성하여 Http 요청을 보내기 때문에 getFact 함수가 여러 번 호출될수록 그에 비례하여 스레드가 생성될 것이다. 따라서 getFact 함수는 굉장히 무겁기 때문에 주의가 요구된다.

### 코루틴 실행기 = Dispatcher

실제로 suspend 블록을 처리하는 존재가 스레드이긴 하지만 코루틴 관점에서 중요한 건 실행기로 바라보는 것이다. 이 실행기를 Dispatcher라고 한다. 개발자에겐 Dispatcher를 선택할 권리가 주어진다. 메인 스레드나 백그라운드 스레드에서 동작하는 Dispatcher를 고를 수도 있다. 코루틴에 대해 공부하다 보면 CoroutineContext란 녀석을 자주 보게 될텐데 정체는 다음과 같다.

> **CoroutineContext = Dispatcher + 오류 처리기**

launch(context) { ... } 처럼 context를 선택할 수 있는 옵션이 있는데 context를 생략하면 기본 dispatcher와 기본 오류 처리기로 자동 선택된다. 물론 기본값이면 main 스레드에서 동작한다.

스레드를 얼마나 가용할지는 Dispatcher 구현에 따라 다른데 Dispatcher 구현은 동시성에 대한 깊은 이해가 필요하다.

추가적으로 얘기하자면 launch, async 등은 컴파일러에게 이 블록은 CPS 형태로 파싱하라는 힌트를 주는 Coroutine Scope Builder이다. 따라서 이 scope 안에서만 suspend 함수를 썼을 때 continuation의 혜택을 누릴 수 있다.

### 동기화 문제

멀티 스레드를 운용하다 보면 당연히 스레드 간의 동기화 문제가 생긴다. 근데 코루틴은 스레드 간 동기화를 하지 않는다. 과연 어떻게 해결할 수 있을까? 동기화 문제를 해결하기 위해서 코루틴에선 채널이란 걸 제공한다. 멀티 스레드 패턴 중 하나인 Guarded Suspension을 구현한 채널은 코루틴 간 크리티컬 섹션 없이 대화하기 위하여 쓴다. 스레드 간 직접 통신 없이 중간에 연결 고리를 두어서 해결하는 것이다. 결국 Dispatcher는 채널에 쓰기 작업만 하면 된다.

## Future Action

* 커스텀 델리게이트를 구현하여 시스템에서 제공하는 Delegates.notNull, lazy, lateinit, Delegates.Observable 등을 직접 구현해본다.
* [코루틴 공식 문서 분석](https://medium.com/@myungpyo/reading-coroutine-official-guide-thoroughly-part-0-20176d431e9d) 포스팅을 자세히 공부한다.
