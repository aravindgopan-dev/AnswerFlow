import { Request,Response } from "express";

const getTask=(req:Request,res:Response)=>{
    res.send('hii')
}


export  {getTask}


