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


async function ImgExif(src) {
  const image = new Image();
  image.src = src;

  try {
    const data = await loadImage(src, { maxWidth: 600, meta: true });
    const width = data.originalWidth;
    const height = data.originalHeight;
    const photoDay = data.exif.get("306");
    const info = { height, width, photoDay };
    
    return info;
  } catch (err) {
    return null;
  }
}


function handleConvertValidFormatDatetime(input){

  let date = input.slice(0, 10);
  let time = input.slice(11, 19);
  let replaceDate = date.replaceAll(":", "-");

  return new Date(replaceDate + " " + time);
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}


async function acceptedFileItems(newArr) {
  const arr = [];

  for (const element of newArr) {
    let file = element;
    let fileInfo = await ImgExif(file.preview);
    let merInfo = Object.assign(file, fileInfo);
    arr.push(merInfo);
  }

  return arr;
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
  } = useDropzone({
    accept: {
      "image/*": [],
      "image/png": [],
      "video/mp4": [".mp4"],
    },
    noClick: true,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      newArr = newArr.concat(acceptedFiles);
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

  const [items, setitems] = useState([]);
  useEffect(() => {
    acceptedFileItems(newArr).then((merInfo) => {
      return setitems(merInfo);
    });
  }, [newArr]);
  console.log("list items",items);
  
  const getfileRejection = fileRejections.map(({ file, errors }) =>
    errors.map((e) => <h2 key={e.code}>{e.message}</h2>)
  );
  
  useEffect(() => {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://server-upload-medias-testing.azurewebsites.net/api/Medias/file/002fc442-6370-441f-a5a0-b1192fade65b",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }, []);

  function handleUploadFile() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      FileName: items[0]?.path,
      ExifData: `${items[0]?.height} ${items[0]?.width}`,
      MediaDate: formatDate(handleConvertValidFormatDatetime(items[0]?.photoDay)),
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);

    fetch(
      "https://server-upload-medias-testing.azurewebsites.net/api/Medias/Upload",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  return (
    <div className="container">
      <h1>Drag and drop your files here !</h1>
      <button type="button" onClick={handleUploadFile}>
        Upload
      </button>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <aside>
          <form method="post" action="#">
            <ul>
              {items.map((abc, index) => (
                <li key={index}>
                  <div>
                    <div style={thumb} key={abc.name}>
                      <div style={thumbInner}>
                        <img src={abc.preview} style={img} />
                      </div>
                    </div>
                    <div className="info">
                      <span>Name: {abc.path}</span>
                      <span>Size: {abc.size} bytes</span>
                      <span>Type: {abc.type}</span>
                      <span>
                        H/W: {abc.height} x {abc.width}
                      </span>
                      <span>Take day: {abc.photoDay}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </form>
          <ul>{getfileRejection}</ul>
        </aside>
      </div>
    </div>
  );
}

export default Dropzone;
