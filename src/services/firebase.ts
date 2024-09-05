import { firebaseStorage as storage } from "../config/firebase";
import { ObjectId } from "mongodb";

export const uploadImageFiles = async (imageFiles: Express.Multer.File[], _id: ObjectId | undefined) => {
  let filesUrl = [];
  let i = 1;
  for (const imageFile of imageFiles) {
    const fileName = `${_id}-${Date.now()}-${i}.${imageFile.mimetype.split("/").pop()}`;
    const storageRef = storage.bucket().file(fileName);

    const metadata = {
      contentType: `${imageFile.mimetype}`,
    };

    await storageRef.save(imageFile.buffer, metadata);
    console.log(`Uploaded ${fileName} to Firebase Storage.`);
    filesUrl.push(`https://storage.googleapis.com/${storage.bucket().name}/${fileName}`);
    i++;
  }
  return filesUrl;
};

export const uploadSingleImage = async (imageFile: Express.Multer.File, _id: ObjectId | undefined) => {
  console.log(imageFile)
  const fileName = `profile_pictures/${_id}-${Date.now()}.${imageFile.mimetype.split("/").pop()}`;
  const storageRef = storage.bucket().file(fileName);
  await storageRef.save(imageFile.buffer);
  console.log(`Uploaded ${fileName} to Firebase Storage.`);
  return `https://storage.googleapis.com/${storage.bucket().name}/${fileName}`;
};
