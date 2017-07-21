'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

import * as fileUrl from 'file-url';
import { mjml2html } from 'mjml';

export default class Helper {

    static renderMJML(mjml: string, minify: boolean, beautify: boolean): string {
        try {
            let html = mjml2html(mjml, {
                level: 'skip',
                minify: minify,
                beautify: beautify,
                filePath: vscode.window.activeTextEditor.document.uri.fsPath,
                cwd: this.getCWD()
            });

            if (html.html) {
                return html.html;
            }
        }
        catch (e) {
            return;
        }
    }

    static getCWD(): string {
        if (vscode.workspace.rootPath) {
            return vscode.workspace.rootPath;
        }
        else {
            return path.parse(vscode.window.activeTextEditor.document.uri.fsPath).dir;
        }
    }

    static fixLinks(text: string): string {
        return text.replace(
            new RegExp(/((?:src|href|url)(?:=|\()(?:[\'\"]|))((?!http|\\|"|#).+?)([\'\"]|\))/, "gmi"),
            (subString: string, p1: string, p2: string, p3: string): string => {
                return [p1, fileUrl(path.join(path.dirname(vscode.window.activeTextEditor.document.uri.fsPath), p2)), p3].join('');
            }
        );
    }

    static isMJMLFile(document: vscode.TextDocument): boolean {
        return document.languageId === 'mjml' && document.uri.scheme !== 'mjml-preview';
    }

}
