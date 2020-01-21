---
title: 함수형 코틀린 스터디 1회차
date: "2020-01-21"
template: "post"
draft: false
category: "스터디"
slug: "/posts/functional-kotlin-study-01/"
tags:
  - "Kotlin"
  - "Study"
  - "Functional programming"
description: "공덕에서 진행한 함수형 코틀린 스터디 1회차를 정리해보았다."
---

코드스피츠로 유명하신 맹기완 대표님과 **함수형 코틀린**이란 책으로 스터디를 함께 하고 있다.
책을 혼자 읽을 땐 그냥 그렇구나 하고 넘어간 게 많은데 대표님과 함께 스터디를 해보니
제대로 읽은 부분이 하나도 없다는 걸 알았다.

저번에도 켄트 벡의 구현 패턴 책을 함께 스터디하며 따로 포스팅으로 정리를 하지 않았더니
이해 측면에서 아쉬운 면이 많았다.

따라서 매번 스터디가 끝나면 Kotlin in Action과 함께 보면서 포스팅으로 정리하며
스터디 때 거론됐던 내용들을 기록해보겠다.

## Class / Abstract Class / Interface

### 생성자 파라미터에 val, var를 붙이거나 or 안 붙이거나

val, var를 안 붙이는 경우의 사용 예

1. 초기화 과정
2. super class의 생성자에서 사용
3. delegation by

우선 propery에 대해서 정리해보자면, 자바에선 Class의 field와 accessor를 묶어 property라고 부른다. 코틀린 property는 자바의 field와 accessor를 대신한다.

```kotlin
class Person(
    val name: String,   // 읽기 전용, (비공개) field, (공개) getter
    var isMarried: Boolean    // 쓰기 가능, (비공개) field, (공개) getter & setter
)
```

코틀린 생성자 파라미터에 val, var를 명시하면 초기화 과정까지 간결하게 표현할 수 있다.

```kotlin
class Cupcake(val flavour: String)

// 위의 코드는 아래와 같다.
class Cupcake(flavour: String) {
  val flavour = flavour
}
```

#### 1. 초기화 과정

생성자 파라미터에 val, var를 쓰지 않는 경우는 아래와 같은 추가 연산을 행하여 초기화 하는 경우이다.

```kotlin
class Cake(flavour: String) {
    val flavour = flavour + "맛"
}
```

초기화 로직을 작성할 때 주의할 점은 코틀린 클래스 내부의 초기화 순서이다.
자바의 경우 생성자 블록보다 field가 먼저 초기화 되는데
코틀린은 이와 다르게 생성자 블록부터 초기화가 진행된다.

그 후 init 블록이나 field가 초기화 되는데 이는 선언순으로 진행된다.
예를 들어, init이 field보다 먼저 온다면 init이 먼저 초기화 될 것이다.

여기서 init은 주 생성자와 달리 알고리즘 로직을 작성할 수 있기 때문에 사용한다.

#### 2. super class 생성자 초기화에 사용

아래와 같이 부모 클래스가 있다면 주 생성자에서 부모 클래스의 생성자를 호출해야 할 필요가 있다.

```kotlin
open class Cake(val flavour: String)

class VanillaCake(flavour: String) : Cake(flavour) {
    // ...
}
```

#### 3. delegation by

아직 delegation에 대해선 공부가 부족해서 추후에 해당 파트 진도를 나간 뒤에 정리해보겠다.

### Interface

인터페이스의 최대 단점은 internal, protected 접근 제어자를 못 쓴다는 것이다.
이는 자바 인터페이스의 단점을 그대로 물려 받았다.

자바 인터페이스와 차이점은 인터페이스엔 원래 상태(field)를 선언할 수 없지만
코틀린 클래스에선 getter, setter로 구현되기 때문에 프로퍼티를 포함할 수 있다.

```kotlin
interface Cookable {
    val boilingPoint: Double
}
```

자바 8부터 가능했던 인터페이스 기본 구현 기능을 가지고 있다.
또한 this에서 호출 가능한 메소드를 구현 내부에서 호출 가능하다.

```kotlin
interface Bakeable {
    fun bake(): String {
      return "이 ${name()} 뜨겁다. 그렇지??"
    }

    fun name(): String {
      return "빵"
    }
}
```

### 언제 추상클래스를 사용하나

#### 인스턴스화 할 수 없는 클래스

