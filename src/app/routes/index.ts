import authRoutes from '../modules/Auth/auth.routes'
import {Router} from 'express'

const router = Router()

const routes = [
    {path:"/auth", module:authRoutes}
]

routes.map(route => router.use(route.path, route.module))

export default router