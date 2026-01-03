// ==================== ADMIN PANEL INITIALIZATION ====================
let adminData = {
    users: [],
    products: [],
    services: [],
    orders: [],
    promos: [],
    news: [],
    vipConfig: { enabled: true, minSpend: 100, discount: 5 },
    wheelConfig: { enabled: true, cost: 20, rewards: [] },
    channels: [],
    discounts: [],
    deliveryConfig: { courier: 15, paczkomat: 12 }
};

let currentAdminUser = null;
let currentModule = 'dashboard';

function initializeAdminPanel() {
    const savedAdmin = localStorage.getItem('currentAdmin');
    if (!savedAdmin) {
        window.location.href = 'index.html';
        return;
    }

    currentAdminUser = JSON.parse(savedAdmin);
    loadAdminData();
    setupEventListeners();
    switchModule('dashboard');
}

function loadAdminData() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        adminData.users = JSON.parse(savedUsers);
    }

    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        adminData.orders = JSON.parse(savedOrders);
    }

    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        adminData.products = JSON.parse(savedProducts);
    }

    const savedServices = localStorage.getItem('services');
    if (savedServices) {
        adminData.services = JSON.parse(savedServices);
    }

    const savedPromos = localStorage.getItem('promos');
    if (savedPromos) {
        adminData.promos = JSON.parse(savedPromos);
    }

    const savedNews = localStorage.getItem('news');
    if (savedNews) {
        adminData.news = JSON.parse(savedNews);
    }

    const savedChannels = localStorage.getItem('channels');
    if (savedChannels) {
        adminData.channels = JSON.parse(savedChannels);
    }

    const savedDiscounts = localStorage.getItem('discounts');
    if (savedDiscounts) {
        adminData.discounts = JSON.parse(savedDiscounts);
    }

    const savedVIPConfig = localStorage.getItem('vipConfig');
    if (savedVIPConfig) {
        adminData.vipConfig = JSON.parse(savedVIPConfig);
    }

    const savedWheelConfig = localStorage.getItem('wheelConfig');
    if (savedWheelConfig) {
        adminData.wheelConfig = JSON.parse(savedWheelConfig);
    }

    const savedDeliveryConfig = localStorage.getItem('deliveryConfig');
    if (savedDeliveryConfig) {
        adminData.deliveryConfig = JSON.parse(savedDeliveryConfig);
    }
}

function setupEventListeners() {
    // Setup nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const module = this.getAttribute('data-module');
            switchModule(module);
        });
    });

    // Setup modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // Logout button
    const logoutBtn = document.querySelector('.btn-logout-admin');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }
}

// ==================== MODULE SWITCHING ====================
function switchModule(moduleName) {
    // Hide all modules
    document.querySelectorAll('.admin-module').forEach(m => {
        m.classList.remove('active');
    });

    // Remove active from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected module
    const module = document.getElementById(moduleName + '-module');
    if (module) {
        module.classList.add('active');
    }

    // Set active nav item
    const navItem = document.querySelector(`[data-module="${moduleName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    currentModule = moduleName;

    // Load module data
    switch(moduleName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'products':
            loadProducts();
            break;
        case 'services':
            loadServices();
            break;
        case 'promos':
            loadPromos();
            break;
        case 'news':
            loadNews();
            break;
        case 'channels':
            loadChannels();
            break;
        case 'discounts':
            loadDiscounts();
            break;
        case 'vip':
            loadVIPConfig();
            break;
        case 'wheel':
            loadWheelConfig();
            break;
        case 'delivery':
            loadDeliveryConfig();
            break;
        case 'users':
            loadUsers();
            break;
        case 'approval':
            loadApproval();
            break;
        case 'orders':
            loadOrders();
            break;
        default:
            break;
    }
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    const totalUsers = adminData.users.length;
    const totalOrders = adminData.orders.length;
    const totalRevenue = adminData.orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalProducts = adminData.products.length;

    document.getElementById('stat-users').textContent = totalUsers;
    document.getElementById('stat-orders').textContent = totalOrders;
    document.getElementById('stat-revenue').textContent = totalRevenue.toFixed(2) + ' zł';
    document.getElementById('stat-products').textContent = totalProducts;
}

// ==================== USERS MODULE ====================
function loadUsers() {
    const tableBody = document.getElementById('users-tbody');
    tableBody.innerHTML = '';

    adminData.users.forEach(user => {
        const row = document.createElement('tr');
        const vipStatus = user.vipStatus ? '⭐ VIP' : 'Standardowy';
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>${user.name}</td>
            <td>${(user.balance || 0).toFixed(2)} zł</td>
            <td><span class="status-badge ${user.vipStatus ? 'vip' : 'standard'}">${vipStatus}</span></td>
            <td><span class="status-badge ${user.approved ? 'approved' : 'pending'}">${user.approved ? 'Zatwierdzony' : 'Oczekuje'}</span></td>
            <td>${new Date(user.registeredDate || new Date()).toLocaleDateString('pl-PL')}</td>
            <td>
                <button class="btn-edit" onclick="editUser(${user.id})">Edytuj</button>
                <button class="btn-delete" onclick="deleteUser(${user.id})">Usuń</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        currentModule = 'users';
        // Show user form fields
        document.getElementById('user-form-fields').style.display = 'block';
        document.getElementById('product-form-fields').style.display = 'none';

        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-name').value = user.name || '';
        document.getElementById('edit-user-email').value = user.email;
        document.getElementById('edit-user-balance').value = user.balance || 0;
        
        // Dodaj pole VIP
        const userFormFields = document.getElementById('user-form-fields');
        let vipCheckbox = userFormFields.querySelector('#edit-user-vip');
        if (!vipCheckbox) {
            const vipGroup = document.createElement('div');
            vipGroup.className = 'setting-group';
            vipGroup.innerHTML = `
                <label style="cursor: pointer;">
                    <input type="checkbox" id="edit-user-vip" ${user.vipStatus ? 'checked' : ''}>
                    Status VIP
                </label>
            `;
            userFormFields.appendChild(vipGroup);
        } else {
            vipCheckbox.checked = user.vipStatus || false;
        }
        
        document.getElementById('modal-title').textContent = 'Edytuj Użytkownika';
        document.getElementById('modal-edit-item').classList.add('active');
    }
}

function deleteUser(userId) {
    if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
        adminData.users = adminData.users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(adminData.users));
        loadUsers();
        alert('✅ Użytkownik został usunięty!');
    }
}

// ==================== APPROVAL MODULE ====================
function loadApproval() {
    const container = document.getElementById('approval-container');
    container.innerHTML = '';

    const pendingUsers = adminData.users.filter(u => !u.approved);

    if (pendingUsers.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #aaa;">✓ Brak próśb o akceptację</div>';
        return;
    }

    pendingUsers.forEach(user => {
        const card = document.createElement('div');
        card.className = 'approval-card';
        card.innerHTML = `
            <div class="approval-info">
                <h3>${user.email}</h3>
                <p><strong>Imię:</strong> ${user.name || '-'}</p>
                <p><strong>Data rejestracji:</strong> ${new Date(user.registeredDate || new Date()).toLocaleDateString('pl-PL')}</p>
            </div>
            <div class="approval-actions">
                <button class="btn-approve" onclick="approveUser(${user.id})">✓ Zaakceptuj</button>
                <button class="btn-reject" onclick="rejectUser(${user.id})">✗ Odrzuć</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function approveUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        user.approved = true;
        localStorage.setItem('users', JSON.stringify(adminData.users));
        loadApproval();
        alert('✅ Użytkownik ' + user.email + ' został zaakceptowany!');
    }
}

