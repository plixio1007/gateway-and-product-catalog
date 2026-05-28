FROM node:22

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install seluruh dependencies (termasuk devDependencies untuk hot-reload)
RUN npm install

# Copy source code dan skema prisma
COPY . .

# Generate Prisma Client agar type-safe di dalam container
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]