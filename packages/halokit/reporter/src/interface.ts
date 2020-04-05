/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

/**
 * Defines the formatting that will be given to the logging item.
 */
export enum LogLevel {
  Log = 0,
  Debug,
  Info,
  Warn,
  Error,
  Fatal,
  Success
}

/**
 * Defines a logger-friendly item.
 */
export interface LogItem {
  content: string;
  level: LogLevel;
  print?: boolean;
  emoji?: boolean;
}

/**
 * Defines a tree-formatable logger-friendly item.
 */
export interface MultiLogItem extends LogItem {
  indent: number;
  opens?: boolean;
  closes?: boolean;
}

/**
 * Defines a not fully processed, stylized logger-friendly item.
 */
export interface FormattedLogItem {
  content: string;
  technical: string;
  raw: string;
  print: boolean;
}

/**
 * Defines a fully processed, stylized logger-friendly item.
 *
 * Content: A print-friendly colored/formatted string.
 * Technical: A json-friendly string without emojis or coloring attached to it.
 * Raw: A print-friendly uncolored string.
 * Timestamp: The time in which the logging item was created.
 */
export interface LoggedItem {
  content: string;
  technical: string;
  raw: string;
  timestamp: string;
}
