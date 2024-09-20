document.addEventListener('DOMContentLoaded', function() {
    const saveNoteButton = document.getElementById('save-note');
    const saveLinkButton = document.getElementById('save-link');
    const setReminderButton = document.getElementById('set-reminder');
    const noteInput = document.getElementById('note-input');
    const reminderTime = document.getElementById('reminder-time');
    const savedItems = document.getElementById('saved-items');

    // Load saved items
    loadItems();

    saveNoteButton.addEventListener('click', function() {
        if (noteInput.value.trim() !== '') {
            saveItem('note', noteInput.value);
            noteInput.value = '';
        }
    });

    saveLinkButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            saveItem('link', tabs[0].url);
        });
    });

    setReminderButton.addEventListener('click', function() {
        if (noteInput.value.trim() !== '' && reminderTime.value !== '') {
            const reminder = {
                text: noteInput.value,
                time: new Date(reminderTime.value).getTime()
            };
            chrome.runtime.sendMessage({action: "setReminder", reminder: reminder});
            saveItem('reminder', `${reminder.text} (${new Date(reminder.time).toLocaleString()})`);
            noteInput.value = '';
            reminderTime.value = '';
        }
    });


function saveItem(type, content) {
    chrome.storage.sync.get('items').then((result) => {
        const items = result.items || [];
        const newItem = {id: Date.now(), type, content};
        items.push(newItem);
        chrome.storage.sync.set({items: items}).then(() => {
            addItemToList(newItem);
        });
    });
}

function loadItems() {
    chrome.storage.sync.get('items').then((result) => {
        const items = result.items || [];
        items.forEach(item => addItemToList(item));
    });
}

function deleteItem(id) {
    chrome.storage.sync.get('items').then((result) => {
        const items = result.items || [];
        const updatedItems = items.filter(item => item.id !== id);
        chrome.storage.sync.set({items: updatedItems}).then(() => {
            document.querySelector(`.delete-btn[data-id="${id}"]`).closest('.bg-white').remove();
        });
    });
}

    function addItemToList(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'bg-white rounded-lg shadow-sm p-3 mb-2 flex items-center';
        itemElement.innerHTML = `
            <i class="fas ${getIconForType(item.type)} text-primary mr-3"></i>
            <span class="flex-grow truncate">${item.content}</span>
            <button class="delete-btn text-red-500 hover:text-red-700 transition duration-300" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        savedItems.prepend(itemElement);

        itemElement.querySelector('.delete-btn').addEventListener('click', function() {
            deleteItem(item.id);
        });
    }

    function getIconForType(type) {
        switch(type) {
            case 'note': return 'fa-sticky-note';
            case 'link': return 'fa-link';
            case 'reminder': return 'fa-clock';
            default: return 'fa-file';
        }
    }

    function deleteItem(id) {
        chrome.storage.sync.get(['items'], function(result) {
            const items = result.items || [];
            const updatedItems = items.filter(item => item.id !== id);
            chrome.storage.sync.set({items: updatedItems}, function() {
                document.querySelector(`.delete-btn[data-id="${id}"]`).closest('.bg-white').remove();
            });
        });
    }
});