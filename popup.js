document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //var objsend = { "hi":"hee", "action":"catify"/*, "pacman":image*/};

        chrome.tabs.sendMessage(tabs[0].id, null);
    });

});
