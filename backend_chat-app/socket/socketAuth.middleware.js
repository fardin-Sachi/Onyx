import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import User from '../models/user.model.js'


export const socketAuthMiddleware = async (socket, next) => {
    try {
        const cookies = socket.handshake.headers.cookie
        if(!cookies) return next(new Error('No cookies found'))

        const parsed = cookie.parse(cookies)
        const token = parsed.jwt
        if(!token) return next(new Error('No error provided'))
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId)
        if(!user) return next(new Error('No user found'))

        socket.userId = user._id.toString()
        socket.user = user

        next()


    } catch (error) {
        console.error('Socket Auth Error: ', error)
        next(new Error('Authentication failed'))
    }
}