# 1. Boshlang'ich Docker imijini tanlash
FROM node:18-alpine

# 2. Ishchi katalogni yaratish va unga kirish
WORKDIR /app

# 3. package.json va package-lock.json fayllarini nusxalash
COPY package*.json ./

# 4. Loyihadagi kerakli paketlarni o'rnatish
RUN npm install

# 5. Source kodini nusxalash
COPY . .

# 6. Build jarayonini bajarish (agar TypeScript ishlatayotgan bo'lsangiz)
RUN npm run build

# 7. Server portini eslatib o‘tish
EXPOSE 3000

# 8. Loyihani ishga tushirish
CMD ["npm", "run", "start"]
