# syntax=docker/dockerfile:1
FROM node:20.12.2-alpine3.19 AS builder
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY app/package*.json ./
RUN npm ci && npm cache clean --force
COPY app/ .
RUN npm run build -- --output-path=dist

FROM nginx:1.25.5-alpine
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
RUN addgroup -S webgroup && adduser -S webuser -G webgroup
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /etc/nginx/conf.d && chown -R webuser:webgroup /usr/share/nginx/html && chmod -R 750 /usr/share/nginx/html
USER webuser:webgroup
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
