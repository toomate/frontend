import React, { useEffect, useState } from 'react'
import config from '../../config'
import axios from 'axios'

export default function QrModal({ open, onClose }) {
  const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    var url = config.VITE_WAHA_API_URL
    setLoading(true)
      axios.get(`${url}/api/default/auth/qr`, {
      headers: { 'X-Api-Key': config.VITE_WAHA_API_KEY, accept: 'image/png' },
      responseType: 'arraybuffer'
    }).then(res => {
      const blob = new Blob([res.data], { type: 'image/png' })
      setSrc(URL.createObjectURL(blob),)
    }).catch(err => {
      setError(err.message)
    }).finally(() => {
      setLoading(false)
    })

    return () => {
    if (src) {
      URL.revokeObjectURL(src)
      setSrc(null)
    }
    setSrc(null)
  }
  }, [open])

  if (!open) return null

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'#fff',padding:16,borderRadius:8,maxWidth:360,position:'relative'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <strong>QR Code</strong>
          <button
            onClick={onClose}
            aria-label="Fechar"
            title="Fechar"
            style={{
              border: 0,
              background: 'transparent',
              fontSize: 22,
              color: '#000',
              cursor: 'pointer',
              padding: 6,
              lineHeight: 1,
              width: 32,
            }}
          >
            ×
          </button>
        </div>
        <div style={{marginTop:12, minHeight:180, display:'flex',alignItems:'center',justifyContent:'center'}}>
          {loading && <span>Carregando...</span>}
          {error && <span style={{color:'red'}}>Erro: {error}</span>}
          {!loading && !error && src && <img src={src} alt="QR" style={{maxWidth:'100%'}} />}
        </div>
      </div>
    </div>
  )
}
