import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service'; // Asegúrate de que la ruta sea correcta
import { Category } from '../../../interfaces/category';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => this.categories = data,
      error: (err) => console.error('Error al obtener categorías', err)
    });
  }
}
