const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Handlebars setup with helpers
const hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    helpers: {
        contains: function (image, destination) {
            return image.includes(destination);
        }
    }
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// Load gallery JSON data
let gallery = [];
try {
    gallery = JSON.parse(fs.readFileSync(path.join(__dirname, "data/gallery.json"), "utf-8"));
} catch (error) {
    console.error("Error reading gallery.json:", error);
}

// Destination data
const destinations = {
    "bali": {
        "name": "Bali",
        "about": "Bali is known for its beautiful beaches, lush rice terraces, and rich culture.",
        "destinations": ["Ubud", "Seminyak", "Canggu", "Nusa Dua"],
        "highlights": ["Monkey Forest", "Uluwatu Temple", "Tegallalang Rice Terraces", "Mount Batur"],
        "best_time_to_visit": "April to October",
        "activities": ["Surfing", "Yoga retreats", "Temple hopping", "Snorkeling & diving"],
        "services": ["Private Tours", "Luxury Resorts", "Water Sports", "Cultural Experiences"]
    },
    "paris": {
        "name": "Paris",
        "about": "Paris is known for its stunning architecture, museums, and romance.",
        "destinations": ["Eiffel Tower", "Louvre Museum", "Notre Dame", "Champs-Élysées"],
        "highlights": ["Seine River Cruise", "Montmartre", "Palace of Versailles", "Sainte-Chapelle"],
        "best_time_to_visit": "April to June, September to November",
        "activities": ["Wine tasting", "Museum tours", "Shopping", "Fine dining"],
        "services": ["City Walking Tours", "Luxury Accommodations", "Fine Dining", "Private Chauffeurs"]
    },
    "tokyo": {
        "name": "Tokyo",
        "about": "Tokyo blends modern skyscrapers with historic temples and cutting-edge culture.",
        "destinations": ["Shibuya", "Shinjuku", "Asakusa", "Akihabara"],
        "highlights": ["Tokyo Tower", "Tsukiji Market", "Ginza", "Meiji Shrine"],
        "best_time_to_visit": "March to May, September to November",
        "activities": ["Cherry blossom viewing", "Anime & gaming", "Shopping", "Food tours"],
        "services": ["Public Transport Assistance", "Nightlife Tours", "Food Experiences", "Historical Tours"]
    },
    "rome": {
        "name": "Rome",
        "about": "Rome is a city full of history, famous for its ancient ruins and cuisine.",
        "destinations": ["Colosseum", "Vatican City", "Trevi Fountain", "Pantheon"],
        "highlights": ["Roman Forum", "Sistine Chapel", "Piazza Navona", "Spanish Steps"],
        "best_time_to_visit": "April to June, September to October",
        "activities": ["Historical tours", "Food & wine experiences", "Sightseeing", "Walking tours"],
        "services": ["Skip-the-line Museum Passes", "Private Guides", "Culinary Experiences", "Luxury Hotels"]
    }
};

// Routes
app.get("/", (req, res) => {
    res.render("home", { gallery });
});

app.get("/destination/:name", (req, res) => {
    const destination = req.params.name.toLowerCase();
    const selectedDestination = destinations[destination];

    if (!selectedDestination) {
        return res.status(404).send("Destination not found");
    }

    // Filter images only for the selected destination
    const filteredGallery = gallery.filter(img => img.image.includes(destination));

    res.render("destination", { 
        destination: selectedDestination.name, 
        about: selectedDestination.about, 
        destinations: selectedDestination.destinations,
        highlights: selectedDestination.highlights,
        best_time_to_visit: selectedDestination.best_time_to_visit,
        activities: selectedDestination.activities,
        services: selectedDestination.services,
        gallery: filteredGallery
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
