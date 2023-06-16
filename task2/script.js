const productList = document.querySelector('.products');
const inputField = document.querySelector('.input');
const addBut = document.querySelector('.addBut');
const box2Elements = document.querySelectorAll('.box2 .list .product-item');

const minusButtonClass = 'minusBut';
const plusButtonClass = 'plusBut';
const deleteButtonClass = 'deleteBut';
const buyButtonClass = 'buyBut';
const productClass = 'product';9 

productList.addEventListener('click', handleProductListClick);
addBut.addEventListener('click', handleAddButtonClick);

const existingItems = new Set();

function handleProductListClick(event) {
  const target = event.target;
  if (target.classList.contains(minusButtonClass)) handleMinusButtonClick(target);
  if (target.classList.contains(plusButtonClass)) handlePlusButtonClick(target);
  if (target.classList.contains(deleteButtonClass)) handleDeleteButtonClick(target);
  if (target.classList.contains(buyButtonClass)) handleBuyButtonClick(target);
  if (target.classList.contains(productClass)) handleProductEdit(target);
}

function handleAddButtonClick() {
  const itemName = inputField.value.trim();
  if (existingItems.has(itemName.toLowerCase())) {
    window.alert('Продукт вже в списку');
    inputField.focus();
    return;
  } else if (itemName === '') {
    window.alert('Введіть назву');
    inputField.focus();
    return;
  }
  addItemToProductList(itemName);
  inputField.value = '';
  inputField.focus();
}

function handleMinusButtonClick(target) {
  const amountElement = target.nextElementSibling;
  let amount = parseInt(amountElement.textContent);
  amount = Math.max(amount - 1, 1);
  amountElement.textContent = amount;

  const element = target.closest('.element');
  const itemNameElement = findByName(element, productClass).textContent.trim();
  const box2Element = findBox2ElementByItemName(itemNameElement);
  if (box2Element) {
    findByName(box2Element, 'amount2').textContent = amount;
  }
}

function handlePlusButtonClick(target) {
  const amountElement = target.previousElementSibling;
  let amount = parseInt(amountElement.textContent);
  amount++;
  amountElement.textContent = amount;

  const element = target.closest('.element');
  const itemNameElement = findByName(element, productClass).textContent.trim();
  const box2Element = findBox2ElementByItemName(itemNameElement);
  if (box2Element) {
    findByName(box2Element, 'amount2').textContent = amount;
  }
}

function findBox2ElementByItemName(itemName) {
  const box2ItemElements = document.querySelectorAll('.box2 .list .product-item');
  for (const box2Element of box2ItemElements) {
    const box2ItemNameElement = findByName(box2Element, 'name').textContent.trim();
    if (box2ItemNameElement === itemName) {
      return box2Element;
    }
  }
  return null;
}

function handleBuyButtonClick(target) {
  const element = target.closest('.element');
  const itemNameElement = findByName(element, productClass).textContent.trim();
  const box2BoughtList = document.querySelector('.box2 .bought .list');
  const box2RemainList = document.querySelector('.box2 .remain .list');
  const box2BoughtElements = box2BoughtList.querySelectorAll('.product-item');
  const box2RemainElements = box2RemainList.querySelectorAll('.product-item');

  let existingBox2Element = findBox2ElementByItemName(itemNameElement, box2BoughtElements);

  if (existingBox2Element) {
    existingBox2Element.remove();
    box2RemainList.appendChild(existingBox2Element);
    target.textContent = 'Куплено';
    target.classList.remove('bought');
  } else {
    existingBox2Element = findBox2ElementByItemName(itemNameElement, box2RemainElements);
    
      if (existingBox2Element) {
        existingBox2Element.remove();
        box2BoughtList.appendChild(existingBox2Element);
        target.textContent = 'Не куплено';
        target.classList.add('bought');
      }
    }

  const item = findByName(element, productClass);
  item.classList.toggle('crossed');
  const plusButton = findByName(element, plusButtonClass);
  const minusButton = findByName(element, minusButtonClass);
  const deleteButton = findByName(element, deleteButtonClass);
  plusButton.style.display = plusButton.style.display === 'none' ? '' : 'none';
  minusButton.style.display = minusButton.style.display === 'none' ? '' : 'none';
  deleteButton.style.display = deleteButton.style.display === 'none' ? '' : 'none';
}

