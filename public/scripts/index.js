function animatePress(direction) {
    $("#" + direction).addClass("rectangle-" + direction);

    setTimeout(function() {
        $("#" + direction).removeClass("rectangle-" + direction);
    }, 200);
};

$(document).on("keydown", function(event) {
    if (event.which === 37 || event.which === 65) { // Left arrow key
        animatePress("left");
    } else if (event.which === 39 || event.which === 68) { // Right arrow key
        animatePress("right")
    }
});

function nextPost(elementId = event.target.id) {
    console.log(JSON.stringify({ id: elementId }));
    
    fetch("/next", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: "id",
            value: elementId,
        }),
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
        .catch(error => {
        console.error('Error:', error);
    });
}

const rectangles = document.getElementsByClassName("rectangle");

for (let i = 0; i < rectangles.length; i++) {
    rectangles[i].addEventListener("click", function(event) {
        nextPost();
    });
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
        nextPost("left");
        break;
        
      case 'ArrowRight':
      case 'd':
        nextPost("right");
        break;
  
      default:
        break;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('user-form');
    
    // Add click event listeners to dropdown links
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const action = this.getAttribute('data-action');
            form.action = action;
            form.submit();
        });
    });
});
