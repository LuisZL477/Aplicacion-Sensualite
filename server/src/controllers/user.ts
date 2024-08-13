import {Request, Response} from 'express';
import  bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';

export const newUser = async (req:Request, res:Response) => {

    const { nombre, password, apellido, edad, correo, domicilio , telefono} = req.body;

     // Validamos si el usuario existe en la base de datos
     const user =  await User.findOne({where: {correo : correo}})
    
     if(user) {
        return res.status(400).json({
             msg: `El correo ${correo} ya ha sido registrado`
         })
     }
   
    const hashedpassword = await bcrypt.hash(password, 10)
   

    try {
        //Guardamos usuario en la base de datos
        await User.create({
            nombre: nombre,
            apellido: apellido,
            edad: edad,
            correo: correo,
            password: hashedpassword,
            domicilio: domicilio,
            telefono:telefono
          
        })
    
        res.json({
            msg: `Usuario ${nombre} creado exitosamente`,
            
        })    
        
    } catch (error) {
        res.status(400).json({
            msg: 'Ocurrio un error',
            error
        })
    }

}

export const loginUser =  async (req:Request, res:Response) => {

    const { correo, password } = req.body;

    // Validamos si el usuario existe en ña base de datos
    const user : any =  await User.findOne({where: {correo : correo}})

    if(!user) {
        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${correo} en la base de datos`
        })
    }

    // Validamos password 
    const passwordValid = await bcrypt.compare(password,user.password)
    if(!passwordValid){
        return res.status(400).json({
            msg: `Password incorrecta`
        })
    }

    // Generamos token
    const token = jwt.sign({
        id: user.id,
        correo: correo
    }, process.env.SECRET_KEY || 'pepito123');

    res.json(token);
}