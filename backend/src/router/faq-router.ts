import { Router ,Request,Response} from "express";
import { getTask } from "../controller/faq-controller"
const router=Router()



router.get("/",getTask)

export default router