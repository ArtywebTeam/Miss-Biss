/**
 * Miss Biss Pizzeria - Data & Translations
 * Exact 1:1 data model extracted from the original application
 */

const APP_DATA = {
  restaurant: {
    name: "Miss Biss",
    tagline: "Pizzeria dal 1971 · Sarezzo (Lombardia)",
    address: "Via della Repubblica 118b, 25039 Sarezzo (BS), Italia",
    addressShort: "Via della Repubblica 118b, Sarezzo",
    coords: [45.6545, 10.1912],
    phone: "030 803081",
    phoneTel: "+39030803081",
    whatsapp: "393248184746",
    whatsappDisplay: "+39 324 818 4746",
    socials: {
      facebook: "https://www.facebook.com/pizzeriamissbiss/?locale=it_IT",
      instagram: "https://www.instagram.com/missbiss__pizzeria/"
    },
    hours_it: [
      { day: "Lunedì", time: "18:00 - 22:30" },
      { day: "Martedì", time: "Chiuso" },
      { day: "Mercoledì", time: "18:00 - 22:30" },
      { day: "Giovedì", time: "18:00 - 22:30" },
      { day: "Venerdì", time: "18:00 - 23:00" },
      { day: "Sabato", time: "18:00 - 23:00" },
      { day: "Domenica", time: "18:00 - 22:30" }
    ],
    hours_en: [
      { day: "Monday", time: "Closed" },
      { day: "Tuesday", time: "6:00 PM - 11:00 PM" },
      { day: "Wednesday", time: "6:00 PM - 11:00 PM" },
      { day: "Thursday", time: "6:00 PM - 11:00 PM" },
      { day: "Friday", time: "6:00 PM - 11:30 PM" },
      { day: "Saturday", time: "6:00 PM - 11:30 PM" },
      { day: "Sunday", time: "6:00 PM - 11:30 PM" }
    ]
  },

  categories: [
    { id: "pizze", name_it: "Pizze Classiche", name_en: "Classic Pizzas" },
    { id: "speciali", name_it: "Pizze Speciali", name_en: "Special Pizzas" }
  ],

  products: [
    {
      id: "salame",
      category: "pizze",
      name_it: "Salame",
      name_en: "Salami Pizza",
      desc_it: "Pomodoro, mozzarella fiordilatte, salame piccante nostrano",
      desc_en: "Tomato sauce, fiordilatte mozzarella, spicy Italian salami",
      ingredients_it: "Pomodoro, mozzarella fiordilatte, salame piccante",
      ingredients_en: "Tomato sauce, fiordilatte mozzarella, spicy salami",
      price: 8.5,
      image: "assets/images/pizza-salame.jpg"
    },
    {
      id: "cipolle",
      category: "pizze",
      name_it: "Cipolle",
      name_en: "Onion Pizza",
      desc_it: "Pomodoro, mozzarella fiordilatte, cipolle dorate stufate al forno",
      desc_en: "Tomato sauce, fiordilatte mozzarella, oven-stewed golden onions",
      ingredients_it: "Pomodoro, mozzarella fiordilatte, cipolle",
      ingredients_en: "Tomato sauce, fiordilatte mozzarella, onions",
      price: 7.5,
      image: "assets/images/pizza-cipolle.jpg"
    },
    {
      id: "alici",
      category: "pizze",
      name_it: "Alici",
      name_en: "Anchovy Pizza",
      desc_it: "Pomodoro, mozzarella fiordilatte, alici del Mar Cantabrico, origano",
      desc_en: "Tomato sauce, fiordilatte mozzarella, Cantabrian anchovies, oregano",
      ingredients_it: "Pomodoro, mozzarella fiordilatte, alici, origano",
      ingredients_en: "Tomato sauce, fiordilatte mozzarella, anchovies, oregano",
      price: 8.0,
      image: "assets/images/pizza-alici.jpg"
    },
    {
      id: "salame-cipolla",
      category: "pizze",
      name_it: "Salame e Cipolla",
      name_en: "Salami & Onion Pizza",
      desc_it: "Pomodoro, mozzarella fiordilatte, salame piccante, cipolle dorate",
      desc_en: "Tomato sauce, fiordilatte mozzarella, spicy salami, golden onions",
      ingredients_it: "Pomodoro, mozzarella fiordilatte, salame piccante, cipolle",
      ingredients_en: "Tomato sauce, fiordilatte mozzarella, spicy salami, onions",
      price: 9.0,
      image: "assets/images/pizza-salame-cipolla.jpg"
    },
    {
      id: "prosciutto-crudo",
      category: "speciali",
      name_it: "Prosciutto Crudo",
      name_en: "Prosciutto Crudo Pizza",
      desc_it: "Pomodoro, mozzarella fiordilatte, prosciutto crudo di Parma 24 mesi",
      desc_en: "Tomato sauce, fiordilatte mozzarella, 24-month aged Parma ham",
      ingredients_it: "Pomodoro, mozzarella fiordilatte, prosciutto crudo di Parma",
      ingredients_en: "Tomato sauce, fiordilatte mozzarella, Parma ham",
      price: 9.5,
      image: "assets/images/pizza-prosciutto-crudo.jpg"
    },
    {
      id: "calzone",
      category: "speciali",
      name_it: "Calzone Farcito",
      name_en: "Stuffed Calzone",
      desc_it: "Pomodoro, mozzarella fiordilatte, prosciutto cotto alta qualità, funghi champignon",
      desc_en: "Tomato sauce, fiordilatte mozzarella, high-grade cooked ham, mushrooms",
      ingredients_it: "Pomodoro, mozzarella fiordilatte, prosciutto cotto, funghi",
      ingredients_en: "Tomato sauce, fiordilatte mozzarella, cooked ham, mushrooms",
      price: 9.0,
      image: "assets/images/pizza-calzone.jpg"
    },
    {
      id: "bresaola-rucola",
      category: "speciali",
      name_it: "Bresaola e Rucola",
      name_en: "Bresaola & Arugula Pizza",
      desc_it: "Pomodoro, mozzarella fiordilatte, bresaola della Valtellina IGP, rucola fresca, scaglie di Grana",
      desc_en: "Tomato sauce, fiordilatte mozzarella, Valtellina bresaola, fresh arugula, shaved Parmesan",
      ingredients_it: "Pomodoro, mozzarella, bresaola IGP, rucola, Grana Padano",
      ingredients_en: "Tomato sauce, mozzarella, bresaola, arugula, shaved Parmesan",
      price: 10.5,
      image: "assets/images/pizza-bresaola-rucola.jpg"
    },
    {
      id: "fiori-zucca",
      category: "speciali",
      name_it: "Fiori di Zucca",
      name_en: "Zucchini Blossom Pizza",
      desc_it: "Mozzarella fiordilatte, fiori di zucca freschi, alici del Cantabrico, burrata pugliese",
      desc_en: "Fiordilatte mozzarella, fresh zucchini blossoms, Cantabrian anchovies, creamy burrata",
      ingredients_it: "Mozzarella fiordilatte, fiori di zucca, alici, burrata",
      ingredients_en: "Fiordilatte mozzarella, zucchini blossoms, anchovies, burrata",
      price: 11.0,
      image: "assets/images/pizza-fiori-zucca.jpg"
    },
    {
      id: "rucola-pomodorini",
      category: "speciali",
      name_it: "Rucola e Pomodorini",
      name_en: "Arugula & Cherry Tomato Pizza",
      desc_it: "Pomodoro, mozzarella fiordilatte, rucola selvatica, pomodorini datterini, olio EVO a crudo",
      desc_en: "Tomato sauce, fiordilatte mozzarella, wild arugula, cherry tomatoes, raw EVO oil",
      ingredients_it: "Pomodoro, mozzarella fiordilatte, rucola, pomodorini, olio EVO",
      ingredients_en: "Tomato sauce, fiordilatte mozzarella, arugula, cherry tomatoes, EVO oil",
      price: 8.5,
      image: "assets/images/pizza-rucola-pomodorini.jpg"
    }
  ],

  translations: {
    nav: {
      home: { it: "Home", en: "Home" },
      menu: { it: "Menu", en: "Menu" },
      delivery: { it: "Delivery", en: "Delivery" },
      about: { it: "Chi siamo", en: "About" },
      contact: { it: "Contatti", en: "Contact" },
      order: { it: "Ordina ora", en: "Order now" }
    },
    hero: {
      // badge: { it: "Pizzeria dal 1971 · Sarezzo", en: "Pizzeria since 1971 · Sarezzo" },
      // title: { it: "Miss Biss", en: "Miss Biss" },
      // subtitle: {
      //   it: "L'autentica pizza cotta nel forno a legna. Consegniamo a domicilio o ovunque tu sia.",
      //   en: "Authentic wood-fired pizza. We deliver to your door or wherever you are."
      // },
      orderNow: { it: "Ordina ora", en: "Order now" },
      exploreMenu: { it: "Scopri il menu", en: "Explore menu" },
      call: { it: "Chiama", en: "Call" },
      whatsapp: { it: "WhatsApp", en: "WhatsApp" }
    },
    delivery: {
      title: { it: "Consegniamo dove ti trovi", en: "We deliver wherever you are" },
      badge: { it: "🚚 Delivery ovunque", en: "🚚 Delivery anywhere" },
      headline: {
        it: "Consegniamo a domicilio o ovunque tu sia.",
        en: "We deliver to your home or wherever you are."
      },
      sub: {
        it: "Casa, ufficio, hotel, posto di lavoro, casa di amici: portiamo la pizza dove sei tu.",
        en: "Home, office, hotel, workplace, friends' house: we bring pizza to where you are."
      },
      useLocation: { it: "Usa la mia posizione", en: "Use my location" },
      searchAddress: { it: "Cerca indirizzo", en: "Search address" },
      addressPlaceholder: { it: "Inserisci il tuo indirizzo", en: "Enter your address" },
      search: { it: "Cerca", en: "Search" },
      confirm: { it: "Conferma posizione", en: "Confirm location" },
      notes: { it: "Note di consegna", en: "Delivery notes" },
      notesPlaceholder: {
        it: "Es. interno, piano, citofono, stanza hotel...",
        en: "E.g. apt, floor, doorbell, hotel room..."
      },
      locating: { it: "Localizzazione...", en: "Locating..." },
      locationError: { it: "Impossibile ottenere la posizione.", en: "Could not get your location." },
      confirmed: { it: "Posizione confermata!", en: "Location confirmed!" },
      examplesTitle: { it: "Consegniamo presso:", en: "We deliver to:" },
      examples: {
        it: ["Casa", "Ufficio", "Hotel e B&B", "Posto di lavoro", "Casa di amici", "Parchi e piazze"],
        en: ["Home", "Office", "Hotel & B&B", "Workplace", "Friends' place", "Parks & plazas"]
      }
    },
    menu: {
      title: { it: "Il nostro Menu", en: "Our Menu" },
      subtitle: {
        it: "Pizza artigianale cotta nel forno a legna",
        en: "Handcrafted pizza baked in a wood-fired oven"
      },
      ingredients: { it: "Ingredienti", en: "Ingredients" },
      add: { it: "Aggiungi al carrello", en: "Add to cart" }
    },
    about: {
      title: { it: "La nostra storia", en: "Our story" },
      p1: {
        it: "Miss Biss è una pizzeria di Sarezzo, in Lombardia, che dal 1971 porta in tavola l'autentica tradizione della pizza italiana. Forno a legna, ingredienti freschi e pasta lavorata a mano ogni giorno.",
        en: "Miss Biss is a pizzeria in Sarezzo, Lombardy, bringing authentic Italian pizza tradition to the table since 1971. Wood-fired oven, fresh ingredients and handmade dough every single day."
      },
      p2: {
        it: "Un luogo caloroso, familiare e accogliente, dove la qualità della pizza incontra la passione per il mestiere. Che tu venga a trovarci o che ti consegnamo a casa, l'esperienza Miss Biss è sempre la stessa: gusto, semplicità e tradizione.",
        en: "A warm, family-friendly and welcoming place where quality pizza meets passion for the craft. Whether you visit us or we deliver to your home, the Miss Biss experience remains the same: taste, simplicity, and tradition."
      },
      stat1: { it: "Dal 1971", en: "Since 1971" },
      stat1Label: { it: "Tradizione", en: "Tradition" },
      stat2: { it: "Forno a legna", en: "Wood-fired" },
      stat2Label: { it: "Cottura", en: "Baking" },
      stat3: { it: "Ovunque", en: "Anywhere" },
      stat3Label: { it: "Consegna", en: "Delivery" }
    },
    cart: {
      title: { it: "Il tuo carrello", en: "Your cart" },
      empty: { it: "Il carrello è vuoto.", en: "Your cart is empty." },
      subtotal: { it: "Totale", en: "Total" },
      checkout: { it: "Vai all'ordine", en: "Go to checkout" },
      clear: { it: "Svuota", en: "Clear" },
      remove: { it: "Rimuovi", en: "Remove" }
    },
    checkout: {
      title: { it: "Completa l'ordine", en: "Complete your order" },
      name: { it: "Nome e cognome", en: "Full name" },
      namePh: { it: "Es. Mario Rossi", en: "E.g. John Smith" },
      phone: { it: "Numero di telefono", en: "Phone number" },
      phonePh: { it: "Es. 333 1234567", en: "E.g. 333 1234567" },
      type: { it: "Tipo di ordine", en: "Order type" },
      delivery: { it: "Consegna", en: "Delivery" },
      pickup: { it: "Ritiro in pizzeria", en: "Pickup at pizzeria" },
      address: { it: "Indirizzo di consegna", en: "Delivery address" },
      notes: { it: "Note di consegna", en: "Delivery notes" },
      notesPh: {
        it: "Interno, piano, citofono, stanza hotel...",
        en: "Apt, floor, doorbell, hotel room..."
      },
      location: { it: "Posizione sulla mappa", en: "Map location" },
      useLocation: { it: "Usa la mia posizione", en: "Use my location" },
      setOnMap: { it: "Trascina il segnaposto sulla mappa", en: "Drag the marker on the map" },
      review: { it: "Rivedi l'ordine", en: "Review your order" },
      back: { it: "Indietro", en: "Back" },
      sendWhats: { it: "Invia ordine su WhatsApp", en: "Send order via WhatsApp" },
      required: { it: "Compila tutti i campi obbligatori.", en: "Fill all required fields." },
      addressRequired: { it: "Inserisci l'indirizzo di consegna.", en: "Enter the delivery address." },
      anywhere: { it: "Consegniamo dove ti trovi.", en: "We deliver wherever you are." }
    },
    contact: {
      title: { it: "Contatti", en: "Contact" },
      subtitle: {
        it: "Vieni a trovarci o ordinaci la tua pizza",
        en: "Come visit us or order your pizza"
      },
      address: { it: "Indirizzo", en: "Address" },
      phone: { it: "Telefono", en: "Phone" },
      whatsapp: { it: "WhatsApp", en: "WhatsApp" },
      hours: { it: "Orari di apertura", en: "Opening hours" },
      directions: { it: "Come arrivare", en: "Get directions" },
      callNow: { it: "Chiama ora", en: "Call now" },
      whatsappUs: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" }
    },
    footer: {
      tagline: {
        it: "Pizzeria dal 1971 · Sarezzo (Lombardia)",
        en: "Pizzeria since 1971 · Sarezzo (Lombardy)"
      },
      rights: { it: "Tutti i diritti riservati.", en: "All rights reserved." }
    }
  }
};
