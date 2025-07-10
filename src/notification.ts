export class NotificationManager {
    private static instance: NotificationManager;
    private wrapper: HTMLElement | null = null;
    private notifications: HTMLElement[] = [];

    private constructor() {
        this.initWrapper();
    }

    public static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }

    private initWrapper(): void {
        const appRoot = document.getElementById('app-root');
        if (appRoot) {
            const children = appRoot.children;
            this.wrapper = children[children.length - 1] as HTMLElement;
        }

        if (!this.wrapper) {
            console.warn('Could not find toast wrapper in #app-root');
            return;
        }
    }

    public show(message: string, duration: number = 1000): void {
        if (!this.wrapper) {
            this.initWrapper();
        }

        if (!this.wrapper) {
            console.warn('Toast wrapper not available');
            return;
        }

        const toast = document.createElement('div');
        toast.className = this.getToastClassName();
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-label', message);
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;

        toast.style.transform = 'translateY(200%)';
        toast.style.transitionDelay = '0ms';

        this.wrapper.appendChild(toast);
        this.notifications.push(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0px)';
            toast.style.transitionDelay = '200ms';
        });

        if (duration > 0) {
            setTimeout(() => {
                this.hideToast(toast);
            }, duration);
        }
    }

    private getToastClassName(): string {
        const existingToast = this.wrapper?.querySelector('[role="status"]');
        if (existingToast) {
            return existingToast.className;
        }

        const stylesheets = Array.from(document.styleSheets);
        for (const stylesheet of stylesheets) {
            try {
                const rules = Array.from(stylesheet.cssRules || []);
                for (const rule of rules) {
                    if (rule instanceof CSSStyleRule) {
                        const selector = rule.selectorText;
                        if (selector && selector.includes('toast') && selector.includes('_')) {
                            const match = selector.match(/\._toast_[a-zA-Z0-9_]+/);
                            if (match) {
                                return match[0].substring(1);
                            }
                        }
                    }
                }
            } catch (e) {
                continue;
            }
        }

        // fallback
        return '_toast_1gidb_33';
    }

    private hideToast(toast: HTMLElement): void {
        if (!toast.parentNode) return;

        toast.style.transform = 'translateY(200%)';
        toast.style.transitionDelay = '0ms';

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
                const index = this.notifications.indexOf(toast);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }
        }, 300);
    }
}

export const showNotification = (message: string, duration?: number) => {
    NotificationManager.getInstance().show(message, duration);
};
