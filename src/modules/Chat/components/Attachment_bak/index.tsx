import { Button } from '@alifd/next';
import React, { useEffect, forwardRef } from 'react';

import s from './index.module.scss'
import { input_accept } from './file';

const ImageToBase64 = forwardRef(({data, width, setData}: {data: string, width?: string ,setData:(val: string)=>void}) => {
  // const [originalImage, setOriginalImage] = useState('');
  // const [base64Image, setBase64Image] = useState('https://img.alicdn.com/imgextra/i4/O1CN01LDtIOS1GtUIG0HJ5J_!!6000000000680-2-tps-600-600.png');
  // const [base64Image, setBase64Image] = useState('');
  const base64Image = data
  const setBase64Image = setData

  const onRemoveImg = () => {
    setBase64Image('');
  }

  // useImperativeHandle(ref, () => ({
  //   getBase64Image: () => {
  //     return base64Image;
  //   },
  //   setBase64Image: (value) => {
  //     setBase64Image(value);
  //   },
  // }));

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log('file :', file); //type: "image/svg+xml"
    if (file) {
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file) => {
    // uploadFile(file, dirname)
    const reader = new FileReader();

    // 展示原始图片
    // setOriginalImage(URL.createObjectURL(file));

    reader.onloadend = () => {
      // 将Base64字符串设置到状态中
      setBase64Image(reader.result as any);
    };

    reader.readAsDataURL(file); // 读取文件为Base64字符串
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          convertToBase64(file);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const sizeStyle = { 
    width: width || '800px'
  }

  return (
    base64Image ? <div className={s.list} style={sizeStyle}>
      <div className={s.item}>
        {/* <img 
            src={base64Image} 
            alt="Base64" 
          /> */}
        <div className={s.uploadImg} style={{backgroundImage: `url(${base64Image})`}}></div>
        <div className={s.close} onClick={onRemoveImg}>
          X
        </div>
      </div>
    </div> : 
    <label htmlFor="img" className={s.con} style={sizeStyle}>
      <div style={{fontSize: '18px', color: '#666', marginRight: '16px'}}>粘贴图片 / BASE64 粘贴 </div>
      <div className={s.upload}>
        <span className={s.uploadText}>选择文件</span>
        <input id="img" type="file"  onChange={handleImageChange} accept={input_accept} />
      </div>
    </label>
  );

});
 

export default ImageToBase64;
