const sharp=require('sharp');
exports.resizeingImage=(foldername,width,hieght)=>{
    return async (req,res,next)=>{
        //if theres not photo skip
        if(!req.file && !req.files) return next();
    
        //specifing the filename
        if(req.file){
            req.file.filename=`${Date.now()}-${req.file.originalname}`.replace(/\s/g,'-');
            req.file.path=`uploads/${foldername}/${req.file.filename}`;
            //resizeing
            await sharp(req.file.buffer)
            .resize(width,hieght)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`uploads/${foldername}/${req.file.filename}`)
            return next();
        }

        if(req.files){
            req.body.image_url={};
            for(let i = 0; i<req.files.length;i++){
                let index=i;
                let el=req.files[i];
                console.log(el);
                const imageName=`${Date.now()}-${index+1}-${el.originalname}`.replace(/\s/g,'-');
                const filePath=`uploads/${foldername}/${imageName}`;
                await sharp(el.buffer)
                .toFormat('jpeg')
                .jpeg({quality:90})
                .toFile(filePath)
                req.body.image_url[`image-${i+1}`]=filePath
            }
            return next();
        }
        if(req.files.product_images){
            req.files.product_images.map(async (el,index)=>{
                const imageName=`${Date.now()}-${index+1}-${el.originalname}`.replace(/\s/g,'-');
                const filePath=`uploads/${foldername}/${imageName}`;
                await sharp(el.buffer)
                .resize(width,hieght)
                .toFormat('jpeg')
                .jpeg({quality:90})
                .toFile(filePath)
                
                })
            next()
        }
    }
}