```kotlin
abstract class BakeryGood(val flavour: String) {
  init {
    println("새로운 베이커리 제품 준비중")
  }

  fun eat(): String {
    return "냠냠냠, 맛있는 $flavour ${name()}"
  }

  abstract fun name(): String // 인스턴스화 할 수 없음
}
```

위와 같이 하나라도 구현체가 없는 abstract 메소드가 있다면 abstract class로 선언해줘야 한다. 지금 보면 당연한 얘기인데 대표님 설명을 듣기 전엔 명확히 얘기할 수 없던 부분이었다.

#### 생성자가 필요한 경우 or 초기화 로직이 있는 경우

인터페이스에는 기본적으로 생성자가 없기 때문에 생성자가 필요하다면 abstract class 로 선언한다. 또한 인터페이스에는 init 블록도 존재할 수 없기 때문에 초기화 시에 작성할 로직이 있다면 abstract class를 사용해야 한다.

## object

코틀린 object의 경우 싱글턴을 정의하는 방법 중 하나로 다양한 상황에서 사용하지만 모든 경우
클래스를 정의하면서 동시에 인스턴스를 생성한다는 공통점이 있다.

코틀린 object는 기본적으로 object에 처음 접근하는 시점에 초기화가 된다. 즉, lazy loading인 것이다. 책에는 object가 시스템 전체에서 액션 조절을 하는 데는 유용하지만 전역 상태를 유지하는 데 사용하는 경우에는 위험할 수 있다고 한다. 액션 조절은 전역(static)한 메소드 사용을 얘기하는 듯하다.

전역 상태를 유지하는 데 사용하는 경우 위험한 이유는 lazy 하게 loading 되기 때문에 실제 사용 시점에 우리가 기대하는 것과 다른 상태일 수 있기 때문이다.

### object 표현식 or 선언

object 표현식은 자바의 anonymous inner class를 대신한다. 흔히 event listener 구현에 많이 쓰인다. object 선언과 달리 이름을 따로 붙이지 않는 게 특징이다. 하나의 인터페이스만 구현하거나 하나의 클래스만 확장할 수 있는 자바의 anonymous inner class와 달리 여러 인터페이스를 구현하거나 클래스를 확장할 수 있다.

object 표현식은 외부에 공개가 안 되며 외부에 프로퍼티와 메소드를 공개하고 싶다면 object 선언 방식을 사용해야 한다.
또한 object 선언과 달리 object 표현식으로 만든 anonymous object는 싱글턴이 아니다. 쓰일 때마다 새로운 인스턴스가 생성된다. 1회용이란 뜻!

### companion object

코틀린은 자바처럼 `static` 키워드를 지원하지 않는다. 대신 패키지 수준의 최상위 함수와 object 선언을 활용한다. 대부분의 경우 최상위 함수 사용을 권장하지만 클래스 밖에 있는 최상이 함수는 private 멤버에 접근할 수 없다. 이런 경우는 클래스 내부에 중첩된 object 선언을 companion 키워드를 이용해 사용하여 선언한다. companion object 내의 멤버를 사용할 경우 해당 companion object가 선언된 클래스 이름을 사용하기 때문에 자바의 static 메소드 호출이나 static field 사용 구문과 같은 효과를 낼 수 있다.

따라서 companion object를 static이라고 설명하는 글이 있는데 이는 엄밀히 말하면 틀린 설명이다. 자바의 동적 클래스 로딩에 의해 static으로 선언된 클래스는 사용 시점에 클래스의 이름으로 인스턴스화된다. 즉, 클래스 자체도 인스턴스화된다. 이와 같이 코틀린에서도 object는 사용 시점에 lazy하게 loading되기 때문에 마치 자바의 static처럼 쓸 수 있을 뿐 엄밀히 말하면 static과 방식이 같진 않다.

## Generic / Type / Enum

책에 제네릭 프로그래밍은 일반적인 문제를 해결하는 알고리즘 생성에 중점을 둔 스타일 프로그래밍이라는 설명이 있다. 사실 굉장히 난해한 말이었는데 대표님의 설명에 따르면

>문제 자체를 일반화 한다는 건 예를 들어, 나눗셈이란 연산에 대해 일반화를 하면 구체적인 행동(특수화)는 해당 연산에 참가하는 Type들에게 맡기는 방식의 프로그래밍

