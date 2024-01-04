var alreadyConnected = false;
process.on("uncaughtException", console.error);

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// client.ev.on('connection.update', async(update) => {
//   if (update.connection == 'open') {
//     alreadyConnected = true;
//   } else if (update.connection == 'close') {
//     if (global.shutoff) return process.send('close');
//     return process.send('reset');
//   }
// });

// client.ev.on('connection.update', async (update) => {
//   if (update.connection == 'open') {
//     alreadyConnected = true;
//     client.reply('6283862323152@s.whatsapp.net',{text:'Bot Online ✓'});
//   } else if (update.connection == 'close') {
//     if (global.shutoff) return eventEmitter.emit('close');
//     return eventEmitter.emit('reset');
//   }
// });

client.ev.on('connection.update', async(update) => {
  if (update.connection == 'open') {
    alreadyConnected = true;
    client.reply('6283862323152@s.whatsapp.net',{text:'Bot Online ✓'});
  } else if (update.connection == 'close') {
    if (global.shutoff) return process.send('close');
    return process.send('reset');
  }
});

client.ev.on ('creds.update', session.saveCreds);