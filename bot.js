// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

const redis = require('redis');
const client = redis.createClient(9393, 'pearlfish.redistogo.com',{});

client.auth("9b64aa319d8df20b119a5dfc917e9a69"); 

class MyBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            const commands = [{ 'name' : '1', 'value' : 'antri', 'childs' : [{
                'name' : 'server',
                'value' : '33'
            },{
                'name' : 'server',
                'value' : '64'
            }] }, { 'name' : '1', 'value' : 'done', 'childs' : [{
                'name' : 'server',
                'value' : '33'
            },{
                'name' : 'server',
                'value' : '64'
            }] }];

            var text_split = context.activity.text.split(" ");
            var command = "";
            var command_additional = "";
            var servers = [];

            for(var i = 0; i < commands.length;i++){
                var z = 0;
                for(var y = 0; y < text_split.length;y++){
                    if(y == 0 && (commands[i].value.indexOf(text_split[y]) !== -1)){
                        command = commands[i].value;
                        if(commands[i].childs && commands[i].childs.length){

                            if(text_split[1]){
                                var text_split_server = text_split[1].split(",");
                                if(text_split_server.length){
                                    command_additional = " on ";
                                }
                                text_split_server.forEach(z=>{
                                    servers.push({ 'value' : z });
                                    command_additional = command_additional + " "+z;
                                });
                            }

                        }
                    }
                }
            }
            
            await context.sendActivity('User ' +context.activity.from.name +' requesting to '+command + command_additional);

            // get antrian server
            var queques = [];
            /*
            client.get('queques', function (err, data) {
                if(data != null){
                    queques = JSON.parse(data);
                    queque_servers = [];
                    for(var i = 0; i < queques.length;i++){
                        
                        if(queques[i].user_id == context.activity.id
                            && queques[i].isDeleted == false){
                                queque_servers.push(queques[i]);
                        }

                    }
                    for(var i = 0; i < servers.length;i++){
                        
                        check = true;
                        for(var z = 0; z < queque_servers.length; z++){
                            if(queque_servers[z].server_value 
                                == servers[i]){
                                    check = false;
                            }
                        }
                        if(check = true){
                            queques.push({ user_id : context.activity.id, isDeleted : false, server_value :  servers[i]});
                            client.setex('queques', 3600, JSON.stringify(queques));
                        }

                    }

                }
            }); */
            
            if(!queques.length){

                for(var i = 0; i < servers.length;i++){
                    queques.push({ user_id : context.activity.id, isDeleted : false, server_value :  servers[i]});
                    //client.setex('queques', 3600, JSON.stringify(queques));
                }

            }

            var queque_server_availiable = [];
            for(var i = 0; i < queques.length;i++){
                if(queques[i].isDeleted == false){

                    //group by servers
                    var check = true;
                    for(var z = 0 ; z < queque_server_availiable.length; z++){
                        if(queque_server_availiable[z].server_value == queques[i].server_value){
                            check = false;
                            queque_server_availiable[z].childs.push(queques[i]);
                        }
                    }
                    if(check){
                        queque_server_availiable.push({ 'server_value' : queques[i].server_value, 'childs' : [] });
                    }
                }
            }

            for(var i = 0; i < queque_server_availiable.length; i++){
                
                var queque_list = "Antrian di "+queque_server_availiable[i].server_value+": ";

                for(var z = 0; z < queque_server_availiable[i].childs.length;z++){

                    var tmp = i == 0 ? queques[i].Name : "->" + queques[i].Name;
                    queque_list = queque_list + tmp;

                }

                await context.sendActivity(queque_list);

            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Koniciwa, watasiwa!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.MyBot = MyBot;
