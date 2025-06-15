import multer from "multer";




const uploader =  multer()

const uploadAvatar =  uploader.single('avatar')

export const fileUploader = {
    uploadAvatar
}