import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Menu } from 'lucide-react'

export default function Fiado({ irPara }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts/1')
        setData(res.data)
      } catch (err) {
        setError(err.message || 'Erro na requisição')
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [])

  return (
    <div>
      <header className="header">
        <div className="lado-esquerdo">
          <button className="hamburger-btn">
            <Menu size={28} color="#b88b09"/>
          </button>

          <div className="logo-circulo"></div>

          <div className="restaurante">
            <div className="restaurante-name">Toomate Bistrô</div>
            <div className="restaurante-subnome">Kaio</div>
          </div>
        </div>

        <button onClick={() => irPara && irPara("login")} className="btn">Sair</button>
      </header>

      <main style={{ padding: 16 }}>
        <h1>Fiados</h1>

        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        {data && (
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
        )}
      </main>
    </div>
  )
}
