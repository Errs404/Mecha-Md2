(async function(){
  process.on('uncaugtException', console.log)
  try { 
  await new (require('./lib/functions.js'))().run();
} catch (e) {
  console.log({
    Error: e, path: __dirname
  })
}
})()

// try {
//   new (require('./lib/functions.js'))().run();
//   process.on('uncaugtException', console.log)
// } catch (e) {
//   console.log({
//     Error: e, path: __dirname
//   })
// }