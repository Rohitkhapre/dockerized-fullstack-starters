# syntax=docker/dockerfile:1
FROM ruby:3.2.3-alpine3.19 AS builder
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
RUN apk add --no-cache build-base nodejs postgresql-dev tzdata
COPY app/Gemfile* ./
RUN bundle install --without development test && rm -rf /usr/local/bundle/cache
COPY app/ .
RUN bundle exec rake assets:precompile && chown -R 1000:1000 /app && chmod -R 750 /app

FROM ruby:3.2.3-alpine3.19
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
RUN apk add --no-cache postgresql-dev tzdata
COPY --from=builder /app /app
RUN addgroup -g 1000 railsgroup && adduser -D -u 1000 -G railsgroup railsuser && chown -R railsuser:railsgroup /app && chmod -R 750 /app
USER railsuser:railsgroup
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
