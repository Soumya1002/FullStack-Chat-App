const { fn, Sequelize, col, Op } = require('sequelize');
const Message = require('../models/Message')
const User = require('../models/User');
const Group = require('../models/Group');
const Member = require('../models/Member');

module.exports = (io, socket) => {
    const addMessage = async (data, cb) => {
        console.log('add message')
        console.log(data)

        const groupId = data.groupId;

        const message = data.message;
        const group = await Group.findByPk(groupId)

        const user = await group.getUsers({ where: { id: socket.user.id } })
        const member = user[0].member


        const result = await member.createMessage({ message, groupId })
        socket.to(data.groupId).emit('message:recieve-message', data.message, socket.user.name)
        console.log(socket.user)



        await cb()
    }

    socket.on('join-room', async(groupId , cb) => {
       
        const group = await Group.findByPk(groupId)

        const user = await group.getUsers({ where: { id: socket.user.id } })
        const member = user[0].member

        socket.join(groupId)
        const messages = await group.getMessages({
            // where: {
            //     id: {
            //         [Op.gt]: messageId
            //     }
            // }
        });
       
        const users = await group.getUsers({
            // where : {
            //     // id : {
            //     //     [Op.gt] : id
            //     // }
            // },
            attributes: {
                exclude: ['password']
            }
        }
        )
   
        await cb(messages, member.id, users)

    })
    socket.on('message:send-message', addMessage)
}