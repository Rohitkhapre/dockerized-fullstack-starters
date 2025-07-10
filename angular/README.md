# Angular Docker Stack

Production-ready, security-hardened Docker setup for Angular applications with nginx serving.

## Features

- **Multi-stage build** for optimized production builds
- **Nginx static file serving** with security headers
- **Non-root user** with custom user/group for security
- **Security headers** (CSP, HSTS, XSS protection, etc.)
- **Health checks** for container monitoring
- **Security hardening** with dropped capabilities and read-only filesystem

## Quick Start

1. Add your Angular application to the `app/` directory
2. Ensure `package.json` and Angular CLI are configured
3. Build and run the container:

```bash
docker compose build
docker compose up
```

Application available at `http://localhost:8085`

## Application Requirements

- Angular project with `package.json`
- Angular CLI build configuration
- Build output directory (usually `dist/`)

### Example package.json:
```json
{
  "name": "my-angular-app",
  "version": "1.0.0",
  "scripts": {
    "build": "ng build",
    "build:prod": "ng build --configuration=production"
  },
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    "@angular/router": "^17.0.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "typescript": "~5.2.0"
  }
}
```

### Angular CLI Setup:
```bash
# Create new Angular app in app/ directory
cd app/
npx @angular/cli new . --routing=true --style=scss
```

### Example Component:
```typescript
// app.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>{{title}}</h1>
      <p>Welcome to Angular!</p>
      <div *ngIf="healthStatus">
        Status: {{healthStatus.status}}
      </div>
    </div>
  `,
  styles: [`
    .container { 
      padding: 20px; 
      text-align: center; 
    }
  `]
})
export class AppComponent {
  title = 'My Angular App';
  healthStatus: any = null;

  constructor(private http: HttpClient) {
    this.checkHealth();
  }

  checkHealth() {
    // For development, you might call an API
    this.healthStatus = { status: 'healthy' };
  }
}
```

## Security Features

### Docker Security:
- **Non-root execution**: Runs as `webuser:webgroup`
- **Read-only filesystem**: Container filesystem is read-only
- **Capability dropping**: All Linux capabilities removed
- **No new privileges**: Prevents privilege escalation
- **Pinned base images**: Node.js 20.12.2 and nginx 1.25.5

### Nginx Security Headers:
- **Content-Security-Policy**: Controls resource loading
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Strict-Transport-Security**: Enforces HTTPS
- **Server tokens disabled**: Hides nginx version

## Build Configuration

### angular.json:
```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json"
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                }
              ],
              "outputHashing": "all"
            }
          }
        }
      }
    }
  }
}
```

## Environment Configuration

### Environment Files:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

### Build-time Variables:
```dockerfile
# In Dockerfile, add build args
ARG API_URL=https://api.example.com
RUN sed -i "s|API_URL_PLACEHOLDER|${API_URL}|g" src/environments/environment.prod.ts
```

## Routing and Navigation

### App Routing:
```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## HTTP Services

### API Service:
```typescript
// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }

  createUser(user: any) {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  getHealth() {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
```

## Production Deployment

### Multi-environment Setup:
```yaml
# docker-compose.yml with environment variables
services:
  angular-app:
    build:
      context: .
      args:
        - API_URL=${API_URL:-https://api.example.com}
    environment:
      - NODE_ENV=production
```

### CDN Integration:
```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
```

## Performance Optimization

### Lazy Loading:
```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
  }
];
```

### Service Workers:
```bash
# Add PWA support
ng add @angular/pwa
```

### Bundle Analysis:
```bash
# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## Testing

### Unit Tests:
```typescript
// app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
```

### E2E Tests:
```typescript
// e2e/src/app.e2e-spec.ts
import { browser, by, element } from 'protractor';

describe('App E2E', () => {
  it('should display welcome message', () => {
    browser.get('/');
    expect(element(by.css('h1')).getText()).toEqual('My Angular App');
  });
});
```

## Customization

- **Port**: Change in docker-compose.yml ports mapping
- **API endpoint**: Update environment files
- **Styling**: Add CSS frameworks (Bootstrap, Material, etc.)
- **Proxy configuration**: Add proxy.conf.json for development

### Development Proxy:
```json
// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": true,
    "changeOrigin": true
  }
}
```

## Troubleshooting

- **Build failures**: Check Node.js version and dependencies
- **Routing issues**: Verify nginx configuration for SPA
- **API calls**: Check CORS configuration and environment variables
- **Bundle size**: Use Angular CLI bundle analyzer 