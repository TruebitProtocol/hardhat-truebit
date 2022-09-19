const { default: axios } = require("axios");
const { PROCESS } = require("./enums");

const API_URL = process.env.API_URL;

const handleApiError = (err)=>{
    if(err.response){
        throw new Error(err.response.data)    
    }
    else{
        throw new Error(err);
    }
}


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
        handleApiError(err)   
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
        handleApiError(err)    
    }
}

exports.getProcesses = async () =>{
    try{
        return await axios.get(`${API_URL}/api/processes/`);
    }
    catch(err){
        handleApiError(err)    
    }
}

exports.getProcessStatus = async (processType,params) =>{
    try{
        return await axios.get(`${API_URL}/api/${processType}/status/${params.processNumber}`);
    }
    catch(err){
        handleApiError(err);   
    }
}

exports.getTasks = async (params) =>{
    try{
        return await axios.get(`${API_URL}/api/tasks`);
    }
    catch(err){
        handleApiError(err);
    }
}

exports.getTaskStatus = async (params) =>{
    try{
        return await axios.get(`${API_URL}/api/tasks/${params.taskHash}/status`);
    }
    catch(err){
        handleApiError(err);  
    }
}

exports.getTaskParameters = async (params) =>{
    try{
        return await axios.get(`${API_URL}/api/tasks/${params.taskHash}/parameters`);
    }
    catch(err){
        handleApiError(err);  
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
        handleApiError(err);    
    }
}

