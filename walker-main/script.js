// Dane użytkowników (przechowywane lokalnie)
let users = [];
let currentUser = null;
let currentAdmin = null;
let orders = [];

// Produkty w sklepie
const products = [
    {
        id: 1,
        name: 'Blue Kush',
        image: 'jeden.png',
        price: 199.99,
        description: 'Inteligentny zegarek'
    },
    {
        id: 2,
        name: 'Amnezja Haze',
        image: 'dwa.png',
        price: 149.99,
        description: 'Bezprzewodowe słuchawki'
    },
    {
        id: 3,
        name: 'Czekolada Hasz',
        image: 'trzy.png',
        price: 89.99,
        description: 'Powerbank 20000 mAh'
    },
    {
        id: 4,
        name: 'Kryształ 4cmc',
        image: 'cztery.png',
        price: 999.99,
        description: 'Kamera cyfrowa 4K'
    },
    {
        id: 5,
        name: 'Kryształ 3cmc',
        image: 'piec.jpg',
        price: 1299.99,
        description: 'Tablet 10 cali'
    },
    {
        id: 6,
        name: 'Speed Amfetamina Premium',
        image: 'amfa.png',
        price: 2499.99,
        description: 'Laptop ultrabook'
    }
];

let cartCount = 0;
let cartItems = [];
let selectedProduct = null;

// Inicjalizacja - wczytaj dane z localStorage
function initializeApp() {
    // Obsługaj animację wideo na starcie
    handleAnimationOverlay();

    // Wczytaj użytkowników
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Dodaj demo użytkownika
        users = [{
            id: 1,
            name: 'Test User',
            email: 'test@test.com',
            password: '123',
            balance: 100,
            approved: true
        }];
        saveUsers();
    }

    // Wczytaj zamówienia
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        orders = [];
    }

    // Wczytaj produkty do localStorage (jeśli nie ma)
    const savedProducts = localStorage.getItem('products');
    if (!savedProducts) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Wczytaj usługi (domyślnie puste)
    const savedServices = localStorage.getItem('services');
    if (!savedServices) {
        localStorage.setItem('services', JSON.stringify([]));
    }

    // Wczytaj promocje (domyślnie puste)
    const savedPromos = localStorage.getItem('promos');
    if (!savedPromos) {
        localStorage.setItem('promos', JSON.stringify([]));
    }

    // Wczytaj wiadomości (domyślnie puste)
    const savedNews = localStorage.getItem('news');
    if (!savedNews) {
        localStorage.setItem('news', JSON.stringify([]));
    }

    // Wczytaj kanały social (domyślnie puste)
    const savedChannels = localStorage.getItem('channels');
    if (!savedChannels) {
        localStorage.setItem('channels', JSON.stringify([]));
    }

    // Wczytaj zniżki (domyślnie puste)
    const savedDiscounts = localStorage.getItem('discounts');
    if (!savedDiscounts) {
        localStorage.setItem('discounts', JSON.stringify([]));
    }

    // Wczytaj konfigurację VIP (domyślnie)
    const savedVIPConfig = localStorage.getItem('vipConfig');
    if (!savedVIPConfig) {
        localStorage.setItem('vipConfig', JSON.stringify({ enabled: true, minSpend: 100, discount: 5 }));
    }

    // Wczytaj konfigurację Koła Fortuny (domyślnie)
    const savedWheelConfig = localStorage.getItem('wheelConfig');
    if (!savedWheelConfig) {
        localStorage.setItem('wheelConfig', JSON.stringify({ enabled: true, cost: 20, rewards: [] }));
    }

    // Wczytaj konfigurację dostawy (domyślnie)
    const savedDeliveryConfig = localStorage.getItem('deliveryConfig');
    if (!savedDeliveryConfig) {
        localStorage.setItem('deliveryConfig', JSON.stringify({ courier: 15, paczkomat: 12 }));
    }

    // Wczytaj zalogowanego użytkownika
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserPanel();
    } else {
        showAuthPanel();
    }

    renderProducts();
    loadNews();
    updateVIPStatus();
    initializeWheel();

    // Optimizuj mobile experience
    optimizeMobileExperience();

    // Obsługuj animację wideo
    handleAnimationOverlay();
}

