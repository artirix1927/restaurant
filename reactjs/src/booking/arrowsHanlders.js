
let timeInput = null;
let dateInput = null;





export function handleArrowClick(e, dateFp, timeFp){
    dateInput = dateFp.current.flatpickr;
    timeInput = timeFp.current.flatpickr;

    let button = e.currentTarget;
    let classes = button.className.split(" ");
    let date = classes.includes("date");
    let time = classes.includes("time");

    if (date)
        handleDateArrowClick(button);
    else if (time)
        handleTimeArrowClick(button);
    else
        handleGuestsArrowClick(button);
}

//date arrows handling
function increaseDate(value){
    let date = new Date(Date.parse(value));
    date.setDate(date.getDate()+1);
    return date;
}

function decreaseDate(value){
    let date = new Date(Date.parse(value));
    date.setDate(date.getDate()-1);
    return date;
}

function handleDateArrowClick(button){
    let date = null;
    let input = document.getElementById("booking-date-field");
    
    if (button.getAttribute('class').includes("right")){
        date = increaseDate(input.value);
        input.value = date;
    }else{
        date = decreaseDate(input.value);
        input.value = date;
        }
    dateInput.setDate(date,false,"D,d M");
}


//guests arrows handling
function handleGuestsArrowClick(button){
    let input = document.getElementById("booking-guests-field");
     if (button.getAttribute('class').includes("right")){
        input.value = parseInt(input.value) + 1;
     }else{
        input.value = parseInt(input.value) - 1;
     }
}

//time arrows handling
function getCurrentInputHrs(input){
    return parseInt(input.value.split(":")[0]);
    }

function getCurrentInputMins(input){
    return parseInt(input.value.split(":")[1]);
    }

function handleTimeArrowClick(button){
    let date = new Date();
    let input = document.getElementById("booking-time-field");
    let inputHours = getCurrentInputHrs(input);
    let inputMins = getCurrentInputMins(input);

    if (button.getAttribute('class').includes("right")){
        date.setHours(inputHours, inputMins+30);
    }else{
        date.setHours(inputHours, inputMins-30);
    }
    timeInput.setDate(date, false, "H:i");
}