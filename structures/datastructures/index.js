// Initialise and insert all DS items to exports. This will become the "item array";
const fs   = require('fs');
const path = require('path');
const YAML = require('js-yaml');

var getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());
let dirs    = getDirs(__dirname);

for (let dir of dirs) {
    module.exports[dir] = [];
    let folderPath = path.join(__dirname, dir);
    fs.readdirSync(folderPath).forEach(function (file) {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            // file paths
            let filePath 	 = path.join(folderPath, file);
            let yamlFilePath = filePath.replace('.js', '.yaml');
            // load item data
            let itemDataFile = fs.readFileSync(yamlFilePath);
            let itemData 	 = YAML.safeLoad(itemDataFile);
            // initialise item object and store to exports
            module.exports[dir].push(new(require(filePath))(itemData));
        }
    });
}