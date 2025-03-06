const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars setup
const hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Load gallery data safely with error handling
let gallery = [];
try {
    const galleryData = fs.readFileSync(path.join(__dirname, "data/gallery.json"), "utf-8");
    gallery = JSON.parse(galleryData);
} catch (error) {
    console.error("Error loading gallery.json:", error);
}

// Destination data
const destinations = {
    "bali": {
        name: "Bali",
        about: "Bali is known for its beautiful beaches, lush rice terraces, and rich culture.",
        destinations: ["Ubud", "Seminyak", "Canggu", "Nusa Dua"],
        services: ["Private Tours", "Luxury Resorts", "Water Sports", "Cultural Experiences"],
        facts: "Bali has over 20,000 temples and is known as the 'Island of the Gods'."
    },
    "paris": {
        name: "Paris",
        about: "Paris is known for its stunning architecture, museums, and romance.",
        destinations: ["Eiffel Tower", "Louvre Museum", "Notre Dame", "Champs-Élysées"],
        services: ["City Walking Tours", "Luxury Accommodations", "Fine Dining", "Private Chauffeurs"],
        facts: "The Eiffel Tower is repainted every 7 years using 60 tons of paint."
    },
    "tokyo": {
        name: "Tokyo",
        about: "Tokyo blends modern skyscrapers with historic temples and cutting-edge culture.",
        destinations: ["Shibuya", "Shinjuku", "Asakusa", "Akihabara"],
        services: ["Public Transport Assistance", "Nightlife Tours", "Food Experiences", "Historical Tours"],
        facts: "Tokyo has the world's busiest train station, Shinjuku Station, with over 3.6 million people passing through daily."
    },
    "rome": {
        name: "Rome",
        about: "Rome is a city full of history, famous for its ancient ruins and cuisine.",
        destinations: ["Colosseum", "Vatican City", "Trevi Fountain", "Pantheon"],
        services: ["Skip-the-line Museum Passes", "Private Guides", "Culinary Experiences", "Luxury Hotels"],
        facts: "Ancient Romans used urine as a mouthwash because of its ammonia content."
    }
};

// Homepage (Fixed Duplicate Route)
app.get("/", (req, res) => {
    const sliderImages = gallery.filter(img => img.slider === true); // Get only slider images
    res.render("home", { gallery, sliderImages, destinations: Object.keys(destinations) });
});

// Destination pages
app.get("/destination/:name", (req, res) => {
    const destination = req.params.name.toLowerCase();
    const selectedDestination = destinations[destination];

    if (!selectedDestination) {
        return res.status(404).send("Destination not found");
    }

    const filteredGallery = gallery.filter(img => img.image.includes(destination));

    res.render("destination", { 
        destination: selectedDestination.name, 
        about: selectedDestination.about, 
        destinations: selectedDestination.destinations,
        services: selectedDestination.services,
        facts: selectedDestination.facts,
        gallery: filteredGallery
    });
});

// Contact form submission (Improved Error Handling)
app.post("/submit-contact", (req, res) => {
    const { name, email } = req.body;
    const contactFilePath = path.join(__dirname, "data/contacts.json");

    let contacts = [];
    if (fs.existsSync(contactFilePath)) {
        try {
            contacts = JSON.parse(fs.readFileSync(contactFilePath, "utf-8"));
        } catch (error) {
            console.error("Error reading contacts.json:", error);
        }
    }

    contacts.push({ name, email });

    try {
        fs.writeFileSync(contactFilePath, JSON.stringify(contacts, null, 2));
    } catch (error) {
        console.error("Error writing to contacts.json:", error);
    }

    res.redirect("/");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
