import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { FirebaseContext } from '../../firebase';

import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
//formulario
import { InputSubmit, Campo } from '../../components/UI/Formulario';
import Boton from '../../components/UI/Boton';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

const ContenedorProducto = styled.div`
    @media (min-width: 768px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    //State del componente
    const [ producto, guardarProducto ] = useState({});
    const [ error, guardarError ] = useState(false);
    const [ comentario, guardarComentario ] = useState({});
    const [ consultarDB, guardarConsultarDB ] = useState(true);

    const router = useRouter();
    const { query: { id } } = router;

    //Context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect( () => {
        if(id && guardarConsultarDB){
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();

                if(producto.exists){
                    guardarProducto(producto.data());
                    guardarConsultarDB(false)
                }else{
                    guardarError(true);
                    guardarConsultarDB(false)
                }
            }

            obtenerProducto();
        }
    }, [id] );

    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    //Administrar y validar votos
    const votarProducto = () => {
        if(!usuario){
            return router.push('/');
        }

        //Verificar si el usuario ya ha votado
        if(haVotado.includes(usuario.uid)) return;

        //Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        //Nuevo voto
        const nuevoHanVotado = [ ...haVotado, usuario.uid ];

        //Actualizar db
        firebase.db.collection('productos').doc(id).update({ votos: nuevoTotal, haVotado: nuevoHanVotado });

        //Actualizar state
        guardarProducto({
            ...producto,
            votos: nuevoTotal,
            haVotado: nuevoHanVotado
        })
    }

    //Administrar comentarios
    const handleComentario = (e) => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        });

        guardarConsultarDB(true);
    }

    //Verificar si el comentario es del creador del producto
    const isCreador = (id) => {
        if(creador.id === id){
            return true;
        }
    }

    //Crear comentario
    const submitComentario = (e) => {
        e.preventDefault();

        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //Tomar copia de los comentarios actuales y agregar nuevo
        const nuevosComentarios = [ ...comentarios, comentario ];

        //Actualizar db
        firebase.db.collection('productos').doc(id).update({ comentarios: nuevosComentarios });

        //Actualizar State
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        });

        guardarConsultarDB(true);
    }

    //Eliminar Producto
    const eliminarProducto = async () => {

        if(!usuario){
            return router.push('/login');
        }

        if(creador.id !== usuario.uid){
            return router.push('/');
        }

        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.error('Hubo un error al eleminar el producto: ', error);
        }
    }

    if( Object.keys(producto).length === 0 && !error ) return 'Cargando...';

    return ( 
        <Layout>
            { error
                ?
                    (
                        <>
                            <Error404 />
                        </>
                    )
                :
                        (
                            <>
                                <div className="contenedor">
                                    <h1
                                        css={css`
                                            margin-top: 5rem;
                                            text-align: center;
                                        `}
                                    >{nombre}</h1>
                                    <ContenedorProducto>
                                        <div>
                                            <p>Publicado hace: { formatDistanceToNow( new Date(creado), {locale: es} )} </p>
                                            <p>Publicado por: {creador.usuarioNombre} de {empresa}</p>
                                            <img
                                                css={css`
                                                    max-width: 70%;
                                                `} 
                                                src={urlimagen}
                                            />
                                            <p>{descripcion}</p>
                                            { usuario && (
                                                <>
                                                    <h2>Agrega tu comentario</h2>
                                                    <form
                                                        onSubmit={submitComentario}
                                                    >
                                                    <Campo>
                                                        <input 
                                                            type="text"
                                                            name="mensaje"
                                                            onChange={ handleComentario }
                                                            autoComplete="off"
                                                        />
                                                    </Campo>
                                                    <InputSubmit 
                                                        type="submit"
                                                        value="Agregar Comentario"
                                                    />
                                                    </form>
                                                </>
                                            ) }
                                            <h2
                                                css={css`
                                                    margin: 2rem 0;
                                                `}
                                            >Comentarios</h2>
                                            { comentarios.length === 0
                                                ?
                                                    
                                                    (<p>Aún no hay comentarios</p>)

                                                :

                                                (
                                                    <ul>
                                                        {comentarios.map( (comentario, indice) => (
                                                            <li
                                                                key={`${comentario.usuarioId}-${indice}`}
                                                                css={css`
                                                                    border: 1px solid #e1e1e1;
                                                                    padding: 2rem;
                                                                `}
                                                            >
                                                                <p>{comentario.mensaje}</p>
                                                                <p>Escrito por: <span css={css`font-weight: bold;`}>{comentario.usuarioNombre}</span></p>
                                                                { isCreador( comentario.usuarioId ) && <CreadorProducto>Es Creador</CreadorProducto> }
                                                            </li>
                                                        ) )}
                                                    </ul>
                                                )
                                            }
                                        </div>
                                        <aside>
                                            <Boton
                                                bgColor={true}
                                                w100={true}
                                                target="_blank" 
                                                href={url}
                                            >Visitar URL</Boton>
                                            <p>Votos: {votos}</p>
                                            {usuario && (
                                                <Boton
                                                    w100={true}
                                                    onClick={votarProducto}
                                                >
                                                Votar</Boton>
                                            )}
                                        </aside>
                                    </ContenedorProducto>
                                    { usuario && isCreador(usuario.uid) && <Boton 
                                        w100={true}
                                        onClick={eliminarProducto}
                                    >Eliminar Producto &times;</Boton> }
                                </div>
                            </>
                        )
            }
        </Layout>
     );
}
 
export default Producto;