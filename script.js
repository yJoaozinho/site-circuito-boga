import { GoogleGenAI } from "@google/genai";

// --- ATENÇÃO: COLOQUE SUA API KEY AQUI ---
const API_KEY = "PLACEHOLDER_API_KEY"; 

// CONFIGURAÇÃO
let spotsLeft = 8;
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

async function generateName() {
    const originalIcon = `<i data-lucide="sparkles" width="20"></i>`;
    
    if (!API_KEY) {
        alert("Para usar a IA, abra o arquivo script.js e adicione sua API KEY na linha 4.");
        els.inputTeamName.value = "Os Reis da Areia";
        return;
    }

    try {
        els.btnGenerateAi.disabled = true;
        els.btnGenerateAi.innerHTML = `<div class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>`;
        
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Crie um nome curto, engraçado e criativo para uma dupla de vôlei de praia em português. Retorne APENAS o nome, sem aspas e sem explicação.",
        });

        els.inputTeamName.value = response.text ? response.text.trim() : "Dupla Imbatível";

    } catch (error) {
        console.error("Erro AI:", error);
        els.inputTeamName.value = "Dupla Imbatível";
    } finally {
        els.btnGenerateAi.disabled = false;
        els.btnGenerateAi.innerHTML = originalIcon;
        lucide.createIcons({ root: els.btnGenerateAi });
    }
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
