# Wersja produkcyjna projektu

Projekt **Hotel Lux - system rezerwacji hotelowej** został wdrożony również w wersji produkcyjnej i jest dostępny online.

Aplikacja działa jako pełny system webowy oparty o osobny frontend w Angularze oraz backend API w Laravelu. Wersja produkcyjna pozwala sprawdzić działanie projektu w realnym środowisku hostingowym, z prawdziwą domeną, zewnętrznym API, produkcyjną bazą danych oraz obsługą wiadomości e-mail.

## Adresy produkcyjne

* Strona frontendowa: https://hotel-lux.pl
* Backend/API: https://api.hotel-lux.pl
* Raport PageSpeed Insights: https://pagespeed.web.dev/analysis/https-hotel-lux-pl/0lyvmx0dj6?form_factor=desktop

## Opis działania wersji produkcyjnej

Wersja produkcyjna umożliwia przejście pełnego procesu rezerwacji hotelowej — od przeglądania oferty pokoi, przez wybór terminu, aż po zapis rezerwacji w bazie danych.

Użytkownik może:

* przeglądać publiczną stronę hotelu,
* zobaczyć listę dostępnych pokoi,
* otworzyć szczegóły wybranego pokoju,
* sprawdzić informacje o cenie, opisie, liczbie osób i zdjęciach,
* wybrać termin pobytu,
* złożyć rezerwację,
* utworzyć zwykłe konto użytkownika,
* zalogować się do systemu,
* przejść do panelu „Moje rezerwacje”,
* sprawdzić swoje rezerwacje,
* wysłać formularz kontaktowy,
* zapisać się do newslettera.

Administrator może korzystać z panelu administracyjnego, w którym dostępne jest zarządzanie pokojami oraz rezerwacjami. Panel pozwala między innymi na dodawanie, edycję i usuwanie pokoi, zmianę ich opisów, cen, liczby osób oraz zdjęć.

## Formularze i wiadomości e-mail

Wersja produkcyjna posiada działającą obsługę formularzy oraz wiadomości e-mail.

Po wysłaniu formularza kontaktowego:

* wiadomość administracyjna trafia na skrzynkę recepcji,
* klient otrzymuje osobne potwierdzenie na adres e-mail wpisany w formularzu,
* odpowiedź na wiadomość administracyjną kierowana jest do klienta,
* odpowiedź na wiadomość klienta kierowana jest do recepcji.

Po zapisie do newslettera:

* recepcja otrzymuje informację o nowym zapisie,
* osoba zapisująca się do newslettera otrzymuje wiadomość powitalną,
* adres odbiorcy wiadomości powitalnej jest pobierany z formularza newslettera.

Dzięki temu można sprawdzić nie tylko zapis danych w aplikacji, ale również komunikację e-mailową pomiędzy systemem, recepcją i użytkownikiem.

## Rezerwacje i baza danych

Rezerwacje w wersji produkcyjnej są zapisywane w produkcyjnej bazie danych.

System obsługuje między innymi:

* zapis danych rezerwacji,
* powiązanie rezerwacji z pokojem,
* powiązanie rezerwacji z użytkownikiem, jeżeli rezerwacja jest wykonywana po zalogowaniu,
* sprawdzanie dostępności pokoju,
* blokadę rezerwacji zajętego terminu,
* walidację formularza rezerwacji,
* komunikaty błędów dla niepoprawnych danych.

Dane produkcyjne nie są przechowywane w repozytorium. Lokalna wersja projektu korzysta z osobnej, lokalnej bazy danych oraz danych testowych tworzonych przez migracje i seedery.

## Konto użytkownika

W aplikacji można utworzyć zwykłe konto użytkownika bez dostępu do panelu administratora.

Konto użytkownika pozwala sprawdzić funkcje dostępne dla klienta, między innymi:

* rejestrację,
* logowanie,
* wylogowanie,
* dostęp do panelu użytkownika,
* podgląd własnych rezerwacji,
* rezerwację pokoju jako zalogowany użytkownik.

Dane dostępowe do produkcyjnego konta administratora nie są publikowane w repozytorium ze względów bezpieczeństwa.

## Panel administratora

Wersja produkcyjna zawiera panel administratora pozwalający zarządzać ofertą hotelu.

Panel administratora obejmuje między innymi:

* listę pokoi,
* dodawanie nowych pokoi,
* edycję istniejących pokoi,
* zmianę nazwy pokoju,
* zmianę opisu,
* zmianę ceny,
* zmianę liczby osób,
* upload zdjęć,
* usuwanie pokoi,
* podgląd i obsługę rezerwacji, jeżeli dana funkcja jest dostępna w aktualnej wersji aplikacji.

Dostęp do panelu administratora jest zabezpieczony i nie jest publiczny.

## Responsywność i optymalizacja

Wersja produkcyjna została dostosowana do urządzeń desktopowych i mobilnych.

Projekt posiada:

* responsywny układ strony,
* działające menu mobilne,
* widoki dopasowane do telefonów, tabletów i komputerów,
* zoptymalizowane obrazy,
* poprawione ładowanie zasobów,
* lekkie formaty grafik,
* poprawioną wydajność strony,
* optymalizacje pod PageSpeed,
* poprawioną dostępność podstawowych elementów interfejsu,
* zoptymalizowane działanie strony głównej oraz podstron.

