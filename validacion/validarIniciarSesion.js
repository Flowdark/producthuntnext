export default function validarCrearCuenta(valores){
    let errores = {};

    //Validar Email
    if(!valores.email){
        errores.email = 'El email es obligatorio';
    }else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ){
        errores.email = 'Ingresa un email válido';
    }

    //Validar password
    if(!valores.password){
        valores.password = 'El password es obligatorio';
    }else if(valores.password.length < 6){
        valores.password = 'El passsword debe tener mínimo 6 carácteres';
    }

    return errores;
}