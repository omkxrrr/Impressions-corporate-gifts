import fs from 'fs';
import path from 'path';

const TMP_DIR = path.join(process.cwd(), 'tmp', 'zip-import');

function walkDir(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = walkDir(TMP_DIR);
console.log(JSON.stringify(files.slice(0, 10), null, 2));
