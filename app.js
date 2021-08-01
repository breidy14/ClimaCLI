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
        const places = await quest.city(place);
        //console.log(places);

        // Seleccionar lugares
        const id = await listPlaces(places);
        const placeSelec = places.find((p) => p.id === id);

        // Clima

        // Mostrar resultado
        console.log("\nInformación de la ciudad\n".white);
        console.log("Ciudad: ", placeSelec.name);
        console.log("Lat: ", placeSelec.lat);
        console.log("Lng: ", placeSelec.lng);
        console.log("Temperatura:");
        console.log("Minimo:");
        break;

      case 2:
        break;

      case 3:
        break;
    }
    if (opt !== 0) await pause();
  } while (opt !== 0);
};

main();
