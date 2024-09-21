document.addEventListener('DOMContentLoaded', function() {
    const saveNoteButton = document.getElementById('save-note');
    const saveLinkButton = document.getElementById('save-link');
    const setReminderButton = document.getElementById('set-reminder');
    const noteInput = document.getElementById('note-input');
    const reminderTime = document.getElementById('reminder-time');
    const savedItems = document.getElementById('saved-items');
    const noItemsMessage = document.getElementById('no-items-message');

    // Load saved items
    loadItems();

    saveNoteButton.addEventListener('click', function() {
        if (noteInput.value.trim() !== '') {
            saveItem('note', noteInput.value);
            noteInput.value = '';
        }
    });

    saveLinkButton.addEventListener('click', function() {
        saveItem('link', 'https://example.com'); // Simulating saving current page
    });

    setReminderButton.addEventListener('click', function() {
        if (noteInput.value.trim() !== '' && reminderTime.value !== '') {
            const reminder = {
                text: noteInput.value,
                time: new Date(reminderTime.value).getTime()
            };
            saveItem('reminder', `${reminder.text} (${new Date(reminder.time).toLocaleString()})`);
            noteInput.value = '';
            reminderTime.value = '';
        }
    });

    function saveItem(type, content) {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        const newItem = { id: Date.now(), type, content };
        items.push(newItem);
        localStorage.setItem('items', JSON.stringify(items));
        addItemToList(newItem);
        noItemsMessage.style.display = 'none'; // Hide "No items" message when an item is added
    }

    function loadItems() {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        if (items.length > 0) {
            noItemsMessage.style.display = 'none';
        }
        items.forEach(item => addItemToList(item));
    }

    function addItemToList(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'bg-white rounded-lg shadow-sm p-3 mb-2 flex items-center';
        itemElement.innerHTML = `
            <i class="fas ${getIconForType(item.type)} text-primary mr-3"></i>
            <span class="flex-grow truncate">${item.content}</span>
            <button class="delete-btn text-red-500  p-2 border border-gray-300 rounded ml-3" data-id="${item.id}">
                <h1> X </h1>
            </button>
        `;
        savedItems.prepend(itemElement);
    console.log(item)
        // Add event listener for delete button
        itemElement.querySelector('.delete-btn').addEventListener('click', function() {
            console.log(item)
            deleteItem(item.id);
        });
    }
    

    function getIconForType(type) {
        switch (type) {
            case 'note': return 'fa-sticky-note';
            case 'link': return 'fa-link';
            case 'reminder': return 'fa-clock';
            default: return 'fa-file';
        }
    }

    function deleteItem(id) {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem('items', JSON.stringify(items));
        // Remove the item from the UI
        document.querySelector(`.delete-btn[data-id="${id}"]`).closest('.bg-white').remove();

        // Optionally, display "No items saved yet" message if the list is empty
        if (items.length === 0) {
            noItemsMessage.style.display = 'block';
        }
    }
});
