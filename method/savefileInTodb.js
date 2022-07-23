const fs        = require("fs")
const path      = require("path")
const FilesInDB = require('../models/model_FIlesInDB')
const UserModel = require('../models/models_User')
const {getUserName}     = require("../method/msgMethods");



// this is used to download the file from the link
const download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
        request(url).pipe(fs.createWriteStream(path)).on('close', callback);
    });
};


async function saveFileInToDB(bot, msg, appdir)  {

    let chatId = msg.chat.id.toString()

    const fileId = msg.photo[msg.photo.length-1].file_id;
    let new_name = null
    const mediaFolder = path.join(appdir, '/media');

    await bot.downloadFile(fileId,mediaFolder).then(async (respons) => {
        // console.log(respons)
        // path.format(respons)
        // console.log(path.parse(respons))
        // console.log(path.format({ ...path.parse(respons), name: `${fileId}`, }))
        new_name = path.format({ ...path.parse(respons), base: '', name: fileId })
        // console.log(new_name)
        await fs.renameSync(respons, new_name)
    })
    if (new_name != null) {
        const imageData = await fs.readFileSync(new_name);
        // console.log(imageData)
        const [user, created] = await UserModel.findOrCreate({where: {chatId}})
        // user.userName = getUserName(msg)
        // await user.save()
        const storedFile = await FilesInDB.create({
            chatId: chatId,
            file: imageData,
            user_id: user.id,
        }).then(image => {
            try{
                fs.writeFileSync(new_name+".qqq", image.file);
            }catch(e){
                console.log(e);
            }
        })
        // storedFile.user_id = user.id
        // await storedFile.save()
    }
    return await bot.sendMessage(chatId, `Файл завантажено !!!`)

    // //disable code
    // if (msg.photo && msg.photo[msg.photo.length-1]) {
    //     const fileId = msg.photo[msg.photo.length-1].file_id;
    //     bot.getFileLink(fileId).then(async (respons) => {
    //         //respons - thi is URL
    //         // console.log(respons)
    //
    //         // download the file (in this case it's an image)
    //         await download(respons, path.join(__dirname+"\\media", `${fileId}.jpg`), () =>
    //             console.log('Done!'))
    //     })
    //     return await bot.sendMessage(chatId, `Файл завантажено !`)
    // }
}

module.exports = {saveFileInToDB};