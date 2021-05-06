import { Request, Response} from 'express'
import Knex from '../database/connection'

class PointsController{

    async index(request: Request, response: Response){
        const {city, uf, items} = request.query
        
        const parsedItems = String(items)
        .split(',').map(item => Number(item.trim()))
        

        const points = await Knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('points.city', String(city))
            .where('points.uf', String(uf))
            .distinct()  //Não repete o mesmo ponto, por mais que colete os dois ou mais itens
            .select('points.*')

            const serializedPoints = await points.map(point => {
                return {
                    ...point,
                    image_url: `http://192.168.100.68:3333/uploads/${point.image}`
                }
            })

        return response.json(serializedPoints)
    }

    async show(request: Request, response: Response) {
        const {id} = request.params   //Usa-se {id} para não ser necessário params.id

        const point = await Knex('points').where('id', id).first() //Única resposta / Não array

        if(!point){
            return response.status(400).json({ message: "point not found!"})
        }

        const items = await Knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title')

        const serializedPoint = {
                ...point,
                image_url: `http://192.168.100.68:3333/uploads/${point.image}`
        }

        return response.json({point: serializedPoint, items})
    }

    async create(request: Request, response: Response) {
            const {
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
                items
            } = request.body;
        
            const trx = await Knex.transaction();

            const point = {
                image: request.file.filename,
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            }
        
            const insertedIds = await trx('points').insert(point)
        
            const point_id = insertedIds[0]
        
            const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map( (item_id: Number) => {
                return {item_id,
                        point_id,
                }
            })
        
            try {
                await trx('point_items').insert(pointItems)
        
                await trx.commit();
            } catch (error) {
                await trx.rollback();
        
                return response.status(400).json({ message: 'Falha na inserção na tabela point_items, verifique se os items informados são válidos' })
            }
        
            return response.json({ 
                id: point_id,
                ... point
            })
        }

}

export default PointsController