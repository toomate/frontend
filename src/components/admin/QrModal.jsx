import React, {useEffect, useState, useRef} from 'react'

export default function QrModal({open, onClose}){
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastObjectUrl = useRef(null)

  const fetchQr = async () => {
    setLoading(true)
    setError(null)
    try{
      // In development we want to use the Vite proxy (relative path).
      // When not on localhost, fall back to the container host URL.
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const base = isLocalhost ? '' : 'http://toomate_waha:3000'
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("jwt");

      // Prefer explicit WAHA API key from Vite env for dev: VITE_WAHA_API_KEY
      const wahaKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WAHA_API_KEY)
        || (typeof window !== 'undefined' && (window.VITE_WAHA_API_KEY || (window.env && window.env.VITE_WAHA_API_KEY)))
        || null;

      const headers = {};
      if (wahaKey) headers['x-api-key'] = wahaKey;
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${base}/api/default/auth/qr`, {
        method: 'GET',
        headers,
        credentials: 'include'
      })
      if(!res.ok) throw new Error('HTTP ' + res.status)
      const ct = res.headers.get('content-type') || ''
      if(ct.includes('application/json')){
        const j = await res.json()
        if(j.qr) {
          setImage(j.qr)
          return
        }
        throw new Error('Resposta JSON inesperada')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if(lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current)
      lastObjectUrl.current = url
      setImage(url)
    }catch(err){
      // Provide clearer messages for auth/server errors
      const msg = String(err.message || 'Erro ao buscar QR')
      if(msg.includes('HTTP 401')){
        setError('Não autorizado (401). Faça login ou verifique token.')
      } else if(msg.includes('HTTP 500')){
        setError('Erro interno do servidor (500). Verifique logs do backend.')
      } else {
        setError(msg)
      }
      setImage(null)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(open){
      fetchQr()
    }
    return ()=>{
      if(lastObjectUrl.current){
        URL.revokeObjectURL(lastObjectUrl.current)
        lastObjectUrl.current = null
      }
      setImage(null)
      setError(null)
      setLoading(false)
    }
  },[open])

  if(!open) return null

  return (
    <div className="qr-modal-overlay" onMouseDown={onClose}>
      <div className="qr-modal" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="qr-modal-header">
          <h3>QR Code de Autenticação</h3>
          <button className="qr-close" onClick={onClose}>×</button>
        </div>
        <div className="qr-modal-body">
          {loading && <div className="qr-loading">Carregando QR...</div>}
          {error && <div className="qr-error">Erro: {error}</div>}
          {!loading && !error && image && (
            <img src={image} alt="QR Code" className="qr-image" />
          )}
        </div>
        <div className="qr-modal-footer">
          <button onClick={fetchQr} className="qr-btn">Atualizar</button>
          <button onClick={onClose} className="qr-btn qr-btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  )
}
