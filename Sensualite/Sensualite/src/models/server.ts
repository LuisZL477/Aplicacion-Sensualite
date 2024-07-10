import express, {Application} from 'express';
import cors from 'cors';
import routesProducts from '../routes/product';
import routesUser from '../routes/user';
import {Product} from './product';
import {User} from './user';


class Server {
    private app: Application;
    private port: string;

    constructor(){
       this.app = express();
       //Asignamos el puerto y si no lo encuentra le decimos que use el 3001
       this.port = process.env.PORT || '3001';
       //Escucha el puerto que se esta usando
       this.listen();
       //muestra los datos que se ingresaron
       this.midlewares();
       this.dbConnect();
       //rutea
       this.routes();
       
    }
    listen(){
        this.app.listen(this.port, ()=>{
           console.log('Aplicación Corriendo en el puerto '+ this.port); 
        })
    }

    routes(){
        this.app.use('/api/products', routesProducts)
        this.app.use('/api/users', routesUser)
    }

    midlewares(){
        //Parseo body
        this.app.use(express.json());
        //cors
        this.app.use(cors());
    }
    async dbConnect(){
        try {
            await Product.sync();
            await User.sync();

        } catch (error) {
            console.log('Unable to connect to the database: ', error);
        }
    }
}

export default Server;