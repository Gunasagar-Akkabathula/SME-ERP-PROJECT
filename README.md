🏢 SME Modular ERP System
--------------------------
A production-grade, microservices-based ERP system for Small & Medium Enterprises (SMEs)
Built with real business flows, enterprise architecture, and clean UI.

🚀 Why This Project?
-------------------
This ERP system is designed to simulate real-world enterprise operations, focusing on:
Correct domain separation
Scalable architecture
Backend-driven business rules
Professional admin UI
✔ No shared databases
✔ No shortcut logic
✔ No hardcoded flows

🧱 Tech Stack
🔧 Backend
--------------------
Java 17
Spring Boot 3.x
Spring Security + JWT
Spring Data JPA
Spring Cloud Gateway
Eureka Service Discovery
MySQL
REST APIs

🎨 Frontend
--------------------
React
Axios
Role-based routing
Recharts (Charts & KPIs)
Reusable UI components

🧩 Microservices Architecture
-----------------------------
Service	Responsibility
erp-security	Authentication, JWT issuing, roles
api-gateway	Central entry point, JWT enforcement
erp-sales	Sales orders & lifecycle
erp-inventory	Inventory & stock management
erp-accounting	Invoices, payments, aging
erp-hr	Employees, departments, lifecycle
eureka-server	Service discovery
🔐 Security & Access Control
JWT-based authentication
Token enforced at API Gateway

Role-based access:
-----------------
ADMIN
SALES
INVENTORY
ACCOUNTANT
HR
USER(Portal user)

Backend always authoritative
Safe internal service communication

🔁 Core ERP Business Flows
--------------------------
🛒 Sales → Inventory → Accounting
Sales order created (DRAFT)
Order confirmed
Inventory stock deducted
Invoice auto-generated
Payment & aging tracked
🔥 No manual invoice creation — fully system-driven

👥 HR Management
----------------

Employee master
Department master (active/inactive)

Employee lifecycle:
------------------
ACTIVE
ON_LEAVE
RESIGNED
TERMINATED

Backend-validated lifecycle transitions
----------------------------------------

HR KPIs available to Admin

📊 Admin Dashboard (Real-Time KPIs)
-----------------------------------
📈 Sales
Pending sales orders
📦 Inventory
Low stock alerts
💰 Accounting
Outstanding amount
Overdue invoices
Issued vs Paid
Invoice aging (0–30, 31–60, 60+ days)

👥 HR
------
Total employees
Active / On leave
Exited employees
All charts powered by Recharts.

🖥️ Frontend Structure
----------------------
src/
 ├── components/
 │   ├── Navbar
 │   ├── Sidebar
 │   ├── StatCard
 │   ├── ChartCard
 │   └── StatusBadge
 │
 ├── pages/
 │   ├── Dashboard
 │   ├── Sales
 │   ├── Inventory
 │   ├── Accounting
 │   ├── Reports
 │   ├── Hr
 │   │   ├── Employees
 │   │   └── Departments
 │   ├── Login
 │   ├── Register
 │   └── Profile
 │
 ├── services/
 │   └── API modules (Sales, HR, Accounting, Inventory)
 │
 └── context/
     └── AuthContext

▶️ How to Run Locally
Backend
--------------------

Start Eureka Server

Start services:

erp-security

api-gateway

erp-sales

erp-inventory

erp-accounting

erp-hr

Ensure MySQL is running

Frontend
--------
npm install
npm start


Frontend: http://localhost:3000

API Gateway: http://localhost:8080

🧠 Architecture Principles Followed
------------------------------------

Microservices with clear boundaries

No shared databases

Backend-first validation

Idempotent operations

Real ERP lifecycle modeling


👨‍💻 Author
---------

Built as a real-world ERP system with focus on:
Clean architecture
Enterprise patterns
Practical business flows
Professional UI/UX
