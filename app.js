// Storage contoller /////////////////////////
const StorageCtrl = function(){

        // storeInvoice()
    return{
        storeInvoice: function(invoice){
            localStorage.setItem('invoice', JSON.stringify(invoice));
        },

        // getInvoice()
        getInvoice: function(){
            let invoice;

            if (localStorage.getItem('invoice') === null){
                invoice = null;
            } else {
                invoice = JSON.parse(localStorage.getItem('invoice'));
            }
            return invoice;
        },

        // clearInvoice()
        clearInvoice: function(){
            localStorage.removeItem('invoice');
        },

        // // To load the invoice
        //     let invoice = localStorage.getItem('invoice');
        //     if(!invoice) return null;
        //     return JSON.parse(invoice);

    }
}();

// Invoice Controller /////////////////////////////

// All this below () uses IIFE(Immediately Invocked Function Expression)
// anyhing in the middle of this IIFE are private(cant be oberwritten by a function outside)
const ItemCtrl = function(){

    const Item = function(id, name, qty, price) {
        this.id = id;
        this.name = name;
        this.qty = qty;
        this.price = price;
        this.total = qty * price;
    };

    const data = {
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0
    };

    return{
        getItems: function() {
            return data.items;
        },

        addItem: function (name, qty, price) {

            const id = data.items.length > 0 
                ? data.items[data.items.length - 1].id + 1 
                : 0;

            const newItem = new Item(id, name, qty, price);
            data.items.push(newItem);

            return newItem;
        },

        calculateTotals: function () {
            let subtotal = 0;

            data.items.forEach(item => {
                subtotal += item.total;
            });

            data.subtotal = subtotal;
            data.tax = subtotal * 0.1;
            data.total = subtotal + data.tax - data.discount;

            return {
                subtotal: data.subtotal,
                discount: data.discount,
                tax: data.tax,
                total: data.total
            };
        },

        setDiscount: function (value) {
            data.discount = value;
        },

        clearAll: function () {
            data.items = [];
            data.subtotal = 0;
            data.tax = 0;
            data.total = 0;
        },

        logData: function () {
            return data;
        }
    };
}();

// UI controller /////////////////////////////
const UICtrl = function(){

    const UISelectors = {
        currency: '#currency',
        clientName: '#receiverName',
        clientEmail: '#receiverEmail',
        clientAddress: '#receiverAddress',
        invoiceNumber: '#InvoiceNumber',
        issueDate: '#IssueDate',
        dueDate: '#DueDate',
        itemRows: '.item-row',
        addItemBtn: '#add-item',
        subtotal: '#subtotal',
        saveBtn: '#saveInvoice',
        tax: '#tax',
        discount: '#discount',
        total: '#grand-total'
    };

    return {
        getSelectors: function() {
            return UISelectors;
        },

        getInputs: function () {
            return {
                currency: document.querySelector(UISelectors.currency).value,
                clientName: document.querySelector(UISelectors.clientName).value,
                clientEmail: document.querySelector(UISelectors.clientEmail).value,
                clientAddress: document.querySelector(UISelectors.clientAddress).value,
                invoiceNumber: document.querySelector(UISelectors.invoiceNumber).value,
                issueDate: document.querySelector(UISelectors.issueDate).value,
                dueDate: document.querySelector(UISelectors.dueDate).value
            };
         },

        getItemInputs: function () {

            let items = [];

            document.querySelectorAll(UISelectors.itemRows).forEach(row => {

                const name = row.querySelector('.item-name').value;
                const qty = parseFloat(row.querySelector('.qty').value) || 0;
                const price = parseFloat(row.querySelector('.price').value) || 0;

                if (name !== "") {
                    items.push({ name, qty, price });
                }
            });

            return items;
        },

        updateTotals: function(totals) {

        const currency = document.querySelector('#currency').value;

        document.querySelector('#subtotal').textContent =
            `${currency}${totals.subtotal.toFixed(2)}`;

        document.querySelector('#tax').textContent =
            `${currency}${totals.tax.toFixed(2)}`;

        document.querySelector('#grand-total').textContent =
            `${currency}${totals.total.toFixed(2)}`;
        },

        calculateRowTotals: function() {

            document.querySelectorAll(UISelectors.itemRows).forEach(row => {
                const qty = parseFloat(row.querySelector('.qty').value) || 0;
                const price = parseFloat(row.querySelector('.price').value) || 0;

                const total = qty * price;

                row.querySelector('.total').value = total.toFixed(2);
            });
        },

        updatePreview: function(data) {

            document.querySelector('#previewClientName').textContent = data.clientName || '';
            document.querySelector('#previewClientEmail').textContent = data.clientEmail || '';
            document.querySelector('#previewClientAddress').textContent = data.clientAddress || '';
            document.querySelector('#previewInvoiceNumber').textContent = data.invoiceNumber || '';
            document.querySelector('#previewIssueDate').textContent = data.issueDate || '';
            document.querySelector('#previewDueDate').textContent = data.dueDate || '';
        },

        updateItemsPreview: function(items) {

            const container = document.querySelector('#preview-items');
            container.innerHTML = '';

            items.forEach((item, index) => {

                container.innerHTML += `
                    <div class="table-row">
                        <span>${index + 1}</span>
                        <span>${item.name}</span>
                        <span>${item.qty}</span>
                        <span>${item.price}</span>
                        <span>${item.qty * item.price}</span>
                    </div>
                `;
            });
        },

        saveBtn: '#saveInvoice'
    };

}();

