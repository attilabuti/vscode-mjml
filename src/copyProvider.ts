"use strict";

import * as vscode from "vscode";

import * as copyPaste from "copy-paste";

import helper from "./helper";

export default class CopyHTML {

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand("mjml.copyHTML", () => {
                this.copy();
            })
        );
    }

    private copy(): void {
        helper.renderMJML((content: string) => {
            copyPaste.copy(content, () => {
                vscode.window.showInformationMessage("Copied!");
            });
        });
    }

}
