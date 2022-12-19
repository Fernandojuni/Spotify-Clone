const db = require('./db.js')


module.exports = dados = {
    findAll: async (colecao)=> {
        const firebaseData = await db.collection(colecao).get();
        let arrayData = []
        firebaseData.forEach((doc)=>{
            var data = doc.data()
            data.doc = doc.id

            arrayData.push(data)
        })
        return await Promise.all(arrayData);
    },
    findOne: async (colecao, item)=>{
        const firebaseData = await db.collection(colecao).get();
        let arrayData = []
        firebaseData.forEach((doc)=>{
            var data = doc.data()
            data.doc = doc.id

            arrayData.push(data)
        })
        await Promise.all(arrayData);
        
        let findNome = await arrayData.find(({nome})=>nome == item )
        let codigo_play = await arrayData.find(({codigo_play})=>codigo_play == item )
        let findSenha = await arrayData.find(({senha})=>senha == item )
        let findEmail = await arrayData.find(({email})=>email == item )
        if (findNome != undefined|| findNome != null) {
            return findNome
        }
        if (codigo_play != undefined|| codigo_play != null) {
            return codigo_play
        }
        if (findSenha != undefined|| findSenha != null) {
            return findSenha
        }
        if (findEmail != undefined|| findEmail != null) {
            return findEmail
        }
         
    },
    update: async(colecao, documento, dados)=>{
        await db.collection(colecao).doc(documento).update(dados);
    },
    delete: async(colecao, documento)=>{
        await db.collection(colecao).doc(documento).delete();
    },
    create: async (colecao,name,dados)=> {
        const firebaseData = db.collection(colecao).doc(name);
        await firebaseData.set(dados);
    }    
}
