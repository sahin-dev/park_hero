import express, {Router} from 'express'

import authRoutes from '../modules/Auth/auth.routes'
import { bookingRoutes } from '../modules/Booking/booking.route'
import { userRoutes } from '../modules/User/user.routes'

const router = Router()

const routes = [
    {path:"/auth", module:authRoutes},
    {path:"/bookings", module:bookingRoutes},
    {path:"/users", module:userRoutes}
]

routes.map(route => router.use(route.path, route.module))

export default router