

const socket = io();
let user = ""
let chatbox = document.querySelector("#chatbox")


Swal.fire({
    title: 'Identificate',
    input:"text",
    text: "ingresa tu nombre para identificarte en el chat",
    inputValidator: (value)=>{
        return !value && 'necesitas ingresar un nombre para continuar'
    },
    allowOutsideClick :false
    
})
.then(result => user = result.value)

chatbox.addEventListener('keyup', (ev)=>{
    if(ev.key === 'Enter'){
        if(chatbox.value.trim().length>0){
            socket.emit('message',{user: user,message: chatbox.value})
            chatbox.value=""
        }
    }
})

socket.on("messageLog", data=>{

    let log = document.getElementById("messageLog")


 let messages = ""
 data.forEach(message => {
    messages += `<li>${message.user} - dice: ${message.message} </li>`
 })
 log.innerHTML = messages
})