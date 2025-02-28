function createFallingImage() {
  const img = document.createElement("img");
  img.src = "/assets/images/trey-head-crop.png";
  img.classList.add("falling-image");

  img.style.left = Math.random() * window.innerWidth + "px";

  const duration = Math.random() * 3 + 4;
  const delay = Math.random() * 3;
  img.style.animation = `fall ${duration}s linear ${delay}s infinite`;

  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
    createFallingImage();
  }, (duration + delay) * 1000);
}

for (let i = 0; i < 5; i++) {
  setTimeout(createFallingImage, Math.random() * 3000);
}

document.querySelector(".logo").addEventListener("mouseenter", function () {
  const maxX = window.innerWidth - this.clientWidth;
  const maxY = window.innerHeight - this.clientHeight;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  this.style.transform = `translate(${randomX}px, ${randomY}px)`;
});

function showCreepyImage() {
  const image = ["yodel-trey-head.png"];
  const randomImage = image[Math.floor(Math.random() * image.length)];

  const img = document.createElement("img");
  img.src = `assets/images/${randomImage}`;
  img.classList.add("creepy-trey");

  document.body.appendChild(img);

  const fromLeft = Math.random() < 0.5;
  const randomY = Math.random() * (window.innerHeight - 200);

  if (fromLeft) {
    img.style.left = "-100px";
    img.style.transform = "translateX(0)";
  } else {
    img.style.right = "-100px";
    img.style.left = "auto";
    img.style.transform = "translateX(0) scaleX(-1)";
  }

  img.style.top = `${randomY}px`;

  setTimeout(() => {
    img.style.opacity = "1";
    img.style.transform = fromLeft
      ? "translateX(50px) rotate(10deg)"
      : "translateX(-50px) scaleX(-1) rotate(10deg)";
  }, 100);

  setTimeout(() => {
    img.style.opacity = "0";
    img.style.transform = fromLeft
      ? "translateX(-50px) rotate(10deg)"
      : "translateX(50px) scaleX(-1) rotate(10deg)";
    setTimeout(() => img.remove(), 1000);
  }, 2500);
}

setInterval(showCreepyImage, Math.random() * 5000 + 3000);
