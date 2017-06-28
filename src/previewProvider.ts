'use strict';

import * as vscode from 'vscode';

import helper from './helper';

export default class PreviewManager {

    private IDMap: IDMap = new IDMap();
    private fileMap: Map<string, MJMLView> = new Map<string, MJMLView>();
    private subscriptions: vscode.Disposable[];

    constructor(context: vscode.ExtensionContext) {
        this.subscriptions = context.subscriptions;

        this.subscriptions.push(
            vscode.commands.registerCommand('mjml.previewToSide', () => {
                this.previewCommand();
            })
        );
    }

    private previewCommand(): void {
        let documentURI: string = this.IDMap.createDocumentUri(vscode.window.activeTextEditor.document.uri);
        let mjmlPreview: MJMLView;

        if (!this.IDMap.hasUri(documentURI)) {
            mjmlPreview = new MJMLView(this.subscriptions, vscode.window.activeTextEditor.document);
            this.fileMap.set(this.IDMap.add(documentURI, mjmlPreview.uri), mjmlPreview);
        }
        else {
            mjmlPreview = this.fileMap.get(this.IDMap.getByUri(documentURI));
        }

        mjmlPreview.execute();
    }

    public dispose(): void {
        let values = this.fileMap.values()
        let value: IteratorResult<MJMLView> = values.next();

        while (!value.done) {
            value.value.dispose();
            value = values.next();
        }
    }

}

class MJMLView {

    private registrations: vscode.Disposable[] = [];
    private document: vscode.TextDocument;
    private provider: PreviewContentProvider;
    private previewUri: vscode.Uri;
    private viewColumn: vscode.ViewColumn;
    private label: string;

    constructor(subscriptions: vscode.Disposable[], document: vscode.TextDocument) {
        this.document = document;
        this.provider = new PreviewContentProvider(this.document);

        this.previewUri = this.createUri(document.uri);
        this.viewColumn = vscode.ViewColumn.Two;

        this.label = 'MJML Preview';

        this.registrations.push(vscode.workspace.registerTextDocumentContentProvider('mjml-preview', this.provider));
        this.registerEvents(subscriptions);
    }

    private registerEvents(subscriptions: vscode.Disposable[]): void {
        let lastEditor: any = '';

        subscriptions.push(
            vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
                if (helper.isMJMLFile(document)) {
                    this.provider.update(this.previewUri);
                }
            }),

            vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
                if (vscode.workspace.getConfiguration('mjml').updateWhenTyping) {
                    if (helper.isMJMLFile(event.document)) {
                        this.provider.update(this.previewUri);
                    }
                }
            }),

            vscode.window.onDidChangeActiveTextEditor((editor: vscode.TextEditor) => {
                if (this.document.uri === editor.document.uri) {
                    if (helper.isMJMLFile(editor.document)) {
                        lastEditor = editor.document.uri;
                        this.provider.update(this.previewUri);
                    }
                }
            })
        );
    }

    public dispose(): void {
        for (let i in this.registrations) {
            this.registrations[i].dispose();
        }
    }

    public execute() {
        return vscode.commands.executeCommand('vscode.previewHtml', this.previewUri, this.viewColumn, this.label).then((success) => {
            if (this.viewColumn === 2) {
                if (vscode.workspace.getConfiguration('mjml').preserveFocus) {
                    // Preserve focus of Text Editor after preview open
                    vscode.window.showTextDocument(this.document);
                }
            }
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    }

    public get uri(): vscode.Uri {
        return this.previewUri;
    }

    private createUri(uri: vscode.Uri): vscode.Uri {
        return vscode.Uri.parse('mjml-preview://authority/mjml-preview/sidebyside/');
    }

}

class PreviewContentProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private document: vscode.TextDocument;

    constructor(document: vscode.TextDocument) {
        this.document = document;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri): void {
        if (/mjml-preview/.test(uri.fsPath) && /sidebyside/.test(uri.fsPath)) {
            if (vscode.window.activeTextEditor.document.fileName == this.document.fileName) {
                this._onDidChange.fire(uri);
            }
        }
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        if (this.document.languageId !== 'mjml') {
            return this.error('Active editor doesn\'t show a MJML document.');
        }

        return this.renderMJML();
    }

    private renderMJML(): string {
        let html = helper.renderMJML(this.document.getText(), true, false);

        if (html) {
            return helper.fixLinks(html);
        }

        return this.error('Active editor doesn\'t show a MJML document.');
    }

    private error(error: string): string {
        return `
            <body>
                ${error}
            </body>`;
    }

}

class IDMap {

    private map: Map<[string, vscode.Uri], string> = new Map<[string, vscode.Uri], string>();

    private UUIDv4(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public createDocumentUri(uri: vscode.Uri): string {
        return JSON.stringify({ uri: uri });
    }

    public getByUri(uri: string): string | null {
        let keys = this.map.keys();
        let key: IteratorResult<[string, vscode.Uri]> = keys.next();

        while (!key.done) {
            if (key.value.indexOf(uri) > -1) {
                return this.map.get(key.value);
            }

            key = keys.next();
        }

        return null;
    }

    public hasUri(uri: string): boolean {
        return this.getByUri(uri) !== null;
    }

    public add(documentUri: string, previewUri: vscode.Uri): string {
        let id = this.UUIDv4();
        this.map.set([documentUri, previewUri], id);

        return id;
    }

}
