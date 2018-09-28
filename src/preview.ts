"use strict";

import * as vscode from "vscode";
import * as path from "path";

import helper from "./helper";

export default class PreviewManager {

    private webview: vscode.WebviewPanel | undefined;
    private subscriptions: vscode.Disposable[];
    private previewOpen: boolean = false;
    private openedDocuments: string[] = [];

    constructor(context: vscode.ExtensionContext) {
        this.subscriptions = context.subscriptions;

        this.subscriptions.push(
            vscode.commands.registerCommand("mjml.previewToSide", () => {
                this.previewOpen = true;
                this.displayWebView(this.getWebviewContent());
            }),

            vscode.workspace.onDidOpenTextDocument((document?: vscode.TextDocument) => {
                if (this.previewOpen && vscode.workspace.getConfiguration("mjml").autoPreview) {
                    if (document) {
                        if (document.languageId == "mjml") {
                            this.displayWebView(this.getWebviewContent(document));
                        }
                    }
                }
            }),

            vscode.window.onDidChangeActiveTextEditor((editor?: vscode.TextEditor) => {
                if (this.previewOpen && vscode.workspace.getConfiguration("mjml").autoPreview) {
                    if (editor) {
                        if (editor.document.languageId == "mjml") {
                            this.displayWebView(this.getWebviewContent(editor.document));
                        }
                    }
                }
            }),

            vscode.workspace.onDidCloseTextDocument((document?: vscode.TextDocument) => {
                if (this.previewOpen) {
                    if (document) {
                        this.removeDocument(document.fileName);

                        if (this.openedDocuments.length == 0 && vscode.workspace.getConfiguration("mjml").autoClosePreview) {
                            this.webview.dispose();
                        }
                    }
                }
            }),

            vscode.workspace.onDidChangeTextDocument((event?: vscode.TextDocumentChangeEvent) => {
                if (this.previewOpen && vscode.workspace.getConfiguration("mjml").updateWhenTyping) {
                    if (event) {
                        if (event.document.languageId == "mjml") {
                            this.displayWebView(this.getWebviewContent(event.document));
                        }
                    }
                }
            }),

            vscode.workspace.onDidSaveTextDocument((document?: vscode.TextDocument) => {
                if (this.previewOpen && document) {
                    if (document.languageId == "mjml") {
                        this.displayWebView(this.getWebviewContent(document));
                    }
                }
            })
        );
    }

    private displayWebView(content: string): void {
        let label: string = "MJML Preview";
        if (vscode.window.activeTextEditor.document) {
            label = `MJML Preview - ${path.basename(vscode.window.activeTextEditor.document.fileName)}`;
        }

        if (!this.webview) {
            this.webview = vscode.window.createWebviewPanel("mjml-preview", label, vscode.ViewColumn.Two, {
                retainContextWhenHidden: true
            });

            this.webview.webview.html = content;

            this.webview.onDidDispose(() => {
                this.webview = undefined;
                this.previewOpen = false;
            }, null, this.subscriptions);

            if (vscode.workspace.getConfiguration("mjml").preserveFocus) {
                // Preserve focus of Text Editor after preview open
                vscode.window.showTextDocument(vscode.window.activeTextEditor.document, vscode.ViewColumn.One);
            }
        }
        else {
            this.webview.title = label;
            this.webview.webview.html = content;
        }
    }

    private getWebviewContent(document?: vscode.TextDocument): string {
        let previewDocument: vscode.TextDocument;
        if (document) {
            previewDocument = document;
        }
        else {
            previewDocument = vscode.window.activeTextEditor.document;
        }

        let html: string = helper.mjml2html(previewDocument.getText(), false, false, previewDocument.uri.fsPath, "skip").html;

        if (html) {
            this.addDocument(previewDocument.fileName);

            return helper.setBackgroundColor(helper.fixLinks(html, previewDocument.uri.fsPath));
        }

        return this.error("Active editor doesn't show a MJML document.");
    }

    private error(error: string): string {
        return `<body>${error}</body>`;
    }

    private addDocument(fileName: string): void {
        if (this.openedDocuments.indexOf(fileName) == -1) {
            this.openedDocuments.push(fileName);
        }
    }

    private removeDocument(fileName: string): void {
        this.openedDocuments = this.openedDocuments.filter(e => e !== fileName);
    }

    public dispose(): void {
        if (this.webview !== undefined) {
            this.webview.dispose();
        }

        for (let s of this.subscriptions) {
            s.dispose();
        }
    }

}
