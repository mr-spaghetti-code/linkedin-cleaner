// Default settings
let settings = {
  highlight: true,
  hide: false
};

// Load saved settings
chrome.storage.sync.get(['highlight', 'hide'], function(result) {
  settings.highlight = result.highlight !== undefined ? result.highlight : true;
  settings.hide = result.hide || false;
  processPage();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateSettings') {
    settings.highlight = request.highlight;
    settings.hide = request.hide;
    processPage();
  }
});

// Process the page when settings change or when new content loads
function processPage() {
  // Find all posts on the page
  // The exact selector will depend on LinkedIn's structure
  // This is a generic approach that would need to be refined
  const posts = document.querySelectorAll('div.feed-shared-update-v2, div.occludable-update');
  
  posts.forEach(post => {
    // Get the text content of the post
    const postText = post.textContent || '';
    
    // Check if the post contains an em-dash
    if (postText.includes('—')) {
      // Clear previous classes
      post.classList.remove('emdash-highlight', 'emdash-hide');
      
      // Apply highlight if enabled
      if (settings.highlight) {
        post.classList.add('emdash-highlight');
      }
      
      // Hide if enabled
      if (settings.hide) {
        post.classList.add('emdash-hide');
      }
    }
  });
}

// Process the page initially
processPage();

// Set up a MutationObserver to handle dynamically loaded content
const observer = new MutationObserver(function(mutations) {
  let hasNewNodes = false;
  
  mutations.forEach(mutation => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      hasNewNodes = true;
    }
  });
  
  if (hasNewNodes) {
    processPage();
  }
});

// Start observing the document body for added nodes
observer.observe(document.body, {
  childList: true,
  subtree: true
});