import { useGlobal } from '@/lib/global'
import { useEffect, useRef, useState } from 'react'

/**
 * 加密文章校验组件
 * 校验期间锁定输入与按钮，防止重复提交：
 * 重复提交会中止上一次请求，被中止的请求返回 false，从而误报「密码错误」。
 * @param validPassword(password) => Promise<boolean>
 * @param unlocking 是否正在校验
 * @param unlockError 网络/限流等非密码错误的提示（由页面统一展示）
 */
export const ArticleLock = props => {
  const { validPassword, unlockError } = props
  const { locale } = useGlobal()
  const passwordInputRef = useRef(null)
  const submitting = useRef(false)
  const [pending, setPending] = useState(false)
  const [rejected, setRejected] = useState(false)

  const submitPassword = async () => {
    if (submitting.current) return
    const value = passwordInputRef.current?.value
    if (!value) return
    submitting.current = true
    setPending(true)
    setRejected(false)
    try {
      setRejected(!(await validPassword(value)))
    } catch {
      setRejected(true)
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  useEffect(() => {
    // 选中密码输入框并将其聚焦
    passwordInputRef.current?.focus()
  }, [])

  return <div id='container' className='w-full flex justify-center items-center h-96 '>
    <div className='text-center space-y-3'>
      <div className='font-bold dark:text-gray-300 text-black'>{locale.COMMON.ARTICLE_LOCK_TIPS}</div>
      <div className='flex mx-4'>
        <input id="password" type='password'
            disabled={pending}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void submitPassword()
              }
            }}
            ref={passwordInputRef}
            className='outline-none flex-1 min-w-0 text-sm pl-5 rounded-l transition focus:shadow-lg  font-light leading-10 bg-gray-100 dark:bg-gray-500 disabled:opacity-60'>
        </input>
        <div
            role='button'
            aria-disabled={pending}
            onClick={() => { void submitPassword() }}
            className={`flex items-center justify-center whitespace-nowrap px-4 leading-10 text-white rounded-r duration-300 select-none ${pending ? 'bg-indigo-300 cursor-wait pointer-events-none' : 'bg-indigo-500 hover:bg-indigo-400 cursor-pointer'}`} >
          <i className={pending ? 'fas fa-spinner fa-spin' : 'duration-200 fas fa-key'} />
          <span className='ml-1'>{pending ? '解锁中…' : locale.COMMON.SUBMIT}</span>
        </div>
      </div>
      <div id='tips' className='text-sm'>
        {pending && <div className='text-gray-500 dark:text-gray-400'>正在加载文章内容，请稍候…</div>}
        {!pending && rejected && !unlockError && (
          <div className='text-red-500 animate__shakeX animate__animated'>{locale.COMMON.PASSWORD_ERROR}</div>
        )}
      </div>
    </div>
  </div>
}
