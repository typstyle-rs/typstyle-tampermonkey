export class EditorManager {
    getContent(): string {
        const contentElement = document.querySelector('.cm-editor .cm-content');
        //@ts-ignore
        return contentElement.cmView.view.viewState.state.doc.toString()
    }

    setContent(newContent: string): void {
        const contentElement = document.querySelector('.cm-editor .cm-content');
        //@ts-ignore
        const editorView: any = contentElement.cmView.view;
        editorView.dispatch({
            changes: {
                from: 0,
                to: editorView.viewState.state.doc.length,
                insert: newContent
            }
        })
    }
}
