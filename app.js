require("dotenv").config();

const {
  inquirerMenu,
  readInput,
  pause,
  listPlaces,
} = require("./helpers/inquirer.js");
const Quest = require("./models/quest.js");

const main = async () => {
  let opt;
  const quest = new Quest();

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const place = await readInput("Ciudad: ");

        //Buscar lugares
        const places = await quest.cities(place);
        //console.log(places);

        // Seleccionar lugares
        const id = await listPlaces(places);
        if (id === "0") continue;

        const placeSelec = places.find((p) => p.id === id);

        //Guardar
        quest.addHistory(placeSelec.name);

        // Clima
        const weatherPlace = await quest.weatherPlace(
          placeSelec.lat,
          placeSelec.lng
        );

        // Mostrar resultado
        console.clear();
        console.log("\nInformación de la ciudad\n".white);
        console.log("Ciudad: ", placeSelec.name);
        console.log("Lat: ", placeSelec.lat);
        console.log("Lng: ", placeSelec.lng);
        console.log("Temperatura: ", weatherPlace.temp);
        console.log("Mínimo: ", weatherPlace.min);
        console.log("Máximo: ", weatherPlace.max);
        console.log("Como está el clima: ", weatherPlace.desc);
        break;

      case 2:
        quest.historyUpper.forEach((place, i) => {
          const idx = `${i + 1}`.white;
          console.log(`${idx}. ${place}`);
        });
        break;
    }
    if (opt !== 0) await pause();
  } while (opt !== 0);
};

main();
