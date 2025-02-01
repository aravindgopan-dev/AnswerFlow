import { Router ,Request,Response} from "express";
import { getFaq ,addFaq} from "../controller/faq-controller"
const router=Router()




router.get("/",getFaq)
router.post("/",addFaq)

export default router