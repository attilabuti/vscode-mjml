"use strict";

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export interface WebviewMessage {
    command: string;
    data: string;
}

export default class Documentation {

    protected context: vscode.ExtensionContext;
    protected webview: vscode.WebviewPanel | undefined;
    protected content: string;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        let documentationPath: string = path.join(__dirname, "../documentation/documentation.html");

        context.subscriptions.push(
            vscode.commands.registerCommand("mjml.documentation", () => {
                if (documentationPath && fs.existsSync(documentationPath) && fs.statSync(documentationPath).isFile()) {
                    this.displayWebView(this.getWebviewContent(documentationPath));
                    this.handleEvents();
                }
            }),

            vscode.commands.registerCommand("mjml.searchInDocumentation", () => {
                let text: string = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
                let anchor: string = text.replace(/((\/|\<|\>)|^\s+|(\r?\n|\r)|\s.*)/gi, "").replace("mj-", "#mjml-");
                if (!anchor.startsWith("#mjml-")) {
                    anchor = `#mjml-${anchor}`;
                }

                this.displayWebView(this.getWebviewContent(documentationPath));
                this.webview.webview.postMessage({
                    command: "scrollTo",
                    anchor: anchor
                });

                this.handleEvents();
            })
        );
    }

    private handleEvents(): void {
        // Handle messages from the webview
        this.webview.webview.onDidReceiveMessage((message: WebviewMessage) => {
            if (message.command == "openExample") {
                this.openExample(message.data);
            }
        }, undefined, this.context.subscriptions);
    }

    private async openExample(fileName: string): Promise<void> {
        let file: string = path.join(__dirname, "../documentation/examples/", `${fileName}.mjml`);

        if (file && fs.existsSync(file) && fs.statSync(file).isFile()) {
            let document: vscode.TextDocument = await vscode.workspace.openTextDocument({
                content: fs.readFileSync(file, "utf8"),
                language: "mjml"
            });

            await vscode.window.showTextDocument(document, {
                viewColumn: vscode.ViewColumn.One
            });

            await vscode.commands.executeCommand("mjml.previewToSide");
        }
    }

    private displayWebView(content: string): void {
        if (!this.webview) {
            this.webview = vscode.window.createWebviewPanel("mjml-documentation", "MJML Documentation", vscode.ViewColumn.Two, {
                retainContextWhenHidden: true,
                enableFindWidget: true,
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.parse(this.context.extensionPath)
                ]
            });

            this.webview.webview.html = content;

            this.webview.onDidDispose(() => {
                this.webview = undefined;
            });
        }
    }

    private getWebviewContent(filePath: string): string {
        if (!this.content) {
            let rootPath: string = vscode.Uri.parse(path.join(this.context.extensionPath, "documentation")).with({ scheme: "vscode-resource" }).toString();
            this.content = fs.readFileSync(filePath).toString().replace(/{{root}}/gi, rootPath);
        }

        return this.content;
    }

    public dispose(): void {
        if (this.webview !== undefined) {
            this.webview.dispose();
        }

        for (let s of this.context.subscriptions) {
            s.dispose();
        }
    }

}
