'use client'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'
import { Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from 'next/link'

type Props = {}

const Navbar = (props: Props) => {
    const { setTheme } = useTheme()
  return (
    <div className='max-w-[1280px] mx-auto'>
        <div className='flex items-center py-4 gap-10 justify-between'>
            <Image src='/logo.png' width={100} height={40} alt='LOgo Image' /> 
            <Input type='text' placeholder='Search ' className='w-3/4' />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <User className='h-[1.2rem] w-[1.2rem]' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href='/signup'>SignUp</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  )
}

export default Navbar