/*eslint array-callback-return:off*/

function f(x) {
  return Math.sqrt(1-(x*x))
}

var gameSource = (function(){

  var keys = ["", "points", "inside", "outside", "ratio", "ratio4"]
  var state = {}
  var canvas
  var imageData
  var data
  var ctx

  function game(canvas_el, points_el, inside_el, outside_el, ratio_el, ratio4_el) {

    canvas = canvas_el

    keys.map( (v,i) => {
      state[v] = { el: arguments[i], val: 0}
    })


    reset()

    // window.requestAnimationFrame(render);
  }

  function reset() {
    keys.map( (v) => {
      state[v].val = 0
    })

    ctx=canvas.getContext("2d");
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
    data.fill(255)

    render()
  }

  function setPixel(x, y, r, g, b) {
    let pos = ((Math.floor(y) * canvas.width) + Math.floor(x)) * 4
    data[pos + 0] = r
    data[pos + 1] = g
    data[pos + 2] = b
    data[pos + 3] = 255

  }

  function render(timestamp) {

    // update the scores
    keys.map( (v) => {
      state[v].el.innerText = state[v].val
    })

    val = Math.floor((timestamp/100)%255)


    let tries = 1000
    for (var i=0; i<tries; i++) {

      var r=g=b=0,
          x= Math.random(), y=Math.random(),
          val=f(x)

      if (val > y) {
        state.inside.val++
        g=255
      } else {
        state.outside.val++
        g=255
        b=255
      }
      setPixel(x * canvas.width,
                y * canvas.height,
                r,g,b)
    }
    state.points.val+=tries
    state.ratio.val = state.inside.val / state.points.val
    state.ratio4.val = state.ratio.val * 4

    state.ratio.val = Math.round(state.ratio.val * 100000)/100000
    state.ratio4.val = Math.round(state.ratio4.val * 100000)/100000

    ctx.putImageData(imageData, 0, 0);

    ctx.beginPath()
    ctx.strokeStyle = "red"
    ctx.lineWidth = 3

    ctx.moveTo(0,f(0)*canvas.height)
    for (var x=1; x<=canvas.width; x++) {
      var y=f(x/canvas.width) * canvas.height;
      ctx.lineTo(x,y)
    }
    ctx.stroke()

    window.requestAnimationFrame(render);
  }

  game.prototype.state = state;
  //game.prorotype.state = reset;


  return game
}());
