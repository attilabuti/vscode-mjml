# MJML
MJML preview, lint, compile for Visual Studio Code.

[![GitHub license][license-img]][license-url]

## Features

* Live preview for MJML files. Preview updates as you type. Preview based on [html-preview-vscode](https://github.com/tht13/html-preview-vscode).
* Inline errors (squiggle underlines). Linter based on [atom-linter-mjml](https://github.com/mjmlio/atom-linter-mjml).
* Export HTML file from MJML.
* Take a screenshot of the rendered MJML document.

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

## Change Log

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

## License

This extension is licensed under the [MIT License][license-url].

[license-img]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/LICENSE