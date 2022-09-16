const { default: axios } = require("axios");
const { PROCESS } = require("./enums");

const API_URL = process.env.API_URL;

exports.startProcess= async (processType,params)=>{
    try{
        if(processType != PROCESS.SOLVER && processType !=PROCESS.VERIFIER){
            throw new Error(`Invalid process type`);
        }
        return await axios.post(`${API_URL}/api/${processType}/start`,
        {
            "account":params.account,
            "test": params.test, 
            "limit": params.limit,
            "recover":params.recover,
            "price":params.price
        });
    }
    catch(err){
        throw new Error(err.response.data);
    }
}

exports.stopProcess=async (processType,params)=>{
    try{
        if(processType != PROCESS.SOLVER && processType !=PROCESS.VERIFIER){
            throw new Error(`Invalid process type`);
        }
        return await axios.post(`${API_URL}/api/${processType}/stop`,
        {
            process:params.processNumber
        });
    }
    catch(err){
        throw new Error(err.response.data);
    }
}

exports.getProcesses = async () =>{
    try{
        return await axios.get(`${API_URL}/api/processes/`);
    }
    catch(err){
        throw new Error(err.response.data);
    }
}

exports.getProcessStatus = async (processType,params) =>{
    try{
        return await axios.get(`${API_URL}/api/${processType}/status/${params.processNumber}`);
    }
    catch(err){
        throw new Error(err.response.data);
    }
}

exports.getTasks = async (params) =>{
    try{
        return await axios.get(`${API_URL}/api/tasks`);
    }
    catch(err){
        throw new Error(err);
    }
}

exports.getTaskStatus = async (params) =>{
    try{
        return await axios.get(`${API_URL}/api/tasks/${params.taskHash}`);
    }
    catch(err){
        throw new Error(err.response.data);
    }
}

exports.submitTask = async (params) =>{
    try{
        return await axios.post(`${API_URL}/api/tasks/submit`,
        {
            "account":params.account,
            "taskFile":params.taskFile
        });
    }
    catch(err){
        throw new Error(err.response.data);
    }
}

