$(document).ready(function () {
  listing();
  bsCustomFileInput.init();
});

function listing() {
  $("#cards-box").empty();
  $.ajax({
    type: "GET",
    url: "/diary?sample_give=hello",
    data: {},
    success: function (response) {
      let articles = response["articles"];
      temp_html = "";
      for (let i = 0; i < articles.length; i++) {
        let title = articles[i]["title"];
        let content = articles[i]["content"];
        let file = articles[i]["file"] || "../static/img/bg.jpg";
        let profile = articles[i]["profile"];
        let time = articles[i]["time"] || "??.??.???";
        let temp_html = `
        <div class="col-4">
          <div class="card">
            <img
              src="../${file}"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
            <img
              src="../${profile}"
              class="card-img-top img-profil"
              alt="..."
            />
              <h5 class="card-title">${title}</h5>
              <p class="card-text">
                ${content}
              </p>
              <h6 class="card-subtitle mb-2 text-muted">${time}</h6>
            </div>
          </div>
        </div>
        `;
        $("#cards-box").append(temp_html);
      }
    },
  });
}

function posting() {
  let title = $("#image-title").val();
  if (!title) {
    return alert("Anda lupa memasukan title!!");
  }
  let content = $("#image-description").val();
  if (!content) {
    return alert("Anda Lupa memasukan Konten!");
  }

  let file = $("#image").prop("files")[0];
  let profile = $("#profile").prop("files")[0];

  let form_data = new FormData();

  form_data.append("file_give", file);
  form_data.append("profile_give", profile);
  form_data.append("title_give", title);
  form_data.append("content_give", content);

  $.ajax({
    type: "POST",
    url: "/diary",
    data: form_data,
    contentType: false,
    processData: false,

    success: function (response) {
      alert(response["message"]);
      window.location.reload();
    },
  });
}
