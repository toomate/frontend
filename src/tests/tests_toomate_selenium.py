from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import traceback
import time

# Configuração do Web Driver:

servico = Service(ChromeDriverManager().install()) 
# as outras opções de navegador podem ser configuradas aqui
# Firefox: GeckoDriverManager()
# Edge: EdgeChromiumDriverManager()
# Opera: OperaDriverManager()

opcoes_adicionais = ChromeOptions()

# Adicionar o argumento para rodar em modo Headless (sem abrir a janela do navegador)
# opcoes_adicionais.add_argument('--headless=new')

driver = webdriver.Chrome(service=servico, options=opcoes_adicionais)

# Configuração da janela do navegador
# driver.set_window_size(1300, 4000) # largura x altura

url_base = "http://localhost:5173/"

# Configuração da espera explícita de 3 segundos
espera = WebDriverWait(driver, 3)

try:
    # Navegar até a URL de login
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


    if login_sucesso:
        print("\n✅ Login realizado com sucesso!\n\n")
        time.sleep(2)  # Pausa para visualização após login

        # ===================== TESTE: ACESSO AO ESTOQUE E CLIQUE NO + =====================
        try:
            print("Iniciando teste de navegação...\n")

            # Clicar no botão Estoque da dashboard (deve ser um botão visível na tela principal)
            botao_estoque = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Estoque')]")))
            botao_estoque.click()
            time.sleep(1)

            print("✅ Teste botão estoque realizado com sucesso!\n\n")
            print("Iniciando teste do botão +...\n")

            # Clicar no botão + (plus) na tela principal de estoque
            botao_plus = espera.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'plus-icon') or contains(@class, 'plus-icon-container')]/*[name()='svg']")))
            botao_plus.click()
            time.sleep(1)

            print("✅ Teste finalizado após clicar no botão + do estoque!\n\n")

        except Exception as e:
            print(f"Ocorreu um erro no teste de navegação até o botão + do estoque: {e}")
            traceback.print_exc()

        # ========== NOVO TESTE: Cadastro de lote com dados específicos ==========
        try:
            time.sleep(1)
            print("Iniciando teste de cadastro de lote...")
            # Espera por mensagem de sucesso

        except Exception as e:
            print(f"Ocorreu um erro no teste de cadastro de lote (leite integral): {e}")
            traceback.print_exc()
    else:
        print("\n\n ❌ Login não realizado. Verifique as credenciais de teste.")

    print("\n Testes finalizados! \n")
    # time.sleep(2)  # Pausa para você ver o resultado (opcional)

except Exception as e:
    print(f"Ocorreu um erro: {e}")

    if isinstance(e, TimeoutException): # Se for um TimeoutException, imprime a pilha de chamadas. Sem isso não temos detalhes do erro.
        traceback.print_exc()

    # Captura de tela e salva em um arquivo png. O tamanho da imagem será o tamanho da janela do navegador configurada no inicio do script
    driver.save_screenshot("./telas_erros/teste_pesquisa_pets.png")
    
    # time.sleep(2)  # Pausa para você ver o resultado (opcional)

finally:
    # Fechar o navegador (Importante p/ não deixar processos zumbis no SO!)
    driver.quit()