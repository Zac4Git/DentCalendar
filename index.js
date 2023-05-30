let responseFromServer = {
    day: undefined,
    // lockDay: ['2023-05-29', '2023-05-31'],
    lockDay: ['2023-06-29', '2023-06-31'],
    time: ['19302000', '19001930'],
}

let appointment = {
    day: undefined,
    time: undefined,
}

const PICK_COLOR = 'rgb(33, 150, 243)';
const UNPICK_COLOR = 'rgb(255, 255, 255)';
const PICK_TEXT_COLOR = 'white';
const UNPICK_TEXT_COLOR = 'black';
const tg = window.Telegram.WebApp;
tg.expand();

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
let endDate = new Date(today.setMonth(today.getMonth() + 1));
today = yyyy + '-' + mm + '-' + dd;

const picker = new Litepicker({
    element: document.getElementById('litepicker'),
    // plugins: ['mobilefriendly'],
    singleMode: true,
    inlineMode: true,
    autoApply: true,
    autoRefresh: true,
    // buttonText: { "apply": "Применить", "cancel": "Отмена" },
    // delimiter: '/',
    // startDate: '2023-05-18',
    //endDate: '2023-06-18',
    format: "DD-MM-YYYY",
    // highlightedDays: ['2023-05-20', '2023-05-23'],
    lockDays: responseFromServer.lockDay,
    lang: "uk-ua",
    //lockDaysInclusivity: ['2023-05-20',],
    minDate: today,
    maxDate: endDate,
    // numberOfColumns: 1,
    setup: (picker) => {
        picker.on('selected', () => {
            appointment.day = `${picker.getDate().getDate()}-${picker.getDate().getMonth() + 1}-${picker.getDate().getFullYear()}`;
            // unpickTime();
            // availableTime();
            timePicker();
        })
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let tdArr = document.querySelectorAll("td");
    tdArr.forEach(e => {
        e.style.border = 'none';
    })
}, true)

const tempArr = [...responseFromServer.time];

function availableTime() {
    let hoursNowPlusOne = new Date().getHours() < 9 ? '0' + new Date().getHours() + 1 + '00' : new Date().getHours() + 1 + '00';
    //Plus one hour by Irina's request
    let dayNow = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;

    const timeSlices = ['09000930', '09301000', '10001030', '10301100', '11001130', '11301200', '12001230', '12301300', '13001330', '13301400', '14001430', '14301500', '15001530', '15301600', '16001630', '16301700', '17001730', '17301800', '18001830', '18301900', '19001930', '19302000'];

    if (dayNow == appointment.day) {
        timeSlices.forEach((e) => {
            if (hoursNowPlusOne >= e.split([], 4).join('')) {
                responseFromServer.time.push(e);
            }
        })
    }
    else {
        responseFromServer.time = [];
        responseFromServer.time = [...tempArr];
    }
}



function unpickTime() {
    let tdArr = document.querySelectorAll("td");
    tdArr.forEach(e => {
        if (!responseFromServer.time.includes(e.dataset.time)) {
            e.style.cursor = 'pointer';
            e.style.color = 'black';
            e.style.border = 'border: 1px solid rgb(255, 255, 255)';
            e.style.backgroundColor = 'white';
        }
        else {
            e.style.border = 'none';
            e.style.cursor = 'auto';
            e.style.backgroundColor = 'white';
            e.style.color = '#9e9e9e';
        }
    })
}

function timePicker() {
    availableTime();
    unpickTime();

    let tdArr = document.querySelectorAll("td"); //could also use getElementByTagname
    let sortingArr = [];

    for (let i = 0; i < tdArr.length; i++) {
        tdArr[i].addEventListener("click", function () {
            if (!responseFromServer.time.includes(tdArr[i].dataset.time)) { //Server time check
                if (sortingArr.includes(this.dataset.time)) {
                    //unpick the item
                    //todo: add condition, if uset trying to unpick time perioud in the middle.
                    if (this.dataset.time == sortingArr[0] || this.dataset.time == sortingArr[sortingArr.length - 1]) {
                        sortingArr.splice(sortingArr.indexOf(this.dataset.time), 1)
                        this.style.background = UNPICK_COLOR;
                        this.style.color = UNPICK_TEXT_COLOR;
                    }
                    else {
                        alert('Вы не можете удалять время в середине диапазона.')
                    }

                }
                else {
                    //pick the item
                    if (sortingArr.length > 0) {

                        if (this.dataset.time.split('', 4).join('') == sortingArr[sortingArr.length - 1].split('').splice(4, 8).join('')
                            || this.dataset.time.split('').splice(4, 8).join('') == sortingArr[0].split('').splice(0, 4).join('')) {

                            sortingArr.push(this.dataset.time)
                            this.style.background = PICK_COLOR;
                            this.style.color = PICK_TEXT_COLOR;
                        }
                        else {
                            alert('Выберите время без разрыва.')
                        }

                    }
                    else {
                        sortingArr.push(this.dataset.time)
                        this.style.background = PICK_COLOR;
                        this.style.color = PICK_TEXT_COLOR;
                    }
                }
            }
            sortingArr.sort((a, b) => { return a - b })
            appointment.time = sortingArr;


            if (appointment.time.length > 1) {
                let first = appointment.time[0].split('', 2).join('') + ':' + appointment.time[0].split('').splice(2, 2).join('');
                let last = appointment.time[appointment.time.length - 1].split('').splice(4, 2).join('') + ':' + appointment.time[appointment.time.length - 1].split('').splice(6, 2).join('');
                let timeForReply = first + '-' + last;
                appointment.time = timeForReply;
            }
            else {
                let first = appointment.time[0].split('', 2).join('') + ':' + appointment.time[0].split('').splice(2, 2).join('');
                let last = appointment.time[0].split('').splice(4, 2).join('') + ':' + appointment.time[0].split('').splice(6, 2).join('');
                let timeForReply = first + '-' + last;
                appointment.time = timeForReply;
            }
        }, true);
    }
}

function record() {
    let btn = document.getElementById('submit');
    btn.addEventListener("click", function () {
        if (appointment.day == undefined) {
            alert('Вы не выбрали дату!')
        }
        else if (appointment.time == undefined) {
            alert('Вы не выбрали время!')
            console.log(appointment.time);
        }
        else {
            alert(`Спасибо за запись! \nДень: ${appointment.day} \nВремя: ${appointment.time}`)
            tg.sendData(JSON.stringify(appointment))
            tg.close()
        }
    }, true)
}

record()
