import { UserConfig, DEFAULT_USER_CONFIG, EditorButton } from './types';

export class ConfigUI {
  private config: UserConfig;
  private onSave: (config: UserConfig) => void;
  private modal: HTMLElement | null = null;

  constructor(config: UserConfig = DEFAULT_USER_CONFIG, onSave: (config: UserConfig) => void) {
    this.config = { ...config };
    this.onSave = onSave;
  }

  show(): void {
    if (this.modal) {
      this.modal.style.display = 'flex';
      this.modal.classList.add('show');
      return;
    }
    this.modal = this.createModal();
    document.body.appendChild(this.modal);

    requestAnimationFrame(() => {
      this.modal?.classList.add('show');
    });
  }
  private createModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'typstyle-modal';
    modal.innerHTML = `
    <div class="typstyle-modal-content">
      <div class="typstyle-modal-header">
        <h3>Typstyle Configuration</h3>
        <button class="typstyle-close" type="button">&times;</button>
      </div>
      <div class="typstyle-modal-body">
        <div class="typstyle-form-group">
          <label>Max Line Length:</label>
          <input type="number" id="maxLineLength" value="${this.config.maxLineLength}" min="40" max="200">
        </div>
        <div class="typstyle-form-group">
          <label>Indent Size:</label>
          <input type="number" id="indentSize" value="${this.config.indentSize}" min="1" max="8">
        </div>
        <div class="typstyle-form-group">
          <label>
            <input type="checkbox" id="collapseMarkupSpaces" ${this.config.collapseMarkupSpaces ? 'checked' : ''}>
            Collapse Markup Spaces
          </label>
        </div>
        <div class="typstyle-form-group">
          <label>
            <input type="checkbox" id="reorderImportItems" ${this.config.reorderImportItems ? 'checked' : ''}>
            Reorder Import Items
          </label>
        </div>
        <div class="typstyle-form-group">
          <label>
            <input type="checkbox" id="wrapText" ${this.config.wrapText ? 'checked' : ''}>
            Wrap Text
          </label>
        </div>
        <div class="typstyle-form-group">
          <label>Shortcut:</label>
          <div class="typstyle-shortcut-container">
            <input type="text" id="shortcut" value="${this.config.shortcut}" readonly placeholder="Click and press keys">
            <button type="button" class="typstyle-shortcut-clear" title="Clear shortcut">×</button>
          </div>
          <div class="typstyle-shortcut-help">Click the input field and press your desired key combination</div>
        </div>
      </div>
      <div class="typstyle-modal-footer">
        <button class="typstyle-btn typstyle-btn-primary" id="saveConfig" type="button">Save</button>
        <button class="typstyle-btn typstyle-btn-secondary" id="cancelConfig" type="button">Cancel</button>
      </div>
    </div>
  `;

