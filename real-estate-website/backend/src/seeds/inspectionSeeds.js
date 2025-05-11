const Inspection = require("../models/Inspection");
const User = require("../models/User");
const Land = require("../models/Land");
const House = require("../models/House");
const Apartment = require("../models/Apartment");
const Team = require("../models/Team");

const seedInspections = async () => {
  try {
    // Get references to existing data
    const users = await User.find({}).limit(5);
    const lands = await Land.find({}).limit(2);
    const houses = await House.find({}).limit(2);
    const apartments = await Apartment.find({}).limit(1);
    const agents = await Team.find({}).limit(3);

    // If we don't have enough data, return empty array
    if (
      users.length < 5 ||
      lands.length < 2 ||
      houses.length < 2 ||
      agents.length < 3
    ) {
      console.log("Not enough data to create inspections");
      return [];
    }

    // Create inspections based on available data
    let inspectionData = [];

    // Add land inspections
    inspectionData.push({
      client: users[0]._id,
      property: lands[0]._id,
      propertyType: "Land",
      date: new Date("2023-06-15T10:00:00"),
      status: "Scheduled",
      agent: agents[0]._id,
      notes: "Client is interested in the investment potential of this land.",
      followUpDate: new Date("2023-06-20"),
    });

    inspectionData.push({
      client: users[1]._id,
      property: lands[1]._id,
      propertyType: "Land",
      date: new Date("2023-06-16T14:30:00"),
      status: "Confirmed",
      agent: agents[1]._id,
      notes: "Client is looking for land to build a family home.",
      followUpDate: new Date("2023-06-21"),
    });

    // Add house inspections
    inspectionData.push({
      client: users[2]._id,
      property: houses[0]._id,
      propertyType: "House",
      date: new Date("2023-06-10T11:00:00"),
      status: "Completed",
      agent: agents[0]._id,
      notes:
        "Client was impressed with the property but concerned about the price.",
      feedback:
        "The house was beautiful but slightly above my budget. I might consider it if there is room for negotiation.",
      followUpDate: new Date("2023-06-12"),
    });

    inspectionData.push({
      client: users[3]._id,
      property: houses[1]._id,
      propertyType: "House",
      date: new Date("2023-06-20T09:30:00"),
      status: "Scheduled",
      agent: agents[2]._id,
      notes: "Client is relocating for work and needs to find a house quickly.",
      followUpDate: new Date("2023-06-22"),
    });

    // Add apartment inspection if apartments exist
    if (apartments.length > 0) {
      inspectionData.push({
        client: users[4]._id,
        property: apartments[0]._id,
        propertyType: "Apartment",
        date: new Date("2023-06-18T13:00:00"),
        status: "Confirmed",
        agent: agents[1]._id,
        notes:
          "Client is downsizing and looking for a modern apartment in the city center.",
        followUpDate: new Date("2023-06-23"),
      });
    }

    try {
      const inspections = await Inspection.insertMany(inspectionData);
      return inspections;
    } catch (error) {
      console.error("Error creating inspections:", error);
      return [];
    }
  } catch (error) {
    console.error("Error in inspection seed setup:", error);
    return [];
  }
};

module.exports = seedInspections;
