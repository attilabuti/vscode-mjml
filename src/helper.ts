"use strict";

import * as vscode from "vscode";
import * as path from "path";

import fileUrl = require("file-url");
import { mjml2html } from "mjml";

export default class Helper {

    static renderMJML(cb: (content: string) => any, fixLinks?: boolean, minify?: boolean, beautify?: boolean): any {
        if (!(this.isMJMLFile(vscode.window.activeTextEditor.document))) {
            vscode.window.showWarningMessage("This is not a MJML document!");
            return;
        }

        let content: string = this.mjml2html(
            vscode.window.activeTextEditor.document.getText(),
            minify != undefined ? minify : vscode.workspace.getConfiguration("mjml").minifyHtmlOutput,
            beautify != undefined ? beautify : vscode.workspace.getConfiguration("mjml").beautifyHtmlOutput,
        );

        if (content) {
            if (fixLinks != undefined && fixLinks) {
                content = this.fixLinks(content);
            }

            return cb(content);
        }
        else {
            vscode.window.showErrorMessage(`MJMLError: Failed to parse file ${path.basename(vscode.window.activeTextEditor.document.uri.fsPath)}`);
        }
    }

    static isMJMLFile(document: vscode.TextDocument): boolean {
        return document.languageId === "mjml" && document.uri.scheme !== "mjml-preview";
    }

    static mjml2html(mjml: string, minify: boolean, beautify: boolean): string {
        try {
            let html: any = mjml2html(mjml, {
                level: "skip",
                minify: minify,
                beautify: beautify,
                filePath: vscode.window.activeTextEditor.document.uri.fsPath,
                cwd: this.getCWD()
            });

            if (html.html) {
                return html.html;
            }
        }
        catch (err) {
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
                return [p1, fileUrl(path.join(path.dirname(vscode.window.activeTextEditor.document.uri.fsPath), p2)), p3].join("");
            }
        );
    }

}
