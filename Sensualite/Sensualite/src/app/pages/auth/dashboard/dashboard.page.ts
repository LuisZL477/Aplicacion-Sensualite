import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service'; 
import { Product } from '../../../interfaces/product'; 
import { CartService } from '../../../services/cart.service'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  listProduct: Product[] = [];
  loading: boolean = false;

  constructor(
    private router: Router,
    private _productService: ProductService,
    private _cartService: CartService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this._productService.getProducts().subscribe((data: Product[]) => {
      this.listProduct = data;
      this.loading = false;
    }, error => {
      console.error('Error al obtener productos', error);
      this.loading = false;
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  addToCart(product: Product, event: Event) {
    this._cartService.addToCart(product);
    this.toastr.success(`${product.nombre} añadido al carrito.`, 'Producto Añadido');

    const buttonElement = (event.currentTarget as HTMLElement).querySelector('ion-icon');
    if (buttonElement) {
      this.animateCartButton(buttonElement);
    }
  }

  animateCartButton(buttonElement: HTMLElement) {
    this.renderer.addClass(buttonElement, 'animate__animated');
    this.renderer.addClass(buttonElement, 'animate__bounce');

    buttonElement.addEventListener('animationend', () => {
      this.renderer.removeClass(buttonElement, 'animate__animated');
      this.renderer.removeClass(buttonElement, 'animate__bounce');
    }, { once: true });
  }
  
  logout() {
    // Elimina el token del local storage
    localStorage.removeItem('token');

    // Redirige al usuario a la página de login
    this.router.navigate(['/login']);
  }
}
