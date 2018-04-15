"use strict";

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import * as mailjet from "node-mailjet";
import * as nodemailer from "nodemailer";
import * as mime from "mime";
import isUrl = require("is-url");

import helper from "./helper";

export default class SendEmail {

    constructor(subscriptions: vscode.Disposable[]) {
        subscriptions.push(
            vscode.commands.registerCommand("mjml.sendEmail", () => {
                helper.renderMJML((content: string) => {
                    this.sendEmail(content, vscode.window.activeTextEditor.document.uri.fsPath);
                });
            })
        );
    }

    private sendEmail(content: string, mjmlPath: string): void {
        let mailer: string = vscode.workspace.getConfiguration("mjml").mailer.toLowerCase();

        let defaultSubject: string = vscode.workspace.getConfiguration("mjml").mailSubject;
        let defaultRecipients: string = vscode.workspace.getConfiguration("mjml").mailRecipients;

        vscode.window.showInputBox({
            prompt: "Subject",
            placeHolder: "Type a subject for the email.",
            value: defaultSubject
        }).then((subject: string) => {
            if (!subject) {
                return;
            }

            vscode.window.showInputBox({
                prompt: "Recipients",
                placeHolder: "Comma-separated list of recipients.",
                value: defaultRecipients
            }).then((recipients: string) => {
                if (!recipients) {
                    return;
                }

                recipients = (recipients ? recipients : defaultRecipients).replace(/\s/g, "");

                let attachments: any[] = this.createAttachments(content, mjmlPath, mailer);
                content = this.replaceImages(content, attachments, mailer);

                if (mailer == "nodemailer") {
                    this.sendEmailWithNodemailer(subject, recipients, content, attachments);
                }
                else {
                    this.sendEmailWithMailjet(subject, recipients, content, attachments);
                }
            });
        });
    }

    private sendEmailWithNodemailer(subject: string, recipients: string, content: string, attachments: any[]): void {
        let transportOptions: any = vscode.workspace.getConfiguration("mjml").nodemailer;

        nodemailer.createTransport(transportOptions).sendMail({
            from: vscode.workspace.getConfiguration("mjml").mailFromName + " <" + vscode.workspace.getConfiguration("mjml").mailSender + ">",
            to: recipients,
            subject: subject,
            html: content,
            attachments: attachments
        }, (err: Error, info: any) => {
            if (err) {
                vscode.window.showErrorMessage("Something went wrong.");
                return;
            }

            vscode.window.showInformationMessage("Mail has been sent successfully.");

            if (transportOptions.host && transportOptions.host == "smtp.ethereal.email") {
                let url: (string | boolean) = nodemailer.getTestMessageUrl(info);

                if (url) {
                    vscode.window.showInformationMessage("Preview URL: " + url);
                }
            }
        });
    }

    private sendEmailWithMailjet(subject: string, recipients: string, content: string, attachments: any[]): void {
        let recipientList: Array<{ Email: string }> = recipients.split(",").map((emailAddress: string) => {
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
            "Html-part": content,
            Inline_attachments: attachments
        }).then((result: object) => {
            vscode.window.showInformationMessage("Mail has been sent successfully.");
        }).catch((err: any) => {
            vscode.window.showErrorMessage("Something went wrong.");
        });
    }

    private createAttachments(content: string, mjmlPath: string, mailer?: string): any[] {
        let imgPaths: string[] = [];

        let match: RegExpExecArray;
        let pattern: RegExp = /<img\s+[^>]*?src=("|')([^"']+)\1/g;
        while (match = pattern.exec(content)) {
            imgPaths.push(match[2]);
        }

        let attachments: any[] = [];
        if (imgPaths) {
            for (let i = 0; i < imgPaths.length; i++) {
                if (imgPaths[i] && !isUrl(imgPaths[i])) {
                    let filePath: string = path.join(path.dirname(mjmlPath), imgPaths[i]);

                    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                        if (mailer == "nodemailer") {
                            attachments.push({
                                originalPath: imgPaths[i],
                                filename: path.basename(filePath),
                                content: fs.createReadStream(filePath),
                                cid: Math.random().toString(36).substring(2) + i
                            });
                        }
                        else {
                            attachments.push({
                                originalPath: imgPaths[i],
                                "Content-type": mime.getType(filePath),
                                Filename: i + "_" + path.basename(filePath),
                                content: fs.readFileSync(filePath).toString("base64")
                            });
                        }
                    }
                }
            }
        }

        return attachments;
    }

    private replaceImages(content: string, attachments: any[], mailer?: string): string {
        if (attachments) {
            for (let i = 0; i < attachments.length; i++) {
                content = content.replace(
                    "src=\"" + attachments[i].originalPath + "\"",
                    "src=\"cid:" + ((mailer == "nodemailer") ? attachments[i].cid : attachments[i].Filename) + "\""
                );
            }
        }

        return content;
    }

}
