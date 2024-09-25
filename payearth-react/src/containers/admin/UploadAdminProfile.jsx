import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../store/reducers/auth-reducer';



const UploadAdminProfile = (props) => {
    //cloudinary credential
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const apiKey = process.env.REACT_APP_CLOUD_API_KEY;
    const apiSecret = process.env.REACT_APP_CLOUD_API_SECRET;

    //global variables
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    //states
    const [imageSrc, setImageSrc] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropped, setIsCropped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [croppedBlob, setCroppedBlob] = useState(null);


    //functions
    const resetState = () => {
        setImageSrc('');
        setCroppedImage(null);
        setIsCropped(false);
        setLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (!props.isModalOpen) {
            resetState();
        }
    }, [props.isModalOpen]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImageSrc(reader.result || '');
                setIsCropped(false);
                setCroppedImage(null);
            };
            setLoading(false);
        } else {
            alert('Size must be less than 5 MB');
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCrop = useCallback(() => {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const ctx = canvas.getContext('2d');
            const scale = img.width / img.naturalWidth;

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                img,
                croppedAreaPixels.x * scale,
                croppedAreaPixels.y * scale,
                croppedAreaPixels.width * scale,
                croppedAreaPixels.height * scale,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                const croppedImageUrl = URL.createObjectURL(blob);
                setCroppedImage(croppedImageUrl);
                setCroppedBlob(blob);
                setIsCropped(true);
            }, 'image/jpeg');
        };
    }, [imageSrc, croppedAreaPixels]);

    const deleteImageFromCloudinary = async (imageId) => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = CryptoJS.SHA1(`public_id=${imageId}&timestamp=${timestamp}${apiSecret}`).toString(CryptoJS.enc.Hex);

        try {
            const formData = new FormData();
            formData.append('public_id', imageId);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log("Image deleted successfully");
            }
        } catch (err) {
            console.error('Error in image deletion process:', err);
        }
    };

    const uploadImageOnCloudinary = async (blob) => {
        if (!blob) {
            return toast.error("No image to upload.");
        }

        try {
            const data = new FormData();
            data.append("file", blob);
            data.append("upload_preset", "pay-earth-images");
            data.append("cloud_name", cloudName);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: data,
            });

            const imageData = await response.json();

            if (response.ok) {
                return {
                    imageUrl: imageData.secure_url,
                    imageId: imageData.public_id,
                };
            } else {
                console.error("Error uploading image:", imageData);
                return null;
            }
        } catch (err) {
            console.error("Error in image upload process:", err);
            return null;
        }
    };

    const uploadProfileOnCloudinary = async () => {
        try {
            const originalImageBlob = await fetch(imageSrc).then(res => res.blob());
            const originalImageInfo = await uploadImageOnCloudinary(originalImageBlob);
            if (!originalImageInfo) {
                return toast.error("Failed to upload original image.");
            }

            if (props.original_image_id && props.image_id) {
                await deleteImageFromCloudinary(props.original_image_id);
                await deleteImageFromCloudinary(props.image_id);
            }

            const croppedImageInfo = await uploadImageOnCloudinary(croppedBlob);
            if (!croppedImageInfo) {
                return toast.error("Failed to upload cropped image.");
            }

            const formData = {
                original_image_url: originalImageInfo.imageUrl,
                original_image_id: originalImageInfo.imageId,
                image_url: croppedImageInfo.imageUrl,
                image_id: croppedImageInfo.imageId,
            };

            saveAdminProfile(formData);

        } catch (error) {
            console.error("Error in image upload process:", error);
            toast.error("Error uploading image. Please try again.");
        }
    };

    const saveAdminProfile = async (data) => {
        try {
            const response = await axios.put(
                `admin/save-admin-profile/${authInfo.id}`,
                data,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "Authorization": `Bearer ${authInfo.token}`,
                    },
                }
            );

            if (response.status === 200 && response.data.status) {
                const data = response.data.data;
                const updatedAdminInfo = {
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    image_url: data.image_url,
                };

                const userInfo = {
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    imgUrl: data.image_url,
                };

                dispatch(setUserInfo({ userInfo }));
                localStorage.setItem('userInfo', JSON.stringify(updatedAdminInfo));

                if (props.onProfileUpdate) {
                    props.onProfileUpdate(
                        data.original_image_url,
                        data.original_image_id,
                        data.image_url,
                        data.image_id
                    );
                }

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setImageSrc('');
                setCroppedImage(null);
                setIsCropped(false);
                setLoading(false);
                props.closeModel();
                toast.success("Admin profile updated successfully.");
            }
        } catch (error) {
            console.error("Error saving admin profile:", error);
        }
    };

    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}

            <div className='crop_modal_panel_filter_pb50'>
                {!imageSrc ? (
                    <div>
                        <div className="adv_preview_thumb">
                            <div className="thumbPic">
                                <p className='text-danger'>Size must be less than 5 MB</p>
                            </div>
                        </div>
                        <div className="media field_item">
                            <input
                                className="form-control"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                ) : (
                    !isCropped && (
                        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                            />
                            <div className='crop_modal_panel_filter'>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(e.target.value)}
                                    style={{ display: 'block', marginBottom: '5px' }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={rotation}
                                    onChange={(e) => setRotation(e.target.value)}
                                    style={{ display: 'block', marginBottom: '5px' }}
                                />
                                <div className='cropImageButton'>
                                    <button
                                        className='btn btn-primary'
                                        onClick={handleCrop}
                                        style={{ display: 'block' }}
                                    >
                                        Crop
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                )}

                {/* Cropped image and save button */}
                {croppedImage && (
                    <div style={{ textAlign: 'center' }}>
                        <img src={croppedImage} alt="Cropped" style={{ width: '200px', height: 'auto' }} />
                        <div style={{ marginTop: '10px' }}>
                            <button className='btn btn-success' onClick={uploadProfileOnCloudinary}>
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default UploadAdminProfile;
