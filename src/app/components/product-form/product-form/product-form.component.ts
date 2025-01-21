import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
     <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ isEditMode ? 'Edit Product' : 'Add Product' }}
        </h2>
        
        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="product.name"
              name="name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              [(ngModel)]="product.description"
              name="description"
              required
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            ></textarea>
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              [(ngModel)]="product.price"
              name="price"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
          </div>

          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              id="image"
              (change)="onFileSelected($event)"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            >
            <div *ngIf="product.image" class="mt-2">
              <img [src]="product.image" 
                   alt="Product preview" 
                   class="h-32 w-32 object-cover rounded-lg">
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              [routerLink]="['/products']"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})

export class ProductFormComponent implements OnInit {
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: ''
  };
  isEditMode = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.productService.get(id).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (e) => console.error(e)
      });
    }
  }

  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
    
      if (file.size > 1024 * 1024) {
        alert('File size should not exceed 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.productService.update(this.product.id!, this.product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (e) => console.error(e),
      });
    } else {
      this.productService.create(this.product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (e) => console.error(e),
      });
    }
  }
}
