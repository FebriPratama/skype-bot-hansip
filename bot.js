// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

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

            var test = "";
            var text_split = context.activity.text.split(" ");
            commands.forEach( x => {
                var i = 0;
                text_split.forEach(y=>{
                    if(i==0){

                        if(x.value.indexOf(y)){

                            if(x.childs && x.childs.length){   

                                if(text_split[1]){
                                    var text_split_server = text_split[1].split(",");
                                    text_split_server.forEach(z=>{
                                        test = test + "-" + z;
                                    });
                                }
                                
                            }
                        }

                    }
                    i++;
                });
            });
            await context.sendActivity('Ok :' + test);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.MyBot = MyBot;
