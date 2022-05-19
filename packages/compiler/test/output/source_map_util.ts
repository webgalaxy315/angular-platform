/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SourceMap} from '@angular/compiler';
import b64 from 'base64-js';
import {SourceMapConsumer} from 'source-map';

export interface SourceLocation {
  line: number;
  column: number;
  source: string;
}

export function originalPositionFor(
    sourceMap: SourceMap, genPosition: {line: number, column: number}): SourceLocation {
  // Note: The `SourceMap` type from the compiler is different to `RawSourceMap`
  // from the `source-map` package, but the method we rely on works as expected.
  const smc = new SourceMapConsumer(sourceMap as any);
  // Note: We don't return the original object as it also contains a `name` property
  // which is always null and we don't want to include that in our assertions...
  const {line, column, source} = smc.originalPositionFor(genPosition);
  return {line, column, source};
}

export function extractSourceMap(source: string): SourceMap|null {
  let idx = source.lastIndexOf('\n//#');
  if (idx == -1) return null;
  const smComment = source.slice(idx).split('\n', 2)[1].trim();
  const smB64 = smComment.split('sourceMappingURL=data:application/json;base64,')[1];
  return smB64 ? JSON.parse(decodeB64String(smB64)) as SourceMap : null;
}

function decodeB64String(s: string): string {
  return b64.toByteArray(s).reduce((s: string, c: number) => s + String.fromCharCode(c), '');
}
