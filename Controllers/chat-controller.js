const User = require('../Models/user-model')
const Chat = require('../Models/chat-model')    
//ADD CODE TO STORE ONLY 1000 messages in localstorage
const getAllChats = async (req, res, next) => {
    try{


        const lastMessageId = req.query.lastmessageid
        const groupId = req.query.groupid

        console.log(lastMessageId, groupId)

        const dbResponse = await Chat.findAll({
            where: {groupGroupId: groupId},
            include: [{     
                model : User,
                attributes : ['name'],
                required : true
            }],
          order : ['id']
        })

        res.status(200).json({chatsOfTheGroup: dbResponse})






        //OLD CODE
            /* const lastMessageId = req.query.lastmessageid
            // console.log('Last message id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', lastMessageId)
            let chatsWithUsersName
            if(lastMessageId === '0'){
                // console.log('All chats sending>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                chatsWithUsersName = await Chat.findAll({
                    attributes: ['id','chat'],    
                    include: [{     
                        model : User,
                        attributes : ['name'],
                        required : true
                    }],
                  order : ['id']
                })
                
                return res.status(200).json(chatsWithUsersName)
                
                
            } else{
                //Replace below line with countAll
                let allChats = await Chat.findAll()
                let lastMessageIdInDB = allChats[allChats.length - 1].id
                lastMessageIdInDB = lastMessageIdInDB.toString()
                // console.log('lastMessageIdInDB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', lastMessageIdInDB)
                if(lastMessageIdInDB === lastMessageId){
                    return res.status(200).json({update: false})
                } else{
                    // console.log('Updates chats sending>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                    chatsWithUsersName = await Chat.findAll({
                        offset: parseInt(lastMessageId),  
                        attributes: ['id','chat'],    
                        include: [{     
                            model : User,
                            attributes : ['name'],
                            required : true
                        }],
                      order : ['id']
                    })
                    console.log('sending chatsWithUsersName>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', chatsWithUsersName)
                    return res.status(200).json({update: true, newChats: chatsWithUsersName})
                }  
            } */

            /* To access name: chatsWithUsersName[i].User.name */

    } catch(err){
        console.log('Error in getAllChats function>>>>>>>>>>>>>>>>>>>>>>', err)
        res.status(500).json({message: 'Internal server error 500', err: err})
    }
}
const messageReceived = async (req, res, next) => {
    try{
        console.log(req.body.message)
        const message = req.body.message
        const groupId = 0
        const data = await Chat.create({chat: message, GroupId: groupId, UserId: req.user.id})
        res.status(200).json({message: 'successfully saved'})
    } catch(err){
        console.log('error in messageReceived', err)
        res.status(500).json({message: 'Internal server error 500'})
    }
    
}

exports.uploadFile = async(req,res)=>{
    try{
        const fileName =new Date() + req.file.originalname
        const mimeType = req.file.mimetype
        const fileData = req.file.buffer
        console.log('line 61')
        const data = await uploadToS3(fileData , fileName)
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId)
        const user = await group.getUsers({ where: { id: req.user.id } })
        const member = user[0].member

        const message = await member.createMessage({message : data.Location , type : mimeType , groupId})
        return res.json(message)
    }catch(e){
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })

    }
}
module.exports = {
    messageReceived,
    getAllChats
}