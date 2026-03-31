import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PhotoGallery } from './photo-gallery'

describe('PhotoGallery', () => {
  it('renders the default beach image when no pictures are provided', () => {
    render(<PhotoGallery beachName="Playa Test" pictures={[]} />)
    const img = screen.getByRole('img', { name: 'Playa Test' })
    expect(img.getAttribute('src')).toBe('/pictures/default-beach.png')
  })

  it('renders the first picture when pictures are provided', () => {
    render(
      <PhotoGallery
        beachName="Playa Test"
        pictures={['photo1.jpg', 'photo2.jpg']}
      />,
    )
    const mainImg = screen.getByAltText('Playa Test - foto 1')
    expect(mainImg.getAttribute('src')).toBe('/pictures/photo1.jpg')
  })

  it('does not render navigation buttons when there is only one picture', () => {
    render(<PhotoGallery beachName="Playa Test" pictures={['photo1.jpg']} />)
    expect(screen.queryByRole('button', { name: 'Foto anterior' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Foto siguiente' })).toBeNull()
  })

  it('renders navigation buttons when there are multiple pictures', () => {
    render(
      <PhotoGallery
        beachName="Playa Test"
        pictures={['photo1.jpg', 'photo2.jpg']}
      />,
    )
    expect(screen.getByRole('button', { name: 'Foto anterior' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Foto siguiente' })).toBeTruthy()
  })

  it('advances to the next picture when next button is clicked', () => {
    render(
      <PhotoGallery
        beachName="Playa Test"
        pictures={['photo1.jpg', 'photo2.jpg']}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Foto siguiente' }))

    const mainImg = screen.getByAltText('Playa Test - foto 2')
    expect(mainImg.getAttribute('src')).toBe('/pictures/photo2.jpg')
  })

  it('goes back to the last picture when prev is clicked from the first', () => {
    render(
      <PhotoGallery
        beachName="Playa Test"
        pictures={['photo1.jpg', 'photo2.jpg', 'photo3.jpg']}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Foto anterior' }))

    const mainImg = screen.getByAltText('Playa Test - foto 3')
    expect(mainImg.getAttribute('src')).toBe('/pictures/photo3.jpg')
  })

  it('renders thumbnail buttons for each picture', () => {
    render(
      <PhotoGallery
        beachName="Playa Test"
        pictures={['photo1.jpg', 'photo2.jpg', 'photo3.jpg']}
      />,
    )
    const thumbnails = screen.getAllByRole('tab')
    expect(thumbnails).toHaveLength(3)
  })

  it('selects a picture when its thumbnail is clicked', () => {
    render(
      <PhotoGallery
        beachName="Playa Test"
        pictures={['photo1.jpg', 'photo2.jpg']}
      />,
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Ver foto 2' }))

    const mainImg = screen.getByAltText('Playa Test - foto 2')
    expect(mainImg.getAttribute('src')).toBe('/pictures/photo2.jpg')
  })
})
