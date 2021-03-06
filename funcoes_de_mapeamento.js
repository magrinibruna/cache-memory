/*!< Função que dado uma tag, conjunto e wordoffset, busca a palavra correspondente (todos os bytes da palavra) */
function buscarValorNaMemoria(tag, conjunto, wordoffset) {
    /*!< Como o valor não foi encontrado na memória, deve ser levado para a cache a quantidade de bytes correspondente a palavra */
    /*!< (byte desejado + 3 bytes adjacentes) */
    let conteudoMemoria = "";
    for(let i = 0; i < TAMANHO_PALAVRA; i++) {
        let finalEndereco = adicionarZeros(QUANTIDADE_BYTEOFFSET, i.toString(2));
        conteudoMemoria = conteudoMemoria + document.getElementById(tag + conjunto + wordoffset + finalEndereco).innerHTML + " | ";
    }
    conteudoMemoria = conteudoMemoria.substring(0, conteudoMemoria.length - 2); /*!< Retirando a última barra */

    return conteudoMemoria;
}

function totalmente_associativo(memoriaCache, enderecoCompleto, wordoffset) {
    const tag = enderecoCompleto.substring(0, enderecoCompleto.length - (QUANTIDADE_BYTEOFFSET + QUANTIDADE_WORDOFFSET));
    
    /*!< Incrementando o contador da memória cache */
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) 
        if(memoriaCache[i].validade == 1)
            memoriaCache[i].contador++;
        else
            break;


    /*!< Verificando se o valor está na cache */
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) {
        if(memoriaCache[i].tag == tag) {
            memoriaCache[i].contador = 0;
            return memoriaCache;
        }
    }

    /*!< O valor não for encontrado na memória */
    let conteudoMemoria = buscarValorNaMemoria(tag, "", wordoffset);

    let posicaoMaiorContador = 0;
    /*!< Procurando uma posição livre para inserir o conteudo na memória */
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) {        
        if(memoriaCache[i].validade == 0) {
            memoriaCache[i].validade = 1;
            memoriaCache[i].conteudoMemoria = conteudoMemoria;
            memoriaCache[i].tag = tag;
            return memoriaCache;
        }
        if(memoriaCache[posicaoMaiorContador].contador < memoriaCache[i].contador)
            posicaoMaiorContador = i; /*!< Armazenando a posição de maior contador */
    }

    /*!< Se não há espaços livres, insere na posição de maior contador */
    memoriaCache[posicaoMaiorContador].validade = 1;
    memoriaCache[posicaoMaiorContador].contador = 0;
    memoriaCache[posicaoMaiorContador].conteudoMemoria = conteudoMemoria;
    memoriaCache[posicaoMaiorContador].tag = tag;

    return memoriaCache;
}

function mapeamento_direto(memoriaCache, enderecoCompleto, quantidade_set, wordoffset) {
    const indice = enderecoCompleto.substring(enderecoCompleto.length - (QUANTIDADE_BYTEOFFSET + QUANTIDADE_WORDOFFSET + quantidade_set), enderecoCompleto.length - (QUANTIDADE_BYTEOFFSET + QUANTIDADE_WORDOFFSET));
    const tag = enderecoCompleto.substring(0, enderecoCompleto.length - (QUANTIDADE_BYTEOFFSET + QUANTIDADE_WORDOFFSET + quantidade_set));

    /*!< Verificando se já existe a tag na memória */
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) {
        if(memoriaCache[i].conjunto == indice && memoriaCache[i].tag == tag) {
            return memoriaCache;
        }
    }

    /*!< Percorrendo a memória em busca da posição livre */
    let i = 0;
    while (memoriaCache[i].conjunto != indice)
        i++;

    /*!< Achou uma posição livre ou o indice para inserir o novo conteúdo*/
    memoriaCache[i].validade = 1;
    memoriaCache[i].tag = tag;
    memoriaCache[i].conjunto = indice;
    memoriaCache[i].conteudoMemoria = buscarValorNaMemoria(tag, indice, wordoffset);

    return memoriaCache;
}

function associativo_conjunto(memoriaCache, enderecoCompleto, wordoffset) {
    const conjunto = enderecoCompleto.substring(enderecoCompleto.length - (QUANTIDADE_BYTEOFFSET + QUANTIDADE_WORDOFFSET + QUANTIDADE_SET), enderecoCompleto.length - (QUANTIDADE_BYTEOFFSET + QUANTIDADE_WORDOFFSET));
    const tag = enderecoCompleto.substring(0, enderecoCompleto.length - (QUANTIDADE_BYTEOFFSET + QUANTIDADE_WORDOFFSET + QUANTIDADE_SET));

    /*!< Incrementando o contador da memória cache */
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) 
        if(memoriaCache[i].conjunto == conjunto && memoriaCache[i].validade == 1) 
            memoriaCache[i].contador++;
    
    /*!< Verificando se o valor está na cache */
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) {
        if(memoriaCache[i].conjunto == conjunto && memoriaCache[i].tag == tag) {
            memoriaCache[i].contador = 0;
            return memoriaCache;
        }
    }
    
    /*!< O valor não for encontrado na memória */
    let conteudoMemoria = buscarValorNaMemoria(tag, conjunto, wordoffset);
    
    /*!< Procurando uma posição livre para inserir o conteudo na memória */
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) {        
        if(memoriaCache[i].conjunto == conjunto && memoriaCache[i].validade == 0) {
            memoriaCache[i].validade = 1;
            memoriaCache[i].conjunto = conjunto;
            memoriaCache[i].conteudoMemoria = conteudoMemoria;
            memoriaCache[i].tag = tag;
            return memoriaCache;
        }
        
    }

    /*!< Se não há espaços livres, insere na posição de maior contador */
    let posicaoMaiorContador = 0;
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) {
        if(memoriaCache[i].conjunto == conjunto) {
            posicaoMaiorContador = i; /*!< Encontrando a primeira posição do conjunto */
            break;
        }
    }

    /*!< Encontrando a posição de maior contador */
    for(let i = 0; i < QUANTIDADE_LINHAS_NA_CACHE; i++) {
        if(memoriaCache[i].conjunto == conjunto && memoriaCache[posicaoMaiorContador].contador < memoriaCache[i].contador)
            posicaoMaiorContador = i; /*!< Armazenando a posição de maior contador */
    }
    
    memoriaCache[posicaoMaiorContador].validade = 1;
    memoriaCache[posicaoMaiorContador].contador = 0;
    memoriaCache[posicaoMaiorContador].tag = tag;
    memoriaCache[posicaoMaiorContador].conteudoMemoria = conteudoMemoria;
    
    return memoriaCache;
}