function rejectUser(userId) {
    if (confirm('Czy na pewno chcesz odrzucić tego użytkownika?')) {
        adminData.users = adminData.users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(adminData.users));
        loadApproval();
        alert('❌ Użytkownik został odrzucony!');
    }
}

// ==================== PRODUCTS MODULE ====================
function loadProducts() {
    const tableBody = document.getElementById('products-tbody');
    tableBody.innerHTML = '';

    adminData.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)} zł</td>
            <td>${product.description || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">Edytuj</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Usuń</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editProduct(productId) {
    const product = adminData.products.find(p => p.id === productId);
    if (product) {
        currentModule = 'products';
        // Show product form fields
        document.getElementById('user-form-fields').style.display = 'none';
        document.getElementById('product-form-fields').style.display = 'block';

        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-price').value = product.price;
        document.getElementById('edit-product-desc').value = product.description || '';
        
        // Dodaj pole dla zdjęcia i wariantów
        const productFormFields = document.getElementById('product-form-fields');
        let imageInput = productFormFields.querySelector('#edit-product-image');
        let variantsInput = productFormFields.querySelector('#edit-product-variants');
        
        if (!imageInput) {
            const imageGroup = document.createElement('div');
            imageGroup.className = 'setting-group';
            imageGroup.innerHTML = `
                <label>Zdjęcie Produktu:</label>
                <input type="text" id="edit-product-image" class="input-field" placeholder="Nazwa pliku (np. jeden.png)">
            `;
            productFormFields.insertBefore(imageGroup, productFormFields.querySelector('.setting-group:nth-child(4)'));
        } else {
            imageInput.value = product.image || '';
        }
        
        if (!variantsInput) {
            const variantsGroup = document.createElement('div');
            variantsGroup.className = 'setting-group';
            variantsGroup.innerHTML = `
                <label>Warianty Produktu (JSON):</label>
                <textarea id="edit-product-variants" class="input-field" placeholder='[{"name":"2g","price":100},{"name":"5g","price":200}]' style="min-height: 100px;"></textarea>
            `;
            productFormFields.appendChild(variantsGroup);
        } else {
            variantsInput.value = JSON.stringify(product.variants || []);
        }
        
        document.getElementById('modal-title').textContent = 'Edytuj Produkt';
        document.getElementById('modal-edit-item').classList.add('active');
    }
}

function deleteProduct(productId) {
    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
        adminData.products = adminData.products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(adminData.products));
        loadProducts();
        alert('✅ Produkt został usunięty!');
    }
}

