import * as vscode from 'vscode';

let enable: boolean | undefined = false;
let config: vscode.WorkspaceConfiguration;
let replacements: { targetText: string; replaceChar: string }[] = [];
let rules: { regex: RegExp; replaceChar: string }[] = [];

function readConfig() {
    config = vscode.workspace.getConfiguration('custom_gijiroku');
    enable = config.get<boolean>('enable');
    type Replacement = { targetText: string; replaceChar: string };
    replacements = config.get<Replacement[]>('replacements') || [];
    rules = replacements.flatMap((r) => {
        try {
            return [{ regex: new RegExp(r.targetText, 'gm'), replaceChar: r.replaceChar }];
        } catch (e) {
            vscode.window.showErrorMessage(`custom_gijiroku: 正規表現が無効です: ${r.targetText}`);
            return [];
        }
    });
}

export function activate(context: vscode.ExtensionContext) {
    // 初回インストール時のみ表示
    const hasShownReadme = context.globalState.get('hasShownReadme', false);
    if (!hasShownReadme) {
        vscode.commands.executeCommand('extension.open', context.extension.id);
        context.globalState.update('hasShownReadme', true);
    }
    //vscode統合設定読み込み
    readConfig();

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('custom_gijiroku')) {
                readConfig();
            }
        })
    );

    if (!enable) {
        return;
    }
    return {
        extendMarkdownIt(md: any) {
            // 自作の置換ルールを定義
            md.core.ruler.after('block', 'my_custom_replace', (state: any) => {
                state.tokens.forEach((token: any) => {
                    if (token.type !== 'fence' || token.info.trim() !== 'giji') {return;}
                    for (const rule of rules) {
                        rule.regex.lastIndex = 0;
                        token.content = token.content.replace(rule.regex, rule.replaceChar);
                    }
                });
            });

            return md;
        }
    };
}
