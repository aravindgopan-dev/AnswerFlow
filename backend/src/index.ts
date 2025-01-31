import express from "express"
import dotenv from "dotenv"


import faq from "./router/faq-router"

dotenv.config()


const port= process.env.PORT || 5000
const  app=express()


app.use("/api/v1/faq",faq)


app.listen(port,()=>{
    console.log(`on port :${port}`)
})