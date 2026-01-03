// Załaduj dane z localStorage
let currentUser = null;
let users = [];
let cartCount = 0;
let cartItems = [];
let selectedProduct = null;

const products = [
    {
        id: 1,
        name: 'Blue Kush',
        image: 'jeden.png',
        price: 100,
        description: 'Wysokiej jakości produkt',
        fullDescription: '',
        variants: [
            { name: '2g', price: 100 },
            { name: '5g', price: 200 },
            { name: '10g', price: 400 },
            { name: '20g', price: 800 },
            { name: '40g', price: 1550 }
        ]
    },
    {
        id: 2,
        name: 'Amnezja Haze',
        image: 'dwa.png',
        price: 149.99,
        description: 'Sativa-dominująca odmiana konopi',
        fullDescription: `Typ: Sativa-dominująca
Profil genetyczny: ok. 70–80% sativa / 20–30% indica
Stężenie THC: ok. 20–25%
CBD: niskie
Aromat: cytrusowy, ziemisty, kadzidlany
Profil działania: energetyzujące, euforyczne, kreatywne

Amnesia Haze to kultowa odmiana konopi ceniona za intensywny charakter i wyrazisty profil aromatyczny. Dominacja genów sativy sprawia, że jej działanie koncentruje się głównie na sferze umysłowej, oferując uczucie pobudzenia, jasności myśli i poprawy nastroju.

Odmiana wyróżnia się wysoką zawartością THC, co przekłada się na silne, długotrwałe efekty o charakterze euforycznym i motywującym. Fizyczne rozluźnienie pozostaje subtelne, dzięki czemu Amnesia Haze często kojarzona jest z aktywnością w ciągu dnia oraz zadaniami wymagającymi kreatywności.

Profil smakowo-zapachowy łączy w sobie świeże nuty cytryny i cytrusów, przełamane akcentami ziemi, przypraw i kadzidła, typowymi dla klasycznych odmian typu haze.

Amnesia Haze to propozycja dla osób poszukujących wyrazistej sativy o intensywnym działaniu i charakterystycznym aromacie – prawdziwa klasyka wśród odmian konopi.`,
        variants: [
            { name: '2g', price: 100 },
            { name: '5g', price: 200 },
            { name: '10g', price: 400 },
            { name: '20g', price: 800 },
            { name: '40g', price: 1550 }
        ]
    },
    {
        id: 3,
        name: 'Czekolada Hasz',
        image: 'trzy.png',
        price: 89.99,
        description: 'Powerbank 20000 mAh',
        fullDescription: '',
        variants: ['Czarny', 'Biały', 'Różowy']
    },
    {
        id: 4,
        name: 'Kryształ 4cmc',
        image: 'cztery.png',
        price: 999.99,
        description: 'Kamera cyfrowa 4K',
        fullDescription: '',
        variants: ['32GB', '64GB', '128GB']
    },
    {
        id: 5,
        name: 'Kryształ 3cmc',
        image: 'piec.jpg',
        price: 1299.99,
        description: 'Tablet 10 cali',
        fullDescription: '',
        variants: ['64GB', '128GB', '256GB']
    },
    {
        id: 6,
        name: 'Speed Amfetamina Premium',
        image: 'amfa.png',
        price: 2499.99,
        description: 'Laptop ultrabook',
        fullDescription: '',
        variants: ['256GB SSD', '512GB SSD', '1TB SSD']
    }
];

// Inicjalizacja strony produktu
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProductPage();
    optimizeMobileExperience();
});

