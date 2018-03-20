import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

const translate = require('moji-translate');

exports.makeEmoji = functions.database.ref('/chat/{chatId}').onCreate((event) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = event.data.val();
    console.log('translating', event.params.chatId, original);
    const translated = translate.translate(original.text, false);

    return admin.database()
        .ref('/chat/' + event.params.chatId)
        .once('value')
        .then(snapshot => {
            let chat = snapshot.val();
            chat.emoji = translated;
            return chat;
        })
        .then(chat => {
            return admin.database().ref('/chat/' + event.params.chatId).set(chat);
        });

});
