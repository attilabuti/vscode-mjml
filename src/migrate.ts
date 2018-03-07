"use strict";

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import migrate from 'mjml-migrate';

import helper from "./helper";

export default class Migrate {

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand("mjml.migrate", () => {
                this.migrate();
            })
        );
    }

    private migrate(): void {
        if (!(helper.isMJMLFile(vscode.window.activeTextEditor.document))) {
            vscode.window.showWarningMessage("This is not a MJML document!");
            return;
        }

        try {
            let mjml: string = migrate(vscode.window.activeTextEditor.document.getText());

            if (mjml) {
                let inputFileName: string = path.basename(vscode.window.activeTextEditor.document.uri.fsPath);
                let fileName: string = inputFileName.replace(/\.[^\.]+$/, "");
                let file: string = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, `../${fileName}_v4.mjml`);

                let content: string = helper.beautifyHTML(mjml);

                if (content) {
                    fs.writeFile(file, content, (err: NodeJS.ErrnoException) => {
                        if (err) {
                            vscode.window.showErrorMessage("Something went wrong.");
                        }
                        else {
                            vscode.window.showInformationMessage(`${inputFileName} was converted to the MJML 4 syntax in ${fileName}_v4.mjml`);
                        }
                    });
                }
                else {
                    vscode.window.showErrorMessage("Something went wrong.");
                }
            }
        }
        catch (err) {
            vscode.window.showErrorMessage("Input file failed to render.");
            return;
        }
    }

}
