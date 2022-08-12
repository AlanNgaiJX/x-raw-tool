const fs = require('fs');
const a = require("./DSCF6914.json");
const b = require("./DSCF6915.json");

const obj = {}
Object.keys(a).forEach(name=>{
  if (b[name] !== a[name]) {
    obj[name] = [a[name], b[name]]
  }
})

fs.writeFileSync("./test.json", JSON.stringify(obj, null, 2));