설명을 듣고도 어렵긴 하다. 공변과 반공변에 대한 이해가 필요한 듯하여 추후 제네릭을 다시 공부해야겠다.

대부분의 사람들은 제네릭을 치환의 용도로만 쓰고 제대로 쓰고 있다고 착각한다고 팩폭을 날리셨는데 실제로 제네릭을 100% 활용하는 건 정말 정말 엄청난 고통이 따른다고 하니 그 점은 기억해야겠다.

### Nullable

코틀린은 nullable 타입을 따로 구분한다. 기본적으로 null 값을 허용하지 않는다. 자바 Optional은 개발자가 실수할 여지가 있다면 코틀린은 아예 컴파일러 차원에서 nullable 인스턴스와 non-null 인스턴스를 구분해서 생성한다. 잠재적인 NPE 원천봉쇄를 위해 빡빡한 정책을 택한 것이다.

```kotlin
fun main(args: Array<String>) {
  val myBlueberryCupcake: Cupcake = null  // non-null 타입에 null 대입 불가.
}

fun main(args: Array<String>) {
  val myBlueberryCupcake: Cupcake? = null
}
```

null 여부 확인을 방식은 여러 가지가 있는데 if, is는 스마트 캐스팅 기능이 있어서 null 여부 검사 이후엔 자동으로 non-null 타입으로 캐스팅 해준다.

```kotlin
if (nullableCupcake != null) {
    nullablecupcake.eat()
}

if (nullableCupcake is Cupcake) {
  nullableCupcake.eat()
}

when (nullableCupcake) {
  is Cupcake -> nullableCupcake.eat()
}
```

!! 연산자의 경우 기본적으로 안 쓰는 게 맞지만 스마트 캐스팅이 도와주지 않을 때에 한정하여 사용해야 된다고 대표님께서 강조하셨다. 아직 스마트 캐스팅이 되지 않는 경우가 머리에 확실하게 기억되진 않아서 쓰다 보면 알 것 같다.

### Unit

자바와 달리 코틀린의 모든 함수는 반환 값이 있다. void가 없고 그 대신 Unit 타입을 반환 타입으로 갖는다. 코틀린에서 Unit은 타입인 동시에 값이다. object Unit으로 보면 된다. 아마 void가 없는 건 수학적 함수의 정의에 맞춰서 언어 디자인을 한 것 같다고 하셨다.

### 데이터 클래스

흔히 말하는 VO(Value Object)를 위해 쓰는 코틀린의 특별한 클래스이다. 어떤 클래스가 데이터를 저장하는 역할만 수행한다면 equals(), hashCode(), toString()를 반드시 오버라이드 해서 구현해야 한다. 이때 코틀린은 data class로 선언하면 컴파일러가 자동으로 생성해준다.

* equals()는 참조가 아닌 값의 일치를 비교한다.
* 값이기 때문에 필드를 가져야 해서 val or var로 생성자 파라미터를 가져야 한다.

```kotlin
data class Item(val product: BakeryGood,
    val unitPrice: Double,
    val quantity: Int)
```

주의할 점은 위의 예제에서 BakeryGood 클래스가 값비교가 아닌 참조 비교를 하는 객체라면 Item의 hashCode() 연산의 결과는 매번 달라질 것이다. 즉, 해당 data class는 오염된다.

### annotation

런타임 시 annotation 값을 쿼리하려면 리플렉션을 이용하긴 하는데 특이한 점은 자바와 달리 코틀린은 컴파일러가 자바로 변환하는 타이밍에 static으로 해당 annotation 부분들을 쑤셔 넣어(?) 주는 꼼수를 사용한다. 그래서 자바에 비해 리플렉션 로직이 굉장히 줄어들고 성능도 빠르다고 한다. 자세한 이해는 리플렉션을 공부해봐야 알 것 같다.

### Enum

Enum은 JVM or 언어 차원에서 클래스를 정의함과 동시에 인스턴스 개수를 한정하는 방식으로 이해하면 된다. 즉 정의된 요소 외에는 인스턴스를 못 만드는 것이다.

프로그램에서 필요한 인스턴스 개수에 따라 어떻게 선언해야 될지를 아래를 기준으로 정한다.

* 인스턴스 1개 - object
* 인스턴스 n개 - enum
* 인스턴스 ?개 - class
