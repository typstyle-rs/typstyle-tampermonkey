export interface FormatConfig {
    maxLineLength: number;
    indentSize: number;
    collapseMarkupSpaces: boolean;
    reorderImportItems: boolean;
    wrapText: boolean;
}

export const DEFAULT_CONFIG: FormatConfig = {
    maxLineLength: 80,
    indentSize: 2,
    collapseMarkupSpaces: false,
    reorderImportItems: true,
    wrapText: false
};

export interface EditorButton extends HTMLButtonElement {
    _typstyleButton?: boolean;
}

export interface UserConfig extends FormatConfig {
    shortcut: string;
}

export const DEFAULT_USER_CONFIG: UserConfig = {
    ...DEFAULT_CONFIG,
    shortcut: 'Ctrl+Alt+F'
};
