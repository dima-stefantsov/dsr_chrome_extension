chrome.runtime.onInstalled.addListener(() => {
    var manifest = chrome.runtime.getManifest();
    var extension_name = chrome.runtime.getManifest().name;
    var extension_version = chrome.runtime.getManifest().version;
    console.log(`[${extension_name}] v${extension_version} installed.`);
});


chrome.action.onClicked.addListener(() => {
    chrome.storage.sync.get('player_id', ({player_id}) => {
        if (player_id) {
            chrome.tabs.create({url: `https://ds-rating.com/player/${player_id}`});
        }
        else {
            chrome.runtime.openOptionsPage();
        }
    });
});




// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(async (search_text, qwe) => {
    var result =
        fetch(`https://ds-rating.com/dsr/get_lobby_player_info.php?player_name=${search_text}&own_player_id=1`)
        .then(response => response.json())
        .then(async (response) => {
            console.log(response);
            if (response.fail) {
                throw new Error(response.reason);
            }

            var tab = await get_current_tab();
            chrome.tabs.update(tab.id, {url: response.profile_url});
        })
        .catch((err) => {
            console.log(err);
        });
});

async function get_current_tab() {
    var queryOptions = { active: true, currentWindow: true };
    var [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
