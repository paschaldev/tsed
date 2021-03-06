import {nameOf, Store} from "@tsed/core";
import {MONGOOSE_MODEL_NAME} from "../constants";
import {MongooseModelOptions} from "../interfaces/MongooseModelOptions";
import {registerModel} from "../registries/MongooseModelRegistry";
import {MongooseModels} from "../registries/MongooseModels";
import {MONGOOSE_CONNECTIONS} from "../services/MongooseConnections";
import {createModel, getSchema} from "../utils";
import {applySchemaOptions, schemaOptions} from "../utils/schemaOptions";

/**
 * Define a class as a Mongoose Model. The model can be injected to the Service, Controller, Middleware, Converters or Filter with
 * `@Inject` annotation.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Property()
 *   field: string;
 * }
 * ```
 *
 * Then inject the model into a service:
 *
 * ```typescript
 * class MyService {
 *    constructor(@Inject(EventModel) eventModel: MongooseModel<EventModel>) {
 *        eventModel.findById().exec();
 *    }
 * }
 * ```
 *
 * ### Options
 *
 * - `schemaOptions` (mongoose.SchemaOptions): Option to configure the schema behavior.
 * - `name` (String): model name.
 * - `collection` (String): collection (optional, induced from model name).
 * - `skipInit` (Boolean): skipInit whether to skip initialization (defaults to false).
 *
 * @param {MongooseModelOptions} options
 * @returns {(target: any) => void}
 * @decorator
 * @mongoose
 * @class
 */
export function Model(options: MongooseModelOptions = {}) {
  return (target: any) => {
    const name = options.name || nameOf(target);
    Store.from(target).set(MONGOOSE_MODEL_NAME, name);
    MongooseModels.set(name, target);

    const schema = getSchema(target, options);

    registerModel({
      provide: target,
      deps: [MONGOOSE_CONNECTIONS],
      useFactory(connections: MONGOOSE_CONNECTIONS) {
        applySchemaOptions(schema, schemaOptions(target));

        return createModel(target, schema, options.name, options.collection, options.skipInit, connections.get(options.connection));
      }
    });
  };
}
