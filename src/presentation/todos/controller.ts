import { Request, Response } from "express";
import { prisma } from "../../data/postgres";

export class TodosController {

  //* Dependency Injection
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {

    const todos = await prisma.todo.findMany();
    res.json(todos);
  }

  public getTodoById = async (req: Request, res: Response) => {
    
    const id = +req.params.id;
    if( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' })

    const todo = await prisma.todo.findUnique({
      where: { id: id }
    });

    if(!todo) res.status(404).json({ error: `Todo with id ${id} not found`}) 

    res.json(todo)
  }

  public createTodo = async (req: Request, res: Response) => {
    const { text } = req.body;
    if( !text ) return res.status(400).json({ error: 'Text property is required' });

    const todo = await prisma.todo.create({
      data: { text: text }
    });

    res.json(todo);
  }

  public updateTodo = async (req: Request, res: Response) => {
    
    const id = +req.params.id;
    if( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });
    
    const todo = await prisma.todo.findUnique({
      where: { id: id }
    });
    if( !todo ) return res.status(404).json({ error: `Todo with id ${id} not found` });

    const { text, completedAt } = req.body;
    // if( !text ) return res.status(400).json({ error: 'Text property is required' });

    const updatedTodo = await prisma.todo.update({
      where: { id: id },
      data: { 
        text, 
        completedAt: (completedAt) ? new Date(completedAt) : null
      }
    });

    res.json(updatedTodo)
  }

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' })
    
    const todo = await prisma.todo.findUnique({
      where: { id: id }
    });
    if( !todo ) return res.status(404).json({ error: `Todo with id ${id} not found` });

    const deleted = await prisma.todo.delete({ where: { id: id } });

    (deleted)
      ? res.json(deleted)
      : res.status(400).json({ error: `Todo with ${id} not found`})
  }
}