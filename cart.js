document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.querySelector('.cart-tbody');
  if (!cartTableBody) return; // 不是在購物車頁面就不執行

  const totalPriceEl = document.querySelector('.total-price');
  const checkoutBtn = document.querySelector('.checkout-btn');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    cartTableBody.innerHTML = '';

    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="5">購物車是空的</td></tr>`;
      totalPriceEl.textContent = '$0';
      return;
    }

    let total = 0;

    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="product-info">
          <img src="${item.image}" alt="${item.name}" />
          <span>${item.name}</span>
        </td>
        <td class="unit-price" data-price="${item.price}">$${item.price}</td>
        <td>
          <select class="quantity-select">
            ${[...Array(10).keys()].map(i => {
              const val = i + 1;
              return `<option value="${val}" ${val === item.quantity ? 'selected' : ''}>${val}</option>`;
            }).join('')}
          </select>
        </td>
        <td class="subtotal">$${subtotal}</td>
        <td><button class="btn remove-btn">刪除</button></td>
      `;

      // 數量變更事件
      tr.querySelector('.quantity-select').addEventListener('change', e => {
        const newQty = parseInt(e.target.value);
        item.quantity = newQty;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });

      // 刪除事件
      tr.querySelector('.remove-btn').addEventListener('click', () => {
        cart = cart.filter(i => i.id !== item.id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });

      cartTableBody.appendChild(tr);
    });

    totalPriceEl.textContent = `$${total}`;
  }

  renderCart();

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('購物車是空的，請先加入商品');
      return;
    }
    alert('結帳功能尚未實作');
  });
});
