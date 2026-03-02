import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    return {
        extendMarkdownIt(md: any) {
            // 自作の置換ルールを定義
            md.core.ruler.after('block', 'my_custom_replace', (state: any) => {
                state.tokens.forEach((token: any) => {
                    if (token.type !== 'inline') return;
					    if (/\.\w+/.test(token.content)) {
							console.log('Match found in:', token.content); // ログに出れば成功
							token.content = token.content.replace(/\./g, '★ドットあり');
						}

                    token.children.forEach((child: any) => {
                        if (child.type !== 'text') return;


                    });
                });
            });

            return md;
        }
    };
}