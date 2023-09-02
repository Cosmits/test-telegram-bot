import path from "path";
import fs from 'fs/promises';

class FsService {

    async saveOnDisk(bot, fileId) {

        const mediaFolder = path.join(process.cwd(), '/media');
        try {
            await fs.access(mediaFolder);
        } catch (error) {
            await fs.mkdir(mediaFolder);
        }

        try {
            const data = await bot.downloadFile(fileId, mediaFolder)
            const new_name = path.format({ ...path.parse(data), base: '', name: fileId })
            await fs.rename(data, new_name);
            return new_name;
        } catch (error) {
            console.error('--- Error downloadFile file from bot\n', error);
            return null;
        }
    }

    async delFile(fileName) {
        try {
            await fs.rm(fileName, { recursive: true });
        } catch (error) {
            console.error('--- Error deleted file from disk \n', error);
        }
    }

    async readFileToBuffer(new_name) {
        try {
            const imageFile = await fs.readFile(new_name);
            return imageFile;
        } catch (error) {
            console.error('--- Error Read file from disk \n', error)
            return null;
        }
    }

    async writeFileFromBuffer(imageData) {
        try {
            const imageFile = path.join(process.cwd(), '/media/output.jpeg')
            await fs.writeFile(imageFile, imageData, 'base64');
            return imageFile;
        } catch (error) {
            console.error('--- Error Write file to disk \n', error);
            return null;
        }

    }
}

export default FsService