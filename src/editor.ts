import fastDiff from 'fast-diff';

export class EditorManager {
    getContent(): string {
        const contentElement = document.querySelector('.cm-editor .cm-content');
        //@ts-ignore
        return contentElement.cmView.view.viewState.state.doc.toString()
    }

    applyDiff(oldText: string, newText: string): void {
        const contentElement = document.querySelector('.cm-editor .cm-content');
        //@ts-ignore
        const editorView: any = contentElement.cmView.view;

        const diffs = fastDiff(oldText, newText);
        const changes = [];
        let pos = 0;

        for (const [operation, text] of diffs) {
            switch (operation) {
                case fastDiff.EQUAL:
                    pos += text.length;
                    break;

                case fastDiff.DELETE:
                    changes.push({
                        from: pos,
                        to: pos + text.length,
                    });
                    pos += text.length;
                    break;

                case fastDiff.INSERT:
                    changes.push({
                        from: pos,
                        insert: text
                    });
                    break;
            }
        }

        changes.sort((a, b) => b.from - a.from);

        editorView.dispatch({
            changes: changes
        });
    }
}
