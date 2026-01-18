import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

//configuração do cloudinary pegando do env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 //CONFIGURAÇÃO DO STORAGE
 const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'marcenaria-flaco-produtos',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      public_id: (req: any, file: any) => file.originalname.split('.')[0] + '-' + Date.now(),
    }as any,
 });

 const upload = multer({ storage: storage });
 export default upload;