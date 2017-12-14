"use strict";

import * as vscode from "vscode";

import fetch from "node-fetch";

export default class Template {

    private templateList: object;

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand("mjml.template", () => {
                this.fetchEmailTemplates();
            })
        );
    }

    private async fetchEmailTemplates(): Promise<void> {
        if (!this.templateList) {
            let response = await fetch("https://api.github.com/repos/mjmlio/email-templates/git/trees/master?recursive=1");
            let { tree } = await response.json();

            if (!tree) {
                vscode.window.showErrorMessage("Error occurred while fetching templates list.");
                return;
            }

            this.templateList = tree.reduce((map, item) => {
                let extract: RegExpExecArray = /.*\/([^.]*)\..*/.exec(item.path);
                if (!item.path.startsWith("templates/") && !item.path.startsWith("thumbnails/") && !extract) {
                    return map;
                }

                let templateName: string = extract[1];
                if (!map[templateName]) {
                    map[templateName] = {};
                }

                let path: string = `https://raw.githubusercontent.com/mjmlio/email-templates/master/${item.path}`;

                if (item.path.endsWith(".mjml")) {
                    map[templateName].mjml = path;
                    map[templateName].name = templateName;
                }
                else {
                    map[templateName].thumbnail = path;
                }

                return map;
            }, {});
        }

        this.quickPick();
    }

    private quickPick(): void {
        vscode.window.showQuickPick(Object.keys(this.templateList), {
            placeHolder: "Choose a template"
        }).then((selected: string) => {
            if (selected) {
                fetch(this.templateList[selected].mjml).then((response: any) => {
                    if (response.status == 200) {
                        return response.text();
                    }
                }).then((body: string) => {
                    if (body) {
                        vscode.window.activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
                            editBuilder.insert(vscode.window.activeTextEditor.selection.active, body);
                        });
                    }
                    else {
                        vscode.window.showErrorMessage("Error occurred while fetching template.");
                    }
                });
            }
        });
    }

}
