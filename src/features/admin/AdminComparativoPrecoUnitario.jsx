function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ComparativoPrecoUnitarioAdmin({
  titulo,
  subtitulo,
  comparativoPorInsumo,
}) {
  return (
    <article className="admin-card admin-unit-price-card">
      <header className="admin-unit-price-header">
        <h2>{titulo}</h2>
        <p>{subtitulo}</p>
      </header>

      <div className="admin-unit-price-blocos">
        {comparativoPorInsumo.length > 0 ? (
          comparativoPorInsumo.map((bloco) => (
            <section key={bloco.insumo} className="admin-unit-price-bloco">
              <h3>{bloco.insumo}</h3>

              {bloco.ranking.length > 0 ? (
                <ul className="admin-unit-price-lista">
                  {bloco.ranking.map((item, indice) => (
                    <li
                      key={`${bloco.insumo}-${item.marca}-${item.fornecedor}`}
                      className={`admin-unit-price-item ${
                        item.melhorPreco ? "melhor-preco" : ""
                      }`}
                    >
                      <div className="admin-unit-price-marca">
                        <span className="admin-unit-price-posicao">{`${indice + 1}\u00BA`}</span>
                        <div>
                          <div className="admin-unit-price-marca-linha">
                            <strong>{item.marca}</strong>
                            {item.maisBaratoDaMarca ? (
                              <span className="admin-unit-price-badge-marca">
                                Mais barato da marca
                              </span>
                            ) : null}
                          </div>
                          <small>{item.fornecedor}</small>
                        </div>
                      </div>

                      <div className="admin-unit-price-valor">
                        <strong>{formatarMoeda(item.precoUnitario)}</strong>
                        <small>{"\u00DAltimo lote: "}{item.data}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty-list admin-unit-price-vazio">
                  {"Sem marcas para comparar neste per\u00EDodo."}
                </p>
              )}
            </section>
          ))
        ) : (
          <p className="admin-empty-list">Nenhum insumo selecionado para comparar.</p>
        )}
      </div>
    </article>
  );
}
