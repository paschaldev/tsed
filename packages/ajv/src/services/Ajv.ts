import {isClass, Type} from "@tsed/core";
import {Configuration, InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import * as Ajv from "ajv";
import {KeywordDefinition, ValidateFunction} from "ajv";
import {IAjvSettings} from "../interfaces/IAjvSettings";

// tslint:disable-next-line:variable-name
export const AJV: any = Symbol.for("AJV");
export type AJV = Ajv.Ajv;

function getValidateHandler(injector: InjectorService, target: Type<any>): ValidateFunction {
  return ((...args: any[]) => {
    return injector.get(target)?.validate(...args) as unknown;
  }) as ValidateFunction;
}

function bindKeywords(keywords: {}, injector: InjectorService) {
  Object.entries(keywords).reduce((keywords, [key, options]: [string, KeywordDefinition]) => {
    if (isClass(options.validate) && injector.has(options.validate)) {
      const target = options.validate;
      const validate = getValidateHandler(injector, target as any);

      return {
        ...keywords,
        [key]: {
          ...options,
          validate
        }
      };
    }

    return keywords;
  });

  return keywords;
}

registerProvider({
  provide: AJV,
  deps: [Configuration, InjectorService],
  scope: ProviderScope.SINGLETON,
  useFactory(configuration: Configuration, injector: InjectorService) {
    const {errorFormatter, keywords = {}, ...props} = configuration.get<IAjvSettings>("ajv") || {};

    return new Ajv({
      verbose: false,
      coerceTypes: true,
      async: true,
      keywords: bindKeywords(keywords, injector),
      ...props
    });
  }
});
