import { commands, Disposable, languages, Position, Range, TextDocument, TextEdit, TextEditor, TextEditorEdit, window } from "vscode";

import { beautifyHTML, isMJMLFile } from "./helper";

export default class Beautify {

    constructor(subscriptions: Disposable[]) {
        subscriptions.push(
            languages.registerDocumentFormattingEditProvider({
                language: "mjml",
                scheme: "file"
            }, {
                provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
                    const formattedDocument: string | undefined = beautifyHTML(document.getText());
                    if (formattedDocument) {
                        return [ TextEdit.replace(getRange(document), formattedDocument) ];
                    }

                    return [ TextEdit.replace(getRange(document), document.getText()) ];
                }
            }),

            commands.registerCommand("mjml.beautify", () => {
                this.beautify();
            })
        );
    }

    private beautify(): void {
        const activeTextEditor: TextEditor | undefined = window.activeTextEditor;

        if (activeTextEditor && isMJMLFile(activeTextEditor.document)) {
            activeTextEditor.edit((editBuilder: TextEditorEdit) => {
                const formattedDocument: string | undefined = beautifyHTML(activeTextEditor.document.getText());

                if (formattedDocument) {
                    editBuilder.replace(getRange(activeTextEditor.document), formattedDocument);
                }
            });
        } else {
            window.showWarningMessage("This is not a MJML document!");

            return;
        }
    }

}

function getRange(document: TextDocument): Range {
    return new Range(
        new Position(0, 0),
        new Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
    );
}
