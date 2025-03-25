const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    helpers: {
        includes: function (value, search) {
            if (typeof value === "string" && typeof search === "string") {
                return value.includes(search);
            }
            return false;
        }
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.use(express.static(path.join(__dirname, "public")));



let gallery = [];
const galleryFilePath = path.join(__dirname, "data/gallery.json");

if (fs.existsSync(galleryFilePath)) {
    try {
        gallery = JSON.parse(fs.readFileSync(galleryFilePath, "utf-8"));
    } catch (error) {
        console.error("Error loading gallery.json:", error);
    }
}

// Destination data
const destinations = {
    "bali": {
        "name": "Bali",
        "about": "Bali, often called the 'Island of the Gods,' is a tropical paradise known for its stunning beaches, lush green rice terraces, and vibrant Hindu culture. The island offers a mix of adventure, relaxation, and spirituality, making it a top destination for travelers.",
        "destinations": ["Ubud", "Seminyak", "Canggu", "Nusa Dua"],
        "services": ["Private Tours", "Luxury Resorts", "Water Sports", "Cultural Experiences"],
        "facts": "Bali has over 20,000 temples, and its unique culture blends Hindu traditions with local Balinese customs."
    },
    "paris": {
        "name": "Paris",
        "about": "Paris, the 'City of Love,' is known for its timeless elegance, rich history, and stunning architecture. From the iconic Eiffel Tower to the world-renowned Louvre Museum, the city offers a mix of romance, art, and gastronomy.",
        "destinations": ["Eiffel Tower", "Louvre Museum", "Notre Dame", "Champs-Élysées"],
        "services": ["City Walking Tours", "Luxury Accommodations", "Fine Dining", "Private Chauffeurs"],
        "facts": "The Eiffel Tower is repainted every 7 years using 60 tons of paint. Paris is also home to over 130 museums."
    },
    "tokyo": {
        "name": "Tokyo",
        "about": "Tokyo, the capital of Japan, is a dazzling metropolis where modern innovation meets deep-rooted traditions. From the towering skyscrapers of Shinjuku to the historic temples of Asakusa, Tokyo offers a diverse cultural experience.",
        "destinations": ["Shibuya", "Shinjuku", "Asakusa", "Akihabara"],
        "services": ["Public Transport Assistance", "Nightlife Tours", "Food Experiences", "Historical Tours"],
        "facts": "Tokyo has the world's busiest train station, Shinjuku Station, with over 3.6 million people passing through daily."
    },
    "rome": {
        "name": "Rome",
        "about": "Rome, the Eternal City, is a living museum filled with ancient wonders, magnificent art, and vibrant street life. From the grandeur of the Colosseum to the sacred Vatican City, Rome offers a glimpse into the past while embracing modern Italian culture.",
        "destinations": ["Colosseum", "Vatican City", "Trevi Fountain", "Pantheon"],
        "services": ["Skip-the-line Museum Passes", "Private Guides", "Culinary Experiences", "Luxury Hotels"],
        "facts": "Rome is home to the smallest country in the world, Vatican City. The city has over 2,000 fountains, including the famous Trevi Fountain."
    }
};

// Homepage Route 
app.get("/", (req, res) => {
    const sliderImages = gallery.filter(img => img.slider === true); // Get only slider images
    const fullGallery = gallery.filter(img => !img.slider).slice(0, 16); // Exclude slider images

    res.render("home", { fullGallery, sliderImages, destinations: Object.keys(destinations) });
});

// Destination Page Route
app.get("/destination/:name", (req, res) => {
    const destination = req.params.name.toLowerCase();
    const selectedDestination = destinations[destination];

    if (!selectedDestination) {
        return res.status(404).send("Destination not found");
    }

    const destinationGallery = gallery.filter(img => 
        img.image.includes(destination) && !img.slider // Exclude slider images
    ).slice(0, 4);

    const fullGallery = gallery.filter(img => !img.slider).slice(0, 16);

    res.render("destination", { 
        destination: selectedDestination.name, 
        about: selectedDestination.about, 
        destinations: selectedDestination.destinations,
        services: selectedDestination.services,
        facts: selectedDestination.facts,
        destinationGallery, 
        fullGallery 
    });
});

// Contact Form Submission Route
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

    // Add new contact to list
    contacts.push({ name, email });

    try {
        fs.writeFileSync(contactFilePath, JSON.stringify(contacts, null, 2));
    } catch (error) {
        console.error("Error writing to contacts.json:", error);
    }

    res.redirect("/");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
