

export const getEnv = (text:string):string => {
  return import.meta.env[text]
}

export const getEnvInt = (text:string):number => {
  return parseInt(getEnv(text))
}

export const getEnvFloat = (text:string):number => {
  return parseFloat(getEnv(text))
}