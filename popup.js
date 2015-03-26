(function() {

    var loadUrls = function() {
        chrome.tabs.getSelected(function(tab) {
            var lists = localStorage['lists'] ? JSON.parse(localStorage['lists']) : {};
            var tabUrl = tab.url;
            var domain = tabUrl.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];

            var allUrls = lists[domain];
            var urlListing = document.querySelector('.list-urls');
            urlListing.innerHTML = "";
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
            loadUrls();
        });
    };

    var saveBtn     = document.querySelector('.save-url');
    var downloadBtn = document.querySelector('.download');
    var clearBtn    = document.querySelector('.clear');

    saveBtn.onclick = function(e) {
        saveTab();
    };

    downloadBtn.onclick = function(e) {

        chrome.tabs.getSelected(function(tab) {
            var lists = localStorage['lists'] ? JSON.parse(localStorage['lists']) : {};
            var tabUrl = tab.url;
            var domain = tabUrl.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];

            var allUrls = [];

            for (var url in lists[domain]) {
                allUrls.push(url + "\n");
            }

            var blob = new Blob(allUrls, {type: 'text/plain'});
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = domain.replace(/\./g, '_') + '_urls'; // set the file name
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click(); //this is probably the key - simulatating a click on a download link
            delete a;// we don't need this anymore
        });


    };

    clearBtn.onclick = function() {
        chrome.tabs.getSelected(function(tab) {
            var lists = localStorage['lists'] ? JSON.parse(localStorage['lists']) : {};
            var tabUrl = tab.url;
            var domain = tabUrl.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
            delete lists[domain];
            localStorage['lists'] = JSON.stringify(lists);
            loadUrls();
        });
    };

    loadUrls();
})();