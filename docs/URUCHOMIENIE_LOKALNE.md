# Uruchomienie lokalne

## Wymagania

- PHP 8.2 lub nowszy.
- Composer.
- Node.js i npm.
- MySQL, np. z XAMPP.
- Git.

## Baza danych

Utworz lokalna baze:

```sql
CREATE DATABASE hotel_lux CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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

Backend bedzie dostepny pod adresem:

```text
http://127.0.0.1:8000
```

API:

```text
http://127.0.0.1:8000/api
```

## Frontend Angular

W drugim terminalu:

```bash
cd hotel-frontend
npm install
npm start
```

Frontend bedzie dostepny pod adresem:

```text
http://localhost:4200
```

Domyslna konfiguracja developerska Angulara laczy sie z:

```text
http://127.0.0.1:8000/api
```

## Dane logowania

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

## Seedery

Komenda `php artisan migrate --seed` tworzy:

- konto administratora,
- konto klienta,
- minimum 5 pokoi demo,
- kilka rezerwacji testowych,
- lokalne obrazy demo w `storage/app/public/rooms/demo`.

## Maile lokalne

W lokalnej wersji wiadomosci e-mail nie sa wysylane na prawdziwe skrzynki. Laravel zapisuje je w pliku:

```text
hotel-backend/storage/logs/laravel.log
```

Dzieje sie tak dzieki ustawieniu:

```env
MAIL_MAILER=log
```

## Test po uruchomieniu

1. Wejdz na `http://localhost:4200`.
2. Sprawdz liste pokoi i zdjecia.
3. Zaloguj sie jako klient.
4. Utworz rezerwacje dla wolnego terminu.
5. Wejdz w "Moje rezerwacje".
6. Zaloguj sie jako administrator.
7. Wejdz do panelu admina.
8. Dodaj lub edytuj pokoj.
9. Wgraj zdjecie pokoju.
10. Wyslij formularz kontaktowy.
11. Zapisz adres do newslettera.
12. Sprawdz `storage/logs/laravel.log`.
