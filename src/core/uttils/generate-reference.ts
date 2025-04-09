export const  generateReference = (suffix: string) : string => {
    // Generate a unique reference for the order
    return `${suffix}-${new Date().getTime()}`;
  }