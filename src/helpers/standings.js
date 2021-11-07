export default function generateStandings (base) {
  function winRatio (pId) {
    return [
      base[pId].wins.length,
      base[pId].wins.length + base[pId].draws.length + base[pId].losses.length
    ]
  }

  const players = { ...base }

  Object.keys(base).forEach(playerId => {
    players[playerId].points = players[playerId].wins.length * 3 + players[playerId].draws.length
    players[playerId].winRatio = winRatio(playerId)
  })

  Object.keys(base).forEach(playerId => {
    players[playerId].oppWinRatio =
      players[playerId].wins.reduce((memo, oppId) => {
        return [memo[0] + players[oppId].winRatio[0], memo[1] + players[oppId].winRatio[1]]
      }, players[playerId].draws.reduce((memo, oppId) => {
        return [memo[0] + players[oppId].winRatio[0], memo[1] + players[oppId].winRatio[1]]
      }, players[playerId].losses.reduce((memo, oppId) => {
        return [memo[0] + players[oppId].winRatio[0], memo[1] + players[oppId].winRatio[1]]
      }, [0, 0])))

    players[playerId].y = Math.floor(
      1000 * players[playerId].oppWinRatio[0] / players[playerId].oppWinRatio[1]
    )
  })

  Object.keys(base).forEach(playerId => {
    players[playerId].z =
      players[playerId].wins.reduce((memo, oppId) => {
        return [memo[0] + players[oppId].oppWinRatio[0], memo[1] + players[oppId].oppWinRatio[1]]
      }, players[playerId].draws.reduce((memo, oppId) => {
        return [memo[0] + players[oppId].oppWinRatio[0], memo[1] + players[oppId].oppWinRatio[1]]
      }, players[playerId].losses.reduce((memo, oppId) => {
        return [memo[0] + players[oppId].oppWinRatio[0], memo[1] + players[oppId].oppWinRatio[1]]
      }, [0, 0]))).reduce((wins, matches) => Math.floor(1000 * wins / matches))

    players[playerId].tiebreak =
      players[playerId].points * 1000000 + players[playerId].y * 1000 + players[playerId].z
    players[playerId].id = playerId
  })

  return Object.values(players).sort((a, b) => {
    if (a.points > b.points) return -1
    if (b.points > a.points) return 1
    if (a.tiebreak > b.tiebreak) return -1
    if (b.tiebreak > a.tiebreak) return 1
    return 0
  })
}
