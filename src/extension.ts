'use strict';

import * as vscode from 'vscode';

import LintingProvider from './lintingProvider';
import PreviewManager from './previewProvider';
import ExportHTML from './exportProvider';
import Screenshot from './screenshotProvider';

let linter: LintingProvider;
let previewManager: PreviewManager;
let exportHTML: ExportHTML;
let screenshot: Screenshot;

export function activate(context: vscode.ExtensionContext) {
	if (vscode.workspace.getConfiguration('mjml').lintEnable) {
		linter = new LintingProvider(context.subscriptions);
	}

	previewManager = new PreviewManager(context);
	exportHTML = new ExportHTML(context.subscriptions);
	screenshot = new Screenshot(context);
}

export function deactivate() {
	previewManager.dispose();
}
