.PHONY: up down restart logs migrate seed status

# Menjalankan seluruh stack aplikasi dalam mode detached
up:
	docker compose up -d

# Mematikan aplikasi beserta volume-nya jika ingin reset total
down:
	docker compose down -v

# Melihat log dari aplikasi NestJS secara real-time
logs:
	docker compose logs -f app

# Melihat status healthcheck dari seluruh service
status:
	docker compose ps

# Menjalankan migrasi database di dalam container aplikasi
migrate:
	docker compose exec app npx prisma migrate dev

# Menjalankan database seeder di dalam container aplikasi
seed:
	docker compose exec app npx prisma db seed