'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import * as mailjet from 'node-mailjet';

import helper from './helper';

export default class SendEmail {

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand('mjml.sendEmail', () => {
                this.sendEmail();
            })
        );
    }

    private sendEmail() {
        if (!(helper.isMJMLFile(vscode.window.activeTextEditor.document))) {
            vscode.window.showWarningMessage('This is not a MJML document!');
            return;
        }

        let content = helper.renderMJML(
            vscode.window.activeTextEditor.document.getText(),
            vscode.workspace.getConfiguration('mjml').minifyHtmlOutput,
            vscode.workspace.getConfiguration('mjml').beautifyHtmlOutput
        );

        if (content) {
            this.sendEmailWithMailjet(content);
        }
        else {
            vscode.window.showErrorMessage('MJMLError: Failed to parse file ' + path.basename(vscode.window.activeTextEditor.document.uri.fsPath));
        }
    }

    private sendEmailWithMailjet(content: string) {
        let defaultSubject = vscode.workspace.getConfiguration('mjml').mailSubject;
        let defaultRecipients = vscode.workspace.getConfiguration('mjml').mailRecipients;

        vscode.window.showInputBox({ placeHolder: 'Subject (' + defaultSubject + ')' }).then((subject) => {
            vscode.window.showInputBox({ placeHolder: 'Recipients (' + defaultRecipients + ')' }).then((recipients) => {
                if (!subject) {
                    subject = defaultSubject;
                }

                recipients = (recipients ? recipients : defaultRecipients).replace(/\s/g, '').split(',').map((e) => {
                    return {Email: e};
                });

                mailjet.connect(
                    vscode.workspace.getConfiguration('mjml').mailjetAPIKey,
                    vscode.workspace.getConfiguration('mjml').mailjetAPISecret
                ).post('send').request({
                    FromEmail: vscode.workspace.getConfiguration('mjml').mailSender,
                    FromName: vscode.workspace.getConfiguration('mjml').mailFromName,
                    Subject: subject,
                    Recipients: recipients,
                    'Html-part': content
                }).then(result => {
                    vscode.window.showInformationMessage('Mail has been sent successfully.');
                }).catch(err => {
                    vscode.window.showErrorMessage('Something went wrong.');
                });
            });
        });
    }

}
