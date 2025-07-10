import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>🚀 Angular Docker App</h1>
        <p>A modern Angular application running in Docker</p>
      </header>

      <nav class="nav">
        <button 
          *ngFor="let tab of tabs" 
          [class]="'nav-btn' + (activeTab === tab ? ' active' : '')"
          (click)="setActiveTab(tab)">
          {{ tab }}
        </button>
      </nav>

      <main class="main-content">
        <!-- Home Tab -->
        <div *ngIf="activeTab === 'Home'" class="tab-content">
          <div class="welcome-card">
            <h2>Welcome to Angular Docker Starter! 🎉</h2>
            <p>This is a production-ready Angular application with:</p>
            <ul>
              <li>TypeScript support</li>
              <li>HTTP client for API calls</li>
              <li>Modern Angular features</li>
              <li>Responsive design</li>
              <li>Docker containerization</li>
            </ul>
            <div class="stats">
              <div class="stat-card">
                <h3>{{ users.length }}</h3>
                <p>Total Users</p>
              </div>
              <div class="stat-card">
                <h3>{{ products.length }}</h3>
                <p>Total Products</p>
              </div>
              <div class="stat-card">
                <h3>{{ getProductsInStock() }}</h3>
                <p>In Stock</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div *ngIf="activeTab === 'Users'" class="tab-content">
          <h2>Users Management</h2>
          <div class="filter-bar">
            <select [(ngModel)]="selectedRole" (change)="filterUsers()">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div class="grid">
            <div *ngFor="let user of filteredUsers" class="card user-card">
              <h3>{{ user.name }}</h3>
              <p>{{ user.email }}</p>
              <span [class]="'role-badge ' + user.role">{{ user.role }}</span>
            </div>
          </div>
        </div>

        <!-- Products Tab -->
        <div *ngIf="activeTab === 'Products'" class="tab-content">
          <h2>Products Catalog</h2>
          <div class="filter-bar">
            <select [(ngModel)]="selectedCategory" (change)="filterProducts()">
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Education">Education</option>
              <option value="Furniture">Furniture</option>
            </select>
            <label>
              <input type="checkbox" [(ngModel)]="showInStockOnly" (change)="filterProducts()">
              In Stock Only
            </label>
          </div>
          <div class="grid">
            <div *ngFor="let product of filteredProducts" class="card product-card">
              <h3>{{ product.name }}</h3>
              <p class="price">\${{ product.price }}</p>
              <p class="category">{{ product.category }}</p>
              <span [class]="'stock-badge ' + (product.inStock ? 'in-stock' : 'out-of-stock')">
                {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>
          </div>
        </div>

        <!-- About Tab -->
        <div *ngIf="activeTab === 'About'" class="tab-content">
          <div class="about-card">
            <h2>About This Application</h2>
            <p>This Angular Docker starter provides:</p>
            <ul>
              <li><strong>Angular 17+</strong> - Latest Angular features</li>
              <li><strong>TypeScript</strong> - Type-safe development</li>
              <li><strong>Standalone Components</strong> - Modern Angular architecture</li>
              <li><strong>HTTP Client</strong> - API communication ready</li>
              <li><strong>Responsive Design</strong> - Works on all devices</li>
              <li><strong>Docker Ready</strong> - Production deployment ready</li>
            </ul>
            <div class="tech-info">
              <h3>Technology Stack</h3>
              <p><strong>Framework:</strong> Angular {{ angularVersion }}</p>
              <p><strong>Language:</strong> TypeScript</p>
              <p><strong>Build Tool:</strong> Angular CLI</p>
              <p><strong>Deployment:</strong> Docker + Nginx</p>
            </div>
          </div>
        </div>
      </main>

      <footer class="footer">
        <p>&copy; 2025 Angular Docker Starter. Built with ❤️ and Angular.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header {
      text-align: center;
      padding: 2rem;
      color: white;
    }

    .header h1 {
      margin: 0;
      font-size: 2.5rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .nav {
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
    }

    .nav-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 25px;
      background: rgba(255,255,255,0.2);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .nav-btn.active {
      background: white;
      color: #667eea;
      font-weight: bold;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .tab-content {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .welcome-card, .about-card {
      text-align: center;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 1.5rem;
      border-radius: 10px;
      text-align: center;
    }

    .stat-card h3 {
      margin: 0;
      font-size: 2rem;
    }

    .filter-bar {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 10px;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .card {
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 1.5rem;
      transition: transform 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .user-card h3 {
      color: #667eea;
      margin: 0 0 0.5rem 0;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.875rem;
      font-weight: bold;
    }

    .role-badge.admin {
      background: #dc3545;
      color: white;
    }

    .role-badge.user {
      background: #28a745;
      color: white;
    }

    .product-card h3 {
      color: #764ba2;
      margin: 0 0 0.5rem 0;
    }

    .price {
      font-size: 1.25rem;
      font-weight: bold;
      color: #28a745;
      margin: 0.5rem 0;
    }

    .category {
      color: #6c757d;
      margin: 0.5rem 0;
    }

    .stock-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.875rem;
      font-weight: bold;
    }

    .stock-badge.in-stock {
      background: #d4edda;
      color: #155724;
    }

    .stock-badge.out-of-stock {
      background: #f8d7da;
      color: #721c24;
    }

    .tech-info {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 10px;
      text-align: left;
    }

    .footer {
      text-align: center;
      padding: 2rem;
      color: white;
      background: rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .nav {
        flex-wrap: wrap;
      }
      
      .grid {
        grid-template-columns: 1fr;
      }
      
      .filter-bar {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'angular-docker-app';
  activeTab = 'Home';
  tabs = ['Home', 'Users', 'Products', 'About'];
  angularVersion = '17+';

  users: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
    { id: 3, name: 'Carol Brown', email: 'carol@example.com', role: 'user' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'user' },
    { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'admin' }
  ];

  products: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 999.99, category: 'Electronics', inStock: true },
    { id: 2, name: 'Angular Guide', price: 19.99, category: 'Education', inStock: true },
    { id: 3, name: 'Office Chair', price: 149.99, category: 'Furniture', inStock: false },
    { id: 4, name: 'Smartphone', price: 699.99, category: 'Electronics', inStock: true },
    { id: 5, name: 'Desk Lamp', price: 39.99, category: 'Furniture', inStock: true },
    { id: 6, name: 'TypeScript Book', price: 29.99, category: 'Education', inStock: false }
  ];

  filteredUsers: User[] = [...this.users];
  filteredProducts: Product[] = [...this.products];
  selectedRole = '';
  selectedCategory = '';
  showInStockOnly = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('🚀 Angular Docker App initialized');
    this.filterUsers();
    this.filterProducts();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      return !this.selectedRole || user.role === this.selectedRole;
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const categoryMatch = !this.selectedCategory || product.category === this.selectedCategory;
      const stockMatch = !this.showInStockOnly || product.inStock;
      return categoryMatch && stockMatch;
    });
  }

  getProductsInStock(): number {
    return this.products.filter(p => p.inStock).length;
  }
} 