// js/cart-count.js

function addToCart(productId, quantity, productData) {
    try {
        const cartKey = "cart-A";  // 你的 localStorage key
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        const existingIndex = cart.findIndex(item => item.id === productId);
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productData.name,
                price: productData.price,
                img: productData.img,
                quantity: quantity
            });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        updateCartCount();
        return true;
    } catch (error) {
        console.error("加入購物車失敗:", error);
        return false;
    }
}

function updateCartCount() {
    const cartKey = "cart-A";
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    const countSpan = document.querySelector('.cart-count');
    if (countSpan) { // Add a check to ensure the element exists
        if (count > 0) {
            countSpan.style.display = 'inline-block';
            countSpan.textContent = count;
        } else {
            countSpan.style.display = 'none';
        }
    }
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Call updateCartCount when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateCartCount);