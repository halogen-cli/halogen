/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { termIO } from './terminal-io';
import {
  LogItem,
  MultiLogItem,
  FormattedLogItem,
  LoggedItem,
  LogLevel
} from './interface';

/**
 * A simple reporting class.
 */
export class ConsoleReporter {
  /**
   * @private
   */
  _emojis: Array<string>;

  /**
   * @private
   */
  _addEmojis: boolean;

  constructor(hasEmojis?: boolean) {
    this._emojis = ['', '🛠', 'ℹ️', '⚠️', '❌', '☠️', '✅'];
    this._addEmojis = hasEmojis ? true : false;
  }

  /**
   * Creates a string representation of a log-friendly item, and prints it if desired.
   *
   * @param {LogItem} item The item to log.
   */
  report(item: LogItem | MultiLogItem): LoggedItem {
    const timestamp = new Date().toISOString();
    const formattedItem = this._format(item);

    /* istanbul ignore if */
    if (formattedItem.print) {
      termIO.print(formattedItem.content);
    }

    return {
      content: formattedItem.content,
      technical: formattedItem.technical,
      raw: formattedItem.raw,
      timestamp: timestamp
    };
  }

  /**
   * @private
   */
  _isMulti(object: any): object is MultiLogItem {
    return 'indent' in object;
  }

  /**
   * @private
   */
  _format(item: LogItem | MultiLogItem): FormattedLogItem {
    let targetString = ``;

    if (this._isMulti(item)) {
      if (item.indent > 0) {
        let indents = ``;
        for (let i = 0; i < item.indent; i++) {
          indents = indents.concat('\t');
        }
        targetString = targetString.concat(indents);
      }

      if (item.opens) {
        targetString = targetString.concat(`┌─ `);
      } else if (item.closes) {
        targetString = targetString.concat(`└─── `);
      } else {
        targetString = targetString.concat(`├─── `);
      }
    }

    targetString = targetString.concat(item.content);
    const applyEmoji = this._addEmojis ? true : false;

    /* istanbul ignore next */
    const printToConsole = item.print ? true : false;

    switch (item.level) {
      case LogLevel.Debug:
        targetString = this._formatDebug(targetString);
        break;
      case LogLevel.Info:
        targetString = this._formatInfo(targetString);
        break;
      case LogLevel.Warn:
        targetString = this._formatWarn(targetString);
        break;
      case LogLevel.Error:
        targetString = this._formatError(targetString);
        break;
      case LogLevel.Fatal:
        targetString = this._formatFatal(targetString);
        break;
      case LogLevel.Success:
        targetString = this._formatSuccess(targetString);
        break;
    }

    const technicalString = targetString;

    if (applyEmoji) {
      const emoji = this._emojis[item.level];
      const space = emoji.length === 2 ? '  ' : ' ';
      targetString = emoji.concat(space + targetString);
    }

    const rawString = termIO.stripANSI(targetString);

    return {
      content: targetString,
      technical: technicalString,
      raw: rawString,
      print: printToConsole
    };
  }

  /**
   * @private
   */
  _formatDebug(content: string): string {
    const block = termIO.formatter.cyan('debug:');
    const base = block.concat(' ' + content);
    return base;
  }

  /**
   * @private
   */
  _formatError(content: string): string {
    const block = termIO.formatter.red('error:');
    const base = block.concat(' ' + content);
    return base;
  }

  /**
   * @private
   */
  _formatFatal(content: string): string {
    const block = termIO.formatter.red.underline('fatal:');
    const base = block.concat(' ' + content);
    return base;
  }

  /**
   * @private
   */
  _formatInfo(content: string): string {
    const block = termIO.formatter.blue('info:');
    const base = block.concat(' ' + content);
    return base;
  }

  /**
   * @private
   */
  _formatSuccess(content: string): string {
    const block = termIO.formatter.green('success:');
    const base = block.concat(' ' + content);
    return base;
  }

  /**
   * @private
   */
  _formatWarn(content: string): string {
    const block = termIO.formatter.yellow('warn:');
    const base = block.concat(' ' + content);
    return base;
  }
}

export const reporter = new ConsoleReporter();
export const emojiReporter = new ConsoleReporter(true);
