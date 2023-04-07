function renderSnippets(snippets) {
    const container = document.getElementById('snippets-container');
    container.innerHTML = '';
  
    snippets.forEach((snippet, index) => {
      const div = document.createElement('div');
      div.innerText = snippet;
  
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.onclick = () => {
        snippets.splice(index, 1);
        chrome.storage.sync.set({ snippets }, () => {
          renderSnippets(snippets);
        });
      };
      div.appendChild(deleteButton);
      container.appendChild(div);
    });
  }
  
  document.getElementById('snippet-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('snippet-input');
    const snippet = input.value.trim();
  
    if (snippet) {
      chrome.storage.sync.get('snippets', ({ snippets }) => {
        snippets.push(snippet);
        chrome.storage.sync.set({ snippets }, () => {
          renderSnippets(snippets);
          input.value = '';
        });
      });
    }
  });
  
  chrome.storage.sync.get('snippets', ({ snippets }) => {
    renderSnippets(snippets || []);
  });
  