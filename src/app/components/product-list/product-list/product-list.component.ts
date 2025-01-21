import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Products List</h2>
        <a [routerLink]="['/add']" 
           class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200">
          Add New Product
        </a>
      </div>

      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let product of products" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <img *ngIf="product.image" 
                     [src]="product.image" 
                     alt="Product image"
                     class="h-16 w-16 object-cover rounded">
                <div *ngIf="!product.image" 
                     class="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                  <span class="text-gray-400">No image</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ product.name }}</td>
              <td class="px-6 py-4">{{ product.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ product.price | currency }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-2">
                  <a [routerLink]="['/edit', product.id]" 
                     class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-200">
                    Edit
                  </a>
                  <button (click)="deleteProduct(product.id)"
                          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (e) => console.error(e),
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (e) => console.error(e),
      });
    }
  }
}
