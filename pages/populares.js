import React from 'react';
import Layout from '../components/layout/Layout';

import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Populares = () => {

  const { productos } = useProductos('votos');

  return ( 
    <Layout>
      <div className="listado-productos">
        <div className="contenedor">
          <div className="bg-white">
            {
              productos.map( producto => (
                <ul>
                    <DetallesProducto 
                      key={producto.id}
                      producto={producto}
                    />
                </ul>
              ) )
            }
          </div>
        </div>
      </div>
    </Layout>
   );
}
 
export default Populares;
