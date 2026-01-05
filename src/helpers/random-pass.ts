function randomPass(fullName: string): string {
    const firstName = fullName.split(' ')[0]
    const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const newPass = `${firstName}${randomNumbers}`
    return newPass
}

export default randomPass;