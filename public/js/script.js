// Client-side JavaScript for Wanderlust

// Bootstrap tooltip initialization
document.addEventListener('DOMContentLoaded', function() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Auto-hide flash messages after 5 seconds
setTimeout(function() {
  var alerts = document.querySelectorAll('.alert');
  alerts.forEach(function(alert) {
    var bsAlert = new bootstrap.Alert(alert);
    bsAlert.close();
  });
}, 5000);

function initImagePreviews() {
  var input = document.getElementById("images");
  var section = document.getElementById("imagePreviewSection");
  var grid = document.getElementById("imagePreviewGrid");

  if (!input || !section || !grid) return;

  input.addEventListener("change", function () {
    grid.innerHTML = "";

    if (!input.files || input.files.length === 0) {
      section.classList.add("d-none");
      return;
    }

    section.classList.remove("d-none");

    Array.prototype.forEach.call(input.files, function (file) {
      if (!file.type || !file.type.startsWith("image/")) return;

      var col = document.createElement("div");
      col.className = "col-4";

      var img = document.createElement("img");
      img.className = "img-thumbnail";
      img.alt = "Selected image preview";

      var url = URL.createObjectURL(file);
      img.src = url;
      img.onload = function () {
        URL.revokeObjectURL(url);
      };

      col.appendChild(img);
      grid.appendChild(col);
    });
  });
}

document.addEventListener("DOMContentLoaded", initImagePreviews);


