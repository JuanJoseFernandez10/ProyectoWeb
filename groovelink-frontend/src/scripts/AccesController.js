let divLogin = document.getElementById('divLogin');
let divRegister = document.getElementById('idRegister');
let anclaRegister = document.getElementById('anclaRegister');
let anclaLogin = document.getElementById('anclaLogin');

divRegister.classList.add('hidden');

anclaRegister.addEventListener('click', () => {
    divLogin.classList.add('hidden');
    divRegister.classList.remove('hidden');
});

anclaLogin.addEventListener('click', () => {
    divRegister.classList.add('hidden');
    divLogin.classList.remove('hidden');
}); 



