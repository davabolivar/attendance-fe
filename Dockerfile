# Gunakan image Node.js resmi
FROM node:20-alpine

# Install package pendukung seperti openssl, git, dll (jika perlu)
RUN apk add --no-cache bash

# Set direktori kerja
WORKDIR /app

# Salin file package dulu agar caching build Docker efisien
COPY package*.json ./

# Install dependency
RUN npm install

# Salin semua file ke container
COPY . .

# Expose port dev mode (biasanya 3000, atau nanti override dengan 3001)
EXPOSE 3001

# Jalankan dalam mode dev (bisa diubah via docker-compose)
CMD ["npm", "run", "dev"]
