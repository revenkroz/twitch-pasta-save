import storage from '~/storage';
import { getDataFromForm, sendMessage } from '~/utils';

// TODO: check frameworks performance to replace a great part of this file
class TwitchPastaSaver {
  constructor() {
    this.addCommandButton = document.querySelector('#add-command');
    this.buttonsContainer = document.querySelector('#commands');
  }

  async init() {
    await this.setListeners();
    await this.drawButtons();
  }

  async drawButtons() {
    this.buttonsContainer.querySelectorAll('.commands__item').forEach((el) => {
      if (el !== this.addCommandButton) {
        el.remove();
      }
    });

    const commands = await storage.getCommands();
    commands.forEach((command) => {
      const item = document.createElement('div');
      item.classList.add('commands__item');
      item.setAttribute('title', command.content.substring(0, 32) + '...');
      const button = document.createElement('div');
      button.classList.add('btn', 'p-d');
      button.innerHTML = command.name;
      button.setAttribute('data-id', command.id);
      button.addEventListener('click', (e) => {
        e.preventDefault();

        sendMessage(command);
      });
      button.addEventListener('contextmenu', async (e) => {
        e.preventDefault();

        await storage.removeCommand(command);
        await this.drawButtons();
      });

      item.append(button);
      this.buttonsContainer.insertBefore(item, this.addCommandButton);
    });
  }

  async setListeners() {
    const addCommandBlock = document.querySelector('#add-command-form');
    this.addCommandButton.addEventListener('click', (e) => {
      e.preventDefault();

      addCommandBlock.classList.toggle('hidden');
    });

    const addCommandForm = addCommandBlock.querySelector('form');
    addCommandForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = getDataFromForm(addCommandForm);
      await storage.addCommand('send', data.name, data.content);
      await this.drawButtons();

      addCommandForm.childNodes.forEach((el) => {
        if (!(el instanceof Element)) {
          return;
        }

        const tag = el.tagName.toLowerCase();
        if (tag === 'input' && el.type === 'text') {
          el.value = '';
        } else if (tag === 'textarea') {
          el.innerHTML = '';
          el.value = '';
        }
      })
    })
  }
}

browser.tabs.executeScript({file: "/browser-polyfill.js"}).then(() => {
  browser.tabs.executeScript({file: "/content/content.js"})
    .then(async () => {
      await (new TwitchPastaSaver()).init();
    })
    .catch((error) => {
      console.error(`Failed to execute content script: ${error.message}`)
    });
})