// Obsługuj animację wideo - WYŁĄCZONE NA RAZIE
function handleAnimationOverlay() {
    const pageContent = document.getElementById('page-content');
    const overlay = document.getElementById('animation-overlay');
    
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    if (pageContent) {
        pageContent.classList.add('show');
        addElementAnimations();
    }
}

// Dodaj animacje do elementów strony
function addElementAnimations() {
    const header = document.querySelector('header');
    const cartPanel = document.getElementById('cart-panel');
    const products = document.querySelectorAll('.product-card');

    if (header) {
        header.classList.add('fade-in-up');
        header.style.animationDelay = '0.2s';
    }

    products.forEach((product, index) => {
        product.classList.add('fade-in-up');
        product.style.animationDelay = (0.3 + index * 0.1) + 's';
    });
}

// Optimize mobile touch interactions
function optimizeMobileExperience() {
    // Zapobiegaj double-tap zoom na przyciskach
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Dodaj visual feedback na touch
    const buttons = document.querySelectorAll('button, .btn-add, .btn-auth, .contact-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        button.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });

    // Prevent iOS form zoom on input focus
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // iOS nie będzie zoomować
            document.documentElement.style.fontSize = '16px';
        });
    });
}

// Przełączanie między zakładkami
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
    });

    document.getElementById(tab + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Otwarcie modalu logowania
function openAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
}

// Zamknięcie modalu logowania
function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

// Logowanie
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('⚠️ Proszę wypełnić wszystkie pola');
        return;
    }

    // Logowanie admina
    if (email === 'admin@admin.com' && password === 'admin123') {
        currentAdmin = { email: 'admin@admin.com', role: 'admin' };
        localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
        window.location.href = 'admin.html';
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('❌ Błędny email lub hasło');
        return;
    }

    if (!user.approved) {
        alert('⏳ Twoje konto czeka na zatwierdzenie przez administratora. Spróbuj za chwilę.');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.getElementById('auth-modal').classList.remove('active');
    showUserPanel();
    updateVIPStatus();
    loadNews();
    updateVIPSpinStatus();
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// Rejestracja
function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;

    if (!email || !password || !confirmPassword) {
        alert('⚠️ Proszę wypełnić wszystkie pola');
        return;
    }

    if (password !== confirmPassword) {
        alert('❌ Hasła nie zgadzają się');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('❌ Konto z tym emailem już istnieje');
        return;
    }

    const newUser = {
        id: users.length + 1,
        name: email.split('@')[0],
        email: email,
        password: password,
        balance: 0,
        approved: false,
        vipStatus: false,
        registeredDate: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers();

    // Pokaż modal zamiast alert
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-password-confirm').value = '';
    document.getElementById('auth-modal').classList.remove('active');
    showRegistrationApprovalMessage();
}

// Wylogowanie
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAuthPanel();
    cartCount = 0;
    cartItems = [];
    localStorage.removeItem('cartItems');
    document.getElementById('cart-count').textContent = '0';
}

// Pokaż panel użytkownika
function showUserPanel() {
    const authBtn = document.getElementById('auth-buttons');
    const logoutBtn = document.getElementById('logout-btn');
    const balDisplay = document.getElementById('balance-display');
    const reloadBtn = document.querySelector('.btn-reload-header');
    
    if (authBtn) authBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (balDisplay) balDisplay.style.display = 'block';
    if (reloadBtn) reloadBtn.style.display = 'block';

    updateBalanceDisplay();
}

// Pokaż panel logowania
function showAuthPanel() {
    const authBtn = document.getElementById('auth-buttons');
    const logoutBtn = document.getElementById('logout-btn');
    const balDisplay = document.getElementById('balance-display');
    const reloadBtn = document.querySelector('.btn-reload-header');
    
    if (authBtn) authBtn.style.display = 'flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (balDisplay) balDisplay.style.display = 'block';
    if (reloadBtn) reloadBtn.style.display = 'block';
}

// Aktualizuj wyświetlanie salda
function updateBalanceDisplay() {
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.email;
        
        // Aktualizuj header balance
        const headerBalanceEl = document.getElementById('header-balance');
        if (headerBalanceEl) {
            headerBalanceEl.textContent = currentUser.balance.toFixed(2);
        }
        
        const reloadBalanceEl = document.getElementById('reload-balance');
        if (reloadBalanceEl) {
            reloadBalanceEl.textContent = currentUser.balance.toFixed(2) + ' zł';
        }
    }
}

