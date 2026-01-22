🏢 SME Modular ERP System

A modular, microservices-based ERP system designed for Small & Medium Enterprises (SMEs), covering end-to-end business operations including Sales, Inventory, Accounting, HR, Security, and Admin Analytics.

This ERP follows real-world enterprise architecture patterns, not demo shortcuts.

📌 Key Highlights

🔧 Microservices Architecture

🔐 JWT-based Security with API Gateway

🧱 Domain-driven design (no shared databases)

🔄 Event-driven & idempotent flows

📊 Admin Dashboard with KPIs & charts

🧠 Real ERP business flows (Sales → Inventory → Accounting)

🎨 Clean, enterprise-grade React UI

🧱 Tech Stack
Backend

Java 17

Spring Boot 3.x

Spring Security + JWT

Spring Data JPA

Spring Cloud Gateway

Eureka Service Discovery

MySQL

RESTful APIs

Frontend

React

Axios-based API layer

Role-based routing

Reusable UI components

Recharts (Analytics & KPIs)

🧩 Microservices Overview
Service	Description
erp-security	Authentication, JWT issuing, role management
api-gateway	Central entry point, JWT enforcement, routing
erp-sales	Sales orders, order lifecycle
erp-inventory	Inventory stock, adjustments, availability
erp-accounting	Invoices, payments, aging reports
erp-hr	Employees, departments, lifecycle
eureka-server	Service discovery
🔐 Security Model

JWT issued by erp-security

Enforced at API Gateway

Role-based access:

ADMIN

SALES

INVENTORY

ACCOUNTANT

HR

USER (portal user)

No service-to-service DB sharing

Internal service calls handled safely

🔁 Core Business Flows
🛒 Sales → Inventory → Accounting

Sales Order created (DRAFT)

Order confirmed

Inventory stock deducted

Accounting invoice auto-created

Invoice tracked for payment & aging

⚠️ No manual invoice creation required — invoices are system-generated

👥 HR Lifecycle

Employee creation

Department master (active/inactive)

Lifecycle states:

ACTIVE

ON_LEAVE

RESIGNED

TERMINATED

Backend-enforced rules

Admin KPIs reflect real-time headcount

📊 Admin Dashboard

Real-time KPIs across domains:

Sales

Pending sales orders

Inventory

Low stock alerts

Accounting

Outstanding amount

Overdue invoices

Issued vs Paid invoices

Aging buckets (0–30, 31–60, 60+ days)

HR

Total employees

Active / On Leave

Exited employees

Charts built using Recharts and ChartCard components.

🖥️ Frontend Structure
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
 │   ├── api.js
 │   ├── salesApi.js
 │   ├── inventoryApi.js
 │   ├── accountingApi.js
 │   ├── hrApi.js
 │   └── departmentApi.js
 │
 └── context/
     └── AuthContext

🚀 How to Run Locally
Backend

Start Eureka Server

Start services in order:

erp-security

api-gateway

erp-sales

erp-inventory

erp-accounting

erp-hr

Ensure MySQL is running

Frontend
npm install
npm start


Frontend runs at:

http://localhost:3000


Gateway runs at:

http://localhost:8080

🧪 Design Principles Followed

Single responsibility per service

No shared DBs

Backend is authoritative (UI is not trusted)

Idempotent operations

Production-grade validation

Clear separation of concerns

📈 Future Enhancements

Audit logs

Approval workflows

Multi-branch support

Multi-currency accounting

PDF invoice export

Role-based dashboard customization

Dark mode

👨‍💻 Author

Built as a real-world ERP system focusing on:

Correct architecture

Clean domain modeling

Practical business flows

Enterprise-grade UI
