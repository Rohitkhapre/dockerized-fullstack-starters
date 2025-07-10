# syntax=docker/dockerfile:1
FROM python:3.12.3-slim AS base
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
ENV PYTHONUNBUFFERED=1
COPY app/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt && rm -rf /root/.cache/pip
COPY app/ .
RUN addgroup --system flaskgroup && adduser --system --ingroup flaskgroup flaskuser && \
    chown -R flaskuser:flaskgroup /app && chmod -R 750 /app
USER flaskuser:flaskgroup
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "app:app"]
