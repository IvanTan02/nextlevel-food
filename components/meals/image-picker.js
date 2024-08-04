'use client';

import { useRef, useState } from 'react';
import styles from './image-picker.module.css';
import Image from 'next/image';

export default function ImagePicker({ label, name }) {

  const [uploadedImage, setUploadedImage] = useState();
  const imageInput = useRef();

  const onUploadImage = () => {
    imageInput.current.click();
  }

  const onImageUploaded = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setUploadedImage(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    }
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.controls}>
        <div className={styles.preview}>
          {!uploadedImage && <p>Please upload an image.</p>}
          {uploadedImage && <Image src={uploadedImage} alt="Uploaded Image" fill />}
        </div>
        <input className={styles.input} type="file" id={name} accept="image/png, image/jpeg" name={name} ref={imageInput} onChange={onImageUploaded} required />
        <button className={styles.button} type="button" onClick={onUploadImage}>
          Upload an Image
        </button>
      </div>
    </div>
  )
}