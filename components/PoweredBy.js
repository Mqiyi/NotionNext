import { siteConfig } from '@/lib/config'

export default function PoweredBy(props) {
  return (
    <div className={`inline text-sm font-serif opacity-70 ${props.className || ''}`}>
      © {new Date().getFullYear()} 梦祈亦 · 版权所有
    </div>
  )
}
