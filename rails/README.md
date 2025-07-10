# Ruby on Rails Docker Stack

Production-ready, security-hardened Docker setup for Ruby on Rails applications with Puma server.

## Features

- **Multi-stage build** with asset precompilation
- **Puma web server** for production performance
- **Non-root user** with security hardening
- **Health checks** and resource limits
- **Alpine Linux** for minimal image size

## Quick Start

1. Add your Rails application to the `app/` directory
2. Ensure `Gemfile` and `Gemfile.lock` are present
3. Update Dockerfile paths if needed

```bash
docker compose build
docker compose up
```

Application available at `http://localhost:3001`

## Application Requirements

- Rails application with `Gemfile`
- Puma configuration in `config/puma.rb`
- Asset pipeline configured for production

### Example Gemfile:
```ruby
source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.2.3'

gem 'rails', '~> 7.0.0'
gem 'puma', '~> 5.0'
gem 'pg', '~> 1.1'
gem 'bootsnap', '>= 1.4.4', require: false

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end
```

## Security Features

- Runs as `railsuser:railsgroup` (UID/GID 1000)
- Read-only filesystem with tmpfs for temporary files
- All Linux capabilities dropped
- Pinned Ruby version (3.2.3-alpine3.19)
- Bundle cache removed for smaller image

## Production Setup

### Database Configuration:
```yaml
# config/database.yml
production:
  adapter: postgresql
  encoding: unicode
  database: <%= ENV['DATABASE_NAME'] %>
  username: <%= ENV['DATABASE_USER'] %>
  password: <%= ENV['DATABASE_PASSWORD'] %>
  host: <%= ENV['DATABASE_HOST'] %>
  port: <%= ENV['DATABASE_PORT'] %>
```

### Environment Variables:
```yaml
environment:
  - RAILS_ENV=production
  - SECRET_KEY_BASE=your-secret-key
  - DATABASE_URL=postgresql://user:pass@db:5432/rails_app
```

### With PostgreSQL:
```yaml
services:
  rails-app:
    build: .
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://rails:password@db:5432/rails_production
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: rails_production
      POSTGRES_USER: rails
      POSTGRES_PASSWORD: password
```

## Asset Pipeline

Assets are precompiled during build:
```bash
# In Dockerfile
RUN bundle exec rake assets:precompile
```

For custom asset configuration:
```ruby
# config/environments/production.rb
config.assets.compile = false
config.assets.digest = true
config.public_file_server.enabled = true
```

## API Development

```ruby
# app/controllers/api/v1/base_controller.rb
class Api::V1::BaseController < ApplicationController
  protect_from_forgery with: :null_session
  respond_to :json
end

# app/controllers/api/v1/users_controller.rb
class Api::V1::UsersController < Api::V1::BaseController
  def index
    render json: { users: User.all }
  end
  
  def health
    render json: { status: 'healthy', service: 'rails-app' }
  end
end
```

## Customization

- Update port in docker-compose.yml
- Modify Puma workers in `config/puma.rb`
- Add background job processing (Sidekiq, etc.)
- Configure Redis for caching and sessions

## Troubleshooting

- Check logs: `docker compose logs rails-app`
- Database migrations: `docker compose exec rails-app rails db:migrate`
- Asset issues: Verify precompilation step
- Permission errors: Check file ownership and paths 