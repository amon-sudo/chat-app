import express from "express"
import { signup, login, logout, updateProfile } from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"


const router = express.Router()
//router.use(arcjetProtection)






router.get('/test', (req, res) => {
    res.json({message:"test"})
})

router.post('/signup', signup)




router.post('/login', login)


router.post('/logout', protectRoute, logout)
router.put('/profile-update', updateProfile)
router.get('/check', protectRoute, (req, res) => res.status(200).json(req.user))

export default router