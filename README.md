# MJML
MJML preview, lint, compile for Visual Studio Code.

[![GitHub license][license-img]][license-url]
[![Visual Studio Marketplace][vs-market-version]][vs-market-url]
[![Visual Studio Marketplace installs][vs-market-installs]][vs-market-url]
[![Dependencies Status][dependencies-status]][dependencies-status]

## Features

* Live preview for MJML files. Preview updates as you type. Preview based on [html-preview-vscode](https://github.com/tht13/html-preview-vscode).
* Inline errors (squiggle underlines). Linter based on [atom-linter-mjml](https://github.com/mjmlio/atom-linter-mjml).
* Export HTML file from MJML.
* Copy the result HTML to clipboard.
* Take a screenshot of the rendered MJML document.
* Send email with Nodemailer or Mailjet.
* Code snippets for MJML. Based on [mjml-syntax](https://github.com/mjmlio/mjml-syntax).
* Fetch official templates. Based on [mjml-app](https://github.com/mjmlio/mjml-app).
* Beautify MJML code.
* Migrate a template from MJML 3 to MJML 4.

## It looks like this

![MJML Preview](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-preview.gif)

![MJML Lint](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-lint.gif)

## Installation

Press `F1`, type `ext install vscode-mjml`.

## Usage

Start command palette (with `Ctrl+Shift+P` or `F1`) and start typing `MJML`.

## Available commands

The following command is available:
* **MJML: Beautify** or **Format Document** Beautify MJML code.
* **MJML: Copy HTML** Copy the result HTML to clipboard.
* **MJML: Export HTML** Export HTML file from MJML.
* **MJML: Migrate** Migrate a template from MJML 3 to MJML 4.
* **MJML: Multiple Screenshots** Take multiple screenshots of the rendered MJML document.
* **MJML: Open Preview to the Side** Opens a preview in a column alongside the current document.
* **MJML: Screenshot** Take a screenshot of the rendered MJML document, and save it as a file.
* **MJML: Send Email** Send email with Nodemailer or Mailjet.
* **MJML: Template** Fetch official templates.

## Settings

| Name | Default | Description |
| --- | --- | --- |
| `mjml.beautifyHtmlOutput` | `false` | Beautify HTML output. (Works when `mjml.minifyHtmlOutput` aren't enabled.) |
| `mjml.beautify` | ` ` | Beautify options ([available options](https://github.com/beautify-web/js-beautify#options)). |
| `mjml.exportType` | `.html` | Specifies the file type of the output file. |
| `mjml.lintEnable` | `true` | Enable/disable MJML linter (requires restart). |
| `mjml.lintWhenTyping` | `true` | Whether the linter is run on type or on save. |
| `mjml.mailFromName` | ` ` | Sender name. |
| `mjml.mailRecipients` | ` ` | Comma separated list of recipients email addresses. |
| `mjml.mailSender` | ` ` | Sender email address. (Mailjet: must be a verified sender.) |
| `mjml.mailSubject` | ` ` | Email subject. |
| `mjml.mailer` | `mailjet` | Send email with Nodemailer or Mailjet. Possible values are 'nodemailer' and 'mailjet'. |
| `mjml.mailjetAPIKey` | ` ` | Mailjet API Key. |
| `mjml.mailjetAPISecret` | ` ` | Mailjet API Secret. |
| `mjml.minifyHtmlOutput` | `true` | Minify HTML output. |
| `mjml.nodemailer` | `{}` | Nodemailer configuration. Please see the [Nodemailer](https://nodemailer.com) documentation for more information. |
| `mjml.preserveFocus` | `true` | Preserve focus of Text Editor after preview open. |
| `mjml.screenshotQuality` | `75` | Screenshot quality. |
| `mjml.screenshotType` | `jpg` | Screenshot type. Possible values are 'png', 'jpg', and 'jpeg'. |
| `mjml.screenshotWidth` | `650` | Screenshot width. |
| `mjml.screenshotWidths` | `640,750` | Screenshot widths. |
| `mjml.updateWhenTyping` | `true` | Update preview when typing. |

## Snippets

| Trigger | URL | Content |
| --- | --- | --- |
| `mjall` | [mj-all](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md) | `<mj-all />` |
| `mjattributes` | [mj-attributes](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md) | `<mj-attributes></mj-attributes>` |
| `mjbody` | [mj-body](https://github.com/mjmlio/mjml/blob/master/packages/mjml-body/README.md) | `<mj-body></mj-body>` |
| `mjbreakpoint` | [mj-breakpoint](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-breakpoint/README.md) | `<mj-breakpoint width="" />` |
| `mjbutton` | [mj-button](https://github.com/mjmlio/mjml/blob/master/packages/mjml-button/README.md) | `<mj-button></mj-button>` |
| `mjcarousel` | [mj-carousel](https://github.com/mjmlio/mjml/blob/master/packages/mjml-carousel/README.md) | `<mj-carousel></mj-carousel>` |
| `mjcarousel-image` | [mj-carousel-image](https://github.com/mjmlio/mjml/blob/master/packages/mjml-carousel/README.md#mjml-carousel-image) | `<mj-carousel-image src="" />` |
| `mjclass` | [mj-class](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md) | `<mj-class name="" />` |
| `mjcolumn` | [mj-column](https://github.com/mjmlio/mjml/blob/master/packages/mjml-column/README.md) | `<mj-column width=""></mj-column>` |
| `mjdivider` | [mj-divider](https://github.com/mjmlio/mjml/blob/master/packages/mjml-divider/README.md) | `<mj-divider />` |
| `mjfont` | [mj-font](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-font/README.md) | `<mj-font name="" href="" />` |
| `mjgroup` | [mj-group](https://github.com/mjmlio/mjml/blob/master/packages/mjml-group/README.md) | `<mj-group></mj-group>` |
| `mjhead` | [mj-head](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mj-head) | `<mj-head></mj-head>` |
| `mjhero` | [mj-hero](https://github.com/mjmlio/mjml/blob/master/packages/mjml-hero/README.md) | `<mj-hero></mj-hero>` |
| `mjimage` | [mj-image](https://github.com/mjmlio/mjml/blob/master/packages/mjml-image/README.md) | `<mj-image src="" alt="" />` |
| `mjinclude` | [mj-include](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mj-include) | `<mj-include path="" />` |
| `mjraw` | [mj-raw](https://github.com/mjmlio/mjml/blob/master/packages/mjml-raw/README.md) | `<mj-raw></mj-raw>` |
| `mjsection` | [mj-section](https://github.com/mjmlio/mjml/blob/master/packages/mjml-section/README.md) | `<mj-section></mj-section>` |
| `mjsocial` | [mj-social](https://github.com/mjmlio/mjml/blob/master/packages/mjml-social/README.md) | `<mj-social></mj-social>` |
| `mjsocialelement` | [mj-social-element](https://github.com/mjmlio/mjml/blob/master/packages/mjml-social/README.md#mj-social-element) | `<mj-social-element></mj-social-element>` |
| `mjstyle` | [mj-style](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-style/README.md) | `<mj-style></mj-style>` |
| `mjtable` | [mj-table](https://github.com/mjmlio/mjml/blob/master/packages/mjml-table/README.md) | `<mj-table></mj-table>` |
| `mjtext` | [mj-text](https://github.com/mjmlio/mjml/blob/master/packages/mjml-text/README.md) | `<mj-text></mj-text>` |
| `mjtitle` | [mj-title](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-title/README.md) | `<mj-title></mj-title>` |
| `mjml` | [mjml](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mjml) | `<mjml></mjml>` |
| `mjpreview` | [mj-preview](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-preview/README.md) | `<mj-preview></mj-preview>` |
| `mjspacer` | [mj-spacer](https://github.com/mjmlio/mjml/blob/master/packages/mjml-spacer/README.md) | `<mj-spacer height="" />` |
| `mjwrapper` | [mj-wrapper](https://github.com/mjmlio/mjml/blob/master/packages/mjml-wrapper/README.md) | `<mj-wrapper></mj-wrapper>` |
| `mjaccordion` | [mj-accordion](https://github.com/mjmlio/mjml/blob/master/packages/mjml-accordion/README.md) | `<mj-accordion></mj-accordion>` |
| `mjaccordion-element` | [mj-accordion-element](https://github.com/mjmlio/mjml/blob/master/packages/mjml-accordion/README.md#mjml-accordion-element) | `<mj-accordion-element>...</mj-accordion-element>` |
| `mjnavbar` | [mj-navbar](https://github.com/mjmlio/mjml/blob/master/packages/mjml-navbar/README.md) | `<mj-navbar></mj-navbar>` |
| `mjnavbarlink` | [mj-navbar-link](https://github.com/mjmlio/mjml/blob/master/packages/mjml-navbar/README.md#mjml-navbar-link) | `<mj-navbar-link></mj-navbar-link>` |
| `mjlink` | [mj-link](https://mjml.io/documentation/#mjml-navbar) | `<mj-link href=""></mj-link>` |
| `mjml-` | | Basic MJML Template |

## Nodemailer configuration

Please see the [Nodemailer](https://nodemailer.com) documentation for more information.

### [Gmail](https://gmail.com)
```json
"mjml.nodemailer": {
    "service": "Gmail",
    "auth": {
        "user": "youremail@gmail.com",
        "pass": "password"
    }
}
```

### [Mailtrap](https://mailtrap.io)
```json
"mjml.nodemailer": {
    "host": "smtp.mailtrap.io",
    "port": 2525,
    "auth": {
        "user": "username",
        "pass": "password"
    }
}
```

### [Ethereal](https://ethereal.email)
```json
"mjml.nodemailer": {
    "host": "smtp.ethereal.email",
    "port": 587,
    "auth": {
        "user": "youremail@ethereal.email",
        "pass": "password"
    }
}
```

## Change Log

### [1.2.1] (2018-04-15)
* [#24](https://github.com/attilabuti/vscode-mjml/issues/24): fixed.
* Dependency updates.

### [1.2.0] (2018-03-26)
* [new] Configuration property `mjml.mailer`: send email with Nodemailer or Mailjet. Possible values are 'nodemailer' and 'mailjet'.
* [new] Configuration property `mjml.nodemailer`: Nodemailer configuration. Please see the [Nodemailer](https://nodemailer.com) documentation for more information.
* Send email with Nodemailer.
* Added support for inline images (automatically generated from local images).
* New preview icon.
* Some other improvements.
* MJML 4.0.3

### [1.1.0] (2018-03-18)
* [new] Configuration property `mjml.exportType`: Specifies the file type of the output file.
* `MJML: Export HTML`: allows to specify the exported file type (e.g. example.html or .pug).
* MJML 4.0.2

### [1.0.0] (2018-03-07)
* [new] `MJML: Migrate`: Migrate a template from MJML 3 to MJML 4.
* Change to [Semantic Versioning](https://semver.org/).
* Some fixes.
* MJML 4.0.0

### [0.1.0] (2017-12-14)
* [new] `MJML: Beautify`: [#8](https://github.com/attilabuti/vscode-mjml/issues/8) Beautify MJML code.
* [#15](https://github.com/attilabuti/vscode-mjml/pull/15): fixed preview cache issue.
* Some other improvements.

### [0.0.9] (2017-10-06)
* [new] Configuration property `mjml.screenshotWidths`: Screenshot widths.
* [new] `MJML: Multiple Screenshots`: [#13](https://github.com/attilabuti/vscode-mjml/issues/13) Take multiple screenshots of the rendered MJML document.
* [new] `MJML: Template`: Fetch official templates from source. Based on [mjml-app](https://github.com/mjmlio/mjml-app).
* Some other small improvements.
* MJML 3.3.5

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

## Issues

Submit the [issues](https://github.com/attilabuti/vscode-mjml/issues) if you find any bug or have any suggestion.

## Contribution

Fork the [repo](https://github.com/attilabuti/vscode-mjml) and submit pull requests.

## Contributors

A big thanks to the people that have contributed to this project:

- Christian Brevik ([@cbrevik](https://github.com/cbrevik)) - [contributions](https://github.com/attilabuti/vscode-mjml/commits?author=cbrevik))
- Kevin Oliveira ([@kvnol](https://github.com/kvnol)) - [contributions](https://github.com/attilabuti/vscode-mjml/commits?author=kvnol))

## License

This extension is licensed under the [MIT License][license-url].

[license-img]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/LICENSE
[vs-market-version]: https://vsmarketplacebadge.apphb.com/version-short/attilabuti.vscode-mjml.svg?style=flat-square
[vs-market-installs]: https://vsmarketplacebadge.apphb.com/installs/attilabuti.vscode-mjml.svg?style=flat-square
[vs-market-url]: https://marketplace.visualstudio.com/items?itemName=attilabuti.vscode-mjml
[dependencies-status]: https://david-dm.org/attilabuti/vscode-mjml/status.svg?style=flat-square