# Endpointy API

Bazowy adres lokalny:

```text
http://127.0.0.1:8000/api
```

Autoryzowane endpointy wymagaja naglowka:

```http
Authorization: Bearer TOKEN
```

## Autoryzacja

### `POST /register`

Rejestruje klienta. Nie wymaga logowania.

```json
{
  "name": "Jan Testowy",
  "email": "jan@example.local",
  "password": "password",
  "password_confirmation": "password"
}
```

```json
{
  "message": "Konto zostalo utworzone pomyslnie.",
  "user": {}
}
```

### `POST /login`

Loguje uzytkownika i zwraca token.

```json
{
  "email": "klient@hotel-lux.local",
  "password": "password"
}
```

```json
{
  "token": "TOKEN",
  "user": {
    "email": "klient@hotel-lux.local",
    "role": "client"
  }
}
```

### `GET /user`

Zwraca zalogowanego uzytkownika. Wymaga logowania.

### `POST /logout`

Usuwa aktualny token. Wymaga logowania.

## Pokoje

### `GET /rooms`

Zwraca liste pokoi. Nie wymaga logowania.

### `GET /rooms/{id}`

Zwraca szczegoly jednego pokoju. Nie wymaga logowania.

### `GET /rooms/search/available?check_in=2026-07-01&check_out=2026-07-04`

Zwraca pokoje dostepne w terminie. Nie wymaga logowania.

### `GET /rooms/{id}/availability`

Zwraca zajete terminy pokoju. Nie wymaga logowania.

## Rezerwacje

### `POST /bookings`

Tworzy rezerwacje. Wymaga logowania.

```json
{
  "room_id": 1,
  "customer_name": "Klient Testowy",
  "check_in": "2026-07-01",
  "check_out": "2026-07-04",
  "total_price": 570
}
```

```json
{
  "message": "Sukces!",
  "booking": {}
}
```

Jezeli termin jest zajety, API zwraca kod `422`.

### `GET /bookings`

Zwraca rezerwacje zalogowanego klienta. Wymaga logowania.

### `DELETE /bookings/{id}`

Anuluje rezerwacje zalogowanego klienta. Wymaga logowania.

## Admin

Endpointy admina wymagaja tokena uzytkownika z rola `admin`.

### `POST /rooms`

Dodaje pokoj. Dane wysylane jako `FormData`: `name`, `room_number`, `capacity`, `price_per_night`, `description`, opcjonalnie `main_image` albo `image`.

### `POST /rooms/{id}`

Aktualizuje pokoj. Dane jak przy dodawaniu pokoju.

### `DELETE /rooms/{id}`

Usuwa pokoj.

### `GET /admin/bookings`

Zwraca wszystkie rezerwacje z pokojem i uzytkownikiem.

### `PATCH /admin/bookings/{id}/status`

Zmienia status rezerwacji.

```json
{
  "status": "confirmed"
}
```

### `GET /admin/stats?year=2026`

Zwraca miesieczne przychody i liczbe rezerwacji.

## Kontakt i newsletter

### `POST /contact`

Zapisuje wiadomosc kontaktowa i generuje maile. Nie wymaga logowania.

```json
{
  "name": "Anna Testowa",
  "email": "anna@example.local",
  "phone": "48123456789",
  "message": "Prosze o kontakt."
}
```

### `POST /newsletter`

Zapisuje adres newslettera i generuje maile. Nie wymaga logowania.

```json
{
  "email": "newsletter@example.local"
}
```
