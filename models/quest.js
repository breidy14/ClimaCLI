const axios = require("axios");

class Quest {
  history = ["London", "Madrid"];

  constructor() {
    // TODO: leer DB si existe
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  async city(place) {
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
}

module.exports = Quest;
