# 🚗 Car Rental Application (Dockerized Microservices)

This is a Dockerized microservice-based Car Rental Application built with Spring Boot (backend), React (frontend), MySQL, Redis, and Eureka Service Registry.

## ✨ Features

It demonstrates:
- ✅ Microservices with service discovery
- ✅ API Gateway routing
- ✅ Authentication & Authorization
- ✅ Redis-based locking
- ✅ React frontend consuming APIs
- ✅ Docker Compose for easy setup

---

## 🚀 Getting Started Guide

### Initial Setup (Admin Configuration)

Before users can rent cars, an admin must set up the system:

#### 1. **Admin Signup**
- Navigate to the hidden admin signup page: 👉 [http://localhost:3000/admin/signup](http://localhost:3000/admin/signup)
- Create an admin account
- ⚠️ **Important:** Make sure to use **`ADMIN`** as the role during signup (this is for testing purposes and authentication is based on this role)

#### 2. **Admin Login**
- Access the admin login page: 👉 [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Log in with your admin credentials

#### 3. **Configure Cities**
- Once logged in to the admin panel, add cities where cars will be available
- This is required before adding cars

#### 4. **Add Cars**
- Use the admin UI to add cars to the inventory
- Specify details like car model, availability, pricing, and city location

#### 5. **Manage Data**
- The admin panel allows you to modify existing data (cities, cars, availability)
- Keep the inventory updated as needed

---

### User Workflow

#### 1. **User Registration**
- Regular users can sign up at: 👉 [http://localhost:3000](http://localhost:3000)
- Complete the registration process

#### 2. **Browse and Rent Cars**
- Select desired **date range** for the rental period
- Choose a **city** where you want to rent a car
- View **available cars** for the selected period and location

#### 3. **Complete Booking**
- Select a car and complete the rental booking
- The system uses **Redis-based distributed locking** to ensure data consistency
- This prevents race conditions and ensures only one user can modify car availability counts at a time

---

## 🔒 Security & Concurrency Features

- **Role-Based Authentication:** Admin and User roles with different access levels
- **Distributed Locking:** Redis-based locking mechanism ensures thread-safe operations during booking
- **Conflict Prevention:** Multiple users cannot simultaneously book the last available car
- **Data Consistency:** Guarantees accurate inventory counts even under high concurrent load

---

## 📦 Prerequisites

Make sure you have the following installed:
- **[Docker](https://www.docker.com/get-started)** - Container platform
- **[Docker Compose](https://docs.docker.com/compose/install/)** - Multi-container orchestration
- (Optional) **[Git](https://git-scm.com/downloads)** - Version control to clone the repo

---

## 🛠️ How to Run the Application

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Car-Rental
```

### 2. Build the JARs for all backend services

```bash
./build-all-mac.sh
```

*This script runs Gradle builds and prepares Docker images for each service*

### 3. Start all services with Docker Compose

```bash
docker-compose up -d --build
```

This will start:
- **mysql-db** (MySQL 8)
- **redis** (Redis 7 Alpine)
- **eureka-server** (Service discovery)
- **api-gateway** (Gateway for all microservices)
- **auth-service** (Authentication service)
- **car-service** (Car rental service)
- **admin-service** (Admin dashboard service)
- **user-service** (User profile service)
- **react-frontend** (React app served via Nginx)

---

## 🌍 Accessing the Application

### Frontend (React UI)
👉 [http://localhost:3000](http://localhost:3000)

### Eureka Dashboard (Service Discovery)
👉 [http://localhost:8761](http://localhost:8761)

### API Gateway (Entry point for APIs)
👉 [http://localhost:8080](http://localhost:8080)

### MySQL DB
- **Host:** localhost
- **Port:** 3306
- **Username:** root
- **Password:** root
- **Default DB:** car_rental

### Redis
- **Host:** localhost
- **Port:** 6379

---

## 🛑 Stopping the Application

```bash
docker-compose down
```

---

## 🔍 Troubleshooting

### Check running containers
```bash
docker ps
```

### View logs of a specific service
```bash
docker logs <container_name>
```

**Example:**
```bash
docker logs api-gateway
```

### If MySQL DB isn't created

Connect to MySQL inside container:
```bash
docker exec -it mysql-db mysql -uroot -proot
```

Verify `car_rental` database exists:
```sql
SHOW DATABASES;
```

---

## 📂 Project Structure

```
Car-Rental/
├── Backend/
│   ├── admin/              # Admin service
│   ├── api-gateway/        # API Gateway
│   ├── authservice/        # Authentication service
│   ├── carrentalservice/   # Car rental service
│   ├── eureka-server/      # Service discovery (Eureka)
│   └── userservice/        # User profile service
├── Frontend/
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   ├── node_modules/       # Dependencies
│   ├── Dockerfile          # Frontend Docker config
│   ├── nginx.conf          # Nginx configuration
│   ├── package.json        # NPM dependencies
│   ├── package-lock.json   # NPM lock file
│   └── LICENSE             # License file
├── docker-compose.yml      # Docker orchestration
├── build-all-mac.sh        # Build script for macOS
└── README.md               # Project documentation
```
