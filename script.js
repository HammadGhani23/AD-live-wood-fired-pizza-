// ==========================================
// AD TANDOORI PIZZA - INTERACTIVE SCRIPTS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileNav();
  initMenuFilters();
  initEmberParticles();
  initShoppingCart();
  initScrollSpy();
});

// 1. NAVBAR SCROLL EFFECT
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// 2. MOBILE DRAWER NAVIGATION
function initMobileNav() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-links a');

  const openDrawer = () => drawer.classList.add('open');
  const closeDrawer = () => drawer.classList.remove('open');

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 3. MENU CATEGORY FILTER
function initMenuFilters() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.menu-item-card');

  // Trigger filtering to active category on start
  const runFilter = (category) => {
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transition = 'opacity 0.4s ease';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-category');
      runFilter(targetCategory);
    });
  });

  // Default filter to "classic-pizza" so page loads into a rich view instead of a long list
  runFilter('classic-pizza');
}

// 4. CANVAS EMBER PARTICLE SYSTEM (THE ACTION EFFECT)
function initEmberParticles() {
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  const particles = [];
  const maxParticles = 65;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  class Ember {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 2.8 + 0.8;
      this.speedY = -(Math.random() * 1.5 + 0.5);
      this.speedX = Math.random() * 1.0 - 0.5;
      this.alpha = Math.random() * 0.7 + 0.3;
      this.decay = Math.random() * 0.003 + 0.0015;
      this.wobble = Math.random() * 0.1;
      this.wobbleSpeed = Math.random() * 0.02;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * this.wobbleSpeed) * this.wobble;
      this.alpha -= this.decay;

      if (this.alpha <= 0 || this.y < -10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 122, 26, ${this.alpha})`;
      if (this.size > 2) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff7a1a';
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Ember());
  }

  function animate() {
    ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Mouse interactivity
  const heroSection = document.getElementById('hero');
  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (Math.random() < 0.2 && particles.length < maxParticles + 15) {
      const extraEmber = new Ember();
      extraEmber.x = mouseX + (Math.random() * 20 - 10);
      extraEmber.y = mouseY + (Math.random() * 20 - 10);
      extraEmber.speedY = -(Math.random() * 1.8 + 0.8);
      particles.push(extraEmber);
      
      if (particles.length > maxParticles + 20) {
        particles.shift();
      }
    }
  });
}

// 5. SHOPPING CART LOGIC & MENU SELECTION
let cart = [];

// Dictionary tracking selected size and price for each variable product
const selectedItemOptions = {
  // Classic Pizzas (default: M @ 899)
  tikka: { size: 'M', price: 899 },
  sicilian: { size: 'M', price: 899 },
  fajita: { size: 'M', price: 899 },
  veg: { size: 'M', price: 899 },
  supreme: { size: 'M', price: 899 },
  cheese: { size: 'M', price: 899 },
  
  // Special Pizzas (default: M @ 999)
  adspec: { size: 'M', price: 999 },
  behari: { size: 'M', price: 999 },
  tandoori: { size: 'M', price: 999 },
  malai: { size: 'M', price: 999 },
  extreme: { size: 'M', price: 999 },

  // Special Crusts (default: M @ 1100)
  crown: { size: 'M', price: 1100 },
  kstuff: { size: 'M', price: 1100 },
  cstuff: { size: 'M', price: 1100 },

  // Premium Pizzas (default: L @ 1550)
  stuffer: { size: 'L', price: 1550 },
  twister: { size: 'L', price: 1550 },
  periperi: { size: 'L', price: 1550 },

  // Pastas (default: Half @ varies)
  specpasta: { size: 'Half', price: 450 },
  flamepasta: { size: 'Half', price: 350 },
  crunchypasta: { size: 'Half', price: 400 },
  creamypasta: { size: 'Half', price: 350 },

  // Drinks
  sdrink: { size: 'Regular', price: 80 },
  water: { size: 'Small', price: 60 },

  // Extras
  topping: { size: 'Medium', price: 150 },
  sauce: { size: 'Dip Sauce', price: 100 }
};

// Size selector toggle function
window.selectSize = function(element, key, sizeName, price) {
  // Update state dictionary
  selectedItemOptions[key] = { size: sizeName, price: price };

  // Toggle active class visually
  const buttons = element.parentElement.querySelectorAll('.size-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  // Update card price display
  const priceDisplay = document.getElementById(`price-${key}`);
  if (priceDisplay) {
    priceDisplay.innerText = `Rs. ${price}`;
  }
};

function initShoppingCart() {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartTrigger = document.getElementById('cart-trigger');
  const cartClose = document.getElementById('cart-close');
  const checkoutBtn = document.getElementById('btn-checkout');

  cartTrigger.addEventListener('click', () => cartDrawer.classList.toggle('open'));
  cartClose.addEventListener('click', () => cartDrawer.classList.remove('open'));

  document.addEventListener('click', (e) => {
    if (!cartDrawer.contains(e.target) && !cartTrigger.contains(e.target) && cartDrawer.classList.contains('open')) {
      cartDrawer.classList.remove('open');
    }
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your tandoor is cold. Add some pizzas first!');
      return;
    }
    sendWhatsAppOrder();
  });
}

// Add variable pizza item
window.addPizzaToCart = function(name, key) {
  const selection = selectedItemOptions[key];
  const sizeText = selection.size === 'S' ? 'Small 7"' :
                   selection.size === 'M' ? 'Medium 10"' :
                   selection.size === 'L' ? 'Large 13"' : 'Party XL 16"';
  
  const cartItemName = `${name} (${sizeText})`;
  window.addItemToCart(cartItemName, selection.price);
};

// Add variable pasta item
window.addPastaToCart = function(name, key) {
  const selection = selectedItemOptions[key];
  const cartItemName = `${name} (${selection.size})`;
  window.addItemToCart(cartItemName, selection.price);
};

// Add variable drink item
window.addDrinksToCart = function(name, key) {
  const selection = selectedItemOptions[key];
  const cartItemName = `${name} (${selection.size})`;
  window.addItemToCart(cartItemName, selection.price);
};

// Add variable extra item
window.addExtrasToCart = function(name, key) {
  const selection = selectedItemOptions[key];
  const cartItemName = `${name} (${selection.size})`;
  window.addItemToCart(cartItemName, selection.price);
};

// Basic Add Item to Cart
window.addItemToCart = function(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
  showToast(`Added ${name} to your tandoor order!`);
};

// Add Bundle Deals
window.addBundleToCart = function(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
  showToast(`Claimed ${name}!`);
  
  setTimeout(() => {
    if (window.innerWidth <= 991) {
      const cartDrawer = document.getElementById('cart-drawer');
      if (cartDrawer) cartDrawer.classList.add('open');
    }
  }, 300);
};

window.changeQuantity = function(name, delta) {
  const item = cart.find(item => item.name === name);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.name !== name);
  }
  updateCartUI();
};

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const sidebarCartItemsContainer = document.getElementById('sidebar-cart-items');
  const cartBadge = document.getElementById('cart-badge');
  const cartTotal = document.getElementById('cart-total');
  const sidebarCartTotal = document.getElementById('sidebar-cart-total');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) cartBadge.innerText = totalCount;
  
  if (cartBadge) {
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);
  }

  const emptyHTML = `
    <div class="empty-cart-message">
      <i class="fa-solid fa-pizza-slice"></i>
      <p>Your tandoor is cold.<br>Add some pizzas!</p>
    </div>
  `;

  if (cart.length === 0) {
    if (cartItemsContainer) cartItemsContainer.innerHTML = emptyHTML;
    if (sidebarCartItemsContainer) sidebarCartItemsContainer.innerHTML = emptyHTML;
    if (cartTotal) cartTotal.innerText = 'Rs. 0';
    if (sidebarCartTotal) sidebarCartTotal.innerText = 'Rs. 0';
    return;
  }

  let totalHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    totalHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">Rs. ${item.price}</div>
        </div>
        <div class="cart-item-actions">
          <button class="btn-qty" onclick="changeQuantity('${item.name}', -1)"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-val">${item.quantity}</span>
          <button class="btn-qty" onclick="changeQuantity('${item.name}', 1)"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    `;
  });

  if (cartItemsContainer) cartItemsContainer.innerHTML = totalHTML;
  if (sidebarCartItemsContainer) sidebarCartItemsContainer.innerHTML = totalHTML;
  if (cartTotal) cartTotal.innerText = `Rs. ${totalPrice}`;
  if (sidebarCartTotal) sidebarCartTotal.innerText = `Rs. ${totalPrice}`;
}

function sendWhatsAppOrder() {
  const phoneNumber = '923305566111'; // Official delivery hotline: 0330-5566-111
  let messageText = '🔥 *NEW ORDER FOR AD TANDOORI PIZZA* 🔥\n\nI would like to order the following tandoor treats:\n';
  
  let totalOrderPrice = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalOrderPrice += itemTotal;
    messageText += `${index + 1}. *${item.name}* (x${item.quantity}) - Rs. ${itemTotal}\n`;
  });

  messageText += `\n💵 *Total Price:* Rs. ${totalOrderPrice}\n`;
  messageText += `\n📍 *Delivery/Pickup details:*\n- Address:\n- Name:\n- Instructions:`;

  const encodedMessage = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

// 6. TOAST NOTIFICATION UTILITY
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// 7. SCROLL SPY FOR ACTIVE NAVIGATION
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a, .drawer-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}
