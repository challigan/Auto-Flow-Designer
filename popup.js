document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
  
    // Load current toggle state from storage
    chrome.storage.local.get('extensionEnabled', (data) => {
      const enabled = data.extensionEnabled !== false; // Default is true
      updateButtonState(enabled);
    });
  
    // Handle button click
    toggleButton.addEventListener('click', () => {
      chrome.storage.local.get('extensionEnabled', (data) => {
        const enabled = data.extensionEnabled !== false;
        const newEnabled = !enabled;
  
        // Store the new state
        chrome.storage.local.set({ extensionEnabled: newEnabled }, () => {
          updateButtonState(newEnabled);
  
          // Send message to background to apply/remove the rules
          chrome.runtime.sendMessage({ action: newEnabled ? 'enable' : 'disable' });
        });
      });
    });
  
    function updateButtonState(enabled) {
      toggleButton.textContent = enabled ? 'Turn Off' : 'Turn On';
    }
  });
  