"use strict";

import * as vscode from "vscode";

import * as mailjet from "node-mailjet";

import helper from "./helper";

export default class SendEmail {

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand("mjml.sendEmail", () => {
                this.sendEmail();
            })
        );
    }

    private sendEmail(): void {
        helper.renderMJML((content: string) => {
            this.sendEmailWithMailjet(content);
        });
    }

    private sendEmailWithMailjet(content: string): void {
        let defaultSubject: string = vscode.workspace.getConfiguration("mjml").mailSubject;
        let defaultRecipients: string = vscode.workspace.getConfiguration("mjml").mailRecipients;

        vscode.window.showInputBox({ placeHolder: `Subject (${defaultSubject})` }).then((subject: string) => {
            vscode.window.showInputBox({ placeHolder: `Recipients (${defaultRecipients})` }).then((recipients: string) => {
                if (!subject) {
                    subject = defaultSubject;
                }

                let recipientList: Array<{ Email: string }> = (recipients ? recipients : defaultRecipients).replace(/\s/g, "").split(",").map((emailAddress: string) => {
                    return { Email: emailAddress };
                });

                mailjet.connect(
                    vscode.workspace.getConfiguration("mjml").mailjetAPIKey,
                    vscode.workspace.getConfiguration("mjml").mailjetAPISecret
                ).post("send").request({
                    FromEmail: vscode.workspace.getConfiguration("mjml").mailSender,
                    FromName: vscode.workspace.getConfiguration("mjml").mailFromName,
                    Subject: subject,
                    Recipients: recipientList,
                    "Html-part": content
                }).then((result: object) => {
                    vscode.window.showInformationMessage("Mail has been sent successfully.");
                }).catch((err: any) => {
                    vscode.window.showErrorMessage("Something went wrong.");
                });
            });
        });
    }

}
