import path from "path";
import fs from "fs";

class FsService {
    constructor() {
    }

    async saveOnDisk(bot, fileId) {
        let new_name = null
        fs.mkdir(path.join(process.cwd(), '/media'), (err) => {
            if (err) {
                return console.error(err);
            }
            // console.log('Directory created successfully!');
        })
        const mediaFolder = path.join(process.cwd(), '/media');
        await bot.downloadFile(fileId, mediaFolder)
            .then(async (respons) => {
                // console.log(respons)
                // path.format(respons)
                // console.log(path.parse(respons))
                // console.log(path.format({ ...path.parse(respons), name: `${fileId}`, }))
                new_name = path.format({...path.parse(respons), base: '', name: fileId})
                // console.log(new_name)
                await fs.renameSync(respons, new_name)
            }).catch(err => {
                console.log('--- Error download or rename file\n', err)
            })
        return new_name
    }

    async delFile(fileName) {
        await fs.rm(fileName, {recursive: true}, (err) => {
            if (err) {
                // File deletion failed
                return console.error(err.message)
            }
        })
        // console.log(" File deleted successfully");
        return ''
    }

    async readFileToBuffer(new_name) {
        let imageData = null
        try {
            imageData = await fs.readFileSync(new_name)
        } catch (err) {
            console.log('--- Error Read file from disk\n', err)
        }
        return imageData
    }

    async writeFileFromBuffer(botBuffer, imageData) {
        botBuffer.fullFileName = path.join(process.cwd(), '/media/output.jpeg')
        try {
            return fs.writeFileSync( botBuffer.fullFileName, imageData, 'base64')
        } catch (err) {
            console.log('--- Error Write file to disk\n', err)
        }
        return ""
    }
}

export default FsService