'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { mjml2html } from 'mjml';

import MJMLLintingProvider from './mjmlLintingProvider';
import PreviewContentProvider from './previewContentProvider';

export function activate(context: vscode.ExtensionContext) {

	// Linter
	if (vscode.workspace.getConfiguration('mjml').lintEnable) {
		let linter = new MJMLLintingProvider();
		linter.activate(context.subscriptions);
	}

	// Preview
	let previewProvider = new PreviewContentProvider();
	previewProvider.activate(context.subscriptions);
	let preview = vscode.workspace.registerTextDocumentContentProvider('mjml-preview', previewProvider);

	// Generate HTML
	let generateHTML = vscode.commands.registerCommand('mjml.generateHTML', () => {
		if (!(vscode.window.activeTextEditor.document.languageId === 'mjml')) {
			vscode.window.showWarningMessage('This is not a MJML document!');
			return;
		}

		vscode.window.showInputBox({ placeHolder: 'File name' }).then(
			(fileName) => {
				if (fileName) {
					fileName = fileName.replace(/\.[^\.]+$/, '');
				}
				else {
					fileName = path.basename(vscode.window.activeTextEditor.document.uri.fsPath).replace(/\.[^\.]+$/, '');
				}

				let file = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, '../' + fileName + '.html');
				try {
					let content = mjml2html(vscode.window.activeTextEditor.document.getText(), { level: 'skip' });

					if (content.html) {
						fs.writeFile(file, content.html, function (err) {
							if (err) {
								return console.log(err);
							}

							vscode.window.showInformationMessage('File saved as ' + fileName + '.html');
						});
					}
					else {
						vscode.window.showErrorMessage('MJMLError: Failed to parse file ' + path.basename(vscode.window.activeTextEditor.document.uri.fsPath));
					}
				}
				catch (e) {
					vscode.window.showErrorMessage('MJMLError: Failed to parse file ' + path.basename(vscode.window.activeTextEditor.document.uri.fsPath));
				}
			}
		);
	});

	context.subscriptions.push(preview, generateHTML);
}