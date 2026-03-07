import camera from "../../images/camera.png";
import "./Leitor.css";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import BarcodeScanner from "./LeitorScanner";

export default function Leitor() {
  const [barcode, setBarcode] = useState("");
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [mostrarInput, setMostrarInput] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <button className="voltar" onClick={() => navigate(-1)}>Voltar</button><br></br>
      <div className="container-leitor">
        {!mostrarCamera && <img src={camera} alt="Leitor de Boletos" className="leitor-image" onClick={() => setMostrarCamera(true)} />}
        <div>
          {mostrarCamera && <button onClick={() => setMostrarCamera(false)}>Toque aqui para desativar a camera</button>}
          {mostrarCamera && (
            <div className="scanner-container">
              <BarcodeScanner onResult={(code) => {
                setBarcode(code);
                setMostrarCamera(false); // opcional: fecha a câmera após leitura
              }} />
            </div>
          )}
          {barcode && <p>Código Lido: {barcode}</p>}
          <p>Toque no ícone para ativar a câmera</p>
          ou
          <p>Toque no botão abaixo para digitar o código</p>
          <button className="input-button" onClick={() => setMostrarInput(true)}>Digitar Código</button>
          {mostrarInput && <input type="text" placeholder="Digite o código aqui" value={barcode} onChange={(e) => setBarcode(e.target.value)} />}<button>Ler código</button>
        </div>

      </div>

    </div>
  );
}