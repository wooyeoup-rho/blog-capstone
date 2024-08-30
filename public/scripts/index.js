const rectangles = document.getElementsByClassName("rectangle");
const searchInput = document.querySelector('input[name="search"]');

function animatePress(direction) {
    $("#" + direction).addClass("rectangle-" + direction);

    setTimeout(function() {
        $("#" + direction).removeClass("rectangle-" + direction);
    }, 200);
};

$(document).on("keydown", function(event) {
    if (document.activeElement === searchInput) {
        return;
    }
    
    if (event.which === 37 || event.which === 65) {
        animatePress("left");
    } else if (event.which === 39 || event.which === 68) {
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

for (let i = 0; i < rectangles.length; i++) {
    rectangles[i].addEventListener("click", function(event) {
        nextPost();
    });
}

document.addEventListener('keydown', (event) => {
    const searchInput = document.querySelector('input[name="search"]');
    
    if (document.activeElement === searchInput) {
        return;
    }

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
    
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const action = this.getAttribute('data-action');
            form.action = action;
            form.submit();
        });
    });
});
