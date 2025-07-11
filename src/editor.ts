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

        const change = this.calculateDiff(oldText, newText);

        if (change) {
            editorView.dispatch({
                changes: change
            });
        }
    }

    // Borrowed from https://github.com/Myriad-Dreamin/tinymist/blob/b4a53274c2f1c9a6cfcf77b0522704f30d9cb063/crates/tinymist/src/task/format.rs#L62
    private calculateDiff(oldText: string, newText: string): { from: number, to: number, insert: string } | null {
        if (oldText === newText) {
            return null;
        }
        let prefix = 0;
        const minLength = Math.min(oldText.length, newText.length);

        while (prefix < minLength && oldText[prefix] === newText[prefix]) {
            prefix++;
        }
        if (prefix === oldText.length && prefix === newText.length) {
            return null;
        }
        while (prefix > 0 && this.isHighSurrogate(oldText.charCodeAt(prefix - 1))) {
            prefix--;
        }

        let suffix = 0;
        const oldSuffix = oldText.slice(prefix);
        const newSuffix = newText.slice(prefix);
        const suffixMinLength = Math.min(oldSuffix.length, newSuffix.length);
        while (suffix < suffixMinLength &&
            oldSuffix[oldSuffix.length - 1 - suffix] === newSuffix[newSuffix.length - 1 - suffix]) {
            suffix++;
        }
        while (suffix > 0 &&
            (this.isLowSurrogate(oldText.charCodeAt(oldText.length - suffix)) ||
                this.isLowSurrogate(newText.charCodeAt(newText.length - suffix)))) {
            suffix--;
        }

        const replaceStart = prefix;
        const replaceEnd = oldText.length - suffix;
        const replaceWith = newText.slice(prefix, newText.length - suffix);
        return {
            from: replaceStart,
            to: replaceEnd,
            insert: replaceWith
        };
    }

    private isHighSurrogate(code: number): boolean {
        return code >= 0xD800 && code <= 0xDBFF;
    }

    private isLowSurrogate(code: number): boolean {
        return code >= 0xDC00 && code <= 0xDFFF;
    }
}
