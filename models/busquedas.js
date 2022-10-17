import fs from 'fs'
import axios from 'axios'

class Busquedas { 
    historial = [];
    dbPath = './db/database.json'

    constructor() {
        this.leerDB()
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
    
            return resp.data.features

        } catch (error) {
            console.log( error )
        }


    }

    async clima( lat, lon ) { 

        const instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: { ...this.paramsWeather, lat, lon }
        })

        const resp = await instance.get();

        return resp.data
        
    }

    agregarHistorial( lugar ) { 

        this.historial.unshift( lugar.place_name )
        
        const payload = {
            historial: this.historial 
        }

        this.guardarDB( payload )
        
    }

    guardarDB( lugar ) { 

        fs.writeFileSync(this.dbPath, JSON.stringify( lugar ))

    }

    leerDB() { 

        if( !fs.existsSync(this.dbPath) ) { 
            return;
        }

        const data = fs.readFileSync(this.dbPath,{ encoding: 'utf-8'})
        const info = JSON.parse( data )
        this.historial = info.historial
    }
    
}


export { 
    Busquedas
}