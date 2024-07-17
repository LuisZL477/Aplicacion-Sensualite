import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service'; 
import { Product } from '../../../interfaces/product'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  listProduct: Product[] = [];
  loading: boolean = false;

  constructor(private router: Router, private _productService: ProductService) { }

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

  logout() {
    // Elimina el token del local storage
    localStorage.removeItem('token');

    // Redirige al usuario a la página de login
    this.router.navigate(['/login']);
  }
}
