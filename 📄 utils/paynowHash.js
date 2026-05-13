const crypto = require("crypto")

function verifyHash(data, integrationKey) {

    const receivedHash = data.hash

    // Remove hash from object
    const fields = { ...data }
    delete fields.hash

    // Sort keys alphabetically
    const sortedKeys = Object.keys(fields).sort()

    let hashString = ""

    sortedKeys.forEach(key => {
        hashString += key + "=" + fields[key] + "&"
    })

    hashString += "integrationkey=" + integrationKey

    const generatedHash = crypto
        .createHash("sha512")
        .update(hashString)
        .digest("hex")

    return generatedHash === receivedHash
}

module.exports = { verifyHash }