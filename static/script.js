/* ==========================================
        BAYMAX AI MEDICAL ASSISTANT v3.0
========================================== */

"use strict";

alert("NEW SCRIPT LOADED");

/* ==========================================
        DOM ELEMENTS
========================================== */

const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const loader = document.getElementById("loader");

/* ==========================================
        APP STATE
========================================== */

let isTyping = false;
let messageCount = 0;

/* ==========================================
        TIME
========================================== */

function getCurrentTime(){

    const now = new Date();

    return now.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

/* ==========================================
        SAFE HTML
========================================== */

function escapeHTML(text){

    return text

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/\n/g,"<br>");

}

/* ==========================================
        AUTO SCROLL
========================================== */

function scrollBottom(){

    messages.scrollTo({

        top:messages.scrollHeight,

        behavior:"smooth"

    });

}

/* ==========================================
        CREATE MESSAGE
========================================== */

function createMessage(sender, text) {

    const wrapper = document.createElement("div");

    wrapper.className = `message ${sender}`;

    if (sender === "bot") {

        wrapper.innerHTML = `
            <div class="avatar">🤖</div>

            <div class="bubble">

                <div class="name">
                    Baymax
                    <span class="time">${getCurrentTime()}</span>
                </div>

                <div class="text"></div>

            </div>
        `;

    } else {

        wrapper.innerHTML = `
            <div class="bubble userBubble">

                <div class="name">
                    You
                    <span class="time">${getCurrentTime()}</span>
                </div>

                <div class="text"></div>

            </div>
        `;
    }

    wrapper.querySelector(".text").textContent = text;

    messages.appendChild(wrapper);

    messageCount++;

    scrollBottom();
}

/* ==========================================
        USER MESSAGE
========================================== */

function addUserMessage(message){

    createMessage(

        "user",

        message

    );

}

/* ==========================================
        BOT MESSAGE
========================================== */

function addBotMessage(message){

    createMessage(

        "bot",

        message

    );

}

/* ==========================================
        TYPING INDICATOR
========================================== */

function showTyping(){

    if(isTyping){

        return;

    }

    isTyping = true;

    const typing = document.createElement("div");

    typing.id = "typing";

    typing.className = "message bot";

    typing.innerHTML = `

<div class="avatar">

🤖

</div>

<div class="bubble">

<div class="name">

Baymax

</div>

<div class="typing">

<span></span>

<span></span>

<span></span>

</div>

</div>

`;

    messages.appendChild(typing);

    scrollBottom();

}

/* ==========================================
        REMOVE TYPING
========================================== */

function hideTyping(){

    isTyping = false;

    const typing = document.getElementById("typing");

    if(typing){

        typing.remove();

    }

}

/* ==========================================
        BUTTON STATE
========================================== */

function enableSend(){

    sendButton.disabled = false;

    sendButton.style.opacity = "1";

}

function disableSend(){

    sendButton.disabled = true;

    sendButton.style.opacity = ".6";

}

/* ==========================================
        INPUT EVENTS
========================================== */

input.addEventListener("input",()=>{

    if(input.value.trim()===""){

        disableSend();

    }

    else{

        enableSend();

    }

});

input.addEventListener("keydown",(event)=>{

    if(

        event.key==="Enter"

        &&

        !event.shiftKey

    ){

        event.preventDefault();

        sendMessage();

    }

});

/* ==========================================
        PAGE LOAD
========================================== */

window.addEventListener("load",()=>{

    disableSend();

    input.focus();

    if(loader){

        setTimeout(()=>{

            loader.style.display="none";

        },2000);

    }

    console.log("🤖 Baymax Initialized");

});

/* ==========================================
        SEND MESSAGE
========================================== */

async function sendMessage(){

    if(isTyping){

        return;

    }

    const message=input.value.trim();

    if(message===""){

        input.focus();

        return;

    }

    addUserMessage(message);

    input.value="";

    disableSend();

    showTyping();

    try{

        const response=await fetch("/chat",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message:message

            })

        });

        hideTyping();

        if(!response.ok){

            throw new Error(

                `${response.status} ${response.statusText}`

            );

        }

        const data = await response.json();

console.log("SERVER DATA:", data);
console.log("RESPONSE:", data.response);
console.log("TYPE:", typeof data.response);

addBotMessage(String(data.response));

    }

    catch(error){

        hideTyping();

        addBotMessage(

`⚠️ Unable to connect.

Please check:

• FastAPI Server

• Internet Connection

• OpenRouter API

Error:

${error.message}`

        );

    }

    finally{

        enableSend();

        input.focus();

    }

}

/* ==========================================
        QUICK ACTION BUTTONS
========================================== */

const quickButtons=document.querySelectorAll(

".quick-actions button"

);

quickButtons.forEach(button=>{

    button.addEventListener(

        "click",

        ()=>{

            input.value=button.innerText;

            enableSend();

            sendMessage();

        }

    );

});

/* ==========================================
        FLOATING BUTTON
========================================== */

const floatingButton=document.querySelector(

".floating-chat"

);

