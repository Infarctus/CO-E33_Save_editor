import type { FC } from 'react'

interface InfoBannerProps {
  message: string
}

const InfoBanner: FC<InfoBannerProps> = ({ message }) => {
  return (
    <div className='infoBanner' id='infoBanner'>
      {message}
    </div>
  )
}

export default InfoBanner
