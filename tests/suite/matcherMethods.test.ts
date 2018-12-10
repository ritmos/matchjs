import {Matcher} from "../../src/matcher";
import {MatcherConstructor} from "../../src/matcherConstructor";


/*
 The purpose of this test is to check if both matcher implementations contains
 the same case* methods just in case I forgot something
 */
test("MatcherConstructor and Matcher classes contains the same case methods", done => {
    const matcherConstructor = new MatcherConstructor("x");
    const matcher = new Matcher("x");

    for (let key in matcherConstructor) {
        if (isCaseMethod(key) && (matcher as any)[key] == null)
            fail();
    }

    for (let key in matcher) {
        if (isCaseMethod(key) && (matcherConstructor as any)[key] == null)
            fail();
    }

    done();
});

function isCaseMethod(method: string) {
    return /^case.*/.test(method);
}