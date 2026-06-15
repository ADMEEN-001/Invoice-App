// Bismillahi Rahmani Raheem

// Storage Controller
const StorageCtrl = function () {

    // StoreInvoive
    return{
        storeInvoice: function(invoice) {
            localStorage.setItem('invoice', JSON.stringify(invoice));
        },

        // getInvoice
        getInvoice: function() {
            let invoice;

            if (localStorage.getItem('invoice') === null) {
                invoice = null;
            } else {
                invoice = JSON.parse(localStorage.getItem('invoice'));
            }
            return invoice
        },

        // Clear Invoice
        clearInvoice: function(){
            localStorage.removeItem('invoice');
        }
    }
}();


// Invoice Controller
const ItemCtrl = function(){

    const Item = function(id, name, qty, price){
        this.id = id;
        this.name = name;
        this.qty = qty;
        this.price = price;
        this.total = qty*price;
    }

    const data = {
        Items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
    };

    return {

        getItems: function(){
            return data.Items;
        },

        addItem: function(name, qty, price){

            const id =
                data.Items.length > 0
                ? data.Items[data.Items.length - 1].id + 1
                : 0;

            const newItem = new Item(
                id,
                name,
                qty,
                price
            );

            data.Items.push(newItem);

            return newItem;
        },

        calculateTotals: function(){

            let subtotal = 0;

            data.Items.forEach(function(item){
                subtotal += item.total;
            });

            // data.subtotal = subtotal;
            // data.tax = Number((subtotal * 0.1).toFixed(1));
            // data.total = Number((subtotal + data.tax).toFixed(1));

            data.subtotal = Number(subtotal.toFixed(1));
            data.tax = Number((subtotal * 0.1).toFixed(1));
            data.total = Number((data.subtotal + data.tax).toFixed(1));

            console.log('Subtotal:', subtotal);
            console.log('Tax:', data.tax);
            console.log('Total:', data.total);

            return {
                subtotal: data.subtotal,
                tax: data.tax,
                total: data.total
            };
        },

        deleteItem: function(id){
            data.Items = data.Items.filter(function(item){
                return item.id !== id;
            });
        }

    }
}();

