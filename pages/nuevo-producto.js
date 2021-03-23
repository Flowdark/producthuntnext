import React, { useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import Error404 from '../components/layout/404';
import { css } from '@emotion/react';

import { Formulario, Campo, InputSubmit, Error } from '../components/UI/Formulario';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

import { FirebaseContext } from '../firebase';

//Router
import Router, { useRouter } from 'next/router';

//React Firebase File Uploader
import FileUploader from 'react-firebase-file-uploader';

//State inicial
const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  url: '',
  descripcion: ''
};

const NuevoProducto = () => {

  //State de las imagenes
  const [ nombreimagen, guardarNombreImagen ] = useState('');
  const [ subiendo, guardarSubiendo ] = useState(false);
  const [ progreso, guardarProgreso ] = useState(0);
  const [ urlimagen, guardarUrlImagen ] = useState(0);

  const [ error, guardarError ] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, url, descripcion } = valores;

  //Hook de routing
  const router = useRouter();

  //Context con las operaciones crud firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  
  function crearProducto(){
    //Si el usuario no está auth
    if(!usuario){
      return router.push('/login');
    }

    //Crear el objeto de nuevo producto
    const producto = {
      nombre, 
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        usuarioNombre: usuario.displayName 
      },
      haVotado: []
    };

    //Insertar en firestore
    firebase.db.collection('productos').add(producto);

    //Redireccionar
    return router.push('/');
  }

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(false);
  };

  const handleProgress = (progreso) => guardarProgreso({ progreso });

  const handleUploadError = (error) => {
    guardarSubiendo(error);
    console.log(error);
  };

  const handleUploadSuccess = (nombre) => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombreImagen(nombre);
    firebase
        .storage
        .ref("productos")
        .child(nombre)
        .getDownloadURL()
        .then( url => {
          console.log(url);
          guardarUrlImagen(url);
        } );
  }

  return ( 
    <Layout>
      {!usuario ? (<Error404 />)
        :
        (
          <>
            <h1
              css={css`
                text-align: center;
              `}
            >Nuevo Producto</h1>
            <Formulario
              onSubmit={ handleSubmit }
              noValidate
            >
              <fieldset>
                <legend>Información General</legend>
                  <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text"
                    id="nombre"
                    placeholder="Nombre del Producto"
                    name="nombre"
                    value={nombre}
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                    autoComplete="off"
                  />
                </Campo>

                { errores.nombre && <Error>{errores.nombre}</Error> }

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                    type="text"
                    id="empresa"
                    placeholder="Nombre de la Empresa o Compañía"
                    name="empresa"
                    value={empresa}
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                    autoComplete="off"
                  />
                </Campo>

                { errores.empresa && <Error>{errores.empresa}</Error> }

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader 
                    accept="imagen/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>

                { errores.imagen && <Error>{errores.imagen}</Error> }

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input 
                    type="url"
                    id="url"
                    name="url"
                    placeholder="URL de tu producto"
                    value={url}
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                    autoComplete="off"
                  />
                </Campo>

                { errores.url && <Error>{errores.url}</Error> }
              </fieldset>

              <fieldset>
                <legend>Sobre Tu Producto</legend>
                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea 
                  id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                    autoComplete="off"
                  />
                </Campo>
                { errores.descripcion && <Error>{errores.descripcion}</Error> }
              </fieldset>

              { error && <Error>{error}</Error> }

              <InputSubmit 
                type="submit"
                value="Crear Producto"
              />
            </Formulario>
          </> 
        )
      }
    </Layout>
   );
}
 
export default NuevoProducto;