// ==================== SERVICES MODULE ====================
function loadServices() {
    const tableBody = document.getElementById('services-tbody');
    tableBody.innerHTML = '';

    adminData.services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.name}</td>
            <td>${service.price.toFixed(2)} zł</td>
            <td>${service.description || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editService(${service.id})">Edytuj</button>
                <button class="btn-delete" onclick="deleteService(${service.id})">Usuń</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editService(serviceId) {
    const service = adminData.services.find(s => s.id === serviceId);
    if (service) {
        currentModule = 'services';
        document.getElementById('user-form-fields').style.display = 'none';
        document.getElementById('product-form-fields').style.display = 'block';
        
        document.getElementById('edit-product-id').value = service.id;
        document.getElementById('edit-product-name').value = service.name;
        document.getElementById('edit-product-price').value = service.price;
        document.getElementById('edit-product-desc').value = service.description || '';
        document.getElementById('modal-title').textContent = 'Edytuj Usługę';
        document.getElementById('modal-edit-item').classList.add('active');
    }
}

function deleteService(serviceId) {
    if (confirm('Czy na pewno chcesz usunąć tę usługę?')) {
        adminData.services = adminData.services.filter(s => s.id !== serviceId);
        localStorage.setItem('services', JSON.stringify(adminData.services));
        loadServices();
        alert('✅ Usługa została usunięta!');
    }
}

// ==================== PROMOS MODULE ====================
function loadPromos() {
    const tableBody = document.getElementById('promos-tbody');
    tableBody.innerHTML = '';
    adminData.promos.forEach(promo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${promo.id}</td>
            <td>${promo.name}</td>
            <td>${promo.price ? promo.price.toFixed(2) : '-'} zł</td>
            <td>${promo.description || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editPromo(${promo.id})">Edytuj</button>
                <button class="btn-delete" onclick="deletePromo(${promo.id})">Usuń</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editPromo(promoId) {
    const promo = adminData.promos.find(p => p.id === promoId);
    if (promo) {
        currentModule = 'promos';
        document.getElementById('user-form-fields').style.display = 'none';
        document.getElementById('product-form-fields').style.display = 'block';
        document.getElementById('edit-product-id').value = promo.id;
        document.getElementById('edit-product-name').value = promo.name;
        document.getElementById('edit-product-price').value = promo.price || 0;
        document.getElementById('edit-product-desc').value = promo.description || '';
        document.getElementById('modal-title').textContent = 'Edytuj Promocję';
        document.getElementById('modal-edit-item').classList.add('active');
    }
}

function deletePromo(promoId) {
    if (confirm('Czy chcesz usunąć tę promocję?')) {
        adminData.promos = adminData.promos.filter(p => p.id !== promoId);
        localStorage.setItem('promos', JSON.stringify(adminData.promos));
        loadPromos();
        alert('✅ Promocja została usunięta!');
    }
}

// ==================== ORDERS MODULE ====================
function loadOrders() {
    const tableBody = document.getElementById('orders-tbody');
    tableBody.innerHTML = '';

    adminData.orders.forEach(order => {
        const itemsText = order.items.map(i => i.name).join(', ');
        const paczkomatText = order.paczkomat || '-';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.userEmail}</td>
            <td>${itemsText}</td>
            <td>${order.totalPrice.toFixed(2)} zł</td>
            <td>${paczkomatText}</td>
            <td>${new Date(order.date).toLocaleDateString('pl-PL')}</td>
            <td>${order.status || 'Nowe'}</td>
            <td>
                <button class="btn-view" onclick="viewOrder(${order.id})">Szczegóły</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewOrder(orderId) {
    const order = adminData.orders.find(o => o.id === orderId);
    if (order) {
        const itemsHtml = order.items.map(i => `
            <tr>
                <td>${i.name}</td>
                <td>${i.quantity}</td>
                <td>${i.price.toFixed(2)} zł</td>
            </tr>
        `).join('');

        const modalContent = document.querySelector('#modal-order-details .modal-content');
        modalContent.innerHTML = `
            <span class="close-btn">&times;</span>
            <h3>Zamówienie #${order.id}</h3>
            <p><strong>Email:</strong> ${order.userEmail}</p>
            <p><strong>Data:</strong> ${new Date(order.date).toLocaleDateString('pl-PL')}</p>
            <p><strong>Status:</strong> ${order.status || 'Nowe'}</p>
            <p><strong>Dostawa:</strong> ${order.paczkomat || 'Nie określono'}</p>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Ilość</th>
                        <th>Cena</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            <p><strong>Razem:</strong> ${order.totalPrice.toFixed(2)} zł</p>
        `;
        
        document.getElementById('modal-order-details').classList.add('active');
        
        // Re-attach close button listener
        document.querySelector('#modal-order-details .close-btn').addEventListener('click', function() {
            document.getElementById('modal-order-details').classList.remove('active');
        });
    }
}

// ==================== FORM HANDLING ====================
function saveItem() {
    const form = document.getElementById('form-edit-item');
    if (currentModule === 'users') {
        const userIdVal = document.getElementById('edit-user-id').value;
        if (userIdVal) {
            // Edit user
            const userId = parseInt(userIdVal);
            const user = adminData.users.find(u => u.id === userId);
            if (user) {
                user.name = document.getElementById('edit-user-name').value;
                user.email = document.getElementById('edit-user-email').value;
                user.balance = parseFloat(document.getElementById('edit-user-balance').value) || 0;
                const vipCheckbox = document.getElementById('edit-user-vip');
                user.vipStatus = vipCheckbox ? vipCheckbox.checked : false;
                localStorage.setItem('users', JSON.stringify(adminData.users));
                loadUsers();
                document.getElementById('modal-edit-item').classList.remove('active');
                alert('✅ Użytkownik został zaktualizowany!');
            }
        }
    } else if (currentModule === 'products') {
        const productIdVal = document.getElementById('edit-product-id').value;
        if (productIdVal) {
            // Edit product
            const productId = parseInt(productIdVal);
            const product = adminData.products.find(p => p.id === productId);
            if (product) {
                product.name = document.getElementById('edit-product-name').value;
                product.price = parseFloat(document.getElementById('edit-product-price').value);
                product.description = document.getElementById('edit-product-desc').value;
                
                // Dodaj zdjęcie jeśli istnieje pole
                const imageInput = document.getElementById('edit-product-image');
                if (imageInput) {
                    product.image = imageInput.value || product.image;
                }
                
                // Dodaj warianty jeśli istnieje pole
                const variantsInput = document.getElementById('edit-product-variants');
                if (variantsInput && variantsInput.value) {
                    try {
                        product.variants = JSON.parse(variantsInput.value);
                    } catch(e) {
                        alert('⚠️ Błąd w formacie JSON wariantów');
                        return;
                    }
                }
                
                localStorage.setItem('products', JSON.stringify(adminData.products));
                loadProducts();
                document.getElementById('modal-edit-item').classList.remove('active');
                alert('✅ Produkt został zaktualizowany!');
            }
        } else {
            // Add new product
            const newProduct = {
                id: Math.max(...adminData.products.map(p => p.id), 0) + 1,
                name: document.getElementById('edit-product-name').value,
                price: parseFloat(document.getElementById('edit-product-price').value),
                description: document.getElementById('edit-product-desc').value,
                image: document.getElementById('edit-product-image')?.value || 'default.jpg'
            };
            
            // Dodaj warianty dla nowego produktu
            const variantsInput = document.getElementById('edit-product-variants');
            if (variantsInput && variantsInput.value) {
                try {
                    newProduct.variants = JSON.parse(variantsInput.value);
                } catch(e) {
                    alert('⚠️ Błąd w formacie JSON wariantów');
                    return;
                }
            }
            
            adminData.products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(adminData.products));
            loadProducts();
            document.getElementById('modal-edit-item').classList.remove('active');
            alert('✅ Nowy produkt został dodany!');
        }
    } else if (currentModule === 'services') {
        const serviceIdVal = document.getElementById('edit-product-id').value;
        if (serviceIdVal) {
            // Edit service
            const serviceId = parseInt(serviceIdVal);
            const service = adminData.services.find(s => s.id === serviceId);
            if (service) {
                service.name = document.getElementById('edit-product-name').value;
                service.price = parseFloat(document.getElementById('edit-product-price').value);
                service.description = document.getElementById('edit-product-desc').value;
                localStorage.setItem('services', JSON.stringify(adminData.services));
                loadServices();
                document.getElementById('modal-edit-item').classList.remove('active');
                alert('✅ Usługa została zaktualizowana!');
            }
        } else {
            // Add new service
            const newService = {
                id: Math.max(...adminData.services.map(s => s.id), 0) + 1,
                name: document.getElementById('edit-product-name').value,
                price: parseFloat(document.getElementById('edit-product-price').value),
                description: document.getElementById('edit-product-desc').value
            };
            adminData.services.push(newService);
            localStorage.setItem('services', JSON.stringify(adminData.services));
            loadServices();
            document.getElementById('modal-edit-item').classList.remove('active');
            alert('✅ Nowa usługa została dodana!');
        }
    } else if (currentModule === 'promos') {
        const promoIdVal = document.getElementById('edit-product-id').value;
        if (promoIdVal) {
            // Edit promo
            const promoId = parseInt(promoIdVal);
            const promo = adminData.promos.find(p => p.id === promoId);
            if (promo) {
                promo.name = document.getElementById('edit-product-name').value;
                promo.price = parseFloat(document.getElementById('edit-product-price').value);
                promo.description = document.getElementById('edit-product-desc').value;
                localStorage.setItem('promos', JSON.stringify(adminData.promos));
                loadPromos();
                document.getElementById('modal-edit-item').classList.remove('active');
                alert('✅ Promocja została zaktualizowana!');
            }
        } else {
            // Add new promo
            const newPromo = {
                id: Math.max(...adminData.promos.map(p => p.id), 0) + 1,
                name: document.getElementById('edit-product-name').value,
                price: parseFloat(document.getElementById('edit-product-price').value),
                description: document.getElementById('edit-product-desc').value
            };
            adminData.promos.push(newPromo);
            localStorage.setItem('promos', JSON.stringify(adminData.promos));
            loadPromos();
            document.getElementById('modal-edit-item').classList.remove('active');
            alert('✅ Nowa promocja została dodana!');
        }
    } else if (currentModule === 'news') {
        const newsIdVal = document.getElementById('edit-product-id').value;
        if (newsIdVal) {
            // Edit news
            const newsId = parseInt(newsIdVal);
            const newsItem = adminData.news.find(n => n.id === newsId);
            if (newsItem) {
                newsItem.name = document.getElementById('edit-product-name').value;
                newsItem.price = parseFloat(document.getElementById('edit-product-price').value);
                newsItem.description = document.getElementById('edit-product-desc').value;
                localStorage.setItem('news', JSON.stringify(adminData.news));
                loadNews();
                document.getElementById('modal-edit-item').classList.remove('active');
                alert('✅ Nowość została zaktualizowana!');
            }
        } else {
            // Add new news
            const newNews = {
                id: Math.max(...adminData.news.map(n => n.id), 0) + 1,
                name: document.getElementById('edit-product-name').value,
                price: parseFloat(document.getElementById('edit-product-price').value),
                description: document.getElementById('edit-product-desc').value
            };
            adminData.news.push(newNews);
            localStorage.setItem('news', JSON.stringify(adminData.news));
            loadNews();
            document.getElementById('modal-edit-item').classList.remove('active');
            alert('✅ Nowa nowość została dodana!');
        }
    } else if (currentModule === 'channels') {
        const channelIdVal = document.getElementById('edit-product-id').value;
        if (channelIdVal) {
            // Edit channel
            const channelId = parseInt(channelIdVal);
            const channel = adminData.channels.find(c => c.id === channelId);
            if (channel) {
                channel.name = document.getElementById('edit-product-name').value;
                channel.price = parseFloat(document.getElementById('edit-product-price').value);
                channel.description = document.getElementById('edit-product-desc').value;
                localStorage.setItem('channels', JSON.stringify(adminData.channels));
                loadChannels();
                document.getElementById('modal-edit-item').classList.remove('active');
                alert('✅ Kanał został zaktualizowany!');
            }
        } else {
            // Add new channel
            const newChannel = {
                id: Math.max(...adminData.channels.map(c => c.id), 0) + 1,
                name: document.getElementById('edit-product-name').value,
                price: parseFloat(document.getElementById('edit-product-price').value),
                description: document.getElementById('edit-product-desc').value
            };
            adminData.channels.push(newChannel);
            localStorage.setItem('channels', JSON.stringify(adminData.channels));
            loadChannels();
            document.getElementById('modal-edit-item').classList.remove('active');
            alert('✅ Nowy kanał został dodany!');
        }
    } else if (currentModule === 'discounts') {
        const discountIdVal = document.getElementById('edit-product-id').value;
        if (discountIdVal) {
            // Edit discount
            const discountId = parseInt(discountIdVal);
            const discount = adminData.discounts.find(d => d.id === discountId);
            if (discount) {
                discount.name = document.getElementById('edit-product-name').value;
                discount.price = parseFloat(document.getElementById('edit-product-price').value);
                discount.description = document.getElementById('edit-product-desc').value;
                localStorage.setItem('discounts', JSON.stringify(adminData.discounts));
                loadDiscounts();
                document.getElementById('modal-edit-item').classList.remove('active');
                alert('✅ Zniżka została zaktualizowana!');
            }
        } else {
            // Add new discount
            const newDiscount = {
                id: Math.max(...adminData.discounts.map(d => d.id), 0) + 1,
                name: document.getElementById('edit-product-name').value,
                price: parseFloat(document.getElementById('edit-product-price').value),
                description: document.getElementById('edit-product-desc').value
            };
            adminData.discounts.push(newDiscount);
            localStorage.setItem('discounts', JSON.stringify(adminData.discounts));
            loadDiscounts();
            document.getElementById('modal-edit-item').classList.remove('active');
            alert('✅ Nowa zniżka została dodana!');
        }
    }
}

// ==================== STUB FUNCTIONS ====================
function openAddModal() {
    if (!currentModule) {
        alert('⚠️ Proszę wybrać moduł najpierw!');
        return;
    }
    
    const moduleNames = {
        products: 'Nowy Produkt',
        services: 'Nową Usługę',
        promos: 'Nową Promocję',
        news: 'Nowość'
    };
    
    const title = moduleNames[currentModule] || 'Nowy Element';
    
    document.getElementById('user-form-fields').style.display = 'none';
    document.getElementById('product-form-fields').style.display = 'block';
    document.getElementById('edit-product-id').value = '';
    document.getElementById('edit-product-name').value = '';
    document.getElementById('edit-product-price').value = '';
    document.getElementById('edit-product-desc').value = '';
    document.getElementById('modal-title').textContent = `Dodaj ${title}`;
    document.getElementById('modal-edit-item').classList.add('active');
}

function openProductModal() {
    // Clear form fields
    document.getElementById('user-form-fields').style.display = 'none';
    document.getElementById('product-form-fields').style.display = 'block';

    document.getElementById('edit-product-id').value = '';
    document.getElementById('edit-product-name').value = '';
    document.getElementById('edit-product-price').value = '';
    document.getElementById('edit-product-desc').value = '';
    
    // Usuń stare pola jeśli istnieją
    const productFormFields = document.getElementById('product-form-fields');
    const oldImageInput = productFormFields.querySelector('#edit-product-image');
    const oldVariantsInput = productFormFields.querySelector('#edit-product-variants');
    if (oldImageInput) oldImageInput.parentElement.remove();
    if (oldVariantsInput) oldVariantsInput.parentElement.remove();
    
    // Dodaj nowe pola
    const imageGroup = document.createElement('div');
    imageGroup.className = 'setting-group';
    imageGroup.innerHTML = `
        <label>Zdjęcie Produktu:</label>
        <input type="text" id="edit-product-image" class="input-field" placeholder="Nazwa pliku (np. jeden.png)">
    `;
    
    const variantsGroup = document.createElement('div');
    variantsGroup.className = 'setting-group';
    variantsGroup.innerHTML = `
        <label>Warianty Produktu (JSON):</label>
        <textarea id="edit-product-variants" class="input-field" placeholder='[{"name":"2g","price":100},{"name":"5g","price":200}]' style="min-height: 100px;"></textarea>
    `;
    
    productFormFields.appendChild(imageGroup);
    productFormFields.appendChild(variantsGroup);
    
    document.getElementById('modal-title').textContent = 'Dodaj Nowy Produkt';
    document.getElementById('modal-edit-item').classList.add('active');
}

function openServiceModal() {
    currentModule = 'services';
    document.getElementById('user-form-fields').style.display = 'none';
    document.getElementById('product-form-fields').style.display = 'block';
    document.getElementById('edit-product-id').value = '';
    document.getElementById('edit-product-name').value = '';
    document.getElementById('edit-product-price').value = '';
    document.getElementById('edit-product-desc').value = '';
    document.getElementById('modal-title').textContent = 'Dodaj Nową Usługę';
    document.getElementById('modal-edit-item').classList.add('active');
}
function openPromoModal() {
    currentModule = 'promos';
    document.getElementById('user-form-fields').style.display = 'none';
    document.getElementById('product-form-fields').style.display = 'block';
    document.getElementById('edit-product-id').value = '';
    document.getElementById('edit-product-name').value = '';
    document.getElementById('edit-product-price').value = '';
    document.getElementById('edit-product-desc').value = '';
    document.getElementById('modal-title').textContent = 'Dodaj Nową Promocję';
    document.getElementById('modal-edit-item').classList.add('active');
}
function openNewsModal() {
    currentModule = 'news';
    document.getElementById('user-form-fields').style.display = 'none';
    document.getElementById('product-form-fields').style.display = 'block';
    document.getElementById('edit-product-id').value = '';
    document.getElementById('edit-product-name').value = '';
    document.getElementById('edit-product-price').value = '';
    document.getElementById('edit-product-desc').value = '';
    document.getElementById('modal-title').textContent = 'Dodaj Nowość';
    document.getElementById('modal-edit-item').classList.add('active');
}

// ==================== NEWS MODULE ====================
function loadNews() {
    const tableBody = document.getElementById('news-tbody');
    tableBody.innerHTML = '';
    adminData.news.forEach(newsItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newsItem.id}</td>
            <td>${newsItem.name}</td>
            <td>${newsItem.price ? newsItem.price.toFixed(2) : '-'} zł</td>
            <td>${newsItem.description || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editNews(${newsItem.id})">Edytuj</button>
                <button class="btn-delete" onclick="deleteNews(${newsItem.id})">Usuń</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editNews(newsId) {
    const newsItem = adminData.news.find(n => n.id === newsId);
    if (newsItem) {
        currentModule = 'news';
        document.getElementById('user-form-fields').style.display = 'none';
        document.getElementById('product-form-fields').style.display = 'block';
        document.getElementById('edit-product-id').value = newsItem.id;
        document.getElementById('edit-product-name').value = newsItem.name;
        document.getElementById('edit-product-price').value = newsItem.price || 0;
        document.getElementById('edit-product-desc').value = newsItem.description || '';
        document.getElementById('modal-title').textContent = 'Edytuj Nowość';
        document.getElementById('modal-edit-item').classList.add('active');
    }
}

function deleteNews(newsId) {
    if (confirm('Czy chcesz usunąć tę nowość?')) {
        adminData.news = adminData.news.filter(n => n.id !== newsId);
        localStorage.setItem('news', JSON.stringify(adminData.news));
        loadNews();
        alert('✅ Nowość została usunięta!');
    }
}

// ==================== CHANNELS MODULE ====================
function loadChannels() {
    const tableBody = document.getElementById('channels-tbody');
    tableBody.innerHTML = '';
    adminData.channels.forEach(channel => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${channel.id}</td>
            <td>${channel.name}</td>
            <td>${channel.price ? channel.price.toFixed(2) : '-'} zł</td>
            <td>${channel.description || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editChannel(${channel.id})">Edytuj</button>
                <button class="btn-delete" onclick="deleteChannel(${channel.id})">Usuń</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editChannel(channelId) {
    const channel = adminData.channels.find(c => c.id === channelId);
    if (channel) {
        currentModule = 'channels';
        document.getElementById('user-form-fields').style.display = 'none';
        document.getElementById('product-form-fields').style.display = 'block';
        document.getElementById('edit-product-id').value = channel.id;
        document.getElementById('edit-product-name').value = channel.name;
        document.getElementById('edit-product-price').value = channel.price || 0;
        document.getElementById('edit-product-desc').value = channel.description || '';
        document.getElementById('modal-title').textContent = 'Edytuj Kanał';
        document.getElementById('modal-edit-item').classList.add('active');
    }
}

function deleteChannel(channelId) {
    if (confirm('Czy chcesz usunąć ten kanał?')) {
        adminData.channels = adminData.channels.filter(c => c.id !== channelId);
        localStorage.setItem('channels', JSON.stringify(adminData.channels));
        loadChannels();
        alert('✅ Kanał został usunięty!');
    }
}

// ==================== DISCOUNTS MODULE ====================
function loadDiscounts() {
    const tableBody = document.getElementById('discounts-tbody');
    tableBody.innerHTML = '';
    adminData.discounts.forEach(discount => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${discount.id}</td>
            <td>${discount.userEmail || discount.email || '-'}</td>
            <td>${discount.type || 'Procent'}</td>
            <td>${discount.percentage || discount.value || 0}%</td>
            <td>${new Date(discount.expiryDate || new Date()).toLocaleDateString('pl-PL')}</td>
            <td>
                <button class="btn-edit" onclick="editDiscount(${discount.id})">Edytuj</button>
                <button class="btn-delete" onclick="deleteDiscount(${discount.id})">Usuń</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editDiscount(discountId) {
    const discount = adminData.discounts.find(d => d.id === discountId);
    if (discount) {
        currentModule = 'discounts';
        document.getElementById('user-form-fields').style.display = 'none';
        document.getElementById('product-form-fields').style.display = 'block';
        document.getElementById('edit-product-id').value = discount.id;
        document.getElementById('edit-product-name').value = discount.userEmail || discount.email || '';
        document.getElementById('edit-product-price').value = discount.percentage || discount.value || 0;
        document.getElementById('edit-product-desc').value = discount.type || 'Procent';
        document.getElementById('modal-title').textContent = 'Edytuj Zniżkę';
        document.getElementById('modal-edit-item').classList.add('active');
    }
}

function deleteDiscount(discountId) {
    if (confirm('Czy chcesz usunąć tę zniżkę?')) {
        adminData.discounts = adminData.discounts.filter(d => d.id !== discountId);
        localStorage.setItem('discounts', JSON.stringify(adminData.discounts));
        loadDiscounts();
        alert('✅ Zniżka została usunięta!');
    }
}

function openWheelRewardsModal() {
    const config = adminData.wheelConfig;
    const modalContent = document.querySelector('.modal-content');
    
    let rewardsHTML = '<h3>Edytuj Nagrody Koła Fortuny</h3>';
    rewardsHTML += '<div class="rewards-list">';
    
    config.rewards.forEach((reward, index) => {
        rewardsHTML += `
            <div class="reward-item" style="padding: 12px; border: 1px solid #D4A017; border-radius: 8px; margin-bottom: 10px; background: rgba(26,26,46,0.3);">
                <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                    <input type="text" placeholder="Nazwa" value="${reward.name}" id="reward-name-${index}" style="flex: 1; padding: 6px; border: 1px solid #D4A017; border-radius: 6px;">
                    <input type="number" placeholder="Zniżka %" value="${reward.discount}" id="reward-discount-${index}" style="width: 100px; padding: 6px; border: 1px solid #D4A017; border-radius: 6px;">
                </div>
                <div style="display: flex; gap: 10px;">
                    <input type="color" value="${reward.color}" id="reward-color-${index}" style="width: 50px; height: 40px; border: 1px solid #D4A017; border-radius: 6px; cursor: pointer;">
                    <button style="flex: 1; padding: 6px; background: #D4A017; color: white; border: none; border-radius: 6px; cursor: pointer;" onclick="deleteReward(${index})">Usuń</button>
                </div>
            </div>
        `;
    });
    
    rewardsHTML += '</div>';
    rewardsHTML += '<div style="margin-top: 20px; display: flex; gap: 10px;">';
    rewardsHTML += '<button class="btn-action" onclick="saveWheelRewardsChanges()" style="flex: 1;">Zapisz Zmiany</button>';
    rewardsHTML += '<button class="btn-action" onclick="openAddRewardModal()" style="flex: 1; background: #2ECC71;">+ Dodaj Nagrodę</button>';
    rewardsHTML += '</div>';
    
    modalContent.innerHTML = rewardsHTML;
    document.getElementById('modal-edit-item').classList.add('active');
}

function openAddRewardModal() {
    const config = adminData.wheelConfig;
    const newReward = {
        name: 'Nowa Nagroda',
        discount: 5,
        color: '#FF6B6B'
    };
    config.rewards.push(newReward);
    openWheelRewardsModal();
}

function deleteReward(index) {
    if (confirm('Czy chcesz usunąć tę nagrodę?')) {
        adminData.wheelConfig.rewards.splice(index, 1);
        openWheelRewardsModal();
    }
}

function saveWheelRewardsChanges() {
    const config = adminData.wheelConfig;
    config.rewards.forEach((reward, index) => {
        reward.name = document.getElementById(`reward-name-${index}`).value || 'Nagroda';
        reward.discount = parseFloat(document.getElementById(`reward-discount-${index}`).value) || 0;
        reward.color = document.getElementById(`reward-color-${index}`).value || '#FF6B6B';
    });
    localStorage.setItem('wheelConfig', JSON.stringify(adminData.wheelConfig));
    alert('✅ Nagrody koła zostały zaktualizowane!');
    document.getElementById('modal-edit-item').classList.remove('active');
    loadWheelConfig();
}
function openChannelModal() {
    currentModule = 'channels';
    document.getElementById('user-form-fields').style.display = 'none';
    document.getElementById('product-form-fields').style.display = 'block';
    document.getElementById('edit-product-id').value = '';
    document.getElementById('edit-product-name').value = '';
    document.getElementById('edit-product-price').value = '';
    document.getElementById('edit-product-desc').value = '';
    document.getElementById('modal-title').textContent = 'Dodaj Kanał';
    document.getElementById('modal-edit-item').classList.add('active');
}
function openDiscountModal() {
    currentModule = 'discounts';
    const modal = document.getElementById('modal-edit-item');
    const title = document.getElementById('modal-title');
    const userFields = document.getElementById('user-form-fields');
    const productFields = document.getElementById('product-form-fields');
    
    title.textContent = 'Dodaj Nową Zniżkę';
    userFields.style.display = 'none';
    productFields.style.display = 'block';
    
    // Wyczyść pola
    document.getElementById('edit-product-id').value = '';
    document.getElementById('edit-product-name').value = ''; // Email
    document.getElementById('edit-product-price').value = ''; // Procent
    document.getElementById('edit-product-desc').value = 'Procent'; // Typ
    
    // Dodaj inny HTML dla tego modulu
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close-btn" onclick="this.closest('.modal').classList.remove('active')">&times;</span>
            <h3>Dodaj Nową Zniżkę</h3>
            <form id="discount-form">
                <div class="setting-group">
                    <label>Typ Zniżki:</label>
                    <select id="discount-type-select" class="input-field" onchange="updateDiscountForm()">
                        <option value="product">Na Produkt (Procent)</option>
                        <option value="user">Dla Użytkownika (Email)</option>
                    </select>
                </div>
                
                <!-- Dla produktu -->
                <div id="product-discount-fields">
                    <div class="setting-group">
                        <label>Wybierz Produkt:</label>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" id="product-search" placeholder="Szukaj lub wpisz ID produktu" class="input-field" style="flex: 1;">
                            <button type="button" class="btn-action" onclick="searchProduct()" style="width: auto;">Szukaj</button>
                        </div>
                        <div id="product-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #D4A017; border-radius: 6px; padding: 10px;">
                            <!-- Produkty będą wyświetlane tutaj -->
                        </div>
                        <input type="hidden" id="selected-product-id">
                        <div id="selected-product-display" style="margin-top: 10px; padding: 10px; background: rgba(212,160,23,0.2); border-radius: 6px; display: none;">
                            <strong id="selected-product-name"></strong> (ID: <span id="selected-product-show-id"></span>)
                        </div>
                    </div>
                    <div class="setting-group">
                        <label>Procent Zniżki (%):</label>
                        <input type="number" id="discount-percentage" class="input-field" placeholder="10" min="0" max="100">
                    </div>
                </div>
                
                <!-- Dla użytkownika -->
                <div id="user-discount-fields" style="display: none;">
                    <div class="setting-group">
                        <label>Email Użytkownika:</label>
                        <input type="email" id="discount-user-email" class="input-field" placeholder="user@example.com">
                    </div>
                    <div class="setting-group">
                        <label>Procent Zniżki (%):</label>
                        <input type="number" id="discount-user-percentage" class="input-field" placeholder="10" min="0" max="100">
                    </div>
                </div>
                
                <button type="button" class="btn-action" onclick="saveDiscount()" style="width: 100%;">Zapisz Zniżkę</button>
            </form>
        </div>
    `;
    
    // Załaduj produkty do listy
    loadProductsForDiscount();
    modal.classList.add('active');
}

function updateDiscountForm() {
    const type = document.getElementById('discount-type-select').value;
    document.getElementById('product-discount-fields').style.display = type === 'product' ? 'block' : 'none';
    document.getElementById('user-discount-fields').style.display = type === 'user' ? 'block' : 'none';
}

function loadProductsForDiscount() {
    const list = document.getElementById('product-list');
    if (!list) return;
    
    list.innerHTML = '';
    adminData.products.forEach(product => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 8px; border-bottom: 1px solid #D4A017; cursor: pointer; border-radius: 4px;';
        item.innerHTML = `<strong>${product.name}</strong> (ID: ${product.id}) - ${product.price.toFixed(2)} zł`;
        item.onmouseover = () => item.style.background = 'rgba(212,160,23,0.3)';
        item.onmouseout = () => item.style.background = 'transparent';
        item.onclick = () => selectProductForDiscount(product.id, product.name);
        list.appendChild(item);
    });
}

function searchProduct() {
    const search = document.getElementById('product-search').value.toLowerCase();
    const list = document.getElementById('product-list');
    
    list.innerHTML = '';
    let found = false;
    
    adminData.products.forEach(product => {
        const name = product.name.toLowerCase();
        const id = product.id.toString();
        
        if (name.includes(search) || id.includes(search)) {
            found = true;
            const item = document.createElement('div');
            item.style.cssText = 'padding: 8px; border-bottom: 1px solid #D4A017; cursor: pointer; border-radius: 4px;';
            item.innerHTML = `<strong>${product.name}</strong> (ID: ${product.id}) - ${product.price.toFixed(2)} zł`;
            item.onmouseover = () => item.style.background = 'rgba(212,160,23,0.3)';
            item.onmouseout = () => item.style.background = 'transparent';
            item.onclick = () => selectProductForDiscount(product.id, product.name);
            list.appendChild(item);
        }
    });
    
    if (!found) {
        list.innerHTML = '<div style="padding: 10px; color: #888;">Nie znaleziono produktów</div>';
    }
}

function selectProductForDiscount(productId, productName) {
    document.getElementById('selected-product-id').value = productId;
    document.getElementById('selected-product-name').textContent = productName;
    document.getElementById('selected-product-show-id').textContent = productId;
    document.getElementById('selected-product-display').style.display = 'block';
}

function saveDiscount() {
    const type = document.getElementById('discount-type-select').value;
    
    if (type === 'product') {
        const productId = parseInt(document.getElementById('selected-product-id').value);
        const percentage = parseFloat(document.getElementById('discount-percentage').value);
        
        if (!productId) {
            alert('⚠️ Proszę wybrać produkt');
            return;
        }
        if (!percentage || percentage <= 0 || percentage > 100) {
            alert('⚠️ Proszę wpisać prawidłowy procent (0-100)');
            return;
        }
        
        const product = adminData.products.find(p => p.id === productId);
        const newDiscount = {
            id: Math.max(...adminData.discounts.map(d => d.id), 0) + 1,
            productId: productId,
            productName: product.name,
            percentage: percentage,
            type: 'product',
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        adminData.discounts.push(newDiscount);
        localStorage.setItem('discounts', JSON.stringify(adminData.discounts));
        loadDiscounts();
        document.getElementById('modal-edit-item').classList.remove('active');
        alert(`✅ Zniżka ${percentage}% na "${product.name}" została dodana!`);
        
    } else {
        const email = document.getElementById('discount-user-email').value;
        const percentage = parseFloat(document.getElementById('discount-user-percentage').value);
        
        if (!email) {
            alert('⚠️ Proszę wpisać email użytkownika');
            return;
        }
        if (!percentage || percentage <= 0 || percentage > 100) {
            alert('⚠️ Proszę wpisać prawidłowy procent (0-100)');
            return;
        }
        
        const user = adminData.users.find(u => u.email === email);
        if (!user) {
            alert('⚠️ Użytkownik nie istnieje');
            return;
        }
        
        const newDiscount = {
            id: Math.max(...adminData.discounts.map(d => d.id), 0) + 1,
            userEmail: email,
            percentage: percentage,
            type: 'user',
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        adminData.discounts.push(newDiscount);
        localStorage.setItem('discounts', JSON.stringify(adminData.discounts));
        loadDiscounts();
        document.getElementById('modal-edit-item').classList.remove('active');
        alert(`✅ Zniżka ${percentage}% dla "${email}" została dodana!`);
    }
}
function loadVIPConfig() {
    const config = adminData.vipConfig;
    const content = document.getElementById('vip-module');
    content.innerHTML = `
        <div class="settings-panel">
            <h3>Konfiguracja VIP</h3>
            <div class="setting-group">
                <label>Cena Abonamentu VIP (zł):</label>
                <input type="number" id="vip-price" class="input-field" value="${config.minSpend || 100}" placeholder="100">
            </div>
            <div class="setting-group">
                <label>Rabat VIP (%):</label>
                <input type="number" id="vip-discount" class="input-field" value="${config.discount || 5}" placeholder="5">
            </div>
            <div class="setting-group">
                <label style="cursor: pointer;">
                    <input type="checkbox" id="vip-enabled" ${config.enabled ? 'checked' : ''}>
                    Program VIP Aktywny
                </label>
            </div>
            <button class="btn-action" onclick="saveVIPConfigReal()">Zapisz Konfigurację</button>
        </div>
    `;
}

function saveVIPConfigReal() {
    adminData.vipConfig.minSpend = parseFloat(document.getElementById('vip-price').value) || 100;
    adminData.vipConfig.discount = parseFloat(document.getElementById('vip-discount').value) || 5;
    adminData.vipConfig.enabled = document.getElementById('vip-enabled').checked;
    localStorage.setItem('vipConfig', JSON.stringify(adminData.vipConfig));
    alert('✅ Konfiguracja VIP została zapisana!');
}

// ==================== WHEEL CONFIGURATION ====================
function loadWheelConfig() {
    const config = adminData.wheelConfig;
    const content = document.getElementById('wheel-module');
    content.innerHTML = `
        <div class="settings-panel">
            <h3>Konfiguracja Koła Fortuny</h3>
            <div class="setting-group">
                <label>Koszt kręcenia (zł):</label>
                <input type="number" id="wheel-cost" class="input-field" value="${config.cost || 20}" placeholder="20">
            </div>
            <div class="setting-group">
                <label style="cursor: pointer;">
                    <input type="checkbox" id="wheel-enabled" ${config.enabled ? 'checked' : ''}>
                    Koło Fortuny Aktywne
                </label>
            </div>
            <h4>Nagrody:</h4>
            <button class="btn-action" onclick="openWheelRewardsModal()">Edytuj Nagrody</button>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">
                Aktualnie ${config.rewards ? config.rewards.length : 0} nagród
            </p>
            <button class="btn-action" onclick="saveWheelConfigReal()">Zapisz Konfigurację</button>
        </div>
    `;
}

function saveWheelConfigReal() {
    adminData.wheelConfig.cost = parseFloat(document.getElementById('wheel-cost').value) || 20;
    adminData.wheelConfig.enabled = document.getElementById('wheel-enabled').checked;
    localStorage.setItem('wheelConfig', JSON.stringify(adminData.wheelConfig));
    alert('✅ Konfiguracja Koła Fortuny została zapisana!');
}

// ==================== DELIVERY CONFIGURATION ====================
function loadDeliveryConfig() {
    const config = adminData.deliveryConfig;
    const content = document.getElementById('delivery-module');
    content.innerHTML = `
        <div class="settings-panel">
            <h3>Konfiguracja Dostawy</h3>
            <div class="setting-group">
                <label>Koszt dostawy do paczkomatu (zł):</label>
                <input type="number" id="delivery-paczkomat" class="input-field" value="${config.paczkomat || 12}" placeholder="12">
            </div>
            <div class="setting-group">
                <label style="cursor: pointer;">
                    <input type="checkbox" id="delivery-paczkomat-enabled" checked disabled>
                    Paczkomaty - Jedyna Dostępna Metoda
                </label>
                <p style="font-size: 12px; color: #888; margin-top: 8px;">* Dostawę można realizować wyłącznie poprzez paczkomaty</p>
            </div>
            <button class="btn-action" onclick="saveDeliveryConfigReal()">Zapisz Konfigurację</button>
        </div>
    `;
}

function saveDeliveryConfigReal() {
    adminData.deliveryConfig.paczkomat = parseFloat(document.getElementById('delivery-paczkomat').value) || 12;
    adminData.deliveryConfig.courier = 0; // Kurier wyłączony
    localStorage.setItem('deliveryConfig', JSON.stringify(adminData.deliveryConfig));
    alert('✅ Konfiguracja dostawy została zapisana! (Tylko paczkomaty dostępne)');
}

// ==================== LOGOUT ====================
function logoutAdmin() {
    if (confirm('Czy na pewno chcesz się wylogować?')) {
        localStorage.removeItem('currentAdmin');
        window.location.href = 'index.html';
    }
}

function closeOrderModal() {
    const modal = document.getElementById('modal-order-details');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', initializeAdminPanel);