# MJML
MJML preview, lint, compile for Visual Studio Code.

[![GitHub license][license-img]][license-url]
[![Visual Studio Marketplace][vs-market-version]][vs-market-url]
[![Visual Studio Marketplace installs][vs-market-installs]][vs-market-url]

## Features

* Live preview for MJML files. Preview updates as you type. Preview based on [html-preview-vscode](https://github.com/tht13/html-preview-vscode).
* Inline errors (squiggle underlines). Linter based on [atom-linter-mjml](https://github.com/mjmlio/atom-linter-mjml).
* Export HTML file from MJML.
* Copy the result HTML to clipboard.
* Take a screenshot of the rendered MJML document.
* Send email with Mailjet.
* Code snippets for MJML. Based on [mjml-syntax](https://github.com/mjmlio/mjml-syntax).

## It looks like this

![MJML Preview](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-preview.gif)

![MJML Lint](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-lint.gif)

## Installation

Press `F1`, type `ext install vscode-mjml`.

## Usage

Start command palette (with `Ctrl+Shift+P` or `F1`) and start typing `MJML`.

## Available commands

The following command is available:
* **MJML: Export HTML** Export HTML file from MJML.
* **MJML: Open Preview to the Side** Opens a preview in a column alongside the current document.
* **MJML: Screenshot** Take a screenshot of the rendered MJML document, and save it as a file.
* **MJML: Copy HTML** Copy the result HTML to clipboard.
* **MJML: Send Email** Send email with Mailjet.

## Settings

| Name | Default | Description |
| --- | --- | --- |
| `mjml.lintEnable` | `true` | Enable/disable MJML linter (requires restart). |
| `mjml.lintWhenTyping` | `true` | Whether the linter is run on type or on save. |
| `mjml.updateWhenTyping` | `true` | Update preview when typing. |
| `mjml.preserveFocus` | `true` | Preserve focus of Text Editor after preview open. |
| `mjml.minifyHtmlOutput` | `true` | Minify HTML output. |
| `mjml.beautifyHtmlOutput` | `false` | Beautify HTML output. (Works when `mjml.minifyHtmlOutput` aren't enabled.) |
| `mjml.screenshotWidth` | `650` | Screenshot width. |
| `mjml.screenshotType` | `jpg` | Screenshot type. Possible values are 'png', 'jpg', and 'jpeg'. |
| `mjml.screenshotQuality` | `75` | Screenshot quality. |
| `mjml.mailjetAPIKey` | ` ` | Mailjet API Key. |
| `mjml.mailjetAPISecret` | ` ` | Mailjet API Secret. |
| `mjml.mailSender` | ` ` | Sender email address. (Mailjet: must be a verified sender.) |
| `mjml.mailFromName` | ` ` | Sender name. |
| `mjml.mailSubject` | ` ` | Email subject. |
| `mjml.mailRecipients` | ` ` | Comma separated list of recipients email addresses. |

## Snippets

| Trigger | URL | Content |
| --- | --- | --- |
| `mjall` | [mj-all](https://mjml.io/documentation/#mjml-attributes) | `<mj-all />` |
| `mjattributes` | [mj-attributes](https://mjml.io/documentation/#mjml-attributes) | `<mj-attributes></mj-attributes>` |
| `mjbody` | [mj-body](https://mjml.io/documentation/#mj-body) | `<mj-body></mj-body>` |
| `mjbutton` | [mj-button](https://mjml.io/documentation/#mjml-button) | `<mj-button></mj-button>` |
| `mjcarousel` | [mj-carousel](https://mjml.io/documentation/#mjml-carousel) | `<mj-carousel></mj-carousel>` |
| `mjcarousel-image` | [mj-carousel-image](https://mjml.io/documentation/#mjml-carousel) | `<mj-carousel-image src="" />` |
| `mjclass` | [mj-class](https://mjml.io/documentation/#mjml-attributes) | `<mj-class name="" />` |
| `mjcolumn` | [mj-column](https://mjml.io/documentation/#mjml-column) | `<mj-column></mj-column>` |
| `mjcontainer` | [mj-container](https://mjml.io/documentation/#mjml-container) | `<mj-container></mj-container>` |
| `mjdivider` | [mj-divider](https://mjml.io/documentation/#mjml-divider) | `<mj-divider />` |
| `mjfont` | [mj-font](https://mjml.io/documentation/#mjml-font) | `<mj-font name="" href="" />` |
| `mjgroup` | [mj-group](https://mjml.io/documentation/#mjml-group) | `<mj-group></mj-group>` |
| `mjhead` | [mj-head](https://mjml.io/documentation/#mj-head) | `<mj-head></mj-head>` |
| `mjhero` | [mj-hero](https://mjml.io/documentation/#mjml-hero) | `<mj-hero><mj-hero-content></mj-hero-content></mj-hero>` |
| `mjhtml` | [mj-html](https://github.com/mjmlio/mjml/tree/master/packages/mjml-html) | `<mj-html></mj-html>` |
| `mjimage` | [mj-image](https://mjml.io/documentation/#mjml-image) | `<mj-image src="" />` |
| `mjinclude` | [mj-include](https://mjml.io/documentation/#mj-include) | `<mj-include path="" />` |
| `mjinvoice` | [mj-invoice](https://mjml.io/documentation/#mjml-invoice) | `<mj-invoice></mj-invoice>` |
| `mjinvoice-item` | [mj-invoice-item](https://mjml.io/documentation/#mjml-invoice) | `<mj-invoice-item name="" price="" quantity="" />` |
| `mjlocation` | [mj-location](https://mjml.io/documentation/#mjml-location) | `<mj-location address="" />` |
| `mjraw` | [mj-raw](https://mjml.io/documentation/#mjml-raw) | `<mj-raw></mj-raw>` |
| `mjsection` | [mj-section](https://mjml.io/documentation/#mjml-section) | `<mj-section></mj-section>` |
| `mjsocial` | [mj-social](https://mjml.io/documentation/#mjml-social) | `<mj-social />` |
| `mjstyle` | [mj-style](https://mjml.io/documentation/#mjml-style) | `<mj-style></mj-style>` |
| `mjtable` | [mj-table](https://mjml.io/documentation/#mjml-table) | `<mj-table></mj-table>` |
| `mjtext` | [mj-text](https://mjml.io/documentation/#mjml-text) | `<mj-text></mj-text>` |
| `mjtitle` | [mj-title](https://mjml.io/documentation/#mjml-title) | `<mj-title></mj-title>` |
| `mjml` | [mjml](https://mjml.io/documentation/#mjml) | `<mjml></mjml>` |
| `mjpreview` | [mj-preview](https://mjml.io/documentation/#mjml-preview) | `<mj-preview></mj-preview>` |
| `mjspacer` | [mj-spacer](https://mjml.io/documentation/#mjml-spacer) | `<mj-spacer height="" />` |
| `mjwrapper` | [mj-wrapper](https://mjml.io/documentation/#mjml-wrapper) | `<mj-wrapper></mj-wrapper>` |
| `mjaccordion` | [mj-accordion](https://mjml.io/documentation/#mjml-accordion) | `<mj-accordion></mj-accordion>` |
| `mjaccordion-element` | [mj-accordion-element](https://mjml.io/documentation/#mjml-accordion) | `<mj-accordion-element>...</mj-accordion-element>` |
| `mjnavbar` | [mj-navbar](https://mjml.io/documentation/#mjml-navbar) | `<mj-navbar></mj-navbar>` |
| `mjinline-links` | [mj-inline-links](https://mjml.io/documentation/#mjml-navbar) | `<mj-inline-links></mj-inline-links>` |
| `mjlink` | [mj-link](https://mjml.io/documentation/#mjml-navbar) | `<mj-link href=""></mj-link>` |
| `mjlist` | [mj-list](https://github.com/mjmlio/mjml/tree/master/packages/mjml-list) | `<mj-list></mj-list>` |
| `mjml-` | | Basic MJML Template |

## Change Log

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

## License

This extension is licensed under the [MIT License][license-url].

[license-img]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/LICENSE
[vs-market-version]: https://vsmarketplacebadge.apphb.com/version-short/attilabuti.vscode-mjml.svg?style=flat-square
[vs-market-installs]: https://vsmarketplacebadge.apphb.com/installs/attilabuti.vscode-mjml.svg?style=flat-square
[vs-market-url]: https://marketplace.visualstudio.com/items?itemName=attilabuti.vscode-mjml