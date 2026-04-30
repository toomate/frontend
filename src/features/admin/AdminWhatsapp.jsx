import React, {useState} from 'react'
import QrModal from './QrModal'
import './QrModal.css'

export default function AdminWhatsapp(){
  const [open, setOpen] = useState(false)

  return (
    <div style={{padding:20}}>
      <h2>Admin - Whatsapp</h2>
      <p>Use este painel para abrir o modal que exibe o QR code para autenticação.</p>
      <div style={{marginTop:12}}>
        <button onClick={()=>setOpen(true)} style={{padding:'8px 12px'}}>Abrir QR Code</button>
      </div>
      <QrModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
