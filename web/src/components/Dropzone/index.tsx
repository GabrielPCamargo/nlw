import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './styles.css'
import { FiUpload } from 'react-icons/fi'

interface Props{
  onFileUploaded: (file: File) => void  //Criando uma função que vem de create point
}

const Dropzone: React.FC<Props> = ({onFileUploaded}) => {
  const[selectedFileUrl, setSelectedFileUrl] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(file)

    setSelectedFileUrl(fileUrl)
    onFileUploaded(file)
  }, [onFileUploaded])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
    accept: 'image/*'
})

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*"/>

      {selectedFileUrl ? <img src={selectedFileUrl} alt="thumbnail estabelecimento"/> : (
          <p><FiUpload/>
              Imagem do estabelecimento
          </p>
        )
      }
      
    </div>
  )
}

export default Dropzone