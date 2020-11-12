import {PlatformTest} from "@tsed/common/src";
import {Keyword} from "../../src/decorators/keyword";
import {KeywordMethods} from "../../src/interfaces/KeywordMethods";

@Keyword("customKey", {
  async: true,
  type: "number"
})
class IdExistsKeyword implements KeywordMethods {
  async validate(data: any, dataPath?: string, parentData?: object | Array<any>, parentDataProperty?: string | number, rootData?: object | Array<any>): Promise<any> {
    return Promise.resolve(true);
  }
}

describe("Keywords", () => {
  beforeEach(PlatformTest.create)
  afterEach(PlatformTest.reset)

  it('should call validation with custom key')
});