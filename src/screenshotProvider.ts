'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

import * as webshot from 'webshot';

import helper from './helper';

export default class Screenshot {

	constructor(context: vscode.ExtensionContext) {
        let disposable = vscode.commands.registerCommand('mjml.screenshot', () => {
            this.takeScreenshot();
        });

        context.subscriptions.push(disposable)
	}

    private takeScreenshot(): void {
		if (!(helper.isMJMLFile(vscode.window.activeTextEditor.document))) {
			vscode.window.showWarningMessage('This is not a MJML document!');
			return;
		}

        let defaultWidth = vscode.workspace.getConfiguration('mjml').screenshotWidth;
        let defaultFileName = path.basename(vscode.window.activeTextEditor.document.uri.fsPath).replace(/\.[^\.]+$/, '');

        let screenshotType = 'png';
        if (['png', 'jpg', 'jpeg'].indexOf(vscode.workspace.getConfiguration('mjml').screenshotType)) {
            screenshotType = vscode.workspace.getConfiguration('mjml').screenshotType;
        }

        vscode.window.showInputBox({ placeHolder: 'Width (' + defaultWidth + 'px)' }).then((width) => {
            vscode.window.showInputBox({ placeHolder: 'File name (' + defaultFileName + '.' + screenshotType + ')' }).then((fileName) => {
				if (fileName) {
					fileName = fileName.replace(/\.[^\.]+$/, '');
				}
				else {
					fileName = defaultFileName;
				}

				let file = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, '../' + fileName + '.' + screenshotType);

                width = width.replace(/[^0-9\.]+/g, '');
                if (!width || Number.isNaN(parseInt(width))) {
                    width = defaultWidth;
                }

                webshot(this.renderMJML(vscode.window.activeTextEditor.document), file, {
                    screenSize: {
                        width: width,
                        height: 480
                    },
                    shotSize: {
                        width: 'window',
                        height: 'all'
                    },
                    quality: vscode.workspace.getConfiguration('mjml').screenshotQuality,
                    siteType: 'html',
                    streamType: screenshotType
                }, function(err) {
                    vscode.window.showInformationMessage('Successfully saved screenshot ' + fileName + '.' + screenshotType);
                });
            });
        });
    }

    private renderMJML(document): string {
        let html = helper.renderMJML(document.getText(), true, false);

        if (html) {
            return helper.fixLinks(html);
        }

        vscode.window.showErrorMessage('Active editor doesn\'t show a MJML document.');
    }

}
