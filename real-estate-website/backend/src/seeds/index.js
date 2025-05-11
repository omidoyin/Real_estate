const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load models
const Land = require("../models/Land");
const House = require("../models/House");
const Apartment = require("../models/Apartment");
const Service = require("../models/Service");
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const Team = require("../models/Team");
const Inspection = require("../models/Inspection");

// Load seed functions
const seedLands = require("./landSeeds");
const seedHouses = require("./houseSeeds");
const seedApartments = require("./apartmentSeeds");
const seedServices = require("./serviceSeeds");
const seedAnnouncements = require("./announcementSeeds");
const seedTeams = require("./teamSeeds");
const seedInspections = require("./inspectionSeeds");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Land.deleteMany({});
    await House.deleteMany({});
    await Apartment.deleteMany({});
    await Service.deleteMany({});
    await Announcement.deleteMany({});
    await Team.deleteMany({});
    await Inspection.deleteMany({});

    // Keep users but clear their relationships
    // Don't delete users to preserve existing accounts
    await User.updateMany(
      {},
      {
        $set: {
          purchasedLands: [],
          purchasedHouses: [],
          purchasedApartments: [],
          favoriteLands: [],
          favoriteHouses: [],
          favoriteApartments: [],
          subscribedServices: [],
        },
      }
    );

    console.log("Database cleared");

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const adminUser = new User({
        name: "Admin User",
        email: "admin@example.com",
        phone: "1234567890",
        password: hashedPassword,
        role: "admin",
      });

      await adminUser.save();
      console.log("Admin user created");
    }

    // Create regular user if it doesn't exist
    const userExists = await User.findOne({ email: "user@example.com" });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash("user123", 10);

      const regularUser = new User({
        name: "Regular User",
        email: "user@example.com",
        phone: "0987654321",
        password: hashedPassword,
        role: "user",
      });

      await regularUser.save();
      console.log("Regular user created");
    }

    // Seed lands
    const lands = await seedLands();
    console.log(`${lands.length} lands created`);

    // Seed houses
    const houses = await seedHouses();
    console.log(`${houses.length} houses created`);

    // Seed apartments
    const apartments = await seedApartments();
    console.log(`${apartments.length} apartments created`);

    // Seed services
    const services = await seedServices();
    console.log(`${services.length} services created`);

    // Seed teams (must be before inspections)
    const teams = await seedTeams();
    console.log(`${teams.length} team members created`);

    // Seed announcements
    const announcements = await seedAnnouncements();
    console.log(`${announcements.length} announcements created`);

    // Seed inspections (must be after lands, houses, apartments, users, and teams)
    const inspections = await seedInspections();
    console.log(`${inspections.length} inspections created`);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
