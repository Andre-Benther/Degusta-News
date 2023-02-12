  const API_KEY = "33bf3272e0c35fab8b664b72c7c9ecf5";
  
  const cityIds = [
    1816670, // Pequim, China
    1814991, // Tóquio, Japão
    2968815, // Paris, França
    2950159, // Berlim, Alemanha
    1850147, // Tóquio, Japão
    2643743, // Londres, Reino Unido
    292223, // Dubai, Emirados Árabes Unidos
    1609350, // Bangkok, Tailândia
    1835848, // Seul, Coréia do Sul
    638242, // Istambul, Turquia
    311046, // Atenas, Grécia
    2950159, // Berlim, Alemanha
    292223, // Dubai, Emirados Árabes Unidos
    2988507, // Paris, França
    1819729, // Hong Kong, China
    2950159, // Berlim, Alemanha
    6455259, // Roma, Itália
    1816670, // Pequim, China
    6359304, // Barcelona, Espanha
    2800866, // Munique, Alemanha
    2968815, // Paris, França
    5128581, // Nova Iorque, Estados Unidos
    292223, // Dubai, Emirados Árabes Unidos
    1850147, // Tóquio, Japão
    6359304, // Barcelona, Espanha
    3067696, // Praga, República Tcheca
    2988507, // Paris, França
    1816670, // Pequim, China
    1609350, // Bangkok, Tailândia
    1835848, // Seul, Coréia do Sul
    638242, // Istambul, Turquia
    1853909, // Osaka, Japão
    1850147, // Tóquio, Japão
    2643743, // Londres, Reino Unido
    2950159, // Berlim, Alemanha
    5128581, // Nova Iorque, Estados Unidos
    6359304, // Barcelona, Espanha
    2968815, // Paris, França
    1819729, // Hong Kong, China
    292223, // Dubai, Emirados Árabes Unidos
    6455259, // Roma, Itália
    1835848, // Seul, Coréia do Sul
    1816670, // Pequim, China
    2988507, // Paris, França
    1609350, // Bangkok, Tailândia
    638242, // Istambul, Turquia
    2950159, // Berlim, Alemanha
    1850147, // Tóquio, Japão
    3067696, // Praga, República Tcheca
    2800866, // Munique, Alemanha
    6455259, // Roma, Itália
    292223, // Dubai, Emirados
  ];
  
  let currentCity = 0;

const updateWeatherData = () => {
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityIds[currentCity]}&appid=${API_KEY}`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const weatherInfo = document.querySelector("#weather-info");
      
      let table = `<table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Nome da Cidade</th>
                        <th>Temperatura (K)</th>
                        <th>Pressão (hPa)</th>
                        <th>Umidade (%)</th>
                        <th>Velocidade do Vento (m/s)</th>
                        <th>Condição</th>
                      </tr>
                    </thead>
                    <tbody>`;
      
      data.list.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        table += `<tr>
                    <td>${date.toLocaleString()}</td>
                    <td>${data.city.name}</td>
                    <td>${Math.round(forecast.main.temp)}</td>
                    <td>${forecast.main.pressure}</td>
                    <td>${forecast.main.humidity}</td>
                    <td>${forecast.wind.speed}</td>
                    <td>${forecast.weather[0].description}</td>
                  </tr>`;
      });
      
      table += `</tbody></table>`;
      
      weatherInfo.innerHTML = table;
    })
    .catch((error) => {
      console.error(error);
    });

  currentCity = (currentCity + 1) % cityIds.length;
};

setInterval(updateWeatherData, 5000);
