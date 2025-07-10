# syntax=docker/dockerfile:1
FROM python:3.12.3-slim AS base
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
ENV PYTHONUNBUFFERED=1
COPY app/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt && rm -rf /root/.cache/pip
COPY app/ .
RUN addgroup --system djangogroup && adduser --system --ingroup djangogroup djangouser && \
    chown -R djangouser:djangogroup /app && chmod -R 750 /app
USER djangouser:djangogroup
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:8000/ || exit 1
CMD ["gunicorn", "projectname.wsgi:application", "--workers=2", "--bind", "0.0.0.0:8000"]
