import Friendship from "../models/friendship.model.js"
import User from "../models/user.model.js"
import Conversation from "../models/conversation.model.js"
import { getChatRoom } from './helper.js'
import RedisService from '../services/RedisService.js'

export const notifyConversationOnlineStatus = async (io, socket, online) => {
    try {
        const userId = socket.userId
        const user = socket.user

        const friendships = await Friendship.find({
            $or: [
                {requester: userId},
                {recipient: userId}
            ]
        })

        friendships.forEach((friendship) => {
            const isRequester = friendship.requester._id.toString() == userId.toString()
            const friendId = isRequester ? friendship.recipient._id : friendship.requester._id

            console.log('emit:conversation:online-status')
            io.to(friendId.toString())
                .emit('conversation:online-status', {
                    friendId: userId,
                    username: user.username,
                    online
                })
        })

        
    } catch (error) {
        console.error('notifyConversationOnlineStatus', error)
    }
}

export const conversationRequest = async (io, socket, data) => {
    try {
        const userId = socket.userId
        const user = socket.user
        const {connectcode} = data

        const friend = await User.findOne({connectCode})
        if(!friend){
            socket.emit('conversaion:request:error', {error: "Unable to find conversation"})
            return
        }

        if(friend._id.toString() === userId.toString()) {
            socket.emit('conversaion:request:error', {error: "Cannot add yourself as friend"})
            return
        }

        const existingFriendship = await Friendship.findOne({
            $or: [
                {requester: userId, recipient: friend._id},
                {requester: friend._id, recipient: userId}
            ]
        })
        if(existingFriendship) {
            socket.emit('conversaion:request:error', {error: "Friendship already exists"})
            return
        }

        const friendship = await Friendship.create({
            requester: userId,
            recipient: friend._id
        })

        const conversation = await Conversation.create({
            participant: [userId, friend._id.toString()]
        })

        socket.join(getChatRoom(userId, friend._id.toString()))

        const conversationData = {
            conversationId: conversation._id.toString(),
            lastMessage: null,
            unreadCounts: {
                [userId.toString()]: 0,
                [friend._id.toString()]: 0
            }
        }

        io.to(userId.toString().emit('conversation:accept', {
            ...conversationData,
            friend: {
                id: friend.id,
                fullName: friend.fullName,
                username: friend.username,
                connectCode: friend.connectCode,
                online: await RedisService.isUserOnline(friend._id.toString())
            }
        }))

        io.to(friend._id.toString().emit('conversation:accept', {
            ...conversationData,
            friend: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                connectCode: user.connectCode,
                online: await RedisService.isUserOnline(user._id.toString())
            }
        }))
        
    } catch (error) {
        console.error("Error conversation:request",error)
        socket.emit('conversation:request:error',{error: "Error conversation:request"})
    }
}