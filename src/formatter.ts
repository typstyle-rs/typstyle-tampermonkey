import { FormatConfig, DEFAULT_CONFIG } from './types';
import * as typstyle from "typstyle-wasm";

export class TypstyleFormatter {
  private config: FormatConfig;

  constructor(config: FormatConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  public format(code: string): string {
    const config = {
      max_width: this.config.maxLineLength,
      tab_spaces: this.config.indentSize,
      blank_lines_upper_bound: 2,
      collapse_markup_spaces: this.config.collapseMarkupSpaces,
      reorder_import_items: this.config.reorderImportItems,
      wrap_text: this.config.wrapText,
    };

    try {
      return typstyle.format(code, config);
    } catch (error) {
      throw error
    }
  }

  public updateConfig(newConfig: Partial<FormatConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
