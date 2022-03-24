import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { IOrdering, ISetting, IStorage, IViewingOption } from '../interface';

class Setting {
  static init() {
    const defaultSetting: ISetting = {
      collectionsOrdering: {
        type: 0,
        descending: false,
      },
      quickSearch: false,
      darkMode: false,
      viewingOption: {
        hiddenColumns: [],
        spacing: 'normal',
        imageGrid: 3,
      },
    };
    return defaultSetting;
  }

  static async fetch(): Promise<ISetting> {
    //Default Data for Setting
    let setting: ISetting = this.init();

    try {
      //It returns {setting}, so IStorage is better choice, not ISetting
      let localStorage = (await Browser.storage.local.get(
        'setting'
      )) as IStorage;

      if (localStorage.setting != null) {
        setting = localStorage.setting;
      }
    } catch (e) {
      console.error(e);
    }
    return setting;
  }

  static async fetchOrdering(): Promise<IOrdering> {
    let setting = await this.fetch();
    return setting.collectionsOrdering;
  }

  static async fetchDarkMode(): Promise<boolean> {
    let setting = await this.fetch();
    return setting.darkMode;
  }

  static async fetchViewingOption(): Promise<IViewingOption> {
    let setting = await this.fetch();
    return setting.viewingOption;
  }

  static async update(_setting: ISetting): Promise<boolean> {
    const setting = _setting;
    try {
      await Browser.storage.local.set({ setting });
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateOrdering(_ordering: IOrdering): Promise<boolean> {
    try {
      let setting = await this.fetch();
      setting.collectionsOrdering = _ordering;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateDarkMode(_darkMode: boolean): Promise<boolean> {
    try {
      let setting = await this.fetch();
      setting.darkMode = _darkMode;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }
}

export default Setting;
