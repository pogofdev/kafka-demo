const express = require('express')
const { Kafka } = require('kafkajs')
const kafka = new Kafka({
    clientId: 'my-app',
    // brokers: ['kafka:9092'],
    brokers: ['61.14.233.66:9093'],
})
const app = express();
const port = 3000
const topic = 'od-stream';
let messages = [];
async function consume() {
    // const consumer = kafka.consumer({groupId: 'test-group'});
    const consumer = kafka.consumer({groupId: 'test-group3'})

    await consumer.connect()
    await consumer.subscribe({topic: topic, fromBeginning: true})


    await consumer.run({
        autoCommit:false,
        eachMessage: async ({topic, partition, message}) => {
            try {
                console.log(message.offset)
                messages.push(message.value.toString());
                console.log({
                    value: message.value.toString(),
                })
            }catch (e) {

            }

        },
    })
}

consume();

app.get('/getMessage', (req, res) => {

    res.send(JSON.stringify(messages))
})
app.get('/sendMessage', async (req, res) => {

    const producer = kafka.producer()

    await producer.connect()
    await producer.send({
        topic: topic,
        messages: [
            { key:new Date().toString(),value: `${new Date().toString()}-> Hello KafkaJS user!` },
        ],
    })

    await producer.disconnect()
    res.send('Message Send')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
