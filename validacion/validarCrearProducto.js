export default function validarCrearProducto(valores){
    let errores = {};

    if(!valores.nombre){
        errores.nombre = 'El nombre de el producto es obligatorio';
    }

    if(!valores.empresa){
        errores.empresa = 'El nombre de la empresa es obligatorio';
    }

    if(!valores.url){
        errores.url = 'La url del producto es obligatoria';
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = 'Ingresa una url válida';
    }

    if(!valores.descripcion){
        errores.descripcion = 'La descripción del producto es obligatoria';
    }

    return errores;
}