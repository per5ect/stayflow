# StayFlow — DevOps

---

## 1. Architektura

### Diagram komponent

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                            │
│              zdrojový kód + k8s manifesty + CI konfigurace          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ git push / pull_request
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       GitHub Actions CI/CD                          │
│                                                                     │
│  ┌──────────────────┐        ┌──────────────────┐                  │
│  │   backend job    │        │   frontend job   │                  │
│  │                  │        │                  │                  │
│  │  Checkstyle      │        │  ESLint          │                  │
│  │  mvn verify      │        │  npm build       │                  │
│  │  Docker build    │        │  Docker build    │                  │
│  │  push → GHCR     │        │  push → GHCR     │                  │
│  └────────┬─────────┘        └────────┬─────────┘                  │
│           └──────────────┬────────────┘                             │
│                          ▼                                          │
│     ┌─────────────────────────────────────────┐                    │
│     │  deploy-staging   (push → main)         │                    │
│     │  deploy-production (push → tag v*.*.*)  │                    │
│     └─────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │   GHCR (GitHub Container Reg.) │
              │   stayflow-backend:<tag>        │
              │   stayflow-frontend:<tag>       │
              └────────────────┬───────────────┘
                               │
              ┌────────────────┴───────────────┐
              ▼                                ▼
┌─────────────────────────┐   ┌──────────────────────────┐
│  KinD cluster           │   │  KinD cluster            │
│  namespace: staging     │   │  namespace: production   │
│                         │   │                          │
│  Ingress (nginx)        │   │  Ingress (nginx)         │
│  stayflow-staging.local │   │  stayflow.local          │
│         │               │   │         │                │
│  ┌──────▼──────┐        │   │  ┌──────▼──────┐        │
│  │  frontend   │        │   │  │  frontend   │        │
│  │  1 replika  │        │   │  │  1 replika  │        │
│  └──────┬──────┘        │   │  └──────┬──────┘        │
│         │               │   │         │                │
│  ┌──────▼──────┐        │   │  ┌──────▼──────┐        │
│  │  backend    │        │   │  │  backend    │        │
│  │  1 replika  │        │   │  │  2 repliky  │        │
│  └──────┬──────┘        │   │  └──────┬──────┘        │
│         │               │   │         │                │
│  ┌──────▼──────┐        │   │  ┌──────▼──────┐        │
│  │  postgres   │        │   │  │  postgres   │        │
│  │  + PVC      │        │   │  │  + PVC      │        │
│  └─────────────┘        │   │  └─────────────┘        │
└─────────────────────────┘   └──────────────────────────┘
```

### Datové toky za běhu

```
Prohlížeč
    │  HTTP :80
    ▼
nginx Ingress
    ├─ /      → frontend :3000  (Next.js)
    └─ /api   → backend  :8080  (Spring Boot)
                    │
                    ├─ JDBC/JPA → PostgreSQL :5432  (data aplikace)
                    ├─ HTTPS    → Cloudinary API    (ukládání fotek)
                    └─ SMTP     → Gmail             (e-maily, notifikace)
```

### CI/CD tok

```
git push → main
    │
    ├── checkstyle + testy + Docker build/push
    │
    ├── JaCoCo report → GitHub Pages
    │
    └── deploy-staging (automaticky)
            KinD cluster → namespace stayflow-staging

git push → tag v*.*.*
    │
    ├── checkstyle + testy + Docker build/push
    │
    ├── GitHub Release (automaticky)
    │
    └── deploy-production (automaticky)
            KinD cluster → namespace stayflow-production
```

---

## 2. Prostředí

### Staging vs. Production

| Parametr         | Staging                  | Production                  |
| ---------------- | ------------------------ | --------------------------- |
| Namespace        | `stayflow-staging`       | `stayflow-production`       |
| Ingress host     | `stayflow-staging.local` | `stayflow.local`            |
| Spring profil    | `staging`                | `production`                |
| Backend repliky  | 1                        | 2                           |
| Frontend repliky | 1                        | 1                           |
| Trigger nasazení | push → větev `main`      | push → tag `v*.*.*`         |
| Image tag        | `<git-sha>`              | `<semver>` (např. `v1.0.0`) |
| GitHub Release   | ne                       | ano                         |

### Rozdíly v konfiguraci (ConfigMap)

| Klíč                     | Staging                         | Production              |
| ------------------------ | ------------------------------- | ----------------------- |
| `SPRING_PROFILES_ACTIVE` | `staging`                       | `production`            |
| `NEXT_PUBLIC_API_URL`    | `http://stayflow-staging.local` | `http://stayflow.local` |
| `MAIL_HOST`              | `smtp.gmail.com`                | `smtp.gmail.com`        |
| `APP_COMMISSION_RATE`    | `0.10`                          | `0.10`                  |