// UI Controller
const UICtrl = function(){
    const UISelectors = {
        currency: '#currency',
        clientName: '#receiverName',
        clientEmail: '#receiverEmail',
        clientAddress: '#receiverAddress',
        invoiceNumber: '#InvoiceNumber',
        issueDate: '#IssueDate',
        dueDate: '#DueDate',
        addItemBtn: '#add-item',
        subtotal: '#subtotal',
        tax: '#tax',
        discount: '#discount',
        total: '#grand-total',
        saveBtn: '#saveInvoice',
        downloadBtn: '#downloadInvoice',
        senderName: '#ClientsName',
        senderEmail: '#clientsEmail',
        senderAddress: '#clientAddress',
        senderContact: '#clientsPhone',
        DeleteItem: '#delete-item'
    };

    return {
        getSelectors: function(){
            return UISelectors;
        },

        getInputs: function(){  
            return {
                currency: document.querySelector(UISelectors.currency).value,
                clientName: document.querySelector(UISelectors.clientName).value,
                clientEmail: document.querySelector(UISelectors.clientEmail).value,
                clientAddress: document.querySelector(UISelectors.clientAddress).value,
                invoiceNumber: document.querySelector(UISelectors.invoiceNumber).value,
                issueDate: document.querySelector(UISelectors.issueDate).value,
                dueDate: document.querySelector(UISelectors.dueDate).value,
                senderAddress: document.querySelector(UISelectors.senderAddress).value,
                senderContact: document.querySelector(UISelectors.senderContact).value,
                senderName: document.querySelector(UISelectors.senderName).value,
                senderEmail: document.querySelector(UISelectors.senderEmail).value
            }
        },

        updateTotals: function(totals){

        // Left section
        document.querySelector('#subtotal').textContent = totals.subtotal.toFixed(2);

        document.querySelector('#tax').textContent =
        totals.tax.toFixed(2);

        document.querySelector('#grand-total').textContent =
        totals.total.toFixed(2);

        // Right preview
        document.querySelector('#previewSubtotal').textContent = totals.subtotal.toFixed(1);

        document.querySelector('#previewTax').textContent = totals.tax.toFixed(1);

        document.querySelector('#previewGrandTotal').textContent = totals.total.toFixed(1);
    },

        updatePreview: function(data){ 
            document.querySelector('#previewClientName').textContent = data.clientName;
            document.querySelector('#previewClientEmail').textContent = data.clientEmail;
            document.querySelector('#previewClientAddress').textContent = data.clientAddress;
            document.querySelector('#previewInvoiceNumber').textContent = data.invoiceNumber;
            document.querySelector('#previewIssueDate').textContent = data.issueDate;
            document.querySelector('#previewDueDate').textContent = data.dueDate;
            document.querySelector('#previewCompany').textContent = data.senderName;
            document.querySelector('#previewBusinessEmail').textContent = data.senderEmail;
            document.querySelector('#previewBusinessAddress').textContent = data.senderAddress;
            document.querySelector('#previewBusinessPhone').textContent = data.senderContact;

        },

        updateItemsPreview: function(items){
            const container = document.querySelector('#preview-items');container.innerHTML = '';

            items.forEach(function(item, index){

                container.innerHTML += `
                    <div class="table-row">
                        <span>${index + 1}</span>
                        <span>${item.name}</span>
                        <span>${item.qty}</span>
                        <span>${item.price}</span>
                        <span>${item.total}</span>
                    </div>
                `;
            });
        },

        getItemInputs: function(){

            return{
                name: document.querySelector('.item-name').value,
                qty: parseFloat(document.querySelector('.qty').value) || 0,
                price: parseFloat(document.querySelector('.price').value) || 0
            };
        },

        // after adding item, the structure that should follow below
        addItemToList: function(item){
            const row = document.createElement('div');
            row.className = 'item-row';

            row.innerHTML = `
            <span>${item.id + 2}</span>
            <span>${item.name}</span>
            <span>${item.qty}</span>
            <span>${item.price}</span>
            <span>${item.total}</span>
            <button class="delete-saved-item" data-id="${item.id}">X</button>
        `;
            document.querySelector('#saved-items').appendChild(row);
        },

        clearItemInputs: function(){
            document.querySelector('.item-name').value = '';
            document.querySelector('.qty').value = '';
            document.querySelector('.price').value = '';
        },

        loadSavedItems: function(items){
        document.querySelector('#saved-items').innerHTML = '';

        items.forEach(function(item){

            const row = document.createElement('div');

            row.className = 'item-row';

            row.innerHTML = `
                <span>${item.id + 2}</span>
                <span>${item.name}</span>
                <span>${item.qty}</span>
                <span>${item.price}</span>
                <span>${item.total}</span>
                <button class="delete-saved-item" data-id="${item.id}">X</button>
            `;

            document.querySelector('#saved-items').appendChild(row);
        });
    },
    };
}();


