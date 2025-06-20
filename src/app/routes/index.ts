import express, {Router} from 'express'

import authRoutes from '../modules/Auth/auth.routes'
import { bookingRoutes } from '../modules/Booking/booking.route'
import { userRoutes } from '../modules/User/user.routes'
import { reviewRoutes } from '../modules/Review/review.route'
import { placeRoutes } from '../modules/ParkingPlace/parkingplace.route'

const router = Router()

const routes = [
    {path:"/auth", module:authRoutes},
    {path:"/bookings", module:bookingRoutes},
    {path:"/users", module:userRoutes},
    {path:"/reviews", module:reviewRoutes},
    {path:"/places", module:placeRoutes}
]

routes.map(route => router.use(route.path, route.module))

export default router