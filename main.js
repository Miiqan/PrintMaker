// Made by Miiqan
// Print Maker
// 2023/09/11

const div = document.getElementById("editor");

document.getElementById('header-color').addEventListener('input', function(e) {
  document.getElementById('header').style.backgroundColor = e.target.value;
});

document.getElementById('left-text-color').addEventListener('input', function(e) {
  document.getElementById('leftText').style.color = e.target.value;
});

document.getElementById('background-color').addEventListener('input', function(e) {
  document.getElementById('paper').style.backgroundColor = e.target.value;
});



// The same JavaScript as before

document.getElementById('imageUpload').addEventListener('change', function(e) {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    var img = document.createElement('img');
    img.src = reader.result;
    img.className = 'resize-drag';
    document.getElementById('paper').appendChild(img);
    addInteractions(img);
  }
  if (file) {
    reader.readAsDataURL(file);
  }
});

function addInteractions(elem) {
  interact(elem)
    .draggable({
      onmove: window.dragMoveListener,
      restrict: {
        restriction: 'parent',
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      }
    })
    .resizable({
      preserveAspectRatio: true,
      edges: { left: true, right: true, bottom: true, top: true }
    })
    .on('resizemove', function(event) {
      var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

      target.style.width  = event.rect.width + 'px';
      target.style.height = event.rect.height + 'px';

      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    });
}

$('#create-box').click(function() {
  var box = $('<div class="box"></div>');
  box.css('background-color', $('#box-color').val());
  box.appendTo('#paper');
  box.draggable().resizable();
});

document.getElementById('add-line').addEventListener('click', function() {
  var line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.height = '2px';
  line.style.width = '100px';
  line.style.backgroundColor = document.getElementById('line-color').value;
  line.className = 'draggable resizable';
  document.getElementById('paper').appendChild(line);

  $('.draggable').draggable();
  $('.resizable').resizable({
    handles: 'e, w'
  });
});

function dragMoveListener(event) {
  var target = event.target,
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

$('#addText').on('click', function() {
  var text = $('#text').val();
  var size = $('#size').val();
  var color = $('#color').val();

  if (text) {
    var newText = $('<div style="color:' + color + '; font-size:' + size + 'px;">').addClass('draggable').text(text);
    $('#paper').append(newText);
    newText.draggable();
    $('#text').val('');
  }
});

document.getElementById('open').addEventListener('click', function() {
  div.removeAttribute("hidden");
  document.getElementById('open').setAttribute("hidden", "hidden");
});

document.getElementById('hide').addEventListener('click', function() {
  div.setAttribute("hidden", "hidden");
  document.getElementById('open').removeAttribute("hidden");
});

document.getElementById('background-image').addEventListener('change', function(e) {
  var reader = new FileReader();
  reader.onload = function(event) {
    document.getElementById('paper').style.backgroundImage = 'url(' + event.target.result + ')';
  }
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('issue').addEventListener('input', function(e) {
  document.getElementById('issueText').textContent = '第' + e.target.value + '号';
});

document.getElementById('titlee').addEventListener('input', function(e) {
  document.getElementById('leftText').textContent = e.target.value;
});

document.getElementById('font').addEventListener('change', function() {
  document.getElementById('leftText').style.fontFamily = this.value;
});

document.getElementById('fontSize').addEventListener('change', function() {
  document.getElementById('leftText').style.fontSize = this.value;
});

document.getElementById('month').addEventListener('input', function(e) {
  var day = document.getElementById('day').value;
  var weekday = document.getElementById('weekday').value;
  document.getElementById('dateText').textContent = e.target.value + '月' + day + '日(' + weekday + ') 発行';
});

document.getElementById('day').addEventListener('input', function(e) {
  var month = document.getElementById('month').value;
  var weekday = document.getElementById('weekday').value;
  document.getElementById('dateText').textContent = month + '月' + e.target.value + '日(' + weekday + ') 発行';
});

document.getElementById('weekday').addEventListener('input', function(e) {
  var month = document.getElementById('month').value;
  var day = document.getElementById('day').value;
  document.getElementById('dateText').textContent = month + '月' + day + '日(' + e.target.value + ') 発行';
});

async function postImageToDrive(imageUrl) {
  var formData = new FormData();
  var response = await fetch(imageUrl);
  var blob = await response.blob();
  formData.append("file", blob, "image.png");

  var scriptUrl = "https://script.google.com/macros/s/AKfycbwNcxpfMVBRV_VgtHjgykqWPjno-deu-Tko-r2TzTokGZzGG6raaIFwMwDLHU5os4Vg/exec"; // Google Apps ScriptのURLを指定
  await fetch(scriptUrl, {
    method: "POST",
    body: formData,
  });
  console.log(response)
}

document.getElementById('save').addEventListener('click', function() {
  html2canvas(document.getElementById('paper'), {
    onrendered: function(canvas) {
      var img = canvas.toDataURL("image/png");
      postImageToDrive(img);
      var link = document.createElement('a');
      link.href = img;
      var kai = document.getElementById('issue').value;
      link.download = 'Print(第' + kai + '号).png';
      link.click();
    }
  });
});