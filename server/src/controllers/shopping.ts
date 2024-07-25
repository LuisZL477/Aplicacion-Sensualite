import {Request, Response} from 'express'
import { Shop } from '../models/shopping'

export const getShopping = async (req: Request,res: Response) =>{
   const listShop = await Shop.findAll();
   res.json(listShop)
}