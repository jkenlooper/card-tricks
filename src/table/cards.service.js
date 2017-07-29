const cardList = [
  {id: '1', name: '01c', x: 30, y: 30, r: 0},
  {id: '2', name: '01d', x: 32, y: 32, r: 0},
  {id: '3', name: '01h', x: 32, y: 34, r: 0},
  {id: '4', name: '01s', x: 32, y: 36, r: 0},
  {id: '5', name: '02c', x: 32, y: 38, r: 0},
  {id: '6', name: '02d', x: 32, y: 40, r: 0},
  {id: '7', name: '02h', x: 32, y: 42, r: 0}
//   ,
//   {id: '8', name: '02s', x: 32, y: 44, r: 0},
//   {id: '9', name: '03c', x: 32, y: 46, r: 0},
//   {id: '10', name: '03d', x: 32, y: 48, r: 0},
//   {id: '11', name: '03h', x: 32, y: 50, r: 0},
//   {id: '12', name: '03s', x: 32, y: 52, r: 0},
//   {id: '13', name: '04c', x: 32, y: 54, r: 0},
//   {id: '14', name: '04d', x: 32, y: 56, r: 0},
//   {id: '15', name: '04h', x: 32, y: 58, r: 0},
//   {id: '16', name: '04s', x: 32, y: 60, r: 0},
//   {id: '17', name: '05c', x: 32, y: 62, r: 0},
//   {id: '18', name: '05d', x: 32, y: 64, r: 0},
//   {id: '19', name: '05h', x: 32, y: 66, r: 0},
//   {id: '20', name: '05s', x: 32, y: 68, r: 0},
//   {id: '21', name: '06c', x: 32, y: 70, r: 0},
//   {id: '22', name: '06d', x: 32, y: 72, r: 0},
//   {id: '23', name: '06h', x: 32, y: 74, r: 0},
//   {id: '24', name: '06s', x: 32, y: 76, r: 0},
//   {id: '25', name: '07c', x: 32, y: 78, r: 0},
//   {id: '26', name: '07d', x: 32, y: 80, r: 0},
//   {id: '27', name: '07h', x: 32, y: 82, r: 0},
//   {id: '28', name: '07s', x: 32, y: 84, r: 0},
//   {id: '29', name: '08c', x: 32, y: 86, r: 0},
//   {id: '30', name: '08d', x: 32, y: 88, r: 0},
//   {id: '31', name: '08h', x: 32, y: 90, r: 0},
//   {id: '32', name: '08s', x: 32, y: 92, r: 0},
//   {id: '33', name: '09c', x: 32, y: 94, r: 0},
//   {id: '34', name: '09d', x: 32, y: 96, r: 0},
//   {id: '35', name: '09h', x: 32, y: 98, r: 0},
//   {id: '36', name: '09s', x: 32, y: 100, r: 0},
//   {id: '37', name: '10c', x: 32, y: 102, r: 0},
//   {id: '38', name: '10d', x: 32, y: 104, r: 0},
//   {id: '39', name: '10h', x: 32, y: 106, r: 0},
//   {id: '40', name: '10s', x: 32, y: 108, r: 0},
//   {id: '41', name: '11c', x: 32, y: 110, r: 0},
//   {id: '42', name: '11d', x: 32, y: 112, r: 0},
//   {id: '43', name: '11h', x: 32, y: 114, r: 0},
//   {id: '44', name: '11s', x: 32, y: 116, r: 0},
//   {id: '45', name: '12c', x: 32, y: 118, r: 0},
//   {id: '46', name: '12d', x: 32, y: 120, r: 0},
//   {id: '47', name: '12h', x: 32, y: 122, r: 0},
//   {id: '48', name: '12s', x: 32, y: 124, r: 0},
//   {id: '49', name: '13c', x: 32, y: 126, r: 0},
//   {id: '50', name: '13d', x: 32, y: 128, r: 0},
//   {id: '51', name: '13h', x: 32, y: 130, r: 0},
//   {id: '52', name: '13s', x: 32, y: 132, r: 0},
//   {id: '53', name: 'back041', x: 32, y: 134, r: 0},
//   {id: '54', name: 'back101', x: 32, y: 136, r: 0},
//   {id: '55', name: 'back102', x: 32, y: 138, r: 0},
//   {id: '56', name: 'back111', x: 32, y: 140, r: 0},
//   {id: '57', name: 'back121', x: 32, y: 142, r: 0},
//   {id: '58', name: 'back122', x: 32, y: 144, r: 0},
//   {id: '59', name: 'back131', x: 32, y: 146, r: 0},
//   {id: '60', name: 'back132', x: 32, y: 148, r: 0},
//   {id: '61', name: 'back191', x: 32, y: 150, r: 0},
//   {id: '62', name: 'back192', x: 32, y: 152, r: 0}
]

function cardsServiceFactory () {
  const service = {
    getCardList: getCardList
  }
  console.log('cardsServiceFactory', getCardList())

  function getCardList () {
    return cardList
  }

  return service
}

export default (cardsServiceFactory)()
