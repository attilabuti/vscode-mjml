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
                this.platform(false);
            }),

            vscode.commands.registerCommand("mjml.multipleScreenshots", () => {
                this.platform(true);
            })
        );
    }

    private platform(multiple: boolean): void {
        if (this.phantomJsPlatform != this.processPlatform || this.phantomJSBuilt != undefined) {
            if (this.phantomJSBuilt) {
                vscode.window.showInformationMessage("MJML's been updated. Please restart VSCode in order to continue using MJML.");
            }
            else {
                vscode.window.showWarningMessage("MJML couldn't build the propper version of PhantomJS. Restart VSCode in order to try it again.");
            }
        }
        else {
            this.takeScreenshot(multiple);
        }
    }

    private takeScreenshot(multiple: boolean): void {
        helper.renderMJML((content: string) => {
            let defaultWidth: number = vscode.workspace.getConfiguration("mjml").screenshotWidth;
            let defaultFileName: string = path.basename(vscode.window.activeTextEditor.document.uri.fsPath).replace(/\.[^\.]+$/, "");

            let screenshotType: string = "png";
            if (["png", "jpg", "jpeg"].indexOf(vscode.workspace.getConfiguration("mjml").screenshotType)) {
                screenshotType = vscode.workspace.getConfiguration("mjml").screenshotType;
            }

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

                if (multiple) {
                    let width: (string | number)[] = vscode.workspace.getConfiguration("mjml").screenshotWidths;

                    if (width) {
                        width.forEach((width: string | number) => {
                            let tmpFileName: string = fileName + "_" + width;
                            let file: string = path.resolve(vscode.window.activeTextEditor.document.uri.fsPath, `../${tmpFileName}.${screenshotType}`);

                            this.webshot(content, width, file, tmpFileName, screenshotType);
                        });
                    }
                    else {
                        this.webshot(content, defaultWidth, file, fileName, screenshotType);
                    }
                }
                else {
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

                        this.webshot(content, width, file, fileName, screenshotType);
                    });
                }
            });
        }, true);
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
            vscode.window.showInformationMessage("Successfully saved screenshot " + fileName + "." + screenshotType);
        });
    }

}
