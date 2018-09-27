"use strict";

import * as vscode from "vscode";

import helper from "./helper";

export default class MJMLLintingProvider {

    private command: vscode.Disposable;
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(subscriptions: vscode.Disposable[]) {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();

        vscode.window.onDidChangeActiveTextEditor((editor?: vscode.TextEditor) => {
            if (editor) {
                if (helper.isMJMLFile(editor.document)) {
                    this.doMJMllint(editor.document);
                }
            }
        }, this, subscriptions);

        vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
            if (vscode.workspace.getConfiguration("mjml").lintWhenTyping) {
                this.doMJMllint(event.document);
            }
        }, this, subscriptions);

        vscode.workspace.onDidOpenTextDocument(this.doMJMllint, this, subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.doMJMllint, this, subscriptions);

        vscode.workspace.onDidCloseTextDocument((document: vscode.TextDocument) => {
            this.diagnosticCollection.delete(document.uri);
        }, null, subscriptions);

        // Lint all open mjml documents
        vscode.workspace.textDocuments.forEach(this.doMJMllint, this);
    }

    public dispose(): void {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
        this.command.dispose();
    }

    private doMJMllint(textDocument: vscode.TextDocument): void {
        if (textDocument.languageId !== "mjml") {
            return;
        }

        let diagnostics: vscode.Diagnostic[] = [];

        try {
            let filePath = helper.getPath();
            let { html, errors } = helper.mjml2html(vscode.window.activeTextEditor.document.getText(), false, false, filePath, "strict");

            errors.forEach((err: any) => {
                let line: number = err.line - 1;
                let currentLine: string = vscode.window.activeTextEditor.document.lineAt(line).text;

                let start: vscode.Position = new vscode.Position(line, currentLine.indexOf("<"));
                let end: vscode.Position = new vscode.Position(line, currentLine.length);

                let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(
                    new vscode.Range(start, end),
                    err.message,
                    vscode.DiagnosticSeverity.Error
                );

                diagnostics.push(diagnostic);
            });

            this.diagnosticCollection.set(textDocument.uri, diagnostics);
        }
        catch (err) {
            this.diagnosticCollection.set(textDocument.uri, diagnostics);
        }
    }

}
