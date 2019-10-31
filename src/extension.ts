import { ExtensionContext, TextDocument, window, workspace } from 'vscode'

import Beautify from './beautify'
import Copy from './copy'
import Documentation from './documentation'
import Email from './email'
import Export from './export'
import Linter from './linter'
import Migrate from './migrate'
import Preview from './preview'
import Screenshot from './screenshot'
import Template from './template'
import Version from './version'

import { isMJMLFile } from './helper'

let context: ExtensionContext
let extensionFeatures: object[] = []

export function activate(extensionContext: ExtensionContext) {
    context = extensionContext

    extensionFeatures = [
        new Beautify(context.subscriptions),
        new Copy(context.subscriptions),
        new Documentation(context),
        new Email(context.subscriptions),
        new Export(context.subscriptions),
        new Linter(context.subscriptions),
        new Migrate(context.subscriptions),
        new Preview(context),
        new Screenshot(context.subscriptions),
        new Template(context),
        new Version(context.subscriptions),
    ]

    // Detect MJML 3
    workspace.onDidOpenTextDocument(
        (document?: TextDocument) => {
            if (
                document &&
                isMJMLFile(document) &&
                document.getText().indexOf('mj-container') > -1
            ) {
                window.showInformationMessage(
                    `MJML v3 syntax detected. Use "MJML: Migrate" to get the migrated MJML.`,
                )
            }
        },
        null,
        context.subscriptions,
    )
}

export function deactivate() {
    for (const feature of extensionFeatures) {
        if (typeof (feature as any).dispose === 'function') {
            ;(feature as any).dispose()
        }
    }

    for (const subscription of context.subscriptions) {
        subscription.dispose()
    }
}
