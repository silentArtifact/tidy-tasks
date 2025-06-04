import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface TidyTasksSettings {
    removeCompleted: boolean;
}

const DEFAULT_SETTINGS: TidyTasksSettings = {
    removeCompleted: true
}

export default class TidyTasksPlugin extends Plugin {
    settings: TidyTasksSettings;

    async onload() {
        await this.loadSettings();

        const ribbonIconEl = this.addRibbonIcon('checkmark', 'Tidy Tasks', (evt: MouseEvent) => {
            new Notice('Tidy Tasks active');
        });
        ribbonIconEl.addClass('tidy-tasks-ribbon');

        this.addCommand({
            id: 'tidy-completed-tasks',
            name: 'Tidy Completed Tasks',
            callback: () => {
                new Notice('Would tidy completed tasks');
            }
        });

        this.addSettingTab(new TidyTasksSettingTab(this.app, this));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class TidyTasksSettingTab extends PluginSettingTab {
    plugin: TidyTasksPlugin;

    constructor(app: App, plugin: TidyTasksPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Remove completed tasks')
            .setDesc('Automatically delete tasks that have been completed and recreated by the Tasks plugin.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.removeCompleted)
                .onChange(async (value) => {
                    this.plugin.settings.removeCompleted = value;
                    await this.plugin.saveSettings();
                }));
    }
}
