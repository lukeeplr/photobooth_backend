import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)
    
    if (!process.env.MONGODB_URL) {
        console.log('MONGODB_URL não encontrada')
    }
    
    if (isConnected) {
        return console.log('Já está conectado ao MongoDB')
    }
        
    try {

        await mongoose.connect(process.env.MONGODB_URL as string)
        isConnected = true
        console.log('MongoDB conectado')

    } catch (error) {
        console.log(error)
    }
}