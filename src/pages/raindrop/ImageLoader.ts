import { ImageExportType, ImageSourceType, ImageType } from './Types'

const loadImage = (src: ImageSourceType | string, i: number) =>
  new Promise<ImageType>((resolve) => {
    if (typeof src === 'string') {
      src = {
        name: 'image' + i,
        src
      } as ImageSourceType
    }

    const img = new Image()
    const loadedImage = src as ImageType
    loadedImage.img = img
    img.addEventListener('load', () => resolve(loadedImage))
    img.src = loadedImage.src
  })

const loadImages = (images: Array<ImageSourceType | string>) =>
  Promise.all(images.map((src, i) => loadImage(src, i)))

export default function ImageLoader(images: Array<ImageSourceType | string>) {
  return new Promise<ImageExportType>((resolve) => {
    loadImages(images).then((loadedImages: ImageType[]) => {
      const r: ImageExportType = {}
      loadedImages.forEach((curImage) => {
        r[curImage.name] = {
          img: curImage.img,
          src: curImage.src
        }
      })

      resolve(r)
    })
  })
}
