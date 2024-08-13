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
  animatingIcons = new Set<number>();

  constructor(
    private router: Router,
    private _productService: ProductService,
    private _cartService: CartService,
    private toastr: ToastrService,
    private renderer: Renderer2,
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

  // Añadir un producto al carrito
  // addToCart(product: Product, event: MouseEvent, index: number) {
  //   if (this.animatingIcons.has(index)) return;

  //   this.animatingIcons.add(index);

  //   this._cartService.addToCart(product).subscribe(
  //     () => {
  //       this.toastr.success(`${product.nombre} añadido al carrito.`, 'Producto Añadido');
  //       this.animateCartButton(event.currentTarget as HTMLElement);
  //     },
  //     (error) => {
  //       console.error('Error al añadir el producto al carrito:', error);
  //       this.toastr.error('Ocurrió un error al añadir el producto al carrito.');
  //     }
  //   );

  //   setTimeout(() => this.animatingIcons.delete(index), 300);
  // }

  // isIconAnimating(index: number): boolean {
  //   return this.animatingIcons.has(index);
  // }

  // animateCartButton(buttonElement: HTMLElement) {
  //   const iconElement = buttonElement.querySelector('ion-icon');
  //   if (iconElement) {
  //     this.renderer.addClass(iconElement, 'animate__animated');
  //     this.renderer.addClass(iconElement, 'animate__bounce');

  //     iconElement.addEventListener('animationend', () => {
  //       this.renderer.removeClass(iconElement, 'animate__animated');
  //       this.renderer.removeClass(iconElement, 'animate__bounce');
  //     }, { once: true });
  //   }
  // }

  animateCartButton(buttonElement: HTMLElement) {
    const iconElement = buttonElement.querySelector('ion-icon');
    if (iconElement) {
      this.renderer.addClass(iconElement, 'animate__animated');
      this.renderer.addClass(iconElement, 'animate__bounce');
  
      iconElement.addEventListener('animationend', () => {
        this.renderer.removeClass(iconElement, 'animate__animated');
        this.renderer.removeClass(iconElement, 'animate__bounce');
      }, { once: true });
    }
  }
  

  addToCart(product: Product, event: MouseEvent, index: number) {
    if (this.animatingIcons.has(index)) return;
  
    this.animatingIcons.add(index);
  
    this._cartService.addToCart(product, 1).subscribe(
      () => {
        this.toastr.success(`${product.nombre} añadido al carrito.`, 'Producto Añadido');
  
        // Asegúrate de que `event.currentTarget` es un HTMLElement
        const target = event.currentTarget as HTMLElement;
        if (target) {
          this.animateCartButton(target);
        }
      },
      (error) => {
        console.error('Error al añadir el producto al carrito:', error);
        this.toastr.error('Ocurrió un error al añadir el producto al carrito.');
      }
    );
  
    setTimeout(() => this.animatingIcons.delete(index), 300);
  }
    

  logout() {
    // Elimina el token del local storage
    localStorage.removeItem('token');

    // Redirige al usuario a la página de login
    this.router.navigate(['/login']);
  }
}
