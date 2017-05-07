'use strict';

import * as vscode from 'vscode';

import { documentParser, MJMLValidator } from 'mjml';

export default class MJMLLintingProvider {

    private command: vscode.Disposable;
    private diagnosticCollection: vscode.DiagnosticCollection;

    public activate(subscriptions: vscode.Disposable[]): void {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();

        vscode.workspace.onDidOpenTextDocument(this.doMJMllint, this, subscriptions);
        vscode.workspace.onDidCloseTextDocument((textDocument) => {
            this.diagnosticCollection.delete(textDocument.uri);
        }, null, subscriptions);

        vscode.workspace.onDidSaveTextDocument(this.doMJMllint, this, subscriptions);

        // Lint all open mjml documents
        vscode.workspace.textDocuments.forEach(this.doMJMllint, this);
    }

    public dispose(): void {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
        this.command.dispose();
    }

    private doMJMllint(textDocument: vscode.TextDocument): void {
        if (textDocument.languageId !== 'mjml') {
            return;
        }

        let diagnostics: vscode.Diagnostic[] = [];

        try {
            let MJMLDocument;

            try {
                MJMLDocument = documentParser(vscode.window.activeTextEditor.document.getText());
            } catch (e) {
                return;
            }

            let body = MJMLDocument.children.find((root) => {
                return root.tagName === 'mj-body';
            });

            if (!body || !body.children || body.children.length == 0) {
                return;
            }

            let report = MJMLValidator(body.children[0]);

            report.forEach(err => {
                let line = err.line - 1;
                let currentLine = vscode.window.activeTextEditor.document.lineAt(line).text;

                let start = new vscode.Position(line, currentLine.indexOf('<'));
                let end = new vscode.Position(line, currentLine.length);

                let diagnostic = new vscode.Diagnostic(
                    new vscode.Range(start, end),
                    err.message,
                    vscode.DiagnosticSeverity.Error
                );

                diagnostics.push(diagnostic);
            });

            this.diagnosticCollection.set(textDocument.uri, diagnostics);
        }
        catch (e) {
            this.diagnosticCollection.set(textDocument.uri, diagnostics);
        }
    }

}