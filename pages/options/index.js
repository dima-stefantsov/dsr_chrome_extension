var input_player_id = document.getElementById('player_id');

// Fill player_id input with saved value on load.
chrome.storage.sync.get('player_id', ({player_id}) => {
    if (player_id) {
        input_player_id.value = player_id;
    }
});

// Store only valid player id.
// Clear storage if invalid.
input_player_id.addEventListener('input', (event) => {
    var player_id = Number(event.target.value);
    if (is_good_player_id(player_id)) {
        chrome.storage.sync.set({ player_id });
    }
    else {
        chrome.storage.sync.remove('player_id');
    }
});



function is_good_player_id(player_id) {
    if (Number.isInteger(player_id) &&
        player_id > 0 &&
        player_id < 100*1000*1000) {
        return true;
    }
    return false;
}
