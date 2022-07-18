const uuid = (uid:string):string => {
    return (Math.random()*36).toString(36).slice(2)+new Date().getTime().toString()+uid;
}


export * from './worker'
export {
    uuid
}