
import CallToAction from '../components/CallToAction';

export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl flex justify-center items-center flex-col gap-6 p-3 '>
      <h1 className='text-3xl font-semibold'>Projects</h1>
      <p className='text-md text-gray-500'>
        Build amazing and engaging projects with Vinod.
        While you are at it, learn a lot of new things and have fun.
      </p>
      <CallToAction />
    </div>
  )
}
