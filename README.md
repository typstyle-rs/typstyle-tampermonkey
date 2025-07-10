# typstyle-tampermonkey

A userscript that adds [typstyle](https://github.com/typstyle-rs/typstyle) formatter to [typst.app](https://typst.app).

## Installation

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/)
2. Go to [Greasy Fork](https://greasyfork.org/en/scripts/542164-typstyle-tampermonkey) to install the script
3. Visit [typst.app](https://typst.app) and start formatting!

## Usage

1. Open any project on typst.app
2. Click the **Typstyle** button in the top menu bar to configure settings
3. Use `Ctrl + Alt + F`(by default) in the editor to format your code

## Build

1. Build typstyle WASM module with `build:wasm` of [typstyle-playground](https://github.com/typstyle-rs/typstyle/blob/a634ae3952c2509981cc04c0c454be7fae00fb8c/playground/package.json#L27).

2. Copy the built `typstyle-wasm` folder to this project and build

   ```bash
   bun i
   bun run build
   ```

## License

This project is licensed under [MPL 2.0](LICENSE).

Uses [typstyle](https://github.com/typstyle-rs/typstyle) which is licensed under [Apache 2.0](https://github.com/typstyle-rs/typstyle/blob/main/LICENSE).
