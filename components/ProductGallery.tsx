'use client'

import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  dropTitle: string
  itemName: string
}

export default function ProductGallery({ images, dropTitle, itemName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative min-h-[60vh] overflow-hidden rounded-soft border-2 border-brand-black bg-brand-gray lg:min-h-[70vh]">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-xl font-black text-brand-ink-muted">
            НЕТ ФОТО
          </p>
        </div>
      </div>
    )
  }

  // Если только одно фото
  if (images.length === 1) {
    return (
      <div className="relative h-full min-h-[60vh] overflow-hidden rounded-soft border-2 border-brand-black bg-brand-gray lg:min-h-[70vh]">
        <img
          src={images[0]}
          alt={itemName}
          className="absolute inset-0 h-full w-full object-contain grayscale contrast-110"
        />
      </div>
    )
  }

  // Если 2 фото
  if (images.length === 2) {
    const otherIndex = selectedImage === 0 ? 1 : 0

    return (
      <div className="relative h-full min-h-[60vh] overflow-hidden rounded-soft border-2 border-brand-black lg:min-h-[70vh]">
        <div className="grid h-full grid-cols-2">
          {/* Левый блок — выбранное фото (цветное) */}
          <div className="relative overflow-hidden bg-brand-gray">
            <img
              src={images[selectedImage]}
              alt={`${itemName} - view ${selectedImage + 1}`}
              className="absolute inset-0 h-full w-full object-contain contrast-110 transition-opacity duration-500"
            />
          </div>

          {/* Правый блок — другое фото (grayscale) */}
          <button
            onClick={() => setSelectedImage(otherIndex)}
            className="relative overflow-hidden bg-brand-gray/30 hover:bg-brand-gray/60 transition-colors duration-300"
          >
            <img
              src={images[otherIndex]}
              alt={`${itemName} - view ${otherIndex + 1}`}
              className="absolute inset-0 h-full w-full object-cover grayscale contrast-110"
            />
          </button>
        </div>
      </div>
    )
  }

  // Если 3 фото: 1 большое слева + 2 справа
  if (images.length === 3) {
    const otherImages = images
      .map((img, idx) => ({ img, idx }))
      .filter((_, idx) => idx !== selectedImage)

    return (
      <div className="relative h-full min-h-[60vh] overflow-hidden rounded-soft border-2 border-brand-black lg:min-h-[70vh]">
        <div className="grid h-full grid-cols-3 grid-rows-2">
          {/* Левый блок — выбранное фото (занимает 2 колонки и 2 ряда) */}
          <div className="col-span-2 row-span-2 relative overflow-hidden border-r-2 border-brand-black bg-brand-gray">
            <img
              src={images[selectedImage]}
              alt={`${itemName} - view ${selectedImage + 1}`}
              className="absolute inset-0 h-full w-full object-contain contrast-110 transition-opacity duration-500"
            />
          </div>

          {/* Правые блоки — остальные фото */}
          {otherImages.map(({ img, idx }) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative overflow-hidden bg-brand-gray/30 hover:bg-brand-gray/60 transition-colors duration-300 ${
                idx === 1 ? 'border-b-2 border-brand-black' : ''
              }`}
            >
              <img
                src={img}
                alt={`${itemName} - view ${idx + 1}`}
                className="absolute inset-0 h-full w-full object-cover grayscale contrast-110"
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Если 4 фото: 1 большое слева + 3 справа (каждое 1/3 высоты)
  if (images.length === 4) {
    const otherImages = images
      .map((img, idx) => ({ img, idx }))
      .filter((_, idx) => idx !== selectedImage)

    return (
      <div className="relative h-full min-h-[60vh] overflow-hidden rounded-soft border-2 border-brand-black lg:min-h-[70vh]">
        <div className="grid h-full grid-cols-3 grid-rows-3">
          {/* Левый блок — выбранное фото (занимает 2 колонки и 3 ряда) */}
          <div className="col-span-2 row-span-3 relative overflow-hidden border-r-2 border-brand-black bg-brand-gray">
            <img
              src={images[selectedImage]}
              alt={`${itemName} - view ${selectedImage + 1}`}
              className="absolute inset-0 h-full w-full object-contain contrast-110 transition-opacity duration-500"
            />
          </div>

          {/* Правые блоки — остальные фото */}
          {otherImages.map(({ img, idx }, i) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative overflow-hidden bg-brand-gray/30 hover:bg-brand-gray/60 transition-colors duration-300 ${
                i < otherImages.length - 1 ? 'border-b-2 border-brand-black' : ''
              }`}
            >
              <img
                src={img}
                alt={`${itemName} - view ${idx + 1}`}
                className="absolute inset-0 h-full w-full object-cover grayscale contrast-110"
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Если 5 фото: 1 большое слева + 4 справа (сетка 2x2)
  const otherImages = images
    .map((img, idx) => ({ img, idx }))
    .filter((_, idx) => idx !== selectedImage)

  return (
    <div className="relative h-full min-h-[60vh] overflow-hidden rounded-soft border-2 border-brand-black lg:min-h-[70vh]">
      <div className="grid h-full grid-cols-3 grid-rows-2">
        {/* Левый блок — выбранное фото (занимает 2 колонки и 2 ряда) */}
        <div className="col-span-2 row-span-2 relative overflow-hidden border-r-2 border-brand-black bg-brand-gray">
          <img
            src={images[selectedImage]}
            alt={`${itemName} - view ${selectedImage + 1}`}
            className="absolute inset-0 h-full w-full object-contain contrast-110 transition-opacity duration-500"
          />
        </div>

        {/* Правые блоки — остальные фото в сетке 2x2 */}
        {otherImages.map(({ img, idx }, i) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`relative overflow-hidden bg-brand-gray/30 hover:bg-brand-gray/60 transition-colors duration-300 ${
              i < 2 ? 'border-b-2 border-brand-black' : ''
            } ${
              i % 2 === 0 ? 'border-r-2 border-brand-black' : ''
            }`}
          >
            <img
              src={img}
              alt={`${itemName} - view ${idx + 1}`}
              className="absolute inset-0 h-full w-full object-cover grayscale contrast-110"
            />
          </button>
        ))}
      </div>
    </div>
  )
}