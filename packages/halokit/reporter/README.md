# @halokit/reporter

> A terminal reporting utility with logging capabilities.

## Contents

- [Getting started](#getting-started)
- [Usage](#usage)
  - [Importing](#importing)
  - [Creating a logging item](#creating-a-logging-item)
  - [Logging the item](#logging-the-item)
- [Contributing](#contributing)
- [License](#license)

## Getting started

To install `@halokit/reporter` in your project, you will need to run the following command using [npm](https://www.npmjs.com/):

```bash
npm install -S @halokit/reporter
```

If you prefer [yarn](https://yarnpkg.com/en/), use the following command instead:

```bash
yarn add @halokit/reporter
```

## Usage

### Importing

This module can be imported and used by doing the following in your code:

```typescript
// ES6 Module
import { reporter, emojiReporter } from '@halokit/reporter';

// CommonJS Module
const { reporter, emojiReporter } = require('@halokit/reporter');
```

> *All the modules have TypeScript type definitions built in. There is no need to install additional packages.*

### Creating a logging item

HaloKit's reporter relies on a specific object format that should have at least the following properties:

```javascript
var item = {
  content: 'Hello world!',
  level: 1 // 0 - 6
}
```

If you are using typescript, you can use the interface `LogItem` to build objects, as defined here:

```typescript
interface LogItem {
  content: string;
  level: LogLevel;
  print?: boolean;
}
```

The print property will determine whether the built log entry should be redirected to standard output aswell, and defaults to `false`.

Where the available log levels are:

```typescript
export enum LogLevel {
  Log = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Success = 6
}
```

> *You can use the enum name or it's integer representation.*

### Logging the item

Once you have your loggable item created, you can generate a log/reporting entry out of it by using the reporter of your choice.

This package exports both a `reporter` and an `emojiReporter`. If you decide to use the emoji reporter, an emoji, representative of each level, with be added at the beginning of each logging entry.

A working example would be as follows:

```typescript
import { reporter, emojiReporter } from '@halokit/reporter';

const item = {
  content: 'Hello world!',
  level: 1
}

const plainLog = reporter.report(item); // debug: Hello world!
const emojiLog = emojiReporter.report(item); // 🛠  debug: Hello world!
```

Once you've called the `report()` method, another object will be returned with the following properties:

```typescript
{
  content: string; // Built log .
  technical: string; // Plain log, without any emojis or coloring.
  raw: string; // Plain log with emojis, but no coloring.
  timestamp: string; // Time of creation of the log.
}
```

## Contributing

We're always looking for contributors to help us fix bugs, build new features, or help us improve the project documentation.

## License

This module is licensed under the [Apache 2.0 License](https://github.com/halogen-cli/halogen/blob/master/LICENSE).
