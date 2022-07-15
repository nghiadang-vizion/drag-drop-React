import React, {useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import ExifReader from 'exifreader';


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

function Dropzone() {
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
            'text/html': ['.html', '.htm'],
            'video/mp4': ['.mp4']},  maxFiles:100});

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


        const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            <div>
                <div className='img'>IMG</div>
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
            <em>(3 files are the maximum number of files you can drop here)</em>
          </div>
            <aside>
                <h4>Accepted files</h4>
                <ul>{acceptedFileItems}</ul>
                <ul>{fileRejectionItems}</ul>
            </aside>
        </div>
      );
}

export default Dropzone