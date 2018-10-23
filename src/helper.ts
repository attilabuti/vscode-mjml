"use strict";

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import * as beautifyJS from "js-beautify";
import * as mime from "mime";
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
        ).html;

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

    static mjml2html(mjml: string, minify: boolean, beautify: boolean, mjmlPath?: string, level: "skip" | "strict" | "ignore" = "skip" ): { html: string, errors: any[] } {
        try {
            if (!mjmlPath) {
                mjmlPath = this.getPath();
            }

            return mjml2html(mjml, {
                level: level,
                minify: minify,
                beautify: beautify,
                filePath: mjmlPath,
                mjmlConfigPath: this.getCWD(mjmlPath)
            });
        }
        catch (err) {
            return { html: "", errors: [err] };
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

    static encodeImage(filePath: string, original: string): string {
        let mimeType: string = mime.getType(filePath);
        if (!mimeType || ["bmp", "gif", "jpeg", "jpg", "png", "svg"].indexOf(mime.getExtension(mimeType)) == -1) {
            return original;
        }

        if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            let data: Buffer = fs.readFileSync(filePath);
            if (data) {
                return `data:${mimeType};base64,${data.toString("base64")}`;
            }
        }

        return original;
    }

    static fixLinks(text: string, mjmlPath?: string): string {
        return text.replace(
            new RegExp(/((?:src|href|url)(?:=|\()(?:[\'\"]|))((?!http|\\|"|#).+?)([\'\"]|\))/, "gmi"),
            (subString: string, p1: string, p2: string, p3: string): string => {
                return [p1, this.encodeImage(path.join(path.dirname(((mjmlPath) ? mjmlPath : this.getPath())), p2), p2), p3].join("");
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

    static setBackgroundColor(html: string): string {
        if (vscode.workspace.getConfiguration("mjml").previewBackgroundColor) {
            let tmp: RegExpExecArray = /<.*head.*>/i.exec(html);

            if (tmp && tmp[0]) {
                html = html.replace(tmp[0], `${tmp[0]}\n<style>html, body { background-color: ${vscode.workspace.getConfiguration("mjml").previewBackgroundColor}; }</style>`);
            }
        }

        return html;
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
