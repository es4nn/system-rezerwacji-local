# Specyfikacja projektu

## Nazwa i opis

**Hotel Lux - system rezerwacji hotelowej** to aplikacja internetowa wspierajaca obsluge rezerwacji pokoi hotelowych. Projekt sklada sie z frontendu Angular, backendu Laravel API oraz bazy danych MySQL.

System pozwala klientom przegladac pokoje, sprawdzac terminy, zakladac konto i skladac rezerwacje. Administrator moze zarzadzac pokojami, zdjeciami i rezerwacjami.

## Problem

Hotel potrzebuje jednego miejsca do prezentacji oferty, przyjmowania rezerwacji i obslugi zapytan. Bez aplikacji internetowej klient musi kontaktowac sie telefonicznie lub mailowo, a administrator recznie kontroluje dostepnosc terminow.

## Wymagania funkcjonalne

- Uzytkownik moze przegladac liste pokoi.
- Uzytkownik moze zobaczyc dane pokoju: nazwe, numer, opis, cene, liczbe osob i zdjecie.
- Uzytkownik moze sprawdzic dostepnosc pokoju w wybranym terminie.
- Uzytkownik moze zalozyc konto i zalogowac sie.
- Uzytkownik moze zarezerwowac pokoj.
- Uzytkownik moze zobaczyc swoje rezerwacje.
- System blokuje rezerwacje zajetego terminu.
- Administrator moze dodawac, edytowac i usuwac pokoje.
- Administrator moze dodawac i zmieniac zdjecia pokoi.
- Administrator moze przegladac i zmieniac status rezerwacji.
- Formularz kontaktowy zapisuje wiadomosc i generuje e-mail.
- Newsletter zapisuje adres e-mail i generuje e-mail potwierdzajacy.
- System waliduje formularze i zwraca komunikaty bledow.

## Wymagania pozafunkcjonalne

- Responsywny interfejs dla widoku mobilnego i desktopowego.
- Bezpieczna autoryzacja oparta o tokeny Laravel Sanctum.
- Separacja frontendu Angular i backendu Laravel API.
- Czytelna walidacja danych formularzy.
- Lokalne maile zapisywane w logach przez `MAIL_MAILER=log`.
- Obrazy pokoi przechowywane w Laravel Storage i udostepniane przez `/storage`.

## Grupy odbiorcow

- Klienci hotelu, ktorzy chca sprawdzic oferte i zarezerwowac pokoj online.
- Administratorzy i pracownicy recepcji, ktorzy obsluguja pokoje, zdjecia i rezerwacje.

## Korzysci biznesowe

- Mniej recznej obslugi zapytan o dostepnosc.
- Latwiejsza prezentacja oferty pokoi.
- Mozliwosc szybkiej aktualizacji cen, opisow i zdjec.
- Centralna historia rezerwacji i kontaktow klientow.

## Dlaczego aplikacja internetowa

- Dziala w przegladarce bez instalowania programu przez klienta.
- Jest dostepna na telefonie, tablecie i komputerze.
- Pozwala oddzielic publiczna strone hotelu od panelu administratora.
- Backend API moze w przyszlosci obslugiwac takze aplikacje mobilna.
- Dane sa zapisywane w jednej bazie, wiec latwiej kontrolowac dostepnosc pokoi.
- Aktualizacje systemu sa wdrazane centralnie.
