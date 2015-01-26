document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var objsend = { "hi":"hee", 
                        "action":"catify"};
        chrome.tabs.sendMessage(tabs[0].id, objsend, function(response) { 
            document.getElementById("loading").textContent="Pacman loaded.";
        });
    });
});