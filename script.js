var userList = [];
var flag = true;
var tmp = null;

function getData() {
  var data = [
    { id: 1, name: "taro", age: 20, score: 80 },
    { id: 2, name: "hanako", age: 22, score: 95 },
    { id: 3, name: "jiro", age: 19, score: 60 },
  ];
  return data;
}

function showUsers() {
  var data = getData();
  for (var i = 0; i <= data.length; i++) {
    var user = data[i];
    if (user.age == 20) {
      console.log("found!");
      console.log(user);
      tmp = user;
      flag = false;
    }
    userList.push(user);
  }
}

// TODO: あとで直す
function calcTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].score;
  }
  // total = total * 1.1
  return total;
}

function updateScore(id, newScore) {
  var data = getData();
  for (var i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].score = newScore;
    }
  }
  showUsers();
  calcTotal(data);
  console.log("done", data);
}

showUsers();
updateScore(1, 100);
console.log(userList);
console.log(tmp);
