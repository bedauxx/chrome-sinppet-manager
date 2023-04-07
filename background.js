async function copyToClipboard(text) {
  const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    func: (snippet) => {
      const copyText = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
          console.log('Copied to clipboard:', textToCopy);
          pasteText();
        });
      };

      const pasteText = () => {
        document.execCommand('paste');
      };

      copyText(snippet);
    },
    args: [text],
  });
}

function createContextMenu(snippets) {
  chrome.contextMenus.removeAll(() => {
    snippets.forEach((snippet, index) => {
      chrome.contextMenus.create({
        id: `snippet-${index}`,
        title: snippet,
        contexts: ['editable'],
      });
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ snippets: [] });
});

chrome.storage.sync.get('snippets', ({ snippets }) => {
  createContextMenu(snippets);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const snippetIndex = parseInt(info.menuItemId.split('-')[1]);
  chrome.storage.sync.get('snippets', ({ snippets }) => {
    const snippet = snippets[snippetIndex];
    copyToClipboard(snippet);
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.snippets) {
    createContextMenu(changes.snippets.newValue);
  }
});
