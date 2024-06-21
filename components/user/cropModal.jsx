'use client'
import Cropper, { Area } from 'react-easy-crop';

function CropModal({ image, crop, setCroppedAreaPixels, onCropChange, onCropComplete, onClose, onCropImage}) {
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
    <div className="w-[40rem] h-[40rem] relative">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <Cropper
          image={image}
          crop={crop}
          zoom={1}
          aspect={4/3}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          cropSize={{ width: 200, height: 200 }}
          cropShape='round'
        />
        <div className='absolute top-5 right-0 m-4 z-10'>
          <button onClick={onClose} className="mr-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
          <button onClick={onCropImage} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Crop</button>
        </div>
      </div>
    </div>
  </div>
  
    );
  }

export default CropModal