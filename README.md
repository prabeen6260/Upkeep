---

# **Upkeep — Maintenance Scheduling System**

Upkeep is a property & asset maintenance tracker built as a SaaS-style, cloud-deployed system.
Users log assets they own and define recurring maintenance schedules.
The backend enforces secure data access and surfaces upcoming maintenance tasks.

---

## **Architecture**

```
React (Vite) — GitHub Pages (public)
        ⇅  HTTPS + JWT
Spring Boot API — Render (Docker)
        ⇅  TLS
Aiven MySQL — Cloud-hosted
```

---

## **Key Technical Features**

* OAuth2 Resource Server (Auth0) — JWT validation (issuer + audience)
* Stateless API — no server sessions
* User-scoped data access — strict filtering on all DB queries
* CORS enforced — GitHub Pages origin only
* JPA/Hibernate — relational model:

  ```
  User → Asset → MaintenanceTask
  ```
* Multi-stage Docker build — small deployable runtime
* Cloud MySQL with enforced TLS

---

## **Backend**

| Concern       | Detail                                |
| ------------- | ------------------------------------- |
| Framework     | Spring Boot 3                         |
| Security      | Spring Security + Auth0               |
| Deployment    | Render (Docker runtime)               |
| Database      | Aiven MySQL                           |
| Configuration | Server + DB via environment variables |

---

## **Screenshots**

<img width="1508" alt="Dashboard" src="https://github.com/user-attachments/assets/e99bd892-0663-441a-9a87-e69ee86af609" />

<br>

<img width="1512" alt="Add Asset" src="https://github.com/user-attachments/assets/a0dafb85-ca15-4a1b-8185-2871152bdfc4" />

<br>

<img width="1512" alt="Add Task" src="https://github.com/user-attachments/assets/83697054-2131-42ff-a84a-ac86fd4efe82" />

<br>

<img width="1511" alt="Tasks Overview" src="https://github.com/user-attachments/assets/cb28c926-943f-40c5-ac59-6f5ea213d7f4" />


