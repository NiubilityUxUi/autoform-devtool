var connections = {};
var cache = {};

chrome.runtime.onConnect.addListener(function (port) {
  var extensionListener = function (message, sender, sendResponse) {
    if (message.name == 'container-init') {
      var tabId = message.tabId;
      connections[tabId] = port;
      if (cache[tabId] && cache[tabId].length) {
        for (var i = 0; i < cache[tabId].length; i++) {
          var req = cache[tabId][i];
          port.postMessage(req);
        }
      }
      return;
    }


    if (message.type == 'devtool-data-update') {
      console.log('update', message.data);
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          data: message.data
        });
      });
      return;
    }
  }
  port.onMessage.addListener(extensionListener);


  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener);
    var tabs = Object.keys(connections);
    for (var i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]]
        break;
      }
    }
  });
});

// // Receive message from content script and relay to the devTools page for the
// // current tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Messages from content scripts should have sender.tab set
  chrome.browserAction.setIcon({
    tabId: sender.tab.id,
    path: {
      16: 'icons/16.png',
      48: 'icons/48.png',
      128: 'icons/128.png'
    }
  });

  chrome.browserAction.setPopup({
    tabId: sender.tab.id,
    popup: ['init', 'autoform_update_model', 'autoform_update_fields'].indexOf(request.type) >= 0 ? 'popups/enabled.html' : 'popups/disabled.html'
  });



  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      cache[tabId] = cache[tabId] || [];
      cache[tabId].push(request);
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }

  return true;
});