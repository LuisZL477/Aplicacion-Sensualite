import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductService } from '../../../services/product.service'; 
import { Product } from '../../../interfaces/product'; 
import { CartService } from '../../../services/cart.service'; 
import { CategoryService } from '../../../services/category.service'; 
import { Category } from '../../../interfaces/category'; 
import { MenuController } from '@ionic/angular';  // Importa el MenuController de Ionic

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  listProduct: Product[] = [];
  allProducts: Product[] = []; // Para guardar la lista completa de productos
  categories: Category[] = [];
  loading: boolean = false;
  animatingIcons = new Set<number>();
  userName: string | null = '';
  showCategories: boolean = true; // Controla la visibilidad de las categorías

  constructor(
    private router: Router,
    private _productService: ProductService,
    private _cartService: CartService,
    private renderer: Renderer2,
    private categoryService: CategoryService,
    private menuCtrl: MenuController  // Añadir el controlador del menú
  ) { }

  ngOnInit() {
    this.getProducts();
    this.getUserName();
    this.loadCategories(); // Cargar categorías
  }

  getUserName() {
    // Suponiendo que el nombre del usuario se almacena en localStorage
    this.userName = localStorage.getItem('userName');
  }

  getProducts() {
    this.loading = true;
    this._productService.getProducts().subscribe((data: Product[]) => {
      this.listProduct = data;
      this.allProducts = data; // Guardar la lista completa de productos
      this.loading = false;
    }, error => {
      console.error('Error al obtener productos', error);
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al obtener los productos.',
        confirmButtonColor: '#d33',
        heightAuto: false,
      });
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => this.categories = data,
      error: (err) => {
        console.error('Error al obtener categorías', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al obtener las categorías.',
          confirmButtonColor: '#d33',
          heightAuto: false,
        });
      }
    });
  }

  filterProductsByCategory(categoryName: string) {
    if (categoryName) {
        this.listProduct = this.allProducts.filter(product => product.tipo === categoryName);
    } else {
        this.listProduct = this.allProducts; // Si no hay categoría seleccionada, mostrar todos los productos
    }

    // Cierra el menú después de seleccionar la categoría
    this.menuCtrl.close('main-menu');
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  perfil() {
    this.router.navigate(['/perfil']);
  }

  isIconAnimating(index: number): boolean {
    return this.animatingIcons.has(index);
  }

  animateCartButton(buttonElement: HTMLElement) {
    const iconElement = buttonElement.querySelector('ion-icon');
    if (iconElement) {
        this.renderer.addClass(iconElement, 'custom-cart-animation');
        
        iconElement.addEventListener('transitionend', () => {
            this.renderer.removeClass(iconElement, 'custom-cart-animation');
        }, { once: true });
    }
}

  addToCart(product: Product, event: MouseEvent, index: number) {
    if (this.animatingIcons.has(index)) return;

    this.animatingIcons.add(index);

    this._cartService.addToCart(product, 1).subscribe(
        () => {
            Swal.fire({
                icon: 'success',
                title: 'Producto Añadido',
                text: `${product.nombre} añadido al carrito.`,
                confirmButtonColor: '#3085d6',
                heightAuto: false,
            });

            const target = event.currentTarget as HTMLElement;
            if (target) {
                this.animateCartButton(target);
            }
        },
        (error) => {
            console.error('Error al añadir el producto al carrito:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al añadir el producto al carrito.',
                confirmButtonColor: '#d33',
                heightAuto: false,
            });
        }
    );

    setTimeout(() => this.animatingIcons.delete(index), 300);
}

logout() {
  // Elimina el token y el nombre del usuario del local storage
  localStorage.removeItem('token');
  localStorage.removeItem('userName');

  // Elimina la cookie del token
  this.deleteCookie('authToken');

  // Redirige al usuario a la página de login
  this.router.navigate(['/login']);
}

// Función para eliminar la cookie
deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

  openMenu() {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => this.categories = data,
      error: (err) => console.error('Error al obtener categorías', err)
    });
  }

  goToDashboard() {
    this.showCategories = true; // Mostrar la sección de categorías nuevamente
    this.listProduct = this.allProducts;  
    this.menuCtrl.close('main-menu'); 
  }
}
