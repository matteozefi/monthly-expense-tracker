// Get references to DOM elements
const inputForm = document.getElementById('inputForm');
const expensesContainer = document.getElementById('expensesContainer');
const organizeDateBtn = document.getElementById('organizeDateBtn');
const organizeAmountBtn = document.getElementById('organizeAmountBtn');
const clearExpensesBtn = document.getElementById('clearExpensesBtn');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const totalExpensesEl = document.getElementById('totalExpenses').getElementsByClassName('amount')[0];
const averageExpenseEl = document.getElementById('averageExpense').getElementsByClassName('amount')[0];
const highestExpenseEl = document.getElementById('highestExpense').getElementsByClassName('amount')[0];
const lowestExpenseEl = document.getElementById('lowestExpense').getElementsByClassName('amount')[0];
const expensesList = document.getElementById('expensesList');

// Initialize expenses array
let expenses = [];

//convert expenses array to JSON string to store in local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

//retreive expenses from local storage and convert back to array
function loadExpenses() {
    if (localStorage.getItem('expenses')) {
        expenses = JSON.parse(localStorage.getItem('expenses'));
    };
}

//function to render expenses to the DOM
function renderExpenses() {
    expensesList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const expenseDiv = document.createElement('div');
        expenseDiv.classList.add('expenseCard');
        expenseDiv.innerHTML = `
            <p><strong>Name:</strong> ${expense.name}</p>
            <p><strong>Amount:</strong> $${expense.amount.toFixed(2)}</p>
            <p><strong>Category:</strong> ${expense.category}</p>
            <p><strong>Date:</strong> ${expense.date}</p>
            <button class="deleteBtn" data-index="${index}">Delete</button>
        `;
        expensesList.appendChild(expenseDiv);
    });
};

//create function to update results
function updateResults() {
    if (expenses.length === 0) {
        totalExpensesEl.textContent = '$0.00';
        averageExpenseEl.textContent = '$0.00';
        highestExpenseEl.textContent = '$0.00';
        lowestExpenseEl.textContent = '$0.00';
        return;
    } else {
        const total = expenses.reduce((accumulator, expense) => accumulator + expense.amount, 0);
        const average = total / expenses.length;
        const highest = Math.max(...expenses.map((expense) => {
            return expense.amount;
        }));
        const lowest = Math.min(...expenses.map((expense) => {
            return expense.amount;
        }));

        totalExpensesEl.textContent = `$${total.toFixed(2)}`;
        averageExpenseEl.textContent = `$${average.toFixed(2)}`;
        highestExpenseEl.textContent = `$${highest.toFixed(2)}`;
        lowestExpenseEl.textContent = `$${lowest.toFixed(2)}`;
    }
}

//function to add a new expense
function addExpense(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value; //get category string value
    const date = document.getElementById('date').value; //get date string value

    //create expense object
    const expense = {
        name: name,
        amount: amount,
        category: category,
        date: date
    };
    expenses.push(expense);
}

//function for deleting an expense
expensesList.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteBtn')) {
        const index = event.target.getAttribute('data-index');
        expenses.splice(index, 1);
        saveExpenses();
        renderExpenses();
        updateResults();
    }
})
/*remember the event object is passed automatically to the event listener function via the event parameter and gives access to details about the event that occurred such as event.target which is the 
specific element that was clicked*/

//function to organize expenses by chronolgoical order descending
organizeDateBtn.addEventListener('click', () => {
    expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveExpenses();
    renderExpenses();
    updateResults();
})

//function to clear all expenses
clearExpensesBtn.addEventListener('click', () => {
    expenses = [];
    saveExpenses();
    renderExpenses();
    updateResults();
})

//function to organize expenses by amount descending
organizeAmountBtn.addEventListener('click', () => {
    expenses.sort((a, b) => b.amount - a.amount);
    saveExpenses();
    renderExpenses();
    updateResults();
})


//Add event listener to the form submission
inputForm.addEventListener('submit', (event) => {
    addExpense(event);
    saveExpenses();
    renderExpenses();
    updateResults();
    inputForm.reset();
}); 

//Load expenses from local storage on page load
window.addEventListener('load', () => {
    loadExpenses();
    renderExpenses();
    updateResults();
});
