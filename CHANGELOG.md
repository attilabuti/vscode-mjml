# Change Log
All notable changes to the "mjml" extension will be documented in this file.

### [0.0.8] (2017-09-04)
* [#10](https://github.com/attilabuti/vscode-mjml/issues/10): added MJML snippets. Based on [mjml-syntax](https://github.com/mjmlio/mjml-syntax).

### [0.0.7] (2017-07-21)
* [#5](https://github.com/attilabuti/vscode-mjml/issues/5): .mjmlconfig is now supported.
* [new] Configuration property `mjml.mailjetAPIKey`: Mailjet API Key.
* [new] Configuration property `mjml.mailjetAPISecret`: Mailjet API Secret.
* [new] Configuration property `mjml.mailSender`: Sender email address. (Mailjet: must be a verified sender.)
* [new] Configuration property `mjml.mailFromName`: Sender name.
* [new] Configuration property `mjml.mailSubject`: Email subject.
* [new] Configuration property `mjml.mailRecipients`: Comma separated list of recipients email addresses.
* [new] `MJML: Copy HTML`: Copy the result HTML to clipboard.
* [new] `MJML: Send Email`: Send email with Mailjet.
* Some other small improvements.

### [0.0.6] (2017-06-28)
* Added PhantomJS-rebuild functionallity in order to build PhantomJS for the propper OS. Based on [MarkdownConverter](https://github.com/manuth/MarkdownConverter).

### [0.0.5] (2017-06-28)
* [#3](https://github.com/attilabuti/vscode-mjml/issues/3): fixed preview issue.
* [new] Configuration property `mjml.lintWhenTyping`: whether the linter is run on type or on save.
* [new] Configuration property `mjml.minifyHtmlOutput`: minify HTML output.
* [new] Configuration property `mjml.beautifyHtmlOutput`: beautify HTML output. (Works when `mjml.minifyHtmlOutput` aren't enabled.)
* [new] Configuration property `mjml.screenshotWidth`: screenshot width.
* [new] Configuration property `mjml.screenshotType`: screenshot type. Possible values are 'png', 'jpg', and 'jpeg'.
* [new] Configuration property `mjml.screenshotQuality`: screenshot quality.
* [new] `MJML: Screenshot`: Take a screenshot of the rendered MJML document, and save it as a file.
* Fixed background-url path issue.
* Lint when a MJML file is opened.
* Some other small improvements.

### [0.0.4] (2017-06-21)
* [#1](https://github.com/attilabuti/vscode-mjml/pull/1): fixed image path issue.
* [#2](https://github.com/attilabuti/vscode-mjml/issues/2): fixed mj-include issue.
* [new] Configuration property `mjml.preserveFocus`: preserve focus of Text Editor after preview open.
* [new] Configuration property `mjml.updateWhenTyping`: update preview when typing.
* `MJML: Open Preview` was renamed to `MJML: Open Preview to the Side`
* `MJML: Generate HTML` was renamed to `MJML: Export HTML`
* MJML 3.3.3

### [0.0.2] (2017-05-08)
* Some fixes.

### [0.0.1] (2017-05-07)
* This is the initial release of this extension.