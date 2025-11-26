import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isMobile, loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

export default function Live2D() {
  const { theme } = useGlobal()
  const showPet = JSON.parse(siteConfig('WIDGET_PET'))

  useEffect(() => {
    if (showPet && !isMobile()) {
      loadExternalResource(
        'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js',
        'js'
      ).then(() => {
        try {
          const model = siteConfig('WIDGET_PET_MODEL')
          loadlive2d('live2d', model)
        } catch (error) {
          console.error('读取 PET 模型失败', error)
        }
      })
    }
  }, [theme])

  function handleClick() {
    const link = siteConfig('WIDGET_PET_CLICK_LINK') || 'https://q.2030777.xyz'
    window.open(link, '_blank')
  }

  if (!showPet) return <></>

  return (
    <canvas
      id='live2d'
      width='280'
      height='250'
      onClick={handleClick}
      className='cursor-grab'
      onMouseDown={e => e.target.classList.add('cursor-grabbing')}
      onMouseUp={e => e.target.classList.remove('cursor-grabbing')}
    />
  )
}
