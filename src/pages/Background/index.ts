import { Storage } from '../../common/storage';
import Browser from 'webextension-polyfill';

import { IBrowserMessage } from '../../common/interface';

const onInstalledListener = async () => {
  //fired whem first installed, updated to a new version, and the browser updated to a new version
  console.log('onInstalledListener');
  await Storage.onInstallCheck();
  createContextMenus();
};

const onMessageListener = async (packet: IBrowserMessage, sender: any) => {
  console.log('onMessageListener');

  switch (packet.action) {
    case 'saveToCollection':
      // saveCurrentTabToCollection(packet.data!.collectionId);
      return;
  }
};

const onStartupListener = async () => {
  console.log('onStartupListener');
};

const onContextMenusCreated = async () => {
  console.log('onContextMenusCreated');
};

let onContextMenusClicked = async (
  info: Browser.Menus.OnClickData,
  tab?: Browser.Tabs.Tab
) => {
  console.log(info);

  var tabId: number = tab!.id!;

  //Text
  if (typeof info.selectionText != 'undefined') {
    var message: IBrowserMessage = {
      action: 'saveText',
    };

    Browser.tabs.sendMessage(tabId, message);
    return;
  }

  //Image
  if (info.mediaType == 'image') {
    var message: IBrowserMessage = {
      action: 'saveImage',
      imageSrc: info.srcUrl!,
    };

    Browser.tabs.sendMessage(tabId, message);
    return;
  }

  //Bookmark
  var message: IBrowserMessage = {
    action: 'saveBookmark',
  };

  Browser.tabs.sendMessage(tabId, message);
};

let createContextMenus = () => {
  Browser.contextMenus.create(
    {
      id: 'save-text',
      title: 'Save Hightlighted Text',
      type: 'normal',
      contexts: ['selection'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    },
    onContextMenusCreated
  );

  Browser.contextMenus.create(
    {
      id: 'save-image',
      title: 'Save Image',
      type: 'normal',
      contexts: ['image'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    },
    onContextMenusCreated
  );

  Browser.contextMenus.create(
    {
      id: 'save-bookmark',
      title: 'Save as Bookmark',
      type: 'normal',
      contexts: ['page'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    },
    onContextMenusCreated
  );
};

Browser.runtime.onInstalled.addListener(onInstalledListener);
Browser.runtime.onStartup.addListener(onStartupListener);
Browser.runtime.onMessage.addListener(onMessageListener);
Browser.contextMenus.onClicked.addListener(onContextMenusClicked);
