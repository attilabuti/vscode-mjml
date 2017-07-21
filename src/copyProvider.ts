'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import * as copyPaste from 'copy-paste';

import helper from './helper';

export default class CopyHTML {

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand('mjml.copyHTML', () => {
                this.copy();
            })
        );
    }

    private copy() {
        if (!(helper.isMJMLFile(vscode.window.activeTextEditor.document))) {
            vscode.window.showWarningMessage('This is not a MJML document!');
            return;
        }

        let content = helper.renderMJML(
            vscode.window.activeTextEditor.document.getText(),
            vscode.workspace.getConfiguration('mjml').minifyHtmlOutput,
            vscode.workspace.getConfiguration('mjml').beautifyHtmlOutput
        );

        if (content) {
            copyPaste.copy(content, () => {
                vscode.window.showInformationMessage('Copied!');
            });
        }
        else {
            vscode.window.showErrorMessage('MJMLError: Failed to parse file ' + path.basename(vscode.window.activeTextEditor.document.uri.fsPath));
        }
    }

}
