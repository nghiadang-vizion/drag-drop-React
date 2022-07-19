import React from "react";
import ImageUploading from "react-images-uploading";
import '@fortawesome/fontawesome-free/css/all.min.css';
import loadImage from "blueimp-load-image";

import "./Exif.css";


const ImgExif = ({ src, ...props }) => {
  const image = new Image();
  image.src = src;
  loadImage(src, { maxWidth: 600, meta: true })
  .then(function (data) {
    console.log('Original image width: ', data.originalWidth);
    console.log('Original image height: ', data.originalHeight);
    // console.log('Exif data: ', data.exif) // requires exif extension
  })
  .catch(function (err) {
    console.log(err)
  })
};



function Exif() {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log('alo');
    setImages(imageList);
  };

  console.log(images);

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={["jpg","png","mp4","svg"]}
      >
        {({
          imageList,
          onImageUpload,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <h1>Drag and drop your files here !</h1>
            <button onClick={onImageUpload}>Upload</button>
            <input
              className="dragDrop"
              style={isDragging ? { opacity: "1" } : null}
              {...dragProps}
            >
            </input>
            {imageList.map((image, index) => (
              <ul key={index} className="image-list">
                <li className="image-item">
                  <img src={image.data_url} alt="" width="100" />
                  <ImgExif src={image.data_url} />
                  <div>
                    <span>Name: {image.file.name}</span>
                    <span>Size: {image.file.size}bytes</span>
                    <span>Type: {image.file.type}</span>
                  </div>
                  <div>
                    <span>Height:</span>
                  </div>
                </li>
              </ul>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

export default Exif;