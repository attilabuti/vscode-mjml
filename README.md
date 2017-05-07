# MJML
MJML preview, lint, compile for Visual Studio Code.

[![GitHub license][license-img]][license-url]

## Features

* Live preview for MJML files. Preview updates as you type.
* Inline errors (squiggle underlines). Linter based on [atom-linter-mjml](https://github.com/mjmlio/atom-linter-mjml).
* Generate HTML file from MJML.

## It looks like this

![MJML Preview](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-preview.gif)

![MJML Lint](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-lint.gif)

## Installation

Press `F1`, type `ext install vscode-mjml`.

## Usage

Start command palette (with `Ctrl+Shift+P` or `F1`) and start typing `MJML`.

## Available commands

The following command is available:
* **MJML: Open Preview** Opens a preview in a column alongside the current document.
* **MJML: Generate HTML** Generate HTML file from MJML.

## Settings

| Name | Default | Description |
| --- | --- | --- |
| `mjml.lintEnable` | `true` | Enable/disable MJML linter (requires restart). |

## Change Log

### 0.0.1
 - This is the initial release of this extension.

## Issues

Submit the [issues](https://github.com/attilabuti/vscode-mjml/issues) if you find any bug or have any suggestion.

## Contribution

Fork the [repo](https://github.com/attilabuti/vscode-mjml) and submit pull requests.

## License

This extension is licensed under the [MIT License][license-url].

[license-img]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/LICENSE