import { commands, Disposable, window } from 'vscode'

import { copy } from 'copy-paste'

import { renderMJML } from './helper'

export default class Copy {
    constructor(subscriptions: Disposable[]) {
        subscriptions.push(
            commands.registerCommand('mjml.copyHTML', () => {
                this.copy()
            }),
        )
    }

    private copy(): void {
        renderMJML((content: string) => {
            copy(content, () => {
                window.showInformationMessage('Copied!')
            })
        })
    }
}
