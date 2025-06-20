import { supportedMimes } from "./lib/filesystem.js";
import { v4 as uuidv4 } from "uuid";
import ejs from "ejs";
import { fileURLToPath } from "url";
import * as path from "path";
import moment from "moment";
export const formatError = (error) => {
    let errors = {};
    error.errors?.map((issue) => {
        errors[issue.path?.[0]] = issue.message;
    });
    return errors;
};
export const imageValidator = (size, mime) => {
    if (bytesToMb(size) > 2) {
        return "Image size must be less than 2 MB";
    }
    else if (!supportedMimes.includes(mime)) {
        return "Image must be type of png,jpg,jpeg,svg,webp,gif..";
    }
    return null;
};
export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024);
};
export const generateRandomNum = () => {
    return uuidv4();
};
// export const removeImage = (imageName: string) => {
//   const path = process.cwd() + "/public/images/" + imageName;
//   if (fs.existsSync(path)) {
//     fs.unlinkSync(path);
//   }
// };
export const uploadImage = (image) => {
    const imgExt = image?.name.split(".");
    const imageName = generateRandomNum() + "." + imgExt[1];
    const uploadPath = process.cwd() + "/public/images/" + imageName;
    image.mv(uploadPath, (err) => {
        if (err)
            throw err;
    });
    return imageName;
};
export const renderEmailEjs = async (fileName, payload) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const html = await ejs.renderFile(__dirname + `/views/emails/${fileName}.ejs`, payload);
    return html;
};
export const checkDateHourDifference = (date) => {
    const now = moment();
    const tokenSentAt = moment(date);
    const difference = moment.duration(now.diff(tokenSentAt));
    const hoursDiff = difference.asHours();
    return hoursDiff;
};
