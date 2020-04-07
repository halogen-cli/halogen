/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import {
  MultiLogItem,
  reporter,
  emojiReporter,
  LogLevel,
  LogItem
} from '../src';

describe('@Halokit/Reporter :: Reporting functionality', () => {
  it('reports multi-logging correctly', () => {
    const parentItem: MultiLogItem = {
      indent: 0,
      level: LogLevel.Log,
      content: 'Parent',
      opens: true
    };
    const child1: MultiLogItem = {
      indent: 0,
      level: LogLevel.Log,
      content: 'Child 1',
      closes: true
    };
    const child11: MultiLogItem = {
      indent: 1,
      level: LogLevel.Log,
      content: 'Child 1 of Child 1'
    };
    const child12: MultiLogItem = {
      indent: 1,
      level: LogLevel.Log,
      content: 'Child 2 of Child 1',
      closes: true
    };

    const res1 = reporter.report(parentItem);
    const res2 = reporter.report(child1);
    const res3 = reporter.report(child11);
    const res4 = reporter.report(child12);

    expect(res1.content).toEqual('┌─ Parent');
    expect(res2.content).toEqual('└─── Child 1');
    expect(res3.content).toEqual('\t├─── Child 1 of Child 1');
    expect(res4.content).toEqual('\t└─── Child 2 of Child 1');
  });

  it('reports formatted logs correctly', () => {
    const log1: LogItem = {
      content: 'A plain debug log',
      level: LogLevel.Debug
    };
    const log1E: LogItem = {
      content: 'An emojified debug log',
      level: LogLevel.Debug
    };
    const log2: LogItem = {
      content: 'An info log',
      level: LogLevel.Info
    };
    const log3: LogItem = {
      content: 'A warning log',
      level: LogLevel.Warn
    };
    const log4: LogItem = {
      content: 'An error log',
      level: LogLevel.Error
    };
    const log5: LogItem = {
      content: 'A fatal log',
      level: LogLevel.Fatal
    };
    const log6: LogItem = {
      content: 'A success log',
      level: LogLevel.Success
    };

    const res1 = reporter.report(log1);
    const res2 = emojiReporter.report(log1E);
    const res3 = emojiReporter.report(log2);
    const res4 = emojiReporter.report(log3);
    const res5 = emojiReporter.report(log4);
    const res6 = emojiReporter.report(log5);
    const res7 = emojiReporter.report(log6);

    expect(res1.raw).toEqual('debug: A plain debug log');
    expect(res2.raw).toEqual('🛠  debug: An emojified debug log');
    expect(res3.raw).toEqual('ℹ️  info: An info log');
    expect(res4.raw).toEqual('⚠️  warn: A warning log');
    expect(res5.raw).toEqual('❌ error: An error log');
    expect(res6.raw).toEqual('☠️  fatal: A fatal log');
    expect(res7.raw).toEqual('✅ success: A success log');
  });
});
