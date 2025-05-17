const months = [
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let currentDate = new Date(),
  month = months[currentDate.getMonth()]
  let day= currentDate.getDate();
  let year= currentDate.getFullYear();
  let hour= currentDate.getHours()
  let minute= currentDate.getUTCMinutes();
// console.log(`${day} ${month} ${year} ${hour}:${minute}`)
const addMonth= ["january", "February",]

const picks = pickRandom(emojis, (dimensions * dimensions) / 2)
let array= ['🥔', '🍒']
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}
console.log("test");