import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';

import { Formulario, Campo, InputSubmit, Error } from '../components/UI/Formulario';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

import firebase from '../firebase';

//Router
import Router from 'next/router';

//State inicial
const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
};

const CrearCuenta = () => {

  const [ error, guardarError ] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores; 

  async function crearCuenta(){
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.error('Hubo un error al crear la cuenta', error.message);
      guardarError(error.message);
    }
  }

  return ( 
    <Layout>
      <>
        <h1
          css={css`
            text-align: center;
          `}
        >Crear Cuenta</h1>
        <Formulario
          onSubmit={ handleSubmit }
          noValidate
        >
          <Campo>
            <label htmlFor="nombre">Nombre</label>
            <input 
              type="text"
              id="nombre"
              placeholder="Tu nombre"
              name="nombre"
              value={nombre}
              onChange={ handleChange }
              onBlur={ handleBlur }
            />
          </Campo>

          { errores.nombre && <Error>{errores.nombre}</Error> }

          <Campo>
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              placeholder="Tu email"
              name="email"
              value={email}
              onChange={ handleChange }
              onBlur={ handleBlur }
            />
          </Campo>

          { errores.email && <Error>{errores.email}</Error> }

          <Campo>
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              placeholder="Tu password"
              name="password"
              value={password}
              onChange={ handleChange }
              onBlur={ handleBlur }
            />
          </Campo>

          { errores.password && <Error>{errores.password}</Error> }
          { error && <Error>{error}</Error> }

          <InputSubmit 
            type="submit"
            value="Crear Cuenta"
          />
        </Formulario>
      </>
    </Layout>
   );
}
 
export default CrearCuenta;
