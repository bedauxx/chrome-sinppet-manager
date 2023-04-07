function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      const message = document.createElement('small');
      message.innerText = 'Copied to clipboard!';
      document.body.appendChild(message);
      setTimeout(() => {
        message.remove();
      }, 2000);
    });
  }
  
  chrome.storage.sync.get('snippets', ({ snippets }) => {
    const container = document.getElementById('snippets-container');
    snippets = snippets || [];
  
    snippets.forEach(snippet => {
      const button = document.createElement('button');
      button.innerText = snippet;
      button.onclick = () => copyToClipboard(snippet);
      container.appendChild(button);
    });
  });