# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:8.0.300 AS build
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /src
COPY app/*.csproj ./
RUN dotnet restore
COPY app/ .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0.300-alpine3.19
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY --from=build /app/publish .
RUN addgroup -g 1000 dotnetgrp && adduser -D -u 1000 -G dotnetgrp dotnetuser && chown -R dotnetuser:dotnetgrp /app && chmod -R 750 /app
USER dotnetuser:dotnetgrp
EXPOSE 8084
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:8084/ || exit 1
ENTRYPOINT ["dotnet", "app.dll"]
