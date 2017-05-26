'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

import { mjml2html } from 'mjml';

export default class PreviewContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public activate(subscriptions: vscode.Disposable[]): void {
        let previewUri = vscode.Uri.parse('mjml-preview://authority/mjml-preview');

        let onSaveEvent = vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {
            if (vscode.window.activeTextEditor.document) {
                this.update(previewUri);
            }
        });

        let onChangeEvent = vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
            if (e.document === vscode.window.activeTextEditor.document) {
                this.update(previewUri);
            }
        });

        let preview = vscode.commands.registerCommand('mjml.preview', () => {
            let fileName = path.basename(vscode.window.activeTextEditor.document.uri.fsPath);

            return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'Preview - ' + fileName).then((success) => {
            }, (reason) => {
                vscode.window.showErrorMessage(reason);
            });
        });

        subscriptions.push(onSaveEvent, onChangeEvent, preview);
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri): void {
        this._onDidChange.fire(uri);
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        let editor = vscode.window.activeTextEditor;

        if (!(editor.document.languageId === 'mjml')) {
            return this.error("Active editor doesn't show a MJML document.");
        }

        return this.renderMJML();
    }

    private renderMJML(): string {
        try {
            let html = mjml2html(vscode.window.activeTextEditor.document.getText(), { level: 'skip', disableMinify: true });

            if (html.html) {

                const documentAbsoluteDir = path.dirname(vscode.window.activeTextEditor.document.uri.fsPath)
                //replace relative file links with absolute, to correctly render images!
                html.html = html.html.replace(/file:\/\/(?!\/)/g,'file://'+documentAbsoluteDir+'/')

                return html.html;
            }
        }
        catch (e) {
        }

        return this.error("Active editor doesn't show a MJML document.");
    }

    private error(error: string): string {
        return `
            <body>
                ${error}
            </body>`;
    }
}