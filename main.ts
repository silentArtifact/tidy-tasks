import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface TidyTasksSettings {
    removeCompleted: boolean;
}

const DEFAULT_SETTINGS: TidyTasksSettings = {
    removeCompleted: true
}

export default class TidyTasksPlugin extends Plugin {
    settings: TidyTasksSettings;

    async tidyCompletedTasks() {
        if (!this.settings.removeCompleted) {
            new Notice('Tidy Tasks is disabled in settings');
            return;
        }

        const files = this.app.vault.getMarkdownFiles();
        let removed = 0;

        for (const file of files) {
            const content = await this.app.vault.read(file);
            const newline = content.includes('\r\n') ? '\r\n' : '\n';
            const lines = content.split(/\r?\n/);
            const newLines: string[] = [];

            for (const line of lines) {
                if (/^- \[[xX]\] .*(🔁|every)/.test(line)) {
                    removed++;
                    continue;
                }
                newLines.push(line);
            }

            if (newLines.length !== lines.length) {
                await this.app.vault.modify(file, newLines.join(newline));
            }
        }

        new Notice(`Removed ${removed} completed repeating task${removed === 1 ? '' : 's'}.`);
    }

    async onload() {
        await this.loadSettings();

        const ribbonIconEl = this.addRibbonIcon('checkmark', 'Tidy Tasks', (evt: MouseEvent) => {
            this.tidyCompletedTasks();
        });
        ribbonIconEl.addClass('tidy-tasks-ribbon');

        this.addCommand({
            id: 'tidy-completed-tasks',
            name: 'Tidy Completed Tasks',
            callback: () => this.tidyCompletedTasks()
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
