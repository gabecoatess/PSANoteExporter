// background.js

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        if (tab.url.match(/^https:\/\/(.*\.)?example\.com\/desk\/(mytickets|tickets)\/.*/)) {
            chrome.tabs.sendMessage(tabId, {
                message: 'urlChanged',
                url: changeInfo.url
            });
        }
    }
});
