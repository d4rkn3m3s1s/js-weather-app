const form = document.querySelector("section.top-banner form");
const input = document.querySelector(".container input");
const message = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section ul.cities");

// genelde token her requestte kullanıldığından bir storage içerisinde kullanmalısın.
// localStorage.setItem("tokenKey", "b99c3dd733d7b532e423e732f33abf88");

// ama böyle tokenı açık kullanmak doğru değil.
// (reactta => .env ya da config içerisinde tutulur)
// (javascriptte=> aes256 şifreleme algoritması var ve kullanımı Extentions.js içerisindeli ilk function gelen string ifade encrypt olurken diğer function da ise gelen string ifade decrypt olur )
// böylelikle bu key şifreleme algoritması ile tutulur. Ve bu token consolede anlamsız characterler ile görünür.
// bir kereye mahsus yapıp storageden anlamsız charları almalısın ve tekrar api key olarak set etmelisin.
// localStorage.setItem(
//   "tokenKeyEncryted",
//   EncryptStringAES("b99c3dd733d7b532e423e732f33abf88")
// );

// şifrelenmiş token key localstorageye kayıt olunur.
localStorage.setItem(
  "tokenKey",
  "TedQEZxvfj0DDPYuSmX389ROEaTvFzh4u/U4C7AVoo30zk63m9v0V4+NqgWLvQIt"
);
form.addEventListener("submit", (event) => {
  event.preventDefault(); // event dinlediğin yerde eventi prevent yapmalısın.
  getWeatherDataFromApi();
});

// Get Api Func (http methods = verbs)
const getWeatherDataFromApi = async () => {
  // genelde apiden veri çekerken async function kullanılmalı.
  const tokenKey = DecryptStringAES(localStorage.getItem("tokenKey"));
  const inputValue = input.value;
  const units = "metric";
  const lang = "tr";
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;

  const response = await fetch(url).then((response) => response.json());
  console.log(response);
  // api desc
  const { main, sys, weather, name } = response;

  const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
  // kartları create etmeden önce iki kere aynı şehri eklemesin diye kontrol yapılır.
  const cityNameSpans = list.querySelectorAll(".city span"); // listede eleman var mı diye control yapacağım
  const cityNameSpansArray = Array.from(cityNameSpans); // nodelist arraya çevrilir.
  if (cityNameSpansArray.length > 0) {
    const filteredArray = cityNameSpansArray.filter(
      (span) => span.innerText == name
    );
    if (filteredArray.length > 0) {
      message.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
      setTimeout(() => {
        message.innerText = "";
      }, 5000);
      form.reset();
      return;
    }
  }
  const createdLi = document.createElement("li"); // create new element
  createdLi.classList.add("city"); // add class in created new element
  createdLi.innerHTML = `<h2 class="city-name" data-name="${name},${
    sys.country
  }"><span>${name}</span><sup>${sys.country}</sup></h2>
                          <div class="city-temp">${Math.round(
                            main.temp
                          )}<sup>°C</sup></div>
                          <figure>
                              <img class="city-icon" src="${iconUrl}">
                              <figcaption>${weather[0].description}</figcaption>
                          </figure>`;

  // append & prepend
  // list.innerHTML += // yapmadım çünkü eklenen card sona eklenir ben başa eklensin istiyorum.
  // list.append(createdLi) // yapmadım çünkü eklenen card sona eklenir ben başa eklensin istiyorum.
  list.prepend(createdLi); //son eklenen başa gelir.
  form.reset(); // input içerisini siler
};

// capturing // childden parenti değiştirir.
createdLi.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    e.target.src = e.target.src === iconUrl ? iconUrlAWS : iconUrl;
  }
});

// bubling -> herhangi bir eticaret sitesinde cardın içinde hehangi bir yere tıkladığımda detail sayfasına gitmek bubling olayına bir örnektir.
createdLi.addEventListener("click", (e) => {
  alert(`${e.target.tagName} element is clicked!`);
  // yönlendirme
  window.location.href = "https://www.busraceval.com/";
});

// aslında img'ye tıklarım ama oradaki childden parente tüm elemanları tıklanır.
// bu olayı durdurmak için e.stopPropagation() fni kullanılır ve bublingin önünü keser.
// örneğin sıralama img > figure > li ise bublingi figurede durdurabilirim.

// x işaretine tıkkladığımda cardı silmek capturing olayıdır
// eventini çocuğuna aktarırsa (cities içerisindeki childe) buna cağturing denir.
document.querySelectorAll(".cities").addEventListener("click", (e) => {
  if (e.target.className === "remove-btn") {
    alert("clicked remove btn");
  }
});
