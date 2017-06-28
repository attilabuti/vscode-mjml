'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import helper from './helper';

export default class ExportHTML {

	constructor(subscriptions: vscode.Disposable[]) {
		subscriptions.push(
			vscode.commands.registerCommand('mjml.exportHTML', () => {
				this.export();
			})
		);
	}

    private export() {
		if (!(helper.isMJMLFile(vscode.window.activeTextEditor.document))) {
			vscode.window.showWarningMessage('This is not a MJML document!');
			return;
		}

		let defaultFileName = path.basename(vscode.window.activeTextEditor.document.uri.fsPath).replace(/\.[^\.]+$/, '');

		vscode.window.showInputBox({ placeHolder: 'File name (' + defaultFileName + '.html)' }).then((fileName) => {
			let content = helper.renderMJML(
				vscode.window.activeTextEditor.document.getText(),
				vscode.workspace.getConfiguration('mjml').minifyHtmlOutput,
				vscode.workspace.getConfiguration('mjml').beautifyHtmlOutput
			);

			if (content) {
				if (fileName) {
					fileName = fileName.replace(/\.[^\.]+$/, '');
				}
				else {
					fileName = defaultFileName;
				}

				let file = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, '../' + fileName + '.html');

				fs.writeFile(file, content, function (err) {
					if (err) {
						return console.log(err);
					}

					vscode.window.showInformationMessage('File saved as ' + fileName + '.html');
				});
			}
			else {
				vscode.window.showErrorMessage('MJMLError: Failed to parse file ' + path.basename(vscode.window.activeTextEditor.document.uri.fsPath));
			}
		});
    }

}
