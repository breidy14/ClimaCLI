const fs = require("fs");
const axios = require("axios");

class Quest {
  history = [];
  dbPath = "./db/database.json";

  constructor() {
    // TODO: leer DB si existe
    this.readDB();
  }

  get historyUpper() {
    return this.history.map((place) => {
      let words = place.split(" ");
      words = words.map((p) => p[0].toUpperCase() + p.substring(1));

      return words.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOPW() {
    return {
      appid: process.env.OPW_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async cities(place) {
    try {
      //petición http

      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?`,
        params: this.paramsMapbox,
      });

      const res = await intance.get(place);

      //retornar lugares
      return res.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async weatherPlace(lat, lon) {
    try {
      const intance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
        params: { ...this.paramsOPW, lat, lon },
      });

      const res = await intance.get();
      const { main, weather } = res.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addHistory(place = "") {
    // TODO prevenir duplicados

    if (this.history.includes(place.toLowerCase())) {
      return;
    }

    this.history = this.history.splice(0, 5);

    this.history.unshift(place.toLowerCase());

    //guardar
    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.history = data.history;
  }
}

module.exports = Quest;
