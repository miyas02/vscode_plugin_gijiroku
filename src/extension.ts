// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import markdownit from 'markdown-it'
import hljs from 'highlight.js' // https://highlightjs.org

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// return {
	// 	extendMarkdownIt(md: markdownit) {
	// 		md.set({
	// 			highlight: function (str: string, lang: string) {
	// 				// 1. 言語指定があり、かつ highlight.js がその言語をサポートしているか確認
	// 				if (lang && hljs.getLanguage(lang)) {
	// 					try {
	// 						// 2. ユーザーが指定した言語 (lang) でハイライト
	// 						return hljs.highlightAuto(str).value;
	// 					} catch (__) {
	// 						console.error('Highlight error');
	// 					}
	// 				}

	// 				// 言語指定がない場合は自動判定させることも可能
	// 				// return hljs.highlightAuto(str).value; 

	// 				return ''; // 空文字を返すと、markdown-it のデフォルト（エスケープ処理のみ）が適用されます
	// 			}
	// 		});
	// 		return md;
	// 	}
	// };
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "plugin-2" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('plugin-2.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from plugin_2!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
