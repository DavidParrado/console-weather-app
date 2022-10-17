import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js";
import { Busquedas } from './models/busquedas.js';





const main = async() => {

    let opt;
    const busquedas = new Busquedas()

    do {

    opt = await inquirerMenu()

    switch (opt) {
        case 1:
            
            const termino = await leerInput('Ciudad: ');
            const lugares = await busquedas.ciudad( termino )
            const id = await listarLugares( lugares )          
            if( id === '0' ) continue;  

            const lugarSel = lugares.find( lugar => lugar.id === id )
            busquedas.agregarHistorial( lugarSel )

            const { weather, main } = await busquedas.clima( lugarSel.center[0], lugarSel.center[1])

            console.clear()
            console.log('Informacion de la ciudad'.green)
            console.log('Ciudad:', lugarSel.place_name )
            console.log('lat:', lugarSel.center[0] )
            console.log('lng:', lugarSel.center[1] )
            console.log('minima:', main.temp_min )
            console.log('maxima:', main.temp_max )
            console.log('temp:', main.temp )
            console.log('desc:', weather[0].description )

            await pausa()

        break;

        case 2: 

            busquedas.historial.forEach( ( lugar, i ) => { 
                const idx = `${ i + 1 }.`.green 

                console.log(`${ idx } ${ lugar }`)
            })
            await pausa()

        break; 
    }
        
    } while (opt !== 0 );


}



main()