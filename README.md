
[![License](http://img.shields.io/npm/l/boats.svg)](https://github.com/johndcarmichael/openapi-nodegen-emailer/blob/master/LICENSE) | [![Dependencies](https://david-dm.org/johndcarmichael/openapi-nodegen-emailer.svg)](https://david-dm.org/johndcarmichael/openapi-nodegen-emailer) | [![Codecov Coverage](https://img.shields.io/codecov/c/github/johndcarmichael/openapi-nodegen-emailer/master.svg?style=flat-square)](https://codecov.io/gh/johndcarmichael/openapi-nodegen-emailer/) | [![Build Status](https://api.travis-ci.org/johndcarmichael/openapi-nodegen-emailer.svg?branch=master)](https://travis-ci.org/johndcarmichael/openapi-nodegen-emailer)

# openapi-nodegen-emailer

Write email templates with Nunjucks in independent html and text files, send with SendGrid or log to console &/or disk or simply return the email object for other use.

Automatically pickout html and text file based on a the fie structure, see below.

> New providers are welcomed, please create a pull request. This was built for use with sendgrid and unit testing domain methods.
> Additionally, language ability will be coming at some point, unless someone gets a pr in there 1st :) Someting like welcome.en.html.njk

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [How it works](#how-it-works)
- [Setup options explained](#setup-options-explained)
- [Example openapi-nodegen-typescript-server](#example-openapi-nodegen-typescript-server)
- [Example General Usage in a single file](#example-general-usage-in-a-single-file)
- [Unit test example](#unit-test-example)
- [Setup sync & async](#setup-sync--async)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How it works
- You should write a html and txt version of an email within a nunjucks file, eg:
  - email/templates/welcome.html.njk
  - email/templates/welcome.text.njk
- You should setup the emailer package with an [EmailerConstructor](https://github.com/johndcarmichael/openapi-nodegen-emailer/blob/master/src/interfaces/EmailerContructor.ts) object which will also `fs.ensureDir[Sync]` the log directory:
  - `emailerSetupSync(options)`
  - `emailerSetupAsync(options)`
- Lastly, call the [Emailer send method](https://github.com/johndcarmichael/openapi-nodegen-emailer/blob/master/src/Emailer.ts#L9), see below.

## Setup options explained
```typescript
export enum EmailerSendTypes {
  sendgrid = 'SENDGRID', // will only send to sendgrid
  file = 'FILE', // will only write to disk in the logPath directory provided in the setup options
  log = 'LOG', // will console.log and log to disk in the logPath directory provided in the setup options
  return = 'RETURN', // will only return the object that would have otherwise been used in the above
}

export default interface EmailerConstructor {
  templatePath?: string; // Full path to the folder containing the nunuck email templates, defaults to ./email/templates
  sendType: EmailerSendTypes; // This dictates what happens when Emailer.send is called values from the above enum
  logPath?: string; // Dictates where the emails are written to disk: EmailerSendTypes.file, defaults to email/logs
}
```

## Example openapi-nodegen-typescript-server
Setup the emailer in the [app.ts](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/app.ts) by adding:
```typescript
import { emailerSetupSync, EmailerSendTypes } from 'nunjucks-node-emailer';

emailerSetupSync({ sendType: EmailerSendTypes.sendgrid });
```

Use the emailer in a [domain method](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/domains/___stub.ts.njk) with a single line:
```typescript
class RegisterDomain {
  public async registerEmailPost (body: RegisterEmailPost, req: any): Promise<Login> {
    // register user ...

    // send out email
    await Emailer.send({
      to: 'john@john.com',
      from: 'bob@bob.com', 
      subject: 'Welcome to the app John!', 
      tplObject: {name: 'John'}, 
      tplRelativePath: 'welcome'
    })

    // return 
  }
}
```

The default path for the templates relative to the base of the server:
```typescript
path.join(process.cwd(), 'email/templates')
```


## Example General Usage in a single file
```typescript
import path from 'path';
import { Emailer, emailerSetupSync, EmailerSendTypes } from 'nunjucks-node-emailer';

emailerSetupSync({
  sendType: EmailerSendTypes.file,
  templatePath: path.join(process.cwd(), 'email')
});

Emailer.send({
  to: 'john@john.com',
  from: 'bob@bob.com', 
  subject: 'Welcome to the app John!', 
  tplObject: {name: 'John'}, 
  tplRelativePath: 'welcome'
})
.catch((err) => {
  console.error(err)
})
``` 

## Unit test example

Check the source code of this package: [src/__tests__/Emailer.spec.ts](https://github.com/johndcarmichael/openapi-nodegen-emailer/blob/master/src/__tests__/Emailer.ts)

As it is possible to return the prepared object from this tool it makes it possible to unit test a domain method very easily, just run the setup and instruct to write to file, log or return the object, eg:

```typescript
emailerSetupSync({ sendType: EmailerSendTypes.log });
```

Then continue to use the package as normal. As the typescript server has the domain layer abstracted from the http layer, you can now write the business logic in a domain method as above and then unit test without mocking or sending out actual emails.

## Setup sync & async
Depending on the design of your system, you may be ok or not ok with using a blocking form of the setup emailerSetupSync. Typically if you are only setting up at 1 point in the app this is a not a problem, but if you are dynamically changing on the fly, you should use `emailerSetupAsync`, it does the same job but asynchronously and returns a promise. See the "should initialise correctly" test in "Emailer.spec.ts" file.


