class RecintosZoo {
    static listaDeRecintos = [];
    static listaDeBiomasCompativeis = [];

    static adicionarRecinto(recinto) {
        this.listaDeRecintos.push(recinto);
    }

    constructor(numero, tamanho, populacao, biomas) {
        this.numero = numero;
        this.tamanho = tamanho;
        this.populacao = populacao || {};
        this.biomas = Array.isArray(biomas) 
            ? biomas.map(bioma => typeof bioma === 'string' ? bioma.toLowerCase() : '') 
            : [typeof biomas === 'string' ? biomas.toLowerCase() : ''];

        for (const bioma of this.biomas) {
            if (!this.constructor.listaDeBiomasCompativeis.includes(bioma)) {
                this.constructor.listaDeBiomasCompativeis.push(bioma);
            }
        }
        
        this.constructor.adicionarRecinto(this);
    }

    analisaRecintos(animal, quantidade) {
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }
    
        if (typeof animal !== 'string') {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
    
        const animalNome = animal.toLowerCase();
        const animaisValidos = Animais.listaDeAnimaisHabilitados.map(a => a.nome.toLowerCase());
    
        if (!animaisValidos.includes(animalNome)) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
    
        const animalHabilitado = Animais.listaDeAnimaisHabilitados.find(a => a.nome.toLowerCase() === animalNome);
        if (!animalHabilitado) {
            return { erro: "Animal não encontrado na lista de habilitados", recintosViaveis: null };
        }
    
        const biomasAnimal = animalHabilitado.biomas || [];
        const recintosViaveis = [];
    
        for (const recinto of RecintosZoo.listaDeRecintos) {
            const biomaCompativel = biomasAnimal.some(bioma => recinto.biomas.includes(bioma));
            if (biomaCompativel) {
                const populacaoRecinto = recinto.populacao;
                const animaisNoRecinto = Object.keys(populacaoRecinto);
                
                // Verificação para hipopótamos
                if (animalNome === 'hipopotamo') {
                    const outrosAnimaisPresentes = Object.keys(recinto.populacao).length > 0;
                    const temSavana = recinto.biomas.includes('savana');
                    const temRio = recinto.biomas.includes('rio');
                
                    // Se há outros animais no recinto e o recinto não tem ambos os biomas, continue
                    if (outrosAnimaisPresentes && !(temSavana && temRio)) {
                        continue;
                    }
                }
    
                // Verificação para macacos somente se a quantidade for 1
                if (animalNome === 'macaco' && quantidade === 1 && animaisNoRecinto.length === 0) {
                    continue;
                }
    
                const todosAnimaisSaoDaMesmaEspecie = animalHabilitado.carnivoro
                    ? animaisNoRecinto.every(anim => {
                        const animalNoRecinto = Animais.listaDeAnimaisHabilitados.find(a => a.nome.toLowerCase() === anim.toLowerCase());
                        return animalNoRecinto && animalNoRecinto.carnivoro && animalNoRecinto.nome.toLowerCase() === animalHabilitado.nome.toLowerCase();
                    })
                    : animaisNoRecinto.every(anim => {
                        const animalNoRecinto = Animais.listaDeAnimaisHabilitados.find(a => a.nome.toLowerCase() === anim.toLowerCase());
                        return animalNoRecinto && !animalNoRecinto.carnivoro;
                    });
    
                if (!todosAnimaisSaoDaMesmaEspecie) {
                    continue;
                }
    
                const tamanhoAnimal = animalHabilitado.tamanho;
                const espacoOcupado = Object.entries(populacaoRecinto).reduce((acc, [animalNoRecinto, quantidadeNoRecinto]) => {
                    const animalInfo = Animais.listaDeAnimaisHabilitados.find(a => a.nome.toLowerCase() === animalNoRecinto.toLowerCase());
                    return acc + (animalInfo ? animalInfo.tamanho * quantidadeNoRecinto : 0);
                }, 0);
    
                const espacoExtra = animaisNoRecinto.length > 0 && !animaisNoRecinto.includes(animalHabilitado.nome.toLowerCase()) ? 1 : 0;
                const espacoNecessario = tamanhoAnimal * quantidade;
                const espacoLivre = recinto.tamanho - (espacoOcupado + espacoNecessario + espacoExtra);
    
                if (espacoLivre >= 0) {
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`);
                }
            }
        }
    
        recintosViaveis.sort((a, b) => {
            const numeroA = parseInt(a.match(/\d+/)[0]);
            const numeroB = parseInt(b.match(/\d+/)[0]);
            return numeroA - numeroB;
        });
    
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
    
        return { erro: null, recintosViaveis };
    }
    
    
}



class Animais {
    static listaDeAnimaisHabilitados = [];

    constructor(nome, tamanho, biomas, carnivoro) {
        this.nome = typeof nome === 'string' ? nome.toLowerCase() : "";
        this.tamanho = tamanho;
        this.biomas = Array.isArray(biomas) 
            ? biomas.map(bioma => typeof bioma === 'string' ? bioma.toLowerCase() : '') 
            : [typeof biomas === 'string' ? biomas.toLowerCase() : ''];
        this.carnivoro = carnivoro;

        if (this.nome && !this.constructor.listaDeAnimaisHabilitados.some(a => a.nome === this.nome)) {
            this.constructor.listaDeAnimaisHabilitados.push(this);
        }
    }
}

let recinto1 = new RecintosZoo(1, 10, { "macaco": 3 }, ["savana"]);
let recinto2 = new RecintosZoo(2, 5, {}, ["floresta"]);
let recinto3 = new RecintosZoo(3, 7, { "gazela": 1 }, ["savana", "rio"]);
let recinto4 = new RecintosZoo(4, 8, {}, ["rio"]);
let recinto5 = new RecintosZoo(5, 9, { "leao": 1 }, ["savana"]);

let leao = new Animais("leao", 3, ["savana"], true);
let leopardo = new Animais("leopardo", 2, ["savana"], true);
let crocodilo = new Animais("crocodilo", 3, ["rio"], true);
let macaco = new Animais("macaco", 1, ["savana", "floresta"], false);
let gazela = new Animais("gazela", 2, ["savana"], false);
let hipopotamo = new Animais("hipopotamo", 4, ["savana", "rio", "savanaRio"], false);


export { RecintosZoo as RecintosZoo };