function findBox2ElementByItemName(itemName, elements) {
  for (const box2Element of elements) {
    const box2ItemNameElement = findByName(box2Element, 'name').textContent.trim();
    if (box2ItemNameElement === itemName) {
      return box2Element;
    }
  }
  return null;
}

function handleProductEdit(target) {
  const itemNameElement = target.textContent.trim();
  const input = document.createElement('input');
  input.type = 'text';
  input.value = target.textContent.trim();
  target.replaceWith(input);
  input.focus();
  input.addEventListener('blur', () => {
  const newProductName = input.value.trim();
  if (newProductName !== '') {
    const newProductSpan = document.createElement('span');
    newProductSpan.classList.add(productClass);
    newProductSpan.textContent = newProductName;
    input.replaceWith(newProductSpan);
    existingItems.delete(itemNameElement.toLowerCase());
    existingItems.add(newProductName.toLowerCase());

    const box2ItemElements = document.querySelectorAll('.box2 .list .product-item');
    box2ItemElements.forEach((box2Element) => {
      const box2ItemNameElement = findByName(box2Element, 'name').textContent.trim();
      if (box2ItemNameElement === itemNameElement) {
        findByName(box2Element, 'name').textContent = newProductName;
      }
    });
  }
  });
}

function handleDeleteButtonClick(target) {
  const element = target.closest('.element');
  const itemNameElement = findByName(element, productClass).textContent.trim();
  existingItems.delete(itemNameElement.toLowerCase());
  element.remove();

  const box2ItemElements = document.querySelectorAll('.box2 .list .product-item');
  box2ItemElements.forEach((box2Element) => {
  const box2ItemNameElement = findByName(box2Element, 'name').textContent.trim();
  if (box2ItemNameElement === itemNameElement) {
    box2Element.remove();
  }
  });
}

function addItemToProductList(itemName) {
  const newElement = document.createElement('div');
  newElement.classList.add('element');
  const itemNameElement = document.createElement('div');
  itemNameElement.classList.add('itemName');
  const productSpan = document.createElement('span');
  productSpan.classList.add(productClass);
  productSpan.textContent = itemName;
  itemNameElement.appendChild(productSpan);
  newElement.appendChild(itemNameElement);
  const amountButElement = document.createElement('div');
  amountButElement.classList.add('amountBut');
  const minusButton = createButton(minusButtonClass, 'На один менше', '-');
  const amountSpan = document.createElement('span');
  amountSpan.classList.add('amount');
  amountSpan.textContent = '1';
  const plusButton = createButton(plusButtonClass, 'На один більше', '+');
  amountButElement.appendChild(minusButton);
  amountButElement.appendChild(amountSpan);
  amountButElement.appendChild(plusButton);
  newElement.appendChild(amountButElement);
  const buyDelButElement = document.createElement('div');
  buyDelButElement.classList.add('buyDelBut');
  const buyButton = createButton(buyButtonClass, 'Позначити купленим', 'Куплено');
  const deleteButton = createButton(deleteButtonClass, 'Видалити зі списку', '×');
  buyDelButElement.appendChild(buyButton);
  buyDelButElement.appendChild(deleteButton);
  newElement.appendChild(buyDelButElement);
  const fragment = document.createDocumentFragment();
  fragment.appendChild(newElement);
  productList.appendChild(fragment);
  existingItems.add(itemName.toLowerCase());

  const remainList = document.querySelector('.remain .list');
  const newRemainElement = document.createElement('span');
  newRemainElement.classList.add('product-item');
  const newRemainName = document.createElement('span');
  newRemainName.classList.add('name');
  newRemainName.textContent = itemName;
  const newRemainAmount = document.createElement('span');
  newRemainAmount.classList.add('amount2');
  newRemainAmount.textContent = '1';
  newRemainElement.appendChild(newRemainName);
  newRemainElement.appendChild(newRemainAmount);
  remainList.appendChild(newRemainElement);
}

function createButton(className, tooltip, text) {
  const button = document.createElement('button');
  button.classList.add(className, 'tooltip');
  button.setAttribute('data-tooltip', tooltip);
  button.innerHTML = `${text}`;
  return button;
}

function findByName(element, className) {
  return element.querySelector(`.${className}`);
}