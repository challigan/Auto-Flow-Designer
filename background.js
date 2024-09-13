chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get('extensionEnabled', (data) => {
      const enabled = data.extensionEnabled !== false; // Default is true
      if (enabled) {
        addRedirectionRule();
      }
    });
  });
  
  // Listen for messages from popup.js to enable/disable the rules
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'enable') {
      addRedirectionRule();
    } else if (message.action === 'disable') {
      removeRedirectionRule();
    }
  });
  
  // Function to add the redirection rule
  function addRedirectionRule() {
    // First, remove the rule if it exists to prevent conflicts
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1], // Remove rule with ID 1 if it exists
      addRules: [
        {
          "id": 1,
          "priority": 1,
          "action": {
            "type": "redirect",
            "redirect": {
              "regexSubstitution": "https://make.powerautomate.com/\\1?v3=false"
            }
          },
          "condition": {
            "regexFilter": "^https://make\\.powerautomate\\.com/(.*)\\?v3=true$",
            "resourceTypes": ["main_frame"]
          }
        }
      ]
    });
  }
  
  // Function to remove the redirection rule
  function removeRedirectionRule() {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1] // Remove rule with ID 1
    });
  }
  