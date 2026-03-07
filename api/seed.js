import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Define the exact schema used in the app
const listingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        address: { type: String, required: true },
        regularPrice: { type: Number, required: true },
        discountPrice: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        furnished: { type: Boolean, required: true },
        parking: { type: Boolean, required: true },
        type: { type: String, required: true },
        offer: { type: Boolean, required: true },
        imageUrls: { type: Array, required: true },
        userRef: { type: String, required: true },
    },
    { timestamps: true }
);

const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);

const userRef = "dummy_user_123456";

const dummyListings = [
    // OFFERS
    {
        name: "Lodha Altamount Penthouse",
        description: "An architectural marvel located on Billionaire's Row. Features panoramic views of the Arabian Sea, private elevator access, temperature-controlled indoor pool, and smart home automation by Creston.",
        address: "Altamount Road, Cumballa Hill, Mumbai 400026",
        regularPrice: 450000000,
        discountPrice: 425000000,
        bathrooms: 6,
        bedrooms: 5,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "DLF The Magnolias Luxury Suite",
        description: "Ultra-luxury golf-facing apartment within the prestigious DLF-5 community. Exquisite interiors featuring imported Italian marble, fully fitted Gaggenau kitchen, and dedicated concierge service.",
        address: "Sector 42, Golf Course Road, Gurugram 122002",
        regularPrice: 320000000,
        discountPrice: 300000000,
        bathrooms: 5,
        bedrooms: 4,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "Prestige Golfshire Villa",
        description: "Award-winning Balinese-themed villa nestled at the foothills of Nandi Hills. Includes an 18-hole championship golf course membership, private infinity lap pool, and terraced tropical gardens.",
        address: "Nandi Hills Road, Devanahalli, Bengaluru 562110",
        regularPrice: 180000000,
        discountPrice: 165000000,
        bathrooms: 5,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "Jubilee Hills Grand Estate",
        description: "Immaculate newly-constructed mansion in Hyderabad's most covetable zip code. Features a 20-seat private theater, a commercial-grade gym, a climate-controlled wine cellar, and subterranean parking for 8 cars.",
        address: "Road No. 36, Jubilee Hills, Hyderabad 500033",
        regularPrice: 550000000,
        discountPrice: 490000000,
        bathrooms: 8,
        bedrooms: 7,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },

    // RENTALS
    {
        name: "Panchshil Trump Towers Residence",
        description: "Experience absolute luxury on rent. This high-floor residence features an expansive deck with sweeping urban views, full Miele appliances, and access to white-glove Trump concierge services.",
        address: "Kalyani Nagar, Pune 411014",
        regularPrice: 450000,
        discountPrice: 0,
        bathrooms: 5,
        bedrooms: 4,
        furnished: true,
        parking: true,
        type: "rent",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600607684988-15cb3fbde718?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "Sea-Facing Bandra Duplex",
        description: "Rare duplex offering in Bandra West overlooking the sea link. Beautiful contemporary design with floating staircases, double-height living room windows, and a private terrace garden.",
        address: "Carter Road, Bandra West, Mumbai 400050",
        regularPrice: 900000,
        discountPrice: 0,
        bathrooms: 4,
        bedrooms: 3,
        furnished: true,
        parking: true,
        type: "rent",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "Indiranagar Corporate Villa",
        description: "Fully-serviced independent residence ideal for expat executives. Minimalist aesthetics, massive master suite with walk-in wardrobe, dedicated home office, and full security system.",
        address: "100 Ft Road, Defence Colony, Indiranagar, Bengaluru 560038",
        regularPrice: 350000,
        discountPrice: 0,
        bathrooms: 4,
        bedrooms: 4,
        furnished: true,
        parking: true,
        type: "rent",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "Vasant Vihar Embassy Estate",
        description: "Spacious builder floor spanning 6,000 sq ft situated in the diplomatic enclave. Features large private lawns, separate staff quarters, premium stonework, and immense natural light.",
        address: "Vasant Vihar, Diplomatic Enclave, New Delhi 110057",
        regularPrice: 650000,
        discountPrice: 0,
        bathrooms: 5,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "rent",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1600607687644-aac4c15cecb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },

    // SALES (No Offer)
    {
        name: "Embassys Boulevard Mansion",
        description: "Set in Bengaluru's finest pin code, this sprawling residence offers pure opulence. Intricately designed living spaces, an automated heated pool, bespoke spa facilities, and immense outdoor entertainment areas.",
        address: "Yelahanka, Bengaluru 560064",
        regularPrice: 240000000,
        discountPrice: 0,
        bathrooms: 6,
        bedrooms: 5,
        furnished: true,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "Worli Sea Face Triplex",
        description: "The crown jewel of South Mumbai. A breathtaking un-obstructed 180-degree view of the sea from triple-height windows. Comes bare-shell to customize exactly to the buyer's extreme tastes.",
        address: "Annie Besant Road, Worli, Mumbai 400030",
        regularPrice: 850000000,
        discountPrice: 0,
        bathrooms: 7,
        bedrooms: 6,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600607687644-aac4c15cecb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "The Camelot at Boat Club",
        description: "Located perfectly in Chennai's most exclusive, historic leafy enclave. Colonial architecture meets hyper-modern tech. Includes a vast manicured garden, heritage wood panelling, and deep shaded verandas.",
        address: "Boat Club Road, R A Puram, Chennai 600028",
        regularPrice: 420000000,
        discountPrice: 0,
        bathrooms: 5,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    },
    {
        name: "Amrita Shergill Marg Heritage Bungalow",
        description: "A once-in-a-lifetime opportunity. Situated on a massive 3-acre Lutyens Delhi plot. Features absolute privacy, massive motor court, heritage trees, and immense architectural significance.",
        address: "Lutyens Bungalow Zone, New Delhi 110003",
        regularPrice: 2800000000,
        discountPrice: 0,
        bathrooms: 9,
        bedrooms: 8,
        furnished: true,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1600607684988-15cb3fbde718?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        userRef,
    }
];

const seedDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected gracefully.");

        console.log("Clearing old listings...");
        await Listing.deleteMany({});
        console.log("Old listings cleared.");

        console.log("Seeding absolute luxury properties...");
        await Listing.insertMany(dummyListings);
        console.log("Seed successful! Your Indian luxury listings are ready.");

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding", error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDB();
