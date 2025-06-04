const util = require("util");
const axios = require("axios");

async function getBinPath(execFile, executable) {
    const { stdout } = await execFile("whereis", [executable]);
    return stdout.split(": ")[1].replaceAll("\n", "");
}

async function octave(cmd) {
    const execFile = util.promisify(require('child_process').execFile);
    const { stdout } = await execFile("timeout", ["2", "firejail", "--private", "--quiet", await getBinPath(execFile, "octave-cli"), "--eval", `${cmd}`]);
    return stdout;
}

async function octaveArg(arg) {
    return await octave(arg.argumento);
}

async function pesquisarNaInternet(arg) {
    try {
        const response = await axios.post(`http://127.0.0.1:8888/search?q=${arg.argumento}&format=json`/*, {
            params: {
                q: arg.argumento,
                format: 'json',
            },
        }*/);
        const filteredResults = response.data.results.slice(0, 4).map(({ title, content }) => ({
            title,
            content,
        }));
        return JSON.stringify(filteredResults);
    }
    catch (error) {
        return "Erro!";
    }
}

module.exports = {
    getBinPath,
    octave,
    octaveArg,
    pesquisarNaInternet,
};