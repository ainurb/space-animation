var canvas = document.getElementById("canvas");

var context = canvas.getContext("2d");

var loading_screen = document.getElementById("loading");
var loaded = false;
var load_counter = 0;

var background = new Image();
var clouds = new Image();
var shadows = new Image();
var stars = new Image();
var comets = new Image();
var planets_1 = new Image();
var planets_2 = new Image();
var mask = new Image();
var astronaut = new Image();
var floaties = new Image();

var layer_list = [
  {
    image: background,
    src: "./images/layer_1_1.png",
    z_index: -2.25,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1
  },
  {
    image: clouds,
    src: "./images/layer_2_1.png",
    z_index: -2,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 0.1
  },
  {
    image: shadows,
    src: "./images/layer_3_1.png",
    z_index: -1.25,
    position: { x: 0, y: 0 },
    blend: "multiply",
    opacity: 0.75
  },
  {
    image: stars,
    src: "./images/layer_4_1.png",
    z_index: -1.25,
    position: { x: 0, y: 0 },
    // blend: "overlay",
    blend: null,
    opacity: 1
  },
  {
    image: comets,
    src: "./images/layer_5_1.png",
    z_index: -0.5,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1
  },

  {
    image: planets_1,
    src: "./images/layer_6_1.png",
    z_index: -0.3,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1
  },
  {
    image: mask,
    src: "./images/layer_8_1.png",
    z_index: 0,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1
  },
  {
    image: planets_2,
    src: "./images/layer_7_1.png",
    z_index: 0.5,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1
  },
  {
    image: astronaut,
    src: "./images/layer_9_1.png",
    z_index: 0.8,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1
  },
  {
    image: floaties,
    src: "./images/layer_10_1.png",
    z_index: 2,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 0.9
  }
];

layer_list.forEach(function(layer, index) {
  layer.image.onload = function() {
    load_counter += 1;
    if (load_counter >= layer_list.length) {
      hideLoading();
      requestAnimationFrame(drawCanvas);
    }
  };
  layer.image.src = layer.src;
});

function hideLoading() {
  loading_screen.classList.add("hidden");
}

function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  TWEEN.update();

  var rotate_x = pointer.y * -0.15 + motion.y * 1.2;
  var rotate_y = pointer.x * 0.15 + motion.x * 1.2;

  canvas.style.transform =
    "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";

  layer_list.forEach(function(layer, index) {
    layer.position = getOffset(layer);

    if (layer.blend) {
      context.globalCompositeOperation = layer.blend;
    } else {
      context.globalCompositeOperation = "normal";
    }

    context.globalAlpha = layer.opacity;
    context.drawImage(layer.image, layer.position.x, layer.position.y);
  });

  requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
  var touch_multiplier = 0.3;
  var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
  var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

  var motion_multiplier = 2.5;
  var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
  var motion_offset_y = motion.y * layer.z_index * motion_multiplier;

  var offset = {
    x: touch_offset_x + motion_offset_x,
    y: touch_offset_y + motion_offset_y
  };

  return offset;
}

//// TOUCH AND MOUSE CONTROLS ////

var moving = false;

var pointer_initial = {
  x: 0,
  y: 0
};
var pointer = {
  x: 0,
  y: 0
};

canvas.addEventListener("touchstart", pointerStart);
canvas.addEventListener("mousedown", pointerStart);

function pointerStart(event) {
  moving = true;
  if (event.type === "touchstart") {
    pointer_initial.x = event.touches[0].clientX;
    pointer_initial.y = event.touches[0].clientY;
  } else if (event.type === "mousedown") {
    pointer_initial.x = event.clientX;
    pointer_initial.y = event.clientY;
  }
}

window.addEventListener("mousemove", pointerMove);
window.addEventListener("touchmove", pointerMove);

function pointerMove(event) {
  event.preventDefault();
  if (moving === true) {
    var current_x = 0;
    var current_y = 0;

    if (event.type === "touchmove") {
      current_x = event.touches[0].clientX;
      current_y = event.touches[0].clientY;
    } else if (event.type === "mousemove") {
      current_x = event.clientX;
      current_y = event.clientY;
    }

    pointer.x = current_x - pointer_initial.x;
    pointer.y = current_y - pointer_initial.y;
  }
}

canvas.addEventListener("touchmove", function(event) {
  event.preventDefault();
});

canvas.addEventListener("mousemove", function(event) {
  event.preventDefault();
});

window.addEventListener("touchend", function(event) {
  endGesture();
});

window.addEventListener("mouseup", function(event) {
  endGesture();
});

function endGesture() {
  moving = false;

  TWEEN.removeAll();

  var pointer_tween = new TWEEN.Tween(pointer)
    .to({ x: 0, y: 0 }, 300)
    .easing(TWEEN.Easing.Back.Out)
    .start();
}

//// MOTION CONTROLS ////

var motion_initial = {
  x: null,
  y: null
};
var motion = {
  x: 0,
  y: 0
};

window.addEventListener("deviceorientation", function(event) {
  if (!motion_initial.x && !motion_initial.y) {
    motion_initial.x = event.beta;
    motion_initial.y = event.gamma;
  }

  if (window.orientation === 0) {
    motion.x = event.gamma - motion_initial.y;
    motion.y = event.beta - motion_initial.x;
  } else if (window.orientation === 90) {
    motion.x = event.beta - motion_initial.x;
    motion.y = -event.gamma + motion_initial.y;
  } else if (window.orientation === -90) {
    motion.x = -event.beta + motion_initial.x;
    motion.y = event.gamma - motion_initial.y;
  } else {
    motion.x = -event.gamma + motion_initial.y;
    motion.y = -event.beta + motion_initial.x;
  }

  var max_offset = 23;

  if (Math.abs(motion.x) > max_offset) {
    if (motion.x < 0) {
      motion.x = -max_offset;
    } else {
      motion.x = max_offset;
    }
  }
  if (Math.abs(motion.y) > max_offset) {
    if (motion.y < 0) {
      motion.y = -max_offset;
    } else {
      motion.y = max_offset;
    }
  }
});

window.addEventListener("orientationchange", function(event) {
  motion_initial.x = 0;
  motion_initial.y = 0;
});
