# Hotel Lux - system rezerwacji hotelowej

Aplikacja internetowa wspierajaca obsluge rezerwacji hotelowych. Projekt sklada sie z:

- `hotel-frontend` - frontend Angular,
- `hotel-backend` - backend Laravel API,
- MySQL - lokalna baza danych.

Projekt jest przygotowany jako wersja repozytoryjna do uruchomienia lokalnego.

## Szybki start

```bash
git clone https://github.com/es4nn/system-rezerwacji-local/
cd system-rezerwacji
cd hotel-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

W drugim terminalu:

```bash
cd system-rezerwacji/hotel-frontend
npm install
npm start
```

Adresy lokalne:

```text
Frontend: http://localhost:4200
Backend: http://127.0.0.1:8000
API: http://127.0.0.1:8000/api
```

## Funkcje

- publiczna strona hotelu,
- lista pokoi,
- zdjecia i szczegoly pokoi,
- sprawdzanie dostepnosci,
- rezerwacja pokoju,
- rejestracja i logowanie,
- panel "Moje rezerwacje",
- panel administratora,
- dodawanie, edycja i usuwanie pokoi,
- upload zdjec pokoi,
- zarzadzanie rezerwacjami,
- formularz kontaktowy,
- newsletter,
- walidacja formularzy,
- blokada zajetych terminow,
- responsywny widok mobile/desktop.

## Technologie

- Angular 21,
- Laravel 12,
- Laravel Sanctum,
- MySQL,
- Bootstrap,
- Composer,
- npm.

## Struktura katalogow

```text
system-rezerwacji/
  hotel-backend/       Laravel API
  hotel-frontend/      Angular
  docs/                Dokumentacja zaliczeniowa
  README.md            Instrukcja projektu
```

## Wymagania lokalne

- PHP 8.2 lub nowszy,
- Composer,
- Node.js i npm,
- MySQL,
- Git.

## Utworzenie bazy MySQL

Przed migracjami utworz baze:

```sql
CREATE DATABASE hotel_lux CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Domyslna konfiguracja w `hotel-backend/.env.example`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotel_lux
DB_USERNAME=root
DB_PASSWORD=
```

## Backend Laravel

```bash
cd hotel-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Po `php artisan storage:link` obrazy pokoi sa dostepne przez:

```text
http://127.0.0.1:8000/storage/...
```

## Frontend Angular

```bash
cd hotel-frontend
npm install
npm start
```

`npm start` uruchamia Angulara lokalnie i laczy sie z:

```text
http://127.0.0.1:8000/api
```

## Dane testowe

Seedery tworza:

- administratora,
- klienta,
- 5 pokoi demo,
- przykladowe rezerwacje,
- lokalne obrazy demo pokoi.

Administrator:

```text
email: admin@hotel-lux.local
haslo: password
```

Klient:

```text
email: klient@hotel-lux.local
haslo: password
```

## Lokalne maile

W lokalnej wersji wiadomosci e-mail nie sa wysylane na prawdziwe skrzynki. Laravel zapisuje je w pliku:

```text
hotel-backend/storage/logs/laravel.log
```

Odpowiada za to ustawienie:

```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS=recepcja@hotel-lux.local
MAIL_ADMIN_ADDRESS=recepcja@hotel-lux.local
```

Formularz kontaktowy i newsletter zapisują dane w lokalnej bazie, a tresc maili trafia do logow.

## Najwazniejsze endpointy

- `POST /api/register` - rejestracja,
- `POST /api/login` - logowanie,
- `GET /api/user` - zalogowany uzytkownik,
- `POST /api/logout` - wylogowanie,
- `GET /api/rooms` - lista pokoi,
- `GET /api/rooms/{id}` - szczegoly pokoju,
- `GET /api/rooms/search/available` - dostepne pokoje w terminie,
- `GET /api/rooms/{id}/availability` - zajete terminy pokoju,
- `POST /api/bookings` - utworzenie rezerwacji,
- `GET /api/bookings` - moje rezerwacje,
- `DELETE /api/bookings/{id}` - anulowanie rezerwacji,
- `POST /api/rooms` - dodanie pokoju przez admina,
- `POST /api/rooms/{id}` - edycja pokoju przez admina,
- `DELETE /api/rooms/{id}` - usuniecie pokoju przez admina,
- `GET /api/admin/bookings` - rezerwacje w panelu admina,
- `PATCH /api/admin/bookings/{id}/status` - zmiana statusu,
- `GET /api/admin/stats` - statystyki,
- `POST /api/contact` - formularz kontaktowy,
- `POST /api/newsletter` - newsletter.

Szczegoly endpointow sa w `docs/ENDPOINTY_API.md`.

## Panel klienta

Klient moze sie zarejestrowac, zalogowac, wykonac rezerwacje i sprawdzic swoje rezerwacje w panelu "Moje rezerwacje". Rezerwacja jest zapisywana w lokalnej bazie i przypisywana do zalogowanego uzytkownika.

## Panel administratora

Administrator po zalogowaniu moze wejsc do panelu admina, zarzadzac pokojami, wgrywac zdjecia, usuwac pokoje, przegladac rezerwacje i zmieniac ich statusy. Panel jest chroniony po stronie frontendu oraz backendu przez role `admin`.

## Typowe problemy

- Brak polaczenia z baza: sprawdz, czy MySQL dziala i czy istnieje baza `hotel_lux`.
- Brak obrazow: uruchom `php artisan storage:link`.
- Blad CORS: upewnij sie, ze frontend dziala na `http://localhost:4200`, a backend na `http://127.0.0.1:8000`.
- Brak maili w skrzynce: lokalnie maile sa zapisywane w `storage/logs/laravel.log`.
- Blad logowania po zmianie `.env`: uruchom `php artisan config:clear`.

## Dokumentacja

- `docs/SPECYFIKACJA.md`
- `docs/BAZA_DANYCH.md`
- `docs/ENDPOINTY_API.md`
- `docs/URUCHOMIENIE_LOKALNE.md`
