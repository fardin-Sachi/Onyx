import express from 'express'
import ConversationController from '../controllers/conversation.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()


router.get('/check-connect-code', authMiddleware, ConversationController.checkConnectCode)

router.get('/', authMiddleware, ConversationController.getConversations)

export default router