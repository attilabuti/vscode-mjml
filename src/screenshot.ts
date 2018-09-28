"use strict";

import * as vscode from "vscode";
import * as path from "path";

import * as webshot from "ab-webshot";

import helper from "./helper";

export default class Screenshot {

    private processPlatform: string;
    private phantomJsPlatform: string;
    private phantomJSBuilt: any;

    constructor(context: vscode.ExtensionContext, processPlatform: string, phantomJsPlatform: string, phantomJSBuilt: any) {
        this.processPlatform = processPlatform;
        this.phantomJsPlatform = phantomJsPlatform;
        this.phantomJSBuilt = phantomJSBuilt;

        context.subscriptions.push(
            vscode.commands.registerCommand("mjml.screenshot", () => {
                this.renderMJML(false);
            }),

            vscode.commands.registerCommand("mjml.multipleScreenshots", () => {
                this.renderMJML(true);
            })
        );
    }

    private renderMJML(multiple: boolean): void {
        if (this.phantomJsPlatform != this.processPlatform || this.phantomJSBuilt != undefined) {
            if (this.phantomJSBuilt) {
                vscode.window.showInformationMessage("MJML's been updated. Please restart VSCode in order to continue using MJML.");
            }
            else {
                vscode.window.showWarningMessage("MJML couldn't build the propper version of PhantomJS. Restart VSCode in order to try it again.");
            }
        }
        else {
            helper.renderMJML((content: string) => {
                let defaultWidth: number = vscode.workspace.getConfiguration("mjml").screenshotWidth;

                if (!multiple) {
                    vscode.window.showInputBox({
                        prompt: "Width",
                        placeHolder: `Enter image width (${defaultWidth}px).`,
                        value: defaultWidth.toString()
                    }).then((width: any) => {
                        if (!width) {
                            return;
                        }

                        width = parseInt(width.replace(/[^0-9\.]+/g, ""));
                        if (!width || Number.isNaN(parseInt(width))) {
                            width = defaultWidth;
                        }

                        this.showSaveDialog(multiple, content, width);
                    });
                }
                else {
                    this.showSaveDialog(multiple, content, defaultWidth);
                }
            }, true);
        }
    }

    private showSaveDialog(multiple: boolean, content: string, width: number): void {
        let defaultFileName: string = path.basename(vscode.window.activeTextEditor.document.uri.fsPath).replace(/\.[^\.]+$/, "");

        let screenshotType: string = "png";
        if (["png", "jpg", "jpeg"].indexOf(vscode.workspace.getConfiguration("mjml").screenshotType)) {
            screenshotType = vscode.workspace.getConfiguration("mjml").screenshotType;
        }

        if (vscode.workspace.getConfiguration("mjml").showSaveDialog) {
            vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, `../${defaultFileName}.${screenshotType}`)),
                filters: {
                    Images: ["png", "jpg", "jpeg"]
                }
            }).then((fileUri: vscode.Uri) => {
                if (fileUri) {
                    this.takeScreenshot(multiple, fileUri.fsPath, content, width, screenshotType);
                }
            });
        }
        else {
            vscode.window.showInputBox({
                prompt: "Filename",
                placeHolder: "Enter a filename.",
                value: defaultFileName + "." + screenshotType
            }).then((fileName: string) => {
                if (!fileName) {
                    return;
                }

                fileName = fileName ? fileName.replace(/\.[^\.]+$/, "") : defaultFileName;
                let file: string = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, `../${fileName}.${screenshotType}`);

                this.takeScreenshot(multiple, file, content, width, screenshotType);
            });
        }
    }

    private takeScreenshot(multiple: boolean, file: string, content: string, width: any, screenshotType: string): void {
        if (multiple) {
            let width: (string | number)[] = vscode.workspace.getConfiguration("mjml").screenshotWidths;
            let fileName: string = path.basename(file).split(".").slice(0, -1).join(".");

            if (width) {
                width.forEach((width: string | number) => {
                    let tmpFileName: string = fileName + "_" + width;
                    let file: string = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, `../${tmpFileName}.${screenshotType}`);

                    this.webshot(content, width, file, tmpFileName, screenshotType);
                });
            }
            else {
                this.webshot(content, width, file, fileName, screenshotType);
            }
        }
        else {
            this.webshot(content, width, file, file, screenshotType);
        }
    }

    private webshot(htmlDocument: string, width: any, file: string, fileName: string, screenshotType: string): void {
        webshot(htmlDocument, file, {
            screenSize: {
                width: parseInt(width),
                height: 480
            },
            shotSize: {
                width: "window",
                height: "all"
            },
            quality: vscode.workspace.getConfiguration("mjml").screenshotQuality,
            siteType: "html",
            streamType: screenshotType
        }, (err: any) => {
            if (err) {
                vscode.window.showErrorMessage(err.message);
            }
            else {
                vscode.window.showInformationMessage(`Successfully saved screenshot ${fileName}.${screenshotType}`);
            }
        });
    }

}
