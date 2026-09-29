const loading = document.getElementById("loading");
const pokeDetail = document.getElementById("pokeDetail");
//APIから入手したURLを取得
const getDetail = () => {
  loading.textContent = "読み込み中";
  const paramas = new URLSearchParams(window.location.search);
  const ID = paramas.get(`ID`);
  const url = `https://pokeapi.co/api/v2/pokemon/${ID}/`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      loading.textContent = "";
      const pokeImg = document.getElementById("pokeImg");
      const pokename = document.getElementById("pokename");
      const pokeID = document.getElementById("pokeID");
      const pokeTypesContainer = document.querySelector(".pokeTypes-container");
      const pokestatus = document.getElementById("pokestatus");
      const typesArray = data.types;
      pokename.innerHTML = "";
      pokeImg.src = `${data.sprites.front_default}`;
      pokename.textContent = `name:${data.name}`;
      pokeID.textContent = `ID: ${data.id}`;
      pokestatus.textContent = `weight:${data.weight} height:${data.height}`;
      for (let i = 0; i < typesArray.length; i++) {
        const pokeTypes = document.createElement("p");
        pokeTypes.textContent = `${data.types[i].type.name},`;
        pokeTypesContainer.appendChild(pokeTypes);
      }
    });
};
getDetail();
