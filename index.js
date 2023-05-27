let responseFromServer = {
    day: undefined,
    lockDay: ['2023-05-29', '2023-05-31'],
    time: ['10001030', '11301200', '12301300', '13301400', '14001430', '15001530', '16001630'],
}

let appointment = {
    day: undefined,
    time: [],
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
    format: "YYYY-MM-DD",
    // highlightedDays: ['2023-05-20', '2023-05-23'],
    lockDays: responseFromServer.lockDay,
    lang: "uk-ua",
    //lockDaysInclusivity: ['2023-05-20',],
    minDate: today,
    maxDate: endDate,
    // numberOfColumns: 1,
    setup: (picker) => {
        picker.on('selected', () => {
            appointment.day = picker.getDate().dateInstance;
        })
    }
});


document.addEventListener("DOMContentLoaded", function () { //check free time from a server 
    let tdArr = document.querySelectorAll("td");
    tdArr.forEach(e => {
        if (responseFromServer.time.includes(e.dataset.time)) {
            e.style.cursor = 'auto';
            e.style.color = '#9e9e9e';
            e.style.border = 'none';
        }
    })
}, true);

function timePicker() {
    let tdArr = document.querySelectorAll("td"); //could also use getElementByTagname
    let sortingArr = [];
    for (let i = 0; i < tdArr.length; i++) {
        tdArr[i].addEventListener("click", function () {
            if (!responseFromServer.time.includes(tdArr[i].dataset.time)) { //Server time check
                if (sortingArr.includes(this.dataset.time)) {
                    //unpick the item
                    sortingArr.splice(sortingArr.indexOf(this.dataset.time), 1)
                    this.style.background = UNPICK_COLOR;
                    this.style.color = UNPICK_TEXT_COLOR;
                }
                else {
                    //pick the item
                    sortingArr.push(this.dataset.time)
                    this.style.background = PICK_COLOR;
                    this.style.color = PICK_TEXT_COLOR;
                }
            }
            sortingArr.sort((a, b) => { return a - b })
        }, true);
    }
    appointment.time = sortingArr;
}

function record() {
    let btn = document.getElementById('submit');
    btn.addEventListener("click", function () {
        console.log(appointment);
        console.log(tg.initData);
        alert(`Record added! #2 \n ${appointment.day} \n ${appointment.time}`)
        // console.log(new Date().getDate() + ' + ' + (new Date().getMonth() + 1) + ' + ' + new Date().getFullYear());
        // console.log(document.querySelectorAll("td")[0].dataset.time > document.querySelectorAll("td")[1].dataset.time);
        tg.sendData({ "name": "John", "age": 30, "city": "New York" })
        tg.close()
    }, false)

}

timePicker()
record()
