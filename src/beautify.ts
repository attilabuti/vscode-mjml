"use strict";

import * as vscode from "vscode";

import * as beautifyJS from "js-beautify";

import helper from "./helper";

export default class Beautify {

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand("mjml.beautify", () => {
                this.beautify();
            })
        );
    }

    private beautify(): void {
        if (helper.isMJMLFile(vscode.window.activeTextEditor.document)) {
            vscode.window.activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
                editBuilder.replace(this.getRange(), this.beautifyHTML());
            });
        }
        else {
            vscode.window.showWarningMessage("This is not a MJML document!");
            return;
        }
    }

    private beautifyHTML(): any {
        try {
            return beautifyJS.html(
                vscode.window.activeTextEditor.document.getText(),
                vscode.workspace.getConfiguration("mjml").beautify
            );
        } catch (err) {
            vscode.window.showErrorMessage(err);
            return;
        }
    }

    private getRange(): vscode.Range {
        let document: vscode.TextDocument = vscode.window.activeTextEditor.document;

        return new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
        );
    }

    public formatDocument(): vscode.TextEdit[] {
        return [vscode.TextEdit.replace(this.getRange(), this.beautifyHTML())];
    }

}
