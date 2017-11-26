import initJsonEditor from './jsonEditorInit';



chrome.devtools.panels.create(
  'AutoForm',
  'icons/128.png',
  'devtools.html',
  function (panel) {
    // panel load
  }
);

var port = chrome.runtime.connect({
  name: 'container'
});

port.postMessage({
  name: 'container-init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

port.onMessage.addListener(function (request) {
  initJsonEditor(request, port);
});