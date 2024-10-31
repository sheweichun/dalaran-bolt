import React from 'react';
import ReactDOM from 'react-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';


let previewEl: HTMLElement | undefined


export function Preview(value: {
    name: string,
    value: string
}[]){
    if(!previewEl){
        previewEl = document.createElement('div')
    }
    ReactDOM.render(<PhotoProvider onVisibleChange={(visible) => {
        if(!visible){
            previewEl && document.body.removeChild(previewEl)
            previewEl = undefined
        }
    }}>
        {
           value.map((photo) => {
               return <PhotoView src={photo.value} key={photo.name}>
                        <img src={photo.value} alt={photo.name} />
                   </PhotoView>
           }) 
        }
       
   </PhotoProvider>, previewEl)
    document.body.appendChild(previewEl)
}
