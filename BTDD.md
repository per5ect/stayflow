# StayFlow

StayFlow je webová aplikace pro krátkodobý pronájem apartmánů. Pronajímatelé mohou přidávat a spravovat své nemovitosti, nastavovat dostupnost a schvalovat rezervace. Nájemci mohou vyhledávat apartmány, vytvářet rezervace a provádět platby. Administrátor má přehled nad celým systémem prostřednictvím dashboardu se statistikami.

### Snímky obrazovky:

<table>
  <tr>
    <td><img src="docs/screenshots/image.png" alt="Úvodní stránka s hero sekcí a výpisem nejnovějších apartmánů" width="100%"/></td>
    <td><img src="docs/screenshots/image-1.png" alt="Vyhledávání apartmánů s filtry a výsledky" width="100%"/></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/image-2.png" alt="Detail apartmánu s fotogalerií, cenou a dostupností" width="100%"/></td>
    <td><img src="docs/screenshots/image-3.png" alt="Přehled rezervací nájemce se stavy a cenami" width="100%"/></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/image-4.png" alt="Profil uživatele se statistikami rezervací a celkovou útratou" width="100%"/></td>
    <td><img src="docs/screenshots/image-5.png" alt="Admin přehled plateb s komisemi a výplatami pronajímatelům" width="100%"/></td>
  </tr>
</table>

---

## 1. Popis domény

### Doménové entity a vztahy

| Entita                    | Popis                                                   | Vztahy                                                                  |
| ------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| `User`                    | Uživatel systému s rolí ADMIN / LANDLORD / RENTER       | 1:N → Apartment, 1:N → Reservation, 1:N → Payment                       |
| `Apartment`               | Nemovitost nabízená k pronájmu                          | N:1 → User (landlord), 1:N → ApartmentAvailableDates, 1:N → Reservation |
| `ApartmentAvailableDates` | Časové okno, ve kterém je apartmán dostupný k rezervaci | N:1 → Apartment                                                         |
| `Reservation`             | Rezervace apartmánu nájemcem                            | N:1 → User (renter), N:1 → Apartment, 1:1 → Payment                     |
| `Payment`                 | Platba za schválenou rezervaci                          | N:1 → Reservation, N:1 → User (renter), N:1 → User (landlord)           |

### Implementovaná business pravidla

1. **Validace dat rezervace** — datum odjezdu musí být alespoň 1 den po datu příjezdu; datum příjezdu nesmí být v minulosti.
2. **Dostupnost apartmánu** — rezervace musí spadat do nastaveného okna dostupnosti (`ApartmentAvailableDates`); apartmán musí být ve stavu `ACTIVE`.
3. **Kolize rezervací** — nelze vytvořit rezervaci, která se překrývá s existující rezervací téhož apartmánu.
4. **Zákaz vlastní rezervace** — pronajímatel nemůže rezervovat vlastní apartmán.
5. **Storno lhůta** — rezervaci nelze zrušit méně než 24 hodin před datem příjezdu.
6. **Sleva za dlouhodobý pobyt** — pobyt délky 7 a více nocí obdrží automaticky slevu 10 %.
7. **Stavový přechod rezervace** — platná sekvence: `PENDING → APPROVED / DECLINED`, `APPROVED → PAID`, jakýkoliv stav → `CANCELLED` (s respektováním storno lhůty). Již schválenou rezervaci nelze znovu schválit.
8. **Platba pouze schválené rezervace** — platbu lze provést výhradně pro rezervaci ve stavu `APPROVED`.
9. **Výpočet komise** — platforma si účtuje 10 % z celkové ceny; výplata pronajímateli = částka − komise (zaokrouhlení na 2 desetinná místa metodou `HALF_UP`).
10. **Omezení rolí** — pronajímatel spravuje pouze vlastní apartmány a rezervace; nájemce má přístup pouze ke svým rezervacím a platbám.

---

## 2. Spuštění lokálně

### Požadavky

- Docker & Docker Compose
- Java 17 (pouze pro spuštění testů mimo Docker)
- Maven 3.9+ (pouze pro spuštění testů mimo Docker)

### Konfigurace prostředí

Vytvořte soubor `.env` v kořenovém adresáři projektu:

