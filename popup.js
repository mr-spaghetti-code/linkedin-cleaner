document.addEventListener('DOMContentLoaded', function() {
  const highlightToggle = document.getElementById('highlight-toggle');
  const hideToggle = document.getElementById('hide-toggle');

  // Load saved settings
  chrome.storage.sync.get(['highlight', 'hide'], function(result) {
    highlightToggle.checked = result.highlight !== undefined ? result.highlight : true;
    hideToggle.checked = result.hide || false;
  });

  // Save settings when toggles change
  highlightToggle.addEventListener('change', function() {
    chrome.storage.sync.set({highlight: this.checked});
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSettings',
        highlight: highlightToggle.checked,
        hide: hideToggle.checked
      });
    });
  });

  hideToggle.addEventListener('change', function() {
    chrome.storage.sync.set({hide: this.checked});
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSettings',
        highlight: highlightToggle.checked,
        hide: hideToggle.checked
      });
    });
  });

});