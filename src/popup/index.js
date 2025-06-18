import browser from 'webextension-polyfill';

// Execute when the popup HTML has been loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup script loaded');
  
  // Initialize UI elements
  const dataList = document.getElementById('data-list');
  const clearDataButton = document.getElementById('clear-data');
  const scanButton = document.getElementById('scan-button');
  const settingsForm = document.getElementById('settings-form');
  const enabledToggle = document.getElementById('enabled-toggle');
  
  // Fetch data from the background script
  function loadData() {
    browser.runtime.sendMessage({ type: 'GET_DATA' })
      .then(response => {
        console.log('Received data response:', response);
        
        // Update the popup UI with the data
        if (dataList && response && response.data) {
          // Clear previous items
          while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild);
          }
          
          if (response.data.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'empty-message';
            emptyItem.textContent = 'No data collected yet';
            dataList.appendChild(emptyItem);
          } else {
            response.data.forEach((item, index) => {
              const listItem = document.createElement('li');
              listItem.innerHTML = `
                <strong>${item.title || 'Unknown'}</strong>
                <span class="item-url">${item.url || 'No URL'}</span>
                <span class="item-timestamp">${new Date(item.timestamp).toLocaleString()}</span>
              `;
              dataList.appendChild(listItem);
            });
          }
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
  // Load settings
  function loadSettings() {
    browser.storage.local.get('settings')
      .then(result => {
        if (result.settings && enabledToggle) {
          enabledToggle.checked = result.settings.enabled;
        }
      })
      .catch(error => {
        console.error('Error loading settings:', error);
      });
  }
  
  // Initialize popup
  loadData();
  loadSettings();
  
  // Set up event listeners
  if (clearDataButton) {
    clearDataButton.addEventListener('click', () => {
      browser.storage.local.set({ data: [] });
      browser.runtime.sendMessage({ 
        type: 'SAVE_DATA',
        data: null,
        clear: true 
      }).then(() => {
        loadData();
      });
    });
  }
  
  if (scanButton) {
    scanButton.addEventListener('click', () => {
      browser.tabs.query({ active: true, currentWindow: true })
        .then(tabs => {
          if (tabs[0]) {
            return browser.tabs.sendMessage(tabs[0].id, { type: 'SCAN_PAGE' });
          }
        })
        .then(response => {
          if (response && response.success) {
            loadData(); // Refresh the data list
          }
        })
        .catch(error => {
          console.error('Error scanning page:', error);
        });
    });
  }
  
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const settings = {
        enabled: enabledToggle ? enabledToggle.checked : true
      };
      
      browser.runtime.sendMessage({
        type: 'UPDATE_SETTINGS',
        settings: settings
      }).then(response => {
        console.log('Settings updated:', response);
      }).catch(error => {
        console.error('Error updating settings:', error);
      });
    });
  }
}); 