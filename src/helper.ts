"use strict";

import * as vscode from "vscode";
import * as path from "path";

import * as beautifyJS from "js-beautify";
import fileUrl = require("file-url");
import mjml2html = require("mjml");

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

    static mjml2html(mjml: string, minify: boolean, beautify: boolean, mjmlPath?: string): string {
        try {
            if (!mjmlPath) {
                mjmlPath = this.getPath();
            }

            let { html, errors } = mjml2html(mjml, {
                level: "skip",
                minify: minify,
                beautify: beautify,
                filePath: mjmlPath,
                cwd: this.getCWD(mjmlPath)
            });

            if (html) {
                return html;
            }
        }
        catch (err) {
            return;
        }
    }

    static getCWD(mjmlPath?: string): string {
        if (vscode.workspace.rootPath) {
            return vscode.workspace.rootPath;
        }
        else {
            return (mjmlPath) ? path.parse(mjmlPath).dir : "";
        }
    }

    static fixLinks(text: string, mjmlPath?: string): string {
        return text.replace(
            new RegExp(/((?:src|href|url)(?:=|\()(?:[\'\"]|))((?!http|\\|"|#).+?)([\'\"]|\))/, "gmi"),
            (subString: string, p1: string, p2: string, p3: string): string => {
                return [p1, fileUrl(path.join(path.dirname(((mjmlPath) ? mjmlPath : this.getPath())), p2)), p3].join("");
            }
        );
    }

    static beautifyHTML(mjml: string): any {
        try {
            return beautifyJS.html(mjml, vscode.workspace.getConfiguration("mjml").beautify);
        } catch (err) {
            vscode.window.showErrorMessage(err);
            return;
        }
    }

    static getPath(): string {
        if (vscode.window.activeTextEditor.document) {
            return vscode.window.activeTextEditor.document.uri.fsPath;
        }
        else {
            return "";
        }
    }

}
