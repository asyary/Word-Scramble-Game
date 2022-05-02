const axios = require('axios');
const readline = require('readline');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function prompt(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function start(val, str, mixStr) {
    if (val == 2) {
        let ans = await prompt("WRONG!\n2 LIVES\n")
        if (ans.toLowerCase() == str) {
            console.log("CORRECT!")
        } else {
            start(1, str, mixStr)
        }
    } else if (val == 1) {
        let ans = await prompt("WRONG!\n1 LIVES\n")
        if (ans.toLowerCase() == str) {
            console.log("CORRECT!")
        } else {
            start(0, str, mixStr)
        }
    } else if (val == 0) {
        console.log("WRONG!\nThe answer is:\n" + str)
    } else if (val == "start") {
        let ans = await prompt(mixStr + "\n3 LIVES\n")
        if (ans.toLowerCase() == str) {
            console.log("CORRECT!")
        } else {
            start(2, str, mixStr)
        }
    }
}

async function init(lang) {
    if (lang == "eng") {
        await axios.get("https://random-word-api.herokuapp.com/word").then(res => {
            let mixRes = res.data[0].split('').sort(function(){return 0.5-Math.random()}).join('')
            if (mixRes == res.data[0]) {
                init(lang)
                return
            }
            start("start", res.data[0], mixRes)
        })
    } else {
        await axios.get("https://random-word-api.herokuapp.com/word").then(async function(res1) {
            first = res1.data[0]
            await axios.get(`https://amm-api-translate.herokuapp.com/translate?engine=google&text=${res1.data[0]}&to=id`).then(res => {
                let translate = res.data.data.result.split(" ")[0]
                if (translate == first) {
                    init(lang)
                    return
                }
                let mixRes = translate.split('').sort(function(){return 0.5-Math.random()}).join('')
                if (mixRes == translate) {
                    init(lang)
                    return
                }
                start("start", translate, mixRes)
            })
        })
    }
}

async function lang() {
    let whatLang = await prompt("Select Indo/English!\n")
    if (/indo/gi.test(whatLang)) {
        console.log("Bahasa Indonesia!")
        init("indo")
    } else if (/english|eng/gi.test(whatLang)) {
        console.log("English is selected!")
        init("eng")
    } else {
        console.log("Invalid prompt!")
    }
}

lang()