// Otwarcie modalu doładowania
function openReloadModal() {
    if (!currentUser) {
        alert('❌ Musisz być zalogowany');
        return;
    }
    document.getElementById('reload-modal').classList.add('active');
    updateBalanceDisplay();
}

// Zamknięcie modalu doładowania
function closeReloadModal() {
    document.getElementById('reload-modal').classList.remove('active');
}

// Pokaż modal powiadomienia o zatwierdzeniu rejestracji
function showRegistrationApprovalMessage() {
    document.getElementById('registration-approval-modal').classList.add('active');
}

// Zamknij modal powiadomienia o rejestracji
function closeRegistrationApprovalModal() {
    document.getElementById('registration-approval-modal').classList.remove('active');
}

// Otwarcie modalu kontaktu
function openContactModal() {
    document.getElementById('contact-modal').classList.add('active');
}

// Zamknięcie modalu kontaktu
function closeContactModal() {
    document.getElementById('contact-modal').classList.remove('active');
}

// Wybór kwoty doładowania
function selectAmount(amount) {
    currentUser.balance += amount;
    saveUsers();
    updateBalanceDisplay();
    closeReloadModal();
}

// Doładowanie własnej kwoty
function reloadCustom() {
    const amount = parseFloat(document.getElementById('custom-amount').value);

    if (!amount || amount <= 0) {
        alert('⚠️ Proszę wpisać prawidłową kwotę');
        return;
    }

    currentUser.balance += amount;
    saveUsers();
    updateBalanceDisplay();
    document.getElementById('custom-amount').value = '';
    closeReloadModal();
}

// Zapisz użytkowników do localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Zapisz pojedynczego użytkownika i zaktualizuj currentUser
function saveUser(user) {
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
    }
    if (currentUser && currentUser.id === user.id) {
        currentUser = user;
    }
    saveUsers();
}


