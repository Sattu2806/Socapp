import { Home, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Separator } from '../ui/separator'

type Props = {}

type MenuItemProps = {
    icon: React.ReactElement
    label:string
    href:string
}

const MenuItem = ({icon,label,href}: MenuItemProps) => (
    <Link href={href} className='flex items-center space-x-6 py-2 hover:text-pink-500 cursor-pointer opacity-80 hover:opacity-100'>
        {icon}
        <span>{label}</span>
    </Link>
)

const MenuOptions = (props: Props) => {
    const MenuItems = [
        {icon:<Home/>, label:'Home', href:'/'},
        {icon:<LayoutGrid/>, label:'Image-Gallery', href:'/image-galery'},
    ]
  return (
    <div className='lg:w-1/4 md:w-1/5 p-5 max-md:hidden mt-5'>
        <div className='flex flex-col'>
            {MenuItems.map((item,index) => (
                <MenuItem key={index} icon={item.icon} label={item.label} href={item.href}/>
            ))}
            <Separator className='my-4'/>
        </div>
    </div>
  )
}

export default MenuOptions