async function userHasRow(table, userId) {
    const user = await table.findOne({ where: { userId: userId } })
    return user
}

async function createUserRow(table, userId) {
    try {
        const user = await table.create({userId: userId})
        return user
    } catch(error) {
        console.log(error)
    }
}

async function incrementPoints(table, userId, points) {
    const user = await table.increment({points: points}, { where: {userId: userId} })
    return user
}

async function incrementTime(table, userId, mins) {
    const user = await table.increment({study_time: mins}, { where: {userId: userId} })
    return user
}

module.exports = {
    userHasRow, createUserRow, incrementPoints, incrementTime
}