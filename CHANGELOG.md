# Changelog

Toate modificarile notabile ale aplicatiei **Travel Planner** sunt documentate in acest fisier.

---

## [Unreleased]
### Changed
- Refactorizat controllerele din `TripPlannerService` pentru o mai buna organizare si separare a logicii.  
  Commit: `a85d6a8` (2025-04-25)
Author: Crina Bolocan


---

## [1.0.0] - 2025-04-10

### Added
- Structura de baza a aplicatiei (`Initial commit`).  
  Creat scheletul proiectului cu suport pentru microservicii si Docker.  
  Commit: `c5b782d` (2025-04-10)
Author: Raluca Movileanu

- TripPlannerService:  
  - Definirea entitatilor: `Trip`, `Destination`, `Review`, `TransportOption`.  
  - Configurat relatiile dintre entitati:
    - `Trip` → `Destination` (one-to-many).
    - `Trip` → `TransportOption` (one-to-many).
    - `User` → `Trips` (one-to-many).
  - Integrare cu JWT pentru autentificare si autorizare.  
    - Verificare token la fiecare request (middleware).
  - Adaugat operatii CRUD:
    - Creare, listare, stergere pentru Trips si Destinations. 
    - Error Handling & Validation:
        - BadRequest pentru validari gresite (StartDate < EndDate, DestinationId > 0 etc.).
        - NotFound pentru resurse inexistente.
    - Creat serviciu EmailService pentru trimiterea email-urilor de confirmare a crearii unui trip. 
  Commits:  
  - `2cce98d` (2025-04-08)  
  - `fd693fc` (2025-04-08)
Author: Crina Bolocan
Author: Raluca Movileanu


- UserDataService:  
  - Creat modelul `User` cu date esentiale (Username, Password).
  - Operatii CRUD:
    - Inregistrare utilizator.
    - Stergere utilizator.
  Commit: `b75beb4` (2025-04-04)
Author: Crina Bolocan


- AuthService:  
  - Operatii CRUD:
    - Autentificare utilizator.
    - Inregistrare utilizator.
  - Implementat autentificare cu JWT:
    - Endpoint pentru login (validare credentiale, generare token).
    - Endpoint pentru inregistrare utilizator (cu hash-are parola).
  - Integrare cu celelalte microservicii:
    - Emitere token JWT care este verificat in `TripPlannerService`.
  Commit: `7c6cacb` (2025-03-25)
Author: Raluca Movileanu

---