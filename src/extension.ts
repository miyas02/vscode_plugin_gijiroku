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
    const targetText = config.get<string>('targetText');
    const replaceChar = config.get<string>('replaceChar');
    const targetRegex = new RegExp(targetText || '', 'g');
    return {
        extendMarkdownIt(md: any) {
            // 自作の置換ルールを定義
            md.core.ruler.after('block', 'my_custom_replace', (state: any) => {
                state.tokens.forEach((token: any) => {
                    if (token.type !== 'fence' || token.info.trim() !== 'giji') {return;}
                    targetRegex.lastIndex = 0;
                    token.content = token.content.replace(targetRegex, replaceChar);
                });
            });

            return md;
        }
    };
}