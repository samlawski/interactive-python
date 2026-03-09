# 6.9 Shopping Cart (dictionaries, lists, functions, while, for)

## Task

Please write three functions that together implement a simple shopping cart system:

- `add_item(cart, item, price)` — adds an item with its price to the cart. If the item already exists, update its price. The cart is a dictionary.
- `remove_item(cart, item)` — removes an item from the cart. If the item doesn't exist, do nothing.
- `get_total(cart)` — returns the total price of all items in the cart.

The cart should be a dictionary where keys are item names (strings) and values are prices (floats).

## Examples

```python
cart = {}
add_item(cart, "Apple", 1.50)
add_item(cart, "Bread", 2.00)
add_item(cart, "Milk", 1.20)
get_total(cart)  # → 4.70
remove_item(cart, "Bread")
get_total(cart)  # → 2.70
```

<details>
<summary>💡 Hints</summary>

- The cart dictionary maps item names to prices: `{"Apple": 1.50, "Bread": 2.00}`
- Adding an item is just setting a key in the dictionary: `cart[item] = price`
- Removing an item can be done with `del cart[item]` — but check first that it exists!
- To get the total, iterate over the dictionary values and sum them up

</details>
