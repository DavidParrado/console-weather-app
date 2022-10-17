import inquirer from 'inquirer'
import colors from 'colors'


const preguntas = [{
    type: 'list', 
    name: 'opcion', 
    message: 'Que deseas hacer', 
    choices: [
        {
            value: 1, 
            name: `${'1.'.green } Buscar ciudad`
        },
        {
            value: 2, 
            name: `${'2.'.green } Historial`
        },{
            value: 0, 
            name: `${'3.'.green } Salir`
        }
    ]
}]


const inquirerMenu = async() => {
    console.clear();
    console.log('============================='.green);
    console.log('   Seleccione una opcion: '.white);
    console.log('=============================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion; 
}

    
const pausa = async() => {
    
    const question = [{
        type: 'input', 
        name: 'enter', 
        message: `Presiona ${ 'ENTER'.green } para continuar`
    }] 

    await inquirer.prompt( question )

}

const leerInput = async( message ) => {

    const question = [
        {
            type: 'input', 
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Debes ingresar un valor'
                }

                return true; 
            }
        }
    ];

    const { desc } = await inquirer.prompt(question)

    return desc; 
}

const listarLugares = async( lugares = [] ) => {

    const choices = lugares.map( ( lugar, i ) => {
        const idx = `${i + 1}.`.green
        return { 
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre }`
        }
    });

    choices.unshift({
        value: '0', 
        name: '0. '.green + 'Cancelar'
    })

    const question = [
        { 
            type: 'list', 
            name: 'id',
            message: 'Seleccione la ciudad',
            choices
        }
    ]


    const { id } = await inquirer.prompt(question)

    return id;

}

const confirmacion = async( message ) => {

    const question = [{
        type: 'confirm',
        name: 'valor',
        message
    }]

    const { valor } = await inquirer.prompt(question)
    return valor;

}

const completarChecklist = async( tareas = [] ) => {

    const choices = tareas.map( ( tarea, i ) => {
        const idx = `${i + 1}.`.green
        return { 
            value: tarea.id,
            name: `${ idx } ${ tarea.desc }`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    });

    const question = [
        { 
            type: 'checkbox', 
            name: 'ids',
            message: 'Selecciona las tareas',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(question)
    return ids;

}

export {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmacion,
    completarChecklist
}