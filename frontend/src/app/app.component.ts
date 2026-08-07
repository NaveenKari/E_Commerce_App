import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './shared/components/button/button.component';
import { BadgeComponent } from './shared/components/badge/badge.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { Product } from './core/models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonComponent, BadgeComponent, ProductCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  previewProduct: Product = {
    productId: 1,
    productName: 'Essence Mascara Lash Princess',
    image: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
    description: 'Preview product',
    quantity: 99,
    price: 9.99,
    discount: 10,
    specialPrice: 8.99,
  };
}
