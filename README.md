Upkeep — Maintenance Scheduling System

Upkeep is a property & asset maintenance tracker built as a SaaS-style, cloud-deployed system. Users log assets they own and define recurring maintenance schedules. The backend automatically enforces data access rules and ensures maintenance tasks are surfaced at the right time.

GitHub Pages (React/Vite)

        ⇅  HTTPS + JWT

Render Web Service (Spring Boot + Docker)

        ⇅  TLS
        
Aiven MySQL (Cloud)

Key Technical Features:

OAuth2 Resource Server (Auth0) — JWT validation (issuer + audience)

Stateless API — no server sessions

Role: user-scoped access — strict filtering on all queries

CORS — restricted to GH Pages origin

JPA/Hibernate — relational model: User → Asset → MaintenanceTask

Dockerized build — multi-stage Maven + JRE image

Cloud MySQL — TLS-only connection


Backend:

Framework	- Spring Boot 3

Security	- Spring Security + Auth0

Deployment	- Render (Docker runtime)

DB	- Aiven MySQL

Config	- Server + DB via env vars


<img width="1508" height="863" alt="Screenshot 2025-10-25 at 12 22 00" src="https://github.com/user-attachments/assets/e99bd892-0663-441a-9a87-e69ee86af609" />

<img width="1512" height="865" alt="Screenshot 2025-10-25 at 12 35 39" src="https://github.com/user-attachments/assets/a0dafb85-ca15-4a1b-8185-2871152bdfc4" />

<img width="1512" height="862" alt="Screenshot 2025-10-25 at 12 36 09" src="https://github.com/user-attachments/assets/83697054-2131-42ff-a84a-ac86fd4efe82" />

<img width="1511" height="855" alt="Screenshot 2025-10-25 at 12 36 52" src="https://github.com/user-attachments/assets/cb28c926-943f-40c5-ac59-6f5ea213d7f4" />


