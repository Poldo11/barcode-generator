import { type Remetente } from '../constants';
import { getSettings, saveSettings } from '../actions/settings.actions';

const SETTINGS_KEY = 'correios_settings';

interface Settings {
  remetente: Remetente;
}

export class SettingsService {
  static getSettings(): Settings | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing settings:', error);
      return null;
    }
  }

  static saveSettings(settings: Settings): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static async getRemetente(): Promise<Remetente | null> {
    const settings = await getSettings();
    return settings?.metadata?.remetente || null;
  }

  static async saveRemetente(remetente: Remetente): Promise<void> {
    await saveSettings({
      remetente,
      path: '/settings',
    });
  }
} 