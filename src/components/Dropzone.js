import React, {useMemo, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';


const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};
  
const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

// const thumbsContainer = {
//   display: 'flex',
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   marginTop: 16
// };

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

    const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
    ));
  
    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
        <div>
            {thumbs}
            <div className='info'>
                <span>Name: {file.path}</span>
                <span>Size: {file.size} bytes</span>
                <span>Type: {file.type}</span>
            </div>
        </div>
    </li>
    ));
    console.log(acceptedFiles);

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (errors.map(e => (
            <h2 key={e.code}>{e.message}</h2>
        ))
    ));
  console.log(fileRejections);



  return (
    <div className="container">
        <div {...getRootProps({style})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside >
            <h4>Accepted files</h4>
            <ul>{acceptedFileItems}</ul>
            <ul>{fileRejectionItems}</ul>
            {/* {thumbs} */}
        </aside>
    </div>
  );
}

export default Dropzone