// App Controller
// App ctrl should never touch the html
const App = (function(StorageCtrl, ItemCtrl, UICtrl){

    const livePreview = function(){
        const formData = UICtrl.getInputs();
        UICtrl.updatePreview(formData);
    };

    const addItem = function(e){
        e.preventDefault();

        const item = UICtrl.getItemInputs();
            if(item.name === ''){
            alert('Please enter item name');
            return;
        }

        const newItem = ItemCtrl.addItem(
            item.name,
            item.qty,
            item.price
        );

        UICtrl.addItemToList(newItem);

        UICtrl.clearItemInputs();

        const totals = ItemCtrl.calculateTotals();

        UICtrl.updateTotals(totals);

        UICtrl.updateItemsPreview(ItemCtrl.getItems());

        console.log(ItemCtrl.getItems());
    };

    const updateItemTotal = function () {

        const qty =
            parseFloat(document.querySelector('.qty').value) || 0;

        const price =
            parseFloat(document.querySelector('.price').value) || 0;

        const total = qty * price;

        document.querySelector('.total').value = total.toFixed(1);

        const totals = ItemCtrl.calculateTotals();
        UICtrl.updateTotals(totals);
    };

    const saveInvoice = function(){

        const formData = UICtrl.getInputs();
        const items = ItemCtrl.getItems();
        const totals = ItemCtrl.calculateTotals();

        StorageCtrl.storeInvoice({formData, items, totals});

        alert('Invoice Saved Successfully');
    }

    const downloadInvoice = function(){

        const invoice = document.querySelector('.invoice-preview');

        html2pdf()
            .from(invoice)
            .save('invoice.pdf');
    };

    const loadInvoice = function(){
        const savedInvoice = StorageCtrl.getInvoice();
        
        if(savedInvoice){
            document.querySelector('#receiverName').value = savedInvoice.formData.clientName;
            document.querySelector('#receiverEmail').value = savedInvoice.formData.clientEmail;
            document.querySelector('#receiverAddress').value = savedInvoice.formData.clientAddress;
            document.querySelector('#InvoiceNumber').value = savedInvoice.formData.invoiceNumber;
            document.querySelector('#ClientsName').value = savedInvoice.formData.senderName;
            document.querySelector('#clientsEmail').value = savedInvoice.formData.senderEmail;
            document.querySelector('#clientAddress').value = savedInvoice.formData.senderAddress;
            document.querySelector('#clientsPhone').value = savedInvoice.formData.senderContact;
            document.querySelector('#IssueDate').value = savedInvoice.formData.issueDate;
            document.querySelector('#DueDate').value = savedInvoice.formData.dueDate;

            UICtrl.updatePreview(savedInvoice.formData);

            UICtrl.loadSavedItems(savedInvoice.items);

            // to restore the totals after refresh
            document.querySelector('#subtotal').textContent = savedInvoice.totals.subtotal;

            document.querySelector('#tax').textContent = savedInvoice.totals.tax;
            
            document.querySelector('#grand-total').textContent = savedInvoice.totals.total;
            };
        }

        const deleteItem = function(e){

            if(e.target.classList.contains('delete-saved-item')){

                const id = parseInt(
                    e.target.getAttribute('data-id')
                );

                ItemCtrl.deleteItem(id);

                e.target.parentElement.remove();

                const totals = ItemCtrl.calculateTotals();

                UICtrl.updateTotals(totals);

                UICtrl.updateItemsPreview(ItemCtrl.getItems());
            }
         };
        

    const loadEventListeners = function(){

        
        const UI = UICtrl.getSelectors();
            document.querySelector(UI.addItemBtn).addEventListener('click', addItem);
            document.querySelector(UI.saveBtn).addEventListener('click', saveInvoice);
            document.querySelector('#saved-items').addEventListener('click', deleteItem);
            document.querySelector(UI.downloadBtn).addEventListener('click', downloadInvoice);
            document.querySelector('.qty').addEventListener('input', updateItemTotal);
            document.querySelector('.price').addEventListener('input', updateItemTotal);

            document.querySelector(UI.clientName).addEventListener('input', livePreview);
            document.querySelector(UI.clientEmail).addEventListener('input', livePreview);
            document.querySelector(UI.clientAddress).addEventListener('input', livePreview);
            document.querySelector(UI.invoiceNumber).addEventListener('input', livePreview);
            document.querySelector(UI.issueDate).addEventListener('input', livePreview);
            document.querySelector(UI.dueDate).addEventListener('input', livePreview);
            document.querySelector(UI.senderName).addEventListener('input', livePreview);
            document.querySelector(UI.senderEmail).addEventListener('input', livePreview);
            document.querySelector(UI.senderAddress).addEventListener('input', livePreview);
            document.querySelector(UI.senderContact).addEventListener('input', livePreview);        

            // UICtrl.updatePreview(savedInvoice.formData);
        };
    return{
        init: function(){
            loadEventListeners();
            loadInvoice();
            console.log('Application Started');
        }
    };

})(StorageCtrl, ItemCtrl, UICtrl);

App.init();
