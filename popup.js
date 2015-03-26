(function() {

    var loadUrls = function() {
        chrome.tabs.getSelected(function(tab) {
            var lists = localStorage['lists'] ? JSON.parse(localStorage['lists']) : {};
            var tabUrl = tab.url;
            var domain = tabUrl.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];

            var allUrls = lists[domain];
            var urlListing = document.querySelector('.list-urls');
            for (var url in allUrls) {
                var a = document.createElement('a');
                a.href = url;
                a.innerHTML = url;

                urlListing.appendChild(a);
            }
        });
    };

    var saveTab = function() {
        chrome.tabs.getSelected(function(tab) {
            var lists = localStorage['lists'] ? JSON.parse(localStorage['lists']) : {};
            var url = tab.url;
            var domain = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];

            var domainList = lists[domain] || {};
            domainList[url] = true;

            lists[domain] = domainList;
            localStorage['lists'] = JSON.stringify(lists);
            loadLists();
        });
    };

    var saveBtn = document.querySelector('.save-url');

    saveBtn.onclick = function(e) {
        saveTab();
    };

    loadUrls();
})();