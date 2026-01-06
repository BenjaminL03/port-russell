const mongoose = require("mongoose");
const fs = require("fs");
const Catway = require("./src/models/catway");
const Reservation = require("./src/models/reservation");

const MONGODB_URI =
  "mongodb+srv://benjaminleoo_db_user:6lFzluV8NEXvh4dh@essai.bcrycgg.mongodb.net/port_russell_prod?retryWrites=true&w=majority";

async function importData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB PRODUCTION");

    const catways = JSON.parse(fs.readFileSync("./catways.json", "utf-8"));
    const reservations = JSON.parse(
      fs.readFileSync("./reservations.json", "utf-8")
    );

    await Catway.deleteMany({});
    await Reservation.deleteMany({});
    console.log("🗑️  Données existantes supprimées");

    await Catway.insertMany(catways);
    console.log(`✅ ${catways.length} catways importés`);

    await Reservation.insertMany(reservations);
    console.log(`✅ ${reservations.length} réservations importées`);

    console.log("🎉 Import terminé avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

importData();