```bash
# Databáze
DB_URL=jdbc:postgresql://localhost:5432/stayflow
DB_USER=stayflow
DB_PASSWORD=stayflow
DB_TEST_URL=jdbc:postgresql://localhost:5433/stayflow_test

# JWT
JWT_SECRET=<váš-base64-secret>

# Admin účet (vytvoří se automaticky při startu)
ADMIN_EMAIL=admin@stayflow.com
ADMIN_PASSWORD=admin123

# E-mail (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=<email>
MAIL_PASSWORD=<heslo>

# Cloudinary (úložiště obrázků)
CLOUD_NAME=<cloud_name>
CLOUD_API_KEY=<api_key>
CLOUD_API_SECRET=<api_secret>

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Spuštění aplikace

```bash
docker compose up --build
```

Aplikace bude dostupná na:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

### Spuštění unit testů

**macOS / Linux:**

```bash
cd backend
mvn test
```

**Windows:**

```cmd
cd backend
mvn test
```

### Spuštění integračních testů

Integrační testy vyžadují běžící testovací databázi (PostgreSQL na portu 5433).

**macOS / Linux:**

```bash
docker compose up postgres-test -d
cd backend
mvn verify
```

**Windows:**

```cmd
docker compose up postgres-test -d
cd backend
mvn verify
```

### Report pokrytí kódu

Po spuštění `mvn verify` je report dostupný na:

```
backend/target/site/jacoco/index.html
```

Aktuální report je také automaticky publikován přes GitHub Actions jako GitHub Pages po každém push do větve `main`.

---

## 3. Architektura

### Komunikace mezi vrstvami

```
┌─────────────────────────────────────────────────────────────┐
│                        Prohlížeč                            │
│              Next.js 16 / React 19 / TypeScript             │
│         Axios → REST HTTP/JSON (Bearer JWT token)           │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/JSON  :8080
┌─────────────────────────▼───────────────────────────────────┐
│                        Backend                              │
│              Spring Boot 4 / Java 17                        │
│   Spring Security (JWT) → Controller → Service → Repository │
│                    │                        │               │
│             SMTP (e-mail)           Cloudinary API          │
│           JavaMailSender             (fotografie)           │
└─────────────────────────┬───────────────────────────────────┘
                          │ JDBC / JPA (Hibernate)  :5432
┌─────────────────────────▼───────────────────────────────────┐
│                      PostgreSQL 15                          │
│              Schéma spravované přes Flyway                  │
└─────────────────────────────────────────────────────────────┘
```

Aplikace je rozdělena do dvou samostatných služeb:

### Backend (Spring Boot 4 / Java 17)

Vrstvená architektura:

```
src/main/java/com/stayflow/backend
├── web/                        # Prezentační vrstva
│   ├── controller/             # REST controllery (@RestController)
│   └── dto/                    # Request a Response objekty
├── domain/                     # Doménová vrstva
│   ├── user/                   # Entita, service, repository, výjimky
│   ├── apartment/              # Entita, service, repository, výjimky
│   ├── reservation/            # Entita, service, repository, výjimky
│   └── payment/                # Entita, service, repository, výjimky
└── infrastructure/             # Infrastrukturní vrstva
    ├── security/               # JWT filter, Spring Security konfigurace
    ├── config/                 # Aplikační konfigurace (Cloudinary, Mail)
    ├── storage/                # Cloudinary adapter (nahrávání obrázků)
    └── email/                  # JavaMailSender adapter (odesílání e-mailů)

src/test/java/com/stayflow/backend
├── unit/                       # Unit testy (Mockito, bez Spring kontextu)
│   ├── UserServiceTest
│   ├── ApartmentServiceTest
│   ├── ReservationServiceTest
│   ├── PaymentServiceTest
│   ├── JwtServiceTest
│   └── EmailServiceTest
└── integration/                # Integrační testy (Spring Boot Test, reálná DB)
    ├── BaseIntegrationTest     # Společný základ: čištění DB, vytvoření admina
    ├── AuthControllerTest
    ├── ApartmentControllerTest
    ├── ReservationControllerTest
    ├── PaymentControllerTest
    ├── UserControllerTest
    └── AdminControllerTest
