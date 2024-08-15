import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from 'src/app/interfaces/CartItem';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];

  constructor(private _cartService: CartService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadCartItems();  // Mueve la lógica de carga a un método separado
  }

  private loadCartItems() {
    this._cartService.getCartItems().subscribe(
      (response: any) => {
        if (response.data && Array.isArray(response.data)) {
          // Asumiendo que response.data es un array de items en sí mismo
          this.cartItems = response.data.map((item: CartItem) => ({
            product: item.product,
            quantity: item.quantity,
          }));
        } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          // Caso original donde los items están dentro de response.data.items
          this.cartItems = response.data.items.map((item: CartItem) => ({
            product: item.product,
            quantity: item.quantity,
          }));
        } else {
          console.error('La respuesta no contiene un array esperado');
          this.cartItems = []; // Respaldo para evitar problemas posteriores
        }
      },
      (error) => {
        console.error('Error al obtener los productos del carrito:', error);
        this.cartItems = []; // En caso de error, evita que cartItems quede indefinido
      }
    );
  }

  getQuantities(product: Product): number[] {
    return Array.from({ length: product.existencia }, (_, i) => i + 1);
  }

  removeFromCart(item: { product: Product; quantity: number }) {
    this._cartService.removeFromCart(item.product.id).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.product.id !== item.product.id);
        this.toastr.success(`El producto ${item.product.nombre} ha sido eliminado del carrito.`);
      },
      error => {
        console.error('Error al eliminar el producto del carrito:', error);
        this.toastr.error('Ocurrió un error al eliminar el producto del carrito.');
      }
    );
  }

  buyProduct(item: { product: Product; quantity: number }) {
    const { product, quantity } = item;
    const selectedQuantity = quantity || 1;

    if (product.existencia >= selectedQuantity) {
      this._cartService.buyProduct(product, selectedQuantity).subscribe(
        response => {
          product.existencia -= selectedQuantity;
          if (product.existencia === 0) {
            this.removeFromCart(item);
          }
          this.toastr.success(`Has comprado ${selectedQuantity} de ${product.nombre}`);
        },
        error => {
          console.error('Error al comprar el producto:', error);
          this.toastr.error('Ocurrió un error al procesar tu compra.');
        }
      );
    } else {
      this.toastr.warning(`El producto ${product.nombre} no tiene suficiente stock.`);
    }
  }
}
