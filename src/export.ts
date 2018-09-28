"use strict";

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import helper from "./helper";

export default class ExportHTML {

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand("mjml.exportHTML", () => {
                this.export();
            })
        );
    }

    private export(): void {
        helper.renderMJML((content: string) => {
            let defaultFileName: string = path.basename(vscode.window.activeTextEditor.document.uri.fsPath).replace(/\.[^\.]+$/, "");

            let exportType: string = vscode.workspace.getConfiguration("mjml").exportType;
            if (!exportType.startsWith(".")) {
                exportType = "." + exportType;
            }

            if (vscode.workspace.getConfiguration("mjml").showSaveDialog) {
                vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file(path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, `../${defaultFileName}${exportType}`)),
                    filters: {
                        "HTML": ["html"],
                        "All files": ["*"]
                    }
                }).then((fileUri: vscode.Uri) => {
                    if (fileUri) {
                        this.writeFile(fileUri.fsPath, content);
                    }
                });
            }
            else {
                vscode.window.showInputBox({
                    prompt: "Filename",
                    placeHolder: `Enter a filename (${defaultFileName}${exportType} or .xyz).`,
                    value: defaultFileName + exportType
                }).then((fileName: string) => {
                    if (!fileName) {
                        return;
                    }

                    let fileExtension: any = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
                    if (!fileExtension) {
                        fileName += exportType;
                    }

                    if (fileName.startsWith("."))  {
                        fileName = defaultFileName + fileName;
                    }

                    let file: string = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, `../${fileName}`);

                    this.writeFile(file, content);
                });
            }
        });
    }

    private writeFile(file: string, content: string): void
    {
        fs.writeFile(file, content, (err: NodeJS.ErrnoException) => {
            if (err) {
                vscode.window.showErrorMessage(`Could not save the file: ${err}`);
            }
            else {
                vscode.window.showInformationMessage(`File saved as ${path.basename(file)}`);
            }
        });
    }

}
