import cloudinary
import cloudinary.uploader
    
cloudinary.config( 
    cloud_name = "divc1cuwa", 
    api_key = "329959632418894", 
    api_secret = "Y_i-PzouMeCcNm4YSz88RcHZHn8",
    secure=True
)

def upload_image(image_path):
  upload_result = cloudinary.uploader.upload(image_path)
  return upload_result["secure_url"]
