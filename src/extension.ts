"use strict";

import * as vscode from "vscode";
import * as path from "path";
import * as childProcess from "child_process";

import * as phantomJS from "phantomjs-prebuilt";

import Beautify from "./beautify";
import CopyHTML from "./copy";
import SendEmail from "./email";
import ExportHTML from "./export";
import LintingProvider from "./linter";
import Migrate from "./migrate";
import PreviewManager from "./preview";
import Screenshot from "./screenshot";
import Template from "./template";

import helper from "./helper";

let beautify: Beautify;
let copyHTML: CopyHTML;
let sendEmail: SendEmail;
let exportHTML: ExportHTML;
let linter: LintingProvider;
let migrate: Migrate;
let previewManager: PreviewManager;
let screenshot: Screenshot;
let template: Template;

export function activate(context: vscode.ExtensionContext) {
    // Gets a value indicating whether PhantomJS could be built
    let phantomJSBuilt: any = undefined;

    // Rebuilding PhantomJS if required
    if (phantomJS.platform != process.platform) {
        try {
            let env: NodeJS.ProcessEnv = process.env;
            env["PHANTOMJS_PLATFORM"] = process.platform;
            env["PHANTOMJS_ARCH"] = process.arch;

            vscode.window.showInformationMessage("MJML needs to be rebuilt for your current platform. Please wait for the installation to finish...");
            process.chdir(path.join(__dirname, ".."));

            childProcess.exec("npm --strict-ssl false rebuild phantomjs-prebuilt", {
                env: env
            }, (error: Error, stdout: string, stderr: string) => {
                if (!error && !stderr) {
                    phantomJSBuilt = true;
                    vscode.window.showInformationMessage("MJML's been updated. Please restart VSCode in order to continue using MJML.");
                }
                else {
                    vscode.window.showErrorMessage("MJML couldn't build the propper version of PhantomJS. Restart VSCode in order to try it again.");
                }

                screenshot = new Screenshot(context, process.platform, phantomJS.platform, phantomJSBuilt);
            });
        }
        catch (err) {
            vscode.window.showErrorMessage("MJML couldn't build the propper version of PhantomJS. Restart VSCode in order to try it again.");
            phantomJSBuilt = false;
        }
    }
    else {
        screenshot = new Screenshot(context, process.platform, phantomJS.platform, phantomJSBuilt);
    }

    // Detect MJML 3
    vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
        if (helper.isMJMLFile(document)) {
            if (document.getText().indexOf("mj-container") > -1) {
                vscode.window.showInformationMessage("MJML v3 syntax detected. Use \"MJML: Migrate\" to get the migrated MJML.");
            }
        }
    }, null, context.subscriptions);

    if (vscode.workspace.getConfiguration("mjml").lintEnable) {
        linter = new LintingProvider(context.subscriptions);
    }

    beautify = new Beautify(context.subscriptions);
    vscode.languages.registerDocumentFormattingEditProvider("mjml", {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            return beautify.formatDocument();
        }
    });

    copyHTML = new CopyHTML(context.subscriptions);
    sendEmail = new SendEmail(context.subscriptions);
    exportHTML = new ExportHTML(context.subscriptions);
    migrate = new Migrate(context.subscriptions);
    previewManager = new PreviewManager(context);
    template = new Template(context.subscriptions);
}

export function deactivate() {
    previewManager.dispose();
}
