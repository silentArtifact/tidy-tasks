# Tidy Tasks

This plugin works alongside the [Tasks plugin](https://github.com/obsidian-tasks-group/obsidian-tasks) to keep your task lists clean. It removes completed repeating tasks after they have been recreated by the Tasks plugin.

## Development

This project follows the structure of the [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin). To get started:

1. Install NodeJS (v16 or newer).
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to build the plugin in watch mode.
4. Copy `main.js`, `styles.css` and `manifest.json` into your vault's `.obsidian/plugins/tidy-tasks/` folder.
5. Enable the plugin in Obsidian.

## Building for release

Use `npm run build` to create a production build. Bump the version with `npm version patch` (or `minor`/`major`) to update `manifest.json` and `versions.json`.
