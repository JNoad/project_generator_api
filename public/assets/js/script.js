const form = document.querySelector('form');
const formSteps = form.querySelectorAll('div');
const nextBtns = form.querySelectorAll('button.next-btn');
const backBtns = form.querySelectorAll('button.back-btn');

let currentStep = 0;

function showCurrentStep() {
    formSteps.forEach(step => {
        if (!step.classList.value.includes('hidden')) {
            step.classList.toggle('hidden');
        }
    })
    formSteps[currentStep].classList.remove('hidden');
}


nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep < formSteps.length - 1) {
            currentStep++;
            showCurrentStep();
        }
    })
})
backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showCurrentStep();
        }
    })
})