document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация Telegram бота
    const BOT_TOKEN = '7930681322:AAFQ6zgPhuYafIS9RWhcPWYM2xIzzgYFUvk';
    const CHAT_ID = '1030988262';
    
    // Защищенный пароль (зашифрованный)
    const ENCRYPTED_PASSWORD = 'Y3VsdHVyZTIwMjQ='; 

    // Tab navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            tabContents.forEach(tab => tab.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));
            
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });

    // Initialize first tab
    if (navLinks.length > 0) {
        navLinks[0].click();
    }

    // Image sliders
    const initSliders = () => {
        const sliders = document.querySelectorAll('.product-slider');
        if (sliders.length === 0) return;
        
        sliders.forEach(slider => {
            const container = slider.querySelector('.slider-container');
            const slides = slider.querySelectorAll('.slide');
            const prevBtn = slider.querySelector('.prev');
            const nextBtn = slider.querySelector('.next');
            const dotsContainer = slider.querySelector('.slider-dots');
            
            if (!container || slides.length === 0) return;
            
            let currentSlide = 0;

            // Create dots if container exists
            if (dotsContainer) {
                slides.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.className = 'dot' + (index === 0 ? ' active' : '');
                    dot.addEventListener('click', () => {
                        currentSlide = index;
                        showSlide(currentSlide);
                        updateDots();
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

            const showSlide = (index) => {
                container.style.transform = `translateX(-${index * 100}%)`;
            };

            const updateDots = () => {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            };

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                    showSlide(currentSlide);
                    updateDots();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                    updateDots();
                });
            }

            let slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
                updateDots();
            }, 5000);

            slider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            slider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                    updateDots();
                }, 5000);
            });

            let startX = 0;
            let endX = 0;

            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                clearInterval(slideInterval);
            });

            container.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                handleSwipe();
                slideInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                    updateDots();
                }, 5000);
            });

            const handleSwipe = () => {
                if (startX - endX > 50) {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                    updateDots();
                } else if (endX - startX > 50) {
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                    showSlide(currentSlide);
                    updateDots();
                }
            };
        });
    };

    initSliders();

    // Cart functionality
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const orderModal = document.getElementById('orderModal');
    const closeBtns = document.querySelectorAll('.close');
    const preorderBtns = document.querySelectorAll('.preorder-btn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const orderInfo = document.getElementById('orderInfo');

    // Загрузка данных с защитой
    let cart = JSON.parse(localStorage.getItem('cultureclub_cart')) || [];
    let orderNumber = loadProtectedOrderNumber();
    
    // Переменная для хранения реального пароля
    let realPassword = '';
    
    // Инициализация горящей корзины
    if (cartBtn) {
        initBurningCart();
    }
    
    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    // Функция загрузки защищенного номера заказа
    function loadProtectedOrderNumber() {
        try {
            const storedNumber = parseInt(localStorage.getItem('cultureclub_orderNumber')) || 1;
            return Math.max(storedNumber, 1);
        } catch (error) {
            return 1;
        }
    }

    // Функция сохранения защищенного номера заказа
    function saveProtectedOrderNumber(number) {
        localStorage.setItem('cultureclub_orderNumber', number.toString());
    }

    // Функция проверки пароля
    function checkPassword(inputPassword) {
        try {
            const decodedPassword = atob(ENCRYPTED_PASSWORD);
            return inputPassword === decodedPassword;
        } catch (error) {
            return false;
        }
    }

    // Анимация горящей корзины
    function initBurningCart() {
        let isBurning = false;
        
        cartBtn.addEventListener('mouseenter', function() {
            if (!isBurning) {
                isBurning = true;
                this.classList.add('burning');
                
                setTimeout(() => {
                    if (this.classList.contains('burning')) {
                        this.style.transform = 'scale(1.2)';
                    }
                }, 1000);
            }
        });

        cartBtn.addEventListener('mouseleave', function() {
            if (isBurning) {
                isBurning = false;
                this.classList.remove('burning');
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            }
        });

        cartBtn.addEventListener('click', () => {
            updateCartDisplay();
            openModal(cartModal);
        });
    }

    // Modal functions
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Обработчики закрытия для всех модальных окон
    if (closeBtns.length > 0) {
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                closeModal(modal);
            });
        });
    }

    // Закрытие по клику вне окна
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Add to cart
    if (preorderBtns.length > 0) {
        preorderBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                if (!productCard) return;
                
                const productName = this.getAttribute('data-product');
                const sizeSelect = productCard.querySelector('select');
                const size = sizeSelect ? sizeSelect.value : 'M';
                
                cart.push({
                    name: productName || 'Неизвестный товар',
                    size: size,
                    price: 80,
                    timestamp: new Date().getTime()
                });
                
                localStorage.setItem('cultureclub_cart', JSON.stringify(cart));
                if (cartCount) {
                    cartCount.textContent = cart.length;
                }
                showNotification(`Добавлено в корзину: ${productName} (${size})`);
            });
        });
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #000;
            color: #fff;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Update cart display
    function updateCartDisplay() {
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
            if (cartTotal) {
                cartTotal.textContent = '0';
            }
            return;
        }
        
        cart.forEach((item, index) => {
            total += item.price;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div>
                    <strong>${item.name}</strong> (${item.size})
                </div>
                <div>${item.price} руб.</div>
                <button class="remove-item" data-index="${index}">✕</button>
            `;
            
            cartItems.appendChild(itemElement);
        });
        
        // Добавляем обработчики для кнопок удаления
        setTimeout(() => {
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (!isNaN(index) && index >= 0 && index < cart.length) {
                        cart.splice(index, 1);
                        localStorage.setItem('cultureclub_cart', JSON.stringify(cart));
                        if (cartCount) {
                            cartCount.textContent = cart.length;
                        }
                        updateCartDisplay();
                    }
                });
            });
        }, 100);
        
        if (cartTotal) {
            cartTotal.textContent = total;
        }
    }

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (cart.length === 0) {
                showNotification('Корзина пуста');
                return;
            }
            
            // Создаем модальное окно для ввода Telegram ника
            const telegramModal = document.createElement('div');
            telegramModal.id = 'telegramModal';
            telegramModal.className = 'modal';
            telegramModal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <h3>📱 Введите ваш Telegram</h3>
                    <p>Пожалуйста, укажите ваш Telegram ник (например: @username)</p>
                    <input type="text" id="telegramUsername" placeholder="@username" 
                           style="width: 100%; padding: 0.8rem; margin: 1rem 0; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;">
                    <div style="display: flex; gap: 10px;">
                        <button id="confirmTelegramBtn" 
                                style="flex: 1; padding: 0.8rem; background: #000; color: white; border: none; border-radius: 8px; cursor: pointer;">
                            ✅ Подтвердить
                        </button>
                        <button id="cancelTelegramBtn" 
                                style="flex: 1; padding: 0.8rem; background: #ccc; color: #000; border: none; border-radius: 8px; cursor: pointer;">
                            ❌ Отмена
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(telegramModal);
            
            // Показываем модальное окно для ввода Telegram
            openModal(telegramModal);
            
            // Обработчики для кнопок Telegram модального окна
            document.getElementById('confirmTelegramBtn').addEventListener('click', processOrderWithTelegram);
            document.getElementById('cancelTelegramBtn').addEventListener('click', () => {
                closeModal(telegramModal);
                document.body.removeChild(telegramModal);
            });
            
            // Функция обработки заказа с Telegram ником
            async function processOrderWithTelegram() {
                const telegramInput = document.getElementById('telegramUsername');
                const telegramUsername = telegramInput.value.trim();
                
                if (!telegramUsername) {
                    showNotification('Пожалуйста, введите ваш Telegram ник');
                    telegramInput.focus();
                    return;
                }
                
                // Форматируем username (добавляем @ если нет)
                const formattedUsername = telegramUsername.startsWith('@') 
                    ? telegramUsername 
                    : '@' + telegramUsername;
                
                closeModal(telegramModal);
                document.body.removeChild(telegramModal);
                
                // Продолжаем обработку заказа
                const orderDetails = cart.map(item => 
                    `${item.name} (${item.size}) - ${item.price} руб.`
                ).join('\n');
                
                const totalAmount = parseInt(cartTotal ? cartTotal.textContent : '0');
                
                checkoutBtn.disabled = true;
                checkoutBtn.textContent = 'Отправляем...';
                
                if (orderInfo) {
                    orderInfo.innerHTML = `
                        <p><strong>Номер заказа:</strong> #${orderNumber}</p>
                        <p><strong>Telegram клиента:</strong> ${formattedUsername}</p>
                        <p><strong>Состав заказа:</strong></p>
                        <pre style="background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow: auto;">${orderDetails}</pre>
                        <p><strong>Общая сумма:</strong> ${totalAmount} руб.</p>
                        <div class="telegram-status" style="margin-top: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 8px;">
                            <p>📡 Отправляем заказ в Telegram...</p>
                        </div>
                    `;
                }
                
                try {
                    const telegramSuccess = await sendToTelegramAlternative(orderNumber, orderDetails, totalAmount, formattedUsername);
                    
                    if (telegramSuccess) {
                        const orders = JSON.parse(localStorage.getItem('cultureclub_orders') || '[]');
                        const orderData = {
                            orderNumber: orderNumber,
                            telegram: formattedUsername,
                            items: [...cart],
                            total: totalAmount,
                            date: new Date().toLocaleString(),
                            timestamp: new Date().getTime(),
                            status: 'отправлен в Telegram'
                        };
                        
                        orders.push(orderData);
                        localStorage.setItem('cultureclub_orders', JSON.stringify(orders));
                        
                        saveProtectedOrderNumber(orderNumber + 1);
                        
                        if (orderInfo) {
                            const statusElement = orderInfo.querySelector('.telegram-status');
                            if (statusElement) {
                                statusElement.innerHTML = `
                                    <p style="color: green;">✅ Заказ #${orderNumber} успешно отправлен!</p>
                                    <p>Клиент ${formattedUsername} уведомлен о необходимости связаться с @hallokittysoulja</p>
                                `;
                            }
                        }
                        
                        cart = [];
                        localStorage.setItem('cultureclub_cart', JSON.stringify(cart));
                        if (cartCount) {
                            cartCount.textContent = '0';
                        }
                        
                        orderNumber = loadProtectedOrderNumber();
                        
                        setTimeout(() => {
                            closeModal(cartModal);
                            openModal(orderModal);
                        }, 2000);
                        
                    } else {
                        throw new Error('Ошибка отправки в Telegram');
                    }
                    
                } catch (error) {
                    console.error('Ошибка:', error);
                    if (orderInfo) {
                        const statusElement = orderInfo.querySelector('.telegram-status');
                        if (statusElement) {
                            statusElement.innerHTML = `
                                <p style="color: red;">❌ Ошибка отправки заказа</p>
                                <p>Заказ сохранен под номером #${orderNumber}</p>
                                <p>Пожалуйста, свяжитесь с @hallokittysoulja напрямую</p>
                            `;
                        }
                    }
                } finally {
                    checkoutBtn.disabled = false;
                    checkoutBtn.textContent = 'Оформить заказ';
                }
            }
        });
    }

    // Отправка в Telegram (обновленная версия с Telegram ником)
    async function sendToTelegramAlternative(orderNumber, orderDetails, totalAmount, telegramUsername) {
        const message = `
🎯 НОВЫЙ ЗАКАЗ CULTURE CLUB

📦 Номер заказа: #${orderNumber}
👤 Telegram клиента: ${telegramUsername}
💰 Общая сумма: ${totalAmount} руб.
📅 Дата: ${new Date().toLocaleString()}

📋 Состав заказа:
${orderDetails}

💬 Инструкция для клиента:
Напишите @hallokittysoulja в Telegram и сообщите номер заказа #${orderNumber}

#заказ_${orderNumber}
        `.trim();

        try {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('text', message);
            formData.append('parse_mode', 'HTML');

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                body: formData
            });

            return response.ok;
        } catch (error) {
            console.error('Ошибка отправки:', error);
            return false;
        }
    }

    // Админские функции
    function createAdminPanel() {
        // Создаем скрытую админскую кнопку
        const adminBtn = document.createElement('button');
        adminBtn.textContent = '⚙️';
        adminBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #000;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 9999;
            font-size: 18px;
            transition: all 0.3s ease;
        `;
        
        // Анимация кнопки админки
        adminBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(45deg)';
            this.style.background = '#d32f2f';
        });
        
        adminBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.background = '#000';
        });
        
        adminBtn.addEventListener('click', openAdminModal);
        document.body.appendChild(adminBtn);

        // Создаем модальное окно админки
        const adminModal = document.createElement('div');
        adminModal.id = 'adminModal';
        adminModal.className = 'modal';
        adminModal.innerHTML = `
            <div class="modal-content" style="max-width: 500px; position: relative;">
                <span class="close admin-close" style="position: absolute; right: 15px; top: 15px; font-size: 24px; cursor: pointer;">&times;</span>
                <h2>⚙️ Админ-панель</h2>
                <div id="adminStatus"></div>
                <div style="margin: 1rem 0;">
                    <input type="password" id="adminPassword" placeholder="Введите пароль" 
                           style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px;">
                    <button id="adminLoginBtn" style="width: 100%; padding: 0.7rem; background: #000; color: white; border: none; border-radius: 4px;">
                        🔐 Войти
                    </button>
                </div>
                <div id="adminControls" style="display: none;">
                    <h3>📊 Статистика</h3>
                    <p>Текущий номер заказа: <strong id="currentOrderNumber">${orderNumber}</strong></p>
                    <p>Всего заказов: <strong id="totalOrders">${orderNumber - 1}</strong></p>
                    
                    <h3>🛠 Управление</h3>
                    <input type="number" id="newOrderNumber" placeholder="Новый номер" 
                           style="width: 100%; padding: 0.5rem; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 4px;">
                    <button id="resetOrderBtn" style="width: 100%; padding: 0.7rem; background: #d32f2f; color: white; border: none; border-radius: 4px; margin: 0.5rem 0;">
                        🔄 Сбросить счетчик
                    </button>
                    
                    <button id="clearAllDataBtn" style="width: 100%; padding: 0.7rem; background: #ff5722; color: white; border: none; border-radius: 4px; margin: 0.5rem 0;">
                        🗑️ Очистить ВСЕ
                    </button>
                    
                    <button id="exportOrdersBtn" style="width: 100%; padding: 0.7rem; background: #1976d2; color: white; border: none; border-radius: 4px; margin: 0.5rem 0;">
                        📥 Экспорт заказов
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(adminModal);

        // Обработчики админки
        document.getElementById('adminLoginBtn').addEventListener('click', adminLogin);
        document.getElementById('resetOrderBtn').addEventListener('click', resetOrderCounter);
        document.getElementById('clearAllDataBtn').addEventListener('click', clearAllData);
        document.getElementById('exportOrdersBtn').addEventListener('click', exportAllOrders);

        // Обработчик закрытия админ-панели
        const adminCloseBtn = document.querySelector('.admin-close');
        if (adminCloseBtn) {
            adminCloseBtn.addEventListener('click', function() {
                const adminModal = document.getElementById('adminModal');
                closeModal(adminModal);
            });
        }

        // Обработчик поля пароля
        const adminPasswordInput = document.getElementById('adminPassword');
        if (adminPasswordInput) {
            adminPasswordInput.addEventListener('input', function(e) {
                realPassword = e.target.value;
            });
        }
    }

    function openAdminModal() {
        const adminModal = document.getElementById('adminModal');
        if (adminModal) {
            adminModal.style.display = 'block';
            const adminStatus = document.getElementById('adminStatus');
            if (adminStatus) adminStatus.innerHTML = '';
            const adminPassword = document.getElementById('adminPassword');
            if (adminPassword) adminPassword.value = '';
            realPassword = '';
            const adminControls = document.getElementById('adminControls');
            if (adminControls) adminControls.style.display = 'none';
        }
    }

    function adminLogin() {
        if (checkPassword(realPassword)) {
            const adminControls = document.getElementById('adminControls');
            if (adminControls) adminControls.style.display = 'block';
            const adminStatus = document.getElementById('adminStatus');
            if (adminStatus) adminStatus.innerHTML = '<p style="color: green;">✅ Доступ разрешен</p>';
            const currentOrderNumber = document.getElementById('currentOrderNumber');
            if (currentOrderNumber) currentOrderNumber.textContent = orderNumber;
            
            // Обновляем статистику
            const orders = JSON.parse(localStorage.getItem('cultureclub_orders') || '[]');
            const totalOrders = document.getElementById('totalOrders');
            if (totalOrders) totalOrders.textContent = orders.length;
                
        } else {
            const adminStatus = document.getElementById('adminStatus');
            if (adminStatus) adminStatus.innerHTML = '<p style="color: red;">❌ Неверный пароль</p>';
            const adminPassword = document.getElementById('adminPassword');
            if (adminPassword) adminPassword.value = '';
            realPassword = '';
        }
    }

    function resetOrderCounter() {
        const newNumberInput = document.getElementById('newOrderNumber');
        const newNumber = newNumberInput ? newNumberInput.value || '1' : '1';
        const confirmReset = confirm(`Сбросить счетчик на ${newNumber}?`);
        
        if (confirmReset) {
            orderNumber = parseInt(newNumber);
            saveProtectedOrderNumber(orderNumber);
            const currentOrderNumber = document.getElementById('currentOrderNumber');
            if (currentOrderNumber) currentOrderNumber.textContent = orderNumber;
            const adminStatus = document.getElementById('adminStatus');
            if (adminStatus) adminStatus.innerHTML = '<p style="color: green;">✅ Счетчик сброшен</p>';
            showNotification('Счетчик заказов сброшен');
        }
    }

    function clearAllData() {
        const confirmClear = confirm('❌ Удалить ВСЕ данные? Это необратимо!');
        
        if (confirmClear) {
            localStorage.removeItem('cultureclub_cart');
            localStorage.removeItem('cultureclub_orders');
            localStorage.removeItem('cultureclub_orderNumber');
            
            cart = [];
            orderNumber = 1;
            saveProtectedOrderNumber(1);
            
            if (cartCount) cartCount.textContent = '0';
            const currentOrderNumber = document.getElementById('currentOrderNumber');
            if (currentOrderNumber) currentOrderNumber.textContent = '1';
            const totalOrders = document.getElementById('totalOrders');
            if (totalOrders) totalOrders.textContent = '0';
            
            const adminStatus = document.getElementById('adminStatus');
            if (adminStatus) adminStatus.innerHTML = '<p style="color: green;">✅ Данные очищены</p>';
            showNotification('Все данные очищены');
        }
    }

    function exportAllOrders() {
        const orders = JSON.parse(localStorage.getItem('cultureclub_orders') || '[]');
        if (orders.length === 0) {
            const adminStatus = document.getElementById('adminStatus');
            if (adminStatus) adminStatus.innerHTML = '<p style="color: orange;">⚠️ Нет заказов</p>';
            return;
        }

        const content = orders.map(order => 
            `Заказ #${order.orderNumber}\nTelegram: ${order.telegram || 'Не указан'}\nДата: ${order.date}\nСумма: ${order.total} руб.\nТовары:\n${order.items.map(item => `- ${item.name} (${item.size})`).join('\n')}\n\n`
        ).join('='.repeat(50) + '\n\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_export.txt`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        const adminStatus = document.getElementById('adminStatus');
        if (adminStatus) adminStatus.innerHTML = '<p style="color: green;">✅ Заказы экспортированы</p>';
    }

    // Инициализируем админ-панель
    createAdminPanel();

    // Добавляем стили для прокрутки корзины
    const style = document.createElement('style');
    style.textContent = `
        .cart-icon {
            cursor: pointer;
            font-size: 1.2rem;
            position: relative;
            color: #000;
            transition: all 0.3s ease;
            padding: 0.5rem;
            border-radius: 50%;
        }
        
        .cart-icon.burning {
            animation: burn 0.5s ease-in-out infinite;
            color: #ff6b00 !important;
            background: linear-gradient(45deg, #ff6b00, #ff0000) !important;
            box-shadow: 0 0 20px rgba(255, 107, 0, 0.7);
        }
        
        @keyframes burn {
            0%, 100% { transform: scale(1.2) rotate(-1deg); }
            50% { transform: scale(1.3) rotate(1deg); }
        }
        
        .cart-icon:hover {
            transform: scale(1.2);
            background-color: #000;
            color: #fff;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        
        .modal-content {
            background-color: white;
            margin: 10% auto;
            padding: 20px;
            border-radius: 10px;
            max-width: 500px;
            position: relative;
            max-height: 80vh;
            overflow: hidden;
        }
        
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close:hover {
            color: black;
        }
        
        /* Стили для прокрутки корзины */
        #cartItems {
            max-height: 300px;
            overflow-y: auto;
            margin: 1rem 0;
            padding-right: 10px;
        }
        
        #cartItems::-webkit-scrollbar {
            width: 6px;
        }
        
        #cartItems::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        #cartItems::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
        }
        
        #cartItems::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .remove-item {
            background: none;
            border: none;
            color: #ff0000;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0.2rem 0.5rem;
        }
        
        .remove-item:hover {
            background: #ff0000;
            color: white;
            border-radius: 50%;
        }
        
        .empty-cart {
            text-align: center;
            color: #888;
            padding: 2rem;
        }
        
        /* Стили для модального окна Telegram */
        #telegramModal input {
            font-size: 1rem;
            padding: 0.8rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            width: 100%;
            margin: 1rem 0;
        }
        
        #telegramModal input:focus {
            border-color: #000;
            outline: none;
        }
    `;
    document.head.appendChild(style);

    // Инициализация корзины
    if (cartBtn && cartModal) {
        updateCartDisplay();
    }

    // Добавляем обработчик закрытия для админ-панели по клику вне окна
    window.addEventListener('click', (e) => {
        const adminModal = document.getElementById('adminModal');
        if (e.target === adminModal) {
            closeModal(adminModal);
        }
    });
});