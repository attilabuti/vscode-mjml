'use strict';

import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';

import * as phantomJS from 'phantomjs-prebuilt';

import LintingProvider from './lintingProvider';
import PreviewManager from './previewProvider';
import ExportHTML from './exportProvider';
import CopyHTML from './copyProvider';
import Screenshot from './screenshotProvider';
import SendEmail from './emailProvider';

let linter: LintingProvider;
let previewManager: PreviewManager;
let exportHTML: ExportHTML;
let copyHTML: CopyHTML;
let screenshot: Screenshot;
let sendEmail: SendEmail;

export function activate(context: vscode.ExtensionContext) {
    // Gets a value indicating whether PhantomJS could be built
    let phantomJSBuilt = null;

    // Rebuilding PhantomJS if required
    if (phantomJS.platform != process.platform) {
        try {
            let env = process.env;
            env['PHANTOMJS_PLATFORM'] = process.platform;
            env['PHANTOMJS_ARCH'] = process.arch;

            vscode.window.showInformationMessage('MJML needs to be rebuilt for your current platform. Please wait for the installation to finish...');
            process.chdir(path.join(__dirname, '..'));

            childProcess.exec('npm --strict-ssl false rebuild phantomjs-prebuilt', {
                env: env
            }, (error, stdout, stderr) => {
                if (!error && !stderr) {
                    phantomJSBuilt = true;
                    vscode.window.showInformationMessage('MJML\'s been updated. Please restart VSCode in order to continue using MJML.');
                }
                else {
                    vscode.window.showErrorMessage('MJML couldn\'t build the propper version of PhantomJS. Restart VSCode in order to try it again.');
                }

                screenshot = new Screenshot(context, process.platform, phantomJS.platform, phantomJSBuilt);
            });
        }
        catch (e) {
            vscode.window.showErrorMessage('MJML couldn\'t build the propper version of PhantomJS. Restart VSCode in order to try it again.');
            phantomJSBuilt = false;
        }
    }
    else {
        screenshot = new Screenshot(context, process.platform, phantomJS.platform, phantomJSBuilt);
    }

    if (vscode.workspace.getConfiguration('mjml').lintEnable) {
        linter = new LintingProvider(context.subscriptions);
    }

    previewManager = new PreviewManager(context);
    exportHTML = new ExportHTML(context.subscriptions);
    copyHTML = new CopyHTML(context.subscriptions);
    sendEmail = new SendEmail(context.subscriptions);
}

export function deactivate() {
    previewManager.dispose();
}
