import React, { useMemo, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import loadImage from "blueimp-load-image";
import "./Dropzone.css";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  border: "none",
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  minHeight: "90vh",
};

const focusedStyle = {
  // borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  // borderColor: '#ff1744'
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

let newArr = [];

const maxLength = 20;

function nameLengthValidator(file) {
  if (file.name.length > maxLength) {
    return {
      code: "name-too-large",
      message: `Name is larger than ${maxLength} characters`,
    };
  }

  return null;
}

async function ImgExif(src) {
  const image = new Image();
  image.src = src;

  try {
    const data = await loadImage(src, { maxWidth: 600, meta: true });
    const width = data.originalWidth;
    const height = data.originalHeight;
    const photoDay = data.exif.get("306");
    const info = { height, width, photoDay };
    // console.log(info);
    // console.log("data",data);
    return info;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

async function acceptedFileItems(newArr) {
  const arr = [];

  for (const element of newArr) {
    let file = element;
    let fileInfo = await ImgExif(file.preview);
    // console.log("exif info:", fileInfo);
    console.log("file info", file);
    let merInfo = {...file,...fileInfo}
    console.log("mer info", merInfo);
    arr.push(merInfo);
  }

  return arr;
  // const imgInfo = ImgExif(src)
  // return newArr.map((file) => (
  //   console.log(file)
  // <li key={file.path}>
  //   <div>
  //     <div style={thumb} key={file.name}>
  //       <div style={thumbInner}>
  //         <img
  //           src={file.preview}
  //           style={img}
  //           onLoad={() => {
  //             URL.revokeObjectURL(file.preview);
  //           }}
  //         />
  //       </div>
  //     </div>
  //     <div className="info">
  //       <span>Name: {file.path}</span>
  //       <span>Size: {file.size} bytes</span>
  //       <span>Type: {file.type}</span>
  //       <span>Date: {file.lastModifiedDate.toLocaleDateString()}</span>
  //     </div>
  //   </div>
  // </li>
  // ));
}

function Dropzone() {
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
    open,
  } = useDropzone({
    accept: {
      "image/*": [],
      "image/png": [],
      "video/mp4": [".mp4"],
    },
    noClick: true,
    // validator: nameLengthValidator,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      newArr = newArr.concat(acceptedFiles);

      console.log(newArr);
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  // const abc = await acceptedFileItems(newArr);

  const [abcs, setAbcs] = useState([]);
  useEffect(() => {
    acceptedFileItems(newArr).then((merInfo) => {
      console.log(merInfo);
      return setAbcs(merInfo);
    });
  }, [newArr]);
  console.log(abcs);
  const fileRejectionItems = fileRejections.map(({ file, errors }) =>
    errors.map((e) => <h2 key={e.code}>{e.message}</h2>)
  );

  return (
    <div className="container">
      <h1>Drag and drop your files here !</h1>
      <button type="button" onClick={open}>
        Upload
      </button>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <aside>
          {/* <ul>{setAbc}</ul> */}
          {abcs.map((abc, index) => (
            <h1 key={index}>{abc.height}</h1>
          ))}
          <ul>{fileRejectionItems}</ul>
        </aside>
      </div>
    </div>
  );
}

export default Dropzone;

{
  /* <ImgExif src={file.preview} /> */
}
{
  /* <span>{imgInfo(file.preview)}</span> */
}