Dzięki temu aplikacja może zostać zaprezentowana nie tylko jako projekt działający lokalnie, ale również jako gotowa, wdrożona aplikacja internetowa.

## Wyniki PageSpeed Insights

Wersja produkcyjna projektu została sprawdzona narzędziem **Google PageSpeed Insights**.

Raport potwierdza bardzo dobre wyniki zarówno dla wersji desktopowej, jak i mobilnej. Strona została zoptymalizowana pod szybkość ładowania, stabilność układu, dostępność, SEO oraz dobre praktyki techniczne.

### Wynik dla komputera

Dla wersji desktopowej aplikacja uzyskała:

* Wydajność: **99/100**
* Ułatwienia dostępu: **100/100**
* Sprawdzone metody: **100/100**
* SEO: **100/100**
* Przeglądanie agentowe: **3/3**

Najważniejsze metryki wydajności:

* First Contentful Paint: **0,6 s**
* Largest Contentful Paint: **0,9 s**
* Total Blocking Time: **40 ms**
* Cumulative Layout Shift: **0.014**
* Speed Index: **0,8 s**

Wyniki desktopowe pokazują, że strona ładuje się bardzo szybko, ma niski czas blokowania głównego wątku oraz stabilny układ bez zauważalnych przesunięć elementów.

### Wynik dla urządzeń mobilnych

Dla wersji mobilnej aplikacja uzyskała:

* Wydajność: **92/100**
* Ułatwienia dostępu: **100/100**
* Sprawdzone metody: **100/100**
* SEO: **100/100**
* Przeglądanie agentowe: **3/3**

Najważniejsze metryki wydajności:

* First Contentful Paint: **2,4 s**
* Largest Contentful Paint: **2,9 s**
* Total Blocking Time: **20 ms**
* Cumulative Layout Shift: **0.017**
* Speed Index: **2,4 s**

Wyniki mobilne potwierdzają, że aplikacja została zoptymalizowana również pod urządzenia mobilne. Strona zachowuje stabilny układ, szybko reaguje na interakcje użytkownika i poprawnie ładuje najważniejsze elementy widoku.

### Zakres optymalizacji

W projekcie zastosowano optymalizacje wpływające na szybkość działania i komfort użytkownika, między innymi:

* zoptymalizowane obrazy,
* lekkie formaty grafik,
* poprawione ładowanie zasobów,
* responsywny układ strony,
* stabilne wymiary elementów widoku,
* poprawione działanie menu mobilnego,
* optymalizację widoku strony głównej,
* ograniczenie niepotrzebnych zasobów,
* poprawki wpływające na dostępność i SEO.

Dobre wyniki PageSpeed Insights potwierdzają, że wersja produkcyjna projektu została przygotowana nie tylko pod względem funkcjonalnym, ale również pod kątem wydajności, responsywności i jakości technicznej.

## Komunikacja frontend ↔ backend

Projekt działa w architekturze rozdzielonej na frontend i backend.

Frontend Angular komunikuje się z backendem Laravel przez API dostępne pod osobną subdomeną.

Wersja produkcyjna pokazuje w praktyce:

* komunikację Angulara z API Laravel,
* pobieranie listy pokoi,
* pobieranie szczegółów pokoju,
* sprawdzanie dostępności,
* tworzenie rezerwacji,
* logowanie i rejestrację użytkowników,
* obsługę formularza kontaktowego,
* obsługę newslettera,
* obsługę panelu administratora.

## Różnice względem wersji lokalnej

Wersja lokalna opisana w `README.md` działa na:

* lokalnym backendzie Laravel,
* lokalnym frontendzie Angular,
* lokalnej bazie MySQL,
* danych testowych tworzonych przez seedery,
* mailach zapisywanych do logów przez `MAIL_MAILER=log`.

Wersja produkcyjna działa na:

* zewnętrznym hostingu,
* osobnej produkcyjnej bazie danych,
* produkcyjnym API,
* prawdziwej domenie,
* produkcyjnej konfiguracji środowiskowej,
* działającej obsłudze wiadomości e-mail.

Wersja lokalna służy głównie do sprawdzenia kodu, struktury projektu, migracji, seederów i uruchomienia aplikacji od zera.

Wersja produkcyjna służy jako dodatkowe potwierdzenie, że aplikacja została wdrożona i działa online.

## Bezpieczeństwo

Ze względów bezpieczeństwa w repozytorium nie znajdują się:

* dane logowania do hostingu,
* dane logowania do bazy produkcyjnej,
* hasła SMTP,
* produkcyjny plik `.env`,
* dane dostępowe do panelu administratora,
* prywatne dane użytkowników,
* logi produkcyjne,
* tokeny i klucze API,
* ścieżki serwera produkcyjnego.

Dane produkcyjne są oddzielone od wersji lokalnej. Repozytorium zawiera wyłącznie kod źródłowy, przykładową konfigurację lokalną, dokumentację, migracje, seedery oraz dane testowe.

## Zalecany sposób sprawdzenia projektu

Do sprawdzenia kodu i lokalnego działania projektu najlepiej użyć wersji lokalnej opisanej w `README.md`.

Wersja produkcyjna może zostać użyta jako dodatkowa demonstracja działania aplikacji online, szczególnie w zakresie:

* działania publicznej strony,
* responsywności,
* formularzy,
* newslettera,
* rezerwacji,
* komunikacji z API,
* działania aplikacji w środowisku produkcyjnym.
