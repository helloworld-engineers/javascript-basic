const img = document.getElementById("img");
const imgBtn = document.getElementById("imgBtn");
const API_URL = "https://dog.ceo/api/breeds/image/random";
const loadImg =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAACUCAMAAACgG7y2AAAAZlBMVEUAAAD///8EBATx8fHKysr8/PysrKzT09NYWFhsbGwlJSWEhITNzc3Z2dn29vY1NTW8vLxSUlKKiop9fX3n5+cRERHg4OBCQkKVlZUYGBh1dXUcHBzDw8MwMDCysrKgoKBjY2NJSUndcAUZAAADfElEQVR4nO3Z646iMBgG4H49AOV8BgUK3v9NbkFnR1d2/o0k9H1igtCYtC89gYwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwY3z4u41v7XQnhqsOdq5xlVdB8vDLHGESrX2/4vQuwKM2notouPJefsWuEJKpHy/hLS0uKizYtny89HU7lnsGOiGQgKHqcnbHpf90z6EybzAXjerTHibEiT2qSQyIupTF+6zVsKuMkaf3l/qtzRbJlYG+4UtQGmihVNDN7tOcyE2qJ7VeinHu2yH76bXbg5wphy2Ckup9b8gI5liPFQU3+nG8ZBJL83qNai9RELfnZ0fX9DTaDayVIrxNA2xWzScg3qcjW+WDLQNmhQiJK68JGZYZoCa8VW6ozhbFmUKp0YEyn9XVce34saVzXBTltGURrBtdE+WNKVaRkWYslsYPiPCYSulTUMVaRzJWIKuFLird1YfruB4tNh1JzmSnpFS3CThonolJvSShZopq80U4JOSUmpUjHjwyoXDPQ0nYQL2PZtRi0ZoE+01hgPlE71/Yuk99564HaItmO8bouSOrvY2FdHsg7ura/o5N1Pi2ybs2NDaZux9GbMnsay37IZdfLhTEpY4qjPqa6O7q6v4H/5/vr5SYmo3VP9e0jlfo0zr4b/xrC0/ND068jgZR3ti3iT9ad4FMGdqvs5bmJQocieDT1ucGXaQqZS93ANrlMdp4nuUsRsEJQu06AYePUrX/o/HVL0Pkqz1gz2l3D0RX6OM6ugvyG2R2hHf6DsltExzoCtwO+83z993z211cqLqVwb+owPV3KhmOqcpzM3J+JXzZNXT4WDvWE8X34czYrkgfV5wgepbf3DIjyg+pziFu4sw/S+2/fz4nz+9Lw7zXm1Mqw21bu0J/Ql6q/7BZor592C86GM11TuVvUkoh2C85Hi/9kIEjtF5xPEyz7Y+Fmov2C0/l51nNkTtx/Q8JZ0zgTgTXo4P3i1M8uvUMoVTu93XLPrb3yTGn2nMH2cnkk8o+r0sdNlX5sC5/cTL4zQs6Kv31hmV0UQ7f+VrBdv+nj4uu8keQXP/3gpIKajF0Mh7UHZETKpQfnL5Op7aQQeqpv2CVJfYfmgm/Nui/OJJmQsS5ycSg8NHr+6gAOzYcv3Ht5tIM79v8qAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDr/gDFxCRMRKc+XgAAAABJRU5ErkJggg==";
const getimg = () => {
  fetch(API_URL)
    .then((res) => {
      console.log(`読み込み中`);
      img.src = loadImg;
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const dataMesage = data.message;
      img.src = dataMesage;
    })
    .catch((error) => {
      console.error(`エラーが発生しました`, error);
      alert(`失敗です`);
    });
};
const windowimg = getimg();
imgBtn.addEventListener("click", () => {
  getimg();
});
