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

            vscode.window.showInputBox({ placeHolder: `File name (${defaultFileName}${exportType} or .xyz)` }).then((fileName: string) => {
                let fileExtension: any = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
                if (!fileExtension) {
                    fileName += exportType;
                }

                if (fileName.startsWith("."))  {
                    fileName = defaultFileName + fileName;
                }

                let file: string = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, `../${fileName}`);

                fs.writeFile(file, content, (err: NodeJS.ErrnoException) => {
                    if (err) {
                        vscode.window.showErrorMessage("Something went wrong.");
                    }
                    else {
                        vscode.window.showInformationMessage(`File saved as ${fileName}`);
                    }
                });
            });
        });
    }

}
