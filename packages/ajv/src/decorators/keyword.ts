import {StoreSet, useDecorators} from "@tsed/core";
import {Configuration, Injectable} from "@tsed/di";
import {KeywordDefinition} from "ajv";

export type KeywordOptions = Omit<KeywordDefinition, "validate">;

/**
 * Create new keyword custom validator
 * @param keyword
 * @param options
 * @decorator
 */
export function Keyword(keyword: string, options: KeywordOptions = {}): ClassDecorator {
  return useDecorators(
    Injectable,
    StoreSet("ajv:keyword", options),
    Configuration({
      ajv: {
        keywords: {
          [keyword]: options
        }
      }
    }),
    (target: any) => {
      (options as any).validate = target;
    }
  );
}
