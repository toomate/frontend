import camera from "../../images/camera.png";
import "./Leitor.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarcodeScanner from "./LeitorScanner";

export default function Leitor() {

  const [barcode, setBarcode] = useState("");
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [mostrarInput, setMostrarInput] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const navigate = useNavigate();

  async function consultar(codigo) {
    try {

      const response = await fetch(
        "https://world.openfoodfacts.net/api/v2/product/" + codigo
      );

      const data = await response.json();

      if (data.status_verbose === "product not found") {
        setErro("CÓDIGO NÃO ENCONTRADO TENTE NOVAMENTE");
        return;
      }

      const produto = {
        nome: data.product.product_name,
        quantidade: data.product.product_quantity,
        unidade: data.product.product_quantity_unit,
        marca: data.product.brands,
        imagem: data.product?.selected_images?.front?.display?.pt
      };

      sessionStorage.setItem("produto", JSON.stringify(produto));

      setErro("");
      setSucesso(true);

      // redireciona após 2 segundos
      setTimeout(() => {
        navigate("/cadastro-insumo");
      }, 2000);

    } catch (e) {
      console.error(e);
      setErro("Erro ao consultar produto");
    }
  }

  function handleCodigo(code) {
    setBarcode(code);
    setMostrarCamera(false);
    consultar(code);
  }

  return (
    <div className="page-leitor">

      {sucesso && (
        <div className="sucesso-topo">
          LEITURA FEITA COM SUCESSO
        </div>
      )}

      {erro && <div className="erro-topo">{erro}</div>}

      <button className="voltar" onClick={() => navigate(-1)}>
        Voltar
      </button>

      <div className="container-leitor">

        {!mostrarCamera && (
          <img
            src={camera}
            alt="Leitor de código"
            className="leitor-image"
            onClick={() => setMostrarCamera(true)}
          />
        )}

        <div>

          {mostrarCamera && (
            <button onClick={() => setMostrarCamera(false)}>
              Desativar câmera
            </button>
          )}

          {mostrarCamera && (
            <div className="scanner-container">
              <BarcodeScanner onResult={handleCodigo} />
            </div>
          )}

          {barcode && <p>Código Lido: {barcode}</p>}

          <p>Toque no ícone para ativar a câmera</p>
          <p>ou</p>
          <p>Digite o código manualmente</p>

          <button
            className="input-button"
            onClick={() => setMostrarInput(true)}
          >
            Digitar Código
          </button>

          {mostrarInput && (
            <>
              <input
                type="text"
                placeholder="Digite o código aqui"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />

              <button onClick={() => consultar(barcode)}>
                Ler código
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}