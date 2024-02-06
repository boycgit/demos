import { describe, expect, test } from '@jest/globals';
import { injectable, Scope, Container, injectAll, inject } from '.';
import { InjectionKey } from '.';


interface Bird {
    fly(): void
    searchForFood(): void
    breed(): void
}


interface IZoo {
    getAllBirds(): Bird[]
}

const BIRD_BINDING: InjectionKey<Bird> = Symbol('Bird')
const ZOO_KEY: InjectionKey<IZoo> = Symbol.for('Zoo')

describe('di', () => {

    test('throw error if metadata is not defined', () => {
        const container = new Container()
        class MyBird {
            fly() { }
            searchForFood() { }
            breed() { }
        }

        expect(() => container.bind(BIRD_BINDING, MyBird)).toThrowError('No metadata found for MyBird')
    })

    test('singleton', () => {
        @injectable(BIRD_BINDING)
        class MyBird {
            fly() { }
            searchForFood() { }
            breed() { }
        }

        const container = new Container()
        container.bind(BIRD_BINDING, MyBird)

        const bird1 = container.get(BIRD_BINDING)
        expect(bird1).toBeInstanceOf(MyBird)

        const bird2 = container.get(BIRD_BINDING)
        expect(bird2).toBeInstanceOf(MyBird)
        expect(bird1).toBe(bird2)
    })


    test('singleton multiple', () => {
        @injectable(BIRD_BINDING)
        class MyBird {
            fly() { }
            searchForFood() { }
            breed() { }
        }

        @injectable(BIRD_BINDING)
        class MyBird2 {
            fly() { }
            searchForFood() { }
            breed() { }
        }

        const container = new Container()
        container.bind(BIRD_BINDING, MyBird)
        container.bind(BIRD_BINDING, MyBird2)

        const birds1 = container.getAll(BIRD_BINDING)
        expect(birds1.length).toBe(2)
        expect(birds1[0]).toBeInstanceOf(MyBird)
        expect(birds1[1]).toBeInstanceOf(MyBird2)

        const birds2 = container.getAll(BIRD_BINDING)
        expect(birds1[0]).toBe(birds2[0])
        expect(birds1[1]).toBe(birds2[1])
    })

    test('transiten', () => {
        @injectable(BIRD_BINDING, Scope.Transient)
        class MyBird {
            fly() { }
            searchForFood() { }
            breed() { }
        }

        const container = new Container()
        container.bind(BIRD_BINDING, MyBird)

        const bird1 = container.get(BIRD_BINDING)
        expect(bird1).toBeInstanceOf(MyBird)

        const bird2 = container.get(BIRD_BINDING)
        expect(bird2).toBeInstanceOf(MyBird)
        expect(bird1).not.toBe(bird2)
    })

    test('property inject', () => {
        // 🔴 使用 @injectable 标注支持注入的类
        @injectable(BIRD_BINDING)
        class MyBird {
            fly() { }
            searchForFood() { }
            breed() { }
        }

        @injectable(BIRD_BINDING)
        class MyBird2 {
            fly() { }
            searchForFood() { }
            breed() { }
        }

        @injectable(ZOO_KEY)
        class Zoo implements IZoo {
            // 🔴 获取所有 Bird 实例
            @injectAll(BIRD_BINDING)
            birds?: Bird[]

            getAllBirds() {
                return this.birds!
            }
        }

        // 🔴 注册到容器
        const container = new Container()
        container.bind(BIRD_BINDING, MyBird)
        container.bind(BIRD_BINDING, MyBird2)
        container.bind(ZOO_KEY, Zoo)

        // 测试
        const zoo = container.get(ZOO_KEY)
        console.log(333, zoo);


        expect(zoo).toBeInstanceOf(Zoo)
        expect(zoo.getAllBirds().length).toBe(2)
        expect(zoo.getAllBirds()[0]).toBeInstanceOf(MyBird)
        expect(zoo.getAllBirds()[1]).toBeInstanceOf(MyBird2)
    })


    test('cycle dependency', () => {
        const container = new Container()

        const A_KEY: InjectionKey<A> = Symbol('A')
        const B_KEY: InjectionKey<B> = Symbol('B')

        @injectable(A_KEY)
        class A {
            @inject(B_KEY)
            b?: B

            constructor() { }
        }

        @injectable(B_KEY)
        class B {
            @inject(A_KEY)
            a?: A

            constructor() { }
        }

        container.bind(A_KEY, A)
        container.bind(B_KEY, B)

        const a = container.get(A_KEY)
        expect(a).toBeInstanceOf(A)
        const b = container.get(B_KEY)
        expect(b).toBeInstanceOf(B)
        expect(a.b).toBe(b)
        expect(b.a).toBe(a)
    })
});



function meta(key: string) {
    return (value: unknown, context: DecoratorContext) => {
        context.metadata![key] = true
    }
}

// 另一个例子：验证说明 metadata 字段的“同类共用、不同类隔离“的特性
describe('metadata', ()=> {
    test('different class has different metadat', ()=>{
        @meta('inClassFoo')
        class Foo {
            @meta('inStaticMemberFoo')
            static staticMember = 1

            @meta('inMemberFoo')
            member = 2
        }


        @meta('inClassBar')
        class Bar {
            @meta('inStaticMemberBar')
            static staticMember = 1

            @meta('inMemberBar')
            member = 2
        }

        expect(Foo[Symbol.metadata]).toEqual({
            inClassFoo: true,
            inStaticMemberFoo: true,
            inMemberFoo: true,
        })
        
        expect(Bar[Symbol.metadata]).toEqual({
            inClassBar: true,
            inStaticMemberBar: true,
            inMemberBar: true,
        });
    })
})
