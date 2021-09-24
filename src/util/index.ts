const uuid = ():string => {
    return (Math.random()*36).toString(36);
}

export {
    uuid
}