
# Gunakan image base Node yang sangat ringan untuk menjalankan app
FROM node:18-alpine

WORKDIR /app

# Atur environment ke production
ENV NODE_ENV production

# Copy folder standalone hasil build local (intinya servernya)
COPY .next/standalone ./

# Copy folder static (css/gambar/js client) ke tempat yang benar di dalam standalone
COPY .next/static ./.next/static

# Copy folder public (favicon, gambar statis)
COPY public ./public

# Expose port 3000
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]
