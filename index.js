const ethers = require('ethers');
require('dotenv').config();
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi } = require("./artifacts/contracts/blochealth.sol/blochealth.json");
const contractInstance = new ethers.Contract(contractAddress, abi, signer);

const express = require('express');
const app = express();
app.use(express.json());

// Function to convert input data to the expected format
const convertInputRecord = (record) => {
    const diagnosisStr = JSON.stringify(record.diagnosis);
    const examinationStr = JSON.stringify(record.examination);

    const convertedRecord = {
        code: record.code,
        diagnosis: diagnosisStr,
        examination: examinationStr,
        organizationId: record.organizationId,
        patientId: record.patientId,
        _creationTime: Math.round(record._creationTime),
        _id: record._id
    };

    return convertedRecord;
};

// Function to convert output data back to the original format
const revertRecord = (record) => {
    const diagnosisObj = JSON.parse(record.diagnosis);
    const examinationObj = JSON.parse(record.examination);

    const revertedRecord = {
        code: record.code,
        diagnosis: diagnosisObj,
        examination: examinationObj,
        organizationId: record.organizationId,
        patientId: record.patientId,
        _creationTime: record._creationTime,
        _id: record._id
    };

    return revertedRecord;
};

// Function to get the last 2 blocks
const auditdata = async () => {
    const latestBlockNumber = await provider.getBlockNumber();
    const blockPromises = [];

    for (let i = 0; i < 2; i++) {
        blockPromises.push(provider.getBlock(latestBlockNumber - i));
    }

    const blocks = await Promise.all(blockPromises);
    return blocks;
};

app.get('/auditdata', async (req, res) => {
    try {
        const last2Blocks = await auditdata();
        res.send(last2Blocks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getrecord', async (req, res) => {
    try{
        const id = req.body;
        const {_id} = id;
        const record = await contractInstance.getHealthRecord(_id);
        const rec = {
            code: record[0],
            diagnosis: record[1],
            examination: record[2],
            organizationId: record[3],
            patientId: record[4],
            _creationTime: parseInt(record[5]),
            _id: record[6]
        };
        res.send(revertRecord(rec));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getpatientrecord', async (req, res) => {
    try{
        const allrecords = await contractInstance.getAllHealthRecords();
        const records = allrecords.map(record => ({
            code: record[0],
            diagnosis: (record[1]),
            examination: (record[2]),
            organizationId: record[3],
            patientId: record[4],
            _creationTime: parseInt(record[5]),
            _id: record[6]
        }));
        const revertedRecords = records.map(revertRecord);
        let responseRecord = []
        const _patientId = req.body;
        const {patientId} = _patientId;
        for (let i = 0; i < revertedRecords.length; i++){
            if (revertedRecords[i].patientId === patientId){
                responseRecord.push(revertedRecords[i]);
            }
        }
        res.send(responseRecord);
        
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getorganizationrecord', async (req, res) => {
    try{
        const allrecords = await contractInstance.getAllHealthRecords();
        const records = allrecords.map(record => ({
            code: record[0],
            diagnosis: (record[1]),
            examination: (record[2]),
            organizationId: record[3],
            patientId: record[4],
            _creationTime: parseInt(record[5]),
            _id: record[6]
        }));
        const revertedRecords = records.map(revertRecord);
        let responseRecord = []
        const _organizationId = req.body;
        const {organizationId} = _organizationId;
        for (let i = 0; i < revertedRecords.length; i++){
            if (revertedRecords[i].organizationId === organizationId){
                responseRecord.push(revertedRecords[i]);
            }
        }
        res.send(responseRecord);
        
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/patientorganizationrecord', async (req, res) => {
    try{
        const allrecords = await contractInstance.getAllHealthRecords();
        const records = allrecords.map(record => ({
            code: record[0],
            diagnosis: (record[1]),
            examination: (record[2]),
            organizationId: record[3],
            patientId: record[4],
            _creationTime: parseInt(record[5]),
            _id: record[6]
        }));
        const revertedRecords = records.map(revertRecord);
        let responseRecord = []
        const patientorgrecord = req.body;
        const {organizationId, patientId} = patientorgrecord;
        for (let i = 0; i < revertedRecords.length; i++){
            if (revertedRecords[i].organizationId === organizationId && revertedRecords[i].patientId === patientId){
                responseRecord.push(revertedRecords[i]);
            }
        } 
        res.send(responseRecord);

    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getallrecords/', async (req, res) => {
    try {
        const allRecords = await contractInstance.getAllHealthRecords();
        const records = allRecords.map(record => ({
            code: record[0],
            diagnosis: (record[1]),
            examination: (record[2]),
            organizationId: record[3],
            patientId: record[4],
            _creationTime: parseInt(record[5]),
            _id: record[6]
        }));
        console.log(records);
        res.send(records.map(revertRecord));
    } catch (error) {
        res.status(500).send(error.message);
    }
});

    app.get('/device/', async(req,res) =>{
        try {
            const name2 = "Gibson to hello world";
            console.log(name2)
            res.send(name2);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    

app.post('/createrecord', async (req, res) => {
    try {
        const convertedRecord = convertInputRecord(req.body);
        const { code, diagnosis, examination, organizationId, patientId, _creationTime, _id } = convertedRecord;
        const tx = await contractInstance.setHealthRecord(code, diagnosis, examination, organizationId, patientId,_creationTime, _id);
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/updaterecord/', async (req, res) => {
    try {
        const convertedRecord = convertInputRecord(req.body);
        const { code, diagnosis, examination, organizationId, patientId, _creationTime, _id } = convertedRecord;
        const tx = await contractInstance.updateHealthRecord(code, diagnosis, examination, organizationId, patientId, _creationTime, _id);
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/deleterecord/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const tx = await contractInstance.deleteHealthRecord(id);
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/device/', async(req,res) =>{
    try {
        const name2 = "Gibson to hello world";
        console.log(name2)
        res.send(name2);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
