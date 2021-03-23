import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import useProductos from '../hooks/useProductos';
import DetallesProducto from '../components/layout/DetallesProducto';

import Error404 from '../components/layout/404';

const Buscar = () => {

    const [ resultado, guardarResultado ] = useState([]);

    const { productos } = useProductos('creado');

    const router = useRouter();
    const { query: { q } } = router;
    
    useEffect( () => {
        if(q){
            const busqueda = q.toLocaleLowerCase();
            const filtro = productos.filter( producto => {
                return producto.nombre.toLocaleLowerCase().includes(busqueda) || producto.descripcion.toLocaleLowerCase().includes(busqueda) 
            } )
            guardarResultado(filtro);
        }
    }, [q, productos] );

    return ( 
        <Layout>
            { !q
                ? ( <Error404 /> )
                :
                (
                    <div className="listado-productos">
                        <div className="contenedor">
                        <ul className="bg-white">
                            {
                            resultado.map( producto => (
                                
                                    <DetallesProducto 
                                    key={producto.id}
                                    producto={producto}
                                    />
                            ) )
                            }
                        </ul>
                        </div>
                    </div>
                )
            }
        </Layout>
     );
}
 
export default Buscar;