## 3. Nasazení

### Lokálně (Docker Compose)

Požadavky: Docker a Docker Compose.

```bash
# 1. Vytvořte soubor .env v kořenovém adresáři projektu:
DB_URL=jdbc:postgresql://localhost:5432/stayflow
DB_USER=stayflow
DB_PASSWORD=stayflow
DB_TEST_URL=jdbc:postgresql://localhost:5433/stayflow_test
JWT_SECRET=<váš-base64-secret>
ADMIN_EMAIL=admin@stayflow.com
ADMIN_PASSWORD=admin123
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=<email>
MAIL_PASSWORD=<heslo>
CLOUD_NAME=<cloud_name>
CLOUD_API_KEY=<api_key>
CLOUD_API_SECRET=<api_secret>
NEXT_PUBLIC_API_URL=http://localhost:8080

# 2. Spusťte celý stack
docker compose up --build
```

Aplikace běží na:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

### Kubernetes (KinD)

Požadavky: Docker, [kind](https://kind.sigs.k8s.io/), kubectl.

#### Staging

```bash
# 1. Vytvořte cluster
kind create cluster --name stayflow-staging

# 2. Načtěte obrazy do clusteru
docker pull ghcr.io/per5ect/stayflow-backend:latest
docker pull ghcr.io/per5ect/stayflow-frontend:latest
kind load docker-image ghcr.io/per5ect/stayflow-backend:latest --name stayflow-staging
kind load docker-image ghcr.io/per5ect/stayflow-frontend:latest --name stayflow-staging

# 3. Vytvořte namespace a secret
kubectl apply -f k8s/staging/namespace.yaml
kubectl create secret generic stayflow-secret \
  --namespace=stayflow-staging \
  --from-literal=DB_USER=stayflow \
  --from-literal=DB_PASSWORD=stayflow \
  --from-literal=JWT_SECRET=<secret> \
  --from-literal=ADMIN_EMAIL=admin@stayflow.com \
  --from-literal=ADMIN_PASSWORD=admin123 \
  --from-literal=MAIL_USERNAME=<email> \
  --from-literal=MAIL_PASSWORD=<heslo> \
  --from-literal=CLOUD_NAME=<name> \
  --from-literal=CLOUD_API_KEY=<key> \
  --from-literal=CLOUD_API_SECRET=<secret>

# 4. Nasaďte manifesty
kubectl apply -f k8s/staging/

# 5. Ověřte nasazení
kubectl rollout status deployment/postgres  -n stayflow-staging --timeout=60s
kubectl rollout status deployment/backend   -n stayflow-staging --timeout=180s
kubectl rollout status deployment/frontend  -n stayflow-staging --timeout=60s

# 6. Přístup k aplikaci přes port-forward
kubectl port-forward svc/frontend -n stayflow-staging 3000:3000
kubectl port-forward svc/backend  -n stayflow-staging 8080:8080
```

#### Production

Postup je stejný jako pro staging s těmito rozdíly:

```bash
kind create cluster --name stayflow-production

# namespace: stayflow-production
kubectl apply -f k8s/production/namespace.yaml
kubectl create secret generic stayflow-secret --namespace=stayflow-production ...

kubectl apply -f k8s/production/
kubectl rollout status deployment/backend -n stayflow-production --timeout=120s
```

### Automatické nasazení (CI/CD)

Nasazení probíhá automaticky přes GitHub Actions — není potřeba žádný ruční zásah:

| Prostředí  | Trigger             | Postup                                                                                  |
| ---------- | ------------------- | --------------------------------------------------------------------------------------- |
| Staging    | push → větev `main` | Job `deploy-staging` vytvoří KinD cluster, načte obrazy a nasadí `k8s/staging/`         |
| Production | push → tag `v*.*.*` | Job `deploy-production` nasadí `k8s/production/` + job `release` vytvoří GitHub Release |
