// Storage Controller

const StorageCtrl = (function () {

    // Pubmic methods
    return {
        storeItem(item) {
            let items;
            // Check if any items in LS
            if (localStorage.getItem('items') === null) {
                items = [];
                // push new item
                items.push(item);
                // Set LS
                localStorage.setItem('items', JSON.stringify(items));

            } else {
                // Get what already is LS
                items = JSON.parse(localStorage.getItem('items'));

                // Push new item
                items.push(item);

                // Reset  LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItemsFromStorage() {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemStorage(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            // Set LS
            localStorage.setItem('items', JSON.stringify(items));

        },

        deleteItemFromStorage(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            // Set LS
            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsFromStorage() {
            localStorage.removeItem('items');
        }
    }
})();

// item Controller
const ItemCtrl = (function () {
    // Item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / Data
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {

        getTotalCalories() {
            let total = 0;

            data.items.forEach(function (item) {
                total += item.calories;

            });
            // Set total calories in data structure
            data.totalCalories = total;

            // Return Total Calories
            return data.totalCalories;
        },

        getItems: function () {
            return data.items;
        },

        addItem: function (name, calories) {
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to Number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);
            // Add to items array
            data.items.push(newItem);

            return newItem;
        },

        getItemById(id) {
            let found = null;

            // loop through items
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },

        updateItem(name, calories) {
            // calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        deleteItem(id) {
            // Get id's
            const ids = data.items.map(function (item) {
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);
            // Remove item
            data.items.splice(index, 1);
        },

        clearAllItems() {
            data.items = [];
        },

        setCurrentItem(item) {
            data.currentItem = item;
        },

        getCurrentItem() {
            return data.currentItem;
        },
    }
})();

// UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calorie',
        totalCalories: '.total-calories',
    }
    // Public Methods
    return {

        populateItemList: function (items) {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pen"></i>
                </a>
            </li>`;
            });

            // Insert List Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        // Show total Calories
        showTotalCalories(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        getSelectors: function () {
            return UISelectors;
        },

        addListItem: function (item) {
            // Create li element
            const li = document.createElement('li');
            // add class
            li.className = 'collection-item';
            // add id
            li.id = `item-${item.id}`;

            // Add HTML
            li.innerHTML = `<strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pen"></i>
            </a>`;

            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        updateListItem(item) {


            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn nodelist into array

            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML =
                        `<strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pen"></i>
                    </a>`;
                }
            });
        },

        deleteListItem(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        removeItems() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            });
        },

        addItemToForm() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },

        clearEditState() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },

        showEditState() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },
    }
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListenes = function () {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delte btn event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back btn event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);


        // Clear all items btn event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }
    // Add item submit
    const itemAddSubmit = function (e) {
        // Get form input from UICtrl
        const input = UICtrl.getItemInput();
        // Check for input and calorie input
        if (input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI List
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in Local Storage
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }


        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function (e) {

        if (e.target.classList.contains('edit-item')) {
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;

            // Breack into array
            const listIdArr = listId.split('-');

            // Get the actual Id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();

            e.preventDefault();
        }
    }

    // Update item submit
    const itemUpdateSubmit = function (e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // update UI
        UICtrl.updateListItem(updatedItem);


        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Item delete submit
    const itemDeleteSubmit = function (e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete item from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear all items event
    const clearAllItemsClick = function (e) {
        // Delete all items from datastructure 
        ItemCtrl.clearAllItems();


        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);


        // remove all items from UI
        UICtrl.removeItems();

        // remove all items from LS
        StorageCtrl.clearItemsFromStorage();


    }

    // Public Methods
    return {
        init: function () {
            // Clear edit state
            UICtrl.clearEditState();

            // Fetch items from Data Structure
            const items = ItemCtrl.getItems();

            // Populate list with items
            UICtrl.populateItemList(items);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListenes();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initializing App
App.init(); 