if(floatingButton){

    floatingButton.addEventListener(

        "click",

        ()=>{

            input.focus();

            scrollBottom();

        }

    );

}

/* ==========================================
        VOICE BUTTON
========================================== */

const voiceButton = document.querySelectorAll(".icon-btn")[1];

if (voiceButton) {

    voiceButton.addEventListener("click", () => {

        addBotMessage(

`🎤 Voice Assistant

Coming Soon...

Future Features

• Voice Conversation

• Speech Recognition

• AI Voice Reply

• Hands-Free Medical Assistant`

        );

    });

}

/* ==========================================
        FILE UPLOAD BUTTON
========================================== */

const fileButton = document.querySelectorAll(".icon-btn")[0];

if (fileButton) {

    fileButton.addEventListener("click", () => {

        addBotMessage(

`📄 Medical Report Upload

Coming Soon...

Supported Files

• PDF

• JPG

• PNG

• Blood Reports

• X-Ray

• MRI

• CT Scan`

        );

    });

}

/* ==========================================
        CLEAR CHAT
========================================== */

function clearChat(){

    messages.innerHTML = "";

    addBotMessage(

`Hello 👋

I'm Baymax.

How may I assist you today?`

    );

}

/* ==========================================
        SERVER STATUS
========================================== */

async function checkServer(){

    try{

        const response = await fetch("/health");

        if(response.ok){

            console.log("✅ Server Connected");

        }

        else{

            console.warn("⚠️ Health Check Failed");

        }

    }

    catch(error){

        console.error("❌ Server Offline");

    }

}

checkServer();

/* ==========================================
        PAGE ANIMATION
========================================== */

window.addEventListener("load",()=>{

    const cards=document.querySelectorAll(

        ".welcome-card,.chat-container,.dashboard-card"

    );

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(25px)";

        setTimeout(()=>{

            card.style.transition="all .6s ease";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*120);

    });

});

/* ==========================================
        APP INFORMATION
========================================== */

const Baymax = {

    name: "Baymax",

    version: "3.0",

    developer: "Prashanth",

    status: "Online",

    initialized: true

};

console.table(Baymax);

/* ==========================================
        MESSAGE STATISTICS
========================================== */

function getMessageCount(){

    return messageCount;

}

function printStats(){

    console.log(

        "💬 Messages :", getMessageCount()

    );

}

/* ==========================================
        WINDOW EVENTS
========================================== */

window.addEventListener("focus",()=>{

    console.log("🟢 Baymax Active");

});

window.addEventListener("blur",()=>{

    console.log("🟡 Baymax Running in Background");

});

/* ==========================================
        PERIODIC STATUS
========================================== */

setInterval(()=>{

    console.log(

        `💙 Baymax Running | Messages: ${messageCount}`

    );

},60000);

/* ==========================================
        STARTUP BANNER
========================================== */

console.clear();

console.log(`

██████╗  █████╗ ██╗   ██╗███╗   ███╗ █████╗ ██╗  ██╗
██╔══██╗██╔══██╗╚██╗ ██╔╝████╗ ████║██╔══██╗╚██╗██╔╝
██████╔╝███████║ ╚████╔╝ ██╔████╔██║███████║ ╚███╔╝
██╔══██╗██╔══██║  ╚██╔╝  ██║╚██╔╝██║██╔══██║ ██╔██╗
██████╔╝██║  ██║   ██║   ██║ ╚═╝ ██║██║  ██║██╔╝ ██╗
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝

`);

console.log("🤖 Baymax AI Medical Assistant v3.0");
console.log("🩺 AI Engine Started");
console.log("🚀 Frontend Connected");
console.log("💙 Developed by Prashanth");

/* ==========================================
        FUTURE FEATURES
========================================== */

/*

Upcoming Features

✓ Voice Conversation

✓ Voice Response

✓ Report Upload

✓ OCR

✓ Camera Scan

✓ X-Ray Analysis

✓ Prescription Reader

✓ Health Dashboard

✓ Chat History

✓ Emergency Detection

✓ Dark Mode

✓ Multi Language

✓ IoT Sensor Integration

✓ Wearable Device Support

✓ Medicine Reminder

✓ Health Analytics

*/

/* ==========================================
        INITIALIZATION
========================================== */

window.addEventListener("load",()=>{

    console.log("✅ Baymax Ready");

    input.focus();

});

/* ==========================================
        PAGE NAVIGATION
========================================== */

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    const currentPage = document.getElementById(pageName + "-page");

    if (currentPage) {
        currentPage.style.display = "block";
    }

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");

        if (btn.dataset.page === pageName) {
            btn.classList.add("active");
        }
    });

    if (pageName === "consultation") {
        const input = document.getElementById("userInput");
        if (input) input.focus();
    }
}

/* ==========================================
        SIDEBAR BUTTONS
========================================== */

document.querySelectorAll(".nav-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        showPage(btn.dataset.page);

    });

});

/* ==========================================
        DEFAULT PAGE
========================================== */

window.addEventListener("load", () => {

    showPage("home");

});

/* ==========================================
        END OF FILE
========================================== */