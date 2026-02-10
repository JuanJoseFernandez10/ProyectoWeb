const parrafoLog = document.getElementById("parrafoLog")
const parrafoReg = document.getElementById("parrafoReg")
const divLog = document.getElementById("divLog")
const divReg = document.getElementById("divReg")
const anclaRegister = document.getElementById('anclaRegister');
const anclaLogin = document.getElementById('anclaLogin');

parrafoLog.setAttribute("class", "block");
parrafoReg.setAttribute("class", "hidden")
divLog.setAttribute("class", "block")
divReg.setAttribute("class", "hidden")



anclaLogin.addEventListener('click', () => {
    divLog.classList.remove('block')
    divLog.classList.add('hidden');
    divReg.classList.remove('hidden');
    divReg.classList.add('block')
});

anclaRegister.addEventListener('click', () => {
    console.log("ha entrado")
    divLog.classList.remove('hidden')
    divLog.classList.add('block');
    divReg.classList.remove('block');
    divReg.classList.add('hidden')
}); 



