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
            busquedas.agregarHistorial( lugarSel.nombre )

            const { temp, min, max, desc} = await busquedas.clima( lugarSel.lat, lugarSel.lng)

            console.clear()
            console.log('Informacion de la ciudad'.green)
            console.log('Ciudad:', lugarSel.nombre )
            console.log('lat:', lugarSel.lat )
            console.log('lng:', lugarSel.lng )
            console.log('minima:', min )
            console.log('maxima:', max )
            console.log('temp:', temp )
            console.log('desc:', desc )

            await pausa()

        break;

        case 2: 

            busquedas.historialCapitalizado.forEach( ( lugar, i ) => { 
                const idx = `${ i + 1 }.`.green 

                console.log(`${ idx } ${ lugar }`)
            })
            await pausa()

        break; 
    }
        
    } while (opt !== 0 );


}



main()