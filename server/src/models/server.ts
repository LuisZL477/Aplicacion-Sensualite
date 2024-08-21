import express, {Application} from 'express';
import cors from 'cors'
import routesProduct from '../routes/product';
import routesUser from '../routes/user';
import routesCart from '../routes/cart';
import routesCategory from '../routes/category';
import routesPaypal from '../routes/paypal'
import db from '../db/connection';
import { Product } from './product';
import  User  from './user';


 class Server{

    private app: Application;
    private port: string;

    constructor(){
       this.app=express();
       this.port = process.env.PORT || '3001';
       this.listen();
       this.middlewares();
       this.routes();
       this.dbConnect();
       
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('Aplicación corriendo en el puerto '+ this.port);
        })
        
    }

    routes(){
        this.app.use('/api/products', routesProduct);
        this.app.use('/api/users', routesUser);
        this.app.use('/api/carts', routesCart);
        this.app.use('/api/categories', routesCategory);
        this.app.use('/api/paypal', routesPaypal);

        
    }

    middlewares(){
        // Parseo body
        this.app.use(express.json());
        //cors
        this.app.use(cors());
    }

    async dbConnect() {
        try{
            await Product.sync()
            await User.sync()
         
        }catch (error){
            console.error('Conectado a la base de datos: ', error)
        }
    }
}


export default Server;