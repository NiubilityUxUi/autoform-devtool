window.addEventListener('message', e => {
  if (e.source === window && (['init', 'autoform_update_model', 'autoform_update_fields'].indexOf(e.data.type) >= 0)) {
    chrome.runtime.sendMessage(e.data)
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  window.postMessage({
    type: 'devtool-data-update',
    data: request.data,
  }, '*');
});

// 注入hook，变量标识
function installHook(win) {
  Object.defineProperty(win, '__AUTOFORM_DEVTOOLS_GLOBAL_HOOK__', {
    get() {
      return 'AUTOFORM_INIT'
    },
    set(val) {}
  })
}

if (document instanceof HTMLDocument) {
  const script = document.createElement('script')
  script.textContent = ';(' + installHook.toString() + ')(window)'
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}