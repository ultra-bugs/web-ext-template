import browser from 'webextension-polyfill';

// Unified browser API (works in both Chrome and Firefox)
console.log('Background script loaded');

// Store data for the extension
const state = {
  data: [],
  settings: {
    enabled: true
  }
};

// Listen for messages from content scripts or popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message, 'from:', sender);
  
  // Example message handler
  if (message.type === 'GET_DATA') {
    sendResponse({ data: state.data });
  } 
  else if (message.type === 'SAVE_DATA') {
    if (message.data) {
      state.data.push(message.data);
      // Optionally persist to browser storage
      browser.storage.local.set({ data: state.data });
      sendResponse({ success: true, data: state.data });
    } else {
      sendResponse({ success: false, error: 'No data provided' });
    }
  }
  else if (message.type === 'UPDATE_SETTINGS') {
    state.settings = { ...state.settings, ...message.settings };
    // Persist settings to storage
    browser.storage.local.set({ settings: state.settings });
    sendResponse({ success: true, settings: state.settings });
  }
  else {
    sendResponse({ error: 'Unknown message type' });
  }
  
  // Note: In MV3 for Chromium, you need to return true to use sendResponse asynchronously
  return true;
});

// Initialize state from storage
browser.storage.local.get(['data', 'settings'])
  .then((result) => {
    if (result.data) state.data = result.data;
    if (result.settings) state.settings = { ...state.settings, ...result.settings };
    console.log('State initialized from storage:', state);
  })
  .catch((error) => {
    console.error('Error initializing state from storage:', error);
  });

// Example: Intercept web requests
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Intercept SMS-related requests here
    if (details.url.includes('sms') || details.url.includes('text')) {
      console.log('Intercepted SMS-related request:', details);
    }
    return { cancel: false };
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
