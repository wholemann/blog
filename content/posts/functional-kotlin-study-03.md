---
title: 함수형 코틀린 스터디 3회차
date: "2020-02-02"
template: "post"
draft: false
category: "스터디"
slug: "/posts/functional-kotlin-study-03/"
tags:
  - "Kotlin"
  - "Study"
  - "Functional programming"
description: "람다, 파라미터, 확장 함수, 중위 함수, 연산자 오버로딩, 타입 안전 빌더, 인라인 함수"
---

이번 주 스터디에선 다소 어려운 고급 지식이 쏟아져 나와서 이해하는데 엄청나게 오랜 시간이 걸렸고 아직도 완벽히 이해하진 못했다. 단순하게 툭 던져진 코드에서 숨겨진 의도가 엄청나게 많다는 걸 느꼈고, 저자의 의도를 모두 파악할 때까진 책을 계속 씹어 먹어야 됨을 깨달았다. 독서하는 습관을 바꿔야 됨을 느꼈다. 단 한줄도 대충 넘기지 않고 정확히 의도를 파악하려다 보니 쉽지 않았다.

내부 동작을 이해하기 위해 디컴파일을 해가며 뜯어 보느라 시간이 상당히 오래 걸렸다. 당연히 필요한 곳엔 Java 코드도 첨부했다.

또한 중간에 따로 다뤄야 될만큼 방대한 부분은 별도의 포스팅을 하도록 하겠다.

## 파라미터

### 람다

```kotlin
// Kotlin
fun <T> emit(t: T, vararg listeners: (T) -> Unit) =
        listeners.forEach { listener ->
            listener(t)
        }

emit(1, ::println, {i -> println(i * 2)})
```

멤버 참조 `::` 의 의미는 무엇일까?
람다 자동 생성 문법이다. ::println은 { println() } 과 같다.
결국 멤버 참조는 그 멤버를 호출하는 람다와 같은 타입이다.

실제로 디컴파일 해보면 코틀린 primitive Function 타입의 인스턴스로 변환된 걸 볼 수 있다. 코틀린은 자바와 달리 Function 타입이 있기 때문이다.

```java
// Java
public static final void main(@NotNull String[] args) {
      // ...
      emit(1, (Function1)null.INSTANCE, (Function1)null.INSTANCE);
   }
```

다만 자바 API의 함수를 멤버 참조할 때는 디컴파일 결과가 좀 다른 걸 볼 수 있다.
자바는 primitive Function 타입이 없기 때문에 무명 클래스의 인스턴스를 생성해서 넣어준다.

```kotlin
// Kotlin
emit(1, System.out::println, {i -> println(i * 2)})
```

```java
// Java
public static final void main(@NotNull String[] args) {
      // ...
      emit(1, (Function1)(new Function1(System.out) {
         // $FF: synthetic method
         // $FF: bridge method
         public Object invoke(Object var1) {
            this.invoke(((Number)var1).intValue());
            return Unit.INSTANCE;
         }

         public final void invoke(int p1) {
            ((PrintStream)this.receiver).println(p1);
         }

         public final KDeclarationContainer getOwner() {
            return Reflection.getOrCreateKotlinClass(PrintStream.class);
         }

         public final String getName() {
            return "println";
         }

         public final String getSignature() {
            return "println(I)V";
         }
      }), (Function1)null.INSTANCE);
   }
```

### 명명된 파라미터

```kotlin
val customer1 = Customer("존", "칼", "도", "XX234", 82.3, 180)
```

코틀린에선 인스턴스를 생성할 때 new를 사용하지 않는다. 코틀린에선 클래스를 인스턴스를 반환하는 **함수**로 바라보는 것이다.

기존 언어(C, C++, Java)에서 new의 의미는 힙 메모리에 할당하는 것을 말한다.
new가 없는 의미는 컴파일러가 알아서 stack이든 heap이든 할당할테니 개발자는 신경 쓰지 마라는 의미이다. 모던 컴파일러는 매우 똑똑해서 멀티플랫폼 언어인 코틀린을 각 플랫폼에 메모리 관리 정책에 맞게 알아서 변환해준다.

