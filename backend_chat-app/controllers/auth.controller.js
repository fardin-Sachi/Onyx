import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import generateUniqueConnectCode from "../utils/generateUniqueConnectCode.js"
import jwt from "jsonwebtoken"


class AuthController {
    static async register(req, res) {
        try {
            const { fullName, username, email, password } = req.body
            if(!fullName || !username || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' })
            }
            if(password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' })
            }

            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }]
            })
            if(existingUser) {
                return res.status(400).json({ message: 'Email or username already exists with username or email' })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            
            const user = new User({
                username,
                fullName,
                email,
                password: hashedPassword,
                connectCode: await generateUniqueConnectCode()
            })

            await user.save()
            res.status(201).json({ success: true })


        } catch (error) {
            console.error('Registration error:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async login(req, res) {
        try {

            const { email, password } = req.body
            if(!email || !password) {
                return res.status(400).json({ message: 'Both email and password are required' })
            }

            const user = await User.findOne({email})

            if(!user) {
                return res.status(400).json({message: 'Invalid credentials'})
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password)
            if(!isPasswordMatch) {
                return res.status(400).json({message: 'Invalid credentials'})
            }

            const token = jwt.sign(
                { userId: user.id}, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d'}
            )

            res.cookie('jwt', token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })

            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    connectCode: user.connectCode
                }
            })

            
        } catch (error) {
            console.error('Login error:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async me(req, res) {
        try {
            
            const user = await User.findById(req.user.id).select('-password')
            if(!user) {
                return res.status(400).json({ message: 'User not found' })
            }
            
            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    connectCode: user.connectCode
                }
            })


        } catch (error) {
            console.error('Me error:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async logout(req, res) {
        res.cookie("jwt", "", {maxAge: 0})
        res.json({message: "Logged out successfully!" })
    }
}

export default AuthController