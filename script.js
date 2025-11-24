import { GoogleGenAI } from "@google/genai";


// CONFIGURAÇÃO
let spotsLeft = parseInt(localStorage.getItem("spotsLeft")) || 3;
// Inicializa Ícones
lucide.createIcons();

// ELEMENTOS DO DOM
const els = {
    navBtn: document.getElementById('nav-btn-subscribe'),
    heroBtn: document.getElementById('main-register-btn'),
    modal: document.getElementById('registration-modal'),
    modalBackdrop: document.getElementById('modal-backdrop'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    form: document.getElementById('registration-form'),
    stepForm: document.getElementById('step-form'),
    stepPayment: document.getElementById('step-payment'),
    btnConfirmPayment: document.getElementById('btn-confirm-payment'),
    btnBackStep: document.getElementById('btn-back-step'),
    btnGenerateAi: document.getElementById('btn-generate-ai'),
    inputTeamName: document.getElementById('input-team-name'),
    spotsDisplay: document.getElementById('spots-display'),
    soldOutBadge: document.getElementById('sold-out-badge'),
    toast: document.getElementById('success-toast')
};

// --- FUNÇÕES ---

function openModal() {
    if (spotsLeft > 0) {
        els.modal.classList.remove('hidden');
    }
}

function closeModal() {
    els.modal.classList.add('hidden');
    // Pequeno delay para resetar o form visualmente
    setTimeout(goToForm, 300);
}

function goToPayment(event) {
    event.preventDefault();
    els.stepForm.classList.add('hidden');
    els.stepPayment.classList.remove('hidden');
    els.stepPayment.classList.add('fade-in');
}

function goToForm() {
    els.stepPayment.classList.add('hidden');
    els.stepForm.classList.remove('hidden');
    els.stepForm.classList.add('fade-in');
}

function finalizeRegistration() {
    // Enviar mensagem para o WhatsApp
    sendWhatsappMessage();

    if (spotsLeft > 0) spotsLeft--;
    localStorage.setItem("spotsLeft", spotsLeft); 
    updateSpotsDisplay();
    closeModal();
    showToast();
    els.form.reset();
}


function updateSpotsDisplay() {
    els.spotsDisplay.innerText = spotsLeft;
    
    if (spotsLeft === 0) {
        els.spotsDisplay.classList.add('text-red-500');
        els.navBtn.classList.add('hidden');
        els.heroBtn.classList.add('hidden');
        els.soldOutBadge.classList.remove('hidden');
    }
}

function showToast() {
    els.toast.classList.remove('hidden');
    els.toast.classList.add('animate-bounce');
    
    setTimeout(() => {
        els.toast.classList.add('hidden');
        els.toast.classList.remove('animate-bounce');
    }, 5000);
}

function generateName() {
    const originalIcon = `<i data-lucide="sparkles" width="20"></i>`;

    // Lista de 20 nomes criativos
    const names = [
    "Os Reis da Areia",
    "Vento Norte",
    "Areia Selvagem",
    "Dupla Tempestade",
    "Maré Alta",
    "Tsunami da Praia",
    "Saque Mortal",
    "Os Surfistas do Saque",
    "Areia Quente",
    "Pisa na Areia",
    "Vôlei é Pouco",
    "Os Estourados do Sol",
    "Tempestade de Areia",
    "Dupla do Arranque",
    "Bravas da Praia",
    "Sol & Pancada",
    "Os Camisa de Sol",
    "Areia Nervosa",
    "Os Areieiros",
    "Paredão da Praia",
    "Dupla Raio Solar",
    "Golpe de Areia",
    "Areia Furiosa",
    "Lobos da Praia",
    "Os Sem Sol",
    "Saque de Fogo",
    "Vento & Vôlei",
    "Areia Flamejante",
    "Dupla Relâmpago",
    "Tempestade Tropical",
    "Pé na Areia",
    "Torcida da Maré",
    "Os Engolidores de Sol",
    "Fúria da Praia",
    "Os Encouraçados",
    "Saque de Ouro",
    "Os Navegantes",
    "Dupla Horizonte",
    "Tubarões da Areia",
    "Arrebentação",
    "Areia de Titânio",
    "Saque Espacial",
    "Dupla Eclipse",
    "Sol na Testa",
    "Os Furacões da Praia",
    "Areia Iluminada",
    "Dupla do Vento Forte",
    "Os Estrondosos",
    "As Lendas da Areia",
    "Dupla do Sol Nascente",
    "Saque Trem Bala",
    "Os Guardiões da Areia",
    "Areia de Fogo",
    "Os Saltadores do Sol",
    "Dupla Horizonte Azul",
    "Impacto de Areia",
    "Os Sons do Mar",
    "Pancada Litorânea",
    "Areia Inquebrável",
    "Os Ventos Implacáveis",
    "Sombra na Areia",
    "Dupla do Mar Bravo",
    "Sol & Tempestade",
    "Dupla Cósmica",
    "Areia Mística",
    "Os Incendiários",
    "Saque Final",
    "Lanterna da Praia",
    "Os Monarcas do Sol"
];

    // Carregando o spinner
    els.btnGenerateAi.disabled = true;
    els.btnGenerateAi.innerHTML = `<div class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>`;

    setTimeout(() => {
        // Escolhe um nome aleatório
        const randomName = names[Math.floor(Math.random() * names.length)];

        els.inputTeamName.value = randomName;

        els.btnGenerateAi.disabled = false;
        els.btnGenerateAi.innerHTML = originalIcon;
        lucide.createIcons({ root: els.btnGenerateAi });
    }, 600); // Delay só para simular "geração"
}


// --- ENVIAR PARA WHATSAPP QUANDO CONFIRMAR PAGAMENTO ---
function sendWhatsappMessage() {
    const teamName = document.getElementById('input-team-name').value;
    const playerInputs = els.form.querySelectorAll("input[type='text']");
    const player1 = playerInputs[1].value;
    const player2 = playerInputs[2].value;
    const phoneInput = els.form.querySelector("input[type='tel']").value;

    const destino = "558781348995"; // número fixo

    const mensagem = `
 *Nova Inscrição Confirmada!*

 *Dupla:* ${teamName}

 Jogador 1: ${player1}
 Jogador 2: ${player2}

 WhatsApp do responsável: ${phoneInput}

 Pagamento confirmado pelo usuário no site.
    `.trim();

    const url = `https://wa.me/${destino}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}

// --- EVENT LISTENERS ---

// Abrir Modal
if(els.navBtn) els.navBtn.addEventListener('click', openModal);
if(els.heroBtn) els.heroBtn.addEventListener('click', openModal);

// Fechar Modal
if(els.modalCloseBtn) els.modalCloseBtn.addEventListener('click', closeModal);
if(els.modalBackdrop) els.modalBackdrop.addEventListener('click', closeModal);

// Fluxo do Formulário
if(els.form) els.form.addEventListener('submit', goToPayment);
if(els.btnConfirmPayment) els.btnConfirmPayment.addEventListener('click', finalizeRegistration);
if(els.btnBackStep) els.btnBackStep.addEventListener('click', goToForm);

// AI
if(els.btnGenerateAi) els.btnGenerateAi.addEventListener('click', generateName);

// Inicialização
updateSpotsDisplay();