function handleAnimationOverlay() {
    const overlay = document.getElementById('animation-overlay');
    const video = document.getElementById('animation-video');
    const pageContent = document.getElementById('page-content');

    console.log('=== HANDLEANIMATIONOVERLAY START ===');
    console.log('Overlay:', overlay);
    console.log('Video:', video);
    console.log('PageContent:', pageContent);

    if (!overlay || !video || !pageContent) {
        console.log('❌ Brak elementów - pokazuję stronę');
        if (pageContent) pageContent.classList.add('show');
        return;
    }

    // Sprawdź czy użytkownik kiedykolwiek widział animację
    const hasSeenAnimation = localStorage.getItem('hasSeenAnimation');
    
    console.log('hasSeenAnimation:', hasSeenAnimation);
    
    if (hasSeenAnimation === 'true') {
        // Już widział - pominąć animację
        console.log('⏭️ Użytkownik już widział animację - pomijam');
        overlay.style.display = 'none';
        pageContent.classList.add('show');
        return;
    }

    // PIERWSZY RAZ - grać animację
    console.log('✅ PIERWSZY RAZ - pokazuję animację');
    console.log('Video src:', video.src);
    localStorage.setItem('hasSeenAnimation', 'true');

    let animationFinished = false;

    const finishAnimation = () => {
        if (animationFinished) return;
        animationFinished = true;
        console.log('🎬 finishAnimation wywołana');
        
        // Fade out overlay
        console.log('⏬ Zaczynam fade out...');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        
        // Pokaż zawartość strony
        console.log('📄 Pokazuję page-content');
        pageContent.classList.add('show');
        
        // Po transitionie ukryj overlay całkowicie
        setTimeout(() => {
            console.log('✅ Ukrywam overlay');
            overlay.style.display = 'none';
        }, 900);
    };

    // Gdy video się skończy
    video.addEventListener('ended', () => {
        console.log('🎬 VIDEO ENDED');
        finishAnimation();
    });

    // Fallback timeout
    const timeoutId = setTimeout(() => {
        console.log('⏱️ TIMEOUT 10s - pokazuję stronę');
        finishAnimation();
    }, 10000);

    // Jeśli video się zacznie grać - wyłącz timeout
    video.addEventListener('playing', () => {
        console.log('▶️ VIDEO PLAYING');
        clearTimeout(timeoutId);
    });

    // Błąd wideo
    video.addEventListener('error', (e) => {
        console.log('❌ VIDEO ERROR:', e);
        finishAnimation();
    });

    // Spróbuj odtwarzać video
    console.log('▶️ play()...');
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('✅ play() OK');
            })
            .catch(error => {
                console.log('❌ play() ERROR:', error);
                finishAnimation();
            });
    }
}

function initializeApp() {
    // Obsługaj animację wideo
    handleAnimationOverlay();

    // Wczytaj użytkowników

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        users = [{
            id: 1,
            name: 'Test User',
            email: 'test@test.com',
            password: '123',
            balance: 100
        }];
        saveUsers();
    }

    // Wczytaj zalogowanego użytkownika
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserPanel();
    } else {
        showAuthPanel();
    }

    // Wczytaj koszyk
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        cartCount = cartItems.length;
    }

    updateHeaderBalance();
    updateCartDisplay();
}

function loadProductPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.fullDescription;
        
        // Wczytaj opis do sekcji szczeg\u00f3\u0142\u00f3w
        const specsDescription = document.getElementById('product-specs-description');
        if (specsDescription && product.fullDescription) {
            specsDescription.textContent = product.fullDescription;
        }
        
        // Wczytaj warianty
        const variantsList = document.getElementById('variants-list');
        variantsList.innerHTML = '';
        
        // Sprawdź czy warianty mają strukturę z name i price
        if (product.variants.length > 0 && typeof product.variants[0] === 'object' && 'price' in product.variants[0]) {
            // Warianty z cenami (jak produkt 1)
            product.variants.forEach((variant, index) => {
                const btn = document.createElement('button');
                btn.className = 'variant-btn' + (index === 0 ? ' active' : '');
                btn.textContent = variant.name + ' - ' + variant.price + ' zł';
                btn.dataset.price = variant.price;
                btn.onclick = function() {
                    document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    updatePriceDisplay(variant.price);
                };
                variantsList.appendChild(btn);
            });
            // Ustaw cenę pierwszego wariantu
            updatePriceDisplay(product.variants[0].price);
        } else {
            // Normalne warianty (pozostałe produkty)
            product.variants.forEach((variant, index) => {
                const btn = document.createElement('button');
                btn.className = 'variant-btn' + (index === 0 ? ' active' : '');
                btn.textContent = variant;
                btn.onclick = function() {
                    document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                };
                variantsList.appendChild(btn);
            });
            document.getElementById('product-price').textContent = product.price.toFixed(2) + ' zł';
        }

        selectedProduct = product;
    }
}

function updatePriceDisplay(price) {
    document.getElementById('product-price').textContent = price.toFixed(2) + ' zł';
}