// App controller ///////////////////////////////
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {

    function formatMoney(amount, currency) {
        return `${currency}${amount.toFixed(2)}`;
    }

    const loadEventListeners = function () {

        const UI = UICtrl.getSelectors();

        const livePreview = function () {
            const formData = UICtrl.getInputs();
            UICtrl.updatePreview(formData);
        };

        document.querySelector(UI.clientName).addEventListener('input', livePreview);
        document.querySelector(UI.clientEmail).addEventListener('input', livePreview);
        document.querySelector(UI.clientAddress).addEventListener('input', livePreview);
        document.querySelector(UI.invoiceNumber).addEventListener('input', livePreview);
        document.querySelector(UI.issueDate).addEventListener('input', livePreview);
        document.querySelector(UI.dueDate).addEventListener('input', livePreview);

        document.querySelector(UI.addItemBtn).addEventListener('click', addItem);
        document.querySelector(UI.saveBtn).addEventListener('click', saveInvoice);

        document.querySelector('#currency').addEventListener('change', function () {
            const itemInputs = UICtrl.getItemInputs();

            ItemCtrl.clearAll();

            itemInputs.forEach(item => {
                ItemCtrl.addItem(item.name, item.qty, item.price);
            });

            const totals = ItemCtrl.calculateTotals();
            UICtrl.updateTotals(totals);

            const currency = this.value;

            document.querySelector('#previewSubtotal').textContent =
            currency + totals.subtotal.toFixed(2);

            document.querySelector('#previewTax').textContent =
            currency + totals.tax.toFixed(2);

            document.querySelector('#previewGrandTotal').textContent =
            currency + totals.total.toFixed(2);
        });

        
        document.querySelector('#downloadInvoice')
        .addEventListener('click', downloadInvoice);

        // STEP 4: DELETE ITEM EVENT DELEGATION
        document.querySelector('.itemlist').addEventListener('click', deleteItem);

        document.querySelectorAll('.qty, .price').forEach(input => {
            input.addEventListener('input', liveCalculation);
        });
    };

    const saveInvoice = function () {
        const formData = UICtrl.getInputs();
        const items = ItemCtrl.getItems();
        const totals = ItemCtrl.calculateTotals();

        StorageCtrl.storeInvoice({
            formData,
            items,
            totals
        });

        alert('Invoice Saved Successfully!');
    };

const downloadInvoice = function () {

    const formData = UICtrl.getInputs();
    const items = ItemCtrl.getItems();
    const totals = ItemCtrl.calculateTotals();

    UICtrl.updatePreview(formData);
    UICtrl.updateItemsPreview(items);

    const currency = document.querySelector('#currency').value;
    
    document.querySelector('#previewSubtotal').textContent =
    formatMoney(totals.subtotal, currency);

    document.querySelector('#previewTax').textContent =
    formatMoney(totals.tax, currency);

    document.querySelector('#previewGrandTotal').textContent =
    formatMoney(totals.total, currency);

    const invoice = document.querySelector('.invoice-preview');

    window.scrollTo(0, 0); // 🔥 IMPORTANT FIX

    const options = {
        margin: 0.3,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 1 },

        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            windowWidth: document.body.scrollWidth,
            windowHeight: document.body.scrollHeight
        },

        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        },

        pagebreak: {
            mode: ['avoid-all', 'css', 'legacy']
        }
    };

    html2pdf().set(options).from(invoice).save();
};

    const addItem = function (e) {
        e.preventDefault();

        const itemList = document.querySelector('.itemlist');

        const newRow = document.createElement('div');
        newRow.className = 'item-row';

        newRow.innerHTML = `
            <span>*</span>
            <input type="text" class="item-name" placeholder="Item">
            <input type="number" class="qty">
            <input type="number" class="price">
            <input type="text" class="total" readonly>
            <button class="delete-item">X</button>
        `;

        itemList.appendChild(newRow);

        // 🔥 ADD THIS (sync preview)
        UICtrl.updateItemsPreview(UICtrl.getItemInputs());
    };

    const liveCalculation = function () {

        const itemInputs = UICtrl.getItemInputs();

        ItemCtrl.clearAll();

        itemInputs.forEach(item => {
            ItemCtrl.addItem(item.name, item.qty, item.price);
        });

        UICtrl.calculateRowTotals();

        const totals = ItemCtrl.calculateTotals();
        UICtrl.updateTotals(totals);

        // 🔥 ADD THIS
        UICtrl.updateItemsPreview(itemInputs);
    };

    const deleteItem = function(e) {

        if (e.target.classList.contains('delete-item')) {

            e.target.parentElement.remove();

            const itemInputs = UICtrl.getItemInputs();

            ItemCtrl.clearAll();

            itemInputs.forEach(item => {
                ItemCtrl.addItem(item.name, item.qty, item.price);
            });

            const totals = ItemCtrl.calculateTotals();
            UICtrl.updateTotals(totals);

            document.querySelectorAll('.item-row').forEach((row, index) => {
                row.querySelector('span').textContent = index + 1;
            });

            // 🔥 ADD THIS
            UICtrl.updateItemsPreview(itemInputs);
        }
    };

    const restoreInvoice = function (saved) {

        ItemCtrl.clearAll();

        saved.items.forEach(item => {
            ItemCtrl.addItem(item.name, item.qty, item.price);
        });

        const totals = ItemCtrl.calculateTotals();
        UICtrl.updateTotals(totals);

        if (saved.formData) {
            UICtrl.updatePreview(saved.formData);
        }

        UICtrl.calculateRowTotals();
    };

    return {

        init: function () {
            console.log('Invoice App Started');

            const saved = StorageCtrl.getInvoice();

            if (saved) {
                restoreInvoice(saved);
            }

            loadEventListeners();
        }
    };

})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
