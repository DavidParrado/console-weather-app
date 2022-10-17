import fs from 'fs'
import axios from 'axios'

class Busquedas { 
    historial = [];
    dbPath = './db/database.json'

    constructor() {
        this.leerDB()
    }

    get historialCapitalizado() { 

        return this.historial.map( lugar => {

            const frase = lugar.split(" ");

            return frase.map( (palabra = '') => {

                return palabra[0].toUpperCase() + palabra.slice(1)
            }).join(" ")
        })
    }

    get paramsMapbox() { 
        return { 
            'access_token': process.env.MAPBOX_KEY,
            'proximity': 'ip', 
            'language': 'es'
        }
    }

    get paramsWeather() { 
        return { 
            appid: process.env.OPENWEATHER_KEY,
            lang: 'es',
            units: 'metric'
        }
    }

    async ciudad( lugar ) {
        
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            })
    
            const resp = await instance.get()
    
            return resp.data.features.map(( lugar ) => {
                return { 
                    id: lugar.id,
                    nombre: lugar.place_name,
                    lng: lugar.center[0], 
                    lat: lugar.center[1]
                }
            });

        } catch (error) {
            return [];
        }


    }

    async clima( lat, lon ) { 

        const instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: { ...this.paramsWeather, lat, lon }
        })

        const resp = await instance.get();
        const { weather, main } = resp.data

        return { 
            temp: main.temp, 
            min: main.temp_min,
            max: main.temp_max,
            desc: weather[0].description
        }
        
    }

    agregarHistorial( lugar = '' ) { 

        if( this.historial.includes( lugar.toLocaleLowerCase() )) { 
            return; 
        }
        
        this.historial = this.historial.splice(0,4)

        this.historial.unshift( lugar.toLocaleLowerCase() )
        

        this.guardarDB()
        
    }

    guardarDB() { 

        const payload = {
            historial: this.historial 
        }

        fs.writeFileSync(this.dbPath, JSON.stringify( payload ))

    }

    leerDB() { 

        if( !fs.existsSync(this.dbPath) ) { 
            return;
        }

        const info = fs.readFileSync(this.dbPath,{ encoding: 'utf-8'})
        const data = JSON.parse( info )
        this.historial = data.historial
    }
    
}


export { 
    Busquedas
}