    this.attachModalEvents(modal);
    this.setupShortcutInput(modal);
    return modal;
  }
  public destroy(): void {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }

  private setupShortcutInput(modal: HTMLElement): void {
    const shortcutInput = modal.querySelector('#shortcut') as HTMLInputElement;
    const clearBtn = modal.querySelector('.typstyle-shortcut-clear') as HTMLButtonElement;

    let isCapturing = false;

    shortcutInput.addEventListener('focus', () => {
      isCapturing = true;
      shortcutInput.placeholder = 'Press key combination...';
      shortcutInput.style.borderColor = '#3b82f6';
    });

    shortcutInput.addEventListener('blur', () => {
      isCapturing = false;
      shortcutInput.placeholder = 'Click and press keys';
      shortcutInput.style.borderColor = '';
    });

    shortcutInput.addEventListener('keydown', (e) => {
      if (!isCapturing) return;

      e.preventDefault();
      e.stopPropagation();

      // ignore single mod
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
        return;
      }

      const keys = [];

      // mod
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.altKey) keys.push('Alt');
      if (e.shiftKey) keys.push('Shift');
      if (e.metaKey) keys.push('Meta');

      let mainKey = e.key;

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

      if (keyMap[mainKey]) {
        mainKey = keyMap[mainKey];
      } else if (mainKey.length === 1) {
        mainKey = mainKey.toUpperCase();
      }

      keys.push(mainKey);

      const shortcut = keys.join('+');
      shortcutInput.value = shortcut;
    });

    clearBtn.addEventListener('click', () => {
      shortcutInput.value = '';
      shortcutInput.focus();
    });

    shortcutInput.addEventListener('input', (e) => {
      if (!isCapturing) {
        e.preventDefault();
        return false;
      }
    });
  }

  private attachModalEvents(modal: HTMLElement): void {
    const closeBtn = modal.querySelector('.typstyle-close') as HTMLElement;
    const saveBtn = modal.querySelector('#saveConfig') as HTMLElement;
    const cancelBtn = modal.querySelector('#cancelConfig') as HTMLElement;
    const close = () => {
      modal.style.display = 'none';
      modal.classList.remove('show');
    };
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    // bkg
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    // esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display !== 'none') {
        close();
      }
    });
    saveBtn.addEventListener('click', () => {
      this.saveConfig();
      close();
    });
  }
  private saveConfig(): void {
    const getById = (id: string) => document.getElementById(id) as HTMLInputElement;

    const newConfig: UserConfig = {
      maxLineLength: parseInt(getById('maxLineLength').value),
      indentSize: parseInt(getById('indentSize').value),
      collapseMarkupSpaces: getById('collapseMarkupSpaces').checked,
      reorderImportItems: getById('reorderImportItems').checked,
      wrapText: getById('wrapText').checked,
      shortcut: getById('shortcut').value
    };

    this.config = newConfig;
    this.onSave(newConfig);
  }
}

export class ButtonManager {
  private onClick: () => void;
  private createdButton: EditorButton | null = null;

  constructor(onClick: () => void) {
    this.onClick = onClick;
  }

  create(): EditorButton | null {
    this.cleanupExistingButtons();

    const helpButton = document.querySelector('button[data-menubar-index="4"]');
    let targetContainer: HTMLElement | null = null;

    if (helpButton?.parentElement) {
      targetContainer = helpButton.parentElement.parentElement;
    } else {
      const header = document.querySelector('header');
      if (header) {
        targetContainer = header.querySelector('div');
      }
    }

    if (!targetContainer) {
      console.warn('Could not find suitable container for Typstyle button');
      return null;
    }

    const buttonContainer = document.createElement('div');
    const button = document.createElement('button') as EditorButton;

    button.textContent = 'Typstyle';
    button.setAttribute('data-menubar-index', '5');
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.className = '_button_1iawa_1 _secondary_1iawa_69 _compact_1iawa_48';
    button._typstyleButton = true;

    button.addEventListener('click', this.onClick);

    buttonContainer.appendChild(button);
    targetContainer.appendChild(buttonContainer);

    this.createdButton = button;
    return button;
  }

  private cleanupExistingButtons(): void {
    if (this.createdButton) {
      this.destroy();
    }

    const helpButton = document.querySelector('button[data-menubar-index="4"]');
    let targetContainer: HTMLElement | null = null;

    if (helpButton?.parentElement) {
      targetContainer = helpButton.parentElement.parentElement;
    } else {
      const header = document.querySelector('header');
      if (header) {
        targetContainer = header.querySelector('div');
      }
    }

    if (targetContainer) {
      const existingButtons = targetContainer.querySelectorAll('button[data-menubar-index="5"]');
      existingButtons.forEach(button => {
        const editorButton = button as EditorButton;
        if (editorButton._typstyleButton) {
          button.parentElement?.remove();
        }
      });
    }
  }

  destroy(): void {
    if (this.createdButton) {
      this.createdButton.parentElement?.remove();
      this.createdButton = null;
    }
  }
}
