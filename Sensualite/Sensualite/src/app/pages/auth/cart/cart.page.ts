import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service'; 
import { Product } from '../../../interfaces/product'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: Product[] = [];

  constructor(private _cartService: CartService, private toastr: ToastrService) { }

  ngOnInit() {
    this._cartService.getCartItems().subscribe((items: Product[]) => {
      this.cartItems = items;
    });
  }

  removeFromCart(product: Product) {
    this._cartService.removeFromCart(product);
  }

  buyProduct(product: Product) {
    if (product.existencia > 0) {
      this._cartService.buyProduct(product).subscribe(response => {
        // Actualización local después de confirmar la compra
        product.existencia--;  // Reducir localmente el stock
        if (product.existencia === 0) {
          this.removeFromCart(product);  // Eliminar del carrito si ya no hay más en existencia
        }
        this.toastr.success(`Has comprado ${product.nombre}`);
      }, error => {
        console.error('Error al comprar el producto:', error);
        alert('Ocurrió un error al procesar tu compra: ' + error.error.msg);
      });
    } else {
      this.toastr.warning(`El producto ${product.nombre} está agotado`);
    }
  }
}
