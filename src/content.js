import browser from 'webextension-polyfill';

// Content script runs in the context of web pages
console.log('Content Script loaded');

// Example function to extract data from the page
function extractPageData() {
  // Replace with your own data extraction logic
  const data = {
    title: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  return data;
}

// Example function to modify the page
function modifyPage() {
  // This is just an example - replace with your own page modification logic
  const infoElement = document.createElement('div');
  infoElement.id = 'extension-info';
  infoElement.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 12px;
    z-index: 9999;
    opacity: 0.9;
    display: none;
  `;
  infoElement.textContent = 'Web Extension Active';
  document.body.appendChild(infoElement);
  
  // Check if extension should be enabled
  browser.storage.local.get('settings')
    .then(result => {
      if (result.settings && result.settings.enabled) {
        infoElement.style.display = 'block';
        setTimeout(() => {
          infoElement.style.opacity = '0';
          setTimeout(() => {
            infoElement.remove();
          }, 1000);
        }, 3000);
      }
    });
}

// Function to handle initialization
function initialize() {
  try {
    // Extract data
    const pageData = extractPageData();
    
    // Send data to background script
    browser.runtime.sendMessage({
      type: 'SAVE_DATA',
      data: pageData
    }).then(response => {
      console.log('Background script response:', response);
      
      // If successful, modify page
      if (response && response.success) {
        modifyPage();
      }
    }).catch(error => {
      console.error('Error communicating with background script:', error);
    });
    
  } catch (error) {
    console.error('Error in content script:', error);
  }
}

// Run when the page has loaded
if (document.readyState === 'complete') {
  initialize();
} else {
  window.addEventListener('load', initialize);
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message from background:', message);
  
  // Handle messages from background script
  if (message.type === 'SCAN_PAGE') {
    const pageData = extractPageData();
    sendResponse({ success: true, data: pageData });
  } else {
    sendResponse({ success: false, error: 'Unknown message type' });
  }
  
  // Return true for asynchronous response
  return true;
});
