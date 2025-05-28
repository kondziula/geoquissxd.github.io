document.addEventListener("DOMContentLoaded", () => {
    // --- Motyw jasny/ciemny ---
    const motywBtn = document.getElementById("przelacz-motyw");
    function ustawMotyw(motyw) {
        document.body.classList.toggle("ciemny", motyw === "ciemny");
        if (motywBtn) motywBtn.textContent = motyw === "ciemny" ? "☀️" : "🌙";
        localStorage.setItem("motyw", motyw);
    }
    const zapisany = localStorage.getItem("motyw");
    if (zapisany === "ciemny") ustawMotyw("ciemny");
    if (motywBtn) {
        motywBtn.addEventListener("click", () => {
            const nowy = document.body.classList.contains("ciemny") ? "jasny" : "ciemny";
            ustawMotyw(nowy);
        });
    }

    // --- Quiz ---
    const daneQuizu = {
        europa: [
            { flaga: "polska.png", odpowiedzi: ["Polska", "San Marino", "Chorwacja", "Monako"], poprawna: "Polska" },
            { flaga: "niemcy.png", odpowiedzi: ["Finlandia", "Niemcy", "Szwecja", "Norwegia"], poprawna: "Niemcy" },
            { flaga: "francja.png", odpowiedzi: ["Czechy", "Słowacja", "Białoruś", "Francja"], poprawna: "Francja" },
            { flaga: "wlochy.png", odpowiedzi: ["Hiszpania", "Włochy", "Bułgaria", "Grecja"], poprawna: "Włochy" },
            { flaga: "andora.png", odpowiedzi: ["Zjednoczone Liechtensztaje", "Rumunia", "Andora", "Mołdawia"], poprawna: "Andora" },
        ],
        azja: [
            { flaga: "japonia.png", odpowiedzi: ["Indie", "Japonia", "Korea Południowa", "Chiny"], poprawna: "Japonia" },
            { flaga: "chiny.png", odpowiedzi: ["Chiny", "Japonia", "Wietnam", "Tajlandia"], poprawna: "Chiny" },
            { flaga: "indie.png", odpowiedzi: ["Pakistan", "Bangladesz", "Indie", "Nepal"], poprawna: "Indie" },
            { flaga: "korea_poludniowa.png", odpowiedzi: ["Korea Południowa", "Korea Północna", "Japonia", "Chiny"], poprawna: "Korea Południowa" },
            { flaga: "tajlandia.png", odpowiedzi: ["Laos", "Wietnam", "Kambodża", "Tajlandia"], poprawna: "Tajlandia" },
        ],
        afryka: [
            { flaga: "egipt.png", odpowiedzi: ["Algieria", "Egipt", "Maroko", "Tunezja"], poprawna: "Egipt" },
            { flaga: "RPA.png", odpowiedzi: ["RPA", "Nigeria", "Kenia", "Ghana"], poprawna: "RPA" },
            { flaga: "nigeria.png", odpowiedzi: ["Senegal", "Kamerun", "Ghana", "Nigeria"], poprawna: "Nigeria" },
            { flaga: "maroko.png", odpowiedzi: ["Maroko", "Algieria", "Tunezja", "Egipt"], poprawna: "Maroko" },
            { flaga: "kenia.png", odpowiedzi: ["Uganda", "Tanzania", "Kenia", "Rwanda"], poprawna: "Kenia" },
        ],
    };

    const quizContainer = document.querySelector("#quiz");
    const flagaDiv = document.querySelector("#flaga");
    const odpowiedziDiv = document.querySelector("#odpowiedzi");
    const pasekCzasu = document.querySelector("#pasek-czasu");
    const czasLewy = document.getElementById("czas-lewy");
    const czasPrawy = document.getElementById("czas-prawy");

    let aktualnePytanie = 0;
    let wynik = 0;
    let czas = 10;
    let timer;

    function zaladujPytanie(quiz) {
        const pytanie = quiz[aktualnePytanie];
        flagaDiv.innerHTML = `<img src="${pytanie.flaga}" alt="Flaga">`;
        odpowiedziDiv.innerHTML = "";
        pytanie.odpowiedzi.forEach((odpowiedz) => {
            const button = document.createElement("button");
            button.textContent = odpowiedz;
            button.classList.add("odpowiedz");
            button.addEventListener("click", () => sprawdzOdpowiedz(odpowiedz, pytanie.poprawna, quiz));
            odpowiedziDiv.appendChild(button);
        });
        resetujCzas();
    }

    function sprawdzOdpowiedz(wybrana, poprawna, quiz) {
        clearInterval(timer);
        if (wybrana === poprawna) {
            wynik++;
        }
        aktualnePytanie++;
        if (aktualnePytanie < quiz.length) {
            zaladujPytanie(quiz);
        } else {
            pokazWynik();
        }
    }

    function pokazWynik() {
        quizContainer.innerHTML = `<h2>Twój wynik: ${wynik}/${aktualnePytanie}</h2>`;
    }

    function resetujCzas() {
        czas = 10;
        if (pasekCzasu) pasekCzasu.style.width = "100%";
        if (czasLewy) czasLewy.textContent = czas;
        if (czasPrawy) czasPrawy.textContent = czas;
        clearInterval(timer);
        timer = setInterval(() => {
            czas--;
            if (pasekCzasu) pasekCzasu.style.width = `${(czas / 10) * 100}%`;
            if (czasLewy) czasLewy.textContent = czas;
            if (czasPrawy) czasPrawy.textContent = czas;
            if (czas <= 0) {
                clearInterval(timer);
                aktualnePytanie++;
                if (aktualnePytanie < daneQuizu.europa.length) {
                    zaladujPytanie(daneQuizu.europa);
                } else {
                    pokazWynik();
                }
            }
        }, 1000);
    }

    // Wybór quizu na podstawie podstrony
    const sciezka = window.location.pathname;
    if (sciezka.includes("quiz1.html")) {
        zaladujPytanie(daneQuizu.europa);
    } else if (sciezka.includes("quiz2.html")) {
        zaladujPytanie(daneQuizu.azja);
    } else if (sciezka.includes("quiz3.html")) {
        zaladujPytanie(daneQuizu.afryka);
    }

    // --- Formularz ---
    const form = document.getElementById("zaawansowany-formularz");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const dane = Object.fromEntries(new FormData(form).entries());
            document.getElementById("wynik-formularza").innerHTML =
                `<span>Dziękujemy, ${dane.imie}! Twoje dane zostały przesłane.</span>`;
            form.reset();
        });
    }

    // --- Flip kart ---
    document.querySelectorAll('.karta').forEach(karta => {
        karta.addEventListener('click', function () {
            karta.classList.toggle('flipped');
        });
    });
});