function addToCartProduct() {
    if (!currentUser) {
        alert('❌ Musisz być zalogowany aby dodać produkty do koszyka');
        openAuthModal();
        return;
    }

    const quantity = 1; // Zawsze 1 szt - warianty decyduj\u0105 o cenie
    
    // Pobierz wybraną cenę z aktywnego przycisku wariantu
    const activeVariant = document.querySelector('.variant-btn.active');
    let variantPrice = selectedProduct.price;
    let variantName = '';
    
    if (activeVariant && activeVariant.dataset.price) {
        variantPrice = parseFloat(activeVariant.dataset.price);
        variantName = activeVariant.textContent;
    }
    
    const totalPrice = variantPrice * quantity;

    if (currentUser.balance < totalPrice) {
        alert(`❌ Niewystarczające saldo!\nCena: ${totalPrice.toFixed(2)} zł\nTwoje saldo: ${currentUser.balance.toFixed(2)} zł`);
        return;
    }

    currentUser.balance -= totalPrice;
    saveUsers();
    updateHeaderBalance();

    for (let i = 0; i < quantity; i++) {
        cartItems.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            variant: variantName,
            price: variantPrice,
            image: selectedProduct.image
        });
    }

    cartCount = cartItems.length;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();

    alert(`✅ "${selectedProduct.name}" (x${quantity}) została dodana do koszyka!\nCena: ${totalPrice.toFixed(2)} zł`);
}

// Aktualizuj saldo w nagłówku
function updateHeaderBalance() {
    if (currentUser) {
        const headerBalanceEl = document.getElementById('header-balance');
        if (headerBalanceEl) {
            headerBalanceEl.textContent = currentUser.balance.toFixed(2);
        }
        document.getElementById('user-name').textContent = currentUser.email;
    } else {
        const headerBalanceEl = document.getElementById('header-balance');
        if (headerBalanceEl) {
            headerBalanceEl.textContent = '0.00';
        }
    }
}

function showUserPanel() {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-section').style.display = 'flex';
    document.getElementById('logout-btn').style.display = 'block';
    document.getElementById('balance-display').style.display = 'block';
    document.querySelector('.btn-reload-header').style.display = 'none';
    updateHeaderBalance();
}

function showAuthPanel() {
    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('user-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('balance-display').style.display = 'block';
    document.querySelector('.btn-reload-header').style.display = 'block';
}

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

function openAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('⚠️ Proszę wypełnić wszystkie pola');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('auth-modal').classList.remove('active');
        showUserPanel();
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    } else {
        alert('❌ Błędny email lub hasło');
    }
}

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
        balance: 0
    };

    users.push(newUser);
    saveUsers();

    alert('✅ Rejestracja zakończona!');
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-password-confirm').value = '';

    switchTab('login');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAuthPanel();
    alert('✅ Wylogowano pomyślnie');
}

function openReloadModal() {
    if (!currentUser) {
        alert('❌ Musisz być zalogowany');
        return;
    }
    document.getElementById('reload-modal').classList.add('active');
    updateHeaderBalance();
}

function closeReloadModal() {
    document.getElementById('reload-modal').classList.remove('active');
}

function openContactModal() {
    document.getElementById('contact-modal').classList.add('active');
}

function closeContactModal() {
    document.getElementById('contact-modal').classList.remove('active');
}

function selectAmount(amount) {
    currentUser.balance += amount;
    saveUsers();
    updateHeaderBalance();
    closeReloadModal();
}

function reloadCustom() {
    const amount = parseFloat(document.getElementById('custom-amount').value);

    if (!amount || amount <= 0) {
        alert('⚠️ Proszę wpisać prawidłową kwotę');
        return;
    }

    currentUser.balance += amount;
    saveUsers();
    updateHeaderBalance();
    document.getElementById('custom-amount').value = '';
    closeReloadModal();
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.style.display = cartPanel.style.display === 'none' ? 'flex' : 'none';
}

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

function removeFromCart(index) {
    const item = cartItems[index];
    if (currentUser) {
        currentUser.balance += item.price;
        saveUsers();
        updateHeaderBalance();
    }

    cartItems.splice(index, 1);
    cartCount--;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();

    alert(`✅ "${item.name}" została usunięta z koszyka!\nZwrócono: ${item.price.toFixed(2)} zł`);
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

// Funkcja do zapisywania zamówienia
function saveOrder(items, paczkomat, email) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
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

// Optimize mobile touch interactions
function optimizeMobileExperience() {
    // Zapobiegaj double-tap zoom na przyciskach
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Dodaj visual feedback na touch
    const buttons = document.querySelectorAll('button, .btn-add, .btn-auth, .contact-btn, .variant-btn');
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
            document.documentElement.style.fontSize = '16px';
        });
    });
}
