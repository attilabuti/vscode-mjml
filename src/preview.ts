"use strict";

import * as vscode from "vscode";

import helper from "./helper";

export default class PreviewManager {

    private IDMap: IDMap = new IDMap();
    private fileMap: Map<string, MJMLView> = new Map<string, MJMLView>();
    private subscriptions: vscode.Disposable[];
    private previewOpen: boolean = false;

    constructor(context: vscode.ExtensionContext) {
        this.subscriptions = context.subscriptions;

        this.subscriptions.push(
            vscode.commands.registerCommand("mjml.previewToSide", () => {
                this.previewOpen = true;
                this.previewCommand();
            }),

            vscode.workspace.onDidOpenTextDocument((document?: vscode.TextDocument) => {
                if (vscode.workspace.getConfiguration("mjml").autoPreview) {
                    if (document) {
                        if (this.previewOpen && document.languageId == "mjml") {
                            this.previewCommand(document);
                        }
                        else if (document.fileName.replace(/\\/g, "/") == "/mjml-preview/sidebyside/") {
                            this.previewOpen = true;
                        }
                    }
                }
            }),

            vscode.window.onDidChangeActiveTextEditor((editor?: vscode.TextEditor) => {
                if (vscode.workspace.getConfiguration("mjml").autoPreview) {
                    if (editor) {
                        if (this.previewOpen && editor.document.languageId == "mjml") {
                            this.previewCommand(editor.document);
                        }
                    }
                }
            }),

            vscode.workspace.onDidCloseTextDocument((document: vscode.TextDocument) => {
                if (document.fileName.replace(/\\/g, "/") == "/mjml-preview/sidebyside/") {
                    this.previewOpen = false;
                }
                else {
                    this.removePreview(document);
                }
            })
        );
    }

    private previewCommand(document?: vscode.TextDocument): void {
        let documentURI: string = this.IDMap.createDocumentUri(((document) ? document.uri : vscode.window.activeTextEditor.document.uri));

        let mjmlPreview: MJMLView;
        if (!this.IDMap.hasUri(documentURI)) {
            mjmlPreview = new MJMLView(((document) ? document : vscode.window.activeTextEditor.document));

            this.fileMap.set(this.IDMap.add(documentURI, mjmlPreview.uri), mjmlPreview);
        }
        else {
            mjmlPreview = this.fileMap.get(this.IDMap.getByUri(documentURI));
        }

        mjmlPreview.execute();
    }

    private removePreview(document: vscode.TextDocument): void {
        if (/mjml-preview/.test(document.fileName) && /sidebyside/.test(document.fileName)) {
            this.dispose();
            this.fileMap.clear();
            this.IDMap.clear();
        }
        else {
            let documentURI: string = this.IDMap.createDocumentUri(document.uri);

            if (this.IDMap.hasUri(documentURI)) {
                let mjmlPreview: MJMLView = this.fileMap.get(this.IDMap.getByUri(documentURI));

                let id: string = this.IDMap.delete(documentURI, mjmlPreview.uri);
                this.dispose(id);
                this.fileMap.delete(id);
            }
        }
    }

    public dispose(id?: string): void {
        let values: IterableIterator<MJMLView> = this.fileMap.values();
        let value: IteratorResult<MJMLView> = values.next();

        if (id && this.fileMap.has(id)) {
            this.fileMap.get(id).dispose();
        }
        else {
            while (!value.done) {
                value.value.dispose();
                value = values.next();
            }
        }
    }

}

class MJMLView {

    private subscriptions: vscode.Disposable[] = [];
    private document: vscode.TextDocument;
    private provider: PreviewContentProvider;
    private previewUri: vscode.Uri;
    private viewColumn: vscode.ViewColumn;
    private label: string;

    constructor(document: vscode.TextDocument) {
        this.document = document;
        this.provider = new PreviewContentProvider(this.document);

        this.previewUri = this.createUri(document.uri);
        this.viewColumn = vscode.ViewColumn.Two;

        this.label = "MJML Preview";

        this.registerEvents();
    }

    private registerEvents(): void {
        this.subscriptions.push(
            vscode.workspace.registerTextDocumentContentProvider("mjml-preview", this.provider),

            vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
                if (helper.isMJMLFile(document)) {
                    this.provider.update(this.previewUri);
                }
            }),

            vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
                if (vscode.workspace.getConfiguration("mjml").updateWhenTyping) {
                    if (helper.isMJMLFile(event.document)) {
                        this.provider.update(this.previewUri);
                    }
                }
            }),

            vscode.window.onDidChangeActiveTextEditor((editor?: vscode.TextEditor) => {
                if (editor) {
                    if (this.document.uri === editor.document.uri) {
                        if (helper.isMJMLFile(editor.document)) {
                            this.provider.update(this.previewUri);
                        }
                    }
                }
            })
        );
    }

    public dispose(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].dispose();
        }
    }

    public execute(): void {
        vscode.commands.executeCommand("vscode.previewHtml", this.previewUri, this.viewColumn, this.label).then((success: boolean) => {
            if (this.viewColumn === 2) {
                if (vscode.workspace.getConfiguration("mjml").preserveFocus) {
                    // Preserve focus of Text Editor after preview open
                    vscode.window.showTextDocument(this.document);
                }
            }
        }, (reason: string) => {
            vscode.window.showErrorMessage(reason);
        });
    }

    public get uri(): vscode.Uri {
        return this.previewUri;
    }

    private createUri(uri: vscode.Uri): vscode.Uri {
        return vscode.Uri.parse("mjml-preview://authority/mjml-preview/sidebyside/");
    }

}

class PreviewContentProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange: vscode.EventEmitter<vscode.Uri> = new vscode.EventEmitter<vscode.Uri>();
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
        if (this.document.languageId !== "mjml") {
            return this.error("Active editor doesn't show a MJML document.");
        }

        return this.renderMJML();
    }

    private renderMJML(): string {
        let html: string = helper.mjml2html(this.document.getText(), false, false, this.document.uri.fsPath);

        if (html) {
            return helper.fixLinks(html, this.document.uri.fsPath);
        }

        return this.error("Active editor doesn't show a MJML document.");
    }

    private error(error: string): string {
        return `<body>${error}</body>`;
    }

}

class IDMap {

    private map: Map<[string, vscode.Uri], string> = new Map<[string, vscode.Uri], string>();

    public clear(): void {
        this.map.clear();
    }

    private UUIDv4(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c: string) => {
            let r: number = Math.random() * 16 | 0, v: number = c == "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public createDocumentUri(uri: vscode.Uri): string {
        return JSON.stringify({ uri: uri });
    }

    public getByUri(uri: string, remove?: boolean): any {
        let keys: IterableIterator<[string, vscode.Uri]> = this.map.keys();
        let key: IteratorResult<[string, vscode.Uri]> = keys.next();

        while (!key.done) {
            if (key.value.indexOf(uri) > -1) {
                if (remove) {
                    return key.value;
                }
                else {
                    return this.map.get(key.value);
                }
            }

            key = keys.next();
        }

        return undefined;
    }

    public hasUri(uri: string): boolean {
        return this.getByUri(uri) != undefined;
    }

    public add(documentUri: string, previewUri: vscode.Uri): string {
        let id: string = this.UUIDv4();
        this.map.set([documentUri, previewUri], id);

        return id;
    }

    public delete(uri: string, previewUri: vscode.Uri): string {
        let id: string = this.getByUri(uri);
        this.map.delete(this.getByUri(uri, true));

        return id;
    }

}
