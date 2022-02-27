import React from 'react';
import { render } from 'react-dom';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../interface';
import Content from './Content';

import css from '!!css-loader!sass-loader!./index.scss';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

let init: Boolean;

const onMessageListener = async (packet: IBrowserMessage, sender: any) => {
  switch (packet.action) {
    case 'saveText':
      toggleSelectionTool();
      return;
    case 'saveImage':
      console.log(packet.imageSrc!);
      return;
  }
};

let toggleSelectionTool = () => {
  if (init) {
    let event = new Event('onExtensionAction');
    window.dispatchEvent(event);
    return;
  }

  let shadowHost = document.createElement('section');
  document.body.appendChild(shadowHost);

  let shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

  let style = document.createElement('style');
  style.innerHTML = css.toString();
  shadowRoot.appendChild(style);

  let contentDiv = document.createElement('div');
  contentDiv.id = 'webextension_content';
  shadowRoot.appendChild(contentDiv);

  var reactElement = React.createElement(Content);

  render(reactElement, contentDiv);

  init = true;
};

Browser.runtime.onMessage.addListener(onMessageListener);
