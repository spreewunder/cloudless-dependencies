const find = require("find");
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");


const targetPath = path.join(".","licenses_and_attributions");

function findAndParse(dependencyMap) {
    return new Promise((resolve, reject) => {
        let result = [];
        let table = new MDTable("(non-dev) Dependencies");
        find.file("package.json", path.join("./", "node_modules"), (files) => {
            console.log(files.length);
            for(let file of files) {
                const data = fs.readFileSync(file);
                const p = JSON.parse(data);
                if(dependencyMap.has(p.name+"@"+p.version)) {
                    dependencyMap.delete(p.name+"@"+p.version);
                    let info = {};
                    info.package = p.name;
                    info.license = p.license || p.licenses;
                    info.license = (typeof info.license === "object") ? JSON.stringify(info.license) : info.license;
                    info.license = info.license || "_See code repository or node modules folder for license information_";
                    info.version = p.version;
                    info.authors = [];
                    p.author ? info.authors.push(JSON.stringify(p.author)) : 0;
                    p.authors ? (Array.isArray(p.authors) ? info.authors.concat(p.authors) : info.authors.push(p.authors)) : 0;
                    p.contributors ? (Array.isArray(p.contributors) ? info.authors = info.authors.concat(p.contributors) : info.authors.push(p.contributors)) : 0;
                    p.email ? info.authors.push(p.email) : 0;
                    info.authors = info.authors.map((author) => {
                       return (typeof author === "object" ? JSON.stringify(author) : author);
                    });
                    info.repo = "-";
                    if(p.repository) {
                        info.repo = p.repository.url || p.repository || info.repo;
                    }
                    result.push(info);
                    info.authors = info.authors.length === 0 ? "_Unknown_" : info.authors;
                    table.addEntry(info.package, info.version, info.license, info.authors, info.repo);
                }
            }
            resolve(table);
        });
    });
}

function npmls() {
    return new Promise((resolve, reject) => {
        child_process.exec('npm ls --json --parseable --prod', (err, stdout, stderr) => {
            if (err){
                reject(er);
            }
            else {
                resolve(JSON.parse(stdout));
            }
        });
    })
}

function flattenDeps(packageInfo) {
    let list = [];
    if(!packageInfo || !packageInfo.dependencies) {
        return list;
    }
    else {
        const depNames = Object.keys(packageInfo.dependencies);
        for(let name of depNames) {
            list.push({
                name: name,
                version: packageInfo.dependencies[name].version
            });
            list = list.concat(flattenDeps(packageInfo.dependencies[name]));
        }
        return list;
    }
}

function listToDependencyMap(list) {
    let result = new Map();
    for(let dependency of list) {
        const key = dependency.name+"@"+dependency.version;
        result.set(key, dependency);
    }
    return result;
}

class MDTable {

    constructor(headline) {
        this._count = 0;
        //this._h = "# "+headline+"\n\n";
        this._h = "";
        this._md = "| Package | Version | License | Authors | Repository |\n --- | --- | --- | --- | --- |\n";
    }

    addEntry(pkg, ver, lic, authors, repo) {
        //this._md += `|${JSON.stringify(pkg)} |${JSON.stringify(ver)} | ${JSON.stringify(lic)} | ${JSON.stringify(authors)} | ${JSON.stringify(repo)}|\n`;
        this._md += `|${(pkg)} |${(ver)} | ${(lic)} | ${(authors)} | ${(repo)}|\n`;
        ++this._count;
    }

    toFile(name) {
        if (!fs.existsSync(targetPath)){
            fs.mkdirSync(targetPath);
        }
        const footer = `\n_NOTE:_ This project contains ${this._count} dependencies and sub*-dependencies.`;
        fs.writeFileSync(path.join(targetPath, name), (this._h+this._md+footer));
    }
}

(async () => {
    const output = await npmls();
    const deps = listToDependencyMap(flattenDeps(output));
    const result = await findAndParse(deps);
    result.toFile("licenses_and_attributions.md");
    console.log("Created dependency markdown file");
})();
