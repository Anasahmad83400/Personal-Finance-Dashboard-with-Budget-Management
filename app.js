// Personal Finance Tracker Application
class FinanceTracker {
    constructor() {
        this.transactions = [];
        this.budgets = {};
        this.categories = ["Food", "Transportation", "Shopping", "Bills", "Entertainment", "Healthcare", "Other"];
        this.monthlyIncome = 3000;
        this.charts = {};
        this.currentEditId = null;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.updateDashboard();
            this.initializeCharts();
            this.showToast('Welcome to Finance Tracker!', 'info');
        }, 100);
    }
    
    loadData() {
        // Load from localStorage or initialize with sample data
        const storedTransactions = localStorage.getItem('financeTracker_transactions');
        const storedBudgets = localStorage.getItem('financeTracker_budgets');
        const storedIncome = localStorage.getItem('financeTracker_monthlyIncome');
        
        if (storedTransactions) {
            this.transactions = JSON.parse(storedTransactions);
        } else {
            // Initialize with sample data - using current month dates
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            
            this.transactions = [
                {"id": 1, "amount": 45.50, "category": "Food", "description": "Lunch at downtown cafe", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-10`, "type": "expense"},
                {"id": 2, "amount": 25.00, "category": "Transportation", "description": "Metro card refill", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-09`, "type": "expense"},
                {"id": 3, "amount": 120.00, "category": "Shopping", "description": "Groceries - weekly shopping", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-08`, "type": "expense"},
                {"id": 4, "amount": 2500.00, "category": "Income", "description": "Freelance project payment", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-07`, "type": "income"},
                {"id": 5, "amount": 85.00, "category": "Bills", "description": "Internet bill", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-06`, "type": "expense"},
                {"id": 6, "amount": 30.00, "category": "Entertainment", "description": "Movie tickets", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-05`, "type": "expense"},
                {"id": 7, "amount": 15.75, "category": "Food", "description": "Coffee and pastry", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-04`, "type": "expense"},
                {"id": 8, "amount": 200.00, "category": "Healthcare", "description": "Doctor visit", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-03`, "type": "expense"},
                {"id": 9, "amount": 50.00, "category": "Transportation", "description": "Taxi ride", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-02`, "type": "expense"},
                {"id": 10, "amount": 75.25, "category": "Shopping", "description": "Clothing items", "date": `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`, "type": "expense"}
            ];
            this.saveData();
        }
        
        if (storedBudgets) {
            this.budgets = JSON.parse(storedBudgets);
        } else {
            this.budgets = {
                "Food": 500,
                "Transportation": 200,
                "Shopping": 300,
                "Bills": 400,
                "Entertainment": 150,
                "Healthcare": 250,
                "Other": 100
            };
            this.saveData();
        }
        
        if (storedIncome) {
            this.monthlyIncome = JSON.parse(storedIncome);
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('financeTracker_transactions', JSON.stringify(this.transactions));
            localStorage.setItem('financeTracker_budgets', JSON.stringify(this.budgets));
            localStorage.setItem('financeTracker_monthlyIncome', JSON.stringify(this.monthlyIncome));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Error saving data to localStorage', 'error');
        }
    }
    
    setupEventListeners() {
        // Add expense button
        const addExpenseBtn = document.getElementById('addExpenseBtn');
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openExpenseModal();
            });
        }
        
        // Modal close buttons
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeExpenseModal();
            });
        }
        
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeExpenseModal();
            });
        }
        
        // Expense form submission
        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleExpenseSubmit();
            });
        }
        
        // Budget modal
        const setBudgetBtn = document.getElementById('setBudgetBtn');
        if (setBudgetBtn) {
            setBudgetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openBudgetModal();
            });
        }
        
        const closeBudgetModal = document.getElementById('closeBudgetModal');
        if (closeBudgetModal) {
            closeBudgetModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeBudgetModal();
            });
        }
        
        const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');
        if (cancelBudgetBtn) {
            cancelBudgetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeBudgetModal();
            });
        }
        
        const budgetForm = document.getElementById('budgetForm');
        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBudgetSubmit();
            });
        }
        
        // Export functionality
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportData();
            });
        }
        
        // Month filter
        const monthFilter = document.getElementById('monthFilter');
        if (monthFilter) {
            monthFilter.addEventListener('change', () => {
                this.updateDashboard();
                this.updateCharts();
            });
        }
        
        // Modal overlay clicks
        document.querySelectorAll('.modal__overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAllModals();
                }
            });
        });
        
        // Set today's date as default
        const expenseDate = document.getElementById('expenseDate');
        if (expenseDate) {
            const today = new Date().toISOString().split('T')[0];
            expenseDate.value = today;
        }
    }
    
    openExpenseModal(transaction = null) {
        const modal = document.getElementById('expenseModal');
        const form = document.getElementById('expenseForm');
        const title = document.getElementById('modalTitle');
        
        if (!modal || !form || !title) return;
        
        if (transaction) {
            // Edit mode
            title.textContent = 'Edit Transaction';
            document.getElementById('expenseAmount').value = transaction.amount;
            document.getElementById('expenseCategory').value = transaction.category;
            document.getElementById('expenseDescription').value = transaction.description;
            document.getElementById('expenseDate').value = transaction.date;
            document.getElementById('expenseType').value = transaction.type;
            this.currentEditId = transaction.id;
        } else {
            // Add mode
            title.textContent = 'Add New Expense';
            form.reset();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('expenseDate').value = today;
            this.currentEditId = null;
        }
        
        modal.classList.remove('hidden');
        
        // Focus on first input
        setTimeout(() => {
            const amountInput = document.getElementById('expenseAmount');
            if (amountInput) {
                amountInput.focus();
            }
        }, 100);
    }
    
    closeExpenseModal() {
        const modal = document.getElementById('expenseModal');
        const form = document.getElementById('expenseForm');
        
        if (modal) {
            modal.classList.add('hidden');
        }
        if (form) {
            form.reset();
        }
        this.currentEditId = null;
    }
    
    openBudgetModal() {
        const modal = document.getElementById('budgetModal');
        const container = document.getElementById('budgetInputs');
        
        if (!modal || !container) return;
        
        container.innerHTML = '';
        
        this.categories.forEach(category => {
            const group = document.createElement('div');
            group.className = 'budget-input-group';
            
            const label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = category;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control';
            input.step = '0.01';
            input.min = '0';
            input.value = this.budgets[category] || 0;
            input.dataset.category = category;
            input.required = true;
            
            group.appendChild(label);
            group.appendChild(input);
            container.appendChild(group);
        });
        
        modal.classList.remove('hidden');
    }
    
    closeBudgetModal() {
        const modal = document.getElementById('budgetModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    closeAllModals() {
        this.closeExpenseModal();
        this.closeBudgetModal();
    }
    
    handleExpenseSubmit() {
        const amountEl = document.getElementById('expenseAmount');
        const categoryEl = document.getElementById('expenseCategory');
        const descriptionEl = document.getElementById('expenseDescription');
        const dateEl = document.getElementById('expenseDate');
        const typeEl = document.getElementById('expenseType');
        
        if (!amountEl || !categoryEl || !descriptionEl || !dateEl || !typeEl) {
            this.showToast('Form elements not found', 'error');
            return;
        }
        
        const transaction = {
            amount: parseFloat(amountEl.value),
            category: categoryEl.value,
            description: descriptionEl.value.trim(),
            date: dateEl.value,
            type: typeEl.value
        };
        
        // Validation
        if (!transaction.amount || !transaction.category || !transaction.description || !transaction.date) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        if (transaction.amount <= 0) {
            this.showToast('Amount must be greater than 0', 'error');
            return;
        }
        
        this.showLoading(true);
        
        setTimeout(() => {
            if (this.currentEditId) {
                // Edit existing transaction
                const index = this.transactions.findIndex(t => t.id === this.currentEditId);
                if (index !== -1) {
                    this.transactions[index] = { ...transaction, id: this.currentEditId };
                    this.showToast('Transaction updated successfully!', 'success');
                }
            } else {
                // Add new transaction
                transaction.id = Date.now();
                this.transactions.unshift(transaction);
                this.showToast('Transaction added successfully!', 'success');
            }
            
            this.saveData();
            this.updateDashboard();
            this.updateCharts();
            this.closeExpenseModal();
            this.showLoading(false);
        }, 500);
    }
    
    handleBudgetSubmit() {
        const inputs = document.querySelectorAll('#budgetInputs input');
        
        let isValid = true;
        inputs.forEach(input => {
            const category = input.dataset.category;
            const value = parseFloat(input.value) || 0;
            
            if (value < 0) {
                isValid = false;
                return;
            }
            
            this.budgets[category] = value;
        });
        
        if (!isValid) {
            this.showToast('Budget amounts must be positive numbers', 'error');
            return;
        }
        
        this.saveData();
        this.updateBudgetProgress();
        this.closeBudgetModal();
        this.showToast('Budgets updated successfully!', 'success');
    }
    
    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.showLoading(true);
            
            setTimeout(() => {
                this.transactions = this.transactions.filter(t => t.id !== id);
                this.saveData();
                this.updateDashboard();
                this.updateCharts();
                this.showToast('Transaction deleted successfully!', 'success');
                this.showLoading(false);
            }, 300);
        }
    }
    
    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.openExpenseModal(transaction);
        }
    }
    
    getFilteredTransactions() {
        const filterEl = document.getElementById('monthFilter');
        const filter = filterEl ? filterEl.value : 'current';
        const currentDate = new Date();
        
        if (filter === 'all') {
            return this.transactions;
        } else if (filter === 'current') {
            return this.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getMonth() === currentDate.getMonth() &&
                       transactionDate.getFullYear() === currentDate.getFullYear();
            });
        } else if (filter === 'last') {
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
            return this.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getMonth() === lastMonth.getMonth() &&
                       transactionDate.getFullYear() === lastMonth.getFullYear();
            });
        }
        
        return this.transactions;
    }
    
    updateDashboard() {
        const filteredTransactions = this.getFilteredTransactions();
        
        const totalIncome = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpenses = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalBalance = totalIncome - totalExpenses;
        const monthlySavings = totalIncome - totalExpenses;
        
        // Update stat cards
        const balanceEl = document.getElementById('totalBalance');
        const incomeEl = document.getElementById('monthlyIncome');
        const expensesEl = document.getElementById('monthlyExpenses');
        const savingsEl = document.getElementById('monthlySavings');
        
        if (balanceEl) balanceEl.textContent = this.formatCurrency(totalBalance);
        if (incomeEl) incomeEl.textContent = this.formatCurrency(totalIncome);
        if (expensesEl) expensesEl.textContent = this.formatCurrency(totalExpenses);
        if (savingsEl) savingsEl.textContent = this.formatCurrency(monthlySavings);
        
        // Update balance card color based on positive/negative
        if (balanceEl) {
            const balanceCard = balanceEl.closest('.stat-card');
            if (balanceCard) {
                if (totalBalance < 0) {
                    balanceCard.style.borderLeftColor = 'var(--color-error)';
                    balanceEl.style.color = 'var(--color-error)';
                } else {
                    balanceCard.style.borderLeftColor = 'var(--color-primary)';
                    balanceEl.style.color = 'var(--color-primary)';
                }
            }
        }
        
        this.updateTransactionsList(filteredTransactions);
        this.updateBudgetProgress(filteredTransactions);
    }
    
    updateTransactionsList(transactions = null) {
        const container = document.getElementById('transactionsList');
        if (!container) return;
        
        const recentTransactions = (transactions || this.getFilteredTransactions())
            .slice(0, 10);
        
        if (recentTransactions.length === 0) {
            container.innerHTML = '<div class="empty-state" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">No transactions found</div>';
            return;
        }
        
        container.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-item__left">
                    <div class="transaction-item__icon">
                        <span class="category-icon category-${transaction.category || transaction.type}"></span>
                    </div>
                    <div class="transaction-item__details">
                        <div class="transaction-item__description">${this.escapeHtml(transaction.description)}</div>
                        <div class="transaction-item__meta">
                            <span>${transaction.category || transaction.type}</span>
                            <span>•</span>
                            <span>${this.formatDate(transaction.date)}</span>
                        </div>
                    </div>
                </div>
                <div class="transaction-item__right">
                    <div class="transaction-item__amount transaction-item__amount--${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(Math.abs(transaction.amount))}
                    </div>
                    <div class="transaction-item__actions">
                        <button class="action-btn action-btn--edit" onclick="app.editTransaction(${transaction.id})" title="Edit">
                            ✏️
                        </button>
                        <button class="action-btn action-btn--delete" onclick="app.deleteTransaction(${transaction.id})" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateBudgetProgress(transactions = null) {
        const container = document.getElementById('budgetList');
        if (!container) return;
        
        const filteredTransactions = transactions || this.getFilteredTransactions();
        
        const expensesByCategory = {};
        filteredTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });
        
        container.innerHTML = Object.entries(this.budgets).map(([category, budget]) => {
            const spent = expensesByCategory[category] || 0;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const remaining = budget - spent;
            
            let progressClass = 'budget-progress__bar--normal';
            if (percentage > 100) {
                progressClass = 'budget-progress__bar--danger';
            } else if (percentage > 80) {
                progressClass = 'budget-progress__bar--warning';
            }
            
            return `
                <div class="budget-item">
                    <div class="budget-item__header">
                        <div class="budget-item__category">
                            <span class="category-icon category-${category}"></span>
                            ${category}
                        </div>
                        <div class="budget-item__amount">
                            ${this.formatCurrency(spent)} / ${this.formatCurrency(budget)}
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress__bar ${progressClass}" 
                             style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="budget-item__meta" style="margin-top: 8px;">
                        <small style="color: ${remaining >= 0 ? 'var(--color-success)' : 'var(--color-error)'}">
                            ${remaining >= 0 ? 'Remaining' : 'Over budget'}: ${this.formatCurrency(Math.abs(remaining))}
                        </small>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    initializeCharts() {
        // Wait for Chart.js to be available
        if (typeof Chart === 'undefined') {
            setTimeout(() => this.initializeCharts(), 100);
            return;
        }
        
        this.createExpenseChart();
        this.createTrendChart();
    }
    
    createExpenseChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        this.charts.expense = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', 
                        '#5D878F', '#DB4545', '#D2BA4C', '#964325'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        this.updateCharts();
    }
    
    createTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        this.charts.trend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Monthly Expenses',
                    data: [],
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Expenses: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
        
        this.updateCharts();
    }
    
    updateCharts() {
        if (!this.charts.expense || !this.charts.trend) return;
        
        const filteredTransactions = this.getFilteredTransactions();
        
        // Update expense chart
        const expensesByCategory = {};
        filteredTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });
        
        this.charts.expense.data.labels = Object.keys(expensesByCategory);
        this.charts.expense.data.datasets[0].data = Object.values(expensesByCategory);
        this.charts.expense.update();
        
        // Update trend chart (last 6 months)
        const monthlyData = this.getMonthlyTrendData();
        this.charts.trend.data.labels = monthlyData.labels;
        this.charts.trend.data.datasets[0].data = monthlyData.data;
        this.charts.trend.update();
    }
    
    getMonthlyTrendData() {
        const monthlyExpenses = {};
        const currentDate = new Date();
        
        // Generate last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const key = date.toISOString().slice(0, 7); // YYYY-MM format
            monthlyExpenses[key] = 0;
        }
        
        // Aggregate expenses by month
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const monthKey = t.date.slice(0, 7);
                if (monthlyExpenses.hasOwnProperty(monthKey)) {
                    monthlyExpenses[monthKey] += t.amount;
                }
            });
        
        return {
            labels: Object.keys(monthlyExpenses).map(key => {
                const date = new Date(key + '-01');
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }),
            data: Object.values(monthlyExpenses)
        };
    }
    
    exportData() {
        try {
            const data = {
                transactions: this.transactions,
                budgets: this.budgets,
                monthlyIncome: this.monthlyIncome,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `finance-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Error exporting data', 'error');
        }
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        }
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('removing');
                setTimeout(() => {
                    if (toast.parentNode) {
                        container.removeChild(toast);
                    }
                }, 300);
            }
        }, 4000);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new FinanceTracker();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!app) return;
    
    // Escape key closes modals
    if (e.key === 'Escape') {
        app.closeAllModals();
    }
    
    // Ctrl+E opens expense modal
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        app.openExpenseModal();
    }
    
    // Ctrl+B opens budget modal
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        app.openBudgetModal();
    }
});

// Service worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}