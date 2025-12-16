import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import MessageController from '../controllers/message.controller.js'

const router = express.Router()

router.get('/:conversationId/messages', authMiddleware, MessageController.getMessages)

export default router