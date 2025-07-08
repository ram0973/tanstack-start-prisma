import image404 from '@/assets/images/404.png'

export const NotFound = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <img src={image404} alt="width" height="600" />
      <p className="mt-5 text-5xl">Page Not Found</p>
      <p className="text-2xl">The page you are looking for does not exist.</p>
    </div>
  )
}
