import { writeFile } from "fs";
import { basename, resolve as resolvePath } from "path";
import { commands, Disposable, TextEditor, window } from "vscode";

import migrate from "mjml-migrate";

import { beautifyHTML, getPath, isMJMLFile } from "./helper";

export default class Migrate {

    constructor(subscriptions: Disposable[]) {
        subscriptions.push(
            commands.registerCommand("mjml.migrate", () => {
                this.migrate();
            })
        );
    }

    private migrate(): void {
        const activeTextEditor: TextEditor | undefined = window.activeTextEditor;
        if (!activeTextEditor) {
            return;
        }

        if (!isMJMLFile(activeTextEditor.document)) {
            window.showWarningMessage("This is not a MJML document!");

            return;
        }

        try {
            const mjml: string = migrate(activeTextEditor.document.getText());
            if (!mjml) {
                return;
            }

            const inputFileName: string = basename(getPath());
            const fileName: string = inputFileName.replace(/\.[^\.]+$/, "");
            const file: string = resolvePath(getPath(), `../${fileName}_v4.mjml`);

            const content: string | undefined = beautifyHTML(mjml);

            if (content) {
                writeFile(file, content, (error: NodeJS.ErrnoException | null) => {
                    if (error) {
                        window.showErrorMessage(error.message);
                    } else {
                        window.showInformationMessage(
                            `${inputFileName} was converted to the MJML 4 syntax in ${fileName}_v4.mjml`
                        );
                    }
                });
            } else {
                window.showErrorMessage("Something went wrong.");
            }
        } catch (error) {
            window.showErrorMessage("Input file failed to render.");

            return;
        }
    }

}
