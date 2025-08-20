import { TypstyleFormatter } from './formatter';
import { EditorManager } from './editor';
import { ConfigUI, ButtonManager } from './ui';
import { UserConfig, DEFAULT_USER_CONFIG } from './types';
import { showNotification } from './notification';
import './style.css'

class TypstylePlugin {
    private formatter: TypstyleFormatter;
    private editor: EditorManager;
    private configUI: ConfigUI;
    private buttonManager: ButtonManager;
    private config: UserConfig;
    private isInitialized: boolean = false;

    constructor() {
        this.config = this.loadConfig();
        this.formatter = new TypstyleFormatter(this.config);
        this.editor = new EditorManager();
        this.configUI = new ConfigUI(this.config, this.handleConfigSave.bind(this));
        this.buttonManager = new ButtonManager(this.handleButtonClick.bind(this));
    }

    init(): void {
        this.watchPageChanges();
        this.checkAndInitialize();
    }

    private watchPageChanges(): void {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            originalPushState.apply(history, args);
            setTimeout(() => plugin.checkAndInitialize(), 100);
        };

        history.replaceState = function (...args) {
            originalReplaceState.apply(history, args);
            setTimeout(() => plugin.checkAndInitialize(), 100);
        };

        window.addEventListener('popstate', () => {
            setTimeout(() => this.checkAndInitialize(), 100);
        });
    }

    private checkAndInitialize(): void {
        const currentPath = window.location.pathname;

        if (currentPath.startsWith('/project/') || currentPath.startsWith('/play')) {
            if (!this.isInitialized) {
                this.initializeInProject();
            }
        } else {
            if (this.isInitialized) {
                this.cleanup();
            }
        }
    }

    private initializeInProject(): void {
        this.waitForEditor(() => {
            this.buttonManager.create();
            this.setupKeyboardShortcut();
            this.isInitialized = true;
        });
    }

    private cleanup(): void {
        const existingButton = document.querySelector('button[data-menubar-index="5"]');
        if (existingButton) {
            existingButton.remove();
        }

        this.configUI.destroy();

        document.removeEventListener('keydown', this.handleKeydown);

        this.isInitialized = false;
    }

    private waitForEditor(callback: () => void): void {
        const checkEditor = () => {
            if (document.querySelector('.cm-editor .cm-content')) {
                callback();
            } else {
                setTimeout(checkEditor, 100);
            }
        };
        checkEditor();
    }

    private handleButtonClick(): void {
        this.configUI.show();
    }

    private handleConfigSave(config: UserConfig): void {
        this.config = config;
        this.formatter.updateConfig(config);
        this.saveConfig();
        this.setupKeyboardShortcut();
    }

    private formatCode(): void {
        const content = this.editor.getContent();
        if (!content) {
            showNotification("Nothing to format!");
            return
        };
        try {
            const formatted = this.formatter.format(content);
            this.editor.applyDiff(content, formatted);
            showNotification("Formatted!");
        } catch (error) {
            showNotification(`Format failed! ${error}`, 2000);
        } finally {

        }
    }

    private setupKeyboardShortcut(): void {
        document.removeEventListener('keydown', this.handleKeydown);
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    private handleKeydown(event: KeyboardEvent): void {
        if (this.isShortcutMatch(event, this.config.shortcut)) {
            event.preventDefault();
            this.formatCode();
        }
    }

    private isShortcutMatch(event: KeyboardEvent, shortcut: string): boolean {
        if (!shortcut) return false;

        const keys = shortcut.split('+');
        const modifiers = keys.slice(0, -1);
        const mainKey = keys[keys.length - 1];

        const requiredModifiers = {
            ctrl: modifiers.includes('Ctrl'),
            alt: modifiers.includes('Alt'),
            shift: modifiers.includes('Shift'),
            meta: modifiers.includes('Meta')
        };

        if (event.ctrlKey !== requiredModifiers.ctrl) return false;
        if (event.altKey !== requiredModifiers.alt) return false;
        if (event.shiftKey !== requiredModifiers.shift) return false;
        if (event.metaKey !== requiredModifiers.meta) return false;

        let eventKey = event.key;

        const keyMap: { [key: string]: string } = {
            ' ': 'Space',
            'Enter': 'Enter',
            'Escape': 'Esc',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'Backspace': 'Backspace',
            'Delete': 'Delete',
            'Tab': 'Tab',
            'Insert': 'Insert',
            'Home': 'Home',
            'End': 'End',
            'PageUp': 'PageUp',
            'PageDown': 'PageDown'
        };

        if (keyMap[eventKey]) {
            eventKey = keyMap[eventKey];
        } else if (eventKey.length === 1) {
            eventKey = eventKey.toUpperCase();
        }

        return eventKey === mainKey;
    }

    private loadConfig(): UserConfig {
        const stored = localStorage.getItem('typstyle-config');
        return stored ? { ...DEFAULT_USER_CONFIG, ...JSON.parse(stored) } : DEFAULT_USER_CONFIG;
    }

    private saveConfig(): void {
        localStorage.setItem('typstyle-config', JSON.stringify(this.config));
    }
}

const plugin = new TypstylePlugin();
plugin.init();
