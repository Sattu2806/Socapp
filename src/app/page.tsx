import MenuOptions from '@/components/LeftSide/MenuOptions'
import MIddleComponent from '@/components/Middle/MIddleComponent'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='max-w-[1300px] mx-auto'>
      <div className='flex w-full'>
      <MenuOptions/>
      <div className='h-[90vh] overflow-y-auto lg:w-2/4 md:w-3/5 py-5 mx-4 px-4'>
      <MIddleComponent/>
      </div>
      </div>
    </div>
  )
}