```

Integrační testy běží proti samostatné testovací databázi PostgreSQL (`stayflow_test`, port `5433`), konfigurované přes profil `application-test.yml`. Před každým testem je databáze vyčištěna a znovu vytvořen výchozí admin účet.

| Vrstva                    | Odpovědnost                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| `web/controller`          | Příjem HTTP požadavků, mapování DTO, volání service, vrácení response |
| `domain/*/service`        | Business logika, validace pravidel, orchestrace repozitářů            |
| `domain/*/repository`     | Přístup k databázi přes Spring Data JPA                               |
| `infrastructure/security` | JWT autentizace, Spring Security filtry, RBAC                         |
| `infrastructure/storage`  | Komunikace s Cloudinary API                                           |
| `infrastructure/email`    | Odesílání transakčních e-mailů přes SMTP                              |

Databáze: **PostgreSQL 15**, schéma spravované přes **Flyway** migrace (V1–V5). ORM: **Hibernate** s `ddl-auto: validate`.

### Frontend (Next.js 16 / React 19 / TypeScript)

```
frontend/src
├── pages/          # Next.js file-based routing
├── screens/        # UI komponenty rozdělené podle rolí (guest, renter, landlord, admin)
├── domains/        # TypeScript typy a API adaptéry
├── contexts/       # AuthContext, SnackbarContext
└── utils/          # Pomocné funkce
```

#### Stránky a obrazovky

Každý soubor v `pages/` je tenkým wrapperem, který exportuje příslušnou screen komponentu z `src/screens/`. Obrazovky obsahují veškerou logiku a jsou rozděleny podle rolí.

**Veřejné stránky**

| URL                | Obrazovka         | Popis                                                                                                         |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `/`                | `Home`            | Úvodní stránka s hero sekcí, vyhledáváním podle města, výpisem doporučených apartmánů a popisem funkcionality |
| `/search`          | `Search`          | Vyhledávání apartmánů s filtry (město, typ, cena, počet pokojů, termín), řazením a stránkováním výsledků      |
| `/apartments/[id]` | `ApartmentDetail` | Detail apartmánu s fotogalerií, popisem, kartou s cenou a dostupností a formulářem pro rezervaci              |
| `/auth/login`      | `Login`           | Přihlašovací formulář (e-mail + heslo)                                                                        |
| `/auth/register`   | `Register`        | Registrace nového účtu s výběrem role (Pronajímatel / Nájemce), jménem, e-mailem, telefonem a heslem          |
| `/auth/verify`     | `VerifyEmail`     | Zadání 6místného ověřovacího kódu zaslaného e-mailem                                                          |

**Stránky nájemce** (role `RENTER`)

| URL                     | Obrazovka        | Popis                                                                   |
| ----------------------- | ---------------- | ----------------------------------------------------------------------- |
| `/renter/reservations`  | `MyReservations` | Přehled vlastních rezervací s filtrováním podle stavu a možností storna |
| `/renter/checkout/[id]` | `Checkout`       | Platební stránka pro schválenou rezervaci s formulářem platby           |
| `/renter/payments`      | `MyPayments`     | Historie provedených plateb                                             |

**Stránky pronajímatele** (role `LANDLORD`)

| URL                              | Obrazovka              | Popis                                                                                 |
| -------------------------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| `/landlord/apartments`           | `MyApartments`         | Správa vlastních apartmánů s filtrováním podle stavu a akcemi aktivace/deaktivace     |
| `/landlord/apartments/new`       | `ApartmentForm`        | Formulář pro přidání nového apartmánu (název, popis, adresa, typ, cena, počet pokojů) |
| `/landlord/apartments/[id]/edit` | `ApartmentForm`        | Editace apartmánu včetně správy oken dostupnosti a fotografií                         |
| `/landlord/reservations`         | `IncomingReservations` | Příchozí žádosti o rezervaci s možností schválení nebo zamítnutí se zprávou           |
| `/landlord/payments`             | `Payments`             | Přehled přijatých plateb od nájemců                                                   |

**Stránky administrátora** (role `ADMIN`)

| URL                   | Obrazovka      | Popis                                                                           |
| --------------------- | -------------- | ------------------------------------------------------------------------------- |
| `/admin/dashboard`    | `Dashboard`    | Přehled systémových statistik (uživatelé, apartmány, rezervace, platby, komise) |
| `/admin/users`        | `Users`        | Tabulka všech uživatelů s filtrováním a možností smazání účtu                   |
| `/admin/apartments`   | `Apartments`   | Tabulka všech apartmánů s filtrováním podle města a stavu                       |
| `/admin/reservations` | `Reservations` | Tabulka všech rezervací s filtrováním podle stavu                               |
| `/admin/payments`     | `Payments`     | Tabulka všech plateb s filtrováním podle stavu                                  |

**Sdílené stránky** (všechny přihlášené role)

| URL        | Obrazovka | Popis                                                                                 |
| ---------- | --------- | ------------------------------------------------------------------------------------- |
| `/profile` | `Profile` | Správa profilu: avatar, jméno, e-mail, telefon, heslo; statistiky specifické pro roli |
| `/403`     | —         | Stránka nedostatečných oprávnění                                                      |
| `/404`     | —         | Stránka nenalezeného obsahu                                                           |

Přístup k rolím je řízen komponentou `RouteGuard`, která čte stav z `AuthContext` a přesměrovává neautorizované uživatele na `/403`.

---

## 4. Testovací strategie

### Přehled

| Typ testu        | Počet tříd | Počet metod | Nástroje                                |
| ---------------- | ---------- | ----------- | --------------------------------------- |
| Unit testy       | 6          | ~90         | JUnit 5, Mockito                        |
| Integrační testy | 7          | ~50         | JUnit 5, Spring Boot Test, RestTemplate |

### Unit testy

Unit testy pokrývají business logiku v doménových službách v izolaci od databáze a externích závislostí.

**Co testují:**

- `ReservationServiceTest` — validace dat (checkout před checkin, stejné datum), neaktivní apartmán, vlastní rezervace pronajímatele, kolize termínů, výpočet ceny, 10% sleva pro 7+ nocí, storno lhůta 24 h, stavové přechody (`approve`, `decline`), oprávnění ke zrušení
- `PaymentServiceTest` — výpočet komise (10 %, zaokrouhlení na 2 desetinná místa), výpočet výplaty pronajímateli, transakčnost (`@Transactional`), unikátnost transaction ID a čísla účtenky, přechod stavu rezervace na `PAID`
- `ApartmentServiceTest` — vytvoření apartmánu, validace ceny a počtu pokojů, aktualizace/deaktivace/aktivace s kontrolou vlastnictví, správa dostupnosti (kolize dat, vlastnictví), filtrování podle dostupnosti, správa fotografií
- `UserServiceTest` — registrace s BCrypt heslem, výjimka při duplicitním e-mailu, ověření e-mailu (správný/chybný/expirovaný kód), aktualizace profilu, změna hesla, statistiky pronajímatele a nájemce, stav `enabled`
- `JwtServiceTest` — generování tokenu, extrakce e-mailu a role, validace, expirace
- `EmailServiceTest` — odesílání ověřovacího e-mailu, notifikace schválení/zamítnutí rezervace, účtenka nájemci a pronajímateli, zachycení výjimky při selhání SMTP

### Integrační testy

Integrační testy spouštějí celý Spring Boot kontext s reálnou PostgreSQL databází. Každý test začíná s čistým stavem databáze (`@BeforeEach` maže všechna data a znovu vytvoří admin účet).

**Co testují:**

- `AuthControllerTest` — registrace, duplicitní e-mail (HTTP 409), přihlášení bez ověřeného e-mailu (HTTP 403), přihlášení po ověření
- `ApartmentControllerTest` — CRUD operace, oprávnění (403 pro neautentizované), filtrování, upload a smazání fotografií
- `ReservationControllerTest` — vytvoření rezervace, stránkování, storno, schválení a zamítnutí pronajímatelem, přístupová práva rolí
- `PaymentControllerTest` — úspěšná platba, platba cizí rezervace (403), platba neschválené rezervace (400), historié plateb
- `UserControllerTest` — profil, statistiky podle role, aktualizace profilu, změna hesla, upload avataru
- `AdminControllerTest` — globální statistiky, výpisy uživatelů/apartmánů/rezervací/plateb

### Mockování

| Co je mockováno                                                                       | Typ test double               | Důvod                                                                                                                                              |
| ------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JavaMailSender`                                                                      | Mock (Mockito)                | Externí SMTP server není dostupný v testovém prostředí; odesílání e-mailů je vedlejší efekt bez dopadu na business logiku                          |
| `CloudinaryService`                                                                   | Mock (Mockito `@MockitoBean`) | Volání Cloudinary API vyžaduje síťové připojení a platné credentials; vrací pevná testovací URL (`https://cdn.test/...`)                           |
| `UserRepository`, `ApartmentRepository`, `ReservationRepository`, `PaymentRepository` | Mock (Mockito `@Mock`)        | Unit testy izolují service vrstvu od databáze; repozitáře jsou stubbovány metodou `when().thenAnswer(i -> i.getArgument(0))` pro simulaci `save()` |
| `PasswordEncoder`                                                                     | Mock (Mockito `@Mock`)        | Odstraňuje závislost na BCrypt algoritmu při testování UserService v izolaci                                                                       |

V integračních testech jsou mockována pouze `EmailService` a `CloudinaryService` (externí závislosti); databáze je reálná PostgreSQL instance.

### Pokrytí kódu (JaCoCo)

**Nastavené minimální hranice:**

| Metrika         | Minimální hodnota |
| --------------- | ----------------- |
| Line coverage   | 70 %              |
| Branch coverage | 50 %              |

**Balíčky vyloučené z měření:**

| Balíček                      | Důvod vyloučení                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `web/**` (controllery, DTO)  | Controllery jsou pokryty integračními testy; DTO jsou datové třídy bez logiky (gettery/settery/Lombok) |
| `infrastructure/security/**` | Spring Security konfigurace; chování ověřují integrační testy na úrovni HTTP                           |
| `infrastructure/config/**`   | Konfigurační třídy (@Configuration) bez business logiky                                                |
| `infrastructure/storage/**`  | CloudinaryService je v testech mockován; přímé testování by vyžadovalo reálný Cloudinary účet          |
| `infrastructure/email/**`    | JavaMailSender adaptér je v testech mockován; přímé testování by vyžadovalo běžící SMTP server         |

Report pokrytí je automaticky publikován jako GitHub Pages artefakt při každém CI běhu.