// Render produktów na stronie
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) {
        console.error('Element products-grid not found');
        return;
    }
    
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" data-product-id="${product.id}">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <button class="btn-details" onclick="goToProductDetails(${product.id})">Szczegóły</button>
                </div>
            </div>
        `;
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-details')) {
                window.location.href = `product.html?id=${product.id}`;
            }
        });
        productsGrid.appendChild(productCard);
    });
}

// Przejdź do szczegółów produktu
function goToProductDetails(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Dodaj produkt do koszyka
function addToCart(productId) {
    if (!currentUser) {
        alert('❌ Musisz być zalogowany aby dodać produkty do koszyka');
        openAuthModal();
        return;
    }

    const product = products.find(p => p.id === productId);

    if (currentUser.balance < product.price) {
        alert(`❌ Niewystarczające saldo!\nCena: ${product.price.toFixed(2)} zł\nTwoje saldo: ${currentUser.balance.toFixed(2)} zł`);
        return;
    }

    currentUser.balance -= product.price;
    saveUsers();
    updateBalanceDisplay();

    // Dodaj do koszyka
    cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
    });

    cartCount++;
    updateCartDisplay();

    alert(`✅ "${product.name}" została dodana do koszyka!\nCena: ${product.price.toFixed(2)} zł`);
}

// Przełącz widoczność panelu koszyka
function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.style.display = cartPanel.style.display === 'none' ? 'flex' : 'none';
}

// Aktualizuj wyświetlanie koszyka
function updateCartDisplay() {
    document.getElementById('cart-count').textContent = cartCount;
    
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Koszyk jest pusty</div>';
    } else {
        let total = 0;
        cartItems.forEach((item, index) => {
            total += item.price;
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} zł</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">Usuń</button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
        document.getElementById('cart-total').textContent = total.toFixed(2);
    }
}

// Usuń produkt z koszyka
function removeFromCart(index) {
    const item = cartItems[index];
    currentUser.balance += item.price;
    saveUsers();
    updateBalanceDisplay();

    cartItems.splice(index, 1);
    cartCount--;
    updateCartDisplay();

    alert(`✅ "${item.name}" została usunięta z koszyka!\nZwrócono: ${item.price.toFixed(2)} zł`);
}

// Otwarcie modalu szczegółów produktu
function openProductModal(product) {
    selectedProduct = product;
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-price').textContent = product.price.toFixed(2) + ' zł';
    document.getElementById('product-modal').classList.add('active');
}

// Zamknięcie modalu produktu
function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
    selectedProduct = null;
}

// Dodaj do koszyka z modalu
function addToCartFromModal() {
    if (selectedProduct) {
        addToCart(selectedProduct.id);
        closeProductModal();
    }
}

// Inicjalizacja przy wczytaniu strony
document.addEventListener('DOMContentLoaded', initializeApp);

// Funkcja do zapisywania zamówienia
function saveOrder(items, paczkomat, email) {
    const order = {
        id: orders.length + 1,
        userId: currentUser.id,
        userEmail: email,
        items: items,
        totalPrice: items.reduce((sum, item) => sum + item.price, 0),
        paczkomat: paczkomat,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
}

// Funkcja do pobierania zamówień
function getOrders() {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
}

// Funkcja do zapisu zamówień
function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Otwórz modal realizacji zamówienia
function openCheckoutModal() {
    if (cartItems.length === 0) {
        alert('❌ Koszyk jest pusty!');
        return;
    }
    
    document.getElementById('checkout-email').value = currentUser.email;
    document.getElementById('checkout-paczkomat').value = '';
    document.getElementById('checkout-modal').classList.add('active');
}

// Zamknij modal realizacji zamówienia
function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

// Zrealizuj zamówienie
function submitCheckout() {
    const email = document.getElementById('checkout-email').value;
    const paczkomat = document.getElementById('checkout-paczkomat').value;

    if (!email || !paczkomat) {
        alert('⚠️ Proszę wypełnić wszystkie pola');
        return;
    }

    // Stwórz zamówienie
    const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        variant: item.variant || 'Standardowy'
    }));

    saveOrder(orderItems, paczkomat, email);

    alert('✅ Zamówienie zostało złożone!\nNumer paczkomatu: ' + paczkomat);
    
    // Wyczyść koszyk
    cartItems = [];
    cartCount = 0;
    updateCartDisplay();
    closeCheckoutModal();
    toggleCart();
}

// ==================== NOWOŚCI ====================
function loadNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    const savedNews = localStorage.getItem('news');
    const newsList = savedNews ? JSON.parse(savedNews) : [];

    newsGrid.innerHTML = '';

    if (newsList.length === 0) {
        newsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">Brak nowości. Wróć później!</div>';
        return;
    }

    newsList.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        const newsDate = new Date(news.date || new Date()).toLocaleDateString('pl-PL');
        newsCard.innerHTML = `
            <h3>${news.name || 'Brak tytułu'}</h3>
            <p>${news.description || 'Brak zawartości'}</p>
            <span class="news-date">📅 ${newsDate}</span>
        `;
        newsGrid.appendChild(newsCard);
    });
}

// ==================== VIP STATUS ====================
function updateVIPStatus() {
    const vipStatusCard = document.getElementById('vip-status-card');
    if (!vipStatusCard) return;

    const isVIP = currentUser && currentUser.vipStatus;
    const vipBadge = vipStatusCard.querySelector('.vip-label');
    
    if (isVIP) {
        vipBadge.textContent = 'VIP MEMBER ✓';
        vipBadge.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        vipBadge.style.color = '#1a1a2e';
    } else {
        vipBadge.textContent = 'STANDARDOWY';
    }
}

// ==================== KOŁO FORTUNY ====================
const wheelConfig = {
    cost: 20,
    rewards: [
        { name: 'Zniżka 5%', discount: 5, color: '#FF6B6B' },
        { name: 'Zniżka 10%', discount: 10, color: '#4ECDC4' },
        { name: 'Zniżka 15%', discount: 15, color: '#45B7D1' },
        { name: 'Nie tym razem', discount: 0, color: '#96CEB4' },
        { name: 'Nie tym razem', discount: 0, color: '#FFEAA7' },
        { name: 'Nie tym razem', discount: 0, color: '#DDA15E' }
    ]
};

let wheelRotation = 0;
let wheelSpinning = false;
let lastFreeSpinDate = localStorage.getItem('lastFreeSpinDate') || null;

function initializeWheel() {
    const wheel = document.getElementById('wheel');
    if (!wheel) return;

    // Wheel CSS już ma conic-gradient - nic nie musimy dodawać
    wheel.innerHTML = '';
    updateVIPSpinStatus();
}

function updateVIPSpinStatus() {
    const spinBtn = document.getElementById('spin-btn');
    const spinsValue = document.getElementById('spins-value');
    if (!spinBtn || !spinsValue) return;

    if (!currentUser) {
        spinBtn.textContent = 'ZALOGUJ SIĘ';
        spinBtn.disabled = true;
        return;
    }

    const isVIP = currentUser.vipStatus;
    const today = new Date().toDateString();
    const lastSpin = localStorage.getItem('lastFreeSpinDate');
    const hasSpinToday = lastSpin === today;

    if (isVIP && !hasSpinToday) {
        spinsValue.textContent = '1 (dostępne)';
        spinBtn.textContent = 'KRĘĆ GRATIS!';
        spinBtn.disabled = false;
    } else if (isVIP && hasSpinToday) {
        spinsValue.textContent = '0 (już wykorzystane)';
        spinBtn.textContent = 'KRĘĆ (20 zł)';
        spinBtn.disabled = currentUser.balance < wheelConfig.cost;
    } else {
        spinsValue.textContent = '0';
        spinBtn.textContent = 'KRĘĆ (20 zł)';
        spinBtn.disabled = currentUser.balance < wheelConfig.cost;
    }
}

function spinWheel() {
    if (!currentUser) {
        alert('Zaloguj się aby kręcić koło!');
        openAuthModal();
        return;
    }

    if (wheelSpinning) return;

    const isVIP = currentUser.vipStatus;
    const today = new Date().toDateString();
    const lastSpin = localStorage.getItem('lastFreeSpinDate');
    const isFreeSpinAvailable = isVIP && lastSpin !== today;
    const spinCost = isFreeSpinAvailable ? 0 : wheelConfig.cost;

    if (currentUser.balance < spinCost) {
        alert(`Niewystarczające saldo! Potrzebujesz ${spinCost} zł`);
        return;
    }

    wheelSpinning = true;
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;

    // Dedukcja kosztów
    if (spinCost > 0) {
        currentUser.balance -= spinCost;
        saveUser(currentUser);
        updateBalanceDisplay();
    }

    // Zaznacz że spin był dzisiaj (dla VIP)
    if (isFreeSpinAvailable) {
        localStorage.setItem('lastFreeSpinDate', today);
    }

    // Losuj nagrodę
    const randomSegment = Math.floor(Math.random() * wheelConfig.rewards.length);
    const prize = wheelConfig.rewards[randomSegment];

    // Rotacja koła
    const totalRotation = 3600 + (randomSegment * (360 / wheelConfig.rewards.length));
    wheelRotation = totalRotation;

    const wheel = document.getElementById('wheel');
    wheel.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    wheel.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
        showWheelPrize(prize);
        wheelSpinning = false;
        spinBtn.disabled = false;
        updateVIPSpinStatus();
    }, 4000);
}

function showWheelPrize(prize) {
    const wheelResult = document.getElementById('wheel-result');
    const wheelPrizeText = document.getElementById('wheel-prize');
    
    if (wheelResult && wheelPrizeText) {
        wheelPrizeText.textContent = prize.name;
        wheelResult.style.display = 'block';

        setTimeout(() => {
            wheelResult.style.display = 'none';
        }, 5000);
    }

    // Zniżka logika
    if (prize.discount > 0) {
        if (currentUser) {
            // Zapisz zniżkę dla użytkownika
            if (!currentUser.discounts) {
                currentUser.discounts = [];
            }
            currentUser.discounts.push({
                id: Date.now(),
                discount: prize.discount,
                type: '%',
                createdAt: new Date().toISOString()
            });
            saveUser(currentUser);
            alert(`🎉 Gratulacje! Wygrałeś zniżkę ${prize.discount}%! Kod zniżki został dodany do Twojego konta.`);
        }
    } else {
        // Nie tym razem
        alert('❌ Nie tym razem! Spróbuj jeszcze raz za $20 zł.');
    }
}

// ==================== INICJALIZACJA STRONY ====================
window.addEventListener('DOMContentLoaded', function() {
    // Załaduj wszystkie sekcje - z opóźnieniem aby elementy były gotowe
    setTimeout(() => {
        if (document.getElementById('news-grid')) {
            loadNews();
        }
        if (document.getElementById('vip-status-card')) {
            updateVIPStatus();
        }
        if (document.getElementById('wheel')) {
            initializeWheel();
        }
    }, 100);
});
