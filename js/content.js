const images = [
  { src: 'img/Asset_1.svg', width: 267.02, height: 218.31 },
]

function getImage(img) {
  return `<div class="draggable-item image-box">
						<img src="${img.src}" data-image-url="https://realtimeboard.com/api/awesome-plugins/plugins/rtb_sticker_pack/${img.src}">
			</div>`
}

function addImages(container) {
  container.innerHTML += images.map((i) => getImage(i)).join('')
}

function addEmbeds(container) {
  container.innerHTML += `<div class="embed draggable-item" data-embed-html="<iframe src='https://www.embed.com/app/calculator/gray-calculator.html' style='width: 500px; height: 500px;' scrolling='no' frameBorder='0'></iframe>">calculator</div>`
  container.innerHTML += `<div class="embed draggable-item" data-embed-html='<iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJC_KG2OHG6EMRDop6uALKSps&key=AIzaSyCtbGw6ra4k5dp3-wdI1yTCgn7brcQZwTk" allowfullscreen></iframe>'>map</div>`
}

function createImage(canvasX, canvasY, url) {
  return miro.board.widgets.create({
    type: 'image',
    url: url,
    x: canvasX,
    y: canvasY,
  })
}

function createEmbed(screenX, screenY, html) {
  return miro.board.widgets.create({
    type: 'embed',
    html: html,
    x: screenX,
    y: screenY,
  })
}

function bootstrap() {
  const container = document.getElementById('container')
  addImages(container)
  addEmbeds(container)

  let currentImageUrl
  const imageOptions = {
    draggableItemSelector: 'img',
    onClick: async (targetElement) => {
      const url = targetElement.getAttribute('data-image-url')
      const widget = (await createImage(0, 0, url))[0]
      miro.board.viewport.zoomToObject(widget)
    },
    getDraggableItemPreview: (targetElement) => {
      currentImageUrl = targetElement.getAttribute('data-image-url')
      return {
        width: 100,
        height: 100,
        url: currentImageUrl,
      }
    },
    onDrop: (canvasX, canvasY) => {
      console.log('onDrop 1')
      createImage(canvasX, canvasY, currentImageUrl)
    },
  }
  miro.board.ui.initDraggableItemsContainer(container, imageOptions)

  let currentEmbedHtml
  const embedOptions = {
    draggableItemSelector: '.embed',
    onClick: async (targetElement) => {
      const html = targetElement.getAttribute('data-embed-html')
      const widget = (await createEmbed(0, 0, html))[0]
      miro.board.viewport.zoomToObject(widget)
    },
    getDraggableItemPreview: (targetElement) => {
      currentEmbedHtml = targetElement.getAttribute('data-embed-html')
      return {
        url: `data:image/svg+xml,%3Csvg width='140' height='140' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Crect stroke='null' x='0' y='0' fill='%2300000' height='140' width='140'/%3E%3C/g%3E%3C/svg%3E`,
      }
    },
    onDrop: (canvasX, canvasY) => {
      console.log('onDrop 2')
      //embed widget creation requre display XY rather than canvas XY
      miro.board.viewport.get().then(function (viewport) {
        miro.board.viewport.getScale().then(function (scale) {
          createEmbed((canvasX - viewport.x) * scale, (canvasY - viewport.y) * scale, currentEmbedHtml)
        });
      });
    },
  }
  miro.board.ui.initDraggableItemsContainer(container, embedOptions)
}

miro.onReady(bootstrap)
