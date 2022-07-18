import React, {useMemo, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import './Dropzone.css';


const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  border: 'none',
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  minHeight: '90vh',
};
  
const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  // borderColor: '#ff1744'
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function Dropzone() {
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections
    } = useDropzone({accept: {
        'image/*': [], 
        'image/png': [], 
        'video/mp4': ['.mp4']},onDrop: acceptedFiles => {
          setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
          })));
        }
      });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);
  
    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    const acceptedFileItems = acceptedFiles.map(file => (
      <li key={file.path}>
        <div>
          <div style={thumb} key={file.name}>
            <div style={thumbInner}>
              <img
                src={file.preview}
                style={img}
                onLoad={() => { URL.revokeObjectURL(file.preview) }}
              />
            </div>
          </div>
          <div className='info'>
              <span>Name: {file.path}</span>
              <span>Size: {file.size} bytes</span>
              <span>Type: {file.type}</span>
          </div>
        </div>
      </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (errors.map(e => (
            <h2 key={e.code}>{e.message}</h2>
        ))
    ));



  return (
    <div className="container">
      <h1>Drag and drop your files here !</h1>
        <div {...getRootProps({style})}>
          <input {...getInputProps()}/>
          <aside >
            <ul>{acceptedFileItems}</ul>
            <ul>{fileRejectionItems}</ul>
          </aside>
        </div>
    </div>
  );
}

export default Dropzone

