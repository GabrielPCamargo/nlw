import { Request, Response } from 'express'
import Knex from '../database/connection'

class ItemsController {
    async index (request: Request, response: Response){
    
        const items = Knex('items').select('*')
    
        const serializedItems = (await items).map(item => {
            return {
                id: item.id,
                titile: item.title,
                image_url: `http://192.168.100.68:3333/uploads/${item.image}`
            }
        })
        
        return response.json(serializedItems);
    }
}

export default ItemsController