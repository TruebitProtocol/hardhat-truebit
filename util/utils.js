exports.parseBoolean = (value)=>{
    switch(value){
        case "true":
            return true;
        case "false":
            return false;
        default:
            return undefined;
    }
}

exports.parseInteger = (value)=>{
    const parsed = parseInt(value); 
    return parsed != NaN ? parsed: undefined;
}