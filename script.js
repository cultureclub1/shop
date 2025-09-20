document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация Telegram бота
    const BOT_TOKEN = '7930681322:AAFQ6zgPhuYafIS9RWhcPWYM2xIzzgYFUvk';
    const CHAT_ID = '8492291086';
    
   

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
            }, 8000);

            slider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            slider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                    updateDots();
                }, 8000);
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
                }, 8000);
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
    
    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    // Функция генерации случайного номера заказа от 1 до 200
    function generateRandomOrderNumber() {
        return Math.floor(Math.random() * 100) + 1;
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

    if (cartBtn) {
        initBurningCart();
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
                    price: 70,
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
                
                // Генерируем случайный номер заказа
                const orderNumber = generateRandomOrderNumber();
                
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
                        
                        if (orderInfo) {
                            const statusElement = orderInfo.querySelector('.telegram-status');
                            if (statusElement) {
                                statusElement.innerHTML = `
                                    <p style="color: green;">✅ Заказ #${orderNumber} успешно отправлен!</p>
                                    <p>Клиент ${formattedUsername} уведомлен о необходимости связаться с @manag3r_www</p>
                                `;
                            }
                        }
                        
                        cart = [];
                        localStorage.setItem('cultureclub_cart', JSON.stringify(cart));
                        if (cartCount) {
                            cartCount.textContent = '0';
                        }
                        
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
                                <p>Пожалуйста, свяжитесь с @manag3r_www напрямую</p>
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
Напишите @manag3r_www в Telegram и сообщите номер заказа #${orderNumber}

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
});