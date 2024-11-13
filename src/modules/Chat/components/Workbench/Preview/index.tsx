import React, { useCallback, useState } from 'react'

import s from './index.module.scss'

export interface PreviewProps{
    url?: string
    className?: string
}

export default function({url, className}: PreviewProps){

    const [iframeKey, setIframeKey] = useState(0)

    const refresh = ()=>{
        if(!url) return
        setIframeKey(iframeKey + 1)
    }

    return <div className={`${s.con} ${className || ''}`}>
        <div className={s.toolbar}>
            <div className={s.opr} onClick={refresh}>
                <i className='icon icon-refresh'></i>
            </div>
        </div>
        <iframe key={(url || '') + iframeKey} allow="geolocation; ch-ua-full-version-list; cross-origin-isolated; screen-wake-lock; publickey-credentials-get; shared-storage-select-url; ch-ua-arch; bluetooth; ch-prefers-reduced-transparency; usb; ch-save-data; publickey-credentials-create; shared-storage; ch-ua-form-factors; ch-downlink; otp-credentials; payment; ch-ua; ch-ua-model; ch-ect; autoplay; camera; accelerometer; ch-ua-platform-version; private-aggregation; ch-viewport-height; local-fonts; ch-ua-platform; midi; ch-ua-full-version; xr-spatial-tracking; clipboard-read; gamepad; display-capture; ch-width; ch-prefers-reduced-motion; encrypted-media; gyroscope; serial; ch-rtt; ch-ua-mobile; window-management; unload; ch-dpr; ch-prefers-color-scheme; ch-ua-wow64; fullscreen; identity-credentials-get; hid; ch-ua-bitness; storage-access; sync-xhr; ch-device-memory; ch-viewport-width; picture-in-picture; magnetometer; clipboard-write; microphone" className={s.iframe} src={url}></iframe>
    </div>
}