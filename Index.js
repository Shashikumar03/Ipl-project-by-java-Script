const { match } = require('assert');
const { log } = require('console');

//Fetching the data from csv file to json,
const csv = require('csvtojson');


    csv().fromFile('./matches.csv').then((Matches) => {
        csv().fromFile('./deliveries.csv').then((Deliveries) => {
            matchData = Matches;
            deliveriesData = Deliveries;
            mainMethod(matchData, deliveriesData)

        }).catch((err) => {
            
        });
    
    
}).catch((err) => {
    console.log(err);
});
   
function mainMethod(matchData,deliveriesData) {
    
    findNumberOfMatchesPlayedPerTeam(matchData);
    findNumberOfMatchesWonPerTeamInAllYear(matchData);
    findExtraRunsConcededPerTeamIn2016(matchData, deliveriesData);
    findMostEconomicalBowlerIn2015(matchData, deliveriesData);
    findTheMostSucessfullTeamInIpl(matchData);
    
}
//q1
function findNumberOfMatchesPlayedPerTeam(matchData) {
    let totalMatchPlayedMap = new Map();
    for (let Obj of matchData){
        
        if (totalMatchPlayedMap.has(Obj["season"])){
            let count = totalMatchPlayedMap.get(Obj["season"]);
            totalMatchPlayedMap.set(Obj["season"], count + 1);
        }
        else{
            totalMatchPlayedMap.set(Obj["season"], 1);
        }   
    }
    console.log("Number of Matches played per year");
    for (let [k, v] of totalMatchPlayedMap){
         console.log(k, ":", v);
    }

}
//Q2
function findNumberOfMatchesWonPerTeamInAllYear(Matches) {
    
    let winnerMatchDataMap = new Map();
    for (let match of Matches) {
        if (winnerMatchDataMap.has(match["winner"])) {
            let count = winnerMatchDataMap.get(match["winner"]);
            winnerMatchDataMap.set(match["winner"], count + 1);
        }
        else {
            winnerMatchDataMap.set(match["winner"],1);
        }
    }
    console.log("Number of Matches won per team in All ipl year ");
    for (let [k, v] of winnerMatchDataMap) {
        console.log(k, ":", v);
    }
    
}
//Q3
function findExtraRunsConcededPerTeamIn2016(matchData, deliveriesData) {
    const IdArray = new Array();
    
    for (var match of matchData){
        if (match['season'] == '2016')
        {
            IdArray.push(match['id']);
        }
    }
    let extraRunsMap = new Map();
    for (var delivery of deliveriesData){
        if (IdArray.includes(delivery['match_id']))
        {
            if (extraRunsMap.has(delivery['bowling_team'])){
                let runsGiven = extraRunsMap.get(delivery['bowling_team']);
                extraRunsMap.set(delivery['bowling_team'], Number(runsGiven) + Number(delivery['extra_runs']));
            }
            else {
                extraRunsMap.set(delivery['bowling_team'], delivery['extra_runs']);
            }
        } 
        
    }
    console.log("Extra runs Conceeded per team in 2016")
   console.log(extraRunsMap);
}
//Q3
function findMostEconomicalBowlerIn2015(matchData, deliveriesData) {
    const IdArray = new Array();
    let runsByBowlerMap = new Map();
    let totalBallMap = new Map();
    let economyMap = new Map();
    
    for (var match of matchData){
        if (match['season'] == '2015'){
            IdArray.push(match['id']);
        }
    }
    for (var delivery of deliveriesData) {
        if (IdArray.includes(delivery['match_id'])) {
            let runsByBowler=Number(delivery['total_runs']) - Number(delivery['legbye_runs'])-Number(delivery['bye_runs'])
            if (runsByBowlerMap.has(delivery['bowler'])) {
                let runsGiven = runsByBowlerMap.get(delivery['bowler']);
                runsByBowlerMap.set(delivery['bowler'], runsByBowler + runsGiven);
            }
            else {
                runsByBowlerMap.set(delivery['bowler'], runsByBowler);
            }
            if (delivery['wide_runs'] == '0' && delivery['noball_runs'] == '0') {
                if (totalBallMap.has(delivery['bowler'])) {
                    let ball = totalBallMap.get(delivery['bowler']);
                    totalBallMap.set(delivery['bowler'], ball + 1);
                }
                else {
                    totalBallMap.set(delivery['bowler'],1);
                }
            }
                
        }
    }
    console.log("The Most Economical bowler in 2015");

    for (let [k, v] of totalBallMap) {
        
            let getRuns = runsByBowlerMap.get(k);
            let totalBalls = totalBallMap.get(k);
            economyMap.set(k, ((getRuns * 6) / totalBalls));
        
        
    }
    const sortedEconomy = new Map([...economyMap].sort((a, b) => a[1] - b[1]));
    console.log(sortedEconomy);
}
function findTheMostSucessfullTeamInIpl(matchData) {
    
    let winnerMatchDataMap = new Map();
    let totalMatchOfTeamsMap = new Map();
    for (let match of matchData) {
        if (winnerMatchDataMap.has(match["winner"])) {
            let count = winnerMatchDataMap.get(match["winner"]);
            winnerMatchDataMap.set(match["winner"], count + 1);
        }
        else {
            winnerMatchDataMap.set(match["winner"],1);
        }
    }
    let mostWonTeam;
    let maxWon = 0;
    for (let [k, v] of winnerMatchDataMap) {
        if (v > maxWon){
            maxWon = v;
            mostWonTeam = k;
        }
    }
    
    let totalMatchPlayed = 0;
    
    for (let match of matchData) {
        if (match['team1'] == mostWonTeam || match['team2'] == mostWonTeam){
            totalMatchPlayed = totalMatchPlayed + 1;
            }
    }
   
    console.log("most succesfull team of Ipl is");
    console.log(mostWonTeam," : won  ",maxWon,"from ",totalMatchPlayed," matched played")

 }

