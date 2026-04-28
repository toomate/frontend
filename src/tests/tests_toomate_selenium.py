import os
import sys
import subprocess
import time
import traceback

# Instalar dependências se necessário
required_packages = ["selenium", "webdriver-manager"]
for package in required_packages:
    try:
        __import__(package)
    except ImportError:
        print(f"Instalando {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager


url_base = "http://localhost:5173/"
os.makedirs("./telas_erros", exist_ok=True)


def criar_driver_chrome():
    opcoes = ChromeOptions()
    # opcoes.add_argument("--headless=new")
    return webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=opcoes)


def criar_driver_firefox():
    opcoes = FirefoxOptions()
    # opcoes.add_argument("-headless")
    return webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()), options=opcoes)


def criar_driver_edge():
    opcoes = EdgeOptions()
    # opcoes.add_argument("--headless=new")
    return webdriver.Edge(service=EdgeService(EdgeChromiumDriverManager().install()), options=opcoes)


def executar_testes(driver, nome_navegador):
    espera = WebDriverWait(driver, 3)

    driver.get(url_base)

    # Espera pelo campo de username
    input_username = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Username']")))
    input_senha = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")
    botao_entrar = driver.find_element(By.XPATH, "//button[contains(@class, 'auth-submit')]" )

    # Preencha com um usuário e senha válidos do seu backend
    usuario_teste = "toomate"
    senha_teste = "toomate123"

    input_username.clear()
    input_username.send_keys(usuario_teste)
    input_senha.clear()
    input_senha.send_keys(senha_teste)

    # Verificação (Asserção): O botão "Entrar" está visível e habilitado
    assert botao_entrar.is_displayed(), "O botão 'Entrar' não está visível na página."
    assert botao_entrar.is_enabled(), "O botão 'Entrar' deveria estar habilitado."

    time.sleep(1)  # Pausa para visualização antes de clicar em login
    botao_entrar.click()

    # Espera pelo redirecionamento para o dashboard OU mensagem de erro
    login_sucesso = False
    try:
        espera.until(EC.url_contains("/dashboard"))
        login_sucesso = True
    except TimeoutException:
        # Se não redirecionou, verifica se apareceu mensagem de erro
        try:
            erro = driver.find_element(By.CLASS_NAME, "auth-error")
            assert erro.is_displayed(), "Mensagem de erro de login não está visível."
            print(f"Falha no login. Mensagem exibida: {erro.text}")
        except Exception:
            print("Falha no login, mas nenhuma mensagem de erro foi exibida.")

    if not login_sucesso:
        raise AssertionError(f"Login não realizado no navegador {nome_navegador}.")

    print(f"\n✅ Login realizado com sucesso no {nome_navegador}!\n\n")
    time.sleep(5)  # Pausa para visualização após login

    # ===================== TESTE: ACESSO AO ESTOQUE E CLIQUE NO + =====================
    print("Iniciando teste de navegação...\n")

    # Clicar no botão Estoque da dashboard (deve ser um botão visível na tela principal)
    botao_estoque = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Estoque')]")))
    botao_estoque.click()
    time.sleep(5)

    print("✅ Teste botão estoque realizado com sucesso!\n\n")
    print("Iniciando teste do botão +...\n")

    # Clicar no botão + (plus) na tela principal de estoque
    botao_plus = espera.until(
        EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'plus-icon') or contains(@class, 'plus-icon-container')]/*[name()='svg']"))
    )
    botao_plus.click()
    time.sleep(5)

    print("✅ Teste finalizado após clicar no botão + do estoque!\n\n")

    # ========== NOVO TESTE: Cadastro de lote com dados específicos ==========
    time.sleep(5)
    print("Iniciando teste de cadastro de lote...")
    # Espera por mensagem de sucesso

    print("\n Testes finalizados! \n")


def salvar_screenshot(driver, nome_navegador):
    nome_arquivo = f"./telas_erros/teste_pesquisa_pets_{nome_navegador.lower()}.png"
    try:
        driver.save_screenshot(nome_arquivo)
        print(f"Screenshot salva em {nome_arquivo}")
    except Exception as erro_screenshot:
        print(f"Não foi possível salvar a screenshot no {nome_navegador}: {erro_screenshot}")


navegadores = [
    ("1", "Chrome", criar_driver_chrome),
    ("2", "Firefox", criar_driver_firefox),
    ("3", "Edge", criar_driver_edge),
]

# Menu de seleção de navegador
print("\n" + "="*50)
print("SELEÇÃO DE NAVEGADOR")
print("="*50)
for opcao, nome, _ in navegadores:
    print(f"{opcao} - {nome}")
print("="*50)

while True:
    escolha = input("\nEscolha o navegador (1/2/3): ").strip()
    navegador_selecionado = None
    
    for opcao, nome, criar_driver in navegadores:
        if opcao == escolha:
            navegador_selecionado = (nome, criar_driver)
            break
    
    if navegador_selecionado:
        break
    else:
        print("❌ Opção inválida. Digite 1, 2 ou 3.")

nome_navegador, criar_driver = navegador_selecionado
driver = None

try:
    print(f"\nExecutando os testes no {nome_navegador}...")
    driver = criar_driver()
    executar_testes(driver, nome_navegador)
    print(f"\n✅ Testes concluídos com sucesso no {nome_navegador}!")
except Exception as erro:
    print(f"\n❌ Ocorreu um erro no {nome_navegador}: {erro}")
    traceback.print_exc()

    if driver is not None:
        salvar_screenshot(driver, nome_navegador)
    
    raise erro
finally:
    if driver is not None:
        driver.quit()