자바에서는 일부 클래스에서 오버로딩한 생성자나 메소드가 너무 많아진다는 문제가 있었다.
[java.lang.Thread에 있는 8가지 생성자](http://mng.bz/4KZC)를 보면 수많은 중복을 발견할 수 있다.
코틀린에선 디폴트 값 설정 덕에 위와 같은 오버로딩한 생성자나 메소드를 줄일 수 있다.

명명된 파라미터를 이용하면 vararg를 아래 예제와 같이 중간에 사용할 수 있다. 명시적으로 파라미터 이름을 쓰는 순간 vararg와 구분할 수 있기 때문이다.

```kotlin
fun paramAfterVararg(courseId: Int, vararg students: String, roomTemperature: Double) {
    // ..
}

fun main(args: Array<String>) {
    paramAfterVararg(68, "아벨", "바바라", "칼", "다이앤", roomTemperature = 3.0)
}
```

### 디폴트 파라미터 값

코틀린에서 함수 파라미터는 디폴트 값을 가질 수 있다. 다음 코드에서 데이터 클래스는 기본 값을 가진다. 잊지 말자. 생성자 역시 함수다.
디폴트 파라미터 값에 함수 호출 결과를 할당 가능할까? 결론적으로 말하면 가능하다. 아래 예제를 보자.

```kotlin
fun getFavouriteLanguage(): String {
    return "Kotlin"
}

data class Programmer(val firstName: String,
                      val lastName: String,
                      val favouriteLanguage: String = getFavouriteLanguage(),
                      val yearsOfExperience: Int = 0)

fun main(args: Array<String>) {
    println(Programmer("수형", "최", yearsOfExperience = 3))
    // console: Programmer(firstName=수형, lastName=최, favouriteLanguage=Kotlin, yearsOfExperience=3)
}
```

이게 왜 가능한 것인지 너무 궁금해서 디컴파일을 해봤다. 디폴트 파라미터 값이 설정되면 기본 생성자 외에도
DefaultConstructorMarker라는 타입의 파라미터가 오버로드된 또 하나의 생성자가 추가된 걸 볼 수 있었다.
이 생성자에서 최상위 함수에 선언된 getFavouriteLanguage()를 호출하여 그 결과를 var3에 할당하는 걸 발견했다.
그리고 마지막에 기본 생성자를 호출한다.

참고로 JVM 상에선 클래스 밖의 함수는 실행될 수 없기 때문에 코틀린에서 클래스 밖에 선언된 최상위 함수는 컴파일 될 때
`파일명Kt`라는 final class의 static 메소드로 변환된다.

아래는 디컴파일된 코드다.

```java
public final class Programmer {
   // 중략...

   public Programmer(@NotNull String firstName, @NotNull String lastName,
         @NotNull String favouriteLanguage, int yearsOfExperience) {
      Intrinsics.checkParameterIsNotNull(firstName, "firstName");
      Intrinsics.checkParameterIsNotNull(lastName, "lastName");
      Intrinsics.checkParameterIsNotNull(favouriteLanguage, "favouriteLanguage");
      super();
      this.firstName = firstName;
      this.lastName = lastName;
      this.favouriteLanguage = favouriteLanguage;
      this.yearsOfExperience = yearsOfExperience;
   }

   // $FF: synthetic method
   public Programmer(String var1, String var2, String var3, int var4, int var5,
         DefaultConstructorMarker var6) {
      if ((var5 & 4) != 0) {
         var3 = ParametersKt.getFavouriteLanguage();
      }

      if ((var5 & 8) != 0) {
         var4 = 0;
      }

      this(var1, var2, var3, var4);
   }
```

위의 디컴파일된 코드를 보면 당연한 얘기지만 이미 입력이 완료된 파라미터를 함수 호출의 인자로 넘길 수 있다.

```kotlin
fun getFavouriteLanguage(firstName: String, lastName: String): String {
    return firstName + lastName
}

data class Programmer(val firstName: String,
                      val lastName: String,
                      val favouriteLanguage: String = getFavouriteLanguage(firstName, lastName),
                      val yearsOfExperience: Int = 0)

fun main(args: Array<String>) {
    println(Programmer("코틀", "린", yearsOfExperience = 3))
    // console: Programmer(firstName=코틀, lastName=린, favouriteLanguage=코틀린, yearsOfExperience=3)
}
```

생성자 안에서 getFavouriteLanguage(var1, var2)를 호출하는 걸 발견할 수 있다.

```java
public final class Programmer {
    // 중략...

    // $FF: synthetic method
    public Programmer(String var1, String var2, String var3, int var4, int var5,
         DefaultConstructorMarker var6) {
      if ((var5 & 4) != 0) {
          var3 = ParametersKt.getFavouriteLanguage(var1, var2);
      }

    // ...
   }
```

inline 고차함수인 buildString 함수 또한 결국 함수이기 때문에 아래와 같은 코드도 가능하다.

```kotlin
data class Programmer(val firstName: String,
                      val lastName: String,
                      val favouriteLanguage: String = buildString { append("kotlin") },
                      val yearsOfExperience: Int = 0)
```

buildString은 StringBuilder()를 수신객체로 inline 함수이기 때문에 결국 본문이 아래와 같이 생성자에 들어가는 걸 볼 수 있다.

```java
public Programmer(String var1, String var2, String var3, int var4, int var5,
         DefaultConstructorMarker var6) {
      if ((var5 & 4) != 0) {
         StringBuilder var7 = new StringBuilder();
         int var9 = false;
         var7.append("kotlin");
         String var10000 = var7.toString();
         Intrinsics.checkExpressionValueIsNotNull(var10000, "StringBuilder().apply(builderAction).toString()");
         var3 = var10000;
      }

      // ...
   }
```

멤버 참조를 이용하면 클래스 생성 작업을 연기하거나 저장해둘 수 있는데
`::` 뒤에 클래스 이름을 넣으면 생성자 참조를 만들 수 있다.

```kotlin
data class Programmer(val firstName: String,
                      val lastName: String,
                      val favouriteLanguage: String = "코틀린",
                      val yearsOfExperience: Int = 0)

val createProgrammer = ::Programmer
val p1 = createProgrammer("코", "틀린", "자바", 3)
val p2 = createProgrammer("코", "틀린")   // compile error
```

단, 이 경우에 디폴트 파라미터 값을 이용한 생성자는 이용할 수 없다. 컴파일 에러가 생긴다.
정확한 이유는 알 수 없지만 아마도 `::` 를 이용한 생성자 참조는 기본 생성자만 참조되는 것 같다.

## 확장 함수

기존 자바 API를 재작성하지 않고도 코틀린이 제공하는 여러 편리한 기능을 사용할 수 있다면 아주 편할 것이다.
확장 함수(extension function)가 그런 역할을 해줄 수 있다.

```kotlin
fun String.sendToConsole() = println(this)

fun main(args: Array<String>) {
   "헬로 월드! (외부 함수로부터)".sendToConsole()
}
```

확장 함수는 어떤 클래스의 멤버 메소드인 것처럼 호출할 수 있지만 그 클래스의 밖에 선언된 함수다.
결국 동작하는 원리는 최상위 함수랑 같다. 다만 차이가 있다면 첫번째 파라미터로 수신 객체를 받는 일반 함수와 같다.
아래 예제는 위의 확장 함수와 동작이 같은 일반 함수다.

```kotlin
fun sendToConsole(string: String) = println(string)

sendToconsole("헬로 월드! (일반 함수로부터)")
```

따라서 실제로 해당 클래스를 수정하는 건 아니므로 반드시 import를 해줘야 한다.

```kotlin
import strings.sendToConsole
// or
import strings.*
```

확장 함수의 this는 선언된 클래스 내부의 private 멤버에는 접근할 수 없다.
멤버 함수와 같은 이름을 가진 함수를 선언하는 건 괜찮지만 멤버 함수가 언제나 우선권을 가지므로
확장 함수는 호출되지 않는다. 이 기능은 멤버 함수가 private인 경우에 변경되는데 이 경우 확장 함수가 우선권을 가진다.

### 단점

굉장히 편해 보이는 기능이지만 협업하는 과정을 생각해보자. 별다른 제한 없이 확장 함수는 추가 가능하기 때문에
여러 명이 작업하는 프로젝트에서 같은 기능을 가진 확장 함수가 선언될 수도 있고 이미 어딘가에 있는데 존재조차 모를 수도 있다.

또한, 기본적으로 최상위 함수와 동일하게 static 클래스에 static 메소드로 만들어진다. 성능적인 측면에서도 클래스 메소드보다
떨어질 수밖에 없다. 그러면 기존 방식대로 유틸 클래스의 메소드를 쓰면 될텐데 굳이 확장 함수는 언제 활용될까?

### 확장 함수는 언제 쓰나

#### 1. 버전 인터페이스를 추가할 때

이미 배포한 인터페이스에 어떤 연산을 추가하고 싶을 때 어떻게 해야 될까?
연산을 추가하면 기존 인터페이스를 구현한 클래스가 제대로 동작하지 않으므로 함부로 연산을 추가하는 건 어렵다. 하지만 새로운 인터페이스를 선언해서 기존 인터페이스를 확장한 후 새로운 연산을 추가할 수 있다. 기존 사용자는 새로운 인터페이스에 대해 알 필요가 없다. 보통 자바에서는 아래와 같이 해결해왔다.

```java
interface Command {
   void run();
}
```

이 인터페이스가 이미 널리 사용 중이라면 수정 비용이 엄청날 것이다. 그래서 다음과 같이 버전 인터페이스를 사용해서 메소드를 추가하면 문제를 해결할 수 있었다.

```java
interface ReversibleCommand extends Command {
   void undo();
}
```

기존 Command 인터페이스를 사용한 코드는 문제 없이 작동하며 새로 추가한 ReversibleCommand 역시 기존 Command가 동작하는 모든 경우에 잘 동작한다.
새로운 메소드를 사용하고 싶은 경우는 아래와 같이 다운 캐스팅해서 사용한다.

```java
Command recent = ...;
if (recent instanceof ReversibleCommand) {
   ReversibleCommand downcasted = (ReversibleCommand) recent;
   downcasted.undo();
}
// ...
```

하지만 위의 방식은 그다지 좋진 않은 해결책이다. 다운캐스팅을 사용하기 때문에 LSP 위반에 해당한다. 버전 인터페이스를 사용하는 건 자바를 올바르게 사용하는 것이라고 보긴 힘들다.

```kotlin
// Command.kt
fun Command.undo() {
    println("undo!")
}

interface Command {
    fun run()
}

// KoCommand.kt
class KoCommand : Command {
    override fun run() {
        // ..
    }
}

fun main(args: Array<String>) {
    val command = KoCommand()
    command.undo()
}
```

하지만 코틀린에선 확장 함수를 이용하면 위와 같이 별도의 인터페이스 수정이 없이도 새로운 메소드를 인스턴스에서 사용할 수 있다. 다운 캐스팅도 필요 없기 때문에 LSP 위반 문제도 없다. 확장 함수를 통해 버전 인터페이스의 문제를 아주 깔끔하게 해결했다.

#### 2. 사전 제작용(mocking) 메소드

프로젝트를 진행하다 보면 여러 사정상 당장 필요한 메소드를 클래스 내부에 스펙을 확정해서 추가하기 어려운 경우가 있다. 하지만 그 메소드와 비즈니스 규칙상 의존 관계에 있는 메소드가 있어서 당장 외부에서 호출해서 써야 할 일이 있을 땐 어찌해야 될까?

바로 확장 함수를 이용하면 된다. 마치 테스트 코드에서 mocking 함수를 이용하는 원리와 같다. 해당 메소드를 소모하는 곳에서 문제가 없도록 결과를 리턴해주면 외부에서 (당장은) 문제없이 사용할 수 있고 구체적인 구현은 뒤로 미룰 수 있다. 추후에 비즈니스 규칙이 확정됐을 때 해당 확장 함수를 클래스 내부 메소드로 변경하면 되는 것이다.

#### 3. 확장 함수를 통해 Strategy Pattern을 구현

이는 굉장히 설명해야될 내용이 많으므로 따로 포스팅하도록 하겠다.

### 오브젝트용 확장 함수

위와 같은 3가지 이유로 사용하며 오브젝트 선언문으로 되어 있어야 사용 가능하다.

```kotlin
object Builder {
   // ...
}

fun Builder.buildBridge() = "반짝거리는 새 다리"
```

## 중위 함수

하나의 파라미터만 가진 (일반 혹은 확장) 함수는 infix로 표기할 수 있으며, 중위 표기법과 함께 사용할 수 있다. 중위 표기법은 수학 및 대수 연산과 같은 일부 영역에 대해 코드를 자연스럽게 표현하는 데 유용하다.

```kotlin
infix fun Int.superOperation(i: Int) = this + i

fun main(args: Array<String>) {
   1 superOperation 2
   1.superOperation(2)
}
```

위와 같이 사용할 수 있는데 왼쪽 항에 대한 오른쪽 항 연산이라 늘 확장 함수일 수밖에 없다. 아니면 클래스 내부의 멤버 메소드인 경우에 선언은 가능하지만 직접 써본 결과 수신 객체를 첫번째 파라미터로 넘겨야 하는데 infix로 선언한 경우 파라미터는 1개로 제한되기 때문에 사실상 제대로 쓸 수 없는 것 같다.

기본적으로 우리가 사용하는 함수 호출은 전위 표기법이다. 전위 표기법은 중첩이 될수록 읽기가 어렵지만 다항식을 받을 땐 유리한 측면이 있다. 그에 반해 중위 표기법은 우리에게 평소 익숙한 형태이기 때문에 중첩이 됐을 때 읽기가 쉽다. 다만 연산자 우선순위 문제 때문에 인자가 2개인 경우에만 쓴다. 다항식일 경우 연산자 우선순위를 예측하기 어려우니 반드시 () 와 함께 쓰는 걸 추천한다.

중위 표기법은 assertion 라이브러리에서도 많이 쓰이는데 자연스럽고 이해하기 쉬운 언어로 스펙을 작성할 수 있다. 백틱은 코틀린에서 예약한 단어를 포함해 임의의 식별자를 사용할 수 있게 한다. 이 백틱을 이용하면 다른 언어로 컴파일 될 때도 안전하게 처리 된다고 한다.

```kotlin
"Kotlin" shouldStartWith "Ko"
"Kotlin" `should Start With` "Ko"
```

## 연산자 오버로딩

연산자 오버로딩은 다형성의 한 가지 형태다. 일부 연산자는 다른 타입에서 동작이 바뀐다. 코틀린에서 오버라이드 가능한 연산자는 한정돼있다. 따라서 임의의 연산자를 만들 수는 없다.

operator 연산자를 function 앞에 붙였을 때 해당 연산자에 대해서 비로소 제약이 생기는데 `+` `-` `*` `/` `%`1 `..` 같은 연산자는 어지간하면 오버로딩을 추천하지 않는다고 한다. 결과 타입의 예측이 어렵기 때문이다. 대신 `in` `!in`은 매우 좋다. 타입 예측이 쉽고 유용하다.

### Invoke

invoke 함수는 연산자다. invoke 연산자는 이름 없이 호출될 수 있다. 

```kotlin
enum class WolfActions {
   SLEEP, WALK, BITE
}

class Wolf(val name: String) {
   operator fun invoke(action: WolfActions) = when (action) {
      WolfActions.SLEEP -> "$name (은)는 자는 중이다"
      WolfActions.WALK -> "$name (은)는 걷고 있다"
      WolfActions.BITE -> "$name (은)는 물어뜯는 중이다"
   }
}

fun main(args: Array<String>) {
   val talbot = Wolf("탈봇")
   talbot(WolfActions.SLEEP)  // talbot.invoke(WolfActions.SLEEP)
}
```

클래스를 호출하면 생성자가 호출되며, 인스턴스를 호출하면 invoke 연산자를 호출한다.

## 타입 안전 빌더

코틀린은 내부 DSL을 생성하는 많은 기능을 제공하지만, 그 중 타입 안전 빌더는 데이터를 semi 선언전 방식으로 정의할 수 있게 하며, GUI, HTML 마크업, XML 등을 정하는 데 매우 유용하다.

semi 선언적 방식이라 표현하는 이유는 다음과 같다. 완전한 선언은 코드 외부에서 선언된다. json, css, html, sql 등이 그 사례이다. 컴파일러와 무관하게 메모장만 있으면 선언 구문을 작성할 수 있다. 이에 비해 DSL은 컴파일 타임에 타입에 대한 검사가 가능하다. 그러나 우리 눈에 보이는 문법은 완전한 선언형 방식에 가깝다. 그래서 semi 선언적이라 표현한다.

```xml
<bicycle description="Fast carbon commuter">
   <bar material="ALUMINIUM" type"FLAT">
   </bar>
   ...중략
```

```kotlin
val commuter = bicycle {
   description("Fast carbon commuter")
   bar {
      barType = FLAT
      material = ALUMINIUM
   }
}
```

중괄호 부분은 사실 람다인데 덕분에 제법 선언적으로 보인다.

## 인라인 함수

고차 함수는 유용하지만 주의할 점이 있다. 성능 패널티다. 컴파일 시간에 람다가 함수 타입의 오브젝트로 변환되며 고차 함수 내부에서 해당 오브젝트의 invoke 연산자를 호출한다.

```kotlin
fun <T> time(body: () -> T): Pair<T, Long> {
    val startTime = System.nanoTime()
    val v = body()
    val endTime = System.nanoTime()
    return v to endTime - startTime
}

fun main(args: Array<String>) {
    val (_, time) = time { Thread.sleep(1000) }
    println("time = $time")
}
```

실제로 위의 코드를 디컴파일 해보면 람다식은 함수 타입의 인스턴스로 전달되는 걸 볼 수 있다. 또한 고차 함수 내부에서 해당 인스턴스의 invoke 연산자를 실행하여 람다를 실행한다. 결과적으로 CPU와 메모리를 추가적으로 소모한다.

```java
@NotNull
public static final Pair time(@NotNull Function0 body) {
   Intrinsics.checkParameterIsNotNull(body, "body");
   long startTime = System.nanoTime();
   Object v = body.invoke();
   long endTime = System.nanoTime();
   return TuplesKt.to(v, endTime - startTime);
}

public static final void main(@NotNull String[] args) {
   Intrinsics.checkParameterIsNotNull(args, "args");
   Pair var3 = time((Function0)null.INSTANCE);
   long time = ((Number)var3.component2()).longValue();
   String var4 = "time = " + time;
   System.out.println(var4);
}
```

만약 성능이 최우선인 경우 inline 으로 고차 함수를 표시할 수 있다.

```kotlin
inline fun <T> time(body: () -> T): Pair<T, Long> {
    val startTime = System.nanoTime()
    val v = body()
    val endTime = System.nanoTime()
    return v to endTime - startTime
}
```

컴파일되면 다음과 같이 변한다.

```java
public static final void main(@NotNull String[] args) {
      Intrinsics.checkParameterIsNotNull(args, "args");
      int $i$f$time = false;
      long startTime$iv = System.nanoTime();
      int var7 = false;
      Thread.sleep(1000L);
      Object v$iv = Unit.INSTANCE;
      long endTime$iv = System.nanoTime();
      Pair var3 = TuplesKt.to(v$iv, endTime$iv - startTime$iv);
      long time = ((Number)var3.component2()).longValue();
      String var11 = "time = " + time;
      System.out.println(var11);
}
```

고차 함수의 본문과 람다의 본문이 함수 호출부를 대체한 것을 볼 수 있다. 인라인 함수는 빠르지만 더 많은 코드가 생성된다. 즉, 람다 본문과 inline 함수의 본문이 클수록 전체 바이트 코드는 증가한다. 모든 호출 지점에 해당 바이트코드가 중복으로 생성되기 때문이다. 즉, 메모리 용량을 많이 차지하게 된다.
대신 함수 스택은 사용하지 않기 때문에 그 부분에 대한 성능 향상은 기대할 수 있다.

### 인라인 함수의 제약

인라인 람다 함수는 중요한 제약이 있는데 어떤 방식으로든 저장이나 복사 등과 같은 조작을 할 수 없다.

```kotlin
data class User(val name: String)

class UserService {
    val listeners = mutableListOf<(User) -> Unit>()
    val users = mutableListOf<User>()
    inline fun addListener(listener: (User) -> Unit) {
        listeners += listener // 컴파일 에러: 잘못된 인라인 파라미터
    }
}
```

왜 이런 에러가 발생할까? 저 함수를 호출하는 곳에서 람다와 함께 본문을 인라인화 했을 때 listeners는 해당 호출 지점에 존재하지 않는다. listeners는 인스턴스의 context(객체의 필드)이기 때문이다. 즉, 람다 본문에 인스턴스의 this context가 오면 inline화 할 수 없다.

물론 예시를 위해 억지로 만든 것이겠지만 엄밀히 말해서 저 예제의 설계는 잘못됐다. 클래스 메소드를 inline화 하는 건 잘못된 설계이다. 메소드 내부에서 this context를 사용하지 않을 거면 메소드로 만들 필요가 없기 때문이다.

```kotlin
inline fun addListener(noinline listener: (User) -> Unit) {
   listeners += listener
}
```

위와 같이 noinline 수정자로 이 문제를 해결할 수 있다. inline 함수에서 noinline을 사용하면 고차 함수 본문은 inline화 하지만 noinline 람다 파라미터는 건드리지 않는다. 결과적으로 바이트코드는 완전한 인라인 함수만큼 빠르지는 않다.

인라인 람다 함수는 다른 실행 컨텍스트(로컬 객체, 중첩된 람다, 쓰레드) 내부에서 실행될 수 없다.

```kotlin
inline fun transfromName(transform: (name: String) -> String): List<User> {
        val buildUser = { name: String ->
            User(transform(name))   // 컴파일 에러: 여기서 transform을 인라인화 할 수 없음
        }
        return users.map { user -> buildUser(user.name)}
}

inline fun transfromName(crossinline transform: (name: String) -> String): List<User> {
        val buildUser = { name: String ->
            User(transform(name))   // 이 부분을 inline화 하지 않음
        }
        return users.map { user -> buildUser(user.name)}
}
```

위와 같이 crossinline 수정자를 붙이면 람다 안의 transform 람다식을 inline화 하지 않기 때문에 해결할 수 있다.

## 재귀와 코리커젼

재귀는 복잡한 값을 가져와 원하는 답으로 줄이는 압축 또는 축소(하나의 값으로 수렴하는 것)을 말한다. 반면 코리커젼은 값에서부터 계속된 연산을 통한 발산이다. 무한의 개념을 표현하기 때문에 한정된 범위에서만 생각하는 것에 익숙한 상태에선 매우 어색할 수 있다. 처음에 Rx를 익히기 어려운 게 발산의 개념에 익숙하지 않기 때문이다. 자바스크립트에선 이러한 발산을 Generator를 통해서 표현할 수 있으며 Kotlin에선 Sequence를 이용한다. 발산에 개념에 익숙해질 필요가 있다. 현실의 문제는 수렴보다는 발산인 경우가 많기 때문이다.


## 참고문헌

- Kotlin in Action
- 켄트 벡 구현패턴
- 함수형 코틀린
