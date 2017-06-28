# Change Log
All notable changes to the "mjml" extension will be documented in this file.

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