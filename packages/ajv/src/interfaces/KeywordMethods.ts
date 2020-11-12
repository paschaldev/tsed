export interface KeywordMethods {
  validate(
    data: any,
    dataPath?: string,
    parentData?: object | Array<any>,
    parentDataProperty?: string | number,
    rootData?: object | Array<any>
  ): boolean | Promise<any>;
}
