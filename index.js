const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');

//const nodeHtmlToImage = require('node-html-to-image')
const puppeteer = require('puppeteer');  
const cheerio = require('cheerio')
var fs = require('fs');

const $ = cheerio.load(fs.readFileSync('./gears.html'));

var lastRecordedKill = -1;

function fetchKills(limit = 51, offset = 0) {
    console.log("reading...")
    request({
        uri: 'https://gameinfo.albiononline.com/api/gameinfo/events?limit=' + limit + '&offset=' + offset,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            parseKills(body);
        } else {
            console.log('This is Error: ', error);
        }
    });
}

function parseKills(events) {
    var breaker = lastRecordedKill;

    events.some(function (kill, index) {
        if (index == 0) {
            lastRecordedKill = kill.EventId;
        }
        if (kill.EventId != breaker) {
            if (kill.Killer.GuildName.toLowerCase() == "gostop" || kill.Victim.GuildName.toLowerCase() == "gostop") {
                // Guild Kill
                postKill(kill);
           }
        }
        return kill.EventId == breaker;
    });
}

async function postKill(kill){
    var killerAlliance=""
    var killerGuild="-"
    var victimAlliance =""
    var victimGuild="-"
    $('#killerName').text(kill.Killer.Name)
    if (kill.Killer.AllianceName != ""){
       killerAlliance = "["+kill.Killer.AllianceName+"] "
    }
    if (kill.Killer.GuildName != ""){
        killerGuild = kill.Killer.GuildName
     }
    if (kill.Victim.AllianceName!=""){
        victimAlliance = "["+kill.Victim.AllianceName+"] "
    }
    if (kill.Victim.GuildName != ""){
        victimGuild = kill.Victim.GuildName
     }
    $('#killerGuild').text(killerAlliance+killerGuild)
    $('#victimName').text(kill.Victim.Name)
    $('#victimGuild').text(victimAlliance+victimGuild)
    var equipSrcs=[]

    for (let [equi, detail] of Object.entries(kill.Killer.Equipment)){
       if (detail != null){
        equipSrcs.push('https://gameinfo.albiononline.com/api/gameinfo/items/'+detail.Type+'.png');
        }else{
            equipSrcs.push(' ')
        }
    }
  //  console.log(equipSrcs)
    //Equipment of Killer
    $('#killerEquipment>div>div:nth-child(1)>img').attr('src', equipSrcs[5])
    $('#killerEquipment>div>div:nth-child(2)>img').attr('src', equipSrcs[2])
    $('#killerEquipment>div>div:nth-child(3)>img').attr('src', equipSrcs[6])
    $('#killerEquipment>div>div:nth-child(4)>img').attr('src', equipSrcs[0])
    $('#killerEquipment>div>div:nth-child(5)>img').attr('src', equipSrcs[3])
    $('#killerEquipment>div>div:nth-child(6)>img').attr('src', equipSrcs[1])
    $('#killerEquipment>div>div:nth-child(7)>img').attr('src', equipSrcs[9])
    $('#killerEquipment>div>div:nth-child(8)>img').attr('src', equipSrcs[4])
    $('#killerEquipment>div>div:nth-child(9)>img').attr('src', equipSrcs[8])
    $('#killerEquipment>div>div:nth-child(10)>img').attr('src', equipSrcs[7])

    var equipSrcs=[]

    for (let [equi, detail] of Object.entries(kill.Victim.Equipment)){
       if (detail != null){
        equipSrcs.push('https://gameinfo.albiononline.com/api/gameinfo/items/'+detail.Type+'.png');
        }else{
            equipSrcs.push(' ')
        }
    }
    //Equipment of Victim
    $('#victimEquipment>div>div:nth-child(1)>img').attr('src', equipSrcs[5])
    $('#victimEquipment>div>div:nth-child(2)>img').attr('src', equipSrcs[2])
    $('#victimEquipment>div>div:nth-child(3)>img').attr('src', equipSrcs[6])
    $('#victimEquipment>div>div:nth-child(4)>img').attr('src', equipSrcs[0])
    $('#victimEquipment>div>div:nth-child(5)>img').attr('src', equipSrcs[3])
    $('#victimEquipment>div>div:nth-child(6)>img').attr('src', equipSrcs[1])
    $('#victimEquipment>div>div:nth-child(7)>img').attr('src', equipSrcs[9])
    $('#victimEquipment>div>div:nth-child(8)>img').attr('src', equipSrcs[4])
    $('#victimEquipment>div>div:nth-child(9)>img').attr('src', equipSrcs[8])
    $('#victimEquipment>div>div:nth-child(10)>img').attr('src', equipSrcs[7])

    if (kill.Killer.GuildName.toLowerCase()=='gostop'){
        $('#datetime').attr('class', "kill")
        
    }else{
        $('#datetime').attr('class', "dead")
    }
    $('#datetime').text(kill.TimeStamp.replace('T', " ").split('.')[0])
    



    $('#killerIP').text(String(kill.Killer.AverageItemPower).split('.')[0])
    $('#victimIP').text(String(kill.Victim.AverageItemPower).split('.')[0])


    $('.fame').text(kill.TotalVictimKillFame)
    $('.fame').text(kill.TotalVictimKillFame)
    $('.fame').text(kill.TotalVictimKillFame)
    console.log("asdf")
    //sendmsg($.html()) 
    /*
    let imag = await nodeHtmlToImage({
        html: $.html(),
        output: './output/'+kill.EventId+'.png'
      })
        .then(() => {
        console.log('The image was created successfully!')
        const attachment = new Discord.MessageAttachment('./output/'+kill.EventId+'.png', kill.EventId+'.png');
        client.channels.cache.get(`704565335210196996`).send(attachment)
    
    })
        
   
    console.log(kill.numberOfParticipants)
    if (kill.numberOfParticipants > 1){
        const participants = kill.Participants
        console.log(participants[0].Name)
        console.log(">>");
    }

    const browser = await puppeteer.launch({headless:false});            
    const page = await browser.newPage();    
    await page.setContent($.html());
    await page.screenshot({path: "./"+kill.EventId+'.png'});                                       
    await browser.close();
    //client.channels.cache.get(`704565335210196996`).send(new Discord.MessageAttachment(kill.EventId+'.png', kill.EventId+'.png'))  
    */
    run($.html(), kill.EventId)
    .catch((e)=>{console.log(e)})

    

}

async function run(a, id){    
    const browser = await puppeteer.launch({headless: true});            
    const page = await browser.newPage();    
    await page.setContent(a)
    const b64string = await page.screenshot({ encoding: "base64" });
    const buffer = await Buffer.from(b64string, "base64");
    //await page.screenshot({path: "./"+id+'.png'});                                       
    await browser.close();
    client.channels.cache.get(`704565335210196996`).send(new Discord.MessageAttachment(buffer, id+'.png'))
    //client.channels.cache.get(`704565335210196996`).send(id)  
    
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  fetchKills();

  
  // Fetch kills every 30s
  setInterval(function () {
      fetchKills();
    }, 30000);

});

client.on('message', msg => {
  if (msg.content === '핑') {
    msg.reply('퐁');
  }
});

client.login('token');
