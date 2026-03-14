import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 初回インストール時のみ表示
    const hasShownReadme = context.globalState.get('hasShownReadme', false);
    if (!hasShownReadme) {
        vscode.commands.executeCommand('extension.open', context.extension.id);
        context.globalState.update('hasShownReadme', true);
    }
    //vscode統合設定読み込み
    const config = vscode.workspace.getConfiguration('custom_gijiroku');
    const enable = config.get<boolean>('enable');
    type Replacement = { targetText: string; replaceChar: string };
    const replacements = config.get<Replacement[]>('replacements') || [];
    const rules = replacements.flatMap((r) => {
        try {
            return [{ regex: new RegExp(r.targetText, 'gm'), replaceChar: r.replaceChar }];
        } catch (e) {
            vscode.window.showErrorMessage(`custom_gijiroku: 正規表現が無効です: ${r.targetText}`);
            return [];
        }
    });

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