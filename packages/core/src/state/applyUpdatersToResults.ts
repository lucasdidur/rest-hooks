import { Schema } from '@rest-hooks/normalizr';
import { Normalize, UpdateFunction } from '@rest-hooks/endpoint';

type ResultStateFromUpdateFunctions<
  SourceSchema extends Schema,
  UpdateFunctions extends {
    [key: string]: UpdateFunction<SourceSchema, any>;
  }
> = { [K in keyof UpdateFunctions]: any };

export default function applyUpdatersToResults<
  SourceSchema extends Schema,
  UpdateFunctions extends {
    [key: string]: UpdateFunction<SourceSchema, any>;
  }
>(
  results: ResultStateFromUpdateFunctions<SourceSchema, UpdateFunctions>,
  result: Normalize<SourceSchema>,
  updaters: UpdateFunctions | undefined,
) {
  if (!updaters) return results;
  return {
    ...results,
    ...Object.fromEntries(
      Object.entries(updaters).map(([fetchKey, updater]) => [
        fetchKey,
        updater(result, results[fetchKey]),
      ]),
    ),
  };
}
