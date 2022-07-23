
function getUserName(msg) {
    let userName = (msg.chat.username || "") ? msg.chat.username.toString() : ""

    if (userName === "") {
        let first_name = (msg.chat.first_name || "") ? msg.chat.first_name.toString() : ""
        let last_name = (msg.chat.last_name || "") ? msg.chat.last_name.toString() : ""
        userName = `${last_name} ${first_name}`.trim()
    }
    return userName
}

module.exports = {getUserName}