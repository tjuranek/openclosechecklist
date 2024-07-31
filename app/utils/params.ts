import { Params } from '@remix-run/react';
import invariant from 'tiny-invariant';

export function getRequiredParam(params: Params<string>, key: string) {
  const value = params[key];
  invariant(value, `Param not found. Expected value for ${key}.`);

  return value as string | number;
}
