import { Area } from 'react-easy-crop';

/**
 * @param imageFile The image file to be cropped.
 * @param cropArea The area to be cropped.
 * @returns Promise that resolves with the cropped image as a base64 string.
 */
const getCroppedImg = async (imageFile, cropArea) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target?.result;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get 2D context for canvas'));
          return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.drawImage(
          image,
          cropArea.x * scaleX,
          cropArea.y * scaleY,
          cropArea.width * scaleX,
          cropArea.height * scaleY,
          0,
          0,
          cropArea.width,
          cropArea.height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to crop image'));
              return;
            }
            
            const base64Reader = new FileReader();
            base64Reader.readAsDataURL(blob);
            base64Reader.onloadend = () => {
              const base64data = base64Reader.result;
              resolve(base64data);
            };
            base64Reader.onerror = (error) => {
              reject(error);
            };
          },
          'image/jpeg',
          1 // quality
        );
      };
      image.onerror = (error) => {
        reject(error);
      };
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export default getCroppedImg;
