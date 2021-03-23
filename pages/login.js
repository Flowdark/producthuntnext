import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';

import { Formulario, Campo, InputSubmit, Error } from '../components/UI/Formulario';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

import firebase from '../firebase';

//Router
import Router from 'next/router';

//State inicial
const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
};

const Login = () => {

  const [ error, guardarError ] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);
  const { email, password } = valores; 

  async function iniciarSesion(){
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error('Hubo un error al iniciar sesión: ', error);
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
        >Iniciar Sesión</h1>
        <Formulario
          onSubmit={ handleSubmit }
          noValidate
        >

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
            value="Iniciar Sesión"
          />
        </Formulario>
      </>
    </Layout>
   );
}
 